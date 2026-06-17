"""merge auth and bitrix statuses

Revision ID: c7abb8bf0b28
Revises: c3d4e5f6a7b8, d1e2f3a4b5c6
Create Date: 2026-06-17 12:52:51.834954

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c7abb8bf0b28'
down_revision: Union[str, Sequence[str], None] = ('c3d4e5f6a7b8', 'd1e2f3a4b5c6')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
