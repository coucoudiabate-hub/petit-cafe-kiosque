// ============================================================
// PETIT CAFE — Service Worker (PWA)
// ------------------------------------------------------------
// Stratégie :
//  - App shell (HTML/CSS/JS/assets) : cache-first, avec mise à jour
//    en arrière-plan (stale-while-revalidate) pour rester à jour
//    sans bloquer l'affichage.
//  - Firestore / API externes (Google Fonts, Chart.js CDN, etc.) :
//    network-first avec repli sur le cache si hors-ligne.
//  - Jamais de mise en cache des requêtes Firestore elles-mêmes
//    (données dynamiques) pour ne jamais servir de commandes/stats
//    obsolètes.
// ============================================================

const CACHE_VERSION = 'petit-cafe-v1';
const APP_SHELL_CACHE = `${CACHE_VERSION}-shell`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

const APP_SHELL_FILES = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './js/utils.js',
  './js/business-config.js',
  './js/firebase-config.js',
  './js/store.js',
  './js/seed.js',
  './js/migrate.js',
  './js/client.js',
  './js/admin.js',
  './js/app.js',
  './assets/logo.png',
];

// ---- INSTALL : met en cache l'app shell ----
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE)
      .then((cache) => cache.addAll(APP_SHELL_FILES))
      .then(() => self.skipWaiting())
  );
});

// ---- ACTIVATE : nettoie les anciens caches ----
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith('petit-cafe-') && key !== APP_SHELL_CACHE && key !== RUNTIME_CACHE)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// ---- Ne jamais toucher aux requêtes Firestore / Firebase (données live) ----
function isFirebaseRequest(url) {
  return url.hostname.includes('firestore.googleapis.com') ||
         url.hostname.includes('firebaseio.com') ||
         url.hostname.includes('googleapis.com');
}

// ---- FETCH ----
self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return; // ne jamais intercepter les écritures

  const url = new URL(request.url);

  // Laisser passer Firestore/Firebase sans interception (toujours réseau)
  if (isFirebaseRequest(url)) return;

  // Navigation (chargement de page) : réseau d'abord, repli sur cache/app shell
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(APP_SHELL_CACHE).then((cache) => cache.put('./index.html', clone));
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Fichiers de l'app shell (même origine) : cache d'abord, mise à jour en tâche de fond
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const networkFetch = fetch(request)
          .then((response) => {
            if (response && response.status === 200) {
              const clone = response.clone();
              caches.open(APP_SHELL_CACHE).then((cache) => cache.put(request, clone));
            }
            return response;
          })
          .catch(() => cached);
        return cached || networkFetch;
      })
    );
    return;
  }

  // Ressources externes (fonts, Chart.js, QRCode.js) : network-first + cache de secours
  event.respondWith(
    fetch(request)
      .then((response) => {
        const clone = response.clone();
        caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, clone));
        return response;
      })
      .catch(() => caches.match(request))
  );
});
