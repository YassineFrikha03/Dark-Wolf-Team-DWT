import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Laptop, 
  Headphones, 
  MessageSquare, 
  Cpu, 
  Flame, 
  Shield, 
  Radio, 
  ChevronRight, 
  Sparkles 
} from 'lucide-react';
import API from '../services/api';
import '../styles/sponsorsMarquee.css';

const DEFAULT_SPONSORS = [
  {
    _id: 'dubby',
    name: 'DUBBY ENERGY',
    category: 'Boisson Énergétique Officielle',
    perk: 'CODE: DWT (-10%)',
    promoCode: 'DWT',
    accentColor: '#f59e0b',
    iconName: 'Zap',
    websiteUrl: 'https://dubby.gg',
  },
  {
    _id: 'legion',
    name: 'LENOVO LEGION',
    category: 'Stations & Laptops RTX Pro',
    perk: 'STATIONS OFFICIELLES',
    accentColor: '#38bdf8',
    iconName: 'Laptop',
    websiteUrl: 'https://www.lenovo.com/legion',
  },
  {
    _id: 'razer',
    name: 'RAZER',
    category: 'Périphériques E-sport Officiels',
    perk: 'HOMOLOGUÉ TOURNOI',
    accentColor: '#22c55e',
    iconName: 'Headphones',
    websiteUrl: 'https://www.razer.com',
  },
  {
    _id: 'discord',
    name: 'DISCORD',
    category: 'Hub Communautaire Officiel',
    perk: '15,000+ MEMBRES',
    accentColor: '#818cf8',
    iconName: 'MessageSquare',
    websiteUrl: 'https://discord.gg',
  },
  {
    _id: 'logitech',
    name: 'LOGITECH G',
    category: 'Partenaire Périphériques Esport',
    perk: 'LIGHTSPEED WIRELESS',
    accentColor: '#00e5ff',
    iconName: 'Cpu',
    websiteUrl: 'https://www.logitechg.com',
  },
  {
    _id: 'nvidia',
    name: 'NVIDIA GEFORCE RTX',
    category: 'Puissance Graphique & Latence',
    perk: 'REFLEX ULTRA-FAST',
    accentColor: '#76b900',
    iconName: 'Flame',
    websiteUrl: 'https://www.nvidia.com/geforce',
  },
  {
    _id: 'twitch',
    name: 'TWITCH',
    category: 'Diffuseur Officiel Compétitions',
    perk: 'DIFFUSION TOURNOIS',
    accentColor: '#a855f7',
    iconName: 'Radio',
    websiteUrl: 'https://twitch.tv',
  },
  {
    _id: 'darklab',
    name: 'DARK LAB',
    category: 'Apparel & Techwear Officiel',
    perk: 'TEXTILE COMPÉTITION',
    accentColor: '#cc2222',
    iconName: 'Shield',
    websiteUrl: '#shop',
  },
];

const renderIcon = (iconName, color = '#00e5ff') => {
  switch (iconName) {
    case 'Laptop': return <Laptop size={20} color={color} />;
    case 'Headphones': return <Headphones size={20} color={color} />;
    case 'MessageSquare': return <MessageSquare size={20} color={color} />;
    case 'Cpu': return <Cpu size={20} color={color} />;
    case 'Flame': return <Flame size={20} color={color} />;
    case 'Shield': return <Shield size={20} color={color} />;
    case 'Radio': return <Radio size={20} color={color} />;
    case 'Zap':
    default:
      return <Zap size={20} color={color} />;
  }
};

export const SponsorsMarquee = ({ onOpenPartners }) => {
  const [sponsors, setSponsors] = useState(DEFAULT_SPONSORS);

  useEffect(() => {
    API.get('/sponsors?active=true')
      .then((res) => {
        if (res.data?.sponsors && res.data.sponsors.length > 0) {
          setSponsors(res.data.sponsors);
        }
      })
      .catch(() => {
        // En cas d'erreur ou d'absence de connexion, conserver la liste par défaut
      });
  }, []);

  // Duplication de la liste pour garantir un defilement infini sans coupure
  const marqueeItems = [...sponsors, ...sponsors];

  const handleCardClick = (sponsor, e) => {
    e.preventDefault();
    if (onOpenPartners) {
      onOpenPartners(sponsor);
    } else if (sponsor.websiteUrl && sponsor.websiteUrl.startsWith('http')) {
      window.open(sponsor.websiteUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section className="dwt-sponsors-section" aria-label="Sponsors et marques officielles Dark Wolf Team">
      {/* Barre d'en-tete officielle */}
      <div className="dwt-sponsors-header-bar">
        <div className="dwt-sponsors-tagline">
          <span className="dwt-sponsors-live-dot" />
          <span className="dwt-sponsors-title">
            <strong>PARTENAIRES & MARQUES OFFICIELLES</strong> · ILS SOUTIENNENT LA MEUTE
          </span>
        </div>

        {onOpenPartners && (
          <button
            type="button"
            className="dwt-sponsors-modal-trigger"
            onClick={() => onOpenPartners()}
            title="Consulter les réductions et avantages partenaires"
          >
            <Sparkles size={13} />
            <span>VOIR LES OFFRES</span>
            <ChevronRight size={13} />
          </button>
        )}
      </div>

      {/* Ticker de defilement continu */}
      <div className="dwt-marquee-container">
        <div className="dwt-marquee-track">
          {marqueeItems.map((sponsor, index) => {
            const accent = sponsor.accentColor || '#cc2222';
            return (
              <div
                key={`${sponsor._id || sponsor.name}-${index}`}
                className="dwt-sponsor-card"
                style={{
                  '--sponsor-accent': accent,
                  '--sponsor-glow': `${accent}30`,
                }}
                onClick={(e) => handleCardClick(sponsor, e)}
                title={`${sponsor.name} · ${sponsor.category} (Cliquer pour voir l'offre)`}
                role="button"
                tabIndex={0}
              >
                <div className="dwt-sponsor-icon-wrapper">
                  {sponsor.logoUrl ? (
                    <img
                      src={sponsor.logoUrl}
                      alt={sponsor.name}
                      className="dwt-sponsor-logo-img"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.nextSibling) {
                          e.currentTarget.nextSibling.style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}
                  <span style={{ display: sponsor.logoUrl ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {renderIcon(sponsor.iconName, accent)}
                  </span>
                </div>

                <div className="dwt-sponsor-info">
                  <div className="dwt-sponsor-name-row">
                    <span className="dwt-sponsor-name">{sponsor.name}</span>
                  </div>
                  <span className="dwt-sponsor-category">{sponsor.category}</span>
                  <span className="dwt-sponsor-perk-badge">{sponsor.perk}</span>
                </div>

                <div className="dwt-sponsor-arrow">
                  <ChevronRight size={15} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SponsorsMarquee;
