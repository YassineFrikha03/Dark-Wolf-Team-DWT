import React, { useState } from 'react';
import { X, ExternalLink, ShieldCheck, Zap, Laptop, Headphones, MessageSquare, Copy, Check } from 'lucide-react';
import { SOCIAL_LINKS } from '../config/socialLinks';

const partnersList = [
  {
    name: 'DUBBY ENERGY',
    category: 'Boisson Énergétique Officielle',
    desc: 'La formule nootropique propre sans crash qui alimente les réflexes et la concentration de nos joueurs durant les compétitions majeures.',
    perk: '10% de réduction immédiate avec le code : DWT',
    code: 'DWT',
    url: 'https://dubby.gg',
    icon: <Zap size={28} color="#eab308" />,
    badgeColor: '#eab308',
  },
  {
    name: 'LENOVO LEGION',
    category: 'Partenaire Matériel & Stations Gaming',
    desc: 'Laptops et tours de compétition équipés des derniers processeurs et cartes graphiques RTX pour un framerate maximal sans compromis.',
    perk: 'Stations officielles d’entraînement de la Dark Wolf House',
    url: 'https://www.lenovo.com/legion',
    icon: <Laptop size={28} color="#38bdf8" />,
    badgeColor: '#38bdf8',
  },
  {
    name: 'RAZER',
    category: 'Périphériques E-sport Officiels',
    desc: 'Souris ultra-légères à capteur optique 8KHz, claviers mécaniques ultra-rapides et casques audio spatialisés pour un avantage décisif.',
    perk: 'Équipement homologué tournoi pour tous nos rosters',
    url: 'https://www.razer.com',
    icon: <Headphones size={28} color="#22c55e" />,
    badgeColor: '#22c55e',
  },
  {
    name: 'DISCORD',
    category: 'Hub Communautaire Officiel',
    desc: 'Le repaire de la meute réunissant plus de 15,000 membres actifs, salons vocaux dédiés aux scrims, et annonces exclusives en avant-première.',
    perk: 'Serveur vérifié officiel avec rôles exclusifs fans',
    url: SOCIAL_LINKS.discord,
    icon: <MessageSquare size={28} color="#818cf8" />,
    badgeColor: '#818cf8',
  },
];

const PartnersModal = ({ isOpen, onClose, onOpenContact }) => {
  const [copiedCode, setCopiedCode] = useState(null);

  if (!isOpen) return null;

  const copyCode = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

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
          maxWidth: '860px',
          width: '100%',
          maxHeight: '90vh',
          background: '#090d16',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          borderRadius: '14px',
          overflowY: 'auto',
          padding: '32px',
          boxShadow: '0 30px 80px -15px rgba(0,0,0,0.95), 0 0 40px rgba(56, 189, 248, 0.15)',
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
          <div style={{ display: 'inline-flex', padding: '10px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.4)', marginBottom: '12px' }}>
            <ShieldCheck size={32} color="#38bdf8" />
          </div>
          <div className="slbl" style={{ color: '#38bdf8' }}>Partenaires & Sponsors</div>
          <h2 style={{ fontFamily: '"Orbitron", sans-serif', fontSize: '26px', fontWeight: '900', color: '#fff', letterSpacing: '0.05em' }}>
            ILS SOUTIENNENT LA MEUTE
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '6px' }}>
            Des marques de rang mondial qui propulsent nos athlètes vers les sommets.
          </p>
        </div>

        {/* Partners Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
          {partnersList.map((p, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
                transition: 'all 0.25s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = p.badgeColor;
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ padding: '8px', borderRadius: '8px', background: `${p.badgeColor}18` }}>
                      {p.icon}
                    </div>
                    <div>
                      <div style={{ fontFamily: '"Orbitron", sans-serif', fontSize: '17px', fontWeight: '900', color: '#fff' }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: '11px', color: p.badgeColor, fontWeight: '700', textTransform: 'uppercase' }}>
                        {p.category}
                      </div>
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6 }}>
                  {p.desc}
                </p>

                {p.perk && (
                  <div
                    style={{
                      marginTop: '12px',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px dashed rgba(255,255,255,0.15)',
                      fontSize: '12px',
                      color: '#cbd5e1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>{p.perk}</span>
                    {p.code && (
                      <button
                        type="button"
                        onClick={() => copyCode(p.code)}
                        style={{
                          background: copiedCode === p.code ? '#22c55e' : '#e60000',
                          border: 'none',
                          color: '#fff',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          fontSize: '11px',
                          fontWeight: '800',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        {copiedCode === p.code ? <Check size={12} /> : <Copy size={12} />}
                        {copiedCode === p.code ? 'Copié' : 'Copier'}
                      </button>
                    )}
                  </div>
                )}
              </div>

              <a
                href={p.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '9px 16px',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: '700',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
              >
                <span>Visiter le site officiel</span>
                <ExternalLink size={13} />
              </a>
            </div>
          ))}
        </div>

        {/* Partnership call to action */}
        <div
          style={{
            marginTop: '24px',
            padding: '16px 20px',
            background: 'linear-gradient(135deg, rgba(230,0,0,0.15), rgba(0,0,0,0.4))',
            border: '1px solid rgba(230,0,0,0.3)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <div style={{ fontFamily: '"Orbitron", sans-serif', fontSize: '14px', fontWeight: '800', color: '#fff' }}>
              Vous souhaitez devenir partenaire de la Dark Wolf Team ?
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
              Associez votre marque à l'une des structures e-sport les plus dynamiques de la région MENA.
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onOpenContact) onOpenContact();
              else {
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            style={{
              padding: '8px 18px',
              background: '#e60000',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontFamily: '"Orbitron", sans-serif',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: '0 0 15px rgba(230,0,0,0.4)',
            }}
          >
            Nous Contacter ✉️
          </button>
        </div>
      </div>
    </div>
  );
};

export default PartnersModal;
