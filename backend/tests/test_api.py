import pytest
from datetime import date
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app
from app.models import Medicine

TEST_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    db.add(Medicine(
        name="Амоксициллин",
        active_substance="Амоксициллин",
        category="Антибиотики",
        manufacturer="Hemofarm (Сербия)",
        dosage="500 мг",
        release_form="Капсулы",
        price=160.0,
        stock=30,
        is_prescription=True,
        expiration_date=date(2027, 10, 1)
    ))
    db.add(Medicine(
        name="Аспирин Кардио",
        active_substance="Ацетилсалициловая кислота",
        category="Сердечно-сосудистые",
        manufacturer="Bayer (Германия)",
        dosage="100 мг",
        release_form="Таблетки",
        price=240.0,
        stock=85,
        is_prescription=False,
        expiration_date=date(2028, 1, 1)
    ))
    db.commit()
    db.close()
    yield
    Base.metadata.drop_all(bind=engine)

client = TestClient(app)

def test_get_medicines_list():
    res = client.get("/api/medicines")
    assert res.status_code == 200
    data = res.json()
    assert data["total"] == 2
    assert len(data["items"]) == 2

def test_filter_by_price_and_prescription():
    res = client.get("/api/medicines?min_price=100&max_price=200&is_prescription=true")
    assert res.status_code == 200
    data = res.json()
    assert data["total"] == 1
    assert data["items"][0]["name"] == "Амоксициллин"

def test_create_and_delete_medicine():
    new_med = {
        "name": "Супрастин",
        "active_substance": "Хлоропирамин",
        "category": "Антигистаминные",
        "manufacturer": "Egis (Венгрия)",
        "dosage": "25 мг",
        "release_form": "Таблетки",
        "price": 190.0,
        "stock": 40,
        "is_prescription": False,
        "expiration_date": "2027-12-01"
    }
    create_res = client.post("/api/medicines", json=new_med)
    assert create_res.status_code == 201
    created_id = create_res.json()["id"]

    del_res = client.delete(f"/api/medicines/{created_id}")
    assert del_res.status_code in (200, 204)

def test_search_and_stats():
    search_res = client.get("/api/medicines/search?q=Аспирин")
    assert search_res.status_code == 200
    assert len(search_res.json()) >= 1

    stats_res = client.get("/api/stats")
    assert stats_res.status_code == 200
    assert stats_res.json()["total_items"] == 2
