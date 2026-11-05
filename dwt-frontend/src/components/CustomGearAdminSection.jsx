import React, { useState } from 'react';
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
  Tag
} from 'lucide-react';
import API from '../services/api';
import WolfLogo from './WolfLogo';

const CustomGearAdminSection = ({
  customGearList = [],
  onRefresh,
  showToast,
  openConfirm,
  onOpenCustomStudio
}) => {
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

  // Mettre à jour la valeur locale du prix
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
        if (showToast) {
          showToast(`Prix de base pour "${gear.name}" fixé à ${newPrice} TND avec succès !`, 'success');
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
          showToast(`"${gear.name}" est désormais ${!gear.isActive ? 'actif' : 'inactif'} dans l'Atelier`, 'success');
        }
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      if (showToast) showToast('Erreur lors du changement de statut', 'error');
    }
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
            if (showToast) showToast('Catalogue custom réinitialisé avec succès aux valeurs de la maquette !', 'success');
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
        if (showToast) showToast(`Modifications enregistrées pour "${editingGear.name}" !`, 'success');
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
                BASE DE DONNÉES MONGODB ATLAS • SYNCHRO EN TEMPS RÉEL
              </span>
            </div>
            <span className="dash-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Palette size={20} color="var(--red-primary)" />
              Gestion de l'Équipement Personnalisable & Fixation des Prix
            </span>
            <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px', maxWidth: '850px' }}>
              Fixez directement les prix officiels de vente en Dinars Tunisiens (TND) pour chaque vêtement custom (Maillots, Hoodies, T-shirts, Casquettes, Tote bags). Tous les changements sont enregistrés en base de données et se répercutent instantanément sur l'Atelier Custom et le panier.
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
              <div className="dash-kpi-label">Prix Maillot Custom Actuel</div>
            </div>
          </div>

          <div className="dash-kpi-card">
            <div className="dash-kpi-icon" style={{ background: 'rgba(56,189,248,0.15)', color: '#38bdf8' }}>
              <DollarSign size={22} />
            </div>
            <div>
              <div className="dash-kpi-value" style={{ color: '#38bdf8' }}>
                {hoodieItem?.basePrice || 89.99} TND
              </div>
              <div className="dash-kpi-label">Prix Hoodie Custom Actuel</div>
            </div>
          </div>

          <div className="dash-kpi-card">
            <div className="dash-kpi-icon" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <div className="dash-kpi-value" style={{ color: '#f59e0b' }}>TND</div>
              <div className="dash-kpi-label">Devise Officielle Boutique</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. GRILLE DES 5 ÉQUIPEMENTS PERSONNALISABLES */}
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
              {/* Entête de carte avec icône & statut */}
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

                {/* Badges d'options (Modèles, Couleurs, Finitions) */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '18px' }}>
                  <span style={{ fontSize: '11px', padding: '3px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', color: '#cbd5e1' }}>
                    {gear.models?.length || 5} modèles
                  </span>
                  <span style={{ fontSize: '11px', padding: '3px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', color: '#cbd5e1' }}>
                    {gear.colors?.length || 6} couleurs
                  </span>
                  <span style={{ fontSize: '11px', padding: '3px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', color: '#cbd5e1' }}>
                    {gear.styles?.length || 3} finitions
                  </span>
                </div>

                {/* ZONE DE FIXATION DU PRIX DE BASE */}
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
                      title="Enregistrer ce tarif dans la base de données MongoDB"
                    >
                      <Save size={14} />
                      <span>{isSaving ? '...' : 'Enregistrer'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions inférieures : Modifier détails & Toggle Actif */}
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
                  title={gear.isActive ? "Désactiver cet article dans l'atelier" : "Activer cet article dans l'atelier"}
                >
                  {gear.isActive ? 'Désactiver' : 'Activer'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. MODAL DE MODIFICATION DÉTAILLÉE D'UN ÉQUIPEMENT */}
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
                className="dash-more-btn"
                onClick={() => setEditingGear(null)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveModal}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div className="dash-form-group">
                  <label className="dash-form-label">Nom de l'article</label>
                  <input
                    type="text"
                    className="dash-form-control"
                    value={editingGear.name}
                    onChange={(e) => setEditingGear({ ...editingGear, name: e.target.value })}
                    required
                  />
                </div>

                <div className="dash-form-group">
                  <label className="dash-form-label">Prix de Base (TND)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="dash-form-control"
                    value={editingGear.basePrice}
                    onChange={(e) => setEditingGear({ ...editingGear, basePrice: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>
              </div>

              <div className="dash-form-group" style={{ marginBottom: '14px' }}>
                <label className="dash-form-label">Sous-titre / Collection</label>
                <input
                  type="text"
                  className="dash-form-control"
                  value={editingGear.subtitle || ''}
                  onChange={(e) => setEditingGear({ ...editingGear, subtitle: e.target.value })}
                  placeholder="Ex: Maillot Pro Esports DWT 2026"
                />
              </div>

              <div className="dash-form-group" style={{ marginBottom: '14px' }}>
                <label className="dash-form-label">Description détaillée de l'article</label>
                <textarea
                  className="dash-form-control"
                  rows="3"
                  value={editingGear.description || ''}
                  onChange={(e) => setEditingGear({ ...editingGear, description: e.target.value })}
                  placeholder="Description affichée dans la boutique et le configurateur..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                <div className="dash-form-group">
                  <label className="dash-form-label">Frais personnalisation pseudo (TND)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="dash-form-control"
                    value={editingGear.customTextPrice || 0}
                    onChange={(e) => setEditingGear({ ...editingGear, customTextPrice: parseFloat(e.target.value) || 0 })}
                  />
                  <span style={{ fontSize: '10px', color: '#64748b' }}>0 = Inclus sans supplément</span>
                </div>

                <div className="dash-form-group">
                  <label className="dash-form-label">Statut dans l'Atelier</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                    <input
                      type="checkbox"
                      id="gearActiveToggle"
                      checked={editingGear.isActive}
                      onChange={(e) => setEditingGear({ ...editingGear, isActive: e.target.checked })}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <label htmlFor="gearActiveToggle" style={{ fontSize: '13px', color: '#fff', cursor: 'pointer' }}>
                      Article disponible à la personnalisation
                    </label>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
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
                  style={{ background: '#e60000', color: '#fff', fontWeight: '800', border: 'none', padding: '8px 20px' }}
                >
                  {savingModal ? 'Enregistrement...' : 'Enregistrer dans MongoDB'}
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
