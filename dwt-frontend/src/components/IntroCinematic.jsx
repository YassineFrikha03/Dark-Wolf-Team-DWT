import React, { useState, useEffect, useRef, useCallback } from 'react';
import introVideo from '../assets/intro-cinematic.mp4';

const IntroCinematic = ({ onFinish }) => {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef(null);

  const closeIntro = useCallback(() => {
    if (fading) return;
    setFading(true);
    if (videoRef.current) {
      const v = videoRef.current;
      let vol = v.volume;
      const fadeInterval = setInterval(() => {
        vol = Math.max(0, vol - 0.2);
        if (v) v.volume = vol;
        if (vol <= 0) {
          clearInterval(fadeInterval);
          if (v) v.pause();
        }
      }, 50);
    }
    setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = 'auto';
      onFinish?.();
    }, 600);
  }, [fading, onFinish]);

  const toggleSound = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
      if (!nextMuted) {
        videoRef.current.volume = 1.0;
        videoRef.current.play().catch(() => {});
      }
    }
  };

  useEffect(() => {
    if (!visible) return;
    document.body.style.overflow = 'hidden';

    // Attempt autoplay
    if (videoRef.current) {
      videoRef.current.volume = 1.0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().catch(() => {});
          }
        });
      }
    }

    // Unmute on first user click anywhere
    const handleFirstClick = () => {
      if (videoRef.current && videoRef.current.muted) {
        videoRef.current.muted = false;
        videoRef.current.volume = 1.0;
        setIsMuted(false);
      }
    };

    // Dynamic progress countdown matching the video duration
    const startTime = Date.now();
    const interval = setInterval(() => {
      const v = videoRef.current;
      if (v && v.duration && Number.isFinite(v.duration) && v.duration > 0) {
        const pct = Math.min(100, Math.floor((v.currentTime / v.duration) * 100));
        setProgress(pct);
        if (v.ended || (v.currentTime >= v.duration - 0.15)) {
          clearInterval(interval);
          closeIntro();
        }
      } else {
        const elapsed = Date.now() - startTime;
        const fallbackDuration = 8000;
        const pct = Math.min(100, Math.floor((elapsed / fallbackDuration) * 100));
        setProgress(pct);
        if (elapsed >= fallbackDuration) {
          clearInterval(interval);
          closeIntro();
        }
      }
    }, 50);

    // Keyboard controls (Enter, Space, Escape)
    const handleKeyDown = (e) => {
      if (['Enter', ' ', 'Escape'].includes(e.key)) {
        e.preventDefault();
        closeIntro();
      }
    };

    window.addEventListener('click', handleFirstClick, { once: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = 'auto';
      window.removeEventListener('click', handleFirstClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [visible, closeIntro]);

  if (!visible) return null;

  return (
    <div
      id="INTRO"
      className={fading ? 'hide' : ''}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        backgroundColor: '#040406',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        userSelect: 'none',
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1), transform 0.75s ease',
        transform: fading ? 'scale(1.05)' : 'scale(1)',
        pointerEvents: fading ? 'none' : 'auto',
      }}
    >
      {/* Fullscreen Video Scene from src/assets - No poster so it starts directly with video */}
      <video
        ref={videoRef}
        src={introVideo}
        autoPlay
        playsInline
        muted={isMuted}
        onEnded={closeIntro}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center center',
          pointerEvents: 'none',
        }}
      >
        <source src={introVideo} type="video/mp4" />
        <source src="/intro-video.mp4" type="video/mp4" />
      </video>

      {/* Subtle Cinematic Vignette for Edge Softening */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 65%, rgba(4, 5, 8, 0.25) 85%, rgba(4, 5, 8, 0.8) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Sound Toggle Button (Top Right) */}
      <button
        onClick={toggleSound}
        aria-label="Toggle Sound"
        title={isMuted ? 'Activer le son' : 'Couper le son'}
        style={{
          position: 'absolute',
          top: '28px',
          right: '32px',
          zIndex: 100,
          background: 'rgba(12, 16, 26, 0.75)',
          backdropFilter: 'blur(10px)',
          border: isMuted ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(255, 45, 65, 0.7)',
          borderRadius: '24px',
          padding: '7px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: isMuted ? '#94a3b8' : '#ffffff',
          fontFamily: '"Orbitron", sans-serif',
          fontSize: '11px',
          fontWeight: '700',
          letterSpacing: '0.1em',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: isMuted ? 'none' : '0 0 14px rgba(255, 30, 50, 0.4)',
        }}
      >
        <span>{isMuted ? '' : ''}</span>
        <span>{isMuted ? 'SON COUPÉ' : 'SON ACTIF'}</span>
      </button>

      {/* Futuristic Skip Button in Bottom Right */}
      <button
        onClick={closeIntro}
        style={{
          position: 'absolute',
          bottom: '36px',
          right: '36px',
          zIndex: 100,
          background: 'rgba(12, 16, 26, 0.75)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
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
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
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
    </div>
  );
};

export default IntroCinematic;
