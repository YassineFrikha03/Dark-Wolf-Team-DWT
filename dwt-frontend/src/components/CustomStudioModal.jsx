import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  X, 
  ShoppingBag, 
  RotateCcw, 
  Palette, 
  Type, 
  Edit3, 
  Search, 
  ChevronRight, 
  Layers, 
  RotateCw, 
  Compass,
  UploadCloud,
  Crosshair,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import WolfLogo from './WolfLogo';
import CustomGarmentRenderer from './CustomGarmentRenderer';
import API from '../services/api';
import '../styles/customStudio.css';

// Icônes vectorielles personnalisées ultra-nettes pour chaque catégorie (pas d'émojis)
const CategoryIcon = ({ type, color = '#22c55e' }) => {
  switch (type) {
    case 'hoodies':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z" />
          <path d="M9 8v4a3 3 0 0 0 6 0V8" />
        </svg>
      );
    case 'casquettes':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 15c0-4.5 4-8 9-8s9 3.5 9 8H3z" />
          <path d="M2 15h20v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2z" />
          <circle cx="12" cy="7" r="1.5" fill="#38bdf8" />
        </svg>
      );
    case 'tote-bags':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00e5ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="8" width="16" height="14" rx="2" />
          <path d="M8 8V5a4 4 0 0 1 8 0v3" />
        </svg>
      );
    case 't-shirt':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
        </svg>
      );
    case 'maillots':
    default:
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
          <path d="M9 10l3 3 3-3" stroke="#22c55e" strokeWidth="1.5" />
        </svg>
      );
  }
};

// Mini icône de position du logo sur le maillot
const MiniPositionPreview = ({ position }) => {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="cs-mini-garment-svg">
      <path
        d="M 6 10 L 10 5 L 14 7 C 15 8 17 8 18 7 L 22 5 L 26 10 L 22 12 L 22 27 L 10 27 L 10 12 Z"
        fill="#1e2433"
        stroke="#475569"
        strokeWidth="1"
      />
      {position === 'center' && <circle cx="16" cy="17" r="2.5" fill="#e60000" />}
      {position === 'heart' && <circle cx="19" cy="15" r="2.2" fill="#e60000" />}
      {position === 'collar' && <circle cx="16" cy="11" r="2" fill="#e60000" />}
      {position === 'large' && <rect x="13.5" y="14" width="5" height="5" rx="1" fill="#e60000" />}
    </svg>
  );
};

// Données statiques officielles de repli immédiat (100% Esport Dark Wolf Team)
const FALLBACK_GEAR = [
  {
    slug: 'maillots',
    name: 'Maillot Pro Esport',
    category: 'Maillots',
    subtitle: 'Maillot Officiel Compétition DWT 2026',
    description: 'Maillot de compétition pro esport en mesh respirant Dry-Tech avec inserts cyber thermocollés et bandes sponsors.',
    basePrice: 69.99,
    currency: 'TND',
    order: 1,
    image: '/custom-gear/jersey_front_transparent.png',
    models: [
      { id: 'model_1', name: 'Apex Predator (VCT Pro)', accentPattern: 'apex' },
      { id: 'model_2', name: 'Shadow Matrix (Stealth Ops)', accentPattern: 'stealth' },
      { id: 'model_3', name: 'Neon Glitch (Cyber Matrix)', accentPattern: 'glitch' },
      { id: 'model_4', name: 'Alpha Fang (Wolf Claw)', accentPattern: 'alpha' },
      { id: 'model_5', name: 'Titanium Armor (Pro Vanguard)', accentPattern: 'vanguard' }
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
      { id: 'center', name: 'Centre' },
      { id: 'heart', name: 'Cœur' },
      { id: 'collar', name: 'Col' },
      { id: 'large', name: 'Large' }
    ],
    styles: [
      { id: 'drytech', name: 'Mesh Dry-Tech VCT Pro', extraPrice: 0 },
      { id: 'reflective', name: 'Bandes Réfléchissantes RGB', extraPrice: 10 },
      { id: 'carbon', name: 'Fibre Carbone Tissée', extraPrice: 15 }
    ],
    customTextPrice: 0,
    isActive: true
  },
  {
    slug: 'hoodies',
    name: 'Hoodie Techwear Esport',
    category: 'Hoodies',
    subtitle: 'Sweat à Capuche Cyber Streetwear DWT',
    description: 'Sweat à capuche oversize 450 GSM avec poche ventrale techwear zippée et cordons réfléchissants.',
    basePrice: 89.99,
    currency: 'TND',
    order: 2,
    image: '/custom-gear/hoodie_front_transparent.png',
    models: [
      { id: 'model_1', name: 'Apex Predator (VCT Pro)', accentPattern: 'apex' },
      { id: 'model_2', name: 'Shadow Matrix (Stealth Ops)', accentPattern: 'stealth' },
      { id: 'model_3', name: 'Neon Glitch (Cyber Matrix)', accentPattern: 'glitch' },
      { id: 'model_4', name: 'Alpha Fang (Wolf Claw)', accentPattern: 'alpha' },
      { id: 'model_5', name: 'Titanium Armor (Pro Vanguard)', accentPattern: 'vanguard' }
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
      { id: 'center', name: 'Centre' },
      { id: 'heart', name: 'Cœur' },
      { id: 'collar', name: 'Col' },
      { id: 'large', name: 'Large' }
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
    name: 'T-shirt Athletic Esport',
    category: 'T-shirt',
    subtitle: 'T-Shirt Compétition Cotton Tech',
    description: 'Coton peigné 240 GSM haute densité, coupe athlétique esports et coutures renforcées.',
    basePrice: 49.99,
    currency: 'TND',
    order: 3,
    image: '/custom-gear/tshirt_front_transparent.png',
    models: [
      { id: 'model_1', name: 'Apex Predator (VCT Pro)', accentPattern: 'apex' },
      { id: 'model_2', name: 'Shadow Matrix (Stealth Ops)', accentPattern: 'stealth' },
      { id: 'model_3', name: 'Neon Glitch (Cyber Matrix)', accentPattern: 'glitch' },
      { id: 'model_4', name: 'Alpha Fang (Wolf Claw)', accentPattern: 'alpha' },
      { id: 'model_5', name: 'Titanium Armor (Pro Vanguard)', accentPattern: 'vanguard' }
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
      { id: 'center', name: 'Centre' },
      { id: 'heart', name: 'Cœur' },
      { id: 'collar', name: 'Col' },
      { id: 'large', name: 'Large' }
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
    name: 'Casquette Snapback Esport',
    category: 'Casquettes',
    subtitle: 'Snapback Tactique Dark Wolf',
    description: 'Casquette 6 panneaux structurée avec visière plate, broderie 3D haute définition et fermeture réglable.',
    basePrice: 34.99,
    currency: 'TND',
    order: 4,
    image: '/custom-gear/cap_front_transparent.png',
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
      { id: 'center', name: 'Centre' },
      { id: 'heart', name: 'Latéral' },
      { id: 'large', name: 'Large' }
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
    name: 'Tote Bag Toile Esport',
    category: 'Tote bags',
    subtitle: 'Tote Bag Toile Renforcée DWT',
    description: 'Sac cabas en toile écologique 380 GSM ultra-résistante, anses longues et compartiment renforcé.',
    basePrice: 24.99,
    currency: 'TND',
    order: 5,
    image: '/custom-gear/bag_front_transparent.png',
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
      { id: 'center', name: 'Centre' },
      { id: 'heart', name: 'Minimal' }
    ],
    styles: [
      { id: 'screen', name: 'Sérigraphie Haute Densité', extraPrice: 0 },
      { id: 'reflective', name: 'Encre Phosphorescente', extraPrice: 5 }
    ],
    customTextPrice: 0,
    isActive: true
  }
];

const ESPORT_ROLES = [
  'PRO DUELIST',
  'IGL / CAPTAIN',
  'SNIPER AWP',
  'INITIATOR',
  'ENTRY FRAGGER',
  'RIFLER',
  'HEAD COACH'
];

const CustomStudioModal = ({ isOpen, onClose, onOpenCart }) => {
  const { addToCart } = useCart();
  const [gearList, setGearList] = useState(FALLBACK_GEAR);
  const [activeSlug, setActiveSlug] = useState('maillots');
  const [activeModelId, setActiveModelId] = useState('model_1');
  const [activeColor, setActiveColor] = useState(FALLBACK_GEAR[0].colors[0]);
  const [designTab, setDesignTab] = useState('design'); // 'couleurs' | 'design' | 'joueur' | 'style'
  const [gamertag, setGamertag] = useState('');
  const [playerNumber, setPlayerNumber] = useState('07');
  const [playerRole, setPlayerRole] = useState('PRO DUELIST');
  const [logoPosition, setLogoPosition] = useState('center');
  const [selectedSize, setSelectedSize] = useState('L');
  const [selectedStyleId, setSelectedStyleId] = useState('drytech');
  
  // Design personnalisé importé par le client
  const [customUploadedDesign, setCustomUploadedDesign] = useState(null);
  const [uploadedDesignName, setUploadedDesignName] = useState('');
  const [customDesignScale, setCustomDesignScale] = useState(1.0);
  const fileInputRef = useRef(null);

  // États Studio 360°
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isAutoRotate, setIsAutoRotate] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [addedToast, setAddedToast] = useState(false);

  // Charger les tarifs et données en direct depuis MongoDB Atlas
  useEffect(() => {
    if (!isOpen) return;

    API.get('/custom-gear')
      .then((res) => {
        if (res.data?.success && res.data?.gear?.length) {
          const merged = res.data.gear.map((g) => {
            const fallback = FALLBACK_GEAR.find((f) => f.slug === g.slug);
            return {
              ...g,
              image: fallback?.image || '/custom-gear/jersey_front_transparent.png',
              models: g.models?.length ? g.models : fallback?.models || [],
              colors: g.colors?.length ? g.colors : fallback?.colors || [],
              positions: g.positions?.length ? g.positions : fallback?.positions || [],
              styles: g.styles?.length ? g.styles : fallback?.styles || [],
            };
          });
          setGearList(merged);
        }
      })
      .catch((err) => {
        console.warn('Utilisation des données locales pour le studio:', err.message);
      });
  }, [isOpen]);

  // Récupérer l'article actif
  const currentItem = useMemo(() => {
    return gearList.find((g) => g.slug === activeSlug) || gearList[0] || FALLBACK_GEAR[0];
  }, [gearList, activeSlug]);

  // Synchroniser la couleur et le modèle lors du changement de catégorie
  useEffect(() => {
    if (currentItem?.colors?.length) {
      setActiveColor(currentItem.colors[0]);
    }
    if (currentItem?.models?.length) {
      setActiveModelId(currentItem.models[0].id);
    }
    if (currentItem?.styles?.length) {
      setSelectedStyleId(currentItem.styles[0].id);
    }
    setRotationAngle(0);
    setIsAutoRotate(false);
  }, [activeSlug, currentItem]);

  // Modèle actif
  const currentModel = useMemo(() => {
    return currentItem.models.find((m) => m.id === activeModelId) || currentItem.models[0];
  }, [currentItem, activeModelId]);

  // Style sélectionné
  const currentStyle = useMemo(() => {
    return currentItem.styles.find((s) => s.id === selectedStyleId) || currentItem.styles[0];
  }, [currentItem, selectedStyleId]);

  // Calcul du prix dynamique total
  const calculatedPrice = useMemo(() => {
    const base = Number(currentItem.basePrice) || 69.99;
    const styleExtra = Number(currentStyle?.extraPrice) || 0;
    const uploadExtra = customUploadedDesign ? 10.0 : 0; // Petit supplément flocage haute définition
    const textExtra = gamertag.trim() ? Number(currentItem.customTextPrice || 0) : 0;
    return (base + styleExtra + uploadExtra + textExtra).toFixed(2);
  }, [currentItem, currentStyle, gamertag, customUploadedDesign]);

  // Gestion de l'import de fichier client
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 12 * 1024 * 1024) {
      alert('Veuillez sélectionner une image de moins de 12 Mo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setCustomUploadedDesign(event.target.result);
      setUploadedDesignName(file.name);
      setRotationAngle(0); // Tourne automatiquement sur la face avant
    };
    reader.readAsDataURL(file);
  };

  // Action: Ajouter au panier officiel
  const handleAddToCart = () => {
    const cartProduct = {
      _id: `custom_${currentItem.slug}_${Date.now()}`,
      name: `${currentItem.name} - ${currentModel.name}`,
      price: parseFloat(calculatedPrice),
      images: [customUploadedDesign || currentItem.image || '/custom-gear/jersey_front_transparent.png'],
      isCustom: true,
      customDetails: {
        gamertag: gamertag.trim().toUpperCase() || 'SHADOW',
        number: playerNumber,
        role: playerRole,
        model: currentModel.name,
        color: activeColor.name,
        position: logoPosition,
        style: currentStyle?.name || 'Standard',
        hasCustomUploadedDesign: !!customUploadedDesign,
        uploadedDesignName: uploadedDesignName || 'Logo Officiel DWT'
      }
    };

    addToCart(cartProduct, selectedSize, 1);
    setAddedToast(true);

    setTimeout(() => {
      setAddedToast(false);
      onClose();
      if (onOpenCart) onOpenCart();
    }, 900);
  };

  // Réinitialiser les personnalisations et la rotation
  const handleReset = () => {
    setActiveModelId(currentItem.models[0]?.id || 'model_1');
    setActiveColor(currentItem.colors[0]);
    setGamertag('');
    setPlayerNumber('07');
    setPlayerRole('PRO DUELIST');
    setLogoPosition('center');
    setCustomUploadedDesign(null);
    setUploadedDesignName('');
    setCustomDesignScale(1.0);
    setRotationAngle(0);
    setIsAutoRotate(false);
    setZoomLevel(1.0);
  };

  if (!isOpen) return null;

  return (
    <div
      className="custom-studio-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="custom-studio-modal">
        {/* ==================================================================
            1. HEADER OFFICIEL ESPORT: "CRÉE TON ÉQUIPEMENT ESPORT"
            ================================================================== */}
        <header className="cs-header">
          <div className="cs-header-bg" />
          <div className="cs-header-content">
            <span className="cs-header-badge">DWT ESPORTS PRO CAD STUDIO 3D</span>
            <h1 className="cs-header-title">CRÉE TON ÉQUIPEMENT ESPORT</h1>
            <p className="cs-header-subtitle">
              Configurateur officiel Dark Wolf Team. Porte les couleurs de l'équipe esport ou imprime ton propre design.
            </p>
          </div>

          <div className="cs-header-right">
            <div className="cs-script-logo">
              DARK WOLF
              <span>TEAM ESPORT</span>
            </div>
            <button className="cs-close-btn" onClick={onClose} aria-label="Fermer le studio esport">
              <X size={18} />
            </button>
          </div>
        </header>

        {/* ==================================================================
            2. CORPS EN 3 COLONNES (Navigation Gauche, Canvas Centre, Contrôles Droite)
            ================================================================== */}
        <div className="cs-body-grid">
          {/* -------------------- COLONNE GAUCHE -------------------- */}
          <aside className="cs-left-col">
            <div>
              <div className="cs-category-list">
                {gearList.map((gear) => (
                  <button
                    key={gear.slug}
                    type="button"
                    className={`cs-category-item ${activeSlug === gear.slug ? 'active' : ''}`}
                    onClick={() => setActiveSlug(gear.slug)}
                  >
                    <div className="cs-category-left">
                      <CategoryIcon type={gear.slug} color={activeSlug === gear.slug ? '#22c55e' : '#94a3b8'} />
                      <span>{gear.category || gear.name}</span>
                    </div>
                    <ChevronRight size={15} color={activeSlug === gear.slug ? '#ffffff' : '#64748b'} />
                  </button>
                ))}
              </div>

              {/* Raccourcis de Personnalisation Esport */}
              <div className="cs-section-label">STUDIO DE SUBLIMATION</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <button
                  type="button"
                  className="cs-shortcut-item"
                  onClick={() => setDesignTab('design')}
                >
                  <UploadCloud size={16} />
                  <span>Importer un design</span>
                </button>
                <button
                  type="button"
                  className="cs-shortcut-item"
                  onClick={() => setDesignTab('joueur')}
                >
                  <Crosshair size={16} />
                  <span>Flocage Joueur & Rôle</span>
                </button>
                <button
                  type="button"
                  className="cs-shortcut-item"
                  onClick={() => {
                    const positions = ['center', 'heart', 'collar', 'large'];
                    const next = positions[(positions.indexOf(logoPosition) + 1) % positions.length];
                    setLogoPosition(next);
                  }}
                >
                  <Layers size={16} />
                  <span>Position du logo</span>
                </button>
              </div>
            </div>

            {/* Slogan Officiel Esport DWT */}
            <div className="cs-graffiti-box">
              <WolfLogo size={42} style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3))' }} />
              <div className="cs-graffiti-slogan">
                ON NE JOUE PAS,<br />ON DOMINE
              </div>
            </div>
          </aside>

          {/* -------------------- COLONNE CENTRALE: STUDIO 360° SANS BACKGROUND -------------------- */}
          <main className="cs-center-canvas">
            {/* Vignettes d'Angles Préréglés à Gauche */}
            <div className="cs-views-column">
              <button
                type="button"
                className={`cs-view-thumb ${Math.round(rotationAngle) === 0 ? 'active' : ''}`}
                onClick={() => {
                  setRotationAngle(0);
                  setIsAutoRotate(false);
                }}
                title="Face (0°)"
              >
                <span>FACE</span>
              </button>
              <button
                type="button"
                className={`cs-view-thumb ${Math.round(rotationAngle) === 90 ? 'active' : ''}`}
                onClick={() => {
                  setRotationAngle(90);
                  setIsAutoRotate(false);
                }}
                title="Profil Droit (90°)"
              >
                <span>PROFIL</span>
              </button>
              <button
                type="button"
                className={`cs-view-thumb ${Math.round(rotationAngle) === 180 ? 'active' : ''}`}
                onClick={() => {
                  setRotationAngle(180);
                  setIsAutoRotate(false);
                }}
                title="Dos & Flocage (180°)"
              >
                <span>DOS</span>
              </button>
              <button
                type="button"
                className={`cs-view-thumb ${isAutoRotate ? 'active' : ''}`}
                onClick={() => setIsAutoRotate(!isAutoRotate)}
                title="Rotation 360° Continue"
              >
                <span>360°</span>
              </button>
            </div>

            {/* Scène 3D Photoréaliste avec Découpe Transparente Sans Fond */}
            <div className="cs-stage-wrapper">
              <CustomGarmentRenderer
                category={activeSlug}
                modelId={activeModelId}
                color={activeColor}
                logoPosition={logoPosition}
                gamertag={gamertag}
                playerNumber={playerNumber}
                playerRole={playerRole}
                customUploadedDesign={customUploadedDesign}
                customDesignScale={customDesignScale}
                rotationAngle={rotationAngle}
                onAngleChange={setRotationAngle}
                isAutoRotate={isAutoRotate}
                zoomLevel={zoomLevel}
              />
            </div>

            {/* Outils Flottants à Droite */}
            <div className="cs-tools-column">
              <button
                type="button"
                className={`cs-tool-btn ${isAutoRotate ? 'active' : ''}`}
                onClick={() => setIsAutoRotate(!isAutoRotate)}
                title="Activer la rotation 360° automatique"
              >
                <div className="cs-tool-icon-wrap">
                  <RotateCw size={18} className={isAutoRotate ? 'animate-spin' : ''} />
                </div>
                <span>Auto 360°</span>
              </button>

              <button
                type="button"
                className={`cs-tool-btn ${zoomLevel > 1 ? 'active' : ''}`}
                onClick={() => setZoomLevel(zoomLevel > 1.0 ? 1.0 : 1.35)}
                title="Zoomer sur le vêtement"
              >
                <div className="cs-tool-icon-wrap">
                  <Search size={18} />
                </div>
                <span>Zoom</span>
              </button>

              <button
                type="button"
                className="cs-tool-btn"
                onClick={handleReset}
                title="Réinitialiser la vue et la configuration"
              >
                <div className="cs-tool-icon-wrap">
                  <RotateCcw size={18} />
                </div>
                <span>Reset</span>
              </button>
            </div>

            {/* Barre de Contrôle de Rotation 360° Inférieure */}
            <div className="cs-360-control-bar">
              <div className="cs-360-info-badge">
                <Compass size={13} />
                <span>ROTATION 360° : {Math.round(rotationAngle)}°</span>
              </div>

              <input
                type="range"
                min="0"
                max="360"
                value={Math.round(rotationAngle)}
                onChange={(e) => {
                  setRotationAngle(Number(e.target.value));
                  setIsAutoRotate(false);
                }}
                className="cs-360-slider"
                title="Glisser pour tourner le vêtement à 360°"
              />

              <div className="cs-quick-angles-row">
                <button
                  type="button"
                  className={`cs-angle-pill ${Math.round(rotationAngle) === 0 ? 'active' : ''}`}
                  onClick={() => { setRotationAngle(0); setIsAutoRotate(false); }}
                >
                  0° Face
                </button>
                <button
                  type="button"
                  className={`cs-angle-pill ${Math.round(rotationAngle) === 90 ? 'active' : ''}`}
                  onClick={() => { setRotationAngle(90); setIsAutoRotate(false); }}
                >
                  90° Profil
                </button>
                <button
                  type="button"
                  className={`cs-angle-pill ${Math.round(rotationAngle) === 180 ? 'active' : ''}`}
                  onClick={() => { setRotationAngle(180); setIsAutoRotate(false); }}
                >
                  180° Dos
                </button>
                <button
                  type="button"
                  className={`cs-angle-pill ${Math.round(rotationAngle) === 270 ? 'active' : ''}`}
                  onClick={() => { setRotationAngle(270); setIsAutoRotate(false); }}
                >
                  270° Profil G
                </button>
              </div>
            </div>
          </main>

          {/* -------------------- COLONNE DROITE (CONTRÔLES ESPORT) -------------------- */}
          <section className="cs-right-col">
            {/* Étape 1 : Choisis ton modèle Esport */}
            <div>
              <div className="cs-step-title">
                <span>1. Modèle Esport Compétition</span>
                <span className="cs-step-accent-name">{currentModel?.name}</span>
              </div>
              <div className="cs-models-row">
                {currentItem.models.map((m, idx) => (
                  <button
                    key={m.id}
                    type="button"
                    className={`cs-model-card ${activeModelId === m.id ? 'active' : ''}`}
                    onClick={() => setActiveModelId(m.id)}
                    title={m.name}
                  >
                    <WolfLogo size={16} />
                    <span className="cs-model-card-label">
                      M{idx + 1}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Étape 2 : Onglets de Personnalisation Esport */}
            <div>
              <div className="cs-step-title">
                <span>2. Personnalisation & Sublimation</span>
              </div>
              <div className="cs-tabs-row cs-tabs-row-4">
                <button
                  type="button"
                  className={`cs-tab-btn ${designTab === 'design' ? 'active' : ''}`}
                  onClick={() => setDesignTab('design')}
                  title="Importer un design ou logo"
                >
                  <UploadCloud size={13} />
                  <span>Design</span>
                </button>
                <button
                  type="button"
                  className={`cs-tab-btn ${designTab === 'joueur' ? 'active' : ''}`}
                  onClick={() => setDesignTab('joueur')}
                  title="Flocage Gamertag et Rôle"
                >
                  <Crosshair size={13} />
                  <span>Joueur</span>
                </button>
                <button
                  type="button"
                  className={`cs-tab-btn ${designTab === 'couleurs' ? 'active' : ''}`}
                  onClick={() => setDesignTab('couleurs')}
                  title="Couleurs de l'équipe"
                >
                  <Palette size={13} />
                  <span>Couleur</span>
                </button>
                <button
                  type="button"
                  className={`cs-tab-btn ${designTab === 'style' ? 'active' : ''}`}
                  onClick={() => setDesignTab('style')}
                  title="Tissus et finitions"
                >
                  <Edit3 size={13} />
                  <span>Finition</span>
                </button>
              </div>

              {/* ONGLET 1: IMPORT DE DESIGN / LOGO PAR LE CLIENT */}
              {designTab === 'design' && (
                <div className="cs-design-import-container">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/png, image/jpeg, image/svg+xml, image/webp"
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                  />

                  {customUploadedDesign ? (
                    <div className="cs-uploaded-badge-card">
                      <div className="cs-uploaded-left">
                        <img src={customUploadedDesign} alt="Design importé" className="cs-uploaded-thumb-preview" />
                        <div className="cs-uploaded-info">
                          <span className="cs-uploaded-filename">{uploadedDesignName || 'design_custom.png'}</span>
                          <span className="cs-uploaded-status">✓ Imprimé en sublimation</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="cs-remove-upload-btn"
                        onClick={() => {
                          setCustomUploadedDesign(null);
                          setUploadedDesignName('');
                        }}
                        title="Supprimer mon design et remettre le logo officiel"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div
                      className="cs-upload-dropzone"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <UploadCloud size={24} className="cs-upload-icon-pulse" />
                      <div className="cs-upload-prompt-text">
                        <strong>CLIQUEZ POUR IMPORTER UN DESIGN</strong>
                        <small>PNG transparent, JPG ou SVG (Max 12 Mo)</small>
                      </div>
                    </div>
                  )}

                  {/* Contrôle de la taille de l'impression importée */}
                  {customUploadedDesign && (
                    <div style={{ marginTop: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94a3b8', marginBottom: '4px' }}>
                        <span>ÉCHELLE DE L'IMPRESSION</span>
                        <strong style={{ color: '#fff' }}>{Math.round(customDesignScale * 100)}%</strong>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="1.5"
                        step="0.05"
                        value={customDesignScale}
                        onChange={(e) => setCustomDesignScale(parseFloat(e.target.value))}
                        className="cs-360-slider"
                      />
                    </div>
                  )}

                  <div className="cs-upload-tips">
                    <Sparkles size={12} color="#e60000" />
                    <span>L'image est sublimée directement dans le maillot en haute résolution.</span>
                  </div>
                </div>
              )}

              {/* ONGLET 2: JOUEUR & RÔLE ESPORT */}
              {designTab === 'joueur' && (
                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {/* Rôle Esport */}
                  <div>
                    <label style={{ fontSize: '10px', color: '#64748b', display: 'block', marginBottom: '4px', fontFamily: "'Orbitron', sans-serif" }}>
                      RÔLE DANS L'ÉQUIPE ESPORT
                    </label>
                    <select
                      className="cs-text-input cs-select-input"
                      value={playerRole}
                      onChange={(e) => setPlayerRole(e.target.value)}
                    >
                      {ESPORT_ROLES.map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '10px', color: '#64748b', display: 'block', marginBottom: '4px', fontFamily: "'Orbitron', sans-serif" }}>
                        NUMÉRO AU DOS
                      </label>
                      <input
                        type="text"
                        maxLength="2"
                        className="cs-text-input"
                        style={{ padding: '8px 10px', textAlign: 'center' }}
                        value={playerNumber}
                        onChange={(e) => setPlayerNumber(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="07"
                      />
                    </div>
                    <div style={{ flex: 2 }}>
                      <label style={{ fontSize: '10px', color: '#64748b', display: 'block', marginBottom: '4px', fontFamily: "'Orbitron', sans-serif" }}>
                        TOURNER LE MODÈLE
                      </label>
                      <button
                        type="button"
                        className="cs-tab-btn active"
                        style={{ width: '100%', padding: '9px 12px' }}
                        onClick={() => setRotationAngle(rotationAngle === 0 ? 180 : 0)}
                      >
                        {rotationAngle === 0 ? 'Voir le dos (180°)' : 'Voir la face (0°)'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ONGLET 3: COULEURS DE L'ÉQUIPE */}
              {designTab === 'couleurs' && (
                <div style={{ marginTop: '10px' }}>
                  <div className="cs-colors-row">
                    {currentItem.colors.map((c) => (
                      <div
                        key={c.id}
                        className={`cs-color-circle ${activeColor.id === c.id ? 'active' : ''}`}
                        style={{ backgroundColor: c.hex }}
                        onClick={() => setActiveColor(c)}
                        title={`${c.name} (${c.hex})`}
                      />
                    ))}
                  </div>
                  <div className="cs-active-color-label">
                    Couleur active : <strong>{activeColor.name}</strong>
                  </div>
                </div>
              )}

              {/* ONGLET 4: FINITIONS DU TISSU */}
              {designTab === 'style' && (
                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {currentItem.styles.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={`cs-category-item ${selectedStyleId === s.id ? 'active' : ''}`}
                      style={{ padding: '8px 12px', fontSize: '11.5px' }}
                      onClick={() => setSelectedStyleId(s.id)}
                    >
                      <span>{s.name}</span>
                      <span style={{ color: s.extraPrice > 0 ? '#4ade80' : '#94a3b8', fontFamily: "'Orbitron', monospace", fontSize: '10.5px' }}>
                        {s.extraPrice > 0 ? `+${s.extraPrice} TND` : 'Inclus'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Étape 3 : Pseudonyme officiel Joueur */}
            <div>
              <div className="cs-step-title">
                <span>3. Gamertag Joueur Esport</span>
                <span style={{ fontSize: '10px', color: '#64748b' }}>{gamertag.length}/14</span>
              </div>
              <div className="cs-input-group">
                <input
                  type="text"
                  maxLength="14"
                  className="cs-text-input"
                  placeholder="Ex: SHADOW, WOLFY..."
                  value={gamertag}
                  onChange={(e) => setGamertag(e.target.value)}
                />
                <Edit3 size={15} className="cs-input-icon" />
              </div>
            </div>

            {/* Étape 4 : Position de l'impression */}
            <div>
              <div className="cs-step-title">
                <span>4. Emplacement de l'impression</span>
              </div>
              <div className="cs-positions-grid">
                {currentItem.positions.map((pos) => (
                  <button
                    key={pos.id}
                    type="button"
                    className={`cs-position-card ${logoPosition === pos.id ? 'active' : ''}`}
                    onClick={() => setLogoPosition(pos.id)}
                    title={pos.name}
                  >
                    <MiniPositionPreview position={pos.id} />
                    <span className="cs-position-label">
                      {pos.id === 'center' && 'Centre'}
                      {pos.id === 'heart' && 'Cœur'}
                      {pos.id === 'collar' && 'Col'}
                      {pos.id === 'large' && 'Large'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sélection de la taille */}
            <div>
              <div className="cs-step-title">
                <span>Taille Esport</span>
              </div>
              <div className="cs-sizes-row">
                {['S', 'M', 'L', 'XL', '2XL'].map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`cs-size-btn ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Bouton d'Ajout au Panier */}
            <button
              type="button"
              className="cs-add-cart-btn"
              onClick={handleAddToCart}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShoppingBag size={18} />
                <span>{addedToast ? 'AJOUTÉ AU PANIER !' : 'AJOUTER AU PANIER'}</span>
              </div>
              <span className="cs-cart-price-tag">
                {calculatedPrice} {currentItem.currency || 'TND'}
              </span>
            </button>
          </section>
        </div>

        {/* ==================================================================
            3. PIED DE PAGE : "AUTRES PRODUITS" (Vraies Miniatures 3D & Tarifs)
            ================================================================== */}
        <footer className="cs-footer-bar">
          <div className="cs-footer-title">AUTRES ÉQUIPEMENTS ESPORT OFFICIELS</div>
          <div className="cs-other-products-wrapper">
            <div className="cs-other-products-grid">
              {gearList.map((gear) => (
                <div
                  key={gear.slug}
                  className={`cs-other-item-card ${activeSlug === gear.slug ? 'active' : ''}`}
                  onClick={() => setActiveSlug(gear.slug)}
                >
                  <img
                    src={gear.image || '/custom-gear/jersey_front_transparent.png'}
                    alt={gear.name}
                    className="cs-other-thumb-img"
                  />
                  <div className="cs-other-info">
                    <div className="cs-other-name">{gear.name}</div>
                    <div className="cs-other-price">
                      {gear.basePrice} {gear.currency || 'TND'}
                    </div>
                  </div>
                  <ChevronRight size={14} color="#64748b" />
                </div>
              ))}
            </div>

            <div className="cs-brand-footer-pill">
              <WolfLogo size={24} />
              <div className="cs-brand-footer-text">
                <span className="cs-brand-name-dark">DARK WOLF TEAM ESPORT</span>
                <span className="cs-brand-slogan-cursive">ON NE JOUE PAS. ON DOMINE</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default CustomStudioModal;
