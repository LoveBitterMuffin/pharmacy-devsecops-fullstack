from datetime import date, datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field

class MedicineBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=150)
    active_substance: str = Field(..., min_length=1, max_length=150)
    category: str = Field(..., min_length=1, max_length=100)
    manufacturer: str = Field(..., min_length=1, max_length=120)
    dosage: str = Field(..., min_length=1, max_length=50)
    release_form: str = Field(..., min_length=1, max_length=50)
    price: float = Field(..., gt=0)
    stock: int = Field(..., ge=0)
    is_prescription: bool = False
    expiration_date: date

class MedicineCreate(MedicineBase):
    pass

class MedicineUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=150)
    active_substance: Optional[str] = Field(None, min_length=1, max_length=150)
    category: Optional[str] = Field(None, min_length=1, max_length=100)
    manufacturer: Optional[str] = Field(None, min_length=1, max_length=120)
    dosage: Optional[str] = Field(None, min_length=1, max_length=50)
    release_form: Optional[str] = Field(None, min_length=1, max_length=50)
    price: Optional[float] = Field(None, gt=0)
    stock: Optional[int] = Field(None, ge=0)
    is_prescription: Optional[bool] = None
    expiration_date: Optional[date] = None

class MedicineResponse(MedicineBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class PaginatedMedicinesResponse(BaseModel):
    total: int
    page: int
    limit: int
    items: List[MedicineResponse]

class PharmacyStatsResponse(BaseModel):
    total_items: int
    total_stock: int
    avg_price: float
    prescription_count: int
    non_prescription_count: int
    categories_count: int
    manufacturers_count: int
