const Application = require('../models/Application');
const Player = require('../models/Player');
const User = require('../models/User');
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const {
  sendApplicationSubmittedEmail,
  sendAdminApplicationAlert,
  sendApplicationStatusEmail
} = require('../config/mailer');

// @desc    Soumettre une candidature pour rejoindre l'équipe (Tryout / Recrutement)
// @route   POST /api/applications
// @access  Public
const submitApplication = async (req, res, next) => {
  try {
    const {
      gamertag,
      email,
      discordTag,
      age,
      game,
      rank,
      rolePreference,
      experience,
      trackerUrl
    } = req.body;

    if (!gamertag || !email || !discordTag || !age || !game || !rank || !experience) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez remplir tous les champs obligatoires du formulaire de recrutement'
      });
    }

    // Vérifier si une candidature existe déjà pour cet email ou discord
    let application = await Application.findOne({
      $or: [{ email: email.toLowerCase() }, { discordTag }]
    });

    if (application) {
      // Mettre à jour la candidature existante avec les nouvelles informations
      application.gamertag = gamertag;
      application.email = email.toLowerCase();
      application.discordTag = discordTag;
      application.age = age;
      application.game = game;
      application.rank = rank;
      application.rolePreference = rolePreference || 'Dueliste';
      application.experience = experience;
      if (trackerUrl) application.trackerUrl = trackerUrl;
      application.status = 'pending';
      await application.save();
    } else {
      application = await Application.create({
        gamertag,
        email: email.toLowerCase(),
        discordTag,
        age,
        game,
        rank,
        rolePreference,
        experience,
        trackerUrl
      });
    }

    // Créer une notification immédiate pour le Dashboard Admin
    await Notification.create({
      recipientRole: 'admin',
      type: 'message',
      title: `🐺 Nouvelle Candidature : ${gamertag}`,
      message: `[${game} - ${rank}] ${gamertag} a postulé pour intégrer la meute. Email : ${email}`,
      metadata: {
        applicationId: application._id,
        gamertag,
        email: email.toLowerCase(),
        game,
        rank,
        discordTag
      }
    }).catch((err) => console.error('Erreur notification admin recrutement :', err.message));

    // Envoi des notifications par email via Nodemailer
    sendApplicationSubmittedEmail(application).catch((err) =>
      console.error('Erreur email confirmation joueur :', err.message)
    );
    sendAdminApplicationAlert(application).catch((err) =>
      console.error('Erreur email alerte admin recrutement :', err.message)
    );

    res.status(201).json({
      success: true,
      message: 'Ta candidature a été envoyée avec succès au staff Dark Wolf Team ! Elle est visible dans le dashboard admin. 🐺🎯',
      application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir toutes les candidatures avec filtres
// @route   GET /api/applications
// @access  Privé (Admin/Staff)
const getApplications = async (req, res, next) => {
  try {
    const { status, game, search } = req.query;
    let query = {};

    if (status) query.status = status;
    if (game) query.game = { $regex: new RegExp(game, 'i') };
    if (search) {
      query.$or = [
        { gamertag: { $regex: search, $options: 'i' } },
        { discordTag: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const applications = await Application.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir les détails d'une candidature
// @route   GET /api/applications/:id
// @access  Privé (Admin/Staff)
const getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Candidature introuvable'
      });
    }

    res.status(200).json({
      success: true,
      application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour le statut d'une candidature (acceptée / refusée / en examen) + envoi d'email
// @route   PUT /api/applications/:id/status
// @access  Privé (Admin/Staff)
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, adminNotes, notifyCandidate, customMessage } = req.body;

    if (!['pending', 'under_review', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Statut invalide (pending, under_review, accepted, rejected)'
      });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Candidature introuvable'
      });
    }

    application.status = status;
    if (adminNotes !== undefined) application.adminNotes = adminNotes;
    await application.save();

    let createdPlayer = null;
    let userAccount = null;

    // Si la candidature est acceptée : intégration automatique au roster et ouverture de la communication
    if (status === 'accepted') {
      // 1. Ajouter le joueur à la liste officielle des joueurs (Player) s'il n'existe pas encore
      const cleanGamertag = application.gamertag.trim();
      let existingPlayer = await Player.findOne({
        gamertag: { $regex: new RegExp(`^${cleanGamertag}$`, 'i') }
      });

      if (!existingPlayer) {
        existingPlayer = await Player.create({
          gamertag: cleanGamertag,
          realName: '',
          nationality: 'FR',
          game: application.game || 'Valorant',
          role: application.rolePreference || 'Dueliste',
          rank: application.rank || 'Compétitif',
          avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=400&q=80',
          bio: application.experience
            ? (application.experience.length > 150 ? application.experience.slice(0, 147) + '...' : application.experience)
            : `Joueur officiel de la meute Dark Wolf Team sur ${application.game}.`,
          socialLinks: {
            discord: application.discordTag || ''
          },
          isStarter: true,
          isActive: true
        });
      }
      createdPlayer = existingPlayer;

      // 2. Vérifier ou créer le compte utilisateur (User) avec le rôle 'player'
      const cleanEmail = application.email.toLowerCase().trim();
      userAccount = await User.findOne({
        $or: [
          { email: cleanEmail },
          { gamertag: { $regex: new RegExp(`^${cleanGamertag}$`, 'i') } }
        ]
      });

      if (userAccount) {
        userAccount.role = 'player';
        if (application.discordTag) userAccount.discordTag = application.discordTag;
        if (application.game) userAccount.favoriteGame = application.game;
        await userAccount.save();
      } else {
        // Créer un compte pour que le joueur puisse se connecter à l'espace joueur (PlayerDashboard)
        const tempPassword = 'DWT2026!player';
        userAccount = await User.create({
          gamertag: cleanGamertag,
          email: cleanEmail,
          password: tempPassword,
          role: 'player',
          discordTag: application.discordTag || '',
          favoriteGame: application.game || 'Valorant',
          bio: `Joueur officiel Dark Wolf Team sur ${application.game}.`
        });
      }

      // 3. Ouvrir l'espace de communication entre l'Admin et le Joueur
      const adminSenderId = req.user?._id;
      if (adminSenderId && userAccount?._id) {
        const welcomeText = `🐺 Bienvenue dans la meute Dark Wolf Team, ${cleanGamertag} ! Ta candidature pour le roster ${application.game} a été validée avec succès. Cet espace de messagerie privé te permet d'échanger en direct avec le staff. Prépare-toi pour les scrims et tournois !`;
        
        await Message.create({
          sender: adminSenderId,
          receiver: userAccount._id,
          content: welcomeText
        });

        await Notification.create({
          recipient: userAccount._id,
          recipientRole: 'user',
          type: 'message',
          title: '🐺 Félicitations, tu rejoins la Dark Wolf Team !',
          message: `Ta candidature sur ${application.game} a été acceptée par le staff ! Rendez-vous sur ton Espace Joueur.`,
          metadata: { senderId: adminSenderId }
        }).catch(err => console.error('Erreur notification joueur :', err.message));
      }
    }

    // Notifier le candidat par email si demandé (par défaut oui si accepted/rejected)
    if (notifyCandidate !== false && (status === 'accepted' || status === 'rejected')) {
      sendApplicationStatusEmail(application, customMessage || adminNotes).catch((err) =>
        console.error('Erreur email statut candidature :', err.message)
      );
    }

    res.status(200).json({
      success: true,
      message: status === 'accepted'
        ? `Candidature acceptée ! Le joueur ${application.gamertag} a été automatiquement ajouté au roster officiel et son espace de communication est activé. 🐺🎮`
        : `Statut de la candidature mis à jour (${status}) et notification par email envoyée !`,
      application,
      player: createdPlayer,
      user: userAccount
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer une candidature
// @route   DELETE /api/applications/:id
// @access  Privé (Admin)
const deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Candidature introuvable'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Candidature supprimée'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitApplication,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication
};
