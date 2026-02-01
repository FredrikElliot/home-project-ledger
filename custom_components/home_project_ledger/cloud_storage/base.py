"""Base classes for cloud storage providers."""
from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Optional
import logging

_LOGGER = logging.getLogger(__name__)


class StorageProviderType(str, Enum):
    """Supported storage provider types."""
    LOCAL = "local"
    GOOGLE_DRIVE = "google_drive"
    ONEDRIVE = "onedrive"
    DROPBOX = "dropbox"
    WEBDAV = "webdav"


@dataclass
class StorageConfig:
    """Configuration for cloud storage."""
    provider: StorageProviderType = StorageProviderType.LOCAL
    
    # OAuth tokens (for Google Drive, OneDrive, Dropbox)
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    token_expiry: Optional[str] = None
    
    # WebDAV specific
    webdav_url: Optional[str] = None
    webdav_username: Optional[str] = None
    webdav_password: Optional[str] = None
    
    # Common settings
    folder_path: str = "/HomeProjectLedger/receipts"
    
    # Provider-specific metadata
    extra: dict = field(default_factory=dict)
    
    def to_dict(self) -> dict[str, Any]:
        """Convert to dictionary for storage."""
        return {
            "provider": self.provider.value,
            "access_token": self.access_token,
            "refresh_token": self.refresh_token,
            "token_expiry": self.token_expiry,
            "webdav_url": self.webdav_url,
            "webdav_username": self.webdav_username,
            "webdav_password": self.webdav_password,
            "folder_path": self.folder_path,
            "extra": self.extra,
        }
    
    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "StorageConfig":
        """Create from dictionary."""
        provider_str = data.get("provider", "local")
        try:
            provider = StorageProviderType(provider_str)
        except ValueError:
            provider = StorageProviderType.LOCAL
            
        return cls(
            provider=provider,
            access_token=data.get("access_token"),
            refresh_token=data.get("refresh_token"),
            token_expiry=data.get("token_expiry"),
            webdav_url=data.get("webdav_url"),
            webdav_username=data.get("webdav_username"),
            webdav_password=data.get("webdav_password"),
            folder_path=data.get("folder_path", "/HomeProjectLedger/receipts"),
            extra=data.get("extra", {}),
        )


@dataclass
class StorageStatus:
    """Status of a storage provider."""
    connected: bool = False
    authenticated: bool = False
    provider_type: StorageProviderType = StorageProviderType.LOCAL
    provider_name: str = "Local Storage"
    user_email: Optional[str] = None
    user_name: Optional[str] = None
    storage_used: Optional[int] = None  # bytes
    storage_total: Optional[int] = None  # bytes
    image_count: Optional[int] = None
    error: Optional[str] = None
    
    def to_dict(self) -> dict[str, Any]:
        """Convert to dictionary."""
        return {
            "connected": self.connected,
            "authenticated": self.authenticated,
            "provider_type": self.provider_type.value,
            "provider_name": self.provider_name,
            "user_email": self.user_email,
            "user_name": self.user_name,
            "storage_used": self.storage_used,
            "storage_total": self.storage_total,
            "image_count": self.image_count,
            "error": self.error,
        }


class CloudStorageProvider(ABC):
    """Abstract base class for cloud storage providers."""
    
    provider_type: StorageProviderType
    
    def __init__(self, config: StorageConfig):
        """Initialize the provider."""
        self.config = config
    
    @abstractmethod
    async def authenticate(self, auth_code: Optional[str] = None) -> bool:
        """Authenticate with the provider.
        
        For OAuth providers, if auth_code is None, this should return False
        and get_auth_url() should be called to get the authorization URL.
        
        Returns True if authentication was successful.
        """
        pass
    
    @abstractmethod
    def get_auth_url(self) -> Optional[str]:
        """Get the OAuth authorization URL.
        
        Returns None if the provider doesn't use OAuth.
        """
        pass
    
    @abstractmethod
    async def save_image(self, image_data: bytes, filename: str) -> str:
        """Save an image to storage.
        
        Returns the path/URL to access the image.
        """
        pass
    
    @abstractmethod
    async def delete_image(self, image_path: str) -> bool:
        """Delete an image from storage.
        
        Returns True if deletion was successful.
        """
        pass
    
    @abstractmethod
    async def get_image(self, image_path: str) -> Optional[bytes]:
        """Retrieve an image from storage.
        
        Returns the image bytes or None if not found.
        """
        pass
    
    @abstractmethod
    async def get_image_url(self, image_path: str) -> Optional[str]:
        """Get a web-accessible URL for an image.
        
        Returns None if not available.
        """
        pass
    
    @abstractmethod
    async def get_status(self) -> StorageStatus:
        """Get the current status of this storage provider."""
        pass
    
    @abstractmethod
    async def test_connection(self) -> bool:
        """Test if the connection to the storage provider is working."""
        pass
    
    @abstractmethod
    def is_configured(self) -> bool:
        """Check if the provider is properly configured."""
        pass
    
    @abstractmethod
    def needs_reauth(self) -> bool:
        """Check if re-authentication is needed."""
        pass
    
    async def disconnect(self) -> None:
        """Clean up resources and disconnect."""
        pass
