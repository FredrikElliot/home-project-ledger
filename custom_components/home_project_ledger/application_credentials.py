"""Application credentials for Home Project Ledger OAuth2 providers."""
from __future__ import annotations

from homeassistant.components.application_credentials import (
    AuthorizationServer,
    ClientCredential,
)
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_entry_oauth2_flow

from .const import (
    DOMAIN,
    GOOGLE_AUTH_URL,
    GOOGLE_TOKEN_URL,
    GOOGLE_DRIVE_SCOPES,
    DROPBOX_AUTH_URL,
    DROPBOX_TOKEN_URL,
    DROPBOX_SCOPES,
    ONEDRIVE_AUTH_URL,
    ONEDRIVE_TOKEN_URL,
    ONEDRIVE_SCOPES,
    STORAGE_PROVIDER_GOOGLE_DRIVE,
    STORAGE_PROVIDER_DROPBOX,
    STORAGE_PROVIDER_ONEDRIVE,
)


async def async_get_auth_implementation(
    hass: HomeAssistant, auth_domain: str, credential: ClientCredential
) -> config_entry_oauth2_flow.AbstractOAuth2Implementation:
    """Return auth implementation for a custom auth domain."""
    # Determine which provider based on the auth_domain or credential
    # The auth_domain will be like "home_project_ledger_google_drive"
    if "google" in auth_domain.lower():
        return GoogleDriveOAuth2Implementation(
            hass,
            DOMAIN,
            credential,
        )
    elif "dropbox" in auth_domain.lower():
        return DropboxOAuth2Implementation(
            hass,
            DOMAIN,
            credential,
        )
    elif "onedrive" in auth_domain.lower() or "microsoft" in auth_domain.lower():
        return OneDriveOAuth2Implementation(
            hass,
            DOMAIN,
            credential,
        )
    
    # Default to Google Drive
    return GoogleDriveOAuth2Implementation(
        hass,
        DOMAIN,
        credential,
    )


async def async_get_authorization_server(hass: HomeAssistant) -> AuthorizationServer:
    """Return the authorization server for Google Drive (default)."""
    return AuthorizationServer(
        authorize_url=GOOGLE_AUTH_URL,
        token_url=GOOGLE_TOKEN_URL,
    )


class GoogleDriveOAuth2Implementation(config_entry_oauth2_flow.LocalOAuth2Implementation):
    """Google Drive OAuth2 implementation."""

    def __init__(
        self,
        hass: HomeAssistant,
        domain: str,
        credential: ClientCredential,
    ) -> None:
        """Initialize Google Drive OAuth2 implementation."""
        super().__init__(
            hass,
            domain,
            credential.client_id,
            credential.client_secret,
            GOOGLE_AUTH_URL,
            GOOGLE_TOKEN_URL,
        )

    @property
    def extra_authorize_data(self) -> dict:
        """Extra data to include in the authorize request."""
        return {
            "scope": " ".join(GOOGLE_DRIVE_SCOPES),
            "access_type": "offline",
            "prompt": "consent",
        }

    @property
    def name(self) -> str:
        """Name of the implementation."""
        return "Google Drive"


class DropboxOAuth2Implementation(config_entry_oauth2_flow.LocalOAuth2Implementation):
    """Dropbox OAuth2 implementation."""

    def __init__(
        self,
        hass: HomeAssistant,
        domain: str,
        credential: ClientCredential,
    ) -> None:
        """Initialize Dropbox OAuth2 implementation."""
        super().__init__(
            hass,
            domain,
            credential.client_id,
            credential.client_secret,
            DROPBOX_AUTH_URL,
            DROPBOX_TOKEN_URL,
        )

    @property
    def extra_authorize_data(self) -> dict:
        """Extra data to include in the authorize request."""
        return {
            "token_access_type": "offline",
        }

    @property
    def name(self) -> str:
        """Name of the implementation."""
        return "Dropbox"


class OneDriveOAuth2Implementation(config_entry_oauth2_flow.LocalOAuth2Implementation):
    """OneDrive OAuth2 implementation."""

    def __init__(
        self,
        hass: HomeAssistant,
        domain: str,
        credential: ClientCredential,
    ) -> None:
        """Initialize OneDrive OAuth2 implementation."""
        super().__init__(
            hass,
            domain,
            credential.client_id,
            credential.client_secret,
            ONEDRIVE_AUTH_URL,
            ONEDRIVE_TOKEN_URL,
        )

    @property
    def extra_authorize_data(self) -> dict:
        """Extra data to include in the authorize request."""
        return {
            "scope": " ".join(ONEDRIVE_SCOPES),
            "response_mode": "query",
        }

    @property
    def name(self) -> str:
        """Name of the implementation."""
        return "OneDrive"
