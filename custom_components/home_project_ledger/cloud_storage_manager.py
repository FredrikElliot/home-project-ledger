"""Cloud storage manager for Home Project Ledger."""
from __future__ import annotations

import logging
from typing import Any, Optional, TYPE_CHECKING

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import (
    DOMAIN,
    STORAGE_KEY_CONFIG,
    STORAGE_PROVIDER_LOCAL,
    STORAGE_PROVIDER_GOOGLE_DRIVE,
    STORAGE_PROVIDER_DROPBOX,
    STORAGE_PROVIDER_ONEDRIVE,
)
from .cloud_storage.base import (
    CloudStorageProvider,
    StorageConfig,
    StorageProviderType,
    StorageStatus,
)
from .cloud_storage.local import LocalStorageProvider
from .cloud_storage.google_drive import GoogleDriveProvider

if TYPE_CHECKING:
    from homeassistant.helpers.config_entry_oauth2_flow import OAuth2Session

_LOGGER = logging.getLogger(__name__)

STORAGE_VERSION = 1


class CloudStorageManager:
    """Manages cloud storage providers and configuration."""
    
    def __init__(
        self,
        hass: HomeAssistant,
        storage_provider: str = STORAGE_PROVIDER_LOCAL,
        oauth_session: Optional["OAuth2Session"] = None,
    ):
        """Initialize the cloud storage manager."""
        self.hass = hass
        self._store = Store(hass, STORAGE_VERSION, STORAGE_KEY_CONFIG)
        self._config: StorageConfig = StorageConfig()
        self._provider: Optional[CloudStorageProvider] = None
        
        # Storage provider type from config entry
        self._storage_provider = storage_provider
        # OAuth session for cloud providers
        self._oauth_session = oauth_session
    
    async def async_load(self) -> None:
        """Load configuration from storage."""
        data = await self._store.async_load()
        if data:
            self._config = StorageConfig.from_dict(data)
        else:
            self._config = StorageConfig()
        
        # Set provider type based on config entry
        if self._storage_provider == STORAGE_PROVIDER_GOOGLE_DRIVE:
            self._config.provider = StorageProviderType.GOOGLE_DRIVE
        elif self._storage_provider == STORAGE_PROVIDER_DROPBOX:
            self._config.provider = StorageProviderType.DROPBOX
        elif self._storage_provider == STORAGE_PROVIDER_ONEDRIVE:
            self._config.provider = StorageProviderType.ONEDRIVE
        else:
            self._config.provider = StorageProviderType.LOCAL
        
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
        
        if provider_type == StorageProviderType.GOOGLE_DRIVE and self._oauth_session:
            self._provider = GoogleDriveProvider(
                self._config,
                self.hass,
                oauth_session=self._oauth_session,
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
        # Check if we have an OAuth session (means cloud is configured)
        has_oauth = self._oauth_session is not None
        
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
                "configured": has_oauth and self._storage_provider == STORAGE_PROVIDER_GOOGLE_DRIVE,
                "available": True,
                "description": "Store images in your Google Drive account",
            },
            {
                "type": StorageProviderType.ONEDRIVE.value,
                "name": "OneDrive",
                "configured": has_oauth and self._storage_provider == STORAGE_PROVIDER_ONEDRIVE,
                "available": False,  # Not yet implemented
                "description": "Store images in your Microsoft OneDrive account",
            },
            {
                "type": StorageProviderType.DROPBOX.value,
                "name": "Dropbox",
                "configured": has_oauth and self._storage_provider == STORAGE_PROVIDER_DROPBOX,
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
                _LOGGER.warning("Cannot delete Google Drive image: no Google Drive provider configured")
                return False
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
                _LOGGER.warning("Cannot get Google Drive image: no Google Drive provider configured")
                return None
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
