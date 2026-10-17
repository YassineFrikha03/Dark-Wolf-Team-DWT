import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { WolfLogo } from '../components/WolfLogo';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon, Mail, Lock, ArrowRight } from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [gamertag, setGamertag] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Les mots de passe ne correspondent pas.');
      return;
    }

    if (!acceptTerms) {
      setErrorMsg('Veuillez accepter les conditions d\'utilisation.');
      return;
    }

    setLoading(true);
    try {
      await register(gamertag, email, password);
      navigate('/');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container" style={{ padding: '60px 24px' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        gap: '40px',
        maxWidth: '960px',
        width: '100%',
        alignItems: 'center',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-dark)',
        borderRadius: '16px',
        padding: '48px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
      }}>
        {/* Left: Registration Form matching mockup */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <WolfLogo size={28} />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: '800', color: '#fff', fontSize: '18px' }}>
              DARK WOLF <span style={{ color: 'var(--red-primary)' }}>TEAM</span>
            </span>
          </div>

          <h1 className="auth-main-title" style={{ fontSize: '28px', margin: '8px 0' }}>
            Inscription
          </h1>
          <p className="auth-subtitle" style={{ marginBottom: '24px' }}>
            Rejoignez la meute et vivez l'aventure avec nous !
          </p>

          {errorMsg && (
            <div style={{ padding: '10px 14px', borderRadius: '6px', background: 'rgba(230, 0, 0, 0.15)', border: '1px solid var(--red-primary)', color: '#ff6666', fontSize: '13px', marginBottom: '18px' }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Pseudo */}
            <div className="auth-input-group">
              <label className="auth-input-label">Pseudo *</label>
              <div className="input-with-icon-wrap">
                <UserIcon size={18} className="input-left-icon" />
                <input
                  type="text"
                  placeholder="Pseudo"
                  value={gamertag}
                  onChange={(e) => setGamertag(e.target.value)}
                  className="auth-text-input"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="auth-input-group">
              <label className="auth-input-label">E-mail *</label>
              <div className="input-with-icon-wrap">
                <Mail size={18} className="input-left-icon" />
                <input
                  type="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-text-input"
                  required
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div className="auth-input-group">
              <label className="auth-input-label">Mot de passe *</label>
              <div className="input-with-icon-wrap">
                <Lock size={18} className="input-left-icon" />
                <input
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-text-input"
                  required
                />
              </div>
            </div>

            {/* Confirmer mot de passe */}
            <div className="auth-input-group">
              <label className="auth-input-label">Confirmer le mot de passe *</label>
              <div className="input-with-icon-wrap">
                <Lock size={18} className="input-left-icon" />
                <input
                  type="password"
                  placeholder="Confirmer le mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="auth-text-input"
                  required
                />
              </div>
            </div>

            {/* Conditions d'utilisation checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '22px' }}>
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                style={{ accentColor: 'var(--red-primary)' }}
                required
              />
              <span>J'accepte les conditions d'utilisation et la politique de confidentialité</span>
            </div>

            {/* Red button */}
            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Création...' : 'Créer mon compte'} <ArrowRight size={18} />
            </button>
          </form>

          <div className="auth-footer-link" style={{ textAlign: 'left', marginTop: '18px' }}>
            Vous avez déjà un compte ? <Link to="/login">Se connecter</Link>
          </div>
        </div>

        {/* Right: Glowing Wolf Art + Quote matching mockup exactly */}
        <div style={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderLeft: '1px solid var(--border-dark)',
          paddingLeft: '30px'
        }}>
          <WolfLogo size={240} />
          <blockquote style={{
            fontFamily: 'var(--font-display)',
            fontSize: '18px',
            color: '#fff',
            fontWeight: '800',
            marginTop: '24px',
            letterSpacing: '1px'
          }}>
            « Seuls les vrais loups rejoignent la meute. »
          </blockquote>
          <span style={{ color: 'var(--red-primary)', fontSize: '13px', fontWeight: '700', letterSpacing: '2px', marginTop: '6px' }}>
            DARK WOLF TEAM
          </span>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
