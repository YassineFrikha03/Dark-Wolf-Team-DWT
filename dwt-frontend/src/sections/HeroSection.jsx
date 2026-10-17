import React from 'react';
import { Link } from 'react-router-dom';
import { WolfLogo } from '../components/WolfLogo';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="hero-section" id="accueil">
      {/* Background ambient lighting */}
      <div className="hero-background-art" />

      <div className="hero-container hero-container-split">
        {/* Left Column: Presentation text, buttons, and stats */}
        <div className="hero-content-col">
          {/* Tag header */}
          <div className="hero-team-tag">
            DARK WOLF TEAM
          </div>

          {/* Main Big Slogan */}
          <h1 className="hero-title-main">
            MORE THAN A TEAM
          </h1>
          <div className="hero-title-highlight">
            A MINDSET
          </div>

          {/* Subtitle quote */}
          <p className="hero-description">
            Plus qu'une équipe. Une famille. Une même passion : le jeu vidéo. Wolves of war. Masters of the game.
          </p>

          {/* Action Buttons */}
          <div className="hero-actions">
            <Link to="/contact" className="btn-red-primary">
              Rejoindre l'équipe <ArrowRight size={18} />
            </Link>
            <Link to="/equipe" className="btn-outline-dark">
              Découvrir l'équipe
            </Link>
          </div>

          {/* Hero Bottom Stats Row */}
          <div className="hero-stats-row">
            <div className="hero-stat-item">
              <span className="hero-stat-value">7+</span>
              <span className="hero-stat-label">Jeux</span>
            </div>
            <div className="hero-stat-item">
              <span className="hero-stat-value">122+</span>
              <span className="hero-stat-label">Followers</span>
            </div>
            <div className="hero-stat-item">
              <span className="hero-stat-value">20+</span>
              <span className="hero-stat-label">Membres</span>
            </div>
          </div>
        </div>

        {/* Right Column: Clear, sharp official Wolf emblem */}
        <div className="hero-visual-col">
          <div className="hero-wolf-badge-wrapper">
            <div className="hero-wolf-glow-ring" />
            <img 
              src="/dwt-wolf-logo.png" 
              alt="Dark Wolf Team - Emblème Principal" 
              className="hero-main-wolf-img"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
