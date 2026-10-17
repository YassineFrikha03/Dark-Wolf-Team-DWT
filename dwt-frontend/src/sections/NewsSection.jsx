import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  ChevronRight, 
  Calendar, 
  User, 
  Eye, 
  Heart, 
  Flame, 
  Sparkles, 
  Search, 
  X, 
  Clock, 
  Trophy, 
  Megaphone, 
  UserPlus, 
  RefreshCw,
  SlidersHorizontal,
  Bookmark
} from 'lucide-react';
import API from '../services/api';
import { getImageUrl } from '../utils/imageUrl';
import { DEFAULT_ARTICLES, calculateReadTime } from '../data/newsData';

const NewsSection = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = ['Toutes', 'Tournoi', 'Esport', 'Annonce', 'Recrutement', 'Mise à jour'];

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const res = await API.get('/news');
        if (res.data?.success && res.data.articles?.length > 0) {
          // Fusionner avec DEFAULT_ARTICLES pour enrichir les métadonnées (highlights, quote, etc.)
          const enrichedList = res.data.articles.map(art => {
            const match = DEFAULT_ARTICLES.find(d => d.slug === art.slug || d.title === art.title || d._id === art._id);
            return match ? { ...match, ...art } : art;
          });
          setArticles(enrichedList);
        } else {
          setArticles(DEFAULT_ARTICLES);
        }
      } catch (err) {
        console.error('Erreur chargement actualités:', err);
        setArticles(DEFAULT_ARTICLES);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  // Filtrage combiné : Catégorie + Recherche textuelle
  const filteredArticles = useMemo(() => {
    return articles.filter((item) => {
      const matchCategory = 
        selectedCategory === 'Toutes' || 
        item.category?.toLowerCase() === selectedCategory.toLowerCase();
      
      const query = searchQuery.trim().toLowerCase();
      const matchSearch = 
        !query || 
        item.title?.toLowerCase().includes(query) ||
        item.summary?.toLowerCase().includes(query) ||
        item.game?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query);

      return matchCategory && matchSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  // Article à la Une (premier article isFeatured ou premier de la liste)
  const featuredArticle = useMemo(() => {
    if (selectedCategory !== 'Toutes' || searchQuery.trim() !== '') {
      return null;
    }
    return articles.find(a => a.isFeatured) || articles[0] || null;
  }, [articles, selectedCategory, searchQuery]);

  // Autres articles (excluant l'article à la une si affiché)
  const listArticles = useMemo(() => {
    if (featuredArticle && selectedCategory === 'Toutes' && searchQuery.trim() === '') {
      return filteredArticles.filter(a => (a._id || a.slug) !== (featuredArticle._id || featuredArticle.slug));
    }
    return filteredArticles;
  }, [filteredArticles, featuredArticle, selectedCategory, searchQuery]);

  // Calcul du nombre d'articles par catégorie
  const getCategoryCount = (cat) => {
    if (cat === 'Toutes') return articles.length;
    return articles.filter(a => a.category?.toLowerCase() === cat.toLowerCase()).length;
  };

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'tournoi':
        return <Trophy size={13} />;
      case 'esport':
        return <Flame size={13} />;
      case 'recrutement':
        return <UserPlus size={13} />;
      case 'mise à jour':
        return <RefreshCw size={13} />;
      default:
        return <Megaphone size={13} />;
    }
  };

  return (
    <section className="news-section modern-news-hub" id="actualites">
      <div className="section-container">
        
        {/* EN-TÊTE PRINCIPAL */}
        <div className="section-header news-hub-header">
          <div className="about-badge news-hub-badge">
            📰 GAZETTE OFFICIELLE • DARK WOLF TEAM
          </div>
          <h2 className="section-title news-hub-title">ACTUALITÉS & ANNONCES</h2>
          <p className="section-subtitle news-hub-subtitle">
            Plongez au cœur de la meute : résultats de tournois, mercatos, coulisses et annonces exclusives.
          </p>

          {/* BARRE DE RECHERCHE EN DIRECT */}
          <div className="news-search-bar-wrap">
            <div className="news-search-input-box">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Rechercher un article, un jeu, un tournoi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="news-search-input"
              />
              {searchQuery && (
                <button 
                  type="button" 
                  className="search-clear-btn"
                  onClick={() => setSearchQuery('')}
                  title="Effacer la recherche"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* FILTRES PAR CATÉGORIES AVEC COMPTEURS */}
          <div className="news-categories-filter-bar">
            {categories.map((cat) => {
              const count = getCategoryCount(cat);
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  className={`news-cat-pill-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  <span className="cat-pill-icon">{getCategoryIcon(cat)}</span>
                  <span className="cat-pill-name">{cat}</span>
                  <span className="cat-pill-count">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 1 : ARTICLE À LA UNE (FEATURED SPOTLIGHT HERO) */}
        {featuredArticle && !loading && (
          <div className="news-featured-hero-card">
            <div 
              className="featured-hero-interactive-wrap"
              onClick={() => navigate(`/actualites/${featuredArticle.slug || featuredArticle._id}`)}
            >
              <div className="featured-hero-image-box">
                <img 
                  src={getImageUrl(featuredArticle.coverImage || featuredArticle.image)} 
                  alt={featuredArticle.title} 
                />
                <div className="featured-hero-image-gradient" />
                <span className="featured-hero-pill-badge">
                  <Flame size={14} /> À LA UNE
                </span>
                <span className="featured-hero-game-badge">
                  {featuredArticle.game || 'E-Sport'}
                </span>
              </div>

              <div className="featured-hero-content-box">
                <div className="featured-meta-row">
                  <span className="featured-category-tag">
                    {getCategoryIcon(featuredArticle.category)} {featuredArticle.category}
                  </span>
                  <span className="featured-meta-sep">•</span>
                  <span className="featured-meta-date">
                    <Calendar size={13} />
                    {featuredArticle.createdAt 
                      ? new Date(featuredArticle.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
                      : 'Octobre 2026'}
                  </span>
                  <span className="featured-meta-sep">•</span>
                  <span className="featured-meta-readtime">
                    <Clock size={13} /> {featuredArticle.readTime || calculateReadTime(featuredArticle.content)}
                  </span>
                </div>

                <h3 className="featured-hero-title">
                  {featuredArticle.title}
                </h3>

                <p className="featured-hero-summary">
                  {featuredArticle.summary}
                </p>

                <div className="featured-hero-footer-row">
                  <div className="featured-author-badge">
                    <User size={13} /> Par {featuredArticle.authorName || 'Staff DWT'}
                  </div>

                  <Link 
                    to={`/actualites/${featuredArticle.slug || featuredArticle._id}`}
                    className="featured-cta-read-btn"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>Lire l'article complet</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2 : GRILLE DES DERNIÈRES PUBLICATIONS */}
        <div className="news-grid-section-header">
          <div className="grid-section-title-wrap">
            <h3 className="grid-section-title">
              {searchQuery ? `Résultats de recherche pour "${searchQuery}"` : selectedCategory !== 'Toutes' ? `Articles ${selectedCategory}` : 'Dernières Publications'}
            </h3>
            <span className="grid-section-count">
              {filteredArticles.length} article{filteredArticles.length > 1 ? 's' : ''} trouvé{filteredArticles.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* GRILLE MODERNE */}
        {loading ? (
          <div className="news-grid-loading-box">
            <div className="news-card-skeleton" />
            <div className="news-card-skeleton" />
            <div className="news-card-skeleton" />
          </div>
        ) : listArticles.length === 0 ? (
          <div className="news-empty-state-box">
            <div className="empty-icon-wrap">
              <Search size={32} />
            </div>
            <h4>Aucun article ne correspond à vos critères</h4>
            <p>Essayez de modifier votre recherche ou de sélectionner une autre catégorie.</p>
            <button 
              type="button" 
              className="btn-reset-filters"
              onClick={() => { setSelectedCategory('Toutes'); setSearchQuery(''); }}
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="news-modern-cards-grid">
            {listArticles.map((item) => {
              const articleUrl = `/actualites/${item.slug || item._id}`;
              const readTime = item.readTime || calculateReadTime(item.content);
              const dateStr = item.createdAt 
                ? new Date(item.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
                : 'Oct 2026';

              return (
                <article 
                  key={item._id || item.slug}
                  className="modern-news-card"
                  onClick={() => navigate(articleUrl)}
                  title={`Lire l'article : ${item.title}`}
                >
                  {/* Vignette avec badges flottants */}
                  <div className="modern-news-thumb-box">
                    <img 
                      src={getImageUrl(item.coverImage || item.image)} 
                      alt={item.title} 
                      loading="lazy"
                    />
                    <div className="thumb-gradient-overlay" />
                    
                    <span className="thumb-badge-category">
                      {getCategoryIcon(item.category)} {item.category}
                    </span>

                    {item.game && item.game !== 'Général' && (
                      <span className="thumb-badge-game">
                        {item.game}
                      </span>
                    )}

                    <span className="thumb-readtime-pill">
                      <Clock size={11} /> {readTime}
                    </span>
                  </div>

                  {/* Contenu de la carte */}
                  <div className="modern-news-card-body">
                    <div className="card-meta-top">
                      <span className="meta-date">
                        <Calendar size={13} /> {dateStr}
                      </span>
                      {item.views > 0 && (
                        <span className="meta-views">
                          <Eye size={13} /> {item.views}
                        </span>
                      )}
                    </div>

                    <h4 className="modern-news-card-title">
                      {item.title}
                    </h4>

                    <p className="modern-news-card-summary">
                      {item.summary}
                    </p>

                    <div className="modern-news-card-footer">
                      <div className="card-author-info">
                        <User size={13} className="author-icon" />
                        <span>{item.authorName || 'Staff DWT'}</span>
                      </div>

                      <Link 
                        to={articleUrl} 
                        className="card-read-action-btn"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>Lire l'article</span>
                        <ChevronRight size={15} className="arrow-icon" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};

export default NewsSection;
