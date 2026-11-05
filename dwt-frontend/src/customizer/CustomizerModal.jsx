import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  X,
  Undo2,
  Redo2,
  RotateCcw,
  Shirt,
  UploadCloud,
  Palette,
  Type,
  UserCheck,
  Layers,
  Users,
  Sparkles,
  Compass,
  ShoppingBag,
  Image as ImageIcon,
  Bot
} from 'lucide-react';
import WolfLogo from '../components/WolfLogo';
import { customizerState } from './state.js';
import { TextureComposer } from './textureComposer.js';
import { CustomizerScene } from './scene.js';
import PatternCanvas2D from './PatternCanvas2D.jsx';
import ToolDrawer from './ToolDrawer.jsx';
import Viewport3D from './Viewport3D.jsx';
import AIFinalResultModal from './AIFinalResultModal.jsx';
import './customizer.css';

const NAV_TOOLS = [
  { id: 'ai', label: 'Studio IA', icon: Bot, isAi: true },
  { id: 'products', label: 'Vêtements', icon: Shirt },
  { id: 'upload', label: 'Importer', icon: UploadCloud },
  { id: 'color', label: 'Couleurs', icon: Palette },
  { id: 'text', label: 'Texte', icon: Type },
  { id: 'images', label: 'Images', icon: ImageIcon },
  { id: 'player', label: 'Joueur', icon: UserCheck },
  { id: 'layers', label: 'Calques', icon: Layers },
  { id: 'finishes', label: 'Matières', icon: Sparkles },
];

export const CustomizerModal = ({ isOpen, onClose, onOpenCart }) => {
  const [state, setState] = useState(customizerState.getState());
  const [unavailableNotice, setUnavailableNotice] = useState(null);
  const [debugModelInfo, setDebugModelInfo] = useState(null);
  const [isAiResultModalOpen, setIsAiResultModalOpen] = useState(false);

  const sceneRef = useRef(null);
  const textureComposerRef = useRef(null);

  // Synchronisation avec le store d'état
  useEffect(() => {
    const unsubscribe = customizerState.subscribe((newState) => {
      setState({ ...newState });
    });
    return unsubscribe;
  }, []);

  // Initialisation de Three.js & TextureComposer
  useEffect(() => {
    if (!isOpen) return;

    // Attendre que le conteneur WebGL soit dans le DOM
    const timer = setTimeout(() => {
      const container = document.getElementById('dwt-webgl-container');
      if (!container) return;

      // 1. Compositeur de texture textile haute résolution
      const composer = new TextureComposer(2048);
      textureComposerRef.current = composer;
      composer.compose(state);

      // 2. Moteur de scène Three.js
      const isDebugParam = window.location.search.includes('debug=1');
      const scene = new CustomizerScene(container, composer, {
        initialCategory: state.category,
        initialAngle: state.rotationAngle,
        isAutoRotate: state.isAutoRotate,
        isDebug: isDebugParam,
        onAngleChange: (deg) => {
          customizerState.setState({ rotationAngle: deg }, false);
        },
        onModelLoaded: (res) => {
          setUnavailableNotice(null);
          if (res.debugInfo) setDebugModelInfo(res.debugInfo);
          // Synchroniser les impressions dès le chargement du modèle
          scene.syncDecals(customizerState.getState());
        },
        onModelUnavailable: (msg) => {
          setUnavailableNotice(msg);
          setDebugModelInfo(null);
        },
      });
      sceneRef.current = scene;
      scene.syncDecals(state);
    }, 60);

    return () => {
      clearTimeout(timer);
      if (sceneRef.current) {
        sceneRef.current.destroy();
        sceneRef.current = null;
      }
      if (textureComposerRef.current) {
        textureComposerRef.current.dispose();
        textureComposerRef.current = null;
      }
    };
  }, [isOpen]);

  // 1. Re-composition de la texture textile (uniquement lors de changements de matière ou couleurs)
  useEffect(() => {
    if (textureComposerRef.current && isOpen) {
      textureComposerRef.current.compose(state);
    }
  }, [
    state.modelId,
    state.colors,
    state.color,
    state.finish,
    isOpen,
  ]);

  // 2. Synchronisation haute précision des impressions et flocages en 3D pure (DecalGeometry)
  useEffect(() => {
    if (sceneRef.current && isOpen) {
      sceneRef.current.syncDecals(state);
    }
  }, [
    state.layers,
    state.playerFlockingEnabled,
    state.showGamertag,
    state.showPlayerNumber,
    state.showPlayerRole,
    state.gamertag,
    state.playerNumber,
    state.playerRole,
    state.playerRoleColor,
    state.playerFont,
    state.playerTextColor,
    state.playerNumberColor,
    state.colors,
    state.color,
    isOpen,
  ]);

  // Changement de modèle 3D lors du changement de catégorie
  useEffect(() => {
    if (sceneRef.current && sceneRef.current.currentCategory !== state.category) {
      sceneRef.current.loadCategory(state.category);
    }
  }, [state.category]);

  // Raccourcis clavier globaux
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.ctrlKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          customizerState.redo();
        } else {
          customizerState.undo();
        }
      } else if (e.ctrlKey && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        customizerState.redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="dwt-customizer-overlay">
      <div className="dwt-customizer-window">
        {/* 1. HEADER DU STUDIO */}
        <div className="dwt-header">
          <div className="dwt-header-left">
            <WolfLogo size={34} />
            <div className="dwt-header-text">
              <div className="dwt-header-tag">PRO CAD STUDIO 3D</div>
              <h1 className="dwt-header-title">CRÉE TON ÉQUIPEMENT ESPORT</h1>
              <span className="dwt-header-subtitle">
                Configurateur officiel Dark Wolf Team · Conforme ligues compétitives
              </span>
            </div>
          </div>

          <div className="dwt-header-right">
            <button
              type="button"
              className="dwt-header-ai-btn"
              onClick={() => setIsAiResultModalOpen(true)}
              title="Afficher le Rendu Final IA et la Fiche Technique"
            >
              <Sparkles size={14} color="#00e5ff" />
              <span>RÉSULTAT FINAL IA</span>
            </button>
            <button
              type="button"
              className="dwt-header-btn"
              onClick={() => customizerState.undo()}
              title="Annuler (Ctrl+Z)"
            >
              <Undo2 size={16} />
            </button>
            <button
              type="button"
              className="dwt-header-btn"
              onClick={() => customizerState.redo()}
              title="Rétablir (Ctrl+Y)"
            >
              <Redo2 size={16} />
            </button>
            <button
              type="button"
              className="dwt-header-btn"
              onClick={() => customizerState.reset()}
              title="Réinitialiser"
            >
              <RotateCcw size={16} />
            </button>
            <button
              type="button"
              className="dwt-header-close-btn"
              onClick={onClose}
              title="Fermer le studio (Échap)"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* 2. CORPS DU STUDIO : 3 COLONNES POD (Barre d'outils + Tiroir + Patron 2D + Viewport 3D) */}
        <div className="dwt-customizer-body">
          {/* A. BARRE D'ICÔNES VERTICALE GAUCHE (68px) */}
          <nav className="dwt-vertical-nav-strip">
            {NAV_TOOLS.map((tool) => {
              const isActive = state.activeNavTool === tool.id;
              return (
                <button
                  key={tool.id}
                  type="button"
                  className={`dwt-nav-tool-btn ${isActive ? 'active' : ''} ${tool.isAi ? 'ai-highlight' : ''}`}
                  onClick={() => customizerState.setState({ activeNavTool: tool.id })}
                  title={tool.label}
                >
                  <tool.icon size={20} />
                  <span className="dwt-nav-tool-label">{tool.label}</span>
                </button>
              );
            })}
          </nav>

          {/* B. TIROIR CONTEXTUEL D'OUTILS (270px) */}
          <ToolDrawer
            state={state}
            onOpenFinalResult={() => setIsAiResultModalOpen(true)}
          />

          {/* C. PLAN DE TRAVAIL CENTRAL : PATRON 2D INTERACTIF (FLEX) */}
          <PatternCanvas2D state={state} />

          {/* D. COLONNE DROITE : APERÇU 3D EN DIRECT & COMMANDE (380px) */}
          <Viewport3D
            sceneRef={sceneRef}
            state={state}
            debugModelInfo={debugModelInfo}
            unavailableNotice={unavailableNotice}
            onOpenCart={onOpenCart}
            onOpenFinalResult={() => setIsAiResultModalOpen(true)}
          />
        </div>

        {/* 3. MODAL DU RÉSULTAT FINAL IA AVEC CERTIFICATION ET MULTI-VUES */}
        <AIFinalResultModal
          isOpen={isAiResultModalOpen}
          onClose={() => setIsAiResultModalOpen(false)}
          sceneRef={sceneRef}
          state={state}
          onAddToCart={() => {
            setIsAiResultModalOpen(false);
            if (onOpenCart) onOpenCart();
          }}
        />
      </div>
    </div>
  );
};

export default CustomizerModal;
