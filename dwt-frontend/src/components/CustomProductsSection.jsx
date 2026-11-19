import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  RotateCw, 
  Wand2, 
  ShieldCheck, 
  Truck, 
  ArrowRight, 
  Sliders, 
  Palette,
  Users,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { customizerState } from '../customizer/state';
import '../styles/customProductsSection.css';

const CUSTOM_PRODUCTS = [
  {
    id: 'maillots',
    name: 'Maillot Esport Pro 2026',
    subtitle: 'Équipement Officiel de Match Dark Wolf Team',
    tag: 'OFFICIEL VCT • PRO MATCH',
    price: '69,99 TND',
    frontImage: '/custom-gear/jersey_front_transparent.png',
    backImage: '/custom-gear/jersey_back_transparent.png',
    badges: ['Dry-Tech Mesh', 'Col V / Rond', 'Flocage Gratuit'],
    specs: [
      'Tissu respirant micro-perforé anti-transpirant',
      'Coupe athlétique compétition ou décontractée',
      'Flocage officiel du nom, numéro et rôle au dos',
      'Encres sublimation certifiées tournois internationaux'
    ],
    colors: ['#0a0b0e', '#f8fafc', '#990000', '#0c2233']
  },
  {
    id: 'hoodies',
    name: 'Hoodie Techwear Pro',
    subtitle: 'Sweat Cyber Streetwear Lourd 450 GSM',
    tag: 'TECHWEAR • OVERSIZE 450G',
    price: '89,99 TND',
    frontImage: '/custom-gear/hoodie_front_transparent.png',
    backImage: '/custom-gear/hoodie_back_transparent.png',
    badges: ['Coton Lourd 450G', 'Zip Techwear', 'Flocage Dos'],
    specs: [
      'Molleton lourd ultra-dense 450 GSM grand confort',
      'Poche ventrale cyber zippée et cordons réfléchissants',
      'Capuche double épaisseur coupe-vent',
      'Emplacement blason poitrine et flocage dorsal'
    ],
    colors: ['#1e2430', '#0a0b0e', '#334155', '#f8fafc']
  },
  {
    id: 't-shirt',
    name: 'T-Shirt Athlétique Pro',
    subtitle: 'T-Shirt Compétition & Training Quotidien',
    tag: 'ATHLÉTIQUE • TRAINING',
    price: '49,99 TND',
    frontImage: '/custom-gear/tshirt_front_transparent.png',
    backImage: '/custom-gear/tshirt_back_transparent.png',
    badges: ['100% Coton Peigné', 'Coupe Fit', 'Sublimation Fine'],
    specs: [
      'Coton peigné doux 220 GSM haute durabilité',
      'Coupe fit ajustée mettant en valeur la silhouette',
      'Flocage personnalisé haute précision poitrine & dos',
      'Lavage à 30° sans altération des couleurs'
    ],
    colors: ['#0a0b0e', '#f8fafc', '#990000']
  },
  {
    id: 'team-pack',
    categoryTarget: 'maillots',
    isTeamPack: true,
    name: 'Pack Roster 5 Joueurs',
    subtitle: 'Équipement Complet pour Équipes Compétitives',
    tag: 'PACK CLUBS & ROSTERS',
    price: '299,99 TND',
    strikedPrice: '349,95 TND',
    frontImage: '/custom-gear/jersey_angle.jpg',
    backImage: '/custom-gear/jersey_back.jpg',
    badges: ['Remise -15%', 'Sync Roster', 'Validation 24h'],
    specs: [
      '5 Maillots de compétition personnalisés individuellement',
      'Ajout du logo de votre équipe et de vos sponsors',
      'Pseudos et numéros distincts pour chaque joueur',
      'Assistance graphique dédiée avant mise en production'
    ],
    colors: ['#0a0b0e', '#f8fafc', '#990000', '#00e5ff']
  }
];

export const CustomProductsSection = ({ onOpenCustomStudio, onSelectCategory }) => {
  const [activeViews, setActiveViews] = useState({
    maillots: 'front',
    hoodies: 'front',
    't-shirt': 'front',
    'team-pack': 'front'
  });

  const toggleView = (prodId, view) => {
    setActiveViews(prev => ({ ...prev, [prodId]: view }));
  };

  const handleLaunchCustomizer = (product) => {
    const targetCat = product.categoryTarget || product.id;
    customizerState.setState({
      category: targetCat,
      teamMode: !!product.isTeamPack
    });

    if (onSelectCategory) {
      onSelectCategory(targetCat);
    }
    if (onOpenCustomStudio) {
      onOpenCustomStudio();
    }
  };

  return (
    <section className="dwt-custom-space-section" id="custom-gear">
      <div className="dwt-custom-space-container">
        {/* En-tête de la section */}
        <div className="dwt-custom-space-header">
          <div>
            <div className="dwt-custom-badge-pill">
              <Sparkles size={14} /> Atelier Officiel Dark Wolf Team
            </div>
            <h2 className="dwt-custom-title">ESPACE PRODUITS PERSONNALISÉS</h2>
            <p className="dwt-custom-subtitle">
              Créez votre tenue de compétition unique. Visualisation 3D temps réel à 360°, co-pilote IA et flocage officiel certifié pour la scène esport internationale.
            </p>
          </div>
          <button
            type="button"
            className="dwt-custom-launch-btn"
            onClick={() => handleLaunchCustomizer({ id: 'maillots' })}
          >
            <Cpu size={16} />
            <span>Lancer le Studio 3D</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {/* 4 Piliers clés de la personnalisation */}
        <div className="dwt-custom-pillars-grid">
          <div className="dwt-custom-pillar-card">
            <div className="dwt-custom-pillar-icon">
              <Layers size={20} />
            </div>
            <div>
              <div className="dwt-custom-pillar-title">Rendu 3D WebGL Pur</div>
              <p className="dwt-custom-pillar-desc">
                Visualisez chaque couture et décale sous 360° avec projection millimétrique.
              </p>
            </div>
          </div>

          <div className="dwt-custom-pillar-card">
            <div className="dwt-custom-pillar-icon cyan">
              <Wand2 size={20} />
            </div>
            <div>
              <div className="dwt-custom-pillar-title">Co-Pilote Studio IA</div>
              <p className="dwt-custom-pillar-desc">
                Décrivez votre style en français pour générer une tenue complète en 1 clic.
              </p>
            </div>
          </div>

          <div className="dwt-custom-pillar-card">
            <div className="dwt-custom-pillar-icon gold">
              <Sliders size={20} />
            </div>
            <div>
              <div className="dwt-custom-pillar-title">Flocage Compétition Offert</div>
              <p className="dwt-custom-pillar-desc">
                Nom de joueur, numéro officiel 00-99 et rôle alignés mathématiquement.
              </p>
            </div>
          </div>

          <div className="dwt-custom-pillar-card">
            <div className="dwt-custom-pillar-icon">
              <Truck size={20} />
            </div>
            <div>
              <div className="dwt-custom-pillar-title">Livraison Rapide 24-48h</div>
              <p className="dwt-custom-pillar-desc">
                Fabrication soignée et livraison express partout en Tunisie et à l'international.
              </p>
            </div>
          </div>
        </div>

        {/* Grille des produits personnalisables */}
        <div className="dwt-custom-products-grid">
          {CUSTOM_PRODUCTS.map((prod) => {
            const isBack = activeViews[prod.id] === 'back';
            const displayImg = isBack ? prod.backImage : prod.frontImage;

            return (
              <div key={prod.id} className="dwt-custom-product-card">
                <div className="dwt-custom-card-badges">
                  <span className="dwt-custom-card-tag">{prod.tag}</span>
                  <span className="dwt-custom-3d-badge">
                    <RotateCw size={11} /> 3D TEMPS RÉEL
                  </span>
                </div>

                {/* Scène de prévisualisation avec bascule Face / Dos */}
                <div className="dwt-custom-img-stage">
                  <img
                    src={displayImg}
                    alt={prod.name}
                    className="dwt-custom-img-element"
                    loading="lazy"
                  />
                  <div className="dwt-custom-view-toggle">
                    <button
                      type="button"
                      className={`dwt-custom-view-btn ${!isBack ? 'active' : ''}`}
                      onClick={() => toggleView(prod.id, 'front')}
                    >
                      Face
                    </button>
                    <button
                      type="button"
                      className={`dwt-custom-view-btn ${isBack ? 'active' : ''}`}
                      onClick={() => toggleView(prod.id, 'back')}
                    >
                      Dos
                    </button>
                  </div>
                </div>

                {/* Nom & Description */}
                <h3 className="dwt-custom-prod-name">{prod.name}</h3>
                <p className="dwt-custom-prod-sub">{prod.subtitle}</p>

                {/* Badges d'options incluses */}
                <div className="dwt-custom-specs-list">
                  {prod.badges.map((b, idx) => (
                    <span key={idx} className="dwt-custom-spec-item">{b}</span>
                  ))}
                </div>

                {/* Bas de carte : Prix & CTA */}
                <div className="dwt-custom-card-bottom">
                  <div className="dwt-custom-price-block">
                    <span className="dwt-custom-price-label">Tarif Personnalisé :</span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                      <span className="dwt-custom-price-value">{prod.price}</span>
                      {prod.strikedPrice && (
                        <span style={{ fontSize: '13px', color: '#64748b', textDecoration: 'line-through', fontFamily: 'Rajdhani, sans-serif' }}>
                          {prod.strikedPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="dwt-custom-card-action-btn"
                    onClick={() => handleLaunchCustomizer(prod)}
                  >
                    <span>{prod.isTeamPack ? 'Configurer Roster' : 'Personnaliser'}</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comment fonctionne la création DWT */}
        <div className="dwt-custom-steps-wrap">
          <div className="dwt-custom-steps-title">
            COMMENT ÇA FONCTIONNE EN 3 ÉTAPES SIMPLES
          </div>
          <div className="dwt-custom-steps-grid">
            <div className="dwt-custom-step-item">
              <div className="dwt-custom-step-number">01</div>
              <div className="dwt-custom-step-name">Choisissez votre base</div>
              <p className="dwt-custom-step-desc">
                Sélectionnez votre coupe officielle parmi nos maillots de match, hoodies techwear ou t-shirts d'entraînement.
              </p>
            </div>

            <div className="dwt-custom-step-item">
              <div className="dwt-custom-step-number">02</div>
              <div className="dwt-custom-step-name">Personnalisez en 3D ou IA</div>
              <p className="dwt-custom-step-desc">
                Ajustez les teintes, appliquez vos logos, écrivez votre prompt IA et renseignez votre gamertag et numéro de match.
              </p>
            </div>

            <div className="dwt-custom-step-item">
              <div className="dwt-custom-step-number">03</div>
              <div className="dwt-custom-step-name">Fabrication & Expédition</div>
              <p className="dwt-custom-step-desc">
                Sublimation textile haute précision, contrôle qualité et expédition express avec paiement sécurisé.
              </p>
            </div>
          </div>
        </div>

        {/* Bannière de contact Clubs & Équipes */}
        <div className="dwt-custom-club-banner">
          <div className="dwt-custom-club-info">
            <h4>Vous êtes un club, une association esport ou une école ?</h4>
            <p>
              Bénéficiez de remises groupées, de maquettes 3D sur mesure et de la personnalisation complète avec tous vos sponsors de line-up.
            </p>
          </div>
          <button
            type="button"
            className="dwt-custom-club-btn"
            onClick={() => {
              const contactEl = document.querySelector('#contact');
              if (contactEl) {
                contactEl.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            <Users size={15} />
            <span>Demander un Devis Club</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CustomProductsSection;

