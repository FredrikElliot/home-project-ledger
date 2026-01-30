"""Service handlers for Home Project Ledger."""
from __future__ import annotations

import base64
import logging
import os
from datetime import datetime
from typing import Any

import voluptuous as vol

from homeassistant.core import HomeAssistant, ServiceCall
import homeassistant.helpers.config_validation as cv

from .const import (
    DEFAULT_CURRENCY,
    DOMAIN,
    RECEIPT_IMAGE_DIR,
    SERVICE_ADD_RECEIPT,
    SERVICE_CLOSE_PROJECT,
    SERVICE_CREATE_PROJECT,
    SERVICE_DELETE_RECEIPT,
    SERVICE_UPDATE_RECEIPT,
    STATUS_CLOSED,
)
from .coordinator import ProjectLedgerCoordinator
from .models import Project, Receipt
from .storage import ProjectLedgerStorage

_LOGGER = logging.getLogger(__name__)

# Service schemas
SERVICE_CREATE_PROJECT_SCHEMA = vol.Schema(
    {
        vol.Required("name"): cv.string,
        vol.Optional("area_id"): cv.string,
    }
)

SERVICE_CLOSE_PROJECT_SCHEMA = vol.Schema(
    {
        vol.Required("project_id"): cv.string,
    }
)

SERVICE_ADD_RECEIPT_SCHEMA = vol.Schema(
    {
        vol.Required("project_id"): cv.string,
        vol.Optional("area_id"): cv.string,
        vol.Required("merchant"): cv.string,
        vol.Required("date"): cv.string,
        vol.Required("total"): vol.Coerce(float),
        vol.Optional("currency", default=DEFAULT_CURRENCY): cv.string,
        vol.Optional("category_summary"): cv.string,
        vol.Optional("image_data"): cv.string,  # Base64 encoded image
        vol.Optional("image_filename"): cv.string,
    }
)

SERVICE_UPDATE_RECEIPT_SCHEMA = vol.Schema(
    {
        vol.Required("receipt_id"): cv.string,
        vol.Optional("merchant"): cv.string,
        vol.Optional("date"): cv.string,
        vol.Optional("total"): vol.Coerce(float),
        vol.Optional("currency"): cv.string,
        vol.Optional("category_summary"): cv.string,
    }
)

SERVICE_DELETE_RECEIPT_SCHEMA = vol.Schema(
    {
        vol.Required("receipt_id"): cv.string,
    }
)


async def async_setup_services(
    hass: HomeAssistant,
    storage: ProjectLedgerStorage,
    coordinator: ProjectLedgerCoordinator,
) -> None:
    """Set up services for Home Project Ledger."""

    async def handle_create_project(call: ServiceCall) -> None:
        """Handle create_project service call."""
        name = call.data["name"]
        area_id = call.data.get("area_id")

        _LOGGER.debug("Creating project: %s (area: %s)", name, area_id)

        project = Project.create(name=name, area_id=area_id)
        await storage.async_add_project(project)
        await coordinator.async_refresh_data()

        _LOGGER.info("Created project: %s (%s)", name, project.project_id)

    async def handle_close_project(call: ServiceCall) -> None:
        """Handle close_project service call."""
        project_id = call.data["project_id"]

        _LOGGER.debug("Closing project: %s", project_id)

        project = storage.get_project(project_id)
        if not project:
            _LOGGER.error("Project not found: %s", project_id)
            return

        project.status = STATUS_CLOSED
        project.closed_at = datetime.utcnow().isoformat()
        await storage.async_update_project(project)
        await coordinator.async_refresh_data()

        _LOGGER.info("Closed project: %s", project_id)

    async def handle_add_receipt(call: ServiceCall) -> None:
        """Handle add_receipt service call."""
        project_id = call.data["project_id"]
        area_id = call.data.get("area_id")
        merchant = call.data["merchant"]
        date = call.data["date"]
        total = call.data["total"]
        currency = call.data.get("currency", DEFAULT_CURRENCY)
        category_summary = call.data.get("category_summary")
        image_data = call.data.get("image_data")
        image_filename = call.data.get("image_filename")

        _LOGGER.debug("Adding receipt for project: %s", project_id)

        # Handle image upload
        image_path = None
        if image_data and image_filename:
            try:
                # Decode base64 image
                image_bytes = base64.b64decode(image_data)

                # Create unique filename
                receipt_dir = hass.config.path(RECEIPT_IMAGE_DIR)
                timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
                safe_filename = f"{timestamp}_{image_filename}"
                full_path = os.path.join(receipt_dir, safe_filename)

                # Save image
                with open(full_path, "wb") as f:
                    f.write(image_bytes)

                # Store relative path for web access
                image_path = f"/local/{DOMAIN}/receipts/{safe_filename}"
                _LOGGER.debug("Saved receipt image: %s", image_path)

            except Exception as err:
                _LOGGER.error("Failed to save receipt image: %s", err)

        receipt = Receipt.create(
            project_id=project_id,
            area_id=area_id,
            merchant=merchant,
            date=date,
            total=total,
            currency=currency,
            image_path=image_path,
            category_summary=category_summary,
        )

        await storage.async_add_receipt(receipt)
        await coordinator.async_refresh_data()

        _LOGGER.info("Added receipt: %s for project: %s", receipt.receipt_id, project_id)

    async def handle_update_receipt(call: ServiceCall) -> None:
        """Handle update_receipt service call."""
        receipt_id = call.data["receipt_id"]

        _LOGGER.debug("Updating receipt: %s", receipt_id)

        receipt = storage.get_receipt(receipt_id)
        if not receipt:
            _LOGGER.error("Receipt not found: %s", receipt_id)
            return

        # Update fields if provided
        if "merchant" in call.data:
            receipt.merchant = call.data["merchant"]
        if "date" in call.data:
            receipt.date = call.data["date"]
        if "total" in call.data:
            receipt.total = call.data["total"]
        if "currency" in call.data:
            receipt.currency = call.data["currency"]
        if "category_summary" in call.data:
            receipt.category_summary = call.data["category_summary"]

        receipt.updated_at = datetime.utcnow().isoformat()

        await storage.async_update_receipt(receipt)
        await coordinator.async_refresh_data()

        _LOGGER.info("Updated receipt: %s", receipt_id)

    async def handle_delete_receipt(call: ServiceCall) -> None:
        """Handle delete_receipt service call."""
        receipt_id = call.data["receipt_id"]

        _LOGGER.debug("Deleting receipt: %s", receipt_id)

        receipt = storage.get_receipt(receipt_id)
        if not receipt:
            _LOGGER.error("Receipt not found: %s", receipt_id)
            return

        # Delete image file if exists
        if receipt.image_path:
            try:
                # Convert web path to file path
                filename = os.path.basename(receipt.image_path)
                receipt_dir = hass.config.path(RECEIPT_IMAGE_DIR)
                full_path = os.path.join(receipt_dir, filename)
                if os.path.exists(full_path):
                    os.remove(full_path)
                    _LOGGER.debug("Deleted receipt image: %s", full_path)
            except Exception as err:
                _LOGGER.error("Failed to delete receipt image: %s", err)

        await storage.async_delete_receipt(receipt_id)
        await coordinator.async_refresh_data()

        _LOGGER.info("Deleted receipt: %s", receipt_id)

    # Register services
    hass.services.async_register(
        DOMAIN,
        SERVICE_CREATE_PROJECT,
        handle_create_project,
        schema=SERVICE_CREATE_PROJECT_SCHEMA,
    )

    hass.services.async_register(
        DOMAIN,
        SERVICE_CLOSE_PROJECT,
        handle_close_project,
        schema=SERVICE_CLOSE_PROJECT_SCHEMA,
    )

    hass.services.async_register(
        DOMAIN,
        SERVICE_ADD_RECEIPT,
        handle_add_receipt,
        schema=SERVICE_ADD_RECEIPT_SCHEMA,
    )

    hass.services.async_register(
        DOMAIN,
        SERVICE_UPDATE_RECEIPT,
        handle_update_receipt,
        schema=SERVICE_UPDATE_RECEIPT_SCHEMA,
    )

    hass.services.async_register(
        DOMAIN,
        SERVICE_DELETE_RECEIPT,
        handle_delete_receipt,
        schema=SERVICE_DELETE_RECEIPT_SCHEMA,
    )

    _LOGGER.info("Registered Home Project Ledger services")
