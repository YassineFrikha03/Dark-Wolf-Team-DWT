import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  Palette,
  Type,
  UserCheck,
  Layers,
  Users,
  Sparkles,
  Shirt,
  Compass,
  ShoppingBag,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Check,
  Plus,
  Download,
  Upload,
  AlertCircle,
  Search,
  Link as LinkIcon,
  Image as ImageIcon,
  Bot,
  Wand2,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  RotateCw,
  Award,
  Zap,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Move,
  Flag,
  Crosshair,
  Maximize2
} from 'lucide-react';
import {
  customizerState,
  ESPORT_MODELS,
  BRAND_COLORS,
  ESPORT_FONTS,
  ESPORT_ROLES,
  BASE_PRICES,
  QUICK_POSITION_PRESETS,
  ANCHOR_POINTS,
  isColorDark,
  getSafeContrastColor
} from './state.js';
import {
  ALL_OFFICIAL_ASSETS,
  COUNTRY_FLAGS,
  ESPORT_BADGES,
  ESPORT_SPONSORS,
  OFFICIAL_DWT_LOGOS
} from './assetsLibrary.js';
import {
  AI_PRESETS,
  analyzeDesignWithAI,
  generateConfigFromPrompt,
  autoHarmonizeColors,
  autoAlignLayers,
  generateRandomPlayerIdentity
} from './aiEngine.js';

const QUICK_TEXT_PRESETS = [
  '07',
  '10',
  '23',
  'DARK WOLF',
  'TUNISIA',
  'CAPITAINE',
  'ESPORTS',
  'CHAMPION',
  'PRO DUELIST',
];

export const ToolDrawer = ({ state, onOpenFinalResult }) => {
  const fileInputRef = useRef(null);
  const csvInputRef = useRef(null);
  const [uploadError, setUploadError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [urlModalOpen, setUrlModalOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  
  // Onglet de filtre dans la bibliothèque d'images
  const [assetTab, setAssetTab] = useState('all'); // 'all' | 'dwt' | 'flags' | 'badges' | 'sponsors'

  // Outils de texte avancés
  const [customText, setCustomText] = useState('');
  const [selectedFont, setSelectedFont] = useState('Orbitron');
  const [selectedTextColor, setSelectedTextColor] = useState('#ffffff');
  const [textCurve, setTextCurve] = useState(0); // -50 à 50
  const [textStrokeWidth, setTextStrokeWidth] = useState(0); // 0 à 6
  const [textStrokeColor, setTextStrokeColor] = useState('#000000');

  const [selectedZone, setSelectedZone] = useState('body');

  // État de l'assistant IA
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [aiToast, setAiToast] = useState('');

  const activeTool = state.activeNavTool || 'upload';
  const activeView = state.activePatternView || 'front';
  const currentViewLayers = state.layers.filter((l) => l.view === activeView);
  const selectedLayer = currentViewLayers.find((l) => l.id === state.selectedLayerId) || currentViewLayers[0] || null;

  // Handlers pour l'assistant IA
  const aiAudit = analyzeDesignWithAI(state);

  const showAiToast = (msg) => {
    setAiToast(msg);
    setTimeout(() => setAiToast(''), 3000);
  };

  const handleApplyPreset = (preset) => {
    if (!preset?.config) return;
    setIsGenerating(true);
    setGenerationStep(`Application du thème ${preset.title}...`);

    setTimeout(() => {
      customizerState.setState({
        ...preset.config,
        selectedLayerId: preset.config.layers?.[0]?.id || null,
      });
      setIsGenerating(false);
      setGenerationStep('');
      showAiToast(`Thème IA "${preset.title}" appliqué avec succès !`);
    }, 450);
  };

  const handleAIPromptGenerate = () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    setGenerationStep("Analyse sémantique du style...");

    setTimeout(() => {
      setGenerationStep("Harmonisation des teintes et finitions...");
      setTimeout(() => {
        const foundPreset = generateConfigFromPrompt(aiPrompt);
        customizerState.setState({
          ...foundPreset.config,
          selectedLayerId: foundPreset.config.layers?.[0]?.id || null,
        });
        setIsGenerating(false);
        setGenerationStep('');
        showAiToast(`Configuration générée d'après "${aiPrompt.slice(0, 25)}..."`);
      }, 400);
    }, 400);
  };

  const handleAutoHarmonize = () => {
    const patch = autoHarmonizeColors(state);
    customizerState.setState(patch);
    showAiToast("Palette harmonisée pour un contraste compétition maximal !");
  };

  const handleAutoAlign = () => {
    const patch = autoAlignLayers(state);
    customizerState.setState(patch);
    showAiToast("Logos et calques recentrés selon les ratios dorés.");
  };

  const handleGenerateIdentity = () => {
    const patch = generateRandomPlayerIdentity();
    customizerState.setState(patch);
    showAiToast(`Identité créée : ${patch.gamertag} #${patch.playerNumber} (${patch.playerRole})`);
  };

  // 1. GESTION UPLOAD DESIGN LOCAL
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Format non supporté. Utilise un fichier PNG, JPG, SVG ou WebP.');
      return;
    }

    if (file.size > 12 * 1024 * 1024) {
      setUploadError('Le fichier dépasse la limite maximale autorisée de 12 Mo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      const img = new Image();
      img.onload = () => {
        const newAsset = {
          id: `asset_${Date.now()}`,
          name: file.name,
          url: dataUrl,
          width: img.width,
          height: img.height,
        };

        const updatedAssets = [newAsset, ...(state.uploadedAssets || [])];
        customizerState.setState({ uploadedAssets: updatedAssets });

        customizerState.addLayer({
          type: 'image',
          name: file.name,
          url: dataUrl,
          width: Math.min(260, img.width),
          height: Math.min(260, img.height),
          aspect: img.width / img.height,
        });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // 2. GESTION IMPORT VIA URL
  const handleUrlUpload = () => {
    if (!urlInput.trim()) return;
    setUploadError('');

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const newAsset = {
        id: `asset_url_${Date.now()}`,
        name: 'Design URL',
        url: urlInput.trim(),
        width: img.width,
        height: img.height,
      };

      const updatedAssets = [newAsset, ...(state.uploadedAssets || [])];
      customizerState.setState({ uploadedAssets: updatedAssets });

      customizerState.addLayer({
        type: 'image',
        name: 'Design URL',
        url: urlInput.trim(),
        width: Math.min(260, img.width),
        height: Math.min(260, img.height),
      });

      setUrlInput('');
      setUrlModalOpen(false);
    };
    img.onerror = () => {
      setUploadError("Impossible de charger l'image depuis cette URL (vérifier l'accès CORS).");
    };
    img.src = urlInput.trim();
  };

  // 3. AJOUTER UN TEXTE SUR LE PATRON AVEC OPTION COURBÉE ET CONTOUR
  const handleAddTextLayer = () => {
    if (!customText.trim()) return;
    const bodyColor = state.colors?.body || state.color?.hex || '#0a0b0e';
    const isDark = isColorDark(bodyColor);
    const finalTextColor = (isDark && isColorDark(selectedTextColor)) ? '#ffffff' : selectedTextColor;
    const isNum = /^\d{1,2}$/.test(customText.trim());

    customizerState.addLayer({
      type: 'text',
      name: isNum ? `Numéro: ${customText.trim()}` : `Texte: ${customText.slice(0, 10)}`,
      text: customText.toUpperCase(),
      fontFamily: selectedFont,
      textColor: finalTextColor,
      strokeWidth: textStrokeWidth,
      strokeColor: textStrokeColor,
      curve: textCurve,
      width: isNum ? 160 : 240,
      height: isNum ? 140 : (textCurve !== 0 ? 80 : 60),
      scale: isNum ? 1.3 : 1.0,
    });
    setCustomText('');
  };

  // Filtrage par catégorie et recherche dans la bibliothèque
  const getFilteredAssets = () => {
    let list = ALL_OFFICIAL_ASSETS;
    if (assetTab === 'dwt') list = OFFICIAL_DWT_LOGOS;
    else if (assetTab === 'flags') list = COUNTRY_FLAGS;
    else if (assetTab === 'badges') list = ESPORT_BADGES;
    else if (assetTab === 'sponsors') list = ESPORT_SPONSORS;

    if (!searchTerm.trim()) return list;
    const term = searchTerm.toLowerCase();
    return list.filter((a) => a.name.toLowerCase().includes(term) || (a.tag && a.tag.toLowerCase().includes(term)));
  };

  return (
    <div className="dwt-tool-drawer">
      {/* ────────────────── 1. PRODUITS & OPTIONS DE COUPE ────────────────── */}
      {activeTool === 'products' && (
        <div className="dwt-drawer-section">
          <div className="dwt-drawer-header">
            <h3>ÉQUIPEMENTS OFFICIELS</h3>
            <p>Choisis ton vêtement de compétition DWT</p>
          </div>

          <div className="dwt-products-grid">
            {[
              { id: 'maillots', label: 'Maillot Esport Pro 2026', price: '69,99 TND', icon: Shirt, available: true, badge: 'OFFICIEL VCT' },
              { id: 'hoodies', label: 'Hoodie Techwear Pro', price: '89,99 TND', icon: Shirt, available: true, badge: 'BEST-SELLER' },
              { id: 't-shirt', label: 'T-Shirt Athlétique', price: '49,99 TND', icon: Shirt, available: true, badge: 'CLASSIC' },
              { id: 'casquettes', label: 'Casquette Snapback', price: '34,99 TND', icon: Compass, available: false, badge: 'BIENTÔT' },
              { id: 'tote-bags', label: 'Tote Bag Toile', price: '24,99 TND', icon: ShoppingBag, available: false, badge: 'BIENTÔT' },
            ].map((prod) => (
              <button
                key={prod.id}
                type="button"
                className={`dwt-product-choice-card ${state.category === prod.id ? 'active' : ''} ${!prod.available ? 'disabled' : ''}`}
                onClick={() => {
                  if (prod.available) {
                    customizerState.setState({ category: prod.id });
                  }
                }}
              >
                <div className="dwt-prod-card-top">
                  <prod.icon size={20} className="dwt-prod-icon" />
                  <span className={`dwt-prod-badge ${!prod.available ? 'soon' : ''}`}>{prod.badge}</span>
                </div>
                <div className="dwt-prod-card-name">{prod.label}</div>
                <div className="dwt-prod-card-price">{prod.price}</div>
                {!prod.available && <div className="dwt-prod-soon-msg">Modèle bientôt disponible</div>}
              </button>
            ))}
          </div>

          {/* PARAMÈTRES SPÉCIFIQUES AU MAILLOT ESPORT PRO */}
          {state.category === 'maillots' && (
            <div className="dwt-jersey-custom-options">
              <div className="dwt-drawer-subheader">
                <Sparkles size={12} color="#e10613" />
                <span>SPÉCIFICATIONS MAILLOT ESPORT</span>
              </div>

              {/* Style de Col */}
              <div className="dwt-field-group">
                <label>Style de Col :</label>
                <div className="dwt-toggle-btn-group">
                  <button
                    type="button"
                    className={`dwt-sub-toggle-btn ${state.collarStyle === 'v_neck' ? 'active' : ''}`}
                    onClick={() => customizerState.setState({ collarStyle: 'v_neck' })}
                  >
                    Col en V Esport Pro
                  </button>
                  <button
                    type="button"
                    className={`dwt-sub-toggle-btn ${state.collarStyle === 'round' ? 'active' : ''}`}
                    onClick={() => customizerState.setState({ collarStyle: 'round' })}
                  >
                    Col Rond Athlétique
                  </button>
                </div>
              </div>

              {/* Coupe Athlétique vs Coupe Standard */}
              <div className="dwt-field-group">
                <label>Coupe du Maillot :</label>
                <div className="dwt-toggle-btn-group">
                  <button
                    type="button"
                    className={`dwt-sub-toggle-btn ${state.jerseyFit === 'pro' ? 'active' : ''}`}
                    onClick={() => customizerState.setState({ jerseyFit: 'pro' })}
                  >
                    Coupe Compétition (Fit)
                  </button>
                  <button
                    type="button"
                    className={`dwt-sub-toggle-btn ${state.jerseyFit === 'fan' ? 'active' : ''}`}
                    onClick={() => customizerState.setState({ jerseyFit: 'fan' })}
                  >
                    Coupe Standard (Relaxed)
                  </button>
                </div>
              </div>

              {/* Numéro Poitrine Avant */}
              <div className="dwt-front-number-toggle-card">
                <div className="dwt-front-number-info">
                  <span className="dwt-front-num-title">Numéro de Poitrine Avant</span>
                  <span className="dwt-front-num-desc">Ajoute ton numéro en petit sur la poitrine droite (Style VCT Pro)</span>
                </div>
                <input
                  type="checkbox"
                  checked={!!state.frontNumberEnabled}
                  onChange={(e) => customizerState.setState({ frontNumberEnabled: e.target.checked })}
                  className="dwt-checkbox"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* ────────────────── 2. IMPORTER UN DESIGN ────────────────── */}
      {activeTool === 'upload' && (
        <div className="dwt-drawer-section">
          <div className="dwt-drawer-header">
            <h3>IMPORTER UN DESIGN</h3>
            <p>Ajoute ton logo, illustration ou sponsor</p>
          </div>

          <div
            className="dwt-dropzone-box"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/webp, image/gif"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
            <div className="dwt-dropzone-title">CLICK HERE TO UPLOAD</div>
            <div style={{ fontSize: '11px', color: 'var(--dwt-text-muted)' }}>or</div>
            <button
              type="button"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--dwt-cyan)',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: 0,
              }}
              onClick={(e) => {
                e.stopPropagation();
                setUrlModalOpen(true);
              }}
            >
              URL Upload
            </button>
            <div className="dwt-dropzone-subtitle" style={{ marginTop: '4px' }}>
              Moins de 12 Mo (png, jpg, svg, webp)
            </div>
          </div>

          {urlModalOpen && (
            <div style={{ background: '#12151f', border: '1px solid var(--dwt-border)', borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#fff' }}>Importer via URL :</span>
              <input
                type="text"
                placeholder="https://exemple.com/image.png"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="dwt-text-input"
                style={{ fontSize: '11px' }}
              />
              <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  style={{ background: 'transparent', border: '1px solid var(--dwt-border)', color: '#aaa', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer' }}
                  onClick={() => setUrlModalOpen(false)}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  style={{ background: 'var(--dwt-red)', border: 'none', color: '#fff', padding: '4px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: '700', cursor: 'pointer' }}
                  onClick={handleUrlUpload}
                >
                  Charger
                </button>
              </div>
            </div>
          )}

          {uploadError && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ff4d4d', fontSize: '11px', padding: '6px', background: 'rgba(255, 77, 77, 0.1)', borderRadius: '6px' }}>
              <AlertCircle size={14} />
              <span>{uploadError}</span>
            </div>
          )}

          <div className="dwt-drawer-subheader">
            <span>MES FICHIERS IMPORTÉS</span>
          </div>

          {(!state.uploadedAssets || state.uploadedAssets.length === 0) ? (
            <div className="dwt-empty-assets-tip">
              <Upload size={22} className="dwt-empty-icon" />
              <p>Aucun fichier importé pour l'instant</p>
              <span>Glisse ton logo PNG ci-dessus pour le placer sur ton maillot.</span>
            </div>
          ) : (
            <div className="dwt-assets-grid">
              {state.uploadedAssets.map((asset) => (
                <button
                  key={asset.id}
                  type="button"
                  className="dwt-asset-thumb-btn"
                  onClick={() => {
                    customizerState.addLayer({
                      type: 'image',
                      name: asset.name,
                      url: asset.url,
                      width: 220,
                      height: 220,
                    });
                  }}
                  title={`Ajouter ${asset.name} au patron`}
                >
                  <img src={asset.url} alt={asset.name} />
                  <span className="dwt-asset-name">{asset.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ────────────────── 3. BIBLIOTHÈQUE RICHE : LOGOS, DRAPEAUX, ÉCUSSONS & SPONSORS ────────────────── */}
      {activeTool === 'images' && (
        <div className="dwt-drawer-section">
          <div className="dwt-drawer-header">
            <h3>BIBLIOTHÈQUE D'IMAGES</h3>
            <p>Drapeaux nationaux, blasons esport et sponsors partenaires</p>
          </div>

          {/* Onglets de filtrage par catégorie */}
          <div className="dwt-asset-category-tabs">
            {[
              { id: 'all', label: 'Tout' },
              { id: 'dwt', label: 'DWT' },
              { id: 'flags', label: 'Drapeaux' },
              { id: 'badges', label: 'Écussons' },
              { id: 'sponsors', label: 'Sponsors' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`dwt-asset-tab-pill ${assetTab === tab.id ? 'active' : ''}`}
                onClick={() => setAssetTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Recherche */}
          <div className="dwt-drawer-search-wrap">
            <input
              type="text"
              placeholder="Rechercher (Tunisie, Pro League, Wolf...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="dwt-drawer-search-input"
            />
            <Search size={14} className="dwt-drawer-search-icon" />
          </div>

          <div className="dwt-drawer-subheader">
            <span>ÉLÉMENTS DISPONIBLES ({getFilteredAssets().length})</span>
          </div>

          <div className="dwt-assets-grid">
            {getFilteredAssets().map((item) => (
              <button
                key={item.id}
                type="button"
                className="dwt-asset-thumb-btn"
                onClick={() => {
                  customizerState.addLayer({
                    type: 'logo',
                    name: item.name,
                    url: item.url,
                    width: item.category === 'sponsors' ? 260 : 200,
                    height: item.category === 'sponsors' ? 120 : 200,
                  });
                }}
                title={`Ajouter ${item.name} sur ${state.activePatternView || 'front'}`}
              >
                <div className="dwt-asset-preview-wrap">
                  <img src={item.url} alt={item.name} />
                </div>
                <span className="dwt-asset-name">{item.name}</span>
                {item.tag && <span className="dwt-asset-tag">{item.tag}</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ────────────────── 4. COULEURS PAR ZONE ────────────────── */}
      {activeTool === 'color' && (
        <div className="dwt-drawer-section">
          <div className="dwt-drawer-header">
            <h3>COULEURS PAR ZONE</h3>
            <p>Personnalise chaque panneau textile</p>
          </div>

          <div className="dwt-zone-pill-selector">
            {[
              { id: 'body', label: 'Corps Principal' },
              { id: 'sleeves', label: 'Manches' },
              { id: 'collar', label: 'Col & Bords' },
              ...(state.category === 'hoodies' ? [{ id: 'hood', label: 'Capuche' }] : []),
            ].map((z) => (
              <button
                key={z.id}
                type="button"
                className={`dwt-zone-pill ${selectedZone === z.id ? 'active' : ''}`}
                onClick={() => setSelectedZone(z.id)}
              >
                {z.label}
              </button>
            ))}
          </div>

          <div className="dwt-drawer-subheader">
            <span>PALETTE OFFICIELLE DWT</span>
          </div>

          <div className="dwt-color-palette-grid">
            {BRAND_COLORS.map((col) => {
              const currentZoneColor = state.colors?.[selectedZone] || '#0a0b0e';
              const isSelected = currentZoneColor.toLowerCase() === col.hex.toLowerCase();

              return (
                <button
                  key={col.id}
                  type="button"
                  className={`dwt-color-circle-btn ${isSelected ? 'selected' : ''}`}
                  style={{ backgroundColor: col.hex }}
                  onClick={() => {
                    const newColors = { ...(state.colors || {}), [selectedZone]: col.hex };
                    const isDark = isColorDark(col.hex);
                    const updates = { colors: newColors, color: col };
                    if (selectedZone === 'body') {
                      if (isDark) {
                        if (isColorDark(state.playerTextColor)) updates.playerTextColor = '#ffffff';
                        if (isColorDark(state.playerNumberColor)) updates.playerNumberColor = '#ffffff';
                      } else {
                        if (!isColorDark(state.playerTextColor)) updates.playerTextColor = '#0a0b0e';
                      }
                    }
                    customizerState.setState(updates);
                  }}
                  title={`${col.name} (${col.hex})`}
                >
                  {isSelected && <Check size={14} color={col.hex === '#f8fafc' ? '#000' : '#fff'} />}
                </button>
              );
            })}
          </div>

          <div className="dwt-custom-hex-field">
            <label>Couleur personnalisée (HEX) :</label>
            <div className="dwt-hex-input-wrap">
              <input
                type="color"
                className="dwt-native-color-picker"
                value={state.colors?.[selectedZone] || '#0a0b0e'}
                onChange={(e) => {
                  const newColors = { ...(state.colors || {}), [selectedZone]: e.target.value };
                  customizerState.setState({ colors: newColors });
                }}
              />
              <span className="dwt-hex-code-display">{state.colors?.[selectedZone] || '#0a0b0e'}</span>
            </div>
          </div>

          <button
            type="button"
            className="dwt-apply-all-btn"
            onClick={() => {
              const activeCol = state.colors?.[selectedZone] || '#0a0b0e';
              customizerState.setState({
                colors: {
                  body: activeCol,
                  sleeves: activeCol,
                  collar: activeCol,
                  hood: activeCol,
                  cuffs: activeCol,
                  pocket: activeCol,
                },
              });
            }}
          >
            Appliquer à tout le vêtement
          </button>
        </div>
      )}

      {/* ────────────────── 5. TEXTE & TYPOGRAPHIE ESPORT ────────────────── */}
      {activeTool === 'text' && (
        <div className="dwt-drawer-section">
          <div className="dwt-drawer-header">
            <h3>TEXTE & TYPOGRAPHIE ESPORT</h3>
            <p>Ajoute des inscriptions, noms de team et sponsors</p>
          </div>

          {/* Saisie de texte */}
          <div className="dwt-field-group">
            <label>Ton texte :</label>
            <input
              type="text"
              placeholder="EX: DARK WOLF ESPORT"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="dwt-text-input"
              maxLength={24}
            />
          </div>

          {/* Presets de textes rapides */}
          <div className="dwt-field-group">
            <label>Mots-clés rapides :</label>
            <div className="dwt-quick-text-chips">
              {QUICK_TEXT_PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  className="dwt-text-chip-btn"
                  onClick={() => setCustomText(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Police esport */}
          <div className="dwt-field-group">
            <label>Police esport :</label>
            <div className="dwt-fonts-list">
              {ESPORT_FONTS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={`dwt-font-option-btn ${selectedFont === f.id ? 'active' : ''}`}
                  style={{ fontFamily: f.family }}
                  onClick={() => setSelectedFont(f.id)}
                >
                  <span>{f.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Courbure du texte (Curved Text Arc) */}
          <div className="dwt-field-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label>Courbure du texte (Arche) :</label>
              <span style={{ fontSize: '11px', fontFamily: 'Orbitron', color: 'var(--dwt-cyan)' }}>
                {textCurve === 0 ? 'Droit' : textCurve > 0 ? `+${textCurve}° Haut` : `${textCurve}° Bas`}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <input
                type="range"
                min="-40"
                max="40"
                value={textCurve}
                onChange={(e) => setTextCurve(Number(e.target.value))}
                className="dwt-range-slider"
              />
              <button
                type="button"
                className="dwt-mini-action-btn"
                onClick={() => setTextCurve(0)}
                title="Remettre droit"
              >
                0°
              </button>
            </div>
          </div>

          {/* Contour / Bordure de texte */}
          <div className="dwt-field-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label>Contour / Bordure de texte :</label>
              <span style={{ fontSize: '11px', fontFamily: 'Orbitron', color: '#9aa1ad' }}>{textStrokeWidth}px</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[0, 2, 4, 6].map((w) => (
                  <button
                    key={w}
                    type="button"
                    className={`dwt-sub-toggle-btn ${textStrokeWidth === w ? 'active' : ''}`}
                    style={{ padding: '3px 8px', fontSize: '10px' }}
                    onClick={() => setTextStrokeWidth(w)}
                  >
                    {w === 0 ? 'Aucun' : `${w}px`}
                  </button>
                ))}
              </div>
              {textStrokeWidth > 0 && (
                <div style={{ display: 'flex', gap: '4px' }}>
                  {['#000000', '#ffffff', '#e10613', '#00e5ff'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        backgroundColor: c,
                        border: textStrokeColor === c ? '2px solid #fff' : '1px solid rgba(255,255,255,0.2)',
                        cursor: 'pointer',
                      }}
                      onClick={() => setTextStrokeColor(c)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Couleur du texte */}
          <div className="dwt-field-group">
            <label>Couleur du texte :</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['#ffffff', '#e10613', '#00e5ff', '#ffb703', '#9aa1ad', '#0a0b0e'].map((hex) => (
                <button
                  key={hex}
                  type="button"
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: hex,
                    border: selectedTextColor === hex ? '2px solid #fff' : '1px solid rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedTextColor(hex)}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            className="dwt-primary-action-btn"
            onClick={handleAddTextLayer}
            disabled={!customText.trim()}
          >
            <Plus size={16} />
            <span>Ajouter ce texte sur le patron</span>
          </button>
        </div>
      )}

      {/* ────────────────── 6. FLOCAGE JOUEUR ESPORT ────────────────── */}
      {activeTool === 'player' && (
        <div className="dwt-drawer-section">
          <div className="dwt-drawer-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3>FLOCAGE JOUEUR COMPÉTITION</h3>
              <p>Optionnel : ajoute et déplace librement selon tes souhaits</p>
            </div>
            {(state.playerFlockingEnabled || state.gamertag || state.playerNumber || state.playerRole) && (
              <button
                type="button"
                className="dwt-mini-action-btn"
                style={{ color: 'var(--dwt-red)', borderColor: 'rgba(225, 6, 19, 0.4)', fontSize: '10px', padding: '3px 8px' }}
                onClick={() => customizerState.clearPlayerFlocking()}
                title="Effacer tout le flocage"
              >
                <Trash2 size={12} />
                <span>Effacer tout</span>
              </button>
            )}
          </div>

          {/* Master Switch Flocage Dos */}
          <div className="dwt-flock-master-card">
            <div className="dwt-flock-master-info">
              <span className="dwt-flock-master-title">Flocage Compétition au Dos</span>
              <span className="dwt-flock-master-desc">Active ou désactive l'ensemble des inscriptions dorsales</span>
            </div>
            <label className="dwt-switch">
              <input
                type="checkbox"
                checked={!!state.playerFlockingEnabled}
                onChange={(e) => {
                  const checked = e.target.checked;
                  if (!checked) {
                    customizerState.clearPlayerFlocking();
                  } else {
                    customizerState.setState({
                      playerFlockingEnabled: true,
                      activePatternView: 'back',
                    });
                  }
                }}
              />
              <span className="dwt-slider round" />
            </label>
          </div>

          {!!state.playerFlockingEnabled && (
            <div className="dwt-flock-options-container">
              {/* OPTION 1 : PSEUDO / GAMERTAG */}
              <div className={`dwt-flock-option-box ${state.showGamertag ? 'active' : ''}`}>
                <div className="dwt-flock-option-header">
                  <div className="dwt-flock-option-title-group">
                    <span className="dwt-flock-badge-num">1</span>
                    <div>
                      <span className="dwt-flock-option-label">Nom / Pseudo Joueur (Gamertag)</span>
                      <span className="dwt-flock-option-sub">Haut du dos sous l'encolure</span>
                    </div>
                  </div>
                  <label className="dwt-switch">
                    <input
                      type="checkbox"
                      checked={!!state.showGamertag}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        if (checked) {
                          const tag = state.gamertag || 'FROST';
                          customizerState.setGamertag(tag, state.playerFont, state.playerTextColor);
                          customizerState.setState({ activePatternView: 'back' });
                        } else {
                          customizerState.setGamertag('', state.playerFont, state.playerTextColor);
                        }
                      }}
                    />
                    <span className="dwt-slider round" />
                  </label>
                </div>

                {!!state.showGamertag && (
                  <div className="dwt-flock-option-body">
                    <input
                      type="text"
                      placeholder="EX: FROST"
                      value={state.gamertag || ''}
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase();
                        customizerState.setGamertag(val, state.playerFont, state.playerTextColor);
                      }}
                      className="dwt-text-input"
                      maxLength={14}
                    />

                    {/* Raccourcis pseudos rapides */}
                    <div className="dwt-quick-gamertag-chips">
                      {['FROST', 'SHADOW', 'WOLFY', 'VIPER', 'NEXUS'].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          className="dwt-text-chip-btn"
                          onClick={() => customizerState.setGamertag(tag, state.playerFont, state.playerTextColor)}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>

                    {/* Couleur du Gamertag */}
                    <div className="dwt-mini-field-row">
                      <span className="dwt-mini-label">Couleur du nom :</span>
                      <div className="dwt-flock-color-swatches">
                        {['#ffffff', '#e10613', '#00e5ff', '#ffb703', '#9aa1ad', '#0a0b0e'].map((hex) => (
                          <button
                            key={hex}
                            type="button"
                            className={`dwt-flock-color-dot ${state.playerTextColor === hex ? 'active' : ''}`}
                            style={{ backgroundColor: hex }}
                            onClick={() => {
                              customizerState.setState({ playerTextColor: hex });
                              if (state.gamertag) {
                                customizerState.setGamertag(state.gamertag, state.playerFont, hex);
                              }
                            }}
                            title={hex}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* OPTION 2 : MENTION DE CAPITAINE / RÔLE ESPORT */}
              <div className={`dwt-flock-option-box ${state.showPlayerRole ? 'active' : ''}`}>
                <div className="dwt-flock-option-header">
                  <div className="dwt-flock-option-title-group">
                    <span className="dwt-flock-badge-num">2</span>
                    <div>
                      <span className="dwt-flock-option-label">Mention de Rôle / Capitaine</span>
                      <span className="dwt-flock-option-sub">Badge textuel sous le Gamertag</span>
                    </div>
                  </div>
                  <label className="dwt-switch">
                    <input
                      type="checkbox"
                      checked={!!state.showPlayerRole}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        if (checked) {
                          const role = state.playerRole || 'CAPITAINE';
                          customizerState.setPlayerRole(role, state.playerRoleColor);
                          customizerState.setState({ activePatternView: 'back' });
                        } else {
                          customizerState.setPlayerRole('', state.playerRoleColor);
                        }
                      }}
                    />
                    <span className="dwt-slider round" />
                  </label>
                </div>

                {!!state.showPlayerRole && (
                  <div className="dwt-flock-option-body">
                    <select
                      value={state.playerRole || 'CAPITAINE'}
                      onChange={(e) => customizerState.setPlayerRole(e.target.value, state.playerRoleColor)}
                      className="dwt-text-input"
                    >
                      {ESPORT_ROLES.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>

                    {/* Badges de rôles rapides */}
                    <div className="dwt-quick-role-pills">
                      {['CAPITAINE', 'JOUEUR', 'PRO DUELIST', 'SNIPER AWP', 'IGL / STRATÈGE'].map((role) => (
                        <button
                          key={role}
                          type="button"
                          className={`dwt-role-pill-btn ${state.playerRole === role ? 'active' : ''}`}
                          onClick={() => customizerState.setPlayerRole(role, state.playerRoleColor)}
                        >
                          {role}
                        </button>
                      ))}
                    </div>

                    {/* Couleur de la mention de rôle */}
                    <div className="dwt-mini-field-row">
                      <span className="dwt-mini-label">Couleur de la mention :</span>
                      <div className="dwt-flock-color-swatches">
                        {['#e10613', '#00e5ff', '#ffffff', '#ffb703'].map((hex) => (
                          <button
                            key={hex}
                            type="button"
                            className={`dwt-flock-color-dot ${(state.playerRoleColor || '#e10613') === hex ? 'active' : ''}`}
                            style={{ backgroundColor: hex }}
                            onClick={() => {
                              customizerState.setState({ playerRoleColor: hex });
                              if (state.playerRole) {
                                customizerState.setPlayerRole(state.playerRole, hex);
                              }
                            }}
                            title={hex}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* OPTION 3 : NUMÉRO OFFICIEL AU DOS */}
              <div className={`dwt-flock-option-box ${state.showPlayerNumber ? 'active' : ''}`}>
                <div className="dwt-flock-option-header">
                  <div className="dwt-flock-option-title-group">
                    <span className="dwt-flock-badge-num">3</span>
                    <div>
                      <span className="dwt-flock-option-label">Numéro Officiel de Match</span>
                      <span className="dwt-flock-option-sub">Grand numéro central (00 à 99)</span>
                    </div>
                  </div>
                  <label className="dwt-switch">
                    <input
                      type="checkbox"
                      checked={!!state.showPlayerNumber}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        if (checked) {
                          const num = state.playerNumber || '07';
                          customizerState.setPlayerNumber(num, state.playerFont, state.playerNumberColor);
                          customizerState.setState({ activePatternView: 'back' });
                        } else {
                          customizerState.setPlayerNumber('', state.playerFont, state.playerNumberColor);
                        }
                      }}
                    />
                    <span className="dwt-slider round" />
                  </label>
                </div>

                {!!state.showPlayerNumber && (
                  <div className="dwt-flock-option-body">
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="text"
                        placeholder="07"
                        value={state.playerNumber || ''}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 2);
                          customizerState.setPlayerNumber(val, state.playerFont, state.playerNumberColor);
                        }}
                        className="dwt-text-input"
                        style={{ width: '80px', textAlign: 'center', fontSize: '18px', fontWeight: '900' }}
                        maxLength={2}
                      />
                      <div className="dwt-quick-gamertag-chips" style={{ flex: 1 }}>
                        {['07', '10', '23', '99', '01'].map((num) => (
                          <button
                            key={num}
                            type="button"
                            className="dwt-text-chip-btn"
                            onClick={() => customizerState.setPlayerNumber(num, state.playerFont, state.playerNumberColor)}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Couleur du Numéro */}
                    <div className="dwt-mini-field-row">
                      <span className="dwt-mini-label">Couleur du numéro :</span>
                      <div className="dwt-flock-color-swatches">
                        {['#ffffff', '#e10613', '#00e5ff', '#ffb703', '#9aa1ad', '#0a0b0e'].map((hex) => (
                          <button
                            key={hex}
                            type="button"
                            className={`dwt-flock-color-dot ${state.playerNumberColor === hex ? 'active' : ''}`}
                            style={{ backgroundColor: hex }}
                            onClick={() => {
                              customizerState.setState({ playerNumberColor: hex });
                              if (state.playerNumber) {
                                customizerState.setPlayerNumber(state.playerNumber, state.playerFont, hex);
                              }
                            }}
                            title={hex}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* OPTION 4 : TYPOGRAPHIE ESPORT DU FLOCAGE */}
              <div className="dwt-field-group">
                <label>Typographie du flocage :</label>
                <div className="dwt-fonts-list">
                  {ESPORT_FONTS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      className={`dwt-font-option-btn ${state.playerFont === f.id ? 'active' : ''}`}
                      style={{ fontFamily: f.family }}
                      onClick={() => {
                        customizerState.setState({ playerFont: f.id });
                        if (state.gamertag) {
                          customizerState.setGamertag(state.gamertag, f.id, state.playerTextColor);
                        }
                        if (state.playerNumber) {
                          customizerState.setPlayerNumber(state.playerNumber, f.id, state.playerNumberColor);
                        }
                      }}
                    >
                      <span>{f.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* APERÇU EN DIRECT DU FLOCAGE SÉLECTIONNÉ */}
              <div className="dwt-player-preview-card">
                {state.showGamertag && state.gamertag ? (
                  <div
                    className="dwt-preview-tag"
                    style={{
                      color: state.playerTextColor || '#ffffff',
                      fontFamily: `"${(state.playerFont || 'Orbitron').replace(/['"]/g, '')}", sans-serif`
                    }}
                  >
                    {state.gamertag}
                  </div>
                ) : null}

                {state.showPlayerRole && state.playerRole ? (
                  <div
                    className="dwt-preview-role"
                    style={{ color: state.playerRoleColor || '#e10613' }}
                  >
                    {state.playerRole}
                  </div>
                ) : null}

                {state.showPlayerNumber && state.playerNumber ? (
                  <div
                    className="dwt-preview-num"
                    style={{
                      color: state.playerNumberColor || '#ffffff',
                      fontFamily: `"${(state.playerFont || 'Orbitron').replace(/['"]/g, '')}", sans-serif`
                    }}
                  >
                    {state.playerNumber}
                  </div>
                ) : null}

                {(!state.gamertag && !state.playerNumber && (!state.showPlayerRole || !state.playerRole)) && (
                  <div style={{ fontSize: '11px', color: 'var(--dwt-text-muted)', textAlign: 'center', padding: '8px' }}>
                    Saisis ton pseudo ou numéro si tu souhaites personnaliser le flocage
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ────────────────── 7. GESTION DES CALQUES & POSITION RAPIDE ────────────────── */}
      {activeTool === 'layers' && (
        <div className="dwt-drawer-section">
          <div className="dwt-drawer-header">
            <h3>CALQUES SUR CETTE PIÈCE</h3>
            <p>Face active : {state.activePatternView?.toUpperCase() || 'FRONT'}</p>
          </div>

          {/* BOÎTIER DE POSITIONNEMENT RAPIDE DU CALQUE SÉLECTIONNÉ */}
          {selectedLayer && (
            <div className="dwt-drawer-quick-position-box">
              <div className="dwt-drawer-quick-pos-header">
                <Move size={12} color="#00e5ff" />
                <span>EMPLACEMENT RAPIDE : {selectedLayer.name}</span>
              </div>
              <div className="dwt-drawer-pos-pills-grid">
                {(QUICK_POSITION_PRESETS[activeView] || []).map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    className="dwt-drawer-pos-pill"
                    onClick={() => customizerState.applyPositionPreset(selectedLayer.id, preset)}
                  >
                    <span>{preset.icon}</span>
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>

              {/* D-PAD Micro-ajustement */}
              <div className="dwt-drawer-dpad-row">
                <span style={{ fontSize: '10px', color: '#888' }}>Ajuster :</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button type="button" className="dwt-mini-action-btn" onClick={() => customizerState.nudgeLayer(selectedLayer.id, -0.02, 0)} title="Gauche">←</button>
                  <button type="button" className="dwt-mini-action-btn" onClick={() => customizerState.nudgeLayer(selectedLayer.id, 0, -0.02)} title="Haut">↑</button>
                  <button type="button" className="dwt-mini-action-btn" onClick={() => customizerState.nudgeLayer(selectedLayer.id, 0, 0.02)} title="Bas">↓</button>
                  <button type="button" className="dwt-mini-action-btn" onClick={() => customizerState.nudgeLayer(selectedLayer.id, 0.02, 0)} title="Droite">→</button>
                </div>
              </div>
            </div>
          )}

          {state.layers.filter(l => l.view === (state.activePatternView || 'front')).length === 0 ? (
            <div style={{ fontSize: '11px', color: 'var(--dwt-text-muted)', textAlign: 'center', padding: '20px 0' }}>
              Aucun élément sur cette face. Importe une image ou ajoute un texte.
            </div>
          ) : (
            <div className="dwt-layers-stack-list">
              {state.layers
                .filter(l => l.view === (state.activePatternView || 'front'))
                .map((layer, idx) => {
                  const isSelected = state.selectedLayerId === layer.id;
                  return (
                    <div
                      key={layer.id}
                      className={`dwt-layer-row-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => customizerState.setState({ selectedLayerId: layer.id }, false)}
                    >
                      <div className="dwt-layer-item-left">
                        <span className="dwt-layer-index">#{idx + 1}</span>
                        <span className="dwt-layer-name">{layer.name}</span>
                      </div>

                      <div className="dwt-layer-item-actions" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          className="dwt-layer-mini-btn"
                          onClick={() => customizerState.updateLayer(layer.id, { visible: !layer.visible })}
                          title={layer.visible ? 'Masquer' : 'Afficher'}
                        >
                          {layer.visible ? <Eye size={14} /> : <EyeOff size={14} color="#e10613" />}
                        </button>
                        <button
                          type="button"
                          className="dwt-layer-mini-btn"
                          onClick={() => customizerState.updateLayer(layer.id, { locked: !layer.locked })}
                          title={layer.locked ? 'Déverrouiller' : 'Verrouiller'}
                        >
                          {layer.locked ? <Lock size={14} color="#ffb703" /> : <Unlock size={14} />}
                        </button>
                        <button
                          type="button"
                          className="dwt-layer-mini-btn dwt-delete"
                          onClick={() => customizerState.deleteLayer(layer.id)}
                          title="Supprimer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* ────────────────── 8. FINITIONS & TISSUS ────────────────── */}
      {activeTool === 'finishes' && (
        <div className="dwt-drawer-section">
          <div className="dwt-drawer-header">
            <h3>MATIÈRES & FINITIONS</h3>
            <p>Choisis le tissu et la méthode d'application</p>
          </div>

          <div className="dwt-finishes-list">
            {[
              { id: 'mesh', name: 'Dry-Tech Micro-Mesh Pro', desc: '140 g/m² · Respirant haute ventilation VCT', extra: '+5,00 TND' },
              { id: 'mat', name: 'Polyester Athlétique Mat', desc: '160 g/m² · Toucher doux premium naturel', extra: 'Inclus' },
              { id: 'satine', name: 'Pro Satiné Élite', desc: '160 g/m² · Reflets soyeux et intensité', extra: '+7,00 TND' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                className={`dwt-finish-card ${state.finish === f.id ? 'active' : ''}`}
                onClick={() => customizerState.setState({ finish: f.id })}
              >
                <div className="dwt-finish-top">
                  <span className="dwt-finish-name">{f.name}</span>
                  <span className="dwt-finish-extra">{f.extra}</span>
                </div>
                <div className="dwt-finish-desc">{f.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ────────────────── 9. STUDIO IA & CONFIGURATION EN DIRECT ────────────────── */}
      {activeTool === 'ai' && (
        <div className="dwt-drawer-section">
          <div className="dwt-drawer-header">
            <div className="dwt-ai-drawer-badge">
              <Bot size={13} color="#00e5ff" />
              <span>ASSISTANT IA & CO-PILOTE</span>
            </div>
            <h3>CONFIGURATION IA DU STUDIO</h3>
            <p>Génération par prompt, réglages en direct & rendu final</p>
          </div>

          {aiToast && (
            <div className="dwt-ai-toast">
              <CheckCircle2 size={14} color="#00e5ff" />
              <span>{aiToast}</span>
            </div>
          )}

          {/* 1. GÉNÉRATEUR IA PAR PROMPT */}
          <div className="dwt-ai-prompt-box">
            <label className="dwt-form-label">CRÉER PAR INSTRUCTION IA :</label>
            <div className="dwt-ai-prompt-input-row">
              <input
                type="text"
                placeholder="Ex: Maillot VCT noir et rouge avec blason loup..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAIPromptGenerate();
                }}
                className="dwt-text-input dwt-ai-input"
                disabled={isGenerating}
              />
              <button
                type="button"
                className="dwt-ai-send-btn"
                onClick={handleAIPromptGenerate}
                disabled={isGenerating || !aiPrompt.trim()}
                title="Générer avec l'IA"
              >
                {isGenerating ? <RotateCw size={16} className="dwt-spin" /> : <Wand2 size={16} />}
              </button>
            </div>
            {isGenerating && (
              <div className="dwt-ai-progress-status">
                <span className="dwt-ai-pulse-dot" />
                <span>{generationStep || "Génération du style en cours..."}</span>
              </div>
            )}
          </div>

          {/* 2. ARCHÉTYPES ESPORT */}
          <div style={{ marginTop: '14px' }}>
            <label className="dwt-form-label">THÈMES ESPORT PRÉ-CONFIGURÉS :</label>
            <div className="dwt-ai-presets-list">
              {AI_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className="dwt-ai-preset-card"
                  onClick={() => handleApplyPreset(preset)}
                >
                  <div className="dwt-ai-preset-icon">{preset.icon}</div>
                  <div className="dwt-ai-preset-info">
                    <div className="dwt-ai-preset-title">{preset.title}</div>
                    <div className="dwt-ai-preset-desc">{preset.description}</div>
                  </div>
                  <Zap size={14} className="dwt-ai-preset-arrow" />
                </button>
              ))}
            </div>
          </div>

          {/* 3. AUDIT IA EN DIRECT */}
          <div className="dwt-ai-live-audit-card">
            <div className="dwt-ai-audit-header">
              <ShieldCheck size={16} color="#00e5ff" />
              <span>AUDIT DE CONFORMITÉ EN DIRECT</span>
            </div>

            <div className="dwt-ai-audit-stats">
              <div className="dwt-ai-audit-stat">
                <span className="dwt-stat-lbl">Harmonie :</span>
                <span className="dwt-stat-val">{aiAudit?.score || 95}%</span>
              </div>
              <div className="dwt-ai-audit-stat">
                <span className="dwt-stat-lbl">Lisibilité VCT :</span>
                <span className="dwt-stat-val cyan">{aiAudit?.readabilityScore || 90}%</span>
              </div>
            </div>

            {aiAudit?.tips && aiAudit.tips.length > 0 && (
              <div className="dwt-ai-audit-tip">
                {aiAudit.tips[0].text}
              </div>
            )}
          </div>

          {/* 4. RÉGLAGES INTELLIGENTS */}
          <div style={{ marginTop: '14px' }}>
            <label className="dwt-form-label">RÉGLAGES INTELLIGENTS EN 1 CLIC :</label>
            <div className="dwt-ai-tuning-grid">
              <button
                type="button"
                className="dwt-ai-tune-btn"
                onClick={handleAutoHarmonize}
                title="Harmoniser les couleurs du vêtement"
              >
                <Palette size={14} color="#e10613" />
                <span>Harmoniser Couleurs</span>
              </button>

              <button
                type="button"
                className="dwt-ai-tune-btn"
                onClick={handleAutoAlign}
                title="Recadrer et centrer les logos aux ratios d'or"
              >
                <Sliders size={14} color="#00e5ff" />
                <span>Alignement Optique</span>
              </button>

              <button
                type="button"
                className="dwt-ai-tune-btn full"
                onClick={handleGenerateIdentity}
                title="Générer un Gamertag et Numéro compétitif aléatoire"
              >
                <UserCheck size={14} color="#ffb703" />
                <span>Générer Identité Joueur IA</span>
              </button>
            </div>
          </div>

          {/* 5. AFFICHER LE RÉSULTAT FINAL IA */}
          <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <button
              type="button"
              className="dwt-ai-final-result-btn"
              onClick={() => {
                if (onOpenFinalResult) onOpenFinalResult();
              }}
            >
              <Award size={18} />
              <div className="dwt-btn-texts">
                <strong>AFFICHER LE RÉSULTAT FINAL IA</strong>
                <span>Fiche technique certifiée & multi-vues 4K</span>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolDrawer;
