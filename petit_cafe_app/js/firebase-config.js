// ============================================================
// PETIT CAFE — Configuration Firebase (v5.0 ISOLÉ)
// ------------------------------------------------------------
// ⚠️⚠️⚠️ CONFIGURATION OBLIGATOIRE AVANT UTILISATION ⚠️⚠️⚠️
//
// Cette application PETIT CAFE DOIT utiliser son PROPRE projet Firebase.
// NE JAMAIS utiliser le projet "bodoro-menu" (qui héberge BODORO).
//
// Si vous n'avez pas encore créé de projet Firebase pour PETIT CAFE :
//   1. Allez sur https://console.firebase.google.com
//   2. Cliquez "Add project" → nommez-le "petit-cafe-kiosque"
//   3. Activez Firestore Database (mode production)
//   4. Project Settings → Your apps → Add web app
//   5. Copiez le firebaseConfig fourni
//   6. Remplacez les valeurs "VOTRE_..." ci-dessous par les vôtres
//   7. Sauvegardez ce fichier
//   8. Ouvrez index.html → l'app se configurera automatiquement
//
// Tant que les valeurs ci-dessous ne sont PAS remplies, l'app affichera
// un écran d'onboarding au lieu de démarrer.
//
// 🛡️ GARDE-FOU DE SÉCURITÉ :
//   Si vous mettez par erreur le projet "bodoro-menu", l'app se bloquera
//   automatiquement et affichera un avertissement pour protéger BODORO.
// ============================================================

const firebaseConfig = {
  // ⚠️ REMPLACEZ CES VALEURS PAR CELLES DE VOTRE NOUVEAU PROJET FIREBASE
  // (Ne JAMAIS utiliser les clés du projet "bodoro-menu")
  apiKey:            "AIzaSyDkTQ5xfzLA-25f4Mz1_jt3MpuxsAEm478",
  authDomain:        "petit-cafe-kiosque-f59f8.firebaseapp.com",
  projectId:         "petit-cafe-kiosque-f59f8",
  storageBucket:     "petit-cafe-kiosque-f59f8.firebasestorage.app",
  messagingSenderId: "197742622903",
  appId:             "1:197742622903:web:90b92d5dec912910e0f532"
};

// ============================================================
// 🛡️ GARDE-FOU ANTI-ÉCRASEMENT BODORO
// ============================================================
// Vérifie qu'on n'utilise PAS le projet bodoro-menu (qui héberge BODORO).
// Si c'est le cas, on bloque TOUTE initialisation Firebase pour protéger
// les données BODORO.
const _IS_BODORO_PROJECT = (
  firebaseConfig.projectId === 'bodoro-menu' ||
  firebaseConfig.authDomain === 'bodoro-menu.firebaseapp.com' ||
  firebaseConfig.apiKey === 'AIzaSyBkoefGJhiWFh5eHEwA4gnlsU5mOUoIM7I'
);

// Vérifie si la config a été personnalisée
const _IS_CONFIGURED = (
  !firebaseConfig.apiKey.startsWith('VOTRE_') &&
  !firebaseConfig.projectId.startsWith('VOTRE_') &&
  firebaseConfig.apiKey !== 'VOTRE_API_KEY_PETIT_CAFE'
);

if (_IS_BODORO_PROJECT) {
  // 🚨 BLOCAGE CRITIQUE : projet bodoro-menu détecté
  console.error('🚨 BLOCAGE DE SÉCURITÉ : projet bodoro-menu détecté dans firebase-config.js');
  console.error('   PETIT CAFE ne peut pas utiliser ce projet car il héberge BODORO.');
  console.error('   Créez un nouveau projet Firebase dédié à PETIT CAFE.');
  console.error('   Voir js/firebase-config.js pour les instructions.');

  // Afficher un écran d'erreur bloquant
  document.addEventListener('DOMContentLoaded', () => {
    document.body.innerHTML = `
      <div style="position:fixed;inset:0;background:#dc2626;color:#fff;display:flex;align-items:center;justify-content:center;padding:24px;font-family:system-ui,sans-serif">
        <div style="max-width:600px;text-align:center">
          <div style="font-size:4rem;margin-bottom:16px">🚨</div>
          <h1 style="font-size:1.75rem;font-weight:800;margin-bottom:16px">BLOCAGE DE SÉCURITÉ</h1>
          <p style="font-size:1.0625rem;line-height:1.6;margin-bottom:20px">
            Cette application PETIT CAFE tente d'utiliser le projet Firebase
            <strong style="background:rgba(255,255,255,0.2);padding:2px 8px;border-radius:4px">bodoro-menu</strong>
            qui héberge le restaurant BODORO en production.
          </p>
          <p style="font-size:1rem;line-height:1.6;margin-bottom:24px">
            Pour éviter d'écraser les données BODORO, l'application a été <strong>BLOQUÉE</strong>.<br>
            Vous devez créer un <strong>nouveau projet Firebase</strong> dédié à PETIT CAFE.
          </p>
          <div style="background:rgba(0,0,0,0.3);padding:16px;border-radius:8px;text-align:left;font-size:0.875rem;line-height:1.7;margin-bottom:20px">
            <strong>📋 Procédure :</strong><br>
            1. Allez sur https://console.firebase.google.com<br>
            2. Cliquez "Add project" → nommez-le "petit-cafe-kiosque"<br>
            3. Activez Firestore Database<br>
            4. Project Settings → Your apps → Add web app<br>
            5. Copiez le firebaseConfig<br>
            6. Modifiez le fichier <code style="background:rgba(255,255,255,0.15);padding:2px 6px;border-radius:3px">js/firebase-config.js</code><br>
            7. Remplacez les valeurs par les vôtres<br>
            8. Rechargez cette page
          </div>
          <button onclick="location.reload()" style="background:#fff;color:#dc2626;border:none;padding:12px 24px;border-radius:8px;font-size:1rem;font-weight:700;cursor:pointer">
            🔄 Recharger après configuration
          </button>
        </div>
      </div>`;
  });

  // Empêcher toute initialisation Firebase
  window._FIREBASE_BLOCKED = true;

  // Stubs pour éviter les erreurs JS
  window.firebase = { initializeApp: () => ({}) };
  window.firestore = {
    collection: () => ({
      doc: () => ({ get: () => Promise.resolve({ exists:false, data:()=>({}) }), set: () => Promise.resolve() }),
      get: () => Promise.resolve({ docs: [] }),
      add: () => Promise.resolve({ id: 'blocked' }),
      onSnapshot: () => () => {}
    }),
    batch: () => ({ delete: () => {}, commit: () => Promise.resolve() })
  };
  window.FS = {
    config: () => window.firestore.collection('config').doc('restaurant'),
    categories: () => window.firestore.collection('categories'),
    items: () => window.firestore.collection('items'),
    orders: () => window.firestore.collection('orders'),
    promotions: () => window.firestore.collection('promotions'),
    testimonials: () => window.firestore.collection('testimonials')
  };
} else if (!_IS_CONFIGURED) {
  // ⚠️ CONFIG NON ENCORE REMPLIE → écran d'onboarding
  console.warn('⚠️ firebase-config.js non configuré — affichage écran onboarding');

  document.addEventListener('DOMContentLoaded', () => {
    document.body.innerHTML = `
      <div style="position:fixed;inset:0;background:linear-gradient(135deg,#3E2723,#5A3A2A);color:#FAEBD7;display:flex;align-items:center;justify-content:center;padding:24px;font-family:system-ui,sans-serif">
        <div style="max-width:640px;text-align:center">
          <img src="assets/logo.png" alt="PETIT CAFE" style="width:100px;height:100px;border-radius:50%;border:3px solid #C86A2F;margin-bottom:16px" onerror="this.style.display='none'">
          <h1 style="font-size:1.75rem;font-weight:800;color:#FAEBD7;margin-bottom:8px">Configuration requise</h1>
          <p style="font-size:1rem;color:#D4B896;font-style:italic;margin-bottom:24px">PETIT CAFE — Votre kiosque de référence</p>
          <div style="background:rgba(255,252,245,0.1);padding:20px;border-radius:12px;text-align:left;font-size:0.9375rem;line-height:1.7;margin-bottom:20px;border:1px solid rgba(212,116,46,0.4)">
            <p style="font-weight:700;color:#D4742E;margin-bottom:12px">📋 Pour démarrer PETIT CAFE :</p>
            <ol style="margin:0;padding-left:20px;color:#FAEBD7">
              <li style="margin-bottom:8px">Allez sur <a href="https://console.firebase.google.com" target="_blank" style="color:#D4742E">console.firebase.google.com</a></li>
              <li style="margin-bottom:8px">Cliquez <strong>"Add project"</strong> → nommez-le <code style="background:rgba(0,0,0,0.3);padding:2px 6px;border-radius:3px">petit-cafe-kiosque</code></li>
              <li style="margin-bottom:8px">Activez <strong>Firestore Database</strong> (mode production)</li>
              <li style="margin-bottom:8px">Project Settings → Your apps → <strong>Add web app</strong></li>
              <li style="margin-bottom:8px">Copiez le <code style="background:rgba(0,0,0,0.3);padding:2px 6px;border-radius:3px">firebaseConfig</code> fourni</li>
              <li style="margin-bottom:8px">Modifiez le fichier <code style="background:rgba(0,0,0,0.3);padding:2px 6px;border-radius:3px">js/firebase-config.js</code></li>
              <li style="margin-bottom:8px">Remplacez les valeurs <code style="background:rgba(0,0,0,0.3);padding:2px 6px;border-radius:3px">VOTRE_...</code> par les vôtres</li>
              <li>Rechargez cette page</li>
            </ol>
          </div>
          <p style="font-size:0.8125rem;color:#A88870;line-height:1.6">
            ⚠️ <strong>Important :</strong> N'utilisez JAMAIS le projet <code style="background:rgba(0,0,0,0.3);padding:2px 6px;border-radius:3px">bodoro-menu</code> — il héberge le restaurant BODORO.
            PETIT CAFE doit avoir son propre projet Firebase séparé.
          </p>
        </div>
      </div>`;
  });

  // Stubs
  window._FIREBASE_NOT_CONFIGURED = true;
  window.firebase = { initializeApp: () => ({}) };
  window.firestore = {
    collection: () => ({
      doc: () => ({ get: () => Promise.resolve({ exists:false, data:()=>({}) }), set: () => Promise.resolve() }),
      get: () => Promise.resolve({ docs: [] }),
      add: () => Promise.resolve({ id: 'not-configured' }),
      onSnapshot: () => () => {}
    }),
    batch: () => ({ delete: () => {}, commit: () => Promise.resolve() })
  };
  window.FS = {
    config: () => window.firestore.collection('config').doc('restaurant'),
    categories: () => window.firestore.collection('categories'),
    items: () => window.firestore.collection('items'),
    orders: () => window.firestore.collection('orders'),
    promotions: () => window.firestore.collection('promotions'),
    testimonials: () => window.firestore.collection('testimonials')
  };
} else {
  // ✅ Configuration valide — initialiser Firebase normalement
  firebase.initializeApp(firebaseConfig);
  const firestore = firebase.firestore();

  // Collections Firestore
  const FS = {
    config:       () => firestore.collection('config').doc('restaurant'),
    categories:   () => firestore.collection('categories'),
    items:        () => firestore.collection('items'),
    orders:       () => firestore.collection('orders'),
    promotions:   () => firestore.collection('promotions'),
    testimonials: () => firestore.collection('testimonials'),
  };

  // Exposer globalement
  window.firestore = firestore;
  window.FS = FS;

  console.log('✓ Firebase initialisé pour PETIT CAFE (projet: ' + firebaseConfig.projectId + ')');
}
