import React, { useState, useEffect } from 'react';
import { getImageUrl } from '../utils/imageUrl';
import API from '../services/api';
import { Users, Shield, Trophy, UserPlus } from 'lucide-react';

const defaultPlayerGradients = [
  'linear-gradient(160deg,#1a0a0e,#080808)',
  'linear-gradient(160deg,#1a1a2e,#080808)',
  'linear-gradient(160deg,#0e1a0e,#080808)',
  'linear-gradient(160deg,#0a141a,#080808)',
  'linear-gradient(160deg,#1a0e0a,#080808)',
  'linear-gradient(160deg,#1a1a0a,#080808)',
  'linear-gradient(160deg,#0a1a14,#080808)',
];

const normalizeGameName = (str) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');

const MembersModal = ({ isOpen, onClose, selectedGame = 'All', players = [] }) => {
  const [activeTab, setActiveTab] = useState(selectedGame);
  const [livePlayers, setLivePlayers] = useState(players);
  const [availableGames, setAvailableGames] = useState([]);

  // Refresh players directly from API whenever modal opens to guarantee 100% sync with Admin Dashboard
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      API.get('/players')
        .then((res) => {
          if (res.data?.players?.length) {
            setLivePlayers(res.data.players);
          }
        })
        .catch(() => {});

      API.get('/games')
        .then((res) => {
          if (res.data?.games?.length) {
            setAvailableGames(res.data.games.map((g) => g.name));
          }
        })
        .catch(() => {});
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  // Sync if selectedGame changes from outside
  useEffect(() => {
    if (selectedGame) setActiveTab(selectedGame);
  }, [selectedGame]);

  if (!isOpen) return null;

  // Build unique game tabs combining players' games, backend games and default esports
  const playerGames = livePlayers.map((p) => p.game).filter(Boolean);
  const combinedGames = Array.from(new Set([...availableGames, ...playerGames]));
  const allTabs = ['All', ...combinedGames];

  // Filtering players by game with normalized matching
  const filtered = activeTab === 'All'
    ? livePlayers
    : livePlayers.filter((p) => {
        const pNorm = normalizeGameName(p.game);
        const tabNorm = normalizeGameName(activeTab);
        return pNorm === tabNorm || p.game?.toLowerCase() === activeTab.toLowerCase();
      });

  return (
    <div
      className={`memov ${isOpen ? 'open' : ''}`}
      id="memov"
      style={{ display: isOpen ? 'flex' : 'none' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="meminner" style={{ maxWidth: '1080px', width: '92%' }}>
        <button className="mclose" onClick={onClose} aria-label="Close roster modal">
          ✕
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Shield size={16} color="#38bdf8" />
          <div className="slbl" style={{ margin: 0, color: '#38bdf8' }}>The Wolfpack • Roster Officiel</div>
        </div>

        <h2 className="stitle" style={{ fontSize: '28px' }}>
          DWT ROSTER & EFFECTIF
        </h2>

        {/* Tab Filters */}
        <div className="memtabs" id="memtabs" style={{ flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
          {allTabs.map((g) => {
            const isAct = normalizeGameName(activeTab) === normalizeGameName(g);
            return (
              <button
                key={g}
                className={`memtabBtn ${isAct ? 'act' : ''}`}
                onClick={() => setActiveTab(g)}
              >
                {g}
              </button>
            );
          })}
        </div>

        {/* Members Cards Grid */}
        {filtered.length > 0 ? (
          <div className="memgrid" id="memgrid">
            {filtered.map((m, idx) => {
              const bgGrad = defaultPlayerGradients[idx % defaultPlayerGradients.length];
              const avatarSrc = m.avatar ? getImageUrl(m.avatar) : null;

              const imgStyle = avatarSrc
                ? {
                    backgroundImage: `url(${avatarSrc})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center top',
                    backgroundColor: '#111',
                  }
                : { background: bgGrad };

              return (
                <div key={m._id || m.gamertag || idx} className="memcard">
                  <div className="memimg" style={imgStyle}>
                    {m.rank && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          background: 'rgba(0,0,0,0.75)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '4px',
                          padding: '2px 8px',
                          fontSize: '10px',
                          fontWeight: '800',
                          color: '#fff',
                          fontFamily: '"Orbitron", monospace',
                        }}
                      >
                        {m.rank}
                      </span>
                    )}
                  </div>
                  <div className="meminfo">
                    <div className="memname">{m.gamertag || m.name}</div>
                    {m.realName && (
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '-2px', marginBottom: '4px' }}>
                        {m.realName}
                      </div>
                    )}
                    <div className="memrole">{m.role || 'Player'}</div>
                    <div className="memgame">{m.game}</div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '10px',
                        paddingTop: '8px',
                        borderTop: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "'Orbitron', monospace",
                          fontSize: '11px',
                          color: '#22c55e',
                          fontWeight: '700',
                        }}
                      >
                        KDA {m.stats?.kda || m.kd || '1.45'}
                      </div>
                      <div style={{ color: 'var(--wolf)', fontSize: '12px' }}>
                        {m.rating || '★★★★★'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty state for games without players yet */
          <div
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px dashed rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              margin: '20px 0',
            }}
          >
            <div style={{ display: 'inline-flex', padding: '14px', borderRadius: '50%', background: 'rgba(230,0,0,0.1)', marginBottom: '14px' }}>
              <Users size={32} color="#e60000" />
            </div>
            <h3 style={{ fontFamily: '"Orbitron", sans-serif', fontSize: '18px', color: '#fff', marginBottom: '8px' }}>
              Aucun joueur assigné dans la division {activeTab}
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '13px', maxWidth: '460px', margin: '0 auto 20px', lineHeight: 1.6 }}>
              Les joueurs et recrues ajoutés par l'administrateur dans le Dashboard apparaîtront automatiquement ici en temps réel.
            </p>
            <button
              type="button"
              onClick={() => setActiveTab('All')}
              style={{
                padding: '8px 20px',
                background: '#e60000',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontFamily: '"Orbitron", sans-serif',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              Voir Tous les Joueurs de la Meute ({livePlayers.length}) →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MembersModal;
