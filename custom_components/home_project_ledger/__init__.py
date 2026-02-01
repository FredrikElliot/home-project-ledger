"""The Home Project Ledger integration."""
from __future__ import annotations

import logging
import os
import shutil

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.components import panel_custom

from .const import (
    DOMAIN,
    RECEIPT_IMAGE_DIR,
    PANEL_ICON,
    PANEL_TITLE,
    PANEL_URL,
    CONF_GOOGLE_CLIENT_ID,
    CONF_GOOGLE_CLIENT_SECRET,
    CONF_ONEDRIVE_CLIENT_ID,
    CONF_ONEDRIVE_CLIENT_SECRET,
    CONF_DROPBOX_APP_KEY,
    CONF_DROPBOX_APP_SECRET,
)
from .coordinator import ProjectLedgerCoordinator
from .services import async_setup_services
from .storage import ProjectLedgerStorage
from .cloud_storage_manager import CloudStorageManager
from .http_views import async_register_views

_LOGGER = logging.getLogger(__name__)

PLATFORMS: list[Platform] = [Platform.SENSOR, Platform.BUTTON]


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Home Project Ledger from a config entry."""
    _LOGGER.debug("Setting up Home Project Ledger integration")

    def setup_directories_and_assets() -> dict[str, str | None]:
        """Create required dirs and copy frontend assets to /config/www/<DOMAIN>/."""
        # Receipt images directory
        receipt_dir = hass.config.path(RECEIPT_IMAGE_DIR)
        os.makedirs(receipt_dir, exist_ok=True)

        # Public frontend directory served as /local/<DOMAIN>/...
        www_domain_dir = hass.config.path(f"www/{DOMAIN}")
        os.makedirs(www_domain_dir, exist_ok=True)

        base_frontend_dir = os.path.join(os.path.dirname(__file__), "frontend")

        panel_js_src = os.path.join(base_frontend_dir, "panel.js")
        panel_js_dst = os.path.join(www_domain_dir, "panel.js")

        panel_html_src = os.path.join(base_frontend_dir, "panel.html")
        panel_html_dst = os.path.join(www_domain_dir, "panel.html")

        copied_js = None
        copied_html = None

        if os.path.exists(panel_js_src):
            shutil.copy(panel_js_src, panel_js_dst)
            copied_js = panel_js_dst

        if os.path.exists(panel_html_src):
            shutil.copy(panel_html_src, panel_html_dst)
            copied_html = panel_html_dst

        return {"panel_js": copied_js, "panel_html": copied_html}

    copied = await hass.async_add_executor_job(setup_directories_and_assets)
    _LOGGER.debug("Frontend assets copied: %s", copied)

    # Register sidebar panel early (and only once)
    await _async_register_panel(hass)

    # Initialize storage
    storage = ProjectLedgerStorage(hass)
    await storage.async_load()

    # Initialize coordinator
    coordinator = ProjectLedgerCoordinator(hass, storage)
    await coordinator.async_config_entry_first_refresh()

    # Get credentials from both data and options (options override data)
    all_config = {**entry.data, **entry.options}
    
    # Initialize cloud storage manager with credentials from config entry
    cloud_storage_manager = CloudStorageManager(
        hass,
        google_client_id=all_config.get(CONF_GOOGLE_CLIENT_ID),
        google_client_secret=all_config.get(CONF_GOOGLE_CLIENT_SECRET),
        onedrive_client_id=all_config.get(CONF_ONEDRIVE_CLIENT_ID),
        onedrive_client_secret=all_config.get(CONF_ONEDRIVE_CLIENT_SECRET),
        dropbox_app_key=all_config.get(CONF_DROPBOX_APP_KEY),
        dropbox_app_secret=all_config.get(CONF_DROPBOX_APP_SECRET),
    )
    await cloud_storage_manager.async_load()

    # Store coordinator and storage in hass.data
    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][entry.entry_id] = {
        "coordinator": coordinator,
        "storage": storage,
        "cloud_storage_manager": cloud_storage_manager,
    }

    # Set up platforms
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    # Set up services
    await async_setup_services(hass, storage, coordinator, cloud_storage_manager)

    # Register HTTP views for cloud storage API
    async_register_views(hass)

    # Listen for options updates to reload cloud storage credentials
    entry.async_on_unload(entry.add_update_listener(async_options_updated))

    return True


async def async_options_updated(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Handle options update - reload cloud storage manager with new credentials."""
    _LOGGER.info("Options updated, reloading cloud storage credentials")
    
    entry_data = hass.data.get(DOMAIN, {}).get(entry.entry_id)
    if not entry_data:
        return
    
    cloud_storage_manager = entry_data.get("cloud_storage_manager")
    if not cloud_storage_manager:
        return
    
    # Update credentials from new options
    all_config = {**entry.data, **entry.options}
    cloud_storage_manager._google_client_id = all_config.get(CONF_GOOGLE_CLIENT_ID)
    cloud_storage_manager._google_client_secret = all_config.get(CONF_GOOGLE_CLIENT_SECRET)
    cloud_storage_manager._onedrive_client_id = all_config.get(CONF_ONEDRIVE_CLIENT_ID)
    cloud_storage_manager._onedrive_client_secret = all_config.get(CONF_ONEDRIVE_CLIENT_SECRET)
    cloud_storage_manager._dropbox_app_key = all_config.get(CONF_DROPBOX_APP_KEY)
    cloud_storage_manager._dropbox_app_secret = all_config.get(CONF_DROPBOX_APP_SECRET)
    
    _LOGGER.debug("Cloud storage credentials updated")


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    _LOGGER.debug("Unloading Home Project Ledger integration")

    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)

    if unload_ok:
        hass.data.get(DOMAIN, {}).pop(entry.entry_id, None)

    # MVP: We keep panel registered even if entry is removed.
    # If you later want to remove it:
    # await panel_custom.async_remove_panel(hass, PANEL_URL)

    return unload_ok


async def _async_register_panel(hass: HomeAssistant) -> None:
    """Register the Home Project Ledger sidebar panel (custom)."""
    hass.data.setdefault(DOMAIN, {})
    if hass.data[DOMAIN].get("panel_registered"):
        return

    # Add cache-busting timestamp to force browser to reload JS file
    import time
    cache_bust = int(time.time())
    module_url = f"/local/{DOMAIN}/panel.js?v={cache_bust}"

    # NOTE: In your HA version, async_register_panel is a coroutine and MUST be awaited.
    await panel_custom.async_register_panel(
        hass,
        webcomponent_name=f"{DOMAIN}-panel",
        frontend_url_path=PANEL_URL,
        module_url=module_url,
        sidebar_title=PANEL_TITLE,
        sidebar_icon=PANEL_ICON,
        require_admin=False,
        config={},
    )

    hass.data[DOMAIN]["panel_registered"] = True
    _LOGGER.info("Registered Home Project Ledger panel at /%s (module: %s)", PANEL_URL, module_url)
