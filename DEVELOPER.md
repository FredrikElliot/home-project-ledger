# Developer Documentation

## Project Structure

```
custom_components/home_project_ledger/
├── __init__.py              # Integration setup, panel registration
├── manifest.json            # Integration metadata for HA and HACS
├── const.py                 # Constants and configuration keys
├── config_flow.py           # UI configuration flow with OAuth
├── models.py                # Data models (Project, Receipt)
├── storage.py               # Persistent storage using HA Store
├── coordinator.py           # DataUpdateCoordinator for updates
├── services.py              # Service handlers (CRUD operations)
├── sensor.py                # Sensor platform (monetary sensors)
├── button.py                # Button entities for quick actions
├── http_views.py            # HTTP API endpoints
├── cloud_storage_manager.py # Cloud storage abstraction
├── services.yaml            # Service definitions
├── strings.json             # UI strings (fallback)
├── translations/            # Translations
│   ├── en.json              # English
│   └── sv.json              # Swedish
└── frontend/
    └── panel.js             # Custom panel (JavaScript SPA)
```

## Data Models

### Project
```python
@dataclass
class Project:
    project_id: str          # UUID
    name: str                # Display name
    area_id: str | None      # HA Area ID
    status: str              # "open" or "closed"
    budget: float | None     # Total budget
    budget_by_category: dict | None  # {"Category": amount}
    created_at: str          # ISO datetime
    closed_at: str | None    # ISO datetime
```

### Receipt
```python
@dataclass
class Receipt:
    receipt_id: str          # UUID
    project_id: str          # Parent project
    merchant: str            # Store name
    date: str                # YYYY-MM-DD
    total: float             # Amount
    currency: str            # ISO 4217 code
    category_summary: str | None      # Single category (legacy)
    categories: list | None           # Multiple categories
    category_split: dict | None       # Split amounts
    category_split_type: str | None   # "absolute" or "percentage"
    image_paths: list | None          # Multiple image URLs
    created_at: str          # ISO datetime
    updated_at: str          # ISO datetime
```

## Services

All services are defined in `services.yaml` with full schemas:

### Project Services

```yaml
# Create project with optional budget
service: home_project_ledger.create_project
data:
  name: "Kitchen Renovation"
  area_id: "kitchen"
  budget: 50000
  budget_by_category:
    Materials: 30000
    Labor: 15000
    Fixtures: 5000

# Update project
service: home_project_ledger.update_project
data:
  project_id: "uuid"
  name: "New Name"
  budget: 60000

# Close/reopen project
service: home_project_ledger.close_project
data:
  project_id: "uuid"

service: home_project_ledger.reopen_project
data:
  project_id: "uuid"

# Delete project and all receipts
service: home_project_ledger.delete_project
data:
  project_id: "uuid"
```

### Receipt Services

```yaml
# Add receipt with categories
service: home_project_ledger.add_receipt
data:
  project_id: "uuid"
  merchant: "IKEA"
  date: "2026-02-02"
  total: 1299.50
  currency: "SEK"
  categories:
    - Materials
    - Hardware
  category_split:
    Materials: 1000
    Hardware: 299.50
  category_split_type: "absolute"
  image_data: "base64..."
  image_filename: "receipt.jpg"

# Update receipt
service: home_project_ledger.update_receipt
data:
  receipt_id: "uuid"
  merchant: "IKEA Store"
  total: 1350.00

# Delete receipt
service: home_project_ledger.delete_receipt
data:
  receipt_id: "uuid"
```

## Sensors

The integration creates three types of sensors:

### TotalHouseSpendSensor
- Entity: `sensor.home_project_ledger_total_house_spend`
- Aggregates all receipts across all projects
- Attributes: project count, receipt count

### AreaSpendSensor
- Entity: `sensor.home_project_ledger_area_{area_id}_spend`
- Created dynamically when projects have area associations
- Aggregates receipts for projects in that area

### ProjectSpendSensor
- Entity: `sensor.home_project_ledger_project_{project_id}_spend`
- One sensor per project
- Attributes: project name, status, budget, receipts list

All sensors use:
- `SensorDeviceClass.MONETARY`
- `SensorStateClass.TOTAL`
- Native unit from configured currency

## Frontend Panel

The panel is a vanilla JavaScript SPA in `frontend/panel.js`:

### Key Components
- Navigation tabs (Dashboard, Projects, Receipts, Merchants, Categories, Settings)
- Dashboard with charts (amCharts 5 for line graph, CSS donuts)
- Project list with budget progress bars
- Receipt modals with image upload
- Expandable lists for merchants/categories
- Settings for storage configuration

### State Management
```javascript
this._state = {
  activeTab: 'dashboard',
  projects: [],
  receipts: [],           // Populated in _render()
  expandedProjectId: null,
  expandedReceiptId: null,
  expandedMerchant: null,
  expandedCategory: null,
  modal: null,
  // ... more state
};
```

### Calling Services
```javascript
await this._hass.callService('home_project_ledger', 'add_receipt', {
  project_id: projectId,
  merchant: merchant,
  date: date,
  total: parseFloat(total),
  // ...
});
```

## Adding New Features

### Adding a New Service

1. Define in `services.yaml`:
```yaml
my_new_service:
  name: My Service
  description: Does something
  fields:
    param1:
      name: Parameter
      required: true
      selector:
        text:
```

2. Add handler in `services.py`:
```python
async def handle_my_service(call: ServiceCall) -> None:
    param1 = call.data.get("param1")
    # Implementation
```

3. Register in `async_setup_services`:
```python
hass.services.async_register(
    DOMAIN, "my_new_service", handle_my_service, schema=MY_SERVICE_SCHEMA
)
```

### Adding a New Sensor

1. Create sensor class in `sensor.py`:
```python
class MySensor(CoordinatorEntity, SensorEntity):
    def __init__(self, coordinator, ...):
        super().__init__(coordinator)
        # Setup
    
    @property
    def native_value(self):
        return self._calculate_value()
```

2. Add to `async_setup_entry` in `sensor.py`

### Adding Translations

1. Add keys to `translations/en.json` and `translations/sv.json`
2. Use in config flow with `self.async_show_form(data_schema=..., description_placeholders=...)`
3. Use in frontend with `this._t('key')`

## Testing

### Manual Testing
1. Create test project via service
2. Add receipts with various configurations
3. Verify sensors update correctly
4. Test UI interactions

### Debug Logging
Add to `configuration.yaml`:
```yaml
logger:
  default: warning
  logs:
    custom_components.home_project_ledger: debug
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

### Code Style
- Follow Home Assistant's coding standards
- Use type hints
- Add docstrings to functions
- Keep functions focused and small
