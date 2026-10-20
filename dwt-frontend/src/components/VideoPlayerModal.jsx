import React, { useEffect } from 'react';
import { X, ExternalLink, Eye, Clock, Sparkles, ShoppingBag, Trophy, UserPlus, Film, Play } from 'lucide-react';
import { getImageUrl } from '../utils/imageUrl';

// Helper pour extraire l'URL d'intégration propre (YouTube ou MP4 téléversé)
export const getCleanEmbedUrl = (url = '') => {
  if (!url) return '';
  const clean = url.trim();

  // YouTube standard watch URL: https://www.youtube.com/watch?v=VIDEO_ID
  if (clean.includes('v=')) {
    const videoId = clean.split('v=')[1]?.split('&')[0];
    if (videoId) {
      return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1`;
    }
  }

  // YouTube short URL: https://youtu.be/VIDEO_ID
  if (clean.includes('youtu.be/')) {
    const videoId = clean.split('youtu.be/')[1]?.split('?')[0];
    if (videoId) {
      return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1`;
    }
  }

  // Déjà sous format embed YouTube
  if (clean.includes('/embed/')) {
    return clean.includes('?') ? `${clean}&autoplay=1` : `${clean}?autoplay=1`;
  }

  // Si c'est un fichier vidéo uploadé sur le serveur backend (ex: /uploads/video-123.mp4)
  if (clean.startsWith('/uploads/') || clean.startsWith('uploads/')) {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    return `${backendUrl}${clean.startsWith('/') ? '' : '/'}${clean}`;
  }

  // Lien direct vidéo (mp4, webm, etc.)
  return clean;
};

const VideoPlayerModal = ({ video, isOpen, onClose, onNavigate }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !video) return null;

  const embedUrl = getCleanEmbedUrl(video.videoUrl);
  const isDirectVideo = /\.(mp4|webm|mov|ogg|mkv|m4v)(\?.*)?$/i.test(embedUrl) || embedUrl.includes('/uploads/');

  const getCategoryBadgeStyle = (cat) => {
    switch (cat) {
      case 'trailer':
        return { bg: 'rgba(230, 0, 0, 0.25)', border: 'rgba(230, 0, 0, 0.7)', color: '#ff4d4d', icon: <Film size={13} />, label: 'TRAILER TEAM' };
      case 'product_ad':
        return { bg: 'rgba(245, 158, 11, 0.2)', border: 'rgba(245, 158, 11, 0.6)', color: '#f59e0b', icon: <ShoppingBag size={13} />, label: 'PUB PRODUIT' };
      case 'announcement':
        return { bg: 'rgba(56, 189, 248, 0.2)', border: 'rgba(56, 189, 248, 0.6)', color: '#38bdf8', icon: <UserPlus size={13} />, label: 'ANNONCE' };
      case 'match_highlight':
        return { bg: 'rgba(168, 85, 247, 0.2)', border: 'rgba(168, 85, 247, 0.6)', color: '#c084fc', icon: <Trophy size={13} />, label: 'MATCH HIGHLIGHT' };
      default:
        return { bg: 'rgba(255, 255, 255, 0.1)', border: 'rgba(255, 255, 255, 0.3)', color: '#fff', icon: <Play size={13} />, label: 'VIDÉO' };
    }
  };

  const badgeStyle = getCategoryBadgeStyle(video.category);

  const handleCtaClick = () => {
    if (!video.ctaLink) return;
    onClose?.();
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
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        background: 'rgba(4, 6, 11, 0.88)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'cyberFadeIn 0.25s ease'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '960px',
          background: '#090d16',
          border: '1px solid rgba(230, 0, 0, 0.45)',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 0 50px rgba(230, 0, 0, 0.3), 0 25px 50px -12px rgba(0, 0, 0, 0.85)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh',
          position: 'relative'
        }}
      >
        {/* Top Header bar */}
        <div
          style={{
            padding: '14px 20px',
            background: 'linear-gradient(90deg, rgba(230, 0, 0, 0.15) 0%, rgba(9, 13, 22, 0.95) 100%)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: badgeStyle.bg,
                border: `1px solid ${badgeStyle.border}`,
                color: badgeStyle.color,
                fontSize: '11px',
                fontWeight: '900',
                padding: '3px 9px',
                borderRadius: '6px',
                letterSpacing: '0.05em'
              }}
            >
              {badgeStyle.icon}
              {video.badge || badgeStyle.label}
            </span>

            {video.isMainTrailer && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'linear-gradient(135deg, #e60000, #ff4d4d)',
                  color: '#fff',
                  fontSize: '10px',
                  fontWeight: '900',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  boxShadow: '0 0 10px rgba(230,0,0,0.5)',
                  letterSpacing: '0.05em'
                }}
              >
                <Sparkles size={11} /> TRAILER OFFICIEL DWT
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le lecteur vidéo"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#fff',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#e60000';
              e.currentTarget.style.borderColor = '#e60000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Video Player 16/9 Frame */}
        <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#000' }}>
          {isDirectVideo ? (
            <video
              src={embedUrl}
              controls
              autoPlay
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
          ) : (
            <iframe
              src={embedUrl}
              title={video.title}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none'
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          )}
        </div>

        {/* Video Info & Call To Action footer */}
        <div
          style={{
            padding: '20px 24px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            background: '#090d16'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '260px' }}>
              <h2
                style={{
                  fontFamily: '"Rajdhani", sans-serif',
                  fontWeight: '800',
                  fontSize: '22px',
                  color: '#fff',
                  margin: 0,
                  lineHeight: '1.25'
                }}
              >
                {video.title}
              </h2>
              {video.subtitle && (
                <div style={{ color: '#38bdf8', fontSize: '13px', fontWeight: '600', marginTop: '4px' }}>
                  {video.subtitle}
                </div>
              )}
            </div>

            {/* CTA Button if product or link is set */}
            {video.ctaText && video.ctaLink && (
              <button
                type="button"
                onClick={handleCtaClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #e60000, #b30000)',
                  border: 'none',
                  color: '#fff',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: '800',
                  fontSize: '13px',
                  cursor: 'pointer',
                  letterSpacing: '0.05em',
                  boxShadow: '0 0 20px rgba(230, 0, 0, 0.45)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(230, 0, 0, 0.7)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(230, 0, 0, 0.45)';
                }}
              >
                {video.category === 'product_ad' ? <ShoppingBag size={16} /> : <ExternalLink size={16} />}
                <span>{video.ctaText}</span>
              </button>
            )}
          </div>

          {/* Meta stats */}
          <div style={{ display: 'flex', gap: '16px', color: '#64748b', fontSize: '12px', alignItems: 'center' }}>
            {video.views && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Eye size={14} color="#94a3b8" /> {video.views}
              </span>
            )}
            {video.duration && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Clock size={14} color="#94a3b8" /> {video.duration}
              </span>
            )}
            <span style={{ color: '#475569' }}>• Dark Wolf Media Network</span>
          </div>

          {/* Description */}
          {video.description && (
            <p
              style={{
                color: '#94a3b8',
                fontSize: '14px',
                lineHeight: '1.6',
                margin: '4px 0 0 0',
                background: 'rgba(255, 255, 255, 0.02)',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}
            >
              {video.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerModal;
