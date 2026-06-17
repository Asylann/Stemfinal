from datetime import datetime, timezone, timedelta

from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

# Astana, Kazakhstan timezone (UTC+5)
ASTANA_TZ = timezone(timedelta(hours=5))

def astana_now_str():
    """Return current Astana time as formatted string."""
    return datetime.now(ASTANA_TZ).strftime("%Y-%m-%d %H:%M:%S")


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True)
    title_ru = Column(String)
    title_kz = Column(String)
    img = Column(String)
    path = Column(String)
    parent_slug = Column(String, nullable=True)

    products = relationship("Product", back_populates="category")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    img = Column(String)
    description_ru = Column(Text, nullable=True)
    description_kz = Column(Text, nullable=True)
    material_ru = Column(String, nullable=True)
    material_kz = Column(String, nullable=True)
    size = Column(String, nullable=True)
    article = Column(String, nullable=True)
    in_stock = Column(Boolean, default=True)
    category_slug = Column(String, ForeignKey("categories.slug"))
    colors_json = Column(Text, nullable=True)

    category = relationship("Category", back_populates="products")


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    product_title = Column(String)
    client_name = Column(String, nullable=True)
    client_phone = Column(String, nullable=True)
    message = Column(Text, nullable=True)
    status = Column(String, default="new")
    created_at = Column(String)


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    username = Column(String, nullable=True)
    comment = Column(Text, nullable=True)
    
    bitrix_id = Column(Integer, nullable=True, index=True)
    bitrix_stage_id = Column(String, nullable=True)  # raw Bitrix24 STAGE_ID
    bitrix_stage_name = Column(String, nullable=True)  # human-readable stage name from Bitrix24
  
    product_name = Column(String, nullable=True)  
    article = Column(String, nullable=True)
    product_url = Column(String, nullable=True)

    
    status = Column(String, default="new")
    manager_id = Column(Integer, nullable=True)
    manager_name = Column(String, nullable=True)
    created_at = Column(String, default=astana_now_str)
    updated_at = Column(String, default=astana_now_str)

    # Link to authenticated user (nullable — anonymous orders still work)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    user = relationship("User", back_populates="applications")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=True)
    email = Column(String, unique=True, index=True, nullable=True)
    password = Column(String, nullable=False)
    phone = Column(String, unique=True, index=True, nullable=False)
    is_admin = Column(Boolean, default=False, nullable=False, server_default="false")

    # AI visualize rate-limiting
    daily_visualize_count = Column(Integer, default=0, nullable=False, server_default="0")
    last_visualize_date = Column(String, nullable=True)  # "YYYY-MM-DD"

    applications = relationship("Application", back_populates="user")


class BlogPost(Base):
    __tablename__ = "blog_posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    excerpt = Column(Text, nullable=True)
    content = Column(Text, nullable=True)        # JSON-encoded list of paragraphs
    img = Column(String, nullable=True)
    category = Column(String, nullable=True)      # e.g. "Мебель", "Оборудование"
    published = Column(Boolean, default=True)
    created_at = Column(String, default=astana_now_str)
