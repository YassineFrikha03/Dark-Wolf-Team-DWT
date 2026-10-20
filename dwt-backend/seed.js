const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('./models/User');
const Player = require('./models/Player');
const Match = require('./models/Match');
const News = require('./models/News');
const Achievement = require('./models/Achievement');
const Product = require('./models/Product');
const Mission = require('./models/Mission');

dotenv.config();

const allProducts = [
  {
    name: 'Wolf Jersey Pro',
    description: 'Championship-grade jersey. Moisture-wicking fabric. DWT embroidered crest. Worn by the pros, made for the pack.',
    price: 89,
    comparePrice: 0,
    category: 'Pro Kit',
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80'],
    isFeatured: true,
    rating: 5,
    stockCount: 50
  },
  {
    name: 'DWT Hoodie Black',
    description: 'Heavy fleece hoodie with wolf howl graphic on back. Dark Lab premium material. Cold nights, hot wins.',
    price: 120,
    comparePrice: 0,
    category: 'New Collection',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80'],
    isFeatured: true,
    rating: 5,
    stockCount: 35
  },
  {
    name: 'Dark Lab Cap',
    description: 'Structured snapback with embroidered Dark Lab logo. One size fits most. Adjustable snap closure.',
    price: 45,
    comparePrice: 0,
    category: 'Accessories',
    sizes: ['One Size'],
    images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80'],
    isFeatured: false,
    rating: 4.8,
    stockCount: 60
  },
  {
    name: 'Wolf Collab Tee',
    description: 'Limited collab edition. Wolf silhouette art by local designer. 180g combed cotton. Only 200 units produced.',
    price: 75,
    comparePrice: 95,
    category: 'Collabs',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80'],
    isFeatured: true,
    rating: 4.9,
    stockCount: 20
  }
];

const allPlayers = [
  // Valorant
  { gamertag: 'ShadowFang', realName: 'Yassine F.', game: 'Valorant', role: 'IGL / Rifler', rank: 'Radiant', stats: { winRate: '68%', kda: '1.42', matchesPlayed: 45 }, avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=400&q=80' },
  { gamertag: 'NightWolf', realName: 'Karim B.', game: 'Valorant', role: 'Duelist', rank: 'Radiant', stats: { winRate: '72%', kda: '1.68', matchesPlayed: 42 }, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80' },
  { gamertag: 'GhostByte', realName: 'Lucas B.', game: 'Valorant', role: 'Sentinel', rank: 'Immortal 3', stats: { winRate: '64%', kda: '1.21', matchesPlayed: 38 }, avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80' },
  { gamertag: 'IronFrost', realName: 'Alex D.', game: 'Valorant', role: 'Controller', rank: 'Immortal 2', stats: { winRate: '61%', kda: '1.15', matchesPlayed: 36 }, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
  { gamertag: 'DarkStrike', realName: 'Sami M.', game: 'Valorant', role: 'Initiator', rank: 'Radiant', stats: { winRate: '66%', kda: '1.33', matchesPlayed: 40 }, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },

  // FC 25
  { gamertag: 'WolfKing', realName: 'Adem C.', game: 'FC 25', role: 'Striker', rank: 'Elite Division', stats: { winRate: '75%', kda: '92 OVR', matchesPlayed: 60 }, avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80' },
  { gamertag: 'SilentBlade', realName: 'Mehdi K.', game: 'FC 25', role: 'Midfielder', rank: 'Division 1', stats: { winRate: '70%', kda: '88 OVR', matchesPlayed: 54 }, avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80' },
  { gamertag: 'Phantom99', realName: 'Rayan S.', game: 'FC 25', role: 'Goalkeeper', rank: 'Division 1', stats: { winRate: '68%', kda: '85 OVR', matchesPlayed: 48 }, avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80' },

  // Call of Duty
  { gamertag: 'GhostOps', realName: 'Thomas M.', game: 'Call of Duty', role: 'Entry Fragger', rank: 'Top 250', stats: { winRate: '69%', kda: '2.10', matchesPlayed: 55 }, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
  { gamertag: 'IronWolf', realName: 'Bilel Z.', game: 'Call of Duty', role: 'Support', rank: 'Crimson', stats: { winRate: '65%', kda: '1.80', matchesPlayed: 50 }, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80' },
  { gamertag: 'SilentKill', realName: 'Maxime R.', game: 'Call of Duty', role: 'Sniper', rank: 'Iridescent', stats: { winRate: '71%', kda: '2.40', matchesPlayed: 52 }, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80' },

  // PUBG Mobile
  { gamertag: 'NightHunter', realName: 'Hamza T.', game: 'PUBG Mobile', role: 'Sniper', rank: 'Conqueror', stats: { winRate: '74%', kda: '4.20', matchesPlayed: 65 }, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80' },
  { gamertag: 'StormRider', realName: 'Nassim B.', game: 'PUBG Mobile', role: 'Support', rank: 'Ace Dominator', stats: { winRate: '67%', kda: '3.10', matchesPlayed: 58 }, avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80' },

  // Fortnite
  { gamertag: 'DarkPack', realName: 'Fares L.', game: 'Fortnite', role: 'Rusher', rank: 'Unreal', stats: { winRate: '70%', kda: '8.50', matchesPlayed: 70 }, avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80' },
  { gamertag: 'WolfAim', realName: 'Cyrine M.', game: 'Fortnite', role: 'Builder', rank: 'Unreal', stats: { winRate: '68%', kda: '7.20', matchesPlayed: 64 }, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },

  // Rocket League
  { gamertag: 'RocketWolf', realName: 'Amine J.', game: 'Rocket League', role: 'Striker', rank: 'Supersonic Legend', stats: { winRate: '73%', kda: '1450 MMR', matchesPlayed: 80 }, avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=400&q=80' },
  { gamertag: 'BoostMaster', realName: 'Walid G.', game: 'Rocket League', role: 'Midfield', rank: 'Grand Champion III', stats: { winRate: '66%', kda: '1380 MMR', matchesPlayed: 75 }, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },

  // EA Sports FC
  { gamertag: 'AlphaStriker', realName: 'Selim N.', game: 'EA Sports FC', role: 'Striker', rank: 'Division 1', stats: { winRate: '72%', kda: '91 OVR', matchesPlayed: 58 }, avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80' }
];

const allMatches = [
  { tournamentName: 'Regional Championship Finals', game: 'Valorant', opponent: 'Phoenix GG', matchDate: new Date(), format: 'BO3', status: 'live', scoreDWT: 1, scoreOpponent: 0, streamUrl: 'https://twitch.tv' },
  { tournamentName: 'Summer Cup 2026', game: 'FC 25', opponent: 'Atlas FC', matchDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), format: 'BO1', status: 'upcoming', streamUrl: 'https://twitch.tv' },
  { tournamentName: 'COD Warzone Clash', game: 'Call of Duty', opponent: 'Storm Team', matchDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), format: 'BO5', status: 'upcoming' },
  { tournamentName: 'PUBG Mobile MENA Cup', game: 'PUBG Mobile', opponent: 'Iron Wolves', matchDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), format: 'Battle Royale', status: 'upcoming' },
  { tournamentName: 'Fortnite FNCS Qualifier', game: 'Fortnite', opponent: 'NightOwls', matchDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000), format: 'Duos', status: 'upcoming' },
  { tournamentName: 'Rocket League Open', game: 'Rocket League', opponent: 'TurboFC', matchDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000), format: 'BO5', status: 'upcoming' },
  { tournamentName: 'EA Sports FC Invitational', game: 'EA Sports FC', opponent: 'ProKicks', matchDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), format: 'BO3', status: 'upcoming' },
  { tournamentName: 'Valorant Pro Series', game: 'Valorant', opponent: 'AlphaCrew', matchDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000), format: 'BO3', status: 'upcoming' }
];

const allNews = [
  {
    title: 'Dark Wolf Team Claims Regional Championship — The Pack Rises to the Top',
    summary: 'Une victoire historique 3-0 en finale régionale affirmant la suprématie de la Dark Wolf Team sur la scène esport nord-africaine et MENA.',
    content: 'Dark Wolf Team s impose avec autorite dans la Grande Finale regionale. Devant des milliers de supporters en ligne, la meute a demonte ses adversaires avec precision tactique et discipline.',
    category: 'Tournoi',
    game: 'Valorant',
    isFeatured: true
  },
  {
    title: 'DWT Valorant squad qualifies for MENA Open Finals',
    summary: 'Le roster Valorant valide son ticket pour les finales MENA Open après un parcours sans faute en phase de poules.',
    content: 'Qualification brillante pour nos joueurs Valorant qui confirment leur etat de forme exceptionnel.',
    category: 'Tournoi',
    game: 'Valorant',
    isFeatured: false
  },
  {
    title: 'New signings in DWT FC25 roster for Summer Split',
    summary: 'Deux nouveaux prodiges rejoignent la section FC 25 pour attaquer le Summer Split 2026 avec ambition.',
    content: 'La meute s agrandit avec l arrivee de nouveaux talents sur la scene EA FC 25.',
    category: 'Recrutement',
    game: 'FC 25',
    isFeatured: false
  },
  {
    title: 'Call of Duty team heads to Grand Finals — Live coverage',
    summary: 'Notre escouade Call of Duty se hisse jusqu en Grande Finale ! Suivez le match en direct avec nous.',
    content: 'Rendez-vous sur notre chaîne Twitch pour vibrer au rythme des clutchs et du grind de l equipe COD.',
    category: 'Esport',
    game: 'Call of Duty',
    isFeatured: false
  }
];

const seedData = async () => {
  try {
    console.log('Connexion à MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connecté à la base de données !');

    // 1. Admin account
    let admin = await User.findOne({ email: 'admin@darkwolfteam.gg' });
    if (!admin) {
      admin = await User.create({
        gamertag: 'DWT_Shadow',
        email: 'admin@darkwolfteam.gg',
        password: 'AdminPassword2026!',
        role: 'admin',
        bio: 'Fondateur & Manager général de la Dark Wolf Team 🐺'
      });
      console.log('✅ Admin créé.');
    }

    // 2. Produits (insérer ceux qui n'existent pas encore)
    for (const p of allProducts) {
      const exists = await Product.findOne({ name: p.name });
      if (!exists) {
        await Product.create(p);
        console.log(`✅ Produit ajouté : ${p.name}`);
      }
    }

    // 3. Joueurs
    for (const pl of allPlayers) {
      const exists = await Player.findOne({ gamertag: pl.gamertag });
      if (!exists) {
        await Player.create(pl);
        console.log(`✅ Joueur ajouté : ${pl.gamertag} (${pl.game})`);
      }
    }

    // 4. Matchs
    for (const m of allMatches) {
      const exists = await Match.findOne({ opponent: m.opponent, game: m.game });
      if (!exists) {
        await Match.create(m);
        console.log(`✅ Match ajouté : DWT vs ${m.opponent} (${m.game})`);
      }
    }

    // 5. News
    for (const n of allNews) {
      const exists = await News.findOne({ title: n.title });
      if (!exists) {
        n.author = admin._id;
        n.authorName = admin.gamertag;
        await News.create(n);
        console.log(`✅ Article ajouté : ${n.title}`);
      }
    }

    // 6. Missions Hebdomadaires Wolf Pack
    const initialMissions = [
      {
        code: 'vote_mvp',
        title: 'Vote MVP du Match',
        description: 'Votez pour le joueur le plus décisif (MVP) de la dernière rencontre DWT.',
        points: 30,
        xp: 30,
        icon: 'Award',
        actionType: 'vote_mvp',
        actionUrl: '#news',
        order: 1
      },
      {
        code: 'predict_match',
        title: 'Pronostic de Match',
        description: 'Pronostiquez le score et le vainqueur du prochain match officiel de la meute.',
        points: 40,
        xp: 40,
        icon: 'Target',
        actionType: 'predict_match',
        actionUrl: '#predictions',
        order: 2
      },
      {
        code: 'watch_video',
        title: 'Visionner la Vidéo DWT',
        description: 'Regardez les derniers temps forts ou la vidéo officielle de la chaîne DWT.',
        points: 25,
        xp: 25,
        icon: 'Tv',
        actionType: 'watch_video',
        actionUrl: 'https://youtube.com',
        order: 3
      },
      {
        code: 'community_challenge',
        title: 'Défi Communautaire',
        description: 'Participez au challenge hebdomadaire des loups sur le Discord officiel.',
        points: 35,
        xp: 35,
        icon: 'Users',
        actionType: 'community_challenge',
        actionUrl: '#join',
        order: 4
      },
      {
        code: 'visit_shop',
        title: 'Explorer le Dark Lab',
        description: 'Visitez la collection officielle et découvrez les nouveaux maillots DWT.',
        points: 15,
        xp: 15,
        icon: 'ShoppingBag',
        actionType: 'visit_shop',
        actionUrl: '#shop',
        order: 5
      }
    ];

    for (const m of initialMissions) {
      const exists = await Mission.findOne({ code: m.code });
      if (!exists) {
        await Mission.create(m);
        console.log(`✅ Mission ajoutée : ${m.title}`);
      }
    }

    // 7. Fans de démonstration pour le Classement (Leaderboard)
    const demoFans = [
      {
        gamertag: 'AlphaWolf_TN',
        email: 'alpha_fan@darkwolfteam.gg',
        password: 'Password123!',
        wolfRank: 'Alpha',
        wolfPoints: 2450,
        wolfXP: 2450,
        avatarFrame: 'alpha_fire',
        predictionStats: { total: 24, won: 18, pointsWon: 1450, mvpGuesses: 8 },
        wolfBadges: [
          { id: 'rank_alpha', title: 'Alpha Suprême', description: 'Meneur légendaire de la meute.', icon: 'Award' },
          { id: 'oracle_wolf', title: 'Oracle de la Meute', description: 'A prédit correctement 5+ matchs.', icon: 'Trophy' }
        ]
      },
      {
        gamertag: 'Saber_Sniper',
        email: 'saber@darkwolfteam.gg',
        password: 'Password123!',
        wolfRank: 'Hunter',
        wolfPoints: 1320,
        wolfXP: 1320,
        avatarFrame: 'hunter_gold',
        predictionStats: { total: 16, won: 12, pointsWon: 920, mvpGuesses: 5 },
        wolfBadges: [
          { id: 'rank_hunter', title: 'Chasseur d\'Élite', description: 'Traqueur de succès esports.', icon: 'Award' }
        ]
      },
      {
        gamertag: 'CarthageGhost',
        email: 'ghost@darkwolfteam.gg',
        password: 'Password123!',
        wolfRank: 'Scout',
        wolfPoints: 680,
        wolfXP: 680,
        avatarFrame: 'scout_silver',
        predictionStats: { total: 10, won: 7, pointsWon: 480, mvpGuesses: 2 },
        wolfBadges: [
          { id: 'rank_scout', title: 'Éclaireur Féroce', description: 'Guide la meute.', icon: 'Award' }
        ]
      }
    ];

    for (const df of demoFans) {
      const exists = await User.findOne({ email: df.email });
      if (!exists) {
        await User.create(df);
        console.log(`✅ Fan du Leaderboard créé : ${df.gamertag} (${df.wolfRank})`);
      }
    }

    console.log('🐺 Données Dark Wolf Team synchronisées avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur seeding :', error);
    process.exit(1);
  }
};

seedData();
