# Quick Start Guide

Create your first project and receipt in about five minutes.

**Not installed yet?** Follow the [Installation Guide](https://github.com/FredrikElliot/home-project-ledger/blob/main/INSTALLATION.md) first, then come back here.

## Step 1: Configure

1. Go to **Settings** → **Devices & Services**
2. Click **+ Add Integration** and search for **Home Project Ledger**
3. Select your currency (e.g. `SEK`, `USD`, `EUR`)
4. Choose a storage provider (Local or Google Drive)
5. Click **Submit**

✅ **Project Ledger** now appears in your sidebar.

## Step 2: Create your first project

### In the panel (recommended)
1. Click **Project Ledger** in the sidebar
2. Go to the **Projects** tab
3. Click the **+** floating button
4. Enter:
   - **Name**: "Kitchen Renovation"
   - **Area**: your kitchen area (optional)
   - **Budget**: 50000 (optional)
5. Click **Create Project**

### With a service call
Go to **Developer Tools** → **Actions**:
```yaml
service: home_project_ledger.create_project
data:
  name: "Kitchen Renovation"
  area_id: "kitchen"
  budget: 50000
```

## Step 3: Add your first receipt

### In the panel (recommended)
1. Open your project
2. Click **+ Add Receipt**
3. Fill in:
   - **Merchant**: "IKEA"
   - **Date**: today
   - **Total**: 1299.50
   - **Categories**: "Furniture" (optional)
4. Upload a receipt image (optional)
5. Click **Add Receipt**

### With a service call
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

## Step 4: Register an item (optional)

Open the **Items** tab to add a standalone household item with its name, purchase date, price, category, room and receipt photos. You can also itemize a project receipt into named rows, each with its own price, category and room.

## Step 5: Explore the dashboard

- **Summary cards** - total spend, receipt count, averages
- **Budget health** - which projects are on track, at risk or over budget
- **Spending timeline** - spending over time
- **Charts** - category breakdown, top merchants, project spending

Use the time period selector to switch between this month, last month, last 3 months, this year, all time or a custom range.

## What's next?

- **Add it to your dashboard** - copy a card from [Examples](https://github.com/FredrikElliot/home-project-ledger/blob/main/EXAMPLES.md)
- **Set budgets** - total or per category, e.g. "Materials: 30000, Labor: 15000"
- **Automate** - get notified when a project nears its budget (see [Examples](https://github.com/FredrikElliot/home-project-ledger/blob/main/EXAMPLES.md))

## Tips

💡 **Quick add**: the floating **+** button works from any tab

💡 **Multiple categories**: a receipt can be split across several categories

💡 **Drill down**: click a merchant or category to see its receipts

## Need help?

- [Installation Guide](https://github.com/FredrikElliot/home-project-ledger/blob/main/INSTALLATION.md) - including troubleshooting
- [Issue Tracker](https://github.com/FredrikElliot/home-project-ledger/issues)