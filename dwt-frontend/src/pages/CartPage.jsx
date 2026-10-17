import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import API from '../services/api';
import { getImageUrl } from '../utils/imageUrl';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, clearCart, itemsPrice, shippingPrice, totalPrice } = useCart();
  const { user } = useAuth();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.gamertag || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: 'Tunis',
    postalCode: '1000',
    country: 'Tunisie'
  });

  const [loading, setLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const orderPayload = {
        orderItems: cartItems.map(item => ({
          product: item.product,
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          size: item.size
        })),
        shippingAddress,
        itemsPrice,
        shippingPrice,
        totalPrice,
        paymentMethod: 'Paiement à la livraison / En ligne'
      };

      const res = await API.post('/orders', orderPayload);
      if (res.data.success) {
        setSuccessOrder(res.data.order);
        clearCart();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Erreur lors de la validation de la commande');
    } finally {
      setLoading(false);
    }
  };

  if (successOrder) {
    return (
      <div className="section-container" style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <CheckCircle2 size={64} color="#4ade80" style={{ marginBottom: '20px' }} />
        <h1 className="section-title">Commande Confirmée ! 🐺</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', marginBottom: '24px' }}>
          Merci pour votre achat ! Votre commande #{successOrder._id.slice(-8).toUpperCase()} a été enregistrée avec succès. Un e-mail récapitulatif a été envoyé à <strong>{successOrder.shippingAddress.email}</strong>.
        </p>
        <Link to="/" className="btn-red-primary">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="section-container" style={{ minHeight: '60vh', textAlign: 'center', padding: '100px 24px' }}>
        <h2 className="section-title">Votre Panier est vide</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
          Découvrez les maillots et équipements officiels de la Dark Wolf Team.
        </p>
        <Link to="/#boutique" className="btn-red-primary">
          Découvrir la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="section-container" style={{ padding: '60px 24px' }}>
      <h1 className="section-title" style={{ textAlign: 'center', marginBottom: '32px' }}>
        Votre Panier ({cartItems.length} article{cartItems.length > 1 ? 's' : ''})
      </h1>

      {errorMsg && (
        <div style={{ padding: '12px', background: 'rgba(230,0,0,0.15)', border: '1px solid var(--red-primary)', color: '#ff6666', borderRadius: '6px', marginBottom: '20px' }}>
          {errorMsg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '40px' }}>
        {/* Left: Cart Items List */}
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {cartItems.map((item) => (
              <div
                key={item.product + item.size}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-dark)',
                  borderRadius: '10px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    style={{ width: '70px', height: '70px', objectFit: 'cover', background: '#0b0d14', borderRadius: '6px' }}
                  />
                  <div>
                    <h3 style={{ color: '#fff', fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>
                      {item.name}
                    </h3>
                    <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                      Taille: {item.size} | Qté: {item.qty}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: '800', color: 'var(--red-primary)' }}>
                    {(item.price * item.qty).toFixed(2)} DT
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product, item.size)}
                    style={{ background: 'transparent', color: 'var(--text-muted)', padding: '6px' }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Shipping Address & Order Summary */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-dark)', borderRadius: '12px', padding: '28px' }}>
          <h2 style={{ color: '#fff', fontSize: '18px', fontFamily: 'var(--font-display)', marginBottom: '20px' }}>
            Détails de Livraison
          </h2>

          <form onSubmit={handleCheckout}>
            <div style={{ marginBottom: '14px' }}>
              <label className="auth-input-label">Nom et Prénom *</label>
              <input
                type="text"
                name="fullName"
                value={shippingAddress.fullName}
                onChange={handleChange}
                placeholder="Votre nom complet"
                className="auth-text-input"
                style={{ paddingLeft: '14px' }}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label className="auth-input-label">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={shippingAddress.email}
                  onChange={handleChange}
                  placeholder="votre@email.com"
                  className="auth-text-input"
                  style={{ paddingLeft: '14px' }}
                  required
                />
              </div>
              <div>
                <label className="auth-input-label">Téléphone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={shippingAddress.phone}
                  onChange={handleChange}
                  placeholder="+216 ..."
                  className="auth-text-input"
                  style={{ paddingLeft: '14px' }}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label className="auth-input-label">Adresse de livraison *</label>
              <input
                type="text"
                name="address"
                value={shippingAddress.address}
                onChange={handleChange}
                placeholder="Rue, N° de maison..."
                className="auth-text-input"
                style={{ paddingLeft: '14px' }}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
              <div>
                <label className="auth-input-label">Ville *</label>
                <input
                  type="text"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleChange}
                  placeholder="Tunis, Sousse, Sfax..."
                  className="auth-text-input"
                  style={{ paddingLeft: '14px' }}
                  required
                />
              </div>
              <div>
                <label className="auth-input-label">Code Postal</label>
                <input
                  type="text"
                  name="postalCode"
                  value={shippingAddress.postalCode}
                  onChange={handleChange}
                  placeholder="1000"
                  className="auth-text-input"
                  style={{ paddingLeft: '14px' }}
                />
              </div>
            </div>

            {/* Price breakdown */}
            <div style={{ borderTop: '1px solid var(--border-dark)', paddingTop: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '14px' }}>
                <span>Sous-total</span>
                <span>{itemsPrice.toFixed(2)} DT</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '14px' }}>
                <span>Livraison partout en Tunisie</span>
                <span>{shippingPrice === 0 ? 'GRATUITE' : `${shippingPrice.toFixed(2)} DT`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontSize: '19px', fontWeight: '800', fontFamily: 'var(--font-display)', borderTop: '1px solid var(--border-dark)', paddingTop: '12px' }}>
                <span>TOTAL</span>
                <span style={{ color: 'var(--red-primary)' }}>{totalPrice.toFixed(2)} DT</span>
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Traitement en cours...' : 'Confirmer la commande'} <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
