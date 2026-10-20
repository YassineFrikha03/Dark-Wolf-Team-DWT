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
  Inbox,
  Gamepad2,
  SlidersHorizontal,
  LogOut,
  Film,
  Star,
  Play,
  Sparkles
} from 'lucide-react';
import { WolfLogo } from '../components/WolfLogo';
import { CyberConfirmModal } from '../components/CyberConfirmModal';
import { CyberToast } from '../components/CyberToast';
import API from '../services/api';
import { getImageUrl } from '../utils/imageUrl';
import { useAuth } from '../context/AuthContext';

const AdminDashboardPage = ({ onBackToSite, onLogout }) => {
  const { logout } = useAuth();
  const [activeNav, setActiveNav] = useState('Tableau de Bord');
  const [shopSubTab, setShopSubTab] = useState('revenue'); // revenue, products, stocks, categories, orders
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    openConfirm({
      title: 'DÉCONNEXION ADMINISTRATEUR',
      message: 'Voulez-vous vraiment vous déconnecter de votre compte administrateur ?',
      subtext: 'Vous serez redirigé vers l\'accueil du site en tant qu\'utilisateur déconnecté.',
      confirmText: 'Se déconnecter',
      cancelText: 'Rester connecté',
      type: 'danger',
      onConfirm: () => {
        if (onLogout) {
          onLogout();
        } else {
          logout?.();
          onBackToSite ? onBackToSite() : (window.location.href = '/');
        }
      }
    });
  };
  
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
  const [gamesList, setGamesList] = useState([]);
  const [slidesList, setSlidesList] = useState([]);

  // Gestion des Vidéos, Trailers & Pubs
  const [videosList, setVideosList] = useState([]);
  const [videoFilter, setVideoFilter] = useState('all');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [videoFormData, setVideoFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    category: 'trailer',
    videoUrl: '',
    thumbnail: '',
    duration: '02:30',
    views: '125K vues',
    badge: 'TRAILER OFFICIEL',
    isMainTrailer: false,
    ctaText: 'Découvrir',
    ctaLink: '#shop',
    order: 0,
    isActive: true
  });
  const [videoSourceMode, setVideoSourceMode] = useState('upload'); // 'upload' | 'youtube'
  const [uploadingVideoFile, setUploadingVideoFile] = useState(false);
  const [videoFileUploadProgress, setVideoFileUploadProgress] = useState(0);
  const [videoFileUploadError, setVideoFileUploadError] = useState('');
  const [isVideoFileDragOver, setIsVideoFileDragOver] = useState(false);
  const videoMediaFileInputRef = useRef(null);
  const [uploadingVideoImage, setUploadingVideoImage] = useState(false);
  const [videoUploadError, setVideoUploadError] = useState('');
  const [isVideoDragOver, setIsVideoDragOver] = useState(false);
  const [previewVideoModal, setPreviewVideoModal] = useState(null);
  const videoFileInputRef = useRef(null);
  const [revenueStats, setRevenueStats] = useState(null);

  // Modals & Gestion du Musée (Archive DWT)
  const [museumList, setMuseumList] = useState([]);
  const [showMuseumModal, setShowMuseumModal] = useState(false);
  const [editingMuseumItem, setEditingMuseumItem] = useState(null);
  const [museumFormData, setMuseumFormData] = useState({
    name: '',
    cat: 'Pro Kit',
    year: '2023',
    price: 'TND 89',
    image: '',
    desc: '',
    order: 0,
    isActive: true
  });
  const [uploadingMuseumImage, setUploadingMuseumImage] = useState(false);
  const [museumUploadError, setMuseumUploadError] = useState('');
  const [isMuseumDragOver, setIsMuseumDragOver] = useState(false);
  const museumFileInputRef = useRef(null);

  // Filtre équipe / jeu pour gestion des joueurs
  const [selectedPlayerGameFilter, setSelectedPlayerGameFilter] = useState('Tous');

  // Messages de contact (page /contact)
  const [contactMessages, setContactMessages] = useState([]);
  const [contactUnreadCount, setContactUnreadCount] = useState(0);
  const [msgSubTab, setMsgSubTab] = useState('chat'); // 'chat', 'contact', 'candidatures'
  const [playerSubTab, setPlayerSubTab] = useState('roster'); // 'roster' ou 'candidatures'
  const [selectedContact, setSelectedContact] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyEmailText, setReplyEmailText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  // Notifications & Confirmations Cyber Design System
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const [showNotifPopup, setShowNotifPopup] = useState(false);
  const notifRef = useRef(null);

  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    subtext: '',
    confirmText: 'Confirmer',
    cancelText: 'Annuler',
    type: 'danger',
    onConfirm: null,
    loading: false
  });

  const showToast = (text, type = 'success', duration = 4000) => {
    setToast({ id: Date.now(), text, type, duration });
  };

  const closeConfirm = () => {
    setConfirmDialog((prev) => ({ ...prev, isOpen: false, loading: false }));
  };

  const openConfirm = ({
    title,
    message,
    subtext,
    confirmText = 'Confirmer',
    cancelText = 'Annuler',
    type = 'danger',
    onConfirm
  }) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      subtext,
      confirmText,
      cancelText,
      type,
      onConfirm: async () => {
        try {
          setConfirmDialog((prev) => ({ ...prev, loading: true }));
          await onConfirm?.();
        } finally {
          closeConfirm();
        }
      },
      loading: false
    });
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

  // Messagerie Admin <-> Joueurs
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [chatFilterRole, setChatFilterRole] = useState('all'); // 'all', 'player', 'user'
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
    images: [],
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

  const [editingPlayer, setEditingPlayer] = useState(null);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [playerFormData, setPlayerFormData] = useState({
    gamertag: '',
    realName: '',
    game: 'Valorant',
    team: 'Équipe Principale',
    role: 'Dueliste / Entry',
    rank: 'Radiant',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=400&q=80'
  });

  const [showMatchModal, setShowMatchModal] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const [matchFormData, setMatchFormData] = useState({
    tournamentName: 'DWT Championship 2026',
    game: 'CS2',
    opponent: 'Tunisia Esports',
    matchDate: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    format: 'BO3',
    status: 'upcoming',
    streamUrl: 'https://www.twitch.tv/darkw0lfteam',
    scoreDWT: 0,
    scoreOpponent: 0
  });

  // Modals Jeux & Affiches
  const [showGameModal, setShowGameModal] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [gameFormData, setGameFormData] = useState({
    name: '',
    logo: '',
    color: '#ff4655',
    mem: '5 Players',
    posterImage: '',
    description: '',
    order: 0,
    isActive: true
  });
  const [uploadingGamePoster, setUploadingGamePoster] = useState(false);
  const [gameUploadError, setGameUploadError] = useState('');
  const [isGameDragOver, setIsGameDragOver] = useState(false);
  const gameFileInputRef = useRef(null);

  // Modals Affiches Cinématiques (Hero Slider)
  const [showSlideModal, setShowSlideModal] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [slideFormData, setSlideFormData] = useState({
    title: '',
    subtitle: '',
    label: 'Collection Officielle',
    backgroundImage: '',
    btn1Text: 'Shop Collection',
    btn1Target: '#shop',
    btn2Text: 'Meet the Pack',
    btn2Target: '#teams',
    order: 0,
    isActive: true
  });
  const [uploadingSlideImage, setUploadingSlideImage] = useState(false);
  const [slideUploadError, setSlideUploadError] = useState('');
  const [isSlideDragOver, setIsSlideDragOver] = useState(false);
  const slideFileInputRef = useRef(null);

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
        contactRes,
        gamesRes,
        slidesRes,
        museumRes,
        videosRes
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
        API.get('/contact').catch(() => ({ data: { messages: [], unreadCount: 0 } })),
        API.get('/games').catch(() => ({ data: { games: [] } })),
        API.get('/slides').catch(() => ({ data: { slides: [] } })),
        API.get('/museum/admin').catch(() => ({ data: { items: [] } })),
        API.get('/videos').catch(() => ({ data: { videos: [] } }))
      ]);

      const st = statsRes.data?.stats || {};
      const pls = playersRes.data?.players || [];
      const gms = gamesRes.data?.games || [];
      const slds = slidesRes.data?.slides || [];
      const mus = museumRes.data?.items || [];
      const vids = videosRes.data?.videos || [];
      const distinctGamesCount = gms.length || st.gamesCount || (new Set(pls.map(p => p.game)).size) || 3;

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
      setGamesList(gms);
      setSlidesList(slds);
      setMuseumList(mus);
      setVideosList(vids);
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
      showToast(err.response?.data?.message || 'Erreur lors de l\'envoi du message', 'error');
    } finally {
      setSendingMsg(false);
    }
  };

  // Marquer une notification comme lue et naviguer vers la bonne vue
  const handleMarkNotifRead = async (notifId, notif) => {
    try {
      await API.put(`/notifications/${notifId}/read`);
      setNotifications(prev =>
        prev.map(n => (n._id === notifId ? { ...n, isRead: true } : n))
      );
      setUnreadNotifCount(prev => Math.max(0, prev - 1));

      if (notif.metadata?.applicationId || notif.title?.includes('Candidature')) {
        setActiveNav('Gestion des Joueurs');
        setPlayerSubTab('candidatures');
      } else if (notif.metadata?.contactId || notif.title?.includes('Contact')) {
        setActiveNav('Messagerie & Contact');
        setMsgSubTab('contact');
      } else if (notif.type === 'order' || notif.title?.includes('Commande')) {
        setActiveNav('Boutique & Ventes');
        setShopSubTab('orders');
      } else if (notif.type === 'message' || notif.title?.includes('Message')) {
        setActiveNav('Messagerie & Contact');
        setMsgSubTab('chat');
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
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadNotifCount(0);
      showToast('Toutes les notifications sont marquées comme lues ! 🐺✓', 'success');
    } catch (err) {
      console.error(err);
    }
  };

  // --- ACTIONS PRODUITS & BOUTIQUE ---
  const handleUploadProductImages = async (filesList) => {
    if (!filesList) return;
    const files = Array.from(filesList.length !== undefined ? filesList : [filesList]);
    if (files.length === 0) return;

    for (const f of files) {
      if (f.size > 15 * 1024 * 1024) {
        setUploadError(`Fichier "${f.name}" trop volumineux. Taille maximale : 15 Mo.`);
        return;
      }
      if (!f.type.startsWith('image/')) {
        setUploadError(`Fichier "${f.name}" : format non supporté. Veuillez choisir des images (JPG, PNG, WebP, etc.).`);
        return;
      }
    }

    setUploadingImage(true);
    setUploadError('');

    try {
      const uploadedUrls = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('image', file);
        const res = await API.post('/upload', formData);
        const uploadedPath = res.data?.fileUrl || res.data?.filePath || res.data?.file?.path || res.data?.file?.url;
        if (uploadedPath) {
          uploadedUrls.push(uploadedPath);
        }
      }

      if (uploadedUrls.length > 0) {
        setProductFormData(prev => {
          const current = Array.isArray(prev.images) ? [...prev.images] : (prev.image ? [prev.image] : []);
          const updated = [...current, ...uploadedUrls];
          return {
            ...prev,
            images: updated,
            image: updated[0] || ''
          };
        });
      } else {
        setUploadError('Réponse invalide du serveur de téléversement');
      }
    } catch (err) {
      console.error('Erreur upload:', err);
      setUploadError(err.response?.data?.message || 'Erreur lors du téléversement des photos');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveProductImage = (indexToRemove) => {
    setProductFormData(prev => {
      const current = Array.isArray(prev.images) ? [...prev.images] : (prev.image ? [prev.image] : []);
      const updated = current.filter((_, idx) => idx !== indexToRemove);
      return {
        ...prev,
        images: updated,
        image: updated[0] || ''
      };
    });
  };

  const handleSetMainProductImage = (indexToMakeMain) => {
    setProductFormData(prev => {
      const current = Array.isArray(prev.images) ? [...prev.images] : (prev.image ? [prev.image] : []);
      if (indexToMakeMain < 0 || indexToMakeMain >= current.length) return prev;
      const target = current.splice(indexToMakeMain, 1)[0];
      current.unshift(target);
      return {
        ...prev,
        images: current,
        image: current[0] || ''
      };
    });
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
    const imagesToSave = Array.isArray(productFormData.images) && productFormData.images.length > 0
      ? productFormData.images
      : (productFormData.image ? [productFormData.image] : []);

    if (imagesToSave.length === 0) {
      showToast('Veuillez téléverser au moins une photo pour le produit depuis votre PC avant d\'enregistrer 📷', 'error');
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
        images: imagesToSave,
        image: imagesToSave[0],
        isFeatured: productFormData.isFeatured
      };

      if (editingProduct) {
        await API.put(`/products/${editingProduct._id}`, payload);
        showToast('Produit mis à jour avec succès ! 🛍️', 'success');
      } else {
        await API.post('/products', payload);
        showToast('Produit ajouté à la boutique avec succès ! 🐺🛍️', 'success');
      }

      setShowProductModal(false);
      setEditingProduct(null);
      fetchAllData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Erreur lors de la sauvegarde du produit', 'error');
    }
  };

  const handleDeleteProduct = (prodId, prodName) => {
    openConfirm({
      title: 'Supprimer ce Produit ?',
      message: `Supprimer le produit "${prodName}" de la boutique ?`,
      subtext: 'Ce produit sera retiré du catalogue officiel et ne sera plus disponible à l\'achat.',
      confirmText: 'Supprimer Définitivement',
      type: 'danger',
      onConfirm: async () => {
        try {
          await API.delete(`/products/${prodId}`);
          setProductsList(prev => prev.filter(p => p._id !== prodId));
          showToast(`Produit "${prodName}" supprimé avec succès.`, 'success');
          fetchAllData();
        } catch (err) {
          showToast(err.response?.data?.message || 'Erreur lors de la suppression', 'error');
        }
      }
    });
  };

  const handleUpdateStockDelta = async (prodId, delta) => {
    try {
      const res = await API.patch(`/products/${prodId}/stock`, { delta });
      if (res.data?.success) {
        setProductsList(prev => prev.map(p => p._id === prodId ? res.data.product : p));
        showToast('Stock produit mis à jour ! 📦', 'success');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Erreur lors de l\'ajustement du stock', 'error');
    }
  };

  // --- ACTIONS CATEGORIES ---
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await API.post('/categories', categoryFormData);
      showToast('Catégorie ajoutée avec succès !', 'success');
      setShowCategoryModal(false);
      setCategoryFormData({ name: '', description: '' });
      fetchAllData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Erreur lors de la création de la catégorie', 'error');
    }
  };

  const handleDeleteCategory = (catId, catName) => {
    openConfirm({
      title: 'Supprimer la Catégorie ?',
      message: `Supprimer la catégorie "${catName}" ?`,
      subtext: 'Les produits associés seront réassignés.',
      confirmText: 'Supprimer la Catégorie',
      type: 'warning',
      onConfirm: async () => {
        try {
          await API.delete(`/categories/${catId}`);
          showToast('Catégorie supprimée avec succès.', 'success');
          fetchAllData();
        } catch (err) {
          showToast(err.response?.data?.message || 'Erreur lors de la suppression de la catégorie', 'error');
        }
      }
    });
  };

  // Actions Matchs, Actualités & Recrutement
  const handleApproveMatch = async (id) => {
    try {
      await API.put(`/matches/${id}`, { status: 'live' });
      setMatches(prev => prev.map(m => m._id === id ? { ...m, status: 'live' } : m));
      showToast('Match approuvé et passé en statut LIVE ! ⚔️', 'success');
    } catch (err) {
      showToast('Erreur lors de la mise à jour du match', 'error');
    }
  };

  const handleRejectMatch = (id) => {
    openConfirm({
      title: 'Rejeter ce Match ?',
      message: 'Voulez-vous rejeter et supprimer ce match officiel ?',
      subtext: 'Le match sera retiré des plannings et du calendrier officiel.',
      confirmText: 'Rejeter le Match',
      type: 'danger',
      onConfirm: async () => {
        try {
          await API.delete(`/matches/${id}`);
          setMatches(prev => prev.filter(m => m._id !== id));
          showToast('Match rejeté et retiré.', 'success');
        } catch (err) {
          showToast('Erreur lors du rejet du match', 'error');
        }
      }
    });
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      setStoreOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
      showToast(`Commande mise à jour en statut : ${newStatus}`, 'success');
      fetchAllData();
    } catch (err) {
      showToast('Erreur lors de la mise à jour de la commande', 'error');
    }
  };

  const handleUpdateAppStatus = async (appId, newStatus) => {
    try {
      const res = await API.put(`/applications/${appId}/status`, { status: newStatus });
      setRecruitmentList(prev => prev.map(a => a._id === appId ? { ...a, status: newStatus } : a));
      if (newStatus === 'accepted') {
        showToast(res.data?.message || 'Candidature acceptée ! Le joueur a été ajouté au roster officiel et son espace de communication est actif. 🐺🎮', 'success');
      } else {
        showToast(`Candidature mise à jour (${newStatus}).`, 'info');
      }
      fetchAllData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Erreur lors de la mise à jour de la candidature', 'error');
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
      showToast(`Réponse par email envoyée avec succès à ${selectedContact.email} ! 🐺✉️`, 'success');
      setShowReplyModal(false);
      setReplyEmailText('');
      setSelectedContact(null);
      fetchAllData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Erreur lors de l\'envoi de la réponse par email', 'error');
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

  const handleDeleteContact = (contactId) => {
    openConfirm({
      title: 'Supprimer ce Message ?',
      message: 'Voulez-vous vraiment supprimer ce message de contact ?',
      subtext: 'Cette action supprimera définitivement le message de vos archives.',
      confirmText: 'Supprimer le Message',
      type: 'danger',
      onConfirm: async () => {
        try {
          await API.delete(`/contact/${contactId}`);
          setContactMessages(prev => prev.filter(m => m._id !== contactId));
          showToast('Message de contact supprimé avec succès.', 'success');
          fetchAllData();
        } catch (err) {
          showToast('Erreur lors de la suppression', 'error');
        }
      }
    });
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

      const res = await API.post('/upload', formData);

      const uploadedPath = res.data?.fileUrl || res.data?.filePath || res.data?.file?.path || res.data?.file?.url;
      if (uploadedPath) {
        setNewsFormData(prev => ({
          ...prev,
          coverImage: uploadedPath
        }));
      } else {
        setNewsUploadError('Réponse invalide du serveur de téléversement');
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
      showToast('Actualité publiée avec succès ! 🐺📰', 'success');
      setShowNewsModal(false);
      setNewsFormData({ title: '', category: 'Annonce', game: 'Général', summary: '', content: '', coverImage: '' });
      setNewsUploadError('');
      fetchAllData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Erreur lors de la publication', 'error');
    } finally {
      setNewsSubmitting(false);
    }
  };

  const handleOpenCreatePlayer = (gameOverride = null) => {
    setEditingPlayer(null);
    const targetGame = (gameOverride && gameOverride !== 'Tous')
      ? gameOverride
      : (selectedPlayerGameFilter !== 'Tous' ? selectedPlayerGameFilter : (gamesList[0]?.name || 'Valorant'));
    setPlayerFormData({
      gamertag: '',
      realName: '',
      game: targetGame,
      team: 'Équipe Principale',
      role: 'Dueliste / Entry',
      rank: '',
      avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=400&q=80'
    });
    setShowPlayerModal(true);
  };

  const handleOpenEditPlayer = (p) => {
    setEditingPlayer(p);
    setPlayerFormData({
      gamertag: p.gamertag || '',
      realName: p.realName || '',
      game: p.game || 'Valorant',
      team: p.team || 'Équipe Principale',
      role: p.role || 'Titulaire',
      rank: p.rank || '',
      avatar: p.avatar || ''
    });
    setShowPlayerModal(true);
  };

  const handleSavePlayer = async (e) => {
    e.preventDefault();
    if (!playerFormData.gamertag?.trim()) {
      showToast('Veuillez saisir le gamertag du joueur', 'error');
      return;
    }
    try {
      if (editingPlayer) {
        await API.put(`/players/${editingPlayer._id}`, playerFormData);
        showToast(`Joueur ${playerFormData.gamertag} mis à jour avec succès ! 🐺🎮`, 'success');
      } else {
        await API.post('/players', playerFormData);
        showToast(`Joueur ${playerFormData.gamertag} ajouté à l'équipe ${playerFormData.game} ! 🐺🎮`, 'success');
      }
      setShowPlayerModal(false);
      setEditingPlayer(null);
      fetchAllData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Erreur lors de l\'enregistrement du joueur', 'error');
    }
  };

  const handleOpenCreateMatch = () => {
    setEditingMatch(null);
    setMatchFormData({
      tournamentName: 'DWT Championship 2026',
      game: 'Valorant',
      opponent: 'Gentle Mates Prospects',
      matchDate: new Date().toISOString().slice(0, 16),
      format: 'BO3',
      status: 'upcoming',
      streamUrl: 'https://www.twitch.tv/darkw0lfteam',
      scoreDWT: 0,
      scoreOpponent: 0
    });
    setShowMatchModal(true);
  };

  const handleOpenBroadcastMatch = (match) => {
    setEditingMatch(match);
    setMatchFormData({
      tournamentName: match.tournamentName || 'Tournoi Officiel DWT',
      game: match.game || 'Valorant',
      opponent: match.opponent || 'Adversaire',
      matchDate: match.matchDate ? new Date(match.matchDate).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
      format: match.format || 'BO3',
      status: match.status || 'live',
      streamUrl: match.streamUrl || 'https://www.twitch.tv/darkw0lfteam',
      scoreDWT: match.scoreDWT ?? 0,
      scoreOpponent: match.scoreOpponent ?? 0
    });
    setShowMatchModal(true);
  };

  const handleSaveMatch = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...matchFormData,
        scoreDWT: Number(matchFormData.scoreDWT || 0),
        scoreOpponent: Number(matchFormData.scoreOpponent || 0)
      };

      if (editingMatch) {
        await API.put(`/matches/${editingMatch._id}`, payload);
        showToast('Match et diffusion mis à jour avec succès ! ⚔️🔴', 'success');
      } else {
        await API.post('/matches', payload);
        showToast('Match programmé avec succès ! ⚔️', 'success');
      }
      setShowMatchModal(false);
      setEditingMatch(null);
      fetchAllData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Erreur lors de l\'enregistrement du match', 'error');
    }
  };

  const handleQuickScoreMatch = async (match, deltaDwt, deltaOpp) => {
    try {
      const newDwt = Math.max(0, (match.scoreDWT || 0) + deltaDwt);
      const newOpp = Math.max(0, (match.scoreOpponent || 0) + deltaOpp);
      const res = await API.put(`/matches/${match._id}`, { scoreDWT: newDwt, scoreOpponent: newOpp });
      if (res.data?.success) {
        setMatches(prev => prev.map(m => m._id === match._id ? res.data.match : m));
        showToast(`Score mis à jour : DWT ${newDwt} - ${newOpp} ${match.opponent}`, 'success');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Erreur lors de la mise à jour du score', 'error');
    }
  };

  const handleToggleMatchLive = async (match) => {
    try {
      const newStatus = match.status === 'live' ? 'finished' : 'live';
      const res = await API.put(`/matches/${match._id}`, { status: newStatus });
      if (res.data?.success) {
        setMatches(prev => prev.map(m => m._id === match._id ? res.data.match : m));
        showToast(newStatus === 'live' 
          ? 'Match passé en DIRECT ! La diffusion est ouverte aux spectateurs sur le site. 🔴🐺' 
          : 'Match marqué comme Terminé.', 'success');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Erreur lors du changement de statut', 'error');
    }
  };

  // Handlers pour la Gestion des Jeux
  const handleOpenCreateGame = () => {
    setEditingGame(null);
    setGameFormData({
      name: '',
      logo: '',
      color: '#ff4655',
      mem: '5 Players',
      posterImage: '',
      description: '',
      order: gamesList.length + 1,
      isActive: true
    });
    setGameUploadError('');
    setShowGameModal(true);
  };

  const handleOpenEditGame = (game) => {
    setEditingGame(game);
    setGameFormData({
      name: game.name || '',
      logo: game.logo || '',
      color: game.color || '#ff4655',
      mem: game.mem || '5 Players',
      posterImage: game.posterImage || '',
      description: game.description || '',
      order: game.order || 0,
      isActive: game.isActive !== undefined ? game.isActive : true
    });
    setGameUploadError('');
    setShowGameModal(true);
  };

  const handleSaveGame = async (e) => {
    e.preventDefault();
    if (!gameFormData.name) {
      showToast('Veuillez spécifier le nom du jeu', 'error');
      return;
    }
    try {
      if (editingGame) {
        await API.put(`/games/${editingGame._id}`, gameFormData);
        showToast('Jeu et affiche mis à jour avec succès ! 🐺🎮', 'success');
      } else {
        await API.post('/games', gameFormData);
        showToast('Nouveau jeu et affiche ajoutés avec succès ! 🐺🎮', 'success');
      }
      setShowGameModal(false);
      fetchAllData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Erreur lors de l\'enregistrement du jeu', 'error');
    }
  };

  const handleDeleteGame = (gameId, gameTitle) => {
    openConfirm({
      title: 'Supprimer ce Jeu ?',
      message: `Voulez-vous vraiment supprimer "${gameTitle || 'ce jeu'}" et son affiche officielle ?`,
      subtext: 'Toutes les données associées à ce jeu seront retirées de la plateforme.',
      confirmText: 'Supprimer Définitivement',
      type: 'danger',
      onConfirm: async () => {
        try {
          await API.delete(`/games/${gameId}`);
          showToast('Jeu supprimé avec succès ! 🎮🗑️', 'success');
          fetchAllData();
        } catch (err) {
          showToast(err.response?.data?.message || 'Erreur lors de la suppression', 'error');
        }
      }
    });
  };

  const handleUploadGamePosterFile = async (file) => {
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      setGameUploadError('Fichier trop volumineux. Taille maximale : 15 Mo.');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setGameUploadError('Format non supporté. Veuillez choisir une image (JPG, PNG, WebP, etc.).');
      return;
    }

    setUploadingGamePoster(true);
    setGameUploadError('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await API.post('/upload', formData);

      const uploadedUrl = res.data?.fileUrl || res.data?.filePath || res.data?.file?.path || res.data?.file?.url || res.data?.url;

      if (uploadedUrl) {
        setGameFormData(prev => ({ ...prev, posterImage: uploadedUrl }));
      } else {
        setGameUploadError('Réponse invalide du serveur de téléversement');
      }
    } catch (err) {
      console.error(err);
      setGameUploadError(err.response?.data?.message || 'Échec du téléversement de l\'affiche');
    } finally {
      setUploadingGamePoster(false);
    }
  };

  // --- ACTIONS AFFICHES CINEMATIQUES (HERO SLIDER) ---
  const handleOpenCreateSlide = () => {
    setEditingSlide(null);
    setSlideFormData({
      title: '',
      subtitle: '',
      label: 'Collection Officielle 2026',
      backgroundImage: '',
      btn1Text: 'Shop Collection',
      btn1Target: '#shop',
      btn2Text: 'Meet the Pack',
      btn2Target: '#teams',
      order: slidesList.length,
      isActive: true
    });
    setSlideUploadError('');
    setShowSlideModal(true);
  };

  const handleOpenEditSlide = (slide) => {
    setEditingSlide(slide);
    setSlideFormData({
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      label: slide.label || 'Collection Officielle 2026',
      backgroundImage: slide.backgroundImage || '',
      btn1Text: slide.btn1Text || 'Shop Collection',
      btn1Target: slide.btn1Target || '#shop',
      btn2Text: slide.btn2Text || 'Meet the Pack',
      btn2Target: slide.btn2Target || '#teams',
      order: slide.order !== undefined ? slide.order : 0,
      isActive: slide.isActive !== false
    });
    setSlideUploadError('');
    setShowSlideModal(true);
  };

  const handleUploadSlideImageFile = async (file) => {
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) {
      setSlideUploadError('Fichier trop volumineux. Taille maximale : 25 Mo.');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setSlideUploadError('Format non supporté. Veuillez choisir une image (JPG, PNG, WebP, etc.).');
      return;
    }

    setUploadingSlideImage(true);
    setSlideUploadError('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await API.post('/upload', formData);
      const uploadedPath = res.data?.fileUrl || res.data?.filePath || res.data?.file?.path || res.data?.file?.url || res.data?.url;

      if (uploadedPath) {
        setSlideFormData(prev => ({
          ...prev,
          backgroundImage: uploadedPath
        }));
      } else {
        setSlideUploadError('Réponse invalide du serveur de téléversement');
      }
    } catch (err) {
      console.error('Erreur upload slide:', err);
      setSlideUploadError(err.response?.data?.message || 'Erreur lors du téléversement de l\'affiche');
    } finally {
      setUploadingSlideImage(false);
    }
  };

  const handleSaveSlide = async (e) => {
    e.preventDefault();
    if (!slideFormData.backgroundImage) {
      showToast('Veuillez téléverser une affiche de fond cinématique depuis votre PC 🎬', 'error');
      return;
    }
    try {
      const payload = {
        title: slideFormData.title,
        subtitle: slideFormData.subtitle,
        label: slideFormData.label,
        backgroundImage: slideFormData.backgroundImage,
        btn1Text: slideFormData.btn1Text,
        btn1Target: slideFormData.btn1Target,
        btn2Text: slideFormData.btn2Text,
        btn2Target: slideFormData.btn2Target,
        order: Number(slideFormData.order) || 0,
        isActive: slideFormData.isActive
      };

      if (editingSlide) {
        await API.put(`/slides/${editingSlide._id}`, payload);
        showToast('Affiche cinématique mise à jour avec succès ! 🎬', 'success');
      } else {
        await API.post('/slides', payload);
        showToast('Nouvelle affiche cinématique ajoutée au carrousel ! 🐺🎬', 'success');
      }

      setShowSlideModal(false);
      setEditingSlide(null);
      fetchAllData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Erreur lors de l\'enregistrement de la diapositive', 'error');
    }
  };

  const handleDeleteSlide = (slideId, title) => {
    openConfirm({
      title: 'Supprimer cette Affiche ?',
      message: `Supprimer l'affiche cinématique "${title || 'cette scène'}" ?`,
      subtext: 'Cette diapositive ne sera plus affichée dans le carrousel cinématique d\'accueil.',
      confirmText: 'Supprimer l\'Affiche',
      type: 'danger',
      onConfirm: async () => {
        try {
          await API.delete(`/slides/${slideId}`);
          setSlidesList(prev => prev.filter(s => s._id !== slideId));
          showToast('Affiche cinématique supprimée avec succès ! 🎬✓', 'success');
          fetchAllData();
        } catch (err) {
          showToast(err.response?.data?.message || 'Erreur lors de la suppression', 'error');
        }
      }
    });
  };

  const handleToggleSlideActive = async (slide) => {
    try {
      const updatedStatus = !slide.isActive;
      await API.put(`/slides/${slide._id}`, { isActive: updatedStatus });
      setSlidesList(prev => prev.map(s => s._id === slide._id ? { ...s, isActive: updatedStatus } : s));
      showToast(updatedStatus ? 'Affiche cinématique activée ! 🎬' : 'Affiche cinématique désactivée.', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Erreur lors du changement de statut', 'error');
    }
  };

  // Handlers pour la Gestion du Musée (Archive DWT)
  const handleOpenCreateMuseumItem = () => {
    setEditingMuseumItem(null);
    setMuseumFormData({
      name: '',
      cat: 'Pro Kit',
      year: new Date().getFullYear().toString(),
      price: 'TND 79',
      image: '',
      desc: '',
      order: museumList.length,
      isActive: true
    });
    setMuseumUploadError('');
    setShowMuseumModal(true);
  };

  const handleOpenEditMuseumItem = (item) => {
    setEditingMuseumItem(item);
    setMuseumFormData({
      name: item.name || '',
      cat: item.cat || 'Pro Kit',
      year: item.year || '2023',
      price: item.price || 'TND 0',
      image: item.image || '',
      desc: item.desc || '',
      order: item.order !== undefined ? item.order : 0,
      isActive: item.isActive !== false
    });
    setMuseumUploadError('');
    setShowMuseumModal(true);
  };

  const handleUploadMuseumImage = async (file) => {
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) {
      setMuseumUploadError('Fichier trop volumineux. Taille maximale : 25 Mo.');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setMuseumUploadError('Format non supporté. Veuillez choisir une image (JPG, PNG, WebP).');
      return;
    }
    setUploadingMuseumImage(true);
    setMuseumUploadError('');
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await API.post('/upload', formData);
      const uploadedPath = res.data?.fileUrl || res.data?.filePath || res.data?.file?.path || res.data?.file?.url || res.data?.url;
      if (uploadedPath) {
        setMuseumFormData(prev => ({ ...prev, image: uploadedPath }));
      } else {
        setMuseumUploadError('Réponse invalide du serveur de téléversement');
      }
    } catch (err) {
      setMuseumUploadError(err.response?.data?.message || 'Erreur lors du téléversement de la photo');
    } finally {
      setUploadingMuseumImage(false);
    }
  };

  const handleSaveMuseumItem = async (e) => {
    e.preventDefault();
    if (!museumFormData.image) {
      showToast('Veuillez téléverser une photo pour cette pièce d\'archive du musée 🏛️', 'error');
      return;
    }
    try {
      const payload = {
        name: museumFormData.name,
        cat: museumFormData.cat,
        year: museumFormData.year,
        price: museumFormData.price,
        image: museumFormData.image,
        desc: museumFormData.desc,
        order: Number(museumFormData.order) || 0,
        isActive: museumFormData.isActive
      };
      if (editingMuseumItem) {
        await API.put(`/museum/${editingMuseumItem._id}`, payload);
        showToast('Pièce du musée mise à jour avec succès ! 🏛️✨', 'success');
      } else {
        await API.post('/museum', payload);
        showToast('Nouvelle pièce d\'archive ajoutée au musée DWT ! 🏛️✨', 'success');
      }
      setShowMuseumModal(false);
      setEditingMuseumItem(null);
      fetchAllData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Erreur lors de l\'enregistrement de la pièce', 'error');
    }
  };

  const handleDeleteMuseumItem = (itemId, name) => {
    openConfirm({
      title: 'Supprimer Pièce d\'Archive ?',
      message: `Supprimer définitivement la pièce d'archive "${name}" du musée DWT ?`,
      subtext: 'Cet objet historique sera retiré définitivement des galeries de la meute.',
      confirmText: 'Supprimer du Musée',
      type: 'danger',
      onConfirm: async () => {
        try {
          await API.delete(`/museum/${itemId}`);
          setMuseumList(prev => prev.filter(item => item._id !== itemId));
          showToast(`Pièce "${name}" retirée du musée avec succès ! 🏛️✨`, 'success');
        } catch (err) {
          showToast('Erreur lors de la suppression de la pièce', 'error');
        }
      }
    });
  };

  const handleToggleMuseumActive = async (item) => {
    try {
      const res = await API.put(`/museum/${item._id}`, { isActive: !item.isActive });
      if (res.data?.success) {
        setMuseumList(prev => prev.map(m => m._id === item._id ? res.data.item : m));
        showToast(!item.isActive ? 'Pièce d\'archive activée ! 🏛️' : 'Pièce d\'archive masquée.', 'success');
      }
    } catch (err) {
      showToast('Erreur modification statut actif', 'error');
    }
  };

  // --- GESTION DES VIDÉOS, TRAILERS & PUBS PRODUITS ---
  const handleOpenCreateVideo = () => {
    setEditingVideo(null);
    setVideoSourceMode('upload');
    setVideoFormData({
      title: '',
      subtitle: '',
      description: '',
      category: 'trailer',
      videoUrl: '',
      thumbnail: '',
      duration: '02:30',
      views: '100K vues',
      badge: 'TRAILER OFFICIEL',
      isMainTrailer: false,
      ctaText: 'Découvrir',
      ctaLink: '#shop',
      order: videosList.length,
      isActive: true
    });
    setVideoUploadError('');
    setVideoFileUploadError('');
    setShowVideoModal(true);
  };

  const handleOpenEditVideo = (video) => {
    setEditingVideo(video);
    const isDirectLocal = video.videoUrl?.startsWith('/uploads/') || /\.(mp4|webm|mov|ogg|mkv|m4v)(\?.*)?$/i.test(video.videoUrl || '');
    setVideoSourceMode(isDirectLocal ? 'upload' : 'youtube');
    setVideoFormData({
      title: video.title || '',
      subtitle: video.subtitle || '',
      description: video.description || '',
      category: video.category || 'trailer',
      videoUrl: video.videoUrl || '',
      thumbnail: video.thumbnail || '',
      duration: video.duration || '02:30',
      views: video.views || '100K vues',
      badge: video.badge || '',
      isMainTrailer: Boolean(video.isMainTrailer),
      ctaText: video.ctaText || 'Découvrir',
      ctaLink: video.ctaLink || '#shop',
      order: video.order !== undefined ? video.order : 0,
      isActive: video.isActive !== undefined ? video.isActive : true
    });
    setVideoUploadError('');
    setVideoFileUploadError('');
    setShowVideoModal(true);
  };

  const handleUploadVideoFile = async (file) => {
    if (!file) return;

    // Validation du format vidéo
    const validExtensions = /\.(mp4|webm|mov|mkv|avi|ogg|m4v)$/i;
    if (!file.type.startsWith('video/') && !validExtensions.test(file.name)) {
      setVideoFileUploadError('Format non supporté. Veuillez sélectionner une vidéo (MP4, WEBM, MOV, MKV).');
      return;
    }

    // Limite de taille 250 Mo
    const maxSizeBytes = 250 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setVideoFileUploadError('La vidéo est trop volumineuse (taille max: 250 Mo).');
      return;
    }

    setUploadingVideoFile(true);
    setVideoFileUploadError('');
    setVideoFileUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('video', file);

      const res = await API.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setVideoFileUploadProgress(percentCompleted);
          }
        }
      });

      const uploadedPath = res.data?.filePath || res.data?.fileUrl || res.data?.file?.path || res.data?.url;
      if (uploadedPath) {
        setVideoFormData(prev => ({
          ...prev,
          videoUrl: uploadedPath,
          title: prev.title || file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ").toUpperCase()
        }));
        showToast('Fichier vidéo MP4 téléversé avec succès sur le serveur ! 🐺🎬', 'success');
      } else {
        setVideoFileUploadError('Réponse inattendue du serveur lors du téléversement.');
      }
    } catch (err) {
      setVideoFileUploadError(err.response?.data?.message || 'Erreur lors du téléversement du fichier vidéo.');
    } finally {
      setUploadingVideoFile(false);
      setVideoFileUploadProgress(0);
    }
  };

  const handleUploadVideoThumbnail = async (file) => {
    if (!file) return;
    setUploadingVideoImage(true);
    setVideoUploadError('');
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await API.post('/upload', formData);
      const uploadedPath = res.data?.fileUrl || res.data?.filePath || res.data?.file?.path || res.data?.file?.url || res.data?.url;
      if (uploadedPath) {
        setVideoFormData(prev => ({ ...prev, thumbnail: uploadedPath }));
        showToast('Miniature vidéo téléversée avec succès ! 🎬📸', 'success');
      } else {
        setVideoUploadError('Réponse invalide du serveur de téléversement');
      }
    } catch (err) {
      setVideoUploadError(err.response?.data?.message || 'Erreur lors du téléversement de la miniature');
    } finally {
      setUploadingVideoImage(false);
    }
  };

  const handleSaveVideo = async (e) => {
    e.preventDefault();
    if (!videoFormData.title.trim()) {
      showToast('Veuillez renseigner un titre pour la vidéo 🎬', 'error');
      return;
    }
    if (!videoFormData.videoUrl.trim()) {
      showToast('Veuillez téléverser un fichier MP4 ou saisir un lien vidéo YouTube 🎬', 'error');
      return;
    }

    try {
      const payload = {
        title: videoFormData.title.trim(),
        subtitle: videoFormData.subtitle.trim(),
        description: videoFormData.description.trim(),
        category: videoFormData.category,
        videoUrl: videoFormData.videoUrl.trim(),
        thumbnail: videoFormData.thumbnail.trim() || '/backgrounds/hero-gaming-bg.jpg',
        duration: videoFormData.duration.trim() || '02:30',
        views: videoFormData.views.trim() || '100K vues',
        badge: videoFormData.badge.trim() || (videoFormData.category === 'trailer' ? 'TRAILER' : videoFormData.category === 'product_ad' ? 'SPOT PUB' : 'ANNONCE'),
        isMainTrailer: Boolean(videoFormData.isMainTrailer),
        ctaText: videoFormData.ctaText.trim(),
        ctaLink: videoFormData.ctaLink.trim(),
        order: Number(videoFormData.order) || 0,
        isActive: Boolean(videoFormData.isActive)
      };

      if (editingVideo) {
        const res = await API.put(`/videos/${editingVideo._id}`, payload);
        if (res.data?.success) {
          showToast('Vidéo mise à jour avec succès ! 🐺🎬', 'success');
        }
      } else {
        const res = await API.post('/videos', payload);
        if (res.data?.success) {
          showToast('Nouvelle vidéo ajoutée à la médiathèque DWT ! 🐺🎬', 'success');
        }
      }
      setShowVideoModal(false);
      setEditingVideo(null);
      fetchAllData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Erreur lors de l\'enregistrement de la vidéo', 'error');
    }
  };

  const handleToggleVideoActive = async (video) => {
    try {
      const res = await API.put(`/videos/${video._id}`, { isActive: !video.isActive });
      if (res.data?.success) {
        setVideosList(prev => prev.map(v => v._id === video._id ? res.data.video : v));
        showToast(!video.isActive ? 'Vidéo activée et visible sur le site ! 🎬' : 'Vidéo masquée du site.', 'success');
      }
    } catch (err) {
      showToast('Erreur lors du changement de statut de la vidéo', 'error');
    }
  };

  const handleSetMainTrailer = async (video) => {
    try {
      const res = await API.put(`/videos/${video._id}/set-main`);
      if (res.data?.success) {
        showToast(`"${video.title}" est maintenant le Trailer Principal du site ! 🔥🐺`, 'success');
        fetchAllData();
      }
    } catch (err) {
      showToast('Erreur lors de la définition du trailer principal', 'error');
    }
  };

  const handleDeleteVideo = (videoId, title) => {
    openConfirm({
      title: 'Supprimer cette vidéo ?',
      message: `Êtes-vous sûr de vouloir supprimer définitivement "${title}" ?`,
      subtext: 'Cette vidéo, spot publicitaire ou annonce sera retirée de la page d\'accueil.',
      confirmText: 'Supprimer définitivement',
      type: 'danger',
      onConfirm: async () => {
        try {
          await API.delete(`/videos/${videoId}`);
          setVideosList(prev => prev.filter(v => v._id !== videoId));
          showToast('Vidéo supprimée de la médiathèque avec succès ! 🗑️', 'success');
        } catch (err) {
          showToast('Erreur lors de la suppression de la vidéo', 'error');
        }
      }
    });
  };

  const pendingAppsCount = recruitmentList.filter(a => a.status === 'pending').length;
  const totalUnreadMessages = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0) + contactUnreadCount + pendingAppsCount;

  const sidebarLinks = [
    { label: 'Tableau de Bord', icon: <LayoutDashboard size={18} /> },
    { label: 'Affiches Cinématiques', icon: <SlidersHorizontal size={18} />, badge: slidesList.length },
    { label: 'Vidéos & Trailers', icon: <Film size={18} />, badge: videosList.length },
    { label: 'Gestion des Jeux', icon: <Gamepad2 size={18} />, badge: gamesList.length },
    { label: 'Museum (Archive)', icon: <Layers size={18} />, badge: museumList.length },
    { label: 'Boutique & Ventes', icon: <ShoppingBag size={18} /> },
    { label: 'Messagerie & Contact', icon: <MessageSquare size={18} />, badge: totalUnreadMessages },
    { label: 'Gestion des Joueurs', icon: <Users size={18} />, badge: pendingAppsCount },
    { label: 'Tournois', icon: <Trophy size={18} /> },
    { label: 'Actualités', icon: <FileText size={18} /> },
    { label: 'Paramètres', icon: <Settings size={18} /> },
  ];

  return (
    <div className="dashboard-page-bg">
      {/* Cyber Design System Modals & Toasts */}
      <CyberConfirmModal {...confirmDialog} onCancel={closeConfirm} />
      <CyberToast toast={toast} onClose={() => setToast(null)} />

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
                  background: 'rgba(56, 189, 248, 0.2)',
                  border: '1px solid rgba(56, 189, 248, 0.5)',
                  color: '#38bdf8',
                  fontSize: '11px',
                  fontWeight: '800',
                  padding: '1px 6px',
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

          <button 
            type="button"
            className="dash-nav-item dash-nav-logout" 
            onClick={handleLogout}
            style={{ 
              marginTop: '16px', 
              color: '#ef4444',
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
            title="Se déconnecter de la session Administrateur"
          >
            <LogOut size={18} />
            <span>Déconnexion</span>
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
              {/* Bouton Retour au Site */}
              <button 
                type="button"
                className="bnav-player"
                onClick={onBackToSite ? onBackToSite : () => window.location.href = '/'}
                title="Revenir à l'accueil du site"
              >
                <ExternalLink size={14} />
                <span>Voir le Site Public</span>
              </button>

              {/* Bouton Déconnexion Admin */}
              <button 
                type="button"
                className="bnav-player"
                onClick={handleLogout}
                title="Déconnexion sécurisée de la session administrateur"
                style={{
                  background: 'rgba(239, 68, 68, 0.12)',
                  borderColor: 'rgba(239, 68, 68, 0.4)',
                  color: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <LogOut size={14} />
                <span>Déconnexion</span>
              </button>

              {/* Cloche de Notifications avec Ref Click-Outside */}
              <div ref={notifRef} style={{ position: 'relative' }}>
                <button 
                  type="button"
                  className="dash-bell-notify" 
                  onClick={() => setShowNotifPopup(!showNotifPopup)}
                  title="Notifications de commandes, recrutements et messages"
                  style={{ cursor: 'pointer', position: 'relative' }}
                >
                  <Bell size={18} color="#fff" />
                  {unreadNotifCount > 0 && (
                    <span className="dash-bell-badge">{unreadNotifCount}</span>
                  )}
                </button>

                {/* Popup des Notifications */}
                {showNotifPopup && (
                  <div className="notif-popup" style={{ width: '390px', right: 0 }}>
                    <div className="notif-header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <WolfLogo size={18} />
                        <span style={{ fontWeight: '800', fontSize: '14px', color: '#fff' }}>
                          Notifications ({notifications.length})
                        </span>
                        {unreadNotifCount > 0 && (
                          <span style={{
                            fontSize: '11px',
                            background: 'rgba(230,0,0,0.2)',
                            border: '1px solid var(--red-primary)',
                            color: '#ff4d4d',
                            padding: '1px 6px',
                            borderRadius: '10px',
                            fontWeight: '800'
                          }}>
                            {unreadNotifCount} non lue{unreadNotifCount > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      {unreadNotifCount > 0 && (
                        <button 
                          onClick={handleMarkAllNotifsRead}
                          style={{ background: 'none', border: 'none', color: 'var(--red-primary)', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}
                        >
                          Tout marquer lu ✓
                        </button>
                      )}
                    </div>
                    <div className="notif-list wp-scrollbar" style={{ maxHeight: '380px', overflowY: 'auto' }}>
                      {notifications.length === 0 ? (
                        <div className="dash-empty-state" style={{ padding: '30px 20px', textAlign: 'center' }}>
                          <WolfLogo size={32} />
                          <div style={{ marginTop: '10px', fontWeight: '700', color: '#fff', fontSize: '13px' }}>
                            Aucune notification pour le moment
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                            Tout est calme dans la meute ! 🐺✨
                          </div>
                        </div>
                      ) : (
                        notifications.map(n => {
                          const isOrder = n.type === 'order' || n.title?.includes('Commande');
                          const isMsg = n.type === 'message' || n.title?.includes('Message');
                          const isApp = n.metadata?.applicationId || n.title?.includes('Candidature');
                          const isContact = n.metadata?.contactId || n.title?.includes('Contact');

                          return (
                            <div 
                              key={n._id} 
                              className={`notif-item ${!n.isRead ? 'unread' : ''}`}
                              style={{ cursor: 'pointer', transition: 'background 0.2s' }}
                              title="Cliquer pour accéder à cet élément et marquer comme lu"
                              onClick={() => handleMarkNotifRead(n._id, n)}
                            >
                              <div style={{ marginTop: '2px', flexShrink: 0 }}>
                                {isOrder ? (
                                  <ShoppingBag size={18} color="#4ade80" />
                                ) : isApp ? (
                                  <Users size={18} color="#f59e0b" />
                                ) : isContact ? (
                                  <Mail size={18} color="#eab308" />
                                ) : isMsg ? (
                                  <MessageSquare size={18} color="#38bdf8" />
                                ) : (
                                  <WolfLogo size={18} />
                                )}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                                  <div style={{ fontWeight: '700', fontSize: '13px', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {n.title}
                                  </div>
                                  {!n.isRead && (
                                    <span style={{
                                      width: '7px',
                                      height: '7px',
                                      borderRadius: '50%',
                                      background: 'var(--red-primary)',
                                      boxShadow: '0 0 6px var(--red-primary)',
                                      flexShrink: 0
                                    }} />
                                  )}
                                </div>
                                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px', lineHeight: 1.4 }}>
                                  {n.message}
                                </div>
                                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                                  {new Date(n.createdAt).toLocaleString('fr-FR')}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

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
                          images: [],
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
                      productsList.map((p) => {
                        const pImgCount = Array.isArray(p.images) && p.images.length > 0 ? p.images.length : (p.image ? 1 : 0);
                        return (
                        <div className="dash-list-item-row" key={p._id}>
                          <div className="dash-item-left">
                            <img src={getImageUrl(p.images?.[0] || p.image)} alt="" className="dash-avatar-tiny" />
                            <div>
                              <div className="dash-item-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>{p.name}</span>
                                {pImgCount > 0 && (
                                  <span style={{ 
                                    background: 'rgba(56, 189, 248, 0.15)', 
                                    border: '1px solid rgba(56, 189, 248, 0.35)', 
                                    color: '#38bdf8', 
                                    fontSize: '11px', 
                                    padding: '1px 6px', 
                                    borderRadius: '4px', 
                                    fontWeight: '700' 
                                  }}>
                                    📷 {pImgCount} photo{pImgCount > 1 ? 's' : ''}
                                  </span>
                                )}
                              </div>
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
                                const pImages = Array.isArray(p.images) && p.images.length > 0 ? p.images : (p.image ? [p.image] : []);
                                setEditingProduct(p);
                                setProductFormData({
                                  name: p.name,
                                  category: p.category,
                                  price: p.price,
                                  comparePrice: p.comparePrice || '',
                                  stockCount: p.stockCount,
                                  sizes: Array.isArray(p.sizes) ? p.sizes : (typeof p.sizes === 'string' ? p.sizes.split(',').map(s => s.trim()).filter(Boolean) : ['M', 'L', 'XL']),
                                  description: p.description,
                                  images: pImages,
                                  image: pImages[0] || '',
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
                      );
                    })
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
              {msgSubTab === 'chat' && (() => {
                const filteredConversations = conversations.filter(conv => {
                  const q = chatSearchQuery.trim().toLowerCase();
                  const matchesSearch = !q ||
                    (conv.user?.gamertag || '').toLowerCase().includes(q) ||
                    (conv.user?.favoriteGame || '').toLowerCase().includes(q) ||
                    (conv.user?.email || '').toLowerCase().includes(q);

                  if (!matchesSearch) return false;
                  if (chatFilterRole === 'player') return conv.user?.role === 'player' || conv.isPlayer;
                  if (chatFilterRole === 'user') return conv.user?.role !== 'player' && !conv.isPlayer;
                  return true;
                });

                const recruitedPlayersCount = conversations.filter(c => c.user?.role === 'player' || c.isPlayer).length;

                return (
                  <div className="chat-container">
                    {/* Colonne de gauche : Utilisateurs / Joueurs */}
                    <div className="chat-user-list">
                      <div className="chat-user-header">
                        <div className="chat-user-title">
                          <span>Membres & Joueurs</span>
                          <span style={{
                            fontSize: '11px',
                            color: '#94a3b8',
                            background: '#121624',
                            border: '1px solid #1f273b',
                            padding: '2px 8px',
                            borderRadius: '10px'
                          }}>
                            {filteredConversations.length}
                          </span>
                        </div>

                        {/* Barre de recherche */}
                        <input
                          type="text"
                          className="chat-search-input"
                          placeholder="Rechercher un joueur, jeu..."
                          value={chatSearchQuery}
                          onChange={(e) => setChatSearchQuery(e.target.value)}
                        />

                        {/* Filtres rapides */}
                        <div className="chat-filter-bar">
                          <button
                            type="button"
                            className={`chat-filter-chip ${chatFilterRole === 'all' ? 'active' : ''}`}
                            onClick={() => setChatFilterRole('all')}
                          >
                            Tous ({conversations.length})
                          </button>
                          <button
                            type="button"
                            className={`chat-filter-chip ${chatFilterRole === 'player' ? 'active' : ''}`}
                            onClick={() => setChatFilterRole('player')}
                          >
                            🎮 Joueurs ({recruitedPlayersCount})
                          </button>
                          <button
                            type="button"
                            className={`chat-filter-chip ${chatFilterRole === 'user' ? 'active' : ''}`}
                            onClick={() => setChatFilterRole('user')}
                          >
                            🐺 Membres ({conversations.length - recruitedPlayersCount})
                          </button>
                        </div>
                      </div>

                      <div className="chat-players-scroll wp-scrollbar">
                        {filteredConversations.length === 0 ? (
                          <div style={{ padding: '30px 20px', color: '#64748b', fontSize: '13px', textAlign: 'center' }}>
                            Aucun joueur ou membre correspondant trouvé.
                          </div>
                        ) : (
                          filteredConversations.map(conv => {
                            const isPlayer = conv.user.role === 'player' || conv.isPlayer;
                            const isSelected = selectedUser?._id === conv.user._id;

                            return (
                              <div
                                key={conv.user._id}
                                className={`chat-user-item ${isSelected ? 'active' : ''}`}
                                onClick={() => setSelectedUser(conv.user)}
                              >
                                <div style={{ position: 'relative' }}>
                                  <img
                                    src={conv.user.avatar || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&q=80'}
                                    alt=""
                                    style={{
                                      width: '38px',
                                      height: '38px',
                                      borderRadius: '50%',
                                      objectFit: 'cover',
                                      border: isPlayer ? '2px solid #e60000' : '1px solid #232b3e'
                                    }}
                                  />
                                  {isPlayer && (
                                    <span style={{
                                      position: 'absolute',
                                      bottom: '-2px',
                                      right: '-2px',
                                      width: '10px',
                                      height: '10px',
                                      borderRadius: '50%',
                                      background: '#10b981',
                                      border: '2px solid #080a10'
                                    }} />
                                  )}
                                </div>

                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                                    <span style={{
                                      fontWeight: '700',
                                      fontSize: '13px',
                                      color: '#fff',
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      maxWidth: '140px'
                                    }}>
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

                                  {/* Badges rôle & jeu */}
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
                                    {isPlayer ? (
                                      <span style={{
                                        background: 'rgba(230, 0, 0, 0.2)',
                                        color: '#ff4d4d',
                                        border: '1px solid rgba(230, 0, 0, 0.4)',
                                        borderRadius: '4px',
                                        fontSize: '9px',
                                        padding: '1px 5px',
                                        fontWeight: '800',
                                        letterSpacing: '0.4px'
                                      }}>
                                        JOUEUR {conv.user.favoriteGame ? `• ${conv.user.favoriteGame}` : ''}
                                      </span>
                                    ) : (
                                      <span style={{
                                        background: 'rgba(148, 163, 184, 0.12)',
                                        color: '#94a3b8',
                                        borderRadius: '4px',
                                        fontSize: '9px',
                                        padding: '1px 5px',
                                        fontWeight: '600'
                                      }}>
                                        {conv.user.role || 'Membre'}
                                      </span>
                                    )}
                                  </div>

                                  <div style={{ fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {conv.lastMessage?.content || (isPlayer ? '🐺 Joueur recruté dans la meute' : 'Aucun message')}
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* Colonne de droite : Fenêtre de discussion */}
                    <div className="chat-window">
                      <div className="chat-window-header">
                        {selectedUser ? (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <img
                                src={selectedUser.avatar || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&q=80'}
                                alt=""
                                style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--red-primary)' }}
                              />
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ fontWeight: '800', color: '#fff', fontSize: '15px' }}>
                                    Discussion avec {selectedUser.gamertag}
                                  </span>
                                  {selectedUser.role === 'player' && (
                                    <span style={{
                                      background: 'rgba(230, 0, 0, 0.2)',
                                      color: '#ff4d4d',
                                      border: '1px solid rgba(230, 0, 0, 0.4)',
                                      borderRadius: '4px',
                                      fontSize: '10px',
                                      padding: '1px 6px',
                                      fontWeight: '800'
                                    }}>
                                      JOUEUR OFFICIEL
                                    </span>
                                  )}
                                </div>
                                <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                                  {selectedUser.email} {selectedUser.favoriteGame ? `• Jeu : ${selectedUser.favoriteGame}` : ''}
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
                              Messagerie Active
                            </div>
                          </div>
                        ) : (
                          <span style={{ color: '#94a3b8' }}>Sélectionnez un joueur pour discuter</span>
                        )}
                      </div>

                      <div className="chat-messages-scroll wp-scrollbar" ref={chatScrollRef}>
                        {chatMessages.length === 0 ? (
                          <div className="dash-empty-state" style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                            <WolfLogo size={40} />
                            <div style={{ marginTop: '12px', fontWeight: '800', color: '#fff', fontSize: '15px' }}>
                              Aucun message échangé pour le moment.
                            </div>
                            <div style={{ marginTop: '6px', fontSize: '13px', color: '#94a3b8' }}>
                              Envoyez un message pour démarrer la discussion officielle avec {selectedUser?.gamertag} ! 🐺💬
                            </div>
                          </div>
                        ) : (
                          chatMessages.map(msg => {
                            const isMine = (msg.sender?._id || msg.sender) !== (selectedUser?._id || selectedUser);
                            return (
                              <div key={msg._id} className={`chat-bubble ${isMine ? 'mine' : 'theirs'}`}>
                                <div className="chat-bubble-name">
                                  {isMine ? 'Admin Staff (Moi)' : (msg.sender?.gamertag || selectedUser?.gamertag || 'Joueur')}
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

                      {selectedUser && (
                        <form className="chat-input-bar" onSubmit={handleSendMessage}>
                          <input
                            type="text"
                            className="chat-input-field"
                            placeholder={`Écrire un message officiel à ${selectedUser.gamertag}...`}
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                          />
                          <button type="submit" className="chat-send-btn" disabled={sendingMsg || !chatInput.trim()}>
                            <Send size={18} />
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                );
              })()}

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

          {/* TAB 4: GESTION DES JOUEURS & SÉLECTION PAR JEU */}
          {activeNav === 'Gestion des Joueurs' && (() => {
            const allAvailableGames = Array.from(new Set([
              ...gamesList.map(g => g.name),
              ...playersList.map(p => p.game)
            ].filter(Boolean)));

            const currentFilteredPlayers = selectedPlayerGameFilter === 'Tous'
              ? playersList
              : playersList.filter(p => (p.game || '').toLowerCase() === selectedPlayerGameFilter.toLowerCase());

            const currentFilteredApps = selectedPlayerGameFilter === 'Tous'
              ? recruitmentList
              : recruitmentList.filter(a => (a.game || '').toLowerCase() === selectedPlayerGameFilter.toLowerCase());

            const currentPendingApps = currentFilteredApps.filter(a => a.status === 'pending').length;

            return (
              <div className="dash-card">
                {/* 1. SÉLECTION DU JEU ESPORTS - CAROUSEL / GRID DÉDIÉ */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
                    <div>
                      <span className="dash-card-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Gamepad2 size={20} color="var(--red-primary)" />
                        SÉLECTION DU JEU & GESTION DES ROSTERS
                      </span>
                      <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
                        Sélectionnez un jeu ci-dessous pour gérer l'équipe officielle, composer l'effectif et traiter les candidatures associées.
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'rgba(230,0,0,0.1)',
                      border: '1px solid rgba(230,0,0,0.3)',
                      padding: '6px 14px',
                      borderRadius: '4px',
                      fontFamily: '"Rajdhani", sans-serif',
                      fontWeight: '700',
                      fontSize: '13px',
                      letterSpacing: '0.05em',
                      color: '#fff'
                    }}>
                      <span style={{ color: 'var(--red-primary)' }}>JEU ACTIF :</span>
                      <span style={{ color: '#38bdf8', textTransform: 'uppercase' }}>{selectedPlayerGameFilter}</span>
                    </div>
                  </div>

                  {/* Grille de sélection des jeux */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
                    gap: '12px',
                    marginBottom: '10px'
                  }}>
                    {/* Carte "Tous les Jeux" */}
                    <div
                      onClick={() => setSelectedPlayerGameFilter('Tous')}
                      style={{
                        padding: '14px',
                        background: selectedPlayerGameFilter === 'Tous' ? 'linear-gradient(135deg, rgba(230,0,0,0.25), rgba(10,14,24,0.96))' : 'rgba(10,14,24,0.75)',
                        border: selectedPlayerGameFilter === 'Tous' ? '2px solid var(--red-primary)' : '1px solid rgba(255,255,255,0.1)',
                        boxShadow: selectedPlayerGameFilter === 'Tous' ? '0 0 16px rgba(230,0,0,0.45)' : 'none',
                        clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', position: 'relative', zIndex: 1 }}>
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '6px',
                          background: 'rgba(230,0,0,0.15)',
                          border: '1px solid var(--red-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <WolfLogo size={22} />
                        </div>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: '800',
                          color: '#38bdf8',
                          background: 'rgba(56, 189, 248, 0.15)',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          border: '1px solid rgba(56, 189, 248, 0.3)'
                        }}>
                          {playersList.length} Joueurs
                        </span>
                      </div>
                      <div style={{ position: 'relative', zIndex: 1, fontFamily: '"Orbitron", sans-serif', fontWeight: '800', fontSize: '13px', color: '#fff', letterSpacing: '0.05em' }}>
                        TOUS LES JEUX
                      </div>
                      <div style={{ position: 'relative', zIndex: 1, fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                        Vue d'ensemble du club
                      </div>
                    </div>

                    {/* Cartes pour chaque jeu spécifique avec la photo officielle de ses réglages */}
                    {allAvailableGames.map(gameName => {
                      const gameData = gamesList.find(g => (g.name || '').toLowerCase().trim() === gameName.toLowerCase().trim())
                        || gamesList.find(g => (g.slug || '').toLowerCase().trim() === gameName.toLowerCase().trim().replace(/\s+/g, '-'))
                        || gamesList.find(g => {
                          const n = (g.name || '').toLowerCase();
                          const gn = gameName.toLowerCase();
                          return n.includes(gn) || gn.includes(n);
                        });

                      const pCount = playersList.filter(p => (p.game || '').toLowerCase() === gameName.toLowerCase()).length;
                      const appCount = recruitmentList.filter(a => (a.game || '').toLowerCase() === gameName.toLowerCase() && a.status === 'pending').length;
                      const isSelected = selectedPlayerGameFilter.toLowerCase() === gameName.toLowerCase();

                      // Photo configurée dans les réglages du jeu
                      const rawGameImg = gameData?.posterImage || gameData?.bannerImage || (gameData?.logo && (gameData.logo.startsWith('/') || gameData.logo.startsWith('http') || gameData.logo.startsWith('data:')) ? gameData.logo : null);
                      const gamePosterUrl = rawGameImg ? getImageUrl(rawGameImg) : null;
                      const accentColor = gameData?.color || 'var(--red-primary)';

                      return (
                        <div
                          key={gameName}
                          onClick={() => setSelectedPlayerGameFilter(gameName)}
                          style={{
                            padding: '14px',
                            background: isSelected ? 'linear-gradient(135deg, rgba(230,0,0,0.22), rgba(10,14,24,0.96))' : 'rgba(10,14,24,0.75)',
                            border: isSelected ? '2px solid var(--red-primary)' : '1px solid rgba(255,255,255,0.1)',
                            boxShadow: isSelected ? '0 0 16px rgba(230,0,0,0.45)' : 'none',
                            clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            position: 'relative',
                            overflow: 'hidden'
                          }}
                        >
                          {/* Artwork en arrière-plan discret issu des réglages */}
                          {gamePosterUrl && (
                            <div
                              style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                bottom: 0,
                                width: '60%',
                                backgroundImage: `url(${gamePosterUrl})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                opacity: isSelected ? 0.28 : 0.14,
                                maskImage: 'linear-gradient(to right, transparent, black 80%)',
                                WebkitMaskImage: 'linear-gradient(to right, transparent, black 80%)',
                                pointerEvents: 'none',
                                transition: 'opacity 0.2s ease',
                                zIndex: 0
                              }}
                            />
                          )}

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', position: 'relative', zIndex: 1 }}>
                            {/* Miniature de l'affiche configurée dans les réglages */}
                            <div style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '6px',
                              background: '#04060a',
                              border: `1px solid ${isSelected ? 'var(--red-primary)' : (gameData?.color || 'rgba(255,255,255,0.18)')}`,
                              boxShadow: isSelected ? '0 0 10px rgba(230,0,0,0.4)' : 'none',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              overflow: 'hidden',
                              flexShrink: 0
                            }}>
                              {gamePosterUrl ? (
                                <img 
                                  src={gamePosterUrl} 
                                  alt={gameName} 
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              ) : (
                                <Gamepad2 size={18} color={accentColor} />
                              )}
                            </div>

                            <div style={{ display: 'flex', gap: '4px' }}>
                              <span style={{
                                fontSize: '11px',
                                fontWeight: '800',
                                color: isSelected ? '#ff4d4d' : '#cbd5e1',
                                background: isSelected ? 'rgba(230,0,0,0.25)' : 'rgba(255,255,255,0.06)',
                                border: isSelected ? '1px solid rgba(230,0,0,0.4)' : '1px solid rgba(255,255,255,0.08)',
                                padding: '2px 7px',
                                borderRadius: '4px'
                              }}>
                                {pCount} Joueur{pCount > 1 ? 's' : ''}
                              </span>
                              {appCount > 0 && (
                                <span style={{
                                  fontSize: '10px',
                                  fontWeight: '900',
                                  color: '#fff',
                                  background: 'var(--red-primary)',
                                  padding: '2px 5px',
                                  borderRadius: '4px'
                                }} title={`${appCount} candidature(s) en attente pour ce jeu`}>
                                  +{appCount}
                                </span>
                              )}
                            </div>
                          </div>

                          <div style={{ position: 'relative', zIndex: 1, fontFamily: '"Orbitron", sans-serif', fontWeight: '800', fontSize: '13px', color: isSelected ? '#fff' : '#cbd5e1', letterSpacing: '0.05em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {gameName}
                          </div>
                          <div style={{ position: 'relative', zIndex: 1, fontSize: '11px', color: isSelected ? '#ff8080' : '#64748b', marginTop: '2px' }}>
                            {isSelected ? 'Sélection active' : 'Cliquer pour gérer'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. HEADER DE SECTION & SOUS-ONGLETS */}
                <div className="dash-card-header" style={{ paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <div>
                    <span className="dash-card-title">
                      {selectedPlayerGameFilter === 'Tous' ? "Roster Global Dark Wolf Team" : `Équipe Officielle & Roster : ${selectedPlayerGameFilter}`}
                    </span>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                      {currentFilteredPlayers.length} joueur(s) sous contrat officiel • {currentFilteredApps.length} candidature(s)
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <button 
                      type="button"
                      className={`dash-subtab-btn ${playerSubTab === 'roster' ? 'active' : ''}`}
                      onClick={() => setPlayerSubTab('roster')}
                      style={{ fontSize: '12px', padding: '6px 14px' }}
                    >
                      Roster Officiel ({currentFilteredPlayers.length})
                    </button>
                    <button 
                      type="button"
                      className={`dash-subtab-btn ${playerSubTab === 'candidatures' ? 'active' : ''}`}
                      onClick={() => setPlayerSubTab('candidatures')}
                      style={{ fontSize: '12px', padding: '6px 14px', position: 'relative' }}
                    >
                      Candidatures ({currentFilteredApps.length})
                      {currentPendingApps > 0 && (
                        <span style={{
                          background: 'var(--red-primary)',
                          color: '#fff',
                          fontSize: '10px',
                          fontWeight: '800',
                          padding: '1px 5px',
                          borderRadius: '8px',
                          marginLeft: '6px'
                        }}>
                          {currentPendingApps}
                        </span>
                      )}
                    </button>
                    <button 
                      type="button"
                      className="btn-rejoindre" 
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 16px', fontSize: '12px' }}
                      onClick={() => handleOpenCreatePlayer(selectedPlayerGameFilter)}
                    >
                      <Plus size={15} /> Ajouter un Joueur {selectedPlayerGameFilter !== 'Tous' ? `à ${selectedPlayerGameFilter}` : ''}
                    </button>
                  </div>
                </div>

                {/* 3. SOUS-ONGLET JOUEURS DU ROSTER */}
                {playerSubTab === 'roster' && (
                  <div>
                    <div className="dash-list-col wp-scrollbar" style={{ maxHeight: '560px', overflowY: 'auto', paddingRight: '6px' }}>
                      {currentFilteredPlayers.length === 0 ? (
                        <div className="dash-empty-state" style={{ padding: '40px 20px', textAlign: 'center' }}>
                          <Gamepad2 size={36} color="var(--red-primary)" style={{ margin: '0 auto 12px', opacity: 0.8 }} />
                          <div style={{ fontSize: '15px', color: '#fff', fontWeight: '700', marginBottom: '6px' }}>
                            Aucun joueur enregistré pour {selectedPlayerGameFilter === 'Tous' ? "le moment" : `l'équipe ${selectedPlayerGameFilter}`}
                          </div>
                          <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
                            Constituez votre line-up officiel pour les compétitions et tournois esport.
                          </div>
                          <button
                            type="button"
                            className="btn-rejoindre"
                            style={{ margin: '0 auto', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 18px', fontSize: '13px' }}
                            onClick={() => handleOpenCreatePlayer(selectedPlayerGameFilter)}
                          >
                            <Plus size={16} /> Ajouter un Joueur à {selectedPlayerGameFilter === 'Tous' ? "l'Équipe" : selectedPlayerGameFilter}
                          </button>
                        </div>
                      ) : (
                        currentFilteredPlayers.map((p) => (
                          <div className="dash-list-item-row" key={p._id}>
                            <div className="dash-item-left">
                              <img src={p.avatar} alt={p.gamertag} className="dash-avatar-tiny" />
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                  <span className="dash-item-title">{p.gamertag}</span>
                                  <span style={{
                                    background: 'rgba(56, 189, 248, 0.15)',
                                    border: '1px solid #38bdf8',
                                    color: '#38bdf8',
                                    fontSize: '10px',
                                    fontWeight: '800',
                                    padding: '1px 6px',
                                    borderRadius: '6px'
                                  }}>
                                    {p.game}
                                  </span>
                                  <span style={{
                                    background: 'rgba(34, 197, 94, 0.15)',
                                    border: '1px solid #22c55e',
                                    color: '#22c55e',
                                    fontSize: '10px',
                                    fontWeight: '700',
                                    padding: '1px 6px',
                                    borderRadius: '6px'
                                  }}>
                                    {p.team || 'Équipe Principale'}
                                  </span>
                                  <span style={{
                                    background: 'rgba(255, 255, 255, 0.08)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    color: '#cbd5e1',
                                    fontSize: '10px',
                                    fontWeight: '700',
                                    padding: '1px 6px',
                                    borderRadius: '6px'
                                  }}>
                                    {p.role || 'Titulaire'}
                                  </span>
                                </div>
                                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>
                                  Nom réel: {p.realName || '-'} | Rang: {p.rank || 'Compétiteur'} {p.socialLinks?.discord ? `| Discord: ${p.socialLinks.discord}` : ''}
                                </div>
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <button
                                type="button"
                                className="btn-dash-approve"
                                style={{
                                  padding: '6px 12px',
                                  fontSize: '12px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  background: 'rgba(230, 0, 0, 0.12)',
                                  border: '1px solid var(--red-primary)',
                                  color: '#ff4d4d'
                                }}
                                title="Modifier les informations de ce joueur"
                                onClick={() => handleOpenEditPlayer(p)}
                              >
                                <Edit3 size={14} /> Éditer
                              </button>
                              <button
                                type="button"
                                className="btn-dash-approve"
                                style={{
                                  padding: '6px 12px',
                                  fontSize: '12px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  background: 'rgba(56, 189, 248, 0.15)',
                                  border: '1px solid #38bdf8',
                                  color: '#38bdf8'
                                }}
                                title="Envoyer un message / Discuter avec ce joueur"
                                onClick={() => handleStartChatWithPlayer(p)}
                              >
                                <MessageSquare size={14} /> Discuter
                              </button>
                              <button 
                                type="button"
                                className="dash-more-btn"
                                onClick={() => {
                                  openConfirm({
                                    title: 'Retirer le Joueur ?',
                                    message: `Supprimer le joueur ${p.gamertag} de l'équipe ${p.game} ?`,
                                    subtext: 'Le joueur sera retiré du roster officiel de la meute.',
                                    confirmText: 'Retirer du Roster',
                                    type: 'danger',
                                    onConfirm: async () => {
                                      try {
                                        await API.delete(`/players/${p._id}`);
                                        showToast(`Joueur ${p.gamertag} retiré avec succès ! 🐺`, 'success');
                                        fetchAllData();
                                      } catch (err) {
                                        showToast(err.response?.data?.message || 'Erreur lors de la suppression', 'error');
                                      }
                                    }
                                  });
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
                  </div>
                )}

                {/* 4. SOUS-ONGLET CANDIDATURES RECUES */}
                {playerSubTab === 'candidatures' && (
                  <div className="dash-list-col">
                    {selectedPlayerGameFilter !== 'Tous' && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        background: 'rgba(56, 189, 248, 0.08)',
                        border: '1px solid rgba(56, 189, 248, 0.25)',
                        borderRadius: '6px',
                        marginBottom: '12px',
                        fontSize: '12px',
                        color: '#cbd5e1'
                      }}>
                        <span>
                          Affichage des candidatures pour le jeu : <strong style={{ color: '#38bdf8' }}>{selectedPlayerGameFilter}</strong> ({currentFilteredApps.length})
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedPlayerGameFilter('Tous')}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#38bdf8',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            fontSize: '12px',
                            fontWeight: '700'
                          }}
                        >
                          Voir toutes les candidatures ({recruitmentList.length})
                        </button>
                      </div>
                    )}

                    {currentFilteredApps.length === 0 ? (
                      <div className="dash-empty-state" style={{ padding: '30px 20px', textAlign: 'center' }}>
                        Aucune candidature reçue {selectedPlayerGameFilter !== 'Tous' ? `pour le jeu "${selectedPlayerGameFilter}"` : 'pour le moment'}.
                      </div>
                    ) : (
                      currentFilteredApps.map((app) => (
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
            );
          })()}

          {/* TAB 5: TOURNOIS */}
          {activeNav === 'Tournois' && (
            <div className="dash-card">
              <div className="dash-card-header" style={{ flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <span className="dash-card-title">Tous les Matchs & Diffusions ({matches.length})</span>
                  <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>
                    Programmez vos tournois, lancez les diffusions LIVE en direct et ajustez les scores affichés sur le site.
                  </div>
                </div>
                <button 
                  className="btn-rejoindre" 
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px', cursor: 'pointer' }}
                  onClick={handleOpenCreateMatch}
                >
                  <Plus size={16} /> Programmer un Match
                </button>
              </div>

              {/* Quick Status Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', margin: '20px 0' }}>
                <div style={{ background: '#0a0d14', border: '1px solid #1a2336', borderRadius: '8px', padding: '14px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Matchs en Direct</div>
                  <div style={{ fontSize: '22px', fontWeight: '900', color: '#ff4d4d', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff0000', display: 'inline-block' }}></span>
                    {matches.filter(m => m.status === 'live').length}
                  </div>
                </div>
                <div style={{ background: '#0a0d14', border: '1px solid #1a2336', borderRadius: '8px', padding: '14px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Matchs à Venir</div>
                  <div style={{ fontSize: '22px', fontWeight: '900', color: '#38bdf8', marginTop: '4px' }}>
                    {matches.filter(m => m.status === 'upcoming' || !m.status).length}
                  </div>
                </div>
                <div style={{ background: '#0a0d14', border: '1px solid #1a2336', borderRadius: '8px', padding: '14px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Matchs Terminés</div>
                  <div style={{ fontSize: '22px', fontWeight: '900', color: '#22c55e', marginTop: '4px' }}>
                    {matches.filter(m => m.status === 'finished').length}
                  </div>
                </div>
              </div>

              <div className="dash-list-col">
                {matches.map((m) => {
                  const isLive = m.status === 'live';
                  const isFinished = m.status === 'finished';

                  return (
                    <div 
                      className="dash-list-item-row" 
                      key={m._id}
                      style={{
                        borderColor: isLive ? 'rgba(230,0,0,0.4)' : undefined,
                        background: isLive ? 'rgba(230,0,0,0.03)' : undefined
                      }}
                    >
                      <div className="dash-item-left" style={{ flex: 1 }}>
                        <div className="dash-wolf-badge-tiny" style={{ background: isLive ? 'rgba(230,0,0,0.2)' : undefined }}>
                          <WolfLogo size={18} />
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                            <span className="dash-item-title" style={{ fontSize: '15px' }}>
                              {m.game} : Dark Wolf vs {m.opponent}
                            </span>
                            <span style={{
                              fontSize: '10px',
                              fontWeight: '800',
                              padding: '2px 8px',
                              borderRadius: '10px',
                              background: isLive ? 'rgba(230,0,0,0.2)' : isFinished ? 'rgba(34,197,94,0.15)' : 'rgba(56,189,248,0.15)',
                              border: isLive ? '1px solid #e60000' : isFinished ? '1px solid #22c55e' : '1px solid #38bdf8',
                              color: isLive ? '#ff4d4d' : isFinished ? '#22c55e' : '#38bdf8'
                            }}>
                              {isLive ? '● EN DIRECT (LIVE)' : isFinished ? 'TERMINÉ' : 'À VENIR'}
                            </span>
                            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                              Format : {m.format || 'BO3'}
                            </span>
                          </div>

                          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                            Tournoi : <strong style={{ color: '#cbd5e1' }}>{m.tournamentName || 'DWT Championship'}</strong> • Date : {new Date(m.matchDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </div>

                          {m.streamUrl && (
                            <div style={{ fontSize: '11px', color: '#38bdf8', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span>📺 Flux stream : {m.streamUrl}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Score Controls */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 12px' }}>
                        <div style={{ textAlign: 'center', background: '#05070c', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <div style={{ fontSize: '10px', color: '#64748b' }}>SCORE DWT - ADV</div>
                          <div style={{ fontFamily: '"Orbitron", monospace', fontSize: '16px', fontWeight: '900', color: '#fff' }}>
                            {m.scoreDWT || 0} : {m.scoreOpponent || 0}
                          </div>
                        </div>

                        {/* Quick +/- score buttons */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <button
                            type="button"
                            title="+1 Dark Wolf"
                            onClick={() => handleQuickScoreMatch(m, 1, 0)}
                            style={{ background: '#1a2336', border: 'none', color: '#22c55e', fontSize: '10px', fontWeight: '800', padding: '2px 6px', borderRadius: '3px', cursor: 'pointer' }}
                          >
                            + DWT
                          </button>
                          <button
                            type="button"
                            title="-1 Dark Wolf"
                            onClick={() => handleQuickScoreMatch(m, -1, 0)}
                            style={{ background: '#1a2336', border: 'none', color: '#94a3b8', fontSize: '10px', padding: '2px 6px', borderRadius: '3px', cursor: 'pointer' }}
                          >
                            - DWT
                          </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <button
                            type="button"
                            title="+1 Adversaire"
                            onClick={() => handleQuickScoreMatch(m, 0, 1)}
                            style={{ background: '#1a2336', border: 'none', color: '#eab308', fontSize: '10px', fontWeight: '800', padding: '2px 6px', borderRadius: '3px', cursor: 'pointer' }}
                          >
                            + ADV
                          </button>
                          <button
                            type="button"
                            title="-1 Adversaire"
                            onClick={() => handleQuickScoreMatch(m, 0, -1)}
                            style={{ background: '#1a2336', border: 'none', color: '#94a3b8', fontSize: '10px', padding: '2px 6px', borderRadius: '3px', cursor: 'pointer' }}
                          >
                            - ADV
                          </button>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => handleToggleMatchLive(m)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: '800',
                            cursor: 'pointer',
                            background: isLive ? 'rgba(34,197,94,0.15)' : 'rgba(230,0,0,0.15)',
                            border: isLive ? '1px solid #22c55e' : '1px solid #e60000',
                            color: isLive ? '#22c55e' : '#ff4d4d'
                          }}
                        >
                          {isLive ? 'Arrêter Live' : '🔴 Lancer Live'}
                        </button>

                        <button 
                          className="btn-dash-approve"
                          style={{ padding: '6px 12px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                          onClick={() => handleOpenBroadcastMatch(m)}
                        >
                          <Edit3 size={13} /> Régler Diffusion
                        </button>

                        <button 
                          className="dash-more-btn"
                          title="Supprimer ce match"
                          onClick={() => {
                            openConfirm({
                              title: 'Supprimer ce Match ?',
                              message: `Supprimer le match contre ${m.opponent} (${m.game}) ?`,
                              subtext: 'Toutes les prédictions et scores associés seront supprimés de la plateforme.',
                              confirmText: 'Supprimer le Match',
                              type: 'danger',
                              onConfirm: async () => {
                                try {
                                  await API.delete(`/matches/${m._id}`);
                                  showToast('Match supprimé avec succès ! ⚔️✓', 'success');
                                  fetchAllData();
                                } catch (err) {
                                  showToast(err.response?.data?.message || 'Erreur lors de la suppression du match', 'error');
                                }
                              }
                            });
                          }}
                        >
                          <Trash2 size={16} color="#ff4d4d" />
                        </button>
                      </div>
                    </div>
                  );
                })}
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
                      onClick={() => {
                        openConfirm({
                          title: 'Supprimer cet Article ?',
                          message: `Supprimer l'article "${n.title}" des actualités ?`,
                          subtext: 'L\'article ne sera plus visible sur le portail public de la meute.',
                          confirmText: 'Supprimer l\'Article',
                          type: 'danger',
                          onConfirm: async () => {
                            try {
                              await API.delete(`/news/${n._id}`);
                              showToast('Article supprimé avec succès ! 📰✓', 'success');
                              fetchAllData();
                            } catch (err) {
                              showToast(err.response?.data?.message || 'Erreur suppression article', 'error');
                            }
                          }
                        });
                      }}
                      title="Supprimer cet article"
                    >
                      <Trash2 size={16} color="#ff4d4d" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: GESTION DES JEUX & AFFICHES */}
          {activeNav === 'Gestion des Jeux' && (
            <div className="dash-card">
              <div className="dash-card-header" style={{ flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <span className="dash-card-title">Titres Esports & Affiches ({gamesList.length})</span>
                  <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>
                    Gérez les jeux affichés sur le site, leurs effectifs et téléversez leurs affiches officielles.
                  </div>
                </div>
                <button 
                  className="btn-rejoindre" 
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 20px', cursor: 'pointer' }}
                  onClick={handleOpenCreateGame}
                >
                  <Plus size={16} /> Ajouter un Jeu & Affiche
                </button>
              </div>

              {/* KPI Mini-bar */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', margin: '20px 0' }}>
                <div style={{ background: '#0a0d14', border: '1px solid #1a2336', borderRadius: '8px', padding: '14px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Total Jeux</div>
                  <div style={{ fontSize: '22px', fontWeight: '900', color: '#fff', marginTop: '4px' }}>{gamesList.length}</div>
                </div>
                <div style={{ background: '#0a0d14', border: '1px solid #1a2336', borderRadius: '8px', padding: '14px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Jeux Actifs</div>
                  <div style={{ fontSize: '22px', fontWeight: '900', color: '#22c55e', marginTop: '4px' }}>
                    {gamesList.filter(g => g.isActive).length}
                  </div>
                </div>
                <div style={{ background: '#0a0d14', border: '1px solid #1a2336', borderRadius: '8px', padding: '14px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Affiches Importées</div>
                  <div style={{ fontSize: '22px', fontWeight: '900', color: '#38bdf8', marginTop: '4px' }}>
                    {gamesList.filter(g => g.posterImage).length}
                  </div>
                </div>
              </div>

              {/* Grid of games */}
              {gamesList.length === 0 ? (
                <div className="dash-empty-state">
                  Aucun jeu configuré. Cliquez sur "Ajouter un Jeu & Affiche" pour commencer.
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '20px',
                  marginTop: '16px'
                }}>
                  {gamesList.map((g) => (
                    <div 
                      key={g._id || g.name}
                      style={{
                        background: '#0d131f',
                        border: '1px solid #1c2638',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.2s, border-color 0.2s',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.4)'
                      }}
                    >
                      {/* Poster image container */}
                      <div style={{ position: 'relative', height: '180px', background: '#06080e', overflow: 'hidden' }}>
                        {g.posterImage ? (
                          <img 
                            src={getImageUrl(g.posterImage)} 
                            alt={g.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: `linear-gradient(135deg, ${g.color || '#ff4655'}22, #0a0a0a)`,
                            color: '#64748b',
                            fontSize: '12px'
                          }}>
                            <ImageIcon size={32} style={{ opacity: 0.4, marginBottom: '6px' }} />
                            <span>Aucune affiche</span>
                          </div>
                        )}

                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(to top, #0d131f 0%, transparent 60%)'
                        }}></div>

                        {/* Top Tag Badges */}
                        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px' }}>
                          <span style={{
                            background: 'rgba(6, 8, 14, 0.85)',
                            border: `1px solid ${g.color || '#ff4655'}`,
                            color: g.color || '#ff4655',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: '900',
                            letterSpacing: '0.08em'
                          }}>
                            {g.logo || g.name.slice(0, 4).toUpperCase()}
                          </span>
                        </div>

                        <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                          <span style={{
                            background: g.isActive ? 'rgba(34, 197, 94, 0.25)' : 'rgba(100, 116, 139, 0.25)',
                            border: g.isActive ? '1px solid #22c55e' : '1px solid #64748b',
                            color: g.isActive ? '#4ade80' : '#94a3b8',
                            fontSize: '11px',
                            fontWeight: '700',
                            padding: '2px 8px',
                            borderRadius: '12px'
                          }}>
                            {g.isActive ? 'Actif' : 'Inactif'}
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', margin: 0 }}>
                            {g.name}
                          </h3>
                          <span 
                            title={`Couleur d'accent: ${g.color}`}
                            style={{
                              width: '14px',
                              height: '14px',
                              borderRadius: '50%',
                              background: g.color || '#ff4655',
                              border: '2px solid rgba(255,255,255,0.4)'
                            }}
                          ></span>
                        </div>

                        <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>
                          Effectif : <strong style={{ color: g.color || '#fff' }}>{g.mem || 'Non spécifié'}</strong>
                        </div>

                        {/* Joueurs assignés à ce jeu */}
                        {(() => {
                          const assignedPlayers = playersList.filter(p => (p.game || '').toLowerCase() === g.name.toLowerCase());
                          return (
                            <div style={{ background: '#080c14', border: '1px solid #141c2b', borderRadius: '8px', padding: '10px 12px', marginBottom: '14px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                                <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>
                                  Roster assigné ({assignedPlayers.length} joueurs)
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedPlayerGameFilter(g.name);
                                    setActiveNav('Gestion des Joueurs');
                                    setPlayerSubTab('roster');
                                  }}
                                  style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '11px', fontWeight: '700', cursor: 'pointer', padding: 0 }}
                                >
                                  Gérer Roster →
                                </button>
                              </div>
                              {assignedPlayers.length > 0 ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                  {assignedPlayers.slice(0, 5).map((pl) => (
                                    <span
                                      key={pl._id}
                                      style={{
                                        fontSize: '11px',
                                        color: '#cbd5e1',
                                        background: 'rgba(255,255,255,0.06)',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        border: '1px solid rgba(255,255,255,0.1)'
                                      }}
                                    >
                                      {pl.gamertag} ({pl.role || 'Titulaire'})
                                    </span>
                                  ))}
                                  {assignedPlayers.length > 5 && (
                                    <span style={{ fontSize: '10px', color: '#64748b' }}>+{assignedPlayers.length - 5}</span>
                                  )}
                                </div>
                              ) : (
                                <div style={{ fontSize: '11px', color: '#475569', fontStyle: 'italic' }}>
                                  Aucun joueur encore assigné à cette équipe.
                                </div>
                              )}
                            </div>
                          );
                        })()}

                        <div style={{
                          fontSize: '12px',
                          color: '#64748b',
                          lineHeight: '1.4',
                          minHeight: '34px',
                          marginBottom: '16px',
                          flex: 1
                        }}>
                          {g.description || 'Aucune description rédigée.'}
                        </div>

                        {/* Card Actions */}
                        <div style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid #1a2336' }}>
                          <button
                            type="button"
                            className="btn-dash-approve"
                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', padding: '6px 12px' }}
                            onClick={() => handleOpenEditGame(g)}
                          >
                            <Edit3 size={14} /> Modifier / Affiche
                          </button>
                          <button
                            type="button"
                            className="btn-dash-reject"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px 10px' }}
                            title="Supprimer ce jeu"
                            onClick={() => handleDeleteGame(g._id)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: GESTION DU MUSEUM (ARCHIVE DWT) */}
          {activeNav === 'Museum (Archive)' && (
            <div className="dash-card">
              <div className="dash-card-header" style={{ flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <span className="dash-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Layers size={20} color="#38bdf8" />
                    Museum DWT • Pièces d'Archives & Drops Historiques ({museumList.length})
                  </span>
                  <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>
                    Gérez les maillots rétro, drops rares, hoodies collector et pièces d'archives affichés dans le Museum du site.
                  </div>
                </div>
                <button 
                  className="btn-rejoindre" 
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 20px', cursor: 'pointer' }}
                  onClick={handleOpenCreateMuseumItem}
                >
                  <Plus size={16} /> Ajouter une Pièce d'Archive
                </button>
              </div>

              {/* KPI Mini-bar */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', margin: '20px 0' }}>
                <div style={{ background: '#0a0d14', border: '1px solid #1a2336', borderRadius: '8px', padding: '14px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Total Pièces</div>
                  <div style={{ fontSize: '22px', fontWeight: '900', color: '#fff', marginTop: '4px' }}>{museumList.length}</div>
                </div>
                <div style={{ background: '#0a0d14', border: '1px solid #1a2336', borderRadius: '8px', padding: '14px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Pièces Actives</div>
                  <div style={{ fontSize: '22px', fontWeight: '900', color: '#22c55e', marginTop: '4px' }}>
                    {museumList.filter(m => m.isActive !== false).length}
                  </div>
                </div>
                <div style={{ background: '#0a0d14', border: '1px solid #1a2336', borderRadius: '8px', padding: '14px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Catégories Rares</div>
                  <div style={{ fontSize: '22px', fontWeight: '900', color: '#38bdf8', marginTop: '4px' }}>
                    {new Set(museumList.map(m => m.cat)).size}
                  </div>
                </div>
              </div>

              {/* Grid of Museum Items */}
              {museumList.length === 0 ? (
                <div className="dash-empty-state">
                  Aucune pièce dans le musée pour le moment. Cliquez sur "Ajouter une Pièce d'Archive" pour commencer.
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '20px',
                  marginTop: '16px'
                }}>
                  {museumList.map((item) => (
                    <div 
                      key={item._id || item.name}
                      style={{
                        background: '#0d131f',
                        border: '1px solid #1c2638',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.4)'
                      }}
                    >
                      <div style={{ position: 'relative', height: '220px', background: '#06080e', overflow: 'hidden' }}>
                        {item.image ? (
                          <img 
                            src={getImageUrl(item.image)} 
                            alt={item.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                            <ImageIcon size={32} />
                          </div>
                        )}
                        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px' }}>
                          <span style={{
                            background: 'rgba(6, 8, 14, 0.85)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            color: '#fff',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: '700'
                          }}>
                            {item.cat || 'Archive'} • {item.year || '2023'}
                          </span>
                        </div>
                        <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                          <button
                            type="button"
                            onClick={() => handleToggleMuseumActive(item)}
                            style={{
                              background: item.isActive !== false ? 'rgba(34, 197, 94, 0.25)' : 'rgba(100, 116, 139, 0.25)',
                              border: item.isActive !== false ? '1px solid #22c55e' : '1px solid #64748b',
                              color: item.isActive !== false ? '#4ade80' : '#94a3b8',
                              fontSize: '11px',
                              fontWeight: '700',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              cursor: 'pointer'
                            }}
                          >
                            {item.isActive !== false ? 'Actif' : 'Masqué'}
                          </button>
                        </div>
                      </div>

                      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#fff', margin: 0 }}>
                            {item.name}
                          </h3>
                          <span style={{ fontSize: '13px', fontWeight: '800', color: '#38bdf8', fontFamily: '"Orbitron", monospace' }}>
                            {item.price || 'TND 0'}
                          </span>
                        </div>
                        <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.5, flex: 1, margin: '0 0 16px' }}>
                          {item.desc || 'Aucune description rédigée.'}
                        </p>
                        <div style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid #1a2336' }}>
                          <button
                            type="button"
                            className="btn-dash-approve"
                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', padding: '6px 12px' }}
                            onClick={() => handleOpenEditMuseumItem(item)}
                          >
                            <Edit3 size={14} /> Modifier
                          </button>
                          <button
                            type="button"
                            className="btn-dash-reject"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px 10px' }}
                            title="Supprimer cette pièce"
                            onClick={() => handleDeleteMuseumItem(item._id, item.name)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: AFFICHES CINEMATIQUES (HERO SLIDER) */}
          {activeNav === 'Affiches Cinématiques' && (
            <div className="dash-card">
              <div className="dash-card-header" style={{ flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <span className="dash-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <SlidersHorizontal size={20} color="var(--red-primary)" />
                    Carrousel & Affiches Cinématiques ({slidesList.length})
                  </span>
                  <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>
                    Gérez les bannières et scènes cinématographiques plein écran affichées dans le Hero Slider de la page d'accueil.
                  </div>
                </div>
                <button 
                  className="btn-rejoindre" 
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 20px', cursor: 'pointer' }}
                  onClick={handleOpenCreateSlide}
                >
                  <Plus size={16} /> Ajouter une Affiche Cinématique
                </button>
              </div>

              {/* KPI Mini-bar */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', margin: '20px 0' }}>
                <div style={{ background: '#0a0d14', border: '1px solid #1a2336', borderRadius: '8px', padding: '14px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Total Diapositives</div>
                  <div style={{ fontSize: '22px', fontWeight: '900', color: '#fff', marginTop: '4px' }}>{slidesList.length}</div>
                </div>
                <div style={{ background: '#0a0d14', border: '1px solid #1a2336', borderRadius: '8px', padding: '14px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Affiches Actives</div>
                  <div style={{ fontSize: '22px', fontWeight: '900', color: '#22c55e', marginTop: '4px' }}>
                    {slidesList.filter(s => s.isActive).length}
                  </div>
                </div>
                <div style={{ background: '#0a0d14', border: '1px solid #1a2336', borderRadius: '8px', padding: '14px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Mode Défilement</div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#38bdf8', marginTop: '8px' }}>
                    Carrousel Auto (7s)
                  </div>
                </div>
              </div>

              {/* Grid of slides */}
              {slidesList.length === 0 ? (
                <div className="dash-empty-state">
                  Aucune affiche cinématique configurée. Cliquez sur "Ajouter une Affiche Cinématique" pour créer votre première scène !
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '20px',
                  marginTop: '16px'
                }}>
                  {slidesList.map((slide, sIdx) => (
                    <div 
                      key={slide._id || sIdx}
                      style={{
                        background: '#0d131f',
                        border: '1px solid #1c2638',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
                        transition: 'transform 0.2s, border-color 0.2s'
                      }}
                    >
                      {/* Background Visual Preview */}
                      <div style={{ position: 'relative', height: '190px', background: '#06080e', overflow: 'hidden' }}>
                        {slide.backgroundImage ? (
                          <img 
                            src={getImageUrl(slide.backgroundImage)} 
                            alt={slide.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'linear-gradient(135deg, rgba(230,0,0,0.1), #0a0a0a)',
                            color: '#64748b',
                            fontSize: '12px'
                          }}>
                            <ImageIcon size={32} style={{ opacity: 0.4, marginBottom: '6px' }} />
                            <span>Aucune affiche</span>
                          </div>
                        )}

                        {/* Dark Gradient Overlay for Cinematic Feel */}
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(to top, rgba(13,19,31,0.95) 0%, rgba(13,19,31,0.3) 50%, rgba(0,0,0,0.6) 100%)'
                        }}></div>

                        {/* Top Badges */}
                        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <span style={{
                            background: 'var(--red-primary)',
                            color: '#fff',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: '900',
                            letterSpacing: '0.05em'
                          }}>
                            #{slide.order !== undefined ? slide.order + 1 : sIdx + 1}
                          </span>
                          <span style={{
                            background: 'rgba(6, 8, 14, 0.85)',
                            border: '1px solid #334155',
                            color: '#cbd5e1',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: '700'
                          }}>
                            {slide.label || 'Collection'}
                          </span>
                        </div>

                        <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                          <button
                            type="button"
                            onClick={() => handleToggleSlideActive(slide)}
                            style={{
                              background: slide.isActive ? 'rgba(34, 197, 94, 0.25)' : 'rgba(100, 116, 139, 0.25)',
                              border: slide.isActive ? '1px solid #22c55e' : '1px solid #64748b',
                              color: slide.isActive ? '#4ade80' : '#94a3b8',
                              fontSize: '11px',
                              fontWeight: '700',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              cursor: 'pointer'
                            }}
                            title="Cliquer pour activer/désactiver"
                          >
                            {slide.isActive ? '● Actif' : '○ Inactif'}
                          </button>
                        </div>

                        {/* Title inside visual preview */}
                        <div style={{ position: 'absolute', bottom: '12px', left: '14px', right: '14px' }}>
                          <h4 style={{ 
                            fontSize: '16px', 
                            fontWeight: '900', 
                            color: '#fff', 
                            margin: 0, 
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                          }}>
                            {slide.title}
                          </h4>
                        </div>
                      </div>

                      {/* Card Content & Details */}
                      <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <p style={{
                          fontSize: '12px',
                          color: '#94a3b8',
                          lineHeight: '1.4',
                          minHeight: '34px',
                          margin: '0 0 12px',
                          flex: 1
                        }}>
                          {slide.subtitle || 'Aucun sous-titre.'}
                        </p>

                        {/* Buttons config preview */}
                        <div style={{ 
                          background: '#070a10', 
                          border: '1px solid #1a2233', 
                          borderRadius: '6px', 
                          padding: '8px 10px', 
                          marginBottom: '14px',
                          fontSize: '11px',
                          color: '#64748b',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Btn 1: <strong style={{ color: '#fff' }}>{slide.btn1Text || 'Non défini'}</strong></span>
                            <span style={{ color: '#38bdf8' }}>{slide.btn1Target || '#'}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Btn 2: <strong style={{ color: '#fff' }}>{slide.btn2Text || 'Non défini'}</strong></span>
                            <span style={{ color: '#38bdf8' }}>{slide.btn2Target || '#'}</span>
                          </div>
                        </div>

                        {/* Actions buttons */}
                        <div style={{ display: 'flex', gap: '8px', paddingTop: '10px', borderTop: '1px solid #1a2336' }}>
                          <button
                            type="button"
                            className="btn-dash-approve"
                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', padding: '6px 12px' }}
                            onClick={() => handleOpenEditSlide(slide)}
                          >
                            <Edit3 size={14} /> Modifier / Affiche
                          </button>
                          <button
                            type="button"
                            className="btn-dash-reject"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px 10px' }}
                            title="Supprimer cette diapositive"
                            onClick={() => handleDeleteSlide(slide._id, slide.title)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: GESTION DES VIDÉOS, TRAILERS & PUBS PRODUITS */}
          {activeNav === 'Vidéos & Trailers' && (
            <div className="dash-card">
              <div className="dash-card-header" style={{ flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <span className="dash-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Film size={20} color="var(--red-primary)" />
                    Médiathèque, Trailers & Pubs Produits ({videosList.length})
                  </span>
                  <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>
                    Gérez le trailer cinématique de l'équipe, les spots publicitaires pour vos articles de boutique et les annonces vidéo.
                  </div>
                </div>
                <button 
                  type="button"
                  className="btn-rejoindre" 
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 20px', cursor: 'pointer' }}
                  onClick={handleOpenCreateVideo}
                >
                  <Plus size={16} /> Ajouter une Vidéo / Trailer
                </button>
              </div>

              {/* KPI Mini-bar */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px', margin: '20px 0' }}>
                <div style={{ background: '#0a0d14', border: '1px solid #1a2336', borderRadius: '8px', padding: '14px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Total Vidéos</div>
                  <div style={{ fontSize: '22px', fontWeight: '900', color: '#fff', marginTop: '4px' }}>{videosList.length}</div>
                </div>
                <div style={{ background: '#0a0d14', border: '1px solid #1a2336', borderRadius: '8px', padding: '14px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Trailer Principal</div>
                  <div style={{ fontSize: '14px', fontWeight: '900', color: '#ff4d4d', marginTop: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {videosList.find(v => v.isMainTrailer)?.title || 'Par défaut'}
                  </div>
                </div>
                <div style={{ background: '#0a0d14', border: '1px solid #1a2336', borderRadius: '8px', padding: '14px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Pubs Boutique</div>
                  <div style={{ fontSize: '22px', fontWeight: '900', color: '#f59e0b', marginTop: '4px' }}>
                    {videosList.filter(v => v.category === 'product_ad').length}
                  </div>
                </div>
                <div style={{ background: '#0a0d14', border: '1px solid #1a2336', borderRadius: '8px', padding: '14px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Annonces Vidéos</div>
                  <div style={{ fontSize: '22px', fontWeight: '900', color: '#38bdf8', marginTop: '4px' }}>
                    {videosList.filter(v => v.category === 'announcement').length}
                  </div>
                </div>
              </div>

              {/* Filter Tabs */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                {[
                  { id: 'all', label: `Toutes (${videosList.length})` },
                  { id: 'trailer', label: `🎬 Trailers (${videosList.filter(v => v.category === 'trailer').length})` },
                  { id: 'product_ad', label: `🛍️ Pubs Produits (${videosList.filter(v => v.category === 'product_ad').length})` },
                  { id: 'announcement', label: `📢 Annonces (${videosList.filter(v => v.category === 'announcement').length})` },
                  { id: 'match_highlight', label: `🏆 Matchs (${videosList.filter(v => v.category === 'match_highlight').length})` }
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setVideoFilter(tab.id)}
                    style={{
                      background: videoFilter === tab.id ? 'var(--red-primary)' : 'rgba(255,255,255,0.04)',
                      border: videoFilter === tab.id ? '1px solid var(--red-primary)' : '1px solid rgba(255,255,255,0.1)',
                      color: videoFilter === tab.id ? '#fff' : '#94a3b8',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontFamily: 'inherit'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Grid of videos */}
              {videosList.filter(v => videoFilter === 'all' || v.category === videoFilter).length === 0 ? (
                <div className="dash-empty-state">
                  Aucune vidéo trouvée dans cette catégorie. Cliquez sur "Ajouter une Vidéo / Trailer" pour publier votre premier contenu !
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '20px',
                  marginTop: '16px'
                }}>
                  {videosList.filter(v => videoFilter === 'all' || v.category === videoFilter).map((video, vIdx) => {
                    const isMain = video.isMainTrailer;
                    return (
                      <div 
                        key={video._id || vIdx}
                        style={{
                          background: '#0d131f',
                          border: isMain ? '2px solid #e60000' : '1px solid #1c2638',
                          borderRadius: '10px',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          boxShadow: isMain ? '0 0 25px rgba(230,0,0,0.3)' : '0 4px 15px rgba(0,0,0,0.4)',
                          transition: 'transform 0.2s, border-color 0.2s',
                          position: 'relative'
                        }}
                      >
                        {/* Video Thumbnail Preview */}
                        <div 
                          style={{ position: 'relative', height: '180px', background: '#06080e', overflow: 'hidden', cursor: 'pointer' }}
                          onClick={() => setPreviewVideoModal(video)}
                          title="Cliquer pour prévisualiser la vidéo"
                        >
                          <img 
                            src={getImageUrl(video.thumbnail || '/backgrounds/hero-gaming-bg.jpg')} 
                            alt={video.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />

                          {/* Overlay play button */}
                          <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(0,0,0,0.45)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.2s'
                          }}>
                            <div style={{
                              width: '44px',
                              height: '44px',
                              borderRadius: '50%',
                              background: 'rgba(230,0,0,0.9)',
                              boxShadow: '0 0 20px rgba(230,0,0,0.6)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <Play size={20} color="#fff" style={{ marginLeft: '2px' }} />
                            </div>
                          </div>

                          {/* Top Left Badges */}
                          <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', flexDirection: 'column', gap: '4px', zIndex: 2 }}>
                            {isMain && (
                              <span style={{
                                background: 'linear-gradient(135deg, #e60000, #ff4d4d)',
                                color: '#fff',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                fontSize: '10px',
                                fontWeight: '900',
                                letterSpacing: '0.05em',
                                boxShadow: '0 0 10px rgba(230,0,0,0.6)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}>
                                <Sparkles size={11} /> ★ TRAILER PRINCIPAL
                              </span>
                            )}
                            <span style={{
                              background: video.category === 'product_ad' ? 'rgba(245, 158, 11, 0.9)' : video.category === 'announcement' ? 'rgba(56, 189, 248, 0.9)' : 'rgba(6, 8, 14, 0.85)',
                              color: '#fff',
                              border: '1px solid rgba(255,255,255,0.2)',
                              padding: '2px 7px',
                              borderRadius: '4px',
                              fontSize: '10px',
                              fontWeight: '800'
                            }}>
                              {video.category === 'trailer' ? '🎬 TRAILER' : video.category === 'product_ad' ? '🛍️ PUB PRODUIT' : video.category === 'announcement' ? '📢 ANNONCE' : '🏆 MATCH'}
                            </span>
                            <span style={{
                              background: video.videoUrl?.startsWith('/uploads/') || /\.(mp4|webm|mov|ogg|mkv|m4v)(\?.*)?$/i.test(video.videoUrl || '') ? 'rgba(34, 197, 94, 0.2)' : 'rgba(230, 0, 0, 0.2)',
                              color: video.videoUrl?.startsWith('/uploads/') || /\.(mp4|webm|mov|ogg|mkv|m4v)(\?.*)?$/i.test(video.videoUrl || '') ? '#22c55e' : '#ff4d4d',
                              border: video.videoUrl?.startsWith('/uploads/') || /\.(mp4|webm|mov|ogg|mkv|m4v)(\?.*)?$/i.test(video.videoUrl || '') ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid rgba(230, 0, 0, 0.4)',
                              padding: '2px 7px',
                              borderRadius: '4px',
                              fontSize: '9px',
                              fontWeight: '900',
                              letterSpacing: '0.04em'
                            }}>
                              {video.videoUrl?.startsWith('/uploads/') || /\.(mp4|webm|mov|ogg|mkv|m4v)(\?.*)?$/i.test(video.videoUrl || '') ? '📁 MP4 LOCAL' : '🔴 YOUTUBE'}
                            </span>
                          </div>

                          {/* Duration bottom-right */}
                          {video.duration && (
                            <span style={{
                              position: 'absolute',
                              bottom: '8px',
                              right: '8px',
                              background: 'rgba(0,0,0,0.85)',
                              color: '#fff',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '10px',
                              fontWeight: '700'
                            }}>
                              {video.duration}
                            </span>
                          )}

                          {/* Active Status top-right */}
                          <div style={{ position: 'absolute', top: '10px', right: '10px' }} onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => handleToggleVideoActive(video)}
                              style={{
                                background: video.isActive ? 'rgba(34, 197, 94, 0.25)' : 'rgba(100, 116, 139, 0.25)',
                                border: video.isActive ? '1px solid #22c55e' : '1px solid #64748b',
                                color: video.isActive ? '#4ade80' : '#94a3b8',
                                fontSize: '10px',
                                fontWeight: '700',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                cursor: 'pointer'
                              }}
                              title="Activer ou masquer cette vidéo sur le site"
                            >
                              {video.isActive ? '● En ligne' : '○ Masquée'}
                            </button>
                          </div>
                        </div>

                        {/* Card Content & Details */}
                        <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <h4 style={{ 
                            fontSize: '15px', 
                            fontWeight: '800', 
                            color: '#fff', 
                            margin: '0 0 4px', 
                            lineHeight: '1.3'
                          }}>
                            {video.title}
                          </h4>

                          {video.subtitle && (
                            <div style={{ fontSize: '12px', color: '#38bdf8', fontWeight: '600', marginBottom: '8px' }}>
                              {video.subtitle}
                            </div>
                          )}

                          <p style={{
                            fontSize: '12px',
                            color: '#94a3b8',
                            lineHeight: '1.4',
                            minHeight: '34px',
                            margin: '0 0 10px',
                            flex: 1,
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                          }}>
                            {video.description || 'Aucune description.'}
                          </p>

                          {/* CTA info pill */}
                          {video.ctaText && video.ctaLink && (
                            <div style={{
                              background: '#070a10',
                              border: '1px solid #1a2233',
                              borderRadius: '6px',
                              padding: '6px 10px',
                              marginBottom: '12px',
                              fontSize: '11px',
                              color: '#64748b',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}>
                              <span style={{ color: '#cbd5e1' }}>Bouton: <strong>{video.ctaText}</strong></span>
                              <span style={{ color: '#38bdf8', fontSize: '10px' }}>{video.ctaLink}</span>
                            </div>
                          )}

                          {/* Stats info */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginBottom: '12px' }}>
                            <span>{video.views || '0 vues'}</span>
                            <span>Ordre: #{video.order !== undefined ? video.order : 0}</span>
                          </div>

                          {/* Action Buttons */}
                          <div style={{ display: 'flex', gap: '6px', paddingTop: '10px', borderTop: '1px solid #1a2336' }}>
                            {!isMain && (
                              <button
                                type="button"
                                className="btn-dash-approve"
                                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '11px', padding: '6px 8px', background: 'rgba(230,0,0,0.15)', borderColor: 'rgba(230,0,0,0.5)', color: '#ff4d4d' }}
                                onClick={() => handleSetMainTrailer(video)}
                                title="Mettre cette vidéo en vedette comme Trailer Principal sur le site"
                              >
                                <Star size={13} /> Trailer Vedette
                              </button>
                            )}

                            <button
                              type="button"
                              className="btn-dash-approve"
                              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '11px', padding: '6px 8px' }}
                              onClick={() => handleOpenEditVideo(video)}
                              title="Modifier la vidéo"
                            >
                              <Edit3 size={13} /> Modifier
                            </button>

                            <button
                              type="button"
                              className="btn-dash-reject"
                              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px 10px' }}
                              title="Supprimer cette vidéo"
                              onClick={() => handleDeleteVideo(video._id, video.title)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
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
              {/* SECTION 1: PHOTOS DU PRODUIT DEPUIS LE PC (MULTI-IMAGES) */}
              <div className="dash-form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="dash-form-label" style={{ margin: 0 }}>
                    Photos du produit (Depuis votre PC) *
                    {Array.isArray(productFormData.images) && productFormData.images.length > 0 && (
                      <span style={{ marginLeft: '8px', color: '#38bdf8', fontWeight: '700', fontSize: '13px' }}>
                        ({productFormData.images.length} photo{productFormData.images.length > 1 ? 's' : ''} importée{productFormData.images.length > 1 ? 's' : ''})
                      </span>
                    )}
                  </label>
                  {uploadingImage && (
                    <span style={{ color: 'var(--red-primary)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <RefreshCw size={14} className="animate-spin" /> Téléversement en cours...
                    </span>
                  )}
                </div>

                {/* Input file caché déclenché au clic (Supporte plusieurs photos simultanées) */}
                <input 
                  type="file" 
                  multiple
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/jpg, image/webp, image/gif, image/avif" 
                  style={{ display: 'none' }}
                  onClick={(e) => { e.target.value = null; }}
                  onChange={(e) => {
                    if (e.target.files?.length) handleUploadProductImages(e.target.files);
                  }}
                />

                {Array.isArray(productFormData.images) && productFormData.images.length > 0 ? (
                  <div style={{ background: '#080c14', border: '1px solid #1e283d', borderRadius: '10px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                        La 1ère photo (<strong>#1 Recto</strong>) sert de couverture. La 2ème (<strong>#2 Verso</strong>) s'affiche au survol sur la boutique.
                      </div>
                      <button 
                        type="button"
                        className="btn-dash-approve"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', fontSize: '12px' }}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Plus size={14} /> Ajouter d'autres photos
                      </button>
                    </div>

                    {/* Grille des photos importées */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                      gap: '12px'
                    }}>
                      {productFormData.images.map((imgUrl, idx) => (
                        <div 
                          key={idx}
                          style={{
                            position: 'relative',
                            background: '#0d131f',
                            border: idx === 0 ? '2px solid var(--red-primary)' : '1px solid #1e293b',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                          }}
                        >
                          <div style={{ width: '100%', height: '110px', background: '#05070c' }}>
                            <img 
                              src={getImageUrl(imgUrl)} 
                              alt={`Produit ${idx + 1}`}
                              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            />
                          </div>

                          {/* Badge de position */}
                          <div style={{
                            position: 'absolute',
                            top: '6px',
                            left: '6px',
                            background: idx === 0 ? 'var(--red-primary)' : (idx === 1 ? '#0284c7' : 'rgba(15, 23, 42, 0.85)'),
                            color: '#fff',
                            fontSize: '10px',
                            fontWeight: '800',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.5)'
                          }}>
                            {idx === 0 ? '#1 Recto' : (idx === 1 ? '#2 Verso' : `#${idx + 1}`)}
                          </div>

                          {/* Bouton de suppression */}
                          <button
                            type="button"
                            title="Supprimer cette photo"
                            onClick={() => handleRemoveProductImage(idx)}
                            style={{
                              position: 'absolute',
                              top: '6px',
                              right: '6px',
                              background: 'rgba(239, 68, 68, 0.85)',
                              border: 'none',
                              color: '#fff',
                              borderRadius: '4px',
                              padding: '3px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Trash2 size={12} />
                          </button>

                          {/* Actions en bas de vignette */}
                          {idx !== 0 && (
                            <button
                              type="button"
                              onClick={() => handleSetMainProductImage(idx)}
                              style={{
                                width: '100%',
                                background: '#131b2c',
                                border: 'none',
                                borderTop: '1px solid #1e293b',
                                color: '#94a3b8',
                                fontSize: '10px',
                                padding: '4px 0',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                fontWeight: '600'
                              }}
                              onMouseOver={(e) => { e.currentTarget.style.color = '#38bdf8'; e.currentTarget.style.background = '#1e293b'; }}
                              onMouseOut={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = '#131b2c'; }}
                            >
                              Mettre en Recto
                            </button>
                          )}
                        </div>
                      ))}
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
                      if (e.dataTransfer.files?.length) handleUploadProductImages(e.dataTransfer.files);
                    }}
                  >
                    <div className="product-upload-icon-circle">
                      {uploadingImage ? <RefreshCw className="animate-spin" size={24} /> : <Upload size={24} />}
                    </div>
                    <div>
                      <div style={{ color: '#fff', fontWeight: '700', fontSize: '14px' }}>
                        {uploadingImage ? 'Téléversement des photos...' : 'Cliquez ici ou glissez une ou plusieurs photos depuis votre PC'}
                      </div>
                      <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>
                        Formats acceptés : PNG, JPG, JPEG, WEBP, AVIF (Max 15 Mo / image) • Vous pouvez en sélectionner plusieurs !
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
                  onClick={(e) => { e.target.value = null; }}
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

      {/* MODAL: PROGRAMMER OU DIFFUSER UN MATCH */}
      {showMatchModal && (
        <div className="dash-modal-backdrop">
          <div className="dash-modal-box" style={{ maxWidth: '640px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 className="dash-modal-title" style={{ margin: 0 }}>
                {editingMatch ? 'Diffuser / Modifier le Match' : 'Programmer un Match'}
              </h3>
              {matchFormData.status === 'live' && (
                <span style={{
                  background: 'rgba(230,0,0,0.2)',
                  border: '1px solid #e60000',
                  color: '#ff4d4d',
                  fontSize: '11px',
                  fontWeight: '800',
                  padding: '2px 8px',
                  borderRadius: '10px'
                }}>
                  DIFFUSION EN DIRECT 🔴
                </span>
              )}
            </div>

            <form onSubmit={handleSaveMatch}>
              <div className="dash-form-group">
                <label className="dash-form-label">Nom de la Compétition / Tournoi *</label>
                <input 
                  type="text" 
                  className="dash-form-input" 
                  value={matchFormData.tournamentName}
                  onChange={(e) => setMatchFormData({ ...matchFormData, tournamentName: e.target.value })}
                  placeholder="Ex: Tunisia Cup CS2, Valorant Champions Tour MENA" 
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="dash-form-group">
                  <label className="dash-form-label">Jeu (ex: CS2, Valorant, FC 25) *</label>
                  <input 
                    type="text" 
                    className="dash-form-input" 
                    value={matchFormData.game}
                    onChange={(e) => setMatchFormData({ ...matchFormData, game: e.target.value })}
                    required 
                  />
                </div>
                <div className="dash-form-group">
                  <label className="dash-form-label">Équipe Adverse *</label>
                  <input 
                    type="text" 
                    className="dash-form-input" 
                    value={matchFormData.opponent}
                    onChange={(e) => setMatchFormData({ ...matchFormData, opponent: e.target.value })}
                    required 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="dash-form-group">
                  <label className="dash-form-label">Statut du Match *</label>
                  <select 
                    className="dash-form-select"
                    value={matchFormData.status}
                    onChange={(e) => setMatchFormData({ ...matchFormData, status: e.target.value })}
                  >
                    <option value="upcoming">À venir (Upcoming)</option>
                    <option value="live">EN DIRECT (Live Now 🔴)</option>
                    <option value="finished">Terminé (Finished)</option>
                  </select>
                </div>

                <div className="dash-form-group">
                  <label className="dash-form-label">Format de la rencontre</label>
                  <select 
                    className="dash-form-select"
                    value={matchFormData.format}
                    onChange={(e) => setMatchFormData({ ...matchFormData, format: e.target.value })}
                  >
                    <option value="BO1">Best of 1 (BO1)</option>
                    <option value="BO3">Best of 3 (BO3)</option>
                    <option value="BO5">Best of 5 (BO5)</option>
                  </select>
                </div>
              </div>

              <div className="dash-form-group">
                <label className="dash-form-label">Lien du Flux Vidéo Stream (Twitch, YouTube, Kick) 📺</label>
                <input 
                  type="text" 
                  className="dash-form-input" 
                  value={matchFormData.streamUrl}
                  onChange={(e) => setMatchFormData({ ...matchFormData, streamUrl: e.target.value })}
                  placeholder="https://www.twitch.tv/darkw0lfteam ou chaîne twitch (ex: valorant, eslcs)" 
                />
                
                {/* Boutons d'accès rapide aux flux esport officiels */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>Flux Rapides :</span>
                  <button
                    type="button"
                    onClick={() => setMatchFormData({ ...matchFormData, streamUrl: 'https://www.twitch.tv/darkw0lfteam' })}
                    style={{ background: 'rgba(145, 70, 255, 0.2)', border: '1px solid #9146FF', color: '#c084fc', fontSize: '11px', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    🐺 Twitch DWT Officiel
                  </button>
                  <button
                    type="button"
                    onClick={() => setMatchFormData({ ...matchFormData, streamUrl: 'https://www.twitch.tv/valorant' })}
                    style={{ background: '#131b2c', border: '1px solid #1e293b', color: '#38bdf8', fontSize: '11px', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Twitch Valorant
                  </button>
                  <button
                    type="button"
                    onClick={() => setMatchFormData({ ...matchFormData, streamUrl: 'https://www.twitch.tv/eslcs' })}
                    style={{ background: '#131b2c', border: '1px solid #1e293b', color: '#38bdf8', fontSize: '11px', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Twitch CS2 (ESL)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMatchFormData({ ...matchFormData, streamUrl: 'https://www.twitch.tv/riotgames' })}
                    style={{ background: '#131b2c', border: '1px solid #1e293b', color: '#38bdf8', fontSize: '11px', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Twitch LoL (Riot)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMatchFormData({ ...matchFormData, streamUrl: 'https://www.twitch.tv/rocketleague' })}
                    style={{ background: '#131b2c', border: '1px solid #1e293b', color: '#38bdf8', fontSize: '11px', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Twitch Rocket League
                  </button>
                </div>

                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
                  Les spectateurs pourront regarder ce stream en direct en cliquant sur le match sur le site !
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="dash-form-group">
                  <label className="dash-form-label">Score Dark Wolf Team</label>
                  <input 
                    type="number" 
                    min="0"
                    className="dash-form-input" 
                    value={matchFormData.scoreDWT}
                    onChange={(e) => setMatchFormData({ ...matchFormData, scoreDWT: e.target.value })}
                  />
                </div>
                <div className="dash-form-group">
                  <label className="dash-form-label">Score Équipe Adverse</label>
                  <input 
                    type="number" 
                    min="0"
                    className="dash-form-input" 
                    value={matchFormData.scoreOpponent}
                    onChange={(e) => setMatchFormData({ ...matchFormData, scoreOpponent: e.target.value })}
                  />
                </div>
              </div>

              <div className="dash-form-group">
                <label className="dash-form-label">Date et Heure du Match *</label>
                <input 
                  type="datetime-local" 
                  className="dash-form-input" 
                  value={matchFormData.matchDate}
                  onChange={(e) => setMatchFormData({ ...matchFormData, matchDate: e.target.value })}
                  required 
                />
              </div>

              <div className="dash-modal-btn-row">
                <button type="button" className="btn-dash-approve" onClick={() => setShowMatchModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn-dash-reject">
                  {editingMatch ? (matchFormData.status === 'live' ? 'Diffuser en Direct 🔴' : 'Sauvegarder') : 'Programmer le Match'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: AJOUTER OU MODIFIER UN JOUEUR */}
      {showPlayerModal && (
        <div className="dash-modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) { setShowPlayerModal(false); setEditingPlayer(null); } }}>
          <div className="dash-modal-box" style={{ maxWidth: '620px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 className="dash-modal-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Gamepad2 size={20} color="var(--red-primary)" />
                  {editingPlayer ? `Modifier le Joueur : ${editingPlayer.gamertag}` : 'Ajouter un Joueur au Roster & Équipe'}
                </h3>
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                  {editingPlayer ? 'Ajustez le jeu assigné, le poste, l\'équipe et le statut compétitif.' : 'Enregistrez un nouveau joueur dans l\'effectif officiel de la Dark Wolf Team.'}
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => { setShowPlayerModal(false); setEditingPlayer(null); }}
                className="dash-more-btn"
                style={{ padding: '6px' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSavePlayer}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="dash-form-group">
                  <label className="dash-form-label">Gamertag (Pseudo) *</label>
                  <input 
                    type="text" 
                    className="dash-form-input" 
                    value={playerFormData.gamertag}
                    onChange={(e) => setPlayerFormData({ ...playerFormData, gamertag: e.target.value })}
                    placeholder="Ex: Hannibal, Shadow, Nova"
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
                    placeholder="Ex: Yassine F., Karim B."
                  />
                </div>
              </div>

              {/* Sélection du Jeu Vidéo */}
              <div className="dash-form-group">
                <label className="dash-form-label">Sélection du Jeu Vidéo *</label>
                <select 
                  className="dash-form-select"
                  value={playerFormData.game}
                  onChange={(e) => setPlayerFormData({ ...playerFormData, game: e.target.value })}
                  required
                >
                  {Array.from(new Set([
                    ...gamesList.map(g => g.name),
                    'Valorant',
                    'CS2',
                    'Free Fire',
                    'League of Legends',
                    'EA Sports FC 25',
                    'Call of Duty',
                    'Rocket League',
                    'Fortnite'
                  ].filter(Boolean))).map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {/* Sélection de l'Équipe */}
                <div className="dash-form-group">
                  <label className="dash-form-label">Équipe / Roster *</label>
                  <select
                    className="dash-form-select"
                    value={playerFormData.team || 'Équipe Principale'}
                    onChange={(e) => setPlayerFormData({ ...playerFormData, team: e.target.value })}
                  >
                    <option value="Équipe Principale">Équipe Principale (Main Roster)</option>
                    <option value="Équipe Académie">Équipe Académie (Academy)</option>
                    <option value="Équipe Espoir">Équipe Espoir / Réserve</option>
                  </select>
                </div>

                {/* Rôle */}
                <div className="dash-form-group">
                  <label className="dash-form-label">Rôle / Poste *</label>
                  <select
                    className="dash-form-select"
                    value={playerFormData.role || 'Titulaire'}
                    onChange={(e) => setPlayerFormData({ ...playerFormData, role: e.target.value })}
                  >
                    <option value="Capitaine / IGL">Capitaine / IGL</option>
                    <option value="Sniper / AWP">Sniper / AWP</option>
                    <option value="Dueliste / Entry">Dueliste / Entry</option>
                    <option value="Support / Initiateur">Support / Initiateur</option>
                    <option value="Flex / Lurker">Flex / Lurker</option>
                    <option value="Coach / Manager">Coach / Manager</option>
                    <option value="Titulaire">Titulaire</option>
                    <option value="Remplaçant">Remplaçant</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="dash-form-group">
                  <label className="dash-form-label">Rang / Niveau</label>
                  <input 
                    type="text" 
                    className="dash-form-input" 
                    value={playerFormData.rank || ''}
                    onChange={(e) => setPlayerFormData({ ...playerFormData, rank: e.target.value })}
                    placeholder="Ex: Radiant, Global Elite, Master, Grandmaster"
                  />
                </div>
                <div className="dash-form-group">
                  <label className="dash-form-label">Photo / Avatar URL</label>
                  <input 
                    type="text" 
                    className="dash-form-input" 
                    value={playerFormData.avatar || ''}
                    onChange={(e) => setPlayerFormData({ ...playerFormData, avatar: e.target.value })}
                    placeholder="URL d'image ou laisser vide"
                  />
                </div>
              </div>

              <div className="dash-modal-btn-row" style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button 
                  type="button" 
                  className="btn-dash-approve" 
                  style={{ background: '#1c2438', color: '#fff', border: '1px solid #334155' }}
                  onClick={() => { setShowPlayerModal(false); setEditingPlayer(null); }}
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="auth-submit-btn" 
                  style={{ width: 'auto', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  {editingPlayer ? 'Enregistrer les Modifications 🐺✓' : 'Ajouter Joueur à l\'Équipe 🐺🎮'}
                </button>
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

      {/* MODAL: AJOUTER / MODIFIER UN JEU & SON AFFICHE */}
      {showGameModal && (
        <div className="dash-modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setShowGameModal(false); }}>
          <div className="dash-modal-box dash-modal-box-lg" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 className="dash-modal-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Gamepad2 size={22} color="var(--red-primary)" />
                  {editingGame ? `Modifier le Jeu : ${editingGame.name}` : 'Ajouter un Nouveau Jeu & son Affiche'}
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
                  Configurez le titre esport, importez l'affiche officielle et définissez l'effectif.
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => setShowGameModal(false)}
                className="dash-more-btn"
                style={{ padding: '6px' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveGame}>
              {/* SECTION: IMPORTATION DE L'AFFICHE DU JEU */}
              <div className="dash-form-group">
                <label className="dash-form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Affiche Officielle du Jeu (Depuis votre PC) *</span>
                  {uploadingGamePoster && <span style={{ color: 'var(--red-primary)' }}>Téléversement en cours...</span>}
                </label>

                {/* Input file caché */}
                <input 
                  type="file" 
                  ref={gameFileInputRef}
                  accept="image/png, image/jpeg, image/jpg, image/webp, image/gif, image/avif" 
                  style={{ display: 'none' }}
                  onClick={(e) => { e.target.value = null; }}
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleUploadGamePosterFile(e.target.files[0]);
                  }}
                />

                {gameFormData.posterImage ? (
                  <div className="product-upload-preview-card" style={{ background: '#080c14', border: '1px solid #1e283d' }}>
                    <img 
                      src={getImageUrl(gameFormData.posterImage)} 
                      alt="Aperçu Affiche" 
                      className="product-upload-thumbnail"
                      style={{ width: '100px', height: '120px', objectFit: 'cover', borderRadius: '6px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', color: '#fff', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle2 size={16} color="#22c55e" /> Affiche importée avec succès !
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px', wordBreak: 'break-all' }}>
                        {gameFormData.posterImage}
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                        <button 
                          type="button"
                          className="btn-dash-approve"
                          style={{ padding: '4px 12px', fontSize: '12px' }}
                          onClick={() => gameFileInputRef.current?.click()}
                        >
                          Changer l'affiche
                        </button>
                        <button 
                          type="button"
                          className="btn-dash-reject"
                          style={{ padding: '4px 12px', fontSize: '12px' }}
                          onClick={() => setGameFormData(prev => ({ ...prev, posterImage: '' }))}
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div 
                    className={`product-upload-zone ${isGameDragOver ? 'drag-active' : ''}`}
                    onClick={() => gameFileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setIsGameDragOver(true); }}
                    onDragLeave={() => setIsGameDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsGameDragOver(false);
                      if (e.dataTransfer.files?.[0]) handleUploadGamePosterFile(e.dataTransfer.files[0]);
                    }}
                    style={{ padding: '24px 16px', background: '#0a0d17', border: '2px dashed #202b42' }}
                  >
                    <div className="product-upload-icon-circle">
                      {uploadingGamePoster ? <RefreshCw className="animate-spin" size={24} /> : <Upload size={24} />}
                    </div>
                    <div>
                      <div style={{ color: '#fff', fontWeight: '700', fontSize: '14px' }}>
                        {uploadingGamePoster ? 'Téléversement de l\'affiche...' : 'Cliquez ici ou glissez l\'affiche du jeu depuis votre PC'}
                      </div>
                      <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>
                        Formats acceptés : PNG, JPG, JPEG, WEBP, AVIF (Max 15 Mo)
                      </div>
                    </div>
                  </div>
                )}

                {gameUploadError && (
                  <div style={{ color: '#ff4d4d', fontSize: '12px', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertTriangle size={14} /> {gameUploadError}
                  </div>
                )}
              </div>

              {/* GRID 2 COLONNES: NOM ET LOGO */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="dash-form-group">
                  <label className="dash-form-label">Nom du Jeu *</label>
                  <input 
                    type="text" 
                    className="dash-form-input" 
                    value={gameFormData.name}
                    onChange={(e) => setGameFormData({ ...gameFormData, name: e.target.value })}
                    placeholder="Ex: Valorant, FC 25, Counter-Strike 2" 
                    required 
                  />
                </div>

                <div className="dash-form-group">
                  <label className="dash-form-label">Abréviation / Tag Logo *</label>
                  <input 
                    type="text" 
                    className="dash-form-input" 
                    value={gameFormData.logo}
                    onChange={(e) => setGameFormData({ ...gameFormData, logo: e.target.value.toUpperCase() })}
                    placeholder="Ex: VAL, FC25, CS2, COD" 
                    required 
                  />
                </div>
              </div>

              {/* GRID 2 COLONNES: COULEUR ET EFFECTIF */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="dash-form-group">
                  <label className="dash-form-label">Couleur d'accent thématique</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input 
                      type="color" 
                      value={gameFormData.color}
                      onChange={(e) => setGameFormData({ ...gameFormData, color: e.target.value })}
                      style={{ width: '44px', height: '40px', padding: '2px', background: '#0a0d17', border: '1px solid #1c2638', borderRadius: '6px', cursor: 'pointer' }}
                    />
                    <input 
                      type="text" 
                      className="dash-form-input"
                      value={gameFormData.color}
                      onChange={(e) => setGameFormData({ ...gameFormData, color: e.target.value })}
                      placeholder="#ff4655" 
                      style={{ flex: 1 }}
                    />
                  </div>
                </div>

                <div className="dash-form-group">
                  <label className="dash-form-label">Effectif de l'équipe</label>
                  <input 
                    type="text" 
                    className="dash-form-input" 
                    value={gameFormData.mem}
                    onChange={(e) => setGameFormData({ ...gameFormData, mem: e.target.value })}
                    placeholder="Ex: 5 Players, 6 Players, Trio" 
                  />
                </div>
              </div>

              {/* DESCRIPTION DU JEU */}
              <div className="dash-form-group">
                <label className="dash-form-label">Description / Roster info</label>
                <textarea 
                  rows={3}
                  className="dash-form-textarea"
                  value={gameFormData.description}
                  onChange={(e) => setGameFormData({ ...gameFormData, description: e.target.value })}
                  placeholder="Équipe participant aux tournois officiels..." 
                />
              </div>

              {/* ACTIF / VISIBLE */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', background: '#0a0d14', padding: '12px 14px', borderRadius: '8px', border: '1px solid #1a2030' }}>
                <input 
                  type="checkbox" 
                  id="isGameActiveCheck"
                  style={{ width: '18px', height: '18px', accentColor: 'var(--red-primary)', cursor: 'pointer' }}
                  checked={gameFormData.isActive}
                  onChange={(e) => setGameFormData({ ...gameFormData, isActive: e.target.checked })}
                />
                <label htmlFor="isGameActiveCheck" style={{ fontSize: '14px', color: '#fff', cursor: 'pointer', userSelect: 'none' }}>
                  <strong>Afficher ce jeu et son affiche sur le site public</strong> (Visible dans la section DWT Teams)
                </label>
              </div>

              <div className="dash-modal-btn-row">
                <button type="button" className="btn-dash-approve" onClick={() => setShowGameModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn-dash-reject" disabled={uploadingGamePoster}>
                  {editingGame ? 'Enregistrer les Modifications 🎮' : 'Ajouter le Titre & Affiche 🐺🎮'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: AJOUTER / MODIFIER UNE AFFICHE CINEMATIQUE (HERO SLIDER) */}
      {showSlideModal && (
        <div className="dash-modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setShowSlideModal(false); }}>
          <div className="dash-modal-box dash-modal-box-lg" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 className="dash-modal-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <SlidersHorizontal size={22} color="var(--red-primary)" />
                  {editingSlide ? 'Modifier l\'Affiche Cinématique' : 'Ajouter une Affiche Cinématique'}
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
                  Téléversez votre affiche HD depuis votre PC et personnalisez les textes percutants et boutons.
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => setShowSlideModal(false)}
                className="dash-more-btn"
                style={{ padding: '6px' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveSlide}>
              {/* SECTION: IMPORTATION DE L'AFFICHE HD */}
              <div className="dash-form-group">
                <label className="dash-form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Affiche de Fond HD (Depuis votre PC) *</span>
                  {uploadingSlideImage && <span style={{ color: 'var(--red-primary)' }}>Téléversement en cours...</span>}
                </label>

                {/* Input file caché */}
                <input 
                  type="file" 
                  ref={slideFileInputRef}
                  accept="image/png, image/jpeg, image/jpg, image/webp, image/gif, image/avif" 
                  style={{ display: 'none' }}
                  onClick={(e) => { e.target.value = null; }}
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleUploadSlideImageFile(e.target.files[0]);
                  }}
                />

                {slideFormData.backgroundImage ? (
                  <div className="product-upload-preview-card" style={{ background: '#080c14', border: '1px solid #1e283d' }}>
                    <img 
                      src={getImageUrl(slideFormData.backgroundImage)} 
                      alt="Aperçu Affiche" 
                      className="product-upload-thumbnail"
                      style={{ width: '160px', height: '90px', objectFit: 'cover', borderRadius: '6px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', color: '#fff', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle2 size={16} color="#22c55e" /> Affiche HD prête pour le carrousel
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px', wordBreak: 'break-all' }}>
                        {slideFormData.backgroundImage}
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                        <button 
                          type="button"
                          className="btn-dash-approve"
                          style={{ padding: '4px 12px', fontSize: '12px' }}
                          onClick={() => slideFileInputRef.current?.click()}
                        >
                          Changer l'affiche
                        </button>
                        <button 
                          type="button"
                          className="btn-dash-reject"
                          style={{ padding: '4px 12px', fontSize: '12px' }}
                          onClick={() => setSlideFormData(prev => ({ ...prev, backgroundImage: '' }))}
                        >
                          Retirer
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div 
                    className={`product-upload-zone ${isSlideDragOver ? 'drag-active' : ''}`}
                    onClick={() => slideFileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setIsSlideDragOver(true); }}
                    onDragLeave={() => setIsSlideDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsSlideDragOver(false);
                      if (e.dataTransfer.files?.[0]) handleUploadSlideImageFile(e.dataTransfer.files[0]);
                    }}
                  >
                    <div className="product-upload-icon-circle">
                      {uploadingSlideImage ? <RefreshCw className="animate-spin" size={24} /> : <Upload size={24} />}
                    </div>
                    <div>
                      <div style={{ color: '#fff', fontWeight: '700', fontSize: '14px' }}>
                        {uploadingSlideImage ? 'Téléversement de l\'affiche...' : 'Cliquez ici ou glissez votre affiche HD depuis votre PC'}
                      </div>
                      <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>
                        Formats recommandés : 1920x1080 (16:9) • PNG, JPG, JPEG, WEBP (Max 25 Mo)
                      </div>
                    </div>
                  </div>
                )}

                {slideUploadError && (
                  <div style={{ color: '#ff4d4d', fontSize: '12px', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertTriangle size={14} /> {slideUploadError}
                  </div>
                )}
              </div>

              {/* TITRE & SOUS-TITRE */}
              <div className="dash-form-group">
                <label className="dash-form-label">Titre Principal de la Scène *</label>
                <input 
                  type="text" 
                  className="dash-form-input" 
                  value={slideFormData.title}
                  onChange={(e) => setSlideFormData({ ...slideFormData, title: e.target.value })}
                  placeholder="Ex: HUNT. DOMINATE. CONQUER." 
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="dash-form-group">
                  <label className="dash-form-label">Étiquette / Badge *</label>
                  <input 
                    type="text" 
                    className="dash-form-input" 
                    value={slideFormData.label}
                    onChange={(e) => setSlideFormData({ ...slideFormData, label: e.target.value })}
                    placeholder="Ex: New Collection 2026, Dark Lab Pro Kit" 
                    required 
                  />
                </div>
                <div className="dash-form-group">
                  <label className="dash-form-label">Ordre d'affichage (0, 1, 2...)</label>
                  <input 
                    type="number" 
                    className="dash-form-input" 
                    value={slideFormData.order}
                    onChange={(e) => setSlideFormData({ ...slideFormData, order: e.target.value })}
                    min="0"
                  />
                </div>
              </div>

              <div className="dash-form-group">
                <label className="dash-form-label">Sous-titre / Description</label>
                <textarea 
                  rows={2} 
                  className="dash-form-textarea" 
                  value={slideFormData.subtitle}
                  onChange={(e) => setSlideFormData({ ...slideFormData, subtitle: e.target.value })}
                  placeholder="Ex: Dark Wolf Team — Elite esports. Dark Lab — Premium gear crafted for champions who refuse to lose." 
                />
              </div>

              {/* BOUTONS D'ACTION RELIÉS AUX PAGES */}
              <div style={{ background: '#0a0d14', border: '1px solid #1a2233', borderRadius: '8px', padding: '16px', marginBottom: '18px' }}>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#fff', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Boutons d'Action & Liaisons aux Pages
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
                  Sélectionnez la page ou la section correspondante pour chaque bouton, ou saisissez un lien personnalisé.
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {/* BOUTON 1 */}
                  <div style={{ background: '#0d131f', border: '1px solid #1c2638', borderRadius: '8px', padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label className="dash-form-label" style={{ margin: 0, color: 'var(--red-primary)' }}>Bouton 1 (Principal)</label>
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '4px' }}>Lier à une page du site :</label>
                      <select 
                        className="dash-form-input" 
                        style={{ fontSize: '12px', padding: '6px 10px', background: '#080b11', borderColor: '#232d40', color: '#38bdf8' }}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (!val) return;
                          const presets = [
                            { target: '#shop', text: 'Shop Collection' },
                            { target: '#shop:pro-kit', text: 'View Pro Kit' },
                            { target: '#shop:collabs', text: 'See Collabs' },
                            { target: '#shop:best-sellers', text: 'Best Sellers' },
                            { target: '#teams', text: 'Meet the Pack' },
                            { target: '#matches-live', text: 'Matchs en Direct' },
                            { target: '#countdown', text: 'Next Drop Timer' },
                            { target: '#news', text: 'Actualités Club' },
                            { target: '#join', text: 'Rejoindre la Meute' },
                            { target: '#contact', text: 'Contactez-nous' },
                            { target: '#museum', text: 'Musée DWT' },
                            { target: '#achievements', text: 'Palmarès & Trophées' },
                            { target: '#partners', text: 'Partenaires DWT' },
                            { target: '#player', text: 'Espace Joueur' },
                            { target: '#player:pronostics', text: 'Pronostics' },
                            { target: '#social', text: 'Rejoindre le Discord' },
                            { target: '#cart', text: 'Mon Panier' },
                          ];
                          const found = presets.find(p => p.target === val);
                          setSlideFormData(prev => ({
                            ...prev,
                            btn1Target: val,
                            btn1Text: prev.btn1Text ? prev.btn1Text : (found ? found.text : '')
                          }));
                        }}
                        defaultValue=""
                      >
                        <option value="" disabled>-- Choisir une page / section --</option>
                        <option value="#shop">🛍️ Boutique Officielle (#shop)</option>
                        <option value="#shop:pro-kit">👕 Pro Kit & Maillots (#shop:pro-kit)</option>
                        <option value="#shop:collabs">🔥 Collabs Exclusives (#shop:collabs)</option>
                        <option value="#shop:best-sellers">⭐ Best Sellers Store (#shop:best-sellers)</option>
                        <option value="#teams">🐺 Équipes & Rosters (#teams)</option>
                        <option value="#matches-live">🔴 Matchs & Live Stream (#matches-live)</option>
                        <option value="#countdown">⏳ Compte à Rebours Drop (#countdown)</option>
                        <option value="#news">📰 Actualités & Scoops (#news)</option>
                        <option value="#join">🎯 Recrutement / Tryouts (#join)</option>
                        <option value="#contact">📬 Contact Staff (#contact)</option>
                        <option value="#museum">🏛️ Musée DWT Archives (#museum)</option>
                        <option value="#achievements">🏆 Palmarès & Trophées (#achievements)</option>
                        <option value="#partners">🤝 Partenaires & Sponsors (#partners)</option>
                        <option value="#player">🎮 Espace Joueur & Fan Zone (#player)</option>
                        <option value="#player:pronostics">🎲 Pronostics de Matchs (#player:pronostics)</option>
                        <option value="#social">💬 Discord & Réseaux (#social)</option>
                        <option value="#cart">🛒 Panier d'achat (#cart)</option>
                      </select>
                    </div>

                    <div className="dash-form-group" style={{ marginBottom: '10px' }}>
                      <label className="dash-form-label">Texte du Bouton</label>
                      <input 
                        type="text" 
                        className="dash-form-input" 
                        value={slideFormData.btn1Text}
                        onChange={(e) => setSlideFormData({ ...slideFormData, btn1Text: e.target.value })}
                        placeholder="Ex: Shop Collection" 
                      />
                    </div>
                    <div className="dash-form-group" style={{ marginBottom: 0 }}>
                      <label className="dash-form-label">Cible / Page</label>
                      <input 
                        type="text" 
                        className="dash-form-input" 
                        value={slideFormData.btn1Target}
                        onChange={(e) => setSlideFormData({ ...slideFormData, btn1Target: e.target.value })}
                        placeholder="Ex: #shop ou /boutique" 
                      />
                    </div>
                  </div>

                  {/* BOUTON 2 */}
                  <div style={{ background: '#0d131f', border: '1px solid #1c2638', borderRadius: '8px', padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label className="dash-form-label" style={{ margin: 0, color: '#cbd5e1' }}>Bouton 2 (Secondaire)</label>
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '4px' }}>Lier à une page du site :</label>
                      <select 
                        className="dash-form-input" 
                        style={{ fontSize: '12px', padding: '6px 10px', background: '#080b11', borderColor: '#232d40', color: '#38bdf8' }}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (!val) return;
                          const presets = [
                            { target: '#teams', text: 'Meet the Pack' },
                            { target: '#shop', text: 'Shop Collection' },
                            { target: '#countdown', text: 'Next Drop Timer' },
                            { target: '#matches-live', text: 'Matchs en Direct' },
                            { target: '#news', text: 'Actualités Club' },
                            { target: '#join', text: 'Rejoindre la Meute' },
                            { target: '#contact', text: 'Contactez-nous' },
                            { target: '#museum', text: 'Musée DWT' },
                            { target: '#achievements', text: 'Palmarès & Trophées' },
                            { target: '#partners', text: 'Partenaires DWT' },
                            { target: '#player', text: 'Espace Joueur' },
                            { target: '#social', text: 'Rejoindre le Discord' },
                            { target: '#cart', text: 'Mon Panier' },
                          ];
                          const found = presets.find(p => p.target === val);
                          setSlideFormData(prev => ({
                            ...prev,
                            btn2Target: val,
                            btn2Text: prev.btn2Text ? prev.btn2Text : (found ? found.text : '')
                          }));
                        }}
                        defaultValue=""
                      >
                        <option value="" disabled>-- Choisir une page / section --</option>
                        <option value="#teams">🐺 Équipes & Rosters (#teams)</option>
                        <option value="#shop">🛍️ Boutique Officielle (#shop)</option>
                        <option value="#countdown">⏳ Compte à Rebours Drop (#countdown)</option>
                        <option value="#matches-live">🔴 Matchs & Live Stream (#matches-live)</option>
                        <option value="#news">📰 Actualités & Scoops (#news)</option>
                        <option value="#join">🎯 Recrutement / Tryouts (#join)</option>
                        <option value="#contact">📬 Contact Staff (#contact)</option>
                        <option value="#museum">🏛️ Musée DWT Archives (#museum)</option>
                        <option value="#achievements">🏆 Palmarès & Trophées (#achievements)</option>
                        <option value="#partners">🤝 Partenaires & Sponsors (#partners)</option>
                        <option value="#player">🎮 Espace Joueur & Fan Zone (#player)</option>
                        <option value="#social">💬 Discord & Réseaux (#social)</option>
                        <option value="#cart">🛒 Panier d'achat (#cart)</option>
                      </select>
                    </div>

                    <div className="dash-form-group" style={{ marginBottom: '10px' }}>
                      <label className="dash-form-label">Texte du Bouton</label>
                      <input 
                        type="text" 
                        className="dash-form-input" 
                        value={slideFormData.btn2Text}
                        onChange={(e) => setSlideFormData({ ...slideFormData, btn2Text: e.target.value })}
                        placeholder="Ex: Meet the Pack" 
                      />
                    </div>
                    <div className="dash-form-group" style={{ marginBottom: 0 }}>
                      <label className="dash-form-label">Cible / Page</label>
                      <input 
                        type="text" 
                        className="dash-form-input" 
                        value={slideFormData.btn2Target}
                        onChange={(e) => setSlideFormData({ ...slideFormData, btn2Target: e.target.value })}
                        placeholder="Ex: #teams ou /teams" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTIF / VISIBLE */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', background: '#0a0d14', padding: '12px 14px', borderRadius: '8px', border: '1px solid #1a2030' }}>
                <input 
                  type="checkbox" 
                  id="isSlideActiveCheck"
                  style={{ width: '18px', height: '18px', accentColor: 'var(--red-primary)', cursor: 'pointer' }}
                  checked={slideFormData.isActive}
                  onChange={(e) => setSlideFormData({ ...slideFormData, isActive: e.target.checked })}
                />
                <label htmlFor="isSlideActiveCheck" style={{ fontSize: '14px', color: '#fff', cursor: 'pointer', userSelect: 'none' }}>
                  <strong>Afficher cette affiche cinématique dans le carrousel d'accueil</strong> (Rotation automatique)
                </label>
              </div>

              <div className="dash-modal-btn-row">
                <button type="button" className="btn-dash-approve" onClick={() => setShowSlideModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn-dash-reject" disabled={uploadingSlideImage}>
                  {editingSlide ? 'Enregistrer les Modifications 🎬' : 'Ajouter au Carrousel Cinématique 🐺🎬'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: AJOUTER / MODIFIER UNE PIÈCE DE MUSÉE (ARCHIVE DWT) */}
      {showMuseumModal && (
        <div className="dash-modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setShowMuseumModal(false); }}>
          <div className="dash-modal-box dash-modal-box-lg" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 className="dash-modal-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers size={22} color="#38bdf8" />
                  {editingMuseumItem ? 'Modifier la Pièce d\'Archive' : 'Ajouter une Pièce d\'Archive au Musée'}
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
                  Téléversez une photo de la pièce d'archive et détaillez son histoire dans la culture DWT.
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => setShowMuseumModal(false)}
                className="dash-more-btn"
                style={{ padding: '6px' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveMuseumItem}>
              {/* SECTION: TÉLÉVERSEMENT DE LA PHOTO */}
              <div className="dash-form-group">
                <label className="dash-form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Photo de la Pièce d'Archive (Depuis votre PC) *</span>
                  {uploadingMuseumImage && <span style={{ color: '#38bdf8' }}>Téléversement en cours...</span>}
                </label>

                {/* Input file caché */}
                <input 
                  type="file" 
                  ref={museumFileInputRef}
                  accept="image/png, image/jpeg, image/jpg, image/webp, image/gif, image/avif" 
                  style={{ display: 'none' }}
                  onClick={(e) => { e.target.value = null; }}
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleUploadMuseumImage(e.target.files[0]);
                  }}
                />

                {museumFormData.image ? (
                  <div className="product-upload-preview-card" style={{ background: '#080c14', border: '1px solid #1e283d' }}>
                    <img 
                      src={getImageUrl(museumFormData.image)} 
                      alt="Aperçu Pièce" 
                      className="product-upload-thumbnail"
                      style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', color: '#fff', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle2 size={16} color="#22c55e" /> Photo prête pour le musée DWT
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px', wordBreak: 'break-all' }}>
                        {museumFormData.image}
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                        <button 
                          type="button" 
                          className="btn-dash-approve"
                          style={{ padding: '4px 12px', fontSize: '12px' }}
                          onClick={() => museumFileInputRef.current?.click()}
                        >
                          Changer la photo
                        </button>
                        <button 
                          type="button" 
                          className="btn-dash-reject"
                          style={{ padding: '4px 12px', fontSize: '12px' }}
                          onClick={() => setMuseumFormData(prev => ({ ...prev, image: '' }))}
                        >
                          Retirer
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div 
                    className={`product-upload-dropzone ${isMuseumDragOver ? 'dragover' : ''}`}
                    onClick={() => museumFileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setIsMuseumDragOver(true); }}
                    onDragLeave={() => setIsMuseumDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsMuseumDragOver(false);
                      if (e.dataTransfer.files?.[0]) handleUploadMuseumImage(e.dataTransfer.files[0]);
                    }}
                    style={{
                      background: '#080c14',
                      border: isMuseumDragOver ? '2px dashed #38bdf8' : '2px dashed #1e283d',
                      borderRadius: '10px',
                      padding: '30px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Upload size={36} style={{ color: '#38bdf8', margin: '0 auto 10px', display: 'block' }} />
                    <div style={{ fontSize: '14px', color: '#fff', fontWeight: '700', marginBottom: '4px' }}>
                      Cliquez pour importer la photo de la pièce d'archive
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      Ou glissez-déposez le fichier ici (JPG, PNG, WebP jusqu'à 25 Mo)
                    </div>
                  </div>
                )}

                {museumUploadError && (
                  <div style={{ color: '#ff4d4d', fontSize: '12px', marginTop: '6px' }}>
                    {museumUploadError}
                  </div>
                )}
              </div>

              {/* DETAILS DE LA PIECE */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="dash-form-group">
                  <label className="dash-form-label">Nom de la Pièce / Titre *</label>
                  <input 
                    type="text" 
                    className="dash-form-input" 
                    value={museumFormData.name}
                    onChange={(e) => setMuseumFormData({ ...museumFormData, name: e.target.value })}
                    placeholder="Ex: Season 1 Jersey, OG Wolf Tee" 
                    required 
                  />
                </div>
                <div className="dash-form-group">
                  <label className="dash-form-label">Catégorie *</label>
                  <select 
                    className="dash-form-select"
                    value={museumFormData.cat}
                    onChange={(e) => setMuseumFormData({ ...museumFormData, cat: e.target.value })}
                  >
                    <option value="Pro Kit">Pro Kit</option>
                    <option value="Limited Drop">Limited Drop</option>
                    <option value="New Collection">New Collection</option>
                    <option value="Collabs">Collabs</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Collector">Collector</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div className="dash-form-group">
                  <label className="dash-form-label">Année du Drop</label>
                  <input 
                    type="text" 
                    className="dash-form-input" 
                    value={museumFormData.year}
                    onChange={(e) => setMuseumFormData({ ...museumFormData, year: e.target.value })}
                    placeholder="Ex: 2021, 2022, 2023" 
                  />
                </div>
                <div className="dash-form-group">
                  <label className="dash-form-label">Prix / Valeur Initiale</label>
                  <input 
                    type="text" 
                    className="dash-form-input" 
                    value={museumFormData.price}
                    onChange={(e) => setMuseumFormData({ ...museumFormData, price: e.target.value })}
                    placeholder="Ex: TND 79" 
                  />
                </div>
                <div className="dash-form-group">
                  <label className="dash-form-label">Ordre d'affichage</label>
                  <input 
                    type="number" 
                    min="0"
                    className="dash-form-input" 
                    value={museumFormData.order}
                    onChange={(e) => setMuseumFormData({ ...museumFormData, order: e.target.value })}
                  />
                </div>
              </div>

              <div className="dash-form-group">
                <label className="dash-form-label">Histoire / Description de la Pièce d'Archive</label>
                <textarea 
                  className="dash-form-textarea" 
                  rows={3}
                  value={museumFormData.desc}
                  onChange={(e) => setMuseumFormData({ ...museumFormData, desc: e.target.value })}
                  placeholder="Racontez la légende de cette pièce : tournois remportés, tirage limité, anecdotes de l'équipe..." 
                />
              </div>

              {/* ACTIF / VISIBLE DANS LE MUSEE */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', background: '#0a0d14', padding: '12px 14px', borderRadius: '8px', border: '1px solid #1a2030' }}>
                <input 
                  type="checkbox" 
                  id="isMuseumActiveCheck"
                  style={{ width: '18px', height: '18px', accentColor: '#38bdf8', cursor: 'pointer' }}
                  checked={museumFormData.isActive}
                  onChange={(e) => setMuseumFormData({ ...museumFormData, isActive: e.target.checked })}
                />
                <label htmlFor="isMuseumActiveCheck" style={{ fontSize: '14px', color: '#fff', cursor: 'pointer', userSelect: 'none' }}>
                  <strong>Exposer cette pièce dans le Museum officiel</strong> (Visible par les fans)
                </label>
              </div>

              <div className="dash-modal-btn-row">
                <button type="button" className="btn-dash-approve" onClick={() => setShowMuseumModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn-dash-reject" disabled={uploadingMuseumImage}>
                  {editingMuseumItem ? 'Enregistrer les Modifications 🏛️' : 'Ajouter au Museum DWT 🏛️✨'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: AJOUTER / MODIFIER UNE VIDÉO / TRAILER / PUB */}
      {showVideoModal && (
        <div className="dash-modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setShowVideoModal(false); }}>
          <div className="dash-modal-box dash-modal-box-lg" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 className="dash-modal-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Film size={22} color="var(--red-primary)" />
                  {editingVideo ? 'Modifier la Vidéo / Trailer' : 'Ajouter une Vidéo / Trailer / Pub'}
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
                  Diffusez vos trailers cinématiques, spots publicitaires de maillots et annonces officielles.
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => setShowVideoModal(false)}
                className="dash-more-btn"
                style={{ padding: '6px' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveVideo}>
              {/* TITRE & SOUS-TITRE */}
              <div className="dash-form-group">
                <label className="dash-form-label">Titre de la Vidéo *</label>
                <input 
                  type="text" 
                  className="dash-form-input" 
                  value={videoFormData.title}
                  onChange={(e) => setVideoFormData({ ...videoFormData, title: e.target.value })}
                  placeholder="Ex: DARK WOLF TEAM — RISE OF THE PACK (Trailer Officiel)" 
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="dash-form-group">
                  <label className="dash-form-label">Sous-titre / Slogan</label>
                  <input 
                    type="text" 
                    className="dash-form-input" 
                    value={videoFormData.subtitle}
                    onChange={(e) => setVideoFormData({ ...videoFormData, subtitle: e.target.value })}
                    placeholder="Ex: Trailer cinématique officiel saison 2026" 
                  />
                </div>

                <div className="dash-form-group">
                  <label className="dash-form-label">Type / Catégorie *</label>
                  <select 
                    className="dash-form-input"
                    value={videoFormData.category}
                    onChange={(e) => setVideoFormData({ ...videoFormData, category: e.target.value })}
                  >
                    <option value="trailer">🎬 Trailer Officiel de l'équipe</option>
                    <option value="product_ad">🛍️ Spot Publicitaire / Produit Boutique</option>
                    <option value="announcement">📢 Annonce Officielle / Recrutement</option>
                    <option value="match_highlight">🏆 Best-Of & Temps Forts Match</option>
                  </select>
                </div>
              </div>

              {/* SOURCE DE LA VIDÉO : UPLOAD MP4 LOCAL OU LIEN YOUTUBE */}
              <div className="dash-form-group">
                <label className="dash-form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '800' }}>Source de la Vidéo *</span>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Deux modes au choix</span>
                </label>

                {/* Sélecteur de mode */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                  marginBottom: '12px'
                }}>
                  <button
                    type="button"
                    onClick={() => setVideoSourceMode('upload')}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: videoSourceMode === 'upload' ? '1px solid var(--red-primary)' : '1px solid #1e283d',
                      background: videoSourceMode === 'upload' ? 'rgba(230,0,0,0.18)' : '#080c14',
                      color: videoSourceMode === 'upload' ? '#fff' : '#94a3b8',
                      fontWeight: '700',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.2s ease',
                      boxShadow: videoSourceMode === 'upload' ? '0 0 15px rgba(230,0,0,0.3)' : 'none'
                    }}
                  >
                    <Upload size={15} color={videoSourceMode === 'upload' ? 'var(--red-primary)' : '#94a3b8'} />
                    <span>📁 Téléverser un fichier MP4 / WEBM (PC)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVideoSourceMode('youtube')}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: videoSourceMode === 'youtube' ? '1px solid var(--red-primary)' : '1px solid #1e283d',
                      background: videoSourceMode === 'youtube' ? 'rgba(230,0,0,0.18)' : '#080c14',
                      color: videoSourceMode === 'youtube' ? '#fff' : '#94a3b8',
                      fontWeight: '700',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.2s ease',
                      boxShadow: videoSourceMode === 'youtube' ? '0 0 15px rgba(230,0,0,0.3)' : 'none'
                    }}
                  >
                    <Film size={15} color={videoSourceMode === 'youtube' ? 'var(--red-primary)' : '#94a3b8'} />
                    <span>🔗 Lien YouTube (ou externe)</span>
                  </button>
                </div>

                {/* MODE 1: UPLOAD DEPUIS LE PC */}
                {videoSourceMode === 'upload' && (
                  <div>
                    <input 
                      type="file" 
                      ref={videoMediaFileInputRef}
                      accept="video/mp4,video/webm,video/quicktime,video/x-matroska,video/ogg,.mp4,.webm,.mov" 
                      style={{ display: 'none' }}
                      onClick={(e) => { e.target.value = null; }}
                      onChange={(e) => {
                        if (e.target.files?.[0]) handleUploadVideoFile(e.target.files[0]);
                      }}
                    />

                    {/* Si un fichier vidéo local est présent */}
                    {videoFormData.videoUrl && (videoFormData.videoUrl.startsWith('/uploads/') || /\.(mp4|webm|mov|ogg|mkv|m4v)(\?.*)?$/i.test(videoFormData.videoUrl)) ? (
                      <div style={{
                        background: '#070b13',
                        border: '1px solid rgba(34, 197, 94, 0.4)',
                        borderRadius: '8px',
                        padding: '14px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#22c55e', fontWeight: '800', fontSize: '13px' }}>
                            <CheckCircle2 size={16} /> Fichier vidéo MP4 prêt et hébergé
                          </div>
                          <span style={{ fontSize: '10px', background: 'rgba(34,197,94,0.15)', color: '#22c55e', padding: '2px 8px', borderRadius: '4px', fontWeight: '800' }}>
                            HÉBERGÉ LOCALEMENT
                          </span>
                        </div>

                        <div style={{ fontSize: '11px', color: '#94a3b8', background: '#030508', padding: '6px 10px', borderRadius: '4px', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                          {videoFormData.videoUrl}
                        </div>

                        {/* Mini lecteur d'aperçu HTML5 intégré */}
                        <div style={{ position: 'relative', width: '100%', height: '170px', background: '#000', borderRadius: '6px', overflow: 'hidden' }}>
                          <video 
                            src={videoFormData.videoUrl.startsWith('/uploads/') ? `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}${videoFormData.videoUrl}` : videoFormData.videoUrl} 
                            controls 
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          />
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            type="button"
                            className="btn-dash-approve"
                            style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                            onClick={() => videoMediaFileInputRef.current?.click()}
                          >
                            <Upload size={14} /> Remplacer par un autre fichier MP4
                          </button>
                          <button 
                            type="button"
                            className="btn-dash-reject"
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                            onClick={() => setVideoFormData(prev => ({ ...prev, videoUrl: '' }))}
                          >
                            Retirer la vidéo
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Zone Drag & Drop pour fichier vidéo */
                      <div 
                        className={`product-upload-zone ${isVideoFileDragOver ? 'drag-active' : ''}`}
                        onClick={() => !uploadingVideoFile && videoMediaFileInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); setIsVideoFileDragOver(true); }}
                        onDragLeave={() => setIsVideoFileDragOver(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsVideoFileDragOver(false);
                          if (!uploadingVideoFile && e.dataTransfer.files?.[0]) handleUploadVideoFile(e.dataTransfer.files[0]);
                        }}
                        style={{
                          cursor: uploadingVideoFile ? 'wait' : 'pointer',
                          padding: '28px 20px',
                          borderColor: isVideoFileDragOver ? 'var(--red-primary)' : 'rgba(230,0,0,0.3)',
                          background: isVideoFileDragOver ? 'rgba(230,0,0,0.08)' : '#070b13'
                        }}
                      >
                        <div className="product-upload-icon-circle" style={{ width: '50px', height: '50px', background: 'rgba(230,0,0,0.15)', color: 'var(--red-primary)' }}>
                          {uploadingVideoFile ? <RefreshCw className="animate-spin" size={24} /> : <Upload size={24} />}
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ color: '#fff', fontWeight: '800', fontSize: '14px' }}>
                            {uploadingVideoFile ? 'Téléversement de la vidéo MP4 en cours...' : 'Cliquez ici ou glissez votre vidéo (MP4, WEBM)'}
                          </div>
                          <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>
                            Formats supportés : <strong>MP4, WEBM, MOV</strong> • Taille max : <strong>250 Mo</strong>
                          </div>
                          {uploadingVideoFile && (
                            <div style={{ marginTop: '12px', width: '220px', marginInline: 'auto' }}>
                              <div style={{ background: '#1c2538', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                                <div 
                                  style={{ 
                                    width: `${videoFileUploadProgress}%`, 
                                    height: '100%', 
                                    background: 'linear-gradient(90deg, #e60000, #ff4d4d)',
                                    transition: 'width 0.3s ease'
                                  }} 
                                />
                              </div>
                              <div style={{ fontSize: '11px', color: '#ff4d4d', marginTop: '4px', fontWeight: '700' }}>
                                {videoFileUploadProgress > 0 ? `${videoFileUploadProgress}%` : 'Traitement serveur...'}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {videoFileUploadError && (
                      <div style={{ color: '#ff4d4d', fontSize: '12px', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <AlertTriangle size={14} /> {videoFileUploadError}
                      </div>
                    )}
                  </div>
                )}

                {/* MODE 2: LIEN YOUTUBE OU EXTERNE */}
                {videoSourceMode === 'youtube' && (
                  <div>
                    <input 
                      type="text" 
                      className="dash-form-input" 
                      value={videoFormData.videoUrl}
                      onChange={(e) => setVideoFormData({ ...videoFormData, videoUrl: e.target.value })}
                      placeholder="Ex: https://www.youtube.com/watch?v=... ou https://youtu.be/..." 
                    />
                    <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'block' }}>
                      Collez le lien YouTube, il sera automatiquement intégré dans le lecteur sécurisé sans pubs tierces.
                    </span>
                  </div>
                )}
              </div>

              {/* MINIATURE VIDÉO */}
              <div className="dash-form-group">
                <label className="dash-form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Image Miniature / Poster de la Vidéo</span>
                  {uploadingVideoImage && <span style={{ color: 'var(--red-primary)' }}>Téléversement en cours...</span>}
                </label>

                <input 
                  type="file" 
                  ref={videoFileInputRef}
                  accept="image/png, image/jpeg, image/jpg, image/webp, image/gif, image/avif" 
                  style={{ display: 'none' }}
                  onClick={(e) => { e.target.value = null; }}
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleUploadVideoThumbnail(e.target.files[0]);
                  }}
                />

                {videoFormData.thumbnail ? (
                  <div className="product-upload-preview-card" style={{ background: '#080c14', border: '1px solid #1e283d' }}>
                    <img 
                      src={getImageUrl(videoFormData.thumbnail)} 
                      alt="Miniature Vidéo" 
                      className="product-upload-thumbnail"
                      style={{ width: '160px', height: '90px', objectFit: 'cover', borderRadius: '6px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', color: '#fff', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle2 size={16} color="#22c55e" /> Miniature prête
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px', wordBreak: 'break-all' }}>
                        {videoFormData.thumbnail}
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                        <button 
                          type="button"
                          className="btn-dash-approve"
                          style={{ padding: '4px 12px', fontSize: '12px' }}
                          onClick={() => videoFileInputRef.current?.click()}
                        >
                          Changer l'image
                        </button>
                        <button 
                          type="button"
                          className="btn-dash-reject"
                          style={{ padding: '4px 12px', fontSize: '12px' }}
                          onClick={() => setVideoFormData(prev => ({ ...prev, thumbnail: '' }))}
                        >
                          Retirer
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div 
                    className={`product-upload-zone ${isVideoDragOver ? 'drag-active' : ''}`}
                    onClick={() => videoFileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setIsVideoDragOver(true); }}
                    onDragLeave={() => setIsVideoDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsVideoDragOver(false);
                      if (e.dataTransfer.files?.[0]) handleUploadVideoThumbnail(e.dataTransfer.files[0]);
                    }}
                  >
                    <div className="product-upload-icon-circle">
                      {uploadingVideoImage ? <RefreshCw className="animate-spin" size={24} /> : <Upload size={24} />}
                    </div>
                    <div>
                      <div style={{ color: '#fff', fontWeight: '700', fontSize: '14px' }}>
                        {uploadingVideoImage ? 'Téléversement...' : 'Cliquez ici ou glissez votre affiche / miniature HD'}
                      </div>
                      <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>
                        Format 16:9 recommandé (1920x1080) • PNG, JPG, WEBP
                      </div>
                    </div>
                  </div>
                )}

                {videoUploadError && (
                  <div style={{ color: '#ff4d4d', fontSize: '12px', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertTriangle size={14} /> {videoUploadError}
                  </div>
                )}
              </div>

              {/* STATS & BADGES (DURÉE, VUES, BADGE) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div className="dash-form-group">
                  <label className="dash-form-label">Durée</label>
                  <input 
                    type="text" 
                    className="dash-form-input" 
                    value={videoFormData.duration}
                    onChange={(e) => setVideoFormData({ ...videoFormData, duration: e.target.value })}
                    placeholder="Ex: 02:45" 
                  />
                </div>

                <div className="dash-form-group">
                  <label className="dash-form-label">Vues affichées</label>
                  <input 
                    type="text" 
                    className="dash-form-input" 
                    value={videoFormData.views}
                    onChange={(e) => setVideoFormData({ ...videoFormData, views: e.target.value })}
                    placeholder="Ex: 185K vues" 
                  />
                </div>

                <div className="dash-form-group">
                  <label className="dash-form-label">Badge Personnalisé</label>
                  <input 
                    type="text" 
                    className="dash-form-input" 
                    value={videoFormData.badge}
                    onChange={(e) => setVideoFormData({ ...videoFormData, badge: e.target.value })}
                    placeholder="Ex: TRAILER OFFICIEL, SPOT PUB" 
                  />
                </div>
              </div>

              {/* OPTION TRAILER PRINCIPAL */}
              <div style={{
                background: 'linear-gradient(90deg, rgba(230,0,0,0.12), rgba(10,13,20,0.8))',
                border: '1px solid rgba(230,0,0,0.3)',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <input 
                  type="checkbox" 
                  id="isMainTrailerCheck"
                  checked={videoFormData.isMainTrailer}
                  onChange={(e) => setVideoFormData({ ...videoFormData, isMainTrailer: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--red-primary)', cursor: 'pointer' }}
                />
                <label htmlFor="isMainTrailerCheck" style={{ color: '#fff', fontSize: '13px', cursor: 'pointer', userSelect: 'none' }}>
                  <strong style={{ color: '#ff4d4d' }}>★ Définir comme Trailer Principal de la Dark Wolf Team</strong>
                  <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '2px' }}>
                    Cette vidéo occupera le grand écran vedette à gauche de la section Watch DWT.
                  </div>
                </label>
              </div>

              {/* BOUTON D'ACTION (CALL TO ACTION / PUB PRODUIT) */}
              <div style={{ background: '#0a0d14', border: '1px solid #1a2233', borderRadius: '8px', padding: '14px', marginBottom: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>
                  Bouton d'Action Associé (Lien Boutique, Recrutement, etc.)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label className="dash-form-label">Texte du Bouton</label>
                    <input 
                      type="text" 
                      className="dash-form-input" 
                      value={videoFormData.ctaText}
                      onChange={(e) => setVideoFormData({ ...videoFormData, ctaText: e.target.value })}
                      placeholder="Ex: Commander le Maillot, Rejoindre l'équipe" 
                    />
                  </div>
                  <div>
                    <label className="dash-form-label">Lien Cible</label>
                    <input 
                      type="text" 
                      className="dash-form-input" 
                      value={videoFormData.ctaLink}
                      onChange={(e) => setVideoFormData({ ...videoFormData, ctaLink: e.target.value })}
                      placeholder="Ex: #shop, #shop:pro-kit, #join" 
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Raccourcis :</span>
                  {[
                    { label: 'Boutique Pro Kit', link: '#shop:pro-kit', text: 'Commander le Maillot' },
                    { label: 'Toute la Boutique', link: '#shop', text: 'Voir la Boutique' },
                    { label: 'Recrutement Meute', link: '#join', text: 'Postuler aux Tryouts' },
                    { label: 'Matchs Live', link: '#matches-live', text: 'Voir les Matchs' },
                  ].map(p => (
                    <button
                      key={p.link}
                      type="button"
                      onClick={() => setVideoFormData(prev => ({ ...prev, ctaLink: p.link, ctaText: p.text }))}
                      style={{
                        background: 'rgba(56, 189, 248, 0.1)',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        color: '#38bdf8',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        cursor: 'pointer'
                      }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="dash-form-group">
                <label className="dash-form-label">Description / Synopsis de la Vidéo</label>
                <textarea 
                  className="dash-form-textarea" 
                  rows={3}
                  value={videoFormData.description}
                  onChange={(e) => setVideoFormData({ ...videoFormData, description: e.target.value })}
                  placeholder="Présentez la vidéo, les coulisses, les caractéristiques du produit ou les détails de l'annonce..." 
                />
              </div>

              {/* ORDRE & STATUT ACTIF */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div className="dash-form-group">
                  <label className="dash-form-label">Ordre d'affichage (0, 1, 2...)</label>
                  <input 
                    type="number" 
                    className="dash-form-input" 
                    value={videoFormData.order}
                    onChange={(e) => setVideoFormData({ ...videoFormData, order: e.target.value })}
                    min="0"
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '24px' }}>
                  <input 
                    type="checkbox" 
                    id="isVideoActiveCheck"
                    style={{ width: '18px', height: '18px', accentColor: 'var(--red-primary)', cursor: 'pointer' }}
                    checked={videoFormData.isActive}
                    onChange={(e) => setVideoFormData({ ...videoFormData, isActive: e.target.checked })}
                  />
                  <label htmlFor="isVideoActiveCheck" style={{ fontSize: '13px', color: '#fff', cursor: 'pointer', userSelect: 'none' }}>
                    <strong>Publier cette vidéo sur le site</strong> (Visible dans Watch DWT)
                  </label>
                </div>
              </div>

              <div className="dash-modal-btn-row">
                <button type="button" className="btn-dash-approve" onClick={() => setShowVideoModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn-dash-reject" disabled={uploadingVideoImage || uploadingVideoFile}>
                  {editingVideo ? 'Enregistrer les Modifications 🎬' : 'Publier la Vidéo 🐺🎬'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: APERÇU VIDÉO LECTEUR (PREVIEW) */}
      {previewVideoModal && (
        <div className="dash-modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setPreviewVideoModal(null); }}>
          <div className="dash-modal-box dash-modal-box-lg" style={{ padding: 0, overflow: 'hidden', background: '#090d16' }}>
            <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e283d' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Film size={18} color="var(--red-primary)" />
                <span style={{ fontWeight: '800', color: '#fff', fontSize: '15px' }}>{previewVideoModal.title}</span>
              </div>
              <button 
                type="button" 
                onClick={() => setPreviewVideoModal(null)}
                className="dash-more-btn"
                style={{ padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#000' }}>
              {previewVideoModal.videoUrl.startsWith('/uploads/') || /\.(mp4|webm|mov|ogg|mkv|m4v)(\?.*)?$/i.test(previewVideoModal.videoUrl) ? (
                <video
                  src={previewVideoModal.videoUrl.startsWith('/uploads/') ? `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}${previewVideoModal.videoUrl}` : previewVideoModal.videoUrl}
                  controls
                  autoPlay
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' }}
                />
              ) : (
                <iframe
                  src={previewVideoModal.videoUrl.includes('v=') ? `https://www.youtube-nocookie.com/embed/${previewVideoModal.videoUrl.split('v=')[1]?.split('&')[0]}?autoplay=1` : previewVideoModal.videoUrl.includes('youtu.be/') ? `https://www.youtube-nocookie.com/embed/${previewVideoModal.videoUrl.split('youtu.be/')[1]?.split('?')[0]}?autoplay=1` : previewVideoModal.videoUrl}
                  title={previewVideoModal.title}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
            <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8', fontSize: '12px' }}>
              <span>{previewVideoModal.description}</span>
              <button
                type="button"
                className="btn-dash-approve"
                style={{ padding: '6px 14px' }}
                onClick={() => setPreviewVideoModal(null)}
              >
                Fermer l'aperçu
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboardPage;
