import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import API from '../services/api';

const RecruitmentSection = () => {
  const [formData, setFormData] = useState({
    gamertag: '',
    email: '',
    discordTag: '',
    age: '',
    game: 'Valorant',
    rank: '',
    rolePreference: 'Dueliste',
    experience: ''
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await API.post('/applications', formData);
      if (res.data.success) {
        setSuccessMsg(res.data.message || 'Candidature envoyée avec succès ! Vérifie ta boîte mail.');
        setFormData({
          gamertag: '',
          email: '',
          discordTag: '',
          age: '',
          game: 'Valorant',
          rank: '',
          rolePreference: 'Dueliste',
          experience: ''
        });
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Erreur lors de l\'envoi de la candidature.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-container" id="recrutement" style={{ padding: '80px 24px' }}>
      <div className="section-header">
        <h2 className="section-title">REJOINDRE LA MEUTE</h2>
        <p className="section-subtitle">Postule pour intégrer l'un de nos rosters compétitifs (Valorant, CS2, LoL, FC26).</p>
      </div>

      <div style={{ maxWidth: '680px', margin: '0 auto', background: 'var(--bg-card)', padding: '36px', borderRadius: '12px', border: '1px solid var(--border-dark)' }}>
        {successMsg && (
          <div style={{ padding: '14px', borderRadius: '6px', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid #22c55e', color: '#4ade80', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle2 size={20} />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div style={{ padding: '14px', borderRadius: '6px', background: 'rgba(230, 0, 0, 0.15)', border: '1px solid var(--red-primary)', color: '#ff6666', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={20} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '18px' }}>
            <div>
              <label className="auth-input-label">Pseudo / Gamertag *</label>
              <input
                type="text"
                name="gamertag"
                value={formData.gamertag}
                onChange={handleChange}
                placeholder="Ex: GhostWolf"
                className="auth-text-input"
                style={{ paddingLeft: '14px' }}
                required
              />
            </div>
            <div>
              <label className="auth-input-label">Adresse Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ex: joueur@gmail.com"
                className="auth-text-input"
                style={{ paddingLeft: '14px' }}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '18px' }}>
            <div>
              <label className="auth-input-label">Tag Discord *</label>
              <input
                type="text"
                name="discordTag"
                value={formData.discordTag}
                onChange={handleChange}
                placeholder="Ex: user#1234 ou @user"
                className="auth-text-input"
                style={{ paddingLeft: '14px' }}
                required
              />
            </div>
            <div>
              <label className="auth-input-label">Âge *</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Ex: 19"
                className="auth-text-input"
                style={{ paddingLeft: '14px' }}
                required
                min="13"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '18px' }}>
            <div>
              <label className="auth-input-label">Jeu visé *</label>
              <select
                name="game"
                value={formData.game}
                onChange={handleChange}
                className="auth-text-input"
                style={{ paddingLeft: '14px', background: '#0b0d14' }}
              >
                <option value="Valorant">Valorant</option>
                <option value="Counter-Strike 2">Counter-Strike 2</option>
                <option value="League of Legends">League of Legends</option>
                <option value="EA Sports FC 26">EA Sports FC 26</option>
              </select>
            </div>
            <div>
              <label className="auth-input-label">Rang actuel *</label>
              <input
                type="text"
                name="rank"
                value={formData.rank}
                onChange={handleChange}
                placeholder="Ex: Radiant / Faceit 10"
                className="auth-text-input"
                style={{ paddingLeft: '14px' }}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: '22px' }}>
            <label className="auth-input-label">Expérience compétitive & Motivation *</label>
            <textarea
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              rows={4}
              placeholder="Présente tes anciennes équipes, tes disponibilités et ce que tu souhaites apporter à la Dark Wolf Team..."
              className="auth-text-input"
              style={{ paddingLeft: '14px', resize: 'vertical' }}
              required
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            <Send size={18} /> {loading ? 'Envoi en cours...' : 'Envoyer ma candidature'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default RecruitmentSection;
