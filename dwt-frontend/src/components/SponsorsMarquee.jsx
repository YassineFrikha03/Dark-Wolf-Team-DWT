import React from 'react';
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
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { SOCIAL_LINKS } from '../config/socialLinks';
import '../styles/sponsorsMarquee.css';

const SPONSORS_DATA = [
  {
    id: 'dubby',
    name: 'DUBBY ENERGY',
    category: 'Boisson Énergétique Officielle',
    perk: 'CODE: DWT (-10%)',
    accent: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.28)',
    icon: <Zap size={22} color="#f59e0b" />,
    url: 'https://dubby.gg',
  },
  {
    id: 'legion',
    name: 'LENOVO LEGION',
    category: 'Stations & Laptops RTX Pro',
    perk: 'STATIONS OFFICIELLES',
    accent: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.28)',
    icon: <Laptop size={22} color="#38bdf8" />,
    url: 'https://www.lenovo.com/legion',
  },
  {
    id: 'razer',
    name: 'RAZER',
    category: 'Périphériques E-sport Officiels',
    perk: 'HOMOLOGUÉ TOURNOI',
    accent: '#22c55e',
    glow: 'rgba(34, 197, 94, 0.28)',
    icon: <Headphones size={22} color="#22c55e" />,
    url: 'https://www.razer.com',
  },
  {
    id: 'discord',
    name: 'DISCORD',
    category: 'Hub Communautaire Officiel',
    perk: '15,000+ MEMBRES',
    accent: '#818cf8',
    glow: 'rgba(129, 140, 248, 0.28)',
    icon: <MessageSquare size={22} color="#818cf8" />,
    url: SOCIAL_LINKS?.discord || 'https://discord.gg',
  },
  {
    id: 'logitech',
    name: 'LOGITECH G',
    category: 'Partenaire Périphériques Esport',
    perk: 'LIGHTSPEED WIRELESS',
    accent: '#00e5ff',
    glow: 'rgba(0, 229, 255, 0.28)',
    icon: <Cpu size={22} color="#00e5ff" />,
    url: 'https://www.logitechg.com',
  },
  {
    id: 'nvidia',
    name: 'NVIDIA GEFORCE RTX',
    category: 'Puissance Graphique & Latence',
    perk: 'REFLEX ULTRA-FAST',
    accent: '#76b900',
    glow: 'rgba(118, 185, 0, 0.28)',
    icon: <Flame size={22} color="#76b900" />,
    url: 'https://www.nvidia.com/geforce',
  },
  {
    id: 'twitch',
    name: 'TWITCH',
    category: 'Diffuseur Officiel Compétitions',
    perk: 'DIFFUSION TOURNOIS',
    accent: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.28)',
    icon: <Radio size={22} color="#a855f7" />,
    url: 'https://twitch.tv',
  },
  {
    id: 'darklab',
    name: 'DARK LAB',
    category: 'Apparel & Techwear Officiel',
    perk: 'TEXTILE COMPÉTITION',
    accent: '#e10613',
    glow: 'rgba(225, 6, 19, 0.28)',
    icon: <Shield size={22} color="#e10613" />,
    url: '#shop',
  },
];

export const SponsorsMarquee = ({ onOpenPartners }) => {
  // Duplication de la liste pour garantir un defilement infini sans coupure
  const marqueeItems = [...SPONSORS_DATA, ...SPONSORS_DATA];

  const handleCardClick = (sponsor, e) => {
    e.preventDefault();
    if (onOpenPartners) {
      onOpenPartners(sponsor);
    } else if (sponsor.url && sponsor.url.startsWith('http')) {
      window.open(sponsor.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section className="dwt-sponsors-section" aria-label="Sponsors et marques officielles Dark Wolf Team">
      {/* Barre d'en-tete */}
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
            <Sparkles size={12} />
            <span>VOIR LES OFFRES</span>
            <ChevronRight size={12} />
          </button>
        )}
      </div>

      {/* Ticker de defilement continu */}
      <div className="dwt-marquee-container">
        <div className="dwt-marquee-track">
          {marqueeItems.map((sponsor, index) => (
            <div
              key={`${sponsor.id}-${index}`}
              className="dwt-sponsor-card"
              style={{
                '--sponsor-accent': sponsor.accent,
                '--sponsor-glow': sponsor.glow,
              }}
              onClick={(e) => handleCardClick(sponsor, e)}
              title={`${sponsor.name} · ${sponsor.category} (Cliquer pour voir l'offre)`}
              role="button"
              tabIndex={0}
            >
              <div className="dwt-sponsor-icon-wrapper">
                {sponsor.icon}
              </div>

              <div className="dwt-sponsor-info">
                <div className="dwt-sponsor-name-row">
                  <span className="dwt-sponsor-name">{sponsor.name}</span>
                </div>
                <span className="dwt-sponsor-category">{sponsor.category}</span>
                <span className="dwt-sponsor-perk-badge">{sponsor.perk}</span>
              </div>

              <div className="dwt-sponsor-arrow">
                <ChevronRight size={16} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SponsorsMarquee;
