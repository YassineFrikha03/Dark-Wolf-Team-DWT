/**
 * assetsLibrary.js - Bibliothèque officielle d'illustrations, drapeaux et badges esport Dark Wolf Team
 * Tous les assets sont générés en SVG vectoriel ultra-net pour un rendu immédiat et sans latence.
 */

// 1. DRAPEAUX NATIONAUX OFFICIELS (SVG Data URIs)
const createFlagSVG = (content) => `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">${content}</svg>`
)}`;

export const COUNTRY_FLAGS = [
  {
    id: 'flag_tn',
    name: 'Tunisie (TN)',
    category: 'flags',
    tag: 'DRAPEAU',
    url: createFlagSVG(`
      <rect width="600" height="400" fill="#E70013"/>
      <circle cx="300" cy="200" r="100" fill="#FFFFFF"/>
      <circle cx="320" cy="200" r="80" fill="#E70013"/>
      <circle cx="330" cy="200" r="64" fill="#FFFFFF"/>
      <polygon points="275,170 285,195 310,195 290,210 298,235 275,220 252,235 260,210 240,195 265,195" fill="#E70013"/>
    `),
  },
  {
    id: 'flag_fr',
    name: 'France (FR)',
    category: 'flags',
    tag: 'DRAPEAU',
    url: createFlagSVG(`
      <rect width="200" height="400" fill="#002654"/>
      <rect x="200" width="200" height="400" fill="#FFFFFF"/>
      <rect x="400" width="200" height="400" fill="#ED2939"/>
    `),
  },
  {
    id: 'flag_dz',
    name: 'Algérie (DZ)',
    category: 'flags',
    tag: 'DRAPEAU',
    url: createFlagSVG(`
      <rect width="300" height="400" fill="#006633"/>
      <rect x="300" width="300" height="400" fill="#FFFFFF"/>
      <circle cx="300" cy="200" r="100" fill="#D21034"/>
      <circle cx="330" cy="200" r="80" fill="#FFFFFF"/>
      <polygon points="300,165 310,190 335,190 315,205 322,230 300,215 278,230 285,205 265,190 290,190" fill="#D21034"/>
    `),
  },
  {
    id: 'flag_ma',
    name: 'Maroc (MA)',
    category: 'flags',
    tag: 'DRAPEAU',
    url: createFlagSVG(`
      <rect width="600" height="400" fill="#C1272D"/>
      <polygon points="300,100 330,200 430,200 350,260 380,360 300,300 220,360 250,260 170,200 270,200" fill="none" stroke="#006233" stroke-width="14" stroke-linejoin="round"/>
    `),
  },
  {
    id: 'flag_us',
    name: 'États-Unis (USA)',
    category: 'flags',
    tag: 'DRAPEAU',
    url: createFlagSVG(`
      <rect width="600" height="400" fill="#B22234"/>
      <path d="M0,31H600 M0,92H600 M0,154H600 M0,215H600 M0,277H600 M0,338H600" stroke="#FFFFFF" stroke-width="31"/>
      <rect width="250" height="215" fill="#3C3B6E"/>
      <circle cx="50" cy="40" r="12" fill="#FFFFFF"/><circle cx="100" cy="40" r="12" fill="#FFFFFF"/><circle cx="150" cy="40" r="12" fill="#FFFFFF"/><circle cx="200" cy="40" r="12" fill="#FFFFFF"/>
      <circle cx="75" cy="80" r="12" fill="#FFFFFF"/><circle cx="125" cy="80" r="12" fill="#FFFFFF"/><circle cx="175" cy="80" r="12" fill="#FFFFFF"/>
      <circle cx="50" cy="120" r="12" fill="#FFFFFF"/><circle cx="100" cy="120" r="12" fill="#FFFFFF"/><circle cx="150" cy="120" r="12" fill="#FFFFFF"/><circle cx="200" cy="120" r="12" fill="#FFFFFF"/>
      <circle cx="75" cy="160" r="12" fill="#FFFFFF"/><circle cx="125" cy="160" r="12" fill="#FFFFFF"/><circle cx="175" cy="160" r="12" fill="#FFFFFF"/>
    `),
  },
  {
    id: 'flag_de',
    name: 'Allemagne (DE)',
    category: 'flags',
    tag: 'DRAPEAU',
    url: createFlagSVG(`
      <rect width="600" height="133" fill="#000000"/>
      <rect y="133" width="600" height="134" fill="#DD0000"/>
      <rect y="267" width="600" height="133" fill="#FFCC00"/>
    `),
  },
  {
    id: 'flag_es',
    name: 'Espagne (ES)',
    category: 'flags',
    tag: 'DRAPEAU',
    url: createFlagSVG(`
      <rect width="600" height="100" fill="#AA151B"/>
      <rect y="100" width="600" height="200" fill="#F1BF00"/>
      <rect y="300" width="600" height="100" fill="#AA151B"/>
      <circle cx="180" cy="200" r="35" fill="#AA151B"/>
    `),
  },
  {
    id: 'flag_gb',
    name: 'Royaume-Uni (UK)',
    category: 'flags',
    tag: 'DRAPEAU',
    url: createFlagSVG(`
      <rect width="600" height="400" fill="#012169"/>
      <path d="M0,0 L600,400 M600,0 L0,400" stroke="#FFFFFF" stroke-width="60"/>
      <path d="M0,0 L600,400 M600,0 L0,400" stroke="#C8102E" stroke-width="25"/>
      <path d="M300,0 V400 M0,200 H600" stroke="#FFFFFF" stroke-width="100"/>
      <path d="M300,0 V400 M0,200 H600" stroke="#C8102E" stroke-width="60"/>
    `),
  },
  {
    id: 'flag_br',
    name: 'Brésil (BR)',
    category: 'flags',
    tag: 'DRAPEAU',
    url: createFlagSVG(`
      <rect width="600" height="400" fill="#009739"/>
      <polygon points="300,40 540,200 300,360 60,200" fill="#FEDD00"/>
      <circle cx="300" cy="200" r="85" fill="#012169"/>
      <path d="M220,195 Q300,165 380,210" stroke="#FFFFFF" stroke-width="12" fill="none"/>
    `),
  },
  {
    id: 'flag_jp',
    name: 'Japon (JP)',
    category: 'flags',
    tag: 'DRAPEAU',
    url: createFlagSVG(`
      <rect width="600" height="400" fill="#FFFFFF"/>
      <circle cx="300" cy="200" r="110" fill="#BC002D"/>
    `),
  },
  {
    id: 'flag_kr',
    name: 'Corée du Sud (KR)',
    category: 'flags',
    tag: 'DRAPEAU',
    url: createFlagSVG(`
      <rect width="600" height="400" fill="#FFFFFF"/>
      <circle cx="300" cy="200" r="85" fill="#CD2E3A"/>
      <path d="M215,200 A85,85 0 0,0 385,200 A42.5,42.5 0 0,1 300,200 A42.5,42.5 0 0,0 215,200" fill="#0047A0"/>
    `),
  },
];

// 2. BADGES & ÉCUSSONS OFFICIELS ESPORT
export const ESPORT_BADGES = [
  {
    id: 'badge_pro_league',
    name: 'Pro League 2026 Champion',
    category: 'badges',
    tag: 'OFFICIEL',
    url: createFlagSVG(`
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFD700"/>
          <stop offset="50%" stop-color="#FFA500"/>
          <stop offset="100%" stop-color="#FF8C00"/>
        </linearGradient>
      </defs>
      <polygon points="300,20 520,100 460,340 300,390 140,340 80,100" fill="#10131B" stroke="url(#goldGrad)" stroke-width="14"/>
      <polygon points="300,50 480,120 430,310 300,350 170,310 120,120" fill="#161B26"/>
      <path d="M210,180 L300,100 L390,180 L360,280 L240,280 Z" fill="url(#goldGrad)"/>
      <text x="300" y="240" font-family="'Orbitron', sans-serif" font-weight="900" font-size="44" fill="#000" text-anchor="middle">PRO</text>
      <text x="300" y="330" font-family="'Rajdhani', sans-serif" font-weight="800" font-size="28" fill="#FFD700" text-anchor="middle" letter-spacing="4">LEAGUE 2026</text>
    `),
  },
  {
    id: 'badge_mvp_star',
    name: 'MVP Star Tier 1',
    category: 'badges',
    tag: 'MVP',
    url: createFlagSVG(`
      <defs>
        <linearGradient id="mvpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#00E5FF"/>
          <stop offset="100%" stop-color="#0077FF"/>
        </linearGradient>
      </defs>
      <circle cx="300" cy="200" r="160" fill="#0A0C13" stroke="url(#mvpGrad)" stroke-width="12"/>
      <circle cx="300" cy="200" r="135" fill="none" stroke="#00E5FF" stroke-dasharray="10 8" stroke-width="4"/>
      <polygon points="300,70 335,150 420,155 355,210 380,290 300,240 220,290 245,210 180,155 265,150" fill="url(#mvpGrad)"/>
      <text x="300" y="220" font-family="'Orbitron', sans-serif" font-weight="900" font-size="46" fill="#07090E" text-anchor="middle">MVP</text>
    `),
  },
  {
    id: 'badge_cyber_shield',
    name: 'Cyber Shield DWT Red',
    category: 'badges',
    tag: 'DWT',
    url: createFlagSVG(`
      <polygon points="300,30 500,90 440,320 300,380 160,320 100,90" fill="#0E1118" stroke="#E10613" stroke-width="16"/>
      <path d="M220,120 L380,120 L300,260 Z" fill="#E10613"/>
      <text x="300" y="320" font-family="'Orbitron', sans-serif" font-weight="900" font-size="34" fill="#FFFFFF" text-anchor="middle">DIV 1</text>
    `),
  },
  {
    id: 'badge_verified_pro',
    name: 'Verified Pro Player',
    category: 'badges',
    tag: 'PRO',
    url: createFlagSVG(`
      <circle cx="300" cy="200" r="150" fill="#00E5FF"/>
      <circle cx="300" cy="200" r="130" fill="#0C101A"/>
      <path d="M230,200 L280,250 L380,140" fill="none" stroke="#00E5FF" stroke-width="26" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="300" y="325" font-family="'Orbitron', sans-serif" font-weight="800" font-size="24" fill="#00E5FF" text-anchor="middle" letter-spacing="2">VERIFIED</text>
    `),
  },
];

// 3. SPONSORS GAMING & ESPORT
export const ESPORT_SPONSORS = [
  {
    id: 'sponsor_dubby',
    name: 'Dubby Energy × DWT',
    category: 'sponsors',
    tag: 'SPONSOR',
    url: '/dubby_dwt_sponsor.png',
  },
  {
    id: 'sponsor_hypertech',
    name: 'HyperTech Gaming Gear',
    category: 'sponsors',
    tag: 'TECH',
    url: createFlagSVG(`
      <rect width="600" height="200" rx="16" fill="#0B0E14" stroke="#00E5FF" stroke-width="6"/>
      <polygon points="50,40 110,40 85,160 25,160" fill="#00E5FF"/>
      <polygon points="120,40 180,40 155,160 95,160" fill="#E10613"/>
      <text x="210" y="115" font-family="'Orbitron', sans-serif" font-weight="900" font-size="52" fill="#FFFFFF">HYPER<tspan fill="#00E5FF">TECH</tspan></text>
      <text x="212" y="150" font-family="'Rajdhani', sans-serif" font-weight="700" font-size="22" fill="#9AA1AD" letter-spacing="8">PERFORMANCE LABS</text>
    `),
  },
  {
    id: 'sponsor_vortex',
    name: 'Vortex Peripherals Pro',
    category: 'sponsors',
    tag: 'GEAR',
    url: createFlagSVG(`
      <rect width="600" height="200" rx="16" fill="#0B0E14" stroke="#E10613" stroke-width="6"/>
      <circle cx="100" cy="100" r="60" fill="none" stroke="#E10613" stroke-width="14" stroke-dasharray="80 30"/>
      <circle cx="100" cy="100" r="35" fill="#E10613"/>
      <text x="190" y="115" font-family="'Orbitron', sans-serif" font-weight="900" font-size="50" fill="#FFFFFF">VORTEX</text>
      <text x="192" y="150" font-family="'Rajdhani', sans-serif" font-weight="800" font-size="22" fill="#E10613" letter-spacing="6">ESPORTS HARDWARE</text>
    `),
  },
  {
    id: 'sponsor_apex_audio',
    name: 'Apex Core Pro Audio',
    category: 'sponsors',
    tag: 'AUDIO',
    url: createFlagSVG(`
      <rect width="600" height="200" rx="16" fill="#0B0E14" stroke="#FFB703" stroke-width="6"/>
      <path d="M60,130 C60,70 140,70 140,130" stroke="#FFB703" stroke-width="12" fill="none"/>
      <rect x="45" y="115" width="25" height="45" rx="10" fill="#FFB703"/>
      <rect x="130" y="115" width="25" height="45" rx="10" fill="#FFB703"/>
      <text x="195" y="115" font-family="'Orbitron', sans-serif" font-weight="900" font-size="50" fill="#FFFFFF">APEX<tspan fill="#FFB703">AUDIO</tspan></text>
      <text x="197" y="150" font-family="'Rajdhani', sans-serif" font-weight="700" font-size="20" fill="#9AA1AD" letter-spacing="6">STUDIO PRO SOUND</text>
    `),
  },
];

// 4. LOGOS ET BLASONS OFFICIELS DARK WOLF TEAM
export const OFFICIAL_DWT_LOGOS = [
  { id: 'img_wolf_logo', name: 'Dark Wolf Head Official', url: '/dwt-wolf-logo.png', category: 'dwt', tag: 'OFFICIEL' },
  { id: 'img_wolf_crest', name: 'Dark Wolf Crest Original', url: '/dwt-wolf-logo-original.png', category: 'dwt', tag: 'BLASON' },
  { id: 'img_wolf_body', name: 'Wolf Full Mascot', url: '/wolf-body.png', category: 'dwt', tag: 'MASCOTTE' },
];

export const ALL_OFFICIAL_ASSETS = [
  ...OFFICIAL_DWT_LOGOS,
  ...COUNTRY_FLAGS,
  ...ESPORT_BADGES,
  ...ESPORT_SPONSORS,
];

