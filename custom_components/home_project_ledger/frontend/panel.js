/**
 * Home Project Ledger - Custom Panel for Home Assistant
 * This is a proper web component that integrates with HA's panel system.
 * The sidebar and header remain visible - content renders in the main area only.
 */

const DOMAIN = "home_project_ledger";

// Color palette for charts (inspired by HA Energy dashboard)
const CHART_COLORS = [
  '#4fc3f7', '#29b6f6', '#03a9f4', '#039be5', '#0288d1', // Blues
  '#81c784', '#66bb6a', '#4caf50', '#43a047', '#388e3c', // Greens
  '#ffb74d', '#ffa726', '#ff9800', '#fb8c00', '#f57c00', // Oranges
  '#f06292', '#ec407a', '#e91e63', '#d81b60', '#c2185b', // Pinks
  '#ba68c8', '#ab47bc', '#9c27b0', '#8e24aa', '#7b1fa2', // Purples
  '#7986cb', '#5c6bc0', '#3f51b5', '#3949ab', '#303f9f', // Indigos
];

// Translations
const TRANSLATIONS = {
  en: {
    // Navigation
    dashboard: "Dashboard",
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
    budgetOptional: "Budget (optional)",
    budgetPlaceholder: "e.g., 50000",
    budget: "Budget",
    spent: "Spent",
    remaining: "Remaining",
    overBudget: "Over budget",
    noBudget: "No budget set",
    budgetByCategory: "Budget by Category",
    addCategoryBudget: "Add category budget",
    categoriesOptional: "Categories (optional)",
    splitType: "Cost Split",
    splitEqual: "Split equally",
    splitPercentage: "By percentage",
    splitAbsolute: "By amount",
    addCategory: "Add category",
    removeCategory: "Remove",
    categoryAmount: "Amount",
    categoryPercent: "Percentage",
    splitMustEqual100: "Percentages must total 100%",
    splitMustEqualTotal: "Amounts must equal total",
    categoryBudgetsExceedTotal: "Category budgets cannot exceed total budget",
    splitRemaining: "Remaining",
    splitAllocated: "Allocated",
    splitOverAllocated: "Over-allocated by",
    
    // Dashboard
    spendingOverview: "Spending Overview",
    spendByCategory: "Spend by Category",
    spendByMerchant: "Spend by Merchant",
    spendByProject: "Spend by Project",
    budgetOverview: "Budget Overview",
    spendingTimeline: "Spending Timeline",
    topMerchants: "Top Merchants",
    topCategories: "Top Categories",
    recentActivity: "Recent Activity",
    monthlySpending: "Monthly Spending",
    thisMonth: "This Month",
    lastMonth: "Last Month",
    last3Months: "Last 3 Months",
    last6Months: "Last 6 Months",
    thisYear: "This Year",
    allTime: "All Time",
    noDataYet: "No data yet",
    noDataYetDesc: "Start adding receipts to see your spending statistics here.",
    averagePerReceipt: "Avg. per Receipt",
    averageMonthly: "Avg. Monthly",
    projectsWithBudget: "Projects with Budget",
    onTrack: "On Track",
    atRisk: "At Risk",
    overBudgetCount: "Over Budget",
    budgetHealth: "Budget Health",
    uncategorized: "Uncategorized",
    other: "Other",
    
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
    
    // Settings / Cloud Storage
    settings: "Settings",
    storageSettings: "Storage Settings",
    storageProvider: "Storage Provider",
    storageProviderDesc: "Choose where to store your receipt images",
    localStorage: "Local Storage",
    localStorageDesc: "Store images on the Home Assistant server",
    googleDrive: "Google Drive",
    googleDriveDesc: "Store images in your Google Drive account",
    oneDrive: "OneDrive",
    oneDriveDesc: "Store images in your Microsoft OneDrive account",
    dropbox: "Dropbox",
    dropboxDesc: "Store images in your Dropbox account",
    webdav: "WebDAV",
    webdavDesc: "Store images on a WebDAV server (Nextcloud, ownCloud, etc.)",
    connected: "Connected",
    notConnected: "Not connected",
    connect: "Connect",
    disconnect: "Disconnect",
    authenticate: "Authenticate",
    authorizing: "Authorizing...",
    storageUsed: "Storage Used",
    notConfigured: "Not configured",
    notAvailableYet: "Not available yet",
    oauthInstructions: "Click the button below to authorize access. You'll be redirected to sign in.",
    pasteAuthCode: "Paste the authorization code here after signing in",
    authCode: "Authorization Code",
    submitAuthCode: "Submit",
    webdavUrl: "WebDAV URL",
    webdavUsername: "Username",
    webdavPassword: "Password",
    saveWebdav: "Save WebDAV Settings",
    cloudStorageInfo: "Cloud Storage Configuration",
    cloudStorageInfoDesc: "To use cloud storage, remove this integration and re-add it, selecting your preferred cloud provider during setup.",
    openIntegrationSettings: "Open Integration Settings",
    currentStorage: "Current Storage",
    switchProvider: "Switch Provider",
    failedStorageConfig: "Failed to configure storage",
    storageConnected: "Storage connected successfully",
    storageDisconnected: "Switched to local storage",
  },
  sv: {
    // Navigation
    dashboard: "Dashboard",
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
    budgetOptional: "Budget (valfritt)",
    budgetPlaceholder: "t.ex. 50000",
    budget: "Budget",
    spent: "Spenderat",
    remaining: "Återstår",
    overBudget: "Över budget",
    noBudget: "Ingen budget satt",
    budgetByCategory: "Budget per kategori",
    addCategoryBudget: "Lägg till kategoribudget",
    categoriesOptional: "Kategorier (valfritt)",
    splitType: "Kostnadsfördelning",
    splitEqual: "Dela lika",
    splitPercentage: "Procentuellt",
    splitAbsolute: "Efter belopp",
    addCategory: "Lägg till kategori",
    removeCategory: "Ta bort",
    categoryAmount: "Belopp",
    categoryPercent: "Procent",
    splitMustEqual100: "Procenten måste summera till 100%",
    splitMustEqualTotal: "Beloppen måste summera till totalen",
    categoryBudgetsExceedTotal: "Kategoribudgetar kan inte överskrida total budget",
    splitRemaining: "Återstår",
    splitAllocated: "Fördelat",
    splitOverAllocated: "Överfördelat med",
    
    // Dashboard
    spendingOverview: "Utgiftsöversikt",
    spendByCategory: "Utgifter per kategori",
    spendByMerchant: "Utgifter per butik",
    spendByProject: "Utgifter per projekt",
    budgetOverview: "Budgetöversikt",
    spendingTimeline: "Utgifter över tid",
    topMerchants: "Topp butiker",
    topCategories: "Topp kategorier",
    recentActivity: "Senaste aktivitet",
    monthlySpending: "Månadsutgifter",
    thisMonth: "Denna månad",
    lastMonth: "Förra månaden",
    last3Months: "Senaste 3 månaderna",
    last6Months: "Senaste 6 månaderna",
    thisYear: "I år",
    allTime: "All tid",
    noDataYet: "Ingen data än",
    noDataYetDesc: "Börja lägga till kvitton för att se din utgiftsstatistik här.",
    averagePerReceipt: "Snitt per kvitto",
    averageMonthly: "Snitt per månad",
    projectsWithBudget: "Projekt med budget",
    onTrack: "På spår",
    atRisk: "Risk",
    overBudgetCount: "Över budget",
    budgetHealth: "Budgethälsa",
    uncategorized: "Okategoriserat",
    other: "Övrigt",
    
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
    
    // Settings / Cloud Storage
    settings: "Inställningar",
    storageSettings: "Lagringsinställningar",
    storageProvider: "Lagringsleverantör",
    storageProviderDesc: "Välj var dina kvittobilder ska lagras",
    localStorage: "Lokal lagring",
    localStorageDesc: "Lagra bilder på Home Assistant-servern",
    googleDrive: "Google Drive",
    googleDriveDesc: "Lagra bilder i ditt Google Drive-konto",
    oneDrive: "OneDrive",
    oneDriveDesc: "Lagra bilder i ditt Microsoft OneDrive-konto",
    dropbox: "Dropbox",
    dropboxDesc: "Lagra bilder i ditt Dropbox-konto",
    webdav: "WebDAV",
    webdavDesc: "Lagra bilder på en WebDAV-server (Nextcloud, ownCloud, etc.)",
    connected: "Ansluten",
    notConnected: "Ej ansluten",
    connect: "Anslut",
    disconnect: "Koppla från",
    authenticate: "Autentisera",
    authorizing: "Auktoriserar...",
    storageUsed: "Använt utrymme",
    notConfigured: "Ej konfigurerad",
    notAvailableYet: "Inte tillgänglig ännu",
    oauthInstructions: "Klicka på knappen nedan för att auktorisera åtkomst. Du kommer att omdirigeras för att logga in.",
    pasteAuthCode: "Klistra in auktoriseringskoden här efter inloggning",
    authCode: "Auktoriseringskod",
    submitAuthCode: "Skicka",
    webdavUrl: "WebDAV URL",
    webdavUsername: "Användarnamn",
    webdavPassword: "Lösenord",
    saveWebdav: "Spara WebDAV-inställningar",
    cloudStorageInfo: "Molnlagringskonfiguration",
    cloudStorageInfoDesc: "För att använda molnlagring, ta bort denna integration och lägg till den igen, välj önskad molnleverantör under installationen.",
    openIntegrationSettings: "Öppna integrationsinställningar",
    currentStorage: "Aktuell lagring",
    switchProvider: "Byt leverantör",
    failedStorageConfig: "Kunde inte konfigurera lagring",
    storageConnected: "Lagring ansluten",
    storageDisconnected: "Bytte till lokal lagring",
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
      activeTab: "dashboard",
      dashboardPeriod: "allTime", // thisMonth, lastMonth, last3Months, last6Months, thisYear, allTime
      expandedProjectId: null,
      openMenuId: null,
      modal: null,
      pendingPhotos: [], // For new photos being added to a receipt {dataUrl, file}
      photoViewerIndex: -1, // For viewing photos in fullscreen
      storageStatus: null, // Cloud storage status
      authCodeInput: "", // For OAuth flow
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
        .project-budget { margin-top: 6px; }
        .budget-bar { height: 6px; background-color: var(--divider-color, #e0e0e0); border-radius: 3px; overflow: hidden; margin-bottom: 4px; }
        .budget-progress { height: 100%; background-color: var(--success-color, #4caf50); border-radius: 3px; transition: width 0.3s ease; }
        .budget-bar.warning .budget-progress { background-color: var(--warning-color, #ff9800); }
        .budget-bar.over .budget-progress { background-color: var(--error-color, #f44336); }
        .budget-text { font-size: 12px; color: var(--secondary-text-color, #757575); }
        .budget-text.warning { color: var(--warning-color, #ff9800); }
        .budget-text.over { color: var(--error-color, #f44336); }
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
        .budget-summary { display: flex; gap: 24px; padding: 12px 16px; background-color: var(--card-background-color, #fff); border-radius: 8px; margin-bottom: 16px; }
        .budget-summary-item { display: flex; flex-direction: column; }
        .budget-summary-item .budget-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--secondary-text-color, #757575); margin-bottom: 2px; }
        .budget-summary-item .budget-value { font-size: 16px; font-weight: 500; color: var(--primary-text-color, #212121); }
        .budget-summary-item.warning .budget-value { color: var(--warning-color, #ff9800); }
        .budget-summary-item.over .budget-label, .budget-summary-item.over .budget-value { color: var(--error-color, #f44336); }
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
        
        /* Category tags / pills */
        .category-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; }
        .category-tag { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; background-color: var(--primary-color, #03a9f4); color: white; border-radius: 16px; font-size: 13px; }
        .category-tag .tag-remove { width: 16px; height: 16px; border: none; background: none; padding: 0; cursor: pointer; display: flex; align-items: center; justify-content: center; color: white; opacity: 0.8; }
        .category-tag .tag-remove:hover { opacity: 1; }
        .category-tag .tag-remove svg { width: 14px; height: 14px; }
        
        /* Split settings container */
        .split-settings { margin-top: 12px; padding: 12px; background-color: var(--secondary-background-color, #f5f5f5); border-radius: 8px; }
        .split-type-selector { display: flex; gap: 8px; margin-bottom: 12px; }
        .split-type-btn { flex: 1; padding: 8px 12px; border: 1px solid var(--divider-color, #e0e0e0); background-color: var(--card-background-color, #fff); border-radius: 6px; font-size: 12px; cursor: pointer; color: var(--primary-text-color, #212121); transition: all 0.15s; }
        .split-type-btn:hover { border-color: var(--primary-color, #03a9f4); }
        .split-type-btn.active { background-color: var(--primary-color, #03a9f4); color: white; border-color: var(--primary-color, #03a9f4); }
        .split-values { display: flex; flex-direction: column; gap: 8px; }
        .split-row { display: flex; align-items: center; gap: 8px; }
        .split-row .split-category { flex: 1; font-size: 13px; color: var(--primary-text-color, #212121); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .split-row input { width: 80px; padding: 6px 8px; border: 1px solid var(--divider-color, #e0e0e0); border-radius: 4px; font-size: 13px; text-align: right; }
        .split-row .split-suffix { font-size: 13px; color: var(--secondary-text-color, #757575); width: 20px; }
        .split-error { color: var(--error-color, #f44336); font-size: 12px; margin-top: 8px; }
        .split-remaining { margin-top: 12px; padding: 10px; background-color: var(--card-background-color, #fff); border-radius: 6px; border: 1px solid var(--divider-color, #e0e0e0); }
        .split-remaining-bar { height: 8px; background-color: var(--divider-color, #e0e0e0); border-radius: 4px; overflow: hidden; margin-bottom: 8px; }
        .split-remaining-bar-fill { height: 100%; border-radius: 4px; transition: width 0.2s ease, background-color 0.2s ease; }
        .split-remaining-bar-fill.ok { background-color: var(--success-color, #4caf50); }
        .split-remaining-bar-fill.warning { background-color: var(--warning-color, #ff9800); }
        .split-remaining-bar-fill.error { background-color: var(--error-color, #f44336); }
        .split-remaining-text { display: flex; justify-content: space-between; font-size: 12px; color: var(--secondary-text-color, #757575); }
        .split-remaining-text .allocated { color: var(--primary-text-color, #212121); }
        .split-remaining-text .remaining { color: var(--success-color, #4caf50); }
        .split-remaining-text .remaining.over { color: var(--error-color, #f44336); }
        
        /* Dashboard Styles */
        .dashboard-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
        @media (min-width: 768px) { .dashboard-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1200px) { .dashboard-grid { grid-template-columns: repeat(3, 1fr); } }
        .dashboard-card { background-color: var(--card-background-color, #fff); border-radius: var(--ha-card-border-radius, 12px); box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0,0,0,0.1)); overflow: hidden; }
        .dashboard-card.full-width { grid-column: 1 / -1; }
        .dashboard-card.half-width { grid-column: span 1; }
        @media (min-width: 768px) { .dashboard-card.half-width { grid-column: span 1; } }
        .dashboard-card-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid var(--divider-color, #e0e0e0); }
        .dashboard-card-header h3 { margin: 0; font-size: 16px; font-weight: 500; color: var(--primary-text-color, #212121); }
        .dashboard-card-body { padding: 20px; }
        .dashboard-card-body.no-padding { padding: 0; }
        
        /* Time Period Selector */
        .time-period-selector { display: flex; gap: 4px; background-color: var(--secondary-background-color, #f5f5f5); border-radius: 8px; padding: 4px; }
        .time-period-btn { padding: 6px 12px; border: none; background: none; border-radius: 6px; font-size: 12px; font-weight: 500; color: var(--secondary-text-color, #757575); cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .time-period-btn:hover { color: var(--primary-text-color, #212121); }
        .time-period-btn.active { background-color: var(--card-background-color, #fff); color: var(--primary-color, #03a9f4); box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        
        /* Summary Stats Row */
        .summary-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        @media (min-width: 480px) { .summary-stats { grid-template-columns: repeat(4, 1fr); } }
        .summary-stat { text-align: center; padding: 12px 8px; }
        .summary-stat-value { font-size: 28px; font-weight: 500; color: var(--primary-text-color, #212121); line-height: 1.2; }
        .summary-stat-value.positive { color: var(--success-color, #4caf50); }
        .summary-stat-value.negative { color: var(--error-color, #f44336); }
        .summary-stat-label { font-size: 12px; color: var(--secondary-text-color, #757575); margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
        
        /* Donut Chart */
        .donut-chart-container { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; justify-content: center; }
        @media (min-width: 480px) { .donut-chart-container { flex-wrap: nowrap; } }
        .donut-chart { position: relative; width: 160px; height: 160px; flex-shrink: 0; }
        .donut-chart svg { width: 100%; height: 100%; transform: rotate(-90deg); }
        .donut-chart-center { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; }
        .donut-chart-center-value { font-size: 24px; font-weight: 500; color: var(--primary-text-color, #212121); }
        .donut-chart-center-label { font-size: 11px; color: var(--secondary-text-color, #757575); text-transform: uppercase; }
        .donut-legend { flex: 1; min-width: 150px; }
        .donut-legend-item { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid var(--divider-color, #e0e0e0); }
        .donut-legend-item:last-child { border-bottom: none; }
        .donut-legend-color { width: 12px; height: 12px; border-radius: 3px; flex-shrink: 0; }
        .donut-legend-label { flex: 1; font-size: 13px; color: var(--primary-text-color, #212121); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .donut-legend-value { font-size: 13px; font-weight: 500; color: var(--primary-text-color, #212121); }
        .donut-legend-percent { font-size: 12px; color: var(--secondary-text-color, #757575); margin-left: 4px; }
        
        /* Bar Chart */
        .bar-chart { padding: 8px 0; }
        .bar-chart-row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
        .bar-chart-row:last-child { margin-bottom: 0; }
        .bar-chart-label { width: 100px; font-size: 13px; color: var(--primary-text-color, #212121); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex-shrink: 0; }
        .bar-chart-bar-container { flex: 1; height: 24px; background-color: var(--secondary-background-color, #f5f5f5); border-radius: 4px; overflow: hidden; position: relative; }
        .bar-chart-bar { height: 100%; border-radius: 4px; transition: width 0.5s ease; min-width: 2px; }
        .bar-chart-bar-text { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); font-size: 12px; font-weight: 500; color: var(--primary-text-color, #212121); }
        .bar-chart-value { width: 80px; text-align: right; font-size: 13px; font-weight: 500; color: var(--primary-text-color, #212121); flex-shrink: 0; }
        
        /* Timeline Chart */
        .timeline-chart { height: 200px; position: relative; }
        .timeline-chart svg { width: 100%; height: 100%; }
        .timeline-chart-labels { display: flex; justify-content: space-between; padding: 8px 0; font-size: 11px; color: var(--secondary-text-color, #757575); }
        .timeline-chart-tooltip { position: absolute; background-color: var(--card-background-color, #fff); border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); padding: 8px 12px; font-size: 12px; pointer-events: none; z-index: 10; white-space: nowrap; }
        .timeline-chart-tooltip-value { font-weight: 500; color: var(--primary-text-color, #212121); }
        .timeline-chart-tooltip-label { color: var(--secondary-text-color, #757575); margin-top: 2px; }
        
        /* Budget Health Cards */
        .budget-health-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .budget-health-card { text-align: center; padding: 16px 12px; background-color: var(--secondary-background-color, #f5f5f5); border-radius: 8px; }
        .budget-health-card.on-track { background-color: rgba(76, 175, 80, 0.1); }
        .budget-health-card.at-risk { background-color: rgba(255, 152, 0, 0.1); }
        .budget-health-card.over-budget { background-color: rgba(244, 67, 54, 0.1); }
        .budget-health-value { font-size: 32px; font-weight: 500; line-height: 1; }
        .budget-health-card.on-track .budget-health-value { color: var(--success-color, #4caf50); }
        .budget-health-card.at-risk .budget-health-value { color: var(--warning-color, #ff9800); }
        .budget-health-card.over-budget .budget-health-value { color: var(--error-color, #f44336); }
        .budget-health-label { font-size: 11px; color: var(--secondary-text-color, #757575); margin-top: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
        
        /* Project Budget List */
        .budget-project-list { max-height: 300px; overflow-y: auto; }
        .budget-project-item { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--divider-color, #e0e0e0); }
        .budget-project-item:last-child { border-bottom: none; }
        .budget-project-info { flex: 1; min-width: 0; }
        .budget-project-name { font-size: 14px; font-weight: 500; color: var(--primary-text-color, #212121); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .budget-project-amount { font-size: 12px; color: var(--secondary-text-color, #757575); margin-top: 2px; }
        .budget-project-bar { flex: 1; height: 8px; background-color: var(--secondary-background-color, #f5f5f5); border-radius: 4px; overflow: hidden; min-width: 80px; }
        .budget-project-progress { height: 100%; border-radius: 4px; transition: width 0.3s ease; }
        .budget-project-progress.on-track { background-color: var(--success-color, #4caf50); }
        .budget-project-progress.at-risk { background-color: var(--warning-color, #ff9800); }
        .budget-project-progress.over-budget { background-color: var(--error-color, #f44336); }
        .budget-project-percent { width: 50px; text-align: right; font-size: 13px; font-weight: 500; }
        .budget-project-percent.on-track { color: var(--success-color, #4caf50); }
        .budget-project-percent.at-risk { color: var(--warning-color, #ff9800); }
        .budget-project-percent.over-budget { color: var(--error-color, #f44336); }
        
        /* Recent Activity List */
        .activity-list { max-height: 350px; overflow-y: auto; }
        .activity-item { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--divider-color, #e0e0e0); }
        .activity-item:last-child { border-bottom: none; }
        .activity-icon { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .activity-icon svg { width: 20px; height: 20px; }
        .activity-content { flex: 1; min-width: 0; }
        .activity-title { font-size: 14px; font-weight: 500; color: var(--primary-text-color, #212121); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .activity-meta { font-size: 12px; color: var(--secondary-text-color, #757575); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .activity-amount { font-size: 14px; font-weight: 500; color: var(--primary-text-color, #212121); flex-shrink: 0; }
        
        /* Empty Dashboard State */
        .dashboard-empty { text-align: center; padding: 60px 20px; }
        .dashboard-empty-icon { width: 80px; height: 80px; margin: 0 auto 20px; color: var(--secondary-text-color, #757575); opacity: 0.5; }
        .dashboard-empty-icon svg { width: 100%; height: 100%; }
        .dashboard-empty-title { font-size: 20px; font-weight: 500; color: var(--primary-text-color, #212121); margin-bottom: 8px; }
        .dashboard-empty-desc { font-size: 14px; color: var(--secondary-text-color, #757575); max-width: 300px; margin: 0 auto; }
        
        /* Category budget rows for project modal */
        .category-budget-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 8px; }
        .category-budget-row { display: flex; align-items: center; gap: 8px; }
        .category-budget-row .category-budget-autocomplete { flex: 2; position: relative; }
        .category-budget-row .category-budget-autocomplete input[type="text"] { width: 100%; padding: 8px 12px; border: 1px solid var(--divider-color, #e0e0e0); border-radius: 6px; font-size: 13px; box-sizing: border-box; }
        .category-budget-row .category-budget-autocomplete input[type="text"]:focus { outline: none; border-color: var(--primary-color, #03a9f4); }
        .category-budget-row .category-budget-dropdown { position: absolute; top: 100%; left: 0; right: 0; background-color: var(--card-background-color, #fff); border: 1px solid var(--divider-color, #e0e0e0); border-top: none; border-radius: 0 0 6px 6px; max-height: 150px; overflow-y: auto; z-index: 1001; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
        .category-budget-row input[type="number"] { flex: 1; padding: 8px 12px; border: 1px solid var(--divider-color, #e0e0e0); border-radius: 6px; font-size: 13px; text-align: right; }
        .category-budget-row .remove-budget-btn { width: 32px; height: 32px; border: none; background: none; cursor: pointer; color: var(--secondary-text-color, #757575); display: flex; align-items: center; justify-content: center; border-radius: 50%; flex-shrink: 0; }
        .category-budget-row .remove-budget-btn:hover { background-color: rgba(244, 67, 54, 0.1); color: var(--error-color, #f44336); }
        .category-budget-row .remove-budget-btn svg { width: 18px; height: 18px; }
        .add-category-budget-btn { display: flex; align-items: center; gap: 6px; padding: 8px 12px; border: 1px dashed var(--divider-color, #e0e0e0); background: none; border-radius: 6px; font-size: 13px; color: var(--secondary-text-color, #757575); cursor: pointer; width: 100%; justify-content: center; }
        .add-category-budget-btn:hover { border-color: var(--primary-color, #03a9f4); color: var(--primary-color, #03a9f4); }
        .add-category-budget-btn svg { width: 16px; height: 16px; }
        
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
            budget: attrs.budget || null,
            budget_by_category: attrs.budget_by_category || null,
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
    const dashboardIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M13,3V9H21V3M13,21H21V11H13M3,21H11V15H3M3,13H11V3H3V13Z"/></svg>';
    const projectsIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19,3H14.82C14.4,1.84 13.3,1 12,1C10.7,1 9.6,1.84 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3"/></svg>';
    const receiptsIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M3,22V3H21V22L18,20L15,22L12,20L9,22L6,20L3,22M17,9V7H7V9H17M15,13V11H7V13H15M13,17V15H7V17H13Z"/></svg>';
    const merchantsIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M18.36,9L18.96,12H5.04L5.64,9H18.36M20,4H4V6H20V4M20,7H4L3,12V14H4V20H14V14H18V20H20V14H21V12L20,7M6,18V14H12V18H6Z"/></svg>';
    const categoriesIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12L14.25,12L12,7.39L9.75,12L4,12A8,8 0 0,1 12,4Z"/></svg>';
    const settingsIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/></svg>';

    this._container.innerHTML = `
      ${this._renderMobileAppBar()}
      ${this._renderMainNav(dashboardIcon, projectsIcon, receiptsIcon, merchantsIcon, categoriesIcon, settingsIcon, allReceipts, merchants, categories)}
      <div class="main-content">
        <div class="container">
          ${this._state.activeTab === 'dashboard' ? this._renderDashboardTab(allReceipts, merchants, categories, openProjects) : ''}
          ${this._state.activeTab === 'projects' ? this._renderProjectsTab(openProjects, closedProjects) : ''}
          ${this._state.activeTab === 'receipts' ? this._renderReceiptsTab(allReceipts) : ''}
          ${this._state.activeTab === 'merchants' ? this._renderMerchantsTab(merchants) : ''}
          ${this._state.activeTab === 'categories' ? this._renderCategoriesTab(categories) : ''}
          ${this._state.activeTab === 'settings' ? this._renderSettingsTab() : ''}
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

  _renderMainNav(dashboardIcon, projectsIcon, receiptsIcon, merchantsIcon, categoriesIcon, settingsIcon, allReceipts, merchants, categories) {
    const isDashboard = this._state.activeTab === 'dashboard';
    const isProjects = this._state.activeTab === 'projects';
    const isReceipts = this._state.activeTab === 'receipts';
    const isMerchants = this._state.activeTab === 'merchants';
    const isCategories = this._state.activeTab === 'categories';
    const isSettings = this._state.activeTab === 'settings';

    return '<nav class="main-nav">' +
      '<button class="main-nav-item ' + (isDashboard ? 'active' : '') + '" data-tab="dashboard">' + dashboardIcon + '<span class="nav-label">' + this._t('dashboard') + '</span></button>' +
      '<button class="main-nav-item ' + (isProjects ? 'active' : '') + '" data-tab="projects">' + projectsIcon + '<span class="nav-label">' + this._t('projects') + '<span class="nav-badge">' + this._state.projects.length + '</span></span></button>' +
      '<button class="main-nav-item ' + (isReceipts ? 'active' : '') + '" data-tab="receipts">' + receiptsIcon + '<span class="nav-label">' + this._t('receipts') + '<span class="nav-badge">' + allReceipts.length + '</span></span></button>' +
      '<button class="main-nav-item ' + (isMerchants ? 'active' : '') + '" data-tab="merchants">' + merchantsIcon + '<span class="nav-label">' + this._t('merchants') + '<span class="nav-badge">' + merchants.length + '</span></span></button>' +
      '<button class="main-nav-item ' + (isCategories ? 'active' : '') + '" data-tab="categories">' + categoriesIcon + '<span class="nav-label">' + this._t('categories') + '<span class="nav-badge">' + categories.length + '</span></span></button>' +
      '<button class="main-nav-item ' + (isSettings ? 'active' : '') + '" data-tab="settings">' + settingsIcon + '<span class="nav-label">' + this._t('settings') + '</span></button>' +
    '</nav>';
  }

  _renderFAB() {
    const addIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/></svg>';
    return '<button class="fab" data-action="quick-add-receipt" title="' + this._t('quickAddReceipt') + '">' + addIcon + '</button>';
  }

  // ==================== DASHBOARD TAB ====================
  
  _renderDashboardTab(allReceipts, merchants, categories, openProjects) {
    // Filter receipts by time period
    const filteredReceipts = this._filterReceiptsByPeriod(allReceipts);
    
    // If no data, show empty state
    if (allReceipts.length === 0) {
      return this._renderDashboardEmpty();
    }
    
    // Calculate stats
    const totalSpend = filteredReceipts.reduce((sum, r) => sum + (r.total || 0), 0);
    const avgPerReceipt = filteredReceipts.length > 0 ? totalSpend / filteredReceipts.length : 0;
    
    // Get category data for filtered receipts
    const categoryData = this._getCategoryData(filteredReceipts);
    const merchantData = this._getMerchantData(filteredReceipts);
    const projectData = this._getProjectData(filteredReceipts);
    const timelineData = this._getTimelineData(filteredReceipts);
    
    // Budget health
    const projectsWithBudget = this._state.projects.filter(p => p.budget && p.budget > 0);
    const onTrack = projectsWithBudget.filter(p => (p.spend / p.budget) < 0.75).length;
    const atRisk = projectsWithBudget.filter(p => (p.spend / p.budget) >= 0.75 && (p.spend / p.budget) < 1).length;
    const overBudget = projectsWithBudget.filter(p => (p.spend / p.budget) >= 1).length;
    
    return '<div class="page-header">' +
        '<h1>' + this._t('dashboard') + '</h1>' +
        this._renderTimePeriodSelector() +
      '</div>' +
      '<div class="dashboard-grid">' +
        // Summary stats card
        this._renderSummaryCard(totalSpend, filteredReceipts.length, avgPerReceipt, this._state.projects.length) +
        // Budget health card
        this._renderBudgetHealthCard(projectsWithBudget.length, onTrack, atRisk, overBudget) +
        // Spending timeline
        this._renderTimelineCard(timelineData) +
        // Category breakdown
        this._renderDonutCard(this._t('spendByCategory'), categoryData, totalSpend) +
        // Top merchants
        this._renderBarCard(this._t('topMerchants'), merchantData) +
        // Project spending
        this._renderDonutCard(this._t('spendByProject'), projectData, totalSpend) +
        // Budget tracking
        this._renderBudgetTrackingCard(projectsWithBudget) +
        // Recent activity
        this._renderRecentActivityCard(filteredReceipts.slice(0, 10)) +
      '</div>';
  }
  
  _renderDashboardEmpty() {
    const chartIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M22,21H2V3H4V19H6V10H10V19H12V6H16V19H18V14H22V21Z"/></svg>';
    return '<div class="dashboard-empty">' +
      '<div class="dashboard-empty-icon">' + chartIcon + '</div>' +
      '<div class="dashboard-empty-title">' + this._t('noDataYet') + '</div>' +
      '<div class="dashboard-empty-desc">' + this._t('noDataYetDesc') + '</div>' +
    '</div>';
  }
  
  _renderTimePeriodSelector() {
    const periods = [
      { id: 'thisMonth', label: this._t('thisMonth') },
      { id: 'lastMonth', label: this._t('lastMonth') },
      { id: 'last3Months', label: this._t('last3Months') },
      { id: 'thisYear', label: this._t('thisYear') },
      { id: 'allTime', label: this._t('allTime') },
    ];
    
    let html = '<div class="time-period-selector">';
    periods.forEach(p => {
      const active = this._state.dashboardPeriod === p.id ? ' active' : '';
      html += '<button class="time-period-btn' + active + '" data-action="set-period" data-period="' + p.id + '">' + p.label + '</button>';
    });
    html += '</div>';
    return html;
  }
  
  _filterReceiptsByPeriod(receipts) {
    const now = new Date();
    const period = this._state.dashboardPeriod || 'allTime';
    
    if (period === 'allTime') return receipts;
    
    let startDate;
    switch (period) {
      case 'thisMonth':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'lastMonth':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        return receipts.filter(r => {
          const d = new Date(r.date);
          return d >= startDate && d <= endOfLastMonth;
        });
      case 'last3Months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        break;
      case 'last6Months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        break;
      case 'thisYear':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        return receipts;
    }
    
    return receipts.filter(r => new Date(r.date) >= startDate);
  }
  
  _getCategoryData(receipts) {
    const map = new Map();
    receipts.forEach(r => {
      const cats = r.category_summary ? r.category_summary.split(',').map(c => c.trim()).filter(c => c) : [this._t('uncategorized')];
      const amountPer = (r.total || 0) / cats.length;
      cats.forEach(cat => {
        const existing = map.get(cat) || 0;
        map.set(cat, existing + amountPer);
      });
    });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }
  
  _getMerchantData(receipts) {
    const map = new Map();
    receipts.forEach(r => {
      if (r.merchant) {
        const existing = map.get(r.merchant) || 0;
        map.set(r.merchant, existing + (r.total || 0));
      }
    });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }
  
  _getProjectData(receipts) {
    const map = new Map();
    receipts.forEach(r => {
      const name = r.project_name || this._t('unknown');
      const existing = map.get(name) || 0;
      map.set(name, existing + (r.total || 0));
    });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }
  
  _getTimelineData(receipts) {
    // Group by month
    const map = new Map();
    const now = new Date();
    
    // Initialize last 12 months
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toISOString().substring(0, 7); // YYYY-MM
      map.set(key, { month: key, value: 0, label: this._formatMonth(d) });
    }
    
    receipts.forEach(r => {
      if (r.date) {
        const key = r.date.substring(0, 7);
        if (map.has(key)) {
          map.get(key).value += r.total || 0;
        }
      }
    });
    
    return Array.from(map.values());
  }
  
  _formatMonth(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[date.getMonth()];
  }
  
  _renderSummaryCard(totalSpend, receiptCount, avgPerReceipt, projectCount) {
    return '<div class="dashboard-card full-width">' +
      '<div class="dashboard-card-header"><h3>' + this._t('spendingOverview') + '</h3></div>' +
      '<div class="dashboard-card-body">' +
        '<div class="summary-stats">' +
          '<div class="summary-stat">' +
            '<div class="summary-stat-value">' + this._formatCurrency(totalSpend) + '</div>' +
            '<div class="summary-stat-label">' + this._t('totalSpend') + '</div>' +
          '</div>' +
          '<div class="summary-stat">' +
            '<div class="summary-stat-value">' + receiptCount + '</div>' +
            '<div class="summary-stat-label">' + this._t('totalReceipts') + '</div>' +
          '</div>' +
          '<div class="summary-stat">' +
            '<div class="summary-stat-value">' + this._formatCurrency(avgPerReceipt) + '</div>' +
            '<div class="summary-stat-label">' + this._t('averagePerReceipt') + '</div>' +
          '</div>' +
          '<div class="summary-stat">' +
            '<div class="summary-stat-value">' + projectCount + '</div>' +
            '<div class="summary-stat-label">' + this._t('totalProjects') + '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }
  
  _renderBudgetHealthCard(total, onTrack, atRisk, overBudget) {
    if (total === 0) {
      return '<div class="dashboard-card">' +
        '<div class="dashboard-card-header"><h3>' + this._t('budgetHealth') + '</h3></div>' +
        '<div class="dashboard-card-body" style="text-align: center; color: var(--secondary-text-color); padding: 40px 20px;">' +
          this._t('noBudget') +
        '</div>' +
      '</div>';
    }
    
    return '<div class="dashboard-card">' +
      '<div class="dashboard-card-header"><h3>' + this._t('budgetHealth') + '</h3></div>' +
      '<div class="dashboard-card-body">' +
        '<div class="budget-health-grid">' +
          '<div class="budget-health-card on-track">' +
            '<div class="budget-health-value">' + onTrack + '</div>' +
            '<div class="budget-health-label">' + this._t('onTrack') + '</div>' +
          '</div>' +
          '<div class="budget-health-card at-risk">' +
            '<div class="budget-health-value">' + atRisk + '</div>' +
            '<div class="budget-health-label">' + this._t('atRisk') + '</div>' +
          '</div>' +
          '<div class="budget-health-card over-budget">' +
            '<div class="budget-health-value">' + overBudget + '</div>' +
            '<div class="budget-health-label">' + this._t('overBudgetCount') + '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }
  
  _renderTimelineCard(data) {
    const maxValue = Math.max(...data.map(d => d.value), 1);
    const height = 160;
    const padding = 20;
    const barWidth = (100 / data.length) - 1;
    
    // Build SVG bars
    let barsHtml = '';
    data.forEach((d, i) => {
      const barHeight = (d.value / maxValue) * (height - padding * 2);
      const x = (i / data.length) * 100 + 0.5;
      const y = height - padding - barHeight;
      const color = CHART_COLORS[i % CHART_COLORS.length];
      barsHtml += '<rect x="' + x + '%" y="' + y + '" width="' + barWidth + '%" height="' + barHeight + '" fill="' + color + '" rx="3" class="timeline-bar" data-value="' + this._formatCurrency(d.value) + '" data-label="' + d.label + '"/>';
    });
    
    // Labels
    let labelsHtml = '<div class="timeline-chart-labels">';
    data.forEach((d, i) => {
      if (i % 2 === 0 || data.length <= 6) {
        labelsHtml += '<span>' + d.label + '</span>';
      }
    });
    labelsHtml += '</div>';
    
    return '<div class="dashboard-card full-width">' +
      '<div class="dashboard-card-header"><h3>' + this._t('spendingTimeline') + '</h3></div>' +
      '<div class="dashboard-card-body">' +
        '<div class="timeline-chart">' +
          '<svg viewBox="0 0 100 ' + height + '" preserveAspectRatio="none">' +
            barsHtml +
          '</svg>' +
        '</div>' +
        labelsHtml +
      '</div>' +
    '</div>';
  }
  
  _renderDonutCard(title, data, total) {
    if (data.length === 0) {
      return '<div class="dashboard-card">' +
        '<div class="dashboard-card-header"><h3>' + title + '</h3></div>' +
        '<div class="dashboard-card-body" style="text-align: center; color: var(--secondary-text-color); padding: 40px 20px;">' +
          this._t('noDataYet') +
        '</div>' +
      '</div>';
    }
    
    // Calculate donut segments
    const radius = 70;
    const strokeWidth = 25;
    const circumference = 2 * Math.PI * radius;
    let currentOffset = 0;
    
    let segmentsHtml = '';
    let legendHtml = '';
    
    data.forEach((d, i) => {
      const percentage = total > 0 ? (d.value / total) * 100 : 0;
      const segmentLength = (percentage / 100) * circumference;
      const color = CHART_COLORS[i % CHART_COLORS.length];
      
      segmentsHtml += '<circle cx="80" cy="80" r="' + radius + '" fill="none" stroke="' + color + '" stroke-width="' + strokeWidth + '" ' +
        'stroke-dasharray="' + segmentLength + ' ' + (circumference - segmentLength) + '" ' +
        'stroke-dashoffset="' + (-currentOffset) + '" ' +
        'style="transition: stroke-dashoffset 0.5s ease;"/>';
      
      currentOffset += segmentLength;
      
      legendHtml += '<div class="donut-legend-item">' +
        '<div class="donut-legend-color" style="background-color: ' + color + ';"></div>' +
        '<div class="donut-legend-label">' + this._escapeHtml(d.name) + '</div>' +
        '<div class="donut-legend-value">' + this._formatCurrency(d.value) + '</div>' +
        '<div class="donut-legend-percent">(' + percentage.toFixed(0) + '%)</div>' +
      '</div>';
    });
    
    return '<div class="dashboard-card">' +
      '<div class="dashboard-card-header"><h3>' + title + '</h3></div>' +
      '<div class="dashboard-card-body">' +
        '<div class="donut-chart-container">' +
          '<div class="donut-chart">' +
            '<svg viewBox="0 0 160 160">' +
              '<circle cx="80" cy="80" r="' + radius + '" fill="none" stroke="var(--divider-color, #e0e0e0)" stroke-width="' + strokeWidth + '"/>' +
              segmentsHtml +
            '</svg>' +
            '<div class="donut-chart-center">' +
              '<div class="donut-chart-center-value">' + this._formatCurrency(total) + '</div>' +
              '<div class="donut-chart-center-label">' + this._t('totalSpend') + '</div>' +
            '</div>' +
          '</div>' +
          '<div class="donut-legend">' + legendHtml + '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }
  
  _renderBarCard(title, data) {
    if (data.length === 0) {
      return '<div class="dashboard-card">' +
        '<div class="dashboard-card-header"><h3>' + title + '</h3></div>' +
        '<div class="dashboard-card-body" style="text-align: center; color: var(--secondary-text-color); padding: 40px 20px;">' +
          this._t('noDataYet') +
        '</div>' +
      '</div>';
    }
    
    const maxValue = Math.max(...data.map(d => d.value), 1);
    
    let barsHtml = '';
    data.forEach((d, i) => {
      const percentage = (d.value / maxValue) * 100;
      const color = CHART_COLORS[i % CHART_COLORS.length];
      
      barsHtml += '<div class="bar-chart-row">' +
        '<div class="bar-chart-label" title="' + this._escapeHtml(d.name) + '">' + this._escapeHtml(d.name) + '</div>' +
        '<div class="bar-chart-bar-container">' +
          '<div class="bar-chart-bar" style="width: ' + percentage + '%; background-color: ' + color + ';"></div>' +
        '</div>' +
        '<div class="bar-chart-value">' + this._formatCurrency(d.value) + '</div>' +
      '</div>';
    });
    
    return '<div class="dashboard-card">' +
      '<div class="dashboard-card-header"><h3>' + title + '</h3></div>' +
      '<div class="dashboard-card-body">' +
        '<div class="bar-chart">' + barsHtml + '</div>' +
      '</div>' +
    '</div>';
  }
  
  _renderBudgetTrackingCard(projectsWithBudget) {
    if (projectsWithBudget.length === 0) {
      return '<div class="dashboard-card">' +
        '<div class="dashboard-card-header"><h3>' + this._t('budgetOverview') + '</h3></div>' +
        '<div class="dashboard-card-body" style="text-align: center; color: var(--secondary-text-color); padding: 40px 20px;">' +
          this._t('noBudget') +
        '</div>' +
      '</div>';
    }
    
    let listHtml = '';
    projectsWithBudget.forEach(p => {
      const percentage = Math.min((p.spend / p.budget) * 100, 100);
      const actualPercent = (p.spend / p.budget) * 100;
      let statusClass = 'on-track';
      if (actualPercent >= 100) statusClass = 'over-budget';
      else if (actualPercent >= 75) statusClass = 'at-risk';
      
      listHtml += '<div class="budget-project-item">' +
        '<div class="budget-project-info">' +
          '<div class="budget-project-name">' + this._escapeHtml(p.name) + '</div>' +
          '<div class="budget-project-amount">' + this._formatCurrency(p.spend) + ' / ' + this._formatCurrency(p.budget) + '</div>' +
        '</div>' +
        '<div class="budget-project-bar">' +
          '<div class="budget-project-progress ' + statusClass + '" style="width: ' + percentage + '%;"></div>' +
        '</div>' +
        '<div class="budget-project-percent ' + statusClass + '">' + actualPercent.toFixed(0) + '%</div>' +
      '</div>';
    });
    
    return '<div class="dashboard-card">' +
      '<div class="dashboard-card-header"><h3>' + this._t('budgetOverview') + '</h3></div>' +
      '<div class="dashboard-card-body no-padding">' +
        '<div class="budget-project-list" style="padding: 0 20px 20px;">' + listHtml + '</div>' +
      '</div>' +
    '</div>';
  }
  
  _renderRecentActivityCard(receipts) {
    if (receipts.length === 0) {
      return '<div class="dashboard-card">' +
        '<div class="dashboard-card-header"><h3>' + this._t('recentActivity') + '</h3></div>' +
        '<div class="dashboard-card-body" style="text-align: center; color: var(--secondary-text-color); padding: 40px 20px;">' +
          this._t('noReceiptsYet') +
        '</div>' +
      '</div>';
    }
    
    // Sort by date descending
    const sorted = [...receipts].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    let listHtml = '';
    sorted.forEach((r, i) => {
      const color = CHART_COLORS[i % CHART_COLORS.length];
      const receiptIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M3,22V3H21V22L18,20L15,22L12,20L9,22L6,20L3,22M17,9V7H7V9H17M15,13V11H7V13H15M13,17V15H7V17H13Z"/></svg>';
      
      listHtml += '<div class="activity-item">' +
        '<div class="activity-icon" style="background-color: ' + color + '20; color: ' + color + ';">' + receiptIcon + '</div>' +
        '<div class="activity-content">' +
          '<div class="activity-title">' + this._escapeHtml(r.merchant || this._t('unknown')) + '</div>' +
          '<div class="activity-meta">' + (r.project_name || '') + ' • ' + this._formatDate(r.date) + '</div>' +
        '</div>' +
        '<div class="activity-amount">' + this._formatCurrency(r.total || 0) + '</div>' +
      '</div>';
    });
    
    return '<div class="dashboard-card">' +
      '<div class="dashboard-card-header"><h3>' + this._t('recentActivity') + '</h3></div>' +
      '<div class="dashboard-card-body no-padding">' +
        '<div class="activity-list" style="padding: 0 20px 20px;">' + listHtml + '</div>' +
      '</div>' +
    '</div>';
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

  _renderSettingsTab() {
    const status = this._state.storageStatus;
    const cloudIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19.35,10.04C18.67,6.59 15.64,4 12,4C9.11,4 6.6,5.64 5.35,8.04C2.34,8.36 0,10.91 0,14A6,6 0 0,0 6,20H19A5,5 0 0,0 24,15C24,12.36 21.95,10.22 19.35,10.04Z"/></svg>';
    const localIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M6,2H18A2,2 0 0,1 20,4V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V4A2,2 0 0,1 6,2M6,4V8H18V4H6M6,10V14H18V10H6M6,16V20H18V16H6Z"/></svg>';
    const checkIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>';
    const warningIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z"/></svg>';
    
    // Provider icons
    const providerIcons = {
      local: localIcon,
      google_drive: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M7.71,3.5L1.15,15L4.58,21L11.13,9.5M9.73,15L6.3,21H19.42L22.85,15M22.28,14L15.42,2H8.58L8.57,2L15.43,14H22.28Z"/></svg>',
      onedrive: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M18.5 16C20.43 16 22 14.43 22 12.5C22 10.73 20.67 9.26 18.93 9.03C18.5 6.77 16.5 5.09 14.12 5.01C12.23 2.77 8.91 2.43 6.67 4.32C5.85 5 5.24 5.91 4.92 6.93C2.55 7.3 .5 9.3 .5 11.87C.5 14.29 2.31 16 4.74 16H18.5Z"/></svg>',
      dropbox: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12,6.19L17,10.19L12,14.19L7,10.19L12,6.19M6.5,12.19L12,16.19L17.5,12.19L12,8.19L6.5,12.19M12,2L3,8L6.5,10.81L3,13.5L12,19.5L21,13.5L17.5,10.81L21,8L12,2Z"/></svg>',
      webdav: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M4,1C2.89,1 2,1.89 2,3V7C2,8.11 2.89,9 4,9H1V11H13V9H10C11.11,9 12,8.11 12,7V3C12,1.89 11.11,1 10,1H4M4,3H10V7H4V3M3,13V18L3,20H10V18H5V13H3M14,13C12.89,13 12,13.89 12,15V19C12,20.11 12.89,21 14,21H20C21.11,21 22,20.11 22,19V15C22,13.89 21.11,13 20,13H14M14,15H20V19H14V15Z"/></svg>',
    };

    // If no status loaded yet, show loading
    if (!status) {
      return '<div class="page-header"><h1>' + this._t('settings') + '</h1></div>' +
        '<div class="card"><div class="card-content" style="padding: 24px; text-align: center;">' + this._t('loading') + '</div></div>';
    }

    // Current storage status card
    const currentProvider = status.providers?.find(p => p.type === status.provider) || { name: this._t('localStorage'), type: 'local' };
    const isConnected = status.connected && status.authenticated;
    
    let statusBadge = isConnected 
      ? '<span class="storage-status-badge connected">' + checkIcon + ' ' + this._t('connected') + '</span>'
      : '<span class="storage-status-badge not-connected">' + warningIcon + ' ' + this._t('notConnected') + '</span>';
    
    let storageInfo = '';
    if (status.storage_used && status.storage_total) {
      const usedGB = (status.storage_used / (1024 * 1024 * 1024)).toFixed(2);
      const totalGB = (status.storage_total / (1024 * 1024 * 1024)).toFixed(2);
      storageInfo = '<div class="storage-info">' + this._t('storageUsed') + ': ' + usedGB + ' GB / ' + totalGB + ' GB</div>';
    }

    // Disconnect button for cloud providers
    let disconnectBtn = '';
    if (status.provider !== 'local' && isConnected) {
      disconnectBtn = '<button class="secondary-btn" data-action="storage-disconnect">' + this._t('disconnect') + '</button>';
    }

    // Current storage card
    let currentStorageCard = '<div class="card settings-card">' +
      '<div class="card-header"><h2>' + this._t('currentStorage') + '</h2></div>' +
      '<div class="card-content">' +
        '<div class="current-storage-info">' +
          '<div class="storage-provider-icon">' + (providerIcons[status.provider] || localIcon) + '</div>' +
          '<div class="storage-provider-details">' +
            '<div class="storage-provider-name">' + currentProvider.name + '</div>' +
            statusBadge +
            storageInfo +
          '</div>' +
          disconnectBtn +
        '</div>' +
      '</div>' +
    '</div>';

    // Auth code input for OAuth providers
    let authSection = '';
    if (status.auth_url && !isConnected && status.provider !== 'local') {
      authSection = '<div class="card settings-card">' +
        '<div class="card-header"><h2>' + this._t('authenticate') + '</h2></div>' +
        '<div class="card-content">' +
          '<p class="settings-desc">' + this._t('oauthInstructions') + '</p>' +
          '<a href="' + status.auth_url + '" target="_blank" rel="noopener noreferrer" class="primary-btn oauth-link">' + this._t('authenticate') + '</a>' +
          '<div class="auth-code-section">' +
            '<p class="settings-desc">' + this._t('pasteAuthCode') + '</p>' +
            '<div class="auth-code-input-row">' +
              '<input type="text" class="form-input auth-code-input" placeholder="' + this._t('authCode') + '" value="' + (this._state.authCodeInput || '') + '" data-input="auth-code">' +
              '<button class="primary-btn" data-action="submit-auth-code">' + this._t('submitAuthCode') + '</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    }

    // Provider selection cards
    let providersSection = '<div class="card settings-card">' +
      '<div class="card-header"><h2>' + this._t('switchProvider') + '</h2></div>' +
      '<div class="card-content">' +
        '<p class="settings-desc">' + this._t('storageProviderDesc') + '</p>' +
        '<div class="provider-list">';

    for (const provider of (status.providers || [])) {
      const isActive = provider.type === status.provider;
      const isAvailable = provider.available;
      const isConfigured = provider.configured;
      
      let providerStatus = '';
      let actionBtn = '';
      
      if (isActive && isConnected) {
        providerStatus = '<span class="provider-badge active">' + this._t('connected') + '</span>';
      } else if (!isAvailable) {
        providerStatus = '<span class="provider-badge unavailable">' + this._t('notAvailableYet') + '</span>';
      } else if (!isConfigured && provider.type !== 'local' && provider.type !== 'webdav') {
        // Cloud provider not configured - show informational badge only
        // User needs to remove and re-add the integration to use cloud storage
        providerStatus = '<span class="provider-badge not-configured">' + this._t('notConfigured') + '</span>';
      } else if (!isActive && provider.type === 'local') {
        // Can switch to local without re-adding
        actionBtn = '<button class="secondary-btn small" data-action="select-provider" data-provider="' + provider.type + '">' + this._t('connect') + '</button>';
      }
      
      let providerDesc = '';
      switch(provider.type) {
        case 'local': providerDesc = this._t('localStorageDesc'); break;
        case 'google_drive': providerDesc = this._t('googleDriveDesc'); break;
        case 'onedrive': providerDesc = this._t('oneDriveDesc'); break;
        case 'dropbox': providerDesc = this._t('dropboxDesc'); break;
        case 'webdav': providerDesc = this._t('webdavDesc'); break;
      }

      providersSection += '<div class="provider-item ' + (isActive ? 'active' : '') + ' ' + (!isAvailable ? 'disabled' : '') + '">' +
        '<div class="provider-icon">' + (providerIcons[provider.type] || cloudIcon) + '</div>' +
        '<div class="provider-info">' +
          '<div class="provider-name">' + provider.name + '</div>' +
          '<div class="provider-desc">' + providerDesc + '</div>' +
        '</div>' +
        providerStatus +
        actionBtn +
      '</div>';
    }

    providersSection += '</div></div></div>';

    // Info card about cloud storage configuration
    const infoIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/></svg>';
    let infoCard = '<div class="card settings-card info-card">' +
      '<div class="card-content">' +
        '<div class="info-row">' +
          '<span class="info-icon">' + infoIcon + '</span>' +
          '<p class="settings-desc" style="margin: 0;">' + this._t('cloudStorageInfoDesc') + '</p>' +
        '</div>' +
      '</div>' +
    '</div>';

    return '<div class="page-header"><h1>' + this._t('settings') + '</h1></div>' +
      currentStorageCard +
      authSection +
      providersSection +
      infoCard +
      this._renderSettingsStyles();
  }

  _renderSettingsStyles() {
    return '<style>' +
      '.settings-card { margin-bottom: 16px; }' +
      '.settings-card .card-header { padding: 16px 16px 8px 16px; }' +
      '.settings-card .card-header h2 { margin: 0; font-size: 18px; font-weight: 500; }' +
      '.settings-card .card-content { padding: 8px 16px 16px 16px; }' +
      '.settings-desc { color: var(--secondary-text-color); font-size: 14px; margin: 0 0 16px 0; }' +
      '.current-storage-info { display: flex; align-items: center; gap: 16px; padding: 16px; background: var(--secondary-background-color); border-radius: 8px; }' +
      '.storage-provider-icon { width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; background: var(--primary-color); color: white; border-radius: 12px; }' +
      '.storage-provider-icon svg { width: 28px; height: 28px; }' +
      '.storage-provider-details { flex: 1; }' +
      '.storage-provider-name { font-size: 18px; font-weight: 500; margin-bottom: 4px; }' +
      '.storage-status-badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 500; }' +
      '.storage-status-badge.connected { background: var(--success-color, #4caf50); color: white; }' +
      '.storage-status-badge.not-connected { background: var(--warning-color, #ff9800); color: white; }' +
      '.storage-status-badge svg { width: 14px; height: 14px; }' +
      '.storage-info { margin-top: 8px; font-size: 13px; color: var(--secondary-text-color); }' +
      '.provider-list { display: flex; flex-direction: column; gap: 8px; }' +
      '.provider-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: var(--secondary-background-color); border-radius: 8px; transition: background-color 0.2s; }' +
      '.provider-item.active { background: var(--primary-color); color: white; }' +
      '.provider-item.active .provider-desc { color: rgba(255,255,255,0.8); }' +
      '.provider-item.disabled { opacity: 0.6; }' +
      '.provider-icon { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; }' +
      '.provider-icon svg { width: 24px; height: 24px; }' +
      '.provider-info { flex: 1; }' +
      '.provider-name { font-weight: 500; }' +
      '.provider-desc { font-size: 12px; color: var(--secondary-text-color); margin-top: 2px; }' +
      '.provider-badge { padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 500; }' +
      '.provider-badge.active { background: rgba(255,255,255,0.2); }' +
      '.provider-badge.unavailable { background: var(--disabled-color, #9e9e9e); color: white; }' +
      '.provider-badge.not-configured { background: var(--warning-color, #ff9800); color: white; }' +
      '.secondary-btn { padding: 8px 16px; border: 1px solid var(--divider-color); background: transparent; color: var(--primary-text-color); border-radius: 20px; font-size: 14px; cursor: pointer; }' +
      '.secondary-btn:hover { background: var(--secondary-background-color); }' +
      '.secondary-btn.small { padding: 6px 12px; font-size: 12px; }' +
      '.primary-btn { padding: 10px 20px; background: var(--primary-color); color: white; border: none; border-radius: 20px; font-size: 14px; cursor: pointer; text-decoration: none; display: inline-block; }' +
      '.primary-btn:hover { opacity: 0.9; }' +
      '.oauth-link { margin-bottom: 16px; }' +
      '.auth-code-section { margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--divider-color); }' +
      '.auth-code-input-row { display: flex; gap: 8px; }' +
      '.auth-code-input { flex: 1; }' +
      '.provider-item.active .secondary-btn { border-color: rgba(255,255,255,0.3); color: white; }' +
      '.provider-item.active .secondary-btn:hover { background: rgba(255,255,255,0.1); }' +
      '.info-card { background: var(--secondary-background-color); }' +
      '.info-row { display: flex; align-items: flex-start; gap: 12px; }' +
      '.info-icon { color: var(--primary-color); flex-shrink: 0; }' +
      '.info-icon svg { width: 24px; height: 24px; }' +
    '</style>';
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
    
    // Budget progress indicator
    let budgetHtml = '';
    if (project.budget && project.budget > 0) {
      const spent = project.spend || 0;
      const percentage = Math.min(100, (spent / project.budget) * 100);
      const remaining = project.budget - spent;
      const isOver = remaining < 0;
      const progressClass = isOver ? 'over' : (percentage > 80 ? 'warning' : '');
      budgetHtml = '<div class="project-budget">' +
        '<div class="budget-bar ' + progressClass + '">' +
          '<div class="budget-progress" style="width: ' + percentage + '%"></div>' +
        '</div>' +
        '<span class="budget-text ' + progressClass + '">' + 
          this._formatCurrency(spent) + ' / ' + this._formatCurrency(project.budget) +
          (isOver ? ' (' + this._t('overBudget') + ')' : '') +
        '</span>' +
      '</div>';
    }
    
    return '<div class="project-wrapper">' +
      '<div class="project-item ' + (isExpanded ? 'expanded' : '') + '" data-project-id="' + project.project_id + '">' +
        '<div class="project-icon ' + project.status + '">' + icon + '</div>' +
        '<div class="project-content">' +
          '<div class="project-name">' + this._escapeHtml(project.name) + '</div>' +
          '<div class="project-meta">' + this._escapeHtml(areaName) + ' &middot; ' + (project.receipts?.length || 0) + ' ' + receiptText(project.receipts?.length || 0) + '</div>' +
          budgetHtml +
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
    
    // Budget summary for detailed view
    let budgetSummaryHtml = '';
    if (project.budget && project.budget > 0) {
      const spent = project.spend || 0;
      const remaining = project.budget - spent;
      const isOver = remaining < 0;
      const statusClass = isOver ? 'over' : (spent / project.budget > 0.8 ? 'warning' : '');
      
      budgetSummaryHtml = '<div class="budget-summary">' +
        '<div class="budget-summary-item">' +
          '<span class="budget-label">' + this._t('budget') + '</span>' +
          '<span class="budget-value">' + this._formatCurrency(project.budget) + '</span>' +
        '</div>' +
        '<div class="budget-summary-item">' +
          '<span class="budget-label">' + this._t('spent') + '</span>' +
          '<span class="budget-value">' + this._formatCurrency(spent) + '</span>' +
        '</div>' +
        '<div class="budget-summary-item ' + statusClass + '">' +
          '<span class="budget-label">' + (isOver ? this._t('overBudget') : this._t('remaining')) + '</span>' +
          '<span class="budget-value">' + this._formatCurrency(Math.abs(remaining)) + '</span>' +
        '</div>' +
      '</div>';
    }
    
    let receiptsHtml = '';
    if (receipts.length === 0) {
      receiptsHtml = '<div class="empty-receipts">' + this._t('noReceiptsInProject') + '</div>';
    } else {
      receiptsHtml = '<div class="receipt-list">' + receipts.map(r => this._renderReceiptItem(r, project.project_id)).join('') + '</div>';
    }

    return '<div class="project-detail">' +
      budgetSummaryHtml +
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
    const removeIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/></svg>';
    const addIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/></svg>';

    // Build area options
    let areaOptions = '<option value="">' + this._t('noArea') + '</option>';
    Object.entries(this._state.areas).forEach(([id, name]) => {
      const selected = data.area_id === id ? ' selected' : '';
      areaOptions += '<option value="' + id + '"' + selected + '>' + this._escapeHtml(name) + '</option>';
    });
    
    // Get category budgets from state or from data
    const categoryBudgets = this._state.categoryBudgets || 
      (data.budget_by_category ? Object.entries(data.budget_by_category).map(([cat, amount]) => ({ category: cat, amount })) : []);
    
    // Render category budget rows with autocomplete
    let categoryBudgetHtml = '<div class="category-budget-list" id="category-budget-list">';
    categoryBudgets.forEach((item, i) => {
      categoryBudgetHtml += '<div class="category-budget-row">' +
        '<div class="autocomplete-container category-budget-autocomplete" data-index="' + i + '">' +
          '<input type="text" class="category-budget-name autocomplete-input" data-index="' + i + '" value="' + this._escapeHtml(item.category || '') + '" placeholder="' + this._t('searchOrTypeNew') + '" autocomplete="off">' +
          '<div class="autocomplete-dropdown category-budget-dropdown" data-index="' + i + '" style="display:none;"></div>' +
        '</div>' +
        '<input type="number" class="category-budget-amount" data-index="' + i + '" value="' + (item.amount || '') + '" placeholder="0" min="0" step="0.01">' +
        '<button type="button" class="remove-budget-btn" data-action="remove-category-budget" data-index="' + i + '">' + removeIcon + '</button>' +
      '</div>';
    });
    categoryBudgetHtml += '</div>' +
      '<button type="button" class="add-category-budget-btn" data-action="add-category-budget">' + addIcon + this._t('addCategoryBudget') + '</button>';

    return '<div class="modal-overlay" data-action="close-modal">' +
      '<div class="modal" onclick="event.stopPropagation()">' +
        '<div class="modal-header">' +
          '<h3>' + title + '</h3>' +
          '<button class="modal-close" data-action="close-modal">' + closeIcon + '</button>' +
        '</div>' +
        '<div class="modal-body">' +
          '<div class="form-group"><label>' + this._t('projectName') + ' *</label><input type="text" id="project-name" value="' + this._escapeHtml(data.name || '') + '" placeholder="' + this._t('projectNamePlaceholder') + '" required></div>' +
          '<div class="form-group"><label>' + this._t('areaOptional') + '</label><select id="project-area">' + areaOptions + '</select></div>' +
          '<div class="form-group"><label>' + this._t('budgetOptional') + '</label><input type="number" id="project-budget" value="' + (data.budget || '') + '" placeholder="' + this._t('budgetPlaceholder') + '" min="0" step="0.01"></div>' +
          '<div class="form-group"><label>' + this._t('budgetByCategory') + '</label>' + categoryBudgetHtml + '</div>' +
        '</div>' +
        '<div class="modal-actions">' +
          '<button class="btn btn-secondary" data-action="close-modal">' + this._t('cancel') + '</button>' +
          '<button class="btn btn-primary" data-action="save-project">' + (isEdit ? this._t('saveChanges') : this._t('createProject')) + '</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  _renderCategoriesSection(data, allCategories, categoryHint) {
    const removeIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/></svg>';
    
    // Get selected categories from modal state (or from existing receipt data)
    // State takes priority, then categories array, then parse category_summary
    let selectedCategories = this._state.selectedCategories;
    if (!selectedCategories) {
      if (data.categories && data.categories.length > 0) {
        selectedCategories = data.categories;
      } else if (data.category_summary) {
        // Parse comma-separated category_summary into array
        selectedCategories = data.category_summary.split(',').map(c => c.trim()).filter(c => c);
      } else {
        selectedCategories = [];
      }
    }
    const splitType = this._state.categorySplitType || data.category_split_type || 'equal';
    const splitValues = this._state.categorySplitValues || data.category_split || {};
    
    // Render selected category tags
    let tagsHtml = '';
    if (selectedCategories.length > 0) {
      tagsHtml = '<div class="category-tags" id="category-tags">' +
        selectedCategories.map((cat, i) => 
          '<span class="category-tag">' + this._escapeHtml(cat) + 
          '<button class="tag-remove" data-action="remove-category" data-index="' + i + '">' + removeIcon + '</button></span>'
        ).join('') +
      '</div>';
    }
    
    // Render split settings only if more than one category is selected
    let splitSettingsHtml = '';
    if (selectedCategories.length > 1) {
      const isEqual = splitType === 'equal';
      const isPercent = splitType === 'percentage';
      const isAbsolute = splitType === 'absolute';
      
      // Get the receipt total for calculations
      const receiptTotal = parseFloat(data.total) || 0;
      
      let splitValuesHtml = '';
      let splitRemainingHtml = '';
      if (!isEqual) {
        splitValuesHtml = '<div class="split-values">' +
          selectedCategories.map(cat => {
            const val = splitValues[cat] || '';
            const suffix = isPercent ? '%' : '';
            return '<div class="split-row">' +
              '<span class="split-category">' + this._escapeHtml(cat) + '</span>' +
              '<input type="number" class="split-value-input" data-category="' + this._escapeHtml(cat) + '" value="' + val + '" placeholder="0" step="0.01" min="0">' +
              '<span class="split-suffix">' + suffix + '</span>' +
            '</div>';
          }).join('') +
        '</div>';
        
        // Calculate allocated and remaining
        const allocated = selectedCategories.reduce((sum, cat) => sum + (parseFloat(splitValues[cat]) || 0), 0);
        const maxValue = isPercent ? 100 : receiptTotal;
        const remaining = maxValue - allocated;
        const percentage = maxValue > 0 ? Math.min((allocated / maxValue) * 100, 100) : 0;
        const isOver = remaining < -0.001; // Small tolerance for floating point
        const isComplete = Math.abs(remaining) < 0.01;
        const barClass = isOver ? 'error' : (isComplete ? 'ok' : 'warning');
        
        // Format numbers appropriately
        const formatNum = (num) => {
          const absNum = Math.abs(num);
          return absNum % 1 === 0 ? absNum.toString() : absNum.toFixed(2).replace(/\.?0+$/, '');
        };
        
        const allocatedDisplay = formatNum(allocated) + (isPercent ? '%' : '');
        const remainingDisplay = formatNum(Math.abs(remaining)) + (isPercent ? '%' : '');
        const maxDisplay = formatNum(maxValue) + (isPercent ? '%' : '');
        
        const remainingLabel = isOver 
          ? this._t('splitOverAllocated') + ' ' + remainingDisplay
          : this._t('splitRemaining') + ': ' + remainingDisplay;
        
        splitRemainingHtml = '<div class="split-remaining">' +
          '<div class="split-remaining-bar">' +
            '<div class="split-remaining-bar-fill ' + barClass + '" style="width: ' + Math.min(percentage, 100) + '%;"></div>' +
          '</div>' +
          '<div class="split-remaining-text">' +
            '<span class="allocated">' + this._t('splitAllocated') + ': ' + allocatedDisplay + ' / ' + maxDisplay + '</span>' +
            '<span class="remaining' + (isOver ? ' over' : '') + '">' + remainingLabel + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="split-error" id="split-error" style="display:none;"></div>';
      }
      
      splitSettingsHtml = '<div class="split-settings">' +
        '<div class="split-type-selector">' +
          '<button type="button" class="split-type-btn' + (isEqual ? ' active' : '') + '" data-action="set-split-type" data-type="equal">' + this._t('splitEqual') + '</button>' +
          '<button type="button" class="split-type-btn' + (isPercent ? ' active' : '') + '" data-action="set-split-type" data-type="percentage">' + this._t('splitPercentage') + '</button>' +
          '<button type="button" class="split-type-btn' + (isAbsolute ? ' active' : '') + '" data-action="set-split-type" data-type="absolute">' + this._t('splitAbsolute') + '</button>' +
        '</div>' +
        splitValuesHtml +
        splitRemainingHtml +
      '</div>';
    }
    
    return '<div class="form-group">' +
      '<label>' + this._t('categoriesOptional') + '</label>' +
      tagsHtml +
      '<div class="autocomplete-container" data-field="category">' +
        '<input type="text" class="autocomplete-input" id="receipt-category" value="" placeholder="' + this._t('searchOrTypeNew') + '" autocomplete="off">' +
        '<svg class="autocomplete-search-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/></svg>' +
        '<div class="autocomplete-dropdown" id="category-dropdown" style="display:none;"></div>' +
      '</div>' +
      '<div class="tag-hint">' + categoryHint + '</div>' +
      splitSettingsHtml +
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
          this._renderCategoriesSection(data, allCategories, categoryHint) +
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
          // Load storage status when switching to settings tab
          if (tab === 'settings') {
            this._loadStorageStatus();
          }
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

    // Autocomplete for category field (multi-select mode)
    const categoryInput = this._container.querySelector("#receipt-category");
    const categoryDropdown = this._container.querySelector("#category-dropdown");
    if (categoryInput && categoryDropdown) {
      this._setupCategoryAutocomplete(categoryInput, categoryDropdown, this._getAllCategories());
    }
    
    // Listen for split value input changes
    this._container.querySelectorAll(".split-value-input").forEach(input => {
      input.addEventListener("input", (e) => {
        const category = e.target.dataset.category;
        const value = parseFloat(e.target.value) || 0;
        if (!this._state.categorySplitValues) {
          this._state.categorySplitValues = {};
        }
        this._state.categorySplitValues[category] = value;
        this._updateSplitRemainingIndicator();
      });
    });
    
    // Listen for receipt total changes to update split remaining
    const receiptTotalInput = this._container.querySelector("#receipt-total");
    if (receiptTotalInput) {
      receiptTotalInput.addEventListener("input", () => {
        this._updateSplitRemainingIndicator();
      });
    }
    
    // Listen for category budget input changes (project modal) with autocomplete
    this._container.querySelectorAll(".category-budget-name").forEach(input => {
      const index = parseInt(input.dataset.index, 10);
      const dropdown = this._container.querySelector('.category-budget-dropdown[data-index="' + index + '"]');
      if (dropdown) {
        this._setupCategoryBudgetAutocomplete(input, dropdown, this._getAllCategories(), index);
      }
    });
    
    this._container.querySelectorAll(".category-budget-amount").forEach(input => {
      input.addEventListener("input", (e) => {
        const index = parseInt(e.target.dataset.index, 10);
        if (!isNaN(index) && this._state.categoryBudgets && this._state.categoryBudgets[index]) {
          this._state.categoryBudgets[index].amount = parseFloat(e.target.value) || 0;
        }
      });
    });

    // Photo upload file input handlers
    const photoUpload = this._container.querySelector("#photo-upload");
    if (photoUpload) {
      photoUpload.addEventListener("change", (e) => this._handlePhotoFiles(e.target.files));
    }
    
    const photoCapture = this._container.querySelector("#photo-capture");
    if (photoCapture) {
      photoCapture.addEventListener("change", (e) => this._handlePhotoFiles(e.target.files));
    }

    // Auth code input for settings
    const authCodeInput = this._container.querySelector(".auth-code-input");
    if (authCodeInput) {
      authCodeInput.addEventListener("input", (e) => {
        this._state.authCodeInput = e.target.value;
      });
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

  _updateSplitRemainingIndicator() {
    // Update the remaining indicator without full re-render
    const remainingBar = this._container.querySelector(".split-remaining-bar-fill");
    const allocatedText = this._container.querySelector(".split-remaining-text .allocated");
    const remainingText = this._container.querySelector(".split-remaining-text .remaining");
    
    if (!remainingBar || !allocatedText || !remainingText) return;
    
    const splitType = this._state.categorySplitType;
    const splitValues = this._state.categorySplitValues || {};
    const selectedCategories = this._state.selectedCategories || [];
    const totalInput = this._container.querySelector("#receipt-total");
    const receiptTotal = totalInput ? parseFloat(totalInput.value) || 0 : 0;
    
    const isPercent = splitType === 'percentage';
    const maxValue = isPercent ? 100 : receiptTotal;
    
    // Calculate allocated amount
    const allocated = selectedCategories.reduce((sum, cat) => sum + (parseFloat(splitValues[cat]) || 0), 0);
    const remaining = maxValue - allocated;
    const percentage = maxValue > 0 ? Math.min((allocated / maxValue) * 100, 100) : 0;
    const isOver = remaining < -0.001;
    const isComplete = Math.abs(remaining) < 0.01;
    
    // Format numbers
    const formatNum = (num) => {
      const absNum = Math.abs(num);
      return absNum % 1 === 0 ? absNum.toString() : absNum.toFixed(2).replace(/\.?0+$/, '');
    };
    
    const suffix = isPercent ? '%' : '';
    const allocatedDisplay = formatNum(allocated) + suffix;
    const remainingDisplay = formatNum(Math.abs(remaining)) + suffix;
    const maxDisplay = formatNum(maxValue) + suffix;
    
    // Update bar
    remainingBar.style.width = Math.min(percentage, 100) + '%';
    remainingBar.className = 'split-remaining-bar-fill ' + (isOver ? 'error' : (isComplete ? 'ok' : 'warning'));
    
    // Update text
    allocatedText.textContent = this._t('splitAllocated') + ': ' + allocatedDisplay + ' / ' + maxDisplay;
    remainingText.textContent = isOver 
      ? this._t('splitOverAllocated') + ' ' + remainingDisplay
      : this._t('splitRemaining') + ': ' + remainingDisplay;
    remainingText.className = 'remaining' + (isOver ? ' over' : '');
  }

  _setupCategoryAutocomplete(input, dropdown, allOptions) {
    let highlightedIndex = -1;
    const checkIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>';
    const plusIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/></svg>';

    const addCategory = (category) => {
      if (!category) return;
      if (!this._state.selectedCategories) {
        this._state.selectedCategories = [];
      }
      // Don't add duplicates
      if (!this._state.selectedCategories.includes(category)) {
        this._state.selectedCategories.push(category);
        this._render();
      }
      input.value = '';
      dropdown.style.display = 'none';
    };

    const showDropdown = (filteredOptions, query) => {
      const selectedCats = this._state.selectedCategories || [];
      // Filter out already selected categories
      const availableOptions = filteredOptions.filter(opt => !selectedCats.includes(opt));
      
      let html = '';
      
      // Show matching options with check icon
      availableOptions.forEach((opt, idx) => {
        const isHighlighted = idx === highlightedIndex ? ' highlighted' : '';
        html += '<div class="autocomplete-item' + isHighlighted + '" data-value="' + this._escapeHtml(opt) + '">' + checkIcon + '<span>' + this._escapeHtml(opt) + '</span></div>';
      });
      
      // Show "Create new" option if query doesn't exactly match any option
      const exactMatch = allOptions.some(opt => opt.toLowerCase() === query.toLowerCase());
      const alreadySelected = selectedCats.some(cat => cat.toLowerCase() === query.toLowerCase());
      if (query && !exactMatch && !alreadySelected) {
        const createIdx = availableOptions.length;
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
          addCategory(item.dataset.value);
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
      const maxIndex = items.length - 1;
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        highlightedIndex = Math.min(highlightedIndex + 1, maxIndex);
        items.forEach((item, idx) => item.classList.toggle('highlighted', idx === highlightedIndex));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        highlightedIndex = Math.max(highlightedIndex - 1, 0);
        items.forEach((item, idx) => item.classList.toggle('highlighted', idx === highlightedIndex));
      } else if (e.key === 'Enter' && highlightedIndex >= 0) {
        e.preventDefault();
        addCategory(items[highlightedIndex].dataset.value);
      } else if (e.key === 'Escape') {
        dropdown.style.display = 'none';
      }
    });
  }

  _setupCategoryBudgetAutocomplete(input, dropdown, allOptions, budgetIndex) {
    let highlightedIndex = -1;
    const checkIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>';
    const plusIcon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/></svg>';

    const selectCategory = (category) => {
      input.value = category;
      dropdown.style.display = 'none';
      // Update state
      if (!this._state.categoryBudgets) {
        this._state.categoryBudgets = [];
      }
      if (this._state.categoryBudgets[budgetIndex]) {
        this._state.categoryBudgets[budgetIndex].category = category;
      }
    };

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
          selectCategory(item.dataset.value);
        });
      });
    };

    const filterOptions = () => {
      const query = input.value.trim();
      // Update state as user types
      if (this._state.categoryBudgets && this._state.categoryBudgets[budgetIndex]) {
        this._state.categoryBudgets[budgetIndex].category = query;
      }
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
    input.addEventListener('focus', () => {
      const query = input.value.trim();
      if (query) {
        filterOptions();
      } else {
        // Show all options when focused with empty input
        highlightedIndex = -1;
        showDropdown(allOptions, '');
      }
    });
    input.addEventListener('blur', () => {
      setTimeout(() => { dropdown.style.display = 'none'; }, 150);
    });
    input.addEventListener('keydown', (e) => {
      const items = dropdown.querySelectorAll('.autocomplete-item');
      const maxIndex = items.length - 1;
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        highlightedIndex = Math.min(highlightedIndex + 1, maxIndex);
        items.forEach((item, idx) => item.classList.toggle('highlighted', idx === highlightedIndex));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        highlightedIndex = Math.max(highlightedIndex - 1, 0);
        items.forEach((item, idx) => item.classList.toggle('highlighted', idx === highlightedIndex));
      } else if (e.key === 'Enter' && highlightedIndex >= 0) {
        e.preventDefault();
        selectCategory(items[highlightedIndex].dataset.value);
      } else if (e.key === 'Escape') {
        dropdown.style.display = 'none';
      }
    });
  }

  _handleAction(dataset) {
    const action = dataset.action;
    switch (action) {
      case "add-project":
        this._state.categoryBudgets = null; // Clear category budgets
        this._state.modal = { type: 'project', data: {} };
        this._render();
        break;
      case "open-add-project":
        // Called from the no-projects modal - close current modal and open project modal
        this._state.categoryBudgets = null;
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
        this._state.selectedCategories = null; // Clear categories
        this._state.categorySplitType = null;
        this._state.categorySplitValues = null;
        this._state.modal = { type: 'receipt', data: {} };
        this._render();
        break;
      case "save-project":
        this._saveProject();
        break;
      case "edit-project":
        const projectToEdit = this._state.projects.find(p => p.project_id === dataset.projectId);
        if (projectToEdit) {
          // Initialize category budgets from project data
          this._state.categoryBudgets = projectToEdit.budget_by_category 
            ? Object.entries(projectToEdit.budget_by_category).map(([cat, amount]) => ({ category: cat, amount }))
            : [];
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
        this._state.selectedCategories = null; // Clear categories
        this._state.categorySplitType = null;
        this._state.categorySplitValues = null;
        this._state.modal = { type: 'receipt', data: { project_id: dataset.projectId } };
        this._render();
        break;
      case "edit-receipt":
        this._state.pendingPhotos = []; // Clear pending photos when opening edit receipt modal
        const project = this._state.projects.find(p => p.project_id === dataset.projectId);
        const receipt = project?.receipts?.find(r => r.receipt_id === dataset.receiptId);
        if (receipt) {
          // Initialize category state from receipt data
          // Prefer the categories array, but fall back to parsing category_summary if needed
          let cats = receipt.categories;
          if (!cats || cats.length === 0) {
            // Fall back to category_summary - split by comma if it contains multiple
            if (receipt.category_summary) {
              cats = receipt.category_summary.split(',').map(c => c.trim()).filter(c => c);
            } else {
              cats = [];
            }
          }
          this._state.selectedCategories = cats.length > 0 ? [...cats] : null;
          this._state.categorySplitType = receipt.category_split_type || 'equal';
          this._state.categorySplitValues = receipt.category_split ? { ...receipt.category_split } : {};
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
      case "select-provider":
        this._selectStorageProvider(dataset.provider);
        break;
      case "storage-disconnect":
        this._disconnectStorage();
        break;
      case "submit-auth-code":
        this._submitAuthCode();
        break;
      case "open-integration-options":
        // Navigate to the integration options page in Home Assistant
        this._openIntegrationOptions();
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
        this._state.selectedCategories = null; // Clear selected categories
        this._state.categorySplitType = null;
        this._state.categorySplitValues = null;
        this._state.categoryBudgets = null; // Clear category budgets
        this._render();
        break;
      case "set-period":
        this._state.dashboardPeriod = dataset.period;
        this._render();
        break;
      case "remove-category":
        const catIndex = parseInt(dataset.index, 10);
        if (!isNaN(catIndex) && this._state.selectedCategories) {
          const removedCat = this._state.selectedCategories[catIndex];
          this._state.selectedCategories.splice(catIndex, 1);
          // Also remove from split values
          if (this._state.categorySplitValues && removedCat) {
            delete this._state.categorySplitValues[removedCat];
          }
          // Reset split type if only one category remains
          if (this._state.selectedCategories.length <= 1) {
            this._state.categorySplitType = 'equal';
            this._state.categorySplitValues = {};
          }
          this._render();
        }
        break;
      case "set-split-type":
        const newType = dataset.type;
        const oldType = this._state.categorySplitType;
        const currentValues = this._state.categorySplitValues || {};
        
        // Convert values when switching between percentage and absolute
        if (newType !== 'equal' && oldType !== 'equal' && newType !== oldType) {
          // Get the receipt total from the form
          const totalInput = this._container.querySelector("#receipt-total");
          const receiptTotal = totalInput ? parseFloat(totalInput.value) || 0 : 0;
          
          if (receiptTotal > 0 && Object.keys(currentValues).length > 0) {
            const convertedValues = {};
            
            if (oldType === 'percentage' && newType === 'absolute') {
              // Convert percentage to absolute: value% of total
              for (const [cat, pct] of Object.entries(currentValues)) {
                convertedValues[cat] = (pct / 100) * receiptTotal;
              }
            } else if (oldType === 'absolute' && newType === 'percentage') {
              // Convert absolute to percentage: (value / total) * 100
              for (const [cat, amt] of Object.entries(currentValues)) {
                convertedValues[cat] = (amt / receiptTotal) * 100;
              }
            }
            
            this._state.categorySplitValues = convertedValues;
          }
        }
        
        this._state.categorySplitType = newType;
        if (newType === 'equal') {
          this._state.categorySplitValues = {};
        }
        this._render();
        break;
      case "add-category-budget":
        if (!this._state.categoryBudgets) {
          this._state.categoryBudgets = [];
        }
        // Preserve current form values before re-render
        if (this._state.modal?.data) {
          const budgetInput = this._container.querySelector("#project-budget");
          const nameInput = this._container.querySelector("#project-name");
          const areaSelect = this._container.querySelector("#project-area");
          if (budgetInput) this._state.modal.data.budget = budgetInput.value ? parseFloat(budgetInput.value) : null;
          if (nameInput) this._state.modal.data.name = nameInput.value;
          if (areaSelect) this._state.modal.data.area_id = areaSelect.value || null;
        }
        this._state.categoryBudgets.push({ category: '', amount: '' });
        this._render();
        break;
      case "remove-category-budget":
        const budgetIndex = parseInt(dataset.index, 10);
        if (!isNaN(budgetIndex) && this._state.categoryBudgets) {
          // Preserve current form values before re-render
          if (this._state.modal?.data) {
            const budgetInput = this._container.querySelector("#project-budget");
            const nameInput = this._container.querySelector("#project-name");
            const areaSelect = this._container.querySelector("#project-area");
            if (budgetInput) this._state.modal.data.budget = budgetInput.value ? parseFloat(budgetInput.value) : null;
            if (nameInput) this._state.modal.data.name = nameInput.value;
            if (areaSelect) this._state.modal.data.area_id = areaSelect.value || null;
          }
          this._state.categoryBudgets.splice(budgetIndex, 1);
          this._render();
        }
        break;
    }
  }

  _openIntegrationOptions() {
    // Navigate to the integration options page in Home Assistant
    // This uses Home Assistant's navigation API
    if (this._hass) {
      // First, we need to get the config entry ID
      // Navigate to the integrations page with the entry selected
      const url = '/config/integrations/integration/home_project_ledger';
      history.pushState(null, '', url);
      window.dispatchEvent(new Event('location-changed'));
    }
  }

  async _saveProject() {
    const data = this._state.modal?.data || {};
    const isEdit = !!data.project_id;
    const name = this._container.querySelector("#project-name")?.value?.trim();
    const areaId = this._container.querySelector("#project-area")?.value || null;
    const budgetInput = this._container.querySelector("#project-budget")?.value;
    const budget = budgetInput ? parseFloat(budgetInput) : null;
    
    // Build budget_by_category from state
    const categoryBudgets = this._state.categoryBudgets || [];
    const budgetByCategory = {};
    categoryBudgets.forEach(item => {
      if (item.category && item.category.trim() && item.amount > 0) {
        budgetByCategory[item.category.trim()] = item.amount;
      }
    });
    const hasCategoryBudgets = Object.keys(budgetByCategory).length > 0;
    
    // Validate that category budgets don't exceed total budget
    if (hasCategoryBudgets && budget !== null && budget > 0) {
      const categoryBudgetSum = Object.values(budgetByCategory).reduce((sum, v) => sum + v, 0);
      if (categoryBudgetSum > budget) {
        alert(this._t('categoryBudgetsExceedTotal'));
        return;
      }
    }

    if (!name) {
      alert(this._t('pleaseEnterProjectName'));
      return;
    }

    try {
      if (isEdit) {
        const updatePayload = {
          project_id: data.project_id,
          name,
          area_id: areaId || null,
          budget: budget,
        };
        
        // Include budget_by_category (can be set to null to clear)
        updatePayload.budget_by_category = hasCategoryBudgets ? budgetByCategory : null;
        
        await this._hass.callService(DOMAIN, "update_project", updatePayload);
      } else {
        const serviceData = {
          name,
          area_id: areaId || undefined,
        };
        if (budget !== null && budget > 0) {
          serviceData.budget = budget;
        }
        if (hasCategoryBudgets) {
          serviceData.budget_by_category = budgetByCategory;
        }
        await this._hass.callService(DOMAIN, "create_project", serviceData);
      }
      this._state.categoryBudgets = null;
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
    
    // Get categories from state (multi-category support)
    const categories = this._state.selectedCategories || [];
    const splitType = this._state.categorySplitType || 'equal';
    const splitValues = this._state.categorySplitValues || {};
    
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
    
    // Validate split values if not equal split
    if (categories.length > 1 && splitType !== 'equal') {
      if (splitType === 'percentage') {
        const total = Object.values(splitValues).reduce((sum, v) => sum + (v || 0), 0);
        if (Math.abs(total - 100) > 0.01) {
          alert(this._t('splitMustEqual100'));
          return;
        }
      } else if (splitType === 'absolute') {
        const total = Object.values(splitValues).reduce((sum, v) => sum + (v || 0), 0);
        if (Math.abs(total - amount) > 0.01) {
          alert(this._t('splitMustEqualTotal'));
          return;
        }
      }
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
        };
        
        // Handle categories
        if (categories.length > 0) {
          updatePayload.categories = categories;
          // For backward compatibility, also set category_summary
          updatePayload.category_summary = categories.join(', ');
          
          // Only send split data if more than one category and not equal
          if (categories.length > 1 && splitType !== 'equal') {
            updatePayload.category_split = splitValues;
            updatePayload.category_split_type = splitType;
          } else {
            // Clear split data for equal split or single category
            updatePayload.category_split = null;
            updatePayload.category_split_type = null;
          }
        } else {
          updatePayload.categories = null;
          updatePayload.category_summary = null;
          updatePayload.category_split = null;
          updatePayload.category_split_type = null;
        }
        
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
        };
        
        // Handle categories
        if (categories.length > 0) {
          addPayload.categories = categories;
          addPayload.category_summary = categories.join(', ');
          
          if (categories.length > 1 && splitType !== 'equal') {
            addPayload.category_split = splitValues;
            addPayload.category_split_type = splitType;
          }
        }
        
        // Include images if any
        if (imagesToAdd.length > 0) {
          addPayload.images = imagesToAdd;
        }
        
        await this._hass.callService(DOMAIN, "add_receipt", addPayload);
      }
      
      // Clear pending photos and categories, close modal
      this._state.pendingPhotos = [];
      this._state.selectedCategories = null;
      this._state.categorySplitType = null;
      this._state.categorySplitValues = null;
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

  _formatDate(dateStr) {
    if (!dateStr) return this._t('noDate');
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("sv-SE", { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
      return dateStr;
    }
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

  async _loadStorageStatus() {
    if (!this._hass) return;
    
    try {
      // Use HTTP API to get storage status
      const response = await fetch('/api/home_project_ledger/storage/status', {
        headers: {
          'Authorization': 'Bearer ' + this._hass.auth.data.access_token,
        },
      });
      
      if (response.ok) {
        this._state.storageStatus = await response.json();
      } else {
        throw new Error('Failed to fetch storage status');
      }
      this._render();
    } catch (error) {
      console.error("Error loading storage status:", error);
      // Set default status on error
      this._state.storageStatus = {
        provider: "local",
        provider_name: "Local Storage",
        connected: true,
        authenticated: true,
        providers: [
          { type: "local", name: "Local Storage", configured: true, available: true },
          { type: "google_drive", name: "Google Drive", configured: false, available: true },
          { type: "onedrive", name: "OneDrive", configured: false, available: false },
          { type: "dropbox", name: "Dropbox", configured: false, available: false },
          { type: "webdav", name: "WebDAV", configured: true, available: false },
        ],
      };
      this._render();
    }
  }

  async _selectStorageProvider(providerType) {
    if (!this._hass) return;
    
    try {
      const response = await fetch('/api/home_project_ledger/storage/config', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + this._hass.auth.data.access_token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ provider: providerType }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to select provider');
      }
      
      // Reload status to get auth URL if needed
      await this._loadStorageStatus();
    } catch (error) {
      console.error("Error selecting provider:", error);
      alert(this._t('failedStorageConfig'));
    }
  }

  async _disconnectStorage() {
    if (!this._hass) return;
    
    try {
      const response = await fetch('/api/home_project_ledger/storage/config', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + this._hass.auth.data.access_token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ disconnect: true }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to disconnect storage');
      }
      
      await this._loadStorageStatus();
    } catch (error) {
      console.error("Error disconnecting storage:", error);
      alert(this._t('failedStorageConfig'));
    }
  }

  async _submitAuthCode() {
    if (!this._hass) return;
    
    const authCodeInput = this._container.querySelector('.auth-code-input');
    const authCode = authCodeInput?.value?.trim();
    
    if (!authCode) {
      return;
    }
    
    try {
      const response = await fetch('/api/home_project_ledger/storage/config', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + this._hass.auth.data.access_token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ auth_code: authCode }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Authentication failed');
      }
      
      this._state.authCodeInput = "";
      await this._loadStorageStatus();
    } catch (error) {
      console.error("Error authenticating:", error);
      alert(this._t('failedStorageConfig'));
    }
  }
}

customElements.define("home_project_ledger-panel", HomeProjectLedgerPanel);
