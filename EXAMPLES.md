# Example Automations and Dashboard Cards

## Automations

### Budget Alert - Project Exceeds Threshold

```yaml
automation:
  - alias: "Project Budget Alert"
    description: "Notify when project spending exceeds 75% of budget"
    trigger:
      - platform: template
        value_template: >
          {% set sensor = 'sensor.home_project_ledger_project_kitchen_renovation_spend' %}
          {% set spend = states(sensor) | float(0) %}
          {% set budget = state_attr(sensor, 'budget') | float(0) %}
          {{ budget > 0 and (spend / budget) >= 0.75 }}
    action:
      - service: notify.mobile_app
        data:
          title: "Budget Alert: Kitchen Renovation"
          message: >
            Project is at {{ ((states('sensor.home_project_ledger_project_kitchen_renovation_spend') | float / 
            state_attr('sensor.home_project_ledger_project_kitchen_renovation_spend', 'budget') | float) * 100) | round(0) }}% of budget!
          data:
            actions:
              - action: URI
                title: "View Project"
                uri: /home-project-ledger
```

### Weekly Spending Summary

```yaml
automation:
  - alias: "Weekly Project Spending Summary"
    trigger:
      - platform: time
        at: "18:00:00"
    condition:
      - condition: time
        weekday:
          - sun
    action:
      - service: notify.email
        data:
          title: "Weekly Home Project Summary"
          message: |
            Total House Spend: {{ states('sensor.home_project_ledger_total_house_spend') }} SEK
            
            This week's activity is available in your Project Ledger dashboard.
          data:
            url: /home-project-ledger
```

### New Receipt Notification

```yaml
automation:
  - alias: "Receipt Added Notification"
    trigger:
      - platform: state
        entity_id: sensor.home_project_ledger_total_house_spend
    condition:
      - condition: template
        value_template: "{{ trigger.from_state.state != trigger.to_state.state }}"
    action:
      - service: notify.mobile_app
        data:
          title: "Receipt Added"
          message: "New spending recorded. Total: {{ states('sensor.home_project_ledger_total_house_spend') }} SEK"
```

## Scripts

### Create Project with Notification

```yaml
script:
  create_home_project:
    alias: "Create Home Project"
    fields:
      project_name:
        description: "Name of the project"
        example: "Bathroom Remodel"
      budget:
        description: "Project budget"
        example: 25000
    sequence:
      - service: home_project_ledger.create_project
        data:
          name: "{{ project_name }}"
          budget: "{{ budget | float }}"
      - service: notify.mobile_app
        data:
          title: "Project Created"
          message: "Started tracking '{{ project_name }}' with budget {{ budget }} SEK"
```

### Quick Add Receipt

```yaml
script:
  quick_add_receipt:
    alias: "Quick Add Receipt"
    fields:
      project_id:
        description: "Project ID"
      merchant:
        description: "Store name"
      amount:
        description: "Amount spent"
    sequence:
      - service: home_project_ledger.add_receipt
        data:
          project_id: "{{ project_id }}"
          merchant: "{{ merchant }}"
          date: "{{ now().strftime('%Y-%m-%d') }}"
          total: "{{ amount | float }}"
          currency: "SEK"
      - service: notify.mobile_app
        data:
          message: "Added {{ amount }} SEK receipt from {{ merchant }}"
```

## Dashboard Cards

### Navigation Button

```yaml
type: button
name: Project Ledger
icon: mdi:notebook-edit
tap_action:
  action: navigate
  navigation_path: /home-project-ledger
hold_action:
  action: more-info
  entity: sensor.home_project_ledger_total_house_spend
```

### Total Spending Card

```yaml
type: entity
entity: sensor.home_project_ledger_total_house_spend
name: Total Home Spending
icon: mdi:home-currency-usd
```

### Project List Card

```yaml
type: entities
title: Active Projects
show_header_toggle: false
entities:
  - entity: sensor.home_project_ledger_project_kitchen_renovation_spend
    name: Kitchen Renovation
    icon: mdi:countertop
  - entity: sensor.home_project_ledger_project_bathroom_remodel_spend
    name: Bathroom Remodel
    icon: mdi:shower
  - type: button
    name: View All Projects
    icon: mdi:arrow-right
    action_name: Open
    tap_action:
      action: navigate
      navigation_path: /home-project-ledger
```

### Statistics Graph

```yaml
type: statistics-graph
title: Monthly Spending Trend
entities:
  - sensor.home_project_ledger_total_house_spend
stat_types:
  - sum
period:
  calendar:
    period: month
```

### Gauge Card for Budget

```yaml
type: gauge
entity: sensor.home_project_ledger_project_kitchen_renovation_spend
name: Kitchen Budget
min: 0
max: 50000
severity:
  green: 0
  yellow: 37500
  red: 45000
needle: true
```

### Conditional Budget Warning

```yaml
type: conditional
conditions:
  - entity: sensor.home_project_ledger_project_kitchen_renovation_spend
    state_not: unavailable
  - condition: numeric_state
    entity: sensor.home_project_ledger_project_kitchen_renovation_spend
    above: 37500
card:
  type: markdown
  content: |
    ## ⚠️ Budget Warning
    Kitchen renovation is approaching budget limit!
```

### Mushroom Cards (if installed)

```yaml
type: custom:mushroom-entity-card
entity: sensor.home_project_ledger_total_house_spend
name: Home Projects
icon: mdi:notebook-edit
tap_action:
  action: navigate
  navigation_path: /home-project-ledger
fill_container: true
```

### Grid Layout

```yaml
type: grid
columns: 2
square: false
cards:
  - type: entity
    entity: sensor.home_project_ledger_total_house_spend
    name: Total Spend
  - type: button
    name: Add Receipt
    icon: mdi:receipt-text-plus
    tap_action:
      action: navigate
      navigation_path: /home-project-ledger
  - type: entity
    entity: sensor.home_project_ledger_project_kitchen_renovation_spend
    name: Kitchen
  - type: entity
    entity: sensor.home_project_ledger_project_bathroom_remodel_spend
    name: Bathroom
```

## Voice Assistant Integration

### Intent Script (with Assist)

```yaml
intent_script:
  GetProjectSpending:
    speech:
      text: >
        Your total home project spending is {{ states('sensor.home_project_ledger_total_house_spend') }} SEK.
```

### Custom Sentence

```yaml
# In custom_sentences/en/home_projects.yaml
language: "en"
intents:
  GetProjectSpending:
    data:
      - sentences:
          - "how much have I spent on home projects"
          - "what is my total project spending"
          - "home project total"
```

## Helper Entities

### Template Sensor for Budget Remaining

```yaml
template:
  - sensor:
      - name: "Kitchen Budget Remaining"
        unit_of_measurement: "SEK"
        state: >
          {% set spent = states('sensor.home_project_ledger_project_kitchen_renovation_spend') | float(0) %}
          {% set budget = state_attr('sensor.home_project_ledger_project_kitchen_renovation_spend', 'budget') | float(0) %}
          {{ (budget - spent) | round(2) }}
        icon: mdi:cash-minus
```

### Input Number for Budget Threshold

```yaml
input_number:
  project_alert_threshold:
    name: Budget Alert Threshold
    min: 50
    max: 100
    step: 5
    unit_of_measurement: "%"
    icon: mdi:percent
```
