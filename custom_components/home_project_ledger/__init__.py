"""The Home Project Ledger integration."""
from __future__ import annotations

import logging
import os

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant

from .const import DOMAIN, RECEIPT_IMAGE_DIR
from .coordinator import ProjectLedgerCoordinator
from .services import async_setup_services
from .storage import ProjectLedgerStorage

_LOGGER = logging.getLogger(__name__)

PLATFORMS: list[Platform] = [Platform.SENSOR]


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Home Project Ledger from a config entry."""
    _LOGGER.debug("Setting up Home Project Ledger integration")

    # Ensure receipt image directory exists
    receipt_dir = hass.config.path(RECEIPT_IMAGE_DIR)
    os.makedirs(receipt_dir, exist_ok=True)
    _LOGGER.debug("Receipt image directory: %s", receipt_dir)

    # Initialize storage
    storage = ProjectLedgerStorage(hass)
    await storage.async_load()

    # Initialize coordinator
    coordinator = ProjectLedgerCoordinator(hass, storage)
    await coordinator.async_config_entry_first_refresh()

    # Store coordinator and storage in hass.data
    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][entry.entry_id] = {
        "coordinator": coordinator,
        "storage": storage,
    }

    # Set up platforms
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    # Set up services
    await async_setup_services(hass, storage, coordinator)

    # Register custom panel
    await _async_register_panel(hass)

    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    _LOGGER.debug("Unloading Home Project Ledger integration")

    # Unload platforms
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)

    if unload_ok:
        hass.data[DOMAIN].pop(entry.entry_id)

    return unload_ok


async def _async_register_panel(hass: HomeAssistant) -> None:
    """Register the custom panel."""
    from .const import PANEL_ICON, PANEL_TITLE, PANEL_URL

    # Register the panel
    hass.components.frontend.async_register_built_in_panel(
        component_name="custom",
        sidebar_title=PANEL_TITLE,
        sidebar_icon=PANEL_ICON,
        frontend_url_path=PANEL_URL,
        config={
            "_panel_custom": {
                "name": "home-project-ledger-panel",
                "embed_iframe": True,
                "trust_external": False,
            }
        },
        require_admin=False,
    )

    _LOGGER.info("Registered Home Project Ledger panel at /%s", PANEL_URL)
