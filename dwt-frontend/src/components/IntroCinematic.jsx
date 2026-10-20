import React, { useState, useEffect } from 'react';

const IntroCinematic = () => {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(0);

  const closeIntro = () => {
    setFading(true);
    setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = 'auto';
    }, 800);
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    // Smooth countdown progress bar
    const startTime = Date.now();
    const duration = 4200;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);
      if (elapsed >= duration) {
        clearInterval(interval);
        closeIntro();
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div
      id="INTRO"
      className={fading ? 'hide' : ''}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        background: '#040508',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        overflow: 'hidden',
        userSelect: 'none',
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s ease',
        transform: fading ? 'scale(1.05)' : 'scale(1)',
      }}
    >
      {/* Background Cyber Grid in Pure Monochrome */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          backgroundPosition: 'center center',
          pointerEvents: 'none',
        }}
      />

      {/* Radial Vignette & Pure White/Silver Ambient Glows */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.12) 0%, rgba(6, 8, 14, 0.85) 55%, #040508 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Floating Hologram Silver Particles */}
      <div className="particle" style={{ top: '15%', left: '18%', animationDuration: '6s', background: '#fff' }} />
      <div className="particle" style={{ top: '25%', left: '82%', animationDuration: '8s', background: '#fff' }} />
      <div className="particle" style={{ top: '75%', left: '22%', animationDuration: '7s', background: '#fff' }} />
      <div className="particle" style={{ top: '80%', left: '78%', animationDuration: '9s', background: '#fff' }} />
      <div className="particle" style={{ top: '45%', left: '8%', animationDuration: '10s', background: '#fff' }} />
      <div className="particle" style={{ top: '50%', left: '92%', animationDuration: '6.5s', background: '#fff' }} />

      {/* Corner Sci-Fi Tech Brackets in Crisp Silver */}
      <div style={{ position: 'absolute', top: '30px', left: '30px', width: '36px', height: '36px', borderTop: '2px solid rgba(255,255,255,0.35)', borderLeft: '2px solid rgba(255,255,255,0.35)' }} />
      <div style={{ position: 'absolute', top: '30px', right: '30px', width: '36px', height: '36px', borderTop: '2px solid rgba(255,255,255,0.35)', borderRight: '2px solid rgba(255,255,255,0.35)' }} />
      <div style={{ position: 'absolute', bottom: '30px', left: '30px', width: '36px', height: '36px', borderBottom: '2px solid rgba(255,255,255,0.35)', borderLeft: '2px solid rgba(255,255,255,0.35)' }} />
      <div style={{ position: 'absolute', bottom: '30px', right: '30px', width: '36px', height: '36px', borderBottom: '2px solid rgba(255,255,255,0.35)', borderRight: '2px solid rgba(255,255,255,0.35)' }} />

      {/* Horizontal Ambient Scanline Beam */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
          animation: 'scanbeam 4s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />

      {/* Center Cinematic Stage */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          textAlign: 'center',
        }}
      >
        {/* Holographic Crest with Enriched Larger Logo & Monochrome Sci-Fi Orbit Rings */}
        <div
          style={{
            position: 'relative',
            width: '270px',
            height: '270px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '26px',
          }}
        >
          {/* Outer Pulsing Silver Aura */}
          <div
            style={{
              position: 'absolute',
              inset: '-15px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.06) 65%, transparent 75%)',
              filter: 'blur(28px)',
              animation: 'crestPulse 3s ease-in-out infinite',
            }}
          />

          {/* Sci-Fi Rotating Outer Ring (Pure White / Silver) */}
          <svg
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              animation: 'spinCw 14s linear infinite',
            }}
            viewBox="0 0 270 270"
          >
            <circle
              cx="135"
              cy="135"
              r="128"
              fill="none"
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth="1.5"
              strokeDasharray="20 14 45 10"
            />
            <circle
              cx="135"
              cy="135"
              r="116"
              fill="none"
              stroke="rgba(255, 255, 255, 0.18)"
              strokeWidth="1"
              strokeDasharray="6 10"
            />
          </svg>

          {/* Sci-Fi Counter-Rotating Ring (Silver / Platinum) */}
          <svg
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              animation: 'spinCcw 9s linear infinite',
            }}
            viewBox="0 0 270 270"
          >
            <circle
              cx="135"
              cy="135"
              r="104"
              fill="none"
              stroke="rgba(255, 255, 255, 0.65)"
              strokeWidth="2"
              strokeDasharray="50 30 20 30"
            />
          </svg>

          {/* Central Logo Pod (Enlarged) */}
          <div
            style={{
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, #181d28 0%, #0c0f16 75%, #05070c 100%)',
              border: '2px solid rgba(255, 255, 255, 0.65)',
              boxShadow: '0 0 35px rgba(255, 255, 255, 0.35), inset 0 0 28px rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              animation: 'logoFloat 3.5s ease-in-out infinite',
            }}
          >
            {/* The Official Dark Wolf Team Logo - Enlarged & Enhanced */}
            <img
              src="/logo-dwt.png"
              alt="Dark Wolf Team Crest"
              style={{
                width: '130px',
                height: '130px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.85)) drop-shadow(0 0 5px #ffffff)',
                animation: 'logoReveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              }}
            />

            {/* Sweep Laser Hologram Beam in Pure White */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, transparent, #ffffff, #ffffff, transparent)',
                boxShadow: '0 0 14px #ffffff',
                borderRadius: '50%',
                animation: 'laserSweep 2.2s ease-in-out infinite',
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>

        {/* Telemetry Status Line in Pure White / Silver */}
        <div
          style={{
            fontFamily: '"Orbitron", monospace',
            fontSize: '11px',
            fontWeight: '800',
            letterSpacing: '0.28em',
            color: '#ffffff',
            textTransform: 'uppercase',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeInUp 0.8s 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            opacity: 0,
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 0 10px #ffffff' }} />
          <span>// PROTOCOLE ALPHA • REPAIRE OFFICIEL</span>
        </div>

        {/* Grand Brand Name in Glowing Platinum */}
        <h1
          style={{
            fontFamily: '"Orbitron", sans-serif',
            fontSize: 'clamp(30px, 6vw, 56px)',
            fontWeight: '900',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            margin: 0,
            background: 'linear-gradient(180deg, #ffffff 30%, #e2e8f0 70%, #94a3b8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 35px rgba(255, 255, 255, 0.4), 0 0 70px rgba(255, 255, 255, 0.2)',
            animation: 'letterExpand 1.4s 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            opacity: 0,
          }}
        >
          DARK WOLF TEAM
        </h1>

        {/* Subtitle / Department */}
        <div
          style={{
            fontFamily: '"Rajdhani", sans-serif',
            fontSize: 'clamp(12px, 2.5vw, 16px)',
            fontWeight: '700',
            color: '#cbd5e1',
            letterSpacing: '0.45em',
            textTransform: 'uppercase',
            marginTop: '8px',
            animation: 'fadeInUp 0.8s 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            opacity: 0,
          }}
        >
          HUNT • ADAPT • DOMINATE &mdash; DARK LAB EST. 2021
        </div>

        {/* Glowing Equalizer Audio Frequency Spectrum Bars in Pure Monochrome White */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: '28px',
            height: '24px',
            animation: 'fadeInUp 0.8s 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            opacity: 0,
          }}
        >
          {[0.6, 0.9, 0.4, 1.0, 0.7, 0.5, 0.8, 0.3].map((delay, idx) => (
            <div
              key={idx}
              style={{
                width: '3.5px',
                borderRadius: '3px',
                background: idx % 2 === 0 ? '#ffffff' : '#94a3b8',
                boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
                animation: `equalizeBar 0.9s ${delay * 0.4}s ease-in-out infinite alternate`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Futuristic Skip Button with Circular Progress Countdown in White */}
      <button
        onClick={closeIntro}
        style={{
          position: 'absolute',
          bottom: '36px',
          right: '36px',
          zIndex: 100,
          background: 'rgba(12, 16, 26, 0.75)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '40px',
          padding: '10px 22px 10px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#ffffff',
          fontFamily: '"Orbitron", sans-serif',
          fontSize: '11px',
          fontWeight: '800',
          letterSpacing: '0.12em',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#ffffff';
          e.currentTarget.style.boxShadow = '0 0 25px rgba(255, 255, 255, 0.45)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.6)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        {/* Circular Progress Ring in White */}
        <svg width="22" height="22" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
          <circle
            cx="12"
            cy="12"
            r="10"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            strokeDasharray="62.8"
            strokeDashoffset={62.8 - (62.8 * progress) / 100}
            strokeLinecap="round"
            transform="rotate(-90 12 12)"
            style={{ transition: 'stroke-dashoffset 0.1s linear' }}
          />
        </svg>
        <span>PASSER &rarr;</span>
      </button>

      {/* Keyframe Animations */}
      <style>{`
        @keyframes spinCw {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spinCcw {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes crestPulse {
          0%, 100% { opacity: 0.5; transform: scale(0.96); }
          50% { opacity: 0.9; transform: scale(1.08); }
        }
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-7px); }
        }
        @keyframes logoReveal {
          0% { opacity: 0; transform: scale(0.65) rotate(-10deg); filter: blur(6px); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); filter: blur(0px); }
        }
        @keyframes laserSweep {
          0% { top: 10%; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { top: 90%; opacity: 0; }
        }
        @keyframes letterExpand {
          0% { opacity: 0; letter-spacing: 0.45em; transform: translateY(20px); filter: blur(4px); }
          100% { opacity: 1; letter-spacing: 0.25em; transform: translateY(0); filter: blur(0px); }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(18px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes scanbeam {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes equalizeBar {
          0% { height: 4px; }
          100% { height: 22px; }
        }
      `}</style>
    </div>
  );
};

export default IntroCinematic;
