from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Category
from cache_utils import cache_get, cache_set

router = APIRouter()

def _cat_out(c: Category) -> dict:
    return {
        "id": c.id,
        "slug": c.slug,
        "title_ru": c.title_ru,
        "title_kz": c.title_kz,
        "img": c.img,
        "path": c.path,
        "parent_slug": c.parent_slug,
    }

@router.get("")
@router.get("/")
def get_categories(db: Session = Depends(get_db)):
    # Try to get from cache
    cached = cache_get("categories:all")
    if cached:
        return cached
    
    result = [_cat_out(c) for c in db.query(Category).all()]
    
    # Cache for 1 hour
    cache_set("categories:all", result, ttl=3600)
    
    return result


@router.get("/{slug}")
def get_category(slug: str, db: Session = Depends(get_db)):
    # Try to get from cache
    cache_key = f"category:{slug}"
    cached = cache_get(cache_key)
    if cached:
        return cached
    
    c = db.query(Category).filter(Category.slug == slug).first()
    if not c:
        raise HTTPException(status_code=404, detail=f"Категория '{slug}' не найдена")
    
    result = _cat_out(c)
    
    # Cache for 1 hour
    cache_set(cache_key, result, ttl=3600)
    
    return result
