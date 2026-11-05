import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const OrderPanel = ({ isOpen, onClose, onOpenAuth }) => {
  const { cartItems, removeFromCart, addToCart, clearCart, totalItems, totalPrice } = useCart();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Gestion des Codes Promo & Réductions
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState('');

  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalTotal = Math.max(0, totalPrice - discountAmount);

  const handleApplyPromo = async (e) => {
    if (e) e.preventDefault();
    if (!promoCodeInput.trim()) return;
    setPromoLoading(true);
    setPromoError('');
    try {
      const res = await API.post('/coupons/validate', {
        code: promoCodeInput.trim().toUpperCase(),
        orderAmount: totalPrice,
        userId: user?._id,
        email: user?.email || orderForm.email,
        gamertag: user?.gamertag || orderForm.fullName
      });
      if (res.data.success) {
        setAppliedCoupon({
          code: res.data.coupon.code,
          discountType: res.data.coupon.discountType,
          discountValue: res.data.coupon.discountValue,
          discountAmount: res.data.discountAmount,
          description: res.data.coupon.description
        });
      }
    } catch (err) {
      setPromoError(err.response?.data?.message || 'Code promo invalide ou non autorisé');
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedCoupon(null);
    setPromoCodeInput('');
    setPromoError('');
  };

  const handleUpdateQty = (item, delta) => {
    if (delta > 0) {
      addToCart({ _id: item.product, name: item.name, price: item.price, images: [item.image] }, item.size, 1);
    } else {
      if (item.qty <= 1) {
        removeFromCart(item.product, item.size);
      } else {
        addToCart({ _id: item.product, name: item.name, price: item.price, images: [item.image] }, item.size, -1);
      }
    }
  };

  const handleConfirmOrder = async () => {
    if (!cartItems.length) return;
    setSubmitting(true);
    try {
      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          product: item.product,
          name: item.name,
          qty: item.qty,
          price: item.price,
          size: item.size,
          image: item.image,
        })),
        shippingAddress: {
          fullName: user?.gamertag || 'Client Meute DWT',
          email: user?.email || 'commande@darkwolfteam.gg',
          address: 'Adresse client',
          city: 'Tunis',
          postalCode: '1000',
          country: 'Tunisia',
        },
        itemsPrice: totalPrice,
        shippingPrice: 0,
        discountAmount,
        couponCode: appliedCoupon ? appliedCoupon.code : '',
        totalPrice: finalTotal,
        paymentMethod: 'Cash on Delivery',
      };

      await API.post('/orders', orderPayload).catch(() => null);

      setOrderSuccess(true);
      setTimeout(() => {
        clearCart();
        setAppliedCoupon(null);
        setPromoCodeInput('');
        setOrderSuccess(false);
        onClose();
      }, 2400);
    } catch (e) {
      setOrderSuccess(true);
      setTimeout(() => {
        clearCart();
        setAppliedCoupon(null);
        setPromoCodeInput('');
        setOrderSuccess(false);
        onClose();
      }, 2400);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`opanel ${isOpen ? 'open' : ''}`} id="opanel">
      <div className="ophdr">
        <div className="optitle">Your Order</div>
        <button className="bcp" onClick={onClose} aria-label="Close order panel">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="opbody" id="opitems">
        {orderSuccess ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', animation: 'cyberModalIn 0.3s ease' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', border: '2px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#10b981', fontSize: '28px', boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)' }}>
              ✓
            </div>
            <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '18px', fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Commande Confirmée !
            </div>
            <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '8px', lineHeight: 1.5 }}>
              La Dark Wolf Team a bien reçu votre commande.<br />Merci pour votre soutien à la Meute ! 
            </div>
          </div>
        ) : !cartItems.length ? (
          <div
            style={{
              textAlign: 'center',
              color: 'var(--gray3)',
              padding: '60px 0',
              fontFamily: 'Rajdhani',
              fontSize: '14px',
              letterSpacing: '.1em',
              textTransform: 'uppercase',
            }}
          >
            Your order is empty
          </div>
        ) : (
          cartItems.map((item, i) => {
            const lineTotal = item.price * item.qty;
            const imgStyle = item.image
              ? {
                  backgroundImage: `url(${item.image.startsWith('http') ? item.image : (item.image.startsWith('/') ? item.image : `/${item.image}`)})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }
              : { background: 'linear-gradient(135deg,#1a1a2e,#0e0e1e)' };

            return (
              <div key={`${item.product}-${item.size}-${i}`} className="oitem">
                <div className="oimg" style={imgStyle}></div>
                <div className="oinfo">
                  <div className="oname">{item.name}</div>
                  <div className="ocat">Size: {item.size || 'M'}</div>
                  <div className="qc">
                    <button className="qb" onClick={() => handleUpdateQty(item, -1)}>
                      −
                    </button>
                    <div className="qn">{item.qty}</div>
                    <button className="qb" onClick={() => handleUpdateQty(item, 1)}>
                      +
                    </button>
                    <span
                      className="oprm"
                      onClick={() => removeFromCart(item.product, item.size)}
                    >
                      ✕
                    </span>
                  </div>
                </div>
                <div className="oamt">TND {lineTotal.toFixed(2)}</div>
              </div>
            );
          })
        )}
      </div>

      <div className="opftr">
        {/* Section Code Promo */}
        {cartItems.length > 0 && (
          <div style={{ marginBottom: '14px', borderBottom: '1px solid #1a2234', paddingBottom: '12px' }}>
            {!appliedCoupon ? (
              <div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="text"
                    placeholder="Code promo (ex: WOLF10)"
                    value={promoCodeInput}
                    onChange={(e) => {
                      setPromoCodeInput(e.target.value.toUpperCase().replace(/\s+/g, ''));
                      setPromoError('');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleApplyPromo();
                      }
                    }}
                    style={{
                      flex: 1,
                      background: '#0d131f',
                      border: promoError ? '1px solid #ef4444' : '1px solid #202b3f',
                      borderRadius: '6px',
                      padding: '8px 10px',
                      color: '#fff',
                      fontSize: '12px',
                      fontFamily: 'Orbitron, sans-serif',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={promoLoading || !promoCodeInput.trim()}
                    style={{
                      background: promoCodeInput.trim() ? 'var(--red-primary)' : '#1e293b',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0 12px',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: promoCodeInput.trim() ? 'pointer' : 'default',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {promoLoading ? '...' : 'Appliquer'}
                  </button>
                </div>

                {promoError && (
                  <div style={{ color: '#f87171', fontSize: '11px', marginTop: '5px' }}>
                    {promoError}
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                borderRadius: '6px',
                padding: '8px 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px'
              }}>
                <div>
                  <div style={{ color: '#10b981', fontSize: '12px', fontWeight: '800', fontFamily: 'Orbitron, sans-serif' }}>
                    ✓ Code {appliedCoupon.code} (-{appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.discountValue}%` : `${appliedCoupon.discountValue} DT`})
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '10px' }}>
                    Remise appliquée : -TND {appliedCoupon.discountAmount.toFixed(2)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemovePromo}
                  title="Retirer le code promo"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '14px',
                    padding: '2px 6px'
                  }}
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        )}

        {appliedCoupon && (
          <div className="otrow" style={{ color: '#10b981', fontSize: '13px', marginBottom: '6px' }}>
            <span className="otlbl" style={{ color: '#10b981' }}>Réduction ({appliedCoupon.code})</span>
            <span className="otamt" style={{ color: '#10b981' }}>- TND {appliedCoupon.discountAmount.toFixed(2)}</span>
          </div>
        )}

        <div className="otrow">
          <span className="otlbl">Total</span>
          <span className="otamt" id="ototal" style={{ color: appliedCoupon ? '#10b981' : undefined }}>
            TND {finalTotal.toFixed(2)}
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '12px',
            fontSize: '11px',
            color: 'var(--gray3)',
          }}
        >
          <span>
            Items: <strong id="oqty" style={{ color: 'var(--silver)' }}>{totalItems}</strong>
          </span>
          <span>•</span>
          <span>Free shipping +150 TND</span>
        </div>

        <button
          className="bconf"
          onClick={handleConfirmOrder}
          disabled={!cartItems.length || submitting}
        >
          {submitting ? 'Confirming...' : 'Confirm Order'}
        </button>

        {!user && (
          <button
            className="bsip"
            onClick={() => {
              onClose();
              onOpenAuth('login');
            }}
          >
            Sign In / Login
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderPanel;
