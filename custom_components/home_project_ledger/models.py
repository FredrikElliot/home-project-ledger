"""Data models for Home Project Ledger."""
from dataclasses import dataclass, field
from datetime import datetime, timezone
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
    budget: Optional[float] = None
    budget_by_category: Optional[dict[str, float]] = None

    @classmethod
    def create(
        cls,
        name: str,
        area_id: Optional[str] = None,
        status: str = "open",
        budget: Optional[float] = None,
        budget_by_category: Optional[dict[str, float]] = None,
    ) -> "Project":
        """Create a new project."""
        return cls(
            project_id=str(uuid.uuid4()),
            name=name,
            area_id=area_id,
            status=status,
            created_at=datetime.now(timezone.utc).isoformat(),
            closed_at=None,
            budget=budget,
            budget_by_category=budget_by_category,
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
            "budget": self.budget,
            "budget_by_category": self.budget_by_category,
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
            budget=data.get("budget"),
            budget_by_category=data.get("budget_by_category"),
        )


@dataclass
class Receipt:
    """Represents a receipt for a project."""

    receipt_id: str
    project_id: str
    image_path: Optional[str]  # Legacy single image (deprecated)
    image_paths: list[str]  # Multiple image paths
    merchant: str
    date: str
    total: float
    currency: str
    category_summary: Optional[str]  # Legacy single category (deprecated)
    categories: Optional[list[str]] = None  # Multiple categories
    category_split: Optional[dict[str, float]] = None  # Custom split: category -> amount/percentage
    category_split_type: Optional[str] = None  # "absolute" or "percentage", None means equal split
    created_at: str = ""
    updated_at: str = ""

    @classmethod
    def create(
        cls,
        project_id: str,
        merchant: str,
        date: str,
        total: float,
        currency: str,
        image_path: Optional[str] = None,
        image_paths: Optional[list[str]] = None,
        category_summary: Optional[str] = None,
        categories: Optional[list[str]] = None,
        category_split: Optional[dict[str, float]] = None,
        category_split_type: Optional[str] = None,
    ) -> "Receipt":
        """Create a new receipt."""
        now = datetime.now(timezone.utc).isoformat()
        # Support both legacy single image and new multiple images
        paths = image_paths or []
        if image_path and image_path not in paths:
            paths.insert(0, image_path)
        # Support both legacy category_summary and new categories list
        cats = categories
        if not cats and category_summary:
            cats = [category_summary]
        return cls(
            receipt_id=str(uuid.uuid4()),
            project_id=project_id,
            image_path=image_path,
            image_paths=paths,
            merchant=merchant,
            date=date,
            total=total,
            currency=currency,
            category_summary=category_summary,
            categories=cats,
            category_split=category_split,
            category_split_type=category_split_type,
            created_at=now,
            updated_at=now,
        )

    def get_spend_per_category(self) -> dict[str, float]:
        """Get spend amount per category based on split settings."""
        cats = self.categories or ([self.category_summary] if self.category_summary else [])
        if not cats:
            return {}

        # If custom split is defined, use it
        if self.category_split and self.category_split_type:
            if self.category_split_type == "absolute":
                # Return absolute amounts directly
                return {cat: self.category_split.get(cat, 0.0) for cat in cats}
            elif self.category_split_type == "percentage":
                # Convert percentages to absolute amounts
                return {
                    cat: self.total * (self.category_split.get(cat, 0.0) / 100.0)
                    for cat in cats
                }

        # Default: split equally among categories
        amount_per_category = self.total / len(cats)
        return {cat: amount_per_category for cat in cats}

    def to_dict(self) -> dict:
        """Convert receipt to dictionary."""
        return {
            "receipt_id": self.receipt_id,
            "project_id": self.project_id,
            "image_path": self.image_path,
            "image_paths": self.image_paths,
            "merchant": self.merchant,
            "date": self.date,
            "total": self.total,
            "currency": self.currency,
            "category_summary": self.category_summary,
            "categories": self.categories,
            "category_split": self.category_split,
            "category_split_type": self.category_split_type,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }

    @classmethod
    def from_dict(cls, data: dict) -> "Receipt":
        """Create receipt from dictionary."""
        # Handle migration from old format (single image_path) to new (image_paths list)
        image_paths = data.get("image_paths", [])
        image_path = data.get("image_path")
        if image_path and image_path not in image_paths:
            image_paths.insert(0, image_path)
        # Handle migration from old format (category_summary) to new (categories list)
        categories = data.get("categories")
        category_summary = data.get("category_summary")
        if not categories and category_summary:
            categories = [category_summary]
        return cls(
            receipt_id=data["receipt_id"],
            project_id=data["project_id"],
            image_path=image_path,
            image_paths=image_paths,
            merchant=data["merchant"],
            date=data["date"],
            total=data["total"],
            currency=data["currency"],
            category_summary=category_summary,
            categories=categories,
            category_split=data.get("category_split"),
            category_split_type=data.get("category_split_type"),
            created_at=data["created_at"],
            updated_at=data["updated_at"],
        )
