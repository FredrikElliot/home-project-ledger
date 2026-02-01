"""HTTP views for Home Project Ledger."""
from __future__ import annotations

import logging
from typing import Any

from aiohttp import web
from homeassistant.components.http import HomeAssistantView
from homeassistant.core import HomeAssistant

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)


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
        try:
            data = await request.json()
        except Exception:
            return self.json({"success": False, "error": "Invalid JSON"}, status_code=400)
        
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
                from .cloud_storage.base import StorageProviderType
                try:
                    provider = StorageProviderType(provider_str)
                    await manager.set_provider(provider)
                    _LOGGER.info("Set storage provider to: %s", provider.value)
                except ValueError:
                    return self.json({"success": False, "error": f"Invalid provider: {provider_str}"}, status_code=400)
            
            # Check if authenticating with OAuth code
            auth_code = data.get("auth_code")
            if auth_code:
                success = await manager.authenticate(auth_code)
                if not success:
                    return self.json({"success": False, "error": "Authentication failed"}, status_code=400)
                _LOGGER.info("Authenticated with cloud storage")
                return self.json({"success": True, "message": "Authentication successful"})
            
            # Check if setting WebDAV credentials
            webdav_url = data.get("webdav_url")
            if webdav_url:
                manager.set_webdav_credentials(
                    url=webdav_url,
                    username=data.get("webdav_username", ""),
                    password=data.get("webdav_password", ""),
                )
                await manager.async_save()
                _LOGGER.info("Set WebDAV credentials")
            
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


class OAuthCallbackView(HomeAssistantView):
    """View to handle OAuth callback."""
    
    url = "/api/home_project_ledger/oauth/callback"
    name = "api:home_project_ledger:oauth:callback"
    requires_auth = False  # Callback comes from OAuth provider
    
    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize the view."""
        self.hass = hass
    
    async def get(self, request: web.Request) -> web.Response:
        """Handle OAuth callback."""
        code = request.query.get("code")
        error = request.query.get("error")
        
        if error:
            return web.Response(
                text=f"""
                <html>
                <head><title>Authorization Error</title></head>
                <body>
                    <h1>Authorization Error</h1>
                    <p>Error: {error}</p>
                    <p>You can close this window.</p>
                </body>
                </html>
                """,
                content_type="text/html",
            )
        
        if not code:
            return web.Response(
                text="""
                <html>
                <head><title>Authorization Error</title></head>
                <body>
                    <h1>Authorization Error</h1>
                    <p>No authorization code received.</p>
                    <p>You can close this window.</p>
                </body>
                </html>
                """,
                content_type="text/html",
            )
        
        # Return page with code that user can copy
        return web.Response(
            text=f"""
            <html>
            <head>
                <title>Authorization Code</title>
                <style>
                    body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }}
                    .code-box {{ background: #f5f5f5; padding: 20px; border-radius: 8px; font-family: monospace; word-break: break-all; margin: 20px 0; }}
                    .instructions {{ color: #666; }}
                </style>
            </head>
            <body>
                <h1>✅ Authorization Successful</h1>
                <p class="instructions">Copy the code below and paste it in the Home Project Ledger settings:</p>
                <div class="code-box" id="code">{code}</div>
                <button onclick="navigator.clipboard.writeText(document.getElementById('code').textContent); this.textContent='Copied!';">
                    Copy Code
                </button>
                <p class="instructions">After pasting the code, you can close this window.</p>
            </body>
            </html>
            """,
            content_type="text/html",
        )


def async_register_views(hass: HomeAssistant) -> None:
    """Register HTTP views."""
    hass.http.register_view(StorageStatusView(hass))
    hass.http.register_view(StorageConfigView(hass))
    hass.http.register_view(OAuthCallbackView(hass))
    _LOGGER.info("Registered Home Project Ledger HTTP views")
