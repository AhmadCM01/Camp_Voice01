"""add login attempt limits

Revision ID: add_login_attempt_limits
Revises: 8c56ebba2fae
"""

from alembic import op
import sqlalchemy as sa


revision = "add_login_attempt_limits"
down_revision = "8c56ebba2fae"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column("failed_login_attempts", sa.Integer(), nullable=False, server_default="0"),
    )
    op.add_column(
        "users",
        sa.Column("locked_until", sa.DateTime(timezone=True), nullable=True),
    )
    if op.get_bind().dialect.name != "sqlite":
        op.alter_column("users", "failed_login_attempts", server_default=None)


def downgrade() -> None:
    op.drop_column("users", "locked_until")
    op.drop_column("users", "failed_login_attempts")
