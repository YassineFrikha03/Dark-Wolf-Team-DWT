import React, { useState, useEffect, useRef } from 'react';
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
  Tag,
  Upload,
  Globe,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon
} from 'lucide-react';
import API from '../services/api';

const AVAILABLE_ICONS = [
  { id: 'Zap', label: 'Eclair / Energie', icon: <Zap size={18} /> },
  { id: 'Laptop', label: 'Laptop / PC', icon: <Laptop size={18} /> },
  { id: 'Headphones', label: 'Casque Audio', icon: <Headphones size={18} /> },
  { id: 'MessageSquare', label: 'Chat / Discord', icon: <MessageSquare size={18} /> },
  { id: 'Cpu', label: 'Processeur / Hardware', icon: <Cpu size={18} /> },
  { id: 'Flame', label: 'Flamme / Performance', icon: <Flame size={18} /> },
  { id: 'Shield', label: 'Bouclier / Securite', icon: <Shield size={18} /> },
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
  { label: 'DWT Crimson', hex: '#cc2222' },
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
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Etats dedies a la gestion des logos (Upload PC & Lecteur d'URL)
  const [detectingLogo, setDetectingLogo] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Partenaire Officiel',
    perk: 'PARTENAIRE HOMOLOGUE',
    desc: '',
    promoCode: '',
    websiteUrl: '',
    logoUrl: '',
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
      logoUrl: '',
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
      logoUrl: sponsor.logoUrl || '',
      iconName: sponsor.iconName || 'Zap',
      accentColor: sponsor.accentColor || '#00e5ff',
      order: sponsor.order || 0,
      isActive: sponsor.isActive !== false
    });
    setModalOpen(true);
  };

  // 1. Lecteur d'URL automatique : telecharge et extrait le logo depuis le site du sponsor
  const handleDetectLogoFromUrl = async () => {
    const rawUrl = formData.websiteUrl ? formData.websiteUrl.trim() : '';
    if (!rawUrl || rawUrl === 'https://' || rawUrl === 'http://') {
      if (showToast) showToast('Veuillez d\'abord saisir une URL de sponsor valide dans le champ ci-dessus', 'warning');
      return;
    }

    setDetectingLogo(true);
    try {
      const res = await API.post('/sponsors/fetch-logo', { url: rawUrl });
      if (res.data?.success && res.data.logoUrl) {
        setFormData((prev) => ({ ...prev, logoUrl: res.data.logoUrl }));
        if (showToast) {
          showToast(`Logo extrait avec succes depuis ${res.data.domain || 'le site web'}`, 'success');
        }
      } else {
        if (showToast) showToast('Impossible d\'extraire automatiquement le logo pour cette adresse', 'warning');
      }
    } catch (err) {
      console.error('Erreur detection logo:', err);
      const msg = err.response?.data?.message || 'Erreur lors de la lecture de l\'URL du sponsor';
      if (showToast) showToast(msg, 'error');
    } finally {
      setDetectingLogo(false);
    }
  };

  // 2. Importateur de logo depuis le PC : envoi direct en multipart/form-data
  const handleUploadLogoFromPC = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(png|jpeg|jpg|webp|svg\+xml)$/i) && !file.name.match(/\.(png|jpe?g|webp|svg)$/i)) {
      if (showToast) showToast('Format non supporte. Formats acceptes : PNG transparent, SVG, WEBP, JPG', 'warning');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      if (showToast) showToast('Fichier trop lourd (maximum 5 Mo)', 'warning');
      return;
    }

    setUploadingLogo(true);
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      const res = await API.post('/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const url = res.data?.filePath || res.data?.fileUrl;
      if (url) {
        setFormData((prev) => ({ ...prev, logoUrl: url }));
        if (showToast) showToast('Logo importe avec succes depuis votre ordinateur', 'success');
      } else {
        if (showToast) showToast('Erreur : URL de fichier non recue', 'error');
      }
    } catch (err) {
      console.error('Erreur upload logo:', err);
      if (showToast) showToast('Erreur lors du televersement du logo', 'error');
    } finally {
      setUploadingLogo(false);
      if (e.target) e.target.value = '';
    }
  };

  // Retirer le logo pour repasser sur l'icone vectorielle
  const handleRemoveLogo = () => {
    setFormData((prev) => ({ ...prev, logoUrl: '' }));
    if (showToast) showToast('Logo retire. L\'icone cyber vectorielle sera utilisee', 'info');
  };

  const handleSaveSponsor = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      if (showToast) showToast('Le nom du sponsor est obligatoire', 'error');
      return;
    }

    setSaving(true);
    try {
      if (editingSponsor) {
        const res = await API.put(`/sponsors/${editingSponsor._id}`, formData);
        if (res.data?.success) {
          if (showToast) showToast('Sponsor mis a jour avec succes', 'success');
          fetchSponsors();
          setModalOpen(false);
        }
      } else {
        const res = await API.post('/sponsors', formData);
        if (res.data?.success) {
          if (showToast) showToast('Nouveau sponsor ajoute avec succes', 'success');
          fetchSponsors();
          setModalOpen(false);
        }
      }
    } catch (err) {
      console.error('Erreur sauvegarde sponsor:', err);
      const msg = err.response?.data?.message || 'Erreur lors de la sauvegarde du sponsor';
      if (showToast) showToast(msg, 'error');
    } finally {
      setSaving(false);
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
            `${sponsor.name} est maintenant ${updatedStatus ? 'actif' : 'masque'} sur le site`,
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
        if (showToast) showToast('Sponsor supprime avec succes', 'success');
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
              Configurez les logos, liens officiels et avantages partenaires visibles sous le Hero et dans le modal officiel.
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              className="dash-btn outline sm"
              onClick={fetchSponsors}
              disabled={loading}
              title="Rafraichir la liste des sponsors"
            >
              <RotateCw size={14} className={loading ? 'spin' : ''} />
              <span>Actualiser</span>
            </button>

            <button
              type="button"
              className="dash-btn primary sm"
              onClick={handleOpenAddModal}
              title="Ajouter une nouvelle marque sponsor"
            >
              <Plus size={15} />
              <span>Nouveau Sponsor</span>
            </button>
          </div>
        </div>

        {/* Apercu en direct du bandeau sous le Hero */}
        <div style={{ marginTop: '16px', background: '#07090e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '10.5px', color: '#94a3b8', letterSpacing: '1px' }}>
              // APERCU EN DIRECT DU BANDEAU HERO ({activeCount} MARQUES EN LIGNE)
            </span>
            <span style={{ fontSize: '11px', color: '#cc2222', fontFamily: 'monospace', fontWeight: '700' }}>
              DEFILEMENT FLUIDE SOUS LE HERO
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 200px), 1fr))', gap: '10px' }}>
            {sponsors.filter((s) => s.isActive).map((sp) => (
              <div
                key={sp._id}
                style={{
                  background: '#0d111a',
                  border: `1px solid ${sp.accentColor || '#00e5ff'}`,
                  borderRadius: '8px',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: `0 0 10px ${sp.accentColor ? `${sp.accentColor}25` : 'rgba(0,229,255,0.15)'}`
                }}
              >
                <div className="sponsor-admin-logo-box" style={{ width: '32px', height: '32px' }}>
                  {sp.logoUrl ? (
                    <img
                      src={sp.logoUrl}
                      alt={sp.name}
                      style={{ maxWidth: '24px', maxHeight: '24px', objectFit: 'contain' }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.nextSibling) {
                          e.currentTarget.nextSibling.style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}
                  <span style={{ display: sp.logoUrl ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {renderSponsorIcon(sp.iconName, sp.accentColor, 16)}
                  </span>
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: '16px' }}>
        {sponsors.map((sp) => (
          <div
            key={sp._id}
            className="dash-card"
            style={{
              borderLeft: `4px solid ${sp.accentColor || '#00e5ff'}`,
              opacity: sp.isActive ? 1 : 0.65,
              transition: 'all 0.22s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '14px',
              background: '#090d16'
            }}
          >
            <div>
              {/* Carte Top */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    className="sponsor-admin-logo-box"
                    style={{
                      border: `1px solid ${sp.accentColor || '#00e5ff'}40`,
                      boxShadow: `0 0 10px ${sp.accentColor || '#00e5ff'}20`
                    }}
                  >
                    {sp.logoUrl ? (
                      <img
                        src={sp.logoUrl}
                        alt={sp.name}
                        className="sponsor-admin-logo-img"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          if (e.currentTarget.nextSibling) {
                            e.currentTarget.nextSibling.style.display = 'flex';
                          }
                        }}
                      />
                    ) : null}
                    <span style={{ display: sp.logoUrl ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {renderSponsorIcon(sp.iconName, sp.accentColor, 22)}
                    </span>
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

                {/* Badge Actif / Masque stylise */}
                <button
                  type="button"
                  className={`sponsor-status-pill ${sp.isActive ? 'active' : 'inactive'}`}
                  onClick={() => handleToggleActive(sp)}
                  title="Cliquer pour basculer la visibilite sur le site"
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: sp.isActive ? '#22c55e' : '#ef4444' }} />
                  <span>{sp.isActive ? 'ACTIF' : 'MASQUE'}</span>
                </button>
              </div>

              {/* Badges Avantage, Code Promo & Logo */}
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

                {sp.logoUrl ? (
                  <span
                    style={{
                      background: 'rgba(0, 229, 255, 0.1)',
                      border: '1px solid rgba(0, 229, 255, 0.3)',
                      color: '#00e5ff',
                      fontSize: '10px',
                      fontFamily: 'monospace',
                      fontWeight: '700',
                      padding: '3px 7px',
                      borderRadius: '4px'
                    }}
                  >
                    LOGO PNG/SVG
                  </span>
                ) : (
                  <span
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#94a3b8',
                      fontSize: '10px',
                      fontFamily: 'monospace',
                      padding: '3px 7px',
                      borderRadius: '4px'
                    }}
                  >
                    ICONE CYBER
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
                    textDecoration: 'none',
                    fontWeight: '600'
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
                  className="dash-btn outline sm"
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
                      className="dash-btn danger sm"
                      onClick={() => handleDeleteSponsor(sp._id)}
                    >
                      Confirmer
                    </button>
                    <button
                      type="button"
                      className="dash-btn outline sm"
                      onClick={() => setDeleteConfirmId(null)}
                    >
                      Annuler
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="dash-btn danger icon-only sm"
                    onClick={() => setDeleteConfirmId(sp._id)}
                    title="Supprimer ce sponsor"
                  >
                    <Trash2 size={13} />
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
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <div
            className="dash-modal-box"
            style={{
              maxWidth: '680px',
              width: '100%',
              background: '#090d16',
              border: '1px solid rgba(0, 229, 255, 0.4)',
              borderRadius: '12px',
              padding: '28px',
              boxShadow: '0 25px 70px rgba(0,0,0,0.95), 0 0 30px rgba(0,229,255,0.15)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px' }}>
              <div>
                <h2 style={{ fontFamily: 'Orbitron, monospace', fontSize: '18px', fontWeight: '900', color: '#fff', margin: 0, letterSpacing: '0.04em' }}>
                  {editingSponsor ? 'MODIFIER LE SPONSOR' : 'AJOUTER UN NOUVEAU SPONSOR'}
                </h2>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                  Configuration complete du sponsor : logo haute resolution, URL, perks et visibilite.
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px', borderRadius: '4px' }}
                title="Fermer la fenetre"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveSponsor} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Nom & Categorie */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="dash-form-group" style={{ marginBottom: 0 }}>
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

                <div className="dash-form-group" style={{ marginBottom: 0 }}>
                  <label className="dash-form-label">Categorie / Titre Partenaire</label>
                  <input
                    type="text"
                    className="dash-form-input"
                    placeholder="Ex: Boisson Energetique Officielle"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
              </div>

              {/* Perk & Code Promo */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '14px' }}>
                <div className="dash-form-group" style={{ marginBottom: 0 }}>
                  <label className="dash-form-label">Avantage / Perk Defilant</label>
                  <input
                    type="text"
                    className="dash-form-input"
                    placeholder="Ex: CODE: DWT (-10%) ou STATIONS RTX"
                    value={formData.perk}
                    onChange={(e) => setFormData({ ...formData, perk: e.target.value })}
                  />
                </div>

                <div className="dash-form-group" style={{ marginBottom: 0 }}>
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
                <div className="dash-form-group" style={{ marginBottom: 0 }}>
                  <label className="dash-form-label">Lien URL Officiel du Sponsor</label>
                  <input
                    type="url"
                    className="dash-form-input"
                    placeholder="https://partenaire.com"
                    value={formData.websiteUrl}
                    onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  />
                </div>

                <div className="dash-form-group" style={{ marginBottom: 0 }}>
                  <label className="dash-form-label">Ordre d'affichage</label>
                  <input
                    type="number"
                    className="dash-form-input"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 0 })}
                  />
                </div>
              </div>

              {/* ============================================================
                  SECTION LOGO DU SPONSOR (UPLOAD PC + LECTEUR D'URL)
                  ============================================================ */}
              <div className="sponsor-logo-panel">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ImageIcon size={16} color="#00e5ff" />
                    <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '12px', fontWeight: '800', color: '#fff', letterSpacing: '0.05em' }}>
                      LOGO DU SPONSOR (IMPORT PC OU LECTEUR URL)
                    </span>
                  </div>
                  {formData.logoUrl && (
                    <span style={{ fontSize: '10.5px', color: '#22c55e', fontWeight: '700', fontFamily: 'monospace' }}>
                      [LOGO ASSOCIE]
                    </span>
                  )}
                </div>

                {/* Si un logo est defini : afficher le panneau d'apercu avec bouton de suppression */}
                {formData.logoUrl ? (
                  <div className="sponsor-logo-preview-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '8px',
                          background: '#04060a',
                          border: '1px solid rgba(0, 229, 255, 0.4)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '4px'
                        }}
                      >
                        <img
                          src={formData.logoUrl}
                          alt="Apercu logo sponsor"
                          style={{ maxWidth: '48px', maxHeight: '48px', objectFit: 'contain' }}
                        />
                      </div>
                      <div>
                        <div style={{ fontSize: '12.5px', fontWeight: '700', color: '#fff' }}>
                          Logo Actif Selectionne
                        </div>
                        <div style={{ fontSize: '11px', color: '#94a3b8', wordBreak: 'break-all', maxWidth: '340px' }}>
                          {formData.logoUrl}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="dash-btn danger sm"
                      onClick={handleRemoveLogo}
                      title="Supprimer ce logo et revenir a l'icone cyber"
                    >
                      <Trash2 size={13} />
                      <span>Retirer</span>
                    </button>
                  </div>
                ) : null}

                {/* Deux methodes rapides pour ajouter le logo */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {/* Methode 1 : Lecteur d'URL Automatique */}
                  <div style={{ background: '#0b0f19', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '10px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#00e5ff', fontSize: '12px', fontWeight: '700' }}>
                        <Globe size={14} />
                        <span>Lecteur d'URL Automatique</span>
                      </div>
                      <p style={{ fontSize: '11px', color: '#94a3b8', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                        Lit le lien du sponsor et telecharge instantanement son logo officiel haute definition.
                      </p>
                    </div>

                    <button
                      type="button"
                      className="dash-btn cyber sm"
                      disabled={detectingLogo}
                      onClick={handleDetectLogoFromUrl}
                      style={{ width: '100%' }}
                    >
                      <RotateCw size={13} className={detectingLogo ? 'spin' : ''} />
                      <span>{detectingLogo ? 'Scan en cours...' : 'Detecter le Logo via URL'}</span>
                    </button>
                  </div>

                  {/* Methode 2 : Import depuis le PC */}
                  <div style={{ background: '#0b0f19', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '10px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#e2e8f0', fontSize: '12px', fontWeight: '700' }}>
                        <Upload size={14} />
                        <span>Importer depuis mon PC</span>
                      </div>
                      <p style={{ fontSize: '11px', color: '#94a3b8', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                        Selectionnez un fichier PNG transparent, SVG, WEBP ou JPG depuis votre ordinateur.
                      </p>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      style={{ display: 'none' }}
                      id="sponsor-file-upload-input"
                      onChange={handleUploadLogoFromPC}
                    />

                    <label
                      htmlFor="sponsor-file-upload-input"
                      className="dash-btn outline sm"
                      style={{ width: '100%', cursor: uploadingLogo ? 'wait' : 'pointer' }}
                    >
                      <Upload size={13} className={uploadingLogo ? 'spin' : ''} />
                      <span>{uploadingLogo ? 'Televersement...' : 'Parcourir mon PC'}</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Choix de l'Icone Cyber Vectorielle (Fallback si pas de logo) */}
              <div className="dash-form-group" style={{ marginBottom: 0 }}>
                <label className="dash-form-label">
                  Icone Vectorielle de Secours {formData.logoUrl ? '(Remplacee par le logo ci-dessus)' : '(Active)'}
                </label>
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
                        fontWeight: '600',
                        transition: 'all 0.18s ease'
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
              <div className="dash-form-group" style={{ marginBottom: 0 }}>
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
                    title="Couleur personnalisee"
                  />
                </div>
              </div>

              {/* Description detaillee (plein largeur, sans chevauchement) */}
              <div className="dash-form-group" style={{ marginBottom: 0 }}>
                <label className="dash-form-label">Description detaillee (pour le modal fans)</label>
                <textarea
                  className="dash-form-input"
                  rows={3}
                  placeholder="Presentation du partenariat, engagement pour la meute, specifications de l'offre..."
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  style={{ minHeight: '80px', resize: 'vertical' }}
                />
              </div>

              {/* Toggle Actif / Masque stylise */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#0d111a',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px',
                  padding: '12px 16px'
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>
                    Visibilite du Sponsor sur le Site
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                    Si active, la marque apparait immediatement dans le bandeau defilant Hero et le modal officiel.
                  </div>
                </div>

                <button
                  type="button"
                  className={`sponsor-status-pill ${formData.isActive ? 'active' : 'inactive'}`}
                  onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                >
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: formData.isActive ? '#22c55e' : '#ef4444' }} />
                  <span>{formData.isActive ? 'EN DIRECT (ACTIF)' : 'MASQUE (INACTIF)'}</span>
                </button>
              </div>

              {/* Boutons validation */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', marginTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
                <button
                  type="button"
                  className="dash-btn outline"
                  onClick={() => setModalOpen(false)}
                  disabled={saving}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="dash-btn primary"
                  disabled={saving}
                >
                  {saving ? <RotateCw size={14} className="spin" /> : <Check size={14} />}
                  <span>{editingSponsor ? 'Enregistrer les Modifications' : 'Creer le Sponsor'}</span>
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