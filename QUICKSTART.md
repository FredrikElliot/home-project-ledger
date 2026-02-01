# Quick Start Guide

Get up and running with Home Project Ledger in 5 minutes!

## Step 1: Install (2 minutes)

### Via HACS (Recommended)
1. Open **HACS** in Home Assistant
2. Go to **Integrations**
3. Click **⋮** → **Custom repositories**
4. Add `https://github.com/FredrikElliot/home-project-ledger`
5. Category: **Integration**
6. Search for **Home Project Ledger**
7. Click **Download**
8. **Restart Home Assistant**

### Via Manual Install
```bash
cd /config/custom_components
git clone https://github.com/FredrikElliot/home-project-ledger.git
mv home-project-ledger/custom_components/home_project_ledger .
rm -rf home-project-ledger
```
Then restart Home Assistant.

## Step 2: Configure (1 minute)

1. Go to **Settings** → **Devices & Services**
2. Click **+ Add Integration**
3. Search for **Home Project Ledger**
4. Enter your currency (e.g., `SEK`, `USD`, `EUR`)
5. Click **Submit**

✅ You should see "Home Project Ledger" in your sidebar!

## Step 3: Create Your First Project (1 minute)

### Method A: Via Panel UI
1. Click **Home Project Ledger** in sidebar
2. Click **+ New Project**
3. Enter project name (e.g., "Kitchen Renovation")
4. Select an area (optional)
5. Click **Create Project**

### Method B: Via Service Call
Go to **Developer Tools** → **Services**:
```yaml
service: home_project_ledger.create_project
data:
  name: "Kitchen Renovation"
  area_id: "kitchen"  # Optional
```

## Step 4: Add Your First Receipt (1 minute)

### Method A: Via Panel UI
1. Click on your project
2. Click **+ Add Receipt**
3. Fill in:
   - Merchant: "IKEA"
   - Date: Select today
   - Total: 1299.50
   - Currency: SEK (or your currency)
4. Upload receipt image (optional)
5. Click **Add Receipt**

### Method B: Via Service Call
```yaml
service: home_project_ledger.add_receipt
data:
  project_id: "your-project-id"  # See sensor attributes
  merchant: "IKEA"
  date: "2024-01-30"
  total: 1299.50
  currency: "SEK"
  category_summary: "Kitchen cabinets"
```

## Step 5: View Your Statistics (instant)

### In the Panel
- Total spend shows at top
- Per-project totals in project cards

### As Sensors
Go to **Developer Tools** → **States**:
- `sensor.home_project_ledger_total_house_spend`
- `sensor.home_project_ledger_project_[id]_spend`
- `sensor.home_project_ledger_area_[area]_spend` (if area used)

### In Dashboard
Add an entities card:
```yaml
type: entities
title: Project Spending
entities:
  - sensor.home_project_ledger_total_house_spend
  - sensor.home_project_ledger_project_kitchen_renovation_spend
```

## What's Next?

### Add More Receipts
Keep adding receipts to track all your project spending:
- Take photos of receipts
- Upload via panel or API
- Watch totals update automatically

### Create Automations
Example: Get notified when spending exceeds threshold:
```yaml
automation:
  - alias: "Project Budget Alert"
    trigger:
      - platform: numeric_state
        entity_id: sensor.home_project_ledger_project_kitchen_renovation_spend
        above: 10000
    action:
      - service: notify.mobile_app
        data:
          message: "Kitchen project spending exceeded 10,000!"
```

### Use in Dashboard
Create a dedicated project dashboard:
```yaml
type: vertical-stack
cards:
  - type: statistic
    entity: sensor.home_project_ledger_total_house_spend
    period:
      calendar:
        period: year
  
  - type: entities
    title: Active Projects
    entities:
      - sensor.home_project_ledger_project_kitchen_renovation_spend
      - sensor.home_project_ledger_project_bathroom_remodel_spend
  
  - type: button
    name: Open Project Ledger
    icon: mdi:notebook-edit
    tap_action:
      action: navigate
      navigation_path: /home-project-ledger
```

### Close Projects When Done
When a project is complete:
```yaml
service: home_project_ledger.close_project
data:
  project_id: "your-project-id"
```

## Common Tasks

### Update a Receipt
```yaml
service: home_project_ledger.update_receipt
data:
  receipt_id: "receipt-uuid"
  total: 1350.00
  merchant: "IKEA (Updated)"
```

### Delete a Receipt
```yaml
service: home_project_ledger.delete_receipt
data:
  receipt_id: "receipt-uuid"
```

### Get Project ID
Go to **Developer Tools** → **States** and find your project sensor. The `project_id` is in the attributes.

## Tips & Tricks

### 📸 Receipt Photos
- Take clear photos in good lighting
- Crop to just the receipt
- Keep file size under 10MB
- Supported formats: JPG, PNG, WebP

### 💰 Multiple Currencies
- Each receipt can have its own currency
- Sensors filter by currency
- Set default currency in config

### 🏠 Using Areas
- Link projects to HA areas (rooms/floors)
- Get automatic per-area spending totals
- Great for tracking which rooms cost most

### 📊 Long-term Statistics
- All sensors use `state_class: total`
- View history in HA history panel
- Use in Energy dashboard (coming soon)

### 🔍 Finding Receipt Images
Images stored at:
```
/config/www/home_project_ledger/receipts/
```

Access in browser:
```
http://your-home-assistant/local/home_project_ledger/receipts/filename.jpg
```

## Troubleshooting

### Panel Not Showing?
1. Clear browser cache (Ctrl+Shift+R)
2. Check `/config/www/home_project_ledger/panel.html` exists
3. Restart Home Assistant

### Services Not Working?
1. Check logs: `grep home_project_ledger /config/home-assistant.log`
2. Verify integration loaded successfully
3. Restart integration: Settings → Devices & Services → Home Project Ledger → Reload

### Images Not Displaying?
1. Check file exists in `/config/www/home_project_ledger/receipts/`
2. Verify file permissions (should be readable)
3. Try accessing directly in browser

### Sensors Not Updating?
1. Add a receipt to force update
2. Check coordinator in logs
3. Manually refresh sensor: Developer Tools → States → sensor → Refresh

## Need More Help?

- 📖 **Full Documentation**: See [README.md](README.md)
- 🔧 **Developer Guide**: See [DEVELOPER.md](DEVELOPER.md)
- 💡 **Examples**: See [EXAMPLES.md](EXAMPLES.md)
- 🧪 **Testing**: See [INSTALLATION.md](INSTALLATION.md)
- 🐛 **Issues**: https://github.com/FredrikElliot/home-project-ledger/issues

## Welcome to Home Project Ledger! 🏠

Start tracking your home projects and keep all your receipts organized in one place.

Happy renovating! 🛠️
