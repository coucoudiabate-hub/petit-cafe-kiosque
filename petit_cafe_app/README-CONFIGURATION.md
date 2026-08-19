# 🛡️ PETIT CAFE v5.0 — VERSION ISOLÉE (SÉCURISÉE)

## ✅ PROBLÈME RÉSOLU DÉFINITIVEMENT

Cette version **v5.0** corrige définitivement le problème d'écrasement des données BODORO.

### 🛡️ Trois niveaux de protection

1. **Config Firebase vide par défaut** — l'app ne démarre pas tant que vous n'avez pas créé votre propre projet Firebase
2. **Garde-fou anti-bodoro-menu** — si vous mettez par erreur les clés du projet `bodoro-menu`, l'app se bloque immédiatement avec un écran rouge d'avertissement
3. **Migration automatique désactivée** — plus aucune suppression/modification de données sans action explicite de l'admin

---

## 🚀 PROCÉDURE DE CONFIGURATION (10 minutes)

### Étape 1 : Créez un nouveau projet Firebase pour PETIT CAFE

1. Allez sur https://console.firebase.google.com
2. Cliquez **"Add project"**
3. Nommez-le **`petit-cafe-kiosque`** (ou un autre nom de votre choix)
4. Acceptez les conditions → Create project
5. Dans le menu gauche, cliquez **"Firestore Database"** → **"Create database"**
6. Choisissez **"Start in production mode"** → choisissez une localisation (ex: `europe-west1`)
7. Cliquez **"Enable"**

### Étape 2 : Configurez les règles Firestore

1. Dans Firestore Database → onglet **"Rules"**
2. Remplacez le contenu par :

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

3. Cliquez **"Publish"**

*(Pour la production, vous pourrez restreindre `write` aux utilisateurs authentifiés plus tard)*

### Étape 3 : Ajoutez une application web

1. Dans Project Settings (⚙️ en haut à gauche) → onglet **"General"**
2. Descendez à "Your apps" → cliquez l'icône **`</>`** (Web)
3. Saisissez un nom d'app (ex: `PETIT CAFE Web`) → **Register app**
4. Copiez le bloc `firebaseConfig = { ... }` qui s'affiche

### Étape 4 : Configurez PETIT CAFE

1. Décompressez `PETIT-CAFE-v5.0-ISOLATED.zip`
2. Ouvrez le fichier `petit_cafe_app/js/firebase-config.js` dans un éditeur de texte
3. Remplacez les valeurs `VOTRE_...` par les vôtres :

```javascript
const firebaseConfig = {
  apiKey:            "AIzaSyXXXXXXXXXXXXXXXXXXXX",  // ← votre clé
  authDomain:        "petit-cafe-kiosque.firebaseapp.com",
  projectId:         "petit-cafe-kiosque",
  storageBucket:     "petit-cafe-kiosque.firebasestorage.app",
  messagingSenderId: "123456789012",
  appId:             "1:123456789012:web:abcdef1234567890"
};
```

4. **Sauvegardez** le fichier

### Étape 5 : Testez en local

1. Ouvrez `petit_cafe_app/index.html` dans Chrome
2. L'app doit se lancer et afficher :
   - "PETIT CAFE — Votre kiosque de référence"
   - Le catalogue kiosque (Café, Boissons, Snacks, Crédit, Épicerie)
3. Si vous voyez l'écran d'onboarding ou de blocage → vérifiez votre config

### Étape 6 : Déployez sur Netlify

1. Glissez le dossier `petit_cafe_app/` sur https://app.netlify.com/drop
2. Une fois déployé, configurez votre domaine personnalisé : `kiosquepetitcafe.netlify.app`

---

## 🛡️ Comment les protections fonctionnent

### 1. Config vide par défaut
Le fichier `firebase-config.js` contient des valeurs `VOTRE_...` par défaut. Tant que vous ne les remplacez pas, l'app affiche un **écran d'onboarding** (fond marron/orange) avec la procédure à suivre.

### 2. Garde-fou anti-bodoro-menu
Avant toute initialisation Firebase, le code vérifie :
```javascript
if (firebaseConfig.projectId === 'bodoro-menu' ||
    firebaseConfig.authDomain === 'bodoro-menu.firebaseapp.com' ||
    firebaseConfig.apiKey === 'AIzaSyBkoefGJhiWFh5eHEwA4gnlsU5mOUoIM7I') {
  // 🚨 BLOCAGE — écran rouge d'avertissement
}
```

Si vous mettez par erreur les clés BODORO, l'app affiche un **écran rouge bloquant** avec la procédure de création d'un nouveau projet. **Aucune donnée n'est touchée.**

### 3. Migration automatique désactivée
Le fichier `migrate.js` ne fait **plus rien**. La fonction `Migrations.runIfNeeded()` retourne `false` immédiatement. Aucune purge automatique, plus jamais.

### 4. Seed uniquement si base vide
Le fichier `app.js` ne crée le catalogue kiosque QUE si la base est **complètement vide** (`DB.isSeeded()` retourne `false`). Si des données existent déjà, elles sont conservées intactes.

---

## 📊 Comparaison v4.0 → v5.0

| Aspect | v4.0 (ancienne) | v5.0 (isolée) |
|--------|-----------------|----------------|
| Projet Firebase | `bodoro-menu` (partagé avec BODORO) ⚠️ | `petit-cafe-kiosque` (séparé) ✅ |
| Migration auto | Active (purgeait les données) | **Désactivée** ✅ |
| Garde-fou bodoro | Aucun | **Triple vérification** ✅ |
| Config par défaut | Pré-remplie avec bodoro-menu | **Vide** (à remplir) ✅ |
| Seed automatique | À chaque lancement | **Uniquement si base vide** ✅ |
| Risque d'écrasement BODORO | ÉLEVÉ ⚠️⚠️⚠️ | **ZÉRO** ✅ |

---

## 📦 Contenu du ZIP

```
petit_cafe_app/
├── index.html
├── manifest.json
├── netlify.toml
├── assets/
│   └── logo.png
├── css/
│   └── style.css
└── js/
    ├── firebase-config.js    ← ⚠️ À CONFIGURER (voir procédure)
    ├── business-config.js    ← Infos PETIT CAFE (nom, slogan, adresse)
    ├── store.js              ← Logique données + reset/maintenance
    ├── seed.js               ← Catalogue kiosque par défaut
    ├── migrate.js            ← DÉSACTIVÉ (ne fait rien)
    ├── utils.js              ← Panier, modal, historique
    ├── client.js             ← Pages client (accueil, catalogue, contact)
    ├── admin.js              ← Pages admin (dashboard, ventes, QR codes, maintenance)
    └── app.js                ← Contrôleur principal
```

---

## 🔄 Si vous voulez réinitialiser PETIT CAFE plus tard

**Attention** : cela n'affecte QUE le projet Firebase de PETIT CAFE, jamais BODORO.

1. Allez dans Admin (⚙️ Admin → mot de passe `petitcafe2024`)
2. Section **Maintenance**
3. Choisissez le type de reset :
   - **Reset Commandes** : supprime uniquement l'historique des ventes
   - **Reset Catalogue** : supprime articles + catégories
   - **Reset Marketing** : supprime promotions + témoignages
   - **Reset Total** : tout effacer + réinstaller catalogue kiosque

---

## ✅ Vérification finale

Après configuration, vérifiez ces 3 points :

1. **Écran d'accueil PETIT CAFE** : `https://kiosquepetitcafe.netlify.app` affiche le catalogue kiosque (café, snacks, crédit, épicerie)
2. **BODORO intact** : `https://bodoro-menus.netlify.app` affiche toujours les 225 articles Bodoro
3. **Console Firebase** : `https://console.firebase.google.com` → vous voyez **deux projets séparés** :
   - `bodoro-menu` (BODORO — 225 articles, 80 commandes)
   - `petit-cafe-kiosque` (PETIT CAFE — 55 articles kiosque)

**Si ces 3 points sont OK, vous êtes définitivement tranquille.** ✅
