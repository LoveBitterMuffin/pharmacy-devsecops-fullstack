from datetime import date, datetime, timezone
from sqlalchemy import Boolean, Column, Date, DateTime, Float, Integer, String
from app.database import Base

class Medicine(Base):
    __tablename__ = "medicines"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False, index=True)
    active_substance = Column(String(150), nullable=False)
    category = Column(String(100), nullable=False, index=True)
    manufacturer = Column(String(120), nullable=False, index=True)
    dosage = Column(String(50), nullable=False)
    release_form = Column(String(50), nullable=False)
    price = Column(Float, nullable=False)
    stock = Column(Integer, nullable=False, default=0)
    is_prescription = Column(Boolean, nullable=False, default=False)
    expiration_date = Column(Date, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
