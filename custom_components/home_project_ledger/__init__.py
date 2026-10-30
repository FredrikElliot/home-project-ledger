"""The Home Project Ledger integration."""
from __future__ import annotations

import logging
import os
import shutil

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.components import panel_custom
from homeassistant.components.http import StaticPathConfig
from homeassistant.helpers import config_entry_oauth2_flow

from .const import (
    DOMAIN,
    RECEIPT_IMAGE_DIR,
    PANEL_ICON,
    PANEL_TITLE,
    PANEL_URL,
    CONF_STORAGE_PROVIDER,
    STORAGE_PROVIDER_LOCAL,
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

    def setup_receipt_directory() -> None:
        """Create the receipt images directory."""
        receipt_dir = hass.config.path(RECEIPT_IMAGE_DIR)
        os.makedirs(receipt_dir, exist_ok=True)
        legacy_receipt_dir = hass.config.path(f"www/{DOMAIN}/receipts")
        if not os.path.isdir(legacy_receipt_dir):
            return
        # Files left under www/ are publicly readable via /local/, so move each
        # one independently and never let a single failure abort setup.
        for filename in os.listdir(legacy_receipt_dir):
            source = os.path.join(legacy_receipt_dir, filename)
            if not os.path.isfile(source):
                _LOGGER.warning(
                    "Skipping non-file %s in legacy public receipt folder; remove it manually",
                    source,
                )
                continue
            target = os.path.join(receipt_dir, filename)
            if os.path.exists(target):
                _LOGGER.warning(
                    "Receipt %s already exists in private storage; leaving public copy %s for manual review",
                    filename,
                    source,
                )
                continue
            try:
                shutil.move(source, target)
            except OSError as err:
                _LOGGER.error(
                    "Failed to move receipt %s out of public folder: %s", source, err
                )
        try:
            os.rmdir(legacy_receipt_dir)
        except OSError:
            _LOGGER.warning(
                "Legacy public folder %s is not empty; files there remain reachable via /local/",
                legacy_receipt_dir,
            )
            return
        try:
            os.rmdir(hass.config.path(f"www/{DOMAIN}"))
        except OSError:
            pass

    await hass.async_add_executor_job(setup_receipt_directory)

    hass.data.setdefault(DOMAIN, {})
    if not hass.data[DOMAIN].get("panel_static_path_registered"):
        frontend_dir = os.path.join(os.path.dirname(__file__), "frontend")
        await hass.http.async_register_static_paths(
            [StaticPathConfig(f"/{DOMAIN}", frontend_dir)]
        )
        hass.data[DOMAIN]["panel_static_path_registered"] = True

    # Register sidebar panel early (and only once)
    await _async_register_panel(hass)

    # Initialize storage
    storage = ProjectLedgerStorage(hass)
    await storage.async_load()

    # Initialize coordinator
    coordinator = ProjectLedgerCoordinator(hass, storage)
    await coordinator.async_config_entry_first_refresh()

    # Get storage provider and token from entry data
    storage_provider = entry.data.get(CONF_STORAGE_PROVIDER, STORAGE_PROVIDER_LOCAL)
    oauth_token = entry.data.get("token")
    
    # Get OAuth implementation if using cloud storage
    oauth_session = None
    if storage_provider != STORAGE_PROVIDER_LOCAL and oauth_token:
        try:
            implementation = await config_entry_oauth2_flow.async_get_config_entry_implementation(
                hass, entry
            )
            oauth_session = config_entry_oauth2_flow.OAuth2Session(
                hass, entry, implementation
            )
            _LOGGER.debug("OAuth session created for provider: %s", storage_provider)
        except Exception as err:
            _LOGGER.warning("Failed to create OAuth session: %s", err)
    
    # Initialize cloud storage manager with OAuth session
    cloud_storage_manager = CloudStorageManager(
        hass,
        storage_provider=storage_provider,
        oauth_session=oauth_session,
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
    """Handle options update - update currency setting."""
    _LOGGER.info("Options updated")
    # Currently options only contain currency, no cloud credentials to update


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
    module_url = f"/{DOMAIN}/panel.js?v={cache_bust}"

    # Get the user's language for the sidebar title
    # Home Assistant stores the language in hass.config.language
    language = hass.config.language or "en"
    
    # Sidebar titles by language
    sidebar_titles = {
        "en": "Project Ledger",
        "sv": "Projektredovisning",
    }
    sidebar_title = sidebar_titles.get(language, sidebar_titles["en"])

    # NOTE: In your HA version, async_register_panel is a coroutine and MUST be awaited.
    await panel_custom.async_register_panel(
        hass,
        webcomponent_name=f"{DOMAIN}-panel",
        frontend_url_path=PANEL_URL,
        module_url=module_url,
        sidebar_title=sidebar_title,
        sidebar_icon=PANEL_ICON,
        require_admin=False,
        config={},
    )

    hass.data[DOMAIN]["panel_registered"] = True
    _LOGGER.info("Registered Home Project Ledger panel at /%s (module: %s, title: %s)", PANEL_URL, module_url, sidebar_title)
