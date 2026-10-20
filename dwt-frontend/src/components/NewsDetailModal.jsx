import React, { useState } from 'react';
import { X, Heart, Share2, Calendar, User, Clock, Flame, ChevronRight, Check } from 'lucide-react';
import { getImageUrl } from '../utils/imageUrl';
import API from '../services/api';

const NewsDetailModal = ({ article, isOpen, onClose, onOpenArticle }) => {
  const [likesCount, setLikesCount] = useState(article?.likes?.length || 14);
  const [hasLiked, setHasLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync state if article changes
  React.useEffect(() => {
    if (article) {
      setLikesCount(article.likes?.length || Math.floor(Math.random() * 20) + 12);
      setHasLiked(false);
      setCopied(false);
    }
  }, [article]);

  if (!isOpen || !article) return null;

  const handleLike = async () => {
    if (hasLiked) return;
    setHasLiked(true);
    setLikesCount((prev) => prev + 1);
    try {
      if (article._id) {
        await API.post(`/news/${article._id}/like`).catch(() => {});
      }
    } catch (e) {
      // Graceful fallback
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const coverUrl = article.coverImage || article.image;
  const formattedDate = new Date(article.createdAt || Date.now()).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Découper le contenu en paragraphes
  const contentText = article.content || article.summary || 'Article officiel de la Dark Wolf Team.';
  const paragraphs = contentText.split('\n\n').filter(Boolean);

  return (
    <div
      className="dash-modal-backdrop"
      style={{
        zIndex: 99999,
        background: 'rgba(4, 5, 8, 0.92)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="dash-modal-box"
        style={{
          maxWidth: '820px',
          width: '100%',
          maxHeight: '90vh',
          background: '#0a0d14',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '12px',
          overflowY: 'auto',
          padding: 0,
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.9), 0 0 30px rgba(230,0,0,0.15)',
          position: 'relative',
        }}
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 10,
            background: 'rgba(10, 13, 20, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--red-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(10, 13, 20, 0.85)')}
          aria-label="Fermer l'article"
        >
          <X size={18} />
        </button>

        {/* Hero Cover Image */}
        <div style={{ position: 'relative', height: '340px', width: '100%', overflow: 'hidden' }}>
          {coverUrl ? (
            <img
              src={getImageUrl(coverUrl)}
              alt={article.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #1a0a0a, #0a0a14)',
              }}
            />
          )}

          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, #0a0d14 0%, rgba(10,13,20,0.6) 50%, rgba(10,13,20,0.3) 100%)',
            }}
          />

          {/* Badges on Cover */}
          <div style={{ position: 'absolute', bottom: '24px', left: '28px', right: '28px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
              <span
                style={{
                  background: 'var(--red-primary)',
                  color: '#fff',
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: '11px',
                  fontWeight: '800',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  padding: '4px 10px',
                  borderRadius: '3px',
                }}
              >
                {article.category || 'Annonce'}
              </span>
              {article.game && article.game !== 'Général' && (
                <span
                  style={{
                    background: 'rgba(255,255,255,0.12)',
                    color: 'var(--silver)',
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: '11px',
                    fontWeight: '700',
                    letterSpacing: '0.08em',
                    padding: '4px 10px',
                    borderRadius: '3px',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  {article.game}
                </span>
              )}
            </div>

            <h1
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: '28px',
                fontWeight: '800',
                color: '#fff',
                lineHeight: 1.25,
                margin: 0,
                textShadow: '0 2px 10px rgba(0,0,0,0.8)',
              }}
            >
              {article.title}
            </h1>
          </div>
        </div>

        {/* Article Meta Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 28px',
            borderBottom: '1px solid #1c2438',
            background: '#0d111a',
            fontSize: '12px',
            color: '#94a3b8',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={14} color="var(--red-primary)" />
              {formattedDate}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={14} color="#38bdf8" />
              Par {article.authorName || article.author?.gamertag || 'Staff Dark Wolf'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} color="#f59e0b" />
              5 min de lecture
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handleLike}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: hasLiked ? 'rgba(230,0,0,0.25)' : 'rgba(255,255,255,0.06)',
                border: hasLiked ? '1px solid var(--red-primary)' : '1px solid rgba(255,255,255,0.15)',
                color: hasLiked ? '#ff4d4d' : '#fff',
                padding: '6px 14px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '700',
                transition: 'all 0.2s',
              }}
            >
              <Heart size={14} fill={hasLiked ? '#ff4d4d' : 'none'} />
              <span>{likesCount}</span>
            </button>

            <button
              onClick={handleShare}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: copied ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.06)',
                border: copied ? '1px solid #22c55e' : '1px solid rgba(255,255,255,0.15)',
                color: copied ? '#4ade80' : '#fff',
                padding: '6px 14px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '700',
                transition: 'all 0.2s',
              }}
            >
              {copied ? <Check size={14} /> : <Share2 size={14} />}
              <span>{copied ? 'Lien copié !' : 'Partager'}</span>
            </button>
          </div>
        </div>

        {/* Article Body Content */}
        <div style={{ padding: '28px', color: '#cbd5e1', lineHeight: '1.8', fontSize: '15px' }}>
          {article.summary && (
            <div
              style={{
                background: 'rgba(230, 0, 0, 0.08)',
                borderLeft: '4px solid var(--red-primary)',
                padding: '16px 20px',
                borderRadius: '0 8px 8px 0',
                marginBottom: '24px',
                fontSize: '16px',
                fontWeight: '600',
                color: '#fff',
                fontStyle: 'italic',
              }}
            >
              "{article.summary}"
            </div>
          )}

          {paragraphs.map((p, index) => (
            <p key={index} style={{ marginBottom: '20px', whiteSpace: 'pre-line' }}>
              {p}
            </p>
          ))}

          {/* Wolf Banner Callout */}
          <div
            style={{
              marginTop: '36px',
              padding: '24px',
              background: 'linear-gradient(135deg, rgba(230,0,0,0.15), rgba(10,13,20,0.9))',
              border: '1px solid rgba(230,0,0,0.3)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div style={{ color: '#fff', fontWeight: '800', fontSize: '16px', fontFamily: "'Rajdhani', sans-serif" }}>
                REJOIGNEZ LA MEUTE OFFICIELLE
              </div>
              <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>
                Ne manquez aucun match, annonce ou drop exclusif Dark Lab.
              </div>
            </div>
            <a
              href="#join"
              onClick={(e) => {
                e.preventDefault();
                onClose();
                document.querySelector('#join')?.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                background: 'var(--red-primary)',
                color: '#fff',
                padding: '8px 20px',
                borderRadius: '4px',
                fontWeight: '700',
                fontSize: '13px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              Postuler au Roster <ChevronRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailModal;
