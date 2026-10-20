import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const AuthModal = ({ isOpen, onClose, initialTab = 'login' }) => {
  const [tab, setTab] = useState(initialTab);
  const { login } = useAuth();

  const [loginData, setLoginData] = useState({ identifier: '', password: '' });
  const [regData, setRegData] = useState({ gamertag: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  React.useEffect(() => {
    if (initialTab) setTab(initialTab);
    setErrorMsg('');
    setSuccessMsg('');
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    try {
      await login(loginData.identifier, loginData.password);
      onClose();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Identifiants invalides. Vérifiez votre email et mot de passe.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const res = await API.post('/auth/register', regData);
      if (res.data.success) {
        setSuccessMsg('Compte créé avec succès ! Connectez-vous avec vos identifiants. 🐺✨');
        setTab('login');
        setLoginData({ identifier: regData.email, password: regData.password });
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Erreur lors de la création du compte.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`mov ${isOpen ? 'open' : ''}`}
      id="authMov"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal">
        <button className="mclose" onClick={onClose} aria-label="Close auth modal">
          ✕
        </button>
        <div className="mtitle" id="mtitle">
          {tab === 'login' ? 'Welcome Back' : 'Create Account'}
        </div>
        <div className="msub">Access your Dark Wolf account</div>

        <div className="mtabs">
          <button
            className={`mtab ${tab === 'login' ? 'act' : ''}`}
            onClick={() => {
              setTab('login');
              setErrorMsg('');
            }}
          >
            Sign In
          </button>
          <button
            className={`mtab ${tab === 'register' ? 'act' : ''}`}
            onClick={() => {
              setTab('register');
              setErrorMsg('');
            }}
          >
            Register
          </button>
        </div>

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
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid #10b981',
              color: '#34d399',
              fontSize: '13px',
              marginBottom: '16px',
            }}
          >
            {successMsg}
          </div>
        )}

        {tab === 'login' ? (
          <form id="lform" onSubmit={handleLoginSubmit}>
            <div className="mfld">
              <label className="mlbl">Email or Gamertag</label>
              <input
                type="text"
                className="minput"
                placeholder="wolf@darklab.gg"
                required
                value={loginData.identifier}
                onChange={(e) => setLoginData({ ...loginData, identifier: e.target.value })}
              />
            </div>
            <div className="mfld">
              <label className="mlbl">Password</label>
              <input
                type="password"
                className="minput"
                placeholder="••••••••"
                required
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              />
            </div>
            <button type="submit" className="bmsubmit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form id="rform" onSubmit={handleRegisterSubmit}>
            <div className="mfld">
              <label className="mlbl">Username</label>
              <input
                type="text"
                className="minput"
                placeholder="WolfPlayer_01"
                required
                value={regData.gamertag}
                onChange={(e) => setRegData({ ...regData, gamertag: e.target.value })}
              />
            </div>
            <div className="mfld">
              <label className="mlbl">Email</label>
              <input
                type="email"
                className="minput"
                placeholder="wolf@darklab.gg"
                required
                value={regData.email}
                onChange={(e) => setRegData({ ...regData, email: e.target.value })}
              />
            </div>
            <div className="mfld">
              <label className="mlbl">Password</label>
              <input
                type="password"
                className="minput"
                placeholder="Create a strong password"
                required
                value={regData.password}
                onChange={(e) => setRegData({ ...regData, password: e.target.value })}
              />
            </div>
            <button type="submit" className="bmsubmit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
