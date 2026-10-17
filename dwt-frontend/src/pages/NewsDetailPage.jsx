import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Eye, 
  Heart, 
  Share2, 
  Clock, 
  ChevronRight, 
  Flame, 
  Trophy, 
  Megaphone, 
  UserPlus, 
  RefreshCw, 
  Sparkles, 
  Check, 
  Copy, 
  ExternalLink,
  MessageSquare,
  Shield,
  Gamepad2,
  Tag
} from 'lucide-react';
import API from '../services/api';
import { getImageUrl } from '../utils/imageUrl';
import { DEFAULT_ARTICLES, calculateReadTime } from '../data/newsData';
import { WolfLogo } from '../components/WolfLogo';

const NewsDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allArticles, setAllArticles] = useState([]);

  // État likes interactif
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [likeAnimating, setLikeAnimating] = useState(false);

  // État toast copie lien
  const [copied, setCopied] = useState(false);

  // Barre de progression de lecture au scroll
  const [readingProgress, setReadingProgress] = useState(0);

  // Scroll en haut lors du changement d'article
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // Suivi de la progression du scroll
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setReadingProgress(Math.min(100, Math.max(0, progress)));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Chargement de l'article et de la liste globale
  useEffect(() => {
    const fetchArticleData = async () => {
      setLoading(true);
      setError(null);

      let foundArticle = null;
      let fetchedArticlesList = [];

      try {
        // 1. Récupération de tous les articles pour la liste de recommandations
        const listRes = await API.get('/news').catch(() => null);
        if (listRes?.data?.articles?.length > 0) {
          fetchedArticlesList = listRes.data.articles;
        } else {
          fetchedArticlesList = DEFAULT_ARTICLES;
        }
        setAllArticles(fetchedArticlesList);

        // 2. Recherche spécifique de l'article par ID ou slug
        try {
          const res = await API.get(`/news/${id}`);
          if (res.data?.success && res.data.article) {
            foundArticle = res.data.article;
          }
        } catch {
          // Si l'API échoue, on cherche dans notre base locale / fallback
        }

        // Si non trouvé par l'API, recherche dans la liste locale
        if (!foundArticle) {
          foundArticle = fetchedArticlesList.find(
            (a) => a._id === id || a.slug === id || a._id?.toString() === id
          );
        }

        // Si toujours non trouvé, recherche dans DEFAULT_ARTICLES
        if (!foundArticle) {
          foundArticle = DEFAULT_ARTICLES.find(
            (a) => a._id === id || a.slug === id || a._id?.toString() === id
          );
        }

        if (foundArticle) {
          // Fusionner avec les données enrichies si disponibles
          const enriched = DEFAULT_ARTICLES.find(
            (d) => d.slug === foundArticle.slug || d.title === foundArticle.title || d._id === foundArticle._id
          );
          const finalArticle = enriched ? { ...enriched, ...foundArticle, highlights: enriched.highlights, quote: enriched.quote, matchRecap: enriched.matchRecap } : foundArticle;
          
          setArticle(finalArticle);
          setLikesCount(finalArticle.likes?.length || (Array.isArray(finalArticle.likes) ? finalArticle.likes.length : 14));
          
          // Vérifier si déjà liké dans le localStorage
          const localLiked = localStorage.getItem(`dwt_liked_news_${finalArticle._id || finalArticle.slug}`);
          setLiked(!!localLiked);
        } else {
          setError('Article introuvable');
        }
      } catch (err) {
        console.error('Erreur chargement article:', err);
        setError('Impossible de charger cet article pour le moment.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticleData();
  }, [id]);

  // Action Like interactive
  const handleToggleLike = async () => {
    if (!article) return;
    setLikeAnimating(true);
    setTimeout(() => setLikeAnimating(false), 600);

    const newLikedState = !liked;
    setLiked(newLikedState);
    setLikesCount(prev => newLikedState ? prev + 1 : Math.max(0, prev - 1));

    if (newLikedState) {
      localStorage.setItem(`dwt_liked_news_${article._id || article.slug}`, 'true');
    } else {
      localStorage.removeItem(`dwt_liked_news_${article._id || article.slug}`);
    }

    try {
      if (article._id && article._id.length === 24) {
        await API.post(`/news/${article._id}/like`).catch(() => null);
      }
    } catch {
      // Tolérance offline / sans auth
    }
  };

  // Copier le lien de l'article
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Partage sur X (Twitter)
  const handleShareTwitter = () => {
    if (!article) return;
    const shareText = encodeURIComponent(`${article.title} - Dark Wolf Team 🐺`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${shareText}&url=${url}`, '_blank', 'noopener,noreferrer');
  };

  // Icône dynamique par catégorie
  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'tournoi':
        return <Trophy size={14} />;
      case 'esport':
        return <Flame size={14} />;
      case 'recrutement':
        return <UserPlus size={14} />;
      case 'mise à jour':
        return <RefreshCw size={14} />;
      default:
        return <Megaphone size={14} />;
    }
  };

  // Articles recommandés (excluant l'article courant)
  const relatedArticles = allArticles
    .filter(a => a._id !== article?._id && a.slug !== article?.slug)
    .slice(0, 3);

  // Article précédent et suivant
  const currentIndex = allArticles.findIndex(a => a._id === article?._id || a.slug === article?.slug);
  const prevArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex >= 0 && currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;

  if (loading) {
    return (
      <div className="article-detail-page-loading">
        <div className="article-detail-spinner">
          <WolfLogo size={50} />
          <p>Chargement de l'article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="article-detail-page-error">
        <div className="article-detail-error-card">
          <div className="error-icon-box">
            <WolfLogo size={60} />
          </div>
          <h2>Article Introuvable</h2>
          <p>L'annonce que vous recherchez n'existe pas ou a été déplacée.</p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', marginTop: '20px' }}>
            <Link to="/actualites" className="btn-article-back">
              <ArrowLeft size={16} /> Toutes les actualités
            </Link>
            <Link to="/" className="btn-article-home">
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const readTime = article.readTime || calculateReadTime(article.content);
  const formattedDate = article.createdAt 
    ? new Date(article.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
    : 'Octobre 2026';

  return (
    <div className="article-detail-page-wrapper">
      {/* 1. BARRE DE PROGRESSION DE LECTURE STICKY */}
      <div 
        className="reading-progress-bar" 
        style={{ width: `${readingProgress}%` }}
        title={`Progression : ${Math.round(readingProgress)}%`}
      />

      <div className="section-container article-detail-container">
        
        {/* 2. NAVIGATION SUPÉRIEURE & FIL D'ARIANE */}
        <div className="article-top-nav-bar">
          <div className="article-breadcrumbs">
            <Link to="/" className="breadcrumb-item">Accueil</Link>
            <ChevronRight size={14} className="breadcrumb-sep" />
            <Link to="/actualites" className="breadcrumb-item">Actualités</Link>
            <ChevronRight size={14} className="breadcrumb-sep" />
            <span className="breadcrumb-item breadcrumb-current">{article.category}</span>
          </div>

          <Link to="/actualites" className="article-back-link">
            <ArrowLeft size={16} /> Retour aux actualités
          </Link>
        </div>

        {/* 3. EN-TÊTE DE L'ARTICLE */}
        <header className="article-header-block">
          <div className="article-badges-row">
            <span className="article-cat-badge">
              {getCategoryIcon(article.category)} {article.category}
            </span>
            {article.game && (
              <span className="article-game-badge">
                <Gamepad2 size={13} /> {article.game}
              </span>
            )}
            <span className="article-official-badge">
              <Shield size={12} /> Publication Officielle DWT
            </span>
          </div>

          <h1 className="article-main-title">
            {article.title}
          </h1>

          {/* Résumé / Chapô */}
          {article.summary && (
            <p className="article-lead-summary">
              {article.summary}
            </p>
          )}

          {/* Métadonnées & Auteur */}
          <div className="article-meta-banner">
            <div className="article-author-info">
              <img 
                src={article.authorAvatar || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=120&q=80'} 
                alt={article.authorName || 'Staff DWT'} 
                className="article-author-avatar"
              />
              <div className="article-author-text">
                <span className="article-author-name">{article.authorName || 'Staff DWT'}</span>
                <span className="article-author-role">{article.authorRole || 'Dark Wolf Esports'}</span>
              </div>
            </div>

            <div className="article-meta-stats">
              <div className="article-meta-stat-item" title="Date de publication">
                <Calendar size={15} />
                <span>{formattedDate}</span>
              </div>
              <div className="article-meta-stat-item" title="Temps de lecture estimé">
                <Clock size={15} />
                <span>{readTime}</span>
              </div>
              <div className="article-meta-stat-item" title="Nombre de vues">
                <Eye size={15} />
                <span>{(article.views || 0).toLocaleString('fr-FR')} vues</span>
              </div>
            </div>
          </div>
        </header>

        {/* 4. COUVERTURE GRAND FORMAT AVEC EFFET VIGNETTE */}
        <div className="article-hero-media-wrapper">
          <img 
            src={getImageUrl(article.coverImage || article.image)} 
            alt={article.title}
            className="article-hero-media-img"
          />
          <div className="article-hero-media-overlay" />
          <div className="article-hero-media-caption">
            <span>© DARK WOLF TEAM • COMMUNICATION OFFICIELLE COMPÉTITION</span>
          </div>
        </div>

        {/* 5. CORPS PRINCIPAL DE L'ARTICLE */}
        <div className="article-content-layout">
          
          {/* Colonne latérale d'actions de partage (Sticky desktop) */}
          <aside className="article-share-sidebar">
            <div className="article-share-sticky-box">
              <span className="share-box-label">INTERACTION</span>
              
              <button 
                type="button"
                className={`share-action-btn like-btn ${liked ? 'active' : ''} ${likeAnimating ? 'pop' : ''}`}
                onClick={handleToggleLike}
                title={liked ? "Je n'aime plus" : "J'aime cet article"}
              >
                <Heart size={20} fill={liked ? 'var(--red-primary)' : 'none'} color={liked ? 'var(--red-primary)' : '#94a3b8'} />
                <span className="share-counter">{likesCount}</span>
              </button>

              <button 
                type="button"
                className="share-action-btn copy-btn"
                onClick={handleCopyLink}
                title="Copier le lien"
              >
                {copied ? <Check size={20} color="#22c55e" /> : <Copy size={20} />}
                <span className="share-counter">{copied ? 'Copié !' : 'Partager'}</span>
              </button>

              <button 
                type="button"
                className="share-action-btn x-btn"
                onClick={handleShareTwitter}
                title="Partager sur X / Twitter"
              >
                <ExternalLink size={20} />
                <span className="share-counter">Sur X</span>
              </button>
            </div>
          </aside>

          {/* Contenu textuel rédigé */}
          <main className="article-body-text-block">
            
            {/* Paragraphes du contenu avec typographie soignée */}
            <div className="article-rich-paragraphs">
              {article.content ? (
                article.content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className={`article-p ${idx === 0 ? 'article-first-p' : ''}`}>
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="article-p">{article.summary}</p>
              )}
            </div>

            {/* Citation stylisée si disponible */}
            {article.quote && (
              <blockquote className="article-stylized-quote">
                <div className="quote-mark-icon">“</div>
                <p className="quote-body-text">{article.quote.text}</p>
                <footer className="quote-author-footer">
                  <span className="quote-author-name">{article.quote.author}</span>
                  <span className="quote-author-title"> — {article.quote.role}</span>
                </footer>
              </blockquote>
            )}

            {/* Fiche Points Clés / À Retenir si disponible */}
            {article.highlights && article.highlights.length > 0 && (
              <div className="article-highlights-card">
                <div className="highlights-header">
                  <Sparkles size={18} className="highlights-icon" />
                  <h3>POINTS CLÉS DU SCOOP</h3>
                </div>
                <ul className="highlights-list">
                  {article.highlights.map((h, i) => (
                    <li key={i}>
                      <Shield size={14} className="h-bullet" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Récapitulatif de Match si Tournoi */}
            {article.matchRecap && (
              <div className="article-match-card">
                <div className="match-card-badge">🏆 RÉSULTAT OFFICIEL DU MATCH</div>
                <div className="match-teams-row">
                  <div className="match-team dwt-team">
                    <WolfLogo size={32} />
                    <span className="team-name">{article.matchRecap.teamA}</span>
                    <span className="team-score win">{article.matchRecap.scoreA}</span>
                  </div>
                  <div className="match-vs-divider">VS</div>
                  <div className="match-team opponent-team">
                    <span className="team-score">{article.matchRecap.scoreB}</span>
                    <span className="team-name">{article.matchRecap.teamB}</span>
                  </div>
                </div>
                {article.matchRecap.maps && (
                  <div className="match-maps-grid">
                    {article.matchRecap.maps.map((m, idx) => (
                      <div className="match-map-item" key={idx}>
                        <span className="map-name">{m.name}</span>
                        <span className="map-score">{m.score}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Encart dynamique selon catégorie */}
            {article.category === 'Recrutement' && (
              <div className="article-cta-box recruitment-cta">
                <div className="cta-box-content">
                  <UserPlus size={28} className="cta-box-icon" />
                  <div>
                    <h4>Envie d'écrire l'histoire avec Dark Wolf ?</h4>
                    <p>Déposez votre dossier de candidature sur notre portail officiel de recrutement.</p>
                  </div>
                </div>
                <Link to="/recrutement" className="btn-cta-action">
                  Postuler Maintenant <ChevronRight size={16} />
                </Link>
              </div>
            )}

            {article.category === 'Annonce' && (
              <div className="article-cta-box shop-cta">
                <div className="cta-box-content">
                  <Sparkles size={28} className="cta-box-icon" />
                  <div>
                    <h4>Collection Officielle Dark Wolf Team</h4>
                    <p>Équipez-vous comme les professionnels avec nos maillots, hoodies et accessoires officiels.</p>
                  </div>
                </div>
                <Link to="/boutique" className="btn-cta-action">
                  Visiter la Boutique <ChevronRight size={16} />
                </Link>
              </div>
            )}

            {/* Tags & Mots-clés */}
            {article.tags && article.tags.length > 0 && (
              <div className="article-tags-wrapper">
                <span className="tags-label"><Tag size={14} /> Mots-clés :</span>
                <div className="tags-list">
                  {article.tags.map((t, idx) => (
                    <span key={idx} className="article-tag-item">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Barre de réactions & interaction finale */}
            <div className="article-bottom-interaction-bar">
              <div className="interaction-left">
                <button 
                  type="button" 
                  className={`btn-like-large ${liked ? 'active' : ''}`}
                  onClick={handleToggleLike}
                >
                  <Heart size={18} fill={liked ? '#fff' : 'none'} />
                  {liked ? 'Vous aimez cet article' : "J'aime cet article"} ({likesCount})
                </button>
              </div>

              <div className="interaction-right">
                <span className="share-text">Partager :</span>
                <button type="button" onClick={handleCopyLink} className="btn-icon-share" title="Copier le lien">
                  {copied ? <Check size={16} color="#22c55e" /> : <Copy size={16} />}
                </button>
                <button type="button" onClick={handleShareTwitter} className="btn-icon-share" title="Partager sur X">
                  <ExternalLink size={16} />
                </button>
              </div>
            </div>

            {/* Fiche auteur détaillée */}
            <div className="article-author-box-bottom">
              <img 
                src={article.authorAvatar || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=160&q=80'} 
                alt={article.authorName || 'Staff DWT'} 
                className="author-box-img"
              />
              <div className="author-box-content">
                <div className="author-box-top">
                  <span className="author-box-badge">RÉDACTION CLUB</span>
                  <h4 className="author-box-name">{article.authorName || 'Staff DWT'}</h4>
                </div>
                <p className="author-box-desc">
                  Rédacteur et observateur officiel pour Dark Wolf Team. Couvre les performances des rosters CS2, Valorant, et League of Legends sur la scène internationale.
                </p>
              </div>
            </div>

            {/* Navigation Article Précédent / Suivant */}
            <div className="article-prev-next-nav">
              {prevArticle ? (
                <Link to={`/actualites/${prevArticle.slug || prevArticle._id}`} className="prev-article-card">
                  <span className="nav-dir-label"><ArrowLeft size={13} /> Article Précédent</span>
                  <span className="nav-article-title">{prevArticle.title}</span>
                </Link>
              ) : (
                <div className="nav-placeholder" />
              )}

              {nextArticle && (
                <Link to={`/actualites/${nextArticle.slug || nextArticle._id}`} className="next-article-card">
                  <span className="nav-dir-label">Article Suivant <ChevronRight size={13} /></span>
                  <span className="nav-article-title">{nextArticle.title}</span>
                </Link>
              )}
            </div>

          </main>
        </div>

        {/* 6. ARTICLES RECOMMANDÉS / À LIRE AUSSI */}
        {relatedArticles.length > 0 && (
          <section className="article-related-section">
            <div className="related-header">
              <div className="about-badge" style={{ margin: 0 }}>
                📰 DANS L'ACTUALITÉ
              </div>
              <h3 className="related-title">AUTRES ANNONCES DE LA MEUTE</h3>
            </div>

            <div className="related-articles-grid">
              {relatedArticles.map((rel) => (
                <Link 
                  to={`/actualites/${rel.slug || rel._id}`} 
                  key={rel._id || rel.slug}
                  className="related-article-card"
                >
                  <div className="related-img-box">
                    <img 
                      src={getImageUrl(rel.coverImage || rel.image)} 
                      alt={rel.title} 
                      loading="lazy" 
                    />
                    <span className="related-cat-badge">{rel.category}</span>
                  </div>
                  <div className="related-content-box">
                    <span className="related-date">
                      {rel.createdAt 
                        ? new Date(rel.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
                        : 'Oct 2026'}
                    </span>
                    <h4 className="related-item-title">{rel.title}</h4>
                    <span className="related-read-link">
                      Lire l'article <ChevronRight size={14} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};

export default NewsDetailPage;
