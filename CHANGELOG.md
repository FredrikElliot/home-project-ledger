# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - Cloud Storage Support

#### Cloud Storage Framework
- Abstract provider pattern for cloud storage backends
- Support for multiple storage providers:
  - **Local Storage** - Default, stores images on HA server
  - **Google Drive** - Full OAuth 2.0 implementation (PoC complete)
  - **OneDrive** - Planned, UI placeholder
  - **Dropbox** - Planned, UI placeholder
  - **WebDAV** - Planned, UI placeholder (for Nextcloud, ownCloud, etc.)
- Cloud storage manager for provider switching and configuration persistence
- Automatic token refresh for OAuth providers
- Storage quota display and monitoring

#### Settings UI
- New Settings tab in the main navigation
- Storage provider selection cards
- Current storage status display with connection state
- OAuth authentication flow with authorization code input
- Provider icons and descriptions
- English and Swedish translations

#### New Services
- `home_project_ledger.set_storage_config` - Configure cloud storage
- `home_project_ledger.get_storage_status` - Get current storage status

#### HTTP API
- `/api/home_project_ledger/storage/status` - Storage status endpoint
- `/api/home_project_ledger/storage/config` - Storage configuration endpoint
- `/api/home_project_ledger/oauth/callback` - OAuth callback handler

## [0.1.0] - 2024-01-30

### Added - MVP Release

#### Core Integration
- Custom Home Assistant integration installable via HACS
- Configuration flow for initial setup with currency selection
- Persistent storage using Home Assistant's Store helper
- Data models for Projects and Receipts with UUID identifiers
- Integration with Home Assistant Area Registry

#### Features
- **Project Management**
  - Create projects with name and optional area association
  - Close projects to mark them as complete
  - Track project status (open/closed)
  - Persist project data across restarts

- **Receipt Management**
  - Add receipts with merchant, date, amount, and currency
  - Upload and store receipt images
  - Associate receipts with projects and areas
  - Update receipt information
  - Delete receipts (including image files)
  - Category summary field for manual categorization

- **Services**
  - `home_project_ledger.create_project` - Create new projects
  - `home_project_ledger.close_project` - Close existing projects
  - `home_project_ledger.add_receipt` - Add receipts with optional images
  - `home_project_ledger.update_receipt` - Update receipt details
  - `home_project_ledger.delete_receipt` - Delete receipts

- **Sensors & Statistics**
  - Total house spend sensor (aggregates all receipts)
  - Per-area spend sensors (when receipts are associated with areas)
  - Per-project spend sensors (one for each project)
  - Monetary device class for all sensors
  - Total state class for long-term statistics
  - Automatic updates via DataUpdateCoordinator

- **Frontend Panel**
  - Custom sidebar entry with notebook icon
  - Accessible at `/home-project-ledger`
  - Project list with open/closed status
  - Project detail view with receipt management
  - Visual statistics display
  - Create projects from UI
  - Add receipts with image upload
  - Delete receipts from UI
  - Responsive design with Home Assistant styling

- **Internationalization**
  - English (en) translations
  - Swedish (sv) translations
  - Translation files for config flow and services

#### Technical Features
- Async/await architecture throughout
- Type hints for all functions
- Comprehensive logging (debug, info, error levels)
- Defensive input validation using voluptuous
- Path handling using `hass.config.path()`
- Receipt images stored in `www/home_project_ledger/receipts/`
- Metadata stored in `.storage/home_project_ledger.*.json`

#### Documentation
- README with installation and usage instructions
- Developer documentation (DEVELOPER.md)
- Example automations and dashboard cards (EXAMPLES.md)
- Service YAML definitions with examples
- HACS integration metadata

### Architecture Design

The MVP is architected with extensibility in mind:

- **Separation of Concerns**: Storage, models, services, and UI are cleanly separated
- **Provider Pattern Ready**: Architecture supports future receipt parsing providers
- **Standard HA Patterns**: Uses DataUpdateCoordinator, config entries, and entity platforms
- **No Hard Dependencies**: No AI/ML libraries in MVP (added later as optional)
- **Currency Agnostic**: Supports any ISO 4217 currency code

### Known Limitations (MVP)

- No AI/OCR receipt parsing (architecture ready for future addition)
- No budgeting features
- No cloud sync
- No multi-household support
- Receipt images must be uploaded manually
- No authentication layers beyond Home Assistant's built-in
- Sensors for new projects require integration reload (addressed in future releases)

### What's Not Included (Future Versions)

- 🤖 AI Receipt Parsing (OpenAI, Google Vision, etc.)
- 💰 Budget Management & Alerts
- ☁️ Cloud Sync & Backup
- 📊 Advanced Analytics & Charts
- 👥 Multi-household Support
- 📱 Mobile Companion App
- 🔍 Receipt Search & Filtering
- 📤 Export to CSV/Excel
- 🔔 Budget Alert Automations
- 📈 Spending Trends Analysis

## [Unreleased]

### Planned for 0.2.0
- Dynamic sensor creation (no reload needed)
- Receipt search and filtering in UI
- Export functionality
- Enhanced mobile UI

### Planned for 0.3.0
- AI receipt parsing integration (OpenAI)
- Budget management per project
- Budget alerts and automations

### Planned for 1.0.0
- Cloud sync support
- Mobile companion app
- Advanced analytics
- Multi-currency conversion
