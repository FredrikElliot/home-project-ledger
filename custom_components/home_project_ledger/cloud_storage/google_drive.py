"""Google Drive storage provider."""
from __future__ import annotations

import logging
import json
from typing import Any, Optional, TYPE_CHECKING

import aiohttp

from homeassistant.core import HomeAssistant

from .base import CloudStorageProvider, StorageConfig, StorageProviderType, StorageStatus

if TYPE_CHECKING:
    from homeassistant.helpers.config_entry_oauth2_flow import OAuth2Session

_LOGGER = logging.getLogger(__name__)

# Google API endpoints
GOOGLE_DRIVE_API = "https://www.googleapis.com/drive/v3"
GOOGLE_UPLOAD_API = "https://www.googleapis.com/upload/drive/v3"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"


class GoogleDriveProvider(CloudStorageProvider):
    """Google Drive storage provider using OAuth2Session."""
    
    provider_type = StorageProviderType.GOOGLE_DRIVE
    
    def __init__(
        self, 
        config: StorageConfig, 
        hass: HomeAssistant,
        oauth_session: Optional["OAuth2Session"] = None,
    ):
        """Initialize Google Drive provider."""
        super().__init__(config)
        self.hass = hass
        self._oauth_session = oauth_session
        self._folder_id: Optional[str] = None
        self._session: Optional[aiohttp.ClientSession] = None
    
    async def _get_session(self) -> aiohttp.ClientSession:
        """Get or create aiohttp session."""
        if self._session is None or self._session.closed:
            self._session = aiohttp.ClientSession()
        return self._session
    
    async def _get_access_token(self) -> Optional[str]:
        """Get a valid access token from the OAuth session."""
        if not self._oauth_session:
            _LOGGER.error("No OAuth session available")
            return None
        
        try:
            # OAuth2Session handles token refresh automatically
            await self._oauth_session.async_ensure_token_valid()
            return self._oauth_session.token.get("access_token")
        except Exception as e:
            _LOGGER.error("Error getting access token: %s", e)
            return None
    
    def get_auth_url(self) -> Optional[str]:
        """Get the OAuth authorization URL (not used with OAuth2Session)."""
        # OAuth flow is handled by Home Assistant's config flow
        return None
    
    async def authenticate(self, auth_code: Optional[str] = None) -> bool:
        """Authenticate with Google Drive (not used with OAuth2Session)."""
        # Authentication is handled by Home Assistant's config flow
        return self._oauth_session is not None
    
    async def _get_headers(self) -> Optional[dict[str, str]]:
        """Get authorization headers."""
        token = await self._get_access_token()
        if not token:
            return None
        return {
            "Authorization": f"Bearer {token}",
        }
    
    async def _ensure_folder(self) -> Optional[str]:
        """Ensure the storage folder exists and return its ID."""
        if self._folder_id:
            return self._folder_id
        
        headers = await self._get_headers()
        if not headers:
            _LOGGER.error("Cannot ensure folder: no valid access token")
            return None
        
        session = await self._get_session()
        
        # Parse folder path
        folder_parts = [p for p in self.config.folder_path.split("/") if p]
        
        parent_id = "root"
        for folder_name in folder_parts:
            # Search for existing folder
            query = f"name='{folder_name}' and '{parent_id}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false"
            
            async with session.get(
                f"{GOOGLE_DRIVE_API}/files",
                headers=headers,
                params={"q": query, "fields": "files(id,name)"},
            ) as response:
                if response.status != 200:
                    _LOGGER.error("Failed to search for folder: %s", await response.text())
                    return None
                
                data = await response.json()
                files = data.get("files", [])
                
                if files:
                    parent_id = files[0]["id"]
                else:
                    # Create the folder
                    metadata = {
                        "name": folder_name,
                        "mimeType": "application/vnd.google-apps.folder",
                        "parents": [parent_id],
                    }
                    
                    async with session.post(
                        f"{GOOGLE_DRIVE_API}/files",
                        headers={**headers, "Content-Type": "application/json"},
                        json=metadata,
                    ) as create_response:
                        if create_response.status != 200:
                            _LOGGER.error("Failed to create folder: %s", await create_response.text())
                            return None
                        
                        folder_data = await create_response.json()
                        parent_id = folder_data["id"]
                        _LOGGER.info("Created Google Drive folder: %s", folder_name)
        
        self._folder_id = parent_id
        return self._folder_id
    
    async def save_image(self, image_data: bytes, filename: str) -> str:
        """Save an image to Google Drive."""
        folder_id = await self._ensure_folder()
        if not folder_id:
            raise Exception("Failed to ensure Google Drive folder")
        
        headers = await self._get_headers()
        if not headers:
            raise Exception("No valid access token")
        
        session = await self._get_session()
        
        # Determine mime type from filename
        mime_type = "image/jpeg"
        if filename.lower().endswith(".png"):
            mime_type = "image/png"
        elif filename.lower().endswith(".gif"):
            mime_type = "image/gif"
        elif filename.lower().endswith(".webp"):
            mime_type = "image/webp"
        
        # Create multipart upload
        metadata = {
            "name": filename,
            "parents": [folder_id],
        }
        
        # Use multipart upload
        boundary = "===home_project_ledger_boundary==="
        body = (
            f"--{boundary}\r\n"
            f"Content-Type: application/json; charset=UTF-8\r\n\r\n"
            f"{json.dumps(metadata)}\r\n"
            f"--{boundary}\r\n"
            f"Content-Type: {mime_type}\r\n\r\n"
        ).encode("utf-8") + image_data + f"\r\n--{boundary}--".encode("utf-8")
        
        async with session.post(
            f"{GOOGLE_UPLOAD_API}/files?uploadType=multipart",
            headers={
                **headers,
                "Content-Type": f"multipart/related; boundary={boundary}",
            },
            data=body,
        ) as response:
            if response.status != 200:
                error_text = await response.text()
                _LOGGER.error("Failed to upload to Google Drive: %s", error_text)
                raise Exception(f"Upload failed: {error_text}")
            
            file_data = await response.json()
            file_id = file_data["id"]
            
            _LOGGER.debug("Uploaded image to Google Drive: %s (%s)", filename, file_id)
            
            # Return a reference path that includes the file ID
            return f"gdrive://{file_id}/{filename}"
    
    async def delete_image(self, image_path: str) -> bool:
        """Delete an image from Google Drive."""
        if not image_path.startswith("gdrive://"):
            return False
        
        try:
            # Parse file ID from path
            parts = image_path[9:].split("/", 1)
            file_id = parts[0]
            
            headers = await self._get_headers()
            if not headers:
                _LOGGER.error("Cannot delete: no valid access token")
                return False
            
            session = await self._get_session()
            
            async with session.delete(
                f"{GOOGLE_DRIVE_API}/files/{file_id}",
                headers=headers,
            ) as response:
                if response.status in (200, 204):
                    _LOGGER.debug("Deleted Google Drive file: %s", file_id)
                    return True
                else:
                    _LOGGER.error("Failed to delete Google Drive file: %s", await response.text())
                    return False
                    
        except Exception as e:
            _LOGGER.error("Error deleting from Google Drive: %s", e)
            return False
    
    async def get_image(self, image_path: str) -> Optional[bytes]:
        """Retrieve an image from Google Drive."""
        if not image_path.startswith("gdrive://"):
            return None
        
        try:
            parts = image_path[9:].split("/", 1)
            file_id = parts[0]
            
            headers = await self._get_headers()
            if not headers:
                _LOGGER.error("Cannot get image: no valid access token")
                return None
            
            session = await self._get_session()
            
            async with session.get(
                f"{GOOGLE_DRIVE_API}/files/{file_id}?alt=media",
                headers=headers,
            ) as response:
                if response.status == 200:
                    return await response.read()
                else:
                    _LOGGER.error("Failed to download from Google Drive: %s", response.status)
                    return None
                    
        except Exception as e:
            _LOGGER.error("Error downloading from Google Drive: %s", e)
            return None
    
    async def get_image_url(self, image_path: str) -> Optional[str]:
        """Get a web-accessible URL for a Google Drive image.
        
        Note: This returns a URL that requires authentication.
        For public access, the file would need to be shared publicly.
        """
        if not image_path.startswith("gdrive://"):
            return None
        
        parts = image_path[9:].split("/", 1)
        file_id = parts[0]
        
        # Return the direct download link (requires auth)
        return f"https://drive.google.com/uc?id={file_id}&export=download"
    
    async def get_status(self) -> StorageStatus:
        """Get the current status of Google Drive storage."""
        status = StorageStatus(
            connected=False,
            authenticated=False,
            provider_type=StorageProviderType.GOOGLE_DRIVE,
            provider_name="Google Drive",
        )
        
        if not self._oauth_session:
            status.error = "Not authenticated"
            return status
        
        try:
            headers = await self._get_headers()
            if not headers:
                status.error = "Cannot get access token"
                return status
            
            session = await self._get_session()
            
            # Get user info
            async with session.get(GOOGLE_USERINFO_URL, headers=headers) as response:
                if response.status == 200:
                    user_data = await response.json()
                    status.user_email = user_data.get("email")
                    status.user_name = user_data.get("name")
                    status.connected = True
                    status.authenticated = True
                else:
                    status.error = "Failed to get user info"
                    return status
            
            # Get storage quota
            async with session.get(
                f"{GOOGLE_DRIVE_API}/about?fields=storageQuota",
                headers=headers,
            ) as response:
                if response.status == 200:
                    about_data = await response.json()
                    quota = about_data.get("storageQuota", {})
                    if "usage" in quota:
                        status.storage_used = int(quota["usage"])
                    if "limit" in quota:
                        status.storage_total = int(quota["limit"])
            
            # Count images in our folder
            folder_id = await self._ensure_folder()
            if folder_id:
                async with session.get(
                    f"{GOOGLE_DRIVE_API}/files",
                    headers=headers,
                    params={
                        "q": f"'{folder_id}' in parents and trashed=false",
                        "fields": "files(id)",
                        "pageSize": 1000,
                    },
                ) as response:
                    if response.status == 200:
                        files_data = await response.json()
                        status.image_count = len(files_data.get("files", []))
            
        except Exception as e:
            _LOGGER.error("Error getting Google Drive status: %s", e)
            status.error = str(e)
        
        return status
    
    async def test_connection(self) -> bool:
        """Test Google Drive connection."""
        if not self._oauth_session:
            return False
        
        try:
            headers = await self._get_headers()
            if not headers:
                return False
            
            session = await self._get_session()
            
            async with session.get(GOOGLE_USERINFO_URL, headers=headers) as response:
                return response.status == 200
                
        except Exception:
            return False
    
    def is_configured(self) -> bool:
        """Check if Google Drive is properly configured."""
        return self._oauth_session is not None
    
    def needs_reauth(self) -> bool:
        """Check if re-authentication is needed."""
        return self._oauth_session is None
    
    async def disconnect(self) -> None:
        """Disconnect and clean up."""
        if self._session and not self._session.closed:
            await self._session.close()
        self._session = None
        self._folder_id = None
