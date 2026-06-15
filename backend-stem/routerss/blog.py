"""
Blog router — public endpoints for listing and viewing blog posts.
Admin CRUD endpoints live in admin.py under /admin/blog/*.
"""

import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import BlogPost

router = APIRouter()


def _post_out(p: BlogPost) -> dict:
    """Serialize a BlogPost, decoding content JSON to a paragraph list."""
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


@router.get("")
def list_posts(db: Session = Depends(get_db)):
    """List all published blog posts (newest first)."""
    posts = (
        db.query(BlogPost)
        .filter(BlogPost.published == True)
        .order_by(BlogPost.created_at.desc())
        .all()
    )
    return [_post_out(p) for p in posts]


@router.get("/{identifier}")
def get_post(identifier: str, db: Session = Depends(get_db)):
    """Get a single post by slug or numeric id."""
    # Try slug first
    post = db.query(BlogPost).filter(BlogPost.slug == identifier).first()
    if not post:
        try:
            post = db.query(BlogPost).filter(BlogPost.id == int(identifier)).first()
        except ValueError:
            pass
    if not post:
        raise HTTPException(status_code=404, detail="Статья не найдена")
    return _post_out(post)
