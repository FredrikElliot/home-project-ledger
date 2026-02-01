/* Home Project Ledger custom panel wrapper.
 * Loads /local/home_project_ledger/panel.html and injects the Home Assistant "hass" object.
 *
 * Why this exists:
 * - Home Assistant custom panels are JS modules (web components).
 * - Your UI is HTML/JS; we keep it and load it safely.
 */

class HomeProjectLedgerPanel extends HTMLElement {
  set hass(hass) {
    this._hass = hass;

    // Expose hass for panel.html (MVP approach)
    window.__HPL_HASS__ = hass;

    if (!this._loaded) {
      this._loaded = true;
      this._loadHtml();
    }
  }

  async _loadHtml() {
    try {
      const resp = await fetch("/local/home_project_ledger/panel.html", { cache: "no-store" });
      if (!resp.ok) {
        this.innerHTML = `
          <ha-card header="Home Project Ledger" style="margin:16px;">
            <div style="padding:16px;">
              Failed to load panel.html (${resp.status})
              <div style="margin-top:8px; font-size: 12px; opacity: 0.8;">
                Expected at /config/www/home_project_ledger/panel.html
              </div>
            </div>
          </ha-card>
        `;
        return;
      }

      const html = await resp.text();

      // Use shadow DOM so CSS doesn't bleed into HA UI
      const root = this.attachShadow({ mode: "open" });

      // Scripts in innerHTML won't run automatically. We'll extract and execute them.
      const container = document.createElement("div");
      container.innerHTML = html;

      const scripts = Array.from(container.querySelectorAll("script"));
      scripts.forEach((s) => s.remove());

      root.appendChild(container);

      // Execute scripts in order
      for (const s of scripts) {
        const code = s.textContent || "";
        new Function(code)();
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Home Project Ledger panel load failed:", err);
      this.innerHTML = `
        <ha-card header="Home Project Ledger" style="margin:16px;">
          <div style="padding:16px;">
            Panel load error: ${String(err)}
          </div>
        </ha-card>
      `;
    }
  }
}

customElements.define("home_project_ledger-panel", HomeProjectLedgerPanel);
