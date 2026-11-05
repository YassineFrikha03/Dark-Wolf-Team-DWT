const CustomGear = require('../models/CustomGear');

// Données initiales par défaut synchronisées avec la maquette officielle DWT
const DEFAULT_GEAR = [
  {
    slug: 'maillots',
    name: 'Maillot Custom',
    category: 'Maillots',
    subtitle: 'Maillot Pro Esports DWT 2026',
    description: 'Maillot officiel DWT compétition en mesh respirant Dry-Tech avec inserts cyber thermo-collés.',
    basePrice: 69.99,
    currency: 'TND',
    order: 1,
    icon: 'shirt',
    models: [
      { id: 'model_1', name: 'Apex Striker', accentPattern: 'apex' },
      { id: 'model_2', name: 'Shadow Stealth', accentPattern: 'stealth' },
      { id: 'model_3', name: 'Neon Glitch', accentPattern: 'glitch' },
      { id: 'model_4', name: 'Alpha Prime', accentPattern: 'alpha' },
      { id: 'model_5', name: 'Vanguard Cyber', accentPattern: 'vanguard' }
    ],
    colors: [
      { id: 'c_black', name: 'Onyx Black', hex: '#0a0b0e', secondaryHex: '#ffffff' },
      { id: 'c_carbon', name: 'Carbon Grey', hex: '#1e2430', secondaryHex: '#e60000' },
      { id: 'c_slate', name: 'Titanium Slate', hex: '#334155', secondaryHex: '#38bdf8' },
      { id: 'c_white', name: 'Glacier White', hex: '#f8fafc', secondaryHex: '#0a0b0e' },
      { id: 'c_red', name: 'Crimson Blood', hex: '#990000', secondaryHex: '#ffffff' },
      { id: 'c_cyan', name: 'Cyber Matrix', hex: '#0c2233', secondaryHex: '#00e5ff' }
    ],
    positions: [
      { id: 'center', name: 'Centre Poitrine' },
      { id: 'heart', name: 'Cœur / Gauche' },
      { id: 'collar', name: 'Col / Haut' },
      { id: 'large', name: 'Grand Format Frontal' }
    ],
    styles: [
      { id: 'drytech', name: 'Mesh Dry-Tech Pro', extraPrice: 0 },
      { id: 'reflective', name: 'Bandes Réfléchissantes', extraPrice: 10 },
      { id: 'carbon', name: 'Fibre Carbone Tissée', extraPrice: 15 }
    ],
    customTextPrice: 0,
    isActive: true
  },
  {
    slug: 'hoodies',
    name: 'Hoodie Custom',
    category: 'Hoodies',
    subtitle: 'Sweat Cyber Streetwear DWT',
    description: 'Sweat à capuche oversize 450 GSM avec poche ventrale techwear zippée et cordons réfléchissants.',
    basePrice: 89.99,
    currency: 'TND',
    order: 2,
    icon: 'hoodie',
    models: [
      { id: 'model_1', name: 'Apex Striker', accentPattern: 'apex' },
      { id: 'model_2', name: 'Shadow Stealth', accentPattern: 'stealth' },
      { id: 'model_3', name: 'Neon Glitch', accentPattern: 'glitch' },
      { id: 'model_4', name: 'Alpha Prime', accentPattern: 'alpha' },
      { id: 'model_5', name: 'Vanguard Cyber', accentPattern: 'vanguard' }
    ],
    colors: [
      { id: 'c_black', name: 'Onyx Black', hex: '#0a0b0e', secondaryHex: '#ffffff' },
      { id: 'c_carbon', name: 'Carbon Grey', hex: '#1e2430', secondaryHex: '#e60000' },
      { id: 'c_slate', name: 'Titanium Slate', hex: '#334155', secondaryHex: '#38bdf8' },
      { id: 'c_white', name: 'Glacier White', hex: '#f8fafc', secondaryHex: '#0a0b0e' },
      { id: 'c_red', name: 'Crimson Blood', hex: '#990000', secondaryHex: '#ffffff' },
      { id: 'c_cyan', name: 'Cyber Matrix', hex: '#0c2233', secondaryHex: '#00e5ff' }
    ],
    positions: [
      { id: 'center', name: 'Centre Poitrine' },
      { id: 'heart', name: 'Cœur / Gauche' },
      { id: 'collar', name: 'Col / Haut' },
      { id: 'large', name: 'Grand Format Frontal' }
    ],
    styles: [
      { id: 'heavy', name: 'Coton Lourd 450 GSM', extraPrice: 0 },
      { id: 'techwear', name: 'Techwear Zippé Étanches', extraPrice: 12 },
      { id: 'fleece', name: 'Doublure Polaire Hiver', extraPrice: 18 }
    ],
    customTextPrice: 0,
    isActive: true
  },
  {
    slug: 't-shirt',
    name: 'T-shirt Custom',
    category: 'T-shirt',
    subtitle: 'T-Shirt Premium Cotton Tech',
    description: 'Coton peigné 240 GSM haute densité, coupe athlétique esports et coutures renforcées.',
    basePrice: 49.99,
    currency: 'TND',
    order: 3,
    icon: 'tshirt',
    models: [
      { id: 'model_1', name: 'Apex Striker', accentPattern: 'apex' },
      { id: 'model_2', name: 'Shadow Stealth', accentPattern: 'stealth' },
      { id: 'model_3', name: 'Neon Glitch', accentPattern: 'glitch' },
      { id: 'model_4', name: 'Alpha Prime', accentPattern: 'alpha' },
      { id: 'model_5', name: 'Vanguard Cyber', accentPattern: 'vanguard' }
    ],
    colors: [
      { id: 'c_black', name: 'Onyx Black', hex: '#0a0b0e', secondaryHex: '#ffffff' },
      { id: 'c_carbon', name: 'Carbon Grey', hex: '#1e2430', secondaryHex: '#e60000' },
      { id: 'c_slate', name: 'Titanium Slate', hex: '#334155', secondaryHex: '#38bdf8' },
      { id: 'c_white', name: 'Glacier White', hex: '#f8fafc', secondaryHex: '#0a0b0e' },
      { id: 'c_red', name: 'Crimson Blood', hex: '#990000', secondaryHex: '#ffffff' },
      { id: 'c_cyan', name: 'Cyber Matrix', hex: '#0c2233', secondaryHex: '#00e5ff' }
    ],
    positions: [
      { id: 'center', name: 'Centre Poitrine' },
      { id: 'heart', name: 'Cœur / Gauche' },
      { id: 'collar', name: 'Col / Haut' },
      { id: 'large', name: 'Grand Format Frontal' }
    ],
    styles: [
      { id: 'classic', name: 'Coton Peigné 240 GSM', extraPrice: 0 },
      { id: 'vintage', name: 'Lavage Acid Wash Vintage', extraPrice: 8 }
    ],
    customTextPrice: 0,
    isActive: true
  },
  {
    slug: 'casquettes',
    name: 'Casquette Custom',
    category: 'Casquettes',
    subtitle: 'Snapback Tactical Wolf',
    description: 'Casquette 6 panneaux structurée avec visière plate, broderie 3D haute définition et fermeture réglable.',
    basePrice: 34.99,
    currency: 'TND',
    order: 4,
    icon: 'cap',
    models: [
      { id: 'model_1', name: 'Apex Snapback', accentPattern: 'apex' },
      { id: 'model_2', name: 'Tactical Curve', accentPattern: 'stealth' },
      { id: 'model_3', name: 'Trucker Mesh', accentPattern: 'glitch' }
    ],
    colors: [
      { id: 'c_black', name: 'Onyx Black', hex: '#0a0b0e', secondaryHex: '#ffffff' },
      { id: 'c_carbon', name: 'Carbon Dark', hex: '#1e2430', secondaryHex: '#e60000' },
      { id: 'c_white', name: 'Glacier White', hex: '#f8fafc', secondaryHex: '#0a0b0e' },
      { id: 'c_red', name: 'Crimson Blood', hex: '#990000', secondaryHex: '#ffffff' }
    ],
    positions: [
      { id: 'center', name: 'Face Avant Centre' },
      { id: 'heart', name: 'Latéral Gauche' },
      { id: 'large', name: 'Broderie 3D Large' }
    ],
    styles: [
      { id: 'embroidered', name: 'Broderie Fil Haute Précision', extraPrice: 0 },
      { id: 'metallic', name: 'Plaque Métallique Wolfpack', extraPrice: 6 }
    ],
    customTextPrice: 0,
    isActive: true
  },
  {
    slug: 'tote-bags',
    name: 'Tote Bag Custom',
    category: 'Tote bags',
    subtitle: 'Tote Bag Toile Renforcée DWT',
    description: 'Sac cabas en toile écologique 380 GSM ultra-résistante, anses longues et compartiment renforcé.',
    basePrice: 24.99,
    currency: 'TND',
    order: 5,
    icon: 'bag',
    models: [
      { id: 'model_1', name: 'Standard Urban', accentPattern: 'apex' },
      { id: 'model_2', name: 'Heavy Duty Cargo', accentPattern: 'stealth' }
    ],
    colors: [
      { id: 'c_black', name: 'Onyx Black', hex: '#0a0b0e', secondaryHex: '#ffffff' },
      { id: 'c_carbon', name: 'Natural Cotton', hex: '#d4cebe', secondaryHex: '#0a0b0e' },
      { id: 'c_white', name: 'Glacier White', hex: '#f8fafc', secondaryHex: '#0a0b0e' }
    ],
    positions: [
      { id: 'center', name: 'Centre Large' },
      { id: 'heart', name: 'Bas Droite Minimal' }
    ],
    styles: [
      { id: 'screen', name: 'Sérigraphie Haute Densité', extraPrice: 0 },
      { id: 'reflective', name: 'Encre Phosphorescente', extraPrice: 5 }
    ],
    customTextPrice: 0,
    isActive: true
  }
];

// Seed automatique si la collection est vide
const autoSeedIfEmpty = async () => {
  try {
    const count = await CustomGear.countDocuments();
    if (count === 0) {
      await CustomGear.insertMany(DEFAULT_GEAR);
      console.log('✅ Collection CustomGear initialisée avec les 5 équipements par défaut.');
    }
  } catch (err) {
    console.error('Erreur lors de l’auto-seed CustomGear:', err.message);
  }
};

// @desc    Obtenir tous les équipements custom actifs (public pour Custom Studio)
// @route   GET /api/custom-gear
// @access  Public
exports.getCustomGear = async (req, res) => {
  try {
    await autoSeedIfEmpty();
    const gear = await CustomGear.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, count: gear.length, gear });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Obtenir tous les équipements custom (espace Admin)
// @route   GET /api/custom-gear/admin/all
// @access  Private/Admin
exports.getAllCustomGearAdmin = async (req, res) => {
  try {
    await autoSeedIfEmpty();
    const gear = await CustomGear.find({}).sort({ order: 1 });
    res.json({ success: true, count: gear.length, gear });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Mettre à jour un équipement custom (fixer le prix, modifier modèles, styles)
// @route   PUT /api/custom-gear/:id
// @access  Private/Admin
exports.updateCustomGear = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const gear = await CustomGear.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!gear) {
      return res.status(404).json({ success: false, message: 'Équipement custom introuvable' });
    }

    res.json({
      success: true,
      message: `Tarifs et contenu de "${gear.name}" mis à jour avec succès !`,
      gear
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Créer un nouvel équipement personnalisable
// @route   POST /api/custom-gear
// @access  Private/Admin
exports.createCustomGear = async (req, res) => {
  try {
    const newGear = await CustomGear.create(req.body);
    res.status(201).json({
      success: true,
      message: `Nouvel équipement "${newGear.name}" créé avec succès !`,
      gear: newGear
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Supprimer un équipement personnalisable
// @route   DELETE /api/custom-gear/:id
// @access  Private/Admin
exports.deleteCustomGear = async (req, res) => {
  try {
    const { id } = req.params;
    const gear = await CustomGear.findByIdAndDelete(id);

    if (!gear) {
      return res.status(404).json({ success: false, message: 'Équipement non trouvé' });
    }

    res.json({
      success: true,
      message: `Équipement "${gear.name}" supprimé avec succès.`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Réinitialiser les équipements aux tarifs et configurations de base (Mockup)
// @route   POST /api/custom-gear/reset
// @access  Private/Admin
exports.resetCustomGear = async (req, res) => {
  try {
    await CustomGear.deleteMany({});
    const created = await CustomGear.insertMany(DEFAULT_GEAR);
    res.json({
      success: true,
      message: 'Catalogue custom réinitialisé avec succès aux valeurs de la maquette officielle !',
      gear: created
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
