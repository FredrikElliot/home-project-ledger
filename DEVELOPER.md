# Developer Documentation

## Architecture Overview

Home Project Ledger follows standard Home Assistant custom integration architecture:

```
custom_components/home_project_ledger/
├── __init__.py           # Integration setup and teardown
├── manifest.json         # Integration metadata
├── const.py             # Constants
├── config_flow.py       # Configuration UI flow
├── models.py            # Data models (Project, Receipt)
├── storage.py           # Storage handler using Store
├── coordinator.py       # DataUpdateCoordinator
├── services.py          # Service handlers
├── sensor.py            # Sensor platform
├── services.yaml        # Service definitions
├── strings.json         # UI strings
├── translations/        # Translations
│   ├── en.json
│   └── sv.json
└── frontend/           # Frontend panel
    └── panel.html
```

## Data Models

### Project
- `project_id` (UUID): Unique identifier
- `name` (str): Project name
- `area_id` (str, optional): Home Assistant Area ID
- `status` (str): "open" or "closed"
- `created_at` (ISO datetime): Creation timestamp
- `closed_at` (ISO datetime, optional): Close timestamp

### Receipt
- `receipt_id` (UUID): Unique identifier
- `project_id` (UUID): Associated project
- `area_id` (str, optional): Home Assistant Area ID
- `image_path` (str, optional): Web path to receipt image
- `merchant` (str): Merchant name
- `date` (str): Purchase date (ISO format)
- `total` (float): Total amount
- `currency` (str): Currency code (ISO 4217)
- `category_summary` (str, optional): Category description
- `created_at` (ISO datetime): Creation timestamp
- `updated_at` (ISO datetime): Last update timestamp

## Storage

Data is persisted using Home Assistant's `Store` helper:
- Projects: `.storage/home_project_ledger.projects.json`
- Receipts: `.storage/home_project_ledger.receipts.json`
- Images: `config/www/home_project_ledger/receipts/`

## Services

All services are defined in `services.yaml` and implemented in `services.py`:

### create_project
```yaml
service: home_project_ledger.create_project
data:
  name: "Kitchen Renovation"
  area_id: "kitchen"  # optional
```

### close_project
```yaml
service: home_project_ledger.close_project
data:
  project_id: "abc-123-def-456"
```

### add_receipt
```yaml
service: home_project_ledger.add_receipt
data:
  project_id: "abc-123-def-456"
  area_id: "kitchen"  # optional
  merchant: "IKEA"
  date: "2024-01-30"
  total: 1299.50
  currency: "SEK"
  category_summary: "Furniture"  # optional
  image_data: "base64_encoded_image"  # optional
  image_filename: "receipt.jpg"  # optional
```

### update_receipt
```yaml
service: home_project_ledger.update_receipt
data:
  receipt_id: "xyz-789-abc-123"
  merchant: "IKEA Store"  # optional
  total: 1350.00  # optional
```

### delete_receipt
```yaml
service: home_project_ledger.delete_receipt
data:
  receipt_id: "xyz-789-abc-123"
```

## Sensors

The integration creates monetary sensors:

1. **Total House Spend**: `sensor.home_project_ledger_total_house_spend`
   - Aggregates all receipts across all projects
   - Device class: monetary
   - State class: total

2. **Area Spend**: `sensor.home_project_ledger_area_[area_id]_spend`
   - Created for each area with receipts
   - Aggregates receipts for that area

3. **Project Spend**: `sensor.home_project_ledger_project_[project_id]_spend`
   - Created for each project
   - Aggregates receipts for that project
   - Includes project metadata in attributes

All sensors update automatically when receipts change via the coordinator.

## Frontend Panel

The custom panel is an HTML/JavaScript SPA located at:
- Source: `frontend/panel.html`
- Deployed: `www/home_project_ledger/panel.html`
- Accessible at: `/home-project-ledger` in sidebar

The panel uses:
- Native JavaScript (no framework)
- Home Assistant WebSocket API for data and services
- Responsive CSS with HA color variables

## Extending the Integration

### Adding AI Receipt Parsing

The architecture is designed to support future receipt parsing:

1. Create `parsing.py` with a provider interface:
```python
class ReceiptParsingProvider:
    async def parse_receipt(self, image_data: bytes) -> dict:
        """Parse receipt and return structured data."""
        pass
```

2. Add providers (OpenAI, Google Vision, etc.)
3. Call parser in `add_receipt` service before creating Receipt
4. Store raw parse results in receipt metadata

### Adding Budgeting

1. Extend `Project` model with `budget` field
2. Add budget comparison to sensor attributes
3. Create automation triggers for budget alerts
4. Add budget visualization to frontend panel

## Testing

### Manual Testing

1. Install integration via HACS or manually
2. Add integration via UI: Settings → Devices & Services
3. Create a project via service call or panel
4. Add receipt with image
5. Verify sensor updates
6. Check panel displays correctly
7. Test closing project
8. Test deleting receipt (verify image deletion)
9. Restart HA and verify persistence

### Integration Testing

To test in a development environment:

```bash
# Start Home Assistant in development mode
hass -c config --debug

# Watch logs
tail -f config/home-assistant.log | grep home_project_ledger
```

## Code Style

- Follow PEP 8
- Use type hints
- Async/await for all I/O
- Comprehensive logging (debug, info, error)
- Defensive programming (validate inputs)
- No blocking operations

## Common Issues

### Panel not showing
- Check `www/home_project_ledger/panel.html` exists
- Verify frontend component is loaded
- Clear browser cache

### Services not working
- Check `services.yaml` is present
- Verify service registration in logs
- Check parameter schema matches service call

### Sensors not updating
- Verify coordinator refresh is called
- Check storage operations complete successfully
- Review sensor `_handle_coordinator_update` implementation

## Release Process

1. Update version in `manifest.json`
2. Update CHANGELOG.md
3. Tag release: `git tag v0.1.0`
4. Push tags: `git push --tags`
5. Create GitHub release with notes
6. HACS will auto-detect the release
