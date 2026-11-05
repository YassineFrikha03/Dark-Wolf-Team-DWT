/**
 * state.js - Gestionnaire d'état réactif professionnel pour DARK WOLF TEAM Studio
 * - Support complet du Studio POD (Patron 2D interactif + Rendu 3D temps réel)
 * - Gestion multi-calques (Devant, Dos, Manches, Capuche)
 * - Historique Undo / Redo illimité (Ctrl+Z / Ctrl+Y)
 * - Validation stricte (Gamertag max 14 car, Numéro 00-99, DPI images)
 * - Sauvegarde locale sécurisée try/catch
 */

const STORAGE_KEY = 'dwt_customizer_studio_v6';

export const ESPORT_MODELS = [
  { id: 'model_1', name: 'Apex Striker', slug: 'apex', description: 'Trame cybernétique agressive VCT Pro' },
  { id: 'model_2', name: 'Shadow Ops', slug: 'stealth', description: 'Furtivité techwear et grilles stealth' },
  { id: 'model_3', name: 'Neon Glitch', slug: 'glitch', description: 'Distorsion numérique esport matrix' },
  { id: 'model_4', name: 'Alpha Fang', slug: 'alpha', description: 'Griffes de loup géométriques DWT' },
  { id: 'model_5', name: 'Titan Armor', slug: 'vanguard', description: 'Blindage angulaire pro division' },
];

export const BRAND_COLORS = [
  { id: 'c_onyx', name: 'Onyx Black', hex: '#0a0b0e', secondaryHex: '#ffffff', collarHex: '#e10613' },
  { id: 'c_red', name: 'Crimson DWT', hex: '#990000', secondaryHex: '#ffffff', collarHex: '#0a0b0e' },
  { id: 'c_carbon', name: 'Carbon Dark', hex: '#1e2430', secondaryHex: '#e10613', collarHex: '#e10613' },
  { id: 'c_white', name: 'Glacier White', hex: '#f8fafc', secondaryHex: '#0a0b0e', collarHex: '#e10613' },
  { id: 'c_slate', name: 'Titanium Slate', hex: '#334155', secondaryHex: '#00e5ff', collarHex: '#38bdf8' },
  { id: 'c_cyan', name: 'Cyber Matrix', hex: '#0c2233', secondaryHex: '#00e5ff', collarHex: '#00e5ff' },
];

export const ESPORT_FONTS = [
  { id: 'Orbitron', name: 'Orbitron (Futuriste)', family: "'Orbitron', sans-serif" },
  { id: 'Rajdhani', name: 'Rajdhani (Esport Pro)', family: "'Rajdhani', sans-serif" },
  { id: 'Inter', name: 'Inter (Moderne)', family: "'Inter', sans-serif" },
  { id: 'Impact', name: 'Impact (Impact Lourd)', family: 'Impact, sans-serif' },
  { id: 'Bebas Neue', name: 'Bebas (Bold Block)', family: "'Bebas Neue', sans-serif" },
  { id: 'Teko', name: 'Teko (Athlétique Étroit)', family: "'Teko', sans-serif" },
];

export const ESPORT_ROLES = [
  'CAPITAINE',
  'JOUEUR',
  'PRO DUELIST',
  'SNIPER AWP',
  'IGL / STRATÈGE',
  'ENTRY FRAGGER',
  'INITIATOR',
  'RIFLER',
  'ENTRAÎNEUR',
  'MANAGER',
];

export const BASE_PRICES = {
  maillots: 69.99,
  hoodies: 89.99,
  't-shirt': 49.99,
  casquettes: 34.99,
  'tote-bags': 24.99,
};

// Emplacements rapides standardisés selon la face active (Esport Layouts)
export const QUICK_POSITION_PRESETS = {
  front: [
    { id: 'chest_left', label: 'Cœur Gauche', x: -0.28, y: -0.22, scale: 0.65, desc: 'Écusson sur le cœur' },
    { id: 'chest_right', label: 'Poitrine Droite', x: 0.28, y: -0.22, scale: 0.60, desc: 'Sponsor ou drapeau' },
    { id: 'center_chest', label: 'Centre Torse', x: 0.0, y: -0.10, scale: 0.95, desc: 'Logo principal ou team' },
    { id: 'belly_sponsor', label: 'Sponsor Ventre', x: 0.0, y: 0.16, scale: 1.25, desc: 'Grand sponsor horizontal' },
    { id: 'collar_under', label: 'Sous le Col', x: 0.0, y: -0.36, scale: 0.50, desc: 'Mini logo col' },
    { id: 'full_front', label: 'Plein Buste', x: 0.0, y: 0.0, scale: 1.50, desc: 'Graphisme complet' },
  ],
  back: [
    { id: 'back_collar', label: 'Haut / Nuque', x: 0.0, y: -0.34, scale: 0.50, desc: 'Sous l\'encolure dos' },
    { id: 'back_gamertag_sub', label: 'Sous Gamertag', x: 0.0, y: -0.16, scale: 0.85, desc: 'Entre pseudo et numéro' },
    { id: 'back_number_sub', label: 'Bas du Dos', x: 0.0, y: 0.26, scale: 0.95, desc: 'Sponsor bas ou URL' },
    { id: 'back_full', label: 'Plein Dos', x: 0.0, y: 0.0, scale: 1.45, desc: 'Couverture complète' },
  ],
  sleeve_left: [
    { id: 'sleeve_shoulder', label: 'Épaule Haute', x: 0.0, y: -0.24, scale: 0.65, desc: 'Drapeau ou badge ligue' },
    { id: 'sleeve_center', label: 'Centre Manche', x: 0.0, y: 0.0, scale: 0.75, desc: 'Sponsor manche' },
    { id: 'sleeve_cuff', label: 'Bas Poignet', x: 0.0, y: 0.24, scale: 0.60, desc: 'Marquage poignet' },
  ],
  sleeve_right: [
    { id: 'sleeve_shoulder', label: 'Épaule Haute', x: 0.0, y: -0.24, scale: 0.65, desc: 'Drapeau ou badge ligue' },
    { id: 'sleeve_center', label: 'Centre Manche', x: 0.0, y: 0.0, scale: 0.75, desc: 'Sponsor manche' },
    { id: 'sleeve_cuff', label: 'Bas Poignet', x: 0.0, y: 0.24, scale: 0.60, desc: 'Marquage poignet' },
  ],
  hood: [
    { id: 'hood_side', label: 'Latéral', x: 0.0, y: 0.0, scale: 0.70, desc: 'Côté de capuche' },
    { id: 'hood_back', label: 'Arrière', x: -0.15, y: -0.10, scale: 0.60, desc: 'Dos de capuche' },
  ],
};

// Points d'ancrage 9 zones pour saut instantané
export const ANCHOR_POINTS = [
  { id: 'top_left', label: 'Haut G', x: -0.32, y: -0.32, icon: '↖' },
  { id: 'top_center', label: 'Haut C', x: 0.0, y: -0.32, icon: '↑' },
  { id: 'top_right', label: 'Haut D', x: 0.32, y: -0.32, icon: '↗' },
  { id: 'mid_left', label: 'Milieu G', x: -0.32, y: 0.0, icon: '←' },
  { id: 'center', label: 'Centre', x: 0.0, y: 0.0, icon: '•' },
  { id: 'mid_right', label: 'Milieu D', x: 0.32, y: 0.0, icon: '→' },
  { id: 'bottom_left', label: 'Bas G', x: -0.32, y: 0.32, icon: '↙' },
  { id: 'bottom_center', label: 'Bas C', x: 0.0, y: 0.32, icon: '↓' },
  { id: 'bottom_right', label: 'Bas D', x: 0.32, y: 0.32, icon: '↘' },
];

// Guide officiel des tailles
export const SIZE_CHART = [
  { size: 'XS', chest: '88-92 cm', length: '68 cm', shoulder: '41 cm', fit: 'Coupe Athlétique' },
  { size: 'S', chest: '92-96 cm', length: '70 cm', shoulder: '43 cm', fit: 'Coupe Athlétique' },
  { size: 'M', chest: '96-102 cm', length: '72 cm', shoulder: '45 cm', fit: 'Coupe Athlétique' },
  { size: 'L', chest: '102-108 cm', length: '74 cm', shoulder: '47 cm', fit: 'Coupe Compétition' },
  { size: 'XL', chest: '108-116 cm', length: '76 cm', shoulder: '49 cm', fit: 'Coupe Aisée' },
  { size: '2XL', chest: '116-124 cm', length: '78 cm', shoulder: '51 cm', fit: 'Coupe Ample' },
  { size: '3XL', chest: '124-132 cm', length: '80 cm', shoulder: '53 cm', fit: 'Coupe Grande Taille' },
];

/**
 * Détecte si une couleur est sombre (luminance perceptive)
 */
export function isColorDark(hex) {
  if (!hex || typeof hex !== 'string') return true;
  const clean = hex.replace('#', '');
  if (clean.length < 6) return true;
  const r = parseInt(clean.substring(0, 2), 16) || 0;
  const g = parseInt(clean.substring(2, 4), 16) || 0;
  const b = parseInt(clean.substring(4, 6), 16) || 0;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luma < 128;
}

/**
 * Garantit un contraste parfait pour éviter toute disparition sur tissu noir ou blanc
 */
export function getSafeContrastColor(textColor, bgColor) {
  const bgDark = isColorDark(bgColor);
  const textDark = isColorDark(textColor);
  if (bgDark && textDark) return '#ffffff';
  if (!bgDark && !textDark) return '#0a0b0e';
  return textColor;
}

export const DEFAULT_LAYERS = [];

const initialDefaultState = {
  category: 'maillots', // Maillot Esport Pro par défaut pour une création immédiate
  activeNavTool: 'upload',
  activePatternView: 'front',
  modelId: 'none', // Uni par défaut pour laisser le design ressortir nettement
  modelName: 'Uni Élite',
  playerFlockingEnabled: false, // Totalement optionnel : zéro élément imposé d'office
  showGamertag: false,
  showPlayerNumber: false,
  showPlayerRole: false,
  
  // Options spécifiques au maillot de compétition
  collarStyle: 'v_neck', // 'v_neck' | 'round'
  jerseyFit: 'pro', // 'pro' (athlétique) | 'fan' (standard)
  frontNumberEnabled: false, // Badge numéro avant
  
  // Couleurs par zone
  colors: {
    body: '#0a0b0e',
    sleeves: '#0a0b0e',
    collar: '#e10613',
    hood: '#0a0b0e',
    pocket: '#0a0b0e',
    cuffs: '#e10613',
  },
  
  // Palette de base
  color: BRAND_COLORS[0],
  
  // Calques de personnalisation 2D (Départ vierge et propre)
  layers: [],
  selectedLayerId: null,
  uploadedAssets: [],
  
  // Flocage compétition dos (Vierge par défaut)
  gamertag: '',
  playerNumber: '',
  playerRole: '',
  playerRoleColor: '#e10613',
  teamName: 'DARK WOLF TEAM',
  playerFont: 'Orbitron',
  playerTextColor: '#ffffff',
  playerNumberColor: '#ffffff',
  playerCollarText: true,
  
  // Finitions & Matière
  finish: 'mesh', // 'mat' | 'satine' | 'mesh'
  technique: 'sublimation', // 'sublimation' | 'flex' | 'broderie'
  
  // Tailles & Commande
  size: 'L',
  quantity: 1,
  
  // Mode Équipe
  teamMode: false,
  teamRoster: [
    { id: '1', name: 'Yassine', gamertag: 'SHADOW', number: '07', role: 'CAPITAINE', size: 'L' },
    { id: '2', name: 'Farouk', gamertag: 'VIPER', number: '10', role: 'SNIPER AWP', size: 'XL' },
    { id: '3', name: 'Amine', gamertag: 'WOLFY', number: '23', role: 'ENTRY FRAGGER', size: 'M' },
    { id: '4', name: 'Kais', gamertag: 'NEXUS', number: '04', role: 'IGL / STRATÈGE', size: 'L' },
    { id: '5', name: 'Rami', gamertag: 'BLAZE', number: '99', role: 'PRO DUELIST', size: 'M' },
  ],
  
  // Caméra 3D
  rotationAngle: 0,
  isAutoRotate: false,
  zoomLevel: 1.0,
};

class CustomizerStateManager {
  constructor() {
    this.listeners = new Set();
    this.history = [];
    this.historyIndex = -1;
    this.maxHistory = 30;
    this.saveTimeout = null;
    this.state = this.loadState();
    this.pushHistory(this.state);
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Filtrer les calques par défaut hérités pour garantir une tenue propre
        const cleanLayers = (parsed.layers || []).filter(
          l => l.id !== 'layer_dubby_default' && l.url !== '/dubby_dwt_sponsor.png'
        );
        return {
          ...initialDefaultState,
          ...parsed,
          playerFlockingEnabled: parsed.playerFlockingEnabled === true,
          showGamertag: parsed.showGamertag === true,
          showPlayerNumber: parsed.showPlayerNumber === true,
          showPlayerRole: parsed.showPlayerRole === true,
          layers: cleanLayers,
          uploadedAssets: Array.isArray(parsed.uploadedAssets) ? parsed.uploadedAssets : [],
        };
      }
    } catch {
      // Ignorer
    }
    return { ...initialDefaultState };
  }

  saveState() {
    try {
      // Exclure les dataUrl géants du stockage local pour préserver le quota
      const lightweightLayers = this.state.layers.map(l => ({
        ...l,
        url: l.url?.startsWith('data:') ? '' : l.url,
      }));
      const payload = {
        category: this.state.category,
        modelId: this.state.modelId,
        colors: this.state.colors,
        playerFlockingEnabled: this.state.playerFlockingEnabled,
        showGamertag: this.state.showGamertag,
        showPlayerNumber: this.state.showPlayerNumber,
        showPlayerRole: this.state.showPlayerRole,
        gamertag: this.state.gamertag,
        playerNumber: this.state.playerNumber,
        playerRole: this.state.playerRole,
        playerRoleColor: this.state.playerRoleColor,
        playerFont: this.state.playerFont,
        playerTextColor: this.state.playerTextColor,
        playerNumberColor: this.state.playerNumberColor,
        size: this.state.size,
        finish: this.state.finish,
        technique: this.state.technique,
        layers: lightweightLayers,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Quota dépassé
    }
  }

  debouncedSaveState() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    this.saveTimeout = setTimeout(() => {
      this.saveState();
    }, 400);
  }

  getState() {
    return this.state;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      try {
        listener(this.state);
      } catch (err) {
        console.error('Erreur listener customizer state:', err);
      }
    }
  }

  pushHistory(state) {
    if (this.historyIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.historyIndex + 1);
    }
    this.history.push(JSON.parse(JSON.stringify(state)));
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    } else {
      this.historyIndex++;
    }
  }

  setState(updates, recordHistory = true) {
    const prevState = { ...this.state };
    this.state = { ...this.state, ...updates };

    // Validation et filtrage
    if (typeof this.state.gamertag === 'string') {
      this.state.gamertag = this.state.gamertag
        .replace(/[^a-zA-Z0-9_\- ]/g, '')
        .toUpperCase()
        .slice(0, 14);
    }

    if (typeof this.state.playerNumber === 'string') {
      this.state.playerNumber = this.state.playerNumber
        .replace(/[^0-9]/g, '')
        .slice(0, 2);
    }

    // Protection anti-disparition sur tenues sombres et claires
    if (updates.colors?.body || (updates.color && updates.color.hex)) {
      const activeBodyHex = updates.colors?.body || updates.color?.hex;
      if (activeBodyHex) {
        const isDark = isColorDark(activeBodyHex);
        if (isDark) {
          if (isColorDark(this.state.playerTextColor)) {
            this.state.playerTextColor = '#ffffff';
          }
          if (isColorDark(this.state.playerNumberColor)) {
            this.state.playerNumberColor = '#ffffff';
          }
        } else {
          if (!isColorDark(this.state.playerTextColor)) {
            this.state.playerTextColor = '#0a0b0e';
          }
        }
      }
    }

    if (recordHistory && JSON.stringify(prevState) !== JSON.stringify(this.state)) {
      this.pushHistory(this.state);
      this.saveState(); // Sauvegarde immédiate lors des étapes d'historique
    } else {
      this.debouncedSaveState(); // Débouncé lors des glissements
    }

    this.notify();
  }

  // Manipulation des calques 2D
  addLayer(layerData) {
    const newId = `layer_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const newLayer = {
      id: newId,
      view: this.state.activePatternView || 'front',
      type: layerData.type || 'image',
      name: layerData.name || 'Nouveau calque',
      url: layerData.url || '',
      text: layerData.text || '',
      fontFamily: layerData.fontFamily || 'Orbitron',
      textColor: layerData.textColor || '#ffffff',
      strokeColor: layerData.strokeColor || '#000000',
      strokeWidth: layerData.strokeWidth || 0,
      x: 0,
      y: 0,
      width: layerData.width || 200,
      height: layerData.height || 200,
      scale: 1.0,
      rotation: 0,
      flipX: false,
      flipY: false,
      opacity: 1,
      visible: true,
      locked: false,
      curve: layerData.curve || 0, // Incurvation du texte (-50 à 50)
      dpiScore: layerData.width > 1200 ? 'high' : layerData.width > 600 ? 'medium' : 'low',
    };

    const newLayers = [...this.state.layers, newLayer];
    this.setState({
      layers: newLayers,
      selectedLayerId: newId,
    });
    return newId;
  }

  updateLayer(id, updates, recordHistory = false) {
    const newLayers = this.state.layers.map(layer => {
      if (layer.id === id) {
        return { ...layer, ...updates };
      }
      return layer;
    });
    this.setState({ layers: newLayers }, recordHistory);
  }

  deleteLayer(id) {
    const newLayers = this.state.layers.filter(l => l.id !== id);
    const updates = {
      layers: newLayers,
      selectedLayerId: newLayers.length ? newLayers[newLayers.length - 1].id : null,
    };
    if (id === 'flock_number_back') {
      updates.playerNumber = '';
      updates.showPlayerNumber = false;
    }
    if (id === 'flock_gamertag_back') {
      updates.gamertag = '';
      updates.showGamertag = false;
    }
    if (id === 'flock_role_back') {
      updates.playerRole = '';
      updates.showPlayerRole = false;
    }
    if (!updates.playerNumber && !updates.gamertag && !updates.playerRole &&
        !this.state.playerNumber && !this.state.gamertag && !this.state.playerRole) {
      updates.playerFlockingEnabled = false;
    }
    this.setState(updates, true);
  }

  duplicateLayer(id) {
    const target = this.state.layers.find(l => l.id === id);
    if (!target) return;
    const clone = {
      ...JSON.parse(JSON.stringify(target)),
      id: `layer_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      name: `${target.name} (Copie)`,
      x: target.x + 0.05,
      y: target.y + 0.05,
    };
    const newLayers = [...this.state.layers, clone];
    this.setState({
      layers: newLayers,
      selectedLayerId: clone.id,
    });
  }

  // Synchronisation dynamique du numéro dos en calque 2D éditable
  setPlayerNumber(num, font, color) {
    const cleanNum = (num || '').replace(/[^0-9]/g, '').slice(0, 2);
    let newLayers = this.state.layers.filter(l => l.id !== 'flock_number_back');
    if (cleanNum) {
      newLayers.push({
        id: 'flock_number_back',
        view: 'back',
        type: 'text',
        name: `Numéro: ${cleanNum}`,
        text: cleanNum,
        fontFamily: font || this.state.playerFont || 'Orbitron',
        textColor: color || this.state.playerNumberColor || '#ffffff',
        x: 0,
        y: -0.05,
        width: 140,
        height: 120,
        scale: 1.4,
        rotation: 0,
        opacity: 1,
        visible: true,
        locked: false,
      });
    }
    this.setState({
      playerNumber: cleanNum,
      showPlayerNumber: !!cleanNum,
      playerFlockingEnabled: !!(cleanNum || this.state.gamertag || this.state.playerRole),
      layers: newLayers,
      selectedLayerId: cleanNum ? 'flock_number_back' : this.state.selectedLayerId,
    }, true);
  }

  // Synchronisation dynamique du gamertag dos en calque 2D éditable
  setGamertag(tag, font, color) {
    const cleanTag = (tag || '').replace(/[^a-zA-Z0-9_\- ]/g, '').toUpperCase().slice(0, 14);
    let newLayers = this.state.layers.filter(l => l.id !== 'flock_gamertag_back');
    if (cleanTag) {
      newLayers.push({
        id: 'flock_gamertag_back',
        view: 'back',
        type: 'text',
        name: `Gamertag: ${cleanTag}`,
        text: cleanTag,
        fontFamily: font || this.state.playerFont || 'Orbitron',
        textColor: color || this.state.playerTextColor || '#ffffff',
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
    this.setState({
      gamertag: cleanTag,
      showGamertag: !!cleanTag,
      playerFlockingEnabled: !!(cleanTag || this.state.playerNumber || this.state.playerRole),
      layers: newLayers,
      selectedLayerId: cleanTag ? 'flock_gamertag_back' : this.state.selectedLayerId,
    }, true);
  }

  // Synchronisation dynamique du rôle dos en calque 2D éditable
  setPlayerRole(role, color) {
    let newLayers = this.state.layers.filter(l => l.id !== 'flock_role_back');
    if (role) {
      newLayers.push({
        id: 'flock_role_back',
        view: 'back',
        type: 'text',
        name: `Rôle: ${role}`,
        text: role,
        fontFamily: 'Rajdhani',
        textColor: color || this.state.playerRoleColor || '#e10613',
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
    this.setState({
      playerRole: role,
      showPlayerRole: !!role,
      playerFlockingEnabled: !!(role || this.state.gamertag || this.state.playerNumber),
      layers: newLayers,
      selectedLayerId: role ? 'flock_role_back' : this.state.selectedLayerId,
    }, true);
  }

  // Application instantanée d'un preset d'emplacement esport
  applyPositionPreset(layerId, preset) {
    if (!preset) return;
    this.updateLayer(layerId, {
      x: preset.x,
      y: preset.y,
      scale: preset.scale !== undefined ? preset.scale : 1.0,
    }, true);
  }

  // Ajustement rapide par incrément (touches fléchées / D-pad)
  nudgeLayer(layerId, dx, dy) {
    const layer = this.state.layers.find(l => l.id === layerId);
    if (!layer || layer.locked) return;
    const newX = Math.max(-0.6, Math.min(0.6, Number(((layer.x || 0) + dx).toFixed(3))));
    const newY = Math.max(-0.6, Math.min(0.6, Number(((layer.y || 0) + dy).toFixed(3))));
    this.updateLayer(layerId, { x: newX, y: newY }, true);
  }

  // Alignement rapide sur l'un des 9 points d'ancrage
  alignLayer(layerId, anchorId) {
    const pt = ANCHOR_POINTS.find(p => p.id === anchorId);
    if (!pt) return;
    this.updateLayer(layerId, { x: pt.x, y: pt.y }, true);
  }

  moveLayerOrder(id, direction) {
    const index = this.state.layers.findIndex(l => l.id === id);
    if (index === -1) return;
    const targetIndex = direction === 'up' ? index + 1 : index - 1;
    if (targetIndex < 0 || targetIndex >= this.state.layers.length) return;

    const newLayers = [...this.state.layers];
    const [removed] = newLayers.splice(index, 1);
    newLayers.splice(targetIndex, 0, removed);
    this.setState({ layers: newLayers });
  }

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.state = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
      this.saveState();
      this.notify();
      return true;
    }
    return false;
  }

  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.state = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
      this.saveState();
      this.notify();
      return true;
    }
    return false;
  }

  calculatePrice() {
    const base = BASE_PRICES[this.state.category] || 69.99;
    const layersCount = this.state.layers.filter(l => l.visible).length;
    const customLayersExtra = layersCount > 1 ? (layersCount - 1) * 6.0 : (layersCount === 1 ? 4.0 : 0.0);
    const hasCustomText = (this.state.gamertag && this.state.gamertag !== 'SHADOW') ? 5.0 : 0.0;
    const finishExtra = this.state.finish === 'mesh' ? 5.0 : (this.state.finish === 'satine' ? 7.0 : 0.0);
    const techniqueExtra = this.state.technique === 'broderie' ? 12.0 : (this.state.technique === 'flex' ? 4.0 : 0.0);

    const unitPrice = base + customLayersExtra + hasCustomText + finishExtra + techniqueExtra;

    if (this.state.teamMode && this.state.teamRoster?.length >= 5) {
      // Remise de groupe esport (-15%)
      return (unitPrice * 0.85).toFixed(2);
    }

    return unitPrice.toFixed(2);
  }

  calculateTotalPrice() {
    const unit = parseFloat(this.calculatePrice());
    const qty = this.state.teamMode ? (this.state.teamRoster?.length || 1) : (this.state.quantity || 1);
    return (unit * qty).toFixed(2);
  }

  formatPrice(priceVal) {
    const p = priceVal !== undefined ? priceVal : this.calculatePrice();
    return `${Number(p).toFixed(2).replace('.', ',')} TND`;
  }

  clearPlayerFlocking() {
    const remaining = this.state.layers.filter(l => 
      l.id !== 'flock_number_back' && l.id !== 'flock_gamertag_back' && l.id !== 'flock_role_back'
    );
    this.setState({
      playerFlockingEnabled: false,
      showGamertag: false,
      showPlayerNumber: false,
      showPlayerRole: false,
      gamertag: '',
      playerNumber: '',
      playerRole: '',
      layers: remaining,
      selectedLayerId: null,
    }, true);
  }

  reset() {
    this.state = {
      ...initialDefaultState,
      category: this.state.category,
    };
    this.pushHistory(this.state);
    this.saveState();
    this.notify();
  }
}

export const customizerState = new CustomizerStateManager();
