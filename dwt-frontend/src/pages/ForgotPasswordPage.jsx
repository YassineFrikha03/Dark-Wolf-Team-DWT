import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { WolfLogo } from '../components/WolfLogo';
import { Mail, KeyRound, ArrowRight, CheckCircle2 } from 'lucide-react';
import API from '../services/api';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: Code 6 chiffres & New Password
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Étape 1: Demande du code à 6 chiffres par email
  const handleRequestCode = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await API.post('/auth/forgot-password', { email });
      setSuccessMsg(res.data.message || 'Code à 6 chiffres envoyé par e-mail.');
      setStep(2);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Erreur lors de la demande');
    } finally {
      setLoading(false);
    }
  };

  // Étape 2: Validation du code et changement de mot de passe
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await API.post('/auth/reset-password', { email, code, newPassword });
      setSuccessMsg(res.data.message || 'Mot de passe réinitialisé avec succès !');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Code invalide ou expiré');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card-box">
        <div className="auth-header-center">
          <WolfLogo size={58} style={{ margin: '0 auto' }} />
          <h1 className="auth-main-title" style={{ fontSize: '22px' }}>
            {step === 1 ? 'Mot de passe oublié' : 'Nouveau mot de passe'}
          </h1>
          <p className="auth-subtitle">
            {step === 1 
              ? 'Recevez un code de sécurité à 6 chiffres par email'
              : 'Saisissez le code reçu et votre nouveau mot de passe'}
          </p>
        </div>

        {successMsg && (
          <div style={{ padding: '10px 14px', borderRadius: '6px', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid #22c55e', color: '#4ade80', fontSize: '13px', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div style={{ padding: '10px 14px', borderRadius: '6px', background: 'rgba(230, 0, 0, 0.15)', border: '1px solid var(--red-primary)', color: '#ff6666', fontSize: '13px', marginBottom: '18px' }}>
            {errorMsg}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestCode}>
            <div className="auth-input-group">
              <label className="auth-input-label">Votre adresse e-mail</label>
              <div className="input-with-icon-wrap">
                <Mail size={18} className="input-left-icon" />
                <input
                  type="email"
                  placeholder="exemple@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-text-input"
                  required
                />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Envoi...' : 'Envoyer le code'} <ArrowRight size={18} />
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div className="auth-input-group">
              <label className="auth-input-label">Code de sécurité (6 chiffres)</label>
              <div className="input-with-icon-wrap">
                <KeyRound size={18} className="input-left-icon" />
                <input
                  type="text"
                  placeholder="Ex: 489123"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="auth-text-input"
                  style={{ letterSpacing: '4px', fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }}
                  required
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label className="auth-input-label">Nouveau mot de passe</label>
              <input
                type="password"
                placeholder="Au moins 6 caractères"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="auth-text-input"
                style={{ paddingLeft: '14px' }}
                required
                minLength={6}
              />
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Validation...' : 'Changer mon mot de passe'} <ArrowRight size={18} />
            </button>
          </form>
        )}

        <div className="auth-footer-link">
          Retour à la <Link to="/login">connexion</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
