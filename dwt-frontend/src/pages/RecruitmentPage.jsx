import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { WolfLogo } from '../components/WolfLogo';
import {
  Gamepad2,
  Mail,
  User,
  Shield,
  Send,
  CheckCircle2,
  ArrowLeft,
  Calendar,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';

const DEFAULT_GAMES = [
  'Valorant',
  'Counter-Strike 2',
  'League of Legends',
  'Rocket League',
  'Rainbow Six Siege'
];

const RecruitmentPage = ({ onBackToSite }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    gamertag: '',
    email: '',
    discordTag: '',
    age: '',
    game: 'Valorant',
    rank: '',
    rolePreference: 'Flexible',
    trackerUrl: '',
    experience: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedApp, setSubmittedApp] = useState(null);

  // Pre-remplir l'email depuis l'URL (?email=...)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      setFormData((prev) => ({ ...prev, email: emailParam.trim() }));
    }
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (
      !formData.gamertag.trim() ||
      !formData.email.trim() ||
      !formData.discordTag.trim() ||
      !formData.age ||
      !formData.game ||
      !formData.rank.trim() ||
      !formData.experience.trim()
    ) {
      setErrorMsg('Veuillez remplir tous les champs obligatoires du formulaire.');
      return;
    }

    if (Number(formData.age) < 13) {
      setErrorMsg("L'âge minimum requis pour postuler est de 13 ans.");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post('/applications', {
        ...formData,
        age: Number(formData.age)
      });

      if (res.data.success) {
        setSubmittedApp(res.data.application || formData);
      }
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message ||
          'Une erreur est survenue lors de la transmission de votre dossier.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReturnHome = () => {
    if (onBackToSite) {
      onBackToSite();
    } else {
      navigate('/');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #07080c 0%, #0c101b 50%, #07080c 100%)',
        color: '#e2e8f0',
        padding: '110px 20px 80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <div style={{ maxWidth: '820px', width: '100%' }}>
        {/* Navigation retour */}
        <div style={{ marginBottom: '25px' }}>
          <button
            type="button"
            onClick={handleReturnHome}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#94a3b8',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.borderColor = 'var(--red-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#94a3b8';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            <ArrowLeft size={16} /> Retour au site officiel
          </button>
        </div>

        {/* Titre & Branding */}
        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
          <WolfLogo size={58} style={{ margin: '0 auto 14px' }} />
          <h1
            style={{
              fontFamily: '"Orbitron", sans-serif',
              fontSize: '32px',
              fontWeight: 900,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: '#ffffff',
              margin: '0 0 10px 0'
            }}
          >
            Recrutement Officiel
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: '#94a3b8',
              maxWidth: '640px',
              margin: '0 auto',
              lineHeight: 1.6
            }}
          >
            Les inscriptions directes sont fermées. Pour intégrer les effectifs compétitifs de la
            Dark Wolf Team, complétez ce dossier. Si votre candidature est retenue, vous serez
            convoqué par email pour passer le test pratique de recrutement avec le staff.
          </p>
        </div>

        {/* AVIS SUCCÈS */}
        {submittedApp ? (
          <div
            style={{
              background: 'linear-gradient(145deg, #0f1523 0%, #080c14 100%)',
              border: '1px solid #1e293b',
              borderRadius: '12px',
              padding: '40px 32px',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid #22c55e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                color: '#4ade80'
              }}
            >
              <CheckCircle2 size={36} />
            </div>

            <h2
              style={{
                fontFamily: '"Orbitron", sans-serif',
                fontSize: '24px',
                color: '#ffffff',
                margin: '0 0 12px 0'
              }}
            >
              Candidature Transmise avec Succès
            </h2>
            <p
              style={{
                fontSize: '15px',
                color: '#cbd5e1',
                lineHeight: 1.6,
                maxWidth: '560px',
                margin: '0 auto 28px'
              }}
            >
              Merci <strong>{submittedApp.gamertag}</strong> ! Votre dossier pour le roster{' '}
              <strong style={{ color: '#ff6666' }}>{submittedApp.game}</strong> a bien été reçu par
              la direction esport. Un email de confirmation vient d'être envoyé à{' '}
              <strong style={{ color: '#fff' }}>{submittedApp.email}</strong>.
            </p>

            {/* Étapes du processus de recrutement */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '14px',
                margin: '30px 0',
                textAlign: 'left'
              }}
            >
              <div
                style={{
                  background: 'rgba(10, 14, 24, 0.8)',
                  border: '1px solid rgba(34, 197, 94, 0.4)',
                  borderRadius: '8px',
                  padding: '16px'
                }}
              >
                <div style={{ color: '#4ade80', fontSize: '11px', fontWeight: '800', letterSpacing: '1px' }}>
                  ETAPE 1 [VALIDEE]
                </div>
                <div style={{ color: '#fff', fontWeight: '700', fontSize: '13px', marginTop: '4px' }}>
                  Dossier Soumis
                </div>
                <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>
                  Profil et motivations reçus par le staff.
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(10, 14, 24, 0.8)',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  borderRadius: '8px',
                  padding: '16px'
                }}
              >
                <div style={{ color: '#38bdf8', fontSize: '11px', fontWeight: '800', letterSpacing: '1px' }}>
                  ETAPE 2 [EN COURS]
                </div>
                <div style={{ color: '#fff', fontWeight: '700', fontSize: '13px', marginTop: '4px' }}>
                  Examen du Dossier
                </div>
                <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>
                  Analyse des statistiques et du rang.
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(10, 14, 24, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '16px'
                }}
              >
                <div style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '800', letterSpacing: '1px' }}>
                  ETAPE 3 [A VENIR]
                </div>
                <div style={{ color: '#fff', fontWeight: '700', fontSize: '13px', marginTop: '4px' }}>
                  Convocation Test
                </div>
                <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>
                  Fixation de la date et heure par le staff.
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(10, 14, 24, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '16px'
                }}
              >
                <div style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '800', letterSpacing: '1px' }}>
                  ETAPE 4 [DECISION]
                </div>
                <div style={{ color: '#fff', fontWeight: '700', fontSize: '13px', marginTop: '4px' }}>
                  Admission
                </div>
                <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>
                  Génération des accès Espace Joueur si accepté.
                </div>
              </div>
            </div>

            <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={handleReturnHome}
                style={{
                  background: '#cc2222',
                  border: '1px solid #ff3333',
                  color: '#fff',
                  padding: '12px 28px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  cursor: 'pointer'
                }}
              >
                Retour à l'accueil
              </button>
            </div>
          </div>
        ) : (
          /* FORMULAIRE DE CANDIDATURE */
          <div
            style={{
              background: 'linear-gradient(145deg, #0e121e 0%, #080a11 100%)',
              border: '1px solid #1e293b',
              borderRadius: '12px',
              padding: '36px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)'
            }}
          >
            {errorMsg && (
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: '6px',
                  background: 'rgba(230, 0, 0, 0.15)',
                  border: '1px solid #cc2222',
                  color: '#ff6666',
                  fontSize: '13px',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <Info size={18} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {/* Gamertag */}
                <div className="auth-input-group">
                  <label className="auth-input-label">Gamertag (Pseudo en jeu) *</label>
                  <div className="input-with-icon-wrap">
                    <User size={18} className="input-left-icon" />
                    <input
                      type="text"
                      name="gamertag"
                      placeholder="Ex: Wolf_Viper"
                      value={formData.gamertag}
                      onChange={handleChange}
                      className="auth-text-input"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="auth-input-group">
                  <label className="auth-input-label">Adresse Email *</label>
                  <div className="input-with-icon-wrap">
                    <Mail size={18} className="input-left-icon" />
                    <input
                      type="email"
                      name="email"
                      placeholder="votre.email@exemple.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="auth-text-input"
                      required
                    />
                  </div>
                </div>

                {/* Discord Tag */}
                <div className="auth-input-group">
                  <label className="auth-input-label">Identifiant / Tag Discord *</label>
                  <div className="input-with-icon-wrap">
                    <Shield size={18} className="input-left-icon" />
                    <input
                      type="text"
                      name="discordTag"
                      placeholder="Ex: viper_wolf ou Viper#1234"
                      value={formData.discordTag}
                      onChange={handleChange}
                      className="auth-text-input"
                      required
                    />
                  </div>
                </div>

                {/* Âge */}
                <div className="auth-input-group">
                  <label className="auth-input-label">Âge (Minimum 13 ans) *</label>
                  <div className="input-with-icon-wrap">
                    <Calendar size={18} className="input-left-icon" />
                    <input
                      type="number"
                      name="age"
                      min="13"
                      max="60"
                      placeholder="Ex: 19"
                      value={formData.age}
                      onChange={handleChange}
                      className="auth-text-input"
                      required
                    />
                  </div>
                </div>

                {/* Jeu visé */}
                <div className="auth-input-group">
                  <label className="auth-input-label">Jeu / Roster souhaité *</label>
                  <div className="input-with-icon-wrap">
                    <Gamepad2 size={18} className="input-left-icon" />
                    <select
                      name="game"
                      value={formData.game}
                      onChange={handleChange}
                      className="auth-text-input"
                      style={{ background: '#090d16', color: '#fff' }}
                      required
                    >
                      {DEFAULT_GAMES.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Rang compétitif */}
                <div className="auth-input-group">
                  <label className="auth-input-label">Rang actuel en jeu *</label>
                  <div className="input-with-icon-wrap">
                    <Shield size={18} className="input-left-icon" />
                    <input
                      type="text"
                      name="rank"
                      placeholder="Ex: Radiant / Faceit Level 10 / Challenger"
                      value={formData.rank}
                      onChange={handleChange}
                      className="auth-text-input"
                      required
                    />
                  </div>
                </div>

                {/* Rôle / Préférence */}
                <div className="auth-input-group">
                  <label className="auth-input-label">Rôle / Poste préféré</label>
                  <div className="input-with-icon-wrap">
                    <User size={18} className="input-left-icon" />
                    <input
                      type="text"
                      name="rolePreference"
                      placeholder="Ex: Dueliste, Initiateur, IGL, Sniper, Support..."
                      value={formData.rolePreference}
                      onChange={handleChange}
                      className="auth-text-input"
                    />
                  </div>
                </div>

                {/* Tracker URL */}
                <div className="auth-input-group">
                  <label className="auth-input-label">Lien Tracker / VOD / Profil compétitif</label>
                  <div className="input-with-icon-wrap">
                    <Shield size={18} className="input-left-icon" />
                    <input
                      type="url"
                      name="trackerUrl"
                      placeholder="Ex: https://tracker.gg/valorant/profile/..."
                      value={formData.trackerUrl}
                      onChange={handleChange}
                      className="auth-text-input"
                    />
                  </div>
                </div>
              </div>

              {/* Expérience et motivations */}
              <div className="auth-input-group" style={{ marginTop: '20px' }}>
                <label className="auth-input-label">
                  Expérience compétitive & Motivations détaillées *
                </label>
                <textarea
                  name="experience"
                  rows={4}
                  placeholder="Détaillez vos anciennes équipes, tournois joués, vos horaires de disponibilité pour les entraînements/scrims, et vos motivations pour rejoindre la Dark Wolf Team."
                  value={formData.experience}
                  onChange={handleChange}
                  className="auth-text-input"
                  style={{ minHeight: '110px', resize: 'vertical' }}
                  required
                />
              </div>

              {/* Notice d'information */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '6px',
                  padding: '12px 16px',
                  fontSize: '12px',
                  color: '#94a3b8',
                  margin: '22px 0',
                  lineHeight: 1.5
                }}
              >
                En soumettant ce formulaire, vous confirmez l'exactitude de vos coordonnées. Si votre
                dossier est pré-sélectionné, vous recevrez une convocation officielle par email
                contenant la date, l'heure et le salon Discord de votre test de recrutement.
              </div>

              {/* Bouton de soumission */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  background: 'linear-gradient(90deg, #cc2222 0%, #e60000 100%)',
                  border: '1px solid #ff4d4d',
                  color: '#ffffff',
                  padding: '14px 24px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '800',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 6px 20px rgba(204, 34, 34, 0.4)',
                  transition: 'transform 0.15s, box-shadow 0.15s'
                }}
              >
                <Send size={18} />
                {loading ? 'Transmission du dossier en cours...' : 'Envoyer ma Candidature'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruitmentPage;
