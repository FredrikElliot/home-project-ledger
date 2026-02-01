"""Config flow for Home Project Ledger integration."""
from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol

from homeassistant import config_entries
from homeassistant.core import callback
from homeassistant.data_entry_flow import FlowResult
from homeassistant.helpers import config_entry_oauth2_flow

from .const import (
    DOMAIN,
    DEFAULT_CURRENCY,
    STORAGE_PROVIDER_LOCAL,
    STORAGE_PROVIDER_GOOGLE_DRIVE,
    STORAGE_PROVIDER_DROPBOX,
    STORAGE_PROVIDER_ONEDRIVE,
    CONF_STORAGE_PROVIDER,
    GOOGLE_AUTH_URL,
    GOOGLE_TOKEN_URL,
    GOOGLE_DRIVE_SCOPES,
    DROPBOX_AUTH_URL,
    DROPBOX_TOKEN_URL,
    ONEDRIVE_AUTH_URL,
    ONEDRIVE_TOKEN_URL,
    ONEDRIVE_SCOPES,
)

_LOGGER = logging.getLogger(__name__)

STORAGE_PROVIDERS = {
    STORAGE_PROVIDER_LOCAL: "Local Storage",
    STORAGE_PROVIDER_GOOGLE_DRIVE: "Google Drive",
    STORAGE_PROVIDER_DROPBOX: "Dropbox",
    STORAGE_PROVIDER_ONEDRIVE: "OneDrive",
}

# Available cloud providers (ones we've implemented)
AVAILABLE_CLOUD_PROVIDERS = [STORAGE_PROVIDER_GOOGLE_DRIVE]


class ProjectLedgerConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Home Project Ledger."""

    VERSION = 1
    
    def __init__(self) -> None:
        """Initialize the config flow."""
        self._selected_provider: str | None = None
        self._oauth_implementation: config_entry_oauth2_flow.AbstractOAuth2Implementation | None = None

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Handle the initial step - choose storage type."""
        # Check if already configured
        await self.async_set_unique_id(DOMAIN)
        self._abort_if_unique_id_configured()

        if user_input is None:
            return self.async_show_form(
                step_id="user",
                data_schema=vol.Schema({
                    vol.Required("currency", default=DEFAULT_CURRENCY): str,
                    vol.Required(CONF_STORAGE_PROVIDER, default=STORAGE_PROVIDER_LOCAL): vol.In({
                        STORAGE_PROVIDER_LOCAL: "Local Storage (default)",
                        STORAGE_PROVIDER_GOOGLE_DRIVE: "Google Drive",
                    }),
                }),
            )

        self._selected_provider = user_input.get(CONF_STORAGE_PROVIDER, STORAGE_PROVIDER_LOCAL)
        
        # If local storage, create entry directly
        if self._selected_provider == STORAGE_PROVIDER_LOCAL:
            return self.async_create_entry(
                title="Home Project Ledger",
                data={
                    "currency": user_input.get("currency", DEFAULT_CURRENCY),
                    CONF_STORAGE_PROVIDER: STORAGE_PROVIDER_LOCAL,
                },
            )
        
        # For cloud storage, check if credentials are configured
        # Store currency for later
        self.context["currency"] = user_input.get("currency", DEFAULT_CURRENCY)
        
        # Check for application credentials
        try:
            implementations = await config_entry_oauth2_flow.async_get_implementations(
                self.hass, DOMAIN
            )
            
            if not implementations:
                # No credentials configured - direct user to add them
                return self.async_show_form(
                    step_id="credentials_needed",
                    description_placeholders={
                        "provider": STORAGE_PROVIDERS.get(self._selected_provider, self._selected_provider),
                    },
                )
            
            # Pick the first implementation (or the one matching the provider)
            self._oauth_implementation = list(implementations.values())[0]
            
            # Start OAuth flow
            return await self.async_step_auth()
            
        except Exception as err:
            _LOGGER.warning("Application credentials not available: %s", err)
            return self.async_show_form(
                step_id="credentials_needed",
                description_placeholders={
                    "provider": STORAGE_PROVIDERS.get(self._selected_provider, self._selected_provider),
                },
            )

    async def async_step_credentials_needed(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Show message that credentials need to be configured."""
        if user_input is not None:
            # User acknowledged - restart the flow
            return await self.async_step_user()
        
        return self.async_show_form(
            step_id="credentials_needed",
            description_placeholders={
                "provider": STORAGE_PROVIDERS.get(self._selected_provider, self._selected_provider),
            },
        )

    async def async_step_auth(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Handle OAuth authorization."""
        if self._oauth_implementation is None:
            return self.async_abort(reason="missing_credentials")
        
        # Generate authorization URL
        url = await self._oauth_implementation.async_generate_authorize_url(
            self.flow_id
        )
        
        return self.async_external_step(step_id="auth", url=url)

    async def async_step_auth_confirm(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Handle OAuth callback - exchange code for token."""
        if user_input is None:
            return self.async_abort(reason="no_code")
        
        try:
            token = await self._oauth_implementation.async_resolve_external_data(
                user_input
            )
        except Exception as err:
            _LOGGER.error("Error exchanging OAuth code: %s", err)
            return self.async_abort(reason="oauth_error")
        
        # Create the config entry with OAuth token
        return self.async_create_entry(
            title=f"Home Project Ledger ({STORAGE_PROVIDERS.get(self._selected_provider, 'Cloud')})",
            data={
                "currency": self.context.get("currency", DEFAULT_CURRENCY),
                CONF_STORAGE_PROVIDER: self._selected_provider,
                "auth_implementation": self._oauth_implementation.domain,
                "token": token,
            },
        )

    async def async_step_reauth(
        self, entry_data: dict[str, Any]
    ) -> FlowResult:
        """Handle re-authentication when token expires."""
        self._selected_provider = entry_data.get(CONF_STORAGE_PROVIDER, STORAGE_PROVIDER_GOOGLE_DRIVE)
        self.context["currency"] = entry_data.get("currency", DEFAULT_CURRENCY)
        
        implementations = await config_entry_oauth2_flow.async_get_implementations(
            self.hass, DOMAIN
        )
        
        if not implementations:
            return self.async_abort(reason="missing_credentials")
        
        self._oauth_implementation = list(implementations.values())[0]
        return await self.async_step_auth()

    @staticmethod
    @callback
    def async_get_options_flow(
        config_entry: config_entries.ConfigEntry,
    ) -> config_entries.OptionsFlow:
        """Create the options flow."""
        return ProjectLedgerOptionsFlow()


class ProjectLedgerOptionsFlow(config_entries.OptionsFlow):
    """Handle options flow for Home Project Ledger."""

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Manage the options."""
        if user_input is not None:
            return self.async_create_entry(title="", data=user_input)

        current_currency = self.config_entry.data.get("currency", DEFAULT_CURRENCY)
        current_provider = self.config_entry.data.get(CONF_STORAGE_PROVIDER, STORAGE_PROVIDER_LOCAL)

        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema({
                vol.Optional(
                    "currency",
                    description={"suggested_value": current_currency},
                ): str,
            }),
            description_placeholders={
                "current_provider": STORAGE_PROVIDERS.get(current_provider, current_provider),
            },
        )
