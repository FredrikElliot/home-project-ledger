"""Button platform for Home Project Ledger."""
from __future__ import annotations

import logging

from homeassistant.components.button import ButtonEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
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

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        """Initialize the button."""
        self._hass = hass
        self._entry = entry
        self._attr_unique_id = f"{DOMAIN}_add_receipt_button"
        self._attr_name = "Add Receipt"
        self._attr_icon = "mdi:receipt-text-plus"

    async def async_press(self) -> None:
        """Handle the button press."""
        # Fire an event that can be used with browser_mod or other automations
        self._hass.bus.async_fire(
            f"{DOMAIN}_add_receipt",
            {"action": "add_receipt", "panel_path": "/home-project-ledger"}
        )
        _LOGGER.debug("Add Receipt button pressed - event fired")


class OpenPanelButton(ButtonEntity):
    """Button to open the Project Ledger panel."""

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        """Initialize the button."""
        self._hass = hass
        self._entry = entry
        self._attr_unique_id = f"{DOMAIN}_open_panel_button"
        self._attr_name = "Open Project Ledger"
        self._attr_icon = "mdi:home-analytics"

    async def async_press(self) -> None:
        """Handle the button press."""
        # Fire an event that can be used with browser_mod or other automations
        self._hass.bus.async_fire(
            f"{DOMAIN}_open_panel",
            {"action": "open_panel", "panel_path": "/home-project-ledger"}
        )
        _LOGGER.debug("Open Panel button pressed - event fired")
