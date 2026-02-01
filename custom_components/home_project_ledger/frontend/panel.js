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
      searchQuery: "",
      activeFilter: "all", // "all", "open", "closed"
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

        /* Statistics Cards */
        .statistics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
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
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--secondary-text-color, #757575);
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 400;
          color: var(--primary-text-color, #212121);
        }

        /* Main Card */
        .card {
          background-color: var(--card-background-color, #fff);
          border-radius: var(--ha-card-border-radius, 12px);
          box-shadow: var(--ha-card-box-shadow, 0 2px 2px rgba(0,0,0,0.1));
          overflow: hidden;
        }

        .card-header {
          padding: 16px 16px 0 16px;
        }

        .card-header h2 {
          font-size: 18px;
          font-weight: 500;
          margin: 0 0 16px 0;
          color: var(--primary-text-color, #212121);
        }

        /* Search Box */
        .search-container {
          position: relative;
          margin-bottom: 16px;
        }

        .search-input {
          width: 100%;
          padding: 12px 16px 12px 44px;
          border: 1px solid var(--divider-color, #e0e0e0);
          border-radius: 28px;
          font-size: 14px;
          background-color: var(--secondary-background-color, #f5f5f5);
          color: var(--primary-text-color, #212121);
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s, background-color 0.2s;
        }

        .search-input:focus {
          border-color: var(--primary-color, #03a9f4);
          background-color: var(--card-background-color, #fff);
        }

        .search-input::placeholder {
          color: var(--secondary-text-color, #757575);
        }

        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          color: var(--secondary-text-color, #757575);
        }

        /* Filter Tabs */
        .filter-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
          border-bottom: 1px solid var(--divider-color, #e0e0e0);
          padding-bottom: 0;
        }

        .filter-tab {
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 500;
          color: var(--secondary-text-color, #757575);
          background: none;
          border: none;
          cursor: pointer;
          position: relative;
          transition: color 0.2s;
        }

        .filter-tab:hover {
          color: var(--primary-text-color, #212121);
        }

        .filter-tab.active {
          color: var(--primary-color, #03a9f4);
        }

        .filter-tab.active::after {
          content: "";
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 2px;
          background-color: var(--primary-color, #03a9f4);
        }

        .filter-tab .count {
          margin-left: 6px;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 12px;
          background-color: var(--secondary-background-color, #f5f5f5);
        }

        .filter-tab.active .count {
          background-color: var(--primary-color, #03a9f4);
          color: white;
        }

        /* Project List */
        .project-list {
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .project-item {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid var(--divider-color, #e0e0e0);
          cursor: pointer;
          transition: background-color 0.1s;
        }

        .project-item:last-child {
          border-bottom: none;
        }

        .project-item:hover {
          background-color: var(--secondary-background-color, #f5f5f5);
        }

        .project-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
          flex-shrink: 0;
        }

        .project-icon.open {
          background-color: rgba(76, 175, 80, 0.1);
          color: var(--success-color, #4caf50);
        }

        .project-icon.closed {
          background-color: rgba(158, 158, 158, 0.1);
          color: var(--disabled-color, #9e9e9e);
        }

        .project-icon svg {
          width: 24px;
          height: 24px;
        }

        .project-content {
          flex: 1;
          min-width: 0;
        }

        .project-name {
          font-size: 16px;
          font-weight: 400;
          color: var(--primary-text-color, #212121);
          margin-bottom: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .project-meta {
          font-size: 14px;
          color: var(--secondary-text-color, #757575);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .project-spend {
          font-size: 16px;
          font-weight: 500;
          color: var(--primary-text-color, #212121);
          margin-left: 16px;
          flex-shrink: 0;
        }

        .project-status-badge {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-left: 12px;
          flex-shrink: 0;
        }

        .project-status-badge.open {
          background-color: rgba(76, 175, 80, 0.1);
          color: var(--success-color, #4caf50);
        }

        .project-status-badge.closed {
          background-color: rgba(158, 158, 158, 0.1);
          color: var(--disabled-color, #9e9e9e);
        }

        /* Empty & Loading States */
        .empty-state {
          text-align: center;
          padding: 48px 24px;
          color: var(--secondary-text-color, #757575);
        }

        .empty-state-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 16px;
          color: var(--disabled-color, #bdbdbd);
        }

        .empty-state h3 {
          font-size: 16px;
          font-weight: 500;
          margin: 0 0 8px 0;
          color: var(--primary-text-color, #212121);
        }

        .empty-state p {
          margin: 0;
          font-size: 14px;
          line-height: 1.5;
        }

        code {
          background-color: var(--secondary-background-color, #f5f5f5);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 13px;
        }

        .loading {
          text-align: center;
          padding: 48px;
          color: var(--secondary-text-color, #757575);
        }

        /* No Results */
        .no-results {
          text-align: center;
          padding: 32px 16px;
          color: var(--secondary-text-color, #757575);
          font-size: 14px;
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

      // Find project sensors by checking for project_id attribute
      const states = Object.values(this._hass.states || {});
      const projectSensors = states.filter(
        (s) =>
          s.entity_id.startsWith("sensor.") &&
          s.attributes?.project_id &&
          s.attributes?.project_name
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

    // Filter projects based on search and active filter
    let filteredProjects = this._state.projects;
    
    if (this._state.activeFilter === "open") {
      filteredProjects = openProjects;
    } else if (this._state.activeFilter === "closed") {
      filteredProjects = closedProjects;
    }

    if (this._state.searchQuery) {
      const query = this._state.searchQuery.toLowerCase();
      filteredProjects = filteredProjects.filter((p) => {
        const areaName = p.area_id ? this._state.areas[p.area_id] || "" : "";
        return (
          p.name.toLowerCase().includes(query) ||
          areaName.toLowerCase().includes(query)
        );
      });
    }

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
        <div class="card-header">
          <h2>Projects</h2>
          
          <div class="search-container">
            <svg class="search-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
            </svg>
            <input 
              type="text" 
              class="search-input" 
              placeholder="Search projects..." 
              value="${this._escapeHtml(this._state.searchQuery)}"
            />
          </div>

          <div class="filter-tabs">
            <button class="filter-tab ${this._state.activeFilter === "all" ? "active" : ""}" data-filter="all">
              All<span class="count">${this._state.projects.length}</span>
            </button>
            <button class="filter-tab ${this._state.activeFilter === "open" ? "active" : ""}" data-filter="open">
              Open<span class="count">${openProjects.length}</span>
            </button>
            <button class="filter-tab ${this._state.activeFilter === "closed" ? "active" : ""}" data-filter="closed">
              Closed<span class="count">${closedProjects.length}</span>
            </button>
          </div>
        </div>

        ${this._state.projects.length === 0 ? this._renderEmptyState() : 
          filteredProjects.length === 0 ? this._renderNoResults() :
          `<div class="project-list">${filteredProjects.map((p) => this._renderProjectItem(p)).join("")}</div>`
        }
      </div>
    `;

    // Attach event listeners
    this._attachEventListeners();
  }

  _attachEventListeners() {
    // Search input
    const searchInput = this._container.querySelector(".search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this._state.searchQuery = e.target.value;
        this._render();
        // Re-focus and restore cursor position
        const newInput = this._container.querySelector(".search-input");
        if (newInput) {
          newInput.focus();
          newInput.setSelectionRange(e.target.selectionStart, e.target.selectionEnd);
        }
      });
    }

    // Filter tabs
    const filterTabs = this._container.querySelectorAll(".filter-tab");
    filterTabs.forEach((tab) => {
      tab.addEventListener("click", (e) => {
        this._state.activeFilter = e.currentTarget.dataset.filter;
        this._render();
      });
    });
  }

  _renderEmptyState() {
    return `
      <div class="empty-state">
        <svg class="empty-state-icon" viewBox="0 0 24 24">
          <path fill="currentColor" d="M19,3H14.82C14.4,1.84 13.3,1 12,1C10.7,1 9.6,1.84 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3M7,7H17V5H19V19H5V5H7V7Z"/>
        </svg>
        <h3>No projects yet</h3>
        <p>Use <code>home_project_ledger.create_project</code> in<br/>Developer Tools → Services to create your first project.</p>
      </div>
    `;
  }

  _renderNoResults() {
    return `
      <div class="no-results">
        No projects match your search.
      </div>
    `;
  }

  _renderProjectItem(project) {
    const areaName = project.area_id ? this._state.areas[project.area_id] || "Unknown Area" : "No Area";
    const isOpen = project.status === "open";
    const icon = isOpen 
      ? `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19,4H18V2H16V4H8V2H6V4H5A2,2 0 0,0 3,6V20A2,2 0 0,0 5,22H19A2,2 0 0,0 21,20V6A2,2 0 0,0 19,4M19,20H5V10H19V20M5,8V6H19V8H5Z"/></svg>`
      : `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M9,10H7V12H9V10M13,10H11V12H13V10M17,10H15V12H17V10M19,3H18V1H16V3H8V1H6V3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V8H19V19Z"/></svg>`;
    
    return `
      <div class="project-item">
        <div class="project-icon ${project.status}">
          ${icon}
        </div>
        <div class="project-content">
          <div class="project-name">${this._escapeHtml(project.name)}</div>
          <div class="project-meta">${this._escapeHtml(areaName)}</div>
        </div>
        <div class="project-spend">${this._formatCurrency(project.spend)}</div>
        <span class="project-status-badge ${project.status}">${project.status}</span>
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
