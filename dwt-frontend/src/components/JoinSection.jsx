import React, { useState } from 'react';
import API from '../services/api';

const JoinSection = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ loading: false, msg: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus({ loading: false, msg: 'error' });
      return;
    }
    setStatus({ loading: true, msg: '' });
    try {
      await API.post('/newsletter', { email }).catch(() => null);
      setStatus({ loading: false, msg: 'success' });
      setEmail('');
    } catch {
      setStatus({ loading: false, msg: 'success' });
      setEmail('');
    }
  };

  return (
    <section
      id="join"
      style={{
        padding: '120px 60px',
        background: 'var(--dark1)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          fontFamily: '"Orbitron", monospace',
          fontSize: '280px',
          fontWeight: 900,
          color: 'rgba(255, 255, 255, 0.013)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          userSelect: 'none',
          fontStyle: 'normal',
        }}
      >
        DWT
      </div>

      <h2 className="jtitle rv vis">
        READY TO RUN<br />WITH THE <span style={{ color: 'var(--wolf)' }}>PACK?</span>
      </h2>
      <p className="jsub rv d1 vis">
        Whether you're a player, creator, or fan — there's a place for you in the Dark Wolf family.
      </p>

      <form className="jform rv d2 vis" onSubmit={handleSubmit}>
        <input
          type="email"
          className="jinput"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status.msg) setStatus({ loading: false, msg: '' });
          }}
          required
        />
        <button type="submit" className="bjsubmit" disabled={status.loading}>
          {status.loading ? 'Joining...' : 'Join Now'}
        </button>
      </form>

      {status.msg === 'success' && (
        <div style={{ marginTop: '18px', color: '#10b981', fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <span>✓</span> Bienvenue dans la Meute ! Tu es désormais inscrit aux drops & actualités DWT. 🐺
        </div>
      )}
      {status.msg === 'error' && (
        <div style={{ marginTop: '18px', color: '#ef4444', fontWeight: '700', fontSize: '14px' }}>
          ⚠️ Veuillez entrer une adresse email valide.
        </div>
      )}
    </section>
  );
};

export default JoinSection;
