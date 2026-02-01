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
      activeFilter: "all",
      expandedProjectId: null,
      openMenuId: null,
      modal: null,
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
    document.addEventListener("click", this._handleDocumentClick.bind(this));
  }

  disconnectedCallback() {
    if (this._refreshTimer) {
      clearInterval(this._refreshTimer);
      this._refreshTimer = null;
    }
    document.removeEventListener("click", this._handleDocumentClick.bind(this));
  }

  _handleDocumentClick(e) {
    if (this._state.openMenuId && !e.target.closest(".menu-container")) {
      this._state.openMenuId = null;
      this._render();
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
        .container { max-width: 1200px; margin: 0 auto; }
        h1 { font-size: 28px; font-weight: 400; margin: 0 0 24px 0; color: var(--primary-text-color, #212121); }
        .statistics { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; margin-bottom: 24px; }
        .stat-card { background-color: var(--card-background-color, #fff); border-radius: var(--ha-card-border-radius, 12px); padding: 16px; box-shadow: var(--ha-card-box-shadow, 0 2px 2px rgba(0,0,0,0.1)); }
        .stat-label { font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; color: var(--secondary-text-color, #757575); margin-bottom: 4px; }
        .stat-value { font-size: 24px; font-weight: 400; color: var(--primary-text-color, #212121); }
        .card { background-color: var(--card-background-color, #fff); border-radius: var(--ha-card-border-radius, 12px); box-shadow: var(--ha-card-box-shadow, 0 2px 2px rgba(0,0,0,0.1)); overflow: hidden; }
        .card-header { padding: 16px 16px 0 16px; }
        .card-header h2 { font-size: 18px; font-weight: 500; margin: 0 0 16px 0; color: var(--primary-text-color, #212121); }
        .search-container { position: relative; margin-bottom: 16px; }
        .search-input { width: 100%; padding: 12px 16px 12px 44px; border: 1px solid var(--divider-color, #e0e0e0); border-radius: 28px; font-size: 14px; background-color: var(--secondary-background-color, #f5f5f5); color: var(--primary-text-color, #212121); outline: none; box-sizing: border-box; }
        .search-input:focus { border-color: var(--primary-color, #03a9f4); background-color: var(--card-background-color, #fff); }
        .search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); width: 20px; height: 20px; color: var(--secondary-text-color, #757575); }
        .filter-tabs { display: flex; gap: 8px; margin-bottom: 8px; border-bottom: 1px solid var(--divider-color, #e0e0e0); }
        .filter-tab { padding: 8px 16px; font-size: 14px; font-weight: 500; color: var(--secondary-text-color, #757575); background: none; border: none; cursor: pointer; position: relative; }
        .filter-tab:hover { color: var(--primary-text-color, #212121); }
        .filter-tab.active { color: var(--primary-color, #03a9f4); }
        .filter-tab.active::after { content: ""; position: absolute; bottom: -1px; left: 0; right: 0; height: 2px; background-color: var(--primary-color, #03a9f4); }
        .filter-tab .count { margin-left: 6px; padding: 2px 8px; border-radius: 10px; font-size: 12px; background-color: var(--secondary-background-color, #f5f5f5); }
        .filter-tab.active .count { background-color: var(--primary-color, #03a9f4); color: white; }
        .project-list { margin: 0; padding: 0; list-style: none; }
        .project-wrapper { border-bottom: 1px solid var(--divider-color, #e0e0e0); }
        .project-wrapper:last-child { border-bottom: none; }
        .project-item { display: flex; align-items: center; padding: 12px 16px; cursor: pointer; transition: background-color 0.1s; }
        .project-item:hover { background-color: var(--secondary-background-color, #f5f5f5); }
        .project-item.expanded { background-color: var(--secondary-background-color, #f5f5f5); }
        .project-icon { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 16px; flex-shrink: 0; }
        .project-icon.open { background-color: rgba(76, 175, 80, 0.1); color: var(--success-color, #4caf50); }
        .project-icon.closed { background-color: rgba(158, 158, 158, 0.1); color: var(--disabled-color, #9e9e9e); }
        .project-icon svg { width: 24px; height: 24px; }
        .project-content { flex: 1; min-width: 0; }
        .project-name { font-size: 16px; font-weight: 400; color: var(--primary-text-color, #212121); margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .project-meta { font-size: 14px; color: var(--secondary-text-color, #757575); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .project-spend { font-size: 16px; font-weight: 500; color: var(--primary-text-color, #212121); margin-left: 16px; flex-shrink: 0; }
        .project-status-badge { padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; margin-left: 12px; flex-shrink: 0; }
        .project-status-badge.open { background-color: rgba(76, 175, 80, 0.1); color: var(--success-color, #4caf50); }
        .project-status-badge.closed { background-color: rgba(158, 158, 158, 0.1); color: var(--disabled-color, #9e9e9e); }
        .menu-container { position: relative; margin-left: 8px; }
        .menu-btn { width: 36px; height: 36px; border: none; background: none; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--secondary-text-color, #757575); }
        .menu-btn:hover { background-color: var(--divider-color, #e0e0e0); }
        .menu-btn svg { width: 20px; height: 20px; }
        .menu-dropdown { position: absolute; top: 100%; right: 0; background-color: var(--card-background-color, #fff); border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); min-width: 160px; z-index: 100; overflow: hidden; }
        .menu-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border: none; background: none; width: 100%; text-align: left; font-size: 14px; color: var(--primary-text-color, #212121); cursor: pointer; }
        .menu-item:hover { background-color: var(--secondary-background-color, #f5f5f5); }
        .menu-item.danger { color: var(--error-color, #f44336); }
        .menu-item svg { width: 20px; height: 20px; flex-shrink: 0; }
        .project-detail { background-color: var(--primary-background-color, #fafafa); padding: 16px; border-top: 1px solid var(--divider-color, #e0e0e0); }
        .receipts-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .receipts-header h4 { margin: 0; font-size: 14px; font-weight: 500; color: var(--secondary-text-color, #757575); text-transform: uppercase; letter-spacing: 0.5px; }
        .add-btn { display: flex; align-items: center; gap: 6px; padding: 6px 12px; border: none; background-color: var(--primary-color, #03a9f4); color: white; border-radius: 16px; font-size: 13px; font-weight: 500; cursor: pointer; }
        .add-btn:hover { opacity: 0.9; }
        .add-btn svg { width: 16px; height: 16px; }
        .receipt-list { display: flex; flex-direction: column; gap: 8px; }
        .receipt-item { display: flex; align-items: center; padding: 12px; background-color: var(--card-background-color, #fff); border-radius: 8px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
        .receipt-icon { width: 32px; height: 32px; border-radius: 50%; background-color: var(--secondary-background-color, #f5f5f5); display: flex; align-items: center; justify-content: center; margin-right: 12px; color: var(--secondary-text-color, #757575); }
        .receipt-icon svg { width: 18px; height: 18px; }
        .receipt-content { flex: 1; min-width: 0; }
        .receipt-merchant { font-size: 14px; font-weight: 500; color: var(--primary-text-color, #212121); }
        .receipt-date { font-size: 12px; color: var(--secondary-text-color, #757575); }
        .receipt-amount { font-size: 14px; font-weight: 500; color: var(--primary-text-color, #212121); margin-left: 12px; }
        .empty-receipts { text-align: center; padding: 24px; color: var(--secondary-text-color, #757575); font-size: 14px; }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal { background-color: var(--card-background-color, #fff); border-radius: 12px; max-width: 400px; width: 90%; max-height: 90vh; overflow-y: auto; box-shadow: 0 4px 20px rgba(0,0,0,0.2); }
        .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid var(--divider-color, #e0e0e0); }
        .modal-header h3 { margin: 0; font-size: 18px; font-weight: 500; color: var(--primary-text-color, #212121); }
        .modal-close { width: 36px; height: 36px; border: none; background: none; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--secondary-text-color, #757575); }
        .modal-close:hover { background-color: var(--secondary-background-color, #f5f5f5); }
        .modal-close svg { width: 20px; height: 20px; }
        .modal-body { padding: 20px; }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; color: var(--secondary-text-color, #757575); margin-bottom: 6px; }
        .form-group input, .form-group select { width: 100%; padding: 12px; border: 1px solid var(--divider-color, #e0e0e0); border-radius: 8px; font-size: 14px; background-color: var(--card-background-color, #fff); color: var(--primary-text-color, #212121); box-sizing: border-box; }
        .form-group input:focus, .form-group select:focus { outline: none; border-color: var(--primary-color, #03a9f4); }
        .modal-actions { display: flex; gap: 12px; padding: 16px 20px; border-top: 1px solid var(--divider-color, #e0e0e0); }
        .btn { flex: 1; padding: 12px 16px; border: none; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; }
        .btn:hover { opacity: 0.9; }
        .btn-secondary { background-color: var(--secondary-background-color, #f5f5f5); color: var(--primary-text-color, #212121); }
        .btn-primary { background-color: var(--primary-color, #03a9f4); color: white; }
        .btn-danger { background-color: var(--error-color, #f44336); color: white; }
        .confirm-message { font-size: 14px; color: var(--primary-text-color, #212121); line-height: 1.5; }
        .empty-state { text-align: center; padding: 48px 24px; color: var(--secondary-text-color, #757575); }
        .empty-state-icon { width: 64px; height: 64px; margin: 0 auto 16px; color: var(--disabled-color, #bdbdbd); }
        .empty-state h3 { font-size: 16px; font-weight: 500; margin: 0 0 8px 0; color: var(--primary-text-color, #212121); }
        .empty-state p { margin: 0; font-size: 14px; line-height: 1.5; }
        code { background-color: var(--secondary-background-color, #f5f5f5); padding: 2px 6px; border-radius: 4px; font-size: 13px; }
        .loading { text-align: center; padding: 48px; color: var(--secondary-text-color, #757575); }
        .no-results { text-align: center; padding: 32px 16px; color: var(--secondary-text-color, #757575); font-size: 14px; }
        .expand-icon { width: 24px; height: 24px; margin-left: 8px; color: var(--secondary-text-color, #757575); transition: transform 0.2s; }
        .expand-icon.expanded { transform: rotate(180deg); }
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
      const totalEntity = this._hass.states["sensor.home_project_ledger_total_house_spend"];
      if (totalEntity?.attributes?.currency) {
        this._state.currency = totalEntity.attributes.currency;
      }
      this._state.totalSpend = totalEntity ? parseFloat(totalEntity.state) || 0 : 0;

      try {
        const areaRegistry = await this._hass.callWS({ type: "config/area_registry/list" });
        this._state.areas = {};
        areaRegistry.forEach((area) => {
          this._state.areas[area.area_id] = area.name;
        });
      } catch (e) {
        console.warn("Could not load area registry:", e);
      }

      const states = Object.values(this._hass.states || {});
      const projectSensors = states.filter(
        (s) => s.entity_id.startsWith("sensor.") && s.attributes?.project_id && s.attributes?.project_name
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
            receipts: attrs.receipts || [],
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

    let filteredProjects = this._state.projects;
    if (this._state.activeFilter === "open") filteredProjects = openProjects;
    else if (this._state.activeFilter === "closed") filteredProjects = closedProjects;

    if (this._state.searchQuery) {
      const query = this._state.searchQuery.toLowerCase();
      filteredProjects = filteredProjects.filter((p) => {
        const areaName = p.area_id ? this._state.areas[p.area_id] || "" : "";
        return p.name.toLowerCase().includes(query) || areaName.toLowerCase().includes(query);
      });
    }

    const searchIcon = '<svg class="search-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/></svg>';

    this._container.innerHTML = `
      <h1>Home Project Ledger</h1>
      <div class="statistics">
        <div class="stat-card"><div class="stat-label">Total Spend</div><div class="stat-value">${this._formatCurrency(this._state.totalSpend)}</div></div>
        <div class="stat-card"><div class="stat-label">Open Projects</div><div class="stat-value">${openProjects.length}</div></div>
        <div class="stat-card"><div class="stat-label">Total Projects</div><div class="stat-value">${this._state.projects.length}</div></div>
      </div>
      <div class="card">
        <div class="card-header">
          <h2>Projects</h2>
          <div class="search-container">
            ${searchIcon}
            <input type="text" class="search-input" placeholder="Search projects..." value="${this._escapeHtml(this._state.searchQuery)}"/>
          </div>
          <div class="filter-tabs">
            <button class="filter-tab ${this._state.activeFilter === "all" ? "active" : ""}" data-filter="all">All<span class="count">${this._state.projects.length}</span></button>
            <button class="filter-tab ${this._state.activeFilter === "open" ? "active" : ""}" data-filter="open">Open<span class="count">${openProjects.length}</span></button>
            <button class="filter-tab ${this._state.activeFilter === "closed" ? "active" : ""}" data-filter="closed">Closed<span class="count">${closedProjects.length}</span></button>
          </div>
        </div>
        ${this._state.projects.length === 0 ? this._renderEmptyState() : filteredProjects.length === 0 ? this._renderNoResults() : '<div class="project-list">' + filteredProjects.map((p) => this._renderProjectItem(p)).join("") + '</div>'}
      </div>
      ${this._renderModal()}
    `;

    this._attachEventListeners();
  }

  _renderProjectItem(project) {
    const areaName = project.area_id ? this._state.areas[project.area_id] || "Unknown Area" : "No Area";
    const isOpen = project.status === "open";
    const isExpanded = this._state.expandedProjectId === project.project_id;
    const isMenuOpen = this._state.openMenuId === "project-" + project.project_id;
    
    const icon = isOpen 
      ? '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19,4H18V2H16V4H8V2H6V4H5A2,2 0 0,0 3,6V20A2,2 0 0,0 5,22H19A2,2 0 0,0 21,20V6A2,2 0 0,0 19,4M19,20H5V10H19V20M5,8V6H19V8H5Z"/></svg>'
      : '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M9,10H7V12H9V10M13,10H11V12H13V10M17,10H15V12H17V10M19,3H18V1H16V3H8V1H6V3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V8H19V19Z"/></svg>';
    
    const menuIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"/></svg>';
    const checkIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>';
    const refreshIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M13,3A9,9 0 0,0 4,12H1L4.89,15.89L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3Z"/></svg>';
    const deleteIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/></svg>';
    const chevronIcon = '<svg class="expand-icon ' + (isExpanded ? 'expanded' : '') + '" viewBox="0 0 24 24"><path fill="currentColor" d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>';

    let menuHtml = '';
    if (isMenuOpen) {
      menuHtml = '<div class="menu-dropdown">';
      if (isOpen) {
        menuHtml += '<button class="menu-item" data-action="close-project" data-project-id="' + project.project_id + '">' + checkIcon + 'Close Project</button>';
      } else {
        menuHtml += '<button class="menu-item" data-action="reopen-project" data-project-id="' + project.project_id + '">' + refreshIcon + 'Reopen Project</button>';
      }
      menuHtml += '<button class="menu-item danger" data-action="delete-project" data-project-id="' + project.project_id + '" data-project-name="' + this._escapeHtml(project.name) + '">' + deleteIcon + 'Delete Project</button>';
      menuHtml += '</div>';
    }

    return '<div class="project-wrapper">' +
      '<div class="project-item ' + (isExpanded ? 'expanded' : '') + '" data-project-id="' + project.project_id + '">' +
        '<div class="project-icon ' + project.status + '">' + icon + '</div>' +
        '<div class="project-content">' +
          '<div class="project-name">' + this._escapeHtml(project.name) + '</div>' +
          '<div class="project-meta">' + this._escapeHtml(areaName) + ' &middot; ' + (project.receipts?.length || 0) + ' receipts</div>' +
        '</div>' +
        '<div class="project-spend">' + this._formatCurrency(project.spend) + '</div>' +
        '<span class="project-status-badge ' + project.status + '">' + project.status + '</span>' +
        '<div class="menu-container">' +
          '<button class="menu-btn" data-menu-id="project-' + project.project_id + '">' + menuIcon + '</button>' +
          menuHtml +
        '</div>' +
        chevronIcon +
      '</div>' +
      (isExpanded ? this._renderProjectDetail(project) : '') +
    '</div>';
  }

  _renderProjectDetail(project) {
    const receipts = project.receipts || [];
    const addIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/></svg>';
    
    let receiptsHtml = '';
    if (receipts.length === 0) {
      receiptsHtml = '<div class="empty-receipts">No receipts yet. Click "Add Receipt" to add one.</div>';
    } else {
      receiptsHtml = '<div class="receipt-list">' + receipts.map(r => this._renderReceiptItem(r, project.project_id)).join('') + '</div>';
    }

    return '<div class="project-detail">' +
      '<div class="receipts-header">' +
        '<h4>Receipts</h4>' +
        '<button class="add-btn" data-action="add-receipt" data-project-id="' + project.project_id + '">' + addIcon + 'Add Receipt</button>' +
      '</div>' +
      receiptsHtml +
    '</div>';
  }

  _renderReceiptItem(receipt, projectId) {
    const isMenuOpen = this._state.openMenuId === "receipt-" + receipt.receipt_id;
    const receiptIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M3,22V3H21V22L18,20L15,22L12,20L9,22L6,20L3,22M17,9V7H7V9H17M15,13V11H7V13H15Z"/></svg>';
    const menuIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"/></svg>';
    const editIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"/></svg>';
    const deleteIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/></svg>';

    let menuHtml = '';
    if (isMenuOpen) {
      menuHtml = '<div class="menu-dropdown">' +
        '<button class="menu-item" data-action="edit-receipt" data-receipt-id="' + receipt.receipt_id + '" data-project-id="' + projectId + '">' + editIcon + 'Edit Receipt</button>' +
        '<button class="menu-item danger" data-action="delete-receipt" data-receipt-id="' + receipt.receipt_id + '" data-merchant="' + this._escapeHtml(receipt.merchant || 'this receipt') + '">' + deleteIcon + 'Delete Receipt</button>' +
      '</div>';
    }

    return '<div class="receipt-item">' +
      '<div class="receipt-icon">' + receiptIcon + '</div>' +
      '<div class="receipt-content">' +
        '<div class="receipt-merchant">' + this._escapeHtml(receipt.merchant || 'Unknown') + '</div>' +
        '<div class="receipt-date">' + (receipt.date || 'No date') + '</div>' +
      '</div>' +
      '<div class="receipt-amount">' + this._formatCurrency(receipt.total || 0) + '</div>' +
      '<div class="menu-container">' +
        '<button class="menu-btn" data-menu-id="receipt-' + receipt.receipt_id + '">' + menuIcon + '</button>' +
        menuHtml +
      '</div>' +
    '</div>';
  }

  _renderModal() {
    if (!this._state.modal) return '';
    if (this._state.modal.type === 'receipt') return this._renderReceiptModal();
    if (this._state.modal.type === 'confirm') return this._renderConfirmModal();
    return '';
  }

  _renderReceiptModal() {
    const data = this._state.modal.data || {};
    const isEdit = !!data.receipt_id;
    const title = isEdit ? 'Edit Receipt' : 'Add Receipt';
    const today = new Date().toISOString().split('T')[0];
    const closeIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/></svg>';

    return '<div class="modal-overlay" data-action="close-modal">' +
      '<div class="modal" onclick="event.stopPropagation()">' +
        '<div class="modal-header">' +
          '<h3>' + title + '</h3>' +
          '<button class="modal-close" data-action="close-modal">' + closeIcon + '</button>' +
        '</div>' +
        '<div class="modal-body">' +
          '<div class="form-group"><label>Merchant *</label><input type="text" id="receipt-merchant" value="' + this._escapeHtml(data.merchant || '') + '" placeholder="e.g., IKEA" required></div>' +
          '<div class="form-group"><label>Amount *</label><input type="number" id="receipt-amount" value="' + (data.total || '') + '" placeholder="0.00" step="0.01" min="0" required></div>' +
          '<div class="form-group"><label>Date *</label><input type="date" id="receipt-date" value="' + (data.date || today) + '" required></div>' +
          '<div class="form-group"><label>Category (optional)</label><input type="text" id="receipt-category" value="' + this._escapeHtml(data.category_summary || '') + '" placeholder="e.g., Materials, Tools"></div>' +
        '</div>' +
        '<div class="modal-actions">' +
          '<button class="btn btn-secondary" data-action="close-modal">Cancel</button>' +
          '<button class="btn btn-primary" data-action="save-receipt">' + (isEdit ? 'Save Changes' : 'Add Receipt') + '</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  _renderConfirmModal() {
    const data = this._state.modal.data || {};
    const closeIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/></svg>';
    
    return '<div class="modal-overlay" data-action="close-modal">' +
      '<div class="modal" onclick="event.stopPropagation()">' +
        '<div class="modal-header">' +
          '<h3>' + (data.title || 'Confirm') + '</h3>' +
          '<button class="modal-close" data-action="close-modal">' + closeIcon + '</button>' +
        '</div>' +
        '<div class="modal-body"><p class="confirm-message">' + (data.message || 'Are you sure?') + '</p></div>' +
        '<div class="modal-actions">' +
          '<button class="btn btn-secondary" data-action="close-modal">Cancel</button>' +
          '<button class="btn btn-danger" data-action="confirm-action">Delete</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  _renderEmptyState() {
    const icon = '<svg class="empty-state-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M19,3H14.82C14.4,1.84 13.3,1 12,1C10.7,1 9.6,1.84 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3M7,7H17V5H19V19H5V5H7V7Z"/></svg>';
    return '<div class="empty-state">' + icon + '<h3>No projects yet</h3><p>Use <code>home_project_ledger.create_project</code> in<br/>Developer Tools → Services to create your first project.</p></div>';
  }

  _renderNoResults() {
    return '<div class="no-results">No projects match your search.</div>';
  }

  _attachEventListeners() {
    const searchInput = this._container.querySelector(".search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this._state.searchQuery = e.target.value;
        this._render();
        const newInput = this._container.querySelector(".search-input");
        if (newInput) {
          newInput.focus();
          newInput.setSelectionRange(e.target.selectionStart, e.target.selectionEnd);
        }
      });
    }

    this._container.querySelectorAll(".filter-tab").forEach((tab) => {
      tab.addEventListener("click", (e) => {
        this._state.activeFilter = e.currentTarget.dataset.filter;
        this._render();
      });
    });

    this._container.querySelectorAll(".project-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        if (e.target.closest(".menu-container")) return;
        const projectId = item.dataset.projectId;
        this._state.expandedProjectId = this._state.expandedProjectId === projectId ? null : projectId;
        this._state.openMenuId = null;
        this._render();
      });
    });

    this._container.querySelectorAll(".menu-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const menuId = btn.dataset.menuId;
        this._state.openMenuId = this._state.openMenuId === menuId ? null : menuId;
        this._render();
      });
    });

    this._container.querySelectorAll("[data-action]").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        this._handleAction(el.dataset);
      });
    });
  }

  _handleAction(dataset) {
    const action = dataset.action;
    switch (action) {
      case "close-project":
        this._closeProject(dataset.projectId);
        break;
      case "reopen-project":
        this._reopenProject(dataset.projectId);
        break;
      case "delete-project":
        this._state.modal = {
          type: 'confirm',
          data: {
            title: 'Delete Project',
            message: 'Are you sure you want to delete "' + dataset.projectName + '"? All receipts will also be deleted. This cannot be undone.',
            confirmAction: () => this._deleteProject(dataset.projectId),
          }
        };
        this._state.openMenuId = null;
        this._render();
        break;
      case "add-receipt":
        this._state.modal = { type: 'receipt', data: { project_id: dataset.projectId } };
        this._render();
        break;
      case "edit-receipt":
        const project = this._state.projects.find(p => p.project_id === dataset.projectId);
        const receipt = project?.receipts?.find(r => r.receipt_id === dataset.receiptId);
        if (receipt) {
          this._state.modal = { type: 'receipt', data: { ...receipt, project_id: dataset.projectId } };
        }
        this._state.openMenuId = null;
        this._render();
        break;
      case "delete-receipt":
        this._state.modal = {
          type: 'confirm',
          data: {
            title: 'Delete Receipt',
            message: 'Are you sure you want to delete the receipt from "' + dataset.merchant + '"? This cannot be undone.',
            confirmAction: () => this._deleteReceipt(dataset.receiptId),
          }
        };
        this._state.openMenuId = null;
        this._render();
        break;
      case "save-receipt":
        this._saveReceipt();
        break;
      case "confirm-action":
        if (this._state.modal?.data?.confirmAction) {
          this._state.modal.data.confirmAction();
        }
        this._state.modal = null;
        this._render();
        break;
      case "close-modal":
        this._state.modal = null;
        this._render();
        break;
    }
  }

  async _closeProject(projectId) {
    try {
      await this._hass.callService(DOMAIN, "close_project", { project_id: projectId });
      this._state.openMenuId = null;
      setTimeout(() => this._loadData(), 500);
    } catch (error) {
      console.error("Error closing project:", error);
      alert("Failed to close project: " + error.message);
    }
  }

  async _reopenProject(projectId) {
    try {
      await this._hass.callService(DOMAIN, "reopen_project", { project_id: projectId });
      this._state.openMenuId = null;
      setTimeout(() => this._loadData(), 500);
    } catch (error) {
      console.error("Error reopening project:", error);
      alert("Failed to reopen project: " + error.message);
    }
  }

  async _deleteProject(projectId) {
    try {
      await this._hass.callService(DOMAIN, "delete_project", { project_id: projectId });
      this._state.expandedProjectId = null;
      setTimeout(() => this._loadData(), 500);
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project: " + error.message);
    }
  }

  async _saveReceipt() {
    const data = this._state.modal?.data || {};
    const merchant = this._container.querySelector("#receipt-merchant")?.value;
    const amount = parseFloat(this._container.querySelector("#receipt-amount")?.value);
    const date = this._container.querySelector("#receipt-date")?.value;
    const category = this._container.querySelector("#receipt-category")?.value;

    if (!merchant || isNaN(amount) || !date) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      if (data.receipt_id) {
        await this._hass.callService(DOMAIN, "update_receipt", {
          receipt_id: data.receipt_id,
          merchant,
          total: amount,
          date,
          category_summary: category || undefined,
        });
      } else {
        await this._hass.callService(DOMAIN, "add_receipt", {
          project_id: data.project_id,
          merchant,
          total: amount,
          date,
          currency: this._state.currency,
          category_summary: category || undefined,
        });
      }
      this._state.modal = null;
      setTimeout(() => this._loadData(), 500);
    } catch (error) {
      console.error("Error saving receipt:", error);
      alert("Failed to save receipt: " + error.message);
    }
  }

  async _deleteReceipt(receiptId) {
    try {
      await this._hass.callService(DOMAIN, "delete_receipt", { receipt_id: receiptId });
      setTimeout(() => this._loadData(), 500);
    } catch (error) {
      console.error("Error deleting receipt:", error);
      alert("Failed to delete receipt: " + error.message);
    }
  }

  _formatCurrency(amount) {
    return new Intl.NumberFormat("sv-SE", { style: "currency", currency: this._state.currency }).format(amount);
  }

  _escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text || '';
    return div.innerHTML;
  }
}

customElements.define("home_project_ledger-panel", HomeProjectLedgerPanel);
