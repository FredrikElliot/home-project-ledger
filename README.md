# Home Project Ledger

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)
[![License](https://img.shields.io/github/license/FredrikElliot/home-project-ledger.svg)](LICENSE)
[![GitHub Release](https://img.shields.io/github/v/release/FredrikElliot/home-project-ledger)](https://github.com/FredrikElliot/home-project-ledger/releases)

A Home Assistant custom integration for tracking home renovation projects, receipts, budgets, and costs.

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=FredrikElliot&repository=home-project-ledger&category=integration)

## Features

✨ **Track Projects** - Create and manage home renovation projects with budgets  
📸 **Receipt Management** - Upload receipt images and store detailed metadata  
💰 **Budget Tracking** - Set project budgets (total or by category) with visual health indicators  
🏠 **Area Integration** - Associate projects with Home Assistant Areas  
📊 **Interactive Dashboard** - Visual charts and analytics for spending trends  
📈 **Monetary Sensors** - Automatic sensors with long-term statistics support  
🎨 **Custom Panel** - Dedicated sidebar page with responsive Material Design  
🌍 **Translations** - Available in English and Swedish  
☁️ **Cloud Storage** - Optional Google Drive integration for receipt images  

## Screenshots

<details>
<summary>📊 Dashboard View</summary>

The dashboard provides an overview of your spending with:
- Summary statistics (total spend, receipt count, averages)
- Budget health indicators (on track, at risk, over budget)
- Interactive spending timeline with smooth line charts
- Category and merchant breakdowns with donut charts
- Recent activity feed

</details>

<details>
<summary>📁 Project Management</summary>

- Create projects with names, areas, and budgets
- Track project status (open/closed)
- View detailed receipt lists per project
- Budget progress bars with color-coded status

</details>

<details>
<summary>🧾 Receipt Management</summary>

- Add receipts with merchant, date, amount, and categories
- Upload multiple receipt images
- Split costs across multiple categories
- Expandable receipt details with photo viewer

</details>

## Installation

### HACS (Recommended)

1. Click the button above or manually add this repository to HACS:
   - Open HACS in your Home Assistant instance
   - Go to "Integrations"
   - Click the menu (⋮) → "Custom repositories"
   - Add `https://github.com/FredrikElliot/home-project-ledger` as an Integration
2. Search for "Home Project Ledger" and click "Download"
3. Restart Home Assistant
4. Go to **Settings** → **Devices & Services** → **Add Integration** → **Home Project Ledger**

### Manual Installation

1. Download the latest release from [GitHub Releases](https://github.com/FredrikElliot/home-project-ledger/releases)
2. Copy the `custom_components/home_project_ledger` folder to your `config/custom_components` directory
3. Restart Home Assistant
4. Go to **Settings** → **Devices & Services** → **Add Integration** → **Home Project Ledger**

## Configuration

During setup, you'll configure:
- **Default Currency** - Your preferred currency (SEK, USD, EUR, etc.)
- **Storage Provider** - Local storage or Google Drive for receipt images

## Usage

### Accessing the Panel

After installation, you'll find **Project Ledger** (or **Projektredovisning** in Swedish) in your sidebar with a notebook icon.

### Creating Projects

1. Open the Home Project Ledger panel
2. Go to the **Projects** tab
3. Click the **+** button (floating action button)
4. Enter project details:
   - Project name
   - Area (optional)
   - Budget (optional)
   - Category budgets (optional)
5. Click **Create Project**

### Adding Receipts

1. Open a project or use the floating action button
2. Click **+ Add Receipt**
3. Fill in the receipt details:
   - Merchant name
   - Date
   - Total amount
   - Categories (optional, supports multiple)
   - Upload receipt images (optional)
4. Click **Add Receipt**

### Budget Tracking

Set budgets on your projects to see:
- **On Track** (green) - Under 75% of budget
- **At Risk** (yellow) - Between 75-100% of budget  
- **Over Budget** (red) - Exceeds budget

The dashboard shows budget health at a glance with hoverable tooltips showing project details.

### Services

The integration provides the following services for automations:

| Service | Description |
|---------|-------------|
| `home_project_ledger.create_project` | Create a new project |
| `home_project_ledger.update_project` | Update project details |
| `home_project_ledger.close_project` | Close a project |
| `home_project_ledger.reopen_project` | Reopen a closed project |
| `home_project_ledger.delete_project` | Delete a project and all receipts |
| `home_project_ledger.add_receipt` | Add a receipt to a project |
| `home_project_ledger.update_receipt` | Update receipt details |
| `home_project_ledger.delete_receipt` | Delete a receipt |

### Sensors

The integration automatically creates sensors for:

- **Total House Spend** - Total spending across all projects
- **Area Spend** - Spending per Home Assistant area (created dynamically)
- **Project Spend** - Spending per project with budget info in attributes

These sensors have `SensorDeviceClass.MONETARY` and `SensorStateClass.TOTAL`, enabling:
- Long-term statistics recording
- Historical trend analysis
- Use in automations and dashboards

### Dashboard Cards

Add navigation buttons to your Lovelace dashboard:

```yaml
type: button
name: Project Ledger
icon: mdi:notebook-edit
tap_action:
  action: navigate
  navigation_path: /home-project-ledger
```

```yaml
type: entities
title: Project Spending
entities:
  - sensor.home_project_ledger_total_house_spend
```

## Data Storage

- **Project and receipt metadata**: `.storage/home_project_ledger.*.json`
- **Receipt images (local)**: `config/www/home_project_ledger/receipts/`
- **Receipt images (cloud)**: Your configured cloud storage provider

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

- [Issue Tracker](https://github.com/FredrikElliot/home-project-ledger/issues)
- [Discussions](https://github.com/FredrikElliot/home-project-ledger/discussions)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits

Created by [@FredrikElliot](https://github.com/FredrikElliot)
