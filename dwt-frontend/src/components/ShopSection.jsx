import React, { useRef, useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../utils/imageUrl';

const defaultGradients = [
  { bga: 'linear-gradient(135deg,#1a1a2e,#0e0e1e)', bgb: 'linear-gradient(160deg,#2a2a4e,#1a1a2e)' },
  { bga: 'linear-gradient(135deg,#141414,#0a0a0a)', bgb: 'linear-gradient(160deg,#1e1e1e,#141414)' },
  { bga: 'linear-gradient(135deg,#111,#1a1418)', bgb: 'linear-gradient(160deg,#1a1a1a,#111111)' },
  { bga: 'linear-gradient(135deg,#0e1a0e,#080808)', bgb: 'linear-gradient(160deg,#1a2a1a,#0e1a0e)' },
  { bga: 'linear-gradient(135deg,#1f132b,#0c0614)', bgb: 'linear-gradient(160deg,#301a42,#1a0e26)' },
  { bga: 'linear-gradient(135deg,#1a180e,#0a0a04)', bgb: 'linear-gradient(160deg,#2a2717,#14130a)' },
];

const categories = [
  'All',
  'Best Sellers',
  'Pro Kit',
  'New Collection',
  'Custom'
];

const ShopSection = ({ products = [], onSelectProduct, onOpenMuseum, initialCategory = 'All', onOpenShop, onOpenCustomStudio }) => {
  const { addToCart } = useCart();
  const carouselRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [isFullGridView, setIsFullGridView] = useState(false);

  useEffect(() => {
    if (initialCategory) setActiveCategory(initialCategory);
  }, [initialCategory]);

  const scrollCarousel = (dir) => {
    if (!carouselRef.current) return;
    const w = carouselRef.current.firstElementChild
      ? carouselRef.current.firstElementChild.offsetWidth + 20
      : 300;
    carouselRef.current.scrollBy({ left: dir * w * 2, behavior: 'smooth' });
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

  // Filter products by selected category (Collabs and Accessories removed)
  const filteredProducts = products.filter((p) => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Best Sellers') return p.isFeatured || p.badge?.toLowerCase().includes('best');
    if (activeCategory === 'Pro Kit') return p.category?.toLowerCase().includes('maillot') || p.name?.toLowerCase().includes('pro');
    if (activeCategory === 'New Collection') return p.badge?.toLowerCase().includes('new') || p.category?.toLowerCase().includes('hoodie');
    return p.category?.toLowerCase() === activeCategory.toLowerCase();
  });

  return (
    <section id="shop" style={{ padding: '100px 60px', background: 'var(--dark1)' }}>
      <div className="shdr rv vis">
        <div>
          <div className="slbl">Dark Lab • Official Apparel & Merch</div>
          <h2 className="stitle">DARK WOLF TEAM<br />Featured Collection</h2>
          <p
            style={{
              fontFamily: '"Rajdhani", sans-serif',
              fontSize: '14px',
              color: 'var(--silver)',
              marginTop: '8px',
            }}
          >
            Drop your style. Dominate the arena. High-grade esports clothing.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {onOpenShop && (
            <button 
              className="bva" 
              onClick={() => onOpenShop(activeCategory)}
              style={{
                background: 'rgba(230,0,0,0.15)',
                borderColor: '#e60000',
                color: '#fff',
                fontWeight: '700'
              }}
            >
              Boutique Complète →
            </button>
          )}
          <button className="bva" onClick={onOpenMuseum}>
            Museum (Archive) →
          </button>
          <button 
            className="bva" 
            onClick={() => setIsFullGridView(!isFullGridView)}
            style={{ background: isFullGridView ? 'rgba(230,0,0,0.2)' : undefined, borderColor: isFullGridView ? '#e60000' : undefined }}
          >
            {isFullGridView ? 'Mode Carrousel' : 'Voir Toute la Sélection'}
          </button>
        </div>
      </div>

      {/* Category Pills Filter Bar */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '24px 0 16px' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              if (cat === 'Custom' && onOpenCustomStudio) {
                onOpenCustomStudio();
              } else {
                setActiveCategory(cat);
              }
            }}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: activeCategory === cat ? '1px solid #e60000' : '1px solid rgba(255, 255, 255, 0.1)',
              background: activeCategory === cat ? '#e60000' : 'rgba(255, 255, 255, 0.04)',
              color: '#fff',
              fontSize: '12px',
              fontWeight: '700',
              fontFamily: '"Rajdhani", sans-serif',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {cat} {cat === 'All' ? `(${products.length})` : ''}
          </button>
        ))}
      </div>

      {/* Grid or Carousel View */}
      {isFullGridView ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '24px',
            marginTop: '20px',
          }}
        >
          {filteredProducts.map((p, idx) => {
            const hasSale = p.comparePrice && p.comparePrice > p.price;
            const badge = hasSale ? 'Sale' : p.isFeatured ? 'Best Seller' : p.badge || '';
            const badgeType = hasSale ? 'sale' : p.badgeType || '';
            const imgCount = Array.isArray(p.images) ? p.images.length : (p.image ? 1 : 0);

            return (
              <div
                key={p._id || idx}
                className="pcard rv vis"
                onClick={() => onSelectProduct(p)}
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
                        onSelectProduct(p);
                      }}
                    >
                      Quick View
                    </button>
                  </div>
                </div>

                <div className="pinfo">
                  <div className="pname">{p.name}</div>
                  <div className="pcat">{p.category}</div>
                  <div className="pfoot">
                    <div className="pprice">
                      TND {p.price}
                      {hasSale && <span className="old">TND {p.comparePrice}</span>}
                    </div>
                    <button
                      className="bac"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(p);
                      }}
                      aria-label="Add to cart"
                    >
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
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="pcarousel-wrap">
          <button className="carow left" onClick={() => scrollCarousel(-1)} aria-label="Previous">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="pcarousel" id="pgrid" ref={carouselRef}>
            {filteredProducts.map((p, idx) => {
              const hasSale = p.comparePrice && p.comparePrice > p.price;
              const badge = hasSale ? 'Sale' : p.isFeatured ? 'Best Seller' : p.badge || '';
              const badgeType = hasSale ? 'sale' : p.badgeType || '';
              const imgCount = Array.isArray(p.images) ? p.images.length : (p.image ? 1 : 0);

              return (
                <div
                  key={p._id || idx}
                  className="pcard rv vis"
                  onClick={() => onSelectProduct(p)}
                  style={{ position: 'relative' }}
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
                          onSelectProduct(p);
                        }}
                      >
                        Quick View
                      </button>
                    </div>
                  </div>

                  <div className="pinfo">
                    <div className="pname">{p.name}</div>
                    <div className="pcat">{p.category}</div>
                    <div className="pfoot">
                      <div className="pprice">
                        TND {p.price}
                        {hasSale && <span className="old">TND {p.comparePrice}</span>}
                      </div>
                      <button
                        className="bac"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(p);
                        }}
                        aria-label="Add to cart"
                      >
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
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button className="carow right" onClick={() => scrollCarousel(1)} aria-label="Next">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}

      {/* Bannière d'accès vers la page individuelle complète de la Boutique */}
      {onOpenShop && (
        <div 
          style={{
            marginTop: '45px',
            padding: '24px 30px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(20,24,36,0.85) 0%, rgba(10,12,18,0.95) 100%)',
            border: '1px solid rgba(230,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '18px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.4)'
          }}
        >
          <div>
            <div style={{ color: '#e60000', fontSize: '11px', fontWeight: '800', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>
              Catalogue Officiel Complet
            </div>
            <div style={{ color: '#fff', fontSize: '18px', fontWeight: '800', fontFamily: '"Orbitron", sans-serif' }}>
              Découvrez Toute la Boutique Dark Lab
            </div>
            <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>
              Accédez à tous nos maillots, tenues de compétition, promotions et filtres avancés sur la page dédiée.
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => onOpenCustomStudio ? onOpenCustomStudio() : onOpenShop('Custom')}
              style={{
                background: 'linear-gradient(135deg, rgba(230,0,0,0.2) 0%, rgba(13,16,26,0.95) 100%)',
                color: '#fff',
                border: '1.5px solid #ff2a2a',
                padding: '12px 22px',
                fontFamily: '"Orbitron", monospace',
                fontSize: '11px',
                fontWeight: '800',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                borderRadius: '6px',
                boxShadow: '0 0 20px rgba(230,0,0,0.3)',
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>Atelier Custom</span>
              <span>&rarr;</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenShop(activeCategory)}
              style={{
                background: 'linear-gradient(135deg, #e60000 0%, #aa0000 100%)',
                color: '#fff',
                border: 'none',
                padding: '12px 26px',
                fontFamily: '"Orbitron", monospace',
                fontSize: '12px',
                fontWeight: '800',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                borderRadius: '6px',
                boxShadow: '0 0 20px rgba(230,0,0,0.4)',
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>Ouvrir la Boutique Complète</span>
              <span>&rarr;</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ShopSection;
