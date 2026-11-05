import React, { useState, useEffect } from 'react';
import API from '../services/api';

const CountdownSection = () => {
  const [event, setEvent] = useState({
    title: 'DWT Summer Championship 2026',
    subtitle: '— Next Major Event —',
    targetDate: '2026-08-15T18:00:00',
    description: 'Le plus grand tournoi esport de la saison organisé par Dark Wolf Team. Venez soutenir la meute !',
    badge: 'ÉVÉNEMENT MAJEUR',
    buttonText: 'Voir le Tournoi',
    buttonLink: '#tournois',
    isActive: true
  });

  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', mins: '00', secs: '00' });
  const [isExpired, setIsExpired] = useState(false);

  const fetchCountdown = async () => {
    try {
      const res = await API.get('/countdown');
      if (res.data?.countdown) {
        setEvent(res.data.countdown);
      }
    } catch (err) {
      console.warn('Impossible de charger le compte à rebours distant, utilisation des valeurs par défaut:', err);
    }
  };

  useEffect(() => {
    fetchCountdown();

    // Écouter les mises à jour en direct depuis le dashboard si modifié
    const handleUpdate = () => fetchCountdown();
    window.addEventListener('dwt_countdown_updated', handleUpdate);

    return () => {
      window.removeEventListener('dwt_countdown_updated', handleUpdate);
    };
  }, []);

  useEffect(() => {
    if (!event.targetDate) return;

    const target = new Date(event.targetDate).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = target - now;

      if (isNaN(diff) || diff <= 0) {
        setTimeLeft({ days: '00', hours: '00', mins: '00', secs: '00' });
        setIsExpired(true);
        return;
      }

      setIsExpired(false);
      setTimeLeft({
        days: String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, '0'),
        hours: String(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0'),
        mins: String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0'),
        secs: String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0'),
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [event.targetDate]);

  // Si l'événement est expressément désactivé par l'admin, on ne l'affiche pas
  if (event.isActive === false) {
    return (
      <div id="countdown" style={{ display: 'none' }} />
    );
  }

  return (
    <section
      id="countdown"
      style={{
        padding: '90px 40px',
        background: 'radial-gradient(ellipse at top, #0c0814 0%, #050608 70%)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(230, 0, 0, 0.15)',
        borderBottom: '1px solid rgba(230, 0, 0, 0.15)'
      }}
    >
      {/* Background Cyber Glowing Orbs */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(230, 0, 0, 0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '20%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.03) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: '900px', margin: '0 auto' }}>
        {/* Badge optionnel */}
        {event.badge && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(230, 0, 0, 0.12)',
            border: '1px solid rgba(230, 0, 0, 0.35)',
            color: 'var(--red-primary)',
            fontSize: '11px',
            fontWeight: '800',
            letterSpacing: '0.2em',
            padding: '4px 14px',
            borderRadius: '20px',
            textTransform: 'uppercase',
            marginBottom: '14px',
            boxShadow: '0 0 15px rgba(230,0,0,0.2)'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--red-primary)', display: 'inline-block', boxShadow: '0 0 8px #ff0000' }}></span>
            {event.badge}
          </div>
        )}

        {/* Événement / Sous-titre */}
        <div className="cev rv vis">{event.subtitle || '— Next Major Event —'}</div>

        {/* Titre de l'événement */}
        <h2 className="ctitle rv d1 vis" style={{ marginBottom: event.description ? '16px' : '40px' }}>
          {event.title || 'DWT Summer Championship 2026'}
        </h2>

        {/* Description éventuelle de l'événement */}
        {event.description && (
          <p style={{
            color: '#94a3b8',
            fontSize: '15px',
            maxWidth: '650px',
            margin: '0 auto 40px',
            lineHeight: '1.6',
            fontWeight: '400'
          }}>
            {event.description}
          </p>
        )}

        {/* Timer Blocks */}
        <div className="tblocks rv d2 vis">
          <div className="tblock">
            <div className="tnum" id="tdays">{timeLeft.days}</div>
            <div className="tlbl">Jours</div>
          </div>
          <div className="tsep">:</div>
          <div className="tblock">
            <div className="tnum" id="thours">{timeLeft.hours}</div>
            <div className="tlbl">Heures</div>
          </div>
          <div className="tsep">:</div>
          <div className="tblock">
            <div className="tnum" id="tmins">{timeLeft.mins}</div>
            <div className="tlbl">Minutes</div>
          </div>
          <div className="tsep">:</div>
          <div className="tblock">
            <div className="tnum" id="tsecs">{timeLeft.secs}</div>
            <div className="tlbl">Secondes</div>
          </div>
        </div>

        {/* Statut si le compte à rebours est atteint */}
        {isExpired && (
          <div style={{
            marginTop: '30px',
            padding: '12px 24px',
            background: 'rgba(230, 0, 0, 0.15)',
            border: '1px solid var(--red-primary)',
            borderRadius: '8px',
            display: 'inline-block',
            color: '#fff',
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '14px',
            letterSpacing: '0.1em'
          }}>
             L'ÉVÉNEMENT EST EN COURS ! REJOIGNEZ LE STREAM
          </div>
        )}

        {/* Bouton d'action CTA configuré dans le dashboard */}
        {event.buttonText && (
          <div style={{ marginTop: '36px' }}>
            <a
              href={event.buttonLink || '#tournois'}
              className="btn-rejoindre"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 32px',
                fontSize: '14px',
                fontWeight: '800',
                letterSpacing: '0.08em',
                textDecoration: 'none',
                borderRadius: '4px',
                boxShadow: '0 0 20px rgba(230, 0, 0, 0.4)',
                cursor: 'pointer'
              }}
              onClick={(e) => {
                if (event.buttonLink?.startsWith('#')) {
                  e.preventDefault();
                  const targetEl = document.querySelector(event.buttonLink);
                  if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth' });
                  }
                }
              }}
            >
              {event.buttonText}
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default CountdownSection;
