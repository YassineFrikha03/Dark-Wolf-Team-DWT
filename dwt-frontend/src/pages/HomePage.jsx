import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../sections/HeroSection';
import { 
  Flame, 
  ShoppingBag, 
  Trophy, 
  Users, 
  ShieldCheck, 
  ArrowRight, 
  ChevronRight, 
  Sparkles,
  Calendar,
  Send,
  Check
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import API from '../services/api';
import { getImageUrl } from '../utils/imageUrl';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';

const HomePage = () => {
  const { addToCart } = useCart();
  const [news, setNews] = useState([]);
  const [products, setProducts] = useState([]);
  const [matches, setMatches] = useState([]);
  const [addedItem, setAddedItem] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Valeurs par défaut officielles Dark Wolf Team
  const defaultNews = [
    {
      _id: 'n1',
      category: 'TOURNOI',
      title: 'DARK WOLF remporte le tournoi CS2 Tunisia Cup !',
      summary: 'Une finale d\'anthologie 3-0 marquée par les exploits de Dubby et Mahdi devant plus de 20 000 spectateurs en direct.',
      date: '10 Oct 2026',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80'
    },
    {
      _id: 'n2',
      category: 'ACTUALITÉ',
      title: 'Nouveau maillot officiel 2026 disponible !',
      summary: 'Découvrez la nouvelle collection de compétition avec tissu aéré haute performance et le nouveau loup brodé.',
      date: '05 Oct 2026',
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80'
    },
    {
      _id: 'n3',
      category: 'VALORANT',
      title: 'Analyse tactique du choc contre Rage Gaming',
      summary: 'Retour détaillé sur les rounds clés, les prises d\'info et la clutch attitude de notre roster Valorant.',
      date: '28 Sep 2026',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80'
    }
  ];

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [newsRes, productsRes, matchesRes] = await Promise.all([
          API.get('/news').catch(() => null),
          API.get('/products').catch(() => null),
          API.get('/matches?status=upcoming').catch(() => null)
        ]);

        if (newsRes?.data?.articles?.length > 0) {
          setNews(newsRes.data.articles.slice(0, 3));
        } else {
          setNews(defaultNews);
        }

        if (productsRes?.data?.products?.length > 0) {
          setProducts(productsRes.data.products.slice(0, 4));
        } else {
          setProducts([]);
        }

        if (matchesRes?.data?.matches?.length > 0) {
          setMatches(matchesRes.data.matches.slice(0, 2));
        }
      } catch {
        setNews(defaultNews);
        setProducts([]);
      }
    };
    fetchHomeData();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedItem(product._id);
    setTimeout(() => setAddedItem(null), 1800);
  };

  return (
    <div style={{ minHeight: 'calc(100vh - var(--header-height))' }}>
      
      {/* 1. Grand Hero Banner Officiel (MORE THAN A TEAM / A MINDSET) */}
      <HeroSection />

      {/* 2. Conteneur des Scoops & Nouveautés */}
      <div className="home-scoops-wrapper">

        {/* SCOOP 1 : LES DERNIÈRES ACTUALITÉS DE LA MEUTE */}
        <section className="scoop-block">
          <div className="scoop-block-header">
            <div>
              <div className="scoop-tag-pill">
                <Flame size={16} /> Scoops & Actualités
              </div>
              <h2 className="scoop-main-title">À LA UNE DU CLUB</h2>
            </div>
            <Link to="/actualites" className="scoop-view-all-link">
              Toutes les actualités <ChevronRight size={16} />
            </Link>
          </div>

          <div className="scoop-news-grid">
            {news.map((item) => {
              const articleLink = `/actualites/${item.slug || item._id}`;
              return (
                <article className="scoop-news-card" key={item._id}>
                  <Link to={articleLink} className="scoop-news-img-box">
                    <img 
                      src={getImageUrl(item.coverImage || item.image)} 
                      alt={item.title} 
                      loading="lazy" 
                    />
                    <span className="scoop-news-badge">{item.category}</span>
                  </Link>
                  <div className="scoop-news-body">
                    <h3 className="scoop-news-title">
                      <Link to={articleLink} style={{ color: 'inherit' }}>
                        {item.title}
                      </Link>
                    </h3>
                    <p className="scoop-news-summary">{item.summary}</p>
                    <div className="scoop-news-footer">
                      <span>
                        {item.createdAt 
                          ? new Date(item.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
                          : item.date}
                      </span>
                      <Link to={articleLink} style={{ color: 'var(--red-primary)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Lire le scoop <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* SCOOP 2 : NOUVEAUTÉS DE LA BOUTIQUE (MERCH OFFICIEL) */}
        {products.length > 0 && (
          <section className="scoop-block">
            <div className="scoop-block-header">
              <div>
                <div className="scoop-tag-pill">
                  <Sparkles size={16} /> Merch Exclusif
                </div>
                <h2 className="scoop-main-title">SCOOP BOUTIQUE DWT</h2>
              </div>
              <Link to="/boutique" className="scoop-view-all-link">
                Explorer le Store ({products.length} articles) <ChevronRight size={16} />
              </Link>
            </div>

            <div className="scoop-shop-grid">
              {products.slice(0, 4).map((prod) => (
                <ProductCard
                  key={prod._id}
                  product={prod}
                  onQuickView={setQuickViewProduct}
                />
              ))}
            </div>

            <ProductDetailModal
              product={quickViewProduct}
              isOpen={!!quickViewProduct}
              onClose={() => setQuickViewProduct(null)}
            />
          </section>
        )}

        {/* SCOOP 3 : NOUVEAUTÉS ET ACCÈS DIRECT AUX ESPACES DU SITE */}
        <section className="scoop-block">
          <div className="scoop-block-header">
            <div>
              <div className="scoop-tag-pill">
                <Sparkles size={16} /> Découvrir l'univers DWT
              </div>
              <h2 className="scoop-main-title">EXPLORER CHAQUE SECTION</h2>
            </div>
          </div>

          <div className="scoop-parts-nav-grid">
            {/* Carte Équipe */}
            <Link to="/equipe" className="scoop-nav-card">
              <div className="scoop-nav-icon-wrap">
                <Users size={26} />
              </div>
              <div className="scoop-nav-title">Rosters & Joueurs</div>
              <p className="scoop-nav-desc">
                Découvrez nos champions sur Valorant, CS2, League of Legends et FC26.
              </p>
              <div className="scoop-nav-cta">
                Voir l'équipe <ArrowRight size={14} />
              </div>
            </Link>

            {/* Carte Tournois */}
            <Link to="/tournois" className="scoop-nav-card">
              <div className="scoop-nav-icon-wrap">
                <Trophy size={26} />
              </div>
              <div className="scoop-nav-title">Tournois & Matchs</div>
              <p className="scoop-nav-desc">
                Suivez en direct nos matchs de compétition, scores et dates d'affrontements.
              </p>
              <div className="scoop-nav-cta">
                Voir les matchs <ArrowRight size={14} />
              </div>
            </Link>

            {/* Carte Recrutement */}
            <Link to="/contact" className="scoop-nav-card">
              <div className="scoop-nav-icon-wrap">
                <Send size={26} />
              </div>
              <div className="scoop-nav-title">Recrutement Ouvert</div>
              <p className="scoop-nav-desc">
                Postulez pour passer les tryouts officiels et porter les couleurs de la meute.
              </p>
              <div className="scoop-nav-cta">
                Rejoindre la meute <ArrowRight size={14} />
              </div>
            </Link>

            {/* Carte Espace Membres */}
            <Link to="/espace-joueur" className="scoop-nav-card">
              <div className="scoop-nav-icon-wrap">
                <ShieldCheck size={26} />
              </div>
              <div className="scoop-nav-title">Espace Joueur</div>
              <p className="scoop-nav-desc">
                Suivez vos performances, vos commandes d'inventaire et vos défis du jour.
              </p>
              <div className="scoop-nav-cta">
                Accéder à l'espace <ArrowRight size={14} />
              </div>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
};

export default HomePage;
