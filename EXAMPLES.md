# Example Automations and Scripts

## Example Automations

### 1. Notify when project spending exceeds threshold

```yaml
automation:
  - alias: "Project Budget Alert"
    description: "Send notification when project spending exceeds 10,000 SEK"
    trigger:
      - platform: state
        entity_id: sensor.home_project_ledger_project_kitchen_renovation_spend
    condition:
      - condition: numeric_state
        entity_id: sensor.home_project_ledger_project_kitchen_renovation_spend
        above: 10000
    action:
      - service: notify.mobile_app
        data:
          title: "Budget Alert: Kitchen Renovation"
          message: "Project spending has exceeded 10,000 SEK. Current: {{ states('sensor.home_project_ledger_project_kitchen_renovation_spend') }} SEK"
```

### 2. Close project automatically when spending stops

```yaml
automation:
  - alias: "Auto-close inactive projects"
    description: "Close projects with no receipts added in 30 days"
    trigger:
      - platform: time
        at: "00:00:00"
    action:
      - service: python_script.close_inactive_projects
        data:
          days_inactive: 30
```

### 3. Weekly spending summary

```yaml
automation:
  - alias: "Weekly Project Spending Summary"
    description: "Send weekly summary of all project spending"
    trigger:
      - platform: time
        at: "18:00:00"
      - platform: time
        at: "sunday"
    action:
      - service: notify.email
        data:
          title: "Weekly Home Project Summary"
          message: >
            Total House Spend: {{ states('sensor.home_project_ledger_total_house_spend') }} SEK
            
            Open Projects:
            - Kitchen: {{ states('sensor.home_project_ledger_project_kitchen_renovation_spend') }} SEK
            - Bathroom: {{ states('sensor.home_project_ledger_project_bathroom_remodel_spend') }} SEK
```

## Example Scripts

### 1. Create project with notification

```yaml
script:
  create_home_project:
    alias: "Create Home Project"
    description: "Create a new home project with notification"
    fields:
      project_name:
        description: "Name of the project"
        example: "Kitchen Renovation"
      area_id:
        description: "Area ID"
        example: "kitchen"
    sequence:
      - service: home_project_ledger.create_project
        data:
          name: "{{ project_name }}"
          area_id: "{{ area_id }}"
      - service: notify.mobile_app
        data:
          title: "New Project Created"
          message: "Started tracking '{{ project_name }}'"
```

### 2. Add receipt from camera

```yaml
script:
  add_receipt_from_camera:
    alias: "Add Receipt from Camera"
    description: "Capture receipt with camera and add to project"
    fields:
      project_id:
        description: "Project ID"
        example: "abc-123-def-456"
      merchant:
        description: "Merchant name"
        example: "IKEA"
      total:
        description: "Total amount"
        example: 1299.50
    sequence:
      # In MVP, manually input data - future: OCR parsing
      - service: home_project_ledger.add_receipt
        data:
          project_id: "{{ project_id }}"
          merchant: "{{ merchant }}"
          date: "{{ now().strftime('%Y-%m-%d') }}"
          total: "{{ total }}"
          currency: "SEK"
      - service: notify.mobile_app
        data:
          message: "Receipt added to project"
```

### 3. Complete project workflow

```yaml
script:
  complete_project:
    alias: "Complete Project"
    description: "Close project and send summary"
    fields:
      project_id:
        description: "Project ID"
        example: "abc-123-def-456"
    sequence:
      - service: home_project_ledger.close_project
        data:
          project_id: "{{ project_id }}"
      - service: notify.email
        data:
          title: "Project Completed"
          message: >
            Project has been closed.
            Final spending: {{ states('sensor.home_project_ledger_project_' ~ project_id ~ '_spend') }} SEK
```

## Dashboard Card Examples

### 1. Project overview card

```yaml
type: entities
title: Home Project Ledger
entities:
  - entity: sensor.home_project_ledger_total_house_spend
    name: Total House Spend
  - type: divider
  - entity: sensor.home_project_ledger_project_kitchen_renovation_spend
    name: Kitchen Renovation
  - entity: sensor.home_project_ledger_project_bathroom_remodel_spend
    name: Bathroom Remodel
```

### 2. Statistics card

```yaml
type: statistic
entity: sensor.home_project_ledger_total_house_spend
period:
  calendar:
    period: month
stat_type: change
name: Monthly Spending
```

### 3. Gauge card for budget tracking

```yaml
type: gauge
entity: sensor.home_project_ledger_project_kitchen_renovation_spend
min: 0
max: 50000
severity:
  green: 0
  yellow: 35000
  red: 45000
name: Kitchen Renovation Budget
```

### 4. Markdown card with project list

```yaml
type: markdown
content: >
  ## Active Projects
  
  **Kitchen Renovation**: {{ states('sensor.home_project_ledger_project_kitchen_renovation_spend') }} {{ state_attr('sensor.home_project_ledger_project_kitchen_renovation_spend', 'unit_of_measurement') }}
  
  **Bathroom Remodel**: {{ states('sensor.home_project_ledger_project_bathroom_remodel_spend') }} {{ state_attr('sensor.home_project_ledger_project_bathroom_remodel_spend', 'unit_of_measurement') }}
  
  ---
  
  **Total**: {{ states('sensor.home_project_ledger_total_house_spend') }} {{ state_attr('sensor.home_project_ledger_total_house_spend', 'unit_of_measurement') }}
```

## Lovelace UI Examples

### Full project dashboard

```yaml
title: Home Projects
path: projects
icon: mdi:notebook-edit
badges: []
cards:
  - type: horizontal-stack
    cards:
      - type: statistic
        entity: sensor.home_project_ledger_total_house_spend
        name: Total Spend
        period:
          calendar:
            period: year
      - type: sensor
        entity: sensor.home_project_ledger_total_house_spend
        name: Current Total
        graph: line
  
  - type: entities
    title: Open Projects
    entities:
      - entity: sensor.home_project_ledger_project_kitchen_renovation_spend
        type: custom:bar-card
        max: 50000
      - entity: sensor.home_project_ledger_project_bathroom_remodel_spend
        type: custom:bar-card
        max: 30000
  
  - type: custom:button-card
    name: Open Project Ledger
    icon: mdi:notebook-edit
    tap_action:
      action: navigate
      navigation_path: /home-project-ledger
```

## Service Call Examples (Developer Tools)

### Create a project
```yaml
service: home_project_ledger.create_project
data:
  name: "Living Room Renovation"
  area_id: "living_room"
```

### Add a receipt
```yaml
service: home_project_ledger.add_receipt
data:
  project_id: "your-project-id-here"
  merchant: "Bauhaus"
  date: "2024-01-30"
  total: 2499.00
  currency: "SEK"
  category_summary: "Paint and supplies"
```

### Close a project
```yaml
service: home_project_ledger.close_project
data:
  project_id: "your-project-id-here"
```

## Node-RED Examples

### Flow: Add receipt via voice assistant

```json
[
  {
    "id": "voice_receipt",
    "type": "voice-assistant-in",
    "name": "Add Receipt Command",
    "outputs": 1
  },
  {
    "id": "parse_voice",
    "type": "function",
    "func": "const merchant = msg.payload.merchant;\nconst amount = msg.payload.amount;\nreturn { payload: { merchant, amount } };",
    "outputs": 1
  },
  {
    "id": "add_receipt_service",
    "type": "call-service",
    "service": "home_project_ledger.add_receipt",
    "data": {
      "project_id": "current-project-id",
      "merchant": "{{ payload.merchant }}",
      "total": "{{ payload.amount }}",
      "date": "{{ now() }}",
      "currency": "SEK"
    }
  }
]
```

## Tips

1. **Use sensors in templates**: All project and area sensors can be used in templates for custom cards and automations.

2. **Track spending over time**: Use the Long-Term Statistics feature to track historical spending trends.

3. **Create views per area**: Organize your dashboard with separate views for each area/room.

4. **Backup your data**: The integration stores data in `.storage/` - include this in your Home Assistant backups.

5. **Custom notifications**: Create rich notifications with project details using sensor attributes.
