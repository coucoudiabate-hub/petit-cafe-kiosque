// ============================================================
// PETIT CAFE — Configuration centrale de l'identité commerciale
// ------------------------------------------------------------
// SOURCE UNIQUE DE VÉRITÉ pour toutes les informations business.
// Toute modification d'identité (nom, slogan, adresse, téléphones,
// localisation, devise...) doit être faite ICI UNIQUEMENT.
// Tous les autres fichiers (index.html, store.js, app.js, client.js,
// admin.js, utils.js, manifest.json...) lisent cet objet et ne
// doivent JAMAIS hardcoder une information business.
// ============================================================

const BUSINESS = Object.freeze({

  // ---- Identité ----
  businessName:    'PETIT CAFE',
  slogan:          'VOTRE KIOSQUE DE REFERENCE',
  tagline:         'VOTRE KIOSQUE DE REFERENCE', // alias utilisé dans certains contextes

  // ---- Localisation ----
  address:         'Au Commerce, en face de la RTI',
  city:            'Bouaké',
  country:         "Côte d'Ivoire",
  fullAddress:     "Au Commerce, en face de la RTI — Bouaké, Côte d'Ivoire",

  // ---- Téléphones ----
  phonePrimary:    '07 47 97 26 61',
  phoneSecondary:  '07 57 03 02 71',

  // ---- WhatsApp (numéro international, format digits uniquement, avec indicatif 225) ----
  // Le numéro principal est utilisé comme numéro WhatsApp.
  whatsapp:        '2250747972661',

  // ---- Devise ----
  // currencyCode = code ISO pour les calculs / exports
  // currencySymbol = symbole affiché à côté des montants
  currencyCode:    'XOF',
  currencySymbol:  'FCFA',

  // ---- Localisation Google Maps ----
  googleMapsPlusCode: 'MXJF+9GX, Bouaké',
  latitude:        7.681002,
  longitude:       -5.0261089,
  mapZoom:         18,

  // Lien Google Maps officiel fourni par le propriétaire.
  // Le bouton "NOUS TROUVER SUR GOOGLE MAPS" ouvre exactement cette URL.
  googleMapsUrl:   'https://www.google.com/maps/place/MXJF%2B9GX,+Bouak%C3%A9/@7.6814544,-5.0253378,18.4z/data=!4m6!3m5!1s0xfc7ff2575711d6b:0x1bb53b07f4a297d0!8m2!3d7.681002!4d-5.0261089!16s%2Fg%2F11fvkcqst_?entry=ttu&g_ep=EgoyMDI2MDgxNi4wIKXMDSoASAFQAw%3D%3D',

  // ---- Apparence ----
  logoPath:        'assets/logo.png',
  themeColor:      '#3E2723', // brun foncé café (couleur dominante logo)
  backgroundColor: '#FAEBD7', // beige crème

  // ---- Heures d'ouverture par défaut (kiosque ouvre tôt) ----
  openingTime:     '06:30',
  closingTime:     '23:00',
  openDays:        'Lundi - Dimanche',

  // ---- Texte "À propos" par défaut ----
  aboutText:       "PETIT CAFE — Votre kiosque de référence à Bouaké. Café fraîchement torréfié, boissons fraîches, snacks, crédit téléphone et épicerie express. Tout au même endroit, au Commerce en face de la RTI. Ouvert tous les jours.",

  // ---- Sécurité admin ----
  // Mot de passe par défaut (peut être changé dans Config une fois l'app en ligne).
  adminPassword:   'petitcafe2024',

  // ---- Réseaux sociaux (vides par défaut, configurables dans Admin > Configuration) ----
  instagram:       '',
  facebook:        '',
  tiktok:          '',

  // ---- URL publique du site (pour générer les QR codes) ----
  // URL officielle de production PETIT CAFE.
  // Tous les QR codes générés par l'admin pointeront vers cette URL.
  siteUrl:         'https://kiosquepetitcafe.netlify.app'
});

// Expose globalement (aucun module / bundler — application vanilla JS)
window.BUSINESS = BUSINESS;

// ============================================================
// HELPERS — fonctions utilitaires liées à l'identité business
// ============================================================

/**
 * Renvoie le nom complet formaté pour l'affichage (nom + slogan).
 * Exemple : "PETIT CAFE — VOTRE KIOSQUE DE REFERENCE"
 */
function getBusinessDisplayName() {
  return `${BUSINESS.businessName} — ${BUSINESS.slogan}`;
}

/**
 * Formate un montant selon la devise officielle de PETIT CAFE.
 * Exemple : 1500 → "1 500 FCFA"
 */
function formatBusinessAmount(amount) {
  return Number(amount || 0).toLocaleString('fr-FR') + ' ' + BUSINESS.currencySymbol;
}

/**
 * Renvoie la liste des téléphones formatés pour l'affichage.
 */
function getBusinessPhones() {
  return [BUSINESS.phonePrimary, BUSINESS.phoneSecondary];
}

/**
 * Ouvre Google Maps sur la localisation officielle de PETIT CAFE.
 * Utilise le lien officiel fourni par le propriétaire.
 */
function openBusinessGoogleMaps() {
  window.open(BUSINESS.googleMapsUrl, '_blank', 'noopener');
}

/**
 * Construit l'URL WhatsApp normalisée (wa.me) pour PETIT CAFE.
 */
function getBusinessWhatsAppUrl(message) {
  const num = (BUSINESS.whatsapp || '').replace(/[^0-9]/g, '');
  const base = `https://wa.me/${num}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
