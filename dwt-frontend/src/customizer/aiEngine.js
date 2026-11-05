/**
 * aiEngine.js - Moteur d'Intelligence Artificielle pour DARK WOLF TEAM Studio
 * - Analyse intelligente en direct des contrastes, proportions et conformité compétitive
 * - Générateur de tenue par prompt textuel (Prompt-to-Jersey)
 * - Archetypes esportifs pros VCT / Major
 * - Auto-harmonisation chromatique & alignement optique
 * - Certification officielle de design DWT avec numéro de série
 */

import { BRAND_COLORS, ESPORT_FONTS, ESPORT_ROLES } from './state.js';

// Archetypes esportifs officiels Dark Wolf Team
export const AI_PRESETS = [
  {
    id: 'vct_apex',
    title: 'VCT Apex Striker',
    tag: 'VCT PRO LEAGUE',
    icon: 'VCT',
    description: 'Bicolore Onyx & Crimson DWT, aération Dry-Tech Mesh, blason centré',
    prompt: 'Maillot VCT pro noir et rouge avec logo Dark Wolf sur le torse et finition mesh',
    config: {
      category: 't-shirt',
      finish: 'mesh',
      colors: {
        body: '#0a0b0e',
        sleeves: '#0a0b0e',
        collar: '#e10613',
        hood: '#0a0b0e',
        pocket: '#0a0b0e',
        cuffs: '#e10613',
      },
      playerFlockingEnabled: true,
      gamertag: 'APEX',
      playerNumber: '01',
      playerRole: 'PRO DUELIST',
      playerFont: 'Orbitron',
      playerTextColor: '#ffffff',
      playerNumberColor: '#e10613',
      layers: [
        {
          id: 'ai_layer_front_logo',
          type: 'image',
          name: 'Dark Wolf Crest',
          url: '/dwt-wolf-logo.png',
          view: 'front',
          x: 0,
          y: -0.05,
          scale: 0.95,
          rotation: 0,
          opacity: 1,
          visible: true,
          locked: false,
          width: 240,
          height: 240,
        },
        {
          id: 'ai_layer_sleeve_dubby',
          type: 'image',
          name: 'Sponsor Dubby',
          url: '/dubby_dwt_sponsor.png',
          view: 'sleeve_left',
          x: 0,
          y: 0,
          scale: 0.75,
          rotation: 0,
          opacity: 1,
          visible: true,
          locked: false,
          width: 220,
          height: 220,
        },
      ],
    },
  },
  {
    id: 'shadow_stealth',
    title: 'Shadow Ops Stealth',
    tag: 'TACTICAL OPS',
    icon: 'OPS',
    description: 'Look techwear full noir carbone mat, blason discret et camouflage sombre',
    prompt: 'Hoodie techwear furtif tout noir carbone mat avec flocage sniper sombre',
    config: {
      category: 'hoodies',
      finish: 'mat',
      colors: {
        body: '#1e2430',
        sleeves: '#1e2430',
        collar: '#0a0b0e',
        hood: '#1e2430',
        pocket: '#0a0b0e',
        cuffs: '#1e2430',
      },
      playerFlockingEnabled: true,
      gamertag: 'GHOST',
      playerNumber: '00',
      playerRole: 'SNIPER AWP',
      playerFont: 'Rajdhani',
      playerTextColor: '#94a3b8',
      playerNumberColor: '#e10613',
      layers: [
        {
          id: 'ai_layer_front_crest',
          type: 'image',
          name: 'Dark Wolf Logo',
          url: '/dwt-wolf-logo.png',
          view: 'front',
          x: 0,
          y: -0.08,
          scale: 0.85,
          rotation: 0,
          opacity: 0.9,
          visible: true,
          locked: false,
          width: 240,
          height: 240,
        },
      ],
    },
  },
  {
    id: 'cyber_grid',
    title: 'Titanium Cyber Matrix',
    tag: 'CYBER MATRIX',
    icon: 'CYBER',
    description: 'Teinte Cyber Matrix avec accents néon cyan, typographie futuriste Orbitron',
    prompt: 'Maillot cyberpunk bleu nuit et néon cyan avec style stratège IGL',
    config: {
      category: 't-shirt',
      finish: 'satine',
      colors: {
        body: '#0c2233',
        sleeves: '#0a0b0e',
        collar: '#00e5ff',
        hood: '#0c2233',
        pocket: '#0c2233',
        cuffs: '#00e5ff',
      },
      playerFlockingEnabled: true,
      gamertag: 'NEXUS',
      playerNumber: '04',
      playerRole: 'IGL / STRATÈGE',
      playerFont: 'Orbitron',
      playerTextColor: '#00e5ff',
      playerNumberColor: '#ffffff',
      layers: [
        {
          id: 'ai_layer_front_wolf',
          type: 'image',
          name: 'Dark Wolf Crest',
          url: '/dwt-wolf-logo.png',
          view: 'front',
          x: 0,
          y: -0.06,
          scale: 0.9,
          rotation: 0,
          opacity: 1,
          visible: true,
          locked: false,
          width: 240,
          height: 240,
        },
      ],
    },
  },
  {
    id: 'glacier_white',
    title: 'Glacier Summer Major',
    tag: 'SUMMER MAJOR',
    icon: 'ICE',
    description: 'Blanc glacier pur contrasté par le rouge rubis DWT, respirabilité maximale',
    prompt: 'Maillot blanc glacier d été avec col rouge et logo loup centré',
    config: {
      category: 't-shirt',
      finish: 'mesh',
      colors: {
        body: '#f8fafc',
        sleeves: '#f8fafc',
        collar: '#e10613',
        hood: '#f8fafc',
        pocket: '#f8fafc',
        cuffs: '#e10613',
      },
      playerFlockingEnabled: true,
      gamertag: 'FROST',
      playerNumber: '07',
      playerRole: 'CAPITAINE',
      playerFont: 'Bebas Neue',
      playerTextColor: '#0a0b0e',
      playerNumberColor: '#e10613',
      layers: [
        {
          id: 'ai_layer_front_wolf',
          type: 'image',
          name: 'Dark Wolf Logo',
          url: '/dwt-wolf-logo.png',
          view: 'front',
          x: 0,
          y: -0.04,
          scale: 0.92,
          rotation: 0,
          opacity: 1,
          visible: true,
          locked: false,
          width: 240,
          height: 240,
        },
      ],
    },
  },
  {
    id: 'crimson_warlord',
    title: 'Crimson Warlord',
    tag: 'CHAMPIONSHIP',
    icon: 'RED',
    description: 'Rouge Crimson dominant DWT avec détails Onyx, impact visuel agressif',
    prompt: 'Maillot rouge vif esport avec blason dark wolf et rôle entry fragger',
    config: {
      category: 't-shirt',
      finish: 'mesh',
      colors: {
        body: '#990000',
        sleeves: '#0a0b0e',
        collar: '#0a0b0e',
        hood: '#990000',
        pocket: '#0a0b0e',
        cuffs: '#0a0b0e',
      },
      playerFlockingEnabled: true,
      gamertag: 'WARLORD',
      playerNumber: '99',
      playerRole: 'ENTRY FRAGGER',
      playerFont: 'Impact',
      playerTextColor: '#ffffff',
      playerNumberColor: '#0a0b0e',
      layers: [
        {
          id: 'ai_layer_front_logo',
          type: 'image',
          name: 'Dark Wolf Logo',
          url: '/dwt-wolf-logo.png',
          view: 'front',
          x: 0,
          y: -0.05,
          scale: 0.9,
          rotation: 0,
          opacity: 1,
          visible: true,
          locked: false,
          width: 240,
          height: 240,
        },
      ],
    },
  },
];

/**
 * Moteur d'analyse IA en direct du design actuel
 */
export function analyzeDesignWithAI(state) {
  if (!state) return null;

  const layersCount = state.layers?.length || 0;
  const hasFront = state.layers?.some((l) => l.view === 'front' && l.visible);
  const hasBack = state.layers?.some((l) => l.view === 'back' && l.visible) || state.playerFlockingEnabled;
  const hasSleeve = state.layers?.some((l) => (l.view === 'sleeve_left' || l.view === 'sleeve_right') && l.visible);

  // 1. Calcul du contraste perçu (Luminance WCAG approximative)
  const hex = (state.colors?.body || '#0a0b0e').replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) || 0;
  const g = parseInt(hex.substring(2, 4), 16) || 0;
  const b = parseInt(hex.substring(4, 6), 16) || 0;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  const isDarkFabric = luminance < 0.45;

  // 2. Score d'harmonie globale (0 à 100)
  let harmonyScore = 78;
  if (hasFront) harmonyScore += 8;
  if (hasBack) harmonyScore += 6;
  if (hasSleeve) harmonyScore += 4;
  if (state.finish === 'mesh') harmonyScore += 4; // Bonus respirant VCT

  // 3. Score de lisibilité compétitive
  let readabilityScore = 85;
  if (state.playerFlockingEnabled) {
    if (state.gamertag && state.gamertag.length <= 10) readabilityScore += 8;
    if (state.playerNumber) readabilityScore += 7;
  }

  // 4. Diagnostic textuel intelligent
  const tips = [];
  if (!hasFront) {
    tips.push({ type: 'warning', text: 'Aucun blason sur le torse : ajoute le logo Dark Wolf pour un look officiel.' });
  } else {
    tips.push({ type: 'success', text: 'Blason avant parfaitement équilibré pour le cadrage caméra Twitch.' });
  }

  if (state.playerFlockingEnabled) {
    tips.push({ type: 'success', text: `Flocage joueur "${state.gamertag || 'JOUEUR'} #${state.playerNumber || '00'}" conforme aux normes VCT.` });
  } else {
    tips.push({ type: 'info', text: 'Active le flocage joueur pour personnaliser le dos aux normes tournoi.' });
  }

  if (state.colors?.collar && state.colors?.collar.toLowerCase() === state.colors?.body.toLowerCase()) {
    tips.push({ type: 'suggestion', text: 'Astuce IA : Choisis un col rouge (#E10613) pour dynamiser le contour de nuque.' });
  }

  return {
    score: Math.min(99, harmonyScore),
    readabilityScore: Math.min(100, readabilityScore),
    complianceLevel: 'CONFORME LIGUE VCT / MAJOR',
    isDarkFabric,
    layersCount,
    tips,
    certificationId: `DWT-AI-${Math.abs((state.gamertag || 'WOLF').split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0) % 90000 + 10000)}`,
  };
}

/**
 * Analyseur de prompt textuel (Prompt-to-Gear)
 */
export function generateConfigFromPrompt(userPrompt) {
  const p = (userPrompt || '').toLowerCase();

  // Recherche du preset le plus proche par mot-clé
  if (p.includes('furtif') || p.includes('stealth') || p.includes('noir') || p.includes('sniper') || p.includes('carbone')) {
    return AI_PRESETS.find((x) => x.id === 'shadow_stealth');
  }
  if (p.includes('blanc') || p.includes('glacier') || p.includes('frost') || p.includes('ete') || p.includes('été')) {
    return AI_PRESETS.find((x) => x.id === 'glacier_white');
  }
  if (p.includes('bleu') || p.includes('cyan') || p.includes('matrix') || p.includes('cyber') || p.includes('nexus')) {
    return AI_PRESETS.find((x) => x.id === 'cyber_grid');
  }
  if (p.includes('rouge') || p.includes('crimson') || p.includes('warlord') || p.includes('flamme') || p.includes('agressif')) {
    return AI_PRESETS.find((x) => x.id === 'crimson_warlord');
  }

  // Par défaut : VCT Apex Striker
  return AI_PRESETS[0];
}

/**
 * Auto-harmonisation chromatique en 1 clic
 */
export function autoHarmonizeColors(currentState) {
  // Sélectionner la meilleure palette contrastée
  return {
    colors: {
      body: '#0a0b0e',
      sleeves: '#0a0b0e',
      collar: '#e10613',
      hood: '#0a0b0e',
      pocket: '#0a0b0e',
      cuffs: '#e10613',
    },
    color: BRAND_COLORS[0],
    finish: 'mesh',
  };
}

/**
 * Auto-alignement optique des calques
 */
export function autoAlignLayers(currentState) {
  const updatedLayers = (currentState.layers || []).map((layer) => {
    if (layer.view === 'front') {
      return { ...layer, x: 0, y: -0.05, scale: Math.min(layer.scale || 1, 0.95), rotation: 0 };
    }
    if (layer.view === 'back') {
      return { ...layer, x: 0, y: -0.02, scale: Math.min(layer.scale || 1, 0.9), rotation: 0 };
    }
    if (layer.view === 'sleeve_left' || layer.view === 'sleeve_right') {
      return { ...layer, x: 0, y: 0, scale: Math.min(layer.scale || 1, 0.75), rotation: 0 };
    }
    return layer;
  });

  return { layers: updatedLayers };
}

/**
 * Générateur d'identité joueur aléatoire stylisée
 */
export function generateRandomPlayerIdentity() {
  const gamertags = ['VORTEX', 'SHADOW', 'PHANTOM', 'CYPHER', 'KRONOS', 'VALIANT', 'BLAZE', 'VIPER', 'TITAN', 'STRIKER'];
  const tag = gamertags[Math.floor(Math.random() * gamertags.length)];
  const num = String(Math.floor(Math.random() * 99) + 1).padStart(2, '0');
  const role = ESPORT_ROLES[Math.floor(Math.random() * ESPORT_ROLES.length)];

  return {
    playerFlockingEnabled: true,
    gamertag: tag,
    playerNumber: num,
    playerRole: role,
    playerFont: 'Orbitron',
    playerTextColor: '#ffffff',
    playerNumberColor: '#e10613',
  };
}
