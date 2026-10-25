from datetime import date
from sqlalchemy.orm import Session
from app.models import Medicine

SAMPLE_MEDICINES = [
    {"name": "Амоксиклав", "active_substance": "Амоксициллин + Клавулановая кислота", "category": "Антибиотики", "manufacturer": "Lek (Словения)", "dosage": "875+125 мг", "release_form": "Таблетки", "price": 480.0, "stock": 45, "is_prescription": True, "expiration_date": date(2027, 4, 15)},
    {"name": "Нурофен Форте", "active_substance": "Ибупрофен", "category": "НПВП и анальгетики", "manufacturer": "Reckitt Benckiser (Великобритания)", "dosage": "400 мг", "release_form": "Таблетки", "price": 245.0, "stock": 130, "is_prescription": False, "expiration_date": date(2028, 2, 20)},
    {"name": "Детралекс", "active_substance": "Очищенная микронизированная флавоноидная фракция", "category": "Венотоники", "manufacturer": "Сервье (Франция)", "dosage": "1000 мг", "release_form": "Таблетки", "price": 1620.0, "stock": 25, "is_prescription": False, "expiration_date": date(2027, 11, 10)},
    {"name": "Метформин", "active_substance": "Метформин", "category": "Эндокринология / Диабет", "manufacturer": "Фармстандарт (Россия)", "dosage": "850 мг", "release_form": "Таблетки", "price": 140.0, "stock": 80, "is_prescription": True, "expiration_date": date(2027, 6, 30)},
    {"name": "Кардиомагнил", "active_substance": "Ацетилсалициловая кислота + Магния гидроксид", "category": "Сердечно-сосудистые", "manufacturer": "Takeda (Япония)", "dosage": "75 мг", "release_form": "Таблетки", "price": 310.0, "stock": 95, "is_prescription": False, "expiration_date": date(2028, 5, 12)},
    {"name": "Омепразол", "active_substance": "Омепразол", "category": "ЖКТ / Ингибиторы помпы", "manufacturer": "OBL Pharm (Россия)", "dosage": "20 мг", "release_form": "Капсулы", "price": 95.0, "stock": 150, "is_prescription": False, "expiration_date": date(2027, 9, 1)},
    {"name": "Лозартан", "active_substance": "Лозартан", "category": "Гипотензивные", "manufacturer": "Teva (Израиль)", "dosage": "50 мг", "release_form": "Таблетки", "price": 280.0, "stock": 60, "is_prescription": True, "expiration_date": date(2027, 8, 15)},
    {"name": "Зиртек", "active_substance": "Цетиризин", "category": "Антигистаминные", "manufacturer": "UCB Pharma (Бельгия)", "dosage": "10 мг", "release_form": "Таблетки", "price": 390.0, "stock": 70, "is_prescription": False, "expiration_date": date(2028, 3, 1)},
    {"name": "Амброксол", "active_substance": "Амброксол", "category": "От кашля и простуды", "manufacturer": "Биосинтез (Россия)", "dosage": "30 мг", "release_form": "Таблетки", "price": 65.0, "stock": 200, "is_prescription": False, "expiration_date": date(2027, 12, 10)},
    {"name": "Супракс", "active_substance": "Цефиксим", "category": "Антибиотики", "manufacturer": "Astellas (Нидерланды)", "dosage": "400 мг", "release_form": "Капсулы", "price": 890.0, "stock": 35, "is_prescription": True, "expiration_date": date(2027, 3, 20)},
    {"name": "Мирамистин", "active_substance": "Бензилдиметил-миристоиламино-пропиламмоний", "category": "Антисептики", "manufacturer": "Инфамед (Россия)", "dosage": "0.01% 150 мл", "release_form": "Раствор", "price": 460.0, "stock": 110, "is_prescription": False, "expiration_date": date(2028, 10, 1)},
    {"name": "Креон 10000", "active_substance": "Панкреатин", "category": "Пищеварительные ферменты", "manufacturer": "Abbott (Германия)", "dosage": "10000 ЕД", "release_form": "Капсулы", "price": 540.0, "stock": 85, "is_prescription": False, "expiration_date": date(2027, 7, 15)},
    {"name": "Магне B6", "active_substance": "Магния лактат + Пиридоксин", "category": "Витамины и минералы", "manufacturer": "Sanofi (Франция)", "dosage": "48 мг + 5 мг", "release_form": "Таблетки", "price": 720.0, "stock": 50, "is_prescription": False, "expiration_date": date(2027, 5, 25)},
    {"name": "Вольтарен Эмульгель", "active_substance": "Диклофенак", "category": "НПВП для наружного применения", "manufacturer": "GSK (Швейцария)", "dosage": "1% 100 г", "release_form": "Гель", "price": 630.0, "stock": 40, "is_prescription": False, "expiration_date": date(2028, 4, 1)},
    {"name": "Аторвастатин", "active_substance": "Аторвастатин", "category": "Гиполипидемические", "manufacturer": "КРКА (Словения)", "dosage": "20 мг", "release_form": "Таблетки", "price": 380.0, "stock": 75, "is_prescription": True, "expiration_date": date(2027, 9, 30)},
]

def seed_database(db: Session):
    count = db.query(Medicine).count()
    if count == 0:
        for med_data in SAMPLE_MEDICINES:
            db.add(Medicine(**med_data))
        db.commit()
