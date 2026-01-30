"""Data models for Home Project Ledger."""
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional
import uuid


@dataclass
class Project:
    """Represents a home renovation project."""

    project_id: str
    name: str
    area_id: Optional[str]
    status: str  # open | closed
    created_at: str
    closed_at: Optional[str] = None

    @classmethod
    def create(
        cls,
        name: str,
        area_id: Optional[str] = None,
        status: str = "open",
    ) -> "Project":
        """Create a new project."""
        return cls(
            project_id=str(uuid.uuid4()),
            name=name,
            area_id=area_id,
            status=status,
            created_at=datetime.utcnow().isoformat(),
            closed_at=None,
        )

    def to_dict(self) -> dict:
        """Convert project to dictionary."""
        return {
            "project_id": self.project_id,
            "name": self.name,
            "area_id": self.area_id,
            "status": self.status,
            "created_at": self.created_at,
            "closed_at": self.closed_at,
        }

    @classmethod
    def from_dict(cls, data: dict) -> "Project":
        """Create project from dictionary."""
        return cls(
            project_id=data["project_id"],
            name=data["name"],
            area_id=data.get("area_id"),
            status=data["status"],
            created_at=data["created_at"],
            closed_at=data.get("closed_at"),
        )


@dataclass
class Receipt:
    """Represents a receipt for a project."""

    receipt_id: str
    project_id: str
    area_id: Optional[str]
    image_path: Optional[str]
    merchant: str
    date: str
    total: float
    currency: str
    category_summary: Optional[str]
    created_at: str
    updated_at: str

    @classmethod
    def create(
        cls,
        project_id: str,
        area_id: Optional[str],
        merchant: str,
        date: str,
        total: float,
        currency: str,
        image_path: Optional[str] = None,
        category_summary: Optional[str] = None,
    ) -> "Receipt":
        """Create a new receipt."""
        now = datetime.utcnow().isoformat()
        return cls(
            receipt_id=str(uuid.uuid4()),
            project_id=project_id,
            area_id=area_id,
            image_path=image_path,
            merchant=merchant,
            date=date,
            total=total,
            currency=currency,
            category_summary=category_summary,
            created_at=now,
            updated_at=now,
        )

    def to_dict(self) -> dict:
        """Convert receipt to dictionary."""
        return {
            "receipt_id": self.receipt_id,
            "project_id": self.project_id,
            "area_id": self.area_id,
            "image_path": self.image_path,
            "merchant": self.merchant,
            "date": self.date,
            "total": self.total,
            "currency": self.currency,
            "category_summary": self.category_summary,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }

    @classmethod
    def from_dict(cls, data: dict) -> "Receipt":
        """Create receipt from dictionary."""
        return cls(
            receipt_id=data["receipt_id"],
            project_id=data["project_id"],
            area_id=data.get("area_id"),
            image_path=data.get("image_path"),
            merchant=data["merchant"],
            date=data["date"],
            total=data["total"],
            currency=data["currency"],
            category_summary=data.get("category_summary"),
            created_at=data["created_at"],
            updated_at=data["updated_at"],
        )
