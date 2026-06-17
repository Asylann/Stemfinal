"""add bitrix_stage_id to applications

Revision ID: d2e3f4a5b6c7
Revises: c1d2e3f4a5b6
Create Date: 2026-06-16

"""
from alembic import op
import sqlalchemy as sa

revision = 'd2e3f4a5b6c7'
down_revision = '7af7d0b0759c'
branch_labels = None
depends_on = None


def upgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)

    # Check if column already exists
    columns = [col['name'] for col in inspector.get_columns('applications')]
    if 'bitrix_stage_id' not in columns:
        op.add_column(
            'applications',
            sa.Column('bitrix_stage_id', sa.String(), nullable=True)
        )


def downgrade() -> None:
    op.drop_column('applications', 'bitrix_stage_id')
