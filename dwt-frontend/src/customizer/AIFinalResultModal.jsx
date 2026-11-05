import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  ShieldCheck,
  Check,
  Download,
  ShoppingBag,
  Sliders,
  RotateCw,
  Award,
  Zap,
  Layers,
  ChevronRight,
  Eye
} from 'lucide-react';
import WolfLogo from '../components/WolfLogo';
import { customizerState } from './state.js';
import { analyzeDesignWithAI } from './aiEngine.js';

export const AIFinalResultModal = ({ isOpen, onClose, sceneRef, state, onAddToCart }) => {
  const [activeAngle, setActiveAngle] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const aiAudit = analyzeDesignWithAI(state);

  // Capture de l'image 3D sous l'angle sélectionné (immédiat et synchronisé)
  const captureAnglePreview = (angleDeg) => {
    setActiveAngle(angleDeg);
    if (!sceneRef?.current) return;

    setIsCapturing(true);
    const rad = (angleDeg * Math.PI) / 180;
    sceneRef.current.targetAngle = rad;
    sceneRef.current.currentAngle = rad;
    sceneRef.current.setAutoRotate(false);

    if (sceneRef.current.currentModelGroup) {
      sceneRef.current.currentModelGroup.rotation.y = rad;
      sceneRef.current.currentModelGroup.updateMatrixWorld(true);
    }
    if (sceneRef.current.renderer && sceneRef.current.scene && sceneRef.current.camera) {
      sceneRef.current.renderer.render(sceneRef.current.scene, sceneRef.current.camera);
    }

    const snap = sceneRef.current.capturePreview();
    if (snap) setPreviewImage(snap);
    setIsCapturing(false);
  };

  useEffect(() => {
    if (isOpen) {
      captureAnglePreview(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownloadCard = () => {
    if (!previewImage) return;
    setIsDownloading(true);

    const link = document.createElement('a');
    link.download = `DARK_WOLF_TEAM_CUSTOM_${aiAudit?.certificationId || 'DESIGN'}.png`;
    link.href = previewImage;
    link.click();

    setTimeout(() => setIsDownloading(false), 800);
  };

  return (
    <div className="dwt-ai-result-overlay">
      <div className="dwt-ai-result-window">
        {/* HEADER DU RÉSULTAT FINAL */}
        <div className="dwt-ai-header">
          <div className="dwt-ai-header-brand">
            <WolfLogo size={32} />
            <div>
              <div className="dwt-ai-tag">
                <Sparkles size={12} color="#e10613" />
                <span>RÉSULTAT FINAL IA CERTIFIÉ</span>
              </div>
              <h2 className="dwt-ai-title">FICHE OFFICIELLE DARK WOLF TEAM</h2>
            </div>
          </div>

          <div className="dwt-ai-certif-pill">
            <ShieldCheck size={16} color="#00e5ff" />
            <span>CERTIFICAT #{aiAudit?.certificationId}</span>
          </div>

          <button
            type="button"
            className="dwt-ai-close-btn"
            onClick={onClose}
            title="Fermer (Échap)"
          >
            <X size={20} />
          </button>
        </div>

        {/* CONTENU PRINCIPAL EN 2 COLONNES */}
        <div className="dwt-ai-body">
          {/* COLONNE GAUCHE : RENDU MULTI-VUES */}
          <div className="dwt-ai-preview-column">
            <div className="dwt-ai-canvas-frame">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Rendu Final 3D"
                  className={`dwt-ai-render-img ${isCapturing ? 'fading' : ''}`}
                />
              ) : (
                <div className="dwt-ai-loading-render">
                  <RotateCw size={28} className="dwt-spin" />
                  <span>Génération du Rendu HD...</span>
                </div>
              )}

              {/* Badge holographique */}
              <div className="dwt-ai-holo-badge">
                <Award size={14} color="#ffb703" />
                <span>QUALITÉ ESPORT 4K SUB-D</span>
              </div>
            </div>

            {/* SÉLECTEUR D'ANGLES D'INSPECTION DU RÉSULTAT FINAL */}
            <div className="dwt-ai-angle-selector">
              <span className="dwt-ai-angle-label">ANGLE DE VUE :</span>
              <div className="dwt-ai-angle-pills">
                {[
                  { label: 'Face (0°)', deg: 0 },
                  { label: '3/4 Dyn (45°)', deg: 45 },
                  { label: 'Dos (180°)', deg: 180 },
                  { label: 'Profil G (270°)', deg: 270 },
                ].map((item) => (
                  <button
                    key={item.deg}
                    type="button"
                    className={`dwt-ai-angle-pill ${activeAngle === item.deg ? 'active' : ''}`}
                    onClick={() => captureAnglePreview(item.deg)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* COLONNE DROITE : FICHE TECHNIQUE ET AUDIT IA */}
          <div className="dwt-ai-details-column">
            {/* SCORE & ANALYSE DE L'IA */}
            <div className="dwt-ai-score-card">
              <div className="dwt-ai-score-header">
                <div>
                  <div className="dwt-ai-score-title">ÉVALUATION IA DARK LAB</div>
                  <div className="dwt-ai-score-sub">{aiAudit?.complianceLevel}</div>
                </div>
                <div className="dwt-ai-score-val">
                  {aiAudit?.score}
                  <span className="dwt-ai-score-max">/100</span>
                </div>
              </div>

              <div className="dwt-ai-meters-grid">
                <div className="dwt-ai-meter-item">
                  <div className="dwt-ai-meter-top">
                    <span>Harmonie des Couleurs</span>
                    <strong>{aiAudit?.score}%</strong>
                  </div>
                  <div className="dwt-ai-meter-bar">
                    <div className="dwt-ai-meter-fill" style={{ width: `${aiAudit?.score}%` }} />
                  </div>
                </div>

                <div className="dwt-ai-meter-item">
                  <div className="dwt-ai-meter-top">
                    <span>Lisibilité Tournoi</span>
                    <strong>{aiAudit?.readabilityScore}%</strong>
                  </div>
                  <div className="dwt-ai-meter-bar">
                    <div
                      className="dwt-ai-meter-fill cyan"
                      style={{ width: `${aiAudit?.readabilityScore}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* CONSEIL IA PERSONNALISÉ */}
              {aiAudit?.tips && aiAudit.tips.length > 0 && (
                <div className="dwt-ai-tips-box">
                  {aiAudit.tips.slice(0, 2).map((t, idx) => (
                    <div key={idx} className={`dwt-ai-tip-item ${t.type}`}>
                      <span className="dwt-ai-tip-dot" />
                      <span>{t.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* FICHE TECHNIQUE DU VÊTEMENT */}
            <div className="dwt-ai-tech-card">
              <div className="dwt-ai-tech-title">// SPÉCIFICATIONS TECHNIQUES DE FABRICATION</div>
              
              <div className="dwt-ai-specs-grid">
                <div className="dwt-ai-spec-row">
                  <span className="dwt-ai-spec-k">Modèle :</span>
                  <span className="dwt-ai-spec-v">
                    {state.category === 'hoodies' ? 'Hoodie Techwear Pro' : 'T-Shirt Athlétique Pro DWT'}
                  </span>
                </div>

                <div className="dwt-ai-spec-row">
                  <span className="dwt-ai-spec-k">Finition Tissu :</span>
                  <span className="dwt-ai-spec-v">
                    {state.finish === 'mesh'
                      ? 'Dry-Tech Micro-Mesh (140 g/m² - Respirant)'
                      : state.finish === 'satine'
                      ? 'Satiné Élite (160 g/m²)'
                      : 'Coton Peigné Mat (180 g/m²)'}
                  </span>
                </div>

                <div className="dwt-ai-spec-row">
                  <span className="dwt-ai-spec-k">Procédé d'impression :</span>
                  <span className="dwt-ai-spec-v">Sublimation thermique HD 300 DPI (Sans décoloration)</span>
                </div>

                <div className="dwt-ai-spec-row">
                  <span className="dwt-ai-spec-k">Flocage Joueur :</span>
                  <span className="dwt-ai-spec-v highlight">
                    {state.playerFlockingEnabled
                      ? `${state.gamertag || 'JOUEUR'} #${state.playerNumber || '00'} (${state.playerRole || 'PRO'})`
                      : 'Non personnalisé (Édition vierge)'}
                  </span>
                </div>

                <div className="dwt-ai-spec-row">
                  <span className="dwt-ai-spec-k">Éléments Personnalisés :</span>
                  <span className="dwt-ai-spec-v">
                    {state.layers?.length || 0} calque(s) configuré(s)
                  </span>
                </div>

                <div className="dwt-ai-spec-row">
                  <span className="dwt-ai-spec-k">Taille & Quantité :</span>
                  <span className="dwt-ai-spec-v">
                    Taille {state.size || 'L'} · {state.quantity || 1} unité(s)
                  </span>
                </div>
              </div>
            </div>

            {/* PRIX ET ACTIONS */}
            <div className="dwt-ai-actions-wrap">
              <div className="dwt-ai-price-total">
                <span className="dwt-ai-price-sub">PRIX TOTAL HOMOLOGUÉ :</span>
                <span className="dwt-ai-price-num">
                  {customizerState.formatPrice(customizerState.calculateTotalPrice())}
                </span>
              </div>

              <div className="dwt-ai-btns-row">
                <button
                  type="button"
                  className="dwt-ai-action-btn secondary"
                  onClick={handleDownloadCard}
                  title="Télécharger la fiche HD"
                >
                  <Download size={16} />
                  <span>{isDownloading ? 'Téléchargement...' : 'Fiche HD'}</span>
                </button>

                <button
                  type="button"
                  className="dwt-ai-action-btn secondary"
                  onClick={onClose}
                  title="Retourner aux réglages"
                >
                  <Sliders size={16} />
                  <span>Modifier</span>
                </button>

                <button
                  type="button"
                  className="dwt-ai-action-btn primary"
                  onClick={() => {
                    onClose();
                    if (onAddToCart) onAddToCart();
                  }}
                  title="Commander maintenant"
                >
                  <ShoppingBag size={16} />
                  <span>COMMANDER CE DESIGN</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIFinalResultModal;
