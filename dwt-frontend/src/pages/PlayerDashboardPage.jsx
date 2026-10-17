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
  Send
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { WolfLogo } from '../components/WolfLogo';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

const PlayerDashboardPage = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('Mon Profil');
  const [loading, setLoading] = useState(true);

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

  // Chargement réel depuis l'API MongoDB
  const fetchPlayerData = async () => {
    setLoading(true);
    try {
      const [ordersRes, matchesRes, newsRes, convsRes] = await Promise.all([
        API.get('/orders/my-orders').catch(() => ({ data: { orders: [] } })),
        API.get('/matches').catch(() => ({ data: { matches: [] } })),
        API.get('/news').catch(() => ({ data: { articles: [] } })),
        API.get('/messages/conversations').catch(() => ({ data: { conversations: [] } }))
      ]);

      setMyOrders(ordersRes.data?.orders || []);
      setMatches(matchesRes.data?.matches || []);
      setNewsList(newsRes.data?.articles || []);

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

  // Charger messages avec admin
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
    const interval = setInterval(fetchChat, 5000);
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
        setChatMessages(prev => [...prev, res.data.message]);
        setChatInput('');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de l\'envoi du message au staff');
    } finally {
      setSendingMsg(false);
    }
  };

  // Sauvegarde des articles lus dans localStorage
  const handleMarkAsRead = (id) => {
    const updated = [...readNewsIds, id];
    setReadNewsIds(updated);
    localStorage.setItem('dwt_read_news', JSON.stringify(updated));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Rejoindre un match réel
  const handleJoinMatch = (match) => {
    if (match.streamUrl) {
      window.open(match.streamUrl, '_blank');
    } else {
      alert(`Salle de match pour ${match.game} vs ${match.opponent} rejointe avec succès ! Prépare tes armes 🐺🎮`);
    }
  };

  // Mettre à jour le profil réel
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put('/auth/profile', profileFormData);
      if (res.data?.success) {
        updateUser(res.data.user);
        alert('Profil mis à jour avec succès !');
        setShowEditProfileModal(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de la mise à jour du profil');
    }
  };

  // Action réelle : Défi Quotidien (sauvegarde en localStorage)
  const handleDailyQuest = () => {
    const today = new Date().toDateString();
    const lastClaim = localStorage.getItem('dwt_daily_quest_claim');
    if (lastClaim === today) {
      alert('Tu as déjà validé ton défi quotidien pour aujourd\'hui ! Reviens demain pour +50 XP 🐺');
    } else {
      localStorage.setItem('dwt_daily_quest_claim', today);
      alert('🎉 Défi Quotidien complété ! +50 XP et badge "Loup Guerrier" attribués à ton profil.');
    }
  };

  // Prochain match prioritaire
  const upcomingMatch = matches.find(m => m.status === 'live') || matches.find(m => m.status === 'upcoming') || matches[0];

  // Dernier article commandé dans l'inventaire réel
  const latestOrderItem = myOrders[0]?.orderItems?.[0];

  const sidebarLinks = [
    { label: 'Mon Profil', icon: <User size={18} /> },
    { label: 'Messagerie Staff', icon: <MessageSquare size={18} /> },
    { label: 'Mes Matchs', icon: <Trophy size={18} /> },
    { label: 'Ma Boutique', icon: <ShoppingBag size={18} /> },
    { label: 'Actualités', icon: <FileText size={18} /> },
  ];

  return (
    <div className="dashboard-page-bg">
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
            </button>
          ))}

          <button
            className="dash-nav-item"
            onClick={handleLogout}
            style={{ marginTop: '12px', color: '#64748b' }}
          >
            <LogOut size={18} />
            <span>Déconnexion</span>
          </button>
        </aside>

        {/* Right Main Pane */}
        <main className="dash-main-pane">
          {/* Header Title Row */}
          <div className="dash-title-row">
            <h1 className="dash-page-title">
              ESPACE <span className="red-glow-txt">JOUEUR</span>
            </h1>
            <div 
              className="dash-bell-notify" 
              title="Notifications"
              onClick={() => alert(`Tu as ${newsList.length - readNewsIds.length} actualité(s) non lue(s) et ${matches.filter(m => m.status === 'upcoming').length} match(s) à venir.`)}
            >
              <Bell size={18} />
              {(newsList.length - readNewsIds.length > 0) && <span className="dash-bell-dot"></span>}
            </div>
          </div>

          {/* Player Welcome Hero Banner */}
          <div className="player-hero-banner">
            <div className="player-avatar-large-wrap" onClick={() => setShowEditProfileModal(true)} style={{ cursor: 'pointer' }} title="Modifier mon profil">
              <img 
                src={user?.avatar || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=250&q=80'} 
                alt={user?.gamertag || 'Joueur'} 
              />
            </div>
            <div className="player-greeting-col">
              <h2>
                Bienvenue, <span className="gamertag-red">{user?.gamertag || 'DUBBY'}</span>
              </h2>
              <div className="player-role-label">
                Rôle : {user?.role === 'admin' ? 'Leader CS2 & Staff' : (user?.role === 'player' ? 'Joueur Officiel' : 'Membre')} ({user?.favoriteGame || 'CS2'})
              </div>
            </div>
          </div>

          {/* VUE 1 : MON PROFIL (MAQUETTE PRINCIPALE) */}
          {activeNav === 'Mon Profil' && (
            <>
              {/* Prochains Matchs Card */}
              <div className="dash-card">
                <div className="dash-card-header">
                  <span className="dash-card-title">Prochains Matchs</span>
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
                          {upcomingMatch.game} vs {upcomingMatch.opponent}
                        </div>
                        <div style={{ width: '60px', height: '3px', background: 'var(--red-primary)', borderRadius: '2px', marginTop: '6px' }}></div>
                      </div>
                    </div>
                    <button 
                      className="btn-rejoindre"
                      onClick={() => handleJoinMatch(upcomingMatch)}
                    >
                      Rejoindre
                    </button>
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
                    <span className="dash-card-title">Mes Stats</span>
                    <Eye size={16} color="#64748b" style={{ cursor: 'pointer' }} onClick={() => setShowEditProfileModal(true)} />
                  </div>
                  <div className="player-stats-list">
                    <div>K/D Ratio : <span className="val-red">1.45</span></div>
                    <div>Victoires : <span className="val-red">68%</span></div>
                    <div>Classement : <span className="val-red">Master</span></div>
                  </div>
                </div>

                {/* Mon Inventaire */}
                <div className="dash-card">
                  <div className="dash-card-header">
                    <span className="dash-card-title">Mon Inventaire</span>
                    <span className="inventory-badge-recu">
                      {latestOrderItem ? 'Reçu' : 'Catalogue'}
                    </span>
                  </div>
                  <div className="inventory-item-preview">
                    <div className="inventory-img-box">
                      <img 
                        src={latestOrderItem?.image || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=200&q=80'} 
                        alt="Hoodie DWT" 
                      />
                    </div>
                    <div className="inventory-item-info">
                      <span className="inventory-item-name">{latestOrderItem?.name || 'Hoodie DWT'}</span>
                      <span className="inventory-item-tag">
                        <Star size={12} fill="var(--red-primary)" color="var(--red-primary)" /> {latestOrderItem ? 'Reçu' : '★ Officiel'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dernières Actualités */}
              <div className="dash-card">
                <div className="dash-card-header">
                  <span className="dash-card-title">Dernières Actualités</span>
                  <span className="dash-status-dot-count">
                    {newsList.filter(n => !readNewsIds.includes(n._id)).length}
                  </span>
                </div>
                <div className="dash-list-col">
                  {newsList.length === 0 ? (
                    <div className="dash-empty-state">Aucune actualité disponible.</div>
                  ) : (
                    newsList.slice(0, 3).map((item) => {
                      const isRead = readNewsIds.includes(item._id);
                      const articleLink = `/actualites/${item.slug || item._id}`;
                      return (
                        <div className="news-mini-item" key={item._id}>
                          <Link to={articleLink} style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, textDecoration: 'none' }}>
                            <div className="dash-wolf-badge-tiny">
                              <WolfLogo size={18} />
                            </div>
                            <span style={{ fontSize: '14px', fontWeight: '600', color: isRead ? '#94a3b8' : '#ffffff', transition: 'color 0.2s' }}>
                              {item.title}
                            </span>
                          </Link>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Link to={articleLink} className="btn-mark-read" style={{ textDecoration: 'none' }}>
                              Lire
                            </Link>
                            <button 
                              className="btn-mark-read"
                              onClick={() => handleMarkAsRead(item._id)}
                              style={{ opacity: isRead ? 0.4 : 1 }}
                            >
                              {isRead ? 'Lu' : 'Marquer comme lu'} <ArrowRight size={13} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Action Button: Défis Quotidien */}
              <button 
                className="dash-bottom-action-btn"
                onClick={handleDailyQuest}
              >
                Défis Quotidien
              </button>
            </>
          )}

          {/* VUE 2 : MES MATCHS */}
          {activeNav === 'Mes Matchs' && (
            <div className="dash-card">
              <div className="dash-card-header">
                <span className="dash-card-title">Calendrier des Matchs ({matches.length})</span>
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
                          <div className="dash-item-title">{m.game} vs {m.opponent}</div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>
                            Statut : <span style={{ color: m.status === 'live' ? '#ff3333' : '#fff' }}>{m.status.toUpperCase()}</span> | {new Date(m.matchDate).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>
                      <button 
                        className="btn-rejoindre" 
                        style={{ padding: '6px 16px', fontSize: '13px' }}
                        onClick={() => handleJoinMatch(m)}
                      >
                        Rejoindre
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* VUE 3 : MA BOUTIQUE / MES COMMANDES */}
          {activeNav === 'Ma Boutique' && (
            <div className="dash-card">
              <div className="dash-card-header">
                <span className="dash-card-title">Mes Commandes Boutique ({myOrders.length})</span>
              </div>
              <div className="dash-list-col">
                {myOrders.length === 0 ? (
                  <div className="dash-empty-state">
                    Vous n'avez pas encore passé de commande. Rendez-vous sur la <a href="/#boutique" style={{ color: 'var(--red-primary)' }}>Boutique Officielle</a> !
                  </div>
                ) : (
                  myOrders.map((ord) => (
                    <div className="dash-list-item-row" key={ord._id}>
                      <div className="dash-item-left">
                        <img src={ord.orderItems?.[0]?.image} alt="" className="dash-avatar-tiny" />
                        <div>
                          <div className="dash-item-title">
                            {ord.orderItems?.[0]?.name} (Total: {ord.totalPrice} DT)
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>
                            Statut : <span style={{ color: 'var(--red-primary)' }}>{ord.orderStatus}</span>
                          </div>
                        </div>
                      </div>
                      <span className="inventory-badge-recu">
                        {ord.orderStatus === 'delivered' ? 'Livré' : 'En cours'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* VUE 4 : ACTUALITES */}
          {activeNav === 'Actualités' && (
            <div className="dash-card">
              <div className="dash-card-header">
                <span className="dash-card-title">Toutes les Actualités de la Meute</span>
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
                          Catégorie: {item.category} | {item.createdAt ? new Date(item.createdAt).toLocaleDateString('fr-FR') : 'Récent'}
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

          {/* VUE 5 : MESSAGERIE STAFF */}
          {activeNav === 'Messagerie Staff' && (
            <div className="dash-card" style={{ padding: '0', overflow: 'hidden' }}>
              <div className="chat-window" style={{ height: '540px' }}>
                <div className="chat-window-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="dash-wolf-badge-tiny">
                      <WolfLogo size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '800', color: '#fff', fontSize: '15px' }}>
                        Messagerie Directe avec l'Administration Dark Wolf Team
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                        Pose tes questions sur les scrims, matériels ou boutique • Réponses de l'Admin en temps réel
                      </div>
                    </div>
                  </div>
                </div>

                <div className="chat-messages-scroll" ref={playerChatScrollRef}>
                  {chatMessages.length === 0 ? (
                    <div className="dash-empty-state" style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                      <WolfLogo size={36} />
                      <div style={{ marginTop: '12px', fontWeight: '700', color: '#fff' }}>
                        Bienvenue dans ton canal de discussion officiel ! 🐺💬
                      </div>
                      <div style={{ marginTop: '6px', fontSize: '13px' }}>
                        Envoie un message ci-dessous à l'administrateur de la Dark Wolf Team.
                      </div>
                    </div>
                  ) : (
                    chatMessages.map(msg => {
                      const isMine = msg.sender?._id === user?._id;
                      return (
                        <div key={msg._id} className={`chat-bubble ${isMine ? 'mine' : 'theirs'}`}>
                          <div style={{ fontSize: '11px', opacity: 0.8, marginBottom: '2px', fontWeight: '700' }}>
                            {isMine ? (user?.gamertag || 'Moi') : 'Staff DWT (Admin)'}
                          </div>
                          <div>{msg.content}</div>
                          <div style={{ fontSize: '10px', opacity: 0.6, marginTop: '4px', textAlign: 'right' }}>
                            {new Date(msg.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <form className="chat-input-bar" onSubmit={handleSendPlayerMessage}>
                  <input 
                    type="text"
                    className="chat-input-field"
                    placeholder="Écrire un message à l'administrateur..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                  />
                  <button type="submit" className="chat-send-btn" disabled={sendingMsg}>
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
