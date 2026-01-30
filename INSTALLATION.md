# Installation and Testing Guide

## Prerequisites

- Home Assistant 2023.1 or newer
- HACS installed (recommended) or manual installation capability
- Access to Home Assistant configuration directory

## Installation Methods

### Method 1: HACS (Recommended)

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
   - Choose your default currency (e.g., SEK, USD, EUR)

### Method 2: Manual Installation

1. **Download Release**
   ```bash
   cd /config
   wget https://github.com/FredrikElliot/home-project-ledger/archive/refs/tags/v0.1.0.tar.gz
   tar -xzf v0.1.0.tar.gz
   ```

2. **Copy Files**
   ```bash
   mkdir -p custom_components
   cp -r home-project-ledger-0.1.0/custom_components/home_project_ledger custom_components/
   ```

3. **Restart Home Assistant**
   ```bash
   # Via CLI
   ha core restart
   
   # Or via UI: Settings → System → Restart Home Assistant
   ```

4. **Configure Integration**
   - Same as HACS method steps 3

## Post-Installation Verification

### 1. Check Integration Loaded

```bash
# Check logs for successful load
grep "home_project_ledger" /config/home-assistant.log

# Expected output:
# INFO (MainThread) [homeassistant.setup] Setting up home_project_ledger
# INFO (MainThread) [custom_components.home_project_ledger] Registered Home Project Ledger services
# INFO (MainThread) [custom_components.home_project_ledger] Registered Home Project Ledger panel at /home-project-ledger
```

### 2. Verify Services

Go to Developer Tools → Services and verify these services exist:
- `home_project_ledger.create_project`
- `home_project_ledger.close_project`
- `home_project_ledger.add_receipt`
- `home_project_ledger.update_receipt`
- `home_project_ledger.delete_receipt`

### 3. Check Sidebar Panel

- Look for "Home Project Ledger" in the sidebar (notebook icon)
- Click it to open the panel
- Should see empty project list with "New Project" button

### 4. Verify Sensor Creation

Go to Developer Tools → States and look for:
- `sensor.home_project_ledger_total_house_spend`

## Testing Workflow

### Test 1: Create a Project

1. **Via Service**
   ```yaml
   service: home_project_ledger.create_project
   data:
     name: "Test Kitchen Renovation"
     area_id: "kitchen"  # Use an existing area or omit
   ```

2. **Via Panel**
   - Click "Home Project Ledger" in sidebar
   - Click "+ New Project"
   - Enter project name
   - Select area (optional)
   - Click "Create Project"

3. **Verify**
   - Project appears in list
   - New sensor created: `sensor.home_project_ledger_project_[id]_spend`
   - Sensor shows 0 (no receipts yet)

### Test 2: Add a Receipt

1. **Via Service**
   ```yaml
   service: home_project_ledger.add_receipt
   data:
     project_id: "your-project-id"  # Get from sensor attributes
     merchant: "IKEA"
     date: "2024-01-30"
     total: 1299.50
     currency: "SEK"
     category_summary: "Kitchen cabinets"
   ```

2. **Via Panel**
   - Click on your project
   - Click "+ Add Receipt"
   - Fill in details
   - Optionally upload an image
   - Click "Add Receipt"

3. **Verify**
   - Receipt appears in project
   - Project sensor updates to show total
   - Total house spend sensor increases
   - Image accessible at `/local/home_project_ledger/receipts/[filename]`

### Test 3: Upload Receipt Image

1. **Prepare Test Image**
   ```bash
   # Create a small test image
   convert -size 200x200 xc:white -pointsize 20 -draw "text 50,100 'Test Receipt'" test_receipt.jpg
   
   # Convert to base64
   base64 test_receipt.jpg > test_receipt_base64.txt
   ```

2. **Add Receipt with Image**
   ```yaml
   service: home_project_ledger.add_receipt
   data:
     project_id: "your-project-id"
     merchant: "Test Store"
     date: "2024-01-30"
     total: 99.99
     currency: "SEK"
     image_data: "[paste base64 content]"
     image_filename: "test_receipt.jpg"
   ```

3. **Verify**
   - Image saved in `/config/www/home_project_ledger/receipts/`
   - Image displays in panel
   - Image accessible via browser at URL shown in panel

### Test 4: Update a Receipt

```yaml
service: home_project_ledger.update_receipt
data:
  receipt_id: "your-receipt-id"
  total: 1350.00
  merchant: "IKEA Store Updated"
```

Verify:
- Receipt details updated
- Sensor totals recalculated

### Test 5: Close a Project

```yaml
service: home_project_ledger.close_project
data:
  project_id: "your-project-id"
```

Verify:
- Project status changes to "closed"
- Project moves to "Closed Projects" section in panel
- Sensor still reports total correctly

### Test 6: Delete a Receipt

```yaml
service: home_project_ledger.delete_receipt
data:
  receipt_id: "your-receipt-id"
```

Verify:
- Receipt removed from project
- Image file deleted from disk
- Sensor totals updated

### Test 7: Persistence

1. Add several projects and receipts
2. Restart Home Assistant: `ha core restart`
3. Verify all data persists:
   - Projects still listed
   - Receipts still present
   - Images still accessible
   - Sensors show correct totals

### Test 8: Multiple Areas

1. Create projects in different areas
2. Add receipts to each project
3. Verify:
   - Area sensors created for each area
   - Area totals correct
   - Panel shows correct area names

## Troubleshooting

### Panel Not Showing

**Problem**: Sidebar entry doesn't appear

**Solutions**:
1. Clear browser cache
2. Check that `/config/www/home_project_ledger/panel.html` exists
3. Restart Home Assistant
4. Check logs for panel registration errors

### Services Not Working

**Problem**: Services fail or don't appear

**Solutions**:
1. Verify `services.yaml` exists
2. Check logs: `grep "home_project_ledger" /config/home-assistant.log`
3. Ensure integration loaded successfully
4. Restart Home Assistant

### Images Not Displaying

**Problem**: Receipt images don't show in panel

**Solutions**:
1. Check `/config/www/home_project_ledger/receipts/` directory exists
2. Verify image files are present
3. Check file permissions
4. Try accessing image directly: `http://your-ha/local/home_project_ledger/receipts/filename.jpg`
5. Clear browser cache

### Sensors Not Updating

**Problem**: Totals don't update after adding receipts

**Solutions**:
1. Check coordinator refresh in logs
2. Verify storage operations complete
3. Force update: Developer Tools → States → Click on sensor → Refresh
4. Check for errors in logs

### Storage Issues

**Problem**: Data not persisting or errors on startup

**Solutions**:
1. Check `.storage/` directory permissions
2. Verify no corruption: Check `.storage/home_project_ledger.*.json` files
3. Backup and clear storage files if corrupted
4. Restart integration

## Performance Testing

### Load Testing

1. Create 10+ projects
2. Add 50+ receipts
3. Verify:
   - UI remains responsive
   - Sensor updates complete quickly
   - Panel loads without issues

### Image Storage

1. Add receipts with various image sizes
2. Check disk usage: `du -sh /config/www/home_project_ledger/`
3. Verify 10MB size limit enforced
4. Test image upload rejection for oversized files

## Security Verification

### File Path Security

Test filename sanitization:
```yaml
service: home_project_ledger.add_receipt
data:
  project_id: "test-id"
  merchant: "Test"
  date: "2024-01-30"
  total: 10
  currency: "SEK"
  image_data: "..."
  image_filename: "../../../etc/passwd"  # Should be sanitized
```

Verify:
- Filename sanitized to safe characters
- Image saved in correct directory
- No path traversal possible

### Size Limits

Test image size limit:
```bash
# Create large image
convert -size 5000x5000 xc:white large.jpg

# Try to upload (should fail)
# Expected error: "Image size exceeds maximum allowed size (10MB)"
```

## Development Testing

### Enable Debug Logging

```yaml
# configuration.yaml
logger:
  default: info
  logs:
    custom_components.home_project_ledger: debug
```

Restart and check logs for detailed debug output.

### Test Data Reset

To start fresh:
```bash
# Stop Home Assistant
ha core stop

# Remove storage
rm /config/.storage/home_project_ledger.*

# Remove images
rm -rf /config/www/home_project_ledger/

# Start Home Assistant
ha core start
```

## Success Criteria

✅ All tests pass  
✅ No errors in logs  
✅ Data persists across restarts  
✅ UI is responsive  
✅ Images upload and display correctly  
✅ Sensors update in real-time  
✅ Services work as expected  
✅ Security measures effective  

## Support

If you encounter issues:
1. Check [DEVELOPER.md](DEVELOPER.md) for architecture details
2. Review [EXAMPLES.md](EXAMPLES.md) for usage examples
3. Check logs for error messages
4. Open an issue: https://github.com/FredrikElliot/home-project-ledger/issues
