const Newsletter = require('../models/Newsletter');
const { sendNewsletterBroadcast } = require('../config/mailer');

// @desc    S'inscrire à la newsletter de la Dark Wolf Team
// @route   POST /api/newsletter/subscribe
// @access  Public
const subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir une adresse email valide'
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    let subscriber = await Newsletter.findOne({ email: cleanEmail });

    if (subscriber) {
      if (!subscriber.isActive) {
        subscriber.isActive = true;
        await subscriber.save();
        return res.status(200).json({
          success: true,
          message: 'Votre abonnement à la newsletter a été réactivé ! 🐺'
        });
      }
      return res.status(400).json({
        success: false,
        message: 'Cet email est déjà inscrit aux actualités de l\'équipe'
      });
    }

    subscriber = await Newsletter.create({ email: cleanEmail });

    res.status(201).json({
      success: true,
      message: 'Inscription à la newsletter réussie ! Tu recevras nos actualités esport.',
      subscriber
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Se désabonner de la newsletter
// @route   POST /api/newsletter/unsubscribe
// @access  Public
const unsubscribe = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Adresse email requise'
      });
    }

    const subscriber = await Newsletter.findOne({ email: email.toLowerCase().trim() });
    if (subscriber) {
      subscriber.isActive = false;
      await subscriber.save();
    }

    res.status(200).json({
      success: true,
      message: 'Vous avez été désabonné de la newsletter avec succès'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Envoyer un broadcast email à tous les abonnés
// @route   POST /api/newsletter/broadcast
// @access  Privé (Admin)
const broadcastNews = async (req, res, next) => {
  try {
    const { subject, content } = req.body;

    if (!subject || !content) {
      return res.status(400).json({
        success: false,
        message: 'Sujet et contenu de l\'annonce obligatoires'
      });
    }

    const subscribers = await Newsletter.find({ isActive: true }).select('email');
    const recipientEmails = subscribers.map((s) => s.email);

    if (recipientEmails.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucun abonné actif dans la liste de diffusion'
      });
    }

    await sendNewsletterBroadcast(recipientEmails, subject, content);

    res.status(200).json({
      success: true,
      message: `Annonce envoyée à ${recipientEmails.length} abonnés ! 📨`,
      recipientCount: recipientEmails.length
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir la liste des abonnés (Admin)
// @route   GET /api/newsletter/subscribers
// @access  Privé (Admin)
const getSubscribers = async (req, res, next) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: subscribers.length,
      subscribers
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  subscribe,
  unsubscribe,
  broadcastNews,
  getSubscribers
};
