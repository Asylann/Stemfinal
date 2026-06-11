"""Add is_admin column to users table

Revision ID: a1b2c3d4e5f6
Revises: 09d7a4aa2831
Create Date: 2026-06-10 20:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, Sequence[str], None] = '09d7a4aa2831'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add is_admin boolean column to users table. Defaults to false for all existing rows."""
    from sqlalchemy.engine.reflection import Inspector
    bind = op.get_context().bind
    inspector = Inspector.from_engine(bind)
    columns = [c['name'] for c in inspector.get_columns('users')]
    if 'is_admin' not in columns:
        op.add_column(
            'users',
            sa.Column('is_admin', sa.Boolean(), nullable=False, server_default=sa.text('false'))
        )


def downgrade() -> None:
    """Remove is_admin column from users table."""
    op.drop_column('users', 'is_admin')
