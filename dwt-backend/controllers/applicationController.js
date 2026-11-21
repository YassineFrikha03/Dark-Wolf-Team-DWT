const crypto = require('crypto');
const Application = require('../models/Application');
const Player = require('../models/Player');
const User = require('../models/User');
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const {
  sendApplicationSubmittedEmail,
  sendAdminApplicationAlert,
  sendTestScheduledEmail,
  sendApplicationAcceptedEmail,
  sendApplicationRejectedEmail,
  sendApplicationStatusEmail
} = require('../config/mailer');

// @desc    Soumettre une candidature pour rejoindre l'equipe (Tryout / Recrutement)
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

    const cleanEmail = email.toLowerCase().trim();

    // Verifier si une candidature existe deja pour cet email ou discord
    let application = await Application.findOne({
      $or: [{ email: cleanEmail }, { discordTag }]
    });

    if (application) {
      application.gamertag = gamertag.trim();
      application.email = cleanEmail;
      application.discordTag = discordTag.trim();
      application.age = Number(age);
      application.game = game;
      application.rank = rank;
      application.rolePreference = rolePreference || 'Flexible';
      application.experience = experience;
      if (trackerUrl) application.trackerUrl = trackerUrl;
      // Remettre en pending si ce n'etait pas deja accepte
      if (application.status !== 'accepted') {
        application.status = 'pending';
      }
      await application.save();
    } else {
      application = await Application.create({
        gamertag: gamertag.trim(),
        email: cleanEmail,
        discordTag: discordTag.trim(),
        age: Number(age),
        game,
        rank,
        rolePreference: rolePreference || 'Flexible',
        experience,
        trackerUrl: trackerUrl || ''
      });
    }

    // Creer une notification pour le Dashboard Admin
    await Notification.create({
      recipientRole: 'admin',
      type: 'message',
      title: `Nouvelle Candidature : ${application.gamertag}`,
      message: `[${game} - ${rank}] ${application.gamertag} a postule pour integrer la structure. Email : ${cleanEmail}`,
      metadata: {
        applicationId: application._id,
        gamertag: application.gamertag,
        email: cleanEmail,
        game,
        rank,
        discordTag
      }
    }).catch((err) => console.error('Erreur notification admin recrutement :', err.message));

    // Envoi des notifications par email via Nodemailer
    sendApplicationSubmittedEmail(application).catch((err) =>
      console.error('Erreur email confirmation candidat :', err.message)
    );
    sendAdminApplicationAlert(application).catch((err) =>
      console.error('Erreur email alerte admin recrutement :', err.message)
    );

    res.status(201).json({
      success: true,
      message: 'Votre candidature a ete transmise avec succes a la direction esport Dark Wolf Team. Vous recevrez une reponse par email.',
      application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Planifier la date et l'heure du test de recrutement
// @route   PUT /api/applications/:id/schedule-test
// @access  Prive (Admin/Staff)
const scheduleTest = async (req, res, next) => {
  try {
    const { testDate, testTime, testLocation, testNotes } = req.body;

    if (!testDate || !testTime) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez renseigner la date et l heure du test de recrutement'
      });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Candidature introuvable'
      });
    }

    application.testDate = new Date(testDate);
    application.testTime = String(testTime).trim();
    if (testLocation) application.testLocation = String(testLocation).trim();
    if (testNotes !== undefined) application.testNotes = String(testNotes).trim();
    application.status = 'test_scheduled';

    await application.save();

    // Envoi automatique de l'email officiel de convocation au joueur
    sendTestScheduledEmail(application).catch((err) =>
      console.error('Erreur envoi email convocation test :', err.message)
    );

    // Creer notification admin
    await Notification.create({
      recipientRole: 'admin',
      type: 'message',
      title: `Test de recrutement planifie : ${application.gamertag}`,
      message: `Test fixe au ${application.testDate.toLocaleDateString('fr-FR')} a ${application.testTime} pour ${application.gamertag} (${application.game}).`,
      metadata: {
        applicationId: application._id,
        gamertag: application.gamertag,
        game: application.game
      }
    }).catch(() => null);

    res.status(200).json({
      success: true,
      message: `Test de recrutement planifie avec succes pour ${application.gamertag}. L'email officiel de convocation a ete envoye a ${application.email}.`,
      application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir toutes les candidatures avec filtres
// @route   GET /api/applications
// @access  Prive (Admin/Staff)
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

// @desc    Obtenir les details d'une candidature
// @route   GET /api/applications/:id
// @access  Prive (Admin/Staff)
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

// @desc    Mettre a jour le statut d'une candidature (acceptee / refusee / en examen)
// @route   PUT /api/applications/:id/status
// @access  Prive (Admin/Staff)
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, adminNotes, notifyCandidate, customMessage } = req.body;

    if (!['pending', 'test_scheduled', 'under_review', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Statut invalide (pending, test_scheduled, under_review, accepted, rejected)'
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

    let createdPlayer = null;
    let userAccount = null;
    let generatedPassword = null;

    // Si la candidature est acceptee : generation du compte joueur et integration complete
    if (status === 'accepted') {
      const cleanGamertag = application.gamertag.trim();
      const cleanEmail = application.email.toLowerCase().trim();

      // Generation d'un mot de passe temporaire securise
      generatedPassword = 'DWT-' + crypto.randomBytes(4).toString('hex').toUpperCase();
      application.generatedPassword = generatedPassword;

      // 1. Creation ou mise a jour du Player officiel pour le roster
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
          rank: application.rank || 'Competitif',
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

      // 2. Creation ou mise a jour du compte User (Role: player)
      userAccount = await User.findOne({
        $or: [
          { email: cleanEmail },
          { gamertag: { $regex: new RegExp(`^${cleanGamertag}$`, 'i') } }
        ]
      });

      if (userAccount) {
        userAccount.role = 'player';
        userAccount.password = generatedPassword; // Le hook pre('save') hash automatiquement le mot de passe
        if (application.discordTag) userAccount.discordTag = application.discordTag;
        if (application.game) userAccount.favoriteGame = application.game;
        await userAccount.save();
      } else {
        userAccount = await User.create({
          gamertag: cleanGamertag,
          email: cleanEmail,
          password: generatedPassword,
          role: 'player',
          discordTag: application.discordTag || '',
          favoriteGame: application.game || 'Valorant',
          bio: `Joueur officiel Dark Wolf Team sur ${application.game}.`
        });
      }

      // 3. Ouvrir l'espace de messagerie entre l'Admin et le Joueur
      let adminSenderId = req.user?._id;
      if (!adminSenderId) {
        const adminUser = await User.findOne({ role: 'admin' });
        if (adminUser) adminSenderId = adminUser._id;
      }

      if (adminSenderId && userAccount?._id) {
        const welcomeText = `Bienvenue dans la meute Dark Wolf Team, ${cleanGamertag}. Votre candidature pour le roster ${application.game} a ete validee avec succes suite a votre test. Cet espace de messagerie securise vous permet d'echanger directement avec le staff. Preparez-vous pour les prochains entrainements et matchs officiels.`;
        
        await Message.create({
          sender: adminSenderId,
          receiver: userAccount._id,
          content: welcomeText
        }).catch(() => null);

        await Notification.create({
          recipient: userAccount._id,
          recipientRole: 'user',
          type: 'message',
          title: 'Admission confirmee dans la Dark Wolf Team',
          message: `Votre candidature sur ${application.game} a ete acceptee. Vos coordonnees et votre Espace Joueur sont desormais actifs.`,
          metadata: { senderId: adminSenderId }
        }).catch(() => null);
      }

      // 4. Envoi de l'email officiel avec les identifiants generes
      if (notifyCandidate !== false) {
        sendApplicationAcceptedEmail(application, generatedPassword).catch((err) =>
          console.error('Erreur email admission candidat :', err.message)
        );
      }
    } else if (status === 'rejected') {
      // Envoi de l'email de refus poli et remerciement
      if (notifyCandidate !== false) {
        sendApplicationRejectedEmail(application, customMessage || adminNotes).catch((err) =>
          console.error('Erreur email refus candidature :', err.message)
        );
      }
    }

    await application.save();

    res.status(200).json({
      success: true,
      message: status === 'accepted'
        ? `Candidature validee avec succes. Le joueur ${application.gamertag} a ete integre au roster et un mot de passe a ete genere (${generatedPassword}). L'email officiel lui a ete transmis.`
        : `Statut de la candidature mis a jour (${status}) et notification transmise au candidat.`,
      application,
      generatedPassword: generatedPassword || application.generatedPassword,
      player: createdPlayer,
      user: userAccount
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer une candidature
// @route   DELETE /api/applications/:id
// @access  Prive (Admin)
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
      message: 'Candidature supprimee avec succes'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitApplication,
  scheduleTest,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication
};
