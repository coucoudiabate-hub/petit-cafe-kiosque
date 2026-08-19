// ============================================================
// PETIT CAFE — Seed Data v2.0 (Kiosque)
// ------------------------------------------------------------
// Catalogue par défaut d'un kiosque-café de quartier :
//   - Café & Boissons Chaudes
//   - Boissons Fraîches
//   - Pâtisseries & Viennoiseries
//   - Snacks & Biscuits
//   - Sandwichs & Salés
//   - Glaces & Desserts
//   - Crédit & Services
//   - Épicerie Express
// Les données ne sont chargées qu'au premier lancement
// (ou via le mécanisme de migration de js/migrate.js).
// ============================================================

async function seedDatabase() {
  if (DB.isSeeded()) return;

  // --- Categories ---
  const categories = [
    { id: 'cat_cafe',        name: 'Café & Boissons Chaudes', emoji: '☕', sortOrder: 0, active: true },
    { id: 'cat_fraiches',    name: 'Boissons Fraîches',       emoji: '🥤', sortOrder: 1, active: true },
    { id: 'cat_patisseries', name: 'Pâtisseries & Viennoiseries', emoji: '🥐', sortOrder: 2, active: true },
    { id: 'cat_snacks',      name: 'Snacks & Biscuits',       emoji: '🍪', sortOrder: 3, active: true },
    { id: 'cat_sandwichs',   name: 'Sandwichs & Salés',       emoji: '🥪', sortOrder: 4, active: true },
    { id: 'cat_glaces',      name: 'Glaces & Desserts',       emoji: '🍨', sortOrder: 5, active: true },
    { id: 'cat_credit',      name: 'Crédit & Services',       emoji: '📱', sortOrder: 6, active: true },
    { id: 'cat_epicerie',    name: 'Épicerie Express',        emoji: '🛒', sortOrder: 7, active: true }
  ];

  // --- Items (catalogue kiosque) ---
  const items = [
    // ---- Café & Boissons Chaudes ----
    { id: 'item_espresso',     name: 'Espresso',           description: 'Café serré intense, 30ml, torréfaction maison', price: 300, emoji: '☕', categoryId: 'cat_cafe', available: true, isMenuJour: false, promoPrice: 0 },
    { id: 'item_cappuccino',   name: 'Cappuccino',         description: 'Espresso + mousse de lait onctueuse + cacao', price: 600, emoji: '☕', categoryId: 'cat_cafe', available: true, isMenuJour: true, promoPrice: 500 },
    { id: 'item_cafe_lait',    name: 'Café au Lait',       description: 'Café noir + lait chaud, sucre selon votre goût', price: 400, emoji: '☕', categoryId: 'cat_cafe', available: true, isMenuJour: false, promoPrice: 0 },
    { id: 'item_latte',        name: 'Café Latte',         description: 'Lait chaud + espresso + mousse de lait douce', price: 700, emoji: '☕', categoryId: 'cat_cafe', available: true, isMenuJour: false, promoPrice: 0 },
    { id: 'item_chocolat',     name: 'Chocolat Chaud',     description: 'Chocolat au lait fondant, garni de chantilly', price: 600, emoji: '🍫', categoryId: 'cat_cafe', available: true, isMenuJour: false, promoPrice: 0 },
    { id: 'item_the',          name: 'Thé Parfumé',        description: 'Thé noir, vert ou menthe — sucre à volonté', price: 300, emoji: '🫖', categoryId: 'cat_cafe', available: true, isMenuJour: false, promoPrice: 0 },
    { id: 'item_nescafe',      name: 'Nescafé Classic',    description: 'Café soluble rapide, idéal sur le pouce', price: 200, emoji: '☕', categoryId: 'cat_cafe', available: true, isMenuJour: false, promoPrice: 0 },

    // ---- Boissons Fraîches ----
    { id: 'item_eau',          name: 'Eau Minérale 50cl',  description: 'Bouteille d\'eau fraîche — source naturelle', price: 200, emoji: '💧', categoryId: 'cat_fraiches', available: true, isMenuJour: false, promoPrice: 0 },
    { id: 'item_coca',         name: 'Coca-Cola 50cl',     description: 'Soda rafraîchissant bien frappé', price: 400, emoji: '🥤', categoryId: 'cat_fraiches', available: true, isMenuJour: false, promoPrice: 0 },
    { id: 'item_fanta',        name: 'Fanta Orange 50cl',  description: 'Soda à l\'orange, bien frais', price: 400, emoji: '🥤', categoryId: 'cat_fraiches', available: true, isMenuJour: false, promoPrice: 0 },
    { id: 'item_sprite',       name: 'Sprite 50cl',        description: 'Soda citron-lime pétillant', price: 400, emoji: '🥤', categoryId: 'cat_fraiches', available: true, isMenuJour: false, promoPrice: 0 },
    { id: 'item_jus_ananas',   name: 'Jus d\'Ananas',      description: 'Jus d\'ananas 100% naturel, fraîchement pressé', price: 500, emoji: '🍍', categoryId: 'cat_fraiches', available: true, isMenuJour: false, promoPrice: 0 },
    { id: 'item_bissap',       name: 'Bissap Frais',       description: 'Jus d\'hibiscus maison, vanille et menthe', price: 300, emoji: '🌺', categoryId: 'cat_fraiches', available: true, isMenuJour: true, promoPrice: 0 },
    { id: 'item_gingembre',    name: 'Jus de Gingembre',   description: 'Jus de gingembre frais piquant, citron et miel', price: 300, emoji: '🫚', categoryId: 'cat_fraiches', available: true, isMenuJour: false, promoPrice: 0 },
    { id: 'item_energy',       name: 'Boisson Énergisante', description: 'Canette 25cl — coup de boost garanti', price: 600, emoji: '⚡', categoryId: 'cat_fraiches', available: true, isMenuJour: false, promoPrice: 0 },

    // ---- Pâtisseries & Viennoiseries ----
    { id: 'item_croissant',    name: 'Croissant Beurre',   description: 'Croissant pur beurre, doré et croustillant', price: 300, emoji: '🥐', categoryId: 'cat_patisseries', available: true, isMenuJour: false, promoPrice: 0 },
    { id: 'item_pain_choco',   name: 'Pain au Chocolat',   description: 'Viennoiserie feuilletée + 2 barres de chocolat', price: 350, emoji: '🥐', categoryId: 'cat_patisseries', available: true, isMenuJour: false, promoPrice: 0 },
    { id: 'item_beignet',      name: 'Beignets (x3)',      description: '3 beignets chauds, sucre glace — recette maison', price: 200, emoji: '🍩', categoryId: 'cat_patisseries', available: true, isMenuJour: false, promoPrice: 0 },
    { id: 'item_gateau_choco', name: 'Part de Gâteau Choco', description: 'Moelleux chocolat noir, cœur fondant', price: 800, emoji: '🍰', categoryId: 'cat_patisseries', available: true, isMenuJour: false, promoPrice: 0 },
    { id: 'item_muffin',       name: 'Muffin',             description: 'Muffin nature, pépites de chocolat ou myrtille', price: 500, emoji: '🧁', categoryId: 'cat_patisseries', available: true, isMenuJour: false, promoPrice: 0 },
    { id: 'item_pain',         name: 'Pain Frais',         description: 'Demi-pain chaud, cuit sur place le matin', price: 150, emoji: '🍞', categoryId: 'cat_patisseries', available: true, isMenuJour: false, promoPrice: 0 },

    // ---- Snacks & Biscuits ----
    { id: 'item_chips',        name: 'Chips Salées',       description: 'Paquet de chips croustillantes — grand format', price: 300, emoji: '🍟', categoryId: 'cat_snacks', available: true, isMenuJour: false, promoPrice: 0 },
    { id: 'item_pringles',     name: 'Pringles Original',  description: 'Tube de chips pressées, saveur classique', price: 800, emoji: '🥔', categoryId: 'cat_snacks', available: true, isMenuJour: false, promoPrice: 0 },
    { id: 'item_chocolat',     name: 'Tablette Chocolat',  description: 'Barre de chocolat au lait, noisettes ou noir', price: 500, emoji: '🍫', categoryId: 'cat_snacks', available: true, isMenuJour: false, promoPrice: 0 },
    { id: 'item_biscuits',     name: 'Paquet Biscuits',    description: 'Biscuits secs, sablés ou fourrés — au choix', price: 400, emoji: '🍪', categoryId: 'cat_snacks', available: true, isMenuJour: false, promoPrice: 0 },
    { id: 'item_bonbons',      name: 'Sachet Bonbons',     description: 'Assortiment de bonbons mixtes — 100g', price: 200, emoji: '🍬', categoryId: 'cat_snacks', available: true, isMenuJour: false, promoPrice: 0 },
    { id: 'item_chewing',      name: 'Chewing-gum',        description: 'Paquet de chewing-gum menthe fraîche', price: 200, emoji: '🍬', categoryId: 'cat_snacks', available: true, isMenuJour: false, promoPrice: 0 },
    { id: 'item_arachide',     name: 'Arachides Grillées', description: 'Sac d\'arachides grillées salées — 150g', price: 150, emoji: '🥜', categoryId: 'cat_snacks', available: true, isMenuJour: false, promoPrice: 0 },

    // ---- Sandwichs & Salés ----
    { id: 'item_sandwich_oeuf',  name: 'Sandwich Oeuf',     description: 'Pain + omelette + crudités + sauce maison', price: 500, emoji: '🥪', categoryId: 'cat_sandwichs', available: true, isMenuJour: false, promoPrice: 0 },
    { id: 'item_sandwich_poulet', name: 'Sandwich Poulet',  description: 'Pain + poulet braisé + crudités + mayonnaise', price: 800, emoji: '🥪', categoryId: 'cat_sandwichs', available: true, isMenuJour: true, promoPrice: 700 },
    { id: 'item_sandwich_sauc',  name: 'Sandwich Saucisse', description: 'Pain + saucisses + oignon + sauce piquante', price: 500, emoji: '🌭', categoryId: 'cat_sandwichs', available: true, isMenuJour: false, promoPrice: 0 },
    { id: 'item_shawarma',       name: 'Shawarma Poulet',   description: 'Pain pita + poulet rôti + crudités + sauce tahini', price: 1000, emoji: '🌯', categoryId: 'cat_sandwichs', available: true, isMenuJour: false, promoPrice: 0 },
    { id: 'item_pizza_part',    name: 'Part de Pizza',     description: '1 part pizza chaude — margherita ou poulet', price: 500, emoji: '🍕', categoryId: 'cat_sandwichs', available: true, isMenuJour: false, promoPrice: 0 },
    { id: 'item_omelette',      name: 'Omelette Complète', description: 'Oeufs + pomme de terre + oignon + poivron', price: 600, emoji: '🍳', categoryId: 'cat_sandwichs', available: true, isMenuJour: false, promoPrice: 0 },

    // ---- Glaces & Desserts ----
    { id: 'item_glace_cornet', name: 'Glace Cornet',       description: '2 boules au choix — vanille, chocolat, fraise', price: 400, emoji: '🍦', categoryId: 'cat_glaces', available: true, isMenuJour: false, promoPrice: 0 },
    { id: 'item_glace_pot',    name: 'Glace en Pot',       description: 'Pot individuel 125ml — saveur au choix', price: 500, emoji: '🍨', categoryId: 'cat_glaces', available: true, isMenuJour: false, promoPrice: 0 },
    { id: 'item_esquimau',     name: 'Esquimau',           description: 'Glace sur bâtonnet — chocolat ou vanille', price: 300, emoji: '🍫', categoryId: 'cat_glaces', available: true, isMenuJour: false, promoPrice: 0 },
    { id: 'item_yaourt',       name: 'Yaourt Nature',      description: 'Yaourt frais + coulis de fruits + miel', price: 300, emoji: '🥛', categoryId: 'cat_glaces', available: true, isMenuJour: false, promoPrice: 0 },
    { id: 'item_fruits',       name: 'Salade de Fruits',   description: 'Fruits frais de saison coupés — ananas, banane, orange', price: 500, emoji: '🍎', categoryId: 'cat_glaces', available: true, isMenuJour: false, promoPrice: 0 },

    // ---- Crédit & Services ----
    { id: 'item_credit_500',   name: 'Crédit Téléphone 500F',  description: 'Recharge Moov / Orange / MTN — 500 FCFA', price: 500, emoji: '📱', categoryId: 'cat_credit', available: true, isMenuJour: false, promoPrice: 0 },
    { id: 'item_credit_1000',  name: 'Crédit Téléphone 1000F', description: 'Recharge Moov / Orange / MTN — 1 000 FCFA', price: 1000, emoji: '📱', categoryId: 'cat_credit', available: true, isMenuJour: false, promoPrice: 0 },
    { id: 'item_credit_2000',  name: 'Crédit Téléphone 2000F', description: 'Recharge Moov / Orange / MTN — 2 000 FCFA', price: 2000, emoji: '📱', categoryId: 'cat_credit', available: true, isMenuJour: false, promoPrice: 0 },
    { id: 'item_credit_5000',  name: 'Crédit Téléphone 5000F', description: 'Recharge Moov / Orange / MTN — 5 000 FCFA', price: 5000, emoji: '📱', categoryId: 'cat_credit', available: true, isMenuJour: false, promoPrice: 0 },
    { id: 'item_data',         name: 'Forfait Data 1Go',       description: 'Forfait Internet 1Go — valide 24h', price: 500, emoji: '📶', categoryId: 'cat_credit', available: true, isMenuJour: false, promoPrice: 0 },
    { id: 'item_photocopie',   name: 'Photocopies (x10)',      description: '10 photocopies noir & blanc A4', price: 100, emoji: '📄', categoryId: 'cat_credit', available: true, isMenuJour: false, promoPrice: 0 },
    { id: 'item_impression',   name: 'Impression Couleur',     description: 'Impression couleur A4 — 1 page', price: 200, emoji: '🖨️', categoryId: 'cat_credit', available: true, isMenuJour: false, promoPrice: 0 },
    { id: 'item_charge',       name: 'Recharge Batterie',      description: 'Recharge téléphone sur place — 30 min', price: 100, emoji: '🔌', categoryId: 'cat_credit', available: true, isMenuJour: false, promoPrice: 0 },

    // ---- Épicerie Express ----
    { id: 'item_lait',         name: 'Lait en Poudre 400g',  description: 'Boîte de lait en poudre — petit-déjeuner', price: 1500, emoji: '🥛', categoryId: 'cat_epicerie', available: true, isMenuJour: false, promoPrice: 0 },
    { id: 'item_sucre',        name: 'Sucre 1kg',             description: 'Sac de sucre blanc cristallisé 1kg', price: 800, emoji: '🧂', categoryId: 'cat_epicerie', available: true, isMenuJour: false, promoPrice: 0 },
    { id: 'item_sel',          name: 'Sel 500g',              description: 'Paquet de sel iodé 500g', price: 200, emoji: '🧂', categoryId: 'cat_epicerie', available: true, isMenuJour: false, promoPrice: 0 },
    { id: 'item_savon',        name: 'Savon de Toilette',     description: 'Savon parfumé — par unité', price: 200, emoji: '🧼', categoryId: 'cat_epicerie', available: true, isMenuJour: false, promoPrice: 0 },
    { id: 'item_piles',        name: 'Piles AA (x2)',         description: '2 piles alcalines AA — longue durée', price: 500, emoji: '🔋', categoryId: 'cat_epicerie', available: true, isMenuJour: false, promoPrice: 0 },
    { id: 'item_cigarettes',   name: 'Paquet Cigarettes',     description: 'Paquet de cigarettes — marque au choix', price: 800, emoji: '🚬', categoryId: 'cat_epicerie', available: true, isMenuJour: false, promoPrice: 0 },
    { id: 'item_allumettes',   name: 'Briquet',               description: 'Briquet jetable — couleur aléatoire', price: 100, emoji: '🔥', categoryId: 'cat_epicerie', available: true, isMenuJour: false, promoPrice: 0 },
    { id: 'item_condoms',      name: 'Préservatifs (x3)',     description: 'Boîte de 3 préservatifs — qualité certifiée', price: 300, emoji: '💊', categoryId: 'cat_epicerie', available: true, isMenuJour: false, promoPrice: 0 }
  ];

  // --- Promotions ---
  const promotions = [
    { id: 'promo_1', title: 'Café du Matin',   description: 'Cappuccino + Croissant à 700 FCFA au lieu de 900 FCFA — du lundi au vendredi, 6h à 10h', discount: '-22%', emoji: '☕', active: true },
    { id: 'promo_2', title: 'Pause Goûter',    description: 'Sandwich poulet + Jus ananas à 1 000 FCFA — tous les jours à partir de 15h', discount: '-20%', emoji: '🥪', active: true },
    { id: 'promo_3', title: 'Crédit Bonus',    description: 'Recharge 5 000 FCFA → 5 500 FCFA de crédit offerts chez Orange et Moov', discount: '+10%', emoji: '📱', active: true },
    { id: 'promo_4', title: 'Fidélité',        description: 'Le 10ème café offert — carte de fidélité disponible au kiosque', discount: 'Offert', emoji: '🎁', active: true }
  ];

  // --- Testimonials (kiosque-café) ---
  const testimonials = [
    { id: 'test_1', author: 'Awa D.',  text: 'Le meilleur cappuccino du quartier ! Service rapide, patron sympa. Mon arrêt obligatoire chaque matin avant le travail.', rating: 5 },
    { id: 'test_2', author: 'Issa T.', text: 'Kiosque vraiment de référence à Bouaké. J\'y achète mon crédit, mes cigarettes et mon café. Tout est là, propre et pas cher.', rating: 5 },
    { id: 'test_3', author: 'Mariam K.', text: 'Les beignets chauds du matin sont une tuerie ! Et le bissap maison est le meilleur que j\'ai bu à Bouaké.', rating: 5 },
    { id: 'test_4', author: 'Sékou C.', text: 'PETIT CAFE n\'est pas juste un kiosque, c\'est un repère. On s\'y retrouve entre copains pour un café et discuter. Ambiance au top.', rating: 5 },
    { id: 'test_5', author: 'Fatim Z.', text: 'Tout est pratique : crédit téléphone, photocopies, eau fraîche, sandwichs. Et l\'emplacement en face de la RTI est parfait.', rating: 4 },
    { id: 'test_6', author: 'Yacou B.', text: 'Sandwich poulet + jus ananas à 1000F, imbattable ! Le shawarma maison est aussi une pépite. Je recommande à 100%.', rating: 5 },
    { id: 'test_7', author: 'Aminata S.', text: 'Enfin un kiosque propre et bien tenu à Bouaké. Le patron connaît ses clients par leur nom, très accueillant.', rating: 5 },
    { id: 'test_8', author: 'Brahima O.', text: 'Service rapide même quand il y a du monde. Le café espresso est serré comme j\'aime. Mon quotidien depuis 6 mois.', rating: 4 }
  ];

  // --- Save ---
  // Créer les catégories dans Firestore et récupérer leurs vrais IDs
  const catIdMap = {};
  for (const cat of categories) {
    const oldId = cat.id;
    const created = await DB.createCategory({
      name: cat.name, emoji: cat.emoji, sortOrder: cat.sortOrder, active: cat.active
    });
    catIdMap[oldId] = created.id;
  }

  // Créer les articles avec les bons categoryId Firestore
  for (const item of items) {
    await DB.createItem({
      name: item.name, description: item.description || '',
      price: item.price, promoPrice: item.promoPrice || 0,
      emoji: item.emoji, image: '',
      categoryId: catIdMap[item.categoryId] || '',
      available: item.available !== false,
      isMenuJour: item.isMenuJour || false,
      options: '[]'
    });
  }

  // Créer les promotions
  for (const p of promotions) {
    await DB.createPromotion({ title: p.title, description: p.description, discount: p.discount, emoji: p.emoji, active: p.active !== false });
  }

  // Créer les témoignages
  for (const t of testimonials) {
    await DB.createTestimonial({ author: t.author, text: t.text, rating: t.rating, approved: true });
  }
}
