import React, { useState } from 'react';
import API from '../services/api';
import { Shield, ArrowRight } from 'lucide-react';

const JoinSection = ({ onOpenRecruitment }) => {
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

  const handleRecruitmentClick = () => {
    if (onOpenRecruitment) {
      onOpenRecruitment(email);
    } else {
      window.location.href = email ? `/recrutement?email=${encodeURIComponent(email)}` : '/recrutement';
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
        Que vous soyez joueur compétitif, créateur ou supporter, trouvez votre place au sein de la Dark Wolf Team.
      </p>

      {/* Bannière Recrutement Compétitif Officiel */}
      <div
        style={{
          maxWidth: '720px',
          margin: '0 auto 40px auto',
          background: 'linear-gradient(135deg, rgba(230, 0, 0, 0.12) 0%, rgba(14, 18, 30, 0.95) 100%)',
          border: '1px solid rgba(230, 0, 0, 0.4)',
          borderRadius: '10px',
          padding: '24px 28px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff4d4d', fontWeight: '800', letterSpacing: '1.5px', textTransform: 'uppercase', fontSize: '13px' }}>
          <Shield size={16} /> Recrutement Esport Ouvert (Sur Test de Sélection)
        </div>
        <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1', lineHeight: 1.5, maxWidth: '580px' }}>
          Les inscriptions libres sont fermées. Pour intégrer un roster officiel (Valorant, CS2, LoL, Rocket League, R6), soumettez votre dossier afin d'être convoqué par le staff au test pratique d'acceptation.
        </p>
        <button
          type="button"
          onClick={handleRecruitmentClick}
          style={{
            background: '#cc2222',
            border: '1px solid #ff3333',
            color: '#ffffff',
            padding: '12px 26px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '800',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 15px rgba(204, 34, 34, 0.4)',
            transition: 'transform 0.15s, background 0.15s'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#e60000')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#cc2222')}
        >
          Postuler au Recrutement Joueur <ArrowRight size={16} />
        </button>
      </div>

      <p style={{ fontSize: '13px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '14px' }}>
        Ou rejoignez la newsletter officielle
      </p>

      <form className="jform rv d2 vis" onSubmit={handleSubmit}>
        <input
          type="email"
          className="jinput"
          placeholder="Entrez votre adresse email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status.msg) setStatus({ loading: false, msg: '' });
          }}
          required
        />
        <button type="submit" className="bjsubmit" disabled={status.loading}>
          {status.loading ? 'Inscription...' : 'Newsletter'}
        </button>
      </form>

      {status.msg === 'success' && (
        <div style={{ marginTop: '18px', color: '#10b981', fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <span>✓</span> Bienvenue dans la Meute ! Vous êtes désormais inscrit aux actualités officielles DWT.
        </div>
      )}
      {status.msg === 'error' && (
        <div style={{ marginTop: '18px', color: '#ef4444', fontWeight: '700', fontSize: '14px' }}>
          Veuillez entrer une adresse email valide.
        </div>
      )}
    </section>
  );
};

export default JoinSection;
