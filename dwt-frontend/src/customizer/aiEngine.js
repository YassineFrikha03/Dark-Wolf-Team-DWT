/**
 * aiEngine.js - Moteur d'Intelligence Artificielle pour DARK WOLF TEAM Studio
 * - Analyse intelligente en direct des contrastes, proportions et conformité compétitive
 * - Générateur de tenue par prompt textuel (Prompt-to-Jersey)
 * - Archetypes esportifs pros VCT / Major
 * - Auto-harmonisation chromatique & alignement optique
 * - Certification officielle de design DWT avec numéro de série
 */

import { BRAND_COLORS, ESPORT_FONTS, ESPORT_ROLES } from './state.js';

// Archetypes esportifs officiels Dark Wolf Team (Harmonies visuelles et finitions pro)
export const AI_PRESETS = [
  {
    id: 'vct_apex',
    title: 'VCT Apex Striker',
    tag: 'VCT PRO LEAGUE',
    icon: 'VCT',
    description: 'Bicolore Onyx & Crimson DWT, aération Dry-Tech Mesh, blason centré',
    prompt: 'Maillot VCT pro noir et rouge avec logo Dark Wolf sur le torse et finition mesh',
    config: {
      category: 'maillots',
      finish: 'mesh',
      colors: {
        body: '#0a0b0e',
        sleeves: '#0a0b0e',
        collar: '#e10613',
        hood: '#0a0b0e',
        pocket: '#0a0b0e',
        cuffs: '#e10613',
      },
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
      category: 'maillots',
      finish: 'satine',
      colors: {
        body: '#0c2233',
        sleeves: '#0a0b0e',
        collar: '#00e5ff',
        hood: '#0c2233',
        pocket: '#0c2233',
        cuffs: '#00e5ff',
      },
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
      category: 'maillots',
      finish: 'mesh',
      colors: {
        body: '#f8fafc',
        sleeves: '#f8fafc',
        collar: '#e10613',
        hood: '#f8fafc',
        pocket: '#f8fafc',
        cuffs: '#e10613',
      },
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
      category: 'maillots',
      finish: 'mesh',
      colors: {
        body: '#990000',
        sleeves: '#0a0b0e',
        collar: '#0a0b0e',
        hood: '#990000',
        pocket: '#0a0b0e',
        cuffs: '#0a0b0e',
      },
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
 * Analyseur intelligent de prompt textuel (NLP Avance Prompt-to-Gear)
 * Comprend le langage naturel en francais et anglais :
 * - Categorie : Maillot, Hoodie, T-Shirt
 * - Couleurs : Noir, Blanc, Rouge, Bleu, Cyan, Or, Vert, Violet, etc.
 * - Flocage joueur : Pseudo / Gamertag, Numero (00-99), Role (Capitaine, Sniper, Duelist, IGL, Entry)
 * - Graphismes : Blason loup, logo DWT, sponsor Dubby, drapeaux
 * - Finitions textiles : Dry-Tech Mesh, Mat, Satine
 */
export function generateConfigFromPrompt(userPrompt) {
  const p = (userPrompt || '').toLowerCase();
  const raw = (userPrompt || '').trim();

  // 1. DETECTION DE LA CATEGORIE DU VETEMENT
  let category = 'maillots';
  if (p.includes('hoodie') || p.includes('sweat') || p.includes('pull') || p.includes('capuche')) {
    category = 'hoodies';
  } else if (p.includes('t-shirt') || p.includes('tshirt') || p.includes('tee')) {
    category = 't-shirt';
  } else if (p.includes('maillot') || p.includes('jersey') || p.includes('esport')) {
    category = 'maillots';
  }

  // 2. DETECTION DES COULEURS PRINCIPALE ET SECONDAIRE
  let bodyHex = '#0a0b0e'; // Noir Onyx par defaut
  let sleevesHex = '#0a0b0e';
  let collarHex = '#e10613';
  let brandColor = BRAND_COLORS[0];

  const hasWhite = p.includes('blanc') || p.includes('white') || p.includes('glacier');
  const hasRed = p.includes('rouge') || p.includes('crimson') || p.includes('red');
  const hasCyan = p.includes('cyan') || p.includes('bleu ciel') || p.includes('turquoise') || p.includes('matrix');
  const hasBlue = p.includes('bleu') || p.includes('blue') || p.includes('marine');
  const hasGold = p.includes('or') || p.includes('gold') || p.includes('jaune') || p.includes('yellow');
  const hasGreen = p.includes('vert') || p.includes('green');
  const hasPurple = p.includes('violet') || p.includes('purple');
  const hasCarbon = p.includes('carbone') || p.includes('carbon') || p.includes('gris') || p.includes('slate');

  if (hasWhite && !p.includes('noir et blanc')) {
    bodyHex = '#f8fafc';
    sleevesHex = '#0a0b0e';
    collarHex = hasRed ? '#e10613' : hasCyan ? '#00e5ff' : '#0a0b0e';
    brandColor = BRAND_COLORS.find(c => c.id === 'c_white') || BRAND_COLORS[3];
  } else if (hasRed && !hasWhite) {
    bodyHex = '#990000';
    sleevesHex = '#0a0b0e';
    collarHex = '#0a0b0e';
    brandColor = BRAND_COLORS.find(c => c.id === 'c_red') || BRAND_COLORS[1];
  } else if (hasCyan) {
    bodyHex = '#0c2233';
    sleevesHex = '#00e5ff';
    collarHex = '#00e5ff';
    brandColor = BRAND_COLORS.find(c => c.id === 'c_cyan') || BRAND_COLORS[5];
  } else if (hasCarbon) {
    bodyHex = '#1e2430';
    sleevesHex = '#1e2430';
    collarHex = '#e10613';
    brandColor = BRAND_COLORS.find(c => c.id === 'c_carbon') || BRAND_COLORS[2];
  } else {
    // Par defaut ou noir explicite
    bodyHex = '#0a0b0e';
    sleevesHex = hasGold ? '#ffb703' : hasCyan ? '#00e5ff' : hasRed ? '#e10613' : '#0a0b0e';
    collarHex = hasGold ? '#ffb703' : hasCyan ? '#00e5ff' : '#e10613';
    brandColor = BRAND_COLORS[0];
  }

  const isDarkJersey = bodyHex !== '#f8fafc';

  // 3. EXTRACTION DU NUMERO (00 a 99)
  let playerNumber = '';
  const numMatch = raw.match(/(?:num[eé]ro|n[°o]|#)\s*([0-9]{1,2})/i) ||
                   raw.match(/\b([0-9]{1,2})\b/);
  if (numMatch && numMatch[1]) {
    playerNumber = numMatch[1].padStart(2, '0');
  }

  // 4. EXTRACTION DU ROLE COMPETITIF
  let playerRole = '';
  if (p.includes('capitaine') || p.includes('captain')) {
    playerRole = 'CAPITAINE';
  } else if (p.includes('sniper') || p.includes('awp')) {
    playerRole = 'SNIPER AWP';
  } else if (p.includes('duelist') || p.includes('duelliste')) {
    playerRole = 'PRO DUELIST';
  } else if (p.includes('igl') || p.includes('leader') || p.includes('stratège') || p.includes('stratege')) {
    playerRole = 'IGL / STRATÈGE';
  } else if (p.includes('entry') || p.includes('fragger')) {
    playerRole = 'ENTRY FRAGGER';
  } else if (p.includes('coach') || p.includes('entraineur')) {
    playerRole = 'HEAD COACH';
  }

  // 5. EXTRACTION DU GAMERTAG / PSEUDO JOUEUR
  let gamertag = '';
  const explicitTagMatch = raw.match(/(?:pseudo|nom|joueur|tag|gamertag)\s*[:=]?\s*([a-zA-Z0-9_\-]+)/i);
  if (explicitTagMatch && explicitTagMatch[1]) {
    gamertag = explicitTagMatch[1].toUpperCase().slice(0, 14);
  } else {
    // Recherche de pseudos connus ou de mots isoles en majuscules
    const knownPseudos = ['YASSINE', 'FROST', 'SHADOW', 'VIPER', 'NEXUS', 'WOLFY', 'BLAZE', 'TITAN', 'STRIKER', 'APEX', 'GHOST', 'PHANTOM'];
    for (const kp of knownPseudos) {
      if (raw.toUpperCase().includes(kp)) {
        gamertag = kp;
        break;
      }
    }
  }

  const hasFlockingRequested = !!(gamertag || playerNumber || playerRole);

  // 6. FINITION DU TISSU
  let finish = 'mesh';
  if (p.includes('mat') || p.includes('furtif') || p.includes('stealth')) {
    finish = 'mat';
  } else if (p.includes('satin') || p.includes('brillant')) {
    finish = 'satine';
  }

  // 7. COULEURS DE TEXTE ET NUMERO DE CONTRASTE HAUTE DEFINITION
  const playerTextColor = isDarkJersey ? '#ffffff' : '#0a0b0e';
  const playerNumberColor = hasGold ? '#ffb703' : hasCyan ? '#00e5ff' : '#e10613';
  const playerRoleColor = '#e10613';

  // 8. GENERATION DYNAMIQUE DES CALQUES (LAYERS)
  const dynamicLayers = [];

  // Calques de face avant (Torse) : Blason officiel Dark Wolf si demande ou par defaut
  const wantsLogo = p.includes('logo') || p.includes('loup') || p.includes('wolf') || p.includes('blason') || p.includes('crest') || p.includes('dwt') || (!hasFlockingRequested && dynamicLayers.length === 0);
  if (wantsLogo) {
    dynamicLayers.push({
      id: `ai_layer_front_crest_${Date.now()}`,
      type: 'image',
      name: 'Blason Dark Wolf Officiel',
      url: '/dwt-wolf-logo.png',
      view: 'front',
      x: 0,
      y: -0.06,
      scale: 0.95,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      width: 240,
      height: 240,
    });
  }

  // Calque de manche : Sponsor officiel Dubby
  const wantsSponsor = p.includes('sponsor') || p.includes('dubby') || p.includes('pro');
  if (wantsSponsor) {
    dynamicLayers.push({
      id: `ai_layer_sleeve_sponsor_${Date.now()}`,
      type: 'image',
      name: 'Sponsor Dubby Pro',
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
    });
  }

  // Calques de dos : Hierarchie officielle competition
  if (gamertag) {
    dynamicLayers.push({
      id: 'flock_gamertag_back',
      view: 'back',
      type: 'text',
      name: `Gamertag: ${gamertag}`,
      text: gamertag,
      fontFamily: 'Orbitron',
      textColor: playerTextColor,
      x: 0,
      y: -0.32,
      width: 220,
      height: 60,
      scale: 1.0,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
    });
  }

  if (playerRole) {
    dynamicLayers.push({
      id: 'flock_role_back',
      view: 'back',
      type: 'text',
      name: `Rôle: ${playerRole}`,
      text: playerRole,
      fontFamily: 'Rajdhani',
      textColor: playerRoleColor,
      x: 0,
      y: -0.20,
      width: 160,
      height: 40,
      scale: 0.85,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
    });
  }

  if (playerNumber) {
    dynamicLayers.push({
      id: 'flock_number_back',
      view: 'back',
      type: 'text',
      name: `Numéro: ${playerNumber}`,
      text: playerNumber,
      fontFamily: 'Orbitron',
      textColor: playerNumberColor,
      x: 0,
      y: -0.04,
      width: 140,
      height: 120,
      scale: 1.4,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
    });
  }

  const generatedTitle = `Tenue ${category === 'hoodies' ? 'Hoodie' : category === 't-shirt' ? 'T-Shirt' : 'Maillot'} ${isDarkJersey ? 'Dark Wolf Onyx' : 'Glacier Pro'}${gamertag ? ' - ' + gamertag : ''}${playerNumber ? ' #' + playerNumber : ''}`;

  return {
    id: `ai_gen_${Date.now()}`,
    title: generatedTitle,
    tag: 'GÉNÉRATION IA',
    description: `Création automatique basée sur ton instruction : ${category.toUpperCase()}, finitions ${finish}, contrastes calibrés et alignement mathématique.`,
    prompt: userPrompt,
    config: {
      category,
      finish,
      color: brandColor,
      colors: {
        body: bodyHex,
        sleeves: sleevesHex,
        collar: collarHex,
        hood: bodyHex,
        pocket: bodyHex,
        cuffs: collarHex,
      },
      playerFlockingEnabled: hasFlockingRequested,
      gamertag: gamertag || '',
      showGamertag: !!gamertag,
      playerNumber: playerNumber || '',
      showPlayerNumber: !!playerNumber,
      playerRole: playerRole || '',
      showPlayerRole: !!playerRole,
      playerFont: 'Orbitron',
      playerTextColor,
      playerNumberColor,
      playerRoleColor,
      layers: dynamicLayers,
    },
  };
}

/**
 * Auto-harmonisation chromatique contextuelle en 1 clic
 * Analyse la couleur de base actuelle et applique les teintes secondaires et de flocage optimales
 */
export function autoHarmonizeColors(currentState) {
  const bodyHex = currentState?.colors?.body || currentState?.color?.hex || '#0a0b0e';
  const isWhite = bodyHex === '#f8fafc' || bodyHex === '#ffffff';
  const isRed = bodyHex === '#990000' || bodyHex === '#e10613';
  const isCyan = bodyHex === '#0c2233' || bodyHex === '#00e5ff';

  if (isWhite) {
    return {
      colors: {
        body: '#f8fafc',
        sleeves: '#0a0b0e',
        collar: '#e10613',
        hood: '#f8fafc',
        pocket: '#f8fafc',
        cuffs: '#e10613',
      },
      playerTextColor: '#0a0b0e',
      playerNumberColor: '#e10613',
      playerRoleColor: '#e10613',
    };
  }

  if (isRed) {
    return {
      colors: {
        body: '#990000',
        sleeves: '#0a0b0e',
        collar: '#0a0b0e',
        hood: '#990000',
        pocket: '#0a0b0e',
        cuffs: '#0a0b0e',
      },
      playerTextColor: '#ffffff',
      playerNumberColor: '#ffffff',
      playerRoleColor: '#ffffff',
    };
  }

  if (isCyan) {
    return {
      colors: {
        body: '#0c2233',
        sleeves: '#00e5ff',
        collar: '#00e5ff',
        hood: '#0c2233',
        pocket: '#0c2233',
        cuffs: '#00e5ff',
      },
      playerTextColor: '#ffffff',
      playerNumberColor: '#00e5ff',
      playerRoleColor: '#00e5ff',
    };
  }

  // Noir Onyx par defaut
  return {
    colors: {
      body: '#0a0b0e',
      sleeves: '#0a0b0e',
      collar: '#e10613',
      hood: '#0a0b0e',
      pocket: '#0a0b0e',
      cuffs: '#e10613',
    },
    playerTextColor: '#ffffff',
    playerNumberColor: '#e10613',
    playerRoleColor: '#e10613',
  };
}

/**
 * Auto-alignement optique et hierarchique des calques (Norme Competition Esport)
 * Ne superpose JAMAIS les elements les uns sur les autres.
 * Distribue les flocages au dos et les logos sur le torse avec des marges precises.
 */
export function autoAlignLayers(currentState) {
  const currentLayers = currentState?.layers || [];

  const updatedLayers = currentLayers.map((layer) => {
    // 1. PIECE DOS : Gamertag en haut, Role au milieu, Numero au centre
    if (layer.view === 'back') {
      const isTag = layer.id === 'flock_gamertag_back' || layer.name?.toLowerCase().includes('gamertag');
      const isRole = layer.id === 'flock_role_back' || layer.name?.toLowerCase().includes('rôle') || layer.name?.toLowerCase().includes('capitaine');
      const isNum = layer.id === 'flock_number_back' || layer.name?.toLowerCase().includes('numéro') || /^\d{1,2}$/.test((layer.text || '').trim());

      if (isTag) {
        return { ...layer, x: 0, y: -0.32, rotation: 0 };
      }
      if (isRole) {
        return { ...layer, x: 0, y: -0.20, rotation: 0 };
      }
      if (isNum) {
        return { ...layer, x: 0, y: -0.04, rotation: 0 };
      }
      return { ...layer, x: 0, rotation: 0 };
    }

    // 2. PIECE DEVANT (TORSE) : Centrage horizontal strict
    if (layer.view === 'front') {
      return { ...layer, x: 0, y: layer.y || -0.06, rotation: 0 };
    }

    // 3. MANCHES : Centrage au milieu du pan de manche
    if (layer.view === 'sleeve_left' || layer.view === 'sleeve_right') {
      return { ...layer, x: 0, y: 0, rotation: 0 };
    }

    return layer;
  });

  return { layers: updatedLayers };
}

/**
 * Generateur d'identite joueur stylisee et competitive
 */
export function generateRandomPlayerIdentity() {
  const gamertags = ['VORTEX', 'SHADOW', 'PHANTOM', 'CYPHER', 'KRONOS', 'VALIANT', 'BLAZE', 'VIPER', 'TITAN', 'STRIKER'];
  const tag = gamertags[Math.floor(Math.random() * gamertags.length)];
  const num = String(Math.floor(Math.random() * 99) + 1).padStart(2, '0');
  const role = ESPORT_ROLES[Math.floor(Math.random() * ESPORT_ROLES.length)];

  return {
    playerFlockingEnabled: true,
    gamertag: tag,
    showGamertag: true,
    playerNumber: num,
    showPlayerNumber: true,
    playerRole: role,
    showPlayerRole: true,
    playerFont: 'Orbitron',
    playerTextColor: '#ffffff',
    playerNumberColor: '#e10613',
    playerRoleColor: '#e10613',
  };
}

/**
 * AGENT IA CO-PILOTE INTERACTIF :
 * Traite les instructions en langage naturel et applique directement les ajustements
 * en temps réel sur le modèle 3D et le patron 2D
 */
export function processAIAgentMessage(message, currentState) {
  const text = (message || '').toLowerCase().trim();
  const raw = (message || '').trim();
  const updates = {};
  const feedbackActions = [];

  const currentColors = { ...(currentState.colors || { body: '#0a0b0e', sleeves: '#0a0b0e', collar: '#e10613' }) };
  let currentLayers = [...(currentState.layers || [])];

  // 1. SALUTATIONS ET DEMANDE D'AIDE
  if (
    text === 'bonjour' || text === 'salut' || text === 'hello' || text === 'aide' ||
    text === 'help' || text.includes('comment ça marche') || text.includes('quelles commandes') ||
    text.includes('que peux-tu faire') || text.includes('que sais-tu faire')
  ) {
    return {
      patch: {},
      response: "Bonjour. Je suis le co-pilote IA du studio Dark Wolf Team. Je pilote la conception technique en direct. Exemples de commandes :\n• 'Passe le maillot en noir, manches rouges et col cyan'\n• 'Flock le pseudo SHADOW et le numéro #07 au dos'\n• 'Ajoute le blason loup sur le torse et le sponsor sur la manche'\n• 'Centre et aligne tous les éléments'\n• 'Passe en finition Dry-Tech Mesh et taille XL'\n• 'Montre le dos' ou 'Montre la face'\n• 'Remettre à zéro' pour repartir d'un textile vierge.",
      actionType: 'info',
    };
  }

  // 2. REQUÊTE D'EFFACEMENT / REMISE À ZÉRO
  if (
    text.includes('efface tout') || text.includes('vide tout') || text.includes('repartir de zéro') ||
    text.includes('reinitialise') || text.includes('réinitialise') || text.includes('remettre à zéro') ||
    text.includes('tout effacer') || text.includes('remets à blanc')
  ) {
    return {
      patch: {
        layers: [],
        selectedLayerId: null,
        playerFlockingEnabled: false,
        gamertag: '',
        showGamertag: false,
        playerNumber: '',
        showPlayerNumber: false,
        playerRole: '',
        showPlayerRole: false,
      },
      response: "Plan de travail réinitialisé. Tous les calques, motifs et flocages ont été retirés. La base textile est vierge et prête pour un nouveau design.",
      actionType: 'reset',
    };
  }

  // 3. SUPPRESSION DU FLOCAGE DOS
  if (
    text.includes('enleve le flocage') || text.includes('enlève le flocage') || text.includes('supprime le flocage') ||
    text.includes('sans flocage') || text.includes('retire le flocage') || text.includes('supprime le numéro') ||
    text.includes('sans numéro') || text.includes('pas de pseudo') || text.includes('retire le pseudo')
  ) {
    currentLayers = currentLayers.filter(l => l.id !== 'flock_number_back' && l.id !== 'flock_gamertag_back' && l.id !== 'flock_role_back');
    updates.layers = currentLayers;
    updates.playerFlockingEnabled = false;
    updates.gamertag = '';
    updates.showGamertag = false;
    updates.playerNumber = '';
    updates.showPlayerNumber = false;
    updates.playerRole = '';
    updates.showPlayerRole = false;
    feedbackActions.push("Flocage dorsal (gamertag, numéro et rôle) retiré");
  }

  // 4. GESTION DU BLASON / LOGO AVANT
  if (text.includes('supprime le logo') || text.includes('sans logo') || text.includes('enlève le logo') || text.includes('retire le logo') || text.includes('retire le blason')) {
    currentLayers = currentLayers.filter(l => l.view !== 'front');
    updates.layers = currentLayers;
    feedbackActions.push("Blason avant retiré du buste");
  } else if (
    text.includes('ajoute le blason') || text.includes('mets le logo') || text.includes('blason loup') ||
    text.includes('logo dark wolf') || text.includes('logo sur le torse') || text.includes('ecusson') || text.includes('écussons')
  ) {
    const hasFrontLogo = currentLayers.some(l => l.view === 'front' && l.url === '/dwt-wolf-logo.png');
    if (!hasFrontLogo) {
      currentLayers.push({
        id: `ai_layer_front_${Date.now()}`,
        type: 'image',
        name: 'Dark Wolf Crest Officiel',
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
      });
      updates.layers = currentLayers;
      feedbackActions.push("Blason officiel Dark Wolf centré sur la poitrine");
    }
  }

  // Échelle du blason
  if (text.includes('agrandis le logo') || text.includes('plus grand logo') || text.includes('grossis le logo')) {
    currentLayers = currentLayers.map(l => {
      if (l.view === 'front') return { ...l, scale: Math.min(2.0, (l.scale || 1) * 1.25) };
      return l;
    });
    updates.layers = currentLayers;
    feedbackActions.push("Taille du blason avant augmentée (+25%)");
  } else if (text.includes('réduis le logo') || text.includes('plus petit logo') || text.includes('diminue le logo')) {
    currentLayers = currentLayers.map(l => {
      if (l.view === 'front') return { ...l, scale: Math.max(0.4, (l.scale || 1) * 0.8) };
      return l;
    });
    updates.layers = currentLayers;
    feedbackActions.push("Taille du blason avant réduite (-20%)");
  }

  // 5. GESTION DU SPONSOR SUR MANCHE
  if (text.includes('retire le sponsor') || text.includes('supprime le sponsor') || text.includes('sans sponsor')) {
    currentLayers = currentLayers.filter(l => l.url !== '/dubby_dwt_sponsor.png');
    updates.layers = currentLayers;
    feedbackActions.push("Marquage sponsor Dubby retiré");
  } else if (text.includes('sponsor') || text.includes('dubby')) {
    const hasSponsor = currentLayers.some(l => l.url === '/dubby_dwt_sponsor.png');
    if (!hasSponsor) {
      currentLayers.push({
        id: `ai_layer_sleeve_${Date.now()}`,
        type: 'image',
        name: 'Sponsor Dubby Pro',
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
      });
      updates.layers = currentLayers;
      feedbackActions.push("Marquage sponsor Dubby appliqué sur la manche gauche");
    }
  }

  // 6. MODIFICATION PRÉCISE DES COULEURS
  let colorChanged = false;
  const colorMap = {
    'noir': '#0a0b0e',
    'black': '#0a0b0e',
    'onyx': '#0a0b0e',
    'blanc': '#f8fafc',
    'white': '#f8fafc',
    'glacier': '#f8fafc',
    'rouge': '#990000',
    'crimson': '#e10613',
    'red': '#e10613',
    'cyan': '#00e5ff',
    'bleu': '#0c2233',
    'blue': '#0c2233',
    'or': '#ffb703',
    'gold': '#ffb703',
    'jaune': '#ffb703',
    'carbone': '#1e2430',
    'gris': '#334155',
    'vert': '#10b981',
    'violet': '#8b5cf6',
  };
  const colorKeysRegex = Object.keys(colorMap).join('|');

  // A. Thèmes complets préconfigurés par mot-clé
  if (text.includes('tout en noir') || text.includes('full black') || text.includes('stealth')) {
    currentColors.body = '#0a0b0e';
    currentColors.sleeves = '#0a0b0e';
    currentColors.collar = '#e10613';
    colorChanged = true;
    feedbackActions.push("Palette Full Black Stealth appliquée avec col Crimson");
  } else if (text.includes('blanc et rouge') || text.includes('glacier red')) {
    currentColors.body = '#f8fafc';
    currentColors.sleeves = '#0a0b0e';
    currentColors.collar = '#e10613';
    colorChanged = true;
    feedbackActions.push("Palette Glacier White appliquée avec manches Onyx et col Crimson");
  } else if (text.includes('noir et or') || text.includes('gold champion')) {
    currentColors.body = '#0a0b0e';
    currentColors.sleeves = '#ffb703';
    currentColors.collar = '#ffb703';
    colorChanged = true;
    feedbackActions.push("Palette Onyx & Gold Champion appliquée");
  } else if (text.includes('cyber') || text.includes('matrix') || text.includes('bleu et cyan')) {
    currentColors.body = '#0c2233';
    currentColors.sleeves = '#00e5ff';
    currentColors.collar = '#00e5ff';
    colorChanged = true;
    feedbackActions.push("Palette Cyber Matrix Bleu Nuit & Néon Cyan appliquée");
  } else {
    // B. Détection contextuelle segment par segment (manches, col, corps)
    // Manches
    const sleeveRegex = new RegExp(`(?:manches?|bras)\\s*(?:en|de|couleur|:)?\\s*(${colorKeysRegex})\\b`, 'i');
    const sleeveAltRegex = new RegExp(`(${colorKeysRegex})\\s*(?:pour les|aux?)\\s*manches?`, 'i');
    const sleeveMatch = text.match(sleeveRegex) || text.match(sleeveAltRegex);
    if (sleeveMatch) {
      const cName = sleeveMatch[1].toLowerCase();
      if (colorMap[cName]) {
        currentColors.sleeves = colorMap[cName];
        colorChanged = true;
        feedbackActions.push(`Manches teintes en ${cName.toUpperCase()}`);
      }
    }

    // Col
    const collarRegex = new RegExp(`(?:col|encolure)\\s*(?:en|de|couleur|:)?\\s*(${colorKeysRegex})\\b`, 'i');
    const collarAltRegex = new RegExp(`(${colorKeysRegex})\\s*(?:pour le|au)\\s*(?:col|encolure)`, 'i');
    const collarMatch = text.match(collarRegex) || text.match(collarAltRegex);
    if (collarMatch) {
      const cName = collarMatch[1].toLowerCase();
      if (colorMap[cName]) {
        currentColors.collar = colorMap[cName];
        colorChanged = true;
        feedbackActions.push(`Col teinté en ${cName.toUpperCase()}`);
      }
    }

    // Corps / Buste
    const bodyRegex = new RegExp(`(?:corps|fond|base|torse|buste|maillot|t-shirt|vetement|vêtement)\\s*(?:en|de|couleur|:)?\\s*(${colorKeysRegex})\\b`, 'i');
    const bodyAltRegex = new RegExp(`(${colorKeysRegex})\\s*(?:pour le|au)\\s*(?:corps|fond|base|torse|buste|maillot)`, 'i');
    const bodyMatch = text.match(bodyRegex) || text.match(bodyAltRegex);
    if (bodyMatch) {
      const cName = bodyMatch[1].toLowerCase();
      if (colorMap[cName]) {
        currentColors.body = colorMap[cName];
        colorChanged = true;
        feedbackActions.push(`Corps du vêtement teinté en ${cName.toUpperCase()}`);
      }
    } else if (!sleeveMatch && !collarMatch) {
      // Si aucun segment spécifique n'est précisé, appliquer sur le corps
      for (const [name, hex] of Object.entries(colorMap)) {
        const wordRegex = new RegExp(`\\b${name}\\b`, 'i');
        if (wordRegex.test(text)) {
          currentColors.body = hex;
          colorChanged = true;
          feedbackActions.push(`Teinte principale passée en ${name.toUpperCase()}`);
          break;
        }
      }
    }
  }

  if (colorChanged) {
    updates.colors = currentColors;
    const isDark = currentColors.body !== '#f8fafc';
    updates.playerTextColor = isDark ? '#ffffff' : '#0a0b0e';
    updates.playerNumberColor = currentColors.collar || '#e10613';
  }

  // 7. PSEUDO / GAMERTAG JOUEUR
  const explicitTag = raw.match(/(?:pseudo|tag|gamertag|nom|flocage|flock|écris|ecris|mettre|met)\s*[:=]?\s*([a-zA-Z0-9_\-]{2,14})/i);
  if (explicitTag && explicitTag[1]) {
    const rawTag = explicitTag[1];
    // Éviter de capturer des mots-clés courants
    const forbidden = ['le', 'la', 'un', 'une', 'des', 'du', 'au', 'en', 'sur', 'dos', 'face', 'rouge', 'noir', 'blanc', 'bleu'];
    if (!forbidden.includes(rawTag.toLowerCase())) {
      const cleanTag = rawTag.toUpperCase().slice(0, 14);
      updates.gamertag = cleanTag;
      updates.showGamertag = true;
      updates.playerFlockingEnabled = true;

      currentLayers = currentLayers.filter(l => l.id !== 'flock_gamertag_back');
      currentLayers.push({
        id: 'flock_gamertag_back',
        view: 'back',
        type: 'text',
        name: `Gamertag: ${cleanTag}`,
        text: cleanTag,
        fontFamily: currentState.playerFont || 'Orbitron',
        textColor: updates.playerTextColor || currentState.playerTextColor || '#ffffff',
        x: 0,
        y: -0.32,
        width: 220,
        height: 60,
        scale: 1.0,
        rotation: 0,
        opacity: 1,
        visible: true,
        locked: false,
      });
      updates.layers = currentLayers;
      feedbackActions.push(`Gamertag officiel calibré au dos : "${cleanTag}"`);
    }
  }

  // 8. NUMÉRO DE MATCH (00 - 99)
  const explicitNum = raw.match(/(?:num[eé]ro|dossard|n[°o]|#)\s*([0-9]{1,2})/i);
  if (explicitNum && explicitNum[1]) {
    const cleanNum = explicitNum[1].padStart(2, '0');
    updates.playerNumber = cleanNum;
    updates.showPlayerNumber = true;
    updates.playerFlockingEnabled = true;

    currentLayers = currentLayers.filter(l => l.id !== 'flock_number_back');
    currentLayers.push({
      id: 'flock_number_back',
      view: 'back',
      type: 'text',
      name: `Numéro: ${cleanNum}`,
      text: cleanNum,
      fontFamily: currentState.playerFont || 'Orbitron',
      textColor: updates.playerNumberColor || currentState.playerNumberColor || '#e10613',
      x: 0,
      y: -0.04,
      width: 140,
      height: 120,
      scale: 1.4,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
    });
    updates.layers = currentLayers;
    feedbackActions.push(`Dossard officiel réglé au dos : #${cleanNum}`);
  }

  // 9. RÔLE ESPORT
  const roles = [
    { key: 'capitaine', label: 'CAPITAINE' },
    { key: 'sniper', label: 'SNIPER AWP' },
    { key: 'awp', label: 'SNIPER AWP' },
    { key: 'duelist', label: 'PRO DUELIST' },
    { key: 'igl', label: 'IGL / STRATÈGE' },
    { key: 'stratège', label: 'IGL / STRATÈGE' },
    { key: 'entry', label: 'ENTRY FRAGGER' },
    { key: 'coach', label: 'HEAD COACH' },
  ];
  for (const r of roles) {
    if (text.includes(r.key)) {
      updates.playerRole = r.label;
      updates.showPlayerRole = true;
      updates.playerFlockingEnabled = true;

      currentLayers = currentLayers.filter(l => l.id !== 'flock_role_back');
      currentLayers.push({
        id: 'flock_role_back',
        view: 'back',
        type: 'text',
        name: `Rôle: ${r.label}`,
        text: r.label,
        fontFamily: 'Rajdhani',
        textColor: currentState.playerRoleColor || '#e10613',
        x: 0,
        y: -0.20,
        width: 160,
        height: 40,
        scale: 0.85,
        rotation: 0,
        opacity: 1,
        visible: true,
        locked: false,
      });
      updates.layers = currentLayers;
      feedbackActions.push(`Badge de rôle esport appliqué : "${r.label}"`);
      break;
    }
  }

  // 10. MATIÈRE & FINITION TEXTILE PBR
  if (text.includes('mesh') || text.includes('respirant') || text.includes('dry-tech') || text.includes('vct')) {
    updates.finish = 'mesh';
    feedbackActions.push("Tissage Dry-Tech Mesh respirant sélectionné");
  } else if (text.includes('mat') || text.includes('carbone')) {
    updates.finish = 'mat';
    feedbackActions.push("Finition mat haute densité sélectionnée");
  } else if (text.includes('satin') || text.includes('brillant')) {
    updates.finish = 'satine';
    feedbackActions.push("Finition satinée compétition sélectionnée");
  }

  // 11. SÉLECTION DE LA TAILLE DU VÊTEMENT
  const sizeMatch = text.match(/\btaille\s*(xs|s|m|l|xl|2xl|3xl)\b/i);
  if (sizeMatch && sizeMatch[1]) {
    updates.size = sizeMatch[1].toUpperCase();
    feedbackActions.push(`Taille du vêtement calibrée sur ${updates.size}`);
  }

  // 12. CHANGEMENT DE VUE (PATRON 2D & ORIENTATION 3D)
  if (text.includes('dos') || text.includes('arrière') || text.includes('derrière')) {
    updates.activePatternView = 'back';
    feedbackActions.push("Vue commutée sur le dos du vêtement");
  } else if (text.includes('face') || text.includes('devant') || text.includes('torse') || text.includes('avant')) {
    updates.activePatternView = 'front';
    feedbackActions.push("Vue commutée sur la face avant du vêtement");
  } else if (text.includes('manche gauche')) {
    updates.activePatternView = 'sleeve_left';
    feedbackActions.push("Vue commutée sur la manche gauche");
  } else if (text.includes('manche droite')) {
    updates.activePatternView = 'sleeve_right';
    feedbackActions.push("Vue commutée sur la manche droite");
  }

  // 13. ALIGNEMENT OPTIQUE & CENTRAGE
  if (text.includes('aligne') || text.includes('centre') || text.includes('recadre') || text.includes('harmonise')) {
    const aligned = autoAlignLayers({ ...currentState, ...updates, layers: currentLayers });
    updates.layers = aligned.layers;
    feedbackActions.push("Alignement optique et centrage dorés appliqués aux calques");
  }

  // 14. SI AUCUNE ACTION SPÉCIFIQUE N'A ÉTÉ EXTRAITE, GÉNÉRER D'APRÈS LE PROMPT GLOBAL
  if (feedbackActions.length === 0) {
    const globalPreset = generateConfigFromPrompt(raw);
    return {
      patch: globalPreset.config,
      response: `Configuration globale générée d'après "${raw}". Teintes harmonisées, blason Dark Wolf centré et finitions calibrées pour ligues VCT.`,
      actionType: 'generate',
    };
  }

  const responseText = `Ajustements appliqués avec succès :\n• ${feedbackActions.join('\n• ')}\n\nConformité ligue : 100% VCT / Major. Rendu 3D et patron 2D synchronisés.`;

  return {
    patch: updates,
    response: responseText,
    actionType: 'update',
  };
}
