"""
seed_db.py  —  Populate the database with admin user, categories and products.
Runs automatically on every 'docker compose up' (after alembic upgrade head).
All operations are idempotent — safe to run multiple times.
"""
import json
import os
from dotenv import load_dotenv
from database import SessionLocal, engine
from models import Base, BlogPost, Category, Product, User
from passlib.context import CryptContext

load_dotenv()

# ─── Ensure tables exist ───────────────────────────────────────────────────────
Base.metadata.create_all(bind=engine)

db = SessionLocal()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ─────────────────────────────────────────────────────────────────────────────
# 0. ADMIN USER
# ─────────────────────────────────────────────────────────────────────────────
ADMIN_EMAIL    = os.environ.get("ADMIN_EMAIL",    "")
ADMIN_PHONE    = os.environ.get("ADMIN_PHONE",    "")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "")
ADMIN_NAME     = os.environ.get("ADMIN_NAME",     "")

# Find existing admin by phone first, then fall back to email
existing_admin = db.query(User).filter(User.phone == ADMIN_PHONE).first() if ADMIN_PHONE else None
if not existing_admin:
    existing_admin = db.query(User).filter(User.email == ADMIN_EMAIL).first()
if not existing_admin:
    hashed = pwd_context.hash(ADMIN_PASSWORD)
    db.add(User(
        name=ADMIN_NAME,
        email=ADMIN_EMAIL,
        phone=ADMIN_PHONE,
        password=hashed,
        is_admin=True,
    ))
    db.commit()
    print(f"✅ Admin user created: {ADMIN_EMAIL} / {ADMIN_PHONE}")
else:
    existing_admin.is_admin = True
    existing_admin.password = pwd_context.hash(ADMIN_PASSWORD)
    if ADMIN_PHONE and (not existing_admin.phone or existing_admin.phone.startswith('unknown_')):
        existing_admin.phone = ADMIN_PHONE
    db.commit()
    print(f"✅ Admin user verified/updated: {ADMIN_EMAIL} / {existing_admin.phone}")


# ─────────────────────────────────────────────────────────────────────────────
# 1. CATEGORIES  (merged from seed.py + frontend routes)
# ─────────────────────────────────────────────────────────────────────────────
CATEGORIES = [
    # ── Top-level ───────────────────────────────────────────────────────────
    {"slug": "furniture",   "title_ru": "Мебель",                          "title_kz": "Жиһаз",                        "img": "",  "path": "/secondpage",   "parent_slug": None},
    {"slug": "electro",     "title_ru": "Электроника и оборудование",      "title_kz": "Электроника және жабдық",      "img": "",  "path": "/electro",      "parent_slug": None},
    {"slug": "decor",       "title_ru": "Декор",                           "title_kz": "Декор",                        "img": "",  "path": "/decor",        "parent_slug": None},
    {"slug": "equipment",   "title_ru": "Оборудование",                    "title_kz": "Жабдық",                       "img": "",  "path": "/equipment",    "parent_slug": None},
    {"slug": "digital",     "title_ru": "Цифровые решения",                "title_kz": "Цифрлық шешімдер",             "img": "",  "path": "/digital",      "parent_slug": None},

    # ── Furniture subcategories ─────────────────────────────────────────────
    {"slug": "divany",      "title_ru": "Диваны",          "title_kz": "Дивандар",              "img": "/img/pagesecond/a1a32584672.png",    "path": "/secondpage/divany",       "parent_slug": "furniture"},
    {"slug": "kreslo",      "title_ru": "Кресла",          "title_kz": "Креслолар",             "img": "/img/pagesecond/738d1eff.png",       "path": "/secondpage/kreslo",       "parent_slug": "furniture"},
    {"slug": "pufy",        "title_ru": "Пуфы",            "title_kz": "Пуфтар",                "img": "/img/pagesecond/a41bcac159.png",     "path": "/secondpage/pufy",         "parent_slug": "furniture"},
    {"slug": "stellazhi",   "title_ru": "Стеллажи",        "title_kz": "Стеллаждар",            "img": "/img/pagesecond/e0f5951d3c3.png",    "path": "/secondpage/stellazhi",    "parent_slug": "furniture"},
    {"slug": "tumby",       "title_ru": "Тумбы",           "title_kz": "Тумбалар",              "img": "/img/pagesecond/4d735992.png",       "path": "/secondpage/tumby",        "parent_slug": "furniture"},
    {"slug": "stulya",      "title_ru": "Стулья",          "title_kz": "Орындықтар",            "img": "",                                   "path": "/secondpage/stulya",       "parent_slug": "furniture"},
    {"slug": "shkafy",      "title_ru": "Шкафы",           "title_kz": "Шкафтар",               "img": "",                                   "path": "/secondpage/shkafy",       "parent_slug": "furniture"},
    {"slug": "stoly",       "title_ru": "Столы",           "title_kz": "Үстелдер",              "img": "",                                   "path": "/secondpage/stoly",        "parent_slug": "furniture"},
    {"slug": "kuhnya",      "title_ru": "Кухня",           "title_kz": "Ас үй",                 "img": "",                                   "path": "/secondpage/kuhnya",       "parent_slug": "furniture"},

    # ── Стулья subcategories ────────────────────────────────────────────────
    {"slug": "shkolnye",    "title_ru": "Школьные стулья", "title_kz": "Мектеп орындықтары",   "img": "/img/pagesecond/stulya/shkolnye.png", "path": "/secondpage/stulya/shkolnye", "parent_slug": "stulya"},
    {"slug": "myagkie",     "title_ru": "Мягкие стулья",   "title_kz": "Жұмсақ орындықтар",    "img": "/img/pagesecond/stulya/myagkie.png",  "path": "/secondpage/stulya/myagkie",  "parent_slug": "stulya"},
    {"slug": "barnye",      "title_ru": "Барные стулья",   "title_kz": "Бар орындықтары",      "img": "/img/pagesecond/stulya/barnye.png",   "path": "/secondpage/stulya/barnye",   "parent_slug": "stulya"},

    # ── Шкафы subcategories ─────────────────────────────────────────────────
    {"slug": "vstroenye",   "title_ru": "Встроенные шкафы",  "title_kz": "Кіріктірілген шкафтар", "img": "/img/pagesecond/shkafy/vstroenye.png",     "path": "/secondpage/shkafy/vstroenye",   "parent_slug": "shkafy"},
    {"slug": "standartnye", "title_ru": "Стандартные шкафы", "title_kz": "Стандарт шкафтар",       "img": "/img/pagesecond/shkafy/shkaf1_standart.png", "path": "/secondpage/shkafy/standartnye", "parent_slug": "shkafy"},

    # ── Столы subcategories ─────────────────────────────────────────────────
    {"slug": "party",            "title_ru": "Парты",                       "title_kz": "Парталар",                          "img": "",  "path": "/secondpage/stoly/party",          "parent_slug": "stoly"},
    {"slug": "reception",        "title_ru": "Ресепшен",                    "title_kz": "Ресепшен",                          "img": "",  "path": "/secondpage/stoly/reception",      "parent_slug": "stoly"},
    {"slug": "spezstolytecher",  "title_ru": "Спец столы для преподавателя","title_kz": "Оқытушыларға арналған үстелдер",    "img": "",  "path": "/secondpage/stoly/spets-teacher",  "parent_slug": "stoly"},

    # ── Decor subcategories ─────────────────────────────────────────────────
    {"slug": "gos",          "title_ru": "Государственная символика", "title_kz": "Мемлекеттік рәміздер", "img": "/img/pagesecond/decor/gos/gos.jpg",          "path": "/decor/gos",          "parent_slug": "decor"},
    {"slug": "3dpanels",     "title_ru": "3D панели",                "title_kz": "3D панельдер",          "img": "/img/pagesecond/decor/3dpanels/3d.jpg",      "path": "/decor/3dpanels",     "parent_slug": "decor"},
    {"slug": "lighting",     "title_ru": "Освещение",                "title_kz": "Жарықтандыру",          "img": "/img/pagesecond/decor/lighting/light.jpg",    "path": "/decor/lighting",     "parent_slug": "decor"},
    {"slug": "peregorodki",  "title_ru": "Перегородки",              "title_kz": "Бөлімдер",              "img": "/img/pagesecond/decor/peregorodki/pere.jpg",  "path": "/decor/peregorodki",  "parent_slug": "decor"},
    {"slug": "shtory",       "title_ru": "Шторы",                    "title_kz": "Перделер",              "img": "/img/pagesecond/decor/shtory/shtory.jpg",     "path": "/decor/shtory",       "parent_slug": "decor"},
    {"slug": "rasteniya",    "title_ru": "Растения",                 "title_kz": "Өсімдіктер",            "img": "/img/pagesecond/decor/rasteniya/rast.jpg",    "path": "/decor/rasteniya",    "parent_slug": "decor"},
    {"slug": "doski",        "title_ru": "Доски",                    "title_kz": "Тақталар",              "img": "/img/pagesecond/decor/doski/doski.jpg",       "path": "/decor/doski",        "parent_slug": "decor"},

    # ── Electro subcategories ───────────────────────────────────────────────
    {"slug": "stanki",       "title_ru": "Станки",                   "title_kz": "Станоктар",              "img": "",  "path": "/electro/stanki",      "parent_slug": "electro"},
    {"slug": "computers",    "title_ru": "Компьютеры",               "title_kz": "Компьютерлер",           "img": "",  "path": "/electro/computers",   "parent_slug": "electro"},
    {"slug": "infokiosk",    "title_ru": "Инфокиоски",               "title_kz": "Инфокиосктер",            "img": "",  "path": "/electro/infokiosk",   "parent_slug": "electro"},
    {"slug": "interactive",  "title_ru": "Интерактивные панели",     "title_kz": "Интерактивті панельдер",  "img": "",  "path": "/electro/interactive", "parent_slug": "electro"},
    {"slug": "bytovaya",     "title_ru": "Бытовая техника",          "title_kz": "Тұрмыстық техника",      "img": "",  "path": "/electro/bytovaya",    "parent_slug": "electro"},
    {"slug": "printers3d",   "title_ru": "3D принтеры",              "title_kz": "3D принтерлер",          "img": "",  "path": "/electro/printers3d",  "parent_slug": "electro"},

    # ── Equipment subcategories ─────────────────────────────────────────────
    {"slug": "labdisc",      "title_ru": "Цифровая лаборатория",     "title_kz": "Цифрлық зертхана",       "img": "/img/equipment/labdisc.png",  "path": "/equipment/labdisc",  "parent_slug": "equipment"},
    {"slug": "ulab",         "title_ru": "Набор ULABS",              "title_kz": "ULABS жинағы",           "img": "/img/equipment/ulab.png",     "path": "/equipment/ulab",     "parent_slug": "equipment"},
]

inserted_cats = 0
for c in CATEGORIES:
    exists = db.query(Category).filter(Category.slug == c["slug"]).first()
    if not exists:
        db.add(Category(
            slug=c["slug"],
            title_ru=c["title_ru"],
            title_kz=c.get("title_kz", c["title_ru"]),
            img=c.get("img"),
            path=c.get("path"),
            parent_slug=c.get("parent_slug"),
        ))
        inserted_cats += 1
    else:
        for key, value in c.items():
            setattr(exists, key, value)

db.commit()
print(f"✅ Categories: {inserted_cats} inserted (rest updated)")


# ─────────────────────────────────────────────────────────────────────────────
# 2. PRODUCTS  (all categories with full color data from frontend)
# ─────────────────────────────────────────────────────────────────────────────

def _c(colors):
    """Serialize color list to JSON string for DB storage."""
    return json.dumps(colors, ensure_ascii=False) if colors else None


PRODUCTS = [
    # ══════════════════════════════════════════════════════════════════════════
    # ДИВАНЫ
    # ══════════════════════════════════════════════════════════════════════════
    {"title": "ДИВАН 1", "img": "/img/pagesecond/divany/divan1/divan1_light_gray_fabric.png",
     "description_ru": "Каркас: брус, фанера, дсп. Наполнение: ППУ синтепон. Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.",
     "material_ru": "Синтепон, велюр, пластмассовые ножки", "size": "По согласованию с заказчиком", "article": "L.Me-DI.UN.2500-01",
     "in_stock": True, "category_slug": "divany",
     "colors_json": _c([
         {"name": "Светло серый", "hex": "#D3D3D3", "img": "/img/pagesecond/divany/divan1/divan1_light_gray_fabric.png"},
         {"name": "Бежевый", "hex": "#B89A72", "img": "/img/pagesecond/divany/divan1/divan1_beige.jpeg"},
         {"name": "Темно зеленый", "hex": "#1E3B2F", "img": "/img/pagesecond/divany/divan1/divan1_dark_green.jpeg"},
         {"name": "Теплый, жженый оранжевый", "hex": "#A94F2B", "img": "/img/pagesecond/divany/divan1/divan1_warm_burnt_orange.jpeg"},
     ])},
    {"title": "ДИВАН 2", "img": "/img/pagesecond/divany/divan2/divan2_deep_teal_blue.png",
     "description_ru": "Каркас: брус, фанера, дсп. Наполнение: ППУ синтепон. Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.",
     "material_ru": "Синтепон, велюр, пластмассовые ножки", "size": "По согласованию с заказчиком", "article": "L.Me-DI.UN.2500-02",
     "in_stock": True, "category_slug": "divany",
     "colors_json": _c([
         {"name": "Глубоко, бирюзовый синий", "hex": "#1F5A70", "img": "/img/pagesecond/divany/divan2/divan2_deep_teal_blue.png"},
         {"name": "Теплый, средне оранжевый", "hex": "#D97A2B", "img": "/img/pagesecond/divany/divan2/divan2_warm_medium_orange.jpeg"},
         {"name": "Светло коричневый", "hex": "#B89472", "img": "/img/pagesecond/divany/divan2/divan2_light_brown.jpeg"},
         {"name": "Темно зеленый", "hex": "#1E3B2F", "img": "/img/pagesecond/divany/divan2/divan2_dark_green.jpeg"},
         {"name": "Средне серый", "hex": "#8A8A8A", "img": "/img/pagesecond/divany/divan2/divan2_medium_grey.jpeg"},
     ])},
    {"title": "ДИВАН 3", "img": "/img/pagesecond/divany/divan3/divan3_light_beige.png",
     "description_ru": "Каркас: брус, фанера, дсп. Наполнение: ППУ синтепон. Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.",
     "material_ru": "Синтепон, велюр, пластмассовые ножки", "size": "По согласованию с заказчиком", "article": "L.Me-DI.UN.2500-03",
     "in_stock": True, "category_slug": "divany",
     "colors_json": _c([
         {"name": "Светло бежевый", "hex": "#C8B8A8", "img": "/img/pagesecond/divany/divan3/divan3_light_beige.png"},
         {"name": "Мягко, средне серый", "hex": "#8A8F94", "img": "/img/pagesecond/divany/divan3/divan3_soft_medium_grey.jpeg"},
         {"name": "Темно зеленый", "hex": "#1E3B2F", "img": "/img/pagesecond/divany/divan3/divan3_dark_green.jpeg"},
         {"name": "Горчично желтый", "hex": "#D38B2F", "img": "/img/pagesecond/divany/divan3/divan3_mustard_yellow.jpeg"},
     ])},
    {"title": "ДИВАН 4", "img": "/img/pagesecond/divany/divan4/divan4_warm_yellow-orange.png",
     "description_ru": "Каркас: брус, фанера, дсп. Наполнение: ППУ синтепон. Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.",
     "material_ru": "Синтепон, велюр, пластмассовые ножки", "size": "По согласованию с заказчиком", "article": "L.Me-DI.UN.2500-04",
     "in_stock": True, "category_slug": "divany",
     "colors_json": _c([
         {"name": "Тепло, желто оранжевый", "hex": "#F4B63A", "img": "/img/pagesecond/divany/divan4/divan4_warm_yellow-orange.png"},
         {"name": "Теплый средне оранжевый", "hex": "#D97A2B", "img": "/img/pagesecond/divany/divan4/divan4_warm_medium_orange.jpeg"},
         {"name": "Светло коричневый", "hex": "#B89472", "img": "/img/pagesecond/divany/divan4/divan4_light_brown.jpeg"},
         {"name": "Темно зеленый", "hex": "#1E3B2F", "img": "/img/pagesecond/divany/divan4/divan4_dark_green.jpeg"},
         {"name": "Средне серый", "hex": "#8A8A8A", "img": "/img/pagesecond/divany/divan4/divan4_medium_grey.jpeg"},
     ])},
    {"title": "ДИВАН 5", "img": "/img/pagesecond/divany/divan5/divan5_light_grayish-blue.png",
     "description_ru": "Каркас: брус, фанера, дсп. Наполнение: ППУ синтепон. Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.",
     "material_ru": "Синтепон, велюр, пластмассовые ножки", "size": "По согласованию с заказчиком", "article": "L.Me-DI.UN.2500-05",
     "in_stock": True, "category_slug": "divany",
     "colors_json": _c([
         {"name": "Глубоко бирюзовый синий", "hex": "#9DBCD4", "img": "/img/pagesecond/divany/divan5/divan5_light_grayish-blue.png"},
         {"name": "Теплый средне оранжевый", "hex": "#B75E2A", "img": "/img/pagesecond/divany/divan5/divan5_warm_burnt_orange.jpeg"},
         {"name": "Светло коричневый", "hex": "#B89A76", "img": "/img/pagesecond/divany/divan5/divan5_light_beige.jpeg"},
         {"name": "Темно зеленый", "hex": "#1E3B2F", "img": "/img/pagesecond/divany/divan5/divan5_dark_green.jpeg"},
     ])},

    # ══════════════════════════════════════════════════════════════════════════
    # КРЕСЛА
    # ══════════════════════════════════════════════════════════════════════════
    {"title": "КРЕСЛО 1", "img": "/img/pagesecond/kreslo/kreslo1/kreslo1_dark_green.png",
     "description_ru": "Каркас: стеклопластик. Ткань: велюр, микро велюр, рогожка.",
     "material_ru": "Стеклопластик, велюр", "size": "Ширина 94 см, Высота 120 см, Глубина 87 см", "article": "L.Me-KR.UN.900-01",
     "in_stock": True, "category_slug": "kreslo",
     "colors_json": _c([
         {"name": "Оранжевый", "hex": "#B5522E", "img": "/img/pagesecond/kreslo/kreslo1/kreslo1_burnt_orange.jpeg"},
         {"name": "Черный", "hex": "#1C1C1C", "img": "/img/pagesecond/kreslo/kreslo1/kreslo1_black.jpeg"},
         {"name": "Тёмно-зелёный", "hex": "#1B4D3E", "img": "/img/pagesecond/kreslo/kreslo1/kreslo1_dark_green.png"},
         {"name": "Белый", "hex": "#FFFFFF", "img": "/img/pagesecond/kreslo/kreslo1/kreslo1_white.jpeg"},
     ])},
    {"title": "КРЕСЛО 2", "img": "/img/pagesecond/kreslo/kreslo2/kreslo2_rust.png",
     "description_ru": "Каркас: брус, фанера, дсп. Наполнение: ППУ синтепон. Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.",
     "material_ru": "Синтепон, велюр", "size": "По согласованию с заказчиком", "article": "L.Me-KR.UN.900-02",
     "in_stock": True, "category_slug": "kreslo",
     "colors_json": _c([
         {"name": "Коричневый", "hex": "#b24d1d", "img": "/img/pagesecond/kreslo/kreslo2/kreslo2_rust.png"},
         {"name": "Темно-синий", "hex": "#191970", "img": "/img/pagesecond/kreslo/kreslo2/kreslo2_midnight_blue.jpeg"},
         {"name": "Тёмно-зелёный", "hex": "#1B4D3E", "img": "/img/pagesecond/kreslo/kreslo2/kreslo2_dark_forest_green.jpeg"},
         {"name": "Темно-красный", "hex": "#8B0000", "img": "/img/pagesecond/kreslo/kreslo2/kreslo2_dark_red.jpeg"},
         {"name": "Ванильно-кремовый", "hex": "#FCFBF4", "img": "/img/pagesecond/kreslo/kreslo2/kreslo2_vanilla_cream.jpeg"},
     ])},
    {"title": "КРЕСЛО 3", "img": "/img/pagesecond/kreslo/kreslo3/kreslo3_arsenic.png",
     "description_ru": "Каркас: брус, фанера, дсп. Наполнение: ППУ синтепон. Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.",
     "material_ru": "Синтепон, велюр", "size": "По согласованию с заказчиком", "article": "L.Me-KR.UN.900-03",
     "in_stock": True, "category_slug": "kreslo",
     "colors_json": _c([
         {"name": "Темно-серый", "hex": "#3B444B", "img": "/img/pagesecond/kreslo/kreslo3/kreslo3_arsenic.png"},
         {"name": "Белый", "hex": "#F2F1EC", "img": "/img/pagesecond/kreslo/kreslo3/kreslo3_soft_beige.jpeg"},
         {"name": "Тёмно-зелёный", "hex": "#014421", "img": "/img/pagesecond/kreslo/kreslo3/kreslo3_deep_forest_green.jpeg"},
         {"name": "Темно-оранжевый", "hex": "#C25A3C", "img": "/img/pagesecond/kreslo/kreslo3/kreslo3_orange_rust.jpeg"},
         {"name": "Чёрный", "hex": "#000000", "img": "/img/pagesecond/kreslo/kreslo3/kreslo3_black.jpeg"},
     ])},
    {"title": "КРЕСЛО 4", "img": "/img/pagesecond/kreslo/kreslo4/kreslo4_red_brown.png",
     "description_ru": "Вращающееся сиденье, регулируемое по высоте. Каркас из мультиплекса.",
     "material_ru": "Синтепон, велюр", "size": "Ширина: 62 см, Высота: 71-80 см, Глубина: 63 см", "article": "L.Me-KR.UN.900-04",
     "in_stock": True, "category_slug": "kreslo",
     "colors_json": _c([
         {"name": "Коричневый", "hex": "#A8553F", "img": "/img/pagesecond/kreslo/kreslo4/kreslo4_red_brown.png"},
         {"name": "Черный", "hex": "#000000", "img": "/img/pagesecond/kreslo/kreslo4/kreslo4_black.jpeg"},
         {"name": "Зелёный", "hex": "#4B5320", "img": "/img/pagesecond/kreslo/kreslo4/kreslo4_army_green.jpeg"},
         {"name": "Светло-серый", "hex": "#E5E5E3", "img": "/img/pagesecond/kreslo/kreslo4/kreslo4_platinum.jpeg"},
     ])},
    {"title": "КРЕСЛО 5", "img": "/img/pagesecond/kreslo/kreslo5/kreslo5_dark_green.png",
     "description_ru": "Материал: Ткань, Металл, Пластик. Ножка из металла с эпоксидным покрытием.",
     "material_ru": "Синтепон, велюр", "size": "Длина 68.5 см, Ширина 68.5 см, Высота 104.5-115.5 см", "article": "L.Me-KR.UN.900-05",
     "in_stock": True, "category_slug": "kreslo",
     "colors_json": _c([
         {"name": "Темно-зеленый", "hex": "#445E4D", "img": "/img/pagesecond/kreslo/kreslo5/kreslo5_dark_green.png"},
         {"name": "Темно-синий", "hex": "#2D4F93", "img": "/img/pagesecond/kreslo/kreslo5/kreslo5_dark_blue.jpeg"},
         {"name": "Оранжевый", "hex": "#BE5103", "img": "/img/pagesecond/kreslo/kreslo5/kreslo5_burnt_orange.jpeg"},
         {"name": "Темно-красный", "hex": "#A01E22", "img": "/img/pagesecond/kreslo/kreslo5/kreslo5_deep_red.jpeg"},
         {"name": "Белый", "hex": "#FFFFFF", "img": "/img/pagesecond/kreslo/kreslo5/kreslo5_white.jpeg"},
     ])},
    {"title": "КРЕСЛО 6", "img": "/img/pagesecond/kreslo/kreslo6/kreslo6.png",
     "description_ru": "Материал спинки: сетка. Материал сиденья: ткань, сетка. Механизм качания: мультиблок.",
     "material_ru": "Синтепон, велюр", "size": "Высота кресла 105-116 см, Высота опоры 45 см", "article": "L.Me-KR.UN.900-06",
     "in_stock": True, "category_slug": "kreslo"},
    {"title": "КРЕСЛО 7", "img": "/img/pagesecond/kreslo/kreslo7/kreslo7_light_brown.png",
     "description_ru": "Крестовина и подлокотники — хром. Обивка: экокожа. Максимальная нагрузка: 120 кг.",
     "material_ru": "Синтепон, велюр", "size": "Высота 106 см, Ширина 42 см, Глубина 46 см", "article": "L.Me-KR.UN.900-07",
     "in_stock": True, "category_slug": "kreslo",
     "colors_json": _c([
         {"name": "Светло-коричневый", "hex": "#C5B39A", "img": "/img/pagesecond/kreslo/kreslo7/kreslo7_light_brown.png"},
         {"name": "Черный", "hex": "#000000", "img": "/img/pagesecond/kreslo/kreslo7/kreslo7_black.jpeg"},
         {"name": "Тёмно-зелёный", "hex": "#1B4D3E", "img": "/img/pagesecond/kreslo/kreslo7/kreslo7_dark_green.jpeg"},
         {"name": "Оранжевый", "hex": "#BE5103", "img": "/img/pagesecond/kreslo/kreslo7/kreslo7_orange.jpeg"},
         {"name": "Белый", "hex": "#FFFFFF", "img": "/img/pagesecond/kreslo/kreslo7/kreslo7_white.jpeg"},
     ])},
    {"title": "КРЕСЛО 8", "img": "/img/pagesecond/kreslo/kreslo8/kreslo8_black.png",
     "description_ru": "Комфортное кресло с регулировкой и мягкой обивкой, созданное для работы и отдыха.",
     "material_ru": "Синтепон, велюр", "size": "900x850x450", "article": "L.Me-KR.UN.900-08",
     "in_stock": True, "category_slug": "kreslo",
     "colors_json": _c([
         {"name": "Черный", "hex": "#000000", "img": "/img/pagesecond/kreslo/kreslo8/kreslo8_black.jpeg"},
         {"name": "Тёмно-зелёный", "hex": "#1B4D3E", "img": "/img/pagesecond/kreslo/kreslo8/kreslo8_dark_green.jpeg"},
         {"name": "Белый", "hex": "#FFFFFF", "img": "/img/pagesecond/kreslo/kreslo8/kreslo8_white.jpeg"},
     ])},

    # ══════════════════════════════════════════════════════════════════════════
    # ПУФЫ
    # ══════════════════════════════════════════════════════════════════════════
    {"title": "ПУФ 1", "img": "/img/pagesecond/pufy/puf1/puf1_grey.png",
     "description_ru": "Каркас: брус, фанера, дсп. Наполнение: ППУ синтепон. Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.",
     "material_ru": "Синтепон, велюр", "size": "По согласованию с заказчиком", "article": "L.Me-PF.UN.600-01",
     "in_stock": True, "category_slug": "pufy",
     "colors_json": _c([
         {"name": "Красный", "hex": "#95291A", "img": "/img/pagesecond/pufy/puf1/puf1_red.jpeg"},
         {"name": "Коричневый", "hex": "#5D3327", "img": "/img/pagesecond/pufy/puf1/puf1_brown.jpeg"},
         {"name": "Тёмно-зелёный", "hex": "#1B4D3E", "img": "/img/pagesecond/pufy/puf1/puf1_dark_green.jpeg"},
         {"name": "Серый", "hex": "#888888", "img": "/img/pagesecond/pufy/puf1/puf1_grey.png"},
         {"name": "Темно-синий", "hex": "#00008B", "img": "/img/pagesecond/pufy/puf1/puf1_dark_blue.jpeg"},
         {"name": "Темный хаки", "hex": "#756340", "img": "/img/pagesecond/pufy/puf1/puf1_dark_khaki.jpeg"},
     ])},
    {"title": "ПУФ 2", "img": "/img/pagesecond/pufy/puf2/puf2_pine_green.png",
     "description_ru": "Каркас: брус, фанера, дсп. Наполнение: ППУ синтепон. Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.",
     "material_ru": "Синтепон, велюр", "size": "По согласованию с заказчиком", "article": "L.Me-PF.UN.600-02",
     "in_stock": True, "category_slug": "pufy",
     "colors_json": _c([
         {"name": "Темно-красный", "hex": "#95291A", "img": "/img/pagesecond/pufy/puf2/puf2_dark_red.jpeg"},
         {"name": "Темно-коричневый", "hex": "#5D3327", "img": "/img/pagesecond/pufy/puf2/puf2_dark_brown.jpeg"},
         {"name": "Мутно-коричневый", "hex": "#846A49", "img": "/img/pagesecond/pufy/puf2/puf2_muted_brown.jpeg"},
         {"name": "Темно-синий", "hex": "#00008B", "img": "/img/pagesecond/pufy/puf2/puf2_dark_blue.jpeg"},
         {"name": "Серый", "hex": "#8A8A8A", "img": "/img/pagesecond/pufy/puf2/puf2_grey.jpeg"},
         {"name": "Хвойно-зеленый", "hex": "#1B4D42", "img": "/img/pagesecond/pufy/puf2/puf2_pine_green.png"},
     ])},
    {"title": "ПУФ 3", "img": "/img/pagesecond/pufy/puf3/puf3_golden_brown.png",
     "description_ru": "Каркас: брус, фанера, дсп. Наполнение: ППУ синтепон. Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.",
     "material_ru": "Синтепон, велюр", "size": "По согласованию с заказчиком", "article": "L.Me-PF.UN.600-03",
     "in_stock": True, "category_slug": "pufy",
     "colors_json": _c([
         {"name": "Желто-зеленый", "hex": "#CED097", "img": "/img/pagesecond/pufy/puf3/divan6_yellowish-green.jpeg"},
         {"name": "Темно-синий", "hex": "#00008B", "img": "/img/pagesecond/pufy/puf3/divan6_dark_blue.jpeg"},
         {"name": "Темно-зеленый", "hex": "#2E5E39", "img": "/img/pagesecond/pufy/puf3/divan6_hunter_green.jpeg"},
         {"name": "Темно-коричневый", "hex": "#654321", "img": "/img/pagesecond/pufy/puf3/divan6_dark_brown.jpeg"},
         {"name": "Серый", "hex": "#8A8A8A", "img": "/img/pagesecond/pufy/puf3/divan6_grey.jpeg"},
         {"name": "Красный", "hex": "#FF0000", "img": "/img/pagesecond/pufy/puf3/divan6_red.jpeg"},
         {"name": "Золотисто-коричневый", "hex": "#B67A2D", "img": "/img/pagesecond/pufy/puf3/puf3_golden_brown.png"},
     ])},
    {"title": "ПУФ 4", "img": "/img/pagesecond/pufy/puf4/puf4_blue.png",
     "description_ru": "Каркас: брус, фанера, дсп. Наполнение: ППУ синтепон. Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.",
     "material_ru": "Синтепон, велюр", "size": "По согласованию с заказчиком", "article": "L.Me-PF.UN.600-04",
     "in_stock": True, "category_slug": "pufy",
     "colors_json": _c([
         {"name": "Голубой", "hex": "#00aaff", "img": "/img/pagesecond/pufy/puf4/puf4_blue.png"},
         {"name": "Коричневый", "hex": "#964B00", "img": "/img/pagesecond/pufy/puf4/puf4_brown.jpeg"},
         {"name": "Латунный", "hex": "#A99661", "img": "/img/pagesecond/pufy/puf4/puf4_brass.jpeg"},
         {"name": "Серый", "hex": "#888888", "img": "/img/pagesecond/pufy/puf4/puf4_grey.jpeg"},
         {"name": "Хвойно-зеленый", "hex": "#1B4D42", "img": "/img/pagesecond/pufy/puf4/puf4_pine_green.jpeg"},
         {"name": "Красный", "hex": "#d80606f3", "img": "/img/pagesecond/pufy/puf4/puf4_red.jpeg"},
     ])},
    {"title": "ПУФ 5", "img": "/img/pagesecond/pufy/puf5/puf5.png",
     "description_ru": "Каркас: брус, фанера, дсп. Наполнение: ППУ синтепон. Ткань: экокожа, кожзам.",
     "material_ru": "Синтепон, велюр", "size": "По согласованию с заказчиком", "article": "L.Me-PF.UN.600-05",
     "in_stock": True, "category_slug": "pufy"},
    {"title": "ПУФ 6", "img": "/img/pagesecond/pufy/puf6/puf6_white.png",
     "description_ru": "Каркас: брус, фанера, дсп. Наполнение: ППУ синтепон. Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.",
     "material_ru": "Синтепон, велюр", "size": "По согласованию с заказчиком", "article": "L.Me-PF.UN.600-06",
     "in_stock": True, "category_slug": "pufy",
     "colors_json": _c([
         {"name": "Белый", "hex": "#ffffff", "img": "/img/pagesecond/pufy/puf6/puf6_white.png"},
         {"name": "Коричневый", "hex": "#964B00", "img": "/img/pagesecond/pufy/puf6/puf6_brown.jpeg"},
         {"name": "Синий", "hex": "#0f48e6", "img": "/img/pagesecond/pufy/puf6/puf6_blue.jpeg"},
         {"name": "Серый", "hex": "#888888", "img": "/img/pagesecond/pufy/puf6/puf6_grey.jpeg"},
         {"name": "Хвойно-зеленый", "hex": "#1B4D42", "img": "/img/pagesecond/pufy/puf6/puf6_green.jpeg"},
         {"name": "Красный", "hex": "#d80606f3", "img": "/img/pagesecond/pufy/puf6/puf6_red.jpeg"},
         {"name": "Темный хаки", "hex": "#756340", "img": "/img/pagesecond/pufy/puf6/puf6_dark_haki.jpeg"},
     ])},
    {"title": "ПУФ 7", "img": "/img/pagesecond/pufy/puf7/puf7_grey.png",
     "description_ru": "Каркас: брус, фанера, дсп. Наполнение: ППУ синтепон. Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.",
     "material_ru": "Синтепон, велюр", "size": "По согласованию с заказчиком", "article": "L.Me-PF.UN.600-07",
     "in_stock": True, "category_slug": "pufy",
     "colors_json": _c([
         {"name": "Коричневый", "hex": "#964B00", "img": "/img/pagesecond/pufy/puf7/puf7_brown.jpeg"},
         {"name": "Синий", "hex": "#0f48e6", "img": "/img/pagesecond/pufy/puf7/puf7_blue.jpeg"},
         {"name": "Серый", "hex": "#888888", "img": "/img/pagesecond/pufy/puf7/puf7_grey.png"},
         {"name": "Хвойно-зеленый", "hex": "#1B4D42", "img": "/img/pagesecond/pufy/puf7/puf7_green.jpeg"},
         {"name": "Красный", "hex": "#d80606f3", "img": "/img/pagesecond/pufy/puf7/puf7_red.jpeg"},
         {"name": "Темный хаки", "hex": "#756340", "img": "/img/pagesecond/pufy/puf7/puf7_dark_haki.jpeg"},
     ])},
    {"title": "ПУФ 8", "img": "/img/pagesecond/pufy/puf8/puf8.png",
     "description_ru": "Каркас: брус, фанера, дсп. Наполнение: ППУ синтепон. Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.",
     "material_ru": "Синтепон, велюр", "size": "По согласованию с заказчиком", "article": "L.Me-PF.UN.600-08",
     "in_stock": True, "category_slug": "pufy"},

    # ══════════════════════════════════════════════════════════════════════════
    # СТЕЛЛАЖИ
    # ══════════════════════════════════════════════════════════════════════════
    {"title": "СТЕЛЛАЖ 1", "img": "/img/pagesecond/stellazhi/stellazh1.png",
     "description_ru": "Компактный и удобный стеллаж подойдёт для дома, офиса или магазина.",
     "material_ru": "ЛДСП, металл", "size": "1200x400x1800", "article": "L.Me-ST.UN.1200-01",
     "in_stock": True, "category_slug": "stellazhi"},
    {"title": "СТЕЛЛАЖ 2", "img": "/img/pagesecond/stellazhi/stellazh2.png",
     "description_ru": "Компактный и удобный стеллаж подойдёт для дома, офиса или магазина.",
     "material_ru": "ЛДСП, металл", "size": "1200x400x1800", "article": "L.Me-ST.UN.1200-02",
     "in_stock": True, "category_slug": "stellazhi"},
    {"title": "СТЕЛЛАЖ 3", "img": "/img/pagesecond/stellazhi/stellazh3/stellazhi3_dark.png",
     "description_ru": "Компактный и удобный стеллаж подойдёт для дома, офиса или магазина.",
     "material_ru": "ЛДСП, металл", "size": "1200x400x1800", "article": "L.Me-ST.UN.1200-03",
     "in_stock": True, "category_slug": "stellazhi",
     "colors_json": _c([
         {"name": "Темный", "hex": "#D49B61", "img": "/img/pagesecond/stellazhi/stellazh3/stellazh3_dark.png"},
         {"name": "Белый", "hex": "#ffffff", "img": "/img/pagesecond/stellazhi/stellazh3/stellazh3_white.jpeg"},
         {"name": "Черный", "hex": "#000000", "img": "/img/pagesecond/stellazhi/stellazh3/stellazh3_black.jpeg"},
         {"name": "Светлый", "hex": "#DBC29B", "img": "/img/pagesecond/stellazhi/stellazh3/stellazh3_light.jpeg"},
     ])},

    # ══════════════════════════════════════════════════════════════════════════
    # ТУМБЫ
    # ══════════════════════════════════════════════════════════════════════════
    {"title": "ТУМБА 1", "img": "/img/pagesecond/tumby/tumba1/tumba.png",
     "description_ru": "Удобная и практичная модель. Подходит для ежедневного использования.",
     "material_ru": "ЛДСП, металлическая фурнитура", "size": "800x400x600", "article": "L.Me-TU.UN.800-01",
     "in_stock": True, "category_slug": "tumby",
     "colors_json": _c([
         {"name": "Дуб", "hex": "#ab5014", "img": "/img/pagesecond/tumby/tumba1/tumba1.png"},
         {"name": "Белый", "hex": "#ffffff", "img": "/img/pagesecond/tumby/tumba1/tumba1_white.png"},
         {"name": "Золотистый дуб", "hex": "#C18A4F", "img": "/img/pagesecond/tumby/tumba1/tumba1_dark.png"},
         {"name": "Светлый дуб", "hex": "#dc8b3f", "img": "/img/pagesecond/tumby/tumba1/tumba1_light.png"},
         {"name": "Черный", "hex": "#000000", "img": "/img/pagesecond/tumby/tumba1/tumba1_black.png"},
     ])},
    {"title": "ТУМБА 2", "img": "/img/pagesecond/tumby/tumba2/tumba2_white.png",
     "description_ru": "Компактный, надёжный, функциональный.",
     "material_ru": "ЛДСП, металлическая фурнитура", "size": "800x400x600", "article": "L.Me-TU.UN.800-02",
     "in_stock": True, "category_slug": "tumby",
     "colors_json": _c([
         {"name": "Белый", "hex": "#ffffff", "img": "/img/pagesecond/tumby/tumba2/tumba2_white.png"},
         {"name": "Золотистый дуб", "hex": "#C18A4F", "img": "/img/pagesecond/tumby/tumba2/tumba2_dark.png"},
         {"name": "Светлый дуб", "hex": "#dc8b3f", "img": "/img/pagesecond/tumby/tumba2/tumba2_light.png"},
         {"name": "Черный", "hex": "#000000", "img": "/img/pagesecond/tumby/tumba2/tumba2_black.png"},
     ])},

    # ══════════════════════════════════════════════════════════════════════════
    # ШКОЛЬНЫЕ СТУЛЬЯ
    # ══════════════════════════════════════════════════════════════════════════
    {"title": "ШКОЛЬНЫЙ СТУЛ 1", "img": "/img/pagesecond/stulya/shkolnye/shkolnye1/stul1_yellow.png",
     "description_ru": "Эргономичный школьный стул со стойкой конструкцией и устойчивой посадкой.",
     "material_ru": "Пластик, металл", "size": "400x400x850", "article": "L.Me-SH.UN-01",
     "in_stock": True, "category_slug": "shkolnye",
     "colors_json": _c([
         {"name": "Оранжевый", "hex": "#FF6600", "img": "/img/pagesecond/stulya/shkolnye/shkolnye1/stul2_orange.png"},
         {"name": "Желтый", "hex": "#f1e72b", "img": "/img/pagesecond/stulya/shkolnye/shkolnye1/stul1_yellow.png"},
         {"name": "Тёмно-зелёный", "hex": "#1B4D3E", "img": "/img/pagesecond/stulya/shkolnye/shkolnye1/stul4_green.png"},
         {"name": "Серый", "hex": "#888888", "img": "/img/pagesecond/stulya/shkolnye/shkolnye1/stul3_grey.png"},
     ])},
    {"title": "ШКОЛЬНЫЙ СТУЛ 2", "img": "/img/pagesecond/stulya/shkolnye/shkolnye2/stul1_green.png",
     "description_ru": "Эргономичный школьный стул со стойкой конструкцией и устойчивой посадкой.",
     "material_ru": "Пластик, металл", "size": "400x400x850", "article": "L.Me-SH.UN-02",
     "in_stock": True, "category_slug": "shkolnye",
     "colors_json": _c([
         {"name": "Оранжевый", "hex": "#FF6600", "img": "/img/pagesecond/stulya/shkolnye/shkolnye2/stul2_orange.png"},
         {"name": "Синий", "hex": "#1c37d3", "img": "/img/pagesecond/stulya/shkolnye/shkolnye2/stul3_blue.png"},
         {"name": "Зелёный", "hex": "#1aa317", "img": "/img/pagesecond/stulya/shkolnye/shkolnye2/stul1_green.png"},
         {"name": "Серый", "hex": "#888888", "img": "/img/pagesecond/stulya/shkolnye/shkolnye2/stul4_grey.png"},
     ])},
    {"title": "ШКОЛЬНЫЙ СТУЛ 3", "img": "/img/pagesecond/stulya/shkolnye/shkolnye3/stul1_grey.png",
     "description_ru": "Эргономичный школьный стул со стойкой конструкцией и устойчивой посадкой.",
     "material_ru": "Пластик, металл", "size": "400x400x850", "article": "L.Me-SH.UN-03",
     "in_stock": True, "category_slug": "shkolnye",
     "colors_json": _c([
         {"name": "Оранжевый", "hex": "#FF6600", "img": "/img/pagesecond/stulya/shkolnye/shkolnye3/stul2_orange.png"},
         {"name": "Желтый", "hex": "#f1e72b", "img": "/img/pagesecond/stulya/shkolnye/shkolnye3/stul4_yellow.png"},
         {"name": "Зелёный", "hex": "#1B4D3E", "img": "/img/pagesecond/stulya/shkolnye/shkolnye3/stul3_green.png"},
         {"name": "Серый", "hex": "#888888", "img": "/img/pagesecond/stulya/shkolnye/shkolnye3/stul1_grey.png"},
     ])},
    {"title": "ШКОЛЬНЫЙ СТУЛ 4", "img": "/img/pagesecond/stulya/shkolnye/shkolnye3/stul1_brownish_grey.png",
     "description_ru": "Эргономичный школьный стул со стойкой конструкцией и устойчивой посадкой.",
     "material_ru": "Пластик, металл", "size": "400x400x850", "article": "L.Me-SH.UN-04",
     "in_stock": True, "category_slug": "shkolnye",
     "colors_json": _c([
         {"name": "Коричнево-серый", "hex": "#5d4839", "img": "/img/pagesecond/stulya/shkolnye/shkolnye4/stul1_brownish_grey.png"},
         {"name": "Белый", "hex": "#ffffff", "img": "/img/pagesecond/stulya/shkolnye/shkolnye4/stul2_white.png"},
         {"name": "Черный", "hex": "#000000", "img": "/img/pagesecond/stulya/shkolnye/shkolnye4/stul3_black.png"},
         {"name": "Серый", "hex": "#888888", "img": "/img/pagesecond/stulya/shkolnye/shkolnye4/stul4_grey.png"},
     ])},

    # ══════════════════════════════════════════════════════════════════════════
    # МЯГКИЕ СТУЛЬЯ
    # ══════════════════════════════════════════════════════════════════════════
    {"title": "МЯГКИЙ СТУЛ 1", "img": "/img/pagesecond/stulya/myagkie/myagkie/stul8.png",
     "description_ru": "Мягкий и комфортный стул с плотной обивкой и надёжным основанием.",
     "material_ru": "Металл, велюр", "size": "450x450x900", "article": "L.Me-MY.UN.450",
     "in_stock": True, "category_slug": "myagkie",
     "colors_json": _c([
         {"name": "Оранжевый", "hex": "#FF6600", "img": "/img/pagesecond/stulya/myagkie/myagkie/stul8 (1).png"},
         {"name": "Синий", "hex": "#7095cd", "img": "/img/pagesecond/stulya/myagkie/myagkie/stul8 (2).png"},
         {"name": "Светло-зеленый", "hex": "#528172", "img": "/img/pagesecond/stulya/myagkie/myagkie/stul8.png"},
         {"name": "Серый", "hex": "#888888", "img": "/img/pagesecond/stulya/myagkie/myagkie/stul8 (3).png"},
     ])},
    {"title": "МЯГКИЙ СТУЛ 2", "img": "/img/pagesecond/stulya/myagkie/myagkie2/stul9_grey.png",
     "description_ru": "Мягкий и комфортный стул с плотной обивкой и надёжным основанием.",
     "material_ru": "Металл, велюр", "size": "450x450x900", "article": "L.Me-MY.UN.451",
     "in_stock": True, "category_slug": "myagkie",
     "colors_json": _c([
         {"name": "Серый", "hex": "#a19e9c", "img": "/img/pagesecond/stulya/myagkie/myagkie2/stul9_grey.png"},
         {"name": "Мутно-коричневый", "hex": "#af863b", "img": "/img/pagesecond/stulya/myagkie/myagkie2/kreslo9_muted_brown.png"},
         {"name": "Черный", "hex": "#000000", "img": "/img/pagesecond/stulya/myagkie/myagkie2/kreslo9_black.png"},
         {"name": "Белый", "hex": "#ffffff", "img": "/img/pagesecond/stulya/myagkie/myagkie2/kreslo9_vanilla_cream.png"},
     ])},
    {"title": "МЯГКИЙ СТУЛ 3", "img": "/img/pagesecond/stulya/myagkie/myagkie3/stul7.png",
     "description_ru": "Мягкий и комфортный стул с плотной обивкой и надёжным основанием.",
     "material_ru": "Металл, велюр", "size": "450x450x900", "article": "L.Me-MY.UN.452",
     "in_stock": True, "category_slug": "myagkie",
     "colors_json": _c([
         {"name": "Красный", "hex": "#c81c1c", "img": "/img/pagesecond/stulya/myagkie/myagkie3/stul7 (2).png"},
         {"name": "Желтый", "hex": "#f3e706", "img": "/img/pagesecond/stulya/myagkie/myagkie3/stul7 (3).png"},
         {"name": "Светло-зелёный", "hex": "#256552", "img": "/img/pagesecond/stulya/myagkie/myagkie3/stul7 (1).png"},
         {"name": "Серый", "hex": "#888888", "img": "/img/pagesecond/stulya/myagkie/myagkie3/stul7.png"},
     ])},

    # ══════════════════════════════════════════════════════════════════════════
    # БАРНЫЕ СТУЛЬЯ
    # ══════════════════════════════════════════════════════════════════════════
    {"title": "БАРНЫЙ СТУЛ 1", "img": "/img/pagesecond/stulya/barnye/stul10/stul10_orange.png",
     "description_ru": "Высота 75 см, прочный металлический каркас и мягкая обивка.",
     "material_ru": "Металл, велюр", "size": "400x400x750", "article": "L.Me-BA.UN.400",
     "in_stock": True, "category_slug": "barnye",
     "colors_json": _c([
         {"name": "Оранжевый", "hex": "#FF6600", "img": "/img/pagesecond/stulya/barnye/stul10/stul10_orange.png"},
         {"name": "Желтый", "hex": "#e0ca06", "img": "/img/pagesecond/stulya/barnye/stul10/stul10_yellow.png"},
         {"name": "Серо-зелёный", "hex": "#2a9978", "img": "/img/pagesecond/stulya/barnye/stul10/stul10_sage.png"},
         {"name": "Серый", "hex": "#888888", "img": "/img/pagesecond/stulya/barnye/stul10/stul10_grey.png"},
         {"name": "Белый", "hex": "#fcfcfc", "img": "/img/pagesecond/stulya/barnye/stul10/stul10_white.png"},
     ])},
    {"title": "БАРНЫЙ СТУЛ 2", "img": "/img/pagesecond/stulya/barnye/stul11/stul11.png",
     "description_ru": "Высота 75 см, прочный металлический каркас и мягкая обивка.",
     "material_ru": "Металл, велюр", "size": "400x400x750", "article": "L.Me-BA.UN.401",
     "in_stock": True, "category_slug": "barnye",
     "colors_json": _c([
         {"name": "Оранжевый", "hex": "#FF6600", "img": "/img/pagesecond/stulya/barnye/stul11/stul11 (1).png"},
         {"name": "Белый", "hex": "#ffffff", "img": "/img/pagesecond/stulya/barnye/stul11/stul11.png"},
         {"name": "Зелёный", "hex": "#195a47", "img": "/img/pagesecond/stulya/barnye/stul11/stul11 (3).png"},
         {"name": "Синий", "hex": "#2c1fc4", "img": "/img/pagesecond/stulya/barnye/stul11/stul11 (2).png"},
     ])},

    # ══════════════════════════════════════════════════════════════════════════
    # ВСТРОЕННЫЕ ШКАФЫ
    # ══════════════════════════════════════════════════════════════════════════
    {"title": "ВСТРОЕННЫЙ ШКАФ 1", "img": "/img/pagesecond/shkafy/vstroenye/shkaf1/shkaf1.png",
     "description_ru": "Компактная модель для небольших помещений. Идеально подходит для прихожей, спальни или коридора.",
     "material_ru": "ДСП, МДФ, фурнитура", "size": "2000x600x2400", "article": "L.Me-VS.UN-01",
     "in_stock": True, "category_slug": "vstroenye",
     "colors_json": _c([
         {"name": "Белый", "hex": "#FFFFFF", "img": "/img/pagesecond/shkafy/vstroenye/shkaf1/shkaf1.png"},
         {"name": "Венге", "hex": "#9d5116", "img": "/img/pagesecond/shkafy/vstroenye/shkaf1/shkaf2.png"},
         {"name": "Дуб сонома", "hex": "#C8A97E", "img": "/img/pagesecond/shkafy/vstroenye/shkaf1/shkaf3.png"},
         {"name": "Черный", "hex": "#000000", "img": "/img/pagesecond/shkafy/vstroenye/shkaf1/shkaf4.png"},
     ])},
    {"title": "ВСТРОЕННЫЙ ШКАФ 2", "img": "/img/pagesecond/shkafy/vstroenye/shkaf2/shkaf1.png",
     "description_ru": "Компактная модель для небольших помещений. Идеально подходит для прихожей, спальни или коридора.",
     "material_ru": "ДСП, МДФ, фурнитура", "size": "2000x600x2400", "article": "L.Me-VS.UN-02",
     "in_stock": True, "category_slug": "vstroenye",
     "colors_json": _c([
         {"name": "Бирюзовый", "hex": "#2c8360", "img": "/img/pagesecond/shkafy/vstroenye/shkaf2/shkaf1.png"},
         {"name": "Дуб сонома", "hex": "#C8A97E", "img": "/img/pagesecond/shkafy/vstroenye/shkaf2/shkaf2.png"},
         {"name": "Венге", "hex": "#9d5116", "img": "/img/pagesecond/shkafy/vstroenye/shkaf2/shkaf4.png"},
         {"name": "Черный", "hex": "#000000", "img": "/img/pagesecond/shkafy/vstroenye/shkaf2/shkaf3.png"},
         {"name": "Белый", "hex": "#ffffff", "img": "/img/pagesecond/shkafy/vstroenye/shkaf2/shkaf5.png"},
     ])},
    {"title": "ВСТРОЕННЫЙ ШКАФ 3", "img": "/img/pagesecond/shkafy/vstroenye/shkaf3/shkaf1.png",
     "description_ru": "Компактная модель для небольших помещений. Идеально подходит для прихожей, спальни или коридора.",
     "material_ru": "ДСП, МДФ, фурнитура", "size": "2000x600x2400", "article": "L.Me-VS.UN-03",
     "in_stock": True, "category_slug": "vstroenye",
     "colors_json": _c([
         {"name": "Белый", "hex": "#FFFFFF", "img": "/img/pagesecond/shkafy/vstroenye/shkaf3/shkaf1.png"},
         {"name": "Венге", "hex": "#9d5116", "img": "/img/pagesecond/shkafy/vstroenye/shkaf3/shkaf2.png"},
         {"name": "Дуб сонома", "hex": "#C8A97E", "img": "/img/pagesecond/shkafy/vstroenye/shkaf3/shkaf3.png"},
         {"name": "Черный", "hex": "#000000", "img": "/img/pagesecond/shkafy/vstroenye/shkaf3/shkaf4.png"},
     ])},

    # ══════════════════════════════════════════════════════════════════════════
    # СТАНДАРТНЫЕ ШКАФЫ
    # ══════════════════════════════════════════════════════════════════════════
    {"title": "СТАНДАРТНЫЙ ШКАФ 1", "img": "/img/pagesecond/shkafy/standartnye/shkaf1_standart.png",
     "description_ru": "Функциональный стандартный шкаф из качественных мебельных панелей.",
     "material_ru": "ДСП, МДФ, металлическая фурнитура", "size": "1800x600x2200", "article": "L.Me-SN.UN-01",
     "in_stock": True, "category_slug": "standartnye",
     "colors_json": _c([
         {"name": "Синий", "hex": "#1460d2", "img": "/img/pagesecond/shkafy/standartnye/shkaf1_standart.png"},
         {"name": "Белый", "hex": "#FFFFFF", "img": "/img/pagesecond/shkafy/standartnye/shkaf1_white.png"},
         {"name": "Венге", "hex": "#3B1F0A", "img": "/img/pagesecond/shkafy/standartnye/shkaf1_dark.png"},
         {"name": "Дуб сонома", "hex": "#e4bf8a", "img": "/img/pagesecond/shkafy/standartnye/shkaf1_light.png"},
         {"name": "Черный", "hex": "#000000", "img": "/img/pagesecond/shkafy/standartnye/shkaf1_black.png"},
     ])},

    # ══════════════════════════════════════════════════════════════════════════
    # ПАРТЫ
    # ══════════════════════════════════════════════════════════════════════════
    {"title": "ПАРТА 1", "img": "/img/pagesecond/stoly/party/item1.png",
     "description_ru": "Каркас: брус, фанера, дсп. Материал: ЛДСП, металл.",
     "material_ru": "ЛДСП, металл", "size": "По согласованию с заказчиком", "article": "S.Me-ST.PA.001",
     "in_stock": True, "category_slug": "party"},
    {"title": "ПАРТА 2", "img": "/img/pagesecond/stoly/party/item2.png",
     "description_ru": "Каркас: брус, фанера, дсп. Материал: ЛДСП, МДФ, металл.",
     "material_ru": "ЛДСП, МДФ, металл", "size": "По согласованию с заказчиком", "article": "S.Me-ST.PA.002",
     "in_stock": True, "category_slug": "party"},
    {"title": "ПАРТА 3", "img": "/img/pagesecond/stoly/party/item3.png",
     "description_ru": "Каркас: брус, фанера, дсп. Материал: ЛДСП, МДФ, металл.",
     "material_ru": "ЛДСП, МДФ, пластмасса", "size": "По согласованию с заказчиком", "article": "S.Me-ST.PA.003",
     "in_stock": True, "category_slug": "party"},
    {"title": "ПАРТА 4", "img": "/img/pagesecond/stoly/party/item4.png",
     "description_ru": "Каркас: брус, фанера, дсп. Материал: ЛДСП, МДФ, металл.",
     "material_ru": "ЛДСП, металл", "size": "По согласованию с заказчиком", "article": "S.Me-ST.PA.004",
     "in_stock": True, "category_slug": "party"},
    {"title": "ПАРТА 5", "img": "/img/pagesecond/stoly/party/item5.png",
     "description_ru": "Каркас: брус, фанера, дсп. Материал: ЛДСП, МДФ, металл.",
     "material_ru": "ЛДСП, металл", "size": "По согласованию с заказчиком", "article": "S.Me-ST.PA.005",
     "in_stock": True, "category_slug": "party"},
    {"title": "ПАРТА 6", "img": "/img/pagesecond/stoly/party/item6.png",
     "description_ru": "Каркас: брус, фанера, дсп. Материал: ЛДСП, МДФ, металл.",
     "material_ru": "ЛДСП, металл", "size": "По согласованию с заказчиком", "article": "S.Me-ST.PA.006",
     "in_stock": True, "category_slug": "party"},

    # ══════════════════════════════════════════════════════════════════════════
    # РЕСЕПШЕН
    # ══════════════════════════════════════════════════════════════════════════
    {"title": "РЕСЕПШЕН 1", "img": "/img/pagesecond/stoly/reception/item1.png",
     "description_ru": "Стильная стойка ресепшен для школ и офисов.",
     "material_ru": "ЛДСП, МДФ, металл", "size": "По согласованию с заказчиком", "article": "S.Me-STO.RS.001",
     "in_stock": True, "category_slug": "reception"},
    {"title": "РЕСЕПШЕН 2", "img": "/img/pagesecond/stoly/reception/item2.png",
     "description_ru": "Стильная стойка ресепшен для школ и офисов.",
     "material_ru": "ЛДСП, МДФ, металл", "size": "По согласованию с заказчиком", "article": "S.Me-STO.RS.002",
     "in_stock": True, "category_slug": "reception"},
    {"title": "РЕСЕПШЕН 3", "img": "/img/pagesecond/stoly/reception/item3.png",
     "description_ru": "Стильная стойка ресепшен для школ и офисов.",
     "material_ru": "ЛДСП, МДФ, металл", "size": "По согласованию с заказчиком", "article": "S.Me-STO.RS.003",
     "in_stock": True, "category_slug": "reception"},

    # ══════════════════════════════════════════════════════════════════════════
    # СПЕЦ СТОЛЫ ДЛЯ ПРЕПОДАВАТЕЛЯ
    # ══════════════════════════════════════════════════════════════════════════
    {"title": "СПЕЦ СТОЛ ДЛЯ ПРЕПОДАВАТЕЛЯ 1", "img": "/img/pagesecond/stoly/spezstolytecher/item1_1.png",
     "description_ru": "Специализированный стол для преподавателя с удобной организацией рабочего пространства.",
     "material_ru": "ЛДСП, МДФ, металл", "size": "По согласованию с заказчиком", "article": "S.Me-STO.SPT.001",
     "in_stock": True, "category_slug": "spezstolytecher",
     "colors_json": _c([
         {"name": "Белый", "hex": "#FFFFFF", "img": "/img/pagesecond/stoly/spezstolytecher/item1_4.png"},
         {"name": "Чёрный", "hex": "#222222", "img": "/img/pagesecond/stoly/spezstolytecher/item1_1.png"},
         {"name": "Светлый дуб", "hex": "#C8A97E", "img": "/img/pagesecond/stoly/spezstolytecher/item1_3.png"},
         {"name": "Дуб", "hex": "#8B6343", "img": "/img/pagesecond/stoly/spezstolytecher/item1_2.png"},
     ])},
    {"title": "СПЕЦ СТОЛ ДЛЯ ПРЕПОДАВАТЕЛЯ 2", "img": "/img/pagesecond/stoly/spezstolytecher/item2.png",
     "description_ru": "Специализированный стол для преподавателя с удобной организацией рабочего пространства.",
     "material_ru": "ЛДСП, МДФ, металл", "size": "По согласованию с заказчиком", "article": "S.Me-STO.SPT.002",
     "in_stock": True, "category_slug": "spezstolytecher"},

    # ══════════════════════════════════════════════════════════════════════════
    # ГОСУДАРСТВЕННАЯ СИМВОЛИКА
    # ══════════════════════════════════════════════════════════════════════════
    {"title": "ГОСУДАРСТВЕННАЯ СИМВОЛИКА 1", "img": "/img/pagedecor/gos/gos1.png",
     "description_ru": "Стенд государственных символов РК. Флаг. Флагшток. Герб РК.",
     "material_ru": "ЛДСП, ножки из пластмасса", "size": "Высота: 2000/2500/до потолка, Глубина: 400/500/600, Ширина: Варьируется",
     "article": "S.Me-ST.S.DP", "in_stock": True, "category_slug": "gos"},
    {"title": "ГОСУДАРСТВЕННАЯ СИМВОЛИКА 2", "img": "/img/pagedecor/gos/gos2.png",
     "description_ru": "Стенд государственных символов РК. Флаг. Флагшток. Герб РК.",
     "material_ru": "ЛДСП, ножки из пластмасса", "size": "Высота: 2000/2500/до потолка, Глубина: 400/500/600, Ширина: Варьируется",
     "article": "S.Me-ST.S.DP", "in_stock": True, "category_slug": "gos"},
    {"title": "ГОСУДАРСТВЕННАЯ СИМВОЛИКА 3", "img": "/img/pagedecor/gos/gos3.png",
     "description_ru": "Стенд государственных символов РК. Флаг. Флагшток. Герб РК.",
     "material_ru": "ЛДСП, МДФ, металл, ножки из пластмасса", "size": "Высота: 2000/2500/до потолка, Глубина: 400/500/600, Ширина: Варьируется",
     "article": "S.Me-ST.S.DP", "in_stock": True, "category_slug": "gos"},

    # ══════════════════════════════════════════════════════════════════════════
    # 3D ПАНЕЛИ
    # ══════════════════════════════════════════════════════════════════════════
    {"title": "РЕЕЧНЫЙ", "img": "/img/pagedecor/3dpanels/reechny.png",
     "description_ru": "Реечные стеновые панели идеально подходят для обшивки фасадов на улице. Также они гармонично выглядят внутри интерьера и используются для обшивки стен и потолков.",
     "material_ru": "Гипс", "size": "600x600", "article": "S.Me-ST.S.DP", "in_stock": True, "category_slug": "3dpanels"},
    {"title": "РЕЛЬЕФНЫЕ", "img": "/img/pagedecor/3dpanels/relefny.png",
     "description_ru": "Декоративный отделочный материал, имеющий объемный рисунок на поверхности, который создает игру света и тени.",
     "material_ru": "Гипс", "size": "600x600", "article": "S.Me-ST.S.DP", "in_stock": True, "category_slug": "3dpanels"},
    {"title": "ЛИНЕЙНЫЕ", "img": "/img/pagedecor/3dpanels/lineyny.png",
     "description_ru": "Настенные панели, добавляющие объем и выразительность интерьеру. Идеальны для зонирования пространства.",
     "material_ru": "Гипс", "size": "600x600", "article": "S.Me-ST.S.DP", "in_stock": True, "category_slug": "3dpanels"},
    {"title": "ВОЛНИСТЫЙ", "img": "/img/pagedecor/3dpanels/volnisty.png",
     "description_ru": "Настенные панели, добавляющие объем и выразительность интерьеру. Полиуретановая основа обеспечивает прочность и влагостойкость.",
     "material_ru": "Гипс", "size": "600x600", "article": "S.Me-ST.S.DP", "in_stock": True, "category_slug": "3dpanels"},
    {"title": "УЗОРЧАТЫЕ", "img": "/img/pagedecor/3dpanels/uzorchaty.png",
     "description_ru": "Настенные панели, добавляющие объем и выразительность интерьеру. Идеальны для зонирования пространства.",
     "material_ru": "Гипс", "size": "600x600", "article": "S.Me-ST.S.DP", "in_stock": True, "category_slug": "3dpanels"},
    {"title": "ФИГУРНЫЕ", "img": "/img/pagedecor/3dpanels/figurny.png",
     "description_ru": "Настенные панели, добавляющие объем и выразительность интерьеру. Полиуретановая основа обеспечивает прочность и влагостойкость.",
     "material_ru": "Гипс", "size": "600x600", "article": "S.Me-ST.S.DP", "in_stock": True, "category_slug": "3dpanels"},

    # ══════════════════════════════════════════════════════════════════════════
    # ОСВЕЩЕНИЕ
    # ══════════════════════════════════════════════════════════════════════════
    {"title": "START (светильник 1)", "img": "/img/pagedecor/lighting/start.png",
     "description_ru": "Современный светильник для учебных классов и офисов.",
     "material_ru": "Алюминий, акрил", "size": "600x600", "article": "S.Me-ST.S.DP", "in_stock": True, "category_slug": "lighting"},
    {"title": "LEZARD (светильник 2)", "img": "/img/pagedecor/lighting/lezard.png",
     "description_ru": "Светодиодный светильник с равномерным рассеиванием света.",
     "material_ru": "Алюминий, акрил", "size": "600x600", "article": "S.Me-ST.S.DP", "in_stock": True, "category_slug": "lighting"},
    {"title": "ВСТРАИВАЕМЫЙ СВЕТИЛЬНИК ЭРА", "img": "/img/pagedecor/lighting/era.png",
     "description_ru": "Встраиваемый LED светильник для потолков Armstrong.",
     "material_ru": "Алюминий, акрил", "size": "600x600", "article": "S.Me-ST.S.DP", "in_stock": True, "category_slug": "lighting"},
    {"title": "TEKLED LED SLIM ROUND", "img": "/img/pagedecor/lighting/tekled.png",
     "description_ru": "Тонкий круглый LED светильник для современного интерьера.",
     "material_ru": "Алюминий, акрил", "size": "600x600", "article": "S.Me-ST.S.DP", "in_stock": True, "category_slug": "lighting"},
    {"title": "ELEKTROSTANDARD", "img": "/img/pagedecor/lighting/elektrostandard.png",
     "description_ru": "Надёжный светильник от проверенного производителя.",
     "material_ru": "Алюминий, акрил", "size": "600x600", "article": "S.Me-ST.S.DP", "in_stock": True, "category_slug": "lighting"},
    {"title": "LED ЛЕНТЫ", "img": "/img/pagedecor/lighting/led-lenty.png",
     "description_ru": "Светодиодная лента для декоративной подсветки помещений.",
     "material_ru": "LED, силикон", "size": "600x600", "article": "S.Me-ST.S.DP", "in_stock": True, "category_slug": "lighting"},
    {"title": "LEDS C4", "img": "/img/pagedecor/lighting/leds-c4.png",
     "description_ru": "Дизайнерский подвесной светильник премиум-класса.",
     "material_ru": "Алюминий, акрил", "size": "3025x700", "article": "S.Me-ST.S.DP", "in_stock": True, "category_slug": "lighting"},
    {"title": "LED PENDELLEUCHTE OVAL", "img": "/img/pagedecor/lighting/led-oval.png",
     "description_ru": "Подвесной LED светильник овальной формы.",
     "material_ru": "Алюминий, акрил", "size": "700x200x170", "article": "S.Me-ST.S.DP", "in_stock": True, "category_slug": "lighting"},
    {"title": "VOLTA LIGHTSTAR", "img": "/img/pagedecor/lighting/volta.png",
     "description_ru": "Современный светильник с регулируемой яркостью.",
     "material_ru": "Алюминий, акрил", "size": "600x600", "article": "S.Me-ST.S.DP", "in_stock": True, "category_slug": "lighting"},
    {"title": "LEZARD (светильник 3)", "img": "/img/pagedecor/lighting/lezard2.png",
     "description_ru": "Светодиодный светильник с равномерным рассеиванием света.",
     "material_ru": "Алюминий, акрил", "size": "600x600", "article": "S.Me-ST.S.DP", "in_stock": True, "category_slug": "lighting"},
    {"title": "ARKOSLIGHT FIFTY HO SUSPENDED", "img": "/img/pagedecor/lighting/arkoslight.png",
     "description_ru": "Подвесной дизайнерский светильник для конференц-залов.",
     "material_ru": "Алюминий, акрил", "size": "600x600", "article": "S.Me-ST.S.DP", "in_stock": True, "category_slug": "lighting"},
    {"title": "START (светильник 4)", "img": "/img/pagedecor/lighting/start2.png",
     "description_ru": "Современный светильник для учебных классов и офисов.",
     "material_ru": "Алюминий, акрил", "size": "600x600", "article": "S.Me-ST.S.DP", "in_stock": True, "category_slug": "lighting"},
    {"title": "RULLO LIGHTSTAR", "img": "/img/pagedecor/lighting/rullo.png",
     "description_ru": "Рулонный светильник с направленным световым потоком.",
     "material_ru": "Алюминий, акрил", "size": "600x600", "article": "S.Me-ST.S.DP", "in_stock": True, "category_slug": "lighting"},
    {"title": "AURA WN02W H-GU10", "img": "/img/pagedecor/lighting/aura.png",
     "description_ru": "Настенный светильник с тёплым светом.",
     "material_ru": "Алюминий, акрил", "size": "600x600", "article": "S.Me-ST.S.DP", "in_stock": True, "category_slug": "lighting"},
    {"title": "DK LED WALL SPOTLIGHT", "img": "/img/pagedecor/lighting/dk-led.png",
     "description_ru": "Настенный LED прожектор с регулируемым углом.",
     "material_ru": "Алюминий, акрил", "size": "3025x700", "article": "S.Me-ST.S.DP", "in_stock": True, "category_slug": "lighting"},
    {"title": "START (светильник 5)", "img": "/img/pagedecor/lighting/start3.png",
     "description_ru": "Компактный светильник для акцентного освещения.",
     "material_ru": "Алюминий, акрил", "size": "700x200x170", "article": "S.Me-ST.S.DP", "in_stock": True, "category_slug": "lighting"},

    # ══════════════════════════════════════════════════════════════════════════
    # ПЕРЕГОРОДКИ
    # ══════════════════════════════════════════════════════════════════════════
    {"title": "СТЕКЛО", "img": "/img/pagedecor/peregorodki/item1.png",
     "description_ru": "Стеклянные перегородки делают пространство визуально лёгким и просторным. Они пропускают свет, не загромождая комнату.",
     "material_ru": "Стекло, металл", "article": "S.Me-ST.S.DP", "in_stock": True, "category_slug": "peregorodki"},
    {"title": "РЕЙКИ", "img": "/img/pagedecor/peregorodki/item2.png",
     "description_ru": "Реечные перегородки из деревянных или пластиковых реек создают ритм и текстуру в интерьере.",
     "material_ru": "Дерево, пластик", "article": "S.Me-ST.S.DP", "in_stock": True, "category_slug": "peregorodki"},
    {"title": "МЕТАЛЛ", "img": "/img/pagedecor/peregorodki/item31.png",
     "description_ru": "Металлические перегородки — для современных интерьеров. Прочные, долговечные, с индустриальным характером.",
     "material_ru": "Металл", "article": "S.Me-ST.S.DP", "in_stock": True, "category_slug": "peregorodki"},

    # ══════════════════════════════════════════════════════════════════════════
    # ШТОРЫ
    # ══════════════════════════════════════════════════════════════════════════
    {"title": "РУЛОННЫЕ", "img": "/img/pagedecor/shtory/item3.png",
     "description_ru": "Рулонные шторы — классическое решение для оформления окон. Легко монтируются, удобны в эксплуатации.",
     "material_ru": "Ткань, синтетика", "size": "По размеру окна", "article": "S.Me-ST.S.DP", "in_stock": True, "category_slug": "shtory"},
    {"title": "ЖАЛЮЗИ", "img": "/img/pagedecor/shtory/item2/item1.png",
     "description_ru": "Жалюзи — стильное и функциональное решение для оформления окон. Регулируют уровень освещения.",
     "material_ru": "Пластик, алюминий", "size": "По размеру окна", "article": "S.Me-ST.S.DP", "in_stock": True, "category_slug": "shtory",
     "colors_json": _c([
         {"name": "Белый", "hex": "#FFFFFF", "img": "/img/pagedecor/shtory/item2/item7.png"},
         {"name": "Бежевый", "hex": "#F5DEB3", "img": "/img/pagedecor/shtory/item2/item6.png"},
         {"name": "Черный", "hex": "#000000", "img": "/img/pagedecor/shtory/item2/item8.png"},
         {"name": "Тёмно-зеленый", "hex": "#184613", "img": "/img/pagedecor/shtory/item2/item4.png"},
         {"name": "Темно-синий", "hex": "#110780", "img": "/img/pagedecor/shtory/item2/item2.png"},
         {"name": "Зеленый", "hex": "#0c7b11", "img": "/img/pagedecor/shtory/item2/item3.png"},
         {"name": "Серый", "hex": "#888888", "img": "/img/pagedecor/shtory/item2/item1.png"},
         {"name": "Красный", "hex": "#d71a1a", "img": "/img/pagedecor/shtory/item2/item5.png"},
     ])},
    {"title": "ТКАНЕВЫЕ", "img": "/img/pagedecor/shtory/item1/item3.png",
     "description_ru": "Тканевые шторы — уютное и элегантное решение для оформления окон. Обеспечивают хорошую звукоизоляцию.",
     "material_ru": "Ткань, лён, хлопок", "size": "По размеру окна", "article": "S.Me-ST.S.DP", "in_stock": True, "category_slug": "shtory",
     "colors_json": _c([
         {"name": "Белый", "hex": "#FFFFFF", "img": "/img/pagedecor/shtory/item1/item1 (7).png"},
         {"name": "Бежевый", "hex": "#F5DEB3", "img": "/img/pagedecor/shtory/item1/item1.png"},
         {"name": "Черный", "hex": "#000000", "img": "/img/pagedecor/shtory/item1/item1 (1).png"},
         {"name": "Тёмно-зеленый", "hex": "#184613", "img": "/img/pagedecor/shtory/item1/item1 (4).png"},
         {"name": "Темно-синий", "hex": "#110780", "img": "/img/pagedecor/shtory/item1/item1 (3).png"},
         {"name": "Зеленый", "hex": "#0c7b11", "img": "/img/pagedecor/shtory/item1/item1 (5).png"},
         {"name": "Серый", "hex": "#888888", "img": "/img/pagedecor/shtory/item1/item1 (2).png"},
         {"name": "Красный", "hex": "#880808", "img": "/img/pagedecor/shtory/item1/item1 (6).png"},
     ])},

    # ══════════════════════════════════════════════════════════════════════════
    # РАСТЕНИЯ
    # ══════════════════════════════════════════════════════════════════════════
    {"title": "ДЕРЕВО", "img": "/img/pagedecor/rasteniya/item1/item1.png",
     "description_ru": "Деревянные растения — стильное и функциональное решение для интерьера. Добавляют уюта и тепла.",
     "material_ru": "Металл, гипс, пластик", "size": "По согласованию с заказчиком", "article": "L.DE-Ras.Der", "in_stock": True, "category_slug": "rasteniya",
     "colors_json": _c([
         {"name": "Белый", "hex": "#FFFFFF", "img": "/img/pagedecor/rasteniya/item1/item1.png"},
         {"name": "Черный", "hex": "#222222", "img": "/img/pagedecor/rasteniya/item1/item2.png"},
     ])},
    {"title": "КОМАНДНЫЕ РАСТЕНИЯ", "img": "/img/pagedecor/rasteniya/item2/item1.png",
     "description_ru": "Командные растения — идеальное решение для оформления интерьера. Добавляют живости и цвета.",
     "material_ru": "Натуральные материалы", "size": "По согласованию с заказчиком", "article": "L.DE-Ras.KomRas", "in_stock": True, "category_slug": "rasteniya",
     "colors_json": _c([
         {"name": "Белый", "hex": "#FFFFFF", "img": "/img/pagedecor/rasteniya/item2/item1.png"},
         {"name": "Черный", "hex": "#222222", "img": "/img/pagedecor/rasteniya/item2/item2.png"},
         {"name": "Серый", "hex": "#a8a49c", "img": "/img/pagedecor/rasteniya/item2/item3.png"},
     ])},
    {"title": "РАСТИТЕЛЬНОСТЬ НА СТЕНЕ", "img": "/img/pagedecor/rasteniya/item3.png",
     "description_ru": "Растительность на стене — современное решение для интерьера. Добавляет живости и цвета.",
     "material_ru": "Мох, натуральные материалы", "size": "По размеру стены", "article": "L.DE-Ras.Moh", "in_stock": True, "category_slug": "rasteniya"},

    # ══════════════════════════════════════════════════════════════════════════
    # ДОСКИ
    # ══════════════════════════════════════════════════════════════════════════
    {"title": "МАРКЕРНАЯ ДОСКА", "img": "/img/pagedecor/doski/item1.png",
     "description_ru": "Компактная модель для небольших пространств. Подходит для дома или офиса.",
     "material_ru": "Металл, лак", "size": "По согласованию с заказчиком", "article": "S.Me-ST.S.DP", "in_stock": True, "category_slug": "doski"},
    {"title": "ГРИФЕЛЬНАЯ ДОСКА", "img": "/img/pagedecor/doski/item2.png",
     "description_ru": "Грифельная доска — классическое решение для интерьера. Подходит для гостиных, спален и офисов.",
     "material_ru": "МДФ, грифельное покрытие", "size": "По согласованию с заказчиком", "article": "M.Me-ST.P.DP", "in_stock": True, "category_slug": "doski"},
    {"title": "СТЕКЛЯННАЯ ДОСКА", "img": "/img/pagedecor/doski/item3.png",
     "description_ru": "Стеклянная доска — современное решение. Добавляет света и простора в комнату.",
     "material_ru": "Закалённое стекло, металл", "size": "По согласованию с заказчиком", "article": "L.Me-ST.Mg.DP", "in_stock": True, "category_slug": "doski"},

    # ══════════════════════════════════════════════════════════════════════════
    # СТАНКИ
    # ══════════════════════════════════════════════════════════════════════════
    {"title": "UNIMAT ML 160200", "img": "/img/pagethird/stanki/item1.png",
     "description_ru": "Многофункциональный учебно-лабораторный станок для изучения основ обработки материалов, инженерии и технологий.",
     "material_ru": "Металл, пластик", "article": "S.Me-ST.S.DP", "in_stock": True, "category_slug": "stanki"},
    {"title": "UNIMAT 1 BASIC 4B1", "img": "/img/pagethird/stanki/item2.png",
     "description_ru": "Многофункциональный учебно-лабораторный станок для изучения основ обработки древесины.",
     "material_ru": "Металл, пластик", "article": "S.Me-ST.S.DP", "in_stock": True, "category_slug": "stanki"},
    {"title": "УЧЕБНЫЙ СТАНОК", "img": "/img/pagethird/stanki/item3.png",
     "description_ru": "Учебный станок для освоения базовых технологий обработки материалов и моделирования. Безопасные механизмы.",
     "material_ru": "Металл, пластик", "article": "S.Me-ST.S.DP", "in_stock": True, "category_slug": "stanki"},

    # ══════════════════════════════════════════════════════════════════════════
    # КОМПЬЮТЕРЫ
    # ══════════════════════════════════════════════════════════════════════════
    {"title": "AVTECH PRO (ПК)", "img": "/img/pagethird/computers/item1.png",
     "description_ru": "Персональный компьютер AVTECH PRO. Intel Core i3 10100, 8Gb DDR4, FullHD 23.8', Windows 10 pro.",
     "material_ru": "Металл, пластик", "article": "S.Ee-PC.MB.AVT.Pro", "in_stock": True, "category_slug": "computers"},
    {"title": "AVTECH PRO (Ноутбук)", "img": "/img/pagethird/computers/item2.png",
     "description_ru": "Ноутбук AVTECH PRO. Intel Core i3 10100, 8Gb DDR4, FullHD 14.0' IPS, Windows 11 pro.",
     "material_ru": "Металл, пластик", "article": "S.Ee-PC.NB.AVT.Pro", "in_stock": True, "category_slug": "computers"},

    # ══════════════════════════════════════════════════════════════════════════
    # ИНТЕРАКТИВНЫЕ ПАНЕЛИ
    # ══════════════════════════════════════════════════════════════════════════
    {"title": "Интерактивная панель ROQED SCIENCE", "img": "/img/pagethird/interactive/item2.png",
     "description_ru": "Интерактивная панель 65'/75'/85', 3840x2160, антибликовая антивандальная поверхность. Android 11 / Windows 11.",
     "material_ru": "Алюминий, стекло", "size": "65'-85'", "article": "L.Me-DI.UN.2500", "in_stock": True, "category_slug": "interactive"},

    # ══════════════════════════════════════════════════════════════════════════
    # ИНФОКИОСКИ
    # ══════════════════════════════════════════════════════════════════════════
    {"title": "Инфокиоск STEM", "img": "/img/pagethird/infokiosk/item1.png",
     "description_ru": "Информационный киоск с сенсорным экраном 49'. Intel Core i3 GEN6, 8Gb DDR3, SSD 128Gb, Windows 10.",
     "material_ru": "Металл, стекло", "size": "49 дюймов", "article": "S.Ee-INK.DDS.K", "in_stock": True, "category_slug": "infokiosk"},

    # ══════════════════════════════════════════════════════════════════════════
    # БЫТОВАЯ ТЕХНИКА
    # ══════════════════════════════════════════════════════════════════════════
    {"title": "Бытовая техника STEM", "img": "/img/pagethird/bytovaya/item1.png",
     "description_ru": "Бытовая техника для оснащения учебных классов и лабораторий.",
     "material_ru": "Металл, пластик", "article": "S.Ee-INK.DDS.K", "in_stock": True, "category_slug": "bytovaya"},

    # ══════════════════════════════════════════════════════════════════════════
    # 3D ПРИНТЕРЫ
    # ══════════════════════════════════════════════════════════════════════════
    {"title": "3D принтер FLASHFORGE 5M", "img": "/img/pagethird/printers3d/item1.png",
     "description_ru": "3D принтер для учебных классов. Высокая скорость печати, система циркуляции воздуха.",
     "material_ru": "Металл, пластик", "article": "M.Ee-3DP.FL.5M", "in_stock": True, "category_slug": "printers3d"},

    # ══════════════════════════════════════════════════════════════════════════
    # LABDISC
    # ══════════════════════════════════════════════════════════════════════════
    {"title": "ЦИФРОВАЯ ЛАБОРАТОРИЯ LABDISC", "img": "/img/equipment/labdisc.png",
     "description_ru": "Регистратор данных ЛабДиск для изучения Физики. Аккумулятор 150 часов, графический дисплей, Bluetooth.",
     "material_ru": "Пластик, электроника", "article": "S.Ee-INK.DDS.K", "in_stock": True, "category_slug": "labdisc"},

    # ══════════════════════════════════════════════════════════════════════════
    # ULAB
    # ══════════════════════════════════════════════════════════════════════════
    {"title": "НАБОР ULABS (Лабораторный комплект)", "img": "/img/equipment/ulab.png",
     "description_ru": "Набор ULABS для обучения по программе К-12. Для лабораторных и практических работ по биологии.",
     "material_ru": "Стекло, пластик, металл", "article": "S.Ee-INK.DD5.K", "in_stock": True, "category_slug": "ulab"},
]

inserted_prods = 0
skipped_prods = 0
for p in PRODUCTS:
    exists = db.query(Product).filter(
        Product.title == p["title"],
        Product.category_slug == p["category_slug"]
    ).first()
    if not exists:
        db.add(Product(**p))
        inserted_prods += 1
    else:
        # Update colors_json and other fields on existing products
        for key, value in p.items():
            if key != "title" and key != "category_slug":
                setattr(exists, key, value)
        skipped_prods += 1

db.commit()
db.close()

print(f"✅ Products: {inserted_prods} inserted, {skipped_prods} updated")
print()

# ─────────────────────────────────────────────────────────────────────────────
# 3. BLOG POSTS (seed the 6 original hardcoded posts)
# ─────────────────────────────────────────────────────────────────────────────
BLOG_POSTS = [
    {
        "title": "Как оснастить STEM-лабораторию под ключ",
        "slug": "kak-osnastit-stem-laboratoriyu",
        "excerpt": "Рассказываем о комплексном подходе к оснащению учебных лабораторий: от дизайн-проекта до выбора оборудования. Делимся опытом реализованных проектов.",
        "img": "/img/pagefirst/room.png",
        "category": "Обзор продукции",
        "content": json.dumps([
            "Оснащение STEM-лаборатории — это не просто покупка оборудования, а создание полноценной образовательной среды, которая стимулирует учеников к исследованию, эксперименту и творческому мышлению.",
            "Первый этап — проектирование пространства. Мы рекомендуем разделять лабораторию на зоны: теоретическую (с интерактивной панелью и доской), практическую (столы для экспериментов) и зону хранения (стеллажи и шкафы для реактивов и оборудования).",
            "Второй этап — подбор оборудования. Для школ мы рекомендуем начинать с базового набора: цифровой микроскоп, набор для химии, Arduino-кит и 3D-принтер. Этого достаточно для проведения 80% стандартных уроков.",
            "Третий этап — мебель. Лабораторные столы должны быть устойчивыми, с химически стойкой поверхностью. Стулья — регулируемыми по высоте. Мы предлагаем специализированные парты с возможностью наклона рабочей поверхности.",
            "Наша компания имеет опыт оснащения более 50 STEM-лабораторий по всему Казахстану. Мы готовы помочь на каждом этапе — от консультации до монтажа."
        ], ensure_ascii=False),
    },
    {
        "title": "Интерактивные панели в образовании: обзор 2025",
        "slug": "interaktivnye-paneli-obzor-2025",
        "excerpt": "Сравниваем актуальные модели интерактивных панелей для школ и вузов. Что выбрать в 2025 году? Разбираем характеристики, преимущества и недостатки.",
        "img": "/img/pagethird/comp.png",
        "category": "Электроника",
        "content": json.dumps([
            "Интерактивные панели стали неотъемлемой частью современного учебного процесса. В 2025 году на рынке появилось несколько интересных новинок, которые заслуживают внимания.",
            "Основные параметры выбора: диагональ (оптимально 65-75 дюймов для класса), разрешение (4K已成为 стандартом), количество касаний (минимум 20 точек одновременно), встроенная ОС (Android или Windows).",
            "Для школьных классов мы рекомендуем панели с диагональю 65 дюймов и антибликовым покрытием. Для аудиторий вузов — 75-86 дюймов с возможностью подключения нескольких устройств одновременно.",
            "Важный аспект — программное обеспечение. Обратите внимание на наличие встроенных инструментов для создания интерактивных уроков, совместимости с популярными образовательными платформами.",
            "Наши специалисты помогут подобрать оптимальную модель под ваш бюджет и задачи. Мы также осуществляем установку и обучение педагогов."
        ], ensure_ascii=False),
    },
    {
        "title": "Мебель для учебных классов: тренды и стандарты",
        "slug": "mebel-dlya-uchebnyh-klassov",
        "excerpt": "Современные тенденции в дизайне учебного пространства. Требования к мебели для образовательных учреждений согласно действующим нормам СанПиН.",
        "img": "/img/pagesecond/bb20aa.png",
        "category": "Мебель",
        "content": json.dumps([
            "Мебель для учебных классов должна соответствовать строгим требованиям СанПиН и при этом быть удобной, долговечной и эстетичной.",
            "Ключевые требования: соответствие ростовым группам учеников, устойчивость к механическим повреждениям, использование безопасных материалов (класс эмиссии формальдегида E1 или E0), легкость в уходе.",
            "Тренды 2025 года: модульная мебель, которую легко переставлять для групповой работы; столы с регулировкой высоты; стулья с эргономичной спинкой; яркие, но не отвлекающие цвета.",
            "Мы предлагаем полный ассортимент школьной мебели: парты, стулья, шкафы, стеллажи, доски. Вся продукция сертифицирована и соответствует требованиям казахстанских образовательных стандартов.",
            "Для оптовых заказов действуют специальные условия. Свяжитесь с нами для получения коммерческого предложения."
        ], ensure_ascii=False),
    },
    {
        "title": "Roqed Science: опыт использования в казахстанских школах",
        "slug": "roqed-science-opyt-ispolzovaniya",
        "excerpt": "Учителя физики, химии и биологии делятся опытом работы с платформой Roqed Science. Как цифровые лаборатории меняют подход к преподаванию точных наук.",
        "img": "/img/pagefirst/Слой1.png",
        "category": "Цифровые продукты",
        "content": json.dumps([
            "Roqed Science — это цифровая образовательная платформа, которая позволяет проводить виртуальные лабораторные работы по физике, химии и биологии.",
            "За последний год мы внедрили Roqed Science в более чем 30 школах Казахстана. Результаты впечатают: ученики стали лучше понимать сложные темы, а учителя отмечают повышение интереса к предметам.",
            "Основные преимущества платформы: безопасность (можно проводить эксперименты без риска), наглядность (3D-модели и анимации), доступность (работает на любом компьютере).",
            "Платформа поддерживает русский и казахский языки, что особенно важно для школ в регионах. Встроенная система оценки позволяет учителям отслеживать прогресс каждого ученика.",
            "Мы являемся официальным партнером Roqed в Казахстане и готовы провести демонстрацию для вашей школы."
        ], ensure_ascii=False),
    },
    {
        "title": "STEM Academia открывает новый склад в Алматы",
        "slug": "stem-academia-novyy-sklad-almaty",
        "excerpt": "С мая 2025 года мы начинаем обслуживание клиентов в Алматы напрямую со склада. Сроки доставки по югу Казахстана сократятся до 1–2 рабочих дней.",
        "img": "/img/pagefirst/plant.png",
        "category": "Новости компании",
        "content": json.dumps([
            "Рады сообщить отличную новость для наших клиентов в южных регионах Казахстана! С мая 2025 года начинает работу наш новый склад в Алматы.",
            "Это означает сокращение сроков доставки с 5-7 дней до 1-2 рабочих дней для Алматы и Алматинской области, а также для соседних регионов.",
            "На складе будет поддерживаться постоянный запас самых популярных позиций: школьная мебель, интерактивные панели, расходные материалы и оборудование для лабораторий.",
            "Для удобства клиентов в Алматы будет организован пункт самовывоза. Адрес: пр. Аль-Фараби 77/2. Режим работы: Пн-Пт 9:00-18:00.",
            "Мы продолжаем расширять географию присутствия, чтобы быть ближе к нашим клиентам по всему Казахстану."
        ], ensure_ascii=False),
    },
    {
        "title": "Arduino и LEGO в STEM-образовании: с чего начать",
        "slug": "arduino-i-lego-v-stem-obrazovanii",
        "excerpt": "Практическое руководство по интеграции Arduino и LEGO SPIKE в учебный процесс. Примеры проектов, которые можно реализовать уже с первого занятия.",
        "img": "/img/equipment/arduino.png",
        "category": "Оборудование",
        "content": json.dumps([
            "Arduino и LEGO SPIKE Prime — два самых популярных инструмента для практического STEM-обучения. Оба подхода имеют свои преимущества и отлично дополняют друг друга.",
            "Arduino идеально подходит для уроков физики и информатики: ученики собирают электрические цепи, пишут код на C++ или Python, создают проекты от простого светодиодного фонарика до метеостанции.",
            "LEGO SPIKE Prime — это конструктор с программируемым хабом, моторами и датчиками. Отлично подходит для младших классов и уроков робототехники. Дети собирают роботов и программируют их через визуальный интерфейс.",
            "Мы предлагаем готовые наборы для школ: Arduino Starter Kit (базовый и продвинутый), LEGO SPIKE Prime Education Set, а также методические материалы для учителей.",
            "Наши специалисты могут провести вводный мастер-класс для педагогов вашей школы. Свяжитесь с нами для получения подробностей."
        ], ensure_ascii=False),
    },
]

inserted_blogs = 0
for bp in BLOG_POSTS:
    exists = db.query(BlogPost).filter(BlogPost.slug == bp["slug"]).first()
    if not exists:
        db.add(BlogPost(**bp, published=True))
        inserted_blogs += 1

db.commit()
db.close()

print(f"✅ Blog posts: {inserted_blogs} inserted")
print()
print("🎉 Seed complete! The database is now populated.")
print("   Open the admin panel → Товары to see all products.")
print("   Visit /secondpage/divany etc. to see them on the frontend.")
