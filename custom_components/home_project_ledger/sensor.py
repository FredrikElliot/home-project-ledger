"""Sensor platform for Home Project Ledger."""
from __future__ import annotations

import logging
from typing import Any

from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
    SensorStateClass,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import DEFAULT_CURRENCY, DOMAIN
from .coordinator import ProjectLedgerCoordinator

_LOGGER = logging.getLogger(__name__)


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

    # Track which entities we've already created
    created_project_ids: set[str] = set()
    created_area_ids: set[str] = set()

    # Always create total house spend sensor
    sensors = [
        TotalHouseSpendSensor(coordinator, storage, currency),
    ]

    # Create sensors for each area that has projects
    area_registry = ar.async_get(hass)
    area_ids = set()
    
    # Collect area IDs from projects (receipts inherit area from their project)
    for project in storage.get_all_projects():
        if project.area_id:
            area_ids.add(project.area_id)
    
    # Create area sensors
    for area_id in area_ids:
        area = area_registry.async_get_area(area_id)
        if area:
            sensors.append(AreaSpendSensor(coordinator, storage, area.id, area.name, currency))
            created_area_ids.add(area_id)

    # Create sensors for each project
    for project in storage.get_all_projects():
        sensors.append(ProjectSpendSensor(coordinator, storage, project.project_id, project.name, currency))
        created_project_ids.add(project.project_id)

    async_add_entities(sensors, True)

    # Listen for coordinator updates to add new entities dynamically
    @callback
    def _async_check_new_entities() -> None:
        """Check if new projects/areas need sensors."""
        new_sensors = []

        # Check for new projects
        for project in storage.get_all_projects():
            if project.project_id not in created_project_ids:
                new_sensors.append(
                    ProjectSpendSensor(coordinator, storage, project.project_id, project.name, currency)
                )
                created_project_ids.add(project.project_id)
                _LOGGER.debug("Adding sensor for new project: %s", project.name)

        # Check for new areas (from projects only - receipts inherit area from project)
        for project in storage.get_all_projects():
            if project.area_id and project.area_id not in created_area_ids:
                area = area_registry.async_get_area(project.area_id)
                if area:
                    new_sensors.append(
                        AreaSpendSensor(coordinator, storage, area.id, area.name, currency)
                    )
                    created_area_ids.add(project.area_id)
                    _LOGGER.debug("Adding sensor for new area: %s", area.name)

        if new_sensors:
            async_add_entities(new_sensors, True)

    # Register the listener
    coordinator.async_add_listener(_async_check_new_entities)


class ProjectLedgerSensorBase(CoordinatorEntity, SensorEntity):
    """Base class for Project Ledger sensors."""

    _attr_state_class = SensorStateClass.TOTAL
    _attr_device_class = SensorDeviceClass.MONETARY
    _attr_icon = "mdi:currency-usd"
    _attr_suggested_display_precision = 2

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
        self._attr_icon = "mdi:home-analytics"

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
        # Get receipts for projects in this area (receipts inherit area from project)
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
            attrs["budget"] = project.budget
            attrs["budget_by_category"] = project.budget_by_category

        # Include receipts for this project
        receipts = self._storage.get_receipts_for_project(self._project_id)
        attrs["receipts"] = [
            {
                "receipt_id": r.receipt_id,
                "merchant": r.merchant,
                "date": r.date,
                "total": r.total,
                "currency": r.currency,
                "category_summary": r.category_summary,
                "categories": r.categories,
                "category_split": r.category_split,
                "category_split_type": r.category_split_type,
                "image_path": r.image_path,
                "image_paths": r.image_paths,
            }
            for r in receipts
        ]

        return attrs
