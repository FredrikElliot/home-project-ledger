"""Local file storage provider."""
from __future__ import annotations

import logging
import os
from pathlib import Path
from typing import Optional

from homeassistant.core import HomeAssistant

from .base import CloudStorageProvider, StorageConfig, StorageProviderType, StorageStatus

_LOGGER = logging.getLogger(__name__)


class LocalStorageProvider(CloudStorageProvider):
    """Local file system storage provider."""
    
    provider_type = StorageProviderType.LOCAL
    
    def __init__(self, config: StorageConfig, hass: HomeAssistant):
        """Initialize local storage provider."""
        super().__init__(config)
        self.hass = hass
        self._base_path = Path(hass.config.path("www/home_project_ledger/receipts"))
    
    async def authenticate(self, auth_code: Optional[str] = None) -> bool:
        """Local storage doesn't need authentication."""
        return True
    
    def get_auth_url(self) -> Optional[str]:
        """Local storage doesn't use OAuth."""
        return None
    
    async def save_image(self, image_data: bytes, filename: str) -> str:
        """Save an image to local storage."""
        # Ensure directory exists
        self._base_path.mkdir(parents=True, exist_ok=True)
        
        # Save the file
        file_path = self._base_path / filename
        
        def _write_file():
            with open(file_path, "wb") as f:
                f.write(image_data)
        
        await self.hass.async_add_executor_job(_write_file)
        
        # Return web-accessible path
        return f"/local/home_project_ledger/receipts/{filename}"
    
    async def delete_image(self, image_path: str) -> bool:
        """Delete an image from local storage."""
        try:
            # Convert web path to file path
            if image_path.startswith("/local/home_project_ledger/receipts/"):
                filename = image_path.split("/")[-1]
                file_path = self._base_path / filename
                
                def _delete_file():
                    if file_path.exists():
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
            if image_path.startswith("/local/home_project_ledger/receipts/"):
                filename = image_path.split("/")[-1]
                file_path = self._base_path / filename
                
                def _read_file():
                    if file_path.exists():
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
            provider=StorageProviderType.LOCAL,
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
            status.user_name = "Local Storage"
            
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
