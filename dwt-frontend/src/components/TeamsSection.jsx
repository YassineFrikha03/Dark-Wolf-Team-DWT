import React, { useState, useEffect, useRef } from 'react';
import API from '../services/api';
import { getImageUrl } from '../utils/imageUrl';

const defaultGames = [
  { name: 'Valorant', mem: '6 Players', color: '#ff4655', posterImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80', logo: 'VAL' },
  { name: 'FC 25', mem: '4 Players', color: '#00d4aa', posterImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80', logo: 'FC25' },
  { name: 'Call of Duty', mem: '5 Players', color: '#ff8800', posterImage: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80', logo: 'COD' },
  { name: 'PUBG Mobile', mem: '4 Players', color: '#f5d842', posterImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80', logo: 'PUBG' },
  { name: 'Fortnite', mem: '3 Players', color: '#00b4ff', posterImage: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=800&q=80', logo: 'FN' },
  { name: 'Rocket League', mem: '3 Players', color: '#ff6b35', posterImage: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80', logo: 'RL' },
  { name: 'EA Sports FC', mem: '4 Players', color: '#6bff6b', posterImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80', logo: 'EASF' },
  { name: 'League of Legends', mem: '5 Players', color: '#c89b3c', posterImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80', logo: 'LOL' },
];

const TeamsSection = ({ onOpenRoster }) => {
  const ggridRef = useRef(null);
  const [games, setGames] = useState(defaultGames);
  const [counts, setCounts] = useState({ players: 0, games: 0, tournaments: 0, years: 0 });
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // Charger les jeux depuis l'API MongoDB
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await API.get('/games?active=true');
        if (res.data?.games && res.data.games.length > 0) {
          setGames(res.data.games);
        }
      } catch (err) {
        console.warn('Utilisation des jeux de repli:', err.message);
      }
    };
    fetchGames();
  }, []);

  useEffect(() => {
    let started = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          started = true;
          const duration = 1200;
          const steps = 30;
          const interval = duration / steps;
          let step = 0;

          const timer = setInterval(() => {
            step++;
            const progress = step / steps;
            setCounts({
              players: Math.min(24, Math.floor(progress * 24)),
              games: Math.min(games.length || 8, Math.floor(progress * (games.length || 8))),
              tournaments: Math.min(38, Math.floor(progress * 38)),
              years: Math.min(5, Math.floor(progress * 5)),
            });
            if (step >= steps) clearInterval(timer);
          }, interval);
        }
      },
      { threshold: 0.3 }
    );

    const sectionEl = document.querySelector('#teams');
    if (sectionEl) observer.observe(sectionEl);

    return () => observer.disconnect();
  }, [games.length]);

  const scrollGames = (dir) => {
    if (!ggridRef.current) return;
    const w = ggridRef.current.firstElementChild
      ? ggridRef.current.firstElementChild.offsetWidth + 16
      : 220;
    ggridRef.current.scrollBy({ left: dir * w * 2, behavior: 'smooth' });
  };

  return (
    <section id="teams" style={{ padding: '100px 60px', background: 'var(--dark1)' }}>
      <div className="tintro">
        <div className="rvl vis">
          <div className="slbl">Our Roster</div>
          <h2 className="stitle">DWT<br />Teams</h2>
          <p
            style={{
              marginTop: '14px',
              marginBottom: '20px',
              fontSize: '14px',
              color: 'var(--silver)',
              lineHeight: 1.6,
            }}
          >
            Built from the best. Competing at the highest level. Dark Wolf Team
            — we don't just play games. We own them.
          </p>
          <p style={{ fontSize: '13px', color: 'var(--gray3)', lineHeight: 1.7 }}>
            Every player hand-selected. Every strategy forged in competition.
            From Valorant to FC25 to Call of Duty — DWT fields elite squads
            across the biggest stages in esports.
          </p>
        </div>

        <div className="tstats rvr vis">
          <div className="sblock">
            <div className="snum">{counts.players}+</div>
            <div className="slb">Active Players</div>
          </div>
          <div className="sblock">
            <div className="snum">{counts.games || games.length}</div>
            <div className="slb">Game Titles</div>
          </div>
          <div className="sblock">
            <div className="snum">{counts.tournaments}+</div>
            <div className="slb">Tournaments Won</div>
          </div>
          <div className="sblock">
            <div className="snum">{counts.years}</div>
            <div className="slb">Years Competing</div>
          </div>
        </div>
      </div>

      <div className="rv vis" style={{ marginBottom: '16px' }}>
        <div className="slbl">
          Hover to Reveal · Scroll to See All · Click to See Roster
        </div>
      </div>

      <div className="ggrid-wrap">
        <button className="garrow l" onClick={() => scrollGames(-1)} aria-label="Previous Games">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="ggrid" id="ggrid" ref={ggridRef}>
          {games.map((g, idx) => {
            const isHov = hoveredIdx === idx;
            const posterUrl = g.posterImage ? getImageUrl(g.posterImage) : null;
            
            const bgStyle = {
              background: posterUrl
                ? `url(${posterUrl})`
                : (g.bg || `linear-gradient(135deg, ${g.color || '#ff4655'}33, #0a0a0a)`),
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              filter: isHov ? 'grayscale(0%) brightness(0.85) contrast(1.15)' : 'grayscale(30%) brightness(0.60)',
              transform: isHov ? 'scale(1.08)' : 'scale(1)',
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            };

            return (
              <div
                key={g._id || g.name}
                className="gcard"
                onClick={() => onOpenRoster(g.name)}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  borderTop: isHov ? `2px solid ${g.color || 'var(--red-primary)'}` : '2px solid transparent',
                  boxShadow: isHov ? `0 10px 25px -5px ${g.color || 'var(--red-primary)'}44` : 'none',
                  transition: 'border 0.3s, box-shadow 0.3s',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                <div className="gcbg" style={bgStyle}></div>
                <div
                  className="gcov"
                  style={{
                    background: isHov
                      ? `linear-gradient(to top, rgba(6,6,8,0.92) 0%, rgba(6,6,8,0.3) 60%, ${g.color || '#ff4655'}22 100%)`
                      : 'linear-gradient(to top, rgba(6,6,8,0.95) 0%, rgba(6,6,8,0.5) 70%, transparent 100%)',
                    transition: 'background 0.3s ease'
                  }}
                ></div>
                <div
                  className="glogomark"
                  style={{
                    color: isHov ? (g.color || '#fff') : 'rgba(255,255,255,0.4)',
                    transition: 'color 0.3s'
                  }}
                >
                  {g.logo || g.name?.slice(0, 4).toUpperCase()}
                </div>
                <div className="gcinfo">
                  <div className="gname" style={{ color: isHov ? '#fff' : 'var(--silver)' }}>
                    {g.name}
                  </div>
                  <div className="gmem" style={{ color: g.color || 'var(--gray3)' }}>
                    {g.mem}
                  </div>
                </div>
                <button
                  className="ghbtn"
                  style={{
                    background: isHov ? (g.color || 'var(--red-primary)') : 'var(--white)',
                    color: isHov ? '#fff' : 'var(--black)',
                    borderColor: isHov ? (g.color || 'var(--red-primary)') : 'var(--white)'
                  }}
                >
                  View Team →
                </button>
              </div>
            );
          })}
        </div>

        <button className="garrow r" onClick={() => scrollGames(1)} aria-label="Next Games">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default TeamsSection;
