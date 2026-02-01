"""Config flow for Home Project Ledger integration."""
from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol

from homeassistant import config_entries
from homeassistant.core import HomeAssistant, callback
from homeassistant.data_entry_flow import FlowResult

from .const import (
    DOMAIN,
    DEFAULT_CURRENCY,
    CONF_GOOGLE_CLIENT_ID,
    CONF_GOOGLE_CLIENT_SECRET,
    CONF_ONEDRIVE_CLIENT_ID,
    CONF_ONEDRIVE_CLIENT_SECRET,
    CONF_DROPBOX_APP_KEY,
    CONF_DROPBOX_APP_SECRET,
)

_LOGGER = logging.getLogger(__name__)

STEP_USER_DATA_SCHEMA = vol.Schema(
    {
        vol.Optional("currency", default=DEFAULT_CURRENCY): str,
    }
)


class ProjectLedgerConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Home Project Ledger."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Handle the initial step."""
        if user_input is None:
            return self.async_show_form(
                step_id="user", data_schema=STEP_USER_DATA_SCHEMA
            )

        # Check if already configured
        await self.async_set_unique_id(DOMAIN)
        self._abort_if_unique_id_configured()

        return self.async_create_entry(
            title="Home Project Ledger",
            data=user_input,
        )

    @staticmethod
    @callback
    def async_get_options_flow(
        config_entry: config_entries.ConfigEntry,
    ) -> config_entries.OptionsFlow:
        """Create the options flow."""
        return ProjectLedgerOptionsFlow(config_entry)


class ProjectLedgerOptionsFlow(config_entries.OptionsFlow):
    """Handle options flow for Home Project Ledger."""

    def __init__(self, config_entry: config_entries.ConfigEntry) -> None:
        """Initialize options flow."""
        self.config_entry = config_entry

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Manage the options."""
        if user_input is not None:
            # Filter out empty strings
            cleaned_input = {k: v for k, v in user_input.items() if v}
            return self.async_create_entry(title="", data=cleaned_input)

        # Get current values from options or data
        current_options = {**self.config_entry.data, **self.config_entry.options}

        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema(
                {
                    vol.Optional(
                        CONF_GOOGLE_CLIENT_ID,
                        description={"suggested_value": current_options.get(CONF_GOOGLE_CLIENT_ID, "")},
                    ): str,
                    vol.Optional(
                        CONF_GOOGLE_CLIENT_SECRET,
                        description={"suggested_value": current_options.get(CONF_GOOGLE_CLIENT_SECRET, "")},
                    ): str,
                    vol.Optional(
                        CONF_DROPBOX_APP_KEY,
                        description={"suggested_value": current_options.get(CONF_DROPBOX_APP_KEY, "")},
                    ): str,
                    vol.Optional(
                        CONF_DROPBOX_APP_SECRET,
                        description={"suggested_value": current_options.get(CONF_DROPBOX_APP_SECRET, "")},
                    ): str,
                    vol.Optional(
                        CONF_ONEDRIVE_CLIENT_ID,
                        description={"suggested_value": current_options.get(CONF_ONEDRIVE_CLIENT_ID, "")},
                    ): str,
                    vol.Optional(
                        CONF_ONEDRIVE_CLIENT_SECRET,
                        description={"suggested_value": current_options.get(CONF_ONEDRIVE_CLIENT_SECRET, "")},
                    ): str,
                }
            ),
        )
