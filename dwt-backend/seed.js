const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('./models/User');
const Player = require('./models/Player');
const Match = require('./models/Match');
const News = require('./models/News');
const Achievement = require('./models/Achievement');
const Application = require('./models/Application');
const Product = require('./models/Product');

dotenv.config();

const samplePlayers = [
  // Roster Valorant
  {
    gamertag: 'Vortex',
    realName: 'Thomas Martin',
    nationality: 'FR',
    game: 'Valorant',
    role: 'Capitaine / Dueliste',
    rank: 'Radiant',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=400&q=80',
    bio: 'Capitaine et principal entry de la section Valorant.',
    stats: { winRate: '68%', kda: '1.42', matchesPlayed: 45 },
    socialLinks: { twitch: 'https://twitch.tv', twitter: 'https://twitter.com' },
    isStarter: true
  },
  {
    gamertag: 'Phantom',
    realName: 'Karim Benali',
    nationality: 'TN',
    game: 'Valorant',
    role: 'Sniper / Opener',
    rank: 'Radiant',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    bio: 'Spécialiste de l\'Operator et des duels longue distance.',
    stats: { winRate: '71%', kda: '1.58', matchesPlayed: 42 },
    isStarter: true
  },
  {
    gamertag: 'Aegis',
    realName: 'Lucas Bernard',
    nationality: 'FR',
    game: 'Valorant',
    role: 'Sentinel',
    rank: 'Immortal 3',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80',
    bio: 'Verrouille les sites défensifs avec Killjoy et Cypher.',
    stats: { winRate: '64%', kda: '1.20', matchesPlayed: 40 },
    isStarter: true
  },
  // Roster League of Legends
  {
    gamertag: 'Nightblade',
    realName: 'Maxime Dupont',
    nationality: 'FR',
    game: 'League of Legends',
    role: 'Midlaner',
    rank: 'Challenger',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: 'Joueur de contrôle et de playmaking sur la voie du milieu.',
    stats: { winRate: '66%', kda: '4.2', matchesPlayed: 38 },
    isStarter: true
  },
  {
    gamertag: 'Apex',
    realName: 'Sami Mansour',
    nationality: 'TN',
    game: 'League of Legends',
    role: 'Jungler',
    rank: 'Grandmaster',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    bio: 'Vision de jeu agressive et contrôle des objectifs neutres.',
    stats: { winRate: '63%', kda: '3.8', matchesPlayed: 35 },
    isStarter: true
  },
  // Roster CS2
  {
    gamertag: 'K1ng',
    realName: 'Alexandre Roux',
    nationality: 'FR',
    game: 'Counter-Strike 2',
    role: 'AWPer',
    rank: 'Global Elite',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    bio: 'Tireur d\'élite sur CS2 avec un temps de réaction éclair.',
    stats: { winRate: '69%', kda: '1.51', matchesPlayed: 50 },
    isStarter: true
  }
];

const sampleMatches = [
  {
    tournamentName: 'EMEA Masters Spring 2026',
    game: 'Valorant',
    opponent: 'Team Vitality Academy',
    opponentLogo: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=200&q=80',
    matchDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Dans 2 jours
    format: 'BO3',
    status: 'upcoming',
    streamUrl: 'https://twitch.tv'
  },
  {
    tournamentName: 'LFL Div 2 Play-offs',
    game: 'League of Legends',
    opponent: 'Karmine Corp Blue',
    opponentLogo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=200&q=80',
    matchDate: new Date(),
    format: 'BO5',
    status: 'live',
    scoreDWT: 1,
    scoreOpponent: 1,
    streamUrl: 'https://twitch.tv'
  },
  {
    tournamentName: 'Challengers Cup France',
    game: 'Valorant',
    opponent: 'Gentle Mates Prospects',
    opponentLogo: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=200&q=80',
    matchDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    format: 'BO3',
    status: 'finished',
    scoreDWT: 2,
    scoreOpponent: 1,
    mvp: 'Phantom (48 frags)'
  }
];

const sampleAchievements = [
  {
    title: 'Vainqueur de la Coupe d\'Hiver 2025',
    tournament: 'Winter Esports Cup',
    game: 'Valorant',
    placement: '1ère Place 🏆',
    prizePool: '5 000 €',
    description: 'Victoire 3-0 en grande finale sans concéder une seule carte.'
  },
  {
    title: 'Finaliste EMEA Masters Challengers',
    tournament: 'EMEA Challenger Circuit',
    game: 'League of Legends',
    placement: 'Finaliste 🥈',
    prizePool: '2 500 €',
    description: 'Parcours historique du roster LoL jusqu\'en finale.'
  }
];

const sampleProducts = [
  {
    name: 'Maillot Officiel DWT 2026',
    description: 'Le maillot officiel de compétition porté par nos joueurs pros en LAN et tournois internationaux. Tissu respirant haute performance, broderie premium du loup.',
    price: 69.99,
    comparePrice: 79.99,
    images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80'],
    category: 'Maillots',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    stockCount: 45,
    isFeatured: true,
    rating: 4.9,
    numReviews: 18
  },
  {
    name: 'Hoodie Pro Dark Wolf - Edition Limitée',
    description: 'Sweat à capuche ultra confortable doublé polaire avec logo cyberpunk de la Dark Wolf Team. Idéal pour les longues sessions de gaming.',
    price: 79.99,
    comparePrice: 89.99,
    images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80'],
    category: 'Vêtements',
    sizes: ['S', 'M', 'L', 'XL'],
    stockCount: 30,
    isFeatured: true,
    rating: 5.0,
    numReviews: 12
  },
  {
    name: 'Tapis de Souris XXL Speed - Wolfpack',
    description: 'Surface textile micro-tissée 900x400mm optimisée pour capteurs optiques haute précision. Base en caoutchouc antidérapante et coutures renforcées.',
    price: 29.99,
    images: ['https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80'],
    category: 'Périphériques',
    sizes: ['XXL (90x40cm)'],
    stockCount: 80,
    isFeatured: true,
    rating: 4.8,
    numReviews: 24
  },
  {
    name: 'Casquette Snapback Dark Wolf',
    description: 'Casquette noire sobre avec broderie 3D DWT sur le devant. Taille ajustable à l\'arrière.',
    price: 24.99,
    images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80'],
    category: 'Accessoires',
    sizes: ['Taille Unique'],
    stockCount: 50,
    isFeatured: false,
    rating: 4.7,
    numReviews: 8
  }
];

const seedData = async () => {
  try {
    console.log('Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connecté à la base de données !');

    // 1. Créer ou mettre à jour l'utilisateur Administrateur
    let admin = await User.findOne({ email: 'admin@darkwolfteam.gg' });
    if (!admin) {
      admin = await User.create({
        gamertag: 'DWT_Shadow',
        email: 'admin@darkwolfteam.gg',
        password: 'AdminPassword2026!',
        role: 'admin',
        bio: 'Fondateur & Manager général de la Dark Wolf Team 🐺'
      });
      console.log('✅ Compte Administrateur créé : admin@darkwolfteam.gg / AdminPassword2026!');
    }

    // 2. Joueurs (conservés vides pour gestion via admin)
    console.log('ℹ️ Gestion des joueurs active via le dashboard Admin.');

    // 3. Matchs
    const existingMatchesCount = await Match.countDocuments();
    if (existingMatchesCount === 0) {
      await Match.insertMany(sampleMatches);
      console.log(`✅ ${sampleMatches.length} matchs insérés.`);
    }

    // 4. Succès / Palmarès
    const existingAchievementsCount = await Achievement.countDocuments();
    if (existingAchievementsCount === 0) {
      await Achievement.insertMany(sampleAchievements);
      console.log(`✅ ${sampleAchievements.length} trophées insérés.`);
    }

    // 5. Article de News
    const existingNewsCount = await News.countDocuments();
    if (existingNewsCount === 0) {
      await News.create({
        title: 'Dark Wolf Team prépare sa saison esport 2026 !',
        summary: 'Découvrez nos nouveaux rosters Valorant et League of Legends ainsi que les prochains rendez-vous de compétition.',
        content: `La Dark Wolf Team est fière de vous présenter ses ambitions pour l'année 2026. Avec des rosters renforcés sur Valorant, League of Legends et Counter-Strike 2, la meute est prête à conquérir les circuits majeurs. Rejoignez-nous sur Twitch et Discord pour ne rien manquer de nos aventures !`,
        category: 'Esport',
        game: 'Général',
        author: admin._id,
        authorName: admin.gamertag,
        isFeatured: true
      });
      console.log('✅ Article de bienvenue inséré.');
    }

    // 6. Produits de la Boutique
    console.log('ℹ️ Boutique prête pour ajout des produits par l\'administrateur.');

    console.log('🐺 Base de données Dark Wolf Team initialisée avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seeding :', error);
    process.exit(1);
  }
};

seedData();
