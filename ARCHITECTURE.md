# Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Home Assistant                            │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                  Home Project Ledger                        │ │
│  │                                                              │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │              __init__.py (Entry Point)                │  │ │
│  │  │  - async_setup_entry()                               │  │ │
│  │  │  - Initialize storage, coordinator, services         │  │ │
│  │  │  - Register panel                                     │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  │           │           │           │           │             │ │
│  │           │           │           │           │             │ │
│  │           v           v           v           v             │ │
│  │  ┌────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │ │
│  │  │ Storage    │ │Coordinator│ │ Services │ │  Sensor  │   │ │
│  │  │            │ │           │ │          │ │ Platform │   │ │
│  │  │ Projects   │ │  Update   │ │ create_  │ │          │   │ │
│  │  │ Receipts   │ │  Manager  │ │ project  │ │ Total    │   │ │
│  │  │            │ │           │ │ add_     │ │ House    │   │ │
│  │  │ async_load │ │async_     │ │ receipt  │ │ Spend    │   │ │
│  │  │ async_save │ │refresh    │ │ update_  │ │          │   │ │
│  │  │            │ │           │ │ receipt  │ │ Area     │   │ │
│  │  │            │ │           │ │ delete_  │ │ Spend    │   │ │
│  │  │            │ │           │ │ receipt  │ │          │   │ │
│  │  │            │ │           │ │ close_   │ │ Project  │   │ │
│  │  │            │ │           │ │ project  │ │ Spend    │   │ │
│  │  └────────────┘ └──────────┘ └──────────┘ └──────────┘   │ │
│  │       │              │             │            │          │ │
│  │       v              v             v            v          │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │                    Models                             │ │ │
│  │  │  - Project (UUID, name, area_id, status)            │ │ │
│  │  │  - Receipt (UUID, project_id, merchant, total, etc) │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                                                              │ │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                     Frontend Panel                          │ │
│  │                                                              │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │            panel.html (SPA)                           │  │ │
│  │  │                                                        │  │ │
│  │  │  Views:                   State Management:           │  │ │
│  │  │  - Projects List          - projects[]                │  │ │
│  │  │  - Project Detail         - receipts[]                │  │ │
│  │  │  - Receipt List           - areas{}                   │  │ │
│  │  │  - Statistics             - currentView               │  │ │
│  │  │                                                        │  │ │
│  │  │  UI Components:           Actions:                    │  │ │
│  │  │  - Create Project Modal   - createProject()           │  │ │
│  │  │  - Add Receipt Modal      - addReceipt()              │  │ │
│  │  │  - Image Upload           - deleteReceipt()           │  │ │
│  │  │  - Statistics Cards       - closeProject()            │  │ │
│  │  │                                                        │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  │              │                                               │ │
│  │              │ WebSocket API                                 │ │
│  │              v                                               │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      Storage Layer                               │
│                                                                   │
│  ┌──────────────────────┐  ┌────────────────────────────────┐  │
│  │  .storage/           │  │  www/home_project_ledger/      │  │
│  │                      │  │                                 │  │
│  │  projects.json       │  │  receipts/                     │  │
│  │  receipts.json       │  │    - 20240130_123456_img.jpg   │  │
│  │                      │  │    - 20240130_145678_img.jpg   │  │
│  │  {                   │  │    ...                         │  │
│  │    "projects": {     │  │                                 │  │
│  │      "uuid": {...}   │  │  panel.html                    │  │
│  │    }                 │  │                                 │  │
│  │  }                   │  │                                 │  │
│  └──────────────────────┘  └────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Creating a Project

```
User (Panel) → callService('create_project')
              ↓
Home Assistant WebSocket
              ↓
services.py: handle_create_project()
              ↓
models.py: Project.create()
              ↓
storage.py: async_add_project()
              ↓
.storage/projects.json (persisted)
              ↓
coordinator.py: async_refresh_data()
              ↓
sensor.py: New ProjectSpendSensor created
              ↓
Panel: Refresh UI, show new project
```

### Adding a Receipt with Image

```
User (Panel) → Upload image + Fill form
              ↓
JavaScript: Base64 encode image
              ↓
callService('add_receipt', {image_data, ...})
              ↓
Home Assistant WebSocket
              ↓
services.py: handle_add_receipt()
              ↓
Validate image size (< 10MB)
              ↓
Sanitize filename
              ↓
async_add_executor_job(write_image)
              ↓
www/home_project_ledger/receipts/[file]
              ↓
models.py: Receipt.create()
              ↓
storage.py: async_add_receipt()
              ↓
.storage/receipts.json (persisted)
              ↓
coordinator.py: async_refresh_data()
              ↓
sensor.py: Update all affected sensors
              ↓
Panel: Refresh UI, show receipt with image
```

### Sensor Updates

```
Receipt Added/Updated/Deleted
              ↓
coordinator.py: async_refresh_data()
              ↓
storage.py: get_all_projects(), get_all_receipts()
              ↓
sensor.py: _handle_coordinator_update() called
              ↓
TotalHouseSpendSensor: Recalculate sum of all receipts
              ↓
AreaSpendSensor: Recalculate sum for area receipts
              ↓
ProjectSpendSensor: Recalculate sum for project receipts
              ↓
Home Assistant: Update entity states
              ↓
Frontend/Dashboard: Display updated values
```

## Component Interactions

```
┌─────────────┐
│ Config Flow │ ──────────────┐
└─────────────┘               │
                              │ Setup
                              v
                    ┌──────────────────┐
                    │   __init__.py    │
                    └──────────────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              v               v               v
       ┌──────────┐    ┌──────────┐   ┌──────────┐
       │ Storage  │    │Coordinator│   │ Services │
       └──────────┘    └──────────┘   └──────────┘
              │               │               │
              └───────────────┼───────────────┘
                              │
                      ┌───────┴───────┐
                      │               │
                      v               v
               ┌──────────┐    ┌──────────┐
               │  Sensor  │    │  Panel   │
               │ Platform │    │ Frontend │
               └──────────┘    └──────────┘
                      │               │
                      └───────┬───────┘
                              │
                              v
                      ┌──────────────┐
                      │ Home         │
                      │ Assistant    │
                      │ Core         │
                      └──────────────┘
```

## Service Call Flow

```
Developer Tools / Automation / Panel
              ↓
home_assistant.call_service(domain, service, data)
              ↓
Service Registry Lookup
              ↓
services.py: async_setup_services()
              ↓
Service Handler Function:
  - handle_create_project()
  - handle_close_project()
  - handle_add_receipt()
  - handle_update_receipt()
  - handle_delete_receipt()
              ↓
Schema Validation (voluptuous)
              ↓
Business Logic Execution
              ↓
storage.py: async_add/update/delete
              ↓
coordinator.async_refresh_data()
              ↓
All Sensors Updated
```

## Extension Points

### Future AI Receipt Parsing

```
services.py: handle_add_receipt()
              ↓
[NEW] parsing.py: ReceiptParsingProvider
              ↓
OpenAI / Google Vision / Tesseract
              ↓
Extract: merchant, date, total, items
              ↓
Continue with existing flow
```

### Future Budget Management

```
models.py: Project
  + budget: float
  + budget_spent: float
  + budget_remaining: float
              ↓
sensor.py: New BudgetSensor
  - Shows budget progress
  - Triggers alerts
              ↓
automation: Budget threshold alert
```

### Future Cloud Sync

```
[NEW] cloud_sync.py: CloudSyncManager
              ↓
storage.py: Hook into save operations
              ↓
Sync to cloud provider (Dropbox, Google Drive)
              ↓
Download on other instances
```

## Security Boundaries

```
┌────────────────────────────────────────┐
│        Untrusted User Input            │
│  - Service call parameters             │
│  - Image data (base64)                 │
│  - Filenames                           │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│        Input Validation                │
│  - Schema validation (voluptuous)      │
│  - Size limits (10MB)                  │
│  - Filename sanitization               │
│  - Path traversal prevention           │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│        Trusted Internal Processing     │
│  - Models                              │
│  - Storage                             │
│  - Coordinator                         │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│        File System (Sandboxed)         │
│  - .storage/ (JSON)                    │
│  - www/home_project_ledger/ (Images)   │
└────────────────────────────────────────┘
```

## Performance Considerations

### Storage
- JSON files loaded once on startup
- Incremental saves on changes
- In-memory operation for reads

### Sensors
- Coordinator prevents excessive updates
- Sensors recalculate only on coordinator refresh
- No database queries (in-memory data)

### Frontend
- Single HTML file (no chunking)
- Minimal JavaScript (vanilla JS)
- Direct WebSocket communication
- No external dependencies

### Scalability
- Tested with 100+ projects
- Tested with 500+ receipts
- Image storage grows linearly
- JSON parsing remains fast

## Summary

The architecture is:
- **Modular**: Each component has a single responsibility
- **Extensible**: Easy to add new features (AI, budgets, sync)
- **Secure**: Input validation and sanitization throughout
- **Performant**: In-memory operations, async I/O
- **Maintainable**: Clear separation of concerns
- **Standard**: Follows Home Assistant best practices
