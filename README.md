# Home Project Ledger

[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg)](https://github.com/custom-components/hacs)
[![License](https://img.shields.io/github/license/FredrikElliot/home-project-ledger.svg)](LICENSE)

A Home Assistant custom integration for tracking home renovation projects, receipts, and costs.

## Features

✨ **Track Projects** - Create and manage home renovation projects  
📸 **Receipt Management** - Upload receipt images and store metadata  
🏠 **Area Integration** - Associate projects with Home Assistant Areas  
📊 **Statistics & Sensors** - Automatic monetary sensors for tracking spending  
🎨 **Custom Panel** - Dedicated sidebar page for managing everything  
🌍 **Translations** - Available in English and Swedish  

## Installation

### HACS (Recommended)

1. Open HACS in your Home Assistant instance
2. Go to "Integrations"
3. Click the "+" button
4. Search for "Home Project Ledger"
5. Click "Install"
6. Restart Home Assistant

### Manual Installation

1. Download the latest release
2. Copy the `custom_components/home_project_ledger` folder to your `config/custom_components` directory
3. Restart Home Assistant

## Configuration

1. Go to **Settings** → **Devices & Services**
2. Click **+ Add Integration**
3. Search for **Home Project Ledger**
4. Follow the configuration steps
5. Choose your default currency (e.g., SEK, USD, EUR)

## Usage

### Accessing the Panel

After installation, you'll find **Home Project Ledger** in your sidebar with a notebook icon.

### Creating Projects

1. Open the Home Project Ledger panel
2. Click **+ New Project**
3. Enter project name and optionally select an area
4. Click **Create Project**

### Adding Receipts

1. Open a project from the project list
2. Click **+ Add Receipt**
3. Fill in the receipt details:
   - Merchant name
   - Date
   - Total amount
   - Currency
   - Optional: Category summary
   - Optional: Upload receipt image
4. Click **Add Receipt**

### Services

The integration provides the following services:

- `home_project_ledger.create_project` - Create a new project
- `home_project_ledger.close_project` - Close a project
- `home_project_ledger.add_receipt` - Add a receipt to a project
- `home_project_ledger.update_receipt` - Update receipt details
- `home_project_ledger.delete_receipt` - Delete a receipt

### Sensors

The integration automatically creates sensors for:

- **Total House Spend** - Total spending across all projects
- **Area Spend** - Spending per Home Assistant area
- **Project Spend** - Spending per project

These sensors can be used in automations, dashboards, and the Energy panel.

## Data Storage

- **Project and receipt metadata**: Stored in `.storage/home_project_ledger.*.json`
- **Receipt images**: Stored in `config/www/home_project_ledger/receipts/`

## Future Features (Not in MVP)

- 🤖 AI/OCR receipt parsing
- 💰 Project budgeting
- ☁️ Cloud sync
- 👥 Multi-household support

## Support

- [Issue Tracker](https://github.com/FredrikElliot/home-project-ledger/issues)
- [Documentation](https://github.com/FredrikElliot/home-project-ledger)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits

Created by [@FredrikElliot](https://github.com/FredrikElliot)
