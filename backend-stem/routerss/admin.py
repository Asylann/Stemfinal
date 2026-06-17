"""
Admin router — all endpoints require a valid JWT that belongs to a user with is_admin=True.
Unauthenticated requests → 401
Authenticated non-admin requests → 403
Missing resources → 404

Admin bootstrap: set ADMIN_EMAIL in .env. After running the Alembic migration that adds
is_admin, run the management command inside the container:
    docker exec stem_backend python -c "
    from database import SessionLocal; from models import User; import os
    db = SessionLocal()
    u = db.query(User).filter(User.email == os.getenv('ADMIN_EMAIL')).first()
    if u: u.is_admin = True; db.commit(); print('Done')
    else: print('User not found')
    db.close()
    "
"""

import json
import re
import os
from typing import Optional

import httpx
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
from models import Application, BlogPost, Category, Product, User
from routerss.auth import get_current_admin
from sqlalchemy.orm import joinedload

router = APIRouter()


# ─── Pydantic schemas ──────────────────────────────────────────────────────────

class ProductCreate(BaseModel):
    title: str
    img: Optional[str] = None
    description_ru: Optional[str] = None
    description_kz: Optional[str] = None
    material_ru: Optional[str] = None
    material_kz: Optional[str] = None
    size: Optional[str] = None
    article: Optional[str] = None
    in_stock: bool = True
    category_slug: Optional[str] = None


class ProductUpdate(BaseModel):
    title: Optional[str] = None
    img: Optional[str] = None
    description_ru: Optional[str] = None
    description_kz: Optional[str] = None
    material_ru: Optional[str] = None
    material_kz: Optional[str] = None
    size: Optional[str] = None
    article: Optional[str] = None
    in_stock: Optional[bool] = None
    category_slug: Optional[str] = None


class CategoryCreate(BaseModel):
    slug: str
    title_ru: str
    title_kz: Optional[str] = None
    img: Optional[str] = None
    path: Optional[str] = None
    parent_slug: Optional[str] = None


class CategoryUpdate(BaseModel):
    slug: Optional[str] = None
    title_ru: Optional[str] = None
    title_kz: Optional[str] = None
    img: Optional[str] = None
    path: Optional[str] = None
    parent_slug: Optional[str] = None


# ─── Helper serialisers ────────────────────────────────────────────────────────

def _product_out(p: Product) -> dict:
    return {
        "id": p.id,
        "title": p.title,
        "img": p.img,
        "description_ru": p.description_ru,
        "description_kz": p.description_kz,
        "material_ru": p.material_ru,
        "material_kz": p.material_kz,
        "size": p.size,
        "article": p.article,
        "in_stock": p.in_stock,
        "category_slug": p.category_slug,
    }


def _category_out(c: Category) -> dict:
    return {
        "id": c.id,
        "slug": c.slug,
        "title_ru": c.title_ru,
        "title_kz": c.title_kz,
        "img": c.img,
        "path": c.path,
        "parent_slug": c.parent_slug,
    }


# ─── Application status labels (fallback for apps without Bitrix) ────────────────
STATUS_LABELS_RU = {
    "new":          "Новая",
    "preparing":    "Подготовка",
    "invoicing":    "Счёт отправлен",
    "processing":   "В работе",
    "final_invoice":"Финальный счёт",
    "paid":         "Оплачено",
    "completed":    "Завершена",
    "closed":       "Закрыта",
    "rejected":     "Отклонено",
    "unknown":      "Неизвестно",
}


def _application_out(a: Application) -> dict:
    return {
        "id": a.id,
        "name": a.name,
        "phone": a.phone,
        "username": a.username,
        "comment": a.comment,
        "product_name": a.product_name,
        "article": a.article,
        "product_url": a.product_url,
        "status": a.status,
        "label_ru": a.bitrix_stage_name or STATUS_LABELS_RU.get(a.status or "new", "Новая"),
        "bitrix_id": a.bitrix_id,
        "bitrix_stage_name": a.bitrix_stage_name,
        "manager_id": a.manager_id,
        "manager_name": a.manager_name,
        "created_at": a.created_at,
        "updated_at": a.updated_at,
    }


def _user_out(u: User) -> dict:
    apps = []
    if u.applications:
        apps = [
            {
                "id": a.id,
                "name": a.name,
                "phone": a.phone,
                "product_name": a.product_name,
                "article": a.article,
                "comment": a.comment,
                "status": a.status,
                "created_at": a.created_at,
            }
            for a in u.applications
        ]
    return {
        "id": u.id,
        "name": u.name,
        "email": u.email,
        "phone": u.phone,
        "is_admin": u.is_admin,
        "daily_visualize_count": u.daily_visualize_count or 0,
        "last_visualize_date": u.last_visualize_date,
        "applications": apps,
    }


# ─── Admin identity ────────────────────────────────────────────────────────────

@router.get("/me")
def admin_me(current_admin: User = Depends(get_current_admin)):
    """Confirm the calling user is admin and return their profile."""
    return _user_out(current_admin)


# ─── Products ─────────────────────────────────────────────────────────────────

@router.get("/products")
def admin_get_products(
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    return [_product_out(p) for p in db.query(Product).all()]


@router.post("/products", status_code=201)
def admin_create_product(
    data: ProductCreate,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    product = Product(**data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return _product_out(product)


@router.put("/products/{product_id}")
def admin_update_product(
    product_id: int,
    data: ProductUpdate,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар не найден")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(product, field, value)
    db.commit()
    db.refresh(product)
    return _product_out(product)


@router.delete("/products/{product_id}", status_code=204)
def admin_delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар не найден")
    db.delete(product)
    db.commit()
    return None


# ─── Categories ───────────────────────────────────────────────────────────────

@router.get("/categories")
def admin_get_categories(
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    return [_category_out(c) for c in db.query(Category).all()]


@router.post("/categories", status_code=201)
def admin_create_category(
    data: CategoryCreate,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    if db.query(Category).filter(Category.slug == data.slug).first():
        raise HTTPException(status_code=400, detail="Категория с таким slug уже существует")
    category = Category(**data.model_dump())
    db.add(category)
    db.commit()
    db.refresh(category)
    return _category_out(category)


@router.put("/categories/{category_id}")
def admin_update_category(
    category_id: int,
    data: CategoryUpdate,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Категория не найдена")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(category, field, value)
    db.commit()
    db.refresh(category)
    return _category_out(category)


@router.delete("/categories/{category_id}", status_code=204)
def admin_delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Категория не найдена")
    db.delete(category)
    db.commit()
    return None


# ─── Applications (Orders from customers) ─────────────────────────────────────

@router.get("/applications")
async def admin_get_applications(
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    # Auto-sync Bitrix statuses before returning
    await _sync_bitrix_statuses(db)
    return [_application_out(a) for a in db.query(Application).order_by(Application.id.desc()).all()]


# ─── Bitrix auto-sync helper ──────────────────────────────────────────────────

_BITRIX_WEBHOOK_READ = os.getenv("BITRIX_WEBHOOK_URL_READ") or os.getenv("BITRIX_WEBHOOK_URL")

_BITRIX_STAGE_MAP = {
    # ── Their Bitrix24 pipeline (28 stages, sorted by SORT) ─────────────────
    "UC_4PQZ76":    "new",         # 10 Заявка с сайта
    "UC_3AWFVA":    "preparing",   # 20 Название
    "5":            "new",         # 30 Новая заявка
    "UC_NRSMGI":    "preparing",   # 40 Разработка дизайна
    "NEW":          "invoicing",   # 50 Согласование коммерческого предложения
    "UC_4MBDJM":    "processing",  # 60 Омаркет
    "EXECUTING":    "processing",  # 70 Прямые договоры
    "PREPARATION":  "processing",  # 80 Техническая спецификация
    "UC_3JQFQN":    "processing",  # 90 ТС на проверку
    "UC_E0IW0O":    "processing",  # 100 ТС готовые на выдачу
    "4":            "completed",   # 110 1 Мониторинг
    "UC_DVLQ0A":    "completed",   # 120 Мониторинг (планы)
    "UC_0FXBOL":    "processing",  # 130 2 Регистрация проекта
    "UC_2182MG":    "processing",  # 140 3 Обсуждение
    "UC_KIQRUF":    "processing",  # 150 4 Прием заявок
    "UC_XRXQRE":    "processing",  # 160 5 Рассмотрение заявок
    "6":            "processing",  # 170 6 Обжалование 3 р.д.
    "7":            "processing",  # 180 7 Рассмотрение жалобы 3 р.д.
    "UC_H14MED":    "processing",  # 190 8 Аудит
    "UC_IZXLGI":    "processing",  # 200 9 Ожидаем договор
    "8":            "processing",  # 210 10 Согласование Договора
    "FINAL_INVOICE":"final_invoice",# 220 11 Договор
    "2":            "processing",  # 230 12 Реализация
    "3":            "completed",   # 240 13 Закрытие договора/Контроль качества
    "1":            "completed",   # 250 Обучение
    "WON":          "completed",   # 260 Сделка успешна
    "LOSE":         "rejected",    # 270 Сделка провалена
    "9":            "rejected",    # 280 Нецелевая заявка
    # Fallbacks
    "PREPAYMENT_INVOICING": "invoicing",
    "PREPAID":              "paid",
    "CLOSED":               "closed",
}


def _map_stage(stage_id: str) -> str:
    if not stage_id:
        return "unknown"
    clean = stage_id.split(":")[-1] if ":" in stage_id else stage_id
    return _BITRIX_STAGE_MAP.get(clean, "unknown")


async def _sync_bitrix_statuses(db: Session) -> None:
    """
    Fetch current deal statuses from Bitrix24 for all applications with a bitrix_id
    and update local DB rows. Also fetches human-readable stage names. Silently skips on errors.
    """
    if not _BITRIX_WEBHOOK_READ:
        return

    apps = db.query(Application).filter(Application.bitrix_id.isnot(None)).all()
    if not apps:
        return

    base_url = _BITRIX_WEBHOOK_READ.rstrip("/")

    # Fetch stage name lookup from Bitrix24
    stage_names = {}
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.post(f"{base_url}/crm.status.list", json={"filter": {"ENTITY_ID": "DEAL_STAGE"}})
            resp.raise_for_status()
            for item in resp.json().get("result", []):
                stage_names[item["STATUS_ID"]] = item["NAME"]
    except Exception:
        pass  # fall back to empty stage_names

    async with httpx.AsyncClient(timeout=15) as client:
        for app in apps:
            try:
                resp = await client.post(f"{base_url}/crm.deal.get", json={"id": app.bitrix_id})
                resp.raise_for_status()
                deal = resp.json().get("result", {})
                if not deal:
                    continue

                stage_id = deal.get("STAGE_ID", "")
                new_status = _map_stage(stage_id)
                manager_name = deal.get("ASSIGNED_BY_NAME") or deal.get("CREATED_BY_NAME")
                manager_id_raw = deal.get("ASSIGNED_BY_ID") or deal.get("CREATED_BY_ID")

                app.status = new_status
                app.bitrix_stage_id = stage_id
                app.bitrix_stage_name = stage_names.get(stage_id, "")
                if manager_name:
                    app.manager_name = manager_name
                if manager_id_raw:
                    try:
                        app.manager_id = int(manager_id_raw)
                    except (ValueError, TypeError):
                        pass

                from datetime import datetime
                app.updated_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            except Exception:
                continue  # skip individual errors

    db.commit()


class ApplicationUpdate(BaseModel):
    status: Optional[str] = None
    manager_name: Optional[str] = None
    manager_id: Optional[int] = None


VALID_STATUSES = {"new", "preparing", "invoicing", "processing", "final_invoice", "paid", "completed", "closed"}


@router.put("/applications/{application_id}")
def admin_update_application(
    application_id: int,
    data: ApplicationUpdate,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    """
    Update an application's status and/or manager.
    Valid statuses: new, preparing, invoicing, processing, final_invoice, paid, completed, closed.
    """
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Заявка не найдена")

    if data.status is not None:
        if data.status not in VALID_STATUSES:
            raise HTTPException(
                status_code=400,
                detail=f"Недопустимый статус '{data.status}'. Допустимые: {', '.join(sorted(VALID_STATUSES))}"
            )
        application.status = data.status

    if data.manager_name is not None:
        application.manager_name = data.manager_name
    if data.manager_id is not None:
        application.manager_id = data.manager_id

    from datetime import datetime
    application.updated_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    db.commit()
    db.refresh(application)
    return _application_out(application)


@router.delete("/applications/{application_id}", status_code=204)
def admin_delete_application(
    application_id: int,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Заявка не найдена")
    db.delete(application)
    db.commit()
    return None


# ─── Users ────────────────────────────────────────────────────────────────────

@router.get("/users")
def admin_get_users(
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    users = (
        db.query(User)
        .options(joinedload(User.applications))
        .all()
    )
    return [_user_out(u) for u in users]


# ─── Blog Posts ───────────────────────────────────────────────────────────────

class BlogPostCreate(BaseModel):
    title: str
    slug: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None       # JSON array of paragraphs
    img: Optional[str] = None
    category: Optional[str] = None
    published: bool = True


class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    img: Optional[str] = None
    category: Optional[str] = None
    published: Optional[bool] = None


def _blog_post_out(p: BlogPost) -> dict:
    content = p.content or ""
    paragraphs = []
    try:
        parsed = json.loads(content)
        if isinstance(parsed, list):
            paragraphs = parsed
        else:
            paragraphs = [content]
    except (json.JSONDecodeError, TypeError):
        paragraphs = [content] if content else []

    return {
        "id": p.id,
        "title": p.title,
        "slug": p.slug,
        "excerpt": p.excerpt,
        "content": paragraphs,
        "img": p.img,
        "category": p.category,
        "published": p.published,
        "created_at": p.created_at,
    }


def _auto_slug(title: str) -> str:
    s = title.lower().strip()
    s = re.sub(r'[^a-zа-я0-9\s-]', '', s)
    s = re.sub(r'\s+', '-', s)
    s = re.sub(r'-+', '-', s)
    return s[:120]


@router.get("/blog")
def admin_get_blog_posts(
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    """List all blog posts (including unpublished)."""
    posts = db.query(BlogPost).order_by(BlogPost.created_at.desc()).all()
    return [_blog_post_out(p) for p in posts]


@router.post("/blog", status_code=201)
def admin_create_blog_post(
    data: BlogPostCreate,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    slug = data.slug or _auto_slug(data.title)
    existing = db.query(BlogPost).filter(BlogPost.slug == slug).first()
    if existing:
        slug = f"{slug}-{existing.id + 1}"

    post = BlogPost(
        title=data.title,
        slug=slug,
        excerpt=data.excerpt,
        content=data.content,
        img=data.img,
        category=data.category,
        published=data.published,
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return _blog_post_out(post)


@router.put("/blog/{post_id}")
def admin_update_blog_post(
    post_id: int,
    data: BlogPostUpdate,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Статья не найдена")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(post, field, value)

    db.commit()
    db.refresh(post)
    return _blog_post_out(post)


@router.delete("/blog/{post_id}", status_code=204)
def admin_delete_blog_post(
    post_id: int,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Статья не найдена")
    db.delete(post)
    db.commit()
    return None
