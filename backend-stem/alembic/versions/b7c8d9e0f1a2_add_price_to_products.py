"""remove price from products

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
    # Check if column exists before dropping
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    columns = [c['name'] for c in inspector.get_columns('products')]
    if 'price' in columns:
        op.drop_column('products', 'price')


def downgrade() -> None:
    op.add_column('products', sa.Column('price', sa.Float(), nullable=True))
