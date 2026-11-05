import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { WolfLogo } from '../components/WolfLogo';
import { Mail, ArrowRight, RotateCcw, Lock, Check } from 'lucide-react';
import API from '../services/api';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const codeParam = queryParams.get('code') || '';
  const idParam = queryParams.get('identifier') || '';

  const [step, setStep] = useState(codeParam ? 2 : 1); // 1: Demande, 2: Vérification & Nouveau mot de passe
  const [identifier, setIdentifier] = useState(idParam);
  const [code, setCode] = useState(codeParam);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState(
    codeParam ? 'Lien de sécurité validé ! Code de vérification appliqué automatiquement.' : ''
  );
  const [resolvedEmail, setResolvedEmail] = useState(idParam);
  const [loading, setLoading] = useState(false);

  // Synchroniser si l'URL change (clic sur lien d'email)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const c = params.get('code');
    const id = params.get('identifier');

    if (id) {
      setIdentifier(id);
      setResolvedEmail(id);
    }
    if (c) {
      setCode(c);
      setStep(2);
      setSuccessMsg('Lien sécurisé validé ! Code appliqué automatiquement.');
    }
  }, [location.search]);

  // Étape 1 : Demande de code de réinitialisation
  const handleRequestCode = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await API.post('/auth/forgot-password', { identifier });

      const targetEmail = res.data.email || identifier;
      setResolvedEmail(targetEmail);
      setSuccessMsg(`Un code et un lien de réinitialisation ont été envoyés à ${targetEmail} !`);
      setStep(2);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Erreur lors de la demande. Vérifiez votre saisie.');
    } finally {
      setLoading(false);
    }
  };

  // Étape 2 : Modifier le mot de passe
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (newPassword.length < 6) {
      setErrorMsg('Le nouveau mot de passe doit comporter au moins 6 caractères');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Les deux mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);

    try {
      const res = await API.post('/auth/reset-password', {
        identifier,
        code: code.trim(),
        newPassword
      });

      if (res.data.success) {
        setSuccessMsg('Votre mot de passe a été modifié avec succès ! Redirection vers la page de connexion...');

        setTimeout(() => {
          navigate('/login', {
            state: {
              identifier,
              successMsg: 'Votre mot de passe a été mis à jour avec succès ! Veuillez vous connecter avec votre nouveau mot de passe. '
            }
          });
        }, 1000);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Code invalide ou expiré');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card-box">
        {/* En-tête */}
        <div className="auth-header-center">
          <WolfLogo size={64} style={{ margin: '0 auto' }} />
          <h1 className="auth-main-title">
            {step === 1 ? 'Mot de Passe Oublié' : 'Nouveau Mot de Passe'}
          </h1>
          <p className="auth-subtitle">
            {step === 1
              ? 'Récupération sécurisée par email'
              : `Code et lien envoyés à ${resolvedEmail || identifier}`}
          </p>
        </div>

        {/* Message d'erreur DWT Rouge */}
        {errorMsg && (
          <div style={{ padding: '10px 14px', borderRadius: '6px', background: 'rgba(230, 0, 0, 0.15)', border: '1px solid var(--red-primary)', color: '#ff6666', fontSize: '13px', marginBottom: '18px' }}>
            {errorMsg}
          </div>
        )}

        {/* Message de succès DWT */}
        {successMsg && (
          <div style={{ padding: '10px 14px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.25)', color: '#ffffff', fontSize: '13px', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Check size={18} color="var(--red-primary)" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ÉTAPE 1 : Saisie de l'email ou Pseudo */}
        {step === 1 && (
          <form onSubmit={handleRequestCode}>
            <div className="auth-input-group">
              <label className="auth-input-label">Adresse e-mail ou Pseudo</label>
              <div className="input-with-icon-wrap">
                <Mail size={18} className="input-left-icon" />
                <input
                  type="text"
                  placeholder="admin@darkwolfteam.gg ou pseudo"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="auth-text-input"
                  required
                />
              </div>
            </div>

            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '18px', lineHeight: 1.4 }}>
              <span> Un code à 6 chiffres et un <strong>lien direct de réinitialisation</strong> vous seront envoyés par email pour définir votre nouveau mot de passe.</span>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Envoi en cours...' : 'Envoyer mon code de réinitialisation'}
              <ArrowRight size={18} />
            </button>
          </form>
        )}

        {/* ÉTAPE 2 : Modifier le mot de passe */}
        {step === 2 && (
          <form onSubmit={handleResetPassword}>
            <div className="auth-input-group">
              <label className="auth-input-label">Code de sécurité (6 chiffres)</label>
              <div className="input-with-icon-wrap">
                <input
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="auth-text-input"
                  style={{ letterSpacing: '8px', fontSize: '22px', fontWeight: 'bold', textAlign: 'center', fontFamily: 'Orbitron, monospace', padding: '12px 14px' }}
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label className="auth-input-label">Nouveau mot de passe</label>
              <div className="input-with-icon-wrap">
                <Lock size={18} className="input-left-icon" />
                <input
                  type="password"
                  placeholder="Au moins 6 caractères"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="auth-text-input"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label className="auth-input-label">Confirmer le nouveau mot de passe</label>
              <div className="input-with-icon-wrap">
                <Lock size={18} className="input-left-icon" />
                <input
                  type="password"
                  placeholder="Répétez le mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="auth-text-input"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading || code.length < 6}>
              {loading ? 'Mise à jour en cours...' : 'Enregistrer mon nouveau mot de passe'}
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setCode('');
                setErrorMsg('');
              }}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                fontSize: '12px',
                marginTop: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <RotateCcw size={14} /> Modifier l'identifiant ou renvoyer un code
            </button>
          </form>
        )}

        {/* Pied de carte */}
        <div className="auth-footer-link">
          Vous vous souvenez de votre mot de passe ? <Link to="/login" style={{ color: 'var(--red-primary)' }}>Se connecter</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
