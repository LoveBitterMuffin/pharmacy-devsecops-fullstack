import pytest
from datetime import date
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base
from app.models import Medicine

TEST_DATABASE_URL = "sqlite:///:memory:"

@pytest.fixture
def db_session():
    engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

def test_create_medicine_model(db_session):
    med = Medicine(
        name="Парацетамол",
        active_substance="Парацетамол",
        category="Обезболивающие и жаропонижающие",
        manufacturer="Фармстандарт (Россия)",
        dosage="500 мг",
        release_form="Таблетки",
        price=75.50,
        stock=120,
        is_prescription=False,
        expiration_date=date(2027, 5, 1)
    )
    db_session.add(med)
    db_session.commit()
    db_session.refresh(med)

    assert med.id is not None
    assert med.name == "Парацетамол"
    assert med.price == 75.50
    assert med.is_prescription is False
    assert med.stock == 120
