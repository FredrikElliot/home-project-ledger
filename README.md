# Home Project Ledger

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)
[![License](https://img.shields.io/github/license/FredrikElliot/home-project-ledger.svg)](https://github.com/FredrikElliot/home-project-ledger/blob/main/LICENSE)
[![GitHub Release](https://img.shields.io/github/v/release/FredrikElliot/home-project-ledger)](https://github.com/FredrikElliot/home-project-ledger/releases)

A Home Assistant custom integration for tracking home projects, receipts, budgets, and household items by room.

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=FredrikElliot&repository=home-project-ledger&category=integration)

## Features

✨ **Track Projects** - Create and manage home renovation projects with budgets  
📸 **Receipt Management** - Upload receipt images and store detailed metadata  
🧾 **Item Tracking** - Register standalone household items by room or itemize project receipts  
💰 **Budget Tracking** - Set project budgets (total or by category) with visual health indicators  
🏠 **Area Integration** - Associate projects with Home Assistant Areas  
📊 **Interactive Dashboard** - Visual charts and analytics for spending trends  
📈 **Monetary Sensors** - Automatic sensors with long-term statistics support  
🎨 **Custom Panel** - Dedicated sidebar page with responsive Material Design  
🌍 **Translations** - Available in English and Swedish  
☁️ **Cloud Storage** - Optional Google Drive integration for receipt images

## Screenshots

Uncomment this section once the images are added to docs/images/ in the repository.
Absolute URLs are used so the images also show inside HACS / the Marketplace.

| Dashboard | Projects | Items |
|---|---|---|
| ![Dashboard](https://raw.githubusercontent.com/FredrikElliot/home-project-ledger/main/docs/images/dashboard-1.png) ![Dashboard 2](https://raw.githubusercontent.com/FredrikElliot/home-project-ledger/main/docs/images/dashboard-2.png)| ![Projects](https://raw.githubusercontent.com/FredrikElliot/home-project-ledger/main/docs/images/projects.png) | ![Items](https://raw.githubusercontent.com/FredrikElliot/home-project-ledger/main/docs/images/items.png) |

## Installation

### HACS (recommended)

1. Click the **Open in HACS** button above, or add `https://github.com/FredrikElliot/home-project-ledger` as a custom repository (category: Integration).
2. Download **Home Project Ledger** and restart Home Assistant.
3. Go to **Settings** → **Devices & Services** → **Add Integration** → **Home Project Ledger**.

Manual installation, Google Drive setup, updating, troubleshooting and uninstalling are covered in the [Installation Guide](https://github.com/FredrikElliot/home-project-ledger/blob/main/INSTALLATION.md).

## Configuration

During setup you choose:

- **Default currency** - for example SEK, USD or EUR
- **Storage provider** - local storage or Google Drive for receipt images

## Getting started

After setup, **Project Ledger** (**Projektredovisning** in Swedish) appears in the sidebar. From there you can create projects, add receipts, register items by room and follow spending on the dashboard.

The [Quick Start Guide](https://github.com/FredrikElliot/home-project-ledger/blob/main/QUICKSTART.md) walks you through your first project and receipt in a few minutes.

### Budget health

Projects with a budget are marked:

- **On Track** (green) - under 75% of budget
- **At Risk** (yellow) - 75-100% of budget
- **Over Budget** (red) - above budget

## Services

| Service | Description |
|---------|-------------|
| `home_project_ledger.create_project` | Create a new project |
| `home_project_ledger.update_project` | Update project details |
| `home_project_ledger.close_project` | Close a project |
| `home_project_ledger.reopen_project` | Reopen a closed project |
| `home_project_ledger.delete_project` | Delete a project and all receipts |
| `home_project_ledger.add_receipt` | Add a project receipt or standalone room-connected item |
| `home_project_ledger.update_receipt` | Update receipt details |
| `home_project_ledger.delete_receipt` | Delete a receipt |

Ready-made automations, scripts and dashboard cards are in [Examples](https://github.com/FredrikElliot/home-project-ledger/blob/main/EXAMPLES.md).

## Sensors

- **Total House Spend** - total spending across all projects
- **Area Spend** - spending per Home Assistant area (created dynamically)
- **Project Spend** - spending per project, with budget info in attributes

All sensors are monetary and record long-term statistics, so you can use them in statistics graphs, history and automations.

## Data storage

- **Project and receipt metadata**: `.storage/home_project_ledger.*.json`
- **Receipt images (local)**: `config/home_project_ledger/receipts/` (private; served through an authenticated API with temporary signed URLs for previews)

Existing local receipt photos and stored paths are migrated automatically on startup, removing the public `www/home_project_ledger/receipts/` directory. If a photo can't be moved (for example because a file with the same name already exists in private storage), it is left in place and a warning is logged — check the Home Assistant log and remove any leftovers manually, since files under `www/` are reachable without login. Panel assets and graphs are unchanged.
- **Receipt images (cloud)**: your configured cloud storage provider

Include these paths in your backups.

## Support and contributing

- Found a bug or have an idea? [Open an issue](https://github.com/FredrikElliot/home-project-ledger/issues).
- Want to contribute code? See [Contributing](https://github.com/FredrikElliot/home-project-ledger/blob/main/CONTRIBUTING.md).
- Release history is in the [Changelog](https://github.com/FredrikElliot/home-project-ledger/blob/main/CHANGELOG.md).

## License

MIT - see [LICENSE](https://github.com/FredrikElliot/home-project-ledger/blob/main/LICENSE).

Created by [@FredrikElliot](https://github.com/FredrikElliot).