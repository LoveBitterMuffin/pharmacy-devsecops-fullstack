from datetime import date
import pytest
from pydantic import ValidationError
from app.schemas import MedicineCreate, MedicineUpdate, MedicineResponse

def test_medicine_create_validation():
    valid_data = {
        "name": "Ибупрофен",
        "active_substance": "Ибупрофен",
        "category": "НПВП",
        "manufacturer": "Акрихин (Россия)",
        "dosage": "400 мг",
        "release_form": "Таблетки",
        "price": 185.0,
        "stock": 45,
        "is_prescription": False,
        "expiration_date": date(2027, 8, 1)
    }
    schema = MedicineCreate(**valid_data)
    assert schema.name == "Ибупрофен"
    assert schema.price == 185.0

def test_medicine_invalid_price():
    invalid_data = {
        "name": "Ибупрофен",
        "active_substance": "Ибупрофен",
        "category": "НПВП",
        "manufacturer": "Акрихин",
        "dosage": "400 мг",
        "release_form": "Таблетки",
        "price": -10.0,
        "stock": 5,
        "is_prescription": False,
        "expiration_date": date(2027, 8, 1)
    }
    with pytest.raises(ValidationError):
        MedicineCreate(**invalid_data)

def test_medicine_partial_update():
    update = MedicineUpdate(price=199.99, stock=50)
    assert update.price == 199.99
    assert update.name is None
