const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Sponsor = require('../models/Sponsor');

const defaultSponsors = [
  {
    name: 'DUBBY ENERGY',
    category: 'Boisson Énergétique Officielle',
    perk: 'CODE: DWT (-10%)',
    promoCode: 'DWT',
    websiteUrl: 'https://dubby.gg',
    iconName: 'Zap',
    accentColor: '#f59e0b',
    desc: 'La formule nootropique propre sans crash qui alimente les réflexes et la concentration de nos joueurs durant les compétitions majeures.',
    order: 0,
    isActive: true
  },
  {
    name: 'LENOVO LEGION',
    category: 'Stations & Laptops RTX Pro',
    perk: 'STATIONS OFFICIELLES',
    promoCode: '',
    websiteUrl: 'https://www.lenovo.com/legion',
    iconName: 'Laptop',
    accentColor: '#38bdf8',
    desc: 'Laptops et tours de compétition équipés des derniers processeurs et cartes graphiques RTX pour un framerate maximal.',
    order: 1,
    isActive: true
  },
  {
    name: 'RAZER',
    category: 'Périphériques E-sport Officiels',
    perk: 'HOMOLOGUÉ TOURNOI',
    promoCode: '',
    websiteUrl: 'https://www.razer.com',
    iconName: 'Headphones',
    accentColor: '#22c55e',
    desc: 'Souris ultra-légères à capteur optique 8KHz, claviers mécaniques ultra-rapides et casques spatialisés.',
    order: 2,
    isActive: true
  },
  {
    name: 'DISCORD',
    category: 'Hub Communautaire Officiel',
    perk: '15,000+ MEMBRES',
    promoCode: '',
    websiteUrl: 'https://discord.gg',
    iconName: 'MessageSquare',
    accentColor: '#818cf8',
    desc: 'Le repaire de la meute réunissant plus de 15,000 membres actifs, salons vocaux et annonces exclusives.',
    order: 3,
    isActive: true
  },
  {
    name: 'LOGITECH G',
    category: 'Partenaire Périphériques Esport',
    perk: 'LIGHTSPEED WIRELESS',
    promoCode: '',
    websiteUrl: 'https://www.logitechg.com',
    iconName: 'Cpu',
    accentColor: '#00e5ff',
    desc: 'Capteurs HERO haute précision et transmission Lightspeed sans fil ultra-rapide pour nos compétiteurs.',
    order: 4,
    isActive: true
  },
  {
    name: 'NVIDIA GEFORCE RTX',
    category: 'Puissance Graphique & Latence',
    perk: 'REFLEX ULTRA-FAST',
    promoCode: '',
    websiteUrl: 'https://www.nvidia.com/geforce',
    iconName: 'Flame',
    accentColor: '#76b900',
    desc: 'Latence système minimisée et fluidité compétitive maximale propulsées par NVIDIA Reflex et Ada Lovelace.',
    order: 5,
    isActive: true
  },
  {
    name: 'TWITCH',
    category: 'Diffuseur Officiel Compétitions',
    perk: 'DIFFUSION TOURNOIS',
    promoCode: '',
    websiteUrl: 'https://twitch.tv',
    iconName: 'Radio',
    accentColor: '#a855f7',
    desc: 'Retransmission en direct de tous les matchs officiels, scrims et tournois majeurs de la Dark Wolf Team.',
    order: 6,
    isActive: true
  },
  {
    name: 'DARK LAB',
    category: 'Apparel & Techwear Officiel',
    perk: 'TEXTILE COMPÉTITION',
    promoCode: '',
    websiteUrl: '#shop',
    iconName: 'Shield',
    accentColor: '#e10613',
    desc: 'Gamme textile esport officielle haute performance conçue sur mesure pour les joueurs et supporters.',
    order: 7,
    isActive: true
  }
];

// GET /api/sponsors - Liste des sponsors (public)
router.get('/', async (req, res, next) => {
  try {
    let sponsors = await Sponsor.find().sort({ order: 1, createdAt: 1 });

    // Auto-seed si la collection est vide
    if (sponsors.length === 0) {
      sponsors = await Sponsor.insertMany(defaultSponsors);
    }

    if (req.query.active === 'true') {
      sponsors = sponsors.filter((s) => s.isActive);
    }

    res.status(200).json({
      success: true,
      count: sponsors.length,
      sponsors
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/sponsors - Créer un sponsor (admin)
router.post('/', async (req, res, next) => {
  try {
    const {
      name,
      category,
      perk,
      desc,
      promoCode,
      websiteUrl,
      logoUrl,
      iconName,
      accentColor,
      order,
      isActive
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Le nom de la marque ou du sponsor est obligatoire.'
      });
    }

    const sponsor = await Sponsor.create({
      name: name.trim(),
      category: category ? category.trim() : 'Partenaire Officiel',
      perk: perk ? perk.trim() : 'PARTENAIRE HOMOLOGUÉ',
      desc: desc ? desc.trim() : '',
      promoCode: promoCode ? promoCode.trim().toUpperCase() : '',
      websiteUrl: websiteUrl ? websiteUrl.trim() : '',
      logoUrl: logoUrl ? logoUrl.trim() : '',
      iconName: iconName || 'Zap',
      accentColor: accentColor || '#00e5ff',
      order: typeof order === 'number' ? order : 0,
      isActive: isActive !== false
    });

    res.status(201).json({
      success: true,
      message: 'Partenaire sponsor ajouté avec succès !',
      sponsor
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/sponsors/:id - Modifier un sponsor
router.put('/:id', async (req, res, next) => {
  try {
    const sponsor = await Sponsor.findById(req.params.id);
    if (!sponsor) {
      return res.status(404).json({
        success: false,
        message: 'Partenaire sponsor introuvable.'
      });
    }

    const updated = await Sponsor.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Partenaire sponsor mis à jour avec succès !',
      sponsor: updated
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/sponsors/:id - Supprimer un sponsor
router.delete('/:id', async (req, res, next) => {
  try {
    const sponsor = await Sponsor.findById(req.params.id);
    if (!sponsor) {
      return res.status(404).json({
        success: false,
        message: 'Partenaire sponsor introuvable.'
      });
    }

    await Sponsor.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Partenaire sponsor supprimé avec succès !'
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/sponsors/fetch-logo - Extraire et sauvegarder le logo depuis l'URL du sponsor
router.post('/fetch-logo', async (req, res, next) => {
  try {
    const { url } = req.body;
    if (!url || !url.trim()) {
      return res.status(400).json({ success: false, message: 'URL manquante.' });
    }

    let parsedUrl;
    try {
      const formatted = url.startsWith('http://') || url.startsWith('https://') ? url.trim() : `https://${url.trim()}`;
      parsedUrl = new URL(formatted);
    } catch (e) {
      return res.status(400).json({ success: false, message: 'Format d\'URL invalide.' });
    }

    const domain = parsedUrl.hostname.replace(/^www\./, '');
    const candidateUrls = [
      `https://logo.clearbit.com/${domain}`,
      `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
      `https://icons.duckduckgo.com/ip3/${domain}.ico`
    ];

    let downloadedBuffer = null;
    let chosenContentType = 'image/png';

    for (const cUrl of candidateUrls) {
      try {
        const fetchRes = await fetch(cUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
          signal: AbortSignal.timeout(4000)
        });
        if (fetchRes.ok) {
          const contentType = fetchRes.headers.get('content-type') || '';
          if (contentType.includes('image') || contentType.includes('octet-stream')) {
            const arrayBuffer = await fetchRes.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            if (buffer.length > 250) {
              downloadedBuffer = buffer;
              chosenContentType = contentType;
              break;
            }
          }
        }
      } catch (err) {
        // Essayer le candidat suivant
      }
    }

    if (downloadedBuffer) {
      const ext = chosenContentType.includes('svg') ? 'svg' : chosenContentType.includes('ico') ? 'ico' : 'png';
      const cleanDomain = domain.replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `sponsor-logo-${cleanDomain}-${Date.now()}.${ext}`;
      const uploadDir = path.join(__dirname, '../uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const destPath = path.join(uploadDir, filename);
      fs.writeFileSync(destPath, downloadedBuffer);

      // Copie de confort dans public/uploads du frontend
      try {
        const feUploads = path.join(__dirname, '../../dwt-frontend/public/uploads');
        if (fs.existsSync(feUploads)) {
          fs.writeFileSync(path.join(feUploads, filename), downloadedBuffer);
        }
      } catch (copyErr) {
        // Ignorer
      }

      return res.status(200).json({
        success: true,
        logoUrl: `/uploads/${filename}`,
        domain,
        source: 'local-download'
      });
    }

    // Fallback direct sur Google S2 favicon service
    const fallbackUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    return res.status(200).json({
      success: true,
      logoUrl: fallbackUrl,
      domain,
      source: 'google-s2'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
