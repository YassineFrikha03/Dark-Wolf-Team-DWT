import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BrandTitle } from './WolfLogo';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  ShoppingBag, 
  LogOut, 
  Menu, 
  X,
  ShieldCheck,
  User,
  Sparkles,
  ChevronRight
} from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'À propos', path: '/a-propos' },
    { name: 'Équipe', path: '/equipe' },
    { name: 'Tournois', path: '/tournois' },
    { name: 'Boutique', path: '/boutique', badge: 'Dark Lab' },
    { name: 'Actualités', path: '/actualites' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <header className={`navbar-header ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Brand Logo & Name */}
        <Link to="/" className="brand-logo-container" title="Dark Wolf Team - Accueil">
          <BrandTitle />
        </Link>

        {/* Center Navigation Links */}
        <nav className="navbar-nav-desktop" aria-label="Navigation principale">
          <ul className="navbar-menu">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <li key={link.name} className="navbar-item">
                  <Link
                    to={link.path}
                    className={`navbar-link ${isActive ? 'active' : ''}`}
                  >
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="navbar-link-tag">{link.badge}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right Actions: Cart, User Profile / Auth, Mobile Toggle */}
        <div className="navbar-right">
          {/* Cart Icon with Counter */}
          <Link 
            to="/panier" 
            className="navbar-action-btn navbar-cart-btn" 
            title="Mon Panier"
            aria-label={`Panier (${totalItems} articles)`}
          >
            <ShoppingBag size={19} />
            {totalItems > 0 && (
              <span className="navbar-cart-badge">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Link>

          {/* User Logged In state */}
          {user ? (
            <div className="navbar-user-actions">
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className="navbar-admin-chip" 
                  title="Tableau de bord Administrateur"
                >
                  <ShieldCheck size={16} />
                  <span>Admin</span>
                </Link>
              )}

              <Link 
                to="/espace-joueur" 
                className="navbar-user-chip"
                title="Mon Espace Joueur"
              >
                <div className="navbar-user-avatar">
                  <User size={15} />
                </div>
                <div className="navbar-user-info">
                  <span className="navbar-user-name">{user.gamertag || user.email?.split('@')[0]}</span>
                  <span className="navbar-user-role">{user.role === 'admin' ? 'Staff' : 'Membre'}</span>
                </div>
              </Link>

              <button 
                onClick={logout} 
                className="navbar-action-btn navbar-logout-btn" 
                title="Se déconnecter"
                aria-label="Se déconnecter"
              >
                <LogOut size={17} />
              </button>
            </div>
          ) : (
            /* Visitor Auth Buttons */
            <div className="navbar-guest-actions">
              <Link to="/login" className="navbar-btn-login">
                Connexion
              </Link>
              <Link to="/boutique" className="navbar-btn-primary">
                <Sparkles size={14} />
                <span>Shop</span>
              </Link>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button 
            className="navbar-mobile-toggle" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Modern Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="navbar-mobile-drawer">
          <div className="navbar-mobile-links">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`navbar-mobile-link ${isActive ? 'active' : ''}`}
                >
                  <div className="mobile-link-inner">
                    <span>{link.name}</span>
                    {link.badge && <span className="navbar-link-tag">{link.badge}</span>}
                  </div>
                  <ChevronRight size={16} className="mobile-chevron" />
                </Link>
              );
            })}
          </div>

          <div className="navbar-mobile-footer">
            <Link
              to="/panier"
              onClick={() => setMobileMenuOpen(false)}
              className="navbar-mobile-cart-btn"
            >
              <ShoppingBag size={18} />
              <span>Voir le panier ({totalItems})</span>
            </Link>

            {user ? (
              <div className="navbar-mobile-user-box">
                <div className="mobile-user-meta">
                  <div className="navbar-user-avatar">
                    <User size={16} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', color: '#fff', fontSize: '15px' }}>{user.gamertag}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{user.email}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <Link 
                    to="/espace-joueur" 
                    className="navbar-btn-primary" 
                    style={{ flex: 1, justifyContent: 'center' }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Mon Espace
                  </Link>
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      className="navbar-btn-login"
                      style={{ justifyContent: 'center' }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  )}
                  <button 
                    onClick={() => { logout(); setMobileMenuOpen(false); }} 
                    className="navbar-action-btn"
                    title="Déconnexion"
                    style={{ border: '1px solid var(--border-dark)', borderRadius: '6px' }}
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="navbar-mobile-auth-grid">
                <Link 
                  to="/login" 
                  className="navbar-btn-login" 
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ justifyContent: 'center' }}
                >
                  Se connecter
                </Link>
                <Link 
                  to="/contact" 
                  className="navbar-btn-primary" 
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ justifyContent: 'center' }}
                >
                  Rejoindre la meute
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

