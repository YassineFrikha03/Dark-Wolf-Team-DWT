import React from 'react';
import { Link } from 'react-router-dom';
import { WolfLogo } from '../components/WolfLogo';
import { 
  Target, 
  Users, 
  TrendingUp, 
  Flame, 
  ArrowRight, 
  Sparkles, 
  Gamepad2, 
  ShieldCheck, 
  ShoppingBag,
  Swords,
  Trophy
} from 'lucide-react';

const AboutSection = () => {
  const gamesList = [
    { name: 'Valorant', role: 'Tactical Shooter' },
    { name: 'League of Legends', role: 'MOBA' },
    { name: 'CS:GO / CS2', role: 'FPS Compétitif' },
    { name: 'FIFA / EA FC', role: 'Sports E-Sport' },
    { name: '& Nombreux Autres Titres', role: 'Multigaming' }
  ];

  const pillars = [
    {
      title: 'ESPRIT DE MEUTE',
      desc: 'Plus qu’une simple équipe, nous sommes une meute unie et solidaire.',
      icon: <Users size={26} />
    },
    {
      title: 'COMPÉTITION & DOMINATION',
      desc: 'Repousser les limites de la performance sur chaque champ de bataille virtuel.',
      icon: <Target size={26} />
    },
    {
      title: 'DARK LAB LIFESTYLE',
      desc: 'Notre propre marque créative et streetwear prolongeant l\'expérience au-delà de l\'écran.',
      icon: <Sparkles size={26} />
    },
    {
      title: 'COMMUNAUTÉ SOUDÉE',
      desc: 'Bâtir une communauté passionnée, engagée et fière de porter nos couleurs.',
      icon: <Flame size={26} />
    }
  ];

  return (
    <section className="about-section" id="a-propos">
      <div className="section-container">
        {/* HEADER HERO TERRITOIRE */}
        <div className="about-hero-card">
          <div className="about-hero-left">
            <div className="about-badge">
              🐺 Fondée le 23 avril 2020 • Territoire Officiel DWT
            </div>
            <h1 className="about-main-title">
              BIENVENUE SUR LE TERRITOIRE DE LA <span className="text-red-glow">DARK WOLF TEAM</span>
            </h1>
            <p className="about-lead-quote">
              « Plus qu’une simple équipe e-sport, nous sommes une meute. »
            </p>
            <p className="about-paragraph">
              Présente sur les plus grands champs de bataille virtuels — de <strong>Valorant</strong> à <strong>League of Legends</strong>, en passant par <strong>CS:GO</strong>, <strong>FIFA</strong> et de nombreux autres titres — <strong>Dark Wolf Team</strong> repousse les limites de la performance et du divertissement.
            </p>

            {/* Badges des jeux compétitifs */}
            <div className="about-games-chips">
              {gamesList.map((g) => (
                <div key={g.name} className="about-game-chip">
                  <Gamepad2 size={14} color="var(--red-primary)" />
                  <span>{g.name}</span>
                </div>
              ))}
            </div>

            <div className="about-hero-actions">
              <Link to="/contact" className="btn-red-primary">
                Rejoindre la Meute <ArrowRight size={18} />
              </Link>
              <Link to="/boutique" className="btn-outline-white">
                <ShoppingBag size={18} /> Explorer le Merch
              </Link>
            </div>
          </div>

          <div className="about-hero-right">
            <div className="about-wolf-emblem-wrap">
              <div className="about-emblem-glow-ring"></div>
              <WolfLogo size={220} />
              <div className="about-emblem-caption">
                DARK WOLF TEAM • DEPUIS LE 23 AVRIL 2020
              </div>
              <div style={{ marginTop: '6px', fontSize: '11px', color: 'var(--red-primary)', fontWeight: '800', letterSpacing: '1.2px' }}>
                +6 ANS D'HISTOIRE & DE COMPÉTITION
              </div>
            </div>
          </div>
        </div>

        {/* NOTRE OBJECTIF / MISSION CARD */}
        <div className="about-mission-card">
          <div className="about-mission-icon-box">
            <Trophy size={36} color="var(--red-primary)" />
          </div>
          <div className="about-mission-content">
            <div className="about-mission-tag">NOTRE MISSION & AMBITION</div>
            <h2 className="about-mission-quote">
              « Notre objectif est simple : dominer la compétition tout en bâtissant une communauté soudée et passionnée. »
            </h2>
          </div>
        </div>

        {/* FOCUS BRAND : DARK LAB */}
        <div className="about-darklab-card">
          <div className="about-darklab-left">
            <div className="darklab-pill-badge">
              <Sparkles size={14} /> Notre Marque Lifestyle & Moteur Créatif
            </div>
            <h2 className="about-darklab-title">
              AU CŒUR DE NOTRE UNIVERS : <span className="text-red-glow">DARK LAB</span>
            </h2>
            <p className="about-darklab-desc">
              Mais l'univers Dark Wolf ne s'arrête pas aux serveurs de jeu. Au cœur de notre organisation bat <strong>Dark Lab</strong>, notre propre marque.
            </p>
            <p className="about-darklab-desc">
              Née de notre passion pour le gaming et le lifestyle, <strong>Dark Lab</strong> est le moteur créatif de l'équipe, proposant une identité visuelle forte et des créations uniques qui prolongent l'expérience Dark Wolf bien au-delà de l'écran.
            </p>
            <div className="about-darklab-btn-row">
              <Link to="/boutique" className="btn-red-primary">
                <ShoppingBag size={18} /> Découvrir les créations Dark Lab
              </Link>
            </div>
          </div>

          <div className="about-darklab-right">
            <div className="darklab-visual-box">
              <div className="darklab-logo-stylized">DARK LAB</div>
              <div className="darklab-motto">GAMING × LIFESTYLE × STREETWEAR</div>
              <div className="darklab-features-list">
                <div className="darklab-feat-item">
                  <ShieldCheck size={18} color="var(--red-primary)" />
                  <span>Identité Visuelle Forte & Racée</span>
                </div>
                <div className="darklab-feat-item">
                  <ShieldCheck size={18} color="var(--red-primary)" />
                  <span>Éditions Limitées & Maillots Pro</span>
                </div>
                <div className="darklab-feat-item">
                  <ShieldCheck size={18} color="var(--red-primary)" />
                  <span>L'expérience DWT au-delà de l'écran</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LES 4 PILIERS DE LA MEUTE */}
        <div className="about-pillars-header">
          <h2 className="section-title">LES PILIERS DE LA MEUTE</h2>
          <p className="section-subtitle">Les valeurs fondamentales qui forgent chacun de nos victoires</p>
        </div>

        <div className="about-pillars-grid">
          {pillars.map((item) => (
            <div className="pillar-card" key={item.title}>
              <div className="pillar-icon-box">
                {item.icon}
              </div>
              <h3 className="pillar-title">{item.title}</h3>
              <p className="pillar-desc">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* MOTTO FINAL : ONE PACK. ONE VISION. */}
        <div className="about-motto-banner">
          <div className="about-motto-text">ONE PACK. ONE VISION.</div>
          <p className="about-motto-sub">
            Unis sur chaque serveur. Déterminés sur chaque trophée. Fiers de nos racines.
          </p>
          <div style={{ marginTop: '22px' }}>
            <Link to="/contact" className="btn-red-primary" style={{ padding: '14px 34px', fontSize: '15px' }}>
              Rejoindre la Meute <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
