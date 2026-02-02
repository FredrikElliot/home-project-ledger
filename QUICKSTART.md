# Quick Start Guide

Get up and running with Home Project Ledger in 5 minutes!

## Step 1: Install (2 minutes)

### Via HACS (Recommended)

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=FredrikElliot&repository=home-project-ledger&category=integration)

Or manually:
1. Open **HACS** in Home Assistant
2. Go to **Integrations** → **⋮** → **Custom repositories**
3. Add `https://github.com/FredrikElliot/home-project-ledger` (Category: Integration)
4. Search for **Home Project Ledger** and click **Download**
5. **Restart Home Assistant**

### Via Manual Install
```bash
cd /config/custom_components
git clone https://github.com/FredrikElliot/home-project-ledger.git temp
mv temp/custom_components/home_project_ledger .
rm -rf temp
```
Then restart Home Assistant.

## Step 2: Configure (1 minute)

1. Go to **Settings** → **Devices & Services**
2. Click **+ Add Integration**
3. Search for **Home Project Ledger**
4. Select your currency (e.g., `SEK`, `USD`, `EUR`)
5. Choose storage provider (Local or Google Drive)
6. Click **Submit**

✅ You should see "Project Ledger" in your sidebar!

## Step 3: Create Your First Project (1 minute)

### Via Panel UI (Recommended)
1. Click **Project Ledger** in sidebar
2. Go to the **Projects** tab
3. Click the **+** floating button
4. Enter:
   - **Name**: "Kitchen Renovation"
   - **Area**: Select your kitchen area (optional)
   - **Budget**: 50000 (optional)
5. Click **Create Project**

### Via Service Call
Go to **Developer Tools** → **Services**:
```yaml
service: home_project_ledger.create_project
data:
  name: "Kitchen Renovation"
  area_id: "kitchen"
  budget: 50000
```

## Step 4: Add Your First Receipt (1 minute)

### Via Panel UI (Recommended)
1. Click on your project
2. Click **+ Add Receipt**
3. Fill in:
   - **Merchant**: "IKEA"
   - **Date**: Select today
   - **Total**: 1299.50
   - **Categories**: "Furniture" (optional)
4. Upload receipt image (optional)
5. Click **Add Receipt**

### Via Service Call
```yaml
service: home_project_ledger.add_receipt
data:
  project_id: "your-project-id"
  merchant: "IKEA"
  date: "2026-02-02"
  total: 1299.50
  currency: "SEK"
  category_summary: "Furniture"
```

## Step 5: Explore the Dashboard

### Dashboard Features
- **Summary Cards** - Total spend, receipt count, averages
- **Budget Health** - See which projects are on track, at risk, or over budget
- **Spending Timeline** - Interactive chart showing spending over time
- **Charts** - Category breakdown, top merchants, project spending

### Filter by Time Period
Use the time period selector to view:
- This Month / Last Month
- Last 3 Months
- This Year
- All Time
- Custom date range

## Step 6: Add to Your Dashboard (Optional)

### Navigation Button
```yaml
type: button
name: Project Ledger
icon: mdi:notebook-edit
tap_action:
  action: navigate
  navigation_path: /home-project-ledger
```

### Spending Sensor Card
```yaml
type: entities
title: Project Spending
entities:
  - sensor.home_project_ledger_total_house_spend
```

### Statistics Graph
```yaml
type: statistics-graph
title: Monthly Spending
entities:
  - sensor.home_project_ledger_total_house_spend
stat_types:
  - sum
period:
  calendar:
    period: month
```

## What's Next?

- **Set Budgets** - Add budgets to track spending limits
- **Upload Photos** - Keep receipt images organized
- **Create Automations** - Get notified when approaching budget limits
- **View Statistics** - Track spending trends over time

## Tips

💡 **Quick Add**: Use the floating action button (+) from any tab to quickly add a receipt

💡 **Budget by Category**: Set category-specific budgets like "Materials: 30000, Labor: 15000"

💡 **Multiple Categories**: Receipts can belong to multiple categories with split amounts

💡 **Expandable Lists**: Click on merchants or categories to see related receipts

## Need Help?

- [Full Documentation](https://github.com/FredrikElliot/home-project-ledger)
- [Issue Tracker](https://github.com/FredrikElliot/home-project-ledger/issues)
- [Discussions](https://github.com/FredrikElliot/home-project-ledger/discussions)
