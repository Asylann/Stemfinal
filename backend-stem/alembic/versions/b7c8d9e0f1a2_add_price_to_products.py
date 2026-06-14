"""add price to products

Revision ID: b7c8d9e0f1a2
Revises: b3c4d5e6f7a8
Create Date: 2026-06-14

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'b7c8d9e0f1a2'
down_revision = 'b3c4d5e6f7a8'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('products', sa.Column('price', sa.Float(), nullable=True))


def downgrade() -> None:
    op.drop_column('products', 'price')
