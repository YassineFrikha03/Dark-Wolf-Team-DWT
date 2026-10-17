import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { WolfLogo } from '../components/WolfLogo';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { DiscordIcon, GoogleIcon } from '../components/SocialIcons';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      await login(identifier, password);
      navigate('/');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Identifiants invalides');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card-box">
        {/* Top Wolf Logo matching mockup login card */}
        <div className="auth-header-center">
          <WolfLogo size={64} style={{ margin: '0 auto' }} />
          <h1 className="auth-main-title">Connexion</h1>
          <p className="auth-subtitle">Accédez à votre espace membre</p>
        </div>

        {errorMsg && (
          <div style={{ padding: '10px 14px', borderRadius: '6px', background: 'rgba(230, 0, 0, 0.15)', border: '1px solid var(--red-primary)', color: '#ff6666', fontSize: '13px', marginBottom: '18px' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email / Gamertag Input */}
          <div className="auth-input-group">
            <label className="auth-input-label">Adresse e-mail ou Pseudo</label>
            <div className="input-with-icon-wrap">
              <Mail size={18} className="input-left-icon" />
              <input
                type="text"
                placeholder="Votre e-mail ou pseudo"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="auth-text-input"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="auth-input-group">
            <label className="auth-input-label">Mot de passe</label>
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

          {/* Remember me & Forgot Password */}
          <div className="auth-options-row">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: 'var(--red-primary)' }}
              />
              <span>Se souvenir de moi</span>
            </label>
            <Link to="/forgot-password" style={{ color: 'var(--red-primary)', fontSize: '12px' }}>
              Mot de passe oublié ?
            </Link>
          </div>

          {/* Red Submit Button matching mockup */}
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'} <ArrowRight size={18} />
          </button>
        </form>

        {/* OU Divider */}
        <div className="auth-divider-or">
          <span>OU</span>
        </div>

        {/* Social Logins matching mockup */}
        <button className="auth-social-btn" onClick={() => alert('Connexion Discord')}>
          <DiscordIcon size={18} /> Se connecter avec Discord
        </button>
        <button className="auth-social-btn" onClick={() => alert('Connexion Google')}>
          <GoogleIcon size={18} /> Se connecter avec Google
        </button>

        {/* Register Footer Link matching mockup */}
        <div className="auth-footer-link">
          Pas encore de compte ? <Link to="/register">Inscrivez-vous</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
