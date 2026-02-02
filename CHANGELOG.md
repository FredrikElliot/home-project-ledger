# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-02

### Added - Initial Release

#### Core Features
- **Project Management**
  - Create projects with name, area, and optional budgets
  - Set total budget or category-specific budgets
  - Track project status (open/closed)
  - Reopen closed projects
  - Delete projects and all associated receipts

- **Receipt Management**
  - Add receipts with merchant, date, amount, and currency
  - Support for multiple categories per receipt
  - Category split options (equal, absolute amounts, or percentages)
  - Upload multiple receipt images
  - Update and delete receipts
  - Expandable receipt details with photo viewer

- **Budget Tracking**
  - Visual budget health indicators (on track, at risk, over budget)
  - Progress bars with color-coded status
  - Hoverable tooltips showing project breakdown
  - Budget overview cards on dashboard

- **Interactive Dashboard**
  - Summary statistics (total spend, receipt count, averages)
  - Budget health row with three status cards
  - Spending timeline with smooth amCharts line graph
  - Category and merchant breakdown donut charts
  - Top merchants bar chart with expandable receipt lists
  - Recent activity feed
  - Time period filtering (this month, last month, custom range, etc.)

- **Sensors**
  - Total house spend sensor
  - Per-area spend sensors (dynamically created)
  - Per-project spend sensors with budget attributes
  - Monetary device class for statistics integration
  - Total state class for long-term tracking

- **Services**
  - `create_project` - Create new project with budgets
  - `update_project` - Update project details and budgets
  - `close_project` - Close a project
  - `reopen_project` - Reopen a closed project
  - `delete_project` - Delete project and receipts
  - `add_receipt` - Add receipt with images
  - `update_receipt` - Update receipt details
  - `delete_receipt` - Delete a receipt

- **Cloud Storage**
  - Google Drive integration for receipt images
  - OAuth 2.0 authentication flow
  - Local storage fallback

- **User Interface**
  - Custom sidebar panel
  - Responsive Material Design
  - Mobile-friendly layout
  - Dark/light mode support via HA theme
  - Floating action button for quick actions
  - Tab navigation (Dashboard, Projects, Receipts, Merchants, Categories, Settings)

- **Internationalization**
  - English translations
  - Swedish translations
  - Localized sidebar title based on HA language

- **Button Entities**
  - "Add Receipt" button with notification
  - "Open Project Ledger" button with notification
  - Events for browser_mod automation integration

#### Technical
- Home Assistant 2023.1+ compatibility
- HACS compatible
- Async/await architecture
- Type hints throughout
- DataUpdateCoordinator for efficient updates
- Persistent storage using HA Store helper

## [Unreleased]

### Planned
- 🤖 AI/OCR receipt parsing
- 📱 Companion app integration
- 📤 Export to CSV/PDF
- 👥 Multi-user receipt assignment
