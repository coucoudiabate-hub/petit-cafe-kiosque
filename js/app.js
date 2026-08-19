// ============================================================
// PETIT CAFE — Main App Controller
// ============================================================

const App = {
  _mode: 'client',      // 'client' | 'admin'
  _clientTab: 'accueil', // 'accueil' | 'menu' | 'contact'
  _adminTab: 'dashboard',

  async init() {
    // Dark mode immédiatement (localStorage, pas besoin d'attendre Firestore)
    DB.initDarkMode();
    this._updateDarkModeIcon();

    // Afficher l'écran de chargement
    this._showLoader();

    // Charger Firestore avec timeout de sécurité (8 secondes max)
    try {
      const firestoreTimeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Firestore timeout')), 8000)
      );
      await Promise.race([DB.loadAll(), firestoreTimeout]);

      // 🛡️ GARDE-FOU : ne seed QUE si la base est complètement vide.
      // JAMAIS d'écrasement de données existantes (pour protéger un éventuel
      // autre projet qui partagerait le même Firestore par erreur).
      if (!DB.isSeeded()) {
        console.log('📦 Base vide — création du catalogue kiosque PETIT CAFE...');
        await seedDatabase();
      } else {
        console.log('✓ Base déjà peuplée — aucune modification automatique');
      }

      // ⚠️ Migration AUTOMATIQUE désactivée dans v5.0.
      // Pour forcer une réinstallation : Admin → Maintenance → Reset Total.
      // (La fonction Migrations.runIfNeeded() ne fait rien dans cette version.)
      if (typeof Migrations !== 'undefined') {
        await Migrations.runIfNeeded();
      }
    } catch(e) {
      console.error('Erreur Firestore:', e.message);
      const msg = document.getElementById('loader-msg');
      if (msg) {
        // Message différent selon le type d'erreur
        const isBlocked = (typeof window !== 'undefined' && window._FIREBASE_BLOCKED);
        const isNotConfigured = (typeof window !== 'undefined' && window._FIREBASE_NOT_CONFIGURED);

        if (isBlocked) {
          // L'écran de blocage est déjà affiché par firebase-config.js
          return;
        } else if (isNotConfigured) {
          // L'écran d'onboarding est déjà affiché par firebase-config.js
          return;
        }

        msg.innerHTML = `
          <div style="color:#dc2626;font-size:0.875rem;max-width:320px;text-align:center;line-height:1.6;padding:0 16px">
            ⚠️ Impossible de se connecter à Firebase.<br>
            Vérifiez <strong>js/firebase-config.js</strong><br>
            et les règles Firestore.
          </div>
          <button onclick="location.reload()" style="margin-top:12px;background:#3E2723;color:#FAEBD7;border:none;padding:10px 24px;border-radius:8px;cursor:pointer;font-size:0.9375rem;font-weight:700">
            🔄 Réessayer
          </button>`;
      }
      return;
    }

    // Masquer l'écran de chargement
    this._hideLoader();

    // Load saved mode
    this._mode = DB.getMode();
    if (this._mode === 'admin' && !DB.validateAdminToken()) {
      this._mode = 'client';
      DB.setMode('client');
    }

    // Event listeners
    this._setupEvents();

    // Cart drawer overlay close
    const overlay = document.getElementById('cart-drawer-overlay');
    if (overlay) overlay.addEventListener('click', () => CartDrawer.close());

    // Generic modal overlay close
    const modalOverlay = document.getElementById('generic-modal');
    if (modalOverlay) modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) Modal.close();
    });

    // Checkout modal overlay close
    const checkoutModal = document.getElementById('checkout-modal');
    if (checkoutModal) checkoutModal.addEventListener('click', (e) => {
      if (e.target === checkoutModal) CheckoutModal.close();
    });

    // Floating cart button
    const cartBtn = document.getElementById('floating-cart-btn');
    if (cartBtn) cartBtn.addEventListener('click', () => CartDrawer.open());

    // Back to top + scroll progress bar
    window.addEventListener('scroll', () => {
      const btn = document.getElementById('back-to-top');
      if (btn) btn.classList.toggle('visible', window.scrollY > 400);
      // Scroll progress bar
      let progress = document.getElementById('scroll-progress');
      if (!progress) {
        progress = document.createElement('div');
        progress.id = 'scroll-progress';
        progress.className = 'scroll-progress';
        progress.style.width = '0%';
        document.body.appendChild(progress);
      }
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
      progress.style.width = pct + '%';
    });
    const backTop = document.getElementById('back-to-top');
    if (backTop) backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // Checkout button in cart drawer
    const checkoutBtn = document.getElementById('cart-checkout-btn');
    if (checkoutBtn) checkoutBtn.addEventListener('click', () => {
      CartDrawer.close();
      CheckoutModal.open();
    });

    // Delivery type toggle in checkout
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('delivery-option')) {
        document.querySelectorAll('.delivery-option').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        const addressGroup = document.getElementById('checkout-address-group');
        if (addressGroup) {
          addressGroup.style.display = e.target.dataset.type === 'livraison' ? 'block' : 'none';
        }
      }
    });

    // Checkout form submit
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
      checkoutForm.addEventListener('click', (e) => {
        if (e.target.id === 'checkout-submit-btn') {
          e.preventDefault();
          CartManager.checkout();
        }
      });
    }

    // Render initial state
    CartDrawer.render();
    this.render();
    this._updateRestaurantStatus();
    this._updateFooterInfo();
    // Détection d'un scan QR code (paramètre ?table=X ou hash #menu / #contact)
    this._handleQRLanding();
    // Refresh status every minute
    setInterval(() => this._updateRestaurantStatus(), 60000);
  },

  // Détecte un atterrissage via QR code et oriente le client
  _handleQRLanding() {
    try {
      const url = new URL(window.location.href);
      const table = url.searchParams.get('table');
      const cat = url.searchParams.get('cat');
      const hash = (window.location.hash || '').replace(/^#/, '');

      // Si on est en mode admin, ne pas rediriger
      if (this._mode === 'admin') return;

      // Cas 1 : QR code de table → aller au menu + afficher bannière
      if (table) {
        // Stocker le numéro de table pour l'ajouter à la commande
        try { sessionStorage.setItem('petitcafe_table', table); } catch {}
        this.setClientTab('menu');
        // Bannière d'info
        this._showTableBanner(table);
        setTimeout(() => Toast.success(`Bienvenue ! Table ${table} détectée.`), 800);
        // Nettoyer l'URL pour ne pas afficher le paramètre
        try {
          window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
        } catch {}
        return;
      }

      // Cas 1b : QR code avec filtre catégorie (?cat=credit par exemple)
      if (cat) {
        this.setClientTab('menu');
        // Attendre que le menu soit rendu, puis activer le filtre catégorie
        setTimeout(() => {
          if (typeof ClientPages !== 'undefined' && ClientPages.filterByCategory) {
            // Chercher une catégorie dont le nom contient le mot-clé
            const cats = DB.getCategories();
            const target = cats.find(c => c.name.toLowerCase().includes(cat.toLowerCase()));
            if (target) {
              ClientPages.filterByCategory(target.id);
              Toast.info(`Filtered: ${target.emoji} ${target.name}`);
            }
          }
        }, 600);
        // Nettoyer l'URL
        try {
          window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
        } catch {}
        return;
      }

      // Cas 2 : Hash direct (#menu, #contact, #accueil)
      if (hash && ['accueil', 'menu', 'contact'].includes(hash)) {
        this.setClientTab(hash);
        // Nettoyer le hash
        try {
          window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
        } catch {}
      }

      // Cas 2b : Hash #admin (raccourci PWA "Espace Admin") → ouvre le
      // mode admin si une session valide existe déjà, sinon reste en
      // mode client (l'écran de connexion s'affichera via le bouton Admin).
      if (hash === 'admin') {
        if (DB.validateAdminToken()) {
          this._mode = 'admin';
          DB.setMode('admin');
          this.render();
        }
        try {
          window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
        } catch {}
      }

      // Cas 3 : rechargement de page alors qu'une table est en sessionStorage
      // (le param ?table=X a été nettoyé de l'URL, mais on garde le contexte table)
      try {
        const storedTable = sessionStorage.getItem('petitcafe_table');
        if (storedTable && !table) {
          this._showTableBanner(storedTable, true);
        }
      } catch {}
    } catch (e) {
      console.warn('QR landing detection failed:', e);
    }
  },

  // Affiche la bannière "Table X" sans écraser une bannière admin active
  _showTableBanner(tableNumber, isReload = false) {
    const bannerEl = document.getElementById('announcement-banner');
    const bannerText = document.getElementById('banner-text-content');
    if (!bannerEl || !bannerText) return;
    const config = DB.getConfig();
    // Si une bannière admin est active ET qu'on n'est pas sur un reload, on la préserve
    // et on affiche juste un toast à la place.
    if (!isReload && config.bannerActive && config.bannerText) {
      // Bannière admin déjà affichée par renderAccueil — on ne l'écrase pas
      return;
    }
    bannerText.textContent = `🪑 Vous êtes à la Table ${tableNumber} — commandez directement depuis votre téléphone !`;
    bannerEl.style.display = 'flex';
    document.body.classList.add('banner-open');
  },

  _setupEvents() {
    // Dark mode toggle
    const darkToggle = document.getElementById('dark-mode-toggle');
    if (darkToggle) darkToggle.addEventListener('click', () => this.toggleDarkMode());

    // Mode toggle
    const modeToggle = document.getElementById('mode-toggle');
    if (modeToggle) modeToggle.addEventListener('click', () => this.toggleMode());

    // Admin sidebar navigation
    document.querySelectorAll('#admin-sidebar .sidebar-item[data-tab]').forEach(item => {
      item.addEventListener('click', () => {
        this.setAdminTab(item.dataset.tab);
        this._closeAdminSidebar(); // ferme le menu sur mobile après sélection
      });
    });

    // Logout button
    const logoutBtn = document.getElementById('admin-logout');
    if (logoutBtn) logoutBtn.addEventListener('click', () => this.logout());

    // Admin mobile menu: hamburger + overlay
    const adminToggle = document.getElementById('admin-mobile-toggle');
    if (adminToggle) adminToggle.addEventListener('click', () => this._toggleAdminSidebar());
    const adminOverlay = document.getElementById('admin-sidebar-overlay');
    if (adminOverlay) adminOverlay.addEventListener('click', () => this._closeAdminSidebar());

    // Client tabs
    document.querySelectorAll('.client-tab[data-tab]').forEach(tab => {
      tab.addEventListener('click', () => this.setClientTab(tab.dataset.tab));
    });

    // Announcement banner close
    const bannerClose = document.getElementById('banner-close');
    if (bannerClose) bannerClose.addEventListener('click', () => {
      document.getElementById('announcement-banner').style.display = 'none';
      document.body.classList.remove('banner-open');
    });
  },

  toggleDarkMode() {
    const isDark = DB.toggleDarkMode();
    this._updateDarkModeIcon();
  },

  _updateDarkModeIcon() {
    const icon = document.getElementById('dark-mode-icon');
    if (icon) icon.textContent = DB.isDarkMode() ? '☀️' : '🌙';
  },

  toggleMode() {
    if (this._mode === 'client') {
      this._mode = 'admin';
      DB.setMode('admin');
    } else {
      this._mode = 'client';
      DB.setMode('client');
    }
    this.render();
    this._updateModeButton();
  },

  _updateModeButton() {
    const btn = document.getElementById('mode-toggle');
    if (btn) {
      btn.textContent = this._mode === 'client' ? '⚙️ Mode Admin' : '🍽️ Mode Client';
    }
  },

  logout() {
    this._closeAdminSidebar();
    DB.adminLogout();
    this._mode = 'client';
    DB.setMode('client');
    this._updateModeButton();
    this.render();
    Toast.success('Déconnexion réussie');
  },

  setClientTab(tab) {
    this._clientTab = tab;
    this._mode = 'client';
    DB.setMode('client');
    this._updateModeButton();

    // Update tab buttons
    document.querySelectorAll('.client-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.tab === tab);
    });

    // Show/hide pages
    document.querySelectorAll('[id^="page-"]').forEach(p => p.classList.add('hidden'));
    const page = document.getElementById('page-' + tab);
    if (page) page.classList.remove('hidden');

    // Hide admin section
    document.getElementById('admin-section').classList.add('hidden');
    document.getElementById('client-section').classList.remove('hidden');

    // Render the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (tab === 'accueil') ClientPages.renderAccueil();
    else if (tab === 'menu') ClientPages.renderMenu();
    else if (tab === 'contact') ClientPages.renderContact();

    // Adjust hero visibility
    const hero = document.querySelector('.hero');
    if (hero) hero.style.display = tab === 'accueil' ? 'block' : 'none';
  },

  _toggleAdminSidebar() {
    const sidebar = document.getElementById('admin-sidebar');
    const overlay = document.getElementById('admin-sidebar-overlay');
    if (!sidebar) return;
    const isOpen = sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  },

  _closeAdminSidebar() {
    const sidebar = document.getElementById('admin-sidebar');
    const overlay = document.getElementById('admin-sidebar-overlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  },

  setAdminTab(tab) {
    this._adminTab = tab;

    // Update sidebar
    document.querySelectorAll('#admin-sidebar .sidebar-item[data-tab]').forEach(item => {
      item.classList.toggle('active', item.dataset.tab === tab);
    });

    // Render the page directly into admin-content
    window.scrollTo({ top: 0, behavior: 'smooth' });
    AdminPages.render(tab);
  },

  render() {
    if (this._mode === 'client') {
      document.getElementById('client-section').classList.remove('hidden');
      document.getElementById('admin-section').classList.add('hidden');
      this.setClientTab(this._clientTab);
    } else {
      document.getElementById('client-section').classList.add('hidden');
      document.getElementById('admin-section').classList.remove('hidden');
      this.setAdminTab(this._adminTab);
    }
    this._updateModeButton();
  },

  _updateRestaurantStatus() {
    const badge = document.getElementById('restaurant-status');
    if (!badge) return;
    const config = DB.getConfig();
    try {
      const now = new Date();
      const [openH, openM] = (config.openingTime || '06:30').split(':').map(Number);
      const [closeH, closeM] = (config.closingTime || '23:00').split(':').map(Number);
      const openMins = openH * 60 + openM;
      const closeMins = closeH * 60 + closeM;
      const nowMins = now.getHours() * 60 + now.getMinutes();
      const isOpen = nowMins >= openMins && nowMins < closeMins;

      badge.style.display = 'inline-flex';
      badge.classList.toggle('open', isOpen);
      badge.classList.toggle('closed', !isOpen);

      if (isOpen) {
        badge.innerHTML = `<span class="status-dot"></span><span>OUVERT</span><span class="status-text-full" style="opacity:0.85">· jusqu'à ${config.closingTime}</span>`;
      } else {
        // Détermine si ça ouvre plus tard aujourd'hui ou demain
        let nextOpen = `demain à ${config.openingTime}`;
        if (nowMins < openMins) {
          nextOpen = `à ${config.openingTime}`;
        }
        badge.innerHTML = `<span class="status-dot"></span><span>FERMÉ</span><span class="status-text-full" style="opacity:0.85">· ouvre ${nextOpen}</span>`;
      }
    } catch(e) { badge.style.display = 'none'; }
  },

  _updateFooterInfo() {
    const config = DB.getConfig();
    const phone = document.getElementById('footer-phone');
    const addr = document.getElementById('footer-address');
    if (phone) phone.textContent = '📞 ' + (config.phone1 || BUSINESS.phonePrimary);
    if (addr) addr.textContent = '📍 ' + (config.address || BUSINESS.fullAddress);
  },

  _showLoader() {
    let loader = document.getElementById('app-loader');
    if (!loader) {
      loader = document.createElement('div');
      loader.id = 'app-loader';
      loader.innerHTML = `
        <div style="position:fixed;inset:0;z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;background:var(--bg, #FAEBD7);gap:20px">
          <img src="assets/logo.png" alt="PETIT CAFE" style="width:90px;height:90px;border-radius:50%;object-fit:cover;border:3px solid #C86A2F;animation:logo-pulse 1.5s ease infinite">
          <div style="font-size:1.125rem;font-weight:800;color:#3E2723;font-family:'Playfair Display',serif">PETIT CAFE</div>
          <div style="font-size:0.875rem;color:#8B5A2B;font-weight:600;font-style:italic">Votre kiosque de référence</div>
          <div id="loader-dots" style="display:flex;gap:6px">
            <div style="width:8px;height:8px;border-radius:50%;background:#C86A2F;animation:dot-bounce 1s ease infinite"></div>
            <div style="width:8px;height:8px;border-radius:50%;background:#C86A2F;animation:dot-bounce 1s ease 0.15s infinite"></div>
            <div style="width:8px;height:8px;border-radius:50%;background:#C86A2F;animation:dot-bounce 1s ease 0.3s infinite"></div>
          </div>
          <div id="loader-msg" style="display:flex;flex-direction:column;align-items:center;gap:8px"></div>
        </div>`;
      document.body.appendChild(loader);
    }
    loader.style.display = 'flex';
  },

  _hideLoader() {
    const loader = document.getElementById('app-loader');
    if (loader) {
      loader.style.opacity = '0';
      loader.style.transition = 'opacity 0.4s';
      setTimeout(() => loader.remove(), 400);
    }
  }
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => App.init());

// ============================================================
// PWA — Service Worker + prompt d'installation personnalisé
// ============================================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((err) => {
      console.warn('Service worker non enregistré:', err.message);
    });
  });
}

let _deferredInstallPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  _deferredInstallPrompt = e;
  const btn = document.getElementById('pwa-install-btn');
  if (btn) btn.style.display = 'inline-flex';
});

window.addEventListener('appinstalled', () => {
  _deferredInstallPrompt = null;
  const btn = document.getElementById('pwa-install-btn');
  if (btn) btn.style.display = 'none';
  if (typeof Toast !== 'undefined') Toast.success('PETIT CAFE installé avec succès !');
});

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('pwa-install-btn');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    if (!_deferredInstallPrompt) return;
    _deferredInstallPrompt.prompt();
    await _deferredInstallPrompt.userChoice;
    _deferredInstallPrompt = null;
    btn.style.display = 'none';
  });
});
