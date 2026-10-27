"""Local file storage provider."""
from __future__ import annotations

import logging
import os
from datetime import timedelta
from pathlib import Path
from typing import Optional

from homeassistant.core import HomeAssistant
from homeassistant.components.http.auth import async_sign_path

from ..const import RECEIPT_IMAGE_DIR, RECEIPT_IMAGE_URL
from .base import CloudStorageProvider, StorageConfig, StorageProviderType, StorageStatus

_LOGGER = logging.getLogger(__name__)


class LocalStorageProvider(CloudStorageProvider):
    """Local file system storage provider."""
    
    provider_type = StorageProviderType.LOCAL
    
    def __init__(self, config: StorageConfig, hass: HomeAssistant):
        """Initialize local storage provider."""
        super().__init__(config)
        self.hass = hass
        self._base_path = Path(hass.config.path(RECEIPT_IMAGE_DIR))

    def _image_path(self, image_path: str) -> Path | None:
        """Resolve only receipt filenames inside private storage."""
        if not image_path.startswith(RECEIPT_IMAGE_URL):
            return None
        filename = image_path[len(RECEIPT_IMAGE_URL):]
        if filename in ("", ".", "..") or "/" in filename or "\\" in filename:
            return None
        path = (self._base_path / filename).resolve()
        if path.parent != self._base_path.resolve():
            return None
        return path
    
    async def authenticate(self) -> bool:
        """Local storage doesn't need authentication."""
        return True
    
    def get_auth_url(self) -> Optional[str]:
        """Local storage doesn't use OAuth."""
        return None
    
    async def save_image(self, image_data: bytes, filename: str) -> str:
        """Save an image to local storage."""
        def _write_file():
            self._base_path.mkdir(parents=True, exist_ok=True)
            file_path = self._image_path(f"{RECEIPT_IMAGE_URL}{filename}")
            if file_path is None:
                raise ValueError("Invalid receipt filename")
            with open(file_path, "wb") as f:
                f.write(image_data)
        
        await self.hass.async_add_executor_job(_write_file)
        
        return f"{RECEIPT_IMAGE_URL}{filename}"
    
    async def delete_image(self, image_path: str) -> bool:
        """Delete an image from local storage."""
        try:
            if image_path.startswith(RECEIPT_IMAGE_URL):
                def _delete_file():
                    file_path = self._image_path(image_path)
                    if file_path is not None and file_path.is_file():
                        os.remove(file_path)
                        return True
                    return False
                
                return await self.hass.async_add_executor_job(_delete_file)
            return False
        except Exception as e:
            _LOGGER.error("Failed to delete local image: %s", e)
            return False
    
    async def get_image(self, image_path: str) -> Optional[bytes]:
        """Retrieve an image from local storage."""
        try:
            if image_path.startswith(RECEIPT_IMAGE_URL):
                def _read_file():
                    file_path = self._image_path(image_path)
                    if file_path is not None and file_path.is_file():
                        with open(file_path, "rb") as f:
                            return f.read()
                    return None
                
                return await self.hass.async_add_executor_job(_read_file)
            return None
        except Exception as e:
            _LOGGER.error("Failed to read local image: %s", e)
            return None
    
    async def get_status(self) -> StorageStatus:
        """Get the current status of local storage."""
        status = StorageStatus(
            connected=True,
            authenticated=True,
            provider_type=StorageProviderType.LOCAL,
            provider_name="Local Storage",
        )
        
        try:
            def _get_stats():
                if not self._base_path.exists():
                    return 0, 0
                
                total_size = 0
                count = 0
                for f in self._base_path.iterdir():
                    if f.is_file():
                        total_size += f.stat().st_size
                        count += 1
                return total_size, count
            
            used, count = await self.hass.async_add_executor_job(_get_stats)
            status.storage_used = used
            status.image_count = count
            
        except Exception as e:
            _LOGGER.error("Failed to get local storage stats: %s", e)
            status.error = str(e)
        
        return status
    
    async def test_connection(self) -> bool:
        """Test local storage access."""
        try:
            self._base_path.mkdir(parents=True, exist_ok=True)
            return True
        except Exception:
            return False
    
    def is_configured(self) -> bool:
        """Local storage is always configured."""
        return True
    
    def needs_reauth(self) -> bool:
        """Local storage never needs re-authentication."""
        return False
    
    async def get_image_url(self, image_path: str) -> Optional[str]:
        """Get a short-lived signed URL for an image."""
        if image_path.startswith(RECEIPT_IMAGE_URL):
            return async_sign_path(self.hass, image_path, timedelta(minutes=5))
        return None
