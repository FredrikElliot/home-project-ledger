"""Sensor platform for Home Project Ledger."""
from __future__ import annotations

import logging
from typing import Any

from homeassistant.components.sensor import (
    SensorEntity,
    SensorStateClass,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import CURRENCY_DOLLAR, CURRENCY_EURO
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import DEFAULT_CURRENCY, DOMAIN
from .coordinator import ProjectLedgerCoordinator

_LOGGER = logging.getLogger(__name__)

# Currency symbols mapping
CURRENCY_SYMBOLS = {
    "USD": CURRENCY_DOLLAR,
    "EUR": CURRENCY_EURO,
    "SEK": "kr",
    "NOK": "kr",
    "DKK": "kr",
    "GBP": "£",
}


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up sensor platform."""
    data = hass.data[DOMAIN][entry.entry_id]
    coordinator: ProjectLedgerCoordinator = data["coordinator"]
    storage = data["storage"]

    currency = entry.data.get("currency", DEFAULT_CURRENCY)

    # Always create total house spend sensor
    sensors = [
        TotalHouseSpendSensor(coordinator, storage, currency),
    ]

    # Create sensors for each area that has receipts or projects
    area_registry = hass.helpers.area_registry.async_get(hass)
    area_ids = set()
    
    # Collect area IDs from projects
    for project in storage.get_all_projects():
        if project.area_id:
            area_ids.add(project.area_id)
    
    # Collect area IDs from receipts
    for receipt in storage.get_all_receipts():
        if receipt.area_id:
            area_ids.add(receipt.area_id)
    
    # Create area sensors
    for area_id in area_ids:
        area = area_registry.async_get_area(area_id)
        if area:
            sensors.append(AreaSpendSensor(coordinator, storage, area.id, area.name, currency))

    # Create sensors for each project
    for project in storage.get_all_projects():
        sensors.append(ProjectSpendSensor(coordinator, storage, project.project_id, project.name, currency))

    async_add_entities(sensors, True)


class ProjectLedgerSensorBase(CoordinatorEntity, SensorEntity):
    """Base class for Project Ledger sensors."""

    _attr_state_class = SensorStateClass.TOTAL
    _attr_icon = "mdi:currency-usd"

    def __init__(
        self,
        coordinator: ProjectLedgerCoordinator,
        storage: Any,
        currency: str,
    ) -> None:
        """Initialize sensor."""
        super().__init__(coordinator)
        self._storage = storage
        self._currency = currency
        self._attr_native_unit_of_measurement = currency

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return extra state attributes."""
        return {
            "currency": self._currency,
        }


class TotalHouseSpendSensor(ProjectLedgerSensorBase):
    """Sensor for total house spending."""

    def __init__(
        self,
        coordinator: ProjectLedgerCoordinator,
        storage: Any,
        currency: str,
    ) -> None:
        """Initialize sensor."""
        super().__init__(coordinator, storage, currency)
        self._attr_unique_id = f"{DOMAIN}_total_house_spend"
        self._attr_name = "Total House Spend"
        self._attr_icon = "mdi:home-currency-usd"

    @callback
    def _handle_coordinator_update(self) -> None:
        """Handle updated data from the coordinator."""
        total = sum(
            receipt.total
            for receipt in self._storage.get_all_receipts()
            if receipt.currency == self._currency
        )
        self._attr_native_value = round(total, 2)
        self.async_write_ha_state()


class AreaSpendSensor(ProjectLedgerSensorBase):
    """Sensor for area spending."""

    def __init__(
        self,
        coordinator: ProjectLedgerCoordinator,
        storage: Any,
        area_id: str,
        area_name: str,
        currency: str,
    ) -> None:
        """Initialize sensor."""
        super().__init__(coordinator, storage, currency)
        self._area_id = area_id
        self._area_name = area_name
        self._attr_unique_id = f"{DOMAIN}_area_{area_id}_spend"
        self._attr_name = f"{area_name} Spend"
        self._attr_icon = "mdi:home-floor-1"

    @callback
    def _handle_coordinator_update(self) -> None:
        """Handle updated data from the coordinator."""
        total = sum(
            receipt.total
            for receipt in self._storage.get_receipts_for_area(self._area_id)
            if receipt.currency == self._currency
        )
        self._attr_native_value = round(total, 2)
        self.async_write_ha_state()

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return extra state attributes."""
        attrs = super().extra_state_attributes
        attrs["area_id"] = self._area_id
        attrs["area_name"] = self._area_name
        return attrs


class ProjectSpendSensor(ProjectLedgerSensorBase):
    """Sensor for project spending."""

    def __init__(
        self,
        coordinator: ProjectLedgerCoordinator,
        storage: Any,
        project_id: str,
        project_name: str,
        currency: str,
    ) -> None:
        """Initialize sensor."""
        super().__init__(coordinator, storage, currency)
        self._project_id = project_id
        self._project_name = project_name
        self._attr_unique_id = f"{DOMAIN}_project_{project_id}_spend"
        self._attr_name = f"{project_name} Spend"
        self._attr_icon = "mdi:notebook-edit"

    @callback
    def _handle_coordinator_update(self) -> None:
        """Handle updated data from the coordinator."""
        total = sum(
            receipt.total
            for receipt in self._storage.get_receipts_for_project(self._project_id)
            if receipt.currency == self._currency
        )
        self._attr_native_value = round(total, 2)
        self.async_write_ha_state()

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return extra state attributes."""
        attrs = super().extra_state_attributes
        attrs["project_id"] = self._project_id
        attrs["project_name"] = self._project_name

        project = self._storage.get_project(self._project_id)
        if project:
            attrs["status"] = project.status
            attrs["area_id"] = project.area_id

        return attrs
