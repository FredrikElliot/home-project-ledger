# Installation Guide

## Prerequisites

- Home Assistant 2023.1 or newer
- HACS installed (recommended) or manual installation capability
- Access to Home Assistant configuration directory

## Installation Methods

### Method 1: HACS (Recommended)

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=FredrikElliot&repository=home-project-ledger&category=integration)

**Or manually:**

1. **Add Custom Repository**
   - Open HACS in Home Assistant
   - Click on "Integrations"
   - Click the three dots menu (⋮) in the top right
   - Select "Custom repositories"
   - Add repository URL: `https://github.com/FredrikElliot/home-project-ledger`
   - Category: Integration
   - Click "Add"

2. **Install Integration**
   - Search for "Home Project Ledger" in HACS
   - Click "Download"
   - Restart Home Assistant

3. **Configure Integration**
   - Go to Settings → Devices & Services
   - Click "+ Add Integration"
   - Search for "Home Project Ledger"
   - Follow the configuration wizard

### Method 2: Manual Installation

1. **Download Release**
   ```bash
   cd /config
   wget https://github.com/FredrikElliot/home-project-ledger/archive/refs/tags/v1.0.0.tar.gz
   tar -xzf v1.0.0.tar.gz
   ```

2. **Copy Files**
   ```bash
   mkdir -p custom_components
   cp -r home-project-ledger-1.0.0/custom_components/home_project_ledger custom_components/
   ```

3. **Restart Home Assistant**
   ```bash
   # Via CLI
   ha core restart
   
   # Or via UI: Settings → System → Restart Home Assistant
   ```

4. **Configure Integration**
   - Same as HACS method step 3

## Configuration Options

During setup, you'll be asked to configure:

### Currency
Choose your default currency for receipts:
- SEK (Swedish Krona)
- USD (US Dollar)
- EUR (Euro)
- Any valid ISO 4217 currency code

### Storage Provider
Choose where to store receipt images:

- **Local Storage** (Default)
  - Images stored on your Home Assistant server
  - Located in `config/www/home_project_ledger/receipts/`
  - No additional setup required

- **Google Drive**
  - Images stored in your Google Drive
  - Requires OAuth setup (see Cloud Storage Setup below)

## Cloud Storage Setup (Optional)

### Google Drive

1. **Create OAuth Credentials**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable the Google Drive API
   - Create OAuth 2.0 credentials (Web application)
   - Add authorized redirect URI: `https://my.home-assistant.io/redirect/oauth`

2. **Add Application Credentials in HA**
   - Go to Settings → Devices & Services → Application Credentials
   - Click "Add Application Credentials"
   - Select "Home Project Ledger"
   - Enter your Client ID and Client Secret

3. **Configure Integration**
   - When adding the integration, select "Google Drive"
   - Complete the OAuth authorization flow

## Post-Installation Verification

### 1. Check Sidebar
Look for "Project Ledger" (or "Projektredovisning" in Swedish) in your sidebar with a notebook icon (mdi:notebook-edit).

### 2. Verify Services
Go to Developer Tools → Services and check for:
- `home_project_ledger.create_project`
- `home_project_ledger.add_receipt`
- `home_project_ledger.update_receipt`
- `home_project_ledger.delete_receipt`
- `home_project_ledger.close_project`
- `home_project_ledger.reopen_project`
- `home_project_ledger.update_project`
- `home_project_ledger.delete_project`

### 3. Check Sensors
Go to Developer Tools → States and look for:
- `sensor.home_project_ledger_total_house_spend`

### 4. Check Button Entities
Look for:
- `button.home_project_ledger_add_receipt`
- `button.home_project_ledger_open_project_ledger`

## Troubleshooting

### Panel Not Appearing
1. Clear browser cache
2. Hard refresh the page (Ctrl+Shift+R)
3. Check logs for errors: Settings → System → Logs

### Integration Not Found
1. Ensure files are in correct location: `config/custom_components/home_project_ledger/`
2. Check that `manifest.json` exists
3. Restart Home Assistant completely

### Services Not Available
1. Check that integration is fully loaded
2. Look for errors in logs
3. Try removing and re-adding the integration

### Images Not Displaying
1. Check that `www/home_project_ledger/receipts/` directory exists
2. Verify file permissions
3. For cloud storage, check OAuth token validity

## Updating

### Via HACS
1. Open HACS → Integrations
2. Find "Home Project Ledger"
3. Click "Update" if available
4. Restart Home Assistant

### Manual
1. Download new release
2. Replace `custom_components/home_project_ledger/` folder
3. Restart Home Assistant

## Uninstalling

1. Remove the integration from Settings → Devices & Services
2. Delete `custom_components/home_project_ledger/` folder
3. Optionally delete data:
   - `.storage/home_project_ledger.*.json`
   - `www/home_project_ledger/`
4. Restart Home Assistant
