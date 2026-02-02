"""Button platform for Home Project Ledger."""
from __future__ import annotations

import logging

from homeassistant.components.button import ButtonEntity, ButtonDeviceClass
from homeassistant.components.persistent_notification import async_create
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity import DeviceInfo
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up button platform."""
    async_add_entities([
        AddReceiptButton(hass, entry),
        OpenPanelButton(hass, entry),
    ], True)


class AddReceiptButton(ButtonEntity):
    """Button to navigate to Project Ledger and add a receipt."""

    _attr_has_entity_name = True

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        """Initialize the button."""
        self._hass = hass
        self._entry = entry
        self._attr_unique_id = f"{entry.entry_id}_add_receipt_button"
        self._attr_name = "Add Receipt"
        self._attr_icon = "mdi:receipt-text-plus"
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, entry.entry_id)},
            name="Home Project Ledger",
            manufacturer="Home Project Ledger",
            model="Project Ledger",
            entry_type=None,
        )

    async def async_press(self) -> None:
        """Handle the button press."""
        # Fire an event that can be used with browser_mod or other automations
        self._hass.bus.async_fire(
            f"{DOMAIN}_add_receipt",
            {"action": "add_receipt", "panel_path": "/home-project-ledger"}
        )
        
        # Create a persistent notification with a link
        async_create(
            self._hass,
            message="[Click here to open Project Ledger and add a receipt](/home-project-ledger)",
            title="Add Receipt",
            notification_id=f"{DOMAIN}_add_receipt_notification",
        )
        
        _LOGGER.debug("Add Receipt button pressed - event fired and notification created")


class OpenPanelButton(ButtonEntity):
    """Button to open the Project Ledger panel."""

    _attr_has_entity_name = True

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        """Initialize the button."""
        self._hass = hass
        self._entry = entry
        self._attr_unique_id = f"{entry.entry_id}_open_panel_button"
        self._attr_name = "Open Project Ledger"
        self._attr_icon = "mdi:home-analytics"
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, entry.entry_id)},
            name="Home Project Ledger",
            manufacturer="Home Project Ledger",
            model="Project Ledger",
            entry_type=None,
        )

    async def async_press(self) -> None:
        """Handle the button press."""
        # Fire an event that can be used with browser_mod or other automations
        self._hass.bus.async_fire(
            f"{DOMAIN}_open_panel",
            {"action": "open_panel", "panel_path": "/home-project-ledger"}
        )
        
        # Create a persistent notification with a link
        async_create(
            self._hass,
            message="[Click here to open Project Ledger](/home-project-ledger)",
            title="Open Project Ledger",
            notification_id=f"{DOMAIN}_open_panel_notification",
        )
        
        _LOGGER.debug("Open Panel button pressed - event fired and notification created")
