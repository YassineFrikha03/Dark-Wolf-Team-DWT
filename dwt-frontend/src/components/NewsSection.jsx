import React, { useRef, useState } from 'react';
import { getImageUrl } from '../utils/imageUrl';
import NewsDetailModal from './NewsDetailModal';
import LiveMatchModal from './LiveMatchModal';
import { Radio, Play, ChevronRight, BookOpen } from 'lucide-react';

const NewsSection = ({ news = [], matches = [], onOpenPredictions }) => {
  const mstripRef = useRef(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);

  const scrollMatches = (dir) => {
    if (!mstripRef.current) return;
    const w = mstripRef.current.firstElementChild
      ? mstripRef.current.firstElementChild.offsetWidth + 16
      : 240;
    mstripRef.current.scrollBy({ left: dir * w * 2, behavior: 'smooth' });
  };

  const featArticle = news[0] || {
    title: 'Dark Wolf Team Claims Regional Championship — The Pack Rises to the Top',
    summary: 'Une victoire d’anthologie 3-0 en finale régionale affirmant la suprématie de la meute.',
    content: "Dans une finale régionale d'anthologie disputée devant plus de 25 000 spectateurs en direct, la Dark Wolf Team a gravé son nom dans l'histoire en remportant le titre suprême avec un score sans appel de 3-0.\n\nDu premier pistol round jusqu'à l'ultime clutch sur le site B, la coordination des loups a été chirurgicale. Les stratégies élaborées durant des semaines d'entraînement intensif au bootcamp Dark Lab ont neutralisé toutes les tentatives adverses.\n\n« Ce trophée n'est que la première étape », a déclaré le capitaine en interview d'après-match. « La meute a faim, et notre regard est désormais tourné vers le circuit international MENA & Europe. »",
    category: 'Feature',
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    createdAt: new Date().toISOString(),
  };

  const sideArticles = news.slice(1, 4);

  const featCover = featArticle.coverImage || featArticle.image;
  const featBg = featCover
    ? `url(${getImageUrl(featCover)})`
    : 'url(https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80)';

  return (
    <section id="news" style={{ padding: '100px 60px', background: 'var(--black)' }}>
      <div className="rv vis">
        <div className="slbl">Latest Updates & Esports Broadcasts</div>
        <h2 className="stitle">News & Matches</h2>
      </div>

      <div className="ngrid rv d1 vis">
        {/* Featured Card */}
        <div
          className="nfeat"
          onClick={() => setSelectedArticle(featArticle)}
          style={{ cursor: 'pointer', position: 'relative' }}
          title="Cliquer pour lire l'article complet"
        >
          <div
            className="nfbg"
            style={{
              background: '#111',
              backgroundImage: featBg,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.72) contrast(1.05)',
              transition: 'transform 0.4s ease',
            }}
          ></div>
          <div className="nfcont">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="ntag">{featArticle.category || 'Feature'}</span>
              <span
                style={{
                  fontSize: '11px',
                  color: '#fff',
                  background: 'rgba(230,0,0,0.4)',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: '700',
                }}
              >
                <BookOpen size={11} /> Lire l'article complet
              </span>
            </div>
            <h3 className="nttl">{featArticle.title}</h3>
            <span className="ndt">
              {new Date(featArticle.createdAt || Date.now()).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}{' '}
              • 5 min read
            </span>
          </div>
        </div>

        {/* Side Cards */}
        <div className="nside">
          {sideArticles.map((art, idx) => {
            const artCover = art.coverImage || art.image;
            const artBg = artCover
              ? `url(${getImageUrl(artCover)})`
              : idx === 0
              ? 'linear-gradient(135deg, #1a1a2e, #0a0a0a)'
              : idx === 1
              ? 'linear-gradient(45deg, #1a0a0a, #0a0a0a)'
              : 'linear-gradient(135deg, #0a1a0a, #0a0a0a)';

            return (
              <div
                key={art._id || idx}
                className="ncard"
                onClick={() => setSelectedArticle(art)}
                style={{ cursor: 'pointer', transition: 'all 0.25s' }}
                title="Cliquer pour lire l'article complet"
              >
                <div
                  className="ncimg"
                  style={{
                    background: '#141414',
                    backgroundImage: artBg,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: artCover ? 'brightness(0.85) contrast(1.05)' : 'none',
                  }}
                ></div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className={`ntag ${idx === 1 ? 'm' : ''}`} style={{ fontSize: '9px', padding: '2px 7px' }}>
                      {art.category || art.game || 'Esport'}
                    </span>
                    <span style={{ fontSize: '10px', color: '#e60000', fontWeight: '700' }}>Lire →</span>
                  </div>
                  <div className="ncttl" style={{ marginTop: '5px' }}>
                    {art.title}
                  </div>
                  <div className="ncdt">
                    {new Date(art.createdAt || Date.now()).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Match Strip Carousel - Espace Matches & Live */}
      <div 
        id="matches-live" 
        style={{ 
          marginTop: '56px', 
          scrollMarginTop: '110px',
          paddingTop: '24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px'
        }} 
        className="rv d2 vis"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#e60000',
              boxShadow: '0 0 10px #e60000',
              animation: 'pulse 1.5s infinite',
              display: 'inline-block'
            }}></span>
            <div className="slbl" style={{ margin: 0, fontSize: '13px', fontWeight: '800', letterSpacing: '0.08em', color: '#fff' }}>
              MATCHS OFFICIELS & DIFFUSIONS EN DIRECT (LIVE STREAM)
            </div>
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>
            {matches.filter((m) => m.status === 'live' || m.isLive).length > 0 ? (
              <span style={{ 
                color: '#ff4d4d', 
                fontWeight: '800', 
                background: 'rgba(230,0,0,0.15)', 
                border: '1px solid rgba(230,0,0,0.4)', 
                padding: '4px 10px', 
                borderRadius: '20px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ff0000' }}></span>
                DIFFUSION EN DIRECT DISPONIBLE
              </span>
            ) : (
              <span style={{ color: '#64748b' }}>Cliquez sur une partie pour regarder la diffusion</span>
            )}
          </div>
        </div>

        <div className="mstrip-wrap">
          <button className="marrow l" onClick={() => scrollMatches(-1)} aria-label="Previous Matches">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="mstrip" id="mstrip" ref={mstripRef}>
            {matches.map((m, i) => {
              const isLive = m.status === 'live' || m.isLive;
              const oppName = m.opponent || m.t2 || 'Rival';
              const oppCode = oppName.slice(0, 3).toUpperCase();
              const dateText = m.matchDate
                ? new Date(m.matchDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
                  ' · ' +
                  new Date(m.matchDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
                : m.time || 'Upcoming';

              return (
                <div
                  key={m._id || i}
                  className="mcard"
                  onClick={() => setSelectedMatch(m)}
                  style={{
                    cursor: 'pointer',
                    borderColor: isLive ? 'rgba(230, 0, 0, 0.6)' : undefined,
                    boxShadow: isLive ? '0 0 15px rgba(230, 0, 0, 0.25)' : undefined,
                    position: 'relative',
                  }}
                  title={isLive ? 'Regarder le match en direct 🔴' : 'Voir les détails du match'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div className="mgame">{m.game}</div>
                    {isLive && (
                      <span
                        style={{
                          fontSize: '9px',
                          color: '#fff',
                          background: '#e60000',
                          padding: '2px 6px',
                          borderRadius: '10px',
                          fontWeight: '800',
                          letterSpacing: '0.05em',
                        }}
                      >
                        DIFFUSION
                      </span>
                    )}
                  </div>

                  <div className="mteams">
                    <div className="mteam">
                      <div className="mlogo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src="/logo-dwt.png" alt="DWT" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
                      </div>
                      <div className="mtn">Dark Wolf</div>
                    </div>
                    <div className="mvs">{isLive ? `${m.scoreDWT ?? 1} - ${m.scoreOpponent ?? 0}` : 'VS'}</div>
                    <div className="mteam">
                      <div className="mlogo" style={{ background: 'var(--gray2)' }}>
                        {oppCode}
                      </div>
                      <div className="mtn">{oppName}</div>
                    </div>
                  </div>
                  <div className="mtime" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {isLive ? (
                      <span className="mlive">● REGARDER EN DIRECT 🔴</span>
                    ) : (
                      <span>{dateText}</span>
                    )}
                    {!isLive && onOpenPredictions && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenPredictions();
                        }}
                        style={{
                          background: 'rgba(230, 0, 0, 0.25)',
                          border: '1px solid rgba(230, 0, 0, 0.5)',
                          color: '#ff4d4d',
                          fontSize: '10px',
                          fontWeight: '800',
                          padding: '2px 8px',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#e60000';
                          e.currentTarget.style.color = '#fff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(230, 0, 0, 0.25)';
                          e.currentTarget.style.color = '#ff4d4d';
                        }}
                        title="Pronostiquer ce match pour gagner jusqu'à 130 pts"
                      >
                        🎯 Prono (+130 pts)
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button className="marrow r" onClick={() => scrollMatches(1)} aria-label="Next Matches">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* News Full Reading Modal */}
      <NewsDetailModal
        article={selectedArticle}
        isOpen={Boolean(selectedArticle)}
        onClose={() => setSelectedArticle(null)}
      />

      {/* Live Match Streaming & Viewing Modal */}
      <LiveMatchModal
        match={selectedMatch}
        isOpen={Boolean(selectedMatch)}
        onClose={() => setSelectedMatch(null)}
        onOpenFanPortal={onOpenPredictions}
      />
    </section>
  );
};

export default NewsSection;
