import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Laptop, 
  Headphones, 
  MessageSquare, 
  Cpu, 
  Flame, 
  Shield, 
  Radio, 
  Plus, 
  Edit2, 
  Trash2, 
  ExternalLink, 
  RotateCw, 
  Check, 
  X, 
  Sliders, 
  Eye, 
  Sparkles,
  Tag
} from 'lucide-react';
import API from '../services/api';

const AVAILABLE_ICONS = [
  { id: 'Zap', label: 'Éclair / Énergie', icon: <Zap size={18} /> },
  { id: 'Laptop', label: 'Laptop / PC', icon: <Laptop size={18} /> },
  { id: 'Headphones', label: 'Casque Audio', icon: <Headphones size={18} /> },
  { id: 'MessageSquare', label: 'Chat / Discord', icon: <MessageSquare size={18} /> },
  { id: 'Cpu', label: 'Processeur / Hardware', icon: <Cpu size={18} /> },
  { id: 'Flame', label: 'Flamme / Performance', icon: <Flame size={18} /> },
  { id: 'Shield', label: 'Bouclier / Sécurité', icon: <Shield size={18} /> },
  { id: 'Radio', label: 'Diffusion / Live', icon: <Radio size={18} /> },
];

const PRESET_COLORS = [
  { label: 'Gold Amber', hex: '#f59e0b' },
  { label: 'Cyan Legion', hex: '#38bdf8' },
  { label: 'Razer Green', hex: '#22c55e' },
  { label: 'Discord Purple', hex: '#818cf8' },
  { label: 'Cyber Cyan', hex: '#00e5ff' },
  { label: 'Nvidia Green', hex: '#76b900' },
  { label: 'Twitch Violet', hex: '#a855f7' },
  { label: 'DWT Crimson', hex: '#e10613' },
];

export const renderSponsorIcon = (iconName, color = '#00e5ff', size = 20) => {
  switch (iconName) {
    case 'Laptop': return <Laptop size={size} color={color} />;
    case 'Headphones': return <Headphones size={size} color={color} />;
    case 'MessageSquare': return <MessageSquare size={size} color={color} />;
    case 'Cpu': return <Cpu size={size} color={color} />;
    case 'Flame': return <Flame size={size} color={color} />;
    case 'Shield': return <Shield size={size} color={color} />;
    case 'Radio': return <Radio size={size} color={color} />;
    case 'Zap':
    default:
      return <Zap size={size} color={color} />;
  }
};

export const SponsorsAdminSection = ({ showToast }) => {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Partenaire Officiel',
    perk: 'PARTENAIRE HOMOLOGUÉ',
    desc: '',
    promoCode: '',
    websiteUrl: '',
    iconName: 'Zap',
    accentColor: '#00e5ff',
    order: 0,
    isActive: true
  });

  const fetchSponsors = async () => {
    setLoading(true);
    try {
      const res = await API.get('/sponsors');
      if (res.data?.success) {
        setSponsors(res.data.sponsors || []);
      }
    } catch (err) {
      console.error('Erreur chargement sponsors:', err);
      if (showToast) showToast('Erreur lors du chargement des sponsors', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  const handleOpenAddModal = () => {
    setEditingSponsor(null);
    setFormData({
      name: '',
      category: 'Partenaire Officiel',
      perk: 'CODE: DWT (-10%)',
      desc: '',
      promoCode: '',
      websiteUrl: 'https://',
      iconName: 'Zap',
      accentColor: '#f59e0b',
      order: sponsors.length,
      isActive: true
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (sponsor) => {
    setEditingSponsor(sponsor);
    setFormData({
      name: sponsor.name || '',
      category: sponsor.category || 'Partenaire Officiel',
      perk: sponsor.perk || '',
      desc: sponsor.desc || '',
      promoCode: sponsor.promoCode || '',
      websiteUrl: sponsor.websiteUrl || '',
      iconName: sponsor.iconName || 'Zap',
      accentColor: sponsor.accentColor || '#00e5ff',
      order: sponsor.order || 0,
      isActive: sponsor.isActive !== false
    });
    setModalOpen(true);
  };

  const handleSaveSponsor = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      if (showToast) showToast('Le nom du sponsor est obligatoire', 'error');
      return;
    }

    try {
      if (editingSponsor) {
        const res = await API.put(`/sponsors/${editingSponsor._id}`, formData);
        if (res.data?.success) {
          if (showToast) showToast('Sponsor mis à jour avec succès', 'success');
          fetchSponsors();
          setModalOpen(false);
        }
      } else {
        const res = await API.post('/sponsors', formData);
        if (res.data?.success) {
          if (showToast) showToast('Nouveau sponsor ajouté avec succès', 'success');
          fetchSponsors();
          setModalOpen(false);
        }
      }
    } catch (err) {
      console.error('Erreur sauvegarde sponsor:', err);
      const msg = err.response?.data?.message || 'Erreur lors de la sauvegarde du sponsor';
      if (showToast) showToast(msg, 'error');
    }
  };

  const handleToggleActive = async (sponsor) => {
    try {
      const updatedStatus = !sponsor.isActive;
      const res = await API.put(`/sponsors/${sponsor._id}`, { isActive: updatedStatus });
      if (res.data?.success) {
        setSponsors((prev) =>
          prev.map((s) => (s._id === sponsor._id ? { ...s, isActive: updatedStatus } : s))
        );
        if (showToast) {
          showToast(
            `${sponsor.name} est maintenant ${updatedStatus ? 'actif' : 'masqué'} sur le site`,
            'info'
          );
        }
      }
    } catch (err) {
      console.error('Erreur bascule statut sponsor:', err);
      if (showToast) showToast('Impossible de modifier le statut', 'error');
    }
  };

  const handleDeleteSponsor = async (id) => {
    try {
      const res = await API.delete(`/sponsors/${id}`);
      if (res.data?.success) {
        if (showToast) showToast('Sponsor supprimé avec succès', 'success');
        setSponsors((prev) => prev.filter((s) => s._id !== id));
        setDeleteConfirmId(null);
      }
    } catch (err) {
      console.error('Erreur suppression sponsor:', err);
      if (showToast) showToast('Erreur lors de la suppression', 'error');
    }
  };

  const activeCount = sponsors.filter((s) => s.isActive).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Card */}
      <div className="dash-card">
        <div className="dash-card-header" style={{ flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="dash-card-title">GESTION DES SPONSORS & MARQUES</span>
              <span className="dash-badge live" style={{ textTransform: 'uppercase' }}>
                {activeCount} ACTIFS
              </span>
            </div>
            <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
              Configurez les sponsors partenaires défilant sous le Hero et présentés dans le modal officiel.
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              className="dash-btn outline"
              onClick={fetchSponsors}
              disabled={loading}
              title="Rafraîchir les sponsors"
            >
              <RotateCw size={14} className={loading ? 'spin' : ''} />
              <span>Actualiser</span>
            </button>

            <button
              type="button"
              className="dash-btn primary"
              onClick={handleOpenAddModal}
              title="Ajouter une nouvelle marque sponsor"
            >
              <Plus size={15} />
              <span>Nouveau Sponsor</span>
            </button>
          </div>
        </div>

        {/* Aperçu en direct du bandeau sous le Hero */}
        <div style={{ marginTop: '16px', background: '#07090e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '10.5px', color: '#94a3b8', letterSpacing: '1px' }}>
              // APERÇU EN DIRECT DU BANDEAU HERO ({activeCount} MARQUES DÉFILANTES)
            </span>
            <span style={{ fontSize: '11px', color: '#e10613', fontFamily: 'monospace' }}>
              DÉFILEMENT CONTINU ACTIF
            </span>
          </div>

          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
            {sponsors.filter((s) => s.isActive).map((sp) => (
              <div
                key={sp._id}
                style={{
                  background: '#0d111a',
                  border: `1px solid ${sp.accentColor || '#00e5ff'}`,
                  borderRadius: '8px',
                  padding: '8px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  minWidth: '220px',
                  boxShadow: `0 0 10px ${sp.accentColor ? `${sp.accentColor}25` : 'rgba(0,229,255,0.15)'}`
                }}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {renderSponsorIcon(sp.iconName, sp.accentColor, 18)}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '12px', fontWeight: '800', color: '#fff' }}>
                    {sp.name}
                  </span>
                  <span style={{ fontSize: '9.5px', color: sp.accentColor || '#00e5ff', fontWeight: '700' }}>
                    {sp.perk || sp.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grille des Sponsors */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
        {sponsors.map((sp) => (
          <div
            key={sp._id}
            className="dash-card"
            style={{
              borderLeft: `4px solid ${sp.accentColor || '#00e5ff'}`,
              opacity: sp.isActive ? 1 : 0.65,
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '14px'
            }}
          >
            <div>
              {/* Carte Top */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.04)',
                      border: `1px solid ${sp.accentColor || '#00e5ff'}40`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {renderSponsorIcon(sp.iconName, sp.accentColor, 22)}
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'Orbitron, monospace', fontSize: '15px', fontWeight: '800', color: '#fff', margin: 0 }}>
                      {sp.name}
                    </h3>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                      {sp.category}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleActive(sp)}
                  style={{
                    background: sp.isActive ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    border: `1px solid ${sp.isActive ? '#22c55e' : '#ef4444'}`,
                    color: sp.isActive ? '#22c55e' : '#ef4444',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontFamily: 'monospace',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                  title="Cliquer pour basculer le statut"
                >
                  {sp.isActive ? 'ACTIF' : 'MASQUÉ'}
                </button>
              </div>

              {/* Badges Avantage & Code Promo */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                {sp.perk && (
                  <span
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: `1px solid ${sp.accentColor || '#00e5ff'}40`,
                      color: sp.accentColor || '#00e5ff',
                      fontSize: '10.5px',
                      fontFamily: 'Orbitron, monospace',
                      fontWeight: '700',
                      padding: '3px 8px',
                      borderRadius: '4px'
                    }}
                  >
                    {sp.perk}
                  </span>
                )}

                {sp.promoCode && (
                  <span
                    style={{
                      background: 'rgba(245, 158, 11, 0.15)',
                      border: '1px solid #f59e0b',
                      color: '#f59e0b',
                      fontSize: '10.5px',
                      fontFamily: 'monospace',
                      fontWeight: '800',
                      padding: '3px 8px',
                      borderRadius: '4px'
                    }}
                  >
                    CODE: {sp.promoCode}
                  </span>
                )}

                <span style={{ fontSize: '10.5px', color: '#64748b', alignSelf: 'center', marginLeft: 'auto' }}>
                  Ordre: #{sp.order}
                </span>
              </div>

              {/* Description */}
              {sp.desc && (
                <p style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '12px', lineHeight: 1.5 }}>
                  {sp.desc}
                </p>
              )}
            </div>

            {/* Carte Actions Footer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '12px', marginTop: '6px' }}>
              {sp.websiteUrl ? (
                <a
                  href={sp.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    color: '#38bdf8',
                    fontSize: '11.5px',
                    textDecoration: 'none'
                  }}
                >
                  <span>Visiter le site</span>
                  <ExternalLink size={12} />
                </a>
              ) : (
                <span style={{ fontSize: '11px', color: '#64748b' }}>Pas de lien externe</span>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  className="dash-btn outline"
                  style={{ padding: '5px 10px', fontSize: '11px' }}
                  onClick={() => handleOpenEditModal(sp)}
                  title="Modifier ce sponsor"
                >
                  <Edit2 size={12} />
                  <span>Modifier</span>
                </button>

                {deleteConfirmId === sp._id ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <button
                      type="button"
                      style={{ background: '#e10613', color: '#fff', border: 'none', padding: '5px 8px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer', fontWeight: '700' }}
                      onClick={() => handleDeleteSponsor(sp._id)}
                    >
                      Confirmer
                    </button>
                    <button
                      type="button"
                      style={{ background: '#334155', color: '#fff', border: 'none', padding: '5px 8px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer' }}
                      onClick={() => setDeleteConfirmId(null)}
                    >
                      Annuler
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="dash-btn danger"
                    style={{ padding: '5px 10px', fontSize: '11px' }}
                    onClick={() => setDeleteConfirmId(sp._id)}
                    title="Supprimer ce sponsor"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Ajout / Modification */}
      {modalOpen && (
        <div
          className="dash-modal-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(3, 5, 10, 0.94)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            zIndex: 99999
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <div
            className="dash-modal-box"
            style={{
              maxWidth: '640px',
              width: '100%',
              background: '#090d16',
              border: '1px solid rgba(0, 229, 255, 0.35)',
              borderRadius: '12px',
              padding: '28px',
              boxShadow: '0 25px 70px rgba(0,0,0,0.9), 0 0 30px rgba(0,229,255,0.15)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontFamily: 'Orbitron, monospace', fontSize: '18px', fontWeight: '900', color: '#fff', margin: 0 }}>
                  {editingSponsor ? 'MODIFIER LE SPONSOR' : 'AJOUTER UN SPONSOR'}
                </h2>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                  Configuration des métadonnées visibles sur la page d'accueil et le modal
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveSponsor} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Nom & Catégorie */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label className="dash-form-label">Nom de la Marque *</label>
                  <input
                    type="text"
                    className="dash-form-input"
                    placeholder="Ex: DUBBY ENERGY"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="dash-form-label">Catégorie / Titre Partenaire</label>
                  <input
                    type="text"
                    className="dash-form-input"
                    placeholder="Ex: Boisson Énergétique Officielle"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
              </div>

              {/* Perk & Code Promo */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '14px' }}>
                <div>
                  <label className="dash-form-label">Avantage / Perk Défilant</label>
                  <input
                    type="text"
                    className="dash-form-input"
                    placeholder="Ex: CODE: DWT (-10%) ou STATIONS RTX"
                    value={formData.perk}
                    onChange={(e) => setFormData({ ...formData, perk: e.target.value })}
                  />
                </div>

                <div>
                  <label className="dash-form-label">Code Promo (Optionnel)</label>
                  <input
                    type="text"
                    className="dash-form-input"
                    placeholder="Ex: DWT"
                    value={formData.promoCode}
                    onChange={(e) => setFormData({ ...formData, promoCode: e.target.value.toUpperCase() })}
                  />
                </div>
              </div>

              {/* URL du site officiel & Ordre */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
                <div>
                  <label className="dash-form-label">Lien URL Officiel</label>
                  <input
                    type="url"
                    className="dash-form-input"
                    placeholder="https://partenaire.com"
                    value={formData.websiteUrl}
                    onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  />
                </div>

                <div>
                  <label className="dash-form-label">Ordre d'affichage</label>
                  <input
                    type="number"
                    className="dash-form-input"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 0 })}
                  />
                </div>
              </div>

              {/* Choix de l'Icône */}
              <div>
                <label className="dash-form-label">Icône de Marque</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {AVAILABLE_ICONS.map((ic) => (
                    <button
                      key={ic.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, iconName: ic.id })}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: formData.iconName === ic.id ? 'rgba(0, 229, 255, 0.18)' : '#0d111a',
                        border: `1px solid ${formData.iconName === ic.id ? '#00e5ff' : 'rgba(255,255,255,0.1)'}`,
                        color: formData.iconName === ic.id ? '#00e5ff' : '#cbd5e1',
                        borderRadius: '6px',
                        padding: '8px 10px',
                        cursor: 'pointer',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}
                    >
                      {ic.icon}
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {ic.id}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Choix de la couleur d'accent */}
              <div>
                <label className="dash-form-label">Couleur d'accentuation Cyber</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {PRESET_COLORS.map((col) => (
                    <button
                      key={col.hex}
                      type="button"
                      onClick={() => setFormData({ ...formData, accentColor: col.hex })}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        background: col.hex,
                        border: formData.accentColor === col.hex ? '2px solid #ffffff' : '1px solid rgba(0,0,0,0.5)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: formData.accentColor === col.hex ? `0 0 12px ${col.hex}` : 'none'
                      }}
                      title={col.label}
                    >
                      {formData.accentColor === col.hex && <Check size={16} color="#000" />}
                    </button>
                  ))}
                  <input
                    type="color"
                    value={formData.accentColor}
                    onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                    style={{ width: '36px', height: '36px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                    title="Couleur personnalisée"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="dash-form-label">Description détaillée (pour le modal fans)</label>
                <textarea
                  className="dash-form-input"
                  rows={3}
                  placeholder="Présentation du partenariat, engagement pour la meute, détails techniques..."
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                />
              </div>

              {/* Toggle Actif */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  id="sponsor-is-active"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#e10613' }}
                />
                <label htmlFor="sponsor-is-active" style={{ fontSize: '13px', color: '#fff', cursor: 'pointer' }}>
                  Afficher ce sponsor en direct sur le site (Actif)
                </label>
              </div>

              {/* Boutons validation */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  className="dash-btn outline"
                  onClick={() => setModalOpen(false)}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="dash-btn primary"
                >
                  {editingSponsor ? 'Enregistrer les Modifications' : 'Créer le Sponsor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SponsorsAdminSection;
