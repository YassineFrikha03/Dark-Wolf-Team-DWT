import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import API from '../services/api';

const MatchesSection = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [matches, setMatches] = useState([]);

  // Données par défaut fidèles à la maquette
  const defaultMatches = [
    {
      _id: 'm1',
      game: 'CS2',
      gameIcon: 'CS2',
      opponent: 'TUNISIA ESPORTS',
      matchDate: '12 Oct 2026 - 20:00',
      status: 'upcoming'
    },
    {
      _id: 'm2',
      game: 'VALORANT',
      gameIcon: 'VAL',
      opponent: 'RAGE GAMING',
      matchDate: '15 Oct 2026 - 21:30',
      status: 'live'
    },
    {
      _id: 'm3',
      game: 'EA FC 26',
      gameIcon: 'FC',
      opponent: 'LEGEND FC',
      matchDate: '18 Oct 2026 - 19:00',
      status: 'finished',
      scoreDWT: 3,
      scoreOpponent: 1
    }
  ];

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await API.get(`/matches?status=${activeTab}`);
        if (res.data.success && res.data.matches.length > 0) {
          setMatches(res.data.matches);
        } else {
          setMatches(defaultMatches.filter(m => m.status === activeTab));
        }
      } catch {
        setMatches(defaultMatches.filter(m => m.status === activeTab));
      }
    };
    fetchMatches();
  }, [activeTab]);

  return (
    <section className="matches-section" id="tournois">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">TOURNOIS & MATCHS</h2>
          <p className="section-subtitle">Suivez nos performances et nos prochains matchs.</p>
        </div>

        {/* 3 Tabs Filter matching mockup (À venir, En cours, Terminés) */}
        <div className="tabs-filter-row">
          <button
            className={`tab-filter-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            À venir
          </button>
          <button
            className={`tab-filter-btn ${activeTab === 'live' ? 'active' : ''}`}
            onClick={() => setActiveTab('live')}
          >
            En cours
          </button>
          <button
            className={`tab-filter-btn ${activeTab === 'finished' ? 'active' : ''}`}
            onClick={() => setActiveTab('finished')}
          >
            Terminés
          </button>
        </div>

        {/* Matches list */}
        <div className="matches-list">
          {matches.map((match) => (
            <div className="match-item-card" key={match._id}>
              {/* Game Badge */}
              <div className="match-game-badge">
                <div className="game-icon-square">
                  {match.game?.slice(0, 3).toUpperCase() || 'ES'}
                </div>
                <span className="game-name-label">{match.game}</span>
              </div>

              {/* Match Opponents & Scores */}
              <div className="match-teams-center">
                <span className="team-dwt-name">DARK WOLF</span>
                {match.status === 'finished' || match.status === 'live' ? (
                  <span style={{ 
                    fontFamily: 'var(--font-heading)', 
                    fontSize: '18px', 
                    fontWeight: '900', 
                    color: match.status === 'live' ? '#22c55e' : '#fff',
                    padding: '2px 10px',
                    background: 'rgba(0,0,0,0.5)',
                    borderRadius: '6px',
                    border: '1px solid #1f2538'
                  }}>
                    {match.scoreDWT || 0} - {match.scoreOpponent || 0}
                  </span>
                ) : (
                  <span className="match-vs-tag">VS</span>
                )}
                <span className="team-opponent-name">{match.opponent}</span>
              </div>

              {/* Date / Time */}
              <div className="match-date-info">
                {match.matchDate?.includes('T')
                  ? new Date(match.matchDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
                  : match.matchDate}
              </div>

              {/* Status Pill matching mockup */}
              <div>
                {match.status === 'upcoming' && (
                  <span className="status-badge-pill status-upcoming">À venir</span>
                )}
                {match.status === 'live' && (
                  <span className="status-badge-pill status-live" style={{ animation: 'pulse-slow 2s infinite' }}>🔴 EN DIRECT</span>
                )}
                {match.status === 'finished' && (
                  <span className="status-badge-pill status-finished">Terminé</span>
                )}
              </div>

              {/* Action button */}
              <button 
                className="news-read-more-btn" 
                style={{ fontSize: '13px' }}
                onClick={() => {
                  if (match.streamUrl) window.open(match.streamUrl, '_blank');
                }}
              >
                {match.status === 'live' ? 'Regarder le Live 📺' : 'Détails match'} <ChevronRight size={14} />
              </button>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link to="/tournois" className="btn-outline-dark">
            Voir tous les matchs
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MatchesSection;
