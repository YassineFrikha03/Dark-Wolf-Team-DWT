import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { WolfLogo } from '../components/WolfLogo';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { DiscordIcon, GoogleIcon } from '../components/SocialIcons';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, setSession } = useAuth();
  const [identifier, setIdentifier] = useState(location.state?.identifier || '');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState(location.state?.successMsg || '');
  const [loading, setLoading] = useState(false);

  // Écoute du retour OAuth (Google ou Discord)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenParam = params.get('token');
    const providerParam = params.get('provider');
    const errorParam = params.get('error');

    if (errorParam) {
      setErrorMsg(decodeURIComponent(errorParam));
      window.history.replaceState({}, document.title, '/login');
      return;
    }

    if (tokenParam) {
      setLoading(true);
      API.get('/auth/me', {
        headers: { Authorization: `Bearer ${tokenParam}` }
      })
        .then((res) => {
          if (res.data.success) {
            setSession(tokenParam, res.data.user);
            const providerName = providerParam === 'discord' ? 'Discord' : 'Google';
            setSuccessMsg(`Connexion réussie avec ${providerName} ! Bon retour, ${res.data.user.gamertag} `);
            setTimeout(() => {
              if (res.data.user.role === 'admin' || res.data.user.role === 'moderator') {
                window.location.href = '/admin';
              } else {
                navigate('/');
              }
            }, 1000);
          }
        })
        .catch((err) => {
          setErrorMsg(err.response?.data?.message || 'Erreur lors de la validation du compte.');
        })
        .finally(() => {
          setLoading(false);
          window.history.replaceState({}, document.title, '/login');
        });
    }
  }, [location.search, navigate, setSession]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const data = await login(identifier, password);
      if (data?.user?.role === 'admin' || data?.user?.role === 'moderator') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/';
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Identifiants invalides');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    const backendUrl = import.meta.env.VITE_SERVER_URL || '';
    window.location.href = `${backendUrl}/api/auth/${provider}`;
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

        {successMsg && (
          <div style={{
            padding: '12px 14px',
            borderRadius: '6px',
            background: 'rgba(34, 197, 94, 0.12)',
            border: '1px solid rgba(34, 197, 94, 0.4)',
            color: '#4ade80',
            fontSize: '13px',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 size={18} color="#4ade80" />
            <span>{successMsg}</span>
          </div>
        )}

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

        {/* Social Logins */}
        <button
          type="button"
          className="auth-social-btn"
          onClick={() => handleSocialLogin('discord')}
        >
          <DiscordIcon size={18} /> Se connecter avec Discord
        </button>
        <button
          type="button"
          className="auth-social-btn"
          onClick={() => handleSocialLogin('google')}
        >
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
