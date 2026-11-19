import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import API from './services/api';

import IntroCinematic from './components/IntroCinematic';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import HeroSlider from './components/HeroSlider';
import ShopSection from './components/ShopSection';
import OrderPanel from './components/OrderPanel';
import ProductDetailModal from './components/ProductDetailModal';
import MuseumModal from './components/MuseumModal';
import NewsSection from './components/NewsSection';
import TeamsSection from './components/TeamsSection';
import MembersModal from './components/MembersModal';
import MediaSection from './components/MediaSection';
import SocialSection from './components/SocialSection';
import CountdownSection from './components/CountdownSection';
import JoinSection from './components/JoinSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import WolfChatbot from './components/WolfChatbot';
import FanPortalModal from './components/FanPortalModal';
import AchievementsModal from './components/AchievementsModal';
import PartnersModal from './components/PartnersModal';
import BrandGuidelinesModal from './components/BrandGuidelinesModal';
import LegalModal from './components/LegalModal';
import AdminDashboardPage from './pages/AdminDashboardPage';
import PlayerDashboardPage from './pages/PlayerDashboardPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ShopPage from './pages/ShopPage';
import CustomizerModal from './customizer/CustomizerModal';

function AppContent() {
  const { user, loading, logout } = useAuth();
  const location = useLocation();
  const [currentView, setCurrentView] = useState(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    if (path === '/admin' || hash === '#admin') return 'admin';
    if (path === '/espace-joueur' || hash === '#espace-joueur' || path === '/player' || hash === '#player') return 'player';
    if (path === '/login') return 'login';
    if (path === '/forgot-password' || path === '/reset-password') return 'forgot-password';
    if (path === '/shop' || path === '/boutique' || hash === '#shop-page' || path === '/custom' || path === '/studio') return 'shop';
    return 'site';
  });
  const [playerTab, setPlayerTab] = useState('Mon Profil');
  const [hasSeenIntro, setHasSeenIntro] = useState(false);

  const handleIntroFinish = () => {
    setHasSeenIntro(true);
  };

  useEffect(() => {
    window.__DWT_REPLAY_INTRO__ = () => {
      setHasSeenIntro(false);
    };
  }, []);

  const [products, setProducts] = useState([]);
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [news, setNews] = useState([]);

  // Modals & Panels State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMuseumOpen, setIsMuseumOpen] = useState(false);
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [rosterGame, setRosterGame] = useState('All');
  const [authModal, setAuthModal] = useState({ isOpen: false, tab: 'login' });
  const [fanPortal, setFanPortal] = useState({ isOpen: false, mode: 'FAN' });

  // Additional destination modals
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isPartnersOpen, setIsPartnersOpen] = useState(false);
  const [isBrandGuidelinesOpen, setIsBrandGuidelinesOpen] = useState(false);
  const [legalModal, setLegalModal] = useState({ isOpen: false, tab: 'privacy' });
  const [shopCategoryFilter, setShopCategoryFilter] = useState('All');
  const [isCustomStudioOpen, setIsCustomStudioOpen] = useState(() => {
    try {
      const path = window.location.pathname;
      const search = window.location.search;
      const hash = window.location.hash;
      return path === '/custom' || path === '/studio' || search.includes('custom=1') || search.includes('debug=1') || hash.includes('custom');
    } catch {
      return false;
    }
  });

  // Protection automatique des vues privées (Admin et Joueur)
  useEffect(() => {
    if (loading) return;

    if (currentView === 'admin') {
      const isAdminUser = user && (user.role === 'admin' || user.role === 'moderator');
      if (!isAdminUser) {
        setCurrentView('site');
        window.history.replaceState(null, '', '/');
        if (!user) {
          setAuthModal({ isOpen: true, tab: 'login' });
        }
      }
    } else if (currentView === 'player') {
      if (!user) {
        setCurrentView('site');
        window.history.replaceState(null, '', '/');
        setAuthModal({ isOpen: true, tab: 'login' });
      }
    }
  }, [user, loading, currentView]);

  // Fetch real data from MongoDB Atlas backend API
  const fetchData = async () => {
    try {
      const [prodRes, playRes, matchRes, newsRes] = await Promise.all([
        API.get('/products').catch(() => ({ data: { products: [] } })),
        API.get('/players').catch(() => ({ data: { players: [] } })),
        API.get('/matches').catch(() => ({ data: { matches: [] } })),
        API.get('/news').catch(() => ({ data: { articles: [] } })),
      ]);

      if (prodRes.data?.products?.length) {
        setProducts(prodRes.data.products);
      }
      if (playRes.data?.players?.length) {
        setPlayers(playRes.data.players);
      }
      if (matchRes.data?.matches?.length) {
        setMatches(matchRes.data.matches);
      }
      if (newsRes.data?.articles?.length) {
        setNews(newsRes.data.articles);
      }
    } catch (err) {
      console.error('Erreur de chargement des données:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Synchronisation dynamique du chemin URL avec la vue courante (React Router location)
  useEffect(() => {
    const path = location.pathname;
    const hash = location.hash;
    if (path === '/admin' || hash === '#admin') {
      if (user && (user.role === 'admin' || user.role === 'moderator')) {
        setCurrentView('admin');
      } else if (!loading) {
        setCurrentView('site');
        window.history.replaceState(null, '', '/');
        if (!user) setAuthModal({ isOpen: true, tab: 'login' });
      }
    } else if (path === '/espace-joueur' || hash === '#espace-joueur' || path === '/player' || hash === '#player') {
      if (!user && !loading) {
        setCurrentView('site');
        window.history.replaceState(null, '', '/');
        setAuthModal({ isOpen: true, tab: 'login' });
      } else if (user?.role === 'admin' || user?.role === 'moderator') {
        setCurrentView('admin');
      } else if (user) {
        setCurrentView('player');
      }
    } else if (path === '/login') {
      setCurrentView('login');
    } else if (path === '/forgot-password' || path === '/reset-password') {
      setCurrentView('forgot-password');
    } else if (path === '/custom' || path === '/studio') {
      try {
        sessionStorage.setItem('dwt_intro_seen', 'true');
      } catch {}
      setHasSeenIntro(true);
      setCurrentView('shop');
      setIsCustomStudioOpen(true);
    } else if (path === '/shop' || path === '/boutique' || hash === '#shop-page') {
      try {
        sessionStorage.setItem('dwt_intro_seen', 'true');
      } catch {}
      setHasSeenIntro(true);
      setCurrentView('shop');
      if (location.search.includes('custom=1') || location.search.includes('debug=1') || hash.includes('custom')) {
        setIsCustomStudioOpen(true);
      }
    } else if (path === '/') {
      setCurrentView('site');
      if (location.search.includes('custom=1') || location.search.includes('debug=1') || hash.includes('custom')) {
        setIsCustomStudioOpen(true);
      }
    }
  }, [location.pathname, location.search, location.hash, user, loading]);

  const handleOpenCustomStudio = () => {
    try {
      sessionStorage.setItem('dwt_intro_seen', 'true');
    } catch {}
    setHasSeenIntro(true);
    setIsCustomStudioOpen(true);
    window.history.pushState(null, '', '/custom');
  };

  const handleCloseCustomStudio = () => {
    setIsCustomStudioOpen(false);
    if (window.location.pathname === '/custom' || window.location.pathname === '/studio') {
      window.history.pushState(null, '', currentView === 'shop' ? '/shop' : '/');
    }
  };

  const goToAdmin = () => {
    try {
      sessionStorage.setItem('dwt_intro_seen', 'true');
    } catch {}
    setHasSeenIntro(true);
    if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
      setAuthModal({ isOpen: true, tab: 'login' });
      return;
    }
    setCurrentView('admin');
    window.history.pushState(null, '', '/admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPlayer = (tab = 'Mon Profil') => {
    try {
      sessionStorage.setItem('dwt_intro_seen', 'true');
    } catch {}
    setHasSeenIntro(true);
    if (!user) {
      setAuthModal({ isOpen: true, tab: 'login' });
      return;
    }
    if (user?.role === 'admin' || user?.role === 'moderator') {
      goToAdmin();
      return;
    }
    setPlayerTab(tab);
    setCurrentView('player');
    window.history.pushState(null, '', '/espace-joueur');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToShop = (category = 'All') => {
    try {
      sessionStorage.setItem('dwt_intro_seen', 'true');
    } catch {}
    setHasSeenIntro(true);
    setShopCategoryFilter(category);
    setCurrentView('shop');
    window.history.pushState(null, '', '/shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (category === 'Custom' || category === 'Custom Gear') {
      setIsCustomStudioOpen(true);
    }
  };

  const goToSite = () => {
    try {
      sessionStorage.setItem('dwt_intro_seen', 'true');
    } catch {}
    setHasSeenIntro(true);
    setCurrentView('site');
    window.history.pushState(null, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchData(); // refresh data modified in admin or player dashboard
  };

  // Keyboard shortcut: Escape closes open modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedProduct(null);
        setIsCartOpen(false);
        setIsMuseumOpen(false);
        setIsMembersOpen(false);
        setAuthModal({ isOpen: false, tab: 'login' });
        setFanPortal({ isOpen: false, mode: 'FAN' });
        setIsAchievementsOpen(false);
        setIsPartnersOpen(false);
        setIsBrandGuidelinesOpen(false);
        setLegalModal({ isOpen: false, tab: 'privacy' });
        setIsCustomStudioOpen(false);
        document.body.style.overflow = '';
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Reveal observer for scroll animations
  useEffect(() => {
    if (currentView !== 'site') return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('vis');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.rv, .rvl, .rvr').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [products, news, matches, currentView]);

  const openProductDetail = (prod) => {
    setSelectedProduct(prod);
    document.body.style.overflow = 'hidden';
  };

  const closeProductDetail = () => {
    setSelectedProduct(null);
    document.body.style.overflow = '';
  };

  const openMuseum = () => {
    setIsMuseumOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeMuseum = () => {
    setIsMuseumOpen(false);
    document.body.style.overflow = '';
  };

  const openMembers = (game = 'All') => {
    setRosterGame(game);
    setIsMembersOpen(true);
    document.body.style.overflow = 'hidden';
    // Re-fetch players from backend to guarantee fresh list
    API.get('/players')
      .then((res) => {
        if (res.data?.players) setPlayers(res.data.players);
      })
      .catch(() => {});
  };

  const closeMembers = () => {
    setIsMembersOpen(false);
    document.body.style.overflow = '';
  };

  const openAuth = (tab = 'login') => {
    setAuthModal({ isOpen: true, tab });
    document.body.style.overflow = 'hidden';
  };

  const closeAuth = () => {
    setAuthModal({ isOpen: false, tab: 'login' });
    document.body.style.overflow = '';
  };

  const openFanPortal = (mode = 'FAN') => {
    if (user?.role === 'admin') {
      goToAdmin();
      return;
    }
    setFanPortal({ isOpen: true, mode });
    document.body.style.overflow = 'hidden';
  };

  const closeFanPortal = () => {
    setFanPortal({ isOpen: false, mode: 'FAN' });
    document.body.style.overflow = '';
  };

  const handleSelectShopCategory = (cat) => {
    setShopCategoryFilter(cat);
    goToShop(cat);
  };

  // Gestionnaire de navigation dynamique intelligent pour les boutons des affiches cinématiques (Hero Slider)
  const handleHeroNavigate = (target = '', text = '') => {
    const rawTarget = (target || '').trim();
    const rawText = (text || '').trim();
    const tLower = rawTarget.toLowerCase();
    const txtLower = rawText.toLowerCase();

    // Helper pour défiler et illuminer la section ciblée
    const scrollToSection = (sel) => {
      const el = document.querySelector(sel);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        el.style.transition = 'box-shadow 0.6s ease, border-color 0.6s ease';
        el.style.boxShadow = '0 0 50px rgba(230, 0, 0, 0.5)';
        setTimeout(() => {
          el.style.boxShadow = '';
        }, 2200);
      }
    };

    // 1. Liens externes absolus
    if (rawTarget.startsWith('http://') || rawTarget.startsWith('https://')) {
      window.open(rawTarget, '_blank', 'noopener,noreferrer');
      return;
    }

    // 2. Discord & Réseaux Sociaux
    if (txtLower.includes('discord') || tLower.includes('discord')) {
      if (tLower === '#social' || txtLower.includes('réseaux')) {
        scrollToSection('#social');
      } else {
        window.open('https://discord.gg', '_blank');
      }
      return;
    }

    // 3. Partenaires & Sponsors / Offre Dubby
    if (
      tLower === '#partners' || 
      tLower === '/partenaires' || 
      txtLower.includes('dubby') || 
      txtLower.includes('sponsor') || 
      txtLower.includes('partenaire') ||
      txtLower.includes('profiter de l\'offre')
    ) {
      setIsPartnersOpen(true);
      document.body.style.overflow = 'hidden';
      return;
    }

    // 4. Musée / Archives
    if (tLower === '#museum' || tLower === '/museum' || txtLower.includes('musée') || txtLower.includes('museum') || txtLower.includes('archive')) {
      openMuseum();
      return;
    }

    // 5. Palmarès / Trophées
    if (tLower === '#achievements' || tLower === '/achievements' || txtLower.includes('palmarès') || txtLower.includes('trophée') || txtLower.includes('achievement')) {
      setIsAchievementsOpen(true);
      return;
    }

    // 6. Espace Joueur & Fan Zone
    if (tLower.startsWith('#player') || tLower.startsWith('/player') || tLower.startsWith('/espace-joueur') || txtLower.includes('fan zone') || txtLower.includes('espace joueur') || txtLower.includes('wolf pack')) {
      if (tLower.includes('pred') || txtLower.includes('pronostic')) {
        goToPlayer('Pronostics');
      } else if (tLower.includes('miss') || txtLower.includes('quête')) {
        goToPlayer('Quêtes');
      } else if (tLower.includes('lead') || txtLower.includes('classement')) {
        goToPlayer('Classement');
      } else {
        goToPlayer('Mon Profil');
      }
      return;
    }

    // 7. Panier / Cart
    if (tLower === '#cart' || tLower === '/panier' || txtLower.includes('panier') || txtLower.includes('mon panier')) {
      setIsCartOpen(true);
      return;
    }

    // 8. Admin
    if (tLower === '#admin' || tLower === '/admin' || txtLower === 'admin' || txtLower === 'dashboard') {
      goToAdmin();
      return;
    }

    // 9. Équipes / Rosters
    if (
      tLower === '#teams' || 
      tLower === '/equipe' || 
      tLower === '/teams' || 
      txtLower.includes('pack') || 
      txtLower.includes('équipe') || 
      txtLower.includes('roster') || 
      txtLower.includes('joueur') || 
      txtLower.includes('meet the pack') ||
      txtLower.includes('découvrir l\'équipe')
    ) {
      if (txtLower.includes('valorant')) {
        openMembers('Valorant');
      } else if (txtLower.includes('cs2') || txtLower.includes('counter')) {
        openMembers('Counter Strike 2');
      } else if (txtLower.includes('lol') || txtLower.includes('league')) {
        openMembers('League of Legends');
      } else {
        scrollToSection('#teams');
      }
      return;
    }

    // 10. Tournois / Matchs Live
    if (
      tLower === '#matches-live' || 
      tLower === '#matches' || 
      tLower === '/tournois' || 
      tLower === '/matches' || 
      txtLower.includes('match') || 
      txtLower.includes('tournoi') || 
      txtLower.includes('live') || 
      txtLower.includes('score')
    ) {
      const matchEl = document.querySelector('#matches-live') || document.querySelector('#mstrip') || document.querySelector('#news');
      if (matchEl) {
        matchEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        matchEl.style.transition = 'all 0.5s ease';
        matchEl.style.boxShadow = '0 0 50px rgba(230, 0, 0, 0.6)';
        matchEl.style.borderColor = 'rgba(230, 0, 0, 0.9)';
        setTimeout(() => {
          matchEl.style.boxShadow = '';
          matchEl.style.borderColor = '';
        }, 2500);
      }
      return;
    }

    // 11. Compte à rebours / Timer
    if (tLower === '#countdown' || tLower === '/countdown' || txtLower.includes('timer') || txtLower.includes('compte à rebours') || txtLower.includes('drop')) {
      scrollToSection('#countdown');
      return;
    }

    // 12. Recrutement / Rejoindre
    if (
      tLower === '#join' || 
      tLower === '/recrutement' || 
      tLower === '/join' || 
      txtLower.includes('rejoindre') || 
      txtLower.includes('join') || 
      txtLower.includes('recrutement') || 
      txtLower.includes('postuler') || 
      txtLower.includes('tryout')
    ) {
      scrollToSection('#join');
      return;
    }

    // 13. Contact
    if (tLower === '#contact' || tLower === '/contact' || txtLower.includes('contact') || txtLower.includes('nous écrire') || txtLower.includes('support')) {
      scrollToSection('#contact');
      return;
    }

    // 14. Actualités / News
    if (tLower === '#news' || tLower === '/actualites' || tLower === '/news' || txtLower.includes('news') || txtLower.includes('actualité') || txtLower.includes('scoop')) {
      scrollToSection('#news');
      return;
    }

    // 15. Vidéos / Médias
    if (tLower === '#media' || tLower === '/media' || txtLower.includes('vidéo') || txtLower.includes('clip') || txtLower.includes('youtube')) {
      scrollToSection('#media');
      return;
    }

    // 16. Réseaux Sociaux
    if (tLower === '#social' || tLower === '/social' || txtLower.includes('réseaux') || txtLower.includes('social')) {
      scrollToSection('#social');
      return;
    }

    // 17. Boutique officielle (Redirection vers la page individuelle Shop)
    if (tLower.includes('pro-kit') || txtLower.includes('pro kit') || txtLower.includes('maillot')) {
      goToShop('Pro Kit');
      return;
    }
    if (tLower.includes('best') || txtLower.includes('best seller')) {
      goToShop('Best Sellers');
      return;
    }
    if (tLower.includes('new') || txtLower.includes('nouveauté')) {
      goToShop('New Collection');
      return;
    }
    if (tLower.includes('custom') || txtLower.includes('custom') || txtLower.includes('personnalis')) {
      setIsCustomStudioOpen(true);
      return;
    }
    if (
      tLower === '#shop' || 
      tLower === '/boutique' || 
      tLower === '/shop' || 
      txtLower.includes('shop') || 
      txtLower.includes('boutique') || 
      txtLower.includes('store') || 
      txtLower.includes('acheter') || 
      txtLower.includes('collection')
    ) {
      goToShop('All');
      return;
    }

    // Fallback: si rawTarget commence par #, scroller vers cet élément
    if (rawTarget.startsWith('#')) {
      scrollToSection(rawTarget.split(':')[0]);
    } else {
      goToShop('All');
    }
  };

  return (
    <>
      {/* Universal Cyber Cursor across the entire website */}
      <CustomCursor />

      {/* Cinematic Intro - Display on initial visit */}
      {!hasSeenIntro && currentView !== 'admin' && (
        <IntroCinematic onFinish={handleIntroFinish} />
      )}

      {/* DWT Custom Studio 3D Modal (Configurateur Three.js officiel Dark Wolf Team) */}
      <CustomizerModal
        isOpen={isCustomStudioOpen}
        onClose={handleCloseCustomStudio}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {currentView === 'admin' && (
        loading ? (
          <div style={{ minHeight: '100vh', background: '#07080c', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: '"Orbitron", sans-serif' }}>
            <div style={{ textAlign: 'center' }}>
              <div className="animate-spin" style={{ display: 'inline-block', width: '36px', height: '36px', border: '3px solid #1e2436', borderTopColor: '#e60000', borderRadius: '50%', marginBottom: '16px' }}></div>
              <div style={{ fontSize: '12px', letterSpacing: '1px', color: '#94a3b8' }}>VÉRIFICATION DE SÉCURITÉ DWT...</div>
            </div>
          </div>
        ) : (!user || (user.role !== 'admin' && user.role !== 'moderator')) ? null : (
          <div className="admin-view-wrapper" style={{ minHeight: '100vh', background: '#07080c' }}>
            <AdminDashboardPage 
              onBackToSite={goToSite} 
              onLogout={() => {
                logout();
                goToSite();
              }}
            />
          </div>
        )
      )}

      {currentView === 'player' && (
        loading ? (
          <div style={{ minHeight: '100vh', background: '#07080c', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: '"Orbitron", sans-serif' }}>
            <div style={{ textAlign: 'center' }}>
              <div className="animate-spin" style={{ display: 'inline-block', width: '36px', height: '36px', border: '3px solid #1e2436', borderTopColor: '#e60000', borderRadius: '50%', marginBottom: '16px' }}></div>
              <div style={{ fontSize: '12px', letterSpacing: '1px', color: '#94a3b8' }}>CHARGEMENT ESPACE JOUEUR...</div>
            </div>
          </div>
        ) : !user ? null : (user.role === 'admin' || user.role === 'moderator') ? (
          <div className="admin-view-wrapper" style={{ minHeight: '100vh', background: '#07080c' }}>
            <AdminDashboardPage 
              onBackToSite={goToSite}
              onLogout={() => {
                logout();
                goToSite();
              }}
            />
          </div>
        ) : (
          <div className="player-view-wrapper" style={{ minHeight: '100vh', background: '#07080c' }}>
            <PlayerDashboardPage 
              onBackToSite={goToSite}
              onGoToAdmin={goToAdmin}
              onLogout={() => {
                logout();
                goToSite();
              }}
              initialTab={playerTab} 
            />
          </div>
        )
      )}

      {currentView === 'shop' && (
        <div style={{ minHeight: '100vh', background: 'var(--black)', display: 'flex', flexDirection: 'column' }}>
          <Navbar
            onOpenAuth={openAuth}
            onOpenMuseum={openMuseum}
            onOpenMembers={openMembers}
            onToggleCart={() => setIsCartOpen(!isCartOpen)}
            onOpenFanPortal={openFanPortal}
            onOpenPlayer={goToPlayer}
            onOpenAdmin={goToAdmin}
            onOpenAchievements={() => setIsAchievementsOpen(true)}
            onOpenPartners={() => setIsPartnersOpen(true)}
            onOpenBrandGuidelines={() => setIsBrandGuidelinesOpen(true)}
            onSelectShopCategory={handleSelectShopCategory}
            onOpenShop={goToShop}
            onOpenCustomStudio={handleOpenCustomStudio}
            onBackToSite={goToSite}
          />
          <main style={{ flex: 1, paddingTop: '80px' }}>
            <ShopPage
              products={products}
              initialCategory={shopCategoryFilter}
              onSelectProduct={openProductDetail}
              onOpenMuseum={openMuseum}
              onOpenCustomStudio={handleOpenCustomStudio}
              onBackToSite={goToSite}
            />
          </main>
          <Footer
            onOpenMuseum={openMuseum}
            onOpenMembers={openMembers}
            onOpenAdmin={goToAdmin}
            onOpenPlayer={goToPlayer}
            onOpenAchievements={() => setIsAchievementsOpen(true)}
            onOpenPartners={() => setIsPartnersOpen(true)}
            onOpenBrandGuidelines={() => setIsBrandGuidelinesOpen(true)}
            onOpenLegal={(tab) => setLegalModal({ isOpen: true, tab: tab || 'privacy' })}
            onSelectShopCategory={handleSelectShopCategory}
            onOpenShop={goToShop}
            onOpenCustomStudio={handleOpenCustomStudio}
          />
          <OrderPanel
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            onOpenAuth={openAuth}
          />
          <ProductDetailModal
            product={selectedProduct}
            isOpen={Boolean(selectedProduct)}
            onClose={closeProductDetail}
          />
          <MuseumModal isOpen={isMuseumOpen} onClose={closeMuseum} />
          <AuthModal
            isOpen={authModal.isOpen}
            initialTab={authModal.tab}
            onClose={closeAuth}
          />
          <WolfChatbot />
        </div>
      )}

      {currentView === 'login' && (
        <div style={{ minHeight: '100vh', background: 'var(--black)', display: 'flex', flexDirection: 'column' }}>
          <Navbar
            onOpenAuth={openAuth}
            onOpenMuseum={openMuseum}
            onOpenMembers={openMembers}
            onToggleCart={() => setIsCartOpen(!isCartOpen)}
            onOpenFanPortal={openFanPortal}
            onOpenPlayer={goToPlayer}
            onOpenAdmin={goToAdmin}
            onOpenAchievements={() => setIsAchievementsOpen(true)}
            onOpenPartners={() => setIsPartnersOpen(true)}
            onOpenBrandGuidelines={() => setIsBrandGuidelinesOpen(true)}
            onSelectShopCategory={handleSelectShopCategory}
            onOpenShop={goToShop}
            onOpenCustomStudio={handleOpenCustomStudio}
            onBackToSite={goToSite}
          />
          <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 20px 60px' }}>
            <LoginPage />
          </main>
          <Footer
            onOpenMuseum={openMuseum}
            onOpenMembers={openMembers}
            onOpenAdmin={goToAdmin}
            onOpenPlayer={goToPlayer}
            onOpenAchievements={() => setIsAchievementsOpen(true)}
            onOpenPartners={() => setIsPartnersOpen(true)}
            onOpenBrandGuidelines={() => setIsBrandGuidelinesOpen(true)}
            onOpenLegal={(tab) => setLegalModal({ isOpen: true, tab: tab || 'privacy' })}
            onSelectShopCategory={handleSelectShopCategory}
            onOpenShop={goToShop}
            onOpenCustomStudio={handleOpenCustomStudio}
          />
        </div>
      )}

      {currentView === 'forgot-password' && (
        <div style={{ minHeight: '100vh', background: 'var(--black)', display: 'flex', flexDirection: 'column' }}>
          <Navbar
            onOpenAuth={openAuth}
            onOpenMuseum={openMuseum}
            onOpenMembers={openMembers}
            onToggleCart={() => setIsCartOpen(!isCartOpen)}
            onOpenFanPortal={openFanPortal}
            onOpenPlayer={goToPlayer}
            onOpenAdmin={goToAdmin}
            onOpenAchievements={() => setIsAchievementsOpen(true)}
            onOpenPartners={() => setIsPartnersOpen(true)}
            onOpenBrandGuidelines={() => setIsBrandGuidelinesOpen(true)}
            onSelectShopCategory={handleSelectShopCategory}
            onOpenShop={goToShop}
            onOpenCustomStudio={handleOpenCustomStudio}
            onBackToSite={goToSite}
          />
          <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 20px 60px' }}>
            <ForgotPasswordPage />
          </main>
          <Footer
            onOpenMuseum={openMuseum}
            onOpenMembers={openMembers}
            onOpenAdmin={goToAdmin}
            onOpenPlayer={goToPlayer}
            onOpenAchievements={() => setIsAchievementsOpen(true)}
            onOpenPartners={() => setIsPartnersOpen(true)}
            onOpenBrandGuidelines={() => setIsBrandGuidelinesOpen(true)}
            onOpenLegal={(tab) => setLegalModal({ isOpen: true, tab: tab || 'privacy' })}
            onSelectShopCategory={handleSelectShopCategory}
            onOpenShop={goToShop}
            onOpenCustomStudio={handleOpenCustomStudio}
          />
        </div>
      )}

      {currentView === 'site' && (
        <>
          {/* Header */}
          <Navbar
        onOpenAuth={openAuth}
        onOpenMuseum={openMuseum}
        onOpenMembers={openMembers}
        onToggleCart={() => setIsCartOpen(!isCartOpen)}
        onOpenFanPortal={openFanPortal}
        onOpenPlayer={goToPlayer}
        onOpenAdmin={goToAdmin}
        onOpenAchievements={() => setIsAchievementsOpen(true)}
        onOpenPartners={() => setIsPartnersOpen(true)}
        onOpenBrandGuidelines={() => setIsBrandGuidelinesOpen(true)}
        onSelectShopCategory={handleSelectShopCategory}
        onOpenShop={goToShop}
        onOpenCustomStudio={handleOpenCustomStudio}
        onBackToSite={goToSite}
      />

      <main>
        {/* Hero Section (Affiches Cinématiques reliées aux pages) */}
        <HeroSlider onNavigate={handleHeroNavigate} />

        {/* Featured Shop Collection */}
        <ShopSection
          products={products}
          onSelectProduct={openProductDetail}
          onOpenMuseum={openMuseum}
          initialCategory={shopCategoryFilter}
          onOpenShop={goToShop}
          onOpenCustomStudio={handleOpenCustomStudio}
        />

        {/* News & Matches */}
        <NewsSection
          news={news}
          matches={matches}
          onOpenPredictions={() => goToPlayer('Pronostics')}
        />

        {/* DWT Teams & Rosters */}
        <TeamsSection onOpenRoster={openMembers} />

        {/* Media / YouTube / Trailers / Ads */}
        <MediaSection onNavigate={handleHeroNavigate} />

        {/* Socials */}
        <SocialSection />

        {/* Next Championship Countdown */}
        <CountdownSection />

        {/* Join Us */}
        <JoinSection />

        {/* Contact DWT */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenMuseum={openMuseum}
        onOpenMembers={openMembers}
        onOpenAdmin={goToAdmin}
        onOpenPlayer={goToPlayer}
        onOpenAchievements={() => setIsAchievementsOpen(true)}
        onOpenPartners={() => setIsPartnersOpen(true)}
        onOpenBrandGuidelines={() => setIsBrandGuidelinesOpen(true)}
        onOpenLegal={(tab) => setLegalModal({ isOpen: true, tab: tab || 'privacy' })}
        onSelectShopCategory={handleSelectShopCategory}
        onOpenShop={goToShop}
        onOpenCustomStudio={() => setIsCustomStudioOpen(true)}
      />

      {/* Slide-out Order Panel (Cart) */}
      <OrderPanel
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOpenAuth={openAuth}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={closeProductDetail}
      />

      {/* Museum Archive Modal */}
      <MuseumModal isOpen={isMuseumOpen} onClose={closeMuseum} />

      {/* Members / Roster Modal */}
      <MembersModal
        isOpen={isMembersOpen}
        onClose={closeMembers}
        selectedGame={rosterGame}
        players={players}
      />

      {/* Auth Modal (Sign In / Register) */}
      <AuthModal
        isOpen={authModal.isOpen}
        initialTab={authModal.tab}
        onClose={closeAuth}
      />

      {/* Fan Zone Portal Modal */}
      <FanPortalModal
        isOpen={fanPortal.isOpen}
        mode={fanPortal.mode}
        onClose={closeFanPortal}
      />

      {/* Achievements / Palmarès Modal */}
      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
      />

      {/* Partners & Sponsors Modal */}
      <PartnersModal
        isOpen={isPartnersOpen}
        onClose={() => setIsPartnersOpen(false)}
        onOpenContact={() => {
          setIsPartnersOpen(false);
          document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Brand Guidelines Modal */}
      <BrandGuidelinesModal
        isOpen={isBrandGuidelinesOpen}
        onClose={() => setIsBrandGuidelinesOpen(false)}
      />

      {/* Legal & Privacy & Terms Modal */}
      <LegalModal
        isOpen={legalModal.isOpen}
        initialTab={legalModal.tab}
        onClose={() => setLegalModal({ isOpen: false, tab: 'privacy' })}
      />

      {/* Floating Wolf Bot AI Chatbot */}
      <WolfChatbot />
        </>
      )}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
