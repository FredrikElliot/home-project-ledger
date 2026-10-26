"""Storage handler for Home Project Ledger."""
from __future__ import annotations

import logging
from typing import Optional

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import (
    LEGACY_RECEIPT_IMAGE_URL,
    RECEIPT_IMAGE_URL,
    STORAGE_KEY_PROJECTS,
    STORAGE_KEY_RECEIPTS,
    STORAGE_VERSION,
)
from .models import Project, Receipt

_LOGGER = logging.getLogger(__name__)


class ProjectLedgerStorage:
    """Handles storage of projects and receipts."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize storage."""
        self.hass = hass
        self._projects_store = Store(hass, STORAGE_VERSION, STORAGE_KEY_PROJECTS)
        self._receipts_store = Store(hass, STORAGE_VERSION, STORAGE_KEY_RECEIPTS)
        self._projects: dict[str, Project] = {}
        self._receipts: dict[str, Receipt] = {}

    async def async_load(self) -> None:
        """Load data from storage."""
        _LOGGER.debug("Loading project ledger data from storage")

        # Load projects
        projects_data = await self._projects_store.async_load()
        if projects_data:
            self._projects = {
                pid: Project.from_dict(pdata)
                for pid, pdata in projects_data.get("projects", {}).items()
            }
            _LOGGER.debug("Loaded %d projects", len(self._projects))

        # Load receipts
        receipts_data = await self._receipts_store.async_load()
        if receipts_data:
            self._receipts = {
                rid: Receipt.from_dict(rdata)
                for rid, rdata in receipts_data.get("receipts", {}).items()
            }
            _LOGGER.debug("Loaded %d receipts", len(self._receipts))

            migrated = False
            for receipt in self._receipts.values():
                paths = [
                    path.replace(LEGACY_RECEIPT_IMAGE_URL, RECEIPT_IMAGE_URL, 1)
                    if path.startswith(LEGACY_RECEIPT_IMAGE_URL) else path
                    for path in receipt.image_paths
                ]
                image_path = receipt.image_path
                if image_path and image_path.startswith(LEGACY_RECEIPT_IMAGE_URL):
                    image_path = image_path.replace(
                        LEGACY_RECEIPT_IMAGE_URL, RECEIPT_IMAGE_URL, 1
                    )
                if paths != receipt.image_paths or image_path != receipt.image_path:
                    receipt.image_paths = paths
                    receipt.image_path = image_path
                    migrated = True
            if migrated:
                await self.async_save_receipts()

    async def async_save_projects(self) -> None:
        """Save projects to storage."""
        data = {
            "projects": {pid: project.to_dict() for pid, project in self._projects.items()}
        }
        await self._projects_store.async_save(data)
        _LOGGER.debug("Saved %d projects", len(self._projects))

    async def async_save_receipts(self) -> None:
        """Save receipts to storage."""
        data = {
            "receipts": {rid: receipt.to_dict() for rid, receipt in self._receipts.items()}
        }
        await self._receipts_store.async_save(data)
        _LOGGER.debug("Saved %d receipts", len(self._receipts))

    # Project operations
    async def async_add_project(self, project: Project) -> None:
        """Add a project."""
        self._projects[project.project_id] = project
        await self.async_save_projects()

    async def async_update_project(self, project: Project) -> None:
        """Update a project."""
        if project.project_id not in self._projects:
            raise ValueError(f"Project {project.project_id} not found")
        self._projects[project.project_id] = project
        await self.async_save_projects()

    async def async_delete_project(self, project_id: str) -> None:
        """Delete a project."""
        if project_id not in self._projects:
            raise ValueError(f"Project {project_id} not found")
        del self._projects[project_id]
        await self.async_save_projects()

    def get_project(self, project_id: str) -> Optional[Project]:
        """Get a project by ID."""
        return self._projects.get(project_id)

    def get_all_projects(self) -> list[Project]:
        """Get all projects."""
        return list(self._projects.values())

    # Receipt operations
    async def async_add_receipt(self, receipt: Receipt) -> None:
        """Add a receipt."""
        self._receipts[receipt.receipt_id] = receipt
        await self.async_save_receipts()

    async def async_update_receipt(self, receipt: Receipt) -> None:
        """Update a receipt."""
        if receipt.receipt_id not in self._receipts:
            raise ValueError(f"Receipt {receipt.receipt_id} not found")
        self._receipts[receipt.receipt_id] = receipt
        await self.async_save_receipts()

    async def async_delete_receipt(self, receipt_id: str) -> None:
        """Delete a receipt."""
        if receipt_id not in self._receipts:
            raise ValueError(f"Receipt {receipt_id} not found")
        del self._receipts[receipt_id]
        await self.async_save_receipts()

    def get_receipt(self, receipt_id: str) -> Optional[Receipt]:
        """Get a receipt by ID."""
        return self._receipts.get(receipt_id)

    def get_all_receipts(self) -> list[Receipt]:
        """Get all receipts."""
        return list(self._receipts.values())

    def get_receipts_for_project(self, project_id: str) -> list[Receipt]:
        """Get all receipts for a specific project."""
        return [r for r in self._receipts.values() if r.project_id == project_id]

    def get_receipts_for_area(self, area_id: str) -> list[Receipt]:
        """Get receipts connected to a specific area directly or through a project."""
        project_ids_in_area = {
            p.project_id for p in self._projects.values()
            if p.area_id == area_id
        }
        return [
            receipt for receipt in self._receipts.values()
            if receipt.area_id == area_id or receipt.project_id in project_ids_in_area
        ]

    def get_spend_for_area(self, area_id: str, currency: str) -> float:
        """Return area spend, assigning itemized amounts to their selected rooms."""
        project_areas = {
            project.project_id: project.area_id for project in self._projects.values()
        }
        total = 0.0
        for receipt in self._receipts.values():
            if receipt.currency != currency:
                continue
            item_total = sum(float(item.get("price", 0)) for item in receipt.items)
            if receipt.project_id and project_areas.get(receipt.project_id) == area_id:
                total += max(receipt.total - item_total, 0) if receipt.items else receipt.total
            elif not receipt.project_id and receipt.area_id == area_id and not receipt.items:
                total += receipt.total
            for item in receipt.items:
                if item.get("area_id") == area_id:
                    total += float(item.get("price", 0))
        return total
