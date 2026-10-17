import React, { useState } from 'react';
import { ShoppingCart, Check, Eye, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../utils/imageUrl';

const ProductCard = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(() => {
    if (Array.isArray(product?.sizes) && product.sizes.length > 0) {
      return product.sizes[0];
    }
    return 'M';
  });
  const [addedItem, setAddedItem] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, selectedSize, 1);
    setAddedItem(true);
    setTimeout(() => setAddedItem(false), 2000);
  };

  const discountPercent = product.comparePrice > product.price
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const mainImage = product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80';

  return (
    <div 
      className="product-shop-card"
      onClick={() => onQuickView && onQuickView(product)}
      style={{ cursor: 'pointer' }}
    >
      {/* Boîte Image avec Badges & Bouton Quick View */}
      <div className="product-img-box">
        <img 
          src={getImageUrl(mainImage)} 
          alt={product.name} 
          loading="lazy"
        />

        {/* Badge Catégorie haut-gauche */}
        <span className="product-badge-category">
          {product.category || 'Merch'}
        </span>

        {/* Badges statut & promotion haut-droite */}
        {discountPercent > 0 ? (
          <span className="product-badge-discount">
            -{discountPercent}%
          </span>
        ) : product.stockCount <= 5 && product.stockCount > 0 ? (
          <span className="product-badge-stock-low">
            Plus que {product.stockCount} en stock
          </span>
        ) : product.stockCount === 0 ? (
          <span className="product-badge-stock-out">
            Rupture
          </span>
        ) : null}

        {/* Overlay avec bouton Aperçu Rapide */}
        <div className="product-card-hover-overlay">
          <button 
            type="button" 
            className="product-quick-btn"
            title="Aperçu rapide du produit"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView && onQuickView(product);
            }}
          >
            <Eye size={16} />
            <span>Aperçu Rapide</span>
          </button>
        </div>
      </div>

      {/* Contenu & Informations du Produit */}
      <div className="product-info-box">
        {/* Note / Avis */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#fbbf24' }}>
            <Star size={13} fill="#fbbf24" color="#fbbf24" />
            <span style={{ fontSize: '12px', fontWeight: '800', color: '#e2e8f0', marginLeft: '2px' }}>
              {product.rating ? Number(product.rating).toFixed(1) : '5.0'}
            </span>
            <span style={{ fontSize: '11px', color: '#64748b' }}>
              ({product.numReviews || 12})
            </span>
          </div>

          {product.stockCount > 0 ? (
            <span style={{ fontSize: '11px', color: '#4ade80', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', display: 'inline-block' }}></span>
              En stock
            </span>
          ) : (
            <span style={{ fontSize: '11px', color: '#f87171', fontWeight: '700' }}>
              Épuisé
            </span>
          )}
        </div>

        {/* Titre du Produit */}
        <h3 className="product-item-title" title={product.name}>
          {product.name}
        </h3>

        {/* Sélecteur de Tailles directement sur la carte */}
        {Array.isArray(product.sizes) && product.sizes.length > 0 && (
          <div className="product-card-sizes" onClick={(e) => e.stopPropagation()}>
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                className={`product-card-size-pill ${selectedSize === s ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSize(s);
                }}
                title={`Choisir la taille ${s}`}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Rangée Prix */}
        <div className="product-price-row">
          <div className="product-current-price">
            {product.price} <span className="product-currency">DT</span>
          </div>
          {product.comparePrice > product.price && (
            <span className="product-old-price">{product.comparePrice} DT</span>
          )}
        </div>

        {/* Boutons d'action */}
        <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
          <button
            type="button"
            className="product-btn-view"
            title="Voir tous les détails"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView && onQuickView(product);
            }}
          >
            <Eye size={15} />
          </button>

          <button 
            type="button"
            className={`btn-add-to-cart ${addedItem ? 'added-success' : ''}`}
            onClick={handleAddToCart}
            disabled={product.stockCount === 0}
            style={{ flex: 1 }}
          >
            {product.stockCount === 0 ? (
              'Rupture de Stock'
            ) : addedItem ? (
              <>
                <Check size={16} /> Ajouté ({selectedSize}) !
              </>
            ) : (
              <>
                <ShoppingCart size={16} /> Ajouter ({selectedSize})
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
