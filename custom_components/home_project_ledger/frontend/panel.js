/**
 * Home Project Ledger - Custom Panel for Home Assistant
 * This is a proper web component that integrates with HA's panel system.
 * The sidebar and header remain visible - content renders in the main area only.
 */

const DOMAIN = "home_project_ledger";

// Translations
const TRANSLATIONS = {
  en: {
    // Navigation
    projects: "Projects",
    receipts: "Receipts",
    merchants: "Merchants",
    categories: "Categories",
    
    // Stats
    totalSpend: "Total Spend",
    openProjects: "Open Projects",
    totalProjects: "Total Projects",
    totalReceipts: "Total Receipts",
    totalAmount: "Total Amount",
    uniqueMerchants: "Unique Merchants",
    uniqueCategories: "Unique Categories",
    
    // Actions
    addProject: "Add Project",
    addReceipt: "Add Receipt",
    quickAddReceipt: "Quick Add Receipt",
    editReceipt: "Edit Receipt",
    editProject: "Edit Project",
    newProject: "New Project",
    createProject: "Create Project",
    saveChanges: "Save Changes",
    cancel: "Cancel",
    delete: "Delete",
    closeProject: "Close Project",
    reopenProject: "Reopen Project",
    deleteProject: "Delete Project",
    deleteReceipt: "Delete Receipt",
    confirm: "Confirm",
    
    // Filters
    all: "All",
    open: "Open",
    closed: "Closed",
    
    // Search
    searchProjects: "Search projects...",
    searchReceipts: "Search receipts...",
    searchOrTypeNew: "Search or type new...",
    
    // Form labels
    projectName: "Project Name",
    projectNamePlaceholder: "e.g., Kitchen Renovation",
    areaOptional: "Area (optional)",
    noArea: "No area",
    merchant: "Merchant",
    amount: "Amount",
    date: "Date",
    categoryOptional: "Category (optional)",
    project: "Project",
    selectProject: "Select a project...",
    
    // Hints
    existingMerchants: "{count} existing merchants",
    noMerchantsHint: "No merchants yet - start typing to add",
    existingCategories: "{count} existing categories",
    noCategoriesHint: "No categories yet - start typing to add",
    createNew: "Create \"{name}\"",
    
    // Empty states
    noProjectsYet: "No projects yet",
    noProjectsDesc: "Click the \"Add Project\" button above to create your first project.",
    noProjectsMatch: "No projects match your search.",
    noReceiptsYet: "No receipts yet",
    noReceiptsDesc: "Add receipts to your projects to see them here.",
    noMerchantsYet: "No merchants yet",
    noMerchantsDesc: "Merchants will appear here as you add receipts.",
    noCategoriesYet: "No categories yet",
    noCategoriesDesc: "Categories will appear here as you tag your receipts.",
    noReceiptsInProject: "No receipts yet. Click \"Add Receipt\" to add one.",
    noOpenProjects: "No Open Projects",
    noOpenProjectsDesc: "You need at least one open project to add a receipt to.",
    
    // Misc
    loading: "Loading...",
    receipt: "receipt",
    receiptsPlural: "receipts",
    unknownArea: "Unknown Area",
    unknown: "Unknown",
    noDate: "No date",
    thisReceipt: "this receipt",
    
    // Confirm dialogs
    confirmDeleteProject: "Are you sure you want to delete \"{name}\"? All receipts will also be deleted. This cannot be undone.",
    confirmDeleteReceipt: "Are you sure you want to delete the receipt from \"{merchant}\"? This cannot be undone.",
    areYouSure: "Are you sure?",
    
    // Validation & errors
    pleaseFillRequired: "Please fill in all required fields.",
    pleaseEnterProjectName: "Please enter a project name.",
    pleaseSelectProject: "Please select a project.",
    failedCreateProject: "Failed to create project",
    failedUpdateProject: "Failed to update project",
    failedCloseProject: "Failed to close project",
    failedReopenProject: "Failed to reopen project",
    failedDeleteProject: "Failed to delete project",
    failedSaveReceipt: "Failed to save receipt",
    failedDeleteReceipt: "Failed to delete receipt",
    
    // Photo upload
    receiptPhotos: "Receipt Photos",
    addPhoto: "Add Photo",
    takePhoto: "Take Photo",
    uploadPhoto: "Upload Photo",
    removePhoto: "Remove",
    noPhotosYet: "No photos yet",
    photoHint: "Add photos of your receipt",
    photo: "photo",
    photos: "photos",
    imageLoadError: "Failed to load image",
    imageTooLarge: "Image is too large. Maximum size is 10MB.",
    invalidImageType: "Invalid file type. Please upload an image.",
    viewPhoto: "View Photo",
    closePhoto: "Close",
  },
  sv: {
    // Navigation
    projects: "Projekt",
    receipts: "Kvitton",
    merchants: "Butiker",
    categories: "Kategorier",
    
    // Stats
    totalSpend: "Total kostnad",
    openProjects: "Öppna projekt",
    totalProjects: "Totalt antal projekt",
    totalReceipts: "Totalt antal kvitton",
    totalAmount: "Total summa",
    uniqueMerchants: "Unika butiker",
    uniqueCategories: "Unika kategorier",
    
    // Actions
    addProject: "Lägg till projekt",
    addReceipt: "Lägg till kvitto",
    quickAddReceipt: "Snabblägg kvitto",
    editReceipt: "Redigera kvitto",
    editProject: "Redigera projekt",
    newProject: "Nytt projekt",
    createProject: "Skapa projekt",
    saveChanges: "Spara ändringar",
    cancel: "Avbryt",
    delete: "Radera",
    closeProject: "Stäng projekt",
    reopenProject: "Öppna igen",
    deleteProject: "Radera projekt",
    deleteReceipt: "Radera kvitto",
    confirm: "Bekräfta",
    
    // Filters
    all: "Alla",
    open: "Öppna",
    closed: "Stängda",
    
    // Search
    searchProjects: "Sök projekt...",
    searchReceipts: "Sök kvitton...",
    searchOrTypeNew: "Sök eller skriv nytt...",
    
    // Form labels
    projectName: "Projektnamn",
    projectNamePlaceholder: "t.ex. Köksrenovering",
    areaOptional: "Område (valfritt)",
    noArea: "Inget område",
    merchant: "Butik",
    amount: "Belopp",
    date: "Datum",
    categoryOptional: "Kategori (valfritt)",
    project: "Projekt",
    selectProject: "Välj ett projekt...",
    
    // Hints
    existingMerchants: "{count} befintliga butiker",
    noMerchantsHint: "Inga butiker än - börja skriv för att lägga till",
    existingCategories: "{count} befintliga kategorier",
    noCategoriesHint: "Inga kategorier än - börja skriv för att lägga till",
    createNew: "Skapa \"{name}\"",
    
    // Empty states
    noProjectsYet: "Inga projekt än",
    noProjectsDesc: "Klicka på \"Lägg till projekt\" ovan för att skapa ditt första projekt.",
    noProjectsMatch: "Inga projekt matchar din sökning.",
    noReceiptsYet: "Inga kvitton än",
    noReceiptsDesc: "Lägg till kvitton i dina projekt för att se dem här.",
    noMerchantsYet: "Inga butiker än",
    noMerchantsDesc: "Butiker visas här när du lägger till kvitton.",
    noCategoriesYet: "Inga kategorier än",
    noCategoriesDesc: "Kategorier visas här när du taggar dina kvitton.",
    noReceiptsInProject: "Inga kvitton än. Klicka på \"Lägg till kvitto\" för att lägga till ett.",
    noOpenProjects: "Inga öppna projekt",
    noOpenProjectsDesc: "Du behöver minst ett öppet projekt för att lägga till ett kvitto.",
    
    // Misc
    loading: "Laddar...",
    receipt: "kvitto",
    receiptsPlural: "kvitton",
    unknownArea: "Okänt område",
    unknown: "Okänd",
    noDate: "Inget datum",
    thisReceipt: "detta kvitto",
    
    // Confirm dialogs
    confirmDeleteProject: "Är du säker på att du vill radera \"{name}\"? Alla kvitton kommer också att raderas. Detta kan inte ångras.",
    confirmDeleteReceipt: "Är du säker på att du vill radera kvittot från \"{merchant}\"? Detta kan inte ångras.",
    areYouSure: "Är du säker?",
    
    // Validation & errors
    pleaseFillRequired: "Vänligen fyll i alla obligatoriska fält.",
    pleaseEnterProjectName: "Vänligen ange ett projektnamn.",
    pleaseSelectProject: "Vänligen välj ett projekt.",
    failedCreateProject: "Kunde inte skapa projekt",
    failedUpdateProject: "Kunde inte uppdatera projekt",
    failedCloseProject: "Kunde inte stänga projekt",
    failedReopenProject: "Kunde inte öppna projekt igen",
    failedDeleteProject: "Kunde inte radera projekt",
    failedSaveReceipt: "Kunde inte spara kvitto",
    failedDeleteReceipt: "Kunde inte radera kvitto",
    
    // Photo upload
    receiptPhotos: "Kvittofoton",
    addPhoto: "Lägg till foto",
    takePhoto: "Ta foto",
    uploadPhoto: "Ladda upp foto",
    removePhoto: "Ta bort",
    noPhotosYet: "Inga foton än",
    photoHint: "Lägg till foton av ditt kvitto",
    photo: "foto",
    photos: "foton",
    imageLoadError: "Kunde inte ladda bild",
    imageTooLarge: "Bilden är för stor. Maxstorlek är 10MB.",
    invalidImageType: "Ogiltig filtyp. Ladda upp en bild.",
    viewPhoto: "Visa foto",
    closePhoto: "Stäng",
  }
};

class HomeProjectLedgerPanel extends HTMLElement {
  constructor() {
    super();
    this._hass = null;
    this._narrow = false;
    this._panel = null;
    this._lang = "en";
    this._state = {
      projects: [],
      receipts: [],
      areas: {},
      currency: "SEK",
      totalSpend: 0,
      searchQuery: "",
      activeFilter: "all",
      activeTab: "projects",
      expandedProjectId: null,
      openMenuId: null,
      modal: null,
      pendingPhotos: [], // For new photos being added to a receipt {dataUrl, file}
      photoViewerIndex: -1, // For viewing photos in fullscreen
    };
    this._initialized = false;
  }

  // Get translated string
  _t(key, replacements = {}) {
    const translations = TRANSLATIONS[this._lang] || TRANSLATIONS.en;
    let text = translations[key] || TRANSLATIONS.en[key] || key;
    
    // Replace placeholders like {name} with values
    Object.entries(replacements).forEach(([k, v]) => {
      text = text.replace(new RegExp('\\{' + k + '\\}', 'g'), v);
    });
    
    return text;
  }

  set hass(hass) {
    this._hass = hass;
    
    // Detect language from Home Assistant
    const haLang = hass?.language || hass?.locale?.language || "en";
    this._lang = haLang.startsWith("sv") ? "sv" : "en";
    
    if (!this._initialized) {
      this._initialize();
    } else if (!this._state.modal) {
      // Only refresh when no modal is open (to preserve form inputs)
      // HA calls this setter whenever state changes, so this handles live updates
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
    // No timer needed - Home Assistant pushes state updates via the hass setter
    document.addEventListener("click", this._handleDocumentClick.bind(this));
  }

  disconnectedCallback() {
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
          background-color: var(--primary-background-color, #fafafa);
          min-height: 100%;
          box-sizing: border-box;
          padding-bottom: 72px; /* Space for bottom nav on mobile */
        }
        @media (min-width: 768px) {
          :host { padding-bottom: 16px; }
        }
        
        /* Mobile App Bar */
        .mobile-app-bar { display: flex; align-items: center; padding: 8px 8px 8px 4px; background-color: var(--app-header-background-color, var(--primary-color, #03a9f4)); color: var(--app-header-text-color, white); position: sticky; top: 0; z-index: 101; }
        .mobile-app-bar .menu-icon-btn { width: 48px; height: 48px; border: none; background: none; color: inherit; cursor: pointer; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
        .mobile-app-bar .menu-icon-btn:hover { background-color: rgba(255,255,255,0.1); }
        .mobile-app-bar .menu-icon-btn svg { width: 24px; height: 24px; }
        .mobile-app-bar .app-title { font-size: 20px; font-weight: 400; margin-left: 4px; }
        @media (min-width: 768px) {
          .mobile-app-bar { display: none; }
        }
        
        .main-content { padding: 16px; }
        .container { max-width: 1200px; margin: 0 auto; }
        
        /* Main Navigation Tabs */
        .main-nav { display: flex; background-color: var(--card-background-color, #fff); border-top: 1px solid var(--divider-color, #e0e0e0); position: fixed; bottom: 0; left: 0; right: 0; z-index: 100; box-shadow: 0 -2px 8px rgba(0,0,0,0.1); }
        @media (min-width: 768px) {
          .main-nav { position: static; border-top: none; border-bottom: 1px solid var(--divider-color, #e0e0e0); box-shadow: none; margin-bottom: 16px; background-color: transparent; justify-content: center; gap: 8px; }
        }
        .main-nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 8px 4px; border: none; background: none; color: var(--secondary-text-color, #757575); cursor: pointer; font-size: 11px; font-weight: 500; gap: 4px; transition: color 0.2s; }
        @media (min-width: 768px) {
          .main-nav-item { flex: none; flex-direction: row; padding: 12px 24px; font-size: 14px; border-radius: 8px 8px 0 0; gap: 8px; }
        }
        .main-nav-item:hover { color: var(--primary-text-color, #212121); }
        .main-nav-item.active { color: var(--primary-color, #03a9f4); }
        @media (min-width: 768px) {
          .main-nav-item.active { background-color: var(--card-background-color, #fff); box-shadow: 0 -2px 4px rgba(0,0,0,0.05); }
        }
        .main-nav-item svg { width: 24px; height: 24px; }
        @media (min-width: 768px) {
          .main-nav-item svg { width: 20px; height: 20px; }
        }
        .main-nav-item .nav-label { white-space: nowrap; }
        .main-nav-item .nav-badge { background-color: var(--secondary-background-color, #f5f5f5); padding: 2px 6px; border-radius: 10px; font-size: 10px; margin-left: 4px; }
        .main-nav-item.active .nav-badge { background-color: var(--primary-color, #03a9f4); color: white; }
        @media (min-width: 768px) {
          .main-nav-item .nav-badge { font-size: 11px; }
        }
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .page-header h1 { font-size: 28px; font-weight: 400; margin: 0; color: var(--primary-text-color, #212121); }
        .add-project-btn { display: flex; align-items: center; gap: 8px; padding: 10px 20px; border: none; background-color: var(--primary-color, #03a9f4); color: white; border-radius: 24px; font-size: 14px; font-weight: 500; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .add-project-btn:hover { opacity: 0.9; box-shadow: 0 4px 8px rgba(0,0,0,0.15); }
        .add-project-btn svg { width: 20px; height: 20px; }
        h1 { font-size: 28px; font-weight: 400; margin: 0 0 24px 0; color: var(--primary-text-color, #212121); }
        .statistics { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; margin-bottom: 24px; }
        .stat-card { background-color: var(--card-background-color, #fff); border-radius: var(--ha-card-border-radius, 12px); padding: 16px; box-shadow: var(--ha-card-box-shadow, 0 2px 2px rgba(0,0,0,0.1)); }
        .stat-label { font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; color: var(--secondary-text-color, #757575); margin-bottom: 4px; }
        .stat-value { font-size: 24px; font-weight: 400; color: var(--primary-text-color, #212121); }
        .card { background-color: var(--card-background-color, #fff); border-radius: var(--ha-card-border-radius, 12px); box-shadow: var(--ha-card-box-shadow, 0 2px 2px rgba(0,0,0,0.1)); overflow: visible; }
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
        .menu-dropdown { position: fixed; background-color: var(--card-background-color, #fff); border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); min-width: 160px; z-index: 1000; overflow: hidden; }
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
        .autocomplete-container { position: relative; }
        .autocomplete-input { width: 100%; padding: 12px 12px 12px 35px !important; border: 1px solid var(--divider-color, #e0e0e0); border-radius: 8px; font-size: 14px; background-color: var(--card-background-color, #fff); color: var(--primary-text-color, #212121); box-sizing: border-box; }
        .autocomplete-input:focus { outline: none; border-color: var(--primary-color, #03a9f4); }
        .autocomplete-search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; color: var(--secondary-text-color, #757575); pointer-events: none; }
        .autocomplete-input:focus + .autocomplete-search-icon { color: var(--primary-color, #03a9f4); }
        .autocomplete-dropdown { position: absolute; top: 100%; left: 0; right: 0; background-color: var(--card-background-color, #fff); border: 1px solid var(--divider-color, #e0e0e0); border-top: none; border-radius: 0 0 8px 8px; max-height: 200px; overflow-y: auto; z-index: 1001; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
        .autocomplete-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; cursor: pointer; font-size: 14px; color: var(--primary-text-color, #212121); }
        .autocomplete-item:hover, .autocomplete-item.highlighted { background-color: var(--secondary-background-color, #f5f5f5); }
        .autocomplete-item svg { width: 18px; height: 18px; flex-shrink: 0; color: var(--secondary-text-color, #757575); }
        .autocomplete-item.create-new { border-top: 1px solid var(--divider-color, #e0e0e0); color: var(--primary-color, #03a9f4); font-weight: 500; }
        .autocomplete-item.create-new svg { color: var(--primary-color, #03a9f4); }
        .autocomplete-match { font-weight: 500; }
        .tag-hint { font-size: 11px; color: var(--secondary-text-color, #757575); margin-top: 4px; }
        
        /* Tab content areas */
        .tab-content { display: none; }
        .tab-content.active { display: block; }
        
        /* Generic list items for receipts/merchants/categories */
        .list-item { display: flex; align-items: center; padding: 12px 16px; border-bottom: 1px solid var(--divider-color, #e0e0e0); cursor: pointer; transition: background-color 0.1s; }
        .list-item:last-child { border-bottom: none; }
        .list-item:hover { background-color: var(--secondary-background-color, #f5f5f5); }
        .list-item-icon { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 16px; flex-shrink: 0; background-color: var(--secondary-background-color, #f5f5f5); color: var(--secondary-text-color, #757575); }
        .list-item-icon svg { width: 24px; height: 24px; }
        .list-item-content { flex: 1; min-width: 0; }
        .list-item-title { font-size: 16px; font-weight: 400; color: var(--primary-text-color, #212121); margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .list-item-subtitle { font-size: 14px; color: var(--secondary-text-color, #757575); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .list-item-value { font-size: 16px; font-weight: 500; color: var(--primary-text-color, #212121); margin-left: 16px; flex-shrink: 0; }
        .list-item-badge { padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 500; margin-left: 12px; flex-shrink: 0; background-color: var(--secondary-background-color, #f5f5f5); color: var(--secondary-text-color, #757575); }
        
        /* Coming soon placeholder */
        .coming-soon { text-align: center; padding: 64px 24px; color: var(--secondary-text-color, #757575); }
        .coming-soon-icon { width: 80px; height: 80px; margin: 0 auto 24px; color: var(--disabled-color, #bdbdbd); }
        .coming-soon h3 { font-size: 20px; font-weight: 500; margin: 0 0 8px 0; color: var(--primary-text-color, #212121); }
        .coming-soon p { margin: 0; font-size: 14px; line-height: 1.6; max-width: 400px; margin: 0 auto; }
        
        /* Floating Action Button */
        .fab { position: fixed; right: 24px; bottom: 88px; width: 56px; height: 56px; border-radius: 50%; border: none; background-color: var(--primary-color, #03a9f4); color: white; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; z-index: 50; transition: transform 0.2s, box-shadow 0.2s; }
        .fab:hover { transform: scale(1.05); box-shadow: 0 6px 16px rgba(0,0,0,0.35); }
        .fab:active { transform: scale(0.95); }
        .fab svg { width: 28px; height: 28px; }
        @media (min-width: 768px) {
          .fab { bottom: 32px; right: 32px; }
        }
        
        /* Photo upload section */
        .photo-section { margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--divider-color, #e0e0e0); }
        .photo-section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .photo-section-title { font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; color: var(--secondary-text-color, #757575); }
        .photo-buttons { display: flex; gap: 8px; }
        .photo-btn { display: flex; align-items: center; gap: 6px; padding: 8px 12px; border: 1px solid var(--divider-color, #e0e0e0); background: var(--card-background-color, #fff); border-radius: 8px; font-size: 13px; color: var(--primary-text-color, #212121); cursor: pointer; transition: all 0.2s; }
        .photo-btn:hover { border-color: var(--primary-color, #03a9f4); background-color: var(--secondary-background-color, #f5f5f5); }
        .photo-btn svg { width: 18px; height: 18px; color: var(--secondary-text-color, #757575); }
        .photo-btn:hover svg { color: var(--primary-color, #03a9f4); }
        .photo-input { display: none; }
        .photo-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 8px; margin-top: 12px; }
        .photo-thumb { position: relative; aspect-ratio: 1; border-radius: 8px; overflow: hidden; background-color: var(--secondary-background-color, #f5f5f5); cursor: pointer; }
        .photo-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .photo-thumb-remove { position: absolute; top: 4px; right: 4px; width: 24px; height: 24px; border-radius: 50%; border: none; background-color: rgba(0,0,0,0.6); color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s; }
        .photo-thumb:hover .photo-thumb-remove { opacity: 1; }
        .photo-thumb-remove svg { width: 16px; height: 16px; }
        .photo-empty { text-align: center; padding: 24px; background-color: var(--secondary-background-color, #f5f5f5); border-radius: 8px; color: var(--secondary-text-color, #757575); }
        .photo-empty svg { width: 32px; height: 32px; margin-bottom: 8px; color: var(--disabled-color, #bdbdbd); }
        .photo-empty-text { font-size: 13px; }
        .photo-indicator { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; color: var(--secondary-text-color, #757575); margin-left: 8px; }
        .photo-indicator svg { width: 14px; height: 14px; }
        
        /* Photo viewer modal */
        .photo-viewer { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0,0,0,0.9); display: flex; align-items: center; justify-content: center; z-index: 1100; }
        .photo-viewer-close { position: absolute; top: 16px; right: 16px; width: 40px; height: 40px; border-radius: 50%; border: none; background-color: rgba(255,255,255,0.2); color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .photo-viewer-close:hover { background-color: rgba(255,255,255,0.3); }
        .photo-viewer-close svg { width: 24px; height: 24px; }
        .photo-viewer img { max-width: 90%; max-height: 90%; object-fit: contain; }
        .photo-viewer-nav { position: absolute; top: 50%; transform: translateY(-50%); width: 48px; height: 48px; border-radius: 50%; border: none; background-color: rgba(255,255,255,0.2); color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .photo-viewer-nav:hover { background-color: rgba(255,255,255,0.3); }
        .photo-viewer-nav.prev { left: 16px; }
        .photo-viewer-nav.next { right: 16px; }
        .photo-viewer-nav svg { width: 24px; height: 24px; }
      </style>
      <div class="container">
        <div class="loading">${TRANSLATIONS[this._lang]?.loading || 'Loading...'}</div>
      </div>
    `;

    this._container = this.querySelector(".container");
    this._loadData();
  }

  async _loadData() {
    if (!this._hass) return;

    try {
      // Find total house spend sensor - try multiple possible entity IDs
      const possibleIds = [
        "sensor.total_house_spend",
        "sensor.home_project_ledger_total_house_spend",
      ];
      
      let totalEntity = null;
      for (const entityId of possibleIds) {
        if (this._hass.states[entityId]) {
          totalEntity = this._hass.states[entityId];
          break;
        }
      }
      
      // Fallback: search all sensors for one with "total" and "house" and "spend" in the name
      if (!totalEntity) {
        const states = Object.values(this._hass.states || {});
        totalEntity = states.find(
          (s) => s.entity_id.startsWith("sensor.") && 
                 s.entity_id.includes("total") && 
                 s.entity_id.includes("house") && 
                 s.entity_id.includes("spend")
        );
      }
      
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

    // Collect all receipts from all projects
    const allReceipts = [];
    this._state.projects.forEach(p => {
      (p.receipts || []).forEach(r => {
        allReceipts.push({ ...r, project_id: p.project_id, project_name: p.name });
      });
    });

    // Collect merchants with totals
    const merchantMap = new Map();
    allReceipts.forEach(r => {
      if (r.merchant) {
        const existing = merchantMap.get(r.merchant) || { name: r.merchant, total: 0, count: 0 };
        existing.total += r.total || 0;
        existing.count += 1;
        merchantMap.set(r.merchant, existing);
      }
    });
    const merchants = Array.from(merchantMap.values()).sort((a, b) => b.total - a.total);

    // Collect categories with totals
    const categoryMap = new Map();
    allReceipts.forEach(r => {
      if (r.category_summary) {
        r.category_summary.split(',').forEach(cat => {
          const name = cat.trim();
          if (name) {
            const existing = categoryMap.get(name) || { name, total: 0, count: 0 };
            existing.total += r.total || 0;
            existing.count += 1;
            categoryMap.set(name, existing);
          }
        });
      }
    });
    const categories = Array.from(categoryMap.values()).sort((a, b) => b.total - a.total);

    const openProjects = this._state.projects.filter((p) => p.status === "open");
    const closedProjects = this._state.projects.filter((p) => p.status === "closed");

    // Navigation icons
    const projectsIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19,3H14.82C14.4,1.84 13.3,1 12,1C10.7,1 9.6,1.84 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3"/></svg>';
    const receiptsIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M3,22V3H21V22L18,20L15,22L12,20L9,22L6,20L3,22M17,9V7H7V9H17M15,13V11H7V13H15M13,17V15H7V17H13Z"/></svg>';
    const merchantsIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M18.36,9L18.96,12H5.04L5.64,9H18.36M20,4H4V6H20V4M20,7H4L3,12V14H4V20H14V14H18V20H20V14H21V12L20,7M6,18V14H12V18H6Z"/></svg>';
    const categoriesIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12L14.25,12L12,7.39L9.75,12L4,12A8,8 0 0,1 12,4Z"/></svg>';

    this._container.innerHTML = `
      ${this._renderMobileAppBar()}
      ${this._renderMainNav(projectsIcon, receiptsIcon, merchantsIcon, categoriesIcon, allReceipts.length, merchants.length, categories.length)}
      <div class="main-content">
        <div class="container">
          ${this._state.activeTab === 'projects' ? this._renderProjectsTab(openProjects, closedProjects) : ''}
          ${this._state.activeTab === 'receipts' ? this._renderReceiptsTab(allReceipts) : ''}
          ${this._state.activeTab === 'merchants' ? this._renderMerchantsTab(merchants) : ''}
          ${this._state.activeTab === 'categories' ? this._renderCategoriesTab(categories) : ''}
        </div>
      </div>
      ${this._renderFAB()}
      ${this._renderModal()}
      ${this._renderPhotoViewer()}
    `;

    this._attachEventListeners();
  }

  _renderMobileAppBar() {
    const menuIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"/></svg>';
    return '<div class="mobile-app-bar">' +
      '<button class="menu-icon-btn" data-action="toggle-sidebar" aria-label="Menu">' + menuIcon + '</button>' +
      '<span class="app-title">Project Ledger</span>' +
    '</div>';
  }

  _renderMainNav(projectsIcon, receiptsIcon, merchantsIcon, categoriesIcon, receiptsCount, merchantsCount, categoriesCount) {
    const isProjects = this._state.activeTab === 'projects';
    const isReceipts = this._state.activeTab === 'receipts';
    const isMerchants = this._state.activeTab === 'merchants';
    const isCategories = this._state.activeTab === 'categories';

    return '<nav class="main-nav">' +
      '<button class="main-nav-item ' + (isProjects ? 'active' : '') + '" data-tab="projects">' + projectsIcon + '<span class="nav-label">' + this._t('projects') + '<span class="nav-badge">' + this._state.projects.length + '</span></span></button>' +
      '<button class="main-nav-item ' + (isReceipts ? 'active' : '') + '" data-tab="receipts">' + receiptsIcon + '<span class="nav-label">' + this._t('receipts') + '<span class="nav-badge">' + receiptsCount + '</span></span></button>' +
      '<button class="main-nav-item ' + (isMerchants ? 'active' : '') + '" data-tab="merchants">' + merchantsIcon + '<span class="nav-label">' + this._t('merchants') + '<span class="nav-badge">' + merchantsCount + '</span></span></button>' +
      '<button class="main-nav-item ' + (isCategories ? 'active' : '') + '" data-tab="categories">' + categoriesIcon + '<span class="nav-label">' + this._t('categories') + '<span class="nav-badge">' + categoriesCount + '</span></span></button>' +
    '</nav>';
  }

  _renderFAB() {
    const addIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/></svg>';
    return '<button class="fab" data-action="quick-add-receipt" title="' + this._t('quickAddReceipt') + '">' + addIcon + '</button>';
  }

  _renderProjectsTab(openProjects, closedProjects) {
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
    const addIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/></svg>';

    return '<div class="page-header">' +
        '<h1>' + this._t('projects') + '</h1>' +
        '<button class="add-project-btn" data-action="add-project">' + addIcon + ' ' + this._t('addProject') + '</button>' +
      '</div>' +
      '<div class="statistics">' +
        '<div class="stat-card"><div class="stat-label">' + this._t('totalSpend') + '</div><div class="stat-value">' + this._formatCurrency(this._state.totalSpend) + '</div></div>' +
        '<div class="stat-card"><div class="stat-label">' + this._t('openProjects') + '</div><div class="stat-value">' + openProjects.length + '</div></div>' +
        '<div class="stat-card"><div class="stat-label">' + this._t('totalProjects') + '</div><div class="stat-value">' + this._state.projects.length + '</div></div>' +
      '</div>' +
      '<div class="card">' +
        '<div class="card-header">' +
          '<div class="search-container">' + searchIcon +
            '<input type="text" class="search-input" placeholder="' + this._t('searchProjects') + '" value="' + this._escapeHtml(this._state.searchQuery) + '"/>' +
          '</div>' +
          '<div class="filter-tabs">' +
            '<button class="filter-tab ' + (this._state.activeFilter === "all" ? "active" : "") + '" data-filter="all">' + this._t('all') + '<span class="count">' + this._state.projects.length + '</span></button>' +
            '<button class="filter-tab ' + (this._state.activeFilter === "open" ? "active" : "") + '" data-filter="open">' + this._t('open') + '<span class="count">' + openProjects.length + '</span></button>' +
            '<button class="filter-tab ' + (this._state.activeFilter === "closed" ? "active" : "") + '" data-filter="closed">' + this._t('closed') + '<span class="count">' + closedProjects.length + '</span></button>' +
          '</div>' +
        '</div>' +
        (this._state.projects.length === 0 ? this._renderEmptyState() : filteredProjects.length === 0 ? this._renderNoResults() : '<div class="project-list">' + filteredProjects.map((p) => this._renderProjectItem(p)).join("") + '</div>') +
      '</div>';
  }

  _renderReceiptsTab(allReceipts) {
    const searchIcon = '<svg class="search-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/></svg>';
    const receiptIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M3,22V3H21V22L18,20L15,22L12,20L9,22L6,20L3,22M17,9V7H7V9H17M15,13V11H7V13H15Z"/></svg>';
    const cameraIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z"/></svg>';

    // Sort receipts by date (newest first)
    const sortedReceipts = [...allReceipts].sort((a, b) => (b.date || '').localeCompare(a.date || ''));

    const total = sortedReceipts.reduce((sum, r) => sum + (r.total || 0), 0);

    let receiptsList = '';
    if (sortedReceipts.length === 0) {
      receiptsList = '<div class="empty-state"><h3>' + this._t('noReceiptsYet') + '</h3><p>' + this._t('noReceiptsDesc') + '</p></div>';
    } else {
      receiptsList = '<div class="project-list">' + sortedReceipts.map(r => {
        const photoCount = (r.image_paths || []).length;
        const photoIndicator = photoCount > 0 
          ? '<span class="photo-indicator">' + cameraIcon + photoCount + '</span>'
          : '';
        return '<div class="list-item">' +
          '<div class="list-item-icon">' + receiptIcon + '</div>' +
          '<div class="list-item-content">' +
            '<div class="list-item-title">' + this._escapeHtml(r.merchant || this._t('unknown')) + photoIndicator + '</div>' +
            '<div class="list-item-subtitle">' + (r.date || this._t('noDate')) + ' · ' + this._escapeHtml(r.project_name) + (r.category_summary ? ' · ' + this._escapeHtml(r.category_summary) : '') + '</div>' +
          '</div>' +
          '<div class="list-item-value">' + this._formatCurrency(r.total || 0) + '</div>' +
        '</div>';
      }).join('') + '</div>';
    }

    return '<div class="page-header"><h1>' + this._t('receipts') + '</h1></div>' +
      '<div class="statistics">' +
        '<div class="stat-card"><div class="stat-label">' + this._t('totalReceipts') + '</div><div class="stat-value">' + sortedReceipts.length + '</div></div>' +
        '<div class="stat-card"><div class="stat-label">' + this._t('totalAmount') + '</div><div class="stat-value">' + this._formatCurrency(total) + '</div></div>' +
      '</div>' +
      '<div class="card">' +
        '<div class="card-header">' +
          '<div class="search-container">' + searchIcon +
            '<input type="text" class="search-input" id="receipts-search" placeholder="' + this._t('searchReceipts') + '" value=""/>' +
          '</div>' +
        '</div>' +
        receiptsList +
      '</div>';
  }

  _renderMerchantsTab(merchants) {
    const storeIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M18.36,9L18.96,12H5.04L5.64,9H18.36M20,4H4V6H20V4M20,7H4L3,12V14H4V20H14V14H18V20H20V14H21V12L20,7M6,18V14H12V18H6Z"/></svg>';

    const total = merchants.reduce((sum, m) => sum + m.total, 0);

    let merchantsList = '';
    if (merchants.length === 0) {
      merchantsList = '<div class="empty-state"><h3>' + this._t('noMerchantsYet') + '</h3><p>' + this._t('noMerchantsDesc') + '</p></div>';
    } else {
      const receiptText = (count) => count === 1 ? this._t('receipt') : this._t('receiptsPlural');
      merchantsList = '<div class="project-list">' + merchants.map(m => 
        '<div class="list-item">' +
          '<div class="list-item-icon">' + storeIcon + '</div>' +
          '<div class="list-item-content">' +
            '<div class="list-item-title">' + this._escapeHtml(m.name) + '</div>' +
            '<div class="list-item-subtitle">' + m.count + ' ' + receiptText(m.count) + '</div>' +
          '</div>' +
          '<div class="list-item-value">' + this._formatCurrency(m.total) + '</div>' +
        '</div>'
      ).join('') + '</div>';
    }

    return '<div class="page-header"><h1>' + this._t('merchants') + '</h1></div>' +
      '<div class="statistics">' +
        '<div class="stat-card"><div class="stat-label">' + this._t('uniqueMerchants') + '</div><div class="stat-value">' + merchants.length + '</div></div>' +
        '<div class="stat-card"><div class="stat-label">' + this._t('totalSpend') + '</div><div class="stat-value">' + this._formatCurrency(total) + '</div></div>' +
      '</div>' +
      '<div class="card">' + merchantsList + '</div>';
  }

  _renderCategoriesTab(categories) {
    const tagIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M5.5,7A1.5,1.5 0 0,1 4,5.5A1.5,1.5 0 0,1 5.5,4A1.5,1.5 0 0,1 7,5.5A1.5,1.5 0 0,1 5.5,7M21.41,11.58L12.41,2.58C12.05,2.22 11.55,2 11,2H4C2.89,2 2,2.89 2,4V11C2,11.55 2.22,12.05 2.59,12.41L11.58,21.41C11.95,21.77 12.45,22 13,22C13.55,22 14.05,21.77 14.41,21.41L21.41,14.41C21.78,14.05 22,13.55 22,13C22,12.44 21.77,11.94 21.41,11.58Z"/></svg>';

    const total = categories.reduce((sum, c) => sum + c.total, 0);

    const receiptText = (count) => count === 1 ? this._t('receipt') : this._t('receiptsPlural');
    let categoriesList = '';
    if (categories.length === 0) {
      categoriesList = '<div class="empty-state"><h3>' + this._t('noCategoriesYet') + '</h3><p>' + this._t('noCategoriesDesc') + '</p></div>';
    } else {
      categoriesList = '<div class="project-list">' + categories.map(c => 
        '<div class="list-item">' +
          '<div class="list-item-icon">' + tagIcon + '</div>' +
          '<div class="list-item-content">' +
            '<div class="list-item-title">' + this._escapeHtml(c.name) + '</div>' +
            '<div class="list-item-subtitle">' + c.count + ' ' + receiptText(c.count) + '</div>' +
          '</div>' +
          '<div class="list-item-value">' + this._formatCurrency(c.total) + '</div>' +
        '</div>'
      ).join('') + '</div>';
    }

    return '<div class="page-header"><h1>' + this._t('categories') + '</h1></div>' +
      '<div class="statistics">' +
        '<div class="stat-card"><div class="stat-label">' + this._t('uniqueCategories') + '</div><div class="stat-value">' + categories.length + '</div></div>' +
        '<div class="stat-card"><div class="stat-label">' + this._t('totalSpend') + '</div><div class="stat-value">' + this._formatCurrency(total) + '</div></div>' +
      '</div>' +
      '<div class="card">' + categoriesList + '</div>';
  }

  _renderProjectItem(project) {
    const areaName = project.area_id ? this._state.areas[project.area_id] || this._t('unknownArea') : this._t('noArea');
    const isOpen = project.status === "open";
    const isExpanded = this._state.expandedProjectId === project.project_id;
    const isMenuOpen = this._state.openMenuId === "project-" + project.project_id;
    
    const icon = isOpen 
      ? '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19,4H18V2H16V4H8V2H6V4H5A2,2 0 0,0 3,6V20A2,2 0 0,0 5,22H19A2,2 0 0,0 21,20V6A2,2 0 0,0 19,4M19,20H5V10H19V20M5,8V6H19V8H5Z"/></svg>'
      : '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M9,10H7V12H9V10M13,10H11V12H13V10M17,10H15V12H17V10M19,3H18V1H16V3H8V1H6V3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V8H19V19Z"/></svg>';
    
    const menuIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"/></svg>';
    const editIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"/></svg>';
    const checkIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>';
    const refreshIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M13,3A9,9 0 0,0 4,12H1L4.89,15.89L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3Z"/></svg>';
    const deleteIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/></svg>';
    const chevronIcon = '<svg class="expand-icon ' + (isExpanded ? 'expanded' : '') + '" viewBox="0 0 24 24"><path fill="currentColor" d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>';

    let menuHtml = '';
    if (isMenuOpen) {
      const pos = this._state.menuPosition || { top: 0, right: 0 };
      menuHtml = '<div class="menu-dropdown" style="top: ' + pos.top + 'px; right: ' + pos.right + 'px;">';
      menuHtml += '<button class="menu-item" data-action="edit-project" data-project-id="' + project.project_id + '">' + editIcon + this._t('editProject') + '</button>';
      if (isOpen) {
        menuHtml += '<button class="menu-item" data-action="close-project" data-project-id="' + project.project_id + '">' + checkIcon + this._t('closeProject') + '</button>';
      } else {
        menuHtml += '<button class="menu-item" data-action="reopen-project" data-project-id="' + project.project_id + '">' + refreshIcon + this._t('reopenProject') + '</button>';
      }
      menuHtml += '<button class="menu-item danger" data-action="delete-project" data-project-id="' + project.project_id + '" data-project-name="' + this._escapeHtml(project.name) + '">' + deleteIcon + this._t('deleteProject') + '</button>';
      menuHtml += '</div>';
    }

    const receiptText = (count) => count === 1 ? this._t('receipt') : this._t('receiptsPlural');
    return '<div class="project-wrapper">' +
      '<div class="project-item ' + (isExpanded ? 'expanded' : '') + '" data-project-id="' + project.project_id + '">' +
        '<div class="project-icon ' + project.status + '">' + icon + '</div>' +
        '<div class="project-content">' +
          '<div class="project-name">' + this._escapeHtml(project.name) + '</div>' +
          '<div class="project-meta">' + this._escapeHtml(areaName) + ' &middot; ' + (project.receipts?.length || 0) + ' ' + receiptText(project.receipts?.length || 0) + '</div>' +
        '</div>' +
        '<div class="project-spend">' + this._formatCurrency(project.spend) + '</div>' +
        '<span class="project-status-badge ' + project.status + '">' + (isOpen ? this._t('open') : this._t('closed')) + '</span>' +
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
      receiptsHtml = '<div class="empty-receipts">' + this._t('noReceiptsInProject') + '</div>';
    } else {
      receiptsHtml = '<div class="receipt-list">' + receipts.map(r => this._renderReceiptItem(r, project.project_id)).join('') + '</div>';
    }

    return '<div class="project-detail">' +
      '<div class="receipts-header">' +
        '<h4>' + this._t('receipts') + '</h4>' +
        '<button class="add-btn" data-action="add-receipt" data-project-id="' + project.project_id + '">' + addIcon + this._t('addReceipt') + '</button>' +
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
      const pos = this._state.menuPosition || { top: 0, right: 0 };
      menuHtml = '<div class="menu-dropdown" style="top: ' + pos.top + 'px; right: ' + pos.right + 'px;">' +
        '<button class="menu-item" data-action="edit-receipt" data-receipt-id="' + receipt.receipt_id + '" data-project-id="' + projectId + '">' + editIcon + this._t('editReceipt') + '</button>' +
        '<button class="menu-item danger" data-action="delete-receipt" data-receipt-id="' + receipt.receipt_id + '" data-merchant="' + this._escapeHtml(receipt.merchant || this._t('thisReceipt')) + '">' + deleteIcon + this._t('deleteReceipt') + '</button>' +
      '</div>';
    }

    // Photo indicator
    const photoCount = (receipt.image_paths || []).length;
    const photoIndicator = photoCount > 0 
      ? '<span class="photo-indicator"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z"/></svg>' + photoCount + '</span>'
      : '';

    return '<div class="receipt-item">' +
      '<div class="receipt-icon">' + receiptIcon + '</div>' +
      '<div class="receipt-content">' +
        '<div class="receipt-merchant">' + this._escapeHtml(receipt.merchant || 'Unknown') + photoIndicator + '</div>' +
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
    if (this._state.modal.type === 'project') return this._renderProjectModal();
    if (this._state.modal.type === 'confirm') return this._renderConfirmModal();
    return '';
  }

  _renderPhotoViewer() {
    if (this._state.photoViewerIndex < 0 || !this._state.modal) return '';
    
    const data = this._state.modal?.data || {};
    const existingImages = data.image_paths || [];
    const pendingPhotos = this._state.pendingPhotos || [];
    const allPhotos = [...existingImages.map(path => ({ type: 'existing', src: path })), ...pendingPhotos.map(p => ({ type: 'pending', src: p.dataUrl }))];
    
    if (allPhotos.length === 0 || this._state.photoViewerIndex >= allPhotos.length) return '';
    
    const currentPhoto = allPhotos[this._state.photoViewerIndex];
    const closeIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/></svg>';
    const prevIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"/></svg>';
    const nextIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/></svg>';
    
    const showPrev = this._state.photoViewerIndex > 0;
    const showNext = this._state.photoViewerIndex < allPhotos.length - 1;
    
    return '<div class="photo-viewer" data-action="close-photo-viewer">' +
      '<button class="photo-viewer-close" data-action="close-photo-viewer">' + closeIcon + '</button>' +
      (showPrev ? '<button class="photo-viewer-nav prev" data-action="photo-viewer-prev" onclick="event.stopPropagation()">' + prevIcon + '</button>' : '') +
      '<img src="' + currentPhoto.src + '" alt="Receipt photo" onclick="event.stopPropagation()">' +
      (showNext ? '<button class="photo-viewer-nav next" data-action="photo-viewer-next" onclick="event.stopPropagation()">' + nextIcon + '</button>' : '') +
    '</div>';
  }

  _renderProjectModal() {
    const data = this._state.modal.data || {};
    const isEdit = !!data.project_id;
    const title = isEdit ? this._t('editProject') : this._t('newProject');
    const closeIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/></svg>';

    // Build area options
    let areaOptions = '<option value="">' + this._t('noArea') + '</option>';
    Object.entries(this._state.areas).forEach(([id, name]) => {
      const selected = data.area_id === id ? ' selected' : '';
      areaOptions += '<option value="' + id + '"' + selected + '>' + this._escapeHtml(name) + '</option>';
    });

    return '<div class="modal-overlay" data-action="close-modal">' +
      '<div class="modal" onclick="event.stopPropagation()">' +
        '<div class="modal-header">' +
          '<h3>' + title + '</h3>' +
          '<button class="modal-close" data-action="close-modal">' + closeIcon + '</button>' +
        '</div>' +
        '<div class="modal-body">' +
          '<div class="form-group"><label>' + this._t('projectName') + ' *</label><input type="text" id="project-name" value="' + this._escapeHtml(data.name || '') + '" placeholder="' + this._t('projectNamePlaceholder') + '" required></div>' +
          '<div class="form-group"><label>' + this._t('areaOptional') + '</label><select id="project-area">' + areaOptions + '</select></div>' +
        '</div>' +
        '<div class="modal-actions">' +
          '<button class="btn btn-secondary" data-action="close-modal">' + this._t('cancel') + '</button>' +
          '<button class="btn btn-primary" data-action="save-project">' + (isEdit ? this._t('saveChanges') : this._t('createProject')) + '</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  _renderReceiptModal() {
    const data = this._state.modal.data || {};
    const isEdit = !!data.receipt_id;
    const needsProjectSelector = !isEdit && !data.project_id;
    const title = isEdit ? this._t('editReceipt') : this._t('addReceipt');
    const today = new Date().toISOString().split('T')[0];
    const closeIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/></svg>';
    const cameraIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z"/></svg>';
    const uploadIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z"/></svg>';
    const removeIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/></svg>';
    const imageIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z"/></svg>';

    const allMerchants = this._getAllMerchants();
    const allCategories = this._getAllCategories();
    
    // Project selector for quick add (when not from a specific project)
    let projectSelectorHtml = '';
    if (needsProjectSelector) {
      const openProjects = this._state.projects.filter(p => p.status === 'open');
      if (openProjects.length === 0) {
        return this._renderNoProjectsModal();
      }
      const projectOptions = openProjects.map(p => {
        const areaName = p.area_id ? this._state.areas[p.area_id] : '';
        const label = areaName ? p.name + ' (' + areaName + ')' : p.name;
        const selected = data.selected_project_id === p.project_id ? ' selected' : '';
        return '<option value="' + p.project_id + '"' + selected + '>' + this._escapeHtml(label) + '</option>';
      }).join('');
      projectSelectorHtml = '<div class="form-group"><label>' + this._t('project') + ' *</label><select id="receipt-project" required><option value="">' + this._t('selectProject') + '</option>' + projectOptions + '</select></div>';
    }

    const merchantHint = allMerchants.length > 0 
      ? this._t('existingMerchants', { count: allMerchants.length }) 
      : this._t('noMerchantsHint');
    const categoryHint = allCategories.length > 0 
      ? this._t('existingCategories', { count: allCategories.length }) 
      : this._t('noCategoriesHint');

    // Build photo section HTML
    // Combine existing images (for edit mode) and pending new photos
    const existingImages = isEdit ? (data.image_paths || []) : [];
    const pendingPhotos = this._state.pendingPhotos || [];
    const allPhotos = [...existingImages.map((path, i) => ({ type: 'existing', path, index: i })), ...pendingPhotos.map((p, i) => ({ type: 'pending', dataUrl: p.dataUrl, index: i }))];
    
    let photoGridHtml = '';
    if (allPhotos.length > 0) {
      photoGridHtml = '<div class="photo-grid">' + allPhotos.map((photo, i) => {
        const imgSrc = photo.type === 'existing' ? photo.path : photo.dataUrl;
        const removeAction = photo.type === 'existing' ? 'remove-existing-photo' : 'remove-pending-photo';
        return '<div class="photo-thumb" data-action="view-photo" data-photo-index="' + i + '">' +
          '<img src="' + imgSrc + '" alt="Receipt photo">' +
          '<button class="photo-thumb-remove" data-action="' + removeAction + '" data-index="' + photo.index + '" onclick="event.stopPropagation()">' + removeIcon + '</button>' +
        '</div>';
      }).join('') + '</div>';
    } else {
      photoGridHtml = '<div class="photo-empty">' + imageIcon + '<div class="photo-empty-text">' + this._t('noPhotosYet') + '</div></div>';
    }

    const photoSectionHtml = '<div class="photo-section">' +
      '<div class="photo-section-header">' +
        '<span class="photo-section-title">' + this._t('receiptPhotos') + '</span>' +
        '<div class="photo-buttons">' +
          '<input type="file" id="photo-upload" class="photo-input" accept="image/*" multiple>' +
          '<input type="file" id="photo-capture" class="photo-input" accept="image/*" capture="environment">' +
          '<button class="photo-btn" data-action="trigger-photo-upload">' + uploadIcon + '<span>' + this._t('uploadPhoto') + '</span></button>' +
          '<button class="photo-btn" data-action="trigger-photo-capture">' + cameraIcon + '<span>' + this._t('takePhoto') + '</span></button>' +
        '</div>' +
      '</div>' +
      '<div class="tag-hint">' + this._t('photoHint') + '</div>' +
      photoGridHtml +
    '</div>';

    return '<div class="modal-overlay" data-action="close-modal">' +
      '<div class="modal" onclick="event.stopPropagation()">' +
        '<div class="modal-header">' +
          '<h3>' + title + '</h3>' +
          '<button class="modal-close" data-action="close-modal">' + closeIcon + '</button>' +
        '</div>' +
        '<div class="modal-body">' +
          projectSelectorHtml +
          '<div class="form-group">' +
            '<label>' + this._t('merchant') + ' *</label>' +
            '<div class="autocomplete-container" data-field="merchant">' +
              '<input type="text" class="autocomplete-input" id="receipt-merchant" value="' + this._escapeHtml(data.merchant || '') + '" placeholder="' + this._t('searchOrTypeNew') + '" autocomplete="off" required>' +
              '<svg class="autocomplete-search-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/></svg>' +
              '<div class="autocomplete-dropdown" id="merchant-dropdown" style="display:none;"></div>' +
            '</div>' +
            '<div class="tag-hint">' + merchantHint + '</div>' +
          '</div>' +
          '<div class="form-group"><label>' + this._t('amount') + ' *</label><input type="number" id="receipt-amount" value="' + (data.total || '') + '" placeholder="0.00" step="0.01" min="0" required></div>' +
          '<div class="form-group"><label>' + this._t('date') + ' *</label><input type="date" id="receipt-date" value="' + (data.date || today) + '" required></div>' +
          '<div class="form-group">' +
            '<label>' + this._t('categoryOptional') + '</label>' +
            '<div class="autocomplete-container" data-field="category">' +
              '<input type="text" class="autocomplete-input" id="receipt-category" value="' + this._escapeHtml(data.category_summary || '') + '" placeholder="' + this._t('searchOrTypeNew') + '" autocomplete="off">' +
              '<svg class="autocomplete-search-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/></svg>' +
              '<div class="autocomplete-dropdown" id="category-dropdown" style="display:none;"></div>' +
            '</div>' +
            '<div class="tag-hint">' + categoryHint + '</div>' +
          '</div>' +
          photoSectionHtml +
        '</div>' +
        '<div class="modal-actions">' +
          '<button class="btn btn-secondary" data-action="close-modal">' + this._t('cancel') + '</button>' +
          '<button class="btn btn-primary" data-action="save-receipt">' + (isEdit ? this._t('saveChanges') : this._t('addReceipt')) + '</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  _renderNoProjectsModal() {
    const closeIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/></svg>';
    const projectIcon = '<svg viewBox="0 0 24 24" style="width:48px;height:48px;margin-bottom:16px;color:var(--disabled-color,#bdbdbd)"><path fill="currentColor" d="M19,3H14.82C14.4,1.84 13.3,1 12,1C10.7,1 9.6,1.84 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3"/></svg>';
    
    return '<div class="modal-overlay" data-action="close-modal">' +
      '<div class="modal" onclick="event.stopPropagation()">' +
        '<div class="modal-header">' +
          '<h3>' + this._t('addReceipt') + '</h3>' +
          '<button class="modal-close" data-action="close-modal">' + closeIcon + '</button>' +
        '</div>' +
        '<div class="modal-body" style="text-align:center;padding:32px 20px;">' +
          projectIcon +
          '<h4 style="margin:0 0 8px 0;font-weight:500;">' + this._t('noOpenProjects') + '</h4>' +
          '<p style="color:var(--secondary-text-color,#757575);margin:0 0 20px 0;font-size:14px;">' + this._t('noOpenProjectsDesc') + '</p>' +
          '<button class="btn btn-primary" data-action="open-add-project" style="display:inline-flex;">' + this._t('createProject') + '</button>' +
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
          '<h3>' + (data.title || this._t('confirm')) + '</h3>' +
          '<button class="modal-close" data-action="close-modal">' + closeIcon + '</button>' +
        '</div>' +
        '<div class="modal-body"><p class="confirm-message">' + (data.message || this._t('areYouSure')) + '</p></div>' +
        '<div class="modal-actions">' +
          '<button class="btn btn-secondary" data-action="close-modal">' + this._t('cancel') + '</button>' +
          '<button class="btn btn-danger" data-action="confirm-action">' + this._t('delete') + '</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  _renderEmptyState() {
    const icon = '<svg class="empty-state-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M19,3H14.82C14.4,1.84 13.3,1 12,1C10.7,1 9.6,1.84 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3M7,7H17V5H19V19H5V5H7V7Z"/></svg>';
    return '<div class="empty-state">' + icon + '<h3>' + this._t('noProjectsYet') + '</h3><p>' + this._t('noProjectsDesc') + '</p></div>';
  }

  _renderNoResults() {
    return '<div class="no-results">' + this._t('noProjectsMatch') + '</div>';
  }

  _attachEventListeners() {
    // Main navigation tabs
    this._container.querySelectorAll(".main-nav-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        const tab = e.currentTarget.dataset.tab;
        if (tab && tab !== this._state.activeTab) {
          this._state.activeTab = tab;
          this._state.searchQuery = "";
          this._state.expandedProjectId = null;
          this._state.openMenuId = null;
          this._render();
        }
      });
    });

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
        if (this._state.openMenuId === menuId) {
          this._state.openMenuId = null;
        } else {
          this._state.openMenuId = menuId;
          // Store button position for dropdown
          const rect = btn.getBoundingClientRect();
          this._state.menuPosition = { top: rect.bottom + 4, right: window.innerWidth - rect.right };
        }
        this._render();
      });
    });

    this._container.querySelectorAll("[data-action]").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        this._handleAction(el.dataset);
      });
    });

    // Autocomplete for merchant field
    const merchantInput = this._container.querySelector("#receipt-merchant");
    const merchantDropdown = this._container.querySelector("#merchant-dropdown");
    if (merchantInput && merchantDropdown) {
      this._setupAutocomplete(merchantInput, merchantDropdown, this._getAllMerchants());
    }

    // Autocomplete for category field
    const categoryInput = this._container.querySelector("#receipt-category");
    const categoryDropdown = this._container.querySelector("#category-dropdown");
    if (categoryInput && categoryDropdown) {
      this._setupAutocomplete(categoryInput, categoryDropdown, this._getAllCategories());
    }

    // Photo upload file input handlers
    const photoUpload = this._container.querySelector("#photo-upload");
    if (photoUpload) {
      photoUpload.addEventListener("change", (e) => this._handlePhotoFiles(e.target.files));
    }
    
    const photoCapture = this._container.querySelector("#photo-capture");
    if (photoCapture) {
      photoCapture.addEventListener("change", (e) => this._handlePhotoFiles(e.target.files));
    }
  }

  _setupAutocomplete(input, dropdown, allOptions) {
    let highlightedIndex = -1;
    const checkIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>';
    const plusIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/></svg>';

    const showDropdown = (filteredOptions, query) => {
      let html = '';
      
      // Show matching options with check icon
      filteredOptions.forEach((opt, idx) => {
        const isHighlighted = idx === highlightedIndex ? ' highlighted' : '';
        html += '<div class="autocomplete-item' + isHighlighted + '" data-value="' + this._escapeHtml(opt) + '">' + checkIcon + '<span>' + this._escapeHtml(opt) + '</span></div>';
      });
      
      // Show "Create new" option if query doesn't exactly match any option
      const exactMatch = allOptions.some(opt => opt.toLowerCase() === query.toLowerCase());
      if (query && !exactMatch) {
        const createIdx = filteredOptions.length;
        const isHighlighted = createIdx === highlightedIndex ? ' highlighted' : '';
        html += '<div class="autocomplete-item create-new' + isHighlighted + '" data-value="' + this._escapeHtml(query) + '" data-create="true">' + plusIcon + '<span>' + this._t('createNew', { name: this._escapeHtml(query) }) + '</span></div>';
      }
      
      if (!html) {
        dropdown.style.display = 'none';
        return;
      }
      
      dropdown.innerHTML = html;
      dropdown.style.display = 'block';

      dropdown.querySelectorAll('.autocomplete-item').forEach(item => {
        item.addEventListener('mousedown', (e) => {
          e.preventDefault();
          input.value = item.dataset.value;
          dropdown.style.display = 'none';
          input.focus();
        });
      });
    };

    const filterOptions = () => {
      const query = input.value.trim();
      if (!query) {
        dropdown.style.display = 'none';
        return;
      }
      const queryLower = query.toLowerCase();
      const filtered = allOptions.filter(opt => opt.toLowerCase().includes(queryLower));
      highlightedIndex = -1;
      showDropdown(filtered, query);
    };

    input.addEventListener('input', filterOptions);
    input.addEventListener('focus', filterOptions);
    input.addEventListener('blur', () => {
      setTimeout(() => { dropdown.style.display = 'none'; }, 150);
    });

    input.addEventListener('keydown', (e) => {
      const items = dropdown.querySelectorAll('.autocomplete-item');
      if (items.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        highlightedIndex = Math.min(highlightedIndex + 1, items.length - 1);
        items.forEach((item, idx) => item.classList.toggle('highlighted', idx === highlightedIndex));
        if (items[highlightedIndex]) items[highlightedIndex].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        highlightedIndex = Math.max(highlightedIndex - 1, 0);
        items.forEach((item, idx) => item.classList.toggle('highlighted', idx === highlightedIndex));
        if (items[highlightedIndex]) items[highlightedIndex].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter' && highlightedIndex >= 0) {
        e.preventDefault();
        input.value = items[highlightedIndex].dataset.value;
        dropdown.style.display = 'none';
      } else if (e.key === 'Escape') {
        dropdown.style.display = 'none';
      }
    });
  }

  _handleAction(dataset) {
    const action = dataset.action;
    switch (action) {
      case "add-project":
        this._state.modal = { type: 'project', data: {} };
        this._render();
        break;
      case "open-add-project":
        // Called from the no-projects modal - close current modal and open project modal
        this._state.modal = { type: 'project', data: {} };
        this._render();
        break;
      case "toggle-sidebar":
        // Fire event to toggle Home Assistant sidebar on mobile
        this._fireHassEvent('hass-toggle-menu');
        break;
      case "quick-add-receipt":
        // Open receipt modal without a pre-selected project
        this._state.pendingPhotos = []; // Clear pending photos
        this._state.modal = { type: 'receipt', data: {} };
        this._render();
        break;
      case "save-project":
        this._saveProject();
        break;
      case "edit-project":
        const projectToEdit = this._state.projects.find(p => p.project_id === dataset.projectId);
        if (projectToEdit) {
          this._state.modal = { type: 'project', data: { ...projectToEdit } };
        }
        this._state.openMenuId = null;
        this._render();
        break;
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
            title: this._t('deleteProject'),
            message: this._t('confirmDeleteProject', { name: dataset.projectName }),
            confirmAction: () => this._deleteProject(dataset.projectId),
          }
        };
        this._state.openMenuId = null;
        this._render();
        break;
      case "add-receipt":
        this._state.pendingPhotos = []; // Clear pending photos when opening new receipt modal
        this._state.modal = { type: 'receipt', data: { project_id: dataset.projectId } };
        this._render();
        break;
      case "edit-receipt":
        this._state.pendingPhotos = []; // Clear pending photos when opening edit receipt modal
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
            title: this._t('deleteReceipt'),
            message: this._t('confirmDeleteReceipt', { merchant: dataset.merchant }),
            confirmAction: () => this._deleteReceipt(dataset.receiptId),
          }
        };
        this._state.openMenuId = null;
        this._render();
        break;
      case "save-receipt":
        this._saveReceipt();
        break;
      case "trigger-photo-upload":
        this._container.querySelector("#photo-upload")?.click();
        break;
      case "trigger-photo-capture":
        this._container.querySelector("#photo-capture")?.click();
        break;
      case "remove-pending-photo":
        const pendingIndex = parseInt(dataset.index, 10);
        if (!isNaN(pendingIndex)) {
          this._state.pendingPhotos.splice(pendingIndex, 1);
          this._render();
        }
        break;
      case "remove-existing-photo":
        // Mark existing photo for removal (will be processed on save)
        const existingIndex = parseInt(dataset.index, 10);
        if (!isNaN(existingIndex) && this._state.modal?.data?.image_paths) {
          // Store removed paths for the update call
          this._state.modal.data.removed_image_paths = this._state.modal.data.removed_image_paths || [];
          this._state.modal.data.removed_image_paths.push(this._state.modal.data.image_paths[existingIndex]);
          this._state.modal.data.image_paths.splice(existingIndex, 1);
          this._render();
        }
        break;
      case "view-photo":
        const photoIndex = parseInt(dataset.photoIndex, 10);
        if (!isNaN(photoIndex)) {
          this._state.photoViewerIndex = photoIndex;
          this._render();
        }
        break;
      case "close-photo-viewer":
        this._state.photoViewerIndex = -1;
        this._render();
        break;
      case "photo-viewer-prev":
        if (this._state.photoViewerIndex > 0) {
          this._state.photoViewerIndex--;
          this._render();
        }
        break;
      case "photo-viewer-next":
        const existingImgs = this._state.modal?.data?.image_paths || [];
        const pendingPhts = this._state.pendingPhotos || [];
        const totalPhotos = existingImgs.length + pendingPhts.length;
        if (this._state.photoViewerIndex < totalPhotos - 1) {
          this._state.photoViewerIndex++;
          this._render();
        }
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
        this._state.pendingPhotos = []; // Clear pending photos when closing modal
        this._state.photoViewerIndex = -1;
        this._render();
        break;
    }
  }

  async _saveProject() {
    const data = this._state.modal?.data || {};
    const isEdit = !!data.project_id;
    const name = this._container.querySelector("#project-name")?.value?.trim();
    const areaId = this._container.querySelector("#project-area")?.value || null;

    if (!name) {
      alert(this._t('pleaseEnterProjectName'));
      return;
    }

    try {
      if (isEdit) {
        await this._hass.callService(DOMAIN, "update_project", {
          project_id: data.project_id,
          name,
          area_id: areaId || null,
        });
      } else {
        await this._hass.callService(DOMAIN, "create_project", {
          name,
          area_id: areaId || undefined,
        });
      }
      this._state.modal = null;
      setTimeout(() => this._loadData(), 500);
    } catch (error) {
      console.error("Error saving project:", error);
      alert((isEdit ? this._t('failedUpdateProject') : this._t('failedCreateProject')) + ": " + error.message);
    }
  }

  async _closeProject(projectId) {
    try {
      await this._hass.callService(DOMAIN, "close_project", { project_id: projectId });
      this._state.openMenuId = null;
      setTimeout(() => this._loadData(), 500);
    } catch (error) {
      console.error("Error closing project:", error);
      alert(this._t('failedCloseProject') + ": " + error.message);
    }
  }

  async _reopenProject(projectId) {
    try {
      await this._hass.callService(DOMAIN, "reopen_project", { project_id: projectId });
      this._state.openMenuId = null;
      setTimeout(() => this._loadData(), 500);
    } catch (error) {
      console.error("Error reopening project:", error);
      alert(this._t('failedReopenProject') + ": " + error.message);
    }
  }

  async _deleteProject(projectId) {
    try {
      await this._hass.callService(DOMAIN, "delete_project", { project_id: projectId });
      this._state.expandedProjectId = null;
      setTimeout(() => this._loadData(), 500);
    } catch (error) {
      console.error("Error deleting project:", error);
      alert(this._t('failedDeleteProject') + ": " + error.message);
    }
  }

  async _saveReceipt() {
    const data = this._state.modal?.data || {};
    const merchant = this._container.querySelector("#receipt-merchant")?.value;
    const amount = parseFloat(this._container.querySelector("#receipt-amount")?.value);
    const date = this._container.querySelector("#receipt-date")?.value;
    const category = this._container.querySelector("#receipt-category")?.value;
    
    // Get project_id from selector if present (quick add mode), or from modal data
    const projectSelect = this._container.querySelector("#receipt-project");
    const projectId = projectSelect ? projectSelect.value : data.project_id;

    if (!merchant || isNaN(amount) || !date) {
      alert(this._t('pleaseFillRequired'));
      return;
    }
    
    if (!data.receipt_id && !projectId) {
      alert(this._t('pleaseSelectProject'));
      return;
    }

    // Prepare images for upload (convert pending photos to base64 format)
    const pendingPhotos = this._state.pendingPhotos || [];
    const imagesToAdd = await Promise.all(pendingPhotos.map(async (photo) => {
      // Extract base64 data from dataUrl (remove "data:image/xxx;base64," prefix)
      const base64Data = photo.dataUrl.split(',')[1];
      return {
        data: base64Data,
        filename: photo.file.name || `receipt_${Date.now()}.jpg`
      };
    }));

    try {
      if (data.receipt_id) {
        // Update existing receipt
        const updatePayload = {
          receipt_id: data.receipt_id,
          merchant,
          total: amount,
          date,
          category_summary: category || undefined,
        };
        
        // Add new images if any
        if (imagesToAdd.length > 0) {
          updatePayload.add_images = imagesToAdd;
        }
        
        // Remove images that were deleted
        if (data.removed_image_paths && data.removed_image_paths.length > 0) {
          updatePayload.remove_image_paths = data.removed_image_paths;
        }
        
        await this._hass.callService(DOMAIN, "update_receipt", updatePayload);
      } else {
        // Add new receipt
        const addPayload = {
          project_id: projectId,
          merchant,
          total: amount,
          date,
          currency: this._state.currency,
          category_summary: category || undefined,
        };
        
        // Include images if any
        if (imagesToAdd.length > 0) {
          addPayload.images = imagesToAdd;
        }
        
        await this._hass.callService(DOMAIN, "add_receipt", addPayload);
      }
      
      // Clear pending photos and close modal
      this._state.pendingPhotos = [];
      this._state.modal = null;
      setTimeout(() => this._loadData(), 500);
    } catch (error) {
      console.error("Error saving receipt:", error);
      alert(this._t('failedSaveReceipt') + ": " + error.message);
    }
  }

  async _deleteReceipt(receiptId) {
    try {
      await this._hass.callService(DOMAIN, "delete_receipt", { receipt_id: receiptId });
      setTimeout(() => this._loadData(), 500);
    } catch (error) {
      console.error("Error deleting receipt:", error);
      alert(this._t('failedDeleteReceipt') + ": " + error.message);
    }
  }

  _handlePhotoFiles(files) {
    if (!files || files.length === 0) return;

    const maxSize = 10 * 1024 * 1024; // 10MB
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif'];

    Array.from(files).forEach(file => {
      // Validate file type
      if (!validTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|gif|webp|heic|heif)$/i)) {
        alert(this._t('invalidImageType'));
        return;
      }

      // Validate file size
      if (file.size > maxSize) {
        alert(this._t('imageTooLarge'));
        return;
      }

      // Read file and create dataUrl for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this._state.pendingPhotos.push({
          file: file,
          dataUrl: e.target.result
        });
        this._render();
      };
      reader.onerror = () => {
        alert(this._t('imageLoadError'));
      };
      reader.readAsDataURL(file);
    });

    // Clear the file input so the same file can be selected again
    const uploadInput = this._container.querySelector("#photo-upload");
    const captureInput = this._container.querySelector("#photo-capture");
    if (uploadInput) uploadInput.value = '';
    if (captureInput) captureInput.value = '';
  }

  _formatCurrency(amount) {
    return new Intl.NumberFormat("sv-SE", { style: "currency", currency: this._state.currency }).format(amount);
  }

  _escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text || '';
    return div.innerHTML;
  }

  _getAllMerchants() {
    const merchants = new Set();
    this._state.projects.forEach(project => {
      (project.receipts || []).forEach(receipt => {
        if (receipt.merchant) merchants.add(receipt.merchant);
      });
    });
    return Array.from(merchants).sort((a, b) => a.localeCompare(b, 'sv'));
  }

  _getAllCategories() {
    const categories = new Set();
    this._state.projects.forEach(project => {
      (project.receipts || []).forEach(receipt => {
        if (receipt.category_summary) {
          // Split by comma in case multiple categories are stored
          receipt.category_summary.split(',').forEach(cat => {
            const trimmed = cat.trim();
            if (trimmed) categories.add(trimmed);
          });
        }
      });
    });
    return Array.from(categories).sort((a, b) => a.localeCompare(b, 'sv'));
  }

  _fireHassEvent(eventName, detail = {}) {
    // Fire a Home Assistant event to toggle the sidebar
    const event = new CustomEvent(eventName, {
      bubbles: true,
      composed: true,
      detail: detail,
    });
    this.dispatchEvent(event);
  }
}

customElements.define("home_project_ledger-panel", HomeProjectLedgerPanel);
