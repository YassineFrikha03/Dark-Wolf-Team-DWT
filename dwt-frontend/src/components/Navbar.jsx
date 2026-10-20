import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { WolfLogo } from './WolfLogo';

const Navbar = ({
  onOpenAuth,
  onOpenMuseum,
  onOpenMembers,
  onToggleCart,
  onOpenFanPortal,
  onOpenPlayer,
  onOpenAdmin,
  onOpenAchievements,
  onOpenPartners,
  onOpenBrandGuidelines,
  onSelectShopCategory,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleShopCategory = (cat) => {
    if (onSelectShopCategory) onSelectShopCategory(cat);
    scrollTo('#shop');
  };

  return (
    <header id="hdr" className={scrolled ? 'scrolled' : 'top'}>
      <a href="#" className="hlogo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
        <img
          src="/logo-dwt.png"
          alt="Dark Wolf Team Logo"
          style={{ width: '46px', height: '46px', objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.2))' }}
        />
        <div className="htxt">
          <span className="tn">Dark Wolf Team</span>
          <span className="bn">Dark Lab</span>
        </div>
      </a>

      <nav>
        {/* Shop Dropdown */}
        <div className="ng">
          <button className="nb" onClick={() => scrollTo('#shop')}>
            Shop
            <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 3.5l3 3 3-3" />
            </svg>
          </button>
          <div className="dd">
            <a href="#shop" onClick={(e) => { e.preventDefault(); handleShopCategory('Best Sellers'); }}>Best Sellers</a>
            <a href="#shop" onClick={(e) => { e.preventDefault(); handleShopCategory('Pro Kit'); }}>Pro Kit</a>
            <a href="#shop" onClick={(e) => { e.preventDefault(); handleShopCategory('New Collection'); }}>New Collection</a>
            <a href="#shop" onClick={(e) => { e.preventDefault(); handleShopCategory('Collabs'); }}>Collabs</a>
            <a href="#shop" onClick={(e) => { e.preventDefault(); handleShopCategory('Accessories'); }}>Accessories</a>
            <a href="#shop" onClick={(e) => { e.preventDefault(); handleShopCategory('Pro Kit'); }}>Custom Gear</a>
            <a
              href="#museum"
              onClick={(e) => { e.preventDefault(); onOpenMuseum(); }}
              style={{ color: 'var(--wolf)' }}
            >
              Museum (Archive)
            </a>
          </div>
        </div>

        {/* DWT Teams Dropdown */}
        <div className="ng">
          <button className="nb" onClick={() => scrollTo('#teams')}>
            DWT Teams
            <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 3.5l3 3 3-3" />
            </svg>
          </button>
          <div className="dd">
            <a href="#teams" onClick={(e) => { e.preventDefault(); onOpenMembers('All'); }}>
              Our Teams & Rosters
            </a>
            <a 
              href="#matches-live" 
              onClick={(e) => {
                e.preventDefault();
                const el = document.querySelector('#matches-live') || document.querySelector('#mstrip');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  el.style.transition = 'all 0.5s ease';
                  el.style.boxShadow = '0 0 45px rgba(230, 0, 0, 0.5)';
                  el.style.borderColor = 'rgba(230, 0, 0, 0.8)';
                  setTimeout(() => {
                    el.style.boxShadow = '';
                    el.style.borderColor = '';
                  }, 2400);
                } else {
                  scrollTo('#news');
                }
              }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}
            >
              <span>Matches & Live</span>
              <span style={{ 
                fontSize: '9px', 
                background: 'rgba(230,0,0,0.25)', 
                color: '#ff4d4d', 
                border: '1px solid #e60000', 
                borderRadius: '10px', 
                padding: '1px 6px', 
                fontWeight: '800',
                letterSpacing: '0.05em'
              }}>
                🔴 LIVE
              </span>
            </a>
            <a
              href="#achievements"
              onClick={(e) => {
                e.preventDefault();
                if (onOpenAchievements) onOpenAchievements();
              }}
            >
              Achievements & Trophées 🏆
            </a>
          </div>
        </div>

        {/* About DWT Dropdown */}
        <div className="ng">
          <button className="nb" onClick={() => scrollTo('#footer')}>
            About DWT
            <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 3.5l3 3 3-3" />
            </svg>
          </button>
          <div className="dd">
            <a href="#join" onClick={(e) => { e.preventDefault(); scrollTo('#join'); }}>Careers (Recrutement)</a>
            <a
              href="#partners"
              onClick={(e) => {
                e.preventDefault();
                if (onOpenPartners) onOpenPartners();
              }}
            >
              Partners (Sponsors)
            </a>
            <a
              href="#brand"
              onClick={(e) => {
                e.preventDefault();
                if (onOpenBrandGuidelines) onOpenBrandGuidelines();
              }}
            >
              Brand Guidelines (Logos & Chartes)
            </a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('#contact'); }}>Contact</a>
          </div>
        </div>

        {/* Join Us Link */}
        <div className="ng">
          <button className="nb" onClick={() => scrollTo('#join')}>
            Join Us
          </button>
        </div>

        {/* Fan Zone Dropdown - Réservé aux joueurs et fans */}
        {user?.role !== 'admin' && (
          <div className="ng">
            <button className="nb">
              Fan Zone <span className="arr"></span>
              <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 3.5l3 3 3-3" />
              </svg>
            </button>
            <div className="dd">
              <a href="#wolfpack" onClick={(e) => { e.preventDefault(); onOpenPlayer ? onOpenPlayer('Mon Profil') : (onOpenFanPortal && onOpenFanPortal('PROFILE')); }} className="hl">
                🐺 Identité Wolf Pack (Profil & Rangs)
              </a>
              <a href="#predictions" onClick={(e) => { e.preventDefault(); onOpenPlayer ? onOpenPlayer('Pronostics') : (onOpenFanPortal && onOpenFanPortal('PRED')); }} className="hl">
                🎯 Pronostics de Matchs
              </a>
              <a href="#leaderboard" onClick={(e) => { e.preventDefault(); onOpenPlayer ? onOpenPlayer('Classement') : (onOpenFanPortal && onOpenFanPortal('LEADERBOARD')); }} className="hl">
                🏆 Classement de la Saison
              </a>
              <a href="#missions" onClick={(e) => { e.preventDefault(); onOpenPlayer ? onOpenPlayer('Quêtes') : (onOpenFanPortal && onOpenFanPortal('MISSIONS')); }} className="hl">
                📋 Quêtes Hebdomadaires
              </a>
              <a href="#chat" onClick={(e) => { e.preventDefault(); onOpenPlayer ? onOpenPlayer('Messagerie Staff') : (onOpenFanPortal && onOpenFanPortal('PROFILE')); }} className="hl">
                💬 Messagerie Directe Staff
              </a>
              <a href="#orders" onClick={(e) => { e.preventDefault(); onOpenPlayer ? onOpenPlayer('Ma Boutique') : (onOpenFanPortal && onOpenFanPortal('PROFILE')); }} className="hl">
                🛍️ Mes Commandes Boutique
              </a>
            </div>
          </div>
        )}
      </nav>

      <div className="hacts">
        <button className="bcart" onClick={onToggleCart} aria-label="Cart">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          <span id="cartBadge">{totalItems}</span>
        </button>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {user.role === 'admin' ? (
              <button
                type="button"
                className="bnav-admin"
                onClick={onOpenAdmin}
                title="Accéder au panneau d'administration officiel"
              >
                <Shield size={13} color="#ff4d4d" />
                <span>Admin Dashboard</span>
              </button>
            ) : (
              <button
                type="button"
                className="bnav-player"
                onClick={() => onOpenPlayer ? onOpenPlayer('Mon Profil') : (onOpenFanPortal && onOpenFanPortal('PROFILE'))}
                title="Accéder à mon Espace Joueur & Meute (Page Complète)"
              >
                <WolfLogo size={15} />
                <span>{user.gamertag || user.email?.split('@')[0]}</span>
                <span
                  className="bnav-badge-rank"
                  style={{
                    background:
                      user.wolfRank === 'Alpha'
                        ? 'rgba(230,0,0,0.25)'
                        : user.wolfRank === 'Hunter'
                        ? 'rgba(245,158,11,0.2)'
                        : 'rgba(56,189,248,0.2)',
                    color:
                      user.wolfRank === 'Alpha'
                        ? '#ff4d4d'
                        : user.wolfRank === 'Hunter'
                        ? '#f59e0b'
                        : '#38bdf8',
                    border: '1px solid currentColor',
                  }}
                >
                  {user.wolfRank || 'Cub'} • {user.wolfPoints || 150} PTS
                </span>
              </button>
            )}
            <button type="button" className="bsi" onClick={logout} style={{ padding: '7px 14px', fontSize: '11px' }}>
              Déconnexion
            </button>
          </div>
        ) : (
          <>
            <button type="button" className="bsi" onClick={() => onOpenAuth('login')}>
              Mon Compte
            </button>
            <button type="button" className="bjn" onClick={() => onOpenAuth('register')}>
              Join Now
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
