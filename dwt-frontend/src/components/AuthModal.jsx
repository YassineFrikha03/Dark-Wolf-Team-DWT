import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { DiscordIcon, GoogleIcon } from './SocialIcons';

const AuthModal = ({ isOpen, onClose, initialTab = 'login', onSuccess, onOpenRecruitment }) => {
  const [tab, setTab] = useState(initialTab); // 'login' | 'register' | 'recovery'
  const { login } = useAuth();

  const [loginData, setLoginData] = useState({ identifier: '', password: '' });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [regData, setRegData] = useState({ gamertag: '', email: '', password: '' });

  const [recoveryStep, setRecoveryStep] = useState(1); // 1: Email, 2: Code
  const [recoveryIdentifier, setRecoveryIdentifier] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [recruitmentNotice, setRecruitmentNotice] = useState(null);

  React.useEffect(() => {
    if (initialTab) setTab(initialTab);
    setErrorMsg('');
    setSuccessMsg('');
    setRecruitmentNotice(null);
    setRecoveryStep(1);
    setRecoveryCode('');
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const res = await login(loginData.identifier, loginData.password);
      if (onSuccess) {
        onSuccess(res?.user);
      }
      onClose();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Identifiants invalides. Vérifiez votre email et mot de passe.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setRecruitmentNotice(null);
    setLoading(true);
    try {
      const res = await API.post('/auth/register', regData);
      if (res.data.success) {
        setSuccessMsg('Compte créé avec succès ! Connectez-vous avec vos identifiants.');
        setTab('login');
        setLoginData({ identifier: regData.email, password: regData.password });
      }
    } catch (err) {
      if (err.response?.status === 403 && err.response?.data?.needsRecruitment) {
        setRecruitmentNotice({
          message: err.response.data.message,
          email: regData.email,
          url: err.response.data.recruitmentUrl
        });
      } else {
        setErrorMsg(err.response?.data?.message || err.message || 'Erreur lors de la création du compte.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Demande de code pour Réinitialisation de mot de passe
  const handleRequestRecoveryCode = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await API.post('/auth/forgot-password', { identifier: recoveryIdentifier });
      const targetEmail = res.data.email || recoveryIdentifier;
      setSuccessMsg(`Un code et un lien de réinitialisation ont été envoyés à ${targetEmail} !`);
      setRecoveryStep(2);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Erreur lors de la demande. Vérifiez votre saisie.');
    } finally {
      setLoading(false);
    }
  };

  // Validation du code : Modifier le mot de passe
  const handleVerifyResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (newPassword.length < 6) {
      setErrorMsg('Le nouveau mot de passe doit comporter au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      const res = await API.post('/auth/reset-password', {
        identifier: recoveryIdentifier,
        code: recoveryCode.trim(),
        newPassword
      });

      if (res.data.success) {
        setSuccessMsg('Mot de passe mis à jour avec succès ! Connectez-vous avec votre nouveau mot de passe. ');
        setTab('login');
        setLoginData({
          identifier: res.data.user?.email || recoveryIdentifier,
          password: newPassword
        });
        setRecoveryCode('');
        setNewPassword('');
        setRecoveryStep(1);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Code de sécurité invalide ou expiré');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    const backendUrl = import.meta.env.VITE_SERVER_URL || '';
    window.location.href = `${backendUrl}/api/auth/${provider}`;
  };

  return (
    <div
      className={`mov ${isOpen ? 'open' : ''}`}
      id="authMov"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal" style={{ maxWidth: '420px' }}>
        <button className="mclose" onClick={onClose} aria-label="Close auth modal">
          <X size={18} />
        </button>
        <div className="mtitle" id="mtitle">
          {tab === 'login' && 'Connexion Membre'}
          {tab === 'register' && 'Rejoindre la Meute'}
          {tab === 'recovery' && 'Mot de Passe Oublié'}
        </div>
        <div className="msub">
          {tab === 'register' ? 'Accédez au test de sélection officiel' : tab === 'recovery' ? 'Récupération sécurisée par email' : 'Accédez à votre compte Dark Wolf Team'}
        </div>

        {tab !== 'recovery' && (
          <div className="mtabs">
            <button
              className={`mtab ${tab === 'login' ? 'act' : ''}`}
              onClick={() => {
                setTab('login');
                setErrorMsg('');
              }}
            >
              Connexion
            </button>
            <button
              className={`mtab ${tab === 'register' ? 'act' : ''}`}
              onClick={() => {
                setTab('register');
                setErrorMsg('');
              }}
            >
              Rejoindre
            </button>
          </div>
        )}

        {errorMsg && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '6px',
              background: 'rgba(230,0,0,0.15)',
              border: '1px solid #cc2222',
              color: '#ff6b6b',
              fontSize: '13px',
              marginBottom: '16px',
            }}
          >
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              fontSize: '13px',
              marginBottom: '16px',
            }}
          >
            {successMsg}
          </div>
        )}

        {/* TAB 1: LOGIN CLASSIQUE */}
        {tab === 'login' && (
          <form id="lform" onSubmit={handleLoginSubmit}>
            <div className="mfld">
              <label className="mlbl">Email or Gamertag</label>
              <input
                type="text"
                className="minput"
                placeholder="wolf@darklab.gg ou pseudo"
                required
                value={loginData.identifier}
                onChange={(e) => setLoginData({ ...loginData, identifier: e.target.value })}
              />
            </div>
            <div className="mfld" style={{ marginBottom: '8px' }}>
              <label className="mlbl">Password</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  className="minput"
                  placeholder="••••••••"
                  required
                  style={{ paddingRight: '40px' }}
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    background: 'none',
                    border: 'none',
                    color: showLoginPassword ? 'var(--red-primary)' : '#94a3b8',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title={showLoginPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  aria-label={showLoginPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Lien Mot de passe oublié */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
              <button
                type="button"
                onClick={() => {
                  setTab('recovery');
                  setRecoveryStep(1);
                  setRecoveryIdentifier(loginData.identifier || '');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--red-primary)',
                  fontSize: '11px',
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline'
                }}
              >
                Mot de passe oublié ?
              </button>
            </div>

            <button type="submit" className="bmsubmit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            {/* Social Logins */}
            <div style={{ margin: '16px 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              <span style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }}></span>
              <span>OU</span>
              <span style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }}></span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleSocialLogin('discord')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  background: '#5865F2',
                  border: 'none',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                <DiscordIcon size={18} /> Continuer avec Discord
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  color: '#1e293b',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                <GoogleIcon size={18} /> Continuer avec Google
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: REGISTER */}
        {tab === 'register' && (
          <div>
            {recruitmentNotice ? (
              <div
                style={{
                  background: 'rgba(230, 0, 0, 0.1)',
                  border: '1px solid #cc2222',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '16px',
                  lineHeight: 1.5,
                  fontSize: '13px',
                  color: '#cbd5e1'
                }}
              >
                <div style={{ color: '#ff6666', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px', fontSize: '12px' }}>
                  Inscription Fermée (Sur Test de Sélection)
                </div>
                <p style={{ margin: '0 0 12px 0' }}>{recruitmentNotice.message}</p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenRecruitment) {
                      onOpenRecruitment(recruitmentNotice.email);
                    } else {
                      window.location.href = `/recrutement?email=${encodeURIComponent(recruitmentNotice.email)}`;
                    }
                  }}
                  style={{
                    width: '100%',
                    background: '#cc2222',
                    border: '1px solid #ff3333',
                    color: '#fff',
                    padding: '10px 16px',
                    borderRadius: '6px',
                    fontWeight: '700',
                    fontSize: '12px',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  Remplir le Formulaire de Recrutement
                </button>
              </div>
            ) : null}

            <form id="rform" onSubmit={handleRegisterSubmit}>
              <div style={{
                background: 'rgba(56, 189, 248, 0.06)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '16px',
                fontSize: '12px',
                color: '#cbd5e1',
                lineHeight: 1.5
              }}>
                Les inscriptions libres sont fermées. Renseignez votre nom et votre adresse email : si votre candidature a déjà été validée suite au test, votre compte sera activé. Sinon, vous recevrez directement le formulaire officiel par email pour passer le test de sélection.
              </div>

              <div className="mfld">
                <label className="mlbl">Nom / Pseudo *</label>
                <input
                  type="text"
                  className="minput"
                  placeholder="Ex: Alex ou ShadowWolf"
                  required
                  value={regData.gamertag}
                  onChange={(e) => setRegData({ ...regData, gamertag: e.target.value })}
                />
              </div>

              <div className="mfld">
                <label className="mlbl">Adresse e-mail *</label>
                <input
                  type="email"
                  className="minput"
                  placeholder="votre.email@exemple.com"
                  required
                  value={regData.email}
                  onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                />
              </div>

              <button type="submit" className="bmsubmit" disabled={loading} style={{ marginTop: '8px' }}>
                {loading ? 'Vérification en cours...' : 'Vérifier & Postuler au Test'}
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: RÉCUPÉRATION DU MOT DE PASSE */}
        {tab === 'recovery' && (
          <div>
            {recoveryStep === 1 && (
              <div>
                <form onSubmit={handleRequestRecoveryCode}>
                  <div className="mfld">
                    <label className="mlbl">Email ou Pseudo (Gamertag)</label>
                    <input
                      type="text"
                      className="minput"
                      placeholder="admin@darkwolfteam.gg ou pseudo"
                      required
                      value={recoveryIdentifier}
                      onChange={(e) => setRecoveryIdentifier(e.target.value)}
                    />
                  </div>

                  <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '16px', lineHeight: 1.4 }}>
                    <span> Un code de sécurité et un lien vous seront envoyés par email pour définir un nouveau mot de passe.</span>
                  </div>

                  <button type="submit" className="bmsubmit" disabled={loading}>
                    {loading ? 'Envoi...' : 'Envoyer mon code de réinitialisation '}
                  </button>
                </form>
              </div>
            )}

            {recoveryStep === 2 && (
              <div>
                <div style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#94a3b8',
                  fontSize: '11px',
                  lineHeight: '1.4',
                  marginBottom: '14px'
                }}>
                   Entrez le code à 6 chiffres reçu dans votre boîte de réception ou cliquez directement sur le lien reçu par email.
                </div>

                <form onSubmit={handleVerifyResetPassword}>
                  <div className="mfld">
                    <label className="mlbl">Code de sécurité (6 chiffres)</label>
                    <input
                      type="text"
                      className="minput"
                      placeholder="123456"
                      maxLength={6}
                      required
                      autoFocus
                      value={recoveryCode}
                      onChange={(e) => setRecoveryCode(e.target.value)}
                      style={{ textAlign: 'center', fontSize: '18px', letterSpacing: '4px', fontFamily: 'Orbitron, monospace' }}
                    />
                  </div>

                  <div className="mfld">
                    <label className="mlbl">Nouveau mot de passe</label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input
                        type={showResetPassword ? 'text' : 'password'}
                        className="minput"
                        placeholder="Au moins 6 caractères"
                        required
                        minLength={6}
                        style={{ paddingRight: '40px' }}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowResetPassword(!showResetPassword)}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          background: 'none',
                          border: 'none',
                          color: showResetPassword ? 'var(--red-primary)' : '#94a3b8',
                          cursor: 'pointer',
                          padding: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title={showResetPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                        aria-label={showResetPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                      >
                        {showResetPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="bmsubmit" disabled={loading || recoveryCode.length < 6}>
                    {loading ? 'Mise à jour...' : 'Enregistrer mon nouveau mot de passe '}
                  </button>
                </form>

                <button
                  type="button"
                  onClick={() => {
                    setRecoveryStep(1);
                    setRecoveryCode('');
                    setErrorMsg('');
                  }}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    fontSize: '11px',
                    marginTop: '12px',
                    cursor: 'pointer'
                  }}
                >
                  ← Recommencer / Modifier l'identifiant
                </button>
              </div>
            )}

            <div style={{ marginTop: '16px', borderTop: '1px solid #202b3f', paddingTop: '12px', textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  setTab('login');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--red-primary)',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Retour à la connexion par mot de passe
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
