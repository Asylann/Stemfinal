"""add specs_json to products

Revision ID: e1f2a3b4c5d6
Revises: c7abb8bf0b28
Create Date: 2026-06-22
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'e1f2a3b4c5d6'
down_revision: Union[str, Sequence[str], None] = 'c7abb8bf0b28'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('products', sa.Column('specs_json', sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column('products', 'specs_json')
