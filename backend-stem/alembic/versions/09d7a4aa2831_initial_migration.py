"""Initial migration

Revision ID: 09d7a4aa2831
Revises: 
Create Date: 2026-06-09 10:48:57.312005

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '09d7a4aa2831'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('categories',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('slug', sa.String(), nullable=True),
        sa.Column('title_ru', sa.String(), nullable=True),
        sa.Column('title_kz', sa.String(), nullable=True),
        sa.Column('img', sa.String(), nullable=True),
        sa.Column('path', sa.String(), nullable=True),
        sa.Column('parent_slug', sa.String(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_categories_id'), 'categories', ['id'], unique=False)
    op.create_index(op.f('ix_categories_slug'), 'categories', ['slug'], unique=True)

    op.create_table('users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('password', sa.String(), nullable=False),
        sa.Column('phone', sa.String(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)

    op.create_table('products',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(), nullable=True),
        sa.Column('img', sa.String(), nullable=True),
        sa.Column('description_ru', sa.Text(), nullable=True),
        sa.Column('description_kz', sa.Text(), nullable=True),
        sa.Column('material_ru', sa.String(), nullable=True),
        sa.Column('material_kz', sa.String(), nullable=True),
        sa.Column('size', sa.String(), nullable=True),
        sa.Column('article', sa.String(), nullable=True),
        sa.Column('in_stock', sa.Boolean(), nullable=True),
        sa.Column('category_slug', sa.String(), nullable=True),
        sa.ForeignKeyConstraint(['category_slug'], ['categories.slug'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_products_id'), 'products', ['id'], unique=False)

    op.create_table('orders',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('product_id', sa.Integer(), nullable=True),
        sa.Column('product_title', sa.String(), nullable=True),
        sa.Column('client_name', sa.String(), nullable=True),
        sa.Column('client_phone', sa.String(), nullable=True),
        sa.Column('message', sa.Text(), nullable=True),
        sa.Column('status', sa.String(), nullable=True),
        sa.Column('created_at', sa.String(), nullable=True),
        sa.ForeignKeyConstraint(['product_id'], ['products.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_orders_id'), 'orders', ['id'], unique=False)

    op.create_table('applications',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('phone', sa.String(), nullable=False),
        sa.Column('username', sa.String(), nullable=True),
        sa.Column('comment', sa.Text(), nullable=True),
        sa.Column('product_name', sa.String(), nullable=True),
        sa.Column('article', sa.String(), nullable=True),
        sa.Column('product_url', sa.String(), nullable=True),
        sa.Column('status', sa.String(), nullable=True),
        sa.Column('manager_id', sa.Integer(), nullable=True),
        sa.Column('manager_name', sa.String(), nullable=True),
        sa.Column('created_at', sa.String(), nullable=True),
        sa.Column('updated_at', sa.String(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_applications_id'), 'applications', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_applications_id'), table_name='applications')
    op.drop_table('applications')
    op.drop_index(op.f('ix_orders_id'), table_name='orders')
    op.drop_table('orders')
    op.drop_index(op.f('ix_products_id'), table_name='products')
    op.drop_table('products')
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
    op.drop_index(op.f('ix_categories_slug'), table_name='categories')
    op.drop_index(op.f('ix_categories_id'), table_name='categories')
    op.drop_table('categories')
