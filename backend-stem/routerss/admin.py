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

import os
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
from models import Application, Category, Product, User
from routerss.auth import get_current_admin

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
    price: Optional[float] = None
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
    price: Optional[float] = None
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
        "price": p.price,
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
        "manager_id": a.manager_id,
        "manager_name": a.manager_name,
        "created_at": a.created_at,
        "updated_at": a.updated_at,
    }


def _user_out(u: User) -> dict:
    return {
        "id": u.id,
        "name": u.name,
        "email": u.email,
        "phone": u.phone,
        "is_admin": u.is_admin,
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
def admin_get_applications(
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    return [_application_out(a) for a in db.query(Application).order_by(Application.id.desc()).all()]


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
    return [_user_out(u) for u in db.query(User).all()]
