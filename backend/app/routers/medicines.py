from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Medicine
from app.schemas import (
    MedicineCreate,
    MedicineResponse,
    MedicineUpdate,
    PaginatedMedicinesResponse,
    PharmacyStatsResponse,
)

router = APIRouter(prefix="/api", tags=["Medicines"])

@router.get("/stats", response_model=PharmacyStatsResponse)
def get_pharmacy_stats(db: Session = Depends(get_db)):
    total_items = db.query(Medicine).count()
    if total_items == 0:
        return PharmacyStatsResponse(
            total_items=0,
            total_stock=0,
            avg_price=0.0,
            prescription_count=0,
            non_prescription_count=0,
            categories_count=0,
            manufacturers_count=0,
        )

    total_stock = db.query(func.coalesce(func.sum(Medicine.stock), 0)).scalar()
    avg_price = float(db.query(func.coalesce(func.avg(Medicine.price), 0.0)).scalar())
    rx_count = db.query(Medicine).filter(Medicine.is_prescription == True).count()
    non_rx_count = total_items - rx_count
    categories_count = db.query(func.count(func.distinct(Medicine.category))).scalar()
    manufacturers_count = db.query(func.count(func.distinct(Medicine.manufacturer))).scalar()

    return PharmacyStatsResponse(
        total_items=total_items,
        total_stock=int(total_stock),
        avg_price=round(avg_price, 2),
        prescription_count=rx_count,
        non_prescription_count=non_rx_count,
        categories_count=categories_count,
        manufacturers_count=manufacturers_count,
    )

@router.get("/categories", response_model=List[str])
def get_categories(db: Session = Depends(get_db)):
    cats = db.query(Medicine.category).distinct().order_by(Medicine.category).all()
    return [c[0] for c in cats]

@router.get("/manufacturers", response_model=List[str])
def get_manufacturers(db: Session = Depends(get_db)):
    mans = db.query(Medicine.manufacturer).distinct().order_by(Medicine.manufacturer).all()
    return [m[0] for m in mans]

@router.get("/medicines/search", response_model=List[MedicineResponse])
def search_medicines(
    q: str = Query(..., min_length=1),
    limit: int = Query(20, ge=1, le=50),
    db: Session = Depends(get_db),
):
    search_pattern = f"%{q}%"
    return db.query(Medicine).filter(
        or_(
            Medicine.name.ilike(search_pattern),
            Medicine.active_substance.ilike(search_pattern),
            Medicine.category.ilike(search_pattern),
            Medicine.manufacturer.ilike(search_pattern),
        )
    ).limit(limit).all()

@router.get("/medicines", response_model=PaginatedMedicinesResponse)
def get_medicines(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    sort_by: str = Query("id", pattern="^(id|name|price|stock|expiration_date)$"),
    order: str = Query("asc", pattern="^(asc|desc)$"),
    category: Optional[str] = None,
    manufacturer: Optional[str] = None,
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    is_prescription: Optional[bool] = None,
    in_stock_only: Optional[bool] = None,
    db: Session = Depends(get_db),
):
    query = db.query(Medicine)

    if category:
        query = query.filter(Medicine.category == category)
    if manufacturer:
        query = query.filter(Medicine.manufacturer == manufacturer)
    if min_price is not None:
        query = query.filter(Medicine.price >= min_price)
    if max_price is not None:
        query = query.filter(Medicine.price <= max_price)
    if is_prescription is not None:
        query = query.filter(Medicine.is_prescription == is_prescription)
    if in_stock_only:
        query = query.filter(Medicine.stock > 0)

    total = query.count()

    sort_column = getattr(Medicine, sort_by)
    if order == "desc":
        sort_column = sort_column.desc()
    else:
        sort_column = sort_column.asc()

    query = query.order_by(sort_column)
    items = query.offset((page - 1) * limit).limit(limit).all()

    return PaginatedMedicinesResponse(total=total, page=page, limit=limit, items=items)

@router.get("/medicines/{medicine_id}", response_model=MedicineResponse)
def get_medicine_by_id(medicine_id: int, db: Session = Depends(get_db)):
    med = db.query(Medicine).filter(Medicine.id == medicine_id).first()
    if not med:
        raise HTTPException(status_code=404, detail="Медикамент не найден")
    return med

@router.post("/medicines", response_model=MedicineResponse, status_code=status.HTTP_201_CREATED)
def create_medicine(data: MedicineCreate, db: Session = Depends(get_db)):
    med = Medicine(**data.model_dump())
    db.add(med)
    db.commit()
    db.refresh(med)
    return med

@router.put("/medicines/{medicine_id}", response_model=MedicineResponse)
def update_medicine(medicine_id: int, data: MedicineUpdate, db: Session = Depends(get_db)):
    med = db.query(Medicine).filter(Medicine.id == medicine_id).first()
    if not med:
        raise HTTPException(status_code=404, detail="Медикамент не найден")

    update_dict = data.model_dump(exclude_unset=True)
    for field, val in update_dict.items():
        setattr(med, field, val)

    db.commit()
    db.refresh(med)
    return med

@router.delete("/medicines/{medicine_id}", status_code=status.HTTP_200_OK)
def delete_medicine(medicine_id: int, db: Session = Depends(get_db)):
    med = db.query(Medicine).filter(Medicine.id == medicine_id).first()
    if not med:
        raise HTTPException(status_code=404, detail="Медикамент не найден")

    db.delete(med)
    db.commit()
    return {"message": "Препарат успешно удален", "id": medicine_id}
