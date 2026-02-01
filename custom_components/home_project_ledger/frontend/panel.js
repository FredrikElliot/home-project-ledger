/**
 * Home Project Ledger - Custom Panel for Home Assistant
 * This is a proper web component that integrates with HA's panel system.
 * The sidebar and header remain visible - content renders in the main area only.
 */

const DOMAIN = "home_project_ledger";

class HomeProjectLedgerPanel extends HTMLElement {
  constructor() {
    super();
    this._hass = null;
    this._narrow = false;
    this._panel = null;
    this._state = {
      projects: [],
      receipts: [],
      areas: {},
      currency: "SEK",
      totalSpend: 0,
    };
    this._refreshTimer = null;
    this._initialized = false;
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._initialized) {
      this._initialize();
    } else {
      this._loadData();
    }
  }

  set narrow(narrow) {
    this._narrow = narrow;
  }

  set panel(panel) {
    this._panel = panel;
  }

  connectedCallback() {
    if (!this._initialized && this._hass) {
      this._initialize();
    }
    if (!this._refreshTimer) {
      this._refreshTimer = setInterval(() => this._loadData(), 5000);
    }
  }

  disconnectedCallback() {
    if (this._refreshTimer) {
      clearInterval(this._refreshTimer);
      this._refreshTimer = null;
    }
  }

  _initialize() {
    if (this._initialized) return;
    this._initialized = true;

    this.innerHTML = `
      <style>
        :host {
          display: block;
          padding: 16px;
          background-color: var(--primary-background-color, #fafafa);
          min-height: 100%;
          box-sizing: border-box;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        h1 {
          font-size: 28px;
          font-weight: 400;
          margin: 0 0 24px 0;
          color: var(--primary-text-color, #212121);
        }

        h2 {
          font-size: 20px;
          font-weight: 500;
          margin: 0 0 16px 0;
          color: var(--primary-text-color, #212121);
        }

        h3 {
          font-size: 16px;
          font-weight: 500;
          margin: 16px 0 12px 0;
          color: var(--secondary-text-color, #757575);
        }

        .card {
          background-color: var(--card-background-color, #fff);
          border-radius: var(--ha-card-border-radius, 12px);
          padding: 16px;
          margin-bottom: 16px;
          box-shadow: var(--ha-card-box-shadow, 0 2px 2px rgba(0,0,0,0.1));
        }

        .statistics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card {
          background-color: var(--card-background-color, #fff);
          border-radius: var(--ha-card-border-radius, 12px);
          padding: 16px;
          box-shadow: var(--ha-card-box-shadow, 0 2px 2px rgba(0,0,0,0.1));
        }

        .stat-label {
          font-size: 14px;
          color: var(--secondary-text-color, #757575);
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 500;
          color: var(--primary-color, #03a9f4);
        }

        .project-list {
          display: grid;
          gap: 12px;
        }

        .project-item {
          background-color: var(--secondary-background-color, #f5f5f5);
          border-radius: 8px;
          padding: 16px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .project-item:hover {
          background-color: var(--divider-color, #e0e0e0);
        }

        .project-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .project-name {
          font-size: 16px;
          font-weight: 500;
        }

        .project-status {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .status-open {
          background-color: var(--success-color, #4caf50);
          color: white;
        }

        .status-closed {
          background-color: var(--disabled-color, #9e9e9e);
          color: white;
        }

        .project-details {
          font-size: 14px;
          color: var(--secondary-text-color, #757575);
        }

        .loading {
          text-align: center;
          padding: 48px;
          color: var(--secondary-text-color, #757575);
        }

        .empty-state {
          text-align: center;
          padding: 32px;
          color: var(--secondary-text-color, #757575);
        }

        .empty-state p {
          margin: 0;
        }

        code {
          background-color: var(--secondary-background-color, #f5f5f5);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 13px;
        }
      </style>
      <div class="container">
        <div class="loading">Loading...</div>
      </div>
    `;

    this._container = this.querySelector(".container");
    this._loadData();
  }

  async _loadData() {
    if (!this._hass) return;

    try {
      // Get currency from total sensor
      const totalEntity = this._hass.states["sensor.home_project_ledger_total_house_spend"];
      if (totalEntity?.attributes?.currency) {
        this._state.currency = totalEntity.attributes.currency;
      }
      this._state.totalSpend = totalEntity ? parseFloat(totalEntity.state) || 0 : 0;

      // Load areas
      try {
        const areaRegistry = await this._hass.callWS({ type: "config/area_registry/list" });
        this._state.areas = {};
        areaRegistry.forEach((area) => {
          this._state.areas[area.area_id] = area.name;
        });
      } catch (e) {
        console.warn("Could not load area registry:", e);
      }

      // Find project sensors
      const states = Object.values(this._hass.states || {});
      const projectSensors = states.filter(
        (s) =>
          s.entity_id.startsWith("sensor.home_project_ledger_") &&
          s.entity_id.includes("_spend") &&
          !s.entity_id.includes("total_house") &&
          !s.entity_id.includes("_area_")
      );

      const projectMap = new Map();
      projectSensors.forEach((sensor) => {
        const attrs = sensor.attributes || {};
        if (attrs.project_id && attrs.project_name) {
          projectMap.set(attrs.project_id, {
            project_id: attrs.project_id,
            name: attrs.project_name,
            area_id: attrs.area_id || null,
            status: attrs.status || "open",
            spend: parseFloat(sensor.state) || 0,
          });
        }
      });

      this._state.projects = Array.from(projectMap.values());
      this._render();
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }

  _render() {
    if (!this._container) return;

    const openProjects = this._state.projects.filter((p) => p.status === "open");
    const closedProjects = this._state.projects.filter((p) => p.status === "closed");

    this._container.innerHTML = `
      <h1>Home Project Ledger</h1>

      <div class="statistics">
        <div class="stat-card">
          <div class="stat-label">Total Spend</div>
          <div class="stat-value">${this._formatCurrency(this._state.totalSpend)}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Open Projects</div>
          <div class="stat-value">${openProjects.length}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Total Projects</div>
          <div class="stat-value">${this._state.projects.length}</div>
        </div>
      </div>

      <div class="card">
        <h2>Projects</h2>
        ${
          this._state.projects.length === 0
            ? `<div class="empty-state"><p>No projects yet. Use <code>home_project_ledger.create_project</code> in Developer Tools → Services to create your first project.</p></div>`
            : `
            ${openProjects.length > 0 ? `<h3>Open</h3><div class="project-list">${openProjects.map((p) => this._renderProjectItem(p)).join("")}</div>` : ""}
            ${closedProjects.length > 0 ? `<h3>Closed</h3><div class="project-list">${closedProjects.map((p) => this._renderProjectItem(p)).join("")}</div>` : ""}
          `
        }
      </div>
    `;
  }

  _renderProjectItem(project) {
    const areaName = project.area_id ? this._state.areas[project.area_id] || "Unknown Area" : "No Area";
    return `
      <div class="project-item">
        <div class="project-header">
          <span class="project-name">${this._escapeHtml(project.name)}</span>
          <span class="project-status status-${project.status}">${project.status.toUpperCase()}</span>
        </div>
        <div class="project-details">
          Area: ${this._escapeHtml(areaName)} · Spend: ${this._formatCurrency(project.spend)}
        </div>
      </div>
    `;
  }

  _formatCurrency(amount) {
    return new Intl.NumberFormat("sv-SE", {
      style: "currency",
      currency: this._state.currency,
    }).format(amount);
  }

  _escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}

customElements.define("home_project_ledger-panel", HomeProjectLedgerPanel);
