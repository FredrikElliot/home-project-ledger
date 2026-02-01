"""Cloud storage manager for Home Project Ledger."""
from __future__ import annotations

import logging
from typing import Any, Optional

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import DOMAIN, STORAGE_KEY_CONFIG
from .cloud_storage.base import (
    CloudStorageProvider,
    StorageConfig,
    StorageProviderType,
    StorageStatus,
)
from .cloud_storage.local import LocalStorageProvider
from .cloud_storage.google_drive import GoogleDriveProvider

_LOGGER = logging.getLogger(__name__)

STORAGE_VERSION = 1


class CloudStorageManager:
    """Manages cloud storage providers and configuration."""
    
    def __init__(
        self,
        hass: HomeAssistant,
        google_client_id: Optional[str] = None,
        google_client_secret: Optional[str] = None,
        onedrive_client_id: Optional[str] = None,
        onedrive_client_secret: Optional[str] = None,
        dropbox_app_key: Optional[str] = None,
        dropbox_app_secret: Optional[str] = None,
    ):
        """Initialize the cloud storage manager."""
        self.hass = hass
        self._store = Store(hass, STORAGE_VERSION, STORAGE_KEY_CONFIG)
        self._config: StorageConfig = StorageConfig()
        self._provider: Optional[CloudStorageProvider] = None
        
        # OAuth credentials for each provider
        self._google_client_id = google_client_id
        self._google_client_secret = google_client_secret
        self._onedrive_client_id = onedrive_client_id
        self._onedrive_client_secret = onedrive_client_secret
        self._dropbox_app_key = dropbox_app_key
        self._dropbox_app_secret = dropbox_app_secret
    
    async def async_load(self) -> None:
        """Load configuration from storage."""
        data = await self._store.async_load()
        if data:
            self._config = StorageConfig.from_dict(data)
        else:
            self._config = StorageConfig()
        
        # Initialize the provider
        await self._init_provider()
        _LOGGER.info("Loaded cloud storage config: provider=%s", self._config.provider.value)
    
    async def async_save(self) -> None:
        """Save configuration to storage."""
        await self._store.async_save(self._config.to_dict())
    
    async def _init_provider(self) -> None:
        """Initialize the current storage provider."""
        # Clean up existing provider
        if self._provider and hasattr(self._provider, 'disconnect'):
            await self._provider.disconnect()
        
        provider_type = self._config.provider
        
        if provider_type == StorageProviderType.GOOGLE_DRIVE:
            self._provider = GoogleDriveProvider(
                self._config,
                self.hass,
                client_id=self._google_client_id,
                client_secret=self._google_client_secret,
            )
        elif provider_type == StorageProviderType.ONEDRIVE:
            # TODO: Implement OneDrive provider
            _LOGGER.warning("OneDrive provider not yet implemented, falling back to local")
            self._provider = LocalStorageProvider(self._config, self.hass)
        elif provider_type == StorageProviderType.DROPBOX:
            # TODO: Implement Dropbox provider
            _LOGGER.warning("Dropbox provider not yet implemented, falling back to local")
            self._provider = LocalStorageProvider(self._config, self.hass)
        elif provider_type == StorageProviderType.WEBDAV:
            # TODO: Implement WebDAV provider
            _LOGGER.warning("WebDAV provider not yet implemented, falling back to local")
            self._provider = LocalStorageProvider(self._config, self.hass)
        else:
            self._provider = LocalStorageProvider(self._config, self.hass)
    
    @property
    def provider(self) -> CloudStorageProvider:
        """Get the current storage provider."""
        if not self._provider:
            self._provider = LocalStorageProvider(self._config, self.hass)
        return self._provider
    
    @property
    def config(self) -> StorageConfig:
        """Get the current configuration."""
        return self._config
    
    def get_available_providers(self) -> list[dict[str, Any]]:
        """Get list of available storage providers with configuration status."""
        return [
            {
                "type": StorageProviderType.LOCAL.value,
                "name": "Local Storage",
                "configured": True,
                "available": True,
                "description": "Store images on the Home Assistant server",
            },
            {
                "type": StorageProviderType.GOOGLE_DRIVE.value,
                "name": "Google Drive",
                "configured": bool(self._google_client_id and self._google_client_secret),
                "available": True,
                "description": "Store images in your Google Drive account",
            },
            {
                "type": StorageProviderType.ONEDRIVE.value,
                "name": "OneDrive",
                "configured": bool(self._onedrive_client_id and self._onedrive_client_secret),
                "available": False,  # Not yet implemented
                "description": "Store images in your Microsoft OneDrive account",
            },
            {
                "type": StorageProviderType.DROPBOX.value,
                "name": "Dropbox",
                "configured": bool(self._dropbox_app_key and self._dropbox_app_secret),
                "available": False,  # Not yet implemented
                "description": "Store images in your Dropbox account",
            },
            {
                "type": StorageProviderType.WEBDAV.value,
                "name": "WebDAV",
                "configured": True,  # WebDAV uses per-config credentials
                "available": False,  # Not yet implemented
                "description": "Store images on a WebDAV server (Nextcloud, ownCloud, etc.)",
            },
        ]
    
    async def set_provider(self, provider_type: StorageProviderType) -> bool:
        """Set the storage provider type."""
        if self._config.provider == provider_type:
            return True
        
        self._config.provider = provider_type
        # Clear auth tokens when switching providers
        self._config.access_token = None
        self._config.refresh_token = None
        self._config.token_expiry = None
        
        await self._init_provider()
        await self.async_save()
        
        _LOGGER.info("Switched storage provider to: %s", provider_type.value)
        return True
    
    def get_auth_url(self) -> Optional[str]:
        """Get the OAuth authorization URL for the current provider."""
        return self.provider.get_auth_url()
    
    async def authenticate(self, auth_code: str) -> bool:
        """Authenticate with the current provider using an auth code."""
        success = await self.provider.authenticate(auth_code)
        if success:
            await self.async_save()
        return success
    
    async def disconnect(self) -> bool:
        """Disconnect from the current cloud provider and switch to local."""
        self._config.provider = StorageProviderType.LOCAL
        self._config.access_token = None
        self._config.refresh_token = None
        self._config.token_expiry = None
        
        await self._init_provider()
        await self.async_save()
        
        _LOGGER.info("Disconnected cloud storage, switched to local")
        return True
    
    async def get_status(self) -> StorageStatus:
        """Get the current storage status."""
        return await self.provider.get_status()
    
    async def save_image(self, image_data: bytes, filename: str) -> str:
        """Save an image using the current provider."""
        return await self.provider.save_image(image_data, filename)
    
    async def delete_image(self, image_path: str) -> bool:
        """Delete an image using the appropriate provider."""
        # Determine which provider owns this image based on the path
        if image_path.startswith("gdrive://"):
            if isinstance(self.provider, GoogleDriveProvider):
                return await self.provider.delete_image(image_path)
            else:
                # Create temporary provider to delete
                temp_provider = GoogleDriveProvider(
                    self._config, self.hass,
                    self._google_client_id, self._google_client_secret
                )
                return await temp_provider.delete_image(image_path)
        elif image_path.startswith("/local/"):
            local_provider = LocalStorageProvider(self._config, self.hass)
            return await local_provider.delete_image(image_path)
        else:
            return await self.provider.delete_image(image_path)
    
    async def get_image(self, image_path: str) -> Optional[bytes]:
        """Get an image using the appropriate provider."""
        if image_path.startswith("gdrive://"):
            if isinstance(self.provider, GoogleDriveProvider):
                return await self.provider.get_image(image_path)
            else:
                temp_provider = GoogleDriveProvider(
                    self._config, self.hass,
                    self._google_client_id, self._google_client_secret
                )
                return await temp_provider.get_image(image_path)
        elif image_path.startswith("/local/"):
            local_provider = LocalStorageProvider(self._config, self.hass)
            return await local_provider.get_image(image_path)
        else:
            return await self.provider.get_image(image_path)
    
    def set_webdav_credentials(
        self,
        url: str,
        username: str,
        password: str,
    ) -> None:
        """Set WebDAV credentials."""
        self._config.webdav_url = url
        self._config.webdav_username = username
        self._config.webdav_password = password
