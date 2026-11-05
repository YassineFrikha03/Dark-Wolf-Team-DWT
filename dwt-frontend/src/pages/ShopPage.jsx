import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  X, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  RotateCcw, 
  ArrowLeft,
  SlidersHorizontal,
  Check,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../utils/imageUrl';
import API from '../services/api';

const defaultGradients = [
  { bga: 'linear-gradient(135deg,#1a1a2e,#0e0e1e)', bgb: 'linear-gradient(160deg,#2a2a4e,#1a1a2e)' },
  { bga: 'linear-gradient(135deg,#141414,#0a0a0a)', bgb: 'linear-gradient(160deg,#1e1e1e,#141414)' },
  { bga: 'linear-gradient(135deg,#111,#1a1418)', bgb: 'linear-gradient(160deg,#1a1a1a,#111111)' },
  { bga: 'linear-gradient(135deg,#0e1a0e,#080808)', bgb: 'linear-gradient(160deg,#1a2a1a,#0e1a0e)' },
  { bga: 'linear-gradient(135deg,#1f132b,#0c0614)', bgb: 'linear-gradient(160deg,#301a42,#1a0e26)' },
  { bga: 'linear-gradient(135deg,#1a180e,#0a0a04)', bgb: 'linear-gradient(160deg,#2a2717,#14130a)' },
];

const CATEGORIES = [
  { id: 'All', label: 'All Items' },
  { id: 'Best Sellers', label: 'Best Sellers' },
  { id: 'Pro Kit', label: 'Pro Kit' },
  { id: 'New Collection', label: 'New Collection' },
  { id: 'Custom', label: 'Custom' },
];

const ShopPage = ({ 
  products = [], 
  initialCategory = 'All', 
  onSelectProduct, 
  onOpenMuseum, 
  onOpenCustomStudio,
  onBackToSite 
}) => {
  const { addToCart } = useCart();
  const [internalProducts, setInternalProducts] = useState(products);
  const [loading, setLoading] = useState(products.length === 0);
  const [activeCategory, setActiveCategory] = useState(initialCategory || 'All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [addedItems, setAddedItems] = useState({});

  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    if (products && products.length > 0) {
      setInternalProducts(products);
      setLoading(false);
    } else {
      setLoading(true);
      API.get('/products')
        .then((res) => {
          if (res.data?.products) {
            setInternalProducts(res.data.products);
          }
        })
        .catch((err) => {
          console.error('Erreur chargement boutique:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [products]);

  // Filter products strictly without Collabs or Accessories
  const filteredProducts = useMemo(() => {
    return internalProducts.filter((p) => {
      const pCat = (p.category || '').toLowerCase();
      const pName = (p.name || '').toLowerCase();

      // Exclude Collabs and Accessories
      if (pCat.includes('collab') || pName.includes('collab')) return false;
      if (pCat.includes('accessoire') || pCat.includes('accessory')) return false;

      // Filter by Category
      if (activeCategory === 'Best Sellers') {
        if (!p.isFeatured && !p.badge?.toLowerCase().includes('best')) return false;
      } else if (activeCategory === 'Pro Kit') {
        if (!pCat.includes('maillot') && !pName.includes('pro') && !pCat.includes('kit')) return false;
      } else if (activeCategory === 'New Collection') {
        if (!p.badge?.toLowerCase().includes('new') && !pCat.includes('hoodie')) return false;
      } else if (activeCategory === 'Custom' || activeCategory === 'Custom Gear') {
        if (!pName.includes('custom') && !pCat.includes('custom') && !pCat.includes('maillot') && !pCat.includes('hoodie')) return false;
      } else if (activeCategory !== 'All') {
        if (pCat !== activeCategory.toLowerCase()) return false;
      }

      // Filter by Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = pName.includes(q);
        const matchesDesc = (p.description || '').toLowerCase().includes(q);
        const matchesCat = pCat.includes(q);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }

      // Filter In Stock
      if (inStockOnly && p.stockCount === 0) return false;

      // Filter On Sale
      if (onSaleOnly && (!p.comparePrice || p.comparePrice <= p.price)) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [internalProducts, activeCategory, searchQuery, inStockOnly, onSaleOnly, sortBy]);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    const size = product.sizes?.[0] || 'M';
    addToCart(product, size, 1);
    setAddedItems((prev) => ({ ...prev, [product._id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => {
        const copy = { ...prev };
        delete copy[product._id];
        return copy;
      });
    }, 1800);
  };

  const getProductImageStyle = (p, idx, isBack = false) => {
    const grad = defaultGradients[idx % defaultGradients.length];
    const imagesList = Array.isArray(p.images) && p.images.length > 0
      ? p.images
      : (p.image ? [p.image] : []);

    const imgUrl = isBack && imagesList[1] ? imagesList[1] : imagesList[0];
    
    if (imgUrl) {
      return {
        backgroundImage: `url(${getImageUrl(imgUrl)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    return {
      background: isBack ? grad.bgb : grad.bga,
    };
  };

  const resetFilters = () => {
    setActiveCategory('All');
    setSearchQuery('');
    setSortBy('newest');
    setInStockOnly(false);
    setOnSaleOnly(false);
  };

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh', color: 'var(--light)', paddingBottom: '90px' }}>
      
      {/* Breadcrumb Bar */}
      <div style={{ borderBottom: '1px solid var(--gray1)', background: 'var(--dark1)' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '16px 60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontFamily: '"Rajdhani", sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--silver)' }}>
            <button 
              type="button" 
              onClick={onBackToSite}
              style={{ background: 'none', border: 'none', color: 'var(--silver)', cursor: 'none', padding: 0, display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontFamily: 'inherit', letterSpacing: 'inherit', textTransform: 'inherit', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.target.style.color = 'var(--white)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--silver)'}
            >
              <ArrowLeft size={13} /> Accueil
            </button>
            <span style={{ color: 'var(--gray2)' }}>/</span>
            <span style={{ color: 'var(--white)', fontWeight: '700' }}>Dark Lab Store</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {onOpenMuseum && (
              <button
                type="button"
                className="bva"
                onClick={onOpenMuseum}
                style={{ fontSize: '11px', padding: '6px 14px' }}
              >
                Museum Archive →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Store Header Section */}
      <section style={{ padding: '60px 60px 30px', background: 'var(--dark1)', borderBottom: '1px solid var(--gray1)' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
          <div className="shdr rv vis" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <div className="slbl">Dark Lab • Official Apparel</div>
              <h1 className="stitle" style={{ fontSize: '38px', margin: '6px 0 10px' }}>
                BOUTIQUE OFFICIELLE
              </h1>
              <p
                style={{
                  fontFamily: '"Rajdhani", sans-serif',
                  fontSize: '15px',
                  color: 'var(--silver)',
                  maxWidth: '720px',
                  lineHeight: '1.5'
                }}
              >
                Tenues de compétition officielles, maillots techniques et collections exclusives Dark Wolf Team.
              </p>
            </div>

            {/* Bouton direct vers l'espace Custom Studio */}
            <button
              type="button"
              onClick={() => onOpenCustomStudio && onOpenCustomStudio()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 26px',
                background: 'linear-gradient(135deg, rgba(230,0,0,0.2) 0%, rgba(13,16,26,0.95) 100%)',
                border: '1.5px solid #ff2a2a',
                borderRadius: '6px',
                color: '#ffffff',
                fontFamily: '"Orbitron", sans-serif',
                fontSize: '12px',
                fontWeight: '900',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                boxShadow: '0 0 25px rgba(255,42,42,0.3)',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #cc2222 0%, #ff2a2a 100%)';
                e.currentTarget.style.boxShadow = '0 0 35px rgba(255,42,42,0.65)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(230,0,0,0.2) 0%, rgba(13,16,26,0.95) 100%)';
                e.currentTarget.style.boxShadow = '0 0 25px rgba(255,42,42,0.3)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Sparkles size={16} color="#ff4444" />
              <span>ATELIER CUSTOM : CRÉER MON ÉQUIPEMENT</span>
              <span style={{ fontSize: '14px' }}>&rarr;</span>
            </button>
          </div>

          {/* E-Commerce Toolbar: Categories, Search, Filters, Sort */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              flexWrap: 'wrap', 
              gap: '16px',
              paddingTop: '20px',
              borderTop: '1px solid var(--gray1)'
            }}
          >
            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      if (cat.id === 'Custom') {
                        if (onOpenCustomStudio) onOpenCustomStudio();
                      } else {
                        setActiveCategory(cat.id);
                      }
                    }}
                    style={{
                      padding: '8px 18px',
                      border: isActive ? '1px solid var(--white)' : '1px solid var(--gray1)',
                      background: isActive ? 'var(--white)' : 'var(--dark2)',
                      color: isActive ? 'var(--black)' : 'var(--silver)',
                      fontFamily: '"Rajdhani", sans-serif',
                      fontSize: '12px',
                      fontWeight: '700',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      cursor: 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Right-side Controls: Search, In Stock Toggle, Sort */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              
              {/* Search Bar */}
              <div style={{ position: 'relative', width: '220px' }}>
                <Search 
                  size={14} 
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray3)' }} 
                />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 30px 8px 34px',
                    background: 'var(--dark2)',
                    border: '1px solid var(--gray1)',
                    color: 'var(--white)',
                    fontSize: '12px',
                    fontFamily: '"Rajdhani", sans-serif',
                    outline: 'none',
                    letterSpacing: '0.05em'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--silver)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--gray1)'}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--silver)',
                      cursor: 'none',
                      padding: 0
                    }}
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* In Stock Only Button */}
              <button
                type="button"
                onClick={() => setInStockOnly(!inStockOnly)}
                style={{
                  padding: '8px 14px',
                  background: inStockOnly ? 'var(--gray1)' : 'var(--dark2)',
                  border: inStockOnly ? '1px solid var(--silver)' : '1px solid var(--gray1)',
                  color: inStockOnly ? 'var(--white)' : 'var(--silver)',
                  fontSize: '12px',
                  fontFamily: '"Rajdhani", sans-serif',
                  fontWeight: '600',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'none',
                  transition: 'all 0.2s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: inStockOnly ? '#4ade80' : 'var(--gray3)' }}></span>
                En stock
              </button>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  background: 'var(--dark2)',
                  border: '1px solid var(--gray1)',
                  color: 'var(--silver)',
                  fontSize: '12px',
                  fontFamily: '"Rajdhani", sans-serif',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '8px 14px',
                  outline: 'none',
                  cursor: 'none'
                }}
              >
                <option value="newest">Plus Récents</option>
                <option value="price-asc">Prix : Croissant</option>
                <option value="price-desc">Prix : Décroissant</option>
              </select>

              {/* Reset if active */}
              {(activeCategory !== 'All' || searchQuery || inStockOnly || onSaleOnly) && (
                <button
                  type="button"
                  onClick={resetFilters}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--wolf)',
                    fontSize: '11px',
                    fontFamily: '"Rajdhani", sans-serif',
                    fontWeight: '700',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    cursor: 'none',
                    textDecoration: 'underline'
                  }}
                >
                  Effacer filtres
                </button>
              )}
            </div>
          </div>

          {/* Custom Studio Banner Card */}
          <div
            style={{
              marginTop: '24px',
              padding: '24px 32px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(230, 0, 0, 0.16) 0%, rgba(10, 14, 22, 0.95) 60%, rgba(5, 7, 12, 0.98) 100%)',
              border: '1px solid rgba(255, 42, 42, 0.35)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), inset 0 0 24px rgba(255, 42, 42, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '20px',
            }}
          >
            <div style={{ maxWidth: '720px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ background: '#ff2a2a', color: '#fff', fontSize: '10px', fontFamily: '"Orbitron", sans-serif', fontWeight: '900', padding: '2px 8px', borderRadius: '4px', letterSpacing: '0.08em' }}>
                  ESPACE CUSTOM OFFICIEL
                </span>
                <span style={{ fontSize: '11px', color: '#94a3b8', fontFamily: '"Rajdhani", sans-serif', letterSpacing: '0.05em' }}>
                  MAILLOTS • HOODIES • CACHE-COLS • SURVÊTEMENTS
                </span>
              </div>
              <h3 style={{ fontFamily: '"Orbitron", sans-serif', fontSize: '17px', fontWeight: '900', color: '#ffffff', letterSpacing: '0.05em', margin: '4px 0' }}>
                PERSONNALISEZ VOTRE ÉQUIPEMENT DWT AVEC VOS GRAFFITIS & GAMERTAG
              </h3>
              <p style={{ fontFamily: '"Rajdhani", sans-serif', fontSize: '13px', color: '#cbd5e1', lineHeight: '1.4', margin: 0 }}>
                Choisissez votre vêtement de base, appliquez des graffitis street art exclusifs avec calcul de prix en temps réel, et floquez votre pseudo et numéro de dossard officiel.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onOpenCustomStudio && onOpenCustomStudio()}
              style={{
                padding: '12px 26px',
                borderRadius: '6px',
                background: '#ff2a2a',
                border: 'none',
                color: '#ffffff',
                fontFamily: '"Orbitron", sans-serif',
                fontSize: '11px',
                fontWeight: '900',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 0 20px rgba(255, 42, 42, 0.5)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 42, 42, 0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 42, 42, 0.5)';
              }}
            >
              <Sparkles size={14} />
              LANCER LE STUDIO CUSTOM
            </button>
          </div>
        </div>
      </section>

      {/* Product Catalog Grid (Using Native Site pcard Styling) */}
      <section style={{ maxWidth: '1440px', margin: '0 auto', padding: '40px 60px' }}>
        
        {/* Count Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ fontFamily: '"Rajdhani", sans-serif', fontSize: '13px', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gray3)' }}>
            {filteredProducts.length} PRODUIT{filteredProducts.length > 1 ? 'S' : ''} TROUVÉ{filteredProducts.length > 1 ? 'S' : ''}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--silver)' }}>
            <div className="animate-spin" style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid var(--gray1)', borderTopColor: 'var(--white)', borderRadius: '50%', marginBottom: '16px' }}></div>
            <div style={{ fontFamily: '"Rajdhani", sans-serif', fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              CHARGEMENT DU CATALOGUE...
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div 
            style={{
              background: 'var(--dark2)',
              border: '1px solid var(--gray1)',
              padding: '80px 24px',
              textAlign: 'center',
              maxWidth: '600px',
              margin: '40px auto'
            }}
          >
            <div style={{ fontFamily: '"Orbitron", sans-serif', fontSize: '18px', fontWeight: '700', color: 'var(--white)', marginBottom: '10px' }}>
              AUCUN PRODUIT TROUVÉ
            </div>
            <p style={{ fontFamily: '"Rajdhani", sans-serif', fontSize: '14px', color: 'var(--silver)', marginBottom: '20px' }}>
              Aucun article ne correspond à votre sélection actuelle.
            </p>
            <button
              type="button"
              className="bva"
              onClick={resetFilters}
            >
              Afficher Tous les Produits
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px',
            }}
          >
            {filteredProducts.map((p, idx) => {
              const hasSale = p.comparePrice && p.comparePrice > p.price;
              const badge = hasSale ? 'Sale' : (p.isFeatured ? 'Best Seller' : p.badge || '');
              const badgeType = hasSale ? 'sale' : (p.badgeType || '');
              const imgCount = Array.isArray(p.images) ? p.images.length : (p.image ? 1 : 0);
              const isAdded = Boolean(addedItems[p._id]);

              return (
                <div
                  key={p._id || idx}
                  className="pcard rv vis"
                  onClick={() => onSelectProduct && onSelectProduct(p)}
                  style={{ width: '100%', margin: 0, position: 'relative' }}
                >
                  <div className="pimg">
                    <div className="pimg-wrap">
                      <div
                        className="pimg-a"
                        style={getProductImageStyle(p, idx, false)}
                      ></div>
                      <div
                        className="pimg-b"
                        style={getProductImageStyle(p, idx, true)}
                      ></div>
                    </div>

                    {badge && (
                      <div className={`pbadge ${badgeType}`}>{badge}</div>
                    )}

                    {imgCount > 1 && (
                      <span
                        style={{
                          position: 'absolute',
                          bottom: '10px',
                          left: '10px',
                          background: 'rgba(5, 7, 12, 0.85)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: '#fff',
                          fontSize: '10px',
                          fontWeight: '800',
                          padding: '2px 7px',
                          borderRadius: '10px',
                          zIndex: 2,
                        }}
                      >
                        {imgCount} photos
                      </span>
                    )}

                    <div className="pqv">
                      <button
                        className="bqv"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProduct && onSelectProduct(p);
                        }}
                      >
                        Quick View
                      </button>
                    </div>
                  </div>

                  <div className="pinfo">
                    <div className="pname">{p.name}</div>
                    <div className="pcat">{p.category || 'Dark Lab'}</div>
                    <div className="pfoot">
                      <div className="pprice">
                        TND {p.price}
                        {hasSale && <span className="old">TND {p.comparePrice}</span>}
                      </div>

                      <button
                        className="bac"
                        onClick={(e) => handleAddToCart(e, p)}
                        aria-label="Add to cart"
                        title="Ajouter au panier"
                        style={{
                          background: isAdded ? 'var(--white)' : undefined,
                          color: isAdded ? 'var(--black)' : undefined
                        }}
                      >
                        {isAdded ? (
                          <Check size={14} />
                        ) : (
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <path d="M16 10a4 4 0 01-8 0" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </section>

      {/* Trust & E-Commerce Guarantees (Clean, Esport Style, No Emojis) */}
      <section style={{ borderTop: '1px solid var(--gray1)', borderBottom: '1px solid var(--gray1)', background: 'var(--dark1)', padding: '40px 60px' }}>
        <div 
          style={{ 
            maxWidth: '1440px', 
            margin: '0 auto', 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
            gap: '30px' 
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <ShieldCheck size={22} color="var(--wolf)" />
            <div>
              <div style={{ fontFamily: '"Rajdhani", sans-serif', fontSize: '13px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--white)' }}>
                Official Merchandise
              </div>
              <div style={{ fontSize: '12px', color: 'var(--gray3)' }}>Certifié Dark Wolf Team</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Truck size={22} color="var(--wolf)" />
            <div>
              <div style={{ fontFamily: '"Rajdhani", sans-serif', fontSize: '13px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--white)' }}>
                Expédition Express 24/48h
              </div>
              <div style={{ fontSize: '12px', color: 'var(--gray3)' }}>Tunisie & International</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <CreditCard size={22} color="var(--wolf)" />
            <div>
              <div style={{ fontFamily: '"Rajdhani", sans-serif', fontSize: '13px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--white)' }}>
                Paiement Sécurisé
              </div>
              <div style={{ fontSize: '12px', color: 'var(--gray3)' }}>Carte bancaire & Espèces</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <RotateCcw size={22} color="var(--wolf)" />
            <div>
              <div style={{ fontFamily: '"Rajdhani", sans-serif', fontSize: '13px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--white)' }}>
                Échanges Sous 14 Jours
              </div>
              <div style={{ fontSize: '12px', color: 'var(--gray3)' }}>Changement de taille garanti</div>
            </div>
          </div>
        </div>
      </section>

      {/* Museum Archive Teaser */}
      {onOpenMuseum && (
        <section style={{ maxWidth: '1440px', margin: '60px auto 0', padding: '0 60px' }}>
          <div 
            style={{
              padding: '40px',
              background: 'var(--dark2)',
              border: '1px solid var(--gray1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '20px'
            }}
          >
            <div>
              <div className="slbl" style={{ marginBottom: '6px' }}>Archives & Vintage Drops</div>
              <div style={{ fontFamily: '"Orbitron", sans-serif', fontSize: '20px', fontWeight: '700', color: 'var(--white)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Museum DWT Archives
              </div>
              <p style={{ fontFamily: '"Rajdhani", sans-serif', fontSize: '14px', color: 'var(--silver)', margin: 0, maxWidth: '640px' }}>
                Explorez les collections passées, maillots de tournois historiques et éditions limitées archivées.
              </p>
            </div>
            <button
              type="button"
              className="bva"
              onClick={onOpenMuseum}
            >
              Explorer les Archives →
            </button>
          </div>
        </section>
      )}

    </div>
  );
};

export default ShopPage;
