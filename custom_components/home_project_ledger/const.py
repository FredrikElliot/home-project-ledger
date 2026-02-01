"""Constants for Home Project Ledger integration."""
from typing import Final

DOMAIN: Final = "home_project_ledger"
NAME: Final = "Home Project Ledger"

# Storage
STORAGE_VERSION: Final = 1
STORAGE_KEY_PROJECTS: Final = f"{DOMAIN}.projects"
STORAGE_KEY_RECEIPTS: Final = f"{DOMAIN}.receipts"

# Receipt image storage
RECEIPT_IMAGE_DIR: Final = f"www/{DOMAIN}/receipts"

# Project status
STATUS_OPEN: Final = "open"
STATUS_CLOSED: Final = "closed"

# Services
SERVICE_CREATE_PROJECT: Final = "create_project"
SERVICE_UPDATE_PROJECT: Final = "update_project"
SERVICE_CLOSE_PROJECT: Final = "close_project"
SERVICE_REOPEN_PROJECT: Final = "reopen_project"
SERVICE_DELETE_PROJECT: Final = "delete_project"
SERVICE_ADD_RECEIPT: Final = "add_receipt"
SERVICE_UPDATE_RECEIPT: Final = "update_receipt"
SERVICE_DELETE_RECEIPT: Final = "delete_receipt"

# Default currency
DEFAULT_CURRENCY: Final = "SEK"

# Panel
PANEL_URL: Final = "home-project-ledger"
PANEL_TITLE: Final = "Project Ledger"
PANEL_ICON: Final = "mdi:notebook-edit"
