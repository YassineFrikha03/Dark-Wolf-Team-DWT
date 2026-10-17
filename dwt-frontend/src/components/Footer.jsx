import React from 'react';
import { Link } from 'react-router-dom';
import { BrandTitle } from './WolfLogo';
import { DiscordIcon, YoutubeIcon, TwitterIcon, InstagramIcon } from './SocialIcons';
import { 
  ArrowUp, 
  Shield, 
  Trophy, 
  ShoppingBag, 
  Users, 
  Sparkles,
  ExternalLink,
  Flame,
  Radio
} from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'À propos', path: '/a-propos' },
    { name: 'Équipe Officielle', path: '/equipe' },
    { name: 'Tournois & Matchs', path: '/tournois' },
    { name: 'Boutique Dark Lab', path: '/boutique' },
    { name: 'Actualités E-sport', path: '/actualites' },
    { name: 'Contact & Recrutement', path: '/contact' }
  ];

  const ecosystemLinks = [
    { name: 'Boutique Dark Lab', path: '/boutique', badge: 'New' },
    { name: 'Maillots & Équipements', path: '/boutique?cat=vetements' },
    { name: 'Périphériques & Tapis', path: '/boutique?cat=accessoires' },
    { name: 'Espace Joueur & Roster', path: '/espace-joueur' },
    { name: 'Postuler dans l\'Équipe', path: '/contact' },
    { name: 'Panier d\'achat', path: '/panier' }
  ];

  const socialChannels = [
    {
      name: 'Discord',
      handle: 'discord.gg/darkwolf',
      url: 'https://discord.gg',
      icon: <DiscordIcon size={20} />,
      badge: 'Communauté',
      color: '#5865F2'
    },
    {
      name: 'YouTube',
      handle: '@DarkWolfTeam',
      url: 'https://youtube.com',
      icon: <YoutubeIcon size={20} />,
      badge: 'VOD & Highlights',
      color: '#FF0000'
    },
    {
      name: 'X / Twitter',
      handle: '@DarkWolfTeam',
      url: 'https://twitter.com',
      icon: <TwitterIcon size={20} />,
      badge: 'Live News',
      color: '#1DA1F2'
    },
    {
      name: 'Instagram',
      handle: '@darkwolf_team',
      url: 'https://instagram.com',
      icon: <InstagramIcon size={20} />,
      badge: 'Coulisses & Photos',
      color: '#E4405F'
    }
  ];

  return (
    <footer className="footer-section">
      <div className="footer-glow-top"></div>
      
      <div className="footer-container">
        {/* Main 4-Column Grid */}
        <div className="footer-grid-main">
          {/* Column 1: Brand & Identity */}
          <div className="footer-col-brand">
            <Link to="/" className="footer-brand-logo" onClick={scrollToTop}>
              <BrandTitle />
            </Link>

            <div className="footer-slogan">ONE PACK. ONE VISION.</div>

            <p className="footer-about-text">
              Club e-sport compétitif fondé le <strong>23 avril 2020</strong>. 
              Présent sur les plus grands champs de bataille virtuels pour repousser les limites de la performance et du divertissement.
            </p>

            <div className="footer-status-pill">
              <span className="footer-status-dot"></span>
              <span>Meute Active • Serveurs Opérationnels</span>
            </div>

            <div className="footer-brand-tags">
              <span className="footer-tag-chip"><Shield size={12} /> Compétition</span>
              <span className="footer-tag-chip"><Flame size={12} /> Dark Lab</span>
              <span className="footer-tag-chip"><Trophy size={12} /> Champions</span>
            </div>
          </div>

          {/* Column 2: Navigation Rapide */}
          <div className="footer-col-nav">
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-links-list">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} onClick={scrollToTop} className="footer-nav-link">
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Écosystème Dark Lab & Gaming */}
          <div className="footer-col-ecosystem">
            <h4 className="footer-col-title">Écosystème & Dark Lab</h4>
            <ul className="footer-links-list">
              {ecosystemLinks.map((item) => (
                <li key={item.name}>
                  <Link to={item.path} onClick={scrollToTop} className="footer-nav-link">
                    <span>{item.name}</span>
                    {item.badge && <span className="footer-link-badge">{item.badge}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Réseaux & Communauté */}
          <div className="footer-col-community">
            <div className="footer-community-header">
              <h4 className="footer-col-title">Rejoindre la Meute</h4>
              <span className="footer-live-badge"><Radio size={12} /> 2.5K+ Membres</span>
            </div>
            <p className="footer-community-sub">
              Suis nos matchs en temps réel, participe aux scrims communautaires et sois le premier informé de chaque drop Dark Lab.
            </p>

            <div className="footer-social-cards">
              {socialChannels.map((soc) => (
                <a 
                  key={soc.name} 
                  href={soc.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="footer-social-card"
                  title={`${soc.name} - ${soc.badge}`}
                >
                  <div className="footer-social-icon-box" style={{ color: soc.color }}>
                    {soc.icon}
                  </div>
                  <div className="footer-social-meta">
                    <span className="footer-social-name">{soc.name}</span>
                    <span className="footer-social-handle">{soc.badge}</span>
                  </div>
                  <ExternalLink size={13} className="footer-social-arrow" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="footer-bottom-left">
            <p className="footer-copyright">
              © 2020 - {currentYear} <span className="highlight-team">DARK WOLF TEAM</span> (DWT). Fondée le <strong>23 avril 2020</strong>. Tous droits réservés.
            </p>
            <div className="footer-micro-links">
              <span>Propulsé par Dark Lab</span>
              <span>•</span>
              <Link to="/contact" onClick={scrollToTop}>Support & Partenariats</Link>
              <span>•</span>
              <Link to="/a-propos" onClick={scrollToTop}>Manifeste</Link>
            </div>
          </div>

          <div className="footer-bottom-right">
            <button 
              onClick={scrollToTop} 
              className="footer-back-to-top"
              title="Retourner en haut de page"
              aria-label="Retourner en haut de page"
            >
              <span>Haut de page</span>
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;