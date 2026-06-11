"""
seed_db.py  —  Populate the database with admin user, categories and products.
Runs automatically on every 'docker compose up' (after alembic upgrade head).
All operations are idempotent — safe to run multiple times.
"""
from database import SessionLocal, engine
from models import Base, Category, Product, User
from passlib.context import CryptContext

# ─── Ensure tables exist ───────────────────────────────────────────────────────
Base.metadata.create_all(bind=engine)

db = SessionLocal()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ─────────────────────────────────────────────────────────────────────────────
# 0. ADMIN USER  (credentials come from .env, never hardcoded in source)
# ─────────────────────────────────────────────────────────────────────────────
import os
from dotenv import load_dotenv
load_dotenv()  # reads /app/.env (mounted via docker-compose env_file)

ADMIN_EMAIL    = os.environ.get("ADMIN_EMAIL",    "")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "")
ADMIN_NAME     = os.environ.get("ADMIN_NAME",     "")

existing_admin = db.query(User).filter(User.email == ADMIN_EMAIL).first()
if not existing_admin:
    hashed = pwd_context.hash(ADMIN_PASSWORD)
    db.add(User(
        name=ADMIN_NAME,
        email=ADMIN_EMAIL,
        password=hashed,
        is_admin=True,
    ))
    db.commit()
    print(f"✅ Admin user created: {ADMIN_EMAIL}")
else:
    # Always sync password + is_admin flag from .env on every boot
    existing_admin.is_admin = True
    existing_admin.password = pwd_context.hash(ADMIN_PASSWORD)
    db.commit()
    print(f"✅ Admin user verified/updated: {ADMIN_EMAIL}")


# ─────────────────────────────────────────────────────────────────────────────
# 1. CATEGORIES
# ─────────────────────────────────────────────────────────────────────────────
CATEGORIES = [
    {"slug": "divany",          "title_ru": "Диваны",              "img": "/img/pagesecond/a1a32584672.png",    "path": "/secondpage/divany"},
    {"slug": "kreslo",          "title_ru": "Кресла",              "img": "/img/pagesecond/738d1eff.png",       "path": "/secondpage/kreslo"},
    {"slug": "pufy",            "title_ru": "Пуфы",                "img": "/img/pagesecond/a41bcac159.png",     "path": "/secondpage/pufy"},
    {"slug": "stellazhi",       "title_ru": "Стеллажи",            "img": "/img/pagesecond/e0f5951d3c3.png",    "path": "/secondpage/stellazhi"},
    {"slug": "tumby",           "title_ru": "Тумбы",               "img": "/img/pagesecond/4d735992.png",       "path": "/secondpage/tumby"},
    {"slug": "myagkie",         "title_ru": "Мягкие стулья",       "img": "/img/pagesecond/stulya/myagkie.png", "path": "/secondpage/stulya/myagkie",  "parent_slug": "stulya"},
    {"slug": "barnye",          "title_ru": "Барные стулья",       "img": "/img/pagesecond/stulya/barnye.png",  "path": "/secondpage/stulya/barnye",   "parent_slug": "stulya"},
    {"slug": "shkolnye",        "title_ru": "Школьные стулья",     "img": "/img/pagesecond/stulya/shkolnye.png","path": "/secondpage/stulya/shkolnye", "parent_slug": "stulya"},
    {"slug": "party",           "title_ru": "Party стулья",        "img": "/img/pagesecond/stulya/party.png",   "path": "/secondpage/stulya/party",    "parent_slug": "stulya"},
    {"slug": "reception",       "title_ru": "Reception стулья",    "img": "/img/pagesecond/stulya/reception.png","path": "/secondpage/stulya/reception","parent_slug": "stulya"},
    {"slug": "standartnye",     "title_ru": "Стандартные шкафы",   "img": "/img/pagesecond/shkafy/shkaf1_standart.png","path": "/secondpage/shkafy/standartnye","parent_slug": "shkafy"},
    {"slug": "vstroenye",       "title_ru": "Встроенные шкафы",    "img": "/img/pagesecond/shkafy/vstroenye.png","path": "/secondpage/shkafy/vstroenye","parent_slug": "shkafy"},
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

db.commit()
print(f"✅ Categories: {inserted_cats} inserted")

# ─────────────────────────────────────────────────────────────────────────────
# 2. PRODUCTS
# ─────────────────────────────────────────────────────────────────────────────
PRODUCTS = [
    # ── ДИВАНЫ ──────────────────────────────────────────────────────────────
    {"title": "ДИВАН 1", "img": "/img/pagesecond/divany/divan1/divan1_light_gray_fabric.png",
     "description_ru": "Каркас: брус, фанера, дсп. Наполнение: ППУ синтепон. Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.",
     "material_ru": "Синтепон, мягкая поверхность, велкро, пластмассовые ножки",
     "size": "По согласованию с заказчиком", "article": "L.Me-DI.UN.2500", "in_stock": True, "category_slug": "divany"},
    {"title": "ДИВАН 2", "img": "/img/pagesecond/divany/divan2/divan2_deep_teal_blue.png",
     "description_ru": "Каркас: брус, фанера, дсп Наполнение: ППУ синтепон Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.",
     "material_ru": "Синтепон, мягкая поверхность, велкро, пластмассовые ножки",
     "size": "По согласованию с заказчиком", "article": "L.Me-DI.UN.2500", "in_stock": True, "category_slug": "divany"},
    {"title": "ДИВАН 3", "img": "/img/pagesecond/divany/divan3/divan3_light_beige.png",
     "description_ru": "Каркас: брус, фанера, дсп Наполнение: ППУ синтепон Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.",
     "material_ru": "Синтепон, мягкая поверхность, велкро, пластмассовые ножки",
     "size": "По согласованию с заказчиком", "article": "L.Me-DI.UN.2500", "in_stock": True, "category_slug": "divany"},
    {"title": "ДИВАН 4", "img": "/img/pagesecond/divany/divan4/divan4_warm_yellow-orange.png",
     "description_ru": "Каркас: брус, фанера, дсп Наполнение: ППУ синтепон Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.",
     "material_ru": "Синтепон, мягкая поверхность, велкро, пластмассовые ножки",
     "size": "По согласованию с заказчиком", "article": "L.Me-DI.UN.2500", "in_stock": True, "category_slug": "divany"},
    {"title": "ДИВАН 5", "img": "/img/pagesecond/divany/divan5/divan5_light_grayish-blue.png",
     "description_ru": "Каркас: брус, фанера, дсп Наполнение: ППУ синтепон Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.",
     "material_ru": "Синтепон, мягкая поверхность, велкро, пластмассовые ножки",
     "size": "По согласованию с заказчиком", "article": "L.Me-DI.UN.2500", "in_stock": True, "category_slug": "divany"},

    # ── КРЕСЛА ──────────────────────────────────────────────────────────────
    {"title": "КРЕСЛО 1", "img": "/img/pagesecond/kreslo/kreslo1/kreslo1_dark_green.png",
     "description_ru": "Каркас: стеклопластик, Ткань: велюр, микро велюр, рогожка.",
     "material_ru": "Синтепон, мягкая поверхность, велкро, пластмассовые ножки",
     "size": "Ширина 94 см, Высота 120 см, Глубина 87 см", "article": "L.Me-KR.UN.900", "in_stock": True, "category_slug": "kreslo"},
    {"title": "КРЕСЛО 2", "img": "/img/pagesecond/kreslo/kreslo2/kreslo2_rust.png",
     "description_ru": "Каркас: брус, фанера, дсп Наполнение: ППУ синтепон Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.",
     "material_ru": "Синтепон, мягкая поверхность, велкро, пластмассовые ножки",
     "size": "По согласованию с заказчиком", "article": "L.Me-KR.UN.900", "in_stock": True, "category_slug": "kreslo"},
    {"title": "КРЕСЛО 3", "img": "/img/pagesecond/kreslo/kreslo3/kreslo3_arsenic.png",
     "description_ru": "Каркас: брус, фанера, дсп Наполнение: ППУ синтепон Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.",
     "material_ru": "Синтепон, мягкая поверхность, велкро, пластмассовые ножки",
     "size": "По согласованию с заказчиком", "article": "L.Me-KR.UN.900", "in_stock": True, "category_slug": "kreslo"},
    {"title": "КРЕСЛО 4", "img": "/img/pagesecond/kreslo/kreslo4/kreslo4_red_brown.png",
     "description_ru": "Вращающееся сиденье, регулируемое по высоте. Каркас из мультиплекса.",
     "material_ru": "Синтепон, мягкая поверхность, велкро, пластмассовые ножки",
     "size": "Ширина: 62 см, Высота: 71-80 см, Глубина: 63 см", "article": "L.Me-KR.UN.900", "in_stock": True, "category_slug": "kreslo"},
    {"title": "КРЕСЛО 5", "img": "/img/pagesecond/kreslo/kreslo5/kreslo5_dark_green.png",
     "description_ru": "Материал: Ткань, Металл, Пластик. Ножка из металла с эпоксидным покрытием.",
     "material_ru": "Синтепон, мягкая поверхность, велкро, пластмассовые ножки",
     "size": "Длина 68.5 см, Ширина 68.5 см, Высота 104.5-115.5 см", "article": "L.Me-KR.UN.900", "in_stock": True, "category_slug": "kreslo"},
    {"title": "КРЕСЛО 6", "img": "/img/pagesecond/kreslo/kreslo6/kreslo6.png",
     "description_ru": "Материал спинки: сетка. Материал сиденья: ткань, сетка. Механизм качания: мультиблок.",
     "material_ru": "Синтепон, мягкая поверхность, велкро, пластмассовые ножки",
     "size": "Высота кресла 105-116 см, Высота опоры 45 см", "article": "L.Me-KR.UN.900", "in_stock": True, "category_slug": "kreslo"},
    {"title": "КРЕСЛО 7", "img": "/img/pagesecond/kreslo/kreslo7/kreslo7_light_brown.png",
     "description_ru": "Крестовина и подлокотники — хром. Обивка: экокожа. Максимальная нагрузка: 120 кг.",
     "material_ru": "Синтепон, мягкая поверхность, велкро, пластмассовые ножки",
     "size": "Высота 106 см, Ширина 42 см, Глубина 46 см", "article": "L.Me-KR.UN.900", "in_stock": True, "category_slug": "kreslo"},
    {"title": "КРЕСЛО 8", "img": "/img/pagesecond/kreslo/kreslo8/kreslo8_black.png",
     "description_ru": "Комфортное кресло с регулировкой и мягкой обивкой, созданное для работы и отдыха.",
     "material_ru": "Синтепон, мягкая поверхность, велкро, пластмассовые ножки",
     "size": "900x850x450", "article": "L.Me-KR.UN.900", "in_stock": True, "category_slug": "kreslo"},

    # ── ПУФЫ ────────────────────────────────────────────────────────────────
    {"title": "ПУФ 1", "img": "/img/pagesecond/pufy/puf1/puf1_grey.png",
     "description_ru": "Каркас: брус, фанера, дсп Наполнение: ППУ синтепон Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.",
     "material_ru": "Синтепон, мягкая поверхность, велкро, пластмассовые ножки",
     "size": "По согласованию с заказчиком", "article": "L.Me-PF.UN.600", "in_stock": True, "category_slug": "pufy"},
    {"title": "ПУФ 2", "img": "/img/pagesecond/pufy/puf2/puf2_pine_green.png",
     "description_ru": "Каркас: брус, фанера, дсп Наполнение: ППУ синтепон Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.",
     "material_ru": "Синтепон, мягкая поверхность, велкро, пластмассовые ножки",
     "size": "По согласованию с заказчиком", "article": "L.Me-PF.UN.600", "in_stock": True, "category_slug": "pufy"},
    {"title": "ПУФ 3", "img": "/img/pagesecond/pufy/puf3/puf3_golden_brown.png",
     "description_ru": "Каркас: брус, фанера, дсп Наполнение: ППУ синтепон Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.",
     "material_ru": "Синтепон, мягкая поверхность, велкро, пластмассовые ножки",
     "size": "По согласованию с заказчиком", "article": "L.Me-PF.UN.600", "in_stock": True, "category_slug": "pufy"},
    {"title": "ПУФ 4", "img": "/img/pagesecond/pufy/puf4/puf4_blue.png",
     "description_ru": "Каркас: брус, фанера, дсп Наполнение: ППУ синтепон Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.",
     "material_ru": "Синтепон, мягкая поверхность, велкро, пластмассовые ножки",
     "size": "По согласованию с заказчиком", "article": "L.Me-PF.UN.600", "in_stock": True, "category_slug": "pufy"},
    {"title": "ПУФ 5", "img": "/img/pagesecond/pufy/puf5/puf5.png",
     "description_ru": "Каркас: брус, фанера, дсп Наполнение: ППУ синтепон Ткань: экокожа, кожзам.",
     "material_ru": "Синтепон, мягкая поверхность, велкро, пластмассовые ножки",
     "size": "По согласованию с заказчиком", "article": "L.Me-PF.UN.600", "in_stock": True, "category_slug": "pufy"},
    {"title": "ПУФ 6", "img": "/img/pagesecond/pufy/puf6/puf6_white.png",
     "description_ru": "Каркас: брус, фанера, дсп Наполнение: ППУ синтепон Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.",
     "material_ru": "Синтепон, мягкая поверхность, велкро, пластмассовые ножки",
     "size": "По согласованию с заказчиком", "article": "L.Me-PF.UN.600", "in_stock": True, "category_slug": "pufy"},
    {"title": "ПУФ 7", "img": "/img/pagesecond/pufy/puf7/puf7_grey.png",
     "description_ru": "Каркас: брус, фанера, дсп Наполнение: ППУ синтепон Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.",
     "material_ru": "Синтепон, мягкая поверхность, велкро, пластмассовые ножки",
     "size": "По согласованию с заказчиком", "article": "L.Me-PF.UN.600", "in_stock": True, "category_slug": "pufy"},
    {"title": "ПУФ 8", "img": "/img/pagesecond/pufy/puf8/puf8.png",
     "description_ru": "Каркас: брус, фанера, дсп Наполнение: ППУ синтепон Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.",
     "material_ru": "Синтепон, мягкая поверхность, велкро, пластмассовые ножки",
     "size": "По согласованию с заказчиком", "article": "L.Me-PF.UN.600", "in_stock": True, "category_slug": "pufy"},

    # ── СТЕЛЛАЖИ ────────────────────────────────────────────────────────────
    {"title": "СТЕЛЛАЖ 1", "img": "/img/pagesecond/stellazhi/stellazh1.png",
     "description_ru": "Компактный и удобный стеллаж подойдёт для дома, офиса или магазина.",
     "material_ru": "Синтепон, мягкая поверхность, велкро, пластмассовые ножки",
     "size": "1200x400x1800", "article": "L.Me-ST.UN.1200", "in_stock": True, "category_slug": "stellazhi"},
    {"title": "СТЕЛЛАЖ 2", "img": "/img/pagesecond/stellazhi/stellazh2.png",
     "description_ru": "Компактный и удобный стеллаж подойдёт для дома, офиса или магазина.",
     "material_ru": "Синтепон, мягкая поверхность, велкро, пластмассовые ножки",
     "size": "1200x400x1800", "article": "L.Me-ST.UN.1200", "in_stock": True, "category_slug": "stellazhi"},
    {"title": "СТЕЛЛАЖ 3", "img": "/img/pagesecond/stellazhi/stellazh3/stellazhi3_dark.png",
     "description_ru": "Компактный и удобный стеллаж подойдёт для дома, офиса или магазина.",
     "material_ru": "Синтепон, мягкая поверхность, велкро, пластмассовые ножки",
     "size": "1200x400x1800", "article": "L.Me-ST.UN.1200", "in_stock": True, "category_slug": "stellazhi"},

    # ── ТУМБЫ ───────────────────────────────────────────────────────────────
    {"title": "ТУМБА 1", "img": "/img/pagesecond/tumby/tumba1/tumba.png",
     "description_ru": "Удобная и практичная модель. Подходит для ежедневного использования.",
     "material_ru": "Синтепон, мягкая поверхность, велкро, пластмассовые ножки",
     "size": "800x400x600", "article": "L.Me-TU.UN.800", "in_stock": True, "category_slug": "tumby"},
    {"title": "ТУМБА 2", "img": "/img/pagesecond/tumby/tumba2/tumba2_white.png",
     "description_ru": "Компактный, надёжный, функциональный. Отличается небольшими конструктивными особенностями.",
     "material_ru": "Синтепон, мягкая поверхность, велкро, пластмассовые ножки",
     "size": "800x400x600", "article": "L.Me-TU.UN.800", "in_stock": True, "category_slug": "tumby"},

    # ── МЯГКИЕ СТУЛЬЯ ───────────────────────────────────────────────────────
    {"title": "МЯГКИЙ СТУЛ 1", "img": "/img/pagesecond/stulya/myagkie/myagkie/stul8.png",
     "description_ru": "Мягкий и комфортный стул с плотной обивкой и надёжным основанием.",
     "material_ru": "Синтепон, мягкая поверхность, велкро, пластмассовые ножки",
     "size": "450x450x900", "article": "L.Me-MY.UN.450", "in_stock": True, "category_slug": "myagkie"},
    {"title": "МЯГКИЙ СТУЛ 2", "img": "/img/pagesecond/stulya/myagkie/myagkie2/stul9_grey.png",
     "description_ru": "Мягкий и комфортный стул с плотной обивкой и надёжным основанием.",
     "material_ru": "Синтепон, мягкая поверхность, велкро, пластмассовые ножки",
     "size": "450x450x900", "article": "L.Me-MY.UN.451", "in_stock": True, "category_slug": "myagkie"},
    {"title": "МЯГКИЙ СТУЛ 3", "img": "/img/pagesecond/stulya/myagkie/myagkie3/stul7.png",
     "description_ru": "Мягкий и комфортный стул с плотной обивкой и надёжным основанием.",
     "material_ru": "Синтепон, мягкая поверхность, велкро, пластмассовые ножки",
     "size": "450x450x900", "article": "L.Me-MY.UN.452", "in_stock": True, "category_slug": "myagkie"},

    # ── БАРНЫЕ СТУЛЬЯ ───────────────────────────────────────────────────────
    {"title": "БАРНЫЙ СТУЛ 1", "img": "/img/pagesecond/stulya/barnye/stul10/stul10_orange.png",
     "description_ru": "Высота 75 см, прочный металлический каркас и мягкая обивка.",
     "material_ru": "Синтепон, мягкая поверхность, велкро, металлические ножки",
     "size": "400x400x750", "article": "L.Me-BA.UN.400", "in_stock": True, "category_slug": "barnye"},
    {"title": "БАРНЫЙ СТУЛ 2", "img": "/img/pagesecond/stulya/barnye/stul11/stul11.png",
     "description_ru": "Высота 75 см, прочный металлический каркас и мягкая обивка.",
     "material_ru": "Синтепон, мягкая поверхность, велкро, металлические ножки",
     "size": "400x400x750", "article": "L.Me-BA.UN.401", "in_stock": True, "category_slug": "barnye"},
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
        skipped_prods += 1

db.commit()
db.close()

print(f"✅ Products: {inserted_prods} inserted, {skipped_prods} already existed")
print()
print("🎉 Seed complete! The database is now populated.")
print("   Open the admin panel → Товары to see all products.")
print("   Visit /secondpage/divany etc. to see them on the frontend.")
