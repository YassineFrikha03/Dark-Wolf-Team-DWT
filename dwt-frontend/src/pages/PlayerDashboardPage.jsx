import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Trophy,
  ShoppingBag,
  FileText,
  LogOut,
  Bell,
  MoreHorizontal,
  Eye,
  ArrowRight,
  Star,
  RefreshCw,
  CheckCircle2,
  Calendar,
  PackageCheck,
  MessageSquare,
  Send,
  Target,
  Award,
  Crown,
  Sparkles,
  TrendingUp,
  Clock,
  Tv,
  Users,
  Check,
  ArrowLeft,
  Settings,
  Shield,
  Flame,
  CheckCheck,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { WolfLogo } from '../components/WolfLogo';
import { CyberToast } from '../components/CyberToast';
import API from '../services/api';
import '../styles/wolfpack.css';

const PlayerDashboardPage = ({ onBackToSite, onGoToAdmin, onLogout, initialTab = 'Mon Profil' }) => {
  const { user, logout, updateUser } = useAuth();
  const [activeNav, setActiveNav] = useState(initialTab || 'Mon Profil');
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  // Données réelles
  const [myOrders, setMyOrders] = useState([]);
  const [matches, setMatches] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [readNewsIds, setReadNewsIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('dwt_read_news') || '[]');
    } catch {
      return [];
    }
  });

  // Wolf Pack & Gamification Data
  const [wolfProfile, setWolfProfile] = useState(null);
  const [myPredictions, setMyPredictions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [missionsData, setMissionsData] = useState(null);
  const [predictionInputs, setPredictionInputs] = useState({});
  const [submittingPred, setSubmittingPred] = useState({});
  const [rosterPlayers, setRosterPlayers] = useState([]);

  // Modal d'édition de profil
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [profileFormData, setProfileFormData] = useState({
    gamertag: user?.gamertag || '',
    bio: user?.bio || '',
    favoriteGame: user?.favoriteGame || 'Valorant',
    avatar: user?.avatar || ''
  });

  // Messagerie Staff / Admin
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [adminTarget, setAdminTarget] = useState(null);
  const [sendingMsg, setSendingMsg] = useState(false);
  const playerChatScrollRef = useRef(null);

  // Notifications Joueur
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const [showNotifPopup, setShowNotifPopup] = useState(false);
  const notifRef = useRef(null);

  // Toast feedback helper
  const showToast = (text, type = 'success', duration = 4000) => {
    setToastMessage({ id: Date.now(), text, type, duration });
  };

  // Chargement réel depuis l'API MongoDB
  const fetchPlayerData = async () => {
    setLoading(true);
    try {
      const [
        ordersRes,
        matchesRes,
        newsRes,
        convsRes,
        playersRes,
        leaderRes,
        missionsRes,
        profileRes,
        myPredRes,
        notifRes
      ] = await Promise.all([
        API.get('/orders/my-orders').catch(() => ({ data: { orders: [] } })),
        API.get('/matches').catch(() => ({ data: { matches: [] } })),
        API.get('/news').catch(() => ({ data: { articles: [] } })),
        API.get('/messages/conversations').catch(() => ({ data: { conversations: [] } })),
        API.get('/players').catch(() => ({ data: { players: [] } })),
        API.get('/predictions/leaderboard').catch(() => ({ data: { leaderboard: [] } })),
        API.get('/missions/weekly').catch(() => ({ data: null })),
        API.get('/wolfpack/profile').catch(() => ({ data: null })),
        API.get('/predictions/my').catch(() => ({ data: { predictions: [] } })),
        API.get('/notifications').catch(() => ({ data: { notifications: [], unreadCount: 0 } }))
      ]);

      setMyOrders(ordersRes.data?.orders || []);
      setMatches(matchesRes.data?.matches || []);
      setNewsList(newsRes.data?.articles || []);
      setRosterPlayers(playersRes.data?.players || []);
      setLeaderboard(leaderRes.data?.leaderboard || []);
      setMissionsData(missionsRes.data || null);
      if (profileRes.data?.profile) setWolfProfile(profileRes.data.profile);
      setMyPredictions(myPredRes.data?.predictions || []);
      setNotifications(notifRes.data?.notifications || []);
      setUnreadNotifCount(notifRes.data?.unreadCount || 0);

      // Initialiser les choix de pronostics par défaut
      const matchesList = matchesRes.data?.matches || [];
      const initPred = {};
      matchesList.filter((m) => m.status === 'upcoming').forEach((m) => {
        initPred[m._id] = {
          predictedWinner: 'DWT',
          scoreDWT: 2,
          scoreOpponent: 1,
          predictedMVP: playersRes.data?.players?.[0]?.gamertag || 'ShadowFang'
        };
      });
      setPredictionInputs(initPred);

      const convs = convsRes.data?.conversations || [];
      if (convs.length > 0) {
        setAdminTarget(convs[0].user);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des données joueur:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayerData();
  }, [user]);

  // Synchroniser form data avec user
  useEffect(() => {
    if (user) {
      setProfileFormData({
        gamertag: user.gamertag || '',
        bio: user.bio || '',
        favoriteGame: user.favoriteGame || 'Valorant',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  // Synchroniser onglet initial si fourni
  useEffect(() => {
    if (initialTab) setActiveNav(initialTab);
  }, [initialTab]);

  // Polling de chat messages avec admin
  useEffect(() => {
    if (!adminTarget?._id) return;
    const fetchChat = async () => {
      try {
        const res = await API.get(`/messages/conversation/${adminTarget._id}`);
        if (res.data?.success) {
          setChatMessages(res.data.messages || []);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchChat();
    const interval = setInterval(fetchChat, 4000);
    return () => clearInterval(interval);
  }, [adminTarget]);

  useEffect(() => {
    if (playerChatScrollRef.current) {
      playerChatScrollRef.current.scrollTop = playerChatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSendPlayerMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || sendingMsg) return;
    setSendingMsg(true);
    try {
      const res = await API.post('/messages', {
        receiverId: adminTarget?._id,
        content: chatInput.trim()
      });
      if (res.data?.success) {
        setChatMessages((prev) => [...prev, res.data.message]);
        setChatInput('');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Erreur lors de l\'envoi du message au staff', 'error');
    } finally {
      setSendingMsg(false);
    }
  };

  // Fermer le popup de notifications si clic en dehors
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifPopup(false);
      }
    };
    if (showNotifPopup) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifPopup]);

  // Polling doux des notifications en arrière-plan
  useEffect(() => {
    if (!user?._id) return;
    const pollNotifs = async () => {
      try {
        const res = await API.get('/notifications');
        if (res.data?.success) {
          setNotifications(res.data.notifications || []);
          setUnreadNotifCount(res.data.unreadCount || 0);
        }
      } catch (_) {}
    };
    const interval = setInterval(pollNotifs, 8000);
    return () => clearInterval(interval);
  }, [user]);

  // Marquer une notification comme lue et naviguer vers la section appropriée
  const handleMarkNotifRead = async (notifId, notif) => {
    try {
      await API.put(`/notifications/${notifId}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notifId ? { ...n, isRead: true } : n))
      );
      setUnreadNotifCount((prev) => Math.max(0, prev - 1));

      // Navigation contextuelle
      if (notif.type === 'message' || notif.title?.includes('Message') || notif.title?.includes('Staff')) {
        setActiveNav('Messagerie Staff');
      } else if (notif.type === 'order' || notif.title?.includes('Commande')) {
        setActiveNav('Ma Boutique');
      } else if (notif.type === 'mission' || notif.title?.includes('Quête') || notif.title?.includes('Mission')) {
        setActiveNav('Quêtes');
      } else if (notif.title?.includes('Match') || notif.title?.includes('Prono')) {
        setActiveNav('Pronostics');
      }
      setShowNotifPopup(false);
    } catch (err) {
      console.error('Erreur lecture notification :', err);
    }
  };

  // Marquer toutes les notifications comme lues
  const handleMarkAllNotifsRead = async () => {
    try {
      await API.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadNotifCount(0);
      showToast('Toutes tes notifications ont été marquées comme lues ! 🐺✓', 'success');
    } catch (err) {
      console.error('Erreur lecture notifications :', err);
    }
  };

  const handleMarkAsRead = (id) => {
    const updated = [...readNewsIds, id];
    setReadNewsIds(updated);
    localStorage.setItem('dwt_read_news', JSON.stringify(updated));
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      logout();
      if (onBackToSite) onBackToSite();
      else window.location.href = '/';
    }
  };

  const handleJoinMatch = (match) => {
    if (match.streamUrl && match.streamUrl !== 'https://twitch.tv') {
      window.open(match.streamUrl, '_blank');
    } else {
      window.open('https://www.twitch.tv/darkw0lfteam', '_blank');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put('/auth/profile', profileFormData);
      if (res.data?.success) {
        updateUser(res.data.user);
        showToast('Profil mis à jour avec succès !');
        setShowEditProfileModal(false);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Erreur lors de la mise à jour du profil', 'error');
    }
  };

  // Enregistrer un pronostic
  const handleSavePrediction = async (matchId) => {
    if (!user) {
      showToast('Veuillez vous connecter pour faire un pronostic', 'error');
      return;
    }

    const input = predictionInputs[matchId] || {
      predictedWinner: 'DWT',
      scoreDWT: 2,
      scoreOpponent: 1,
      predictedMVP: 'ShadowFang'
    };

    setSubmittingPred((prev) => ({ ...prev, [matchId]: true }));
    try {
      const res = await API.post('/predictions', {
        matchId,
        predictedWinner: input.predictedWinner,
        predictedScore: {
          scoreDWT: Number(input.scoreDWT),
          scoreOpponent: Number(input.scoreOpponent)
        },
        predictedMVP: input.predictedMVP
      });

      if (res.data?.success) {
        showToast(res.data.message || 'Pronostic enregistré avec succès ! 🐺🎯');
        const [myPredRes, missRes, profRes] = await Promise.all([
          API.get('/predictions/my'),
          API.get('/missions/weekly'),
          API.get('/wolfpack/profile').catch(() => null)
        ]);
        if (myPredRes.data?.predictions) setMyPredictions(myPredRes.data.predictions);
        if (missRes.data) setMissionsData(missRes.data);
        if (profRes?.data?.profile) setWolfProfile(profRes.data.profile);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Erreur enregistrement pronostic', 'error');
    } finally {
      setSubmittingPred((prev) => ({ ...prev, [matchId]: false }));
    }
  };

  // Compléter une mission
  const handleCompleteMission = async (code, actionType) => {
    if (actionType === 'predict_match') {
      setActiveNav('Pronostics');
      return;
    }
    if (actionType === 'visit_shop') {
      setActiveNav('Ma Boutique');
      return;
    }

    try {
      const res = await API.post(`/missions/${code}/complete`);
      if (res.data?.success) {
        showToast(res.data.message || 'Mission validée ! ⚡');
        const [missRes, profRes] = await Promise.all([
          API.get('/missions/weekly'),
          API.get('/wolfpack/profile').catch(() => null)
        ]);
        if (missRes.data) setMissionsData(missRes.data);
        if (profRes?.data?.profile) setWolfProfile(profRes.data.profile);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Mission déjà validée cette semaine', 'error');
    }
  };

  // Réclamer bonus hebdo
  const handleClaimWeeklyBonus = async () => {
    try {
      const res = await API.post('/missions/claim-bonus');
      if (res.data?.success) {
        showToast(res.data.message || 'Bonus Alpha réclamé avec succès ! 🐺👑');
        const [missRes, profRes] = await Promise.all([
          API.get('/missions/weekly'),
          API.get('/wolfpack/profile').catch(() => null)
        ]);
        if (missRes.data) setMissionsData(missRes.data);
        if (profRes?.data?.profile) setWolfProfile(profRes.data.profile);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Conditions non remplies pour ce bonus', 'error');
    }
  };

  // Équiper un cadre
  const handleEquipFrame = async (frameId) => {
    try {
      const res = await API.put('/wolfpack/frame', { frameId });
      if (res.data?.success) {
        showToast(res.data.message || 'Nouveau cadre équipé !');
        setWolfProfile((prev) => (prev ? { ...prev, avatarFrame: frameId } : prev));
        if (updateUser) updateUser({ ...user, avatarFrame: frameId });
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Impossible d\'équiper ce cadre', 'error');
    }
  };

  // Vote MVP
  const handleVoteMvp = async (matchId, playerName) => {
    try {
      const res = await API.post('/wolfpack/vote-mvp', { matchId, playerName });
      if (res.data?.success) {
        showToast(res.data.message || `Vote enregistré pour ${playerName} !`);
        const [missRes, profRes] = await Promise.all([
          API.get('/missions/weekly'),
          API.get('/wolfpack/profile').catch(() => null)
        ]);
        if (missRes.data) setMissionsData(missRes.data);
        if (profRes?.data?.profile) setWolfProfile(profRes.data.profile);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Erreur lors du vote', 'error');
    }
  };

  const upcomingMatch = matches.find((m) => m.status === 'live') || matches.find((m) => m.status === 'upcoming') || matches[0];
  const upcomingMatchesList = matches.filter((m) => m.status === 'upcoming');
  const latestOrderItem = myOrders[0]?.orderItems?.[0];

  const currentRankName = wolfProfile?.rank?.currentRank || user?.wolfRank || 'Cub';
  const currentFrame = wolfProfile?.avatarFrame || user?.avatarFrame || 'default';
  const xp = wolfProfile?.wolfXP || user?.wolfXP || 150;
  const points = wolfProfile?.wolfPoints || user?.wolfPoints || 150;
  const progressPercent = wolfProfile?.rank?.progressPercent ?? 30;
  const nextRank = wolfProfile?.rank?.nextRank || 'Scout';
  const xpForNext = wolfProfile?.rank?.xpForNext || 150;

  const sidebarLinks = [
    { label: 'Mon Profil', icon: <User size={18} /> },
    { label: 'Pronostics', icon: <Target size={18} /> },
    { label: 'Classement', icon: <Trophy size={18} /> },
    { label: 'Quêtes', icon: <Award size={18} /> },
    { label: 'Messagerie Staff', icon: <MessageSquare size={18} /> },
    { label: 'Mes Matchs', icon: <Calendar size={18} /> },
    { label: 'Ma Boutique', icon: <ShoppingBag size={18} /> },
    { label: 'Actualités', icon: <FileText size={18} /> },
  ];

  return (
    <div className="dashboard-page-bg" style={{ minHeight: '100vh', padding: '24px 20px 80px' }}>
      {/* Cyber Design System Toast Notification */}
      <CyberToast toast={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Top Bar with Brand & Back Button */}
      <div
        style={{
          maxWidth: '1320px',
          margin: '0 auto 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          paddingBottom: '16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            type="button"
            className="bnav-player"
            onClick={() => {
              if (onBackToSite) onBackToSite();
              else window.location.href = '/';
            }}
            title="Revenir au site public officiel"
          >
            <ArrowLeft size={15} />
            <span>Retour au Site Public</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <WolfLogo size={24} />
            <span style={{ fontFamily: '"Orbitron", sans-serif', fontWeight: '900', fontSize: '15px', color: '#fff', letterSpacing: '1px' }}>
              DARK WOLF TEAM • ESPACE JOUEUR & MEUTE
            </span>
          </div>
        </div>

        {/* User Badges in Top Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className={`rank-pill ${currentRankName}`}>
            {currentRankName === 'Cub' && '🐾 Cub'}
            {currentRankName === 'Scout' && '🏹 Scout'}
            {currentRankName === 'Hunter' && '⚔️ Hunter'}
            {currentRankName === 'Alpha' && '👑 Alpha'}
          </span>

          <span
            style={{
              fontFamily: '"Orbitron", monospace',
              fontSize: '12px',
              fontWeight: '800',
              color: '#38bdf8',
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              padding: '6px 14px',
              borderRadius: '4px',
              letterSpacing: '0.05em'
            }}
          >
            {points} POINTS WOLF
          </span>

          {/* Bouton Retour au Site */}
          <button
            type="button"
            className="bnav-player"
            onClick={onBackToSite ? onBackToSite : () => window.location.href = '/'}
            title="Revenir au site principal"
            style={{ padding: '6px 12px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <ExternalLink size={13} />
            <span>Voir le Site</span>
          </button>

          {/* Bouton Déconnexion Joueur */}
          <button
            type="button"
            className="bnav-player"
            onClick={handleLogout}
            title="Se déconnecter de votre compte joueur"
            style={{
              padding: '6px 12px',
              fontSize: '11px',
              cursor: 'pointer',
              color: '#ef4444',
              borderColor: 'rgba(239, 68, 68, 0.4)',
              background: 'rgba(239, 68, 68, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <LogOut size={13} />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Main Dashboard Layout Container */}
      <div className="dashboard-layout-container">
        {/* Left Sidebar */}
        <aside className="dash-sidebar">
          {sidebarLinks.map((item) => (
            <button
              key={item.label}
              className={`dash-nav-item ${activeNav === item.label ? 'active' : ''}`}
              onClick={() => setActiveNav(item.label)}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.label === 'Quêtes' && missionsData && missionsData.completedCount < missionsData.totalMissions && (
                <span style={{ marginLeft: 'auto', background: '#e60000', color: '#fff', fontSize: '10px', padding: '1px 6px', borderRadius: '10px', fontWeight: '800' }}>
                  {missionsData.totalMissions - missionsData.completedCount}
                </span>
              )}
            </button>
          ))}

          <button
            className="dash-nav-item"
            onClick={handleLogout}
            style={{ marginTop: '16px', color: '#64748b' }}
          >
            <LogOut size={18} />
            <span>Déconnexion</span>
          </button>
        </aside>

        {/* Right Main Pane */}
        <main className="dash-main-pane">
          {/* Header Title Row avec Système de Notifications */}
          <div className="dash-title-row" style={{ position: 'relative' }}>
            <h1 className="dash-page-title">
              ESPACE <span className="red-glow-txt">JOUEUR & MEUTE</span>
            </h1>

            <div style={{ position: 'relative' }} ref={notifRef}>
              <div
                className="dash-bell-notify"
                title="Notifications"
                onClick={() => setShowNotifPopup(!showNotifPopup)}
                style={{ cursor: 'pointer' }}
              >
                <Bell size={18} />
                {unreadNotifCount > 0 ? (
                  <span className="dash-bell-badge">{unreadNotifCount}</span>
                ) : (
                  (newsList.length - readNewsIds.length > 0) && <span className="dash-bell-dot"></span>
                )}
              </div>

              {/* Popup des Notifications Joueur */}
              {showNotifPopup && (
                <div className="notif-popup">
                  <div className="notif-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <WolfLogo size={18} />
                      <span style={{ fontWeight: '800', fontSize: '14px', color: '#fff' }}>
                        Notifications ({notifications.length})
                      </span>
                    </div>
                    {unreadNotifCount > 0 && (
                      <button
                        onClick={handleMarkAllNotifsRead}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--red-primary)',
                          fontSize: '12px',
                          fontWeight: '800',
                          cursor: 'pointer'
                        }}
                      >
                        Tout marquer lu ✓
                      </button>
                    )}
                  </div>

                  <div className="notif-list wp-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="dash-empty-state" style={{ padding: '30px 20px' }}>
                        <WolfLogo size={32} />
                        <div style={{ marginTop: '10px', fontWeight: '700', color: '#fff', fontSize: '13px' }}>
                          Aucune notification pour le moment
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                          Tu es parfaitement à jour sur tes alertes et actualités ! 🐺✨
                        </div>
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n._id}
                          className={`notif-item ${!n.isRead ? 'unread' : ''}`}
                          onClick={() => handleMarkNotifRead(n._id, n)}
                          title="Cliquer pour voir et marquer comme lu"
                        >
                          <div style={{ marginTop: '2px', flexShrink: 0 }}>
                            {n.type === 'message' ? (
                              <MessageSquare size={18} color="#38bdf8" />
                            ) : n.type === 'order' ? (
                              <ShoppingBag size={18} color="#4ade80" />
                            ) : n.type === 'mission' ? (
                              <Award size={18} color="#f59e0b" />
                            ) : (
                              <WolfLogo size={18} />
                            )}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: '700', fontSize: '13px', color: '#fff' }}>
                              {n.title}
                            </div>
                            <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '2px', lineHeight: 1.4 }}>
                              {n.message}
                            </div>
                            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '5px' }}>
                              {new Date(n.createdAt).toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                          {!n.isRead && (
                            <span style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: 'var(--red-primary)',
                              boxShadow: '0 0 6px var(--red-primary)',
                              flexShrink: 0,
                              marginTop: '6px'
                            }} />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Player Welcome Hero Banner */}
          <div className="player-hero-banner" style={{ position: 'relative', overflow: 'hidden' }}>
            <div
              className={`avatar-frame-wrapper avatar-frame-${currentFrame}`}
              onClick={() => setShowEditProfileModal(true)}
              style={{ cursor: 'pointer' }}
              title="Cliquer pour modifier mon profil"
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}
              >
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=250&q=80'}
                  alt={user?.gamertag || 'Joueur'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>

            <div className="player-greeting-col" style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h2 style={{ margin: 0 }}>
                  Bienvenue, <span className="gamertag-red">{user?.gamertag || 'JOUEUR'}</span>
                </h2>
                <span className={`rank-pill ${currentRankName}`} style={{ fontSize: '10px' }}>
                  {currentRankName}
                </span>
              </div>
              <div className="player-role-label">
                Rôle : {user?.role === 'admin' ? 'Leader & Staff DWT' : user?.role === 'player' ? 'Joueur Officiel' : 'Membre de la Meute'} • Jeu : {user?.favoriteGame || 'Valorant'}
              </div>

              {/* XP Progress Bar */}
              <div style={{ marginTop: '10px', maxWidth: '450px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginBottom: '4px', fontWeight: '700' }}>
                  <span>{xp} XP Réputation</span>
                  {nextRank ? (
                    <span style={{ color: '#38bdf8' }}>
                      {progressPercent}% vers {nextRank} ({xpForNext} XP restants)
                    </span>
                  ) : (
                    <span style={{ color: '#ff4d4d' }}>RANG MAXIMAL ALPHA 👑</span>
                  )}
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${progressPercent}%`,
                      height: '100%',
                      background: currentRankName === 'Alpha' ? 'linear-gradient(90deg, #ff4d4d, #e60000)' : 'linear-gradient(90deg, #38bdf8, #818cf8)',
                      borderRadius: '3px',
                      transition: 'width 0.4s ease'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Points Widget */}
            <div
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '12px',
                padding: '12px 18px',
                textAlign: 'center',
                minWidth: '120px'
              }}
            >
              <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>Points Meute</div>
              <div style={{ fontSize: '22px', fontWeight: '900', color: '#38bdf8', fontFamily: '"Orbitron", monospace', marginTop: '2px' }}>
                {points}
              </div>
              <div style={{ fontSize: '10px', color: '#22c55e', marginTop: '2px' }}>Disponibles</div>
            </div>
          </div>

          {/* =========================================================================
              VUE 1 : MON PROFIL (IDENTITY, CADRES, STATS, PROCHAINS MATCHS)
              ========================================================================= */}
          {activeNav === 'Mon Profil' && (
            <>
              {/* Prochain Match en Direct / Prioritaire */}
              <div className="dash-card">
                <div className="dash-card-header">
                  <span className="dash-card-title">Prochain Match Officiel</span>
                  <button className="dash-more-btn" onClick={() => setActiveNav('Mes Matchs')} title="Voir tous les matchs">
                    <MoreHorizontal size={18} />
                  </button>
                </div>
                {upcomingMatch ? (
                  <div className="match-player-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div className="dash-wolf-badge-tiny">
                        <WolfLogo size={20} />
                      </div>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff' }}>
                          {upcomingMatch.game} vs {upcomingMatch.opponent} ({upcomingMatch.format || 'BO3'})
                        </div>
                        <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                          {new Date(upcomingMatch.matchDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} • {upcomingMatch.tournamentName}
                        </div>
                        <div style={{ width: '60px', height: '3px', background: 'var(--red-primary)', borderRadius: '2px', marginTop: '6px' }}></div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn-rejoindre" onClick={() => handleJoinMatch(upcomingMatch)}>
                        {upcomingMatch.status === 'live' ? 'Regarder le Live 🔴' : 'Rejoindre'}
                      </button>
                      <button
                        className="btn-mark-read"
                        style={{ padding: '6px 14px' }}
                        onClick={() => setActiveNav('Pronostics')}
                      >
                        🎯 Pronostiquer
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="dash-empty-state">Aucun match programmé pour l'instant.</div>
                )}
              </div>

              {/* 2 Colonnes: Mes Stats & Mon Inventaire */}
              <div className="player-mid-grid">
                {/* Mes Stats */}
                <div className="dash-card">
                  <div className="dash-card-header">
                    <span className="dash-card-title">Mes Stats & Pronostics</span>
                    <Eye size={16} color="#64748b" style={{ cursor: 'pointer' }} onClick={() => setShowEditProfileModal(true)} />
                  </div>
                  <div className="player-stats-list">
                    <div>Rang de Meute : <span className="val-red">{currentRankName}</span></div>
                    <div>Pronostics Gagnés : <span className="val-red">{wolfProfile?.predictionStats?.won ?? 0}</span> / {wolfProfile?.predictionStats?.total ?? 0}</div>
                    <div>Points Gagnés aux Pronos : <span className="val-red">{wolfProfile?.predictionStats?.pointsWon ?? 0} pts</span></div>
                    <div>Jeu Favori : <span className="val-red">{user?.favoriteGame || 'Valorant'}</span></div>
                  </div>
                </div>

                {/* Mon Inventaire / Commande */}
                <div className="dash-card">
                  <div className="dash-card-header">
                    <span className="dash-card-title">Mon Inventaire Boutique</span>
                    <span className="inventory-badge-recu">
                      {latestOrderItem ? 'Reçu' : 'Catalogue'}
                    </span>
                  </div>
                  <div className="inventory-item-preview">
                    <div className="inventory-img-box">
                      <img
                        src={latestOrderItem?.image || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=200&q=80'}
                        alt="Article"
                      />
                    </div>
                    <div className="inventory-item-info">
                      <span className="inventory-item-name">{latestOrderItem?.name || 'Wolf Jersey Pro'}</span>
                      <span className="inventory-item-tag">
                        <Star size={12} fill="var(--red-primary)" color="var(--red-primary)" /> {latestOrderItem ? 'Reçu' : '★ Officiel DWT'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cadres de Profil Déblocables & Équipables */}
              <div className="dash-card">
                <div className="dash-card-header">
                  <span className="dash-card-title">Cadres d'Avatar Débloqués</span>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>Équipez le cadre selon votre rang de meute</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
                  {[
                    { id: 'default', name: 'Standard', unlocked: true, isEquipped: currentFrame === 'default' },
                    { id: 'cub_bronze', name: 'Cub Bronze', unlocked: true, isEquipped: currentFrame === 'cub_bronze' },
                    { id: 'scout_silver', name: 'Scout Argent', unlocked: xp >= 300, isEquipped: currentFrame === 'scout_silver' },
                    { id: 'hunter_gold', name: 'Hunter Or', unlocked: xp >= 800, isEquipped: currentFrame === 'hunter_gold' },
                    { id: 'alpha_fire', name: 'Aura Alpha', unlocked: xp >= 1800, isEquipped: currentFrame === 'alpha_fire' }
                  ].map((f) => (
                    <div
                      key={f.id}
                      style={{
                        background: f.isEquipped ? 'rgba(230,0,0,0.1)' : 'rgba(255,255,255,0.02)',
                        border: f.isEquipped ? '1px solid #e60000' : '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '10px',
                        padding: '12px',
                        textAlign: 'center',
                        opacity: f.unlocked ? 1 : 0.45
                      }}
                    >
                      <div className={`avatar-frame-wrapper avatar-frame-${f.id}`} style={{ width: '40px', height: '40px', margin: '0 auto 8px' }}>
                        <span style={{ fontSize: '18px' }}>🐺</span>
                      </div>
                      <div style={{ fontSize: '11px', fontWeight: '700', color: '#fff' }}>{f.name}</div>
                      {f.unlocked ? (
                        f.isEquipped ? (
                          <span style={{ fontSize: '10px', color: '#22c55e', fontWeight: '800', marginTop: '6px', display: 'block' }}>
                            ÉQUIPÉ ✓
                          </span>
                        ) : (
                          <button
                            onClick={() => handleEquipFrame(f.id)}
                            style={{
                              marginTop: '6px',
                              padding: '3px 8px',
                              fontSize: '10px',
                              fontWeight: '700',
                              borderRadius: '6px',
                              background: 'rgba(255,255,255,0.1)',
                              border: '1px solid rgba(255,255,255,0.2)',
                              color: '#fff',
                              cursor: 'pointer'
                            }}
                          >
                            Équiper
                          </button>
                        )
                      ) : (
                        <span style={{ fontSize: '9px', color: '#64748b', marginTop: '6px', display: 'block' }}>
                          Verrouillé 🔒
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Vitrine de Badges */}
              <div className="dash-card">
                <div className="dash-card-header">
                  <span className="dash-card-title">Vitrine de Badges & Trophées</span>
                  <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: '700' }}>
                    {wolfProfile?.badges?.length || 1} Badges Débloqués
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                  {(wolfProfile?.badges?.length ? wolfProfile.badges : [
                    { id: 'welcome', title: 'Bienvenue dans la Meute', description: 'Membre officiel Dark Wolf Team.', icon: 'Award' }
                  ]).map((b, i) => (
                    <div
                      key={i}
                      style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '8px',
                        padding: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}
                    >
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Award size={16} color="#f59e0b" />
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: '#fff' }}>{b.title}</div>
                        <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>{b.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bouton d'édition du profil */}
              <button
                className="dash-bottom-action-btn"
                onClick={() => setShowEditProfileModal(true)}
              >
                Modifier mes Informations Personnelles
              </button>
            </>
          )}

          {/* =========================================================================
              VUE 2 : PRONOSTICS DE MATCHS (PREDICTIONS)
              ========================================================================= */}
          {activeNav === 'Pronostics' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="dash-card">
                <div className="dash-card-header">
                  <span className="dash-card-title">Pronostics des Matchs Officiels (100% Points)</span>
                  <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: '700' }}>
                    Gagnez jusqu'à +130 Points & XP par match !
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 16px', lineHeight: 1.5 }}>
                  Pronostiquez le vainqueur (+50 pts), le score exact (+50 pts) et le MVP (+30 pts). Aucun pari d'argent réel — 100% esport et gamification.
                </p>

                {upcomingMatchesList.length === 0 ? (
                  <div className="dash-empty-state">
                    Aucun match à venir actuellement. Revenez bientôt !
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {upcomingMatchesList.map((m) => {
                      const input = predictionInputs[m._id] || {
                        predictedWinner: 'DWT',
                        scoreDWT: 2,
                        scoreOpponent: 1,
                        predictedMVP: 'ShadowFang'
                      };
                      const isSubmitting = submittingPred[m._id];
                      const existingUserPred = myPredictions.find((p) => p.match?._id === m._id || p.match === m._id);

                      return (
                        <div
                          key={m._id}
                          style={{
                            background: 'rgba(255,255,255,0.02)',
                            border: existingUserPred ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '12px',
                            padding: '18px'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <span style={{ fontSize: '11px', fontWeight: '800', background: 'rgba(230,0,0,0.2)', color: '#ff4d4d', padding: '3px 8px', borderRadius: '8px', border: '1px solid rgba(230,0,0,0.4)' }}>
                              {m.game} • {m.tournamentName} ({m.format || 'BO3'})
                            </span>
                            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                              {new Date(m.matchDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          {/* Winner Pick */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '12px', alignItems: 'center', marginBottom: '14px' }}>
                            <button
                              type="button"
                              onClick={() => setPredictionInputs((prev) => ({ ...prev, [m._id]: { ...input, predictedWinner: 'DWT' } }))}
                              style={{
                                padding: '12px',
                                borderRadius: '8px',
                                background: input.predictedWinner === 'DWT' ? 'linear-gradient(135deg, rgba(230,0,0,0.3), rgba(0,0,0,0.5))' : 'rgba(255,255,255,0.02)',
                                border: input.predictedWinner === 'DWT' ? '2px solid #e60000' : '1px solid rgba(255,255,255,0.1)',
                                color: '#fff',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <img src="/logo-dwt.png" alt="DWT" style={{ width: '26px', height: '26px', objectFit: 'contain' }} />
                              <span style={{ fontWeight: '800', fontSize: '12px' }}>DARK WOLF TEAM</span>
                              {input.predictedWinner === 'DWT' && <span style={{ fontSize: '9px', color: '#ff4d4d', fontWeight: '800' }}>MON CHOIX ✓</span>}
                            </button>

                            <span style={{ fontFamily: '"Orbitron", monospace', fontWeight: '800', color: '#64748b' }}>VS</span>

                            <button
                              type="button"
                              onClick={() => setPredictionInputs((prev) => ({ ...prev, [m._id]: { ...input, predictedWinner: m.opponent } }))}
                              style={{
                                padding: '12px',
                                borderRadius: '8px',
                                background: input.predictedWinner === m.opponent ? 'linear-gradient(135deg, rgba(56,189,248,0.2), rgba(0,0,0,0.5))' : 'rgba(255,255,255,0.02)',
                                border: input.predictedWinner === m.opponent ? '2px solid #38bdf8' : '1px solid rgba(255,255,255,0.1)',
                                color: '#fff',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#1f2430', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '10px' }}>
                                {m.opponent.slice(0, 3).toUpperCase()}
                              </div>
                              <span style={{ fontWeight: '800', fontSize: '12px' }}>{m.opponent}</span>
                              {input.predictedWinner === m.opponent && <span style={{ fontSize: '9px', color: '#38bdf8', fontWeight: '800' }}>MON CHOIX ✓</span>}
                            </button>
                          </div>

                          {/* Score & MVP inputs */}
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
                            <div>
                              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: '700' }}>Score Prédit</label>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <input
                                  type="number"
                                  min="0"
                                  max="5"
                                  value={input.scoreDWT}
                                  onChange={(e) => setPredictionInputs((prev) => ({ ...prev, [m._id]: { ...input, scoreDWT: e.target.value } }))}
                                  style={{ width: '45px', padding: '5px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff', textAlign: 'center', fontWeight: '800' }}
                                />
                                <span style={{ color: '#64748b' }}>-</span>
                                <input
                                  type="number"
                                  min="0"
                                  max="5"
                                  value={input.scoreOpponent}
                                  onChange={(e) => setPredictionInputs((prev) => ({ ...prev, [m._id]: { ...input, scoreOpponent: e.target.value } }))}
                                  style={{ width: '45px', padding: '5px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff', textAlign: 'center', fontWeight: '800' }}
                                />
                              </div>
                            </div>

                            <div>
                              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: '700' }}>MVP Prédit (+30 pts)</label>
                              <select
                                value={input.predictedMVP}
                                onChange={(e) => setPredictionInputs((prev) => ({ ...prev, [m._id]: { ...input, predictedMVP: e.target.value } }))}
                                style={{ width: '100%', padding: '6px 10px', background: '#151a26', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: '#fff', fontSize: '12px' }}
                              >
                                {(rosterPlayers.filter((p) => p.game === m.game).length ? rosterPlayers.filter((p) => p.game === m.game) : rosterPlayers).map((p) => (
                                  <option key={p._id || p.gamertag} value={p.gamertag}>
                                    {p.gamertag} ({p.role || p.game})
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => handleSavePrediction(m._id)}
                              disabled={isSubmitting}
                              className="btn-rejoindre"
                              style={{ padding: '8px 18px', fontSize: '12px' }}
                            >
                              {isSubmitting ? 'Validation...' : existingUserPred ? 'Mettre à jour mon prono ✓' : 'Valider mon pronostic 🎯'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Mes Pronostics Récents */}
              {myPredictions.length > 0 && (
                <div className="dash-card">
                  <div className="dash-card-header">
                    <span className="dash-card-title">Mes Pronostics Passés ({myPredictions.length})</span>
                  </div>
                  <div className="dash-list-col">
                    {myPredictions.map((p, idx) => (
                      <div className="dash-list-item-row" key={p._id || idx}>
                        <div className="dash-item-left">
                          <div className="dash-wolf-badge-tiny">
                            <Target size={18} />
                          </div>
                          <div>
                            <div className="dash-item-title">
                              DWT vs {p.match?.opponent || 'Rival'} ({p.match?.game || 'Esport'})
                            </div>
                            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                              Choix : <strong>{p.predictedWinner}</strong> • Score : <strong>{p.predictedScore?.scoreDWT} - {p.predictedScore?.scoreOpponent}</strong> • MVP : <strong>{p.predictedMVP || 'N/A'}</strong>
                            </div>
                          </div>
                        </div>
                        <div>
                          {p.status === 'pending' && <span style={{ fontSize: '11px', color: '#eab308', fontWeight: '700' }}>⏳ En attente</span>}
                          {p.status === 'won' && <span style={{ fontSize: '11px', color: '#22c55e', fontWeight: '800' }}>🏆 Victoire (+{p.pointsEarned} pts)</span>}
                          {p.status === 'partial' && <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '800' }}>🎯 Partiel (+{p.pointsEarned} pts)</span>}
                          {p.status === 'lost' && <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: '700' }}>❌ Manqué (0 pt)</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              VUE 3 : CLASSEMENT DE LA SAISON (LEADERBOARD)
              ========================================================================= */}
          {activeNav === 'Classement' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="dash-card">
                <div className="dash-card-header">
                  <span className="dash-card-title">Classement de la Meute • Saison 2026</span>
                  <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: '800' }}>Podium des Fans d'Élite</span>
                </div>

                {/* Top 3 Podium */}
                {leaderboard.length >= 3 && (
                  <div style={{ display: 'flex', gap: '12px', margin: '14px 0 24px', alignItems: 'flex-end' }}>
                    {/* 2nd Place */}
                    <div className="wp-podium-card wp-podium-2nd">
                      <div style={{ position: 'absolute', top: '-10px', background: '#94a3b8', color: '#000', fontWeight: '900', padding: '2px 8px', borderRadius: '10px', fontSize: '10px' }}>
                        #2 ARGENT 🥈
                      </div>
                      <div className={`avatar-frame-wrapper avatar-frame-${leaderboard[1]?.avatarFrame || 'scout_silver'}`} style={{ width: '50px', height: '50px', marginTop: '8px' }}>
                        <span style={{ fontSize: '22px' }}>🐺</span>
                      </div>
                      <div style={{ fontWeight: '800', color: '#fff', fontSize: '13px', marginTop: '6px' }}>{leaderboard[1]?.gamertag}</div>
                      <span className={`rank-pill ${leaderboard[1]?.wolfRank || 'Hunter'}`} style={{ marginTop: '2px', fontSize: '9px' }}>
                        {leaderboard[1]?.wolfRank}
                      </span>
                      <div style={{ fontSize: '15px', fontWeight: '900', color: '#38bdf8', marginTop: '6px', fontFamily: '"Orbitron", monospace' }}>
                        {leaderboard[1]?.wolfPoints} pts
                      </div>
                    </div>

                    {/* 1st Place */}
                    <div className="wp-podium-card wp-podium-1st">
                      <div style={{ position: 'absolute', top: '-12px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000', fontWeight: '900', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Crown size={12} /> #1 OR 🥇
                      </div>
                      <div className={`avatar-frame-wrapper avatar-frame-${leaderboard[0]?.avatarFrame || 'alpha_fire'}`} style={{ width: '60px', height: '60px', marginTop: '8px' }}>
                        <span style={{ fontSize: '26px' }}>👑</span>
                      </div>
                      <div style={{ fontWeight: '900', color: '#fff', fontSize: '15px', marginTop: '6px' }}>{leaderboard[0]?.gamertag}</div>
                      <span className={`rank-pill ${leaderboard[0]?.wolfRank || 'Alpha'}`} style={{ marginTop: '2px', fontSize: '9px' }}>
                        {leaderboard[0]?.wolfRank}
                      </span>
                      <div style={{ fontSize: '18px', fontWeight: '900', color: '#f59e0b', marginTop: '6px', fontFamily: '"Orbitron", monospace' }}>
                        {leaderboard[0]?.wolfPoints} pts
                      </div>
                    </div>

                    {/* 3rd Place */}
                    <div className="wp-podium-card wp-podium-3rd">
                      <div style={{ position: 'absolute', top: '-10px', background: '#cd7f32', color: '#fff', fontWeight: '900', padding: '2px 8px', borderRadius: '10px', fontSize: '10px' }}>
                        #3 BRONZE 🥉
                      </div>
                      <div className={`avatar-frame-wrapper avatar-frame-${leaderboard[2]?.avatarFrame || 'cub_bronze'}`} style={{ width: '50px', height: '50px', marginTop: '8px' }}>
                        <span style={{ fontSize: '22px' }}>🐺</span>
                      </div>
                      <div style={{ fontWeight: '800', color: '#fff', fontSize: '13px', marginTop: '6px' }}>{leaderboard[2]?.gamertag}</div>
                      <span className={`rank-pill ${leaderboard[2]?.wolfRank || 'Scout'}`} style={{ marginTop: '2px', fontSize: '9px' }}>
                        {leaderboard[2]?.wolfRank}
                      </span>
                      <div style={{ fontSize: '15px', fontWeight: '900', color: '#cd7f32', marginTop: '6px', fontFamily: '"Orbitron", monospace' }}>
                        {leaderboard[2]?.wolfPoints} pts
                      </div>
                    </div>
                  </div>
                )}

                {/* Table */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '50px 1fr 120px 100px', padding: '10px 16px', background: 'rgba(255,255,255,0.04)', fontSize: '11px', color: '#94a3b8', fontWeight: '700' }}>
                    <span>#</span>
                    <span>JOUEUR</span>
                    <span>RANG</span>
                    <span style={{ textAlign: 'right' }}>POINTS</span>
                  </div>
                  {leaderboard.map((item, idx) => {
                    const isCurrentUser = user && (user._id === item.id || user.gamertag === item.gamertag);
                    return (
                      <div
                        key={item.id || idx}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '50px 1fr 120px 100px',
                          padding: '10px 16px',
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                          alignItems: 'center',
                          background: isCurrentUser ? 'rgba(230,0,0,0.1)' : 'transparent'
                        }}
                      >
                        <span style={{ fontFamily: '"Orbitron", monospace', color: idx < 3 ? '#f59e0b' : '#94a3b8', fontSize: '13px', fontWeight: '800' }}>
                          #{item.position || idx + 1}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>🐺</span>
                          <span style={{ color: '#fff', fontSize: '13px', fontWeight: isCurrentUser ? '800' : '500' }}>{item.gamertag}</span>
                          {isCurrentUser && <span style={{ fontSize: '9px', background: '#e60000', color: '#fff', padding: '1px 5px', borderRadius: '6px' }}>MOI</span>}
                        </div>
                        <div>
                          <span className={`rank-pill ${item.wolfRank}`} style={{ fontSize: '9px' }}>
                            {item.wolfRank}
                          </span>
                        </div>
                        <span style={{ textAlign: 'right', fontFamily: '"Orbitron", monospace', color: '#38bdf8', fontWeight: '800', fontSize: '13px' }}>
                          {item.wolfPoints} pts
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              VUE 4 : QUÊTES & MISSIONS HEBDOMADAIRES
              ========================================================================= */}
          {activeNav === 'Quêtes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="dash-card">
                <div className="dash-card-header">
                  <span className="dash-card-title">Quêtes Hebdomadaires de la Meute</span>
                  <span style={{ fontSize: '12px', color: '#38bdf8', fontWeight: '700' }}>
                    Reset chaque Lundi 00:00
                  </span>
                </div>

                {/* Progress bar */}
                <div style={{ margin: '10px 0 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', color: '#fff', marginBottom: '6px' }}>
                    <span>Progression : {missionsData?.completedCount || 0} / {missionsData?.totalMissions || 5} Quêtes Complétées</span>
                    <span style={{ color: '#38bdf8' }}>{missionsData?.progressPercent || 0}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${missionsData?.progressPercent || 0}%`, height: '100%', background: 'linear-gradient(90deg, #38bdf8, #22c55e)', borderRadius: '4px', transition: 'width 0.4s ease' }} />
                  </div>
                </div>

                {/* Super Weekly Bonus Banner */}
                <div
                  style={{
                    padding: '14px 18px',
                    borderRadius: '10px',
                    background: missionsData?.canClaimBonus ? 'linear-gradient(135deg, rgba(230,0,0,0.25), rgba(245,158,11,0.15))' : 'rgba(255,255,255,0.02)',
                    border: missionsData?.canClaimBonus ? '1px solid #e60000' : '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    flexWrap: 'wrap',
                    marginBottom: '18px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Crown size={22} color={missionsData?.bonusClaimed ? '#22c55e' : '#f59e0b'} />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '800', color: '#fff' }}>Bonus Alpha Hebdo (+100 XP & +100 Points)</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>Complétez toutes les 5 quêtes pour réclamer ce pack.</div>
                    </div>
                  </div>
                  {missionsData?.bonusClaimed ? (
                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#22c55e' }}>✓ Bonus Réclamé cette semaine</span>
                  ) : missionsData?.canClaimBonus ? (
                    <button className="btn-rejoindre" onClick={handleClaimWeeklyBonus}>
                      Réclamer le Bonus Alpha 🐺👑
                    </button>
                  ) : (
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>En cours de complétion</span>
                  )}
                </div>

                {/* Missions List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(missionsData?.missions || []).map((m) => (
                    <div key={m.code} className={`wp-mission-card ${m.isCompleted ? 'completed' : ''}`}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: m.isCompleted ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {m.isCompleted ? <Check size={18} color="#22c55e" /> : <Award size={18} color="#f59e0b" />}
                        </div>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '800', color: '#fff' }}>{m.title}</div>
                          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{m.description}</div>
                          <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                            <span style={{ fontSize: '10px', background: 'rgba(56,189,248,0.15)', color: '#38bdf8', padding: '1px 5px', borderRadius: '4px', fontWeight: '700' }}>
                              +{m.points} Points
                            </span>
                            <span style={{ fontSize: '10px', background: 'rgba(168,85,247,0.15)', color: '#c084fc', padding: '1px 5px', borderRadius: '4px', fontWeight: '700' }}>
                              +{m.xp} XP
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        {m.isCompleted ? (
                          <span style={{ fontSize: '11px', fontWeight: '800', color: '#22c55e' }}>Complétée ✓</span>
                        ) : (
                          <button
                            className="btn-mark-read"
                            onClick={() => handleCompleteMission(m.code, m.actionType)}
                            style={{ padding: '6px 12px', fontSize: '11px' }}
                          >
                            {m.actionType === 'predict_match' ? 'Pronostiquer →' : m.actionType === 'visit_shop' ? 'Boutique →' : 'Participer & Valider'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              VUE 5 : MES MATCHS & TOURNOIS
              ========================================================================= */}
          {activeNav === 'Mes Matchs' && (
            <div className="dash-card">
              <div className="dash-card-header">
                <span className="dash-card-title">Calendrier des Matchs Officiels ({matches.length})</span>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>DWT Esports Tournaments</span>
              </div>
              <div className="dash-list-col">
                {matches.length === 0 ? (
                  <div className="dash-empty-state">Aucun match disponible.</div>
                ) : (
                  matches.map((m) => (
                    <div className="dash-list-item-row" key={m._id}>
                      <div className="dash-item-left">
                        <div className="dash-wolf-badge-tiny">
                          <WolfLogo size={18} />
                        </div>
                        <div>
                          <div className="dash-item-title">{m.game} vs {m.opponent} ({m.format || 'BO3'})</div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>
                            Statut : <span style={{ color: m.status === 'live' ? '#ff3333' : '#fff', fontWeight: '700' }}>{m.status.toUpperCase()}</span> | {new Date(m.matchDate).toLocaleDateString('fr-FR')} {m.status === 'finished' && `• Score: ${m.scoreDWT} - ${m.scoreOpponent}`}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn-rejoindre"
                          style={{ padding: '6px 16px', fontSize: '13px' }}
                          onClick={() => handleJoinMatch(m)}
                        >
                          {m.status === 'live' ? 'Regarder 🔴' : 'Rejoindre'}
                        </button>
                        {m.status === 'upcoming' && (
                          <button
                            className="btn-mark-read"
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                            onClick={() => setActiveNav('Pronostics')}
                          >
                            🎯 Pronostiquer
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* =========================================================================
              VUE 6 : MA BOUTIQUE / MES COMMANDES
              ========================================================================= */}
          {activeNav === 'Ma Boutique' && (
            <div className="dash-card">
              <div className="dash-card-header">
                <span className="dash-card-title">Mes Commandes Boutique ({myOrders.length})</span>
                <button
                  className="btn-rejoindre"
                  style={{ padding: '6px 14px', fontSize: '12px' }}
                  onClick={() => {
                    if (onBackToSite) onBackToSite();
                    setTimeout(() => {
                      document.querySelector('#shop')?.scrollIntoView({ behavior: 'smooth' });
                    }, 200);
                  }}
                >
                  Visiter le Shop Dark Lab →
                </button>
              </div>
              <div className="dash-list-col">
                {myOrders.length === 0 ? (
                  <div className="dash-empty-state">
                    Vous n'avez pas encore passé de commande. Découvrez les équipements officiels sur la Boutique Dark Lab !
                  </div>
                ) : (
                  myOrders.map((ord) => (
                    <div className="dash-list-item-row" key={ord._id}>
                      <div className="dash-item-left">
                        <img src={ord.orderItems?.[0]?.image || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=200&q=80'} alt="" className="dash-avatar-tiny" />
                        <div>
                          <div className="dash-item-title">
                            {ord.orderItems?.[0]?.name} (Total: {ord.totalPrice} DT)
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>
                            Statut : <span style={{ color: 'var(--red-primary)', fontWeight: '700' }}>{ord.orderStatus}</span> • Date: {new Date(ord.createdAt).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>
                      <span className="inventory-badge-recu">
                        {ord.orderStatus === 'delivered' ? 'Livré ✓' : 'En cours 📦'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* =========================================================================
              VUE 7 : ACTUALITÉS
              ========================================================================= */}
          {activeNav === 'Actualités' && (
            <div className="dash-card">
              <div className="dash-card-header">
                <span className="dash-card-title">Toutes les Actualités de la Meute ({newsList.length})</span>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                  {newsList.filter((n) => !readNewsIds.includes(n._id)).length} non lues
                </span>
              </div>
              <div className="dash-list-col">
                {newsList.map((item) => (
                  <div className="dash-list-item-row" key={item._id}>
                    <div className="dash-item-left">
                      <div className="dash-wolf-badge-tiny">
                        <WolfLogo size={18} />
                      </div>
                      <div>
                        <div className="dash-item-title">{item.title}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                          Catégorie: {item.category || 'Esport'} | {item.createdAt ? new Date(item.createdAt).toLocaleDateString('fr-FR') : 'Récent'}
                        </div>
                      </div>
                    </div>
                    <button
                      className="btn-mark-read"
                      onClick={() => handleMarkAsRead(item._id)}
                    >
                      {readNewsIds.includes(item._id) ? 'Lu ✓' : 'Marquer comme lu →'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              VUE 8 : MESSAGERIE STAFF (DIRECT CHAT AVEC L'ADMIN)
              ========================================================================= */}
          {activeNav === 'Messagerie Staff' && (
            <div className="chat-container">
              {/* Colonne de Gauche : Support & Staff DWT */}
              <div className="chat-user-list">
                <div className="chat-user-header">
                  <div className="chat-user-title">
                    <span>🐺 Direction Staff DWT</span>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '11px',
                      color: '#10b981',
                      fontWeight: '700',
                      textTransform: 'none'
                    }}>
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                      En ligne
                    </span>
                  </div>
                </div>

                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
                  {/* Contact Staff Actif */}
                  <div style={{
                    background: 'rgba(204, 34, 34, 0.1)',
                    border: '1px solid rgba(204, 34, 34, 0.35)',
                    borderRadius: '10px',
                    padding: '14px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="dash-wolf-badge-tiny" style={{ background: '#0a0d16', border: '1px solid #e60000', width: '38px', height: '38px' }}>
                        <WolfLogo size={22} />
                      </div>
                      <div>
                        <div style={{ fontWeight: '800', color: '#fff', fontSize: '14px' }}>
                          Administration DWT
                        </div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                          Coaching, scrims & contrats
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Directives & Raccourcis */}
                  <div style={{
                    background: '#0a0d16',
                    border: '1px solid #181f30',
                    borderRadius: '10px',
                    padding: '14px',
                    fontSize: '12px',
                    color: '#94a3b8'
                  }}>
                    <div style={{ fontWeight: '700', color: '#fff', marginBottom: '8px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      🎯 Sujets de Discussion
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <li>Horaires & plannings des entraînements</li>
                      <li>Organisation des scrims officiels</li>
                      <li>Équipements, jerseys & dotations</li>
                      <li>Demandes administratives & absences</li>
                    </ul>
                  </div>

                  <div style={{
                    marginTop: 'auto',
                    padding: '12px',
                    background: '#070910',
                    border: '1px solid #141926',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#64748b',
                    textAlign: 'center'
                  }}>
                    🔒 Canal officiel sécurisé Dark Wolf Team
                  </div>
                </div>
              </div>

              {/* Colonne de Droite : Fenêtre de Discussion */}
              <div className="chat-window">
                <div className="chat-window-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="dash-wolf-badge-tiny">
                      <WolfLogo size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '800', color: '#fff', fontSize: '15px' }}>
                        Messagerie Directe avec l'Administration DWT
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                        Réponses en temps réel par les managers et le head coach
                      </div>
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    color: '#10b981',
                    fontWeight: '700',
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    padding: '4px 10px',
                    borderRadius: '12px'
                  }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                    Staff Actif
                  </div>
                </div>

                <div className="chat-messages-scroll wp-scrollbar" ref={playerChatScrollRef}>
                  {chatMessages.length === 0 ? (
                    <div className="dash-empty-state" style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                      <WolfLogo size={42} />
                      <div style={{ marginTop: '14px', fontWeight: '800', color: '#fff', fontSize: '16px' }}>
                        Bienvenue dans ton canal de discussion officiel ! 🐺💬
                      </div>
                      <div style={{ marginTop: '6px', fontSize: '13px', color: '#94a3b8', maxWidth: '440px' }}>
                        Cet espace privé te relie directement au staff et aux coachs Dark Wolf Team. Pose toutes tes questions ci-dessous.
                      </div>
                    </div>
                  ) : (
                    chatMessages.map((msg) => {
                      const isMine = msg.sender?._id === user?._id || msg.sender === user?._id;
                      return (
                        <div key={msg._id} className={`chat-bubble ${isMine ? 'mine' : 'theirs'}`}>
                          <div className="chat-bubble-name">
                            {isMine ? (user?.gamertag || 'Moi') : 'Staff DWT (Admin)'}
                          </div>
                          <div className="chat-bubble-content">{msg.content}</div>
                          <div className="chat-bubble-time">
                            {new Date(msg.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Suggestions de questions rapides */}
                <div className="chat-quick-prompts">
                  <button
                    type="button"
                    className="chat-prompt-pill"
                    onClick={() => setChatInput('Bonjour, quand a lieu la prochaine session de scrims ? 🐺')}
                  >
                    ⏰ Horaires des scrims
                  </button>
                  <button
                    type="button"
                    className="chat-prompt-pill"
                    onClick={() => setChatInput('Bonjour, pouvez-vous me donner des nouvelles de ma commande de maillot ? 👕')}
                  >
                    👕 Info maillot / boutique
                  </button>
                  <button
                    type="button"
                    className="chat-prompt-pill"
                    onClick={() => setChatInput('Je confirme ma disponibilité pour le prochain tournoi ! 🏆')}
                  >
                    🏆 Confirmation tournoi
                  </button>
                </div>

                <form className="chat-input-bar" onSubmit={handleSendPlayerMessage}>
                  <input
                    type="text"
                    className="chat-input-field"
                    placeholder="Écrire un message à la direction Dark Wolf Team..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                  />
                  <button type="submit" className="chat-send-btn" disabled={sendingMsg || !chatInput.trim()}>
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL : EDITER LE PROFIL JOUEUR */}
      {showEditProfileModal && (
        <div className="dash-modal-backdrop">
          <div className="dash-modal-box">
            <h3 className="dash-modal-title">Modifier Mon Profil</h3>
            <form onSubmit={handleUpdateProfile}>
              <div className="dash-form-group">
                <label className="dash-form-label">Gamertag (Pseudo)</label>
                <input
                  type="text"
                  className="dash-form-input"
                  value={profileFormData.gamertag}
                  onChange={(e) => setProfileFormData({ ...profileFormData, gamertag: e.target.value })}
                  required
                />
              </div>

              <div className="dash-form-group">
                <label className="dash-form-label">Jeu favori</label>
                <input
                  type="text"
                  className="dash-form-input"
                  value={profileFormData.favoriteGame}
                  onChange={(e) => setProfileFormData({ ...profileFormData, favoriteGame: e.target.value })}
                />
              </div>

              <div className="dash-form-group">
                <label className="dash-form-label">Bio / Présentation</label>
                <textarea
                  rows={3}
                  className="dash-form-textarea"
                  value={profileFormData.bio}
                  onChange={(e) => setProfileFormData({ ...profileFormData, bio: e.target.value })}
                />
              </div>

              <div className="dash-modal-btn-row">
                <button type="button" className="btn-dash-approve" onClick={() => setShowEditProfileModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn-dash-reject">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerDashboardPage;
