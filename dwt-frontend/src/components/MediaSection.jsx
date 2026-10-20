import React, { useState, useEffect } from 'react';
import { Play, Film, ShoppingBag, UserPlus, Trophy, Eye, Clock, Sparkles, ExternalLink, Flame } from 'lucide-react';
import VideoPlayerModal from './VideoPlayerModal';
import { getImageUrl } from '../utils/imageUrl';
import API from '../services/api';
import { SOCIAL_LINKS } from '../config/socialLinks';

const defaultFallbackVideos = [
  {
    _id: 'v1',
    title: 'DARK WOLF TEAM — RISE OF THE PACK (Trailer Officiel 2026)',
    subtitle: 'Trailer cinématique officiel de la saison 2026',
    description: 'Plongez au cœur de la tanière de la Dark Wolf Team. Retrouvez nos joueurs professionnels sur Valorant, CS2 et LoL dans le trailer cinématique officiel de la saison 2026.',
    category: 'trailer',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: '/backgrounds/hero-gaming-bg.jpg',
    duration: '02:38',
    views: '185K vues',
    badge: 'TRAILER OFFICIEL',
    isMainTrailer: true,
    ctaText: 'Rejoindre la Meute',
    ctaLink: '#join',
    order: 0,
    isActive: true
  },
  {
    _id: 'v2',
    title: 'Spot Officiel — Maillot Pro Kit Summer 2026 | Dark Lab',
    subtitle: 'L\'armure officielle des champions esport',
    description: 'Découvrez le tout nouveau maillot Pro Kit respirant aux couleurs néon-rouge et noir furtif. Conçu pour la haute performance en tournoi.',
    category: 'product_ad',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: '/backgrounds/bg-red-moon-pack.png',
    duration: '00:58',
    views: '64K vues',
    badge: 'SPOT PUB BOUTIQUE',
    isMainTrailer: false,
    ctaText: 'Commander le Maillot',
    ctaLink: '#shop:pro-kit',
    order: 1,
    isActive: true
  },
  {
    _id: 'v3',
    title: 'Annonce Majeure — Recrutement & Tryouts Meute Valorant 2026',
    subtitle: 'Rejoignez le roster officiel Dark Wolf',
    description: 'La Dark Wolf Team ouvre ses portes aux nouveaux talents. Postulez dès maintenant pour intégrer le roster officiel ou l\'académie.',
    category: 'announcement',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: '/backgrounds/bg-alpha-eyes.png',
    duration: '01:45',
    views: '42K vues',
    badge: 'ANNONCE RECRUTEMENT',
    isMainTrailer: false,
    ctaText: 'Postuler aux Tryouts',
    ctaLink: '#join',
    order: 2,
    isActive: true
  },
  {
    _id: 'v4',
    title: 'Veste Bomber Furtive DWT — Édition Limitée Alpha Drop',
    subtitle: 'Streetwear x Esports Performance',
    description: 'Coupe athlétique premium, broderie cyber-loup haute densité, tissu thermique déperlant. 100 unités disponibles.',
    category: 'product_ad',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: '/backgrounds/hero-gaming-bg.jpg',
    duration: '01:15',
    views: '51K vues',
    badge: 'SPOT PUB BOUTIQUE',
    isMainTrailer: false,
    ctaText: 'Voir la Veste',
    ctaLink: '#shop',
    order: 3,
    isActive: true
  },
  {
    _id: 'v5',
    title: 'DWT vs Cloud9 — Grand Final Highlights (Clutch 1v4 ShadowFang)',
    subtitle: 'Les meilleurs moments de la finale régionale',
    description: 'Revivez les moments les plus intenses de la finale régionale avec les voix in-game et comms de l\'équipe Dark Wolf.',
    category: 'match_highlight',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: '/backgrounds/bg-red-moon-pack.png',
    duration: '08:12',
    views: '112K vues',
    badge: 'BEST-OF MATCH',
    isMainTrailer: false,
    ctaText: 'Tous les Matchs',
    ctaLink: '#matches-live',
    order: 4,
    isActive: true
  }
];

const MediaSection = ({ onNavigate, videos: externalVideos }) => {
  const [videosList, setVideosList] = useState(defaultFallbackVideos);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [activeModalVideo, setActiveModalVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Charger les vidéos depuis l'API MongoDB
  const fetchVideos = async () => {
    try {
      const res = await API.get('/videos?active=true');
      if (res.data?.success && res.data.videos?.length > 0) {
        setVideosList(res.data.videos);
      }
    } catch {
      // Fallback silencieux vers les vidéos par défaut
    }
  };

  useEffect(() => {
    if (externalVideos && externalVideos.length > 0) {
      setVideosList(externalVideos);
    } else {
      fetchVideos();
    }
  }, [externalVideos]);

  // Identifier le trailer principal
  const mainTrailer = 
    videosList.find(v => v.isMainTrailer && v.isActive !== false) || 
    videosList.find(v => v.category === 'trailer' && v.isActive !== false) || 
    videosList[0] || 
    defaultFallbackVideos[0];

  // Filtrer la liste des vidéos secondaires
  const filteredVideos = videosList.filter(v => {
    if (v.isActive === false) return false;
    if (selectedFilter === 'all') return true;
    return v.category === selectedFilter;
  });

  const getCategoryMeta = (cat) => {
    switch (cat) {
      case 'trailer':
        return { label: 'Trailer Team', color: '#ff4d4d', bg: 'rgba(230,0,0,0.18)', border: 'rgba(230,0,0,0.5)', icon: <Film size={12} /> };
      case 'product_ad':
        return { label: 'Pub Produit', color: '#f59e0b', bg: 'rgba(245,158,11,0.18)', border: 'rgba(245,158,11,0.5)', icon: <ShoppingBag size={12} /> };
      case 'announcement':
        return { label: 'Annonce', color: '#38bdf8', bg: 'rgba(56,189,248,0.18)', border: 'rgba(56,189,248,0.5)', icon: <UserPlus size={12} /> };
      case 'match_highlight':
        return { label: 'Match Highlight', color: '#c084fc', bg: 'rgba(168,85,247,0.18)', border: 'rgba(168,85,247,0.5)', icon: <Trophy size={12} /> };
      default:
        return { label: 'Vidéo', color: '#cbd5e1', bg: 'rgba(255,255,255,0.1)', border: 'rgba(255,255,255,0.2)', icon: <Play size={12} /> };
    }
  };

  const handleOpenVideo = (video) => {
    setActiveModalVideo(video);
    setIsModalOpen(true);
  };

  const handleCtaAction = (e, video) => {
    e.stopPropagation();
    if (!video.ctaLink) return;
    if (onNavigate) {
      onNavigate(video.ctaLink, video.ctaText);
    } else {
      if (video.ctaLink.startsWith('#')) {
        const el = document.querySelector(video.ctaLink.split(':')[0]);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = video.ctaLink;
      }
    }
  };

  return (
    <section id="media" style={{ padding: '100px 60px', background: 'var(--black)', position: 'relative' }}>
      {/* Lecteur Vidéo Modal Cyber */}
      <VideoPlayerModal
        video={activeModalVideo}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onNavigate={onNavigate}
      />

      <div className="rv vis" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <div className="slbl" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Film size={14} color="var(--red-primary)" />
            <span>Dark Wolf Cinema & Broadcast</span>
          </div>
          <h2 className="stitle" style={{ margin: '8px 0 0 0' }}>
            WATCH <span className="red-glow-txt">DWT</span>
          </h2>
          <div style={{ color: '#94a3b8', fontSize: '14px', marginTop: '6px' }}>
            Trailers cinématiques de l'équipe, spots pub des nouveaux maillots et annonces officielles en vidéo.
          </div>
        </div>

        {/* Filter categories bar */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'Toutes les Vidéos' },
            { id: 'trailer', label: '🎬 Trailers Team' },
            { id: 'product_ad', label: '🛍️ Pubs Produits' },
            { id: 'announcement', label: '📢 Annonces' },
            { id: 'match_highlight', label: '🏆 Matchs' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedFilter(tab.id)}
              style={{
                background: selectedFilter === tab.id ? 'var(--red-primary)' : 'rgba(255,255,255,0.04)',
                border: selectedFilter === tab.id ? '1px solid var(--red-primary)' : '1px solid rgba(255,255,255,0.1)',
                color: selectedFilter === tab.id ? '#fff' : '#94a3b8',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit'
              }}
              onMouseEnter={(e) => {
                if (selectedFilter !== tab.id) {
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.borderColor = 'rgba(230,0,0,0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedFilter !== tab.id) {
                  e.currentTarget.style.color = '#94a3b8';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                }
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="ytgrid">
        {/* Left: Main Spotlight Trailer Player */}
        <div className="rvl d1 vis">
          <div 
            className="ytmain" 
            onClick={() => handleOpenVideo(mainTrailer)}
            title="Lancer le visionnage du trailer principal"
            style={{ borderRadius: '12px', border: '1px solid rgba(230,0,0,0.3)', overflow: 'hidden' }}
          >
            <div
              className="ythumb"
              style={{
                backgroundImage: `url(${getImageUrl(mainTrailer.thumbnail || '/backgrounds/hero-gaming-bg.jpg')})`,
                backgroundColor: '#0a0d14'
              }}
            >
              {/* Top Banner Tag */}
              <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '8px', zIndex: 2 }}>
                <span style={{
                  background: 'linear-gradient(135deg, #e60000, #ff4d4d)',
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: '900',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  boxShadow: '0 0 15px rgba(230,0,0,0.6)',
                  letterSpacing: '0.08em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <Flame size={13} /> {mainTrailer.badge || 'TRAILER OFFICIEL DWT'}
                </span>
                {mainTrailer.duration && (
                  <span style={{
                    background: 'rgba(0,0,0,0.85)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.2)',
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Clock size={11} /> {mainTrailer.duration}
                  </span>
                )}
              </div>

              {/* Glowing Play Center Button */}
              <div className="ytplay" style={{ boxShadow: '0 0 35px rgba(230,0,0,0.8)' }}>
                <svg viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" fill="var(--red-primary)" />
                </svg>
              </div>

              {/* Bottom Gradient overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)',
                pointerEvents: 'none'
              }} />
            </div>
          </div>

          <div className="ytinfo" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ color: '#ff4d4d', fontSize: '11px', fontWeight: '800', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  ★ VEDETTE OFFICIELLE DU MOMENT
                </span>
              </div>
              <h3 className="ytttl" style={{ fontSize: '20px', lineHeight: '1.3' }}>
                {mainTrailer.title}
              </h3>
              {mainTrailer.description && (
                <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.5', margin: '6px 0 10px 0' }}>
                  {mainTrailer.description}
                </p>
              )}
              <div className="ytmeta" style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px' }}>
                {mainTrailer.views && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Eye size={13} color="#38bdf8" /> {mainTrailer.views}
                  </span>
                )}
                <span>Saison 2026</span>
                <span>Production DWT Studios</span>
              </div>
            </div>

            {/* CTA action for main trailer */}
            {mainTrailer.ctaText && mainTrailer.ctaLink && (
              <button
                type="button"
                onClick={(e) => handleCtaAction(e, mainTrailer)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: mainTrailer.category === 'product_ad' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'linear-gradient(135deg, #e60000, #b30000)',
                  border: 'none',
                  color: '#fff',
                  padding: '9px 18px',
                  borderRadius: '6px',
                  fontWeight: '800',
                  fontSize: '12px',
                  cursor: 'pointer',
                  letterSpacing: '0.05em',
                  boxShadow: '0 0 15px rgba(230,0,0,0.3)',
                  transition: 'all 0.2s ease',
                  marginTop: '4px'
                }}
              >
                {mainTrailer.category === 'product_ad' ? <ShoppingBag size={14} /> : <ExternalLink size={14} />}
                <span>{mainTrailer.ctaText}</span>
              </button>
            )}
          </div>
        </div>

        {/* Right: Side Playlist of Videos / Pubs / Announcements */}
        <div className="rvr d1 vis">
          <div className="yside" id="yside" style={{ maxHeight: '430px', overflowY: 'auto', paddingRight: '4px' }}>
            {filteredVideos.map((v, i) => {
              const catMeta = getCategoryMeta(v.category);
              const isSelected = mainTrailer._id === v._id;

              return (
                <div
                  key={v._id || i}
                  className={`ysitem ${isSelected ? 'active-video' : ''}`}
                  onClick={() => handleOpenVideo(v)}
                  style={{
                    cursor: 'pointer',
                    borderRadius: '8px',
                    padding: '8px',
                    background: isSelected ? 'rgba(230, 0, 0, 0.1)' : 'transparent',
                    border: isSelected ? '1px solid rgba(230, 0, 0, 0.4)' : '1px solid transparent',
                    transition: 'all 0.2s ease',
                    marginBottom: '8px',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = 'transparent';
                    }
                  }}
                >
                  {/* Thumbnail with duration badge */}
                  <div
                    className="ysthumb"
                    style={{
                      width: '110px',
                      height: '66px',
                      minWidth: '110px',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      position: 'relative',
                      backgroundImage: `url(${getImageUrl(v.thumbnail || '/backgrounds/hero-gaming-bg.jpg')})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundColor: '#111'
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0,0,0,0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: 'rgba(230,0,0,0.85)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Play size={10} color="#fff" style={{ marginLeft: '1px' }} />
                      </div>
                    </div>

                    {v.duration && (
                      <span style={{
                        position: 'absolute',
                        bottom: '4px',
                        right: '4px',
                        background: 'rgba(0,0,0,0.8)',
                        color: '#fff',
                        fontSize: '9px',
                        fontWeight: '800',
                        padding: '1px 4px',
                        borderRadius: '3px'
                      }}>
                        {v.duration}
                      </span>
                    )}
                  </div>

                  {/* Title & metadata */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: catMeta.bg,
                        border: `1px solid ${catMeta.border}`,
                        color: catMeta.color,
                        fontSize: '9px',
                        fontWeight: '900',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        letterSpacing: '0.04em'
                      }}>
                        {catMeta.icon}
                        {v.badge || catMeta.label}
                      </span>
                    </div>

                    <div 
                      className="ysttl"
                      style={{
                        fontSize: '13px',
                        fontWeight: '700',
                        color: '#fff',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        lineHeight: '1.3'
                      }}
                      title={v.title}
                    >
                      {v.title}
                    </div>

                    <div className="ysmeta" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px', fontSize: '11px', color: '#64748b' }}>
                      <span>{v.views || 'Nouvelle vidéo'}</span>

                      {/* Quick CTA button for product ads or actions */}
                      {v.ctaText && (
                        <button
                          type="button"
                          onClick={(e) => handleCtaAction(e, v)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: v.category === 'product_ad' ? '#f59e0b' : '#38bdf8',
                            fontSize: '10px',
                            fontWeight: '800',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                            padding: 0
                          }}
                        >
                          <span>{v.ctaText}</span>
                          <ExternalLink size={9} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredVideos.length === 0 && (
              <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                Aucune vidéo trouvée dans cette catégorie.
              </div>
            )}
          </div>

          {/* Subscribe YouTube Channel button */}
          <button 
            type="button"
            className="ytchbtn" 
            onClick={() => window.open(SOCIAL_LINKS.youtube, '_blank')}
            style={{ width: '100%', marginTop: '16px', cursor: 'pointer' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
            </svg>
            Chaîne Officielle YouTube Dark Wolf Team
          </button>
        </div>
      </div>
    </section>
  );
};

export default MediaSection;
