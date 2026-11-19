import React, { useState, useRef } from 'react';
import { 
  Palette, 
  RotateCcw, 
  Check, 
  Edit3, 
  Layers, 
  Eye, 
  DollarSign, 
  Save, 
  Sparkles, 
  AlertTriangle, 
  X,
  ExternalLink,
  ShieldCheck,
  Tag,
  Box,
  UploadCloud,
  Sliders,
  CheckCircle2,
  RotateCw,
  Plus,
  Trash2,
  FileCheck,
  Shield,
  HelpCircle,
  Cpu
} from 'lucide-react';
import API from '../services/api';
import WolfLogo from './WolfLogo';

const DEFAULT_ELEMENT_PRICING = {
  layerPrice: 5.0,
  gamertagPrice: 0.0,
  numberPrice: 0.0,
  rolePrice: 0.0,
  finishMeshPrice: 5.0,
  finishMatPrice: 0.0,
  finishSatinePrice: 7.0,
  techniqueBroderiePrice: 12.0,
  techniqueFlexPrice: 4.0,
};

const DEFAULT_GLB_MODELS = {
  maillots: '/models/tshirt.glb',
  hoodies: '/models/hoodie_posed.glb',
  't-shirt': '/models/tshirt.glb',
  casquettes: '',
  'tote-bags': '',
};

const CustomGearAdminSection = ({
  customGearList = [],
  onRefresh,
  showToast,
  openConfirm,
  onOpenCustomStudio
}) => {
  // Navigation interne : 'gear_prices' | 'element_prices' | 'glb_models'
  const [activeSubTab, setActiveSubTab] = useState('gear_prices');

  // 1. Tarifs de base par vêtement
  const [gearPriceInputs, setGearPriceInputs] = useState(() => {
    const init = {};
    customGearList.forEach((g) => {
      init[g._id] = g.basePrice;
    });
    return init;
  });
  const [savingId, setSavingId] = useState(null);
  const [editingGear, setEditingGear] = useState(null);
  const [savingModal, setSavingModal] = useState(false);

  // 2. Tarifs des éléments & options de customisation
  const [elementPricing, setElementPricing] = useState(() => {
    try {
      const saved = localStorage.getItem('dwt_custom_pricing_rules');
      if (saved) return { ...DEFAULT_ELEMENT_PRICING, ...JSON.parse(saved) };
    } catch (_) {}
    return { ...DEFAULT_ELEMENT_PRICING };
  });
  const [savingElements, setSavingElements] = useState(false);

  // 3. Espace d'importation et gestion des modèles 3D GLB
  const [glbModelsMap, setGlbModelsMap] = useState(() => {
    try {
      const saved = localStorage.getItem('dwt_custom_glb_models');
      if (saved) return { ...DEFAULT_GLB_MODELS, ...JSON.parse(saved) };
    } catch (_) {}
    return { ...DEFAULT_GLB_MODELS };
  });
  const [selectedGlbCategory, setSelectedGlbCategory] = useState('maillots');
  const [customGlbUrlInput, setCustomGlbUrlInput] = useState('');
  const [uploadingGlb, setUploadingGlb] = useState(false);
  const [glbUploadFeedback, setGlbUploadFeedback] = useState(null);
  const glbFileInputRef = useRef(null);

  // Mettre à jour la valeur locale du prix de base
  const handlePriceChange = (gearId, val) => {
    setGearPriceInputs((prev) => ({ ...prev, [gearId]: val }));
  };

  // Enregistrer rapidement le nouveau prix dans MongoDB Atlas
  const handleQuickSavePrice = async (gear) => {
    const rawVal = gearPriceInputs[gear._id] !== undefined ? gearPriceInputs[gear._id] : gear.basePrice;
    const newPrice = parseFloat(rawVal);

    if (isNaN(newPrice) || newPrice < 0) {
      if (showToast) showToast('Veuillez saisir un tarif valide en TND', 'error');
      return;
    }

    setSavingId(gear._id);
    try {
      const res = await API.put(`/custom-gear/${gear._id}`, { basePrice: newPrice });
      if (res.data?.success) {
        // Synchroniser également dans localStorage
        const pricingRules = { ...elementPricing };
        if (!pricingRules.basePrices) pricingRules.basePrices = {};
        pricingRules.basePrices[gear.slug] = newPrice;
        localStorage.setItem('dwt_custom_pricing_rules', JSON.stringify(pricingRules));

        if (showToast) {
          showToast(`Prix de base pour "${gear.name}" fixé à ${newPrice} TND avec succès.`, 'success');
        }
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      if (showToast) {
        showToast(err.response?.data?.message || 'Erreur lors de la mise à jour du prix', 'error');
      }
    } finally {
      setSavingId(null);
    }
  };

  // Basculer le statut Actif / Inactif
  const handleToggleActive = async (gear) => {
    try {
      const res = await API.put(`/custom-gear/${gear._id}`, { isActive: !gear.isActive });
      if (res.data?.success) {
        if (showToast) {
          showToast(`"${gear.name}" est désormais ${!gear.isActive ? 'actif' : 'inactif'} dans l'Atelier.`, 'success');
        }
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      if (showToast) showToast('Erreur lors du changement de statut', 'error');
    }
  };

  // Sauvegarder les tarifs des options & éléments
  const handleSaveElementPricing = async () => {
    setSavingElements(true);
    try {
      // 1. Sauvegarde dans localStorage pour synchronisation immédiate du Customizer
      localStorage.setItem('dwt_custom_pricing_rules', JSON.stringify(elementPricing));

      // 2. Synchronisation en base de données sur tous les équipements
      for (const gear of customGearList) {
        await API.put(`/custom-gear/${gear._id}`, {
          customPricing: {
            layerPrice: elementPricing.layerPrice,
            gamertagPrice: elementPricing.gamertagPrice,
            numberPrice: elementPricing.numberPrice,
            rolePrice: elementPricing.rolePrice,
            finishMeshPrice: elementPricing.finishMeshPrice,
            finishMatPrice: elementPricing.finishMatPrice,
            finishSatinePrice: elementPricing.finishSatinePrice,
          }
        }).catch(() => {});
      }

      if (showToast) {
        showToast('Grille tarifaire des éléments et options enregistrée avec succès.', 'success');
      }
      if (onRefresh) onRefresh();
    } catch (err) {
      if (showToast) showToast('Erreur lors de l\'enregistrement des tarifs d\'éléments', 'error');
    } finally {
      setSavingElements(false);
    }
  };

  // Gestion de l'importation de fichiers .glb
  const handleGlbFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.glb') && !file.name.toLowerCase().endsWith('.gltf')) {
      if (showToast) showToast('Seuls les fichiers 3D au format .glb ou .gltf sont acceptés.', 'error');
      return;
    }

    setUploadingGlb(true);
    setGlbUploadFeedback(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'model');

      const res = await API.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data?.success) {
        const modelUrl = res.data.modelUrl || res.data.fileUrl || res.data.filePath;
        const updatedMap = {
          ...glbModelsMap,
          [selectedGlbCategory]: modelUrl
        };
        setGlbModelsMap(updatedMap);
        localStorage.setItem('dwt_custom_glb_models', JSON.stringify(updatedMap));

        // Mettre à jour le vêtement correspondant en base de données
        const targetGear = customGearList.find(g => g.slug === selectedGlbCategory);
        if (targetGear) {
          await API.put(`/custom-gear/${targetGear._id}`, { glbModelUrl: modelUrl }).catch(() => {});
        }

        setGlbUploadFeedback({
          type: 'success',
          text: `Modèle 3D "${file.name}" téléversé et assigné à la catégorie "${selectedGlbCategory}".`
        });

        if (showToast) {
          showToast(`Nouveau modèle 3D .glb activé pour ${selectedGlbCategory}.`, 'success');
        }
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Erreur lors du téléversement du fichier .glb';
      setGlbUploadFeedback({ type: 'error', text: errMsg });
      if (showToast) showToast(errMsg, 'error');
    } finally {
      setUploadingGlb(false);
      if (glbFileInputRef.current) glbFileInputRef.current.value = '';
    }
  };

  // Assigner une URL de modèle GLB manuellement
  const handleAssignCustomGlbUrl = async () => {
    if (!customGlbUrlInput.trim()) return;
    const url = customGlbUrlInput.trim();

    const updatedMap = {
      ...glbModelsMap,
      [selectedGlbCategory]: url
    };
    setGlbModelsMap(updatedMap);
    localStorage.setItem('dwt_custom_glb_models', JSON.stringify(updatedMap));

    const targetGear = customGearList.find(g => g.slug === selectedGlbCategory);
    if (targetGear) {
      await API.put(`/custom-gear/${targetGear._id}`, { glbModelUrl: url }).catch(() => {});
    }

    setCustomGlbUrlInput('');
    setGlbUploadFeedback({
      type: 'success',
      text: `Chemin 3D "${url}" configuré pour la catégorie "${selectedGlbCategory}".`
    });
    if (showToast) showToast(`Modèle 3D mis à jour pour ${selectedGlbCategory}.`, 'success');
  };

  // Rétablir les modèles 3D officiels par défaut
  const handleResetDefaultGlb = (cat) => {
    const updated = {
      ...glbModelsMap,
      [cat]: DEFAULT_GLB_MODELS[cat] || ''
    };
    setGlbModelsMap(updated);
    localStorage.setItem('dwt_custom_glb_models', JSON.stringify(updated));
    if (showToast) showToast(`Modèle 3D officiel rétabli pour ${cat}.`, 'success');
  };

  // Réinitialiser tous les équipements aux valeurs de la maquette
  const handleResetDefaults = () => {
    if (!openConfirm) return;
    openConfirm({
      title: 'RÉINITIALISER LES PRIX & ÉQUIPEMENTS',
      message: 'Voulez-vous réinitialiser tous les équipements personnalisables aux tarifs officiels de la maquette (Maillot 69.99 TND, Hoodie 89.99 TND, T-shirt 49.99 TND, etc.) ?',
      subtext: 'Cette action réinitialisera les modèles, couleurs et tarifs dans la base de données MongoDB Atlas.',
      confirmText: 'Réinitialiser aux valeurs maquette',
      cancelText: 'Annuler',
      type: 'danger',
      onConfirm: async () => {
        try {
          const res = await API.post('/custom-gear/reset');
          if (res.data?.success) {
            const gears = res.data.gear || [];
            const initP = {};
            gears.forEach((g) => { initP[g._id] = g.basePrice; });
            setGearPriceInputs(initP);
            setElementPricing({ ...DEFAULT_ELEMENT_PRICING });
            localStorage.removeItem('dwt_custom_pricing_rules');
            if (showToast) showToast('Catalogue custom réinitialisé avec succès aux valeurs officielles.', 'success');
            if (onRefresh) onRefresh();
          }
        } catch (err) {
          if (showToast) showToast('Erreur lors de la réinitialisation', 'error');
        }
      }
    });
  };

  // Enregistrer les modifications détaillées
  const handleSaveModal = async (e) => {
    e.preventDefault();
    if (!editingGear) return;
    setSavingModal(true);
    try {
      const res = await API.put(`/custom-gear/${editingGear._id}`, editingGear);
      if (res.data?.success) {
        if (showToast) showToast(`Modifications enregistrées pour "${editingGear.name}".`, 'success');
        setEditingGear(null);
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      if (showToast) showToast(err.response?.data?.message || "Erreur lors de l'enregistrement", 'error');
    } finally {
      setSavingModal(false);
    }
  };

  const jerseyItem = customGearList.find((g) => g.slug === 'maillots') || customGearList[0];
  const hoodieItem = customGearList.find((g) => g.slug === 'hoodies');

  return (
    <div>
      {/* 1. CARTE DE CONTRÔLE SUPÉRIEURE */}
      <div className="dash-card" style={{ marginBottom: '24px' }}>
        <div className="dash-card-header" style={{ flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{
                background: 'rgba(230,0,0,0.15)',
                color: '#ff4d4d',
                border: '1px solid #e60000',
                borderRadius: '6px',
                padding: '2px 8px',
                fontSize: '10px',
                fontFamily: "'Orbitron', monospace",
                fontWeight: '800',
                letterSpacing: '1px'
              }}>
                BASE DE DONNÉES MONGODB ATLAS & MOTEUR 3D PBR
              </span>
            </div>
            <span className="dash-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Palette size={20} color="var(--red-primary)" />
              Gestion des Vêtements Custom, Tarifs & Modèles 3D GLB
            </span>
            <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px', maxWidth: '850px' }}>
              Pilotez l'intégralité du studio custom : fixez les tarifs de vente officiels en Dinars Tunisiens (TND), modulez le coût unitaire de chaque élément personnalisable (flocage, visuels, finitions) et importez des modèles 3D .glb directement exploitables dans le configurateur 3D.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="dash-subtab-btn"
              onClick={onOpenCustomStudio}
              style={{
                background: '#ffffff',
                color: '#07080c',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                border: 'none',
                boxShadow: '0 0 15px rgba(255, 255, 255, 0.2)'
              }}
            >
              <Eye size={15} />
              <span>Tester dans le Custom Studio</span>
            </button>

            <button
              type="button"
              className="dash-subtab-btn"
              onClick={handleResetDefaults}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px' }}
              title="Réinitialiser tous les prix aux valeurs de la maquette officielle"
            >
              <RotateCcw size={14} />
              <span>Prix par Défaut Maquette</span>
            </button>
          </div>
        </div>

        {/* 2. STATS & KPI BAR */}
        <div className="dash-kpi-grid" style={{ marginTop: '20px' }}>
          <div className="dash-kpi-card">
            <div className="dash-kpi-icon" style={{ background: 'rgba(230,0,0,0.15)', color: 'var(--red-primary)' }}>
              <Layers size={22} />
            </div>
            <div>
              <div className="dash-kpi-value">{customGearList.length}</div>
              <div className="dash-kpi-label">Articles Personnalisables</div>
            </div>
          </div>

          <div className="dash-kpi-card">
            <div className="dash-kpi-icon" style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80' }}>
              <DollarSign size={22} />
            </div>
            <div>
              <div className="dash-kpi-value" style={{ color: '#4ade80' }}>
                {jerseyItem?.basePrice || 69.99} TND
              </div>
              <div className="dash-kpi-label">Prix Base Maillot Esport</div>
            </div>
          </div>

          <div className="dash-kpi-card">
            <div className="dash-kpi-icon" style={{ background: 'rgba(56,189,248,0.15)', color: '#38bdf8' }}>
              <Box size={22} />
            </div>
            <div>
              <div className="dash-kpi-value" style={{ color: '#38bdf8' }}>
                {Object.values(glbModelsMap).filter(Boolean).length} / 5
              </div>
              <div className="dash-kpi-label">Modèles 3D GLB Actifs</div>
            </div>
          </div>

          <div className="dash-kpi-card">
            <div className="dash-kpi-icon" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <div className="dash-kpi-value" style={{ color: '#f59e0b' }}>TND</div>
              <div className="dash-kpi-label">Devise Officielle DWT</div>
            </div>
          </div>
        </div>

        {/* 3. BARRE DE SOUS-ONGLETS DU STUDIO CUSTOM */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`dash-subtab-btn ${activeSubTab === 'gear_prices' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('gear_prices')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Tag size={15} />
            <span>Prix des Vêtements ({customGearList.length})</span>
          </button>

          <button
            type="button"
            className={`dash-subtab-btn ${activeSubTab === 'element_prices' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('element_prices')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Sliders size={15} />
            <span>Tarifs des Éléments & Options</span>
          </button>

          <button
            type="button"
            className={`dash-subtab-btn ${activeSubTab === 'glb_models' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('glb_models')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Box size={15} />
            <span>Importation & Modèles 3D GLB</span>
          </button>
        </div>
      </div>

      {/* ────────────────── SOUS-ONGLET 1 : PRIX DE BASE DES VÊTEMENTS ────────────────── */}
      {activeSubTab === 'gear_prices' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '18px' }}>
          {customGearList.map((gear) => {
            const currentPriceInput = gearPriceInputs[gear._id] !== undefined ? gearPriceInputs[gear._id] : gear.basePrice;
            const isSaving = savingId === gear._id;

            return (
              <div
                key={gear._id}
                className="dash-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: gear.isActive ? '1px solid rgba(255,255,255,0.12)' : '1px dashed rgba(255,255,255,0.06)',
                  background: gear.isActive ? 'rgba(14, 18, 26, 0.7)' : 'rgba(10, 12, 18, 0.4)',
                  opacity: gear.isActive ? 1 : 0.75,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        background: 'rgba(225,6,19,0.1)',
                        border: '1px solid rgba(225,6,19,0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontFamily: "'Orbitron', sans-serif",
                        fontWeight: '800',
                        color: '#e10613'
                      }}>
                        DWT
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '15px', color: '#fff', fontFamily: "'Orbitron', sans-serif", fontWeight: '800' }}>
                          {gear.name}
                        </h4>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>
                          {gear.category} • {gear.slug}
                        </span>
                      </div>
                    </div>

                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '10px',
                      fontFamily: "'Orbitron', monospace",
                      fontWeight: '800',
                      background: gear.isActive ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                      color: gear.isActive ? '#4ade80' : '#f87171',
                      border: `1px solid ${gear.isActive ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`
                    }}>
                      {gear.isActive ? 'ACTIF' : 'INACTIF'}
                    </span>
                  </div>

                  <p style={{ fontSize: '12.5px', color: '#94a3b8', lineHeight: '1.45', margin: '0 0 16px' }}>
                    {gear.description || gear.subtitle || 'Article officiel de la collection personnalisable DWT.'}
                  </p>

                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '18px' }}>
                    <span style={{ fontSize: '11px', padding: '3px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', color: '#cbd5e1' }}>
                      {gear.models?.length || 5} modèles
                    </span>
                    <span style={{ fontSize: '11px', padding: '3px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', color: '#cbd5e1' }}>
                      {gear.colors?.length || 6} couleurs
                    </span>
                    <span style={{ fontSize: '11px', padding: '3px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', color: '#cbd5e1' }}>
                      Modèle 3D : {glbModelsMap[gear.slug] ? 'Connecté' : 'Par défaut'}
                    </span>
                  </div>

                  {/* Fixation du prix de base */}
                  <div style={{
                    background: '#090b10',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    padding: '14px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label style={{ fontSize: '11px', fontWeight: '800', fontFamily: "'Orbitron', monospace", color: '#fff', letterSpacing: '0.5px' }}>
                        PRIX DE BASE OFFICIEL (TND)
                      </label>
                      <span style={{ fontSize: '10px', color: '#64748b' }}>
                        Actuel : {gear.basePrice} TND
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <div style={{ position: 'relative', flex: 1 }}>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={currentPriceInput}
                          onChange={(e) => handlePriceChange(gear._id, e.target.value)}
                          className="dash-form-control"
                          style={{
                            fontSize: '15px',
                            fontWeight: '800',
                            fontFamily: "'Orbitron', sans-serif",
                            color: '#4ade80',
                            paddingRight: '50px'
                          }}
                        />
                        <span style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          fontSize: '11px',
                          color: '#64748b',
                          fontWeight: '700'
                        }}>
                          TND
                        </span>
                      </div>

                      <button
                        type="button"
                        className="dash-subtab-btn"
                        onClick={() => handleQuickSavePrice(gear)}
                        disabled={isSaving}
                        style={{
                          background: '#e60000',
                          color: '#ffffff',
                          border: 'none',
                          fontWeight: '800',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '0 16px'
                        }}
                      >
                        <Save size={14} />
                        <span>{isSaving ? '...' : 'Enregistrer'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <button
                    type="button"
                    className="dash-subtab-btn"
                    onClick={() => setEditingGear({ ...gear })}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px' }}
                  >
                    <Edit3 size={13} />
                    <span>Modifier Détails</span>
                  </button>

                  <button
                    type="button"
                    className="dash-subtab-btn"
                    onClick={() => handleToggleActive(gear)}
                    style={{
                      padding: '8px 14px',
                      color: gear.isActive ? '#f87171' : '#4ade80'
                    }}
                  >
                    {gear.isActive ? 'Désactiver' : 'Activer'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ────────────────── SOUS-ONGLET 2 : TARIFS DES ÉLÉMENTS & OPTIONS ────────────────── */}
      {activeSubTab === 'element_prices' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' }}>
          <div className="dash-card">
            <div className="dash-card-header">
              <span className="dash-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sliders size={18} color="#00e5ff" />
                Grille des Prix par Élément Personnalisé
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 20px' }}>
              Définissez le coût unitaire de chaque composant appliqué dans le configurateur 3D. Le studio calcule automatiquement la somme totale en direct pour le panier.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {/* Prix par Calque Logo */}
              <div className="dash-form-group">
                <label className="dash-form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>PRIX PAR LOGO / CALQUE :</span>
                  <span style={{ color: '#00e5ff' }}>{elementPricing.layerPrice} TND</span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={elementPricing.layerPrice}
                  onChange={(e) => setElementPricing({ ...elementPricing, layerPrice: parseFloat(e.target.value) || 0 })}
                  className="dash-form-control"
                />
                <span style={{ fontSize: '11px', color: '#64748b' }}>Tarif facturé pour chaque image, logo ou sponsor ajouté</span>
              </div>

              {/* Prix Flocage Pseudo */}
              <div className="dash-form-group">
                <label className="dash-form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>PRIX FLOCAGE GAMERTAG / PSEUDO :</span>
                  <span style={{ color: '#00e5ff' }}>{elementPricing.gamertagPrice} TND</span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={elementPricing.gamertagPrice}
                  onChange={(e) => setElementPricing({ ...elementPricing, gamertagPrice: parseFloat(e.target.value) || 0 })}
                  className="dash-form-control"
                />
                <span style={{ fontSize: '11px', color: '#64748b' }}>Mettre à 0 TND pour flocage nom offert</span>
              </div>

              {/* Prix Flocage Numéro */}
              <div className="dash-form-group">
                <label className="dash-form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>PRIX FLOCAGE NUMÉRO DE MATCH :</span>
                  <span style={{ color: '#00e5ff' }}>{elementPricing.numberPrice} TND</span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={elementPricing.numberPrice}
                  onChange={(e) => setElementPricing({ ...elementPricing, numberPrice: parseFloat(e.target.value) || 0 })}
                  className="dash-form-control"
                />
                <span style={{ fontSize: '11px', color: '#64748b' }}>Flocage dorsal chiffres compétitifs (00 - 99)</span>
              </div>

              {/* Prix Badge Rôle */}
              <div className="dash-form-group">
                <label className="dash-form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>PRIX BADGE RÔLE ESPORT :</span>
                  <span style={{ color: '#00e5ff' }}>{elementPricing.rolePrice} TND</span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={elementPricing.rolePrice}
                  onChange={(e) => setElementPricing({ ...elementPricing, rolePrice: parseFloat(e.target.value) || 0 })}
                  className="dash-form-control"
                />
                <span style={{ fontSize: '11px', color: '#64748b' }}>Mention Capitaine, Sniper AWP, IGL, Duelist</span>
              </div>

              {/* Extra Tissage Mesh */}
              <div className="dash-form-group">
                <label className="dash-form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>EXTRA FINITION DRY-TECH MESH :</span>
                  <span style={{ color: '#00e5ff' }}>{elementPricing.finishMeshPrice} TND</span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={elementPricing.finishMeshPrice}
                  onChange={(e) => setElementPricing({ ...elementPricing, finishMeshPrice: parseFloat(e.target.value) || 0 })}
                  className="dash-form-control"
                />
                <span style={{ fontSize: '11px', color: '#64748b' }}>Tissage alvéolaire micro-aéré de compétition</span>
              </div>

              {/* Extra Finition Satinée */}
              <div className="dash-form-group">
                <label className="dash-form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>EXTRA FINITION SATINÉE VCT :</span>
                  <span style={{ color: '#00e5ff' }}>{elementPricing.finishSatinePrice} TND</span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={elementPricing.finishSatinePrice}
                  onChange={(e) => setElementPricing({ ...elementPricing, finishSatinePrice: parseFloat(e.target.value) || 0 })}
                  className="dash-form-control"
                />
                <span style={{ fontSize: '11px', color: '#64748b' }}>Finition soyeuse brillante ligue majeure</span>
              </div>

              {/* Extra Broderie 3D */}
              <div className="dash-form-group">
                <label className="dash-form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>EXTRA TECHNIQUE BRODERIE 3D :</span>
                  <span style={{ color: '#00e5ff' }}>{elementPricing.techniqueBroderiePrice} TND</span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={elementPricing.techniqueBroderiePrice}
                  onChange={(e) => setElementPricing({ ...elementPricing, techniqueBroderiePrice: parseFloat(e.target.value) || 0 })}
                  className="dash-form-control"
                />
                <span style={{ fontSize: '11px', color: '#64748b' }}>Broderie fil renforcée en relief</span>
              </div>

              {/* Extra Flex */}
              <div className="dash-form-group">
                <label className="dash-form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>EXTRA TECHNIQUE FLEX THERMO :</span>
                  <span style={{ color: '#00e5ff' }}>{elementPricing.techniqueFlexPrice} TND</span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={elementPricing.techniqueFlexPrice}
                  onChange={(e) => setElementPricing({ ...elementPricing, techniqueFlexPrice: parseFloat(e.target.value) || 0 })}
                  className="dash-form-control"
                />
                <span style={{ fontSize: '11px', color: '#64748b' }}>Film vinyle mat stretch haute résistance</span>
              </div>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="dash-subtab-btn"
                onClick={handleSaveElementPricing}
                disabled={savingElements}
                style={{
                  background: 'linear-gradient(135deg, #e10613, #b8050f)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 24px',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Save size={16} />
                <span>{savingElements ? 'Enregistrement...' : 'Enregistrer la Grille Tarifaire'}</span>
              </button>
            </div>
          </div>

          {/* Simulateur en direct */}
          <div className="dash-card">
            <div className="dash-card-header">
              <span className="dash-card-title" style={{ fontSize: '14px' }}>
                Simulateur de Prix Panier
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '16px' }}>
              Exemple de calcul pour un maillot personnalisé complet :
            </div>

            <div style={{ background: '#080a10', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
                <span style={{ color: '#cbd5e1' }}>Maillot Esport Pro :</span>
                <span style={{ fontWeight: '700' }}>69,99 TND</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
                <span style={{ color: '#cbd5e1' }}>2x Logos / Visuels :</span>
                <span style={{ fontWeight: '700' }}>+{(elementPricing.layerPrice * 2).toFixed(2)} TND</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
                <span style={{ color: '#cbd5e1' }}>Flocage Gamertag :</span>
                <span style={{ fontWeight: '700' }}>+{elementPricing.gamertagPrice.toFixed(2)} TND</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
                <span style={{ color: '#cbd5e1' }}>Finition Dry-Tech :</span>
                <span style={{ fontWeight: '700' }}>+{elementPricing.finishMeshPrice.toFixed(2)} TND</span>
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '8px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '800' }}>
                <span style={{ color: '#ffffff' }}>TOTAL ESTIMÉ :</span>
                <span style={{ color: '#e10613' }}>
                  {(69.99 + elementPricing.layerPrice * 2 + elementPricing.gamertagPrice + elementPricing.finishMeshPrice).toFixed(2)} TND
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────── SOUS-ONGLET 3 : MODÈLES 3D GLB & IMPORTATION ────────────────── */}
      {activeSubTab === 'glb_models' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Boîte d'importation */}
          <div className="dash-card">
            <div className="dash-card-header">
              <span className="dash-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UploadCloud size={20} color="#00e5ff" />
                Centre d'Importation de Fichiers 3D (.GLB / .GLTF)
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 16px' }}>
              Téléversez vos modèles 3D au format standardisé Khronos <code>.glb</code> pour les intégrer directement au studio. Le moteur Three.js normalise automatiquement la taille, applique le shader PBR textile et projette les calques sans couture.
            </p>

            {glbUploadFeedback && (
              <div style={{
                padding: '10px 14px',
                borderRadius: '8px',
                marginBottom: '16px',
                background: glbUploadFeedback.type === 'success' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                border: `1px solid ${glbUploadFeedback.type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                color: glbUploadFeedback.type === 'success' ? '#4ade80' : '#f87171',
                fontSize: '12px'
              }}>
                {glbUploadFeedback.text}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr auto', gap: '12px', alignItems: 'flex-end' }}>
              <div className="dash-form-group" style={{ margin: 0 }}>
                <label className="dash-form-label">CATÉGORIE CIBLE :</label>
                <select
                  value={selectedGlbCategory}
                  onChange={(e) => setSelectedGlbCategory(e.target.value)}
                  className="dash-form-control"
                >
                  <option value="maillots">Maillots Esport Pro</option>
                  <option value="hoodies">Hoodies Techwear</option>
                  <option value="t-shirt">T-Shirts Athlétiques</option>
                  <option value="casquettes">Casquettes Snapback</option>
                  <option value="tote-bags">Tote Bags Toile</option>
                </select>
              </div>

              <div className="dash-form-group" style={{ margin: 0 }}>
                <label className="dash-form-label">OU SAISIR UNE URL / CHEMIN RELATIF :</label>
                <input
                  type="text"
                  placeholder="Ex: /models/maillot_vct_2026.glb"
                  value={customGlbUrlInput}
                  onChange={(e) => setCustomGlbUrlInput(e.target.value)}
                  className="dash-form-control"
                />
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                {customGlbUrlInput.trim() ? (
                  <button
                    type="button"
                    className="dash-subtab-btn"
                    onClick={handleAssignCustomGlbUrl}
                    style={{ background: '#00e5ff', color: '#07080c', border: 'none', fontWeight: '800', height: '42px', padding: '0 16px' }}
                  >
                    <Save size={15} />
                    <span>Assigner URL</span>
                  </button>
                ) : (
                  <>
                    <input
                      ref={glbFileInputRef}
                      type="file"
                      accept=".glb,.gltf"
                      onChange={handleGlbFileUpload}
                      style={{ display: 'none' }}
                    />
                    <button
                      type="button"
                      className="dash-subtab-btn"
                      onClick={() => glbFileInputRef.current?.click()}
                      disabled={uploadingGlb}
                      style={{
                        background: 'linear-gradient(135deg, #e10613, #b8050f)',
                        color: '#ffffff',
                        border: 'none',
                        fontWeight: '800',
                        height: '42px',
                        padding: '0 18px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <UploadCloud size={16} />
                      <span>{uploadingGlb ? 'Téléversement...' : 'Importer Fichier .GLB'}</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Grille des 5 modèles 3D par catégorie */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {[
              { id: 'maillots', name: 'Maillot Esport Pro', defaultFile: '/models/tshirt.glb', height: '0.70m', note: 'Maillage haute densité avec texture PBR Dry-Tech et col côtelé' },
              { id: 'hoodies', name: 'Hoodie Techwear Pro', defaultFile: '/models/hoodie_posed.glb', height: '0.75m', note: 'Maillage streetwear oversize avec capuche et poche ventrale' },
              { id: 't-shirt', name: 'T-Shirt Athlétique', defaultFile: '/models/tshirt.glb', height: '0.70m', note: 'Coupe droite ajustée compétition esports' },
              { id: 'casquettes', name: 'Casquette Snapback', defaultFile: '', height: '0.25m', note: 'Visière structurée plate 6 panneaux (Importez votre .glb personnalisé ci-dessus)' },
              { id: 'tote-bags', name: 'Tote Bag Toile', defaultFile: '', height: '0.40m', note: 'Cabas rectangulaire double face (Importez votre .glb personnalisé ci-dessus)' },
            ].map((item) => {
              const activeGlb = glbModelsMap[item.id] || item.defaultFile;
              const hasModel = Boolean(activeGlb);

              return (
                <div
                  key={item.id}
                  className="dash-card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    border: hasModel ? '1px solid rgba(0, 229, 255, 0.25)' : '1px dashed rgba(255,255,255,0.08)',
                    background: 'rgba(12, 16, 24, 0.7)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '800', fontFamily: "'Orbitron', sans-serif", color: '#ffffff' }}>
                        {item.name}
                      </span>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '9px',
                        fontFamily: "'Orbitron', monospace",
                        fontWeight: '800',
                        background: hasModel ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)',
                        color: hasModel ? '#4ade80' : '#f59e0b',
                        border: `1px solid ${hasModel ? 'rgba(34,197,94,0.3)' : 'rgba(245,158,11,0.3)'}`
                      }}>
                        {hasModel ? 'MODÈLE 3D ACTIF' : 'ATTENTE MODÈLE'}
                      </span>
                    </div>

                    <div style={{ background: '#07090e', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '12px' }}>
                      <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '4px' }}>FICHIER ACTIF :</div>
                      <div style={{ fontSize: '12px', color: hasModel ? '#00e5ff' : '#94a3b8', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                        {activeGlb || 'Aucun modèle .glb assigné'}
                      </div>
                    </div>

                    <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.45', margin: '0 0 14px' }}>
                      {item.note}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
                    <button
                      type="button"
                      className="dash-subtab-btn"
                      onClick={() => {
                        setSelectedGlbCategory(item.id);
                        if (glbFileInputRef.current) glbFileInputRef.current.click();
                      }}
                      style={{ flex: 1, padding: '7px', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <UploadCloud size={13} />
                      <span>Remplacer .GLB</span>
                    </button>

                    {activeGlb !== item.defaultFile && (
                      <button
                        type="button"
                        className="dash-subtab-btn"
                        onClick={() => handleResetDefaultGlb(item.id)}
                        title="Rétablir le modèle officiel par défaut"
                        style={{ padding: '7px 10px', fontSize: '11px' }}
                      >
                        <RotateCcw size={13} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ────────────────── MODAL DE MODIFICATION DÉTAILLÉE D'UN ÉQUIPEMENT ────────────────── */}
      {editingGear && (
        <div
          className="dash-modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingGear(null);
          }}
        >
          <div className="dash-modal-box" style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 className="dash-modal-title" style={{ margin: 0 }}>
                  Modifier l'Équipement : {editingGear.name}
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Catégorie : {editingGear.category} ({editingGear.slug})
                </span>
              </div>
              <button
                type="button"
                className="dash-btn-icon"
                onClick={() => setEditingGear(null)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveModal}>
              <div className="dash-form-group">
                <label className="dash-form-label">NOM DE L'ÉQUIPEMENT :</label>
                <input
                  type="text"
                  value={editingGear.name}
                  onChange={(e) => setEditingGear({ ...editingGear, name: e.target.value })}
                  className="dash-form-control"
                  required
                />
              </div>

              <div className="dash-form-group">
                <label className="dash-form-label">SOUS-TITRE ESPORT :</label>
                <input
                  type="text"
                  value={editingGear.subtitle || ''}
                  onChange={(e) => setEditingGear({ ...editingGear, subtitle: e.target.value })}
                  className="dash-form-control"
                />
              </div>

              <div className="dash-form-group">
                <label className="dash-form-label">DESCRIPTION OFFICIELLE :</label>
                <textarea
                  value={editingGear.description || ''}
                  onChange={(e) => setEditingGear({ ...editingGear, description: e.target.value })}
                  className="dash-form-control"
                  rows={3}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="dash-form-group">
                  <label className="dash-form-label">PRIX DE BASE (TND) :</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editingGear.basePrice}
                    onChange={(e) => setEditingGear({ ...editingGear, basePrice: parseFloat(e.target.value) || 0 })}
                    className="dash-form-control"
                    required
                  />
                </div>

                <div className="dash-form-group">
                  <label className="dash-form-label">MODÈLE 3D GLB ASSIGNÉ :</label>
                  <input
                    type="text"
                    value={editingGear.glbModelUrl || ''}
                    placeholder="Ex: /models/tshirt.glb"
                    onChange={(e) => setEditingGear({ ...editingGear, glbModelUrl: e.target.value })}
                    className="dash-form-control"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  className="dash-subtab-btn"
                  onClick={() => setEditingGear(null)}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="dash-subtab-btn"
                  disabled={savingModal}
                  style={{ background: '#e60000', color: '#fff', border: 'none', fontWeight: '800' }}
                >
                  {savingModal ? 'Enregistrement...' : 'Sauvegarder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomGearAdminSection;
