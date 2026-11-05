import React, { useRef, useState, useCallback } from 'react';
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  ShoppingBag,
  Sparkles,
  Check,
  Compass,
  Maximize2,
  Download,
  Ruler,
  X,
  ChevronRight
} from 'lucide-react';
import { customizerState, BRAND_COLORS, SIZE_CHART, isColorDark } from './state.js';
import { useCart } from '../context/CartContext';

const CAMERA_PRESETS = [
  { id: 'front', label: 'Face', angle: 0 },
  { id: 'three_quarter', label: '3/4', angle: 45 },
  { id: 'back', label: 'Dos', angle: 180 },
  { id: 'left', label: 'Profil G', angle: 270 },
  { id: 'right', label: 'Profil D', angle: 90 },
  { id: 'detail', label: 'Détail', angle: 0, isDetail: true },
];

export const Viewport3D = ({
  sceneRef,
  state,
  debugModelInfo,
  unavailableNotice,
  onOpenCart,
  onOpenFinalResult,
}) => {
  const { addToCart } = useCart();
  const canvasContainerRef = useRef(null);
  const [isAddedToast, setIsAddedToast] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const isDebugMode = typeof window !== 'undefined' && window.location.search.includes('debug=1');

  // Définir un angle précis
  const handleSetAngle = useCallback((preset) => {
    if (sceneRef?.current) {
      if (preset.isDetail) {
        sceneRef.current.zoomIn();
      } else {
        sceneRef.current.setTargetAngleDegrees(preset.angle);
      }
      sceneRef.current.setAutoRotate(false);
      customizerState.setState({ isAutoRotate: false, rotationAngle: preset.angle });
    }
  }, [sceneRef]);

  // Télécharger la maquette HD
  const handleDownloadMockup = () => {
    if (!sceneRef?.current) return;
    setIsDownloading(true);
    const dataUrl = sceneRef.current.capturePreview();
    if (!dataUrl) {
      setIsDownloading(false);
      return;
    }
    const link = document.createElement('a');
    link.download = `DWT_${(state.category || 'MAILLOT').toUpperCase()}_DESIGN_${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
    setTimeout(() => setIsDownloading(false), 800);
  };

  // Ajouter au panier
  const handleAddToCart = () => {
    const previewPng = sceneRef?.current?.capturePreview() || null;
    const unitPrice = parseFloat(customizerState.calculatePrice());
    const qty = state.teamMode ? (state.teamRoster?.length || 1) : (state.quantity || 1);

    const productName = state.category === 'hoodies'
      ? 'Hoodie Techwear Pro Dark Wolf'
      : state.category === 'maillots'
      ? 'Maillot Esport Pro 2026 Dark Wolf'
      : 'T-Shirt Athlétique Dark Wolf';

    const cartItem = {
      _id: `custom_${Date.now()}`,
      name: `${productName} Custom`,
      price: unitPrice,
      size: state.size || 'L',
      quantity: qty,
      category: 'custom',
      image: previewPng || '/logo-dwt.png',
      images: previewPng ? [previewPng] : ['/logo-dwt.png'],
      customConfig: {
        category: state.category,
        gamertag: state.gamertag,
        playerNumber: state.playerNumber,
        playerRole: state.playerRole,
        collarStyle: state.collarStyle,
        jerseyFit: state.jerseyFit,
        frontNumberEnabled: state.frontNumberEnabled,
        teamMode: state.teamMode,
        teamRoster: state.teamRoster,
        finish: state.finish,
        colors: state.colors,
        layersCount: state.layers?.length || 0,
      },
    };

    addToCart(cartItem, state.size || 'L', qty);
    setIsAddedToast(true);
    setTimeout(() => {
      setIsAddedToast(false);
      if (onOpenCart) onOpenCart();
    }, 1200);
  };

  return (
    <div className="dwt-viewport3d-column">
      {/* 1. EN-TÊTE DU PANNEAU 3D */}
      <div className="dwt-viewport-header">
        <div className="dwt-viewport-badge">
          <Sparkles size={13} color="#e10613" />
          <span>RENDU 3D TEMPS RÉEL</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Bouton Téléchargement Maquette HD */}
          <button
            type="button"
            className="dwt-viewport-mockup-btn"
            onClick={handleDownloadMockup}
            title="Télécharger la maquette actuelle en PNG HD"
            disabled={isDownloading}
          >
            <Download size={13} color="#00e5ff" />
            <span>{isDownloading ? 'EXPORT...' : 'MAQUETTE HD'}</span>
          </button>

          {onOpenFinalResult && (
            <button
              type="button"
              className="dwt-viewport-ai-link"
              onClick={onOpenFinalResult}
              title="Afficher la fiche et le résultat final IA"
            >
              <Sparkles size={12} color="#00e5ff" />
              <span>Fiche IA</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. ZONE CANVAS WEBGL AVEC VIGNETTES D'ANGLES CAMÉRA */}
      <div className="dwt-viewport-canvas-stage">
        <div ref={canvasContainerRef} id="dwt-webgl-container" className="dwt-webgl-wrapper" />

        {/* Message si modèle indisponible */}
        {unavailableNotice && (
          <div className="dwt-unavailable-overlay">
            <Compass size={36} color="#e10613" />
            <div className="dwt-unavailable-title">{unavailableNotice}</div>
            <div className="dwt-unavailable-desc">
              Ce vêtement sera prochainement disponible en visualisation 3D interactive.
            </div>
          </div>
        )}

        {/* HUD DE DIAGNOSTIC (?debug=1) */}
        {isDebugMode && debugModelInfo && (
          <div className="dwt-debug-hud-overlay">
            <div className="dwt-debug-hud-title">// DIAGNOSTIC 3D ACTIF (?debug=1)</div>
            <div>Modèle : {debugModelInfo.file}</div>
            <div>Triangles : {debugModelInfo.triangles}</div>
            <div>BBox : {debugModelInfo.bbox}</div>
            <div>Meshes : {debugModelInfo.meshes}</div>
            <div style={{ color: '#00e5ff' }}>Texture UV : 4096×4096 OK</div>
          </div>
        )}

        {/* Bouton inspect / zoom flottant en haut à droite */}
        <div className="dwt-viewport-float-controls">
          <button
            type="button"
            className="dwt-float-btn"
            onClick={() => sceneRef?.current?.zoomIn()}
            title="Inspecter / Zoomer"
          >
            <ZoomIn size={15} />
          </button>

          <button
            type="button"
            className="dwt-float-btn"
            onClick={() => sceneRef?.current?.zoomOut()}
            title="Dézoomer"
          >
            <ZoomOut size={15} />
          </button>

          <button
            type="button"
            className={`dwt-float-btn ${state.isAutoRotate ? 'active' : ''}`}
            onClick={() => {
              const newAuto = !state.isAutoRotate;
              customizerState.setState({ isAutoRotate: newAuto });
              sceneRef?.current?.setAutoRotate(newAuto);
            }}
            title="Rotation automatique 360°"
          >
            <RotateCcw size={14} />
            <span className="dwt-btn-sub">360°</span>
          </button>

          <button
            type="button"
            className="dwt-float-btn"
            onClick={() => sceneRef?.current?.resetView()}
            title="Réinitialiser vue"
          >
            <Compass size={14} />
          </button>
        </div>

        {/* Colonne verticale des angles caméras à droite du 3D */}
        <div
          style={{
            position: 'absolute',
            top: '50px',
            right: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            zIndex: 10,
          }}
        >
          {CAMERA_PRESETS.map((preset) => {
            const isActive = !preset.isDetail && Math.round(state.rotationAngle || 0) === preset.angle;
            return (
              <button
                key={preset.id}
                type="button"
                className={`dwt-view-pill ${isActive ? 'active' : ''}`}
                style={{ padding: '6px 8px', fontSize: '9px', textAlign: 'center', minWidth: '44px' }}
                onClick={() => handleSetAngle(preset)}
                title={`Vue ${preset.label}`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* Slider 0°–360° synchronisé */}
        <div className="dwt-rotation-slider-bar">
          <span className="dwt-slider-label">0°</span>
          <input
            type="range"
            min="0"
            max="360"
            value={Math.round(state.rotationAngle || 0)}
            onChange={(e) => {
              const deg = Number(e.target.value);
              if (sceneRef?.current) {
                sceneRef.current.setTargetAngleDegrees(deg);
                sceneRef.current.setAutoRotate(false);
              }
              customizerState.setState({ isAutoRotate: false, rotationAngle: deg });
            }}
            className="dwt-rotation-range"
          />
          <span className="dwt-slider-label">360°</span>
          <span className="dwt-slider-deg-badge">{Math.round(state.rotationAngle || 0)}°</span>
        </div>
      </div>

      {/* 3. SÉLECTEUR RAPIDE DE COULEUR & PIED STICKY */}
      <div className="dwt-viewport-sticky-footer">
        {/* Échantillons de couleur sous le 3D */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '4px' }}>
          <span className="dwt-size-title">COULEUR :</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            {BRAND_COLORS.slice(0, 5).map((col) => {
              const currentHex = state.colors?.body || '#0a0b0e';
              const isSelected = currentHex.toLowerCase() === col.hex.toLowerCase();
              return (
                <button
                  key={col.id}
                  type="button"
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '4px',
                    backgroundColor: col.hex,
                    border: isSelected ? '2px solid #ffffff' : '1px solid rgba(255,255,255,0.2)',
                    boxShadow: isSelected ? '0 0 8px rgba(255,255,255,0.5)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onClick={() => {
                    const isDark = isColorDark(col.hex);
                    const updates = {
                      colors: { ...(state.colors || {}), body: col.hex },
                      color: col,
                    };
                    if (isDark) {
                      if (isColorDark(state.playerTextColor)) updates.playerTextColor = '#ffffff';
                      if (isColorDark(state.playerNumberColor)) updates.playerNumberColor = '#ffffff';
                    } else {
                      if (!isColorDark(state.playerTextColor)) updates.playerTextColor = '#0a0b0e';
                    }
                    customizerState.setState(updates);
                  }}
                  title={col.name}
                />
              );
            })}
          </div>
        </div>

        {/* Sélecteur de taille & Lien Guide des Tailles */}
        <div className="dwt-size-selector-row">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '4px' }}>
            <span className="dwt-size-title">TAILLE :</span>
            <button
              type="button"
              className="dwt-size-guide-link-btn"
              onClick={() => setIsSizeGuideOpen(true)}
              title="Consulter les mensurations en cm"
            >
              <Ruler size={12} color="#00e5ff" />
              <span>Guide des Tailles</span>
            </button>
          </div>

          <div className="dwt-size-pills">
            {['S', 'M', 'L', 'XL', '2XL', '3XL'].map((s) => (
              <button
                key={s}
                type="button"
                className={`dwt-size-pill ${state.size === s ? 'active' : ''}`}
                onClick={() => customizerState.setState({ size: s })}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Quantité & Prix détaillé */}
        <div className="dwt-price-row">
          <div className="dwt-price-breakdown">
            <span className="dwt-price-label">TOTAL ESTIMÉ :</span>
            <div className="dwt-price-val">{customizerState.formatPrice(customizerState.calculateTotalPrice())}</div>
            <div className="dwt-price-subtext">
              {state.teamMode
                ? `${state.teamRoster?.length || 1} tenues d'équipe (-15% groupe)`
                : `1 pièce · Finition ${state.finish.toUpperCase()}`}
            </div>
          </div>

          {!state.teamMode && (
            <div className="dwt-qty-selector">
              <button
                type="button"
                className="dwt-qty-btn"
                onClick={() => customizerState.setState({ quantity: Math.max(1, (state.quantity || 1) - 1) })}
              >
                -
              </button>
              <span className="dwt-qty-num">{state.quantity || 1}</span>
              <button
                type="button"
                className="dwt-qty-btn"
                onClick={() => customizerState.setState({ quantity: (state.quantity || 1) + 1 })}
              >
                +
              </button>
            </div>
          )}
        </div>

        {/* Bouton Principal Commander / Enregistrer */}
        <div className="dwt-cta-buttons-wrap">
          {onOpenFinalResult && (
            <button
              type="button"
              className="dwt-showcase-btn"
              onClick={onOpenFinalResult}
              title="Aperçu du résultat final IA"
            >
              <Sparkles size={14} color="#00e5ff" />
              <span>Aperçu Fiche IA</span>
            </button>
          )}
          <button
            type="button"
            className={`dwt-add-cart-btn ${isAddedToast ? 'success' : ''}`}
            onClick={handleAddToCart}
          >
            {isAddedToast ? (
              <>
                <Check size={16} />
                <span>AJOUTÉ AU PANIER !</span>
              </>
            ) : (
              <>
                <ShoppingBag size={16} />
                <span>COMMANDER MON ÉQUIPEMENT</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 4. MODALE INTERACTIVE DU GUIDE DES TAILLES */}
      {isSizeGuideOpen && (
        <div className="dwt-size-guide-modal-overlay" onClick={() => setIsSizeGuideOpen(false)}>
          <div className="dwt-size-guide-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="dwt-size-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Ruler size={18} color="#e10613" />
                <h3 className="dwt-size-modal-title">GUIDE DES TAILLES OFFICIEL DWT</h3>
              </div>
              <button
                type="button"
                className="dwt-modal-close-btn"
                onClick={() => setIsSizeGuideOpen(false)}
              >
                <X size={16} />
              </button>
            </div>

            <p className="dwt-size-modal-desc">
              Toutes les dimensions sont calibrées pour la compétition esport VCT. Tissus respirants Dry-Tech stretch.
            </p>

            <table className="dwt-size-table">
              <thead>
                <tr>
                  <th>Taille</th>
                  <th>Tour de Poitrine</th>
                  <th>Longueur Dos</th>
                  <th>Carrure Épaules</th>
                  <th>Coupe Recommandée</th>
                </tr>
              </thead>
              <tbody>
                {SIZE_CHART.map((row) => (
                  <tr key={row.size} className={state.size === row.size ? 'selected-row' : ''}>
                    <td className="size-badge-cell">
                      <strong>{row.size}</strong>
                    </td>
                    <td>{row.chest}</td>
                    <td>{row.length}</td>
                    <td>{row.shoulder}</td>
                    <td>
                      <span className="fit-badge">{row.fit}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="dwt-size-tip-box">
              <strong>Conseil Compétition :</strong> Pour un porté ajusté pro athlétique, prends ta taille habituelle. Pour un style streetwear plus ample ou avec un maillot de corps thermique, prends une taille au-dessus.
            </div>

            <button
              type="button"
              className="dwt-size-confirm-btn"
              onClick={() => setIsSizeGuideOpen(false)}
            >
              Compris, continuer ma création
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Viewport3D;
