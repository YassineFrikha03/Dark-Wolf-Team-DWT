import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  AlignCenter,
  Maximize2,
  Minimize2,
  Copy,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Trash2,
  Undo2,
  Redo2,
  RotateCcw,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Layers,
  ChevronDown,
  Grid,
  Sparkles,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Move,
  Lock,
  Eye,
  Check
} from 'lucide-react';
import {
  customizerState,
  QUICK_POSITION_PRESETS,
  ANCHOR_POINTS,
  isColorDark,
  getSafeContrastColor
} from './state.js';

/**
 * Silhouettes vectorielles des pièces textiles esport
 */
const PATTERN_SHAPES = {
  front: {
    name: 'Buste Devant',
    dimensions: '28 × 35 cm',
    path: 'M 140,50 C 180,95 260,95 300,50 L 375,90 C 345,150 350,210 375,230 L 355,480 C 355,485 350,490 345,490 L 95,490 C 90,490 85,485 85,480 L 65,230 C 90,210 95,150 65,90 Z',
    safeBox: { x: 130, y: 130, width: 180, height: 260 },
  },
  back: {
    name: 'Buste Dos',
    dimensions: '30 × 40 cm',
    path: 'M 155,55 C 190,70 250,70 285,55 L 375,90 C 345,150 350,210 375,230 L 355,480 C 355,485 350,490 345,490 L 95,490 C 90,490 85,485 85,480 L 65,230 C 90,210 95,150 65,90 Z',
    safeBox: { x: 125, y: 110, width: 190, height: 290 },
  },
  sleeve_left: {
    name: 'Manche Gauche',
    dimensions: '12 × 15 cm',
    path: 'M 130,90 C 180,60 260,60 310,90 L 290,420 C 290,425 285,430 280,430 L 160,430 C 155,430 150,425 150,420 Z',
    safeBox: { x: 165, y: 140, width: 110, height: 180 },
  },
  sleeve_right: {
    name: 'Manche Droite',
    dimensions: '12 × 15 cm',
    path: 'M 130,90 C 180,60 260,60 310,90 L 290,420 C 290,425 285,430 280,430 L 160,430 C 155,430 150,425 150,420 Z',
    safeBox: { x: 165, y: 140, width: 110, height: 180 },
  },
  hood: {
    name: 'Capuche Profil',
    dimensions: '20 × 24 cm',
    path: 'M 120,440 C 110,320 130,120 250,80 C 330,50 360,140 350,240 C 340,340 300,430 220,440 Z',
    safeBox: { x: 160, y: 130, width: 140, height: 210 },
  },
};

const ALL_PIECES = [
  { id: 'front', label: 'Devant', defaultAngle: 0 },
  { id: 'back', label: 'Dos', defaultAngle: 180 },
  { id: 'sleeve_left', label: 'Manche G', defaultAngle: 270 },
  { id: 'sleeve_right', label: 'Manche D', defaultAngle: 90 },
  { id: 'hood', label: 'Capuche', defaultAngle: 225 },
];

export const PatternCanvas2D = ({ state }) => {
  const containerRef = useRef(null);
  const [zoom, setZoom] = useState(1.0);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(null);
  const [isRotating, setIsRotating] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [layerStartPos, setLayerStartPos] = useState({ x: 0, y: 0, scale: 1, rotation: 0 });

  // Guides d'aimantation au centre (Magnetic Snapping)
  const [snapGuides, setSnapGuides] = useState({ x: false, y: false });

  // Menus déroulants de la barre d'outils
  const [layerMenuOpen, setLayerMenuOpen] = useState(false);
  const [rotateMenuOpen, setRotateMenuOpen] = useState(false);
  const [patternMenuOpen, setPatternMenuOpen] = useState(false);
  const [copyMenuOpen, setCopyMenuOpen] = useState(false);
  const [anchorMenuOpen, setAnchorMenuOpen] = useState(false);
  const [showNudgePad, setShowNudgePad] = useState(false);

  // Filtrage des pièces selon le produit (ex: maillot = sans capuche)
  const isHoodie = state.category === 'hoodies';
  const availablePieces = isHoodie
    ? ALL_PIECES
    : ALL_PIECES.filter((p) => p.id !== 'hood');

  const activeView = state.activePatternView || 'front';
  const patternInfo = PATTERN_SHAPES[activeView] || PATTERN_SHAPES.front;

  // Auto-correction si la face active n'existe plus sur le produit
  useEffect(() => {
    if (!isHoodie && activeView === 'hood') {
      customizerState.setState({ activePatternView: 'front' });
    }
  }, [isHoodie, activeView]);

  const currentViewLayers = state.layers.filter((l) => l.view === activeView);
  const selectedLayer = currentViewLayers.find((l) => l.id === state.selectedLayerId) || currentViewLayers[0] || null;

  const safeBox = patternInfo.safeBox;
  const safeCenterX = safeBox.x + safeBox.width / 2;
  const safeCenterY = safeBox.y + safeBox.height / 2;

  const bodyColor = state.colors?.body || state.color?.hex || '#0a0b0e';
  const isDark = isColorDark(bodyColor);

  const getLayerCanvasPos = useCallback(
    (layer) => {
      const x = safeCenterX + (layer.x || 0) * safeBox.width;
      const y = safeCenterY + (layer.y || 0) * safeBox.height;
      const w = (layer.width || 200) * (layer.scale || 1.0);
      const h = (layer.height || 200) * (layer.scale || 1.0);
      return { x, y, w, h };
    },
    [safeCenterX, safeCenterY, safeBox]
  );

  // Sélection d'une pièce avec synchronisation caméra 3D automatique
  const handleSelectPiece = (pieceId) => {
    const pieceObj = ALL_PIECES.find((p) => p.id === pieceId);
    const targetAngle = pieceObj ? pieceObj.defaultAngle : 0;

    customizerState.setState({
      activePatternView: pieceId,
      rotationAngle: targetAngle,
      isAutoRotate: false,
    });

    if (window.__DWT_SCENE__) {
      window.__DWT_SCENE__.setTargetAngleDegrees(targetAngle);
      window.__DWT_SCENE__.setAutoRotate(false);
    }
  };

  // Actions de transformation
  const handleCenter = () => {
    if (!selectedLayer || selectedLayer.locked) return;
    customizerState.updateLayer(selectedLayer.id, { x: 0, y: 0 }, true);
  };

  const handleFit = () => {
    if (!selectedLayer || selectedLayer.locked) return;
    const maxDim = Math.min(safeBox.width, safeBox.height) * 0.85;
    const currentDim = Math.max(selectedLayer.width || 200, selectedLayer.height || 200);
    const newScale = maxDim / (currentDim || 1);
    customizerState.updateLayer(selectedLayer.id, { x: 0, y: 0, scale: Math.max(0.2, newScale) }, true);
  };

  const handleFill = () => {
    if (!selectedLayer || selectedLayer.locked) return;
    const maxDim = Math.max(safeBox.width, safeBox.height);
    const currentDim = Math.max(selectedLayer.width || 200, selectedLayer.height || 200);
    const newScale = (maxDim * 1.05) / (currentDim || 1);
    customizerState.updateLayer(selectedLayer.id, { x: 0, y: 0, scale: newScale }, true);
  };

  const handleDuplicate = () => {
    if (!selectedLayer) return;
    customizerState.duplicateLayer(selectedLayer.id);
  };

  const handleDelete = () => {
    if (!selectedLayer || selectedLayer.locked) return;
    customizerState.deleteLayer(selectedLayer.id);
  };

  const handleReset = () => {
    if (!selectedLayer || selectedLayer.locked) return;
    customizerState.updateLayer(selectedLayer.id, {
      x: 0,
      y: 0,
      scale: 1.0,
      rotation: 0,
      flipX: false,
      flipY: false,
    }, true);
  };

  const handleClearAll = () => {
    const remaining = state.layers.filter((l) => l.view !== activeView);
    const updates = { layers: remaining, selectedLayerId: null };
    if (activeView === 'back') {
      updates.playerNumber = '';
      updates.showPlayerNumber = false;
      updates.gamertag = '';
      updates.showGamertag = false;
      updates.playerRole = '';
      updates.showPlayerRole = false;
      updates.playerFlockingEnabled = false;
    }
    customizerState.setState(updates, true);
  };

  const handleCopyToPiece = (targetView) => {
    if (!selectedLayer) return;
    const copyLayer = {
      ...selectedLayer,
      view: targetView,
      name: `${selectedLayer.name} (${targetView})`,
    };
    customizerState.addLayer(copyLayer);
    handleSelectPiece(targetView);
    setCopyMenuOpen(false);
  };

  // Fermer les menus au clic extérieur
  useEffect(() => {
    const closeAll = () => {
      setLayerMenuOpen(false);
      setRotateMenuOpen(false);
      setPatternMenuOpen(false);
      setCopyMenuOpen(false);
      setAnchorMenuOpen(false);
    };
    window.addEventListener('click', closeAll);
    return () => window.removeEventListener('click', closeAll);
  }, []);

  // Déplacement ultra-rapide au clavier (Touches fléchées ↑ ↓ ← →)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedLayer || selectedLayer.locked) return;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        // Empêcher le défilement accidentel de la page
        e.preventDefault();
        const step = e.shiftKey ? 0.06 : 0.015;
        let dx = 0;
        let dy = 0;
        if (e.key === 'ArrowUp') dy = -step;
        if (e.key === 'ArrowDown') dy = step;
        if (e.key === 'ArrowLeft') dx = -step;
        if (e.key === 'ArrowRight') dx = step;
        customizerState.nudgeLayer(selectedLayer.id, dx, dy);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedLayer]);

  const rAFRef = useRef(null);
  const latestTransformRef = useRef(null);

  // Gestion des événements de drag, scale, rotate
  const handleMouseDownLayer = (e, layer) => {
    e.stopPropagation();
    if (layer.locked) {
      customizerState.setState({ selectedLayerId: layer.id }, false);
      return;
    }
    customizerState.setState({ selectedLayerId: layer.id }, false);
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setLayerStartPos({ x: layer.x || 0, y: layer.y || 0, scale: layer.scale || 1, rotation: layer.rotation || 0 });
    latestTransformRef.current = null;
  };

  const handleMouseDownHandle = (e, handleType) => {
    e.stopPropagation();
    if (!selectedLayer || selectedLayer.locked) return;
    latestTransformRef.current = null;
    if (handleType === 'rot') {
      setIsRotating(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setLayerStartPos({ x: selectedLayer.x || 0, y: selectedLayer.y || 0, scale: selectedLayer.scale || 1, rotation: selectedLayer.rotation || 0 });
    } else {
      setIsResizing(handleType);
      setDragStart({ x: e.clientX, y: e.clientY });
      setLayerStartPos({ x: selectedLayer.x || 0, y: selectedLayer.y || 0, scale: selectedLayer.scale || 1, rotation: selectedLayer.rotation || 0 });
    }
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (!selectedLayer || selectedLayer.locked) return;
      if (!isDragging && !isResizing && !isRotating) return;

      let updates = null;

      if (isDragging) {
        const rawDx = (e.clientX - dragStart.x) / (safeBox.width * zoom);
        const rawDy = (e.clientY - dragStart.y) / (safeBox.height * zoom);

        let targetX = layerStartPos.x + rawDx;
        let targetY = layerStartPos.y + rawDy;

        // Magnétisme d'alignement intelligent au centre (Snapping)
        let isSnappedX = false;
        let isSnappedY = false;

        if (Math.abs(targetX) < 0.035) {
          targetX = 0;
          isSnappedX = true;
        }
        if (Math.abs(targetY) < 0.035) {
          targetY = 0;
          isSnappedY = true;
        }
        setSnapGuides({ x: isSnappedX, y: isSnappedY });

        updates = {
          x: Math.max(-0.6, Math.min(0.6, targetX)),
          y: Math.max(-0.6, Math.min(0.6, targetY)),
        };
      } else if (isResizing) {
        const deltaX = (e.clientX - dragStart.x) / zoom;
        const deltaY = (e.clientY - dragStart.y) / zoom;
        const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const sign = isResizing.includes('r') ? (deltaX > 0 ? 1 : -1) : (deltaX < 0 ? 1 : -1);
        const scaleFactor = 1 + (sign * dist) / 180;
        const newScale = Math.max(0.15, Math.min(3.5, layerStartPos.scale * scaleFactor));
        updates = { scale: newScale };
      } else if (isRotating) {
        const centerPos = getLayerCanvasPos(selectedLayer);
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          const clientCenterX = rect.left + centerPos.x * zoom;
          const clientCenterY = rect.top + centerPos.y * zoom;
          const rad = Math.atan2(e.clientY - clientCenterY, e.clientX - clientCenterX);
          const deg = (rad * 180) / Math.PI - 90;
          updates = { rotation: (deg + 360) % 360 };
        }
      }

      if (updates) {
        latestTransformRef.current = updates;
        if (!rAFRef.current) {
          rAFRef.current = requestAnimationFrame(() => {
            if (latestTransformRef.current && selectedLayer) {
              customizerState.updateLayer(selectedLayer.id, latestTransformRef.current, false);
            }
            rAFRef.current = null;
          });
        }
      }
    },
    [isDragging, isResizing, isRotating, selectedLayer, dragStart, layerStartPos, safeBox, zoom, getLayerCanvasPos]
  );

  const handleMouseUp = useCallback(() => {
    if (rAFRef.current) {
      cancelAnimationFrame(rAFRef.current);
      rAFRef.current = null;
    }
    if ((isDragging || isResizing || isRotating) && selectedLayer && latestTransformRef.current) {
      customizerState.updateLayer(selectedLayer.id, latestTransformRef.current, true);
    }
    setIsDragging(false);
    setIsResizing(null);
    setIsRotating(false);
    setSnapGuides({ x: false, y: false });
    latestTransformRef.current = null;
  }, [isDragging, isResizing, isRotating, selectedLayer]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (rAFRef.current) {
        cancelAnimationFrame(rAFRef.current);
      }
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div className="dwt-pattern-workspace">
      {/* 1. BARRE D'OUTILS SUPÉRIEURE DU PATRON */}
      <div className="dwt-pattern-toolbar">
        <div className="dwt-toolbar-group">
          {/* Centrer */}
          <button
            type="button"
            className="dwt-tool-btn"
            onClick={handleCenter}
            disabled={!selectedLayer}
            title="Centrer l'élément (X:0, Y:0)"
          >
            <AlignCenter size={14} />
            <span>Centrer</span>
          </button>

          {/* Menu Ancrage 9 Points ▾ (Saut instantané) */}
          <div className="dwt-copy-dropdown-container" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="dwt-tool-btn"
              onClick={() => {
                setAnchorMenuOpen(!anchorMenuOpen);
                setLayerMenuOpen(false);
                setRotateMenuOpen(false);
                setPatternMenuOpen(false);
              }}
              disabled={!selectedLayer}
              title="Aligner sur la grille 9 points"
            >
              <Grid size={14} color="#00e5ff" />
              <span>Ancrage</span>
              <ChevronDown size={12} />
            </button>

            {anchorMenuOpen && selectedLayer && (
              <div className="dwt-copy-dropdown-menu dwt-anchor-dropdown-box">
                <div className="dwt-anchor-grid-title">ALIGNEMENT INSTANTANÉ :</div>
                <div className="dwt-anchor-grid-3x3">
                  {ANCHOR_POINTS.map((pt) => (
                    <button
                      key={pt.id}
                      type="button"
                      className="dwt-anchor-cell-btn"
                      onClick={() => {
                        customizerState.alignLayer(selectedLayer.id, pt.id);
                        setAnchorMenuOpen(false);
                      }}
                      title={pt.label}
                    >
                      {pt.icon}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Remplir / Full */}
          <button
            type="button"
            className="dwt-tool-btn"
            onClick={handleFill}
            disabled={!selectedLayer}
            title="Remplir la zone d'impression"
          >
            <Maximize2 size={14} />
            <span>Remplir</span>
          </button>

          {/* Ajuster / Fit */}
          <button
            type="button"
            className="dwt-tool-btn"
            onClick={handleFit}
            disabled={!selectedLayer}
            title="Ajuster proportionnellement"
          >
            <Minimize2 size={14} />
            <span>Ajuster</span>
          </button>

          {/* Dupliquer / Copy */}
          <button
            type="button"
            className="dwt-tool-btn"
            onClick={handleDuplicate}
            disabled={!selectedLayer}
            title="Dupliquer le calque"
          >
            <Copy size={14} />
            <span>Dupliquer</span>
          </button>

          {/* Menu Déroulant Calque / Layer ▾ */}
          <div className="dwt-copy-dropdown-container" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="dwt-tool-btn"
              onClick={() => {
                setLayerMenuOpen(!layerMenuOpen);
                setRotateMenuOpen(false);
                setPatternMenuOpen(false);
                setAnchorMenuOpen(false);
              }}
              disabled={!selectedLayer}
            >
              <Layers size={14} />
              <span>Calque</span>
              <ChevronDown size={12} />
            </button>

            {layerMenuOpen && selectedLayer && (
              <div className="dwt-copy-dropdown-menu">
                <button
                  type="button"
                  className="dwt-copy-dropdown-item"
                  onClick={() => {
                    customizerState.moveLayerOrder(selectedLayer.id, 'up');
                    setLayerMenuOpen(false);
                  }}
                >
                  <ArrowUp size={12} />
                  <span>Avancer (Premier plan)</span>
                </button>
                <button
                  type="button"
                  className="dwt-copy-dropdown-item"
                  onClick={() => {
                    customizerState.moveLayerOrder(selectedLayer.id, 'down');
                    setLayerMenuOpen(false);
                  }}
                >
                  <ArrowDown size={12} />
                  <span>Reculer (Arrière-plan)</span>
                </button>
              </div>
            )}
          </div>

          {/* Menu Déroulant Pivoter / Rotate ▾ */}
          <div className="dwt-copy-dropdown-container" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="dwt-tool-btn"
              onClick={() => {
                setRotateMenuOpen(!rotateMenuOpen);
                setLayerMenuOpen(false);
                setPatternMenuOpen(false);
                setAnchorMenuOpen(false);
              }}
              disabled={!selectedLayer}
            >
              <RotateCw size={14} />
              <span>Pivoter</span>
              <ChevronDown size={12} />
            </button>

            {rotateMenuOpen && selectedLayer && (
              <div className="dwt-copy-dropdown-menu">
                <button
                  type="button"
                  className="dwt-copy-dropdown-item"
                  onClick={() => {
                    customizerState.updateLayer(selectedLayer.id, {
                      rotation: (selectedLayer.rotation + 90) % 360,
                    }, true);
                    setRotateMenuOpen(false);
                  }}
                >
                  <RotateCw size={12} />
                  <span>Rotation +90°</span>
                </button>
                <button
                  type="button"
                  className="dwt-copy-dropdown-item"
                  onClick={() => {
                    customizerState.updateLayer(selectedLayer.id, {
                      rotation: (selectedLayer.rotation + 180) % 360,
                    }, true);
                    setRotateMenuOpen(false);
                  }}
                >
                  <RotateCw size={12} />
                  <span>Rotation 180°</span>
                </button>
                <button
                  type="button"
                  className="dwt-copy-dropdown-item"
                  onClick={() => {
                    customizerState.updateLayer(selectedLayer.id, { flipX: !selectedLayer.flipX }, true);
                    setRotateMenuOpen(false);
                  }}
                >
                  <FlipHorizontal size={12} />
                  <span>Miroir Horizontal</span>
                </button>
                <button
                  type="button"
                  className="dwt-copy-dropdown-item"
                  onClick={() => {
                    customizerState.updateLayer(selectedLayer.id, { flipY: !selectedLayer.flipY }, true);
                    setRotateMenuOpen(false);
                  }}
                >
                  <FlipVertical size={12} />
                  <span>Miroir Vertical</span>
                </button>
              </div>
            )}
          </div>

          {/* Toggle Pavé de Micro-déplacement */}
          <button
            type="button"
            className={`dwt-tool-btn ${showNudgePad ? 'active' : ''}`}
            onClick={() => setShowNudgePad(!showNudgePad)}
            disabled={!selectedLayer}
            title="Afficher les boutons de micro-déplacement"
          >
            <Move size={14} color="#00e5ff" />
            <span>Déplacer</span>
          </button>

          {/* Clear / Effacer tout sur la face */}
          <button
            type="button"
            className="dwt-tool-btn"
            onClick={handleClearAll}
            title="Effacer tous les éléments de cette pièce"
          >
            <RotateCcw size={14} />
            <span>Effacer</span>
          </button>

          {/* Reset / Réinitialiser */}
          <button
            type="button"
            className="dwt-tool-btn"
            onClick={handleReset}
            disabled={!selectedLayer}
            title="Réinitialiser transformation"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>

          {/* Delete / Supprimer */}
          <button
            type="button"
            className="dwt-tool-btn dwt-tool-delete"
            onClick={handleDelete}
            disabled={!selectedLayer}
            title="Supprimer le calque"
          >
            <Trash2 size={14} />
            <span>Supprimer</span>
          </button>
        </div>

        {/* Historique Undo / Redo */}
        <div className="dwt-toolbar-group">
          <button
            type="button"
            className="dwt-tool-btn dwt-icon-only"
            onClick={() => customizerState.undo()}
            title="Annuler (Ctrl+Z)"
          >
            <Undo2 size={14} />
          </button>
          <button
            type="button"
            className="dwt-tool-btn dwt-icon-only"
            onClick={() => customizerState.redo()}
            title="Rétablir (Ctrl+Y)"
          >
            <Redo2 size={14} />
          </button>
        </div>
      </div>

      {/* 2. BARRE D'EMPLACEMENTS RAPIDES ESPORT (Instantané en 1 clic) */}
      <div className="dwt-quick-presets-strip">
        <div className="dwt-presets-label">
          <Sparkles size={12} color="#e10613" />
          <span>POSITIONS RAPIDES ({patternInfo.name}) :</span>
        </div>
        <div className="dwt-presets-pills">
          {(QUICK_POSITION_PRESETS[activeView] || []).map((preset) => (
            <button
              key={preset.id}
              type="button"
              className="dwt-preset-pill-btn"
              disabled={!selectedLayer}
              onClick={() => {
                if (selectedLayer) {
                  customizerState.applyPositionPreset(selectedLayer.id, preset);
                }
              }}
              title={preset.desc}
            >
              <span className="dwt-preset-text">{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. PAVÉ FLOTTANT DE MICRO-DÉPLACEMENT (Optionnel) */}
      {showNudgePad && selectedLayer && (
        <div className="dwt-nudge-floating-pad">
          <div className="dwt-nudge-pad-title">D-PAD DE PRÉCISION</div>
          <div className="dwt-nudge-grid">
            <div />
            <button
              type="button"
              className="dwt-nudge-arrow-btn"
              onClick={() => customizerState.nudgeLayer(selectedLayer.id, 0, -0.02)}
              title="Monter (Flèche Haut)"
            >
              <ArrowUp size={14} />
            </button>
            <div />
            <button
              type="button"
              className="dwt-nudge-arrow-btn"
              onClick={() => customizerState.nudgeLayer(selectedLayer.id, -0.02, 0)}
              title="Gauche (Flèche Gauche)"
            >
              <ArrowLeft size={14} />
            </button>
            <button
              type="button"
              className="dwt-nudge-center-btn"
              onClick={handleCenter}
              title="Centrer (X:0, Y:0)"
            >
              •
            </button>
            <button
              type="button"
              className="dwt-nudge-arrow-btn"
              onClick={() => customizerState.nudgeLayer(selectedLayer.id, 0.02, 0)}
              title="Droite (Flèche Droite)"
            >
              <ArrowRight size={14} />
            </button>
            <div />
            <button
              type="button"
              className="dwt-nudge-arrow-btn"
              onClick={() => customizerState.nudgeLayer(selectedLayer.id, 0, 0.02)}
              title="Descendre (Flèche Bas)"
            >
              <ArrowDown size={14} />
            </button>
            <div />
          </div>
          <div className="dwt-nudge-tip">Astuce : Utilise aussi les flèches du clavier (+ Shift pour déplacement rapide)</div>
        </div>
      )}

      {/* 4. PLAN DE TRAVAIL CENTRAL AVEC GRILLE ET PATRON */}
      <div className="dwt-pattern-viewport-wrapper">
        <div
          ref={containerRef}
          className="dwt-pattern-canvas-stage"
          style={{ transform: `scale(${zoom})` }}
          onClick={() => customizerState.setState({ selectedLayerId: null }, false)}
        >
          {/* Grille technique de fond */}
          <div className="dwt-pattern-grid-bg" />

          {/* Silhouette SVG du patron textile */}
          <svg className="dwt-pattern-silhouette-svg" viewBox="0 0 440 540">
            <defs>
              <filter id="dwtGarmentFilter" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="8" stdDeviation="16" floodColor="#000000" floodOpacity="0.85" />
                <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor={isDark ? "rgba(0, 229, 255, 0.28)" : "rgba(0, 0, 0, 0.15)"} />
              </filter>
            </defs>

            {/* Forme du tissu avec contour contrasté pour ressortir sur fond noir */}
            <path
              d={patternInfo.path}
              className="dwt-garment-cloth-path"
              fill={bodyColor}
              stroke={isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.25)'}
              strokeWidth="2.5"
              filter="url(#dwtGarmentFilter)"
            />

            {/* Zone de sécurité d'impression en pointillés rouges */}
            <rect
              x={safeBox.x}
              y={safeBox.y}
              width={safeBox.width}
              height={safeBox.height}
              className="dwt-pattern-safebox-rect"
              rx="4"
            />

            {/* Guides d'aimantation magnétiques (Axe X et Axe Y centrés) */}
            {snapGuides.x && (
              <line
                x1={safeCenterX}
                y1={safeBox.y - 12}
                x2={safeCenterX}
                y2={safeBox.y + safeBox.height + 12}
                stroke="#00e5ff"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
            )}
            {snapGuides.y && (
              <line
                x1={safeBox.x - 12}
                y1={safeCenterY}
                x2={safeBox.x + safeBox.width + 12}
                y2={safeCenterY}
                stroke="#00e5ff"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
            )}
          </svg>

          {/* Calques 2D interactifs */}
          <div className="dwt-pattern-layers-container">
            {currentViewLayers.map((layer) => {
              if (!layer.visible) return null;
              const pos = getLayerCanvasPos(layer);
              const isSelected = selectedLayer?.id === layer.id;

              return (
                <div
                  key={layer.id}
                  className={`dwt-canvas-layer-node ${isSelected ? 'selected' : ''} ${layer.locked ? 'locked' : ''}`}
                  style={{
                    left: `${pos.x}px`,
                    top: `${pos.y}px`,
                    width: `${pos.w}px`,
                    height: `${pos.h}px`,
                    transform: `translate(-50%, -50%) rotate(${layer.rotation || 0}deg) scaleX(${layer.flipX ? -1 : 1}) scaleY(${layer.flipY ? -1 : 1})`,
                    opacity: layer.opacity ?? 1,
                  }}
                  onMouseDown={(e) => handleMouseDownLayer(e, layer)}
                >
                  {/* Contenu (Image ou Texte) */}
                  {layer.type === 'text' ? (
                    layer.curve ? (
                      <svg
                        viewBox="0 0 300 100"
                        className="dwt-curved-text-svg"
                        style={{ width: '100%', height: '100%', overflow: 'visible' }}
                      >
                        <defs>
                          <path
                            id={`curve_path_${layer.id}`}
                            d={layer.curve > 0
                              ? `M 15,85 Q 150,${85 - Number(layer.curve) * 1.3} 285,85`
                              : `M 15,25 Q 150,${25 - Number(layer.curve) * 1.3} 285,25`}
                          />
                        </defs>
                        <text
                          fill={getSafeContrastColor(layer.textColor || '#ffffff', bodyColor)}
                          fontFamily={layer.fontFamily || "'Orbitron', sans-serif"}
                          fontWeight="bold"
                          fontSize="26"
                          stroke={layer.strokeWidth ? (layer.strokeColor || '#000000') : (isDark && isColorDark(layer.textColor) ? 'rgba(255,255,255,0.7)' : 'none')}
                          strokeWidth={layer.strokeWidth || (isDark && isColorDark(layer.textColor) ? 1.5 : 0)}
                        >
                          <textPath href={`#curve_path_${layer.id}`} startOffset="50%" textAnchor="middle">
                            {layer.text || 'TEXTE ESPORT'}
                          </textPath>
                        </text>
                      </svg>
                    ) : (
                      <div
                        className="dwt-layer-text-element"
                        style={{
                          fontFamily: layer.fontFamily || "'Orbitron', sans-serif",
                          color: getSafeContrastColor(layer.textColor || '#ffffff', bodyColor),
                          WebkitTextStroke: layer.strokeWidth ? `${layer.strokeWidth}px ${layer.strokeColor || '#000000'}` : (isDark && isColorDark(layer.textColor) ? '1px rgba(255,255,255,0.7)' : 'none'),
                        }}
                      >
                        {layer.text || 'TEXTE ESPORT'}
                      </div>
                    )
                  ) : (
                    <img
                      src={layer.url}
                      alt={layer.name}
                      className="dwt-layer-image-element"
                      draggable={false}
                    />
                  )}

                  {/* Poignées de transformation interactives si sélectionné */}
                  {isSelected && !layer.locked && (
                    <>
                      <div className="dwt-layer-bounding-box" />

                      {/* 4 coins */}
                      <div className="dwt-handle handle-tl" onMouseDown={(e) => handleMouseDownHandle(e, 'tl')} />
                      <div className="dwt-handle handle-tr" onMouseDown={(e) => handleMouseDownHandle(e, 'tr')} />
                      <div className="dwt-handle handle-bl" onMouseDown={(e) => handleMouseDownHandle(e, 'bl')} />
                      <div className="dwt-handle handle-br" onMouseDown={(e) => handleMouseDownHandle(e, 'br')} />

                      {/* 4 points médians */}
                      <div className="dwt-handle handle-tc" onMouseDown={(e) => handleMouseDownHandle(e, 'tc')} />
                      <div className="dwt-handle handle-bc" onMouseDown={(e) => handleMouseDownHandle(e, 'bc')} />
                      <div className="dwt-handle handle-ml" onMouseDown={(e) => handleMouseDownHandle(e, 'ml')} />
                      <div className="dwt-handle handle-mr" onMouseDown={(e) => handleMouseDownHandle(e, 'mr')} />

                      {/* Poignée de rotation avec tige vers le bas */}
                      <div className="dwt-rotate-stem" />
                      <div className="dwt-handle handle-rot" onMouseDown={(e) => handleMouseDownHandle(e, 'rot')}>
                        <RotateCw size={11} color="#fff" />
                      </div>

                      {/* Alerte de résolution / DPI faible comme dans la référence */}
                      {(layer.dpiScore === 'low' || (layer.scale || 1) > 1.6) && (
                        <div className="dwt-dpi-warning-badge">
                          <AlertTriangle size={12} />
                          <span>Image trop petite pour impression HD</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Repère de dimensions en bas */}
          <div className="dwt-pattern-dimension-tag">
            Zone Utile : {patternInfo.dimensions} · Résolution Optimale 300 DPI
          </div>
        </div>

        {/* 5. SÉLECTEUR DE PIÈCES TEXTILES (À DROITE DU PATRON - SVG SILHOUETTES) */}
        <div className="dwt-pattern-pieces-sidebar">
          {/* Menu COPIER VERS ▾ au sommet de la colonne */}
          <div className="dwt-copy-dropdown-container" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="dwt-tool-btn"
              style={{ width: '100%', justifyContent: 'center', padding: '6px 4px', fontSize: '9px' }}
              onClick={() => setCopyMenuOpen(!copyMenuOpen)}
              disabled={!selectedLayer}
            >
              <span>COPIER VERS</span>
              <ChevronDown size={11} />
            </button>

            {copyMenuOpen && selectedLayer && (
              <div className="dwt-copy-dropdown-menu" style={{ left: 0, right: 'auto' }}>
                {availablePieces.filter((p) => p.id !== activeView).map((target) => (
                  <button
                    key={target.id}
                    type="button"
                    className="dwt-copy-dropdown-item"
                    onClick={() => handleCopyToPiece(target.id)}
                  >
                    <span>{target.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="dwt-pieces-title" style={{ marginTop: '4px' }}>PIÈCES</div>

          {/* Silhouettes SVG vectorielles des pièces du vêtement */}
          {availablePieces.map((piece) => {
            const count = state.layers.filter((l) => l.view === piece.id).length;
            const isCurrent = activeView === piece.id;

            return (
              <button
                key={piece.id}
                type="button"
                className={`dwt-piece-pill ${isCurrent ? 'active' : ''}`}
                onClick={() => handleSelectPiece(piece.id)}
                title={`Personnaliser ${piece.label} (Pivote la vue 3D à ${piece.defaultAngle}°)`}
              >
                <svg viewBox="0 0 440 540" className="dwt-piece-thumb-svg">
                  <path
                    d={PATTERN_SHAPES[piece.id]?.path}
                    fill="#121622"
                    stroke={isCurrent ? '#e10613' : 'rgba(255, 255, 255, 0.25)'}
                    strokeWidth="10"
                  />
                </svg>
                <span className="dwt-piece-label">{piece.label}</span>
                {count > 0 && <span className="dwt-piece-badge">{count}</span>}
              </button>
            );
          })}
        </div>

        {/* Contrôles de zoom */}
        <div className="dwt-canvas-zoom-controls">
          <button
            type="button"
            className="dwt-zoom-btn"
            onClick={() => setZoom((z) => Math.min(1.6, z + 0.1))}
            title="Zoomer"
          >
            <ZoomIn size={14} />
          </button>
          <span className="dwt-zoom-value">{Math.round(zoom * 100)}%</span>
          <button
            type="button"
            className="dwt-zoom-btn"
            onClick={() => setZoom((z) => Math.max(0.6, z - 0.1))}
            title="Dézoomer"
          >
            <ZoomOut size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatternCanvas2D;
