import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../utils/imageUrl';
import { Check, ChevronLeft, ChevronRight, ShoppingBag, Eye } from 'lucide-react';

const defaultColors = ['#e0e0e0', '#2a2a2a', '#2a2a4e'];

const ProductDetailModal = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('#2a2a2a');
  const [activeThumb, setActiveThumb] = useState(0);
  const [addedToast, setAddedToast] = useState(false);

  useEffect(() => {
    setActiveThumb(0);
    setAddedToast(false);
  }, [product]);

  if (!isOpen || !product) return null;

  // Collect all photos belonging to the product
  const rawImages = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.image].filter(Boolean);

  const imagesList = rawImages.length > 0
    ? rawImages
    : ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80'];

  const sizes = product.sizes && product.sizes.length ? product.sizes : ['XS', 'S', 'M', 'L', 'XL', '2XL'];
  const hasSale = product.comparePrice && product.comparePrice > product.price;

  const handleAdd = () => {
    addToCart(product, selectedSize, 1);
    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
      onClose();
    }, 900);
  };

  const currentImg = imagesList[activeThumb] || imagesList[0];
  const fullImgUrl = getImageUrl(currentImg);

  return (
    <div className={`pdpage ${isOpen ? 'open' : ''}`} id="pdpage">
      <button className="pdback" onClick={onClose} aria-label="Retour à la boutique">
        <ChevronLeft size={16} />
        <span>Retour à la Boutique</span>
      </button>

      <div className="pdinner" id="pdinner">
        {/* Gallery Column */}
        <div className="pdgallery" style={{ display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0, overflow: 'hidden' }}>
          {/* Main Large Image Display */}
          <div
            className="pdmainimg"
            id="pdmain"
            style={{
              flex: 1,
              width: '100%',
              minHeight: 0,
              backgroundImage: `url(${fullImgUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: '#0a0a0c',
              position: 'relative',
              transition: 'background-image 0.3s ease-in-out',
            }}
          >
            {imagesList.length > 1 && (
              <>
                {/* Previous Image Chevron */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveThumb((prev) => (prev > 0 ? prev - 1 : imagesList.length - 1));
                  }}
                  style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(0, 0, 0, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    zIndex: 2,
                  }}
                  aria-label="Image précédente"
                >
                  <ChevronLeft size={22} />
                </button>

                {/* Next Image Chevron */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveThumb((prev) => (prev < imagesList.length - 1 ? prev + 1 : 0));
                  }}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(0, 0, 0, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    zIndex: 2,
                  }}
                  aria-label="Image suivante"
                >
                  <ChevronRight size={22} />
                </button>

                <span
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    right: '16px',
                    background: 'rgba(0, 0, 0, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: '800',
                    padding: '5px 12px',
                    borderRadius: '12px',
                    fontFamily: '"Orbitron", monospace',
                    letterSpacing: '0.08em',
                    zIndex: 2,
                  }}
                >
                  {activeThumb + 1} / {imagesList.length}
                </span>
              </>
            )}
          </div>

          {/* Clickable Image Thumbnails Gallery */}
          {imagesList.length > 1 && (
            <div
              className="pdthumbs"
              style={{
                display: 'flex',
                gap: '12px',
                padding: '14px 18px 18px',
                background: 'rgba(10, 10, 14, 0.98)',
                borderTop: '1px solid rgba(255, 255, 255, 0.12)',
                boxSizing: 'border-box',
                alignItems: 'center',
                height: 'auto',
                minHeight: '130px',
              }}
            >
              {imagesList.map((img, tIdx) => {
                const thumbUrl = getImageUrl(img);
                const isAct = activeThumb === tIdx;

                return (
                  <div
                    key={tIdx}
                    className={`pdthumb ${isAct ? 'act' : ''}`}
                    style={{
                      flex: 1,
                      height: '105px',
                      borderRadius: '10px',
                      backgroundImage: `url(${thumbUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      cursor: 'pointer',
                      border: isAct ? '2px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.18)',
                      boxShadow: isAct ? '0 0 14px rgba(255, 255, 255, 0.4)' : 'none',
                      opacity: isAct ? 1 : 0.65,
                      transform: isAct ? 'translateY(-2px)' : 'none',
                      transition: 'all 0.25s ease',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                    onClick={() => setActiveThumb(tIdx)}
                    title={`Photo ${tIdx + 1}`}
                  ></div>
                );
              })}
            </div>
          )}
        </div>

        {/* Product Details Column */}
        <div className="pddetails">
          <div className="pdcat">{product.category || 'Dark Lab'}</div>
          <h1 className="pdname">{product.name}</h1>
          <div className="pdprice">
            TND {product.price}
            {hasSale && <span className="pdold">TND {product.comparePrice}</span>}
          </div>
          <p className="pddesc">{product.description}</p>

          <div className="pdlbl">Tailles Disponibles</div>
          <div className="sizes">
            {sizes.map((s) => (
              <button
                key={s}
                className={`szb ${selectedSize === s ? 'act' : ''}`}
                onClick={() => setSelectedSize(s)}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="pdlbl">Édition / Teinte</div>
          <div className="colors">
            {defaultColors.map((c) => (
              <div
                key={c}
                className={`clr ${selectedColor === c ? 'act' : ''}`}
                style={{ background: c }}
                onClick={() => setSelectedColor(c)}
              ></div>
            ))}
          </div>

          <div className="pdbtns">
            <button
              className="bpd"
              onClick={handleAdd}
              style={{
                background: addedToast ? '#22c55e' : undefined,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {addedToast ? <Check size={18} /> : <ShoppingBag size={18} />}
              <span>{addedToast ? 'Ajouté au Panier ! 🐺' : 'Ajouter au Panier'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
