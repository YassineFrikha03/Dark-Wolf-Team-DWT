import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Trophy, 
  ShoppingBag, 
  FileText, 
  Settings, 
  Shield, 
  Eye, 
  MoreVertical, 
  Share2,
  Check,
  X,
  Plus,
  RefreshCw,
  Trash2,
  Bell,
  MessageSquare,
  DollarSign,
  TrendingUp,
  Package,
  Layers,
  AlertTriangle,
  Edit3,
  Send,
  UserCheck,
  Calendar,
  Search,
  CheckCircle2,
  ExternalLink,
  Upload,
  Image as ImageIcon,
  Mail,
  Reply,
  CheckCheck,
  Inbox
} from 'lucide-react';
import { WolfLogo } from '../components/WolfLogo';
import API from '../services/api';
import { getImageUrl } from '../utils/imageUrl';

const AdminDashboardPage = () => {
  const [activeNav, setActiveNav] = useState('Tableau de Bord');
  const [shopSubTab, setShopSubTab] = useState('revenue'); // revenue, products, stocks, categories, orders
  const [loading, setLoading] = useState(true);
  
  // Données réelles MongoDB
  const [stats, setStats] = useState({
    followers: 122,
    members: 0,
    games: 0
  });

  const [matches, setMatches] = useState([]);
  const [storeOrders, setStoreOrders] = useState([]);
  const [recruitmentList, setRecruitmentList] = useState([]);
  const [playersList, setPlayersList] = useState([]);
  const [allUsersList, setAllUsersList] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [revenueStats, setRevenueStats] = useState(null);

  // Messages de contact (page /contact)
  const [contactMessages, setContactMessages] = useState([]);
  const [contactUnreadCount, setContactUnreadCount] = useState(0);
  const [msgSubTab, setMsgSubTab] = useState('chat'); // 'chat', 'contact', 'candidatures'
  const [playerSubTab, setPlayerSubTab] = useState('roster'); // 'roster' ou 'candidatures'
  const [selectedContact, setSelectedContact] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyEmailText, setReplyEmailText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const [showNotifPopup, setShowNotifPopup] = useState(false);

  // Messagerie Admin <-> Joueurs
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);
  const chatScrollRef = useRef(null);

  // Modals Produits
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productFormData, setProductFormData] = useState({
    name: '',
    category: 'Maillots',
    price: '',
    comparePrice: '',
    stockCount: 20,
    sizes: ['S', 'M', 'L', 'XL'],
    description: '',
    image: '',
    isFeatured: true
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Modal Catégorie
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: ''
  });

  // Modals Actualités, Joueur, Match
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [newsFormData, setNewsFormData] = useState({
    title: '',
    category: 'Annonce',
    game: 'Général',
    summary: '',
    content: '',
    coverImage: ''
  });
  const [uploadingNewsImage, setUploadingNewsImage] = useState(false);
  const [newsUploadError, setNewsUploadError] = useState('');
  const [isNewsDragOver, setIsNewsDragOver] = useState(false);
  const newsFileInputRef = useRef(null);
  const [newsSubmitting, setNewsSubmitting] = useState(false);

  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [playerFormData, setPlayerFormData] = useState({
    gamertag: '',
    realName: '',
    game: 'Valorant',
    role: 'Dueliste',
    rank: 'Radiant',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=400&q=80'
  });

  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchFormData, setMatchFormData] = useState({
    game: 'CS2',
    opponent: 'Tunisia Esports',
    matchDate: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    format: 'BO3',
    status: 'upcoming'
  });

  // Récupération complète des données de l'API
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [
        statsRes, 
        matchesRes, 
        ordersRes, 
        appsRes, 
        playersRes, 
        newsRes, 
        productsRes, 
        categoriesRes,
        revenueRes,
        notifRes,
        convsRes,
        contactRes
      ] = await Promise.all([
        API.get('/stats/overview').catch(() => ({ data: { stats: {} } })),
        API.get('/matches').catch(() => ({ data: { matches: [] } })),
        API.get('/orders').catch(() => ({ data: { orders: [] } })),
        API.get('/applications').catch(() => ({ data: { applications: [] } })),
        API.get('/players').catch(() => ({ data: { players: [] } })),
        API.get('/news').catch(() => ({ data: { articles: [] } })),
        API.get('/products').catch(() => ({ data: { products: [] } })),
        API.get('/categories').catch(() => ({ data: { categories: [] } })),
        API.get('/orders/revenue-stats').catch(() => ({ data: { stats: null } })),
        API.get('/notifications').catch(() => ({ data: { notifications: [], unreadCount: 0 } })),
        API.get('/messages/conversations').catch(() => ({ data: { conversations: [] } })),
        API.get('/contact').catch(() => ({ data: { messages: [], unreadCount: 0 } }))
      ]);

      const st = statsRes.data?.stats || {};
      const pls = playersRes.data?.players || [];
      const distinctGamesCount = st.gamesCount || (new Set(pls.map(p => p.game)).size) || 3;

      setStats({
        followers: 122 + (st.communityMembersCount || 0),
        members: pls.length || st.totalPlayers || 0,
        games: distinctGamesCount
      });

      setMatches(matchesRes.data?.matches || []);
      setStoreOrders(ordersRes.data?.orders || []);
      setRecruitmentList(appsRes.data?.applications || []);
      setPlayersList(pls);
      setNewsList(newsRes.data?.articles || []);
      setProductsList(productsRes.data?.products || []);
      setCategoriesList(categoriesRes.data?.categories || []);
      setRevenueStats(revenueRes.data?.stats || null);
      setNotifications(notifRes.data?.notifications || []);
      setUnreadNotifCount(notifRes.data?.unreadCount || 0);
      setConversations(convsRes.data?.conversations || []);
      setContactMessages(contactRes.data?.messages || []);
      setContactUnreadCount(contactRes.data?.unreadCount || 0);

      // Si aucune conversation sélectionnée, présélectionner la première
      if (convsRes.data?.conversations?.length > 0 && !selectedUser) {
        setSelectedUser(convsRes.data.conversations[0].user);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    // Polling doux pour notifications, candidatures et messages toutes les 10 secondes
    const interval = setInterval(() => {
      Promise.all([
        API.get('/notifications').catch(() => null),
        API.get('/applications').catch(() => null),
        API.get('/contact').catch(() => null)
      ]).then(([notifRes, appsRes, contactRes]) => {
        if (notifRes?.data?.success) {
          setNotifications(notifRes.data.notifications || []);
          setUnreadNotifCount(notifRes.data.unreadCount || 0);
        }
        if (appsRes?.data?.success) {
          setRecruitmentList(appsRes.data.applications || []);
        }
        if (contactRes?.data?.success) {
          setContactMessages(contactRes.data.messages || []);
          setContactUnreadCount(contactRes.data.unreadCount || 0);
        }
      }).catch(() => {});
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Charger les messages quand un utilisateur est sélectionné
  useEffect(() => {
    if (!selectedUser?._id) return;
    const fetchChat = async () => {
      try {
        const res = await API.get(`/messages/conversation/${selectedUser._id}`);
        if (res.data?.success) {
          setChatMessages(res.data.messages || []);
          // Marquer comme lu dans la liste locale des conversations
          setConversations(prev => prev.map(c => c.user._id === selectedUser._id ? { ...c, unreadCount: 0 } : c));
        }
      } catch (err) {
        console.error('Erreur fetch messages:', err);
      }
    };
    fetchChat();
    const chatInterval = setInterval(fetchChat, 5000);
    return () => clearInterval(chatInterval);
  }, [selectedUser]);

  // Scroll automatique du chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Envoyer un message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedUser?._id || sendingMsg) return;
    setSendingMsg(true);
    try {
      const res = await API.post('/messages', {
        receiverId: selectedUser._id,
        content: chatInput.trim()
      });
      if (res.data?.success) {
        setChatMessages(prev => [...prev, res.data.message]);
        setChatInput('');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de l\'envoi du message');
    } finally {
      setSendingMsg(false);
    }
  };

  // Marquer toutes les notifications comme lues
  const handleMarkAllNotifsRead = async () => {
    try {
      await API.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadNotifCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  // --- ACTIONS PRODUITS & BOUTIQUE ---
  const handleUploadImageFile = async (file) => {
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      setUploadError('Fichier trop volumineux. Taille maximale : 15 Mo.');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setUploadError('Format non supporté. Veuillez choisir une image (JPG, PNG, WebP, etc.).');
      return;
    }

    setUploadingImage(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await API.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data?.success && res.data.file) {
        setProductFormData(prev => ({
          ...prev,
          image: res.data.file.path || res.data.file.url
        }));
      }
    } catch (err) {
      console.error('Erreur upload:', err);
      setUploadError(err.response?.data?.message || 'Erreur lors du téléversement de la photo');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleToggleSize = (size) => {
    setProductFormData(prev => {
      const current = Array.isArray(prev.sizes) ? prev.sizes : [];
      const exists = current.includes(size);
      const next = exists ? current.filter(s => s !== size) : [...current, size];
      return { ...prev, sizes: next };
    });
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productFormData.image) {
      alert('Veuillez téléverser une photo pour le produit depuis votre PC avant d\'enregistrer 📷');
      return;
    }
    try {
      const payload = {
        name: productFormData.name,
        category: productFormData.category,
        price: Number(productFormData.price),
        comparePrice: productFormData.comparePrice ? Number(productFormData.comparePrice) : 0,
        stockCount: Number(productFormData.stockCount),
        inStock: Number(productFormData.stockCount) > 0,
        sizes: Array.isArray(productFormData.sizes) && productFormData.sizes.length > 0
          ? productFormData.sizes
          : ['Unique'],
        description: productFormData.description,
        images: [productFormData.image],
        isFeatured: productFormData.isFeatured
      };

      if (editingProduct) {
        await API.put(`/products/${editingProduct._id}`, payload);
        alert('Produit mis à jour avec succès ! 🛍️');
      } else {
        await API.post('/products', payload);
        alert('Produit ajouté à la boutique avec succès ! 🐺🛍️');
      }

      setShowProductModal(false);
      setEditingProduct(null);
      fetchAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de la sauvegarde du produit');
    }
  };

  const handleDeleteProduct = async (prodId, prodName) => {
    if (!window.confirm(`Supprimer le produit "${prodName}" de la boutique ?`)) return;
    try {
      await API.delete(`/products/${prodId}`);
      setProductsList(prev => prev.filter(p => p._id !== prodId));
      alert('Produit supprimé.');
      fetchAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const handleUpdateStockDelta = async (prodId, delta) => {
    try {
      const res = await API.patch(`/products/${prodId}/stock`, { delta });
      if (res.data?.success) {
        setProductsList(prev => prev.map(p => p._id === prodId ? res.data.product : p));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de l\'ajustement du stock');
    }
  };

  // --- ACTIONS CATEGORIES ---
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await API.post('/categories', categoryFormData);
      alert('Catégorie ajoutée avec succès !');
      setShowCategoryModal(false);
      setCategoryFormData({ name: '', description: '' });
      fetchAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de la création de la catégorie');
    }
  };

  const handleDeleteCategory = async (catId, catName) => {
    if (!window.confirm(`Supprimer la catégorie "${catName}" ? Les produits associés seront réassignés.`)) return;
    try {
      await API.delete(`/categories/${catId}`);
      alert('Catégorie supprimée.');
      fetchAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de la suppression de la catégorie');
    }
  };

  // Actions Matchs, Actualités & Recrutement
  const handleApproveMatch = async (id) => {
    try {
      await API.put(`/matches/${id}`, { status: 'live' });
      setMatches(prev => prev.map(m => m._id === id ? { ...m, status: 'live' } : m));
      alert('Match approuvé et passé en statut LIVE ! ⚔️');
    } catch (err) {
      alert('Erreur lors de la mise à jour du match');
    }
  };

  const handleRejectMatch = async (id) => {
    if (!window.confirm('Voulez-vous rejeter et supprimer ce match ?')) return;
    try {
      await API.delete(`/matches/${id}`);
      setMatches(prev => prev.filter(m => m._id !== id));
      alert('Match rejeté et retiré.');
    } catch (err) {
      alert('Erreur lors du rejet du match');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      setStoreOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
      alert(`Commande mise à jour en statut : ${newStatus}`);
      fetchAllData();
    } catch (err) {
      alert('Erreur lors de la mise à jour de la commande');
    }
  };

  const handleUpdateAppStatus = async (appId, newStatus) => {
    try {
      const res = await API.put(`/applications/${appId}/status`, { status: newStatus });
      setRecruitmentList(prev => prev.map(a => a._id === appId ? { ...a, status: newStatus } : a));
      if (newStatus === 'accepted') {
        alert(res.data?.message || 'Candidature acceptée ! Le joueur a été ajouté au roster officiel et son espace de communication est actif. 🐺🎮');
      } else {
        alert(`Candidature mise à jour (${newStatus}).`);
      }
      fetchAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de la mise à jour de la candidature');
    }
  };

  // --- ACTIONS MESSAGES DE CONTACT ---
  const handleSendContactReply = async (e) => {
    e.preventDefault();
    if (!replyEmailText.trim() || !selectedContact?._id || sendingReply) return;
    setSendingReply(true);
    try {
      await API.put(`/contact/${selectedContact._id}`, {
        replyEmailBody: replyEmailText.trim(),
        status: 'replied'
      });
      alert(`Réponse par email envoyée avec succès à ${selectedContact.email} ! 🐺✉️`);
      setShowReplyModal(false);
      setReplyEmailText('');
      setSelectedContact(null);
      fetchAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de l\'envoi de la réponse par email');
    } finally {
      setSendingReply(false);
    }
  };

  const handleToggleContactStatus = async (contactId, currentStatus) => {
    const nextStatus = currentStatus === 'unread' ? 'read' : 'unread';
    try {
      await API.put(`/contact/${contactId}`, { status: nextStatus });
      setContactMessages(prev => prev.map(m => m._id === contactId ? { ...m, status: nextStatus } : m));
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce message de contact ?')) return;
    try {
      await API.delete(`/contact/${contactId}`);
      setContactMessages(prev => prev.filter(m => m._id !== contactId));
      fetchAllData();
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  // Démarrer une conversation chat avec un joueur ou candidat
  const handleStartChatWithPlayer = (player) => {
    const matchingConv = conversations.find(c => 
      c.user?.gamertag?.toLowerCase() === player.gamertag?.toLowerCase() ||
      c.user?._id === player.user ||
      c.user?._id === player._id
    );

    if (matchingConv) {
      setSelectedUser(matchingConv.user);
    } else {
      setSelectedUser({
        _id: player.user || player._id,
        gamertag: player.gamertag,
        avatar: player.avatar,
        role: 'player'
      });
    }
    setActiveNav('Messagerie & Contact');
    setMsgSubTab('chat');
  };

  const handleStartChatWithCandidate = (app) => {
    const matchingConv = conversations.find(c => 
      c.user?.gamertag?.toLowerCase() === app.gamertag?.toLowerCase() ||
      c.user?.email?.toLowerCase() === app.email?.toLowerCase()
    );

    if (matchingConv) {
      setSelectedUser(matchingConv.user);
    } else {
      setSelectedUser({
        _id: app._id,
        gamertag: app.gamertag,
        email: app.email,
        role: 'user'
      });
    }
    setActiveNav('Messagerie & Contact');
    setMsgSubTab('chat');
  };

  const handleStartChatWithContactSender = (contact) => {
    const matchingConv = conversations.find(c => 
      c.user?.email?.toLowerCase() === contact.email?.toLowerCase() ||
      c.user?.gamertag?.toLowerCase() === contact.name?.toLowerCase()
    );

    if (matchingConv) {
      setSelectedUser(matchingConv.user);
      setActiveNav('Messagerie & Contact');
      setMsgSubTab('chat');
    } else {
      // Proposer d'écrire par email si non inscrit
      setSelectedContact(contact);
      setShowReplyModal(true);
    }
  };

  const handleUploadNewsImageFile = async (file) => {
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      setNewsUploadError('Fichier trop volumineux. Taille maximale : 15 Mo.');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setNewsUploadError('Format non supporté. Veuillez choisir une image (JPG, PNG, WebP, etc.).');
      return;
    }

    setUploadingNewsImage(true);
    setNewsUploadError('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await API.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data?.success && res.data.file) {
        setNewsFormData(prev => ({
          ...prev,
          coverImage: res.data.file.path || res.data.file.url
        }));
      }
    } catch (err) {
      console.error('Erreur upload:', err);
      setNewsUploadError(err.response?.data?.message || 'Erreur lors du téléversement de la photo');
    } finally {
      setUploadingNewsImage(false);
    }
  };

  const handleCreateNews = async (e) => {
    e.preventDefault();
    setNewsSubmitting(true);
    try {
      await API.post('/news', newsFormData);
      alert('Actualité publiée avec succès ! 🐺📰');
      setShowNewsModal(false);
      setNewsFormData({ title: '', category: 'Annonce', game: 'Général', summary: '', content: '', coverImage: '' });
      setNewsUploadError('');
      fetchAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur publication');
    } finally {
      setNewsSubmitting(false);
    }
  };

  const handleCreatePlayer = async (e) => {
    e.preventDefault();
    try {
      await API.post('/players', playerFormData);
      alert('Joueur ajouté avec succès au roster ! 🐺🎮');
      setShowPlayerModal(false);
      fetchAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de l\'ajout du joueur');
    }
  };

  const handleCreateMatch = async (e) => {
    e.preventDefault();
    try {
      await API.post('/matches', matchFormData);
      alert('Match programmé avec succès ! ⚔️');
      setShowMatchModal(false);
      fetchAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur programmation');
    }
  };

  const pendingAppsCount = recruitmentList.filter(a => a.status === 'pending').length;
  const totalUnreadMessages = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0) + contactUnreadCount + pendingAppsCount;

  const sidebarLinks = [
    { label: 'Tableau de Bord', icon: <LayoutDashboard size={18} /> },
    { label: 'Boutique & Ventes', icon: <ShoppingBag size={18} /> },
    { label: 'Messagerie & Contact', icon: <MessageSquare size={18} />, badge: totalUnreadMessages },
    { label: 'Gestion des Joueurs', icon: <Users size={18} />, badge: pendingAppsCount },
    { label: 'Tournois', icon: <Trophy size={18} /> },
    { label: 'Actualités', icon: <FileText size={18} /> },
    { label: 'Paramètres', icon: <Settings size={18} /> },
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
              style={{ position: 'relative' }}
            >
              {item.icon}
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge > 0 && (
                <span style={{
                  background: 'var(--red-primary)',
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: '800',
                  padding: '2px 7px',
                  borderRadius: '10px'
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
          <button 
            className="dash-nav-item" 
            onClick={fetchAllData}
            style={{ marginTop: '12px', color: '#64748b' }}
            title="Rafraîchir les données"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            <span>Actualiser</span>
          </button>
        </aside>

        {/* Right Main Pane */}
        <main className="dash-main-pane">
          {/* Header Title Row with Notification Center */}
          <div className="dash-title-row">
            <div>
              <h1 className="dash-page-title">
                ADMIN <span className="red-glow-txt">DASHBOARD</span>
              </h1>
              <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>
                Gestion complète de la Dark Wolf Team & E-commerce
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', position: 'relative' }}>
              {/* Cloche de Notifications */}
              <button 
                className="dash-bell-notify" 
                onClick={() => setShowNotifPopup(!showNotifPopup)}
                title="Notifications de commandes et messages"
                style={{ cursor: 'pointer', position: 'relative' }}
              >
                <Bell size={18} color="#fff" />
                {unreadNotifCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    background: 'var(--red-primary)',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    fontSize: '11px',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 8px rgba(230,0,0,0.8)'
                  }}>
                    {unreadNotifCount}
                  </span>
                )}
              </button>

              {/* Popup des Notifications */}
              {showNotifPopup && (
                <div className="notif-popup">
                  <div className="notif-header">
                    <span style={{ fontWeight: '700', fontSize: '14px', color: '#fff' }}>
                      Notifications ({notifications.length})
                    </span>
                    {unreadNotifCount > 0 && (
                      <button 
                        onClick={handleMarkAllNotifsRead}
                        style={{ background: 'none', border: 'none', color: 'var(--red-primary)', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                      >
                        Tout marquer comme lu
                      </button>
                    )}
                  </div>
                  <div className="notif-list">
                    {notifications.length === 0 ? (
                      <div className="dash-empty-state">Aucune notification pour le moment.</div>
                    ) : (
                      notifications.map(n => (
                        <div 
                          key={n._id} 
                          className={`notif-item ${!n.isRead ? 'unread' : ''}`}
                          style={{ cursor: 'pointer', transition: 'background 0.2s' }}
                          title="Cliquer pour accéder à cet élément"
                          onClick={() => {
                            if (n.metadata?.applicationId || n.title?.includes('Candidature')) {
                              setActiveNav('Messagerie & Contact');
                              setMsgSubTab('candidatures');
                            } else if (n.metadata?.contactId || n.title?.includes('Message Contact')) {
                              setActiveNav('Messagerie & Contact');
                              setMsgSubTab('contact');
                            } else if (n.type === 'order' || n.title?.includes('Commande')) {
                              setActiveNav('Boutique & Ventes');
                              setStoreSubTab('commandes');
                            } else {
                              setActiveNav('Messagerie & Contact');
                              setMsgSubTab('chat');
                            }
                            setShowNotifPopup(false);
                          }}
                        >
                          <div style={{ marginTop: '2px' }}>
                            {n.type === 'order' ? <ShoppingBag size={18} color="#4ade80" /> : <MessageSquare size={18} color="#38bdf8" />}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '700', fontSize: '13px', color: '#fff' }}>{n.title}</div>
                            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{n.message}</div>
                            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                              {new Date(n.createdAt).toLocaleString('fr-FR')}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              <div className="dash-badge-mode">
                <Shield size={14} /> Admin Mode
              </div>
            </div>
          </div>

          {/* TAB 1: TABLEAU DE BORD (APERÇU GLOBAL) */}
          {activeNav === 'Tableau de Bord' && (
            <>
              {/* Top KPI Cards (Finances + Roster) */}
              <div className="dash-kpi-grid">
                <div className="dash-kpi-card">
                  <div className="dash-kpi-icon">
                    <DollarSign size={24} />
                  </div>
                  <div>
                    <div className="dash-kpi-value">{revenueStats?.totalRevenue || 0} DT</div>
                    <div className="dash-kpi-label">Chiffre d'Affaires Total</div>
                  </div>
                </div>

                <div className="dash-kpi-card">
                  <div className="dash-kpi-icon" style={{ background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8' }}>
                    <ShoppingBag size={24} />
                  </div>
                  <div>
                    <div className="dash-kpi-value">{revenueStats?.totalOrders || storeOrders.length}</div>
                    <div className="dash-kpi-label">Commandes Boutique</div>
                  </div>
                </div>

                <div className="dash-kpi-card">
                  <div className="dash-kpi-icon" style={{ background: 'rgba(74, 222, 128, 0.12)', color: '#4ade80' }}>
                    <Package size={24} />
                  </div>
                  <div>
                    <div className="dash-kpi-value">{productsList.length}</div>
                    <div className="dash-kpi-label">Articles en Boutique</div>
                  </div>
                </div>

                <div className="dash-kpi-card">
                  <div className="dash-kpi-icon" style={{ background: 'rgba(251, 191, 36, 0.12)', color: '#fbbf24' }}>
                    <Users size={24} />
                  </div>
                  <div>
                    <div className="dash-kpi-value">{playersList.length}</div>
                    <div className="dash-kpi-label">Joueurs au Roster</div>
                  </div>
                </div>
              </div>

              {/* Dernières Commandes Boutique */}
              <div className="dash-card">
                <div className="dash-card-header">
                  <span className="dash-card-title">Dernières Commandes Clients ({storeOrders.length})</span>
                  <button 
                    className="dash-subtab-btn"
                    onClick={() => { setActiveNav('Boutique & Ventes'); setShopSubTab('orders'); }}
                    style={{ fontSize: '12px', padding: '4px 10px' }}
                  >
                    Voir toutes
                  </button>
                </div>
                <div className="dash-list-col">
                  {storeOrders.length === 0 ? (
                    <div className="dash-empty-state">
                      Aucune commande passée dans la boutique pour le moment.
                    </div>
                  ) : (
                    storeOrders.slice(0, 5).map((order) => (
                      <div className="dash-list-item-row" key={order._id}>
                        <div className="dash-item-left">
                          <img 
                            src={order.orderItems?.[0]?.image || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=150&q=80'} 
                            alt="article" 
                            className="dash-avatar-tiny" 
                          />
                          <div>
                            <span className="dash-item-title">
                              {order.shippingAddress?.fullName} - {order.orderItems?.[0]?.name} (x{order.orderItems?.[0]?.qty})
                            </span>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>
                              {order.shippingAddress?.email} • {order.user ? 'Joueur Inscrit' : 'Visiteur'}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '14px', color: 'var(--red-primary)', fontWeight: '800' }}>
                            {order.totalPrice} DT
                          </span>
                          <span className={`stock-badge ${order.orderStatus === 'delivered' ? 'in-stock' : order.orderStatus === 'shipped' ? 'low-stock' : 'out-stock'}`}>
                            {order.orderStatus}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Matchs en Attente */}
              <div className="dash-card">
                <div className="dash-card-header">
                  <span className="dash-card-title">Matchs à Venir / En Attente</span>
                  <span className="dash-status-dot-count">
                    {matches.filter(m => m.status === 'upcoming').length}
                  </span>
                </div>
                <div className="dash-list-col">
                  {matches.filter(m => m.status === 'upcoming').length === 0 ? (
                    <div className="dash-empty-state">
                      Aucun match en attente.
                    </div>
                  ) : (
                    matches.filter(m => m.status === 'upcoming').slice(0, 4).map((match) => (
                      <div className="dash-list-item-row" key={match._id}>
                        <div className="dash-item-left">
                          <div className="dash-wolf-badge-tiny">
                            <WolfLogo size={18} />
                          </div>
                          <span className="dash-item-title">
                            {match.game} vs {match.opponent}
                          </span>
                        </div>
                        <div className="dash-btn-group-actions">
                          <button 
                            className="btn-dash-approve"
                            onClick={() => handleApproveMatch(match._id)}
                          >
                            Approuver
                          </button>
                          <button 
                            className="btn-dash-reject"
                            onClick={() => handleRejectMatch(match._id)}
                          >
                            Rejeter
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Candidatures Recrutement */}
              <div className="dash-card">
                <div className="dash-card-header">
                  <span className="dash-card-title">Candidatures Recrutement ({recruitmentList.filter(a => a.status === 'pending').length})</span>
                </div>
                <div className="dash-list-col">
                  {recruitmentList.length === 0 ? (
                    <div className="dash-empty-state">
                      Aucune candidature en attente de recrutement.
                    </div>
                  ) : (
                    recruitmentList.slice(0, 6).map((app) => (
                      <div className="dash-list-item-row" key={app._id}>
                        <div className="dash-item-left">
                          <div className="dash-avatar-tiny" style={{ background: '#1c2233', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: '700' }}>
                            {app.gamertag?.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span className="dash-item-title">{app.gamertag} ({app.game})</span>
                              <span style={{
                                fontSize: '10px',
                                fontWeight: '800',
                                padding: '1px 6px',
                                borderRadius: '4px',
                                background: app.status === 'accepted' ? 'rgba(74, 222, 128, 0.15)' : app.status === 'rejected' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(251, 191, 36, 0.15)',
                                color: app.status === 'accepted' ? '#4ade80' : app.status === 'rejected' ? '#f87171' : '#fbbf24',
                                border: `1px solid ${app.status === 'accepted' ? '#4ade80' : app.status === 'rejected' ? '#f87171' : '#fbbf24'}`
                              }}>
                                {app.status === 'accepted' ? 'ACCEPTÉ' : app.status === 'rejected' ? 'REFUSÉ' : 'EN ATTENTE'}
                              </span>
                            </div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                              Rôle: {app.rolePreference || app.role || 'Flexible'} • Rang: {app.rank} • Discord: {app.discordTag || '-'} • {app.email}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            type="button"
                            className="btn-dash-approve"
                            style={{ padding: '4px 10px', fontSize: '12px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid #38bdf8', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px' }}
                            title="Discuter avec ce candidat"
                            onClick={() => handleStartChatWithCandidate(app)}
                          >
                            <MessageSquare size={13} /> Discuter
                          </button>
                          {app.status !== 'accepted' && (
                            <button 
                              className="btn-dash-approve" 
                              style={{ padding: '4px 10px', fontSize: '12px' }}
                              onClick={() => handleUpdateAppStatus(app._id, 'accepted')}
                            >
                              Accepter
                            </button>
                          )}
                          {app.status !== 'rejected' && (
                            <button 
                              className="btn-dash-reject" 
                              style={{ padding: '4px 10px', fontSize: '12px' }}
                              onClick={() => handleUpdateAppStatus(app._id, 'rejected')}
                            >
                              Refuser
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}

          {/* TAB 2: BOUTIQUE & VENTES (GESTION COMPLÈTE DEMANDÉE) */}
          {activeNav === 'Boutique & Ventes' && (
            <div>
              {/* Sous-onglets de la Boutique */}
              <div className="dash-subtabs-bar">
                <button 
                  className={`dash-subtab-btn ${shopSubTab === 'revenue' ? 'active' : ''}`}
                  onClick={() => setShopSubTab('revenue')}
                >
                  <TrendingUp size={16} /> Chiffre d'Affaires & Finances
                </button>
                <button 
                  className={`dash-subtab-btn ${shopSubTab === 'products' ? 'active' : ''}`}
                  onClick={() => setShopSubTab('products')}
                >
                  <Package size={16} /> Produits & Ajout ({productsList.length})
                </button>
                <button 
                  className={`dash-subtab-btn ${shopSubTab === 'stocks' ? 'active' : ''}`}
                  onClick={() => setShopSubTab('stocks')}
                >
                  <Layers size={16} /> Gestion des Stocks
                </button>
                <button 
                  className={`dash-subtab-btn ${shopSubTab === 'categories' ? 'active' : ''}`}
                  onClick={() => setShopSubTab('categories')}
                >
                  <FileText size={16} /> Catégories ({categoriesList.length})
                </button>
                <button 
                  className={`dash-subtab-btn ${shopSubTab === 'orders' ? 'active' : ''}`}
                  onClick={() => setShopSubTab('orders')}
                >
                  <ShoppingBag size={16} /> Commandes ({storeOrders.length})
                </button>
              </div>

              {/* SOUS-ONGLET 1: CHIFFRE D'AFFAIRES & FINANCES */}
              {shopSubTab === 'revenue' && (
                <div>
                  <div className="dash-kpi-grid">
                    <div className="dash-kpi-card">
                      <div className="dash-kpi-icon">
                        <DollarSign size={24} />
                      </div>
                      <div>
                        <div className="dash-kpi-value">{revenueStats?.totalRevenue || 0} DT</div>
                        <div className="dash-kpi-label">Chiffre d'Affaires Total</div>
                      </div>
                    </div>

                    <div className="dash-kpi-card">
                      <div className="dash-kpi-icon" style={{ background: 'rgba(74, 222, 128, 0.12)', color: '#4ade80' }}>
                        <TrendingUp size={24} />
                      </div>
                      <div>
                        <div className="dash-kpi-value">{revenueStats?.monthlyRevenue || 0} DT</div>
                        <div className="dash-kpi-label">CA du Mois en Cours</div>
                      </div>
                    </div>

                    <div className="dash-kpi-card">
                      <div className="dash-kpi-icon" style={{ background: 'rgba(251, 191, 36, 0.12)', color: '#fbbf24' }}>
                        <ShoppingBag size={24} />
                      </div>
                      <div>
                        <div className="dash-kpi-value">{revenueStats?.averageOrderValue || 0} DT</div>
                        <div className="dash-kpi-label">Panier Moyen</div>
                      </div>
                    </div>

                    <div className="dash-kpi-card">
                      <div className="dash-kpi-icon" style={{ background: 'rgba(239, 68, 68, 0.12)', color: '#f87171' }}>
                        <AlertTriangle size={24} />
                      </div>
                      <div>
                        <div className="dash-kpi-value">{revenueStats?.stockSummary?.lowStockCount || 0}</div>
                        <div className="dash-kpi-label">Alertes Stock Faible</div>
                      </div>
                    </div>
                  </div>

                  {/* Graphique Ventes 7 derniers jours */}
                  <div className="dash-card" style={{ marginBottom: '24px' }}>
                    <div className="dash-card-header">
                      <span className="dash-card-title">Évolution des Ventes (7 Derniers Jours)</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '12px', alignItems: 'end', height: '180px', paddingTop: '20px' }}>
                      {(revenueStats?.last7Days || []).map((day, idx) => {
                        const maxRev = Math.max(...(revenueStats?.last7Days || []).map(d => d.revenue), 100);
                        const heightPct = Math.max(12, Math.round((day.revenue / maxRev) * 100));
                        return (
                          <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: '8px' }}>
                            <span style={{ fontSize: '11px', color: '#fff', fontWeight: '700' }}>
                              {day.revenue > 0 ? `${day.revenue} DT` : ''}
                            </span>
                            <div 
                              style={{
                                width: '100%',
                                maxWidth: '38px',
                                height: `${heightPct}%`,
                                background: day.revenue > 0 ? 'linear-gradient(to top, var(--red-dark), var(--red-primary))' : '#141824',
                                borderRadius: '6px 6px 0 0',
                                transition: 'height 0.3s ease'
                              }}
                            />
                            <span style={{ fontSize: '11px', color: '#94a3b8' }}>{day.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* SOUS-ONGLET 2: PRODUITS & AJOUT DE PRODUITS */}
              {shopSubTab === 'products' && (
                <div className="dash-card">
                  <div className="dash-card-header">
                    <div>
                      <span className="dash-card-title">Catalogue des Produits ({productsList.length})</span>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>Gérez les articles visibles dans la boutique officielle</div>
                    </div>
                    <button 
                      className="btn-rejoindre" 
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px' }}
                      onClick={() => {
                        setEditingProduct(null);
                        setProductFormData({
                          name: '',
                          category: categoriesList[0]?.name || 'Maillots',
                          price: '',
                          comparePrice: '',
                          stockCount: 20,
                          sizes: ['M', 'L', 'XL'],
                          description: '',
                          image: '',
                          isFeatured: true
                        });
                        setUploadError('');
                        setShowProductModal(true);
                      }}
                    >
                      <Plus size={16} /> Ajouter un Produit
                    </button>
                  </div>

                  <div className="dash-list-col">
                    {productsList.length === 0 ? (
                      <div className="dash-empty-state">
                        Aucun produit dans la boutique. Cliquez sur "+ Ajouter un Produit" pour commencer !
                      </div>
                    ) : (
                      productsList.map((p) => (
                        <div className="dash-list-item-row" key={p._id}>
                          <div className="dash-item-left">
                            <img src={getImageUrl(p.images?.[0])} alt="" className="dash-avatar-tiny" />
                            <div>
                              <div className="dash-item-title">{p.name}</div>
                              <div style={{ fontSize: '12px', color: '#64748b' }}>
                                Catégorie: <strong>{p.category}</strong> • Stock: <strong>{p.stockCount} unités</strong> • Tailles: {Array.isArray(p.sizes) ? p.sizes.join(', ') : p.sizes}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ color: 'var(--red-primary)', fontWeight: '800', fontSize: '16px' }}>
                                {p.price} DT
                              </div>
                              {p.comparePrice > p.price && (
                                <div style={{ fontSize: '12px', color: '#64748b', textDecoration: 'line-through' }}>
                                  {p.comparePrice} DT
                                </div>
                              )}
                            </div>

                            <button 
                              className="dash-more-btn"
                              title="Modifier produit"
                              onClick={() => {
                                setEditingProduct(p);
                                setProductFormData({
                                  name: p.name,
                                  category: p.category,
                                  price: p.price,
                                  comparePrice: p.comparePrice || '',
                                  stockCount: p.stockCount,
                                  sizes: Array.isArray(p.sizes) ? p.sizes : (typeof p.sizes === 'string' ? p.sizes.split(',').map(s => s.trim()).filter(Boolean) : ['M', 'L', 'XL']),
                                  description: p.description,
                                  image: p.images?.[0] || '',
                                  isFeatured: p.isFeatured || false
                                });
                                setUploadError('');
                                setShowProductModal(true);
                              }}
                            >
                              <Edit3 size={16} color="#38bdf8" />
                            </button>

                            <button 
                              className="dash-more-btn"
                              title="Supprimer produit"
                              onClick={() => handleDeleteProduct(p._id, p.name)}
                            >
                              <Trash2 size={16} color="#ff4d4d" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* SOUS-ONGLET 3: GESTION DES STOCKS */}
              {shopSubTab === 'stocks' && (
                <div className="dash-card">
                  <div className="dash-card-header">
                    <div>
                      <span className="dash-card-title">Gestion et Contrôle des Stocks</span>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>Ajustez les quantités disponibles en temps réel</div>
                    </div>
                  </div>

                  <div className="dash-list-col">
                    {productsList.length === 0 ? (
                      <div className="dash-empty-state">Aucun produit configuré pour la gestion des stocks.</div>
                    ) : (
                      productsList.map((p) => {
                        const isOut = p.stockCount === 0 || !p.inStock;
                        const isLow = p.stockCount > 0 && p.stockCount <= 5;
                        return (
                          <div className="dash-list-item-row" key={p._id}>
                            <div className="dash-item-left">
                              <img src={getImageUrl(p.images?.[0])} alt="" className="dash-avatar-tiny" />
                              <div>
                                <div className="dash-item-title">{p.name} ({p.category})</div>
                                <div style={{ fontSize: '12px', marginTop: '3px' }}>
                                  <span className={`stock-badge ${isOut ? 'out-stock' : isLow ? 'low-stock' : 'in-stock'}`}>
                                    {isOut ? 'Rupture de Stock' : isLow ? `Stock Faible (${p.stockCount})` : `En Stock (${p.stockCount})`}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                              {/* Stepper rapide de stock */}
                              <div className="stock-stepper">
                                <button 
                                  className="stock-step-btn" 
                                  onClick={() => handleUpdateStockDelta(p._id, -1)}
                                  title="Diminuer stock"
                                >
                                  -
                                </button>
                                <span className="stock-step-input">{p.stockCount}</span>
                                <button 
                                  className="stock-step-btn" 
                                  onClick={() => handleUpdateStockDelta(p._id, 1)}
                                  title="Augmenter stock"
                                >
                                  +
                                </button>
                              </div>

                              <button
                                className="dash-subtab-btn"
                                style={{ fontSize: '11px', padding: '4px 8px' }}
                                onClick={() => handleUpdateStockDelta(p._id, 10)}
                              >
                                +10
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* SOUS-ONGLET 4: GESTION DES CATEGORIES */}
              {shopSubTab === 'categories' && (
                <div className="dash-card">
                  <div className="dash-card-header">
                    <div>
                      <span className="dash-card-title">Catégories de Produits ({categoriesList.length})</span>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>Créez et organisez vos catégories de boutique</div>
                    </div>
                    <button 
                      className="btn-rejoindre" 
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 16px' }}
                      onClick={() => setShowCategoryModal(true)}
                    >
                      <Plus size={16} /> Nouvelle Catégorie
                    </button>
                  </div>

                  <div className="dash-list-col">
                    {categoriesList.map((cat) => (
                      <div className="dash-list-item-row" key={cat._id}>
                        <div className="dash-item-left">
                          <div style={{
                            width: '38px', 
                            height: '38px', 
                            borderRadius: '8px', 
                            background: '#161b28', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            color: 'var(--red-primary)'
                          }}>
                            <Layers size={18} />
                          </div>
                          <div>
                            <div className="dash-item-title">{cat.name}</div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>
                              {cat.description || 'Catégorie DWT'} • {cat.productCount || 0} produit(s) associé(s)
                            </div>
                          </div>
                        </div>

                        <button 
                          className="dash-more-btn"
                          title="Supprimer catégorie"
                          onClick={() => handleDeleteCategory(cat._id, cat.name)}
                        >
                          <Trash2 size={16} color="#ff4d4d" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SOUS-ONGLET 5: COMMANDES BOUTIQUE */}
              {shopSubTab === 'orders' && (
                <div className="dash-card">
                  <div className="dash-card-header">
                    <span className="dash-card-title">Toutes les Commandes ({storeOrders.length})</span>
                  </div>

                  <div className="dash-list-col">
                    {storeOrders.length === 0 ? (
                      <div className="dash-empty-state">Aucune commande reçue pour le moment.</div>
                    ) : (
                      storeOrders.map((o) => (
                        <div className="dash-list-item-row" key={o._id} style={{ alignItems: 'flex-start' }}>
                          <div className="dash-item-left" style={{ alignItems: 'flex-start' }}>
                            <img src={o.orderItems?.[0]?.image} alt="" className="dash-avatar-tiny" style={{ marginTop: '4px' }} />
                            <div>
                              <div className="dash-item-title" style={{ fontSize: '15px' }}>
                                Commande #{o._id.slice(-6).toUpperCase()} • {o.shippingAddress?.fullName}
                              </div>
                              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '3px' }}>
                                <strong>Articles :</strong> {o.orderItems?.map(it => `${it.name} (x${it.qty}${it.size ? ` / ${it.size}` : ''})`).join(', ')}
                              </div>
                              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>
                                📍 {o.shippingAddress?.address}, {o.shippingAddress?.city} • 📞 {o.shippingAddress?.phone} • ✉️ {o.shippingAddress?.email}
                              </div>
                              <div style={{ fontSize: '11px', color: '#475569', marginTop: '3px' }}>
                                Date: {new Date(o.createdAt).toLocaleString('fr-FR')}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                            <div style={{ color: 'var(--red-primary)', fontWeight: '800', fontSize: '16px' }}>
                              {o.totalPrice} DT
                            </div>

                            <select
                              className="dash-form-select"
                              style={{ padding: '4px 8px', fontSize: '12px', width: 'auto' }}
                              value={o.orderStatus}
                              onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)}
                            >
                              <option value="pending">En attente</option>
                              <option value="processing">En préparation</option>
                              <option value="shipped">Expédiée</option>
                              <option value="delivered">Livrée</option>
                              <option value="cancelled">Annulée</option>
                            </select>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SYSTEME DE MESSAGERIE & CONTACT (CHAT DIRECT + FORMULAIRES DE CONTACT) */}
          {(activeNav === 'Messagerie & Contact' || activeNav === 'Messagerie Joueurs') && (
            <div>
              {/* Sélecteur de sous-onglets : Chat Direct vs Formulaires de Contact vs Candidatures */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className={`dash-subtab-btn ${msgSubTab === 'chat' ? 'active' : ''}`}
                  onClick={() => setMsgSubTab('chat')}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontSize: '13px' }}
                >
                  <MessageSquare size={16} />
                  <span>Chat Direct Joueurs & Membres ({conversations.length})</span>
                </button>

                <button
                  type="button"
                  className={`dash-subtab-btn ${msgSubTab === 'candidatures' ? 'active' : ''}`}
                  onClick={() => setMsgSubTab('candidatures')}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontSize: '13px', position: 'relative' }}
                >
                  <Users size={16} />
                  <span>Candidatures Recrutement ({recruitmentList.length})</span>
                  {pendingAppsCount > 0 && (
                    <span style={{
                      background: 'var(--red-primary)',
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: '800',
                      padding: '2px 7px',
                      borderRadius: '10px',
                      marginLeft: '4px'
                    }}>
                      {pendingAppsCount} en attente
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  className={`dash-subtab-btn ${msgSubTab === 'contact' ? 'active' : ''}`}
                  onClick={() => setMsgSubTab('contact')}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontSize: '13px', position: 'relative' }}
                >
                  <Mail size={16} />
                  <span>Messages du Formulaire Contact ({contactMessages.length})</span>
                  {contactUnreadCount > 0 && (
                    <span style={{
                      background: 'var(--red-primary)',
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: '800',
                      padding: '2px 7px',
                      borderRadius: '10px',
                      marginLeft: '4px'
                    }}>
                      {contactUnreadCount} nouveau{contactUnreadCount > 1 ? 'x' : ''}
                    </span>
                  )}
                </button>
              </div>

              {/* SOUS-VUE 1 : CHAT DIRECT EN TEMPS RÉEL */}
              {msgSubTab === 'chat' && (
                <div className="chat-container">
                  {/* Colonne de gauche : Utilisateurs / Joueurs */}
                  <div className="chat-user-list">
                    <div className="chat-user-header">
                      <span>Joueurs & Membres DWT</span>
                    </div>
                    <div style={{ overflowY: 'auto', flex: 1 }}>
                      {conversations.length === 0 ? (
                        <div style={{ padding: '20px', color: '#64748b', fontSize: '13px', textAlign: 'center' }}>
                          Aucun membre trouvé pour la discussion.
                        </div>
                      ) : (
                        conversations.map(conv => (
                          <div 
                            key={conv.user._id}
                            className={`chat-user-item ${selectedUser?._id === conv.user._id ? 'active' : ''}`}
                            onClick={() => setSelectedUser(conv.user)}
                          >
                            <img 
                              src={conv.user.avatar || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&q=80'} 
                              alt="" 
                              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} 
                            />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: '700', fontSize: '14px', color: '#fff' }}>
                                  {conv.user.gamertag}
                                </span>
                                {conv.unreadCount > 0 && (
                                  <span style={{
                                    background: 'var(--red-primary)',
                                    color: '#fff',
                                    borderRadius: '10px',
                                    padding: '1px 6px',
                                    fontSize: '10px',
                                    fontWeight: '800'
                                  }}>
                                    {conv.unreadCount}
                                  </span>
                                )}
                              </div>
                              <div style={{ fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {conv.lastMessage?.content || `Rôle: ${conv.user.role}`}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Colonne de droite : Fenêtre de discussion */}
                  <div className="chat-window">
                    <div className="chat-window-header">
                      {selectedUser ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img 
                            src={selectedUser.avatar || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&q=80'} 
                            alt="" 
                            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} 
                          />
                          <div>
                            <div style={{ fontWeight: '800', color: '#fff', fontSize: '15px' }}>
                              Discussion avec {selectedUser.gamertag}
                            </div>
                            <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                              {selectedUser.email} • Rôle : {selectedUser.role}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span style={{ color: '#94a3b8' }}>Sélectionnez un joueur pour discuter</span>
                      )}
                    </div>

                    <div className="chat-messages-scroll" ref={chatScrollRef}>
                      {chatMessages.length === 0 ? (
                        <div className="dash-empty-state" style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                          Aucun message échangé pour le moment.<br />Envoyez un premier message pour démarrer la conversation ! 🐺💬
                        </div>
                      ) : (
                        chatMessages.map(msg => {
                          const isMine = msg.sender?._id !== selectedUser?._id;
                          return (
                            <div key={msg._id} className={`chat-bubble ${isMine ? 'mine' : 'theirs'}`}>
                              <div style={{ fontSize: '11px', opacity: 0.8, marginBottom: '2px', fontWeight: '700' }}>
                                {isMine ? 'Admin Staff' : msg.sender?.gamertag || selectedUser.gamertag}
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

                    {selectedUser && (
                      <form className="chat-input-bar" onSubmit={handleSendMessage}>
                        <input 
                          type="text"
                          className="chat-input-field"
                          placeholder={`Écrire un message à ${selectedUser.gamertag}...`}
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                        />
                        <button type="submit" className="chat-send-btn" disabled={sendingMsg}>
                          <Send size={18} />
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              )}

              {/* SOUS-VUE 2 : MESSAGES REÇUS DU FORMULAIRE DE CONTACT */}
              {msgSubTab === 'contact' && (
                <div className="dash-card">
                  <div className="dash-card-header">
                    <div>
                      <span className="dash-card-title">Messages du Formulaire de Contact ({contactMessages.length})</span>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        Messages envoyés depuis la page Contact par les visiteurs, partenaires et membres.
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                        Non lus : <strong style={{ color: 'var(--red-primary)' }}>{contactUnreadCount}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="dash-list-col">
                    {contactMessages.length === 0 ? (
                      <div className="dash-empty-state" style={{ padding: '40px 20px' }}>
                        <Mail size={36} color="#64748b" style={{ margin: '0 auto 12px' }} />
                        <div style={{ fontWeight: '700', color: '#fff' }}>Aucun message de contact pour l'instant</div>
                        <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                          Tous les messages envoyés depuis la page <strong>/contact</strong> apparaîtront ici avec possibilité de répondre par email en un clic.
                        </div>
                      </div>
                    ) : (
                      contactMessages.map((msg) => {
                        const isUnread = msg.status === 'unread';
                        const isReplied = msg.status === 'replied';

                        return (
                          <div 
                            key={msg._id} 
                            className="dash-list-item-row"
                            style={{
                              alignItems: 'flex-start',
                              background: isUnread ? 'rgba(230,0,0,0.04)' : undefined,
                              borderLeft: isUnread ? '3px solid var(--red-primary)' : '3px solid transparent'
                            }}
                          >
                            <div className="dash-item-left" style={{ alignItems: 'flex-start', flex: 1 }}>
                              <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '8px',
                                background: isUnread ? 'rgba(230,0,0,0.15)' : '#161b28',
                                color: isUnread ? 'var(--red-primary)' : '#64748b',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: '2px',
                                flexShrink: 0
                              }}>
                                <Mail size={18} />
                              </div>

                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                  <span className="dash-item-title" style={{ fontSize: '15px' }}>
                                    {msg.name}
                                  </span>
                                  <span style={{ fontSize: '13px', color: '#38bdf8' }}>
                                    &lt;{msg.email}&gt;
                                  </span>
                                  <span style={{
                                    fontSize: '10px',
                                    fontWeight: '800',
                                    padding: '2px 7px',
                                    borderRadius: '4px',
                                    background: isReplied ? 'rgba(74, 222, 128, 0.15)' : isUnread ? 'rgba(230,0,0,0.15)' : 'rgba(100,116,139,0.15)',
                                    color: isReplied ? '#4ade80' : isUnread ? '#ff6666' : '#94a3b8',
                                    border: `1px solid ${isReplied ? '#4ade80' : isUnread ? 'var(--red-primary)' : '#475569'}`
                                  }}>
                                    {isReplied ? 'RÉPONDU ✓' : isUnread ? 'NOUVEAU NON LU' : 'LU'}
                                  </span>
                                </div>

                                <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff', marginTop: '4px' }}>
                                  Sujet : {msg.subject}
                                </div>

                                <div style={{
                                  fontSize: '13px',
                                  color: '#cbd5e1',
                                  background: '#090d16',
                                  border: '1px solid #1a2234',
                                  padding: '12px 14px',
                                  borderRadius: '8px',
                                  marginTop: '8px',
                                  lineHeight: '1.5',
                                  whiteSpace: 'pre-wrap'
                                }}>
                                  {msg.message}
                                </div>

                                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
                                  Reçu le : {new Date(msg.createdAt).toLocaleString('fr-FR')}
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end', flexShrink: 0, marginLeft: '16px' }}>
                              <button
                                type="button"
                                className="btn-dash-approve"
                                style={{ padding: '6px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                                title="Répondre par email au contact"
                                onClick={() => {
                                  setSelectedContact(msg);
                                  setShowReplyModal(true);
                                }}
                              >
                                <Reply size={14} /> Répondre par Email
                              </button>

                              <button
                                type="button"
                                className="btn-dash-approve"
                                style={{ padding: '6px 14px', fontSize: '12px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid #38bdf8', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}
                                title="Discuter sur le chat ou par email"
                                onClick={() => handleStartChatWithContactSender(msg)}
                              >
                                <MessageSquare size={14} /> Ouvrir Chat
                              </button>

                              <button
                                type="button"
                                className="dash-subtab-btn"
                                style={{ padding: '4px 10px', fontSize: '11px' }}
                                onClick={() => handleToggleContactStatus(msg._id, msg.status)}
                              >
                                {isUnread ? 'Marquer comme lu' : 'Marquer comme non lu'}
                              </button>

                              <button
                                type="button"
                                className="dash-more-btn"
                                style={{ padding: '4px 8px' }}
                                title="Supprimer ce message"
                                onClick={() => handleDeleteContact(msg._id)}
                              >
                                <Trash2 size={15} color="#ff4d4d" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* SOUS-VUE 3 : CANDIDATURES RECRUTEMENT REÇUES */}
              {msgSubTab === 'candidatures' && (
                <div className="dash-card">
                  <div className="dash-card-header">
                    <div>
                      <span className="dash-card-title">Candidatures & Demandes de Recrutement ({recruitmentList.length})</span>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        Postulants ayant rempli le formulaire « Rejoindre la Meute » depuis la page Contact / Recrutement.
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                        En attente : <strong style={{ color: 'var(--red-primary)' }}>{pendingAppsCount}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="dash-list-col">
                    {recruitmentList.length === 0 ? (
                      <div className="dash-empty-state" style={{ padding: '40px 20px' }}>
                        <Users size={36} color="#64748b" style={{ margin: '0 auto 12px' }} />
                        <div style={{ fontWeight: '700', color: '#fff' }}>Aucune candidature pour le moment</div>
                        <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                          Les joueurs postulant sur <strong>/contact</strong> ou <strong>/recrutement</strong> apparaîtront ici avec tous leurs détails.
                        </div>
                      </div>
                    ) : (
                      recruitmentList.map((app) => {
                        const isPending = app.status === 'pending';
                        const isAccepted = app.status === 'accepted';
                        const isRejected = app.status === 'rejected';

                        return (
                          <div
                            key={app._id}
                            className="dash-list-item-row"
                            style={{
                              alignItems: 'flex-start',
                              background: isPending ? 'rgba(230,0,0,0.04)' : undefined,
                              borderLeft: isPending ? '3px solid var(--red-primary)' : isAccepted ? '3px solid #22c55e' : '3px solid #64748b'
                            }}
                          >
                            <div className="dash-item-left" style={{ alignItems: 'flex-start', flex: 1 }}>
                              <div style={{
                                width: '42px',
                                height: '42px',
                                borderRadius: '8px',
                                background: isPending ? 'rgba(230,0,0,0.15)' : '#161b28',
                                color: isPending ? 'var(--red-primary)' : isAccepted ? '#4ade80' : '#64748b',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: '2px',
                                flexShrink: 0,
                                fontWeight: '800',
                                fontSize: '14px'
                              }}>
                                {app.gamertag?.slice(0, 2).toUpperCase()}
                              </div>

                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                  <span className="dash-item-title" style={{ fontSize: '16px' }}>
                                    {app.gamertag}
                                  </span>
                                  <span style={{ fontSize: '13px', color: '#38bdf8', fontWeight: '700' }}>
                                    🎮 {app.game}
                                  </span>
                                  <span style={{
                                    fontSize: '10px',
                                    fontWeight: '800',
                                    padding: '2px 7px',
                                    borderRadius: '4px',
                                    background: isAccepted ? 'rgba(74, 222, 128, 0.15)' : isRejected ? 'rgba(239, 68, 68, 0.15)' : 'rgba(251, 191, 36, 0.15)',
                                    color: isAccepted ? '#4ade80' : isRejected ? '#f87171' : '#fbbf24',
                                    border: `1px solid ${isAccepted ? '#4ade80' : isRejected ? '#f87171' : '#fbbf24'}`
                                  }}>
                                    {isAccepted ? 'ACCEPTÉ AU ROSTER ✓' : isRejected ? 'REFUSÉ' : 'NOUVELLE CANDIDATURE (EN ATTENTE)'}
                                  </span>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '6px', fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>
                                  <div>✉️ <strong>Email :</strong> {app.email}</div>
                                  <div>💬 <strong>Discord :</strong> {app.discordTag || '-'}</div>
                                  <div>🏆 <strong>Rang :</strong> {app.rank}</div>
                                  <div>🎯 <strong>Rôle visé :</strong> {app.rolePreference || app.role || 'Flexible'}</div>
                                  <div>🎂 <strong>Âge :</strong> {app.age} ans</div>
                                  <div>📅 <strong>Reçu le :</strong> {new Date(app.createdAt).toLocaleString('fr-FR')}</div>
                                </div>

                                <div style={{
                                  fontSize: '13px',
                                  color: '#cbd5e1',
                                  background: '#090d16',
                                  border: '1px solid #1a2234',
                                  padding: '12px 14px',
                                  borderRadius: '8px',
                                  marginTop: '10px',
                                  lineHeight: '1.5'
                                }}>
                                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>
                                    Expérience compétitive & Motivation :
                                  </div>
                                  {app.experience}
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end', flexShrink: 0, marginLeft: '16px' }}>
                              {app.status !== 'accepted' && (
                                <button
                                  type="button"
                                  className="btn-dash-approve"
                                  style={{ padding: '8px 16px', fontSize: '13px', fontWeight: '800' }}
                                  onClick={() => handleUpdateAppStatus(app._id, 'accepted')}
                                >
                                  ✓ Accepter le Joueur
                                </button>
                              )}

                              <button
                                type="button"
                                className="btn-dash-approve"
                                style={{ padding: '6px 14px', fontSize: '12px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid #38bdf8', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}
                                title="Discuter directement avec le candidat"
                                onClick={() => handleStartChatWithCandidate(app)}
                              >
                                <MessageSquare size={14} /> Discuter
                              </button>

                              {app.status !== 'rejected' && (
                                <button
                                  type="button"
                                  className="btn-dash-reject"
                                  style={{ padding: '6px 14px', fontSize: '12px' }}
                                  onClick={() => handleUpdateAppStatus(app._id, 'rejected')}
                                >
                                  Refuser
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: GESTION DES JOUEURS */}
          {activeNav === 'Gestion des Joueurs' && (
            <div className="dash-card">
              <div className="dash-card-header">
                <div>
                  <span className="dash-card-title">Gestion de l'Équipe & Rosters</span>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Joueurs officiels du roster et candidatures reçues</div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    type="button"
                    className={`dash-subtab-btn ${playerSubTab === 'roster' ? 'active' : ''}`}
                    onClick={() => setPlayerSubTab('roster')}
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                  >
                    Roster Officiel ({playersList.length})
                  </button>
                  <button 
                    type="button"
                    className={`dash-subtab-btn ${playerSubTab === 'candidatures' ? 'active' : ''}`}
                    onClick={() => setPlayerSubTab('candidatures')}
                    style={{ fontSize: '12px', padding: '6px 12px', position: 'relative' }}
                  >
                    Candidatures ({recruitmentList.length})
                    {pendingAppsCount > 0 && (
                      <span style={{
                        background: 'var(--red-primary)',
                        color: '#fff',
                        fontSize: '10px',
                        fontWeight: '800',
                        padding: '1px 5px',
                        borderRadius: '8px',
                        marginLeft: '4px'
                      }}>
                        {pendingAppsCount}
                      </span>
                    )}
                  </button>
                  <button 
                    className="btn-rejoindre" 
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', fontSize: '12px' }}
                    onClick={() => setShowPlayerModal(true)}
                  >
                    <Plus size={15} /> Ajouter un Joueur
                  </button>
                </div>
              </div>

              {/* SOUS-ONGLET JOUEURS DU ROSTER */}
              {playerSubTab === 'roster' && (

              <div className="dash-list-col">
                {playersList.length === 0 ? (
                  <div className="dash-empty-state">
                    Aucun joueur dans le roster pour le moment. Cliquez sur "Ajouter un Joueur" pour constituer votre équipe !
                  </div>
                ) : (
                  playersList.map((p) => (
                    <div className="dash-list-item-row" key={p._id}>
                      <div className="dash-item-left">
                        <img src={p.avatar} alt={p.gamertag} className="dash-avatar-tiny" />
                        <div>
                          <div className="dash-item-title">{p.gamertag} ({p.game})</div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>
                            Nom réel: {p.realName || '-'} | Rôle: {p.role} | Rang: {p.rank} {p.socialLinks?.discord ? `| Discord: ${p.socialLinks.discord}` : ''}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          type="button"
                          className="btn-dash-approve"
                          style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid #38bdf8', color: '#38bdf8' }}
                          title="Envoyer un message / Discuter avec ce joueur"
                          onClick={() => handleStartChatWithPlayer(p)}
                        >
                          <MessageSquare size={14} /> Discuter
                        </button>
                        <button 
                          className="dash-more-btn"
                          onClick={async () => {
                            if (window.confirm(`Supprimer le joueur ${p.gamertag} ?`)) {
                              await API.delete(`/players/${p._id}`);
                              fetchAllData();
                            }
                          }}
                          title="Supprimer joueur"
                        >
                          <Trash2 size={16} color="#ff4d4d" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              )}

              {/* SOUS-ONGLET CANDIDATURES RECUES DANS GESTION DES JOUEURS */}
              {playerSubTab === 'candidatures' && (
                <div className="dash-list-col">
                  {recruitmentList.length === 0 ? (
                    <div className="dash-empty-state" style={{ padding: '30px 20px' }}>
                      Aucune candidature reçue pour le moment.
                    </div>
                  ) : (
                    recruitmentList.map((app) => (
                      <div className="dash-list-item-row" key={app._id} style={{ alignItems: 'flex-start' }}>
                        <div className="dash-item-left" style={{ alignItems: 'flex-start', flex: 1 }}>
                          <div className="dash-avatar-tiny" style={{ background: '#1c2233', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: '700' }}>
                            {app.gamertag?.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span className="dash-item-title">{app.gamertag} ({app.game})</span>
                              <span style={{
                                fontSize: '10px',
                                fontWeight: '800',
                                padding: '1px 6px',
                                borderRadius: '4px',
                                background: app.status === 'accepted' ? 'rgba(74, 222, 128, 0.15)' : app.status === 'rejected' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(251, 191, 36, 0.15)',
                                color: app.status === 'accepted' ? '#4ade80' : app.status === 'rejected' ? '#f87171' : '#fbbf24',
                                border: `1px solid ${app.status === 'accepted' ? '#4ade80' : app.status === 'rejected' ? '#f87171' : '#fbbf24'}`
                              }}>
                                {app.status === 'accepted' ? 'ACCEPTÉ' : app.status === 'rejected' ? 'REFUSÉ' : 'EN ATTENTE'}
                              </span>
                            </div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                              Email: {app.email} • Discord: {app.discordTag || '-'} • Rang: {app.rank} • Rôle: {app.rolePreference || app.role || 'Flexible'} • Âge: {app.age} ans
                            </div>
                            <div style={{ fontSize: '12px', color: '#cbd5e1', background: '#090d16', padding: '8px 12px', borderRadius: '6px', marginTop: '6px' }}>
                              "{app.experience}"
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {app.status !== 'accepted' && (
                            <button
                              type="button"
                              className="btn-dash-approve"
                              style={{ padding: '6px 14px', fontSize: '12px', fontWeight: '800' }}
                              onClick={() => handleUpdateAppStatus(app._id, 'accepted')}
                            >
                              Accepter
                            </button>
                          )}
                          <button
                            type="button"
                            className="btn-dash-approve"
                            style={{ padding: '6px 14px', fontSize: '12px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid #38bdf8', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}
                            onClick={() => handleStartChatWithCandidate(app)}
                          >
                            <MessageSquare size={13} /> Discuter
                          </button>
                          {app.status !== 'rejected' && (
                            <button
                              type="button"
                              className="btn-dash-reject"
                              style={{ padding: '6px 14px', fontSize: '12px' }}
                              onClick={() => handleUpdateAppStatus(app._id, 'rejected')}
                            >
                              Refuser
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: TOURNOIS */}
          {activeNav === 'Tournois' && (
            <div className="dash-card">
              <div className="dash-card-header">
                <span className="dash-card-title">Tous les Matchs & Tournois ({matches.length})</span>
                <button 
                  className="btn-rejoindre" 
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 16px' }}
                  onClick={() => setShowMatchModal(true)}
                >
                  <Plus size={16} /> Programmer un Match
                </button>
              </div>
              <div className="dash-list-col">
                {matches.map((m) => (
                  <div className="dash-list-item-row" key={m._id}>
                    <div className="dash-item-left">
                      <div className="dash-wolf-badge-tiny">
                        <WolfLogo size={18} />
                      </div>
                      <div>
                        <div className="dash-item-title">{m.game} vs {m.opponent}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>Statut: {m.status} | Date: {new Date(m.matchDate).toLocaleDateString('fr-FR')}</div>
                      </div>
                    </div>
                    <button 
                      className="dash-more-btn"
                      onClick={async () => {
                        if (window.confirm('Supprimer ce match ?')) {
                          await API.delete(`/matches/${m._id}`);
                          fetchAllData();
                        }
                      }}
                    >
                      <Trash2 size={16} color="#ff4d4d" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: ACTUALITES */}
          {activeNav === 'Actualités' && (
            <div className="dash-card">
              <div className="dash-card-header">
                <span className="dash-card-title">Articles Publiés ({newsList.length})</span>
                <button 
                  className="btn-rejoindre" 
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 16px' }}
                  onClick={() => setShowNewsModal(true)}
                >
                  <Plus size={16} /> Écrire un Article
                </button>
              </div>
              <div className="dash-list-col">
                {newsList.map((n) => (
                  <div className="dash-list-item-row" key={n._id}>
                    <div className="dash-item-left">
                      <img src={n.coverImage || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=150&q=80'} alt="" className="dash-avatar-tiny" />
                      <div>
                        <div className="dash-item-title">{n.title}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>Catégorie: {n.category} | {new Date(n.createdAt).toLocaleDateString('fr-FR')}</div>
                      </div>
                    </div>
                    <button 
                      className="dash-more-btn"
                      onClick={async () => {
                        if (window.confirm('Supprimer cet article ?')) {
                          await API.delete(`/news/${n._id}`);
                          fetchAllData();
                        }
                      }}
                    >
                      <Trash2 size={16} color="#ff4d4d" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: PARAMETRES */}
          {activeNav === 'Paramètres' && (
            <div className="dash-card">
              <div className="dash-card-header">
                <span className="dash-card-title">Paramètres de la Plateforme</span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6' }}>
                Plateforme Dark Wolf Team connectée à la base de données MongoDB.<br />
                Comptes administrateurs et joueurs protégés. Système de notifications et messagerie instantanée actifs.
              </p>
            </div>
          )}

        </main>
      </div>

      {/* MODAL: AJOUTER / MODIFIER PRODUIT */}
      {showProductModal && (
        <div className="dash-modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setShowProductModal(false); }}>
          <div className="dash-modal-box dash-modal-box-lg">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 className="dash-modal-title" style={{ margin: 0 }}>
                  {editingProduct ? 'Modifier le Produit' : 'Ajouter un Produit à la Boutique'}
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
                  Téléversez la photo depuis votre PC et configurez les détails de l'article
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => setShowProductModal(false)}
                className="dash-more-btn"
                style={{ padding: '6px' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct}>
              {/* SECTION 1: PHOTO DU PRODUIT DEPUIS LE PC */}
              <div className="dash-form-group">
                <label className="dash-form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Photo du produit (Depuis votre PC) *</span>
                  {uploadingImage && <span style={{ color: 'var(--red-primary)' }}>Téléversement en cours...</span>}
                </label>

                {/* Input file caché déclenché au clic */}
                <input 
                  type="file" 
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/jpg, image/webp, image/gif, image/avif" 
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleUploadImageFile(e.target.files[0]);
                  }}
                />

                {productFormData.image ? (
                  <div className="product-upload-preview-card">
                    <img 
                      src={getImageUrl(productFormData.image)} 
                      alt="Aperçu produit" 
                      className="product-upload-thumbnail"
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', color: '#fff', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle2 size={16} color="#22c55e" /> Image prête pour la boutique
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>
                        Fichier hébergé sur le serveur DWT
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                        <button 
                          type="button"
                          className="btn-dash-approve"
                          style={{ padding: '4px 10px', fontSize: '12px' }}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Changer la photo
                        </button>
                        <button 
                          type="button"
                          className="btn-dash-reject"
                          style={{ padding: '4px 10px', fontSize: '12px' }}
                          onClick={() => setProductFormData(prev => ({ ...prev, image: '' }))}
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div 
                    className={`product-upload-zone ${isDragOver ? 'drag-active' : ''}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragOver(false);
                      if (e.dataTransfer.files?.[0]) handleUploadImageFile(e.dataTransfer.files[0]);
                    }}
                  >
                    <div className="product-upload-icon-circle">
                      {uploadingImage ? <RefreshCw className="animate-spin" size={24} /> : <Upload size={24} />}
                    </div>
                    <div>
                      <div style={{ color: '#fff', fontWeight: '700', fontSize: '14px' }}>
                        {uploadingImage ? 'Téléversement de la photo...' : 'Cliquez ici ou glissez votre photo depuis votre PC'}
                      </div>
                      <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>
                        Formats acceptés : PNG, JPG, JPEG, WEBP, AVIF (Max 15 Mo)
                      </div>
                    </div>
                  </div>
                )}

                {uploadError && (
                  <div style={{ color: '#ff4d4d', fontSize: '12px', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertTriangle size={14} /> {uploadError}
                  </div>
                )}
              </div>

              {/* SECTION 2: INFOS PRINCIPALES */}
              <div className="dash-form-group">
                <label className="dash-form-label">Nom du produit *</label>
                <input 
                  type="text" 
                  className="dash-form-input" 
                  value={productFormData.name}
                  onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                  placeholder="Ex: Maillot Officiel DWT 2026 - Black Wolf Edition" 
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="dash-form-group">
                  <label className="dash-form-label">Catégorie *</label>
                  <select 
                    className="dash-form-select"
                    value={productFormData.category}
                    onChange={(e) => setProductFormData({ ...productFormData, category: e.target.value })}
                    required
                  >
                    {categoriesList.map(cat => (
                      <option key={cat._id} value={cat.name}>{cat.name}</option>
                    ))}
                    {!categoriesList.some(c => c.name === productFormData.category) && (
                      <option value={productFormData.category}>{productFormData.category}</option>
                    )}
                  </select>
                </div>

                <div className="dash-form-group">
                  <label className="dash-form-label">Quantité en Stock *</label>
                  <input 
                    type="number" 
                    min="0"
                    className="dash-form-input" 
                    value={productFormData.stockCount}
                    onChange={(e) => setProductFormData({ ...productFormData, stockCount: e.target.value })}
                    placeholder="Ex: 25" 
                    required 
                  />
                </div>
              </div>

              {/* SECTION 3: PRIX & REMISE */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="dash-form-group">
                  <label className="dash-form-label">Prix de vente (DT) *</label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    className="dash-form-input" 
                    value={productFormData.price}
                    onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })}
                    placeholder="Ex: 69.99" 
                    required 
                  />
                </div>

                <div className="dash-form-group">
                  <label className="dash-form-label">Prix Barré / Comparatif (DT)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    className="dash-form-input" 
                    value={productFormData.comparePrice}
                    onChange={(e) => setProductFormData({ ...productFormData, comparePrice: e.target.value })}
                    placeholder="Ex: 89.99 (Optionnel)" 
                  />
                </div>
              </div>

              {/* Badge dynamique de remise */}
              {Number(productFormData.comparePrice) > Number(productFormData.price) && Number(productFormData.price) > 0 && (
                <div style={{ 
                  background: 'rgba(230, 0, 0, 0.12)', 
                  border: '1px solid rgba(230, 0, 0, 0.3)', 
                  borderRadius: '6px', 
                  padding: '8px 12px', 
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  color: '#fff'
                }}>
                  <span style={{ 
                    background: 'var(--red-primary)', 
                    color: '#fff', 
                    padding: '2px 8px', 
                    borderRadius: '4px', 
                    fontWeight: '800', 
                    fontSize: '11px' 
                  }}>
                    -{Math.round(((Number(productFormData.comparePrice) - Number(productFormData.price)) / Number(productFormData.comparePrice)) * 100)}%
                  </span>
                  <span>
                    Économie de <strong>{(Number(productFormData.comparePrice) - Number(productFormData.price)).toFixed(2)} DT</strong> pour l'acheteur
                  </span>
                </div>
              )}

              {/* SECTION 4: TAILLES DISPONIBLES */}
              <div className="dash-form-group">
                <label className="dash-form-label">
                  Tailles disponibles (Cliquez pour activer/désactiver)
                </label>
                <div className="size-selector-pills">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Unique'].map((sz) => {
                    const isSelected = Array.isArray(productFormData.sizes) && productFormData.sizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        className={`size-pill-btn ${isSelected ? 'active' : ''}`}
                        onClick={() => handleToggleSize(sz)}
                      >
                        {sz} {isSelected && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 5: DESCRIPTION */}
              <div className="dash-form-group">
                <label className="dash-form-label">Description détaillée du produit *</label>
                <textarea 
                  rows={4} 
                  className="dash-form-textarea" 
                  value={productFormData.description}
                  onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                  placeholder="Composition 100% respirante, coupe sportive officielle Dark Wolf Team, flocage résistant..." 
                  required 
                />
              </div>

              {/* SECTION 6: EN VEDETTE */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', background: '#0a0d14', padding: '12px 14px', borderRadius: '8px', border: '1px solid #1a2030' }}>
                <input 
                  type="checkbox" 
                  id="isFeaturedProd"
                  style={{ width: '18px', height: '18px', accentColor: 'var(--red-primary)', cursor: 'pointer' }}
                  checked={productFormData.isFeatured}
                  onChange={(e) => setProductFormData({ ...productFormData, isFeatured: e.target.checked })}
                />
                <label htmlFor="isFeaturedProd" style={{ fontSize: '14px', color: '#fff', cursor: 'pointer', userSelect: 'none' }}>
                  <strong>Mettre ce produit en vedette</strong> sur la page d'accueil (Scoop Boutique DWT)
                </label>
              </div>

              <div className="dash-modal-btn-row">
                <button type="button" className="btn-dash-approve" onClick={() => setShowProductModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn-dash-reject" disabled={uploadingImage}>
                  {editingProduct ? 'Mettre à jour le Produit' : 'Publier dans la Boutique 🛍️'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NOUVELLE CATEGORIE */}
      {showCategoryModal && (
        <div className="dash-modal-backdrop">
          <div className="dash-modal-box" style={{ maxWidth: '440px' }}>
            <h3 className="dash-modal-title">Nouvelle Catégorie de Boutique</h3>
            <form onSubmit={handleCreateCategory}>
              <div className="dash-form-group">
                <label className="dash-form-label">Nom de la catégorie *</label>
                <input 
                  type="text" 
                  className="dash-form-input" 
                  value={categoryFormData.name}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                  placeholder="Ex: Casquettes, Goodies, Claviers..." 
                  required 
                />
              </div>

              <div className="dash-form-group">
                <label className="dash-form-label">Description</label>
                <input 
                  type="text" 
                  className="dash-form-input" 
                  value={categoryFormData.description}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                  placeholder="Bref descriptif..." 
                />
              </div>

              <div className="dash-modal-btn-row">
                <button type="button" className="btn-dash-approve" onClick={() => setShowCategoryModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn-dash-reject">
                  Créer Catégorie
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PUBLIER UNE ACTUALITE */}
      {showNewsModal && (
        <div className="dash-modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setShowNewsModal(false); }}>
          <div className="dash-modal-box dash-modal-box-lg" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 className="dash-modal-title" style={{ margin: 0 }}>Publier une Actualité</h3>
              <button 
                type="button" 
                onClick={() => setShowNewsModal(false)}
                className="dash-more-btn"
                style={{ padding: '6px' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateNews}>
              {/* SECTION: IMAGE DE COUVERTURE DEPUIS LE PC */}
              <div className="dash-form-group">
                <label className="dash-form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Image de couverture / Bannière (Depuis votre PC)</span>
                  {uploadingNewsImage && <span style={{ color: 'var(--red-primary)' }}>Téléversement en cours...</span>}
                </label>

                {/* Input file caché déclenché au clic */}
                <input 
                  type="file" 
                  ref={newsFileInputRef}
                  accept="image/png, image/jpeg, image/jpg, image/webp, image/gif, image/avif" 
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleUploadNewsImageFile(e.target.files[0]);
                  }}
                />

                {newsFormData.coverImage ? (
                  <div className="product-upload-preview-card">
                    <img 
                      src={getImageUrl(newsFormData.coverImage)} 
                      alt="Aperçu article" 
                      className="product-upload-thumbnail"
                      style={{ width: '130px', height: '75px', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', color: '#fff', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle2 size={16} color="#22c55e" /> Image prête pour la publication
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>
                        Fichier hébergé pour la Gazette DWT
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                        <button 
                          type="button"
                          className="btn-dash-approve"
                          style={{ padding: '4px 10px', fontSize: '12px' }}
                          onClick={() => newsFileInputRef.current?.click()}
                        >
                          Changer l'image
                        </button>
                        <button 
                          type="button"
                          className="btn-dash-reject"
                          style={{ padding: '4px 10px', fontSize: '12px' }}
                          onClick={() => setNewsFormData(prev => ({ ...prev, coverImage: '' }))}
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div 
                    className={`product-upload-zone ${isNewsDragOver ? 'drag-active' : ''}`}
                    onClick={() => newsFileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setIsNewsDragOver(true); }}
                    onDragLeave={() => setIsNewsDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsNewsDragOver(false);
                      if (e.dataTransfer.files?.[0]) handleUploadNewsImageFile(e.dataTransfer.files[0]);
                    }}
                  >
                    <div className="product-upload-icon-circle">
                      {uploadingNewsImage ? <RefreshCw className="animate-spin" size={24} /> : <Upload size={24} />}
                    </div>
                    <div>
                      <div style={{ color: '#fff', fontWeight: '700', fontSize: '14px' }}>
                        {uploadingNewsImage ? 'Téléversement de la photo...' : 'Cliquez ici ou glissez votre photo depuis votre PC'}
                      </div>
                      <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>
                        Formats acceptés : PNG, JPG, JPEG, WEBP, AVIF (Max 15 Mo)
                      </div>
                    </div>
                  </div>
                )}

                {newsUploadError && (
                  <div style={{ color: '#ff4d4d', fontSize: '12px', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertTriangle size={14} /> {newsUploadError}
                  </div>
                )}
              </div>

              <div className="dash-form-group">
                <label className="dash-form-label">Titre de l'article *</label>
                <input 
                  type="text" 
                  className="dash-form-input" 
                  value={newsFormData.title}
                  onChange={(e) => setNewsFormData({ ...newsFormData, title: e.target.value })}
                  placeholder="Ex: Victoire éclatante contre Tunisia Esports" 
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="dash-form-group">
                  <label className="dash-form-label">Catégorie</label>
                  <select 
                    className="dash-form-select"
                    value={newsFormData.category}
                    onChange={(e) => setNewsFormData({ ...newsFormData, category: e.target.value })}
                  >
                    <option value="Tournoi">Tournoi</option>
                    <option value="Esport">Esport</option>
                    <option value="Annonce">Annonce</option>
                    <option value="Recrutement">Recrutement</option>
                    <option value="Mise à jour">Mise à jour</option>
                    <option value="Communauté">Communauté</option>
                  </select>
                </div>

                <div className="dash-form-group">
                  <label className="dash-form-label">Jeu concerné</label>
                  <input 
                    type="text" 
                    className="dash-form-input" 
                    value={newsFormData.game}
                    onChange={(e) => setNewsFormData({ ...newsFormData, game: e.target.value })}
                    placeholder="CS2, Valorant, LoL, etc." 
                  />
                </div>
              </div>

              <div className="dash-form-group">
                <label className="dash-form-label">Résumé court *</label>
                <input 
                  type="text" 
                  className="dash-form-input" 
                  value={newsFormData.summary}
                  onChange={(e) => setNewsFormData({ ...newsFormData, summary: e.target.value })}
                  placeholder="Bref résumé accrocheur..." 
                  required 
                />
              </div>

              <div className="dash-form-group">
                <label className="dash-form-label">Contenu complet de l'article *</label>
                <textarea 
                  rows={5} 
                  className="dash-form-textarea" 
                  value={newsFormData.content}
                  onChange={(e) => setNewsFormData({ ...newsFormData, content: e.target.value })}
                  placeholder="Rédigez ici le compte rendu..." 
                  required 
                />
              </div>

              <div className="dash-modal-btn-row">
                <button type="button" className="btn-dash-approve" onClick={() => setShowNewsModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn-dash-reject" disabled={newsSubmitting || uploadingNewsImage}>
                  {newsSubmitting ? 'Publication...' : 'Publier Maintenant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PROGRAMMER UN MATCH */}
      {showMatchModal && (
        <div className="dash-modal-backdrop">
          <div className="dash-modal-box">
            <h3 className="dash-modal-title">Programmer un Match</h3>
            <form onSubmit={handleCreateMatch}>
              <div className="dash-form-group">
                <label className="dash-form-label">Jeu (ex: CS2, VALORANT, LoL)</label>
                <input 
                  type="text" 
                  className="dash-form-input" 
                  value={matchFormData.game}
                  onChange={(e) => setMatchFormData({ ...matchFormData, game: e.target.value })}
                  required 
                />
              </div>
              <div className="dash-form-group">
                <label className="dash-form-label">Adversaire</label>
                <input 
                  type="text" 
                  className="dash-form-input" 
                  value={matchFormData.opponent}
                  onChange={(e) => setMatchFormData({ ...matchFormData, opponent: e.target.value })}
                  required 
                />
              </div>
              <div className="dash-form-group">
                <label className="dash-form-label">Date et Heure</label>
                <input 
                  type="datetime-local" 
                  className="dash-form-input" 
                  value={matchFormData.matchDate}
                  onChange={(e) => setMatchFormData({ ...matchFormData, matchDate: e.target.value })}
                  required 
                />
              </div>
              <div className="dash-modal-btn-row">
                <button type="button" className="btn-dash-approve" onClick={() => setShowMatchModal(false)}>Annuler</button>
                <button type="submit" className="btn-dash-reject">Programmer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: AJOUTER UN JOUEUR */}
      {showPlayerModal && (
        <div className="dash-modal-backdrop">
          <div className="dash-modal-box">
            <h3 className="dash-modal-title">Ajouter un Joueur au Roster</h3>
            <form onSubmit={handleCreatePlayer}>
              <div className="dash-form-group">
                <label className="dash-form-label">Gamertag (Pseudo)</label>
                <input 
                  type="text" 
                  className="dash-form-input" 
                  value={playerFormData.gamertag}
                  onChange={(e) => setPlayerFormData({ ...playerFormData, gamertag: e.target.value })}
                  required 
                />
              </div>
              <div className="dash-form-group">
                <label className="dash-form-label">Nom réel</label>
                <input 
                  type="text" 
                  className="dash-form-input" 
                  value={playerFormData.realName}
                  onChange={(e) => setPlayerFormData({ ...playerFormData, realName: e.target.value })}
                  required 
                />
              </div>
              <div className="dash-form-group">
                <label className="dash-form-label">Jeu</label>
                <input 
                  type="text" 
                  className="dash-form-input" 
                  value={playerFormData.game}
                  onChange={(e) => setPlayerFormData({ ...playerFormData, game: e.target.value })}
                  required 
                />
              </div>
              <div className="dash-form-group">
                <label className="dash-form-label">Rôle</label>
                <input 
                  type="text" 
                  className="dash-form-input" 
                  value={playerFormData.role}
                  onChange={(e) => setPlayerFormData({ ...playerFormData, role: e.target.value })}
                  required 
                />
              </div>
              <div className="dash-modal-btn-row">
                <button type="button" className="btn-dash-approve" onClick={() => setShowPlayerModal(false)}>Annuler</button>
                <button type="submit" className="btn-dash-reject">Ajouter Joueur</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REPONDRE PAR EMAIL A UN MESSAGE DE CONTACT */}
      {showReplyModal && selectedContact && (
        <div className="dash-modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setShowReplyModal(false); }}>
          <div className="dash-modal-box" style={{ maxWidth: '620px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 className="dash-modal-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Reply size={20} color="var(--red-primary)" /> Répondre à {selectedContact.name}
                </h3>
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                  Email de destination : <strong style={{ color: '#38bdf8' }}>{selectedContact.email}</strong>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setShowReplyModal(false)}
                className="dash-more-btn"
                style={{ padding: '6px' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{
              background: '#0a0e17',
              border: '1px solid #1c2438',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '13px'
            }}>
              <div style={{ color: '#94a3b8', marginBottom: '4px' }}>
                <strong>Sujet d'origine :</strong> {selectedContact.subject}
              </div>
              <div style={{ color: '#cbd5e1', fontStyle: 'italic', maxHeight: '100px', overflowY: 'auto' }}>
                "{selectedContact.message}"
              </div>
            </div>

            <form onSubmit={handleSendContactReply}>
              <div className="dash-form-group">
                <label className="dash-form-label">Votre Réponse Officielle (Envoyée par email) *</label>
                <textarea
                  className="dash-form-textarea"
                  rows={6}
                  placeholder="Bonjour, nous avons bien reçu votre demande concernant..."
                  value={replyEmailText}
                  onChange={(e) => setReplyEmailText(e.target.value)}
                  style={{ width: '100%', resize: 'vertical' }}
                  required
                />
              </div>

              <div className="dash-modal-btn-row" style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button 
                  type="button" 
                  className="btn-dash-approve" 
                  style={{ background: '#1c2438', color: '#fff', border: '1px solid #334155' }}
                  onClick={() => setShowReplyModal(false)}
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="auth-submit-btn" 
                  style={{ width: 'auto', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}
                  disabled={sendingReply}
                >
                  <Send size={16} />
                  <span>{sendingReply ? 'Envoi de l\'email...' : 'Envoyer la Réponse par Email'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboardPage;
