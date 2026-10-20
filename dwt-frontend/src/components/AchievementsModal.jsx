import React from 'react';
import { X, Trophy, Award, Medal, Shield, Star, Calendar } from 'lucide-react';

const achievementsList = [
  {
    title: 'Tunisia Cup CS2 — Champions Nationaux',
    game: 'Counter-Strike 2',
    date: '12 Octobre 2026',
    place: '1ère Place 🏆',
    cashPrize: '15,000 TND',
    desc: 'Victoire 3-0 en grande finale sans concéder une seule carte face aux meilleures structures nord-africaines.',
    badge: 'GOLD',
    color: '#f59e0b',
  },
  {
    title: 'North Africa Valorant Masters — Finalistes',
    game: 'Valorant',
    date: 'Août 2026',
    place: 'Vice-Champions 🥈',
    cashPrize: '8,000 TND',
    desc: 'Parcours historique du roster DWT Radiant jusqu’à l’ultime overtime de la manche 5.',
    badge: 'SILVER',
    color: '#94a3b8',
  },
  {
    title: 'Maghreb League of Legends Circuit — Champions',
    game: 'League of Legends',
    date: 'Mai 2026',
    place: '1ère Place 🏆',
    cashPrize: '12,000 TND',
    desc: 'Domination totale de la faille de l’invocateur avec un KDA record pour notre midlaner.',
    badge: 'GOLD',
    color: '#f59e0b',
  },
  {
    title: 'FC 25 Red Bull Pro Series — Vainqueurs',
    game: 'EA Sports FC 25',
    date: 'Mars 2026',
    place: '1ère Place 🏆',
    cashPrize: '6,000 TND',
    desc: 'Trophée individuel et par équipe décroché avec un sans-faute en phase éliminatoire.',
    badge: 'GOLD',
    color: '#f59e0b',
  },
  {
    title: 'Arab Esports Rocket League Open — Top 3',
    game: 'Rocket League',
    date: 'Janvier 2026',
    place: '3ème Place 🥉',
    cashPrize: '4,500 TND',
    desc: 'Podium arabe face à des équipes de calibre international sur le serveur MENA.',
    badge: 'BRONZE',
    color: '#b45309',
  },
];

const AchievementsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="dash-modal-backdrop"
      style={{
        zIndex: 99999,
        background: 'rgba(3, 5, 10, 0.94)',
        backdropFilter: 'blur(14px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        position: 'fixed',
        inset: 0,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="dash-modal-box"
        style={{
          maxWidth: '850px',
          width: '100%',
          maxHeight: '90vh',
          background: '#090d16',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          borderRadius: '14px',
          overflowY: 'auto',
          padding: '32px',
          boxShadow: '0 30px 80px -15px rgba(0,0,0,0.95), 0 0 40px rgba(245, 158, 11, 0.15)',
          position: 'relative',
        }}
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'inline-flex', padding: '10px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.4)', marginBottom: '12px' }}>
            <Trophy size={32} color="#f59e0b" />
          </div>
          <div className="slbl" style={{ color: '#f59e0b' }}>Dark Wolf Team • Palmarès</div>
          <h2 style={{ fontFamily: '"Orbitron", sans-serif', fontSize: '26px', fontWeight: '900', color: '#fff', letterSpacing: '0.05em' }}>
            ACHIEVEMENTS & TROPHÉES
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '6px' }}>
            L'histoire de notre meute s'écrit dans les victoires et la domination compétitive.
          </p>
        </div>

        {/* Trophies Grid */}
        <div style={{ display: 'grid', gap: '14px' }}>
          {achievementsList.map((ach, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
                padding: '18px 22px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.07)',
                borderRadius: '10px',
                transition: 'all 0.25s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = ach.color;
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.07)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              }}
            >
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '10px',
                  background: `${ach.color}22`,
                  border: `1px solid ${ach.color}66`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Medal size={24} color={ach.color} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: '"Orbitron", sans-serif', fontSize: '15px', fontWeight: '800', color: '#fff' }}>
                    {ach.title}
                  </span>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: `${ach.color}33`, color: ach.color, fontWeight: '700' }}>
                    {ach.place}
                  </span>
                </div>

                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px', lineHeight: 1.5 }}>
                  {ach.desc}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
                  <span>🎮 {ach.game}</span>
                  <span>📅 {ach.date}</span>
                  <span style={{ color: '#22c55e', fontWeight: '700' }}>💰 {ach.cashPrize}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AchievementsModal;
