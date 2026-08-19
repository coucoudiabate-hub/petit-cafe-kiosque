// ============================================================
// PETIT CAFE — Migration (v5.0 — DÉSACTIVÉE)
// ------------------------------------------------------------
// ⚠️ MIGRATION AUTOMATIQUE DÉSACTIVÉE DANS CETTE VERSION.
//
// Raison : la migration automatique pouvait écraser les données
// d'un autre projet Firebase (ex: BODORO) si firebase-config.js
// pointait par erreur vers le mauvais projet.
//
// Désormais, PETIT CAFE utilise un projet Firebase SÉPARÉ.
// Au premier lancement, l'app crée uniquement les données si
// la base est VIDE — elle ne supprime JAMAIS de données existantes.
//
// Si vous voulez forcer une réinstallation du catalogue kiosque :
//   1. Admin → Maintenance → "Reset Total" (efface TOUT du projet PETIT CAFE)
//   2. Rechargez la page → seed.js recréera le catalogue kiosque
//
// AUCUNE migration automatique n'a lieu sans action explicite de l'admin.
// ============================================================

const Migrations = {
  TARGET_VERSION: 0, // 0 = aucune migration automatique

  /**
   * Point d'entrée — ne fait RIEN dans cette version.
   * La migration automatique est définitivement désactivée pour
   * empêcher tout écrasement accidentel d'un autre projet Firebase.
   */
  async runIfNeeded() {
    // 🛡️ Sécurité : vérifier qu'on n'est pas sur bodoro-menu
    if (typeof firebaseConfig !== 'undefined' && firebaseConfig.projectId === 'bodoro-menu') {
      console.error('🚨 Migration BLOQUÉE : projet bodoro-menu détecté');
      return false;
    }

    // Ne rien faire — la migration est désactivée.
    // L'app utilisera seed.js uniquement si la base est vide
    // (voir js/app.js → if (!DB.isSeeded()) await seedDatabase())
    console.log('ℹ️ Migration automatique désactivée (PETIT CAFE v5.0 isolé)');
    return false;
  },

  // Méthode vide pour compatibilité (au cas où d'autres fichiers l'appellent)
  async _migrateV2_Kiosque() {
    console.warn('⚠️ _migrateV2_Kiosque() désactivée — ne fait rien');
    return;
  },

  async _updateConfigIfNeeded() {
    console.warn('⚠️ _updateConfigIfNeeded() désactivée — ne fait rien');
    return;
  }
};
