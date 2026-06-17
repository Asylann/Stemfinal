"""add bitrix_stage_name to applications

Revision ID: d1e2f3a4b5c6
Revises: 7af7d0b0759c
Create Date: 2026-06-17 12:15:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd1e2f3a4b5c6'
down_revision = 'd2e3f4a5b6c7'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('applications', sa.Column('bitrix_stage_name', sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column('applications', 'bitrix_stage_name')
