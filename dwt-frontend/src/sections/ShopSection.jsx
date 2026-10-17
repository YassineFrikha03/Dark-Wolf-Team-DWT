import React, { useState, useEffect } from 'react';
import { ShieldCheck, Truck, Headphones, Sparkles } from 'lucide-react';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';

const ShopSection = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [loadingShop, setLoadingShop] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    const fetchShopData = async () => {
      setLoadingShop(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          API.get('/products'),
          API.get('/categories').catch(() => ({ data: { categories: [] } }))
        ]);

        if (prodRes.data?.success) {
          setProducts(prodRes.data.products || []);
        }
        if (catRes.data?.categories) {
          setCategories(catRes.data.categories);
        }
      } catch (err) {
        console.error('Erreur chargement boutique:', err);
      } finally {
        setLoadingShop(false);
      }
    };
    fetchShopData();
  }, []);

  const filteredProducts = selectedCategory === 'Toutes'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <section className="shop-section" id="boutique" style={{ minHeight: '85vh', padding: '60px 0 90px' }}>
      <div className="section-container">
        {/* En-tête de la boutique */}
        <div className="section-header" style={{ marginBottom: '36px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '20px', background: 'rgba(230,0,0,0.1)', border: '1px solid rgba(230,0,0,0.3)', color: 'var(--red-primary)', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '12px' }}>
            <Sparkles size={14} /> Store Officiel Dark Wolf Team
          </div>
          <h2 className="section-title">BOUTIQUE OFFICIELLE</h2>
          <p className="section-subtitle">
            Équipez-vous avec les tenues, maillots de compétition et accessoires officiels de la meute.
          </p>
        </div>

        {/* Filtres de catégories de la boutique */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '38px' }}>
          <button
            className={`dash-subtab-btn ${selectedCategory === 'Toutes' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('Toutes')}
            style={{ padding: '8px 20px', fontSize: '13px' }}
          >
            Tous les Produits ({products.length})
          </button>
          {categories.map(cat => {
            const count = products.filter(p => p.category === cat.name).length;
            return (
              <button
                key={cat._id}
                className={`dash-subtab-btn ${selectedCategory === cat.name ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.name)}
                style={{ padding: '8px 20px', fontSize: '13px' }}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Grille des Cartes Produits */}
        {loadingShop ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
            <div className="animate-spin" style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid #1e2436', borderTopColor: 'var(--red-primary)', borderRadius: '50%', marginBottom: '16px' }}></div>
            <div>Chargement des cartes produits de la boutique...</div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{
            background: '#0d1017',
            border: '1px solid #1c2233',
            borderRadius: '12px',
            padding: '50px 24px',
            textAlign: 'center',
            maxWidth: '680px',
            margin: '0 auto 40px'
          }}>
            <h3 style={{ color: '#fff', fontSize: '20px', fontWeight: '800', marginBottom: '10px' }}>
              Aucun produit dans cette catégorie pour le moment 🐺🛍️
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6' }}>
              Les nouveaux maillots et équipements sont en cours de réapprovisionnement.
            </p>
          </div>
        ) : (
          <div className="shop-grid">
            {filteredProducts.map((prod) => (
              <ProductCard
                key={prod._id}
                product={prod}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        )}

        {/* Modal d'aperçu rapide & détails du produit */}
        <ProductDetailModal
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />

        {/* Trust Badges de réassurance */}
        <div className="shop-trust-badges">
          <div className="trust-badge-item">
            <ShieldCheck size={20} color="var(--red-primary)" />
            <span>Paiement sécurisé à la livraison & en ligne</span>
          </div>
          <div className="trust-badge-item">
            <Truck size={20} color="var(--red-primary)" />
            <span>Livraison express 24-48h partout en Tunisie</span>
          </div>
          <div className="trust-badge-item">
            <Headphones size={20} color="var(--red-primary)" />
            <span>Support client DWT 7j/7</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopSection;
