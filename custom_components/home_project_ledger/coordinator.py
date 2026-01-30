"""Data coordinator for Home Project Ledger."""
from __future__ import annotations

import logging
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator

from .const import DOMAIN
from .storage import ProjectLedgerStorage

_LOGGER = logging.getLogger(__name__)


class ProjectLedgerCoordinator(DataUpdateCoordinator[dict[str, Any]]):
    """Coordinator to manage project ledger data."""

    def __init__(self, hass: HomeAssistant, storage: ProjectLedgerStorage) -> None:
        """Initialize coordinator."""
        super().__init__(
            hass,
            _LOGGER,
            name=DOMAIN,
        )
        self.storage = storage

    async def _async_update_data(self) -> dict[str, Any]:
        """Fetch data from storage."""
        return {
            "projects": self.storage.get_all_projects(),
            "receipts": self.storage.get_all_receipts(),
        }

    async def async_refresh_data(self) -> None:
        """Refresh coordinator data."""
        await self.async_request_refresh()
