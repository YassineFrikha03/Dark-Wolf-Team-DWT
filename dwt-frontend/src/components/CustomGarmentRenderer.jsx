import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Compass, ShieldCheck } from 'lucide-react';
import WolfLogo from './WolfLogo';

/**
 * CustomGarmentRenderer
 * Studio 3D Photoréaliste de Conception Vestimentaire Esport
 * Spécifiquement conçu pour l'Équipe Esport Professionnelle Dark Wolf Team :
 * - Impression par sublimation intégrée dans la fibre du tissu (Mesh Texture & Folds)
 * - Support complet d'importation de designs / logos personnalisés par le client
 * - Badges esport compétition (Sponsors Pro Circuit, Hologramme d'authenticité DWT)
 * - Flocage dos joueur officiel (Gamertag, Rôle en équipe, Numéro de compétition)
 * - Rotation 360° fluide par glisser-déposer sans fond (Alpha cutout)
 */
const CustomGarmentRenderer = ({
  category = 'maillots',
  modelId = 'model_1',
  color = { hex: '#0a0b0e', secondaryHex: '#ffffff', name: 'Onyx Black' },
  logoPosition = 'center', // 'center' | 'heart' | 'collar' | 'large'
  gamertag = '',
  playerNumber = '07',
  playerRole = 'PRO DUELIST',
  customUploadedDesign = null,
  customDesignScale = 1.0,
  rotationAngle = 0,
  onAngleChange = null,
  isAutoRotate = false,
  zoomLevel = 1.0,
}) => {
  const [internalAngle, setInternalAngle] = useState(rotationAngle || 0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartAngle, setDragStartAngle] = useState(0);
  const animFrameRef = useRef(null);
  const stageRef = useRef(null);

  // Synchronisation avec l'angle externe
  useEffect(() => {
    if (rotationAngle !== undefined && !isDragging) {
      setInternalAngle(rotationAngle);
    }
  }, [rotationAngle, isDragging]);

  // Mode Auto-Rotate Turntable 360° continu
  useEffect(() => {
    if (!isAutoRotate) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    let lastTime = performance.now();
    const animate = (currentTime) => {
      const delta = currentTime - lastTime;
      lastTime = currentTime;
      setInternalAngle((prev) => {
        const next = (prev + (delta * 0.045)) % 360;
        if (onAngleChange) onAngleChange(next);
        return next;
      });
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isAutoRotate, onAngleChange]);

  // Gestion du glisser-déposer 360°
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragStartAngle(internalAngle);
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartX;
    let newAngle = (dragStartAngle + deltaX * 0.65) % 360;
    if (newAngle < 0) newAngle += 360;
    setInternalAngle(newAngle);
    if (onAngleChange) onAngleChange(newAngle);
  }, [isDragging, dragStartX, dragStartAngle, onAngleChange]);

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove]);

  // Gestion tactile mobile (Touch)
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStartX(e.touches[0].clientX);
      setDragStartAngle(internalAngle);
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - dragStartX;
    let newAngle = (dragStartAngle + deltaX * 0.65) % 360;
    if (newAngle < 0) newAngle += 360;
    setInternalAngle(newAngle);
    if (onAngleChange) onAngleChange(newAngle);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Normalisation de l'angle [0, 360[
  const angle = ((internalAngle % 360) + 360) % 360;

  // Détermination de la face active et de la perspective 3D
  let currentImage = '';
  let isBack = false;
  let isProfile = false;
  let isMirrored = false;
  let subAngle = 0;

  if (category === 'maillots') {
    if (angle >= 315 || angle < 45) {
      currentImage = '/custom-gear/jersey_front_transparent.png';
      subAngle = angle >= 315 ? angle - 360 : angle;
    } else if (angle >= 45 && angle < 135) {
      currentImage = '/custom-gear/jersey_side_transparent.png';
      isProfile = true;
      subAngle = angle - 90;
    } else if (angle >= 135 && angle < 225) {
      currentImage = '/custom-gear/jersey_back_transparent.png';
      isBack = true;
      subAngle = angle - 180;
    } else {
      currentImage = '/custom-gear/jersey_side_transparent.png';
      isProfile = true;
      isMirrored = true;
      subAngle = angle - 270;
    }
  } else if (category === 'hoodies') {
    if (angle >= 90 && angle < 270) {
      currentImage = '/custom-gear/hoodie_back_transparent.png';
      isBack = true;
      subAngle = angle - 180;
    } else {
      currentImage = '/custom-gear/hoodie_front_transparent.png';
      subAngle = angle >= 270 ? angle - 360 : angle;
    }
  } else if (category === 't-shirt') {
    if (angle >= 90 && angle < 270) {
      currentImage = '/custom-gear/tshirt_back_transparent.png';
      isBack = true;
      subAngle = angle - 180;
    } else {
      currentImage = '/custom-gear/tshirt_front_transparent.png';
      subAngle = angle >= 270 ? angle - 360 : angle;
    }
  } else if (category === 'casquettes') {
    currentImage = '/custom-gear/cap_front_transparent.png';
    subAngle = angle >= 180 ? (angle - 360) * 0.5 : angle * 0.5;
  } else {
    // Tote bags
    currentImage = '/custom-gear/bag_front_transparent.png';
    subAngle = angle >= 180 ? (angle - 360) * 0.4 : angle * 0.4;
  }

  // Couleurs dynamiques
  const baseHex = color?.hex || '#0a0b0e';
  const colorName = (color?.name || '').toLowerCase();
  const isRed = baseHex.toLowerCase() === '#990000' || colorName.includes('red');
  const isCyan = baseHex.toLowerCase() === '#0c2233' || colorName.includes('cyan');
  const isWhite = baseHex.toLowerCase() === '#f8fafc' || colorName.includes('white');
  const isCarbon = colorName.includes('carbon') || colorName.includes('slate');

  // Visibilité des éléments selon l'angle de rotation
  const frontVisibility = Math.max(0, Math.cos((angle * Math.PI) / 180));
  const backVisibility = Math.max(0, -Math.cos((angle * Math.PI) / 180));

  // Coordonnées du logo selon la position choisie
  const getLogoStyle = () => {
    switch (logoPosition) {
      case 'heart':
        return { top: '34%', left: '59%', transform: 'translate(-50%, -50%) scale(0.72)' };
      case 'collar':
        return { top: '22%', left: '50%', transform: 'translate(-50%, -50%) scale(0.62)' };
      case 'large':
        return { top: '38%', left: '50%', transform: 'translate(-50%, -50%) scale(1.3)' };
      case 'center':
      default:
        return { top: '36%', left: '50%', transform: 'translate(-50%, -50%) scale(0.92)' };
    }
  };

  return (
    <div
      ref={stageRef}
      className={`cgr-studio-stage ${isDragging ? 'dragging' : ''}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 1. ÉCLAIRAGE DE STUDIO ESPORT (Spotlight zénithal avec faisceaux cyber) */}
      <div className="cgr-studio-spotlight" />

      {/* 2. CONTENEUR 3D ROTATIF DU MAILLOT (100% SANS FOND) */}
      <div
        className="cgr-garment-3d-node"
        style={{
          transform: `perspective(1100px) rotateY(${subAngle * 0.85}deg) scale(${zoomLevel}) ${isMirrored ? 'scaleX(-1)' : ''}`,
        }}
      >
        {/* Rendu 3D du vêtement (Détourage transparent haute résolution) */}
        <img
          src={currentImage}
          alt={`Studio Esport ${category} DWT`}
          className="cgr-garment-alpha-cutout"
          draggable="false"
        />

        {/* Teinte dynamique sans altérer le fond */}
        {isRed && <div className="cgr-garment-tint-overlay tint-red" />}
        {isCyan && <div className="cgr-garment-tint-overlay tint-cyan" />}
        {isWhite && <div className="cgr-garment-tint-overlay tint-white" />}
        {isCarbon && <div className="cgr-garment-tint-overlay tint-carbon" />}

        {/* BANDE DES SPONSORS ESPORT SUR LE HAUT DU TORSE / COL (VCT Pro Circuit) */}
        {!isBack && !isProfile && category === 'maillots' && (
          <div
            className="cgr-esport-sponsor-collar"
            style={{ opacity: frontVisibility }}
          >
            <div className="cgr-sponsor-strip">
              <span>INTEL</span>
              <span className="cgr-strip-sep">◆</span>
              <span>LOGITECH G</span>
              <span className="cgr-strip-sep">◆</span>
              <span>TWITCH</span>
              <span className="cgr-strip-sep">◆</span>
              <span>MONSTER</span>
            </div>
          </div>
        )}

        {/* LOGO OU DESIGN IMPORTÉ DU CLIENT SUR LA FACE AVANT */}
        {!isBack && !isProfile && (
          <div
            className="cgr-decal-front cgr-sublimated-print"
            style={{
              ...getLogoStyle(),
              opacity: frontVisibility,
              transform: `${getLogoStyle().transform} scaleX(${Math.max(0.2, frontVisibility)}) scale(${customDesignScale})`,
            }}
          >
            {customUploadedDesign ? (
              /* Design ou Logo personnalisé importé par le client */
              <div className="cgr-uploaded-imprint-wrap">
                <img
                  src={customUploadedDesign}
                  alt="Design personnalisé client"
                  className="cgr-client-uploaded-img"
                />
                <div className="cgr-mesh-fabric-sublimation" />
              </div>
            ) : (
              /* Logo officiel Dark Wolf Team avec impression sublimation dans la fibre */
              <div className="cgr-team-crest-wrap">
                <div className="cgr-crest-inner">
                  <WolfLogo size={category === 'casquettes' ? 48 : logoPosition === 'large' ? 66 : 46} />
                  {logoPosition !== 'heart' && logoPosition !== 'collar' && category !== 'casquettes' && (
                    <span className="cgr-decal-brand-text">DARK WOLF TEAM</span>
                  )}
                </div>
                {/* Micro-perforations de tissu Dry-Tech pour effet d'impression dans le vêtement */}
                <div className="cgr-mesh-fabric-sublimation" />
              </div>
            )}
          </div>
        )}

        {/* GAMERTAG JOUEUR & DIVISION SUR LE TORSE (Style esport compétitif) */}
        {!isBack && !isProfile && gamertag.trim() && (
          <div
            className="cgr-decal-front-tag cgr-sublimated-print"
            style={{ opacity: frontVisibility }}
          >
            <span className="cgr-front-gamertag-prefix">// PRO ESPORTS ROSTER</span>
            <span className="cgr-front-gamertag-name">DWT {gamertag.toUpperCase()}</span>
          </div>
        )}

        {/* ÉTIQUETTE HOLOGRAPHIQUE OFFICIELLE ESPORT EN BAS DU MAILLOT */}
        {!isBack && !isProfile && category === 'maillots' && (
          <div
            className="cgr-esport-hologram-tag"
            style={{ opacity: frontVisibility * 0.95 }}
          >
            <ShieldCheck size={11} className="cgr-holo-icon" />
            <div className="cgr-holo-text">
              <span>DWT GENUINE PRO GEAR</span>
              <small>FEDERATION APPROVED 2026</small>
            </div>
          </div>
        )}

        {/* FLOCAGE OFFICIEL COMPÉTITION AU DOS (Gamertag géant, numéro, rôle) */}
        {isBack && (
          <div
            className="cgr-decal-back cgr-sublimated-print"
            style={{
              opacity: backVisibility,
              transform: `translateX(-50%) scaleX(${Math.max(0.2, backVisibility)})`,
            }}
          >
            {/* Gamertag du Joueur Esport */}
            <div className="cgr-back-gamertag-box">
              <span className="cgr-back-gamertag">
                {gamertag.trim() ? gamertag.toUpperCase() : 'GAMERTAG'}
              </span>
              <div className="cgr-back-player-role">
                <span>{playerRole || 'PRO DUELIST'}</span>
              </div>
            </div>

            {/* Numéro Officiel du Joueur */}
            <div className="cgr-back-number-wrap">
              <span className="cgr-back-number">
                {playerNumber || '07'}
              </span>
              <div className="cgr-mesh-fabric-sublimation" />
            </div>

            {/* Signature Club & Slogan Esport */}
            <div className="cgr-back-subteam">
              <WolfLogo size={18} />
              <div className="cgr-subteam-col">
                <span className="cgr-subteam-title">DARK WOLF TEAM</span>
                <span className="cgr-subteam-slogan">ON NE JOUE PAS. ON DOMINE.</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. PODIUM / SOCLE 3D CYBERNÉTIQUE AU SOL (Rotation synchronisée) */}
      <div className="cgr-podium-container">
        {/* Ombre portée réaliste au contact du sol */}
        <div
          className="cgr-floor-shadow"
          style={{
            transform: `scale(${0.9 + Math.abs(Math.sin((angle * Math.PI) / 180)) * 0.15})`,
          }}
        />

        {/* Disque et anneau cybernétique en rotation 3D */}
        <div
          className="cgr-podium-ring"
          style={{
            transform: `rotateX(76deg) rotateZ(${angle}deg)`,
          }}
        >
          <div className="cgr-ring-ticks" />
          <div className="cgr-ring-glow" />
        </div>
      </div>

      {/* 4. GUIDE D'INTERACTION 360° AU SURVOL */}
      <div className="cgr-drag-hint-pill">
        <Compass size={13} className="cgr-compass-icon" />
        <span>GLISSER POUR TOURNER 360° ({Math.round(angle)}°)</span>
        {isAutoRotate && <span className="cgr-auto-tag">AUTO</span>}
      </div>
    </div>
  );
};

export default CustomGarmentRenderer;
