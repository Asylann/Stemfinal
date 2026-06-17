"""Add visualize rate-limit fields to users and user_id FK to applications

Revision ID: b2c3d4e5f6a7
Revises: 7af7d0b0759c
Create Date: 2026-06-14 20:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b2c3d4e5f6a7'
down_revision: Union[str, Sequence[str], None] = '7af7d0b0759c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    from sqlalchemy.engine.reflection import Inspector
    bind = op.get_context().bind
    inspector = Inspector.from_engine(bind)

    # 1. Add visualize rate-limit columns to users
    user_cols = [c['name'] for c in inspector.get_columns('users')]
    if 'daily_visualize_count' not in user_cols:
        op.add_column('users', sa.Column(
            'daily_visualize_count', sa.Integer(),
            nullable=False, server_default='0'
        ))
    if 'last_visualize_date' not in user_cols:
        op.add_column('users', sa.Column(
            'last_visualize_date', sa.String(),
            nullable=True
        ))

    # 2. Add user_id FK to applications
    app_cols = [c['name'] for c in inspector.get_columns('applications')]
    if 'user_id' not in app_cols:
        # Use batch mode for SQLite compatibility (no ALTER TABLE ADD CONSTRAINT)
        with op.batch_alter_table('applications') as batch_op:
            batch_op.add_column(sa.Column(
                'user_id', sa.Integer(), sa.ForeignKey('users.id'),
                nullable=True
            ))


def downgrade() -> None:
    with op.batch_alter_table('applications') as batch_op:
        batch_op.drop_column('user_id')
    with op.batch_alter_table('users') as batch_op:
        batch_op.drop_column('last_visualize_date')
        batch_op.drop_column('daily_visualize_count')
