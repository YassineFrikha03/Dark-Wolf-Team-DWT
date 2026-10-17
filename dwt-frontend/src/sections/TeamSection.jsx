import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, UserPlus, Trophy, Target, Shield, Sparkles, Flame, Check } from 'lucide-react';
import API from '../services/api';
import { getImageUrl } from '../utils/imageUrl';

const TeamSection = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState('Tous');

  const games = ['Tous', 'Valorant', 'CS2', 'League of Legends', 'FIFA / EA FC'];

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const res = await API.get('/players');
        if (res.data.success && res.data.players) {
          // Mettre CYRSOO en tête de liste
          const sorted = [...res.data.players].sort((a, b) => {
            if (a.gamertag.toUpperCase() === 'CYRSOO') return -1;
            if (b.gamertag.toUpperCase() === 'CYRSOO') return 1;
            return 0;
          });
          setPlayers(sorted);
        }
      } catch (err) {
        console.error('Erreur chargement joueurs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  const filteredPlayers = selectedGame === 'Tous'
    ? players
    : players.filter(p => p.game.toLowerCase().includes(selectedGame.toLowerCase()) || (selectedGame === 'FIFA / EA FC' && p.game.includes('FIFA')));

  return (
    <section className="team-section" id="equipe">
      <div className="section-container">
        <div className="section-header">
          <div className="about-badge" style={{ alignSelf: 'center', margin: '0 auto 12px' }}>
            🐺 LA MEUTE OFFICIELLE
          </div>
          <h2 className="section-title">NOS JOUEURS ÉLITES</h2>
          <p className="section-subtitle">
            Les combattants officiels de la Dark Wolf Team sur les plus grands circuits e-sport.
          </p>
        </div>

        {/* Filtres par jeu compétitif */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '36px' }}>
          {games.map((g) => (
            <button
              key={g}
              className={`dash-subtab-btn ${selectedGame === g ? 'active' : ''}`}
              onClick={() => setSelectedGame(g)}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Grille des joueurs réels */}
        <div className="roster-grid">
          {filteredPlayers.map((player) => {
            const isCaptain = player.gamertag.toUpperCase() === 'CYRSOO';
            return (
              <div 
                className={`player-card ${isCaptain ? 'player-captain-card' : ''}`} 
                key={player._id || player.gamertag}
              >
                {/* Badge spécial Capitaine */}
                {isCaptain && (
                  <div className="player-captain-badge">
                    ⭐ CAPITAINE DE LA MEUTE
                  </div>
                )}

                <div className="player-avatar-circle" style={isCaptain ? { borderColor: 'var(--red-primary)', boxShadow: '0 0 20px rgba(230, 0, 0, 0.5)' } : {}}>
                  <img 
                    src={getImageUrl(player.avatar)} 
                    alt={player.gamertag} 
                    className="player-avatar-img"
                    loading="lazy"
                  />
                  {player.nationality && (
                    <span className="player-flag-badge">
                      {player.nationality === 'TN' ? '🇹🇳' : player.nationality === 'FR' ? '🇫🇷' : player.nationality}
                    </span>
                  )}
                </div>

                <div className="player-role-badge">{player.role}</div>
                <div className="player-gamertag">{player.gamertag}</div>
                {player.realName && (
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '-2px', marginBottom: '6px' }}>
                    {player.realName}
                  </div>
                )}

                <div className="player-rank-chip">
                  <Trophy size={12} color="var(--red-primary)" />
                  <span>{player.rank || player.game}</span>
                </div>

                {/* Stats réelles du joueur */}
                {player.stats && (
                  <div className="player-stats-mini-row">
                    <div className="player-stat-box">
                      <span className="stat-label">WIN RATE</span>
                      <span className="stat-val">{player.stats.winRate || '70%'}</span>
                    </div>
                    <div className="player-stat-box">
                      <span className="stat-label">KDA / RATIO</span>
                      <span className="stat-val">{player.stats.kda || '1.50'}</span>
                    </div>
                  </div>
                )}

                {player.bio && (
                  <p className="player-bio-text">{player.bio}</p>
                )}

                <div className="player-game-tag">{player.game}</div>
              </div>
            );
          })}

          {/* Slot Recrutement */}
          <Link to="/contact" className="player-card player-recruit-card">
            <div className="player-avatar-circle" style={{ borderColor: 'var(--red-primary)', color: 'var(--red-primary)' }}>
              <UserPlus size={32} />
            </div>
            <div className="player-role-badge">TRYOUTS OUVERTS</div>
            <div className="player-gamertag" style={{ color: 'var(--red-primary)' }}>REJOINS LA MEUTE</div>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '8px 0 14px', lineHeight: '1.5' }}>
              Postulez dès maintenant pour intégrer l'un de nos rosters officiels.
            </p>
            <div className="player-game-tag">Candidature en ligne →</div>
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginTop: '36px' }}>
          <Link to="/contact" className="btn-red-primary" style={{ padding: '14px 34px' }}>
            Postuler pour rejoindre l'équipe <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
