import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Product, Category   

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

# Создаем таблицы
Base.metadata.create_all(bind=engine)


def seed_categories(db):
    """Создаём/обновляем все категории"""
    categories = [
        
        {"slug": "furniture", "title_ru": "Мебель", "title_kz": "Мебель", "img": "", "path": "/secondpage", "parent_slug": None},
        {"slug": "divany", "title_ru": "Диваны", "title_kz": "Дивандар", "img": "/img/pagesecond/divany/divany.jpg", "path": "/secondpage/divany", "parent_slug": "furniture"},
        {"slug": "kreslo", "title_ru": "Кресла", "title_kz": "Креслолар", "img": "", "path": "/secondpage/kreslo", "parent_slug": "furniture"},
        {"slug": "pufy", "title_ru": "Пуфы", "title_kz": "Пуфтар", "img": "", "path": "/secondpage/pufy", "parent_slug": "furniture"},
        {"slug": "stellazhi", "title_ru": "Стеллажи", "title_kz": "Стеллаждар", "img": "", "path": "/secondpage/stellazhi", "parent_slug": "furniture"},
        {"slug": "tumby", "title_ru": "Тумбы", "title_kz": "Тумбалар", "img": "", "path": "/secondpage/tumby", "parent_slug": "furniture"},
        {"slug": "shkafy", "title_ru": "Шкафы", "title_kz": "Шкафтар", "img": "", "path": "/secondpage/shkafy", "parent_slug": "furniture"},
        {"slug": "stulya", "title_ru": "Стулья", "title_kz": "Орындықтар", "img": "", "path": "/secondpage/stulya", "parent_slug": "furniture"},

        {"slug": "electro", "title_ru": "Электроника и оборудование", "title_kz": "Электроника және жабдық", "img": "", "path": "/electro", "parent_slug": None},
        {"slug": "decor", "title_ru": "Декор", "title_kz": "Декор", "img": "", "path": "/decor", "parent_slug": None},
        {"slug": "equipment", "title_ru": "Оборудование", "title_kz": "Жабдық", "img": "", "path": "/equipment", "parent_slug": None},
        {"slug": "digital", "title_ru": "Цифровые решения", "title_kz": "Цифрлық шешімдер", "img": "", "path": "/digital", "parent_slug": None},

    
        {"slug": "stoly", "title_ru": "Столы", "title_kz": "Үстелдер", "img": "", "path": "/secondpage/stoly", "parent_slug": "furniture"},
        {"slug": "barnye", "title_ru": "Барные стулья", "title_kz": "Бар орындықтары", "img": "", "path": "/secondpage/stulya/barnye", "parent_slug": "stulya"},
        {"slug": "myagkie", "title_ru": "Мягкие стулья", "title_kz": "Жұмсақ орындықтар", "img": "", "path": "/secondpage/stulya/myagkie", "parent_slug": "stulya"},
        {"slug": "shkolnye", "title_ru": "Школьные стулья", "title_kz": "Мектеп орындықтары", "img": "", "path": "/secondpage/stulya/shkolnye", "parent_slug": "stulya"},
        {"slug": "vstroenye", "title_ru": "Встроенные шкафы", "title_kz": "Кіріктірілген шкафтар", "img": "", "path": "/secondpage/shkafy/vstroenye", "parent_slug": "shkafy"},
        {"slug": "standartnye", "title_ru": "Стандартные шкафы", "title_kz": "Стандарт шкафтар", "img": "", "path": "/secondpage/shkafy/standartnye", "parent_slug": "shkafy"},
        {"slug": "party", "title_ru": "Парты", "title_kz": "Парталар", "img": "", "path": "/secondpage/stoly/party", "parent_slug": "stoly"},
        {"slug": "reception", "title_ru": "Ресепшен", "title_kz": "Ресепшен", "img": "", "path": "/secondpage/stoly/reception", "parent_slug": "stoly"},
        {"slug": "spezstolytecher", "title_ru": "Спец столы для преподавателя", "title_kz": "Оқытушыларға арналған үстелдер", "img": "", "path": "/secondpage/stoly/spets-teacher", "parent_slug": "stoly"},

        {"slug": "gos", "title_ru": "Государственная символика", "title_kz": "Мемлекеттік рәміздер", "img": "/img/pagesecond/decor/gos/gos.jpg", "path": "/decor/gos", "parent_slug": "decor"},
        {"slug": "3dpanels", "title_ru": "3D панели", "title_kz": "3D панельдер", "img": "/img/pagesecond/decor/3dpanels/3d.jpg", "path": "/decor/3dpanels", "parent_slug": "decor"},
        {"slug": "lighting", "title_ru": "Освещение", "title_kz": "Жарықтандыру", "img": "/img/pagesecond/decor/lighting/light.jpg", "path": "/decor/lighting", "parent_slug": "decor"},
        {"slug": "peregorodki", "title_ru": "Перегородки", "title_kz": "Бөлімдер", "img": "/img/pagesecond/decor/peregorodki/pere.jpg", "path": "/decor/peregorodki", "parent_slug": "decor"},
        {"slug": "shtory", "title_ru": "Шторы", "title_kz": "Перделер", "img": "/img/pagesecond/decor/shtory/shtory.jpg", "path": "/decor/shtory", "parent_slug": "decor"},
        {"slug": "rasteniya", "title_ru": "Растения", "title_kz": "Өсімдіктер", "img": "/img/pagesecond/decor/rasteniya/rast.jpg", "path": "/decor/rasteniya", "parent_slug": "decor"},
        {"slug": "doski", "title_ru": "Доски", "title_kz": "Тақталар", "img": "/img/pagesecond/decor/doski/doski.jpg", "path": "/decor/doski", "parent_slug": "decor"},
    ]

    for cat_data in categories:
        existing = db.query(Category).filter_by(slug=cat_data["slug"]).first()
        if existing:
            
            for key, value in cat_data.items():
                setattr(existing, key, value)
        else:
            new_cat = Category(**cat_data)
            db.add(new_cat)

    db.commit()
    print("✅ Категории успешно созданы/обновлены.")


def seed_products(db):
    """Добавляем товары (только новые, проверка по title)"""
    products = [
    

        Product(title="Диван школьный «Комфорт» №1", img="/img/pagesecond/divany/divan1.png",
                description_ru="Мягкий диван для зон отдыха в школе...",  
                description_kz="Мектептегі демалыс аймақтарына арналған жұмсақ диван...",
                material_ru="Рогожка, берёзовый каркас", material_kz="Жөке мата, қайың каркасы",
                size="180x80x85 см", article="DIV-001", in_stock=True, category_slug="divany"),


        Product(title="Мемориальная доска с гербом РК", img="/img/pagesecond/decor/gos/gos1.png",
                description_ru="Оформление входной группы школы в государственном стиле.",
                description_kz="Мектептің кіреберісін мемлекеттік стильде безендіру.",
                material_ru="Акрил + композит", material_kz="Акрил + композит",
                size="2000×1200 мм", article="DEC-GOS-001", in_stock=True, category_slug="gos"),

        Product(title="Стенд с Конституцией Республики Казахстан", img="/img/pagesecond/decor/gos/gos2.png",
                description_ru="Информационный стенд с текстом Конституции и государственными символами.",
                description_kz="Конституция мәтіні және мемлекеттік рәміздер бар ақпараттық стенд.",
                material_ru="Композит, УФ-печать", material_kz="Композит, УФ басып шығару",
                size="1500×2000 мм", article="DEC-GOS-002", in_stock=True, category_slug="gos"),

        Product(title="3D панель Геометрия белая", img="/img/pagesecond/decor/3dpanels/3d1.png",
                description_ru="Декоративная 3D стеновая панель с геометрическим рельефом.",
                description_kz="Геометриялық рельефі бар декоративтік 3D панель.",
                material_ru="Гипсополимер", material_kz="Гипсополимер",
                size="500×500 мм", article="DEC-3D-001", in_stock=True, category_slug="3dpanels"),

        Product(title="Линейный подвесной светильник 120 см", img="/img/pagesecond/decor/lighting/light1.png",
                description_ru="Современный LED светильник для учебных классов.",
                description_kz="Оқу сыныптарына арналған заманауи LED сызықтық шам.",
                material_ru="Алюминий, акрил", material_kz="Алюминий, акрил",
                size="1200×80 мм", article="DEC-LIGHT-001", in_stock=True, category_slug="lighting"),

        Product(title="Реечная декоративная перегородка", img="/img/pagesecond/decor/peregorodki/pere1.png",
                description_ru="Акустическая реечная перегородка с растениями.",
                description_kz="Өсімдіктері бар акустикалық реечная перегородка.",
                material_ru="Дерево, металл", material_kz="Ағаш, металл",
                size="2400×1800 мм", article="DEC-PER-001", in_stock=True, category_slug="peregorodki"),

        Product(title="Рулонные шторы Blackout", img="/img/pagesecond/decor/shtory/shtora1.png",
                description_ru="Светонепроницаемые рулонные шторы для классов.",
                description_kz="Сыныптарға арналған жарық өткізбейтін ролл шторы.",
                material_ru="Ткань blackout", material_kz="Blackout мата",
                size="1500×2000 мм", article="DEC-SHT-001", in_stock=True, category_slug="shtory"),

        Product(title="Искусственное растение Банан 180 см", img="/img/pagesecond/decor/rasteniya/rast1.png",
                description_ru="Большое декоративное растение для холлов и рекреаций.",
                description_kz="Дәліздер мен рекреацияларға арналған үлкен декоративтік өсімдік.",
                material_ru="Пластик, ткань", material_kz="Пластик, мата",
                size="180 см", article="DEC-PLA-001", in_stock=True, category_slug="rasteniya"),

        Product(title="Магнитно-маркерная доска 180×120 см", img="/img/pagesecond/decor/doski/doska1.png",
                description_ru="Классическая школьная доска с магнитным покрытием.",
                description_kz="Магниттік жабыны бар классикалық мектеп тақтасы.",
                material_ru="Металл, эмаль", material_kz="Металл, эмаль",
                size="1800×1200 мм", article="DEC-DOS-001", in_stock=True, category_slug="doski"),

        # ── Диваны ─────────────────────────────────────────────────────────────
        Product(title="ДИВАН 1", img="/img/pagesecond/divany/divan1/divan1_light_gray_fabric.png",
                description_ru="Каркас: брус, фанера, дсп. Наполнение: ППУ синтепон. Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.",
                material_ru="Синтепон, велюр, пластмассовые ножки", size="По согласованию с заказчиком",
                article="L.Me-DI.UN.2500-01", in_stock=True, category_slug="divany"),
        Product(title="ДИВАН 2", img="/img/pagesecond/divany/divan2/divan2_deep_teal_blue.png",
                description_ru="Каркас: брус, фанера, дсп. Наполнение: ППУ синтепон. Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.",
                material_ru="Синтепон, велюр, пластмассовые ножки", size="По согласованию с заказчиком",
                article="L.Me-DI.UN.2500-02", in_stock=True, category_slug="divany"),
        Product(title="ДИВАН 3", img="/img/pagesecond/divany/divan3/divan3_light_beige.png",
                description_ru="Каркас: брус, фанера, дсп. Наполнение: ППУ синтепон. Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.",
                material_ru="Синтепон, велюр, пластмассовые ножки", size="По согласованию с заказчиком",
                article="L.Me-DI.UN.2500-03", in_stock=True, category_slug="divany"),
        Product(title="ДИВАН 4", img="/img/pagesecond/divany/divan4/divan4_warm_yellow-orange.png",
                description_ru="Каркас: брус, фанера, дсп. Наполнение: ППУ синтепон. Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.",
                material_ru="Синтепон, велюр, пластмассовые ножки", size="По согласованию с заказчиком",
                article="L.Me-DI.UN.2500-04", in_stock=True, category_slug="divany"),
        Product(title="ДИВАН 5", img="/img/pagesecond/divany/divan5/divan5_light_grayish-blue.png",
                description_ru="Каркас: брус, фанера, дсп. Наполнение: ППУ синтепон. Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.",
                material_ru="Синтепон, велюр, пластмассовые ножки", size="По согласованию с заказчиком",
                article="L.Me-DI.UN.2500-05", in_stock=True, category_slug="divany"),

        # ── Кресла ─────────────────────────────────────────────────────────────
        Product(title="КРЕСЛО 1", img="/img/pagesecond/kreslo/kreslo1/kreslo1_dark_green.png",
                description_ru="Каркас: стеклопластик, Ткань: велюр, микро велюр, рогожка.",
                material_ru="Стеклопластик, велюр", size="По согласованию с заказчиком",
                article="L.Me-KR.UN.900-01", in_stock=True, category_slug="kreslo"),
        Product(title="КРЕСЛО 2", img="/img/pagesecond/kreslo/kreslo2/kreslo2_rust.png",
                description_ru="Каркас: брус, фанера, дсп. Наполнение: ППУ синтепон. Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.",
                material_ru="Синтепон, велюр", size="По согласованию с заказчиком",
                article="L.Me-KR.UN.900-02", in_stock=True, category_slug="kreslo"),
        Product(title="КРЕСЛО 3", img="/img/pagesecond/kreslo/kreslo3/kreslo3_arsenic.png",
                description_ru="Каркас: брус, фанера, дсп. Наполнение: ППУ синтепон. Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.",
                material_ru="Синтепон, велюр", size="По согласованию с заказчиком",
                article="L.Me-KR.UN.900-03", in_stock=True, category_slug="kreslo"),
        Product(title="КРЕСЛО 4", img="/img/pagesecond/kreslo/kreslo4/kreslo4_red_brown.png",
                description_ru="Каркас: брус, фанера, дсп. Наполнение: ППУ синтепон. Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.",
                material_ru="Синтепон, велюр", size="По согласованию с заказчиком",
                article="L.Me-KR.UN.900-04", in_stock=True, category_slug="kreslo"),
        Product(title="КРЕСЛО 5", img="/img/pagesecond/kreslo/kreslo5/kreslo5_dark_green.png",
                description_ru="Каркас: брус, фанера, дсп. Наполнение: ППУ синтепон. Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.",
                material_ru="Синтепон, велюр", size="По согласованию с заказчиком",
                article="L.Me-KR.UN.900-05", in_stock=True, category_slug="kreslo"),
        Product(title="КРЕСЛО 6", img="/img/pagesecond/kreslo/kreslo6/kreslo6.png",
                description_ru="Каркас: брус, фанера, дсп. Наполнение: ППУ синтепон. Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.",
                material_ru="Синтепон, велюр", size="По согласованию с заказчиком",
                article="L.Me-KR.UN.900-06", in_stock=True, category_slug="kreslo"),
        Product(title="КРЕСЛО 7", img="/img/pagesecond/kreslo/kreslo7/kreslo7_light_brown.png",
                description_ru="Каркас: брус, фанера, дсп. Наполнение: ППУ синтепон. Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.",
                material_ru="Синтепон, велюр", size="По согласованию с заказчиком",
                article="L.Me-KR.UN.900-07", in_stock=True, category_slug="kreslo"),
        Product(title="КРЕСЛО 8", img="/img/pagesecond/kreslo/kreslo8/kreslo8_black.png",
                description_ru="Каркас: брус, фанера, дсп. Наполнение: ППУ синтепон. Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.",
                material_ru="Синтепон, велюр", size="По согласованию с заказчиком",
                article="L.Me-KR.UN.900-08", in_stock=True, category_slug="kreslo"),

        # ── Пуфы ───────────────────────────────────────────────────────────────
        Product(title="ПУФ 1", img="/img/pagesecond/pufy/puf1/puf1_grey.png",
                description_ru="Каркас: брус, фанера, дсп. Наполнение: ППУ синтепон. Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.",
                material_ru="Синтепон, велюр", size="По согласованию с заказчиком",
                article="L.Me-PF.UN.600-01", in_stock=True, category_slug="pufy"),
        Product(title="ПУФ 2", img="/img/pagesecond/pufy/puf2/puf2_pine_green.png",
                description_ru="Каркас: брус, фанера, дсп. Наполнение: ППУ синтепон. Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.",
                material_ru="Синтепон, велюр", size="По согласованию с заказчиком",
                article="L.Me-PF.UN.600-02", in_stock=True, category_slug="pufy"),
        Product(title="ПУФ 3", img="/img/pagesecond/pufy/puf3/.png",
                description_ru="Каркас: брус, фанера, дсп. Наполнение: ППУ синтепон. Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.",
                material_ru="Синтепон, велюр", size="По согласованию с заказчиком",
                article="L.Me-PF.UN.600-03", in_stock=True, category_slug="pufy"),
        Product(title="ПУФ 4", img="/img/pagesecond/pufy/puf4/puf4_blue.png",
                description_ru="Каркас: брус, фанера, дсп. Наполнение: ППУ синтепон. Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.",
                material_ru="Синтепон, велюр", size="По согласованию с заказчиком",
                article="L.Me-PF.UN.600-04", in_stock=True, category_slug="pufy"),
        Product(title="ПУФ 5", img="/img/pagesecond/pufy/puf5/puf5.png",
                description_ru="Каркас: брус, фанера, дсп. Наполнение: ППУ синтепон. Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.",
                material_ru="Синтепон, велюр", size="По согласованию с заказчиком",
                article="L.Me-PF.UN.600-05", in_stock=True, category_slug="pufy"),
        Product(title="ПУФ 6", img="/img/pagesecond/pufy/puf6/puf6_white.png",
                description_ru="Каркас: брус, фанера, дсп. Наполнение: ППУ синтепон. Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.",
                material_ru="Синтепон, велюр", size="По согласованию с заказчиком",
                article="L.Me-PF.UN.600-06", in_stock=True, category_slug="pufy"),
        Product(title="ПУФ 7", img="/img/pagesecond/pufy/puf7/puf7_grey.png",
                description_ru="Каркас: брус, фанера, дсп. Наполнение: ППУ синтепон. Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.",
                material_ru="Синтепон, велюр", size="По согласованию с заказчиком",
                article="L.Me-PF.UN.600-07", in_stock=True, category_slug="pufy"),
        Product(title="ПУФ 8", img="/img/pagesecond/pufy/puf8/puf8.png",
                description_ru="Каркас: брус, фанера, дсп. Наполнение: ППУ синтепон. Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.",
                material_ru="Синтепон, велюр", size="По согласованию с заказчиком",
                article="L.Me-PF.UN.600-08", in_stock=True, category_slug="pufy"),

        # ── Стеллажи ───────────────────────────────────────────────────────────
        Product(title="СТЕЛЛАЖ 1", img="/img/pagesecond/stellazhi/stellazh1.png",
                description_ru="Компактный и удобный стеллаж подойдёт для дома, офиса или магазина.",
                material_ru="ЛДСП, металл", size="1200x400x1800",
                article="L.Me-ST.UN.1200-01", in_stock=True, category_slug="stellazhi"),
        Product(title="СТЕЛЛАЖ 2", img="/img/pagesecond/stellazhi/stellazh2.png",
                description_ru="Компактный и удобный стеллаж подойдёт для дома, офиса или магазина.",
                material_ru="ЛДСП, металл", size="1200x400x1800",
                article="L.Me-ST.UN.1200-02", in_stock=True, category_slug="stellazhi"),
        Product(title="СТЕЛЛАЖ 3", img="/img/pagesecond/stellazhi/stellazh3/stellazhi3_dark.png",
                description_ru="Компактный и удобный стеллаж подойдёт для дома, офиса или магазина.",
                material_ru="ЛДСП, металл", size="1200x400x1800",
                article="L.Me-ST.UN.1200-03", in_stock=True, category_slug="stellazhi"),

        # ── Тумбы ──────────────────────────────────────────────────────────────
        Product(title="ТУМБА 1", img="/img/pagesecond/tumby/tumba1/tumba.png",
                description_ru="Удобная и практичная модель. Подходит для ежедневного использования.",
                material_ru="ЛДСП, металлическая фурнитура", size="По согласованию с заказчиком",
                article="L.Me-TU.UN.800-01", in_stock=True, category_slug="tumby"),
        Product(title="ТУМБА 2", img="/img/pagesecond/tumby/tumba2/tumba2_white.png",
                description_ru="Компактный, надёжный, функциональный.",
                material_ru="ЛДСП, металлическая фурнитура", size="По согласованию с заказчиком",
                article="L.Me-TU.UN.800-02", in_stock=True, category_slug="tumby"),

        # ── Барные стулья ──────────────────────────────────────────────────────
        Product(title="БАРНЫЙ СТУЛ 1", img="/img/pagesecond/stulya/barnye/stul10/stul10_orange.png",
                description_ru="Высота 75 см, прочный металлический каркас и мягкая обивка.",
                material_ru="Металл, велюр", size="Высота сиденья: 75 см",
                article="L.Me-BA.UN.400", in_stock=True, category_slug="barnye"),
        Product(title="БАРНЫЙ СТУЛ 2", img="/img/pagesecond/stulya/barnye/stul11/stul11.png",
                description_ru="Высота 75 см, прочный металлический каркас и мягкая обивка.",
                material_ru="Металл, велюр", size="Высота сиденья: 75 см",
                article="L.Me-BA.UN.401", in_stock=True, category_slug="barnye"),

        # ── Мягкие стулья ──────────────────────────────────────────────────────
        Product(title="МЯГКИЙ СТУЛ 1", img="/img/pagesecond/stulya/myagkie/myagkie/stul8.png",
                description_ru="Мягкий и комфортный стул с плотной обивкой и надёжным основанием.",
                material_ru="Металл, велюр", size="По согласованию с заказчиком",
                article="L.Me-MY.UN.450", in_stock=True, category_slug="myagkie"),
        Product(title="МЯГКИЙ СТУЛ 2", img="/img/pagesecond/stulya/myagkie/myagkie2/stul9_grey.png",
                description_ru="Мягкий и комфортный стул с плотной обивкой и надёжным основанием.",
                material_ru="Металл, велюр", size="По согласованию с заказчиком",
                article="L.Me-MY.UN.451", in_stock=True, category_slug="myagkie"),
        Product(title="МЯГКИЙ СТУЛ 3", img="/img/pagesecond/stulya/myagkie/myagkie3/stul7.png",
                description_ru="Мягкий и комфортный стул с плотной обивкой и надёжным основанием.",
                material_ru="Металл, велюр", size="По согласованию с заказчиком",
                article="L.Me-MY.UN.452", in_stock=True, category_slug="myagkie"),

        # ── Школьные стулья ────────────────────────────────────────────────────
        Product(title="ШКОЛЬНЫЙ СТУЛ 1", img="/img/pagesecond/stulya/shkolnye/shkolnye1/stul1_yellow.png",
                description_ru="Эргономичный школьный стул со стойкой конструкцией и устойчивой посадкой.",
                material_ru="Пластик, металл", size="По согласованию с заказчиком",
                article="L.Me-SH.UN-01", in_stock=True, category_slug="shkolnye"),
        Product(title="ШКОЛЬНЫЙ СТУЛ 2", img="/img/pagesecond/stulya/shkolnye/shkolnye2/stul1_green.png",
                description_ru="Эргономичный школьный стул со стойкой конструкцией и устойчивой посадкой.",
                material_ru="Пластик, металл", size="По согласованию с заказчиком",
                article="L.Me-SH.UN-02", in_stock=True, category_slug="shkolnye"),
        Product(title="ШКОЛЬНЫЙ СТУЛ 3", img="/img/pagesecond/stulya/shkolnye/shkolnye3/stul1_grey.png",
                description_ru="Эргономичный школьный стул со стойкой конструкцией и устойчивой посадкой.",
                material_ru="Пластик, металл", size="По согласованию с заказчиком",
                article="L.Me-SH.UN-03", in_stock=True, category_slug="shkolnye"),
        Product(title="ШКОЛЬНЫЙ СТУЛ 4", img="/img/pagesecond/stulya/shkolnye/shkolnye3/stul1_brownish_grey.png",
                description_ru="Эргономичный школьный стул со стойкой конструкцией и устойчивой посадкой.",
                material_ru="Пластик, металл", size="По согласованию с заказчиком",
                article="L.Me-SH.UN-04", in_stock=True, category_slug="shkolnye"),

        # ── Встроенные шкафы ───────────────────────────────────────────────────
        Product(title="ВСТРОЕННЫЙ ШКАФ 1", img="/img/pagesecond/shkafy/vstroenye/shkaf1/shkaf1.png",
                description_ru="Компактная модель для небольших помещений. Идеально подходит для прихожей, спальни или коридора.",
                material_ru="ЛДСП, фурнитура", size="По согласованию с заказчиком",
                article="L.Me-VS.UN-01", in_stock=True, category_slug="vstroenye"),
        Product(title="ВСТРОЕННЫЙ ШКАФ 2", img="/img/pagesecond/shkafy/vstroenye/shkaf2/shkaf1.png",
                description_ru="Компактная модель для небольших помещений. Идеально подходит для прихожей, спальни или коридора.",
                material_ru="ЛДСП, фурнитура", size="По согласованию с заказчиком",
                article="L.Me-VS.UN-02", in_stock=True, category_slug="vstroenye"),
        Product(title="ВСТРОЕННЫЙ ШКАФ 3", img="/img/pagesecond/shkafy/vstroenye/shkaf3/shkaf1.png",
                description_ru="Компактная модель для небольших помещений. Идеально подходит для прихожей, спальни или коридора.",
                material_ru="ЛДСП, фурнитура", size="По согласованию с заказчиком",
                article="L.Me-VS.UN-03", in_stock=True, category_slug="vstroenye"),

        # ── Стандартные шкафы ──────────────────────────────────────────────────
        Product(title="СТАНДАРТНЫЙ ШКАФ 1", img="/img/pagesecond/shkafy/standartnye/shkaf1_standart.png",
                description_ru="Функциональный стандартный шкаф из качественных мебельных панелей.",
                material_ru="ЛДСП, металлическая фурнитура", size="По согласованию с заказчиком",
                article="L.Me-SN.UN-01", in_stock=True, category_slug="standartnye"),

        # ── Парты ──────────────────────────────────────────────────────────────
        Product(title="ПАРТА 1", img="/img/pagesecond/stoly/party/item1.png",
                description_ru="Каркас: брус, фанера, дсп. Материал: ЛДСП, металл.",
                material_ru="ЛДСП, металл", size="По согласованию с заказчиком",
                article="S.Me-ST.PA.001", in_stock=True, category_slug="party"),
        Product(title="ПАРТА 2", img="/img/pagesecond/stoly/party/item2.png",
                description_ru="Каркас: брус, фанера, дсп. Материал: ЛДСП, МДФ, металл.",
                material_ru="ЛДСП, МДФ, металл", size="По согласованию с заказчиком",
                article="S.Me-ST.PA.002", in_stock=True, category_slug="party"),
        Product(title="ПАРТА 3", img="/img/pagesecond/stoly/party/item3.png",
                description_ru="Каркас: брус, фанера, дсп. Материал: ЛДСП, МДФ, металл.",
                material_ru="ЛДСП, МДФ, пластмасса", size="По согласованию с заказчиком",
                article="S.Me-ST.PA.003", in_stock=True, category_slug="party"),
        Product(title="ПАРТА 4", img="/img/pagesecond/stoly/party/item4.png",
                description_ru="Каркас: брус, фанера, дсп. Материал: ЛДСП, МДФ, металл.",
                material_ru="ЛДСП, металл", size="По согласованию с заказчиком",
                article="S.Me-ST.PA.004", in_stock=True, category_slug="party"),
        Product(title="ПАРТА 5", img="/img/pagesecond/stoly/party/item5.png",
                description_ru="Каркас: брус, фанера, дсп. Материал: ЛДСП, МДФ, металл.",
                material_ru="ЛДСП, металл", size="По согласованию с заказчиком",
                article="S.Me-ST.PA.005", in_stock=True, category_slug="party"),
        Product(title="ПАРТА 6", img="/img/pagesecond/stoly/party/item6.png",
                description_ru="Каркас: брус, фанера, дсп. Материал: ЛДСП, МДФ, металл.",
                material_ru="ЛДСП, металл", size="По согласованию с заказчиком",
                article="S.Me-ST.PA.006", in_stock=True, category_slug="party"),

        # ── Ресепшен ───────────────────────────────────────────────────────────
        Product(title="РЕСЕПШЕН 1", img="/img/pagesecond/stoly/reception/item1.png",
                description_ru="Стильная стойка ресепшен для школ и офисов.",
                material_ru="ЛДСП, МДФ, металл", size="По согласованию с заказчиком",
                article="S.Me-STO.RS.001", in_stock=True, category_slug="reception"),
        Product(title="РЕСЕПШЕН 2", img="/img/pagesecond/stoly/reception/item2.png",
                description_ru="Стильная стойка ресепшен для школ и офисов.",
                material_ru="ЛДСП, МДФ, металл", size="По согласованию с заказчиком",
                article="S.Me-STO.RS.002", in_stock=True, category_slug="reception"),
        Product(title="РЕСЕПШЕН 3", img="/img/pagesecond/stoly/reception/item3.png",
                description_ru="Стильная стойка ресепшен для школ и офисов.",
                material_ru="ЛДСП, МДФ, металл", size="По согласованию с заказчиком",
                article="S.Me-STO.RS.003", in_stock=True, category_slug="reception"),

        # ── Спец столы для преподавателя ───────────────────────────────────────
        Product(title="СПЕЦ СТОЛ ДЛЯ ПРЕПОДАВАТЕЛЯ 1", img="/img/pagesecond/stoly/spezstolytecher/item1_1.png",
                description_ru="Специализированный стол для преподавателя с удобной организацией рабочего пространства.",
                material_ru="ЛДСП, металл", size="По согласованию с заказчиком",
                article="S.Me-STO.SPT.001", in_stock=True, category_slug="spezstolytecher"),
        Product(title="СПЕЦ СТОЛ ДЛЯ ПРЕПОДАВАТЕЛЯ 2", img="/img/pagesecond/stoly/spezstolytecher/item2.png",
                description_ru="Специализированный стол для преподавателя с удобной организацией рабочего пространства.",
                material_ru="ЛДСП, металл", size="По согласованию с заказчиком",
                article="S.Me-STO.SPT.002", in_stock=True, category_slug="spezstolytecher"),
    ]

    existing_titles = {p.title for p in db.query(Product.title).all()}
    new_products = [p for p in products if p.title not in existing_titles]

    if new_products:
        db.add_all(new_products)
        db.commit()
        print(f"✅ Добавлено {len(new_products)} новых товаров.")
    else:
        print("ℹ️  Новых товаров для добавления не найдено.")


def seed():
    db = SessionLocal()
    try:
        print("🚀 Запуск сидирования базы данных...")

        seed_categories(db)      
        seed_products(db)       

        print("🎉 Сидирование завершено успешно!")

    except Exception as e:
        db.rollback()
        print(f"❌ Ошибка: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()