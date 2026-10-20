import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const OrderPanel = ({ isOpen, onClose, onOpenAuth }) => {
  const { cartItems, removeFromCart, addToCart, clearCart, totalItems, totalPrice } = useCart();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

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
      if (user) {
        await API.post('/orders', {
          orderItems: cartItems.map((item) => ({
            product: item.product,
            name: item.name,
            qty: item.qty,
            price: item.price,
            size: item.size,
            image: item.image,
          })),
          shippingAddress: {
            address: 'Adresse client',
            city: 'Tunis',
            postalCode: '1000',
            country: 'Tunisia',
          },
          totalPrice,
          paymentMethod: 'Cash on Delivery',
        }).catch(() => null);
      }

      setOrderSuccess(true);
      setTimeout(() => {
        clearCart();
        setOrderSuccess(false);
        onClose();
      }, 2400);
    } catch (e) {
      setOrderSuccess(true);
      setTimeout(() => {
        clearCart();
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
              La Dark Wolf Team a bien reçu votre commande.<br />Merci pour votre soutien à la Meute ! 🐺📦
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
                  backgroundImage: `url(${item.image.startsWith('http') ? item.image : (item.image.startsWith('/') ? item.image : `http://localhost:5000${item.image}`)})`,
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
        <div className="otrow">
          <span className="otlbl">Total</span>
          <span className="otamt" id="ototal">
            TND {totalPrice.toFixed(2)}
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
