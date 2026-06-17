"""Switch auth from email to phone-based

Revision ID: c3d4e5f6a7b8
Revises: b2c3d4e5f6a7
Create Date: 2026-06-17 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c3d4e5f6a7b8'
down_revision: Union[str, Sequence[str], None] = 'b2c3d4e5f6a7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    from sqlalchemy.engine.reflection import Inspector
    bind = op.get_context().bind
    inspector = Inspector.from_engine(bind)

    # 1. Fill any NULL phone values with a placeholder based on user id
    op.execute("UPDATE users SET phone = 'unknown_' || id WHERE phone IS NULL")

    # 2. Make email and name nullable, phone NOT NULL + unique
    with op.batch_alter_table('users') as batch_op:
        batch_op.alter_column('email', existing_type=sa.String(), nullable=True)
        batch_op.alter_column('name', existing_type=sa.String(), nullable=True)
        batch_op.alter_column('phone', existing_type=sa.String(), nullable=False)
        # Add unique index on phone
        batch_op.create_unique_constraint('uq_users_phone', ['phone'])


def downgrade() -> None:
    with op.batch_alter_table('users') as batch_op:
        batch_op.drop_constraint('uq_users_phone', type_='unique')
        batch_op.alter_column('phone', existing_type=sa.String(), nullable=True)
        batch_op.alter_column('name', existing_type=sa.String(), nullable=False)
        batch_op.alter_column('email', existing_type=sa.String(), nullable=False)
