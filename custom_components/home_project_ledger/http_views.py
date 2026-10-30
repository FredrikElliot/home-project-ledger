"""HTTP views for Home Project Ledger."""
from __future__ import annotations

import logging
from pathlib import Path

from aiohttp import web
import voluptuous as vol

from homeassistant.components.http import HomeAssistantView
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import Unauthorized

from .cloud_storage.base import StorageProviderType
from .const import DOMAIN, RECEIPT_IMAGE_DIR, RECEIPT_IMAGE_URL
from .services import SERVICE_SET_STORAGE_CONFIG_SCHEMA

_LOGGER = logging.getLogger(__name__)


class ReceiptImageView(HomeAssistantView):
    """Serve private receipts to authenticated or signed requests."""

    url = f"{RECEIPT_IMAGE_URL}{{filename}}"
    name = "api:home_project_ledger:receipts"
    requires_auth = True

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize the view."""
        self.hass = hass

    async def get(self, request: web.Request, filename: str) -> web.FileResponse:
        """Return a receipt without allowing access outside its directory."""
        if filename in ("", ".", "..") or "/" in filename or "\\" in filename:
            raise web.HTTPNotFound()

        def find_image() -> Path | None:
            directory = Path(self.hass.config.path(RECEIPT_IMAGE_DIR)).resolve()
            path = (directory / filename).resolve()
            if path.parent == directory and path.is_file():
                return path
            return None

        path = await self.hass.async_add_executor_job(find_image)
        if path is None:
            raise web.HTTPNotFound()
        return web.FileResponse(path, headers={
            "Cache-Control": "no-store",
            "X-Content-Type-Options": "nosniff",
            "Content-Security-Policy": "default-src 'none'; sandbox",
        })


class StorageStatusView(HomeAssistantView):
    """View to get storage status."""
    
    url = "/api/home_project_ledger/storage/status"
    name = "api:home_project_ledger:storage:status"
    requires_auth = True
    
    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize the view."""
        self.hass = hass
    
    async def get(self, request: web.Request) -> web.Response:
        """Handle GET request for storage status."""
        if not request["hass_user"].is_admin:
            raise Unauthorized()

        # Find the cloud storage manager from any entry
        for entry_data in self.hass.data.get(DOMAIN, {}).values():
            if isinstance(entry_data, dict) and "cloud_storage_manager" in entry_data:
                manager = entry_data["cloud_storage_manager"]
                status = await manager.get_status()
                providers = manager.get_available_providers()
                
                # Get auth URL if OAuth provider needs authentication
                auth_url = None
                if not status.authenticated and status.provider_type.value != "local":
                    auth_url = manager.get_auth_url()
                
                return self.json({
                    "provider": status.provider_type.value,
                    "provider_name": status.provider_name,
                    "connected": status.connected,
                    "authenticated": status.authenticated,
                    "storage_used": status.storage_used,
                    "storage_total": status.storage_total,
                    "error": status.error,
                    "auth_url": auth_url,
                    "providers": providers,
                })
        
        # Fallback if no manager found
        return self.json({
            "provider": "local",
            "provider_name": "Local Storage",
            "connected": True,
            "authenticated": True,
            "providers": [
                {"type": "local", "name": "Local Storage", "configured": True, "available": True},
            ],
        })


class StorageConfigView(HomeAssistantView):
    """View to configure storage."""
    
    url = "/api/home_project_ledger/storage/config"
    name = "api:home_project_ledger:storage:config"
    requires_auth = True
    
    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize the view."""
        self.hass = hass
    
    async def post(self, request: web.Request) -> web.Response:
        """Handle POST request to configure storage."""
        if not request["hass_user"].is_admin:
            raise Unauthorized()

        try:
            data = await request.json()
        except Exception:
            return self.json({"success": False, "error": "Invalid JSON"}, status_code=400)

        try:
            data = SERVICE_SET_STORAGE_CONFIG_SCHEMA(data)
        except vol.Invalid:
            return self.json({"success": False, "error": "Invalid storage configuration"}, status_code=400)
        
        # Find the cloud storage manager
        manager = None
        for entry_data in self.hass.data.get(DOMAIN, {}).values():
            if isinstance(entry_data, dict) and "cloud_storage_manager" in entry_data:
                manager = entry_data["cloud_storage_manager"]
                break
        
        if not manager:
            return self.json({"success": False, "error": "Storage manager not found"}, status_code=500)
        
        try:
            # Check if disconnecting
            if data.get("disconnect"):
                await manager.disconnect()
                _LOGGER.info("Disconnected cloud storage")
                return self.json({"success": True, "message": "Disconnected from cloud storage"})
            
            # Check if setting provider
            provider_str = data.get("provider")
            if provider_str:
                try:
                    provider = StorageProviderType(provider_str)
                    await manager.set_provider(provider)
                    _LOGGER.info("Set storage provider to: %s", provider.value)
                except ValueError:
                    return self.json({"success": False, "error": f"Invalid provider: {provider_str}"}, status_code=400)
            
            # Check if setting folder path
            folder_path = data.get("folder_path")
            if folder_path:
                manager.config.folder_path = folder_path
                await manager.async_save()
                _LOGGER.info("Set folder path to: %s", folder_path)
            
            return self.json({"success": True})
        
        except Exception as e:
            _LOGGER.error("Error configuring storage: %s", e)
            return self.json({"success": False, "error": str(e)}, status_code=500)


def async_register_views(hass: HomeAssistant) -> None:
    """Register HTTP views."""
    hass.http.register_view(ReceiptImageView(hass))
    hass.http.register_view(StorageStatusView(hass))
    hass.http.register_view(StorageConfigView(hass))
    _LOGGER.info("Registered Home Project Ledger HTTP views")
