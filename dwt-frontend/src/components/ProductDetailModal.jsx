import React, { useState } from 'react';
import { X, ShoppingCart, Check, Star, ShieldCheck, Truck, RotateCcw, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../utils/imageUrl';

const ProductDetailModal = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(() => {
    if (Array.isArray(product?.sizes) && product.sizes.length > 0) {
      return product.sizes[0];
    }
    return 'M';
  });
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!isOpen || !product) return null;

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.image || 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80'];

  const discountPercent = product.comparePrice > product.price
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
    }, 2000);
  };

  return (
    <div className="product-modal-backdrop" onClick={onClose}>
      <div 
        className="product-modal-box" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Bouton Fermer */}
        <button 
          className="product-modal-close" 
          onClick={onClose}
          aria-label="Fermer"
        >
          <X size={20} />
        </button>

        <div className="product-modal-grid">
          {/* Colonne Gauche : Galerie Images */}
          <div className="product-modal-gallery">
            <div className="product-modal-main-img-box">
              <img 
                src={getImageUrl(images[selectedImgIdx] || images[0])} 
                alt={product.name}
                className="product-modal-main-img" 
              />
              {discountPercent > 0 && (
                <span className="product-badge-discount" style={{ top: '16px', right: '16px' }}>
                  -{discountPercent}%
                </span>
              )}
              <span className="product-badge-category" style={{ top: '16px', left: '16px' }}>
                {product.category || 'Merch'}
              </span>
            </div>

            {/* Vignettes si plusieurs photos */}
            {images.length > 1 && (
              <div className="product-modal-thumbs">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`product-modal-thumb-btn ${selectedImgIdx === idx ? 'active' : ''}`}
                    onClick={() => setSelectedImgIdx(idx)}
                  >
                    <img src={getImageUrl(img)} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Colonne Droite : Informations & Achat */}
          <div className="product-modal-details">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--red-primary)', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={14} /> Dark Wolf Team Official
              </span>
              <span style={{ color: '#475569' }}>•</span>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>{product.category}</span>
            </div>

            <h2 className="product-modal-title">{product.name}</h2>

            {/* Note & Avis */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', color: '#fbbf24', gap: '2px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    fill={i < Math.floor(product.rating || 5) ? '#fbbf24' : 'none'} 
                    color="#fbbf24" 
                  />
                ))}
              </div>
              <span style={{ fontSize: '13px', color: '#e2e8f0', fontWeight: '700' }}>
                {product.rating ? Number(product.rating).toFixed(1) : '5.0'}
              </span>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                ({product.numReviews || 12} avis vérifiés)
              </span>
            </div>

            {/* Prix */}
            <div className="product-modal-price-row">
              <span className="product-modal-price">
                {product.price} <span className="product-currency">DT</span>
              </span>
              {product.comparePrice > product.price && (
                <span className="product-modal-old-price">{product.comparePrice} DT</span>
              )}
              {product.stockCount > 0 ? (
                <span className="product-stock-pill in-stock">
                  <span className="stock-dot"></span> En stock ({product.stockCount} dispo)
                </span>
              ) : (
                <span className="product-stock-pill out-of-stock">
                  Rupture temporaire
                </span>
              )}
            </div>

            {/* Description détaillée */}
            <div className="product-modal-desc">
              {product.description}
            </div>

            {/* Sélecteur de Taille */}
            {Array.isArray(product.sizes) && product.sizes.length > 0 && (
              <div style={{ marginBottom: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>
                    Taille sélectionnée : <strong style={{ color: 'var(--red-primary)' }}>{selectedSize}</strong>
                  </span>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Guide des tailles disponible</span>
                </div>
                <div className="product-size-selector-grid">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`product-size-btn ${selectedSize === s ? 'active' : ''}`}
                      onClick={() => setSelectedSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantité & Ajout au panier */}
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              {/* Stepper de quantité */}
              <div className="product-qty-stepper">
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="qty-value">{quantity}</span>
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => setQuantity(Math.min(product.stockCount || 10, quantity + 1))}
                  disabled={quantity >= (product.stockCount || 10)}
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className={`btn-add-to-cart ${addedSuccess ? 'added-success' : ''}`}
                style={{ flex: 1, padding: '14px 20px', fontSize: '14px' }}
                onClick={handleAddToCart}
                disabled={product.stockCount === 0}
              >
                {product.stockCount === 0 ? (
                  'Produit en Rupture'
                ) : addedSuccess ? (
                  <>
                    <Check size={18} /> Ajouté au panier ({quantity}x {selectedSize}) !
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} /> Ajouter au Panier • {(product.price * quantity).toFixed(2)} DT
                  </>
                )}
              </button>
            </div>

            {/* Engagements confiance */}
            <div className="product-modal-guarantees">
              <div className="guarantee-item">
                <Truck size={16} color="var(--red-primary)" />
                <span>Livraison partout en Tunisie (24-48h)</span>
              </div>
              <div className="guarantee-item">
                <ShieldCheck size={16} color="var(--red-primary)" />
                <span>Paiement à la livraison ou en ligne 100% sécurisé</span>
              </div>
              <div className="guarantee-item">
                <RotateCcw size={16} color="var(--red-primary)" />
                <span>Échange de taille garanti sous 14 jours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
