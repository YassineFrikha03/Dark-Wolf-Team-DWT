const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');
const { generalApiLimiter } = require('./middlewares/rateLimiter');

// Charger les variables d'environnement
dotenv.config();

// Connexion à MongoDB
connectDB();

const app = express();

// Sécurité des headers HTTP
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);

// Logging des requêtes HTTP en dev
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Configuration CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Parsing du corps de requête (JSON & URL-encoded)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Limiteur de débit général
app.use('/api', generalApiLimiter);

// Dossier public pour les fichiers uploadés (avatars, bannières, logos)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import des routes
const authRoutes = require('./routes/authRoutes');
const playerRoutes = require('./routes/playerRoutes');
const matchRoutes = require('./routes/matchRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const newsRoutes = require('./routes/newsRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');
const contactRoutes = require('./routes/contactRoutes');
const achievementRoutes = require('./routes/achievementRoutes');
const statsRoutes = require('./routes/statsRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const messageRoutes = require('./routes/messageRoutes');
const gameRoutes = require('./routes/gameRoutes');
const slideRoutes = require('./routes/slideRoutes');
const museumRoutes = require('./routes/museumRoutes');
const predictionRoutes = require('./routes/predictionRoutes');
const missionRoutes = require('./routes/missionRoutes');
const wolfpackRoutes = require('./routes/wolfpackRoutes');
const videoRoutes = require('./routes/videoRoutes');

// Montage des routes d'API
app.use('/api/auth', authRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/slides', slideRoutes);
app.use('/api/museum', museumRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/wolfpack', wolfpackRoutes);
app.use('/api/videos', videoRoutes);

// Route d'accueil & de santé de l'API
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    name: 'Dark Wolf Team API 🐺🎮',
    status: 'online',
    version: '2.1.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      players: '/api/players',
      matches: '/api/matches',
      applications: '/api/applications',
      news: '/api/news',
      newsletter: '/api/newsletter',
      contact: '/api/contact',
      achievements: '/api/achievements',
      stats: '/api/stats',
      upload: '/api/upload',
      products: '/api/products',
      orders: '/api/orders',
      categories: '/api/categories',
      notifications: '/api/notifications',
      messages: '/api/messages'
    }
  });
});

// Route 404 pour les endpoints inexistants
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `La route demandée (${req.originalUrl}) n'existe pas sur le serveur DWT.`
  });
});

// Middleware global de traitement des erreurs
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Serveur Dark Wolf Team démarré sur http://localhost:${PORT}`);
  console.log(`API prête à l'adresse : http://localhost:${PORT}/api`);
});

// Gestion des rejets de promesses non gérés
process.on('unhandledRejection', (err) => {
  console.error(`Erreur Unhandled Rejection : ${err.message}`);
  // Fermeture gracieuse
  // server.close(() => process.exit(1));
});

module.exports = app;