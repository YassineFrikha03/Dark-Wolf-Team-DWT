import React, { useState, useEffect } from 'react';
import { X, Play, Radio, Volume2, VolumeX, Eye, Share2, Flame, Award, Calendar, Trophy, MessageSquare } from 'lucide-react';
import { getImageUrl } from '../utils/imageUrl';

const LiveMatchModal = ({ match, isOpen, onClose, onOpenFanPortal }) => {
  const [reactions, setReactions] = useState([]);
  const [activeTab, setActiveTab] = useState('stream'); // 'stream', 'lineup', 'info'
  const [cheerCount, setCheerCount] = useState(1280);
  const [hasCheered, setHasCheered] = useState(false);
  const [copied, setCopied] = useState(false);

  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setCheerCount(Math.floor(Math.random() * 800) + 1400);
    } else {
      document.body.style.overflow = '';
      setReactions([]);
      setShowChat(false);
    }
  }, [isOpen]);

  if (!isOpen || !match) return null;

  const isLive = match.status === 'live' || match.isLive;
  const isFinished = match.status === 'finished';
  const oppName = match.opponent || match.t2 || 'Adversaire';
  const oppCode = oppName.slice(0, 3).toUpperCase();
  const dwtScore = match.scoreDWT ?? (isLive ? 1 : isFinished ? 2 : 0);
  const oppScore = match.scoreOpponent ?? (isLive ? 0 : isFinished ? 1 : 0);

  const triggerReaction = (emoji, label) => {
    const newId = Date.now() + Math.random();
    setReactions((prev) => [...prev, { id: newId, emoji, label, left: Math.floor(Math.random() * 60) + 20 }]);
    setCheerCount((c) => c + 1);
    setHasCheered(true);
    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== newId));
    }, 2000);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hostname = typeof window !== 'undefined' ? (window.location.hostname || 'localhost') : 'localhost';
  const parentParams = `parent=${hostname}&parent=localhost&parent=127.0.0.1`;

  // Get Twitch channel name if applicable
  const getTwitchChannel = (url, gameName, isMatchLive) => {
    const cleanUrl = (url || '').trim();
    if (cleanUrl.includes('twitch.tv/')) {
      const channel = cleanUrl.split('twitch.tv/')[1]?.split('/')[0]?.split('?')[0];
      if (channel && channel !== 'twitch.tv') return channel;
    }
    if (cleanUrl && !cleanUrl.includes('://') && !cleanUrl.includes('/')) {
      return cleanUrl;
    }
    if (isMatchLive) {
      const g = (gameName || '').toLowerCase();
      if (g.includes('cs') || g.includes('counter')) return 'eslcs';
      if (g.includes('lol') || g.includes('league')) return 'riotgames';
      if (g.includes('rocket')) return 'rocketleague';
      return 'darkw0lfteam';
    }
    return 'darkw0lfteam';
  };

  const twitchChannel = getTwitchChannel(match.streamUrl, match.game, isLive);
  const twitchChatUrl = twitchChannel 
    ? `https://www.twitch.tv/embed/${twitchChannel}/chat?${parentParams}&darkpopout=true` 
    : null;

  // Convert raw stream URL to embeddable URL
  const getEmbedStreamUrl = (url, gameName, isMatchLive) => {
    const cleanUrl = (url || '').trim();

    // YouTube watch or live
    if (cleanUrl.includes('youtube.com/watch') || cleanUrl.includes('youtu.be/')) {
      let videoId = '';
      if (cleanUrl.includes('v=')) {
        videoId = cleanUrl.split('v=')[1]?.split('&')[0];
      } else if (cleanUrl.includes('youtu.be/')) {
        videoId = cleanUrl.split('youtu.be/')[1]?.split('?')[0];
      }
      if (videoId) {
        return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=0&controls=1&rel=0`;
      }
    }

    // YouTube Live Channel / Live URL
    if (cleanUrl.includes('youtube.com/live/')) {
      const liveId = cleanUrl.split('youtube.com/live/')[1]?.split('?')[0];
      if (liveId) {
        return `https://www.youtube-nocookie.com/embed/${liveId}?autoplay=1&mute=0&controls=1`;
      }
    }

    // Kick.com channel or url
    if (cleanUrl.includes('kick.com/')) {
      const channel = cleanUrl.split('kick.com/')[1]?.split('/')[0]?.split('?')[0];
      if (channel) {
        return `https://player.kick.com/${channel}`;
      }
    }

    // Twitch Channel or video
    if (cleanUrl.includes('twitch.tv/')) {
      const channel = cleanUrl.split('twitch.tv/')[1]?.split('/')[0]?.split('?')[0];
      if (channel && channel.length > 0 && channel !== 'twitch.tv') {
        return `https://player.twitch.tv/?channel=${channel}&${parentParams}&autoplay=true&muted=false`;
      }
    }

    // If it's already an embed URL
    if (cleanUrl.startsWith('https://www.youtube.com/embed') || cleanUrl.startsWith('https://player.twitch.tv')) {
      return cleanUrl;
    }

    // Direct Twitch channel name (e.g. "valorant", "eslcs")
    if (cleanUrl && !cleanUrl.includes('://') && !cleanUrl.includes('/')) {
      return `https://player.twitch.tv/?channel=${cleanUrl}&${parentParams}&autoplay=true&muted=false`;
    }

    // If match is LIVE and streamUrl is empty or generic, fallback to official stream for this game
    if (isMatchLive) {
      const g = (gameName || '').toLowerCase();
      let defaultChannel = 'darkw0lfteam';
      if (g.includes('cs') || g.includes('counter')) defaultChannel = 'eslcs';
      else if (g.includes('lol') || g.includes('league')) defaultChannel = 'riotgames';
      else if (g.includes('rocket')) defaultChannel = 'rocketleague';
      else if (g.includes('valorant')) defaultChannel = 'darkw0lfteam';
      return `https://player.twitch.tv/?channel=${defaultChannel}&${parentParams}&autoplay=true&muted=false`;
    }

    return null;
  };

  const streamEmbed = getEmbedStreamUrl(match.streamUrl, match.game, isLive);

  const formattedDate = match.matchDate
    ? new Date(match.matchDate).toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
      })
    : match.time || 'Date à confirmer';

  return (
    <div
      className="dash-modal-backdrop"
      style={{
        zIndex: 99999,
        background: 'rgba(3, 5, 10, 0.94)',
        backdropFilter: 'blur(14px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        position: 'fixed',
        inset: 0,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="dash-modal-box"
        style={{
          maxWidth: '960px',
          width: '100%',
          maxHeight: '92vh',
          background: '#090d16',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '14px',
          overflowY: 'auto',
          padding: 0,
          boxShadow: '0 30px 80px -15px rgba(0,0,0,0.95), 0 0 30px rgba(255, 255, 255, 0.05)',
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
            zIndex: 20,
            background: 'rgba(10, 14, 24, 0.85)',
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
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(10, 14, 24, 0.85)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }}
          aria-label="Fermer"
        >
          <X size={18} />
        </button>

        {/* Top Match Header & Scoreboard Banner */}
        <div
          style={{
            padding: '24px 64px 20px 28px',
            background: 'linear-gradient(180deg, #121826 0%, #090d16 100%)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  background: isLive ? 'rgba(230, 0, 0, 0.2)' : isFinished ? 'rgba(34, 197, 94, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                  border: isLive ? '1px solid #e60000' : isFinished ? '1px solid #22c55e' : '1px solid #38bdf8',
                  color: isLive ? '#ff4d4d' : isFinished ? '#22c55e' : '#38bdf8',
                  fontSize: '11px',
                  fontWeight: '800',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {isLive && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff0000', boxShadow: '0 0 10px #ff0000', animation: 'pulse 1.5s infinite' }}></span>}
                {isLive ? 'EN DIRECT (LIVE NOW)' : isFinished ? 'MATCH TERMINÉ' : 'À VENIR'}
              </span>

              <span style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '600' }}>
                {match.game} • {match.tournamentName || 'Tournoi Officiel DWT'} • {match.format || 'BO3'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {!isFinished && onOpenFanPortal && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenFanPortal('PRED');
                  }}
                  style={{
                    background: 'linear-gradient(135deg, rgba(230,0,0,0.35), rgba(255,68,68,0.2))',
                    border: '1px solid #e60000',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: '800',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 0 10px rgba(230,0,0,0.3)'
                  }}
                >
                  🎯 Faire un Pronostic (+130 pts)
                </button>
              )}
              {isLive && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1', fontSize: '12px', fontFamily: '"Orbitron", monospace' }}>
                  <Eye size={14} color="#ff4d4d" />
                  <span>2,480 Spectateurs</span>
                </div>
              )}
            </div>
          </div>

          {/* Versus Scoreboard */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              alignItems: 'center',
              gap: '20px',
              padding: '16px 20px',
              background: 'rgba(0, 0, 0, 0.45)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            {/* Dark Wolf Team */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.08), #07090e)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(0,0,0,0.6)',
                }}
              >
                <img src="/logo-dwt.png" alt="Dark Wolf Team" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
              </div>
              <div>
                <div style={{ fontFamily: '"Orbitron", sans-serif', fontSize: '18px', fontWeight: '900', color: '#fff', letterSpacing: '0.05em' }}>
                  DARK WOLF
                </div>
                <div style={{ fontSize: '12px', color: '#22c55e', fontWeight: '700' }}>ÉQUIPE PRINCIPALE</div>
              </div>
            </div>

            {/* Central Score */}
            <div style={{ textAlign: 'center', minWidth: '130px' }}>
              <div
                style={{
                  fontFamily: '"Orbitron", monospace',
                  fontSize: '34px',
                  fontWeight: '900',
                  color: isLive ? '#ff4444' : '#fff',
                  textShadow: isLive ? '0 0 20px rgba(230,0,0,0.6)' : 'none',
                  letterSpacing: '0.1em',
                }}
              >
                {dwtScore} : {oppScore}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '2px' }}>
                {isLive ? 'Round / Map en cours' : isFinished ? 'Score Final' : formattedDate}
              </div>
            </div>

            {/* Opponent */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '16px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: '"Orbitron", sans-serif', fontSize: '18px', fontWeight: '900', color: '#fff', letterSpacing: '0.05em' }}>
                  {oppName}
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>Rival Esport</div>
              </div>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: '900',
                  color: '#fff',
                  fontFamily: '"Orbitron", monospace',
                }}
              >
                {oppCode}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area: Stream Player / Arena Sim */}
        <div style={{ padding: '24px 28px' }}>
          {/* Stream Video Container */}
          {showChat && twitchChatUrl ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 310px',
                height: '470px',
                background: '#04060a',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.7)',
                position: 'relative',
              }}
            >
              <div style={{ position: 'relative', height: '100%', background: '#000' }}>
                {streamEmbed && (
                  <iframe
                    src={streamEmbed}
                    title="DWT Esports Live Stream"
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                )}
              </div>
              <div style={{ height: '100%', borderLeft: '1px solid rgba(255,255,255,0.1)', background: '#0e0e10' }}>
                <iframe
                  src={twitchChatUrl}
                  title="Twitch Chat"
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                ></iframe>
              </div>
            </div>
          ) : (
            <div
              style={{
                position: 'relative',
                width: '100%',
                paddingTop: '56.25%', // 16:9 ratio
                background: '#04060a',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.7)',
              }}
            >
              {streamEmbed ? (
                <iframe
                  src={streamEmbed}
                  title="DWT Esports Live Stream"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                /* Fallback Cyber Esports Stream Simulator */
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'radial-gradient(circle at center, #171d2d 0%, #04060a 80%)',
                    padding: '24px',
                    textAlign: 'center',
                  }}
                >
                  {/* Cyber Grid Lines */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                      backgroundSize: '40px 40px',
                      pointerEvents: 'none',
                    }}
                  ></div>

                  <div
                    style={{
                      width: '74px',
                      height: '74px',
                      borderRadius: '50%',
                      background: isLive ? 'rgba(230,0,0,0.18)' : 'rgba(255,255,255,0.05)',
                      border: isLive ? '2px solid #e60000' : '1px solid rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '16px',
                      boxShadow: isLive ? '0 0 35px rgba(230,0,0,0.4)' : 'none',
                    }}
                  >
                    <Radio size={34} color={isLive ? '#ff4d4d' : '#94a3b8'} className={isLive ? 'animate-pulse' : ''} />
                  </div>

                  <div style={{ fontFamily: '"Orbitron", sans-serif', fontSize: '20px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>
                    {isLive ? 'DIFFUSION DWT ESPORTS EN COURS' : 'SALON DE DIFFUSION DU MATCH'}
                  </div>

                  <p style={{ color: '#94a3b8', fontSize: '13px', maxWidth: '480px', lineHeight: 1.6, marginBottom: '20px' }}>
                    {isLive
                      ? "L'administrateur a lancé la diffusion officielle du match. Connectez un lien Twitch, Kick ou YouTube dans le Dashboard pour l'incrustation directe du flux vidéo."
                      : `Ce match est programmé pour le ${formattedDate}. Rejoignez le live dès le coup d'envoi pour encourager les loups !`}
                  </p>

                  {match.streamUrl && match.streamUrl !== 'https://twitch.tv' && (
                    <a
                      href={match.streamUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 22px',
                        background: '#e60000',
                        color: '#fff',
                        borderRadius: '6px',
                        fontWeight: '700',
                        fontSize: '13px',
                        textDecoration: 'none',
                        boxShadow: '0 0 20px rgba(230,0,0,0.5)',
                      }}
                    >
                      <Play size={15} fill="#fff" />
                      <span>Ouvrir le flux officiel sur la plateforme externe →</span>
                    </a>
                  )}
                </div>
              )}

              {/* Floating Reactions overlay */}
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                {reactions.map((r) => (
                  <div
                    key={r.id}
                    style={{
                      position: 'absolute',
                      bottom: '20px',
                      left: `${r.left}%`,
                      fontSize: '28px',
                      animation: 'floatUp 2s forwards ease-out',
                      filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.4))',
                    }}
                  >
                    {r.emoji}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Fan Cheer & Reactions Bar */}
          <div
            style={{
              marginTop: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '14px',
              padding: '14px 18px',
              background: '#0d121e',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '700' }}>
                ENCOURAGER LA MEUTE :
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => triggerReaction('🐺', 'AOUUUUH')}
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  🐺 AOUUUUH !
                </button>
                <button
                  type="button"
                  onClick={() => triggerReaction('🔥', 'LETS GO')}
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  🔥 LET'S GO
                </button>
                <button
                  type="button"
                  onClick={() => triggerReaction('⚡', 'CLUTCH')}
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  ⚡ CLUTCH
                </button>
                <button
                  type="button"
                  onClick={() => triggerReaction('🎯', 'GG')}
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  🎯 GG
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {twitchChatUrl && (
                <button
                  type="button"
                  onClick={() => setShowChat(!showChat)}
                  style={{
                    background: showChat ? 'rgba(168, 85, 247, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                    border: showChat ? '1px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.2)',
                    color: showChat ? '#c084fc' : '#cbd5e1',
                    borderRadius: '6px',
                    padding: '7px 12px',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s',
                  }}
                  title="Afficher ou masquer le chat Twitch en direct"
                >
                  <MessageSquare size={14} color={showChat ? '#c084fc' : '#94a3b8'} />
                  <span>{showChat ? 'Plein Écran' : '💬 Chat Twitch'}</span>
                </button>
              )}
              <div style={{ fontSize: '13px', color: '#22c55e', fontWeight: '800', fontFamily: '"Orbitron", monospace' }}>
                {cheerCount.toLocaleString()} Cris de Loup 🐺
              </div>
              <button
                type="button"
                onClick={handleShare}
                style={{
                  background: copied ? '#22c55e' : 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  borderRadius: '6px',
                  padding: '7px 14px',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Share2 size={13} />
                <span>{copied ? 'Lien copié !' : 'Partager le Match'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatUp {
          0% {
            opacity: 1;
            transform: translateY(0) scale(0.8);
          }
          100% {
            opacity: 0;
            transform: translateY(-160px) scale(1.4);
          }
        }
      `}</style>
    </div>
  );
};

export default LiveMatchModal;
