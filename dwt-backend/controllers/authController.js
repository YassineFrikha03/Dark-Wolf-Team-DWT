const jwt = require('jsonwebtoken');
const User = require('../models/User');
const generateSecurityCode = require('../utils/generateCode');
const {
  sendWelcomeEmail,
  sendAdminNewUserAlert,
  sendPasswordResetCodeEmail,
  sendLoginAlertEmail
} = require('../config/mailer');

// Générateur de token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'dark_wolf_team_secret_key_2026', {
    expiresIn: '30d'
  });
};

// @desc    Inscription d'un nouvel utilisateur
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { gamertag, email, password } = req.body;

    if (!gamertag || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez renseigner un pseudo, un email et un mot de passe'
      });
    }

    // Vérifier si l'email existe déjà
    const emailExists = await User.findOne({ email: email.toLowerCase() });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: 'Cette adresse email est déjà associée à un compte'
      });
    }

    // Vérifier si le gamertag existe déjà
    const gamertagExists = await User.findOne({ gamertag });
    if (gamertagExists) {
      return res.status(400).json({
        success: false,
        message: 'Ce gamertag (pseudo) est déjà utilisé par un autre joueur'
      });
    }

    // Créer le compte
    const user = await User.create({
      gamertag,
      email: email.toLowerCase(),
      password
    });

    const token = generateToken(user._id);

    // Envoi des emails asynchrones sans bloquer la réponse
    sendWelcomeEmail(user).catch((err) =>
      console.error('Erreur email bienvenue :', err.message)
    );
    sendAdminNewUserAlert(user).catch((err) =>
      console.error('Erreur email admin :', err.message)
    );

    res.status(201).json({
      success: true,
      message: 'Compte créé avec succès ! Bienvenue chez Dark Wolf Team 🐺',
      token,
      user: {
        id: user._id,
        gamertag: user.gamertag,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        discordTag: user.discordTag
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Connexion d'un utilisateur
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { identifier, email, password } = req.body;
    const loginId = identifier || email;

    if (!loginId || !password) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir votre email (ou pseudo) et votre mot de passe'
      });
    }

    // Recherche par email OU par gamertag
    const user = await User.findOne({
      $or: [
        { email: loginId.toLowerCase() },
        { gamertag: loginId }
      ]
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants incorrects'
      });
    }

    // Vérification du mot de passe
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants incorrects'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Votre compte a été suspendu par l\'administration'
      });
    }

    // Mise à jour de la dernière connexion
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);

    // Optionnel : Notification par email de la connexion
    if (process.env.NOTIFY_ON_LOGIN === 'true') {
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const agent = req.headers['user-agent'];
      sendLoginAlertEmail(user, ip, agent).catch((err) =>
        console.error('Erreur alerte login :', err.message)
      );
    }

    res.status(200).json({
      success: true,
      message: `Ravi de te revoir, ${user.gamertag} ! 🐺`,
      token,
      user: {
        id: user._id,
        gamertag: user.gamertag,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        discordTag: user.discordTag,
        favoriteGame: user.favoriteGame,
        socialLinks: user.socialLinks
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir le profil de l'utilisateur connecté
// @route   GET /api/auth/me
// @access  Privé
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour le profil de l'utilisateur connecté
// @route   PUT /api/auth/profile
// @access  Privé
const updateProfile = async (req, res, next) => {
  try {
    const { gamertag, bio, avatar, discordTag, favoriteGame, socialLinks } = req.body;

    const user = await User.findById(req.user.id);

    // Si changement de gamertag, vérifier disponibilité
    if (gamertag && gamertag !== user.gamertag) {
      const existing = await User.findOne({ gamertag });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Ce gamertag est déjà utilisé'
        });
      }
      user.gamertag = gamertag;
    }

    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;
    if (discordTag !== undefined) user.discordTag = discordTag;
    if (favoriteGame !== undefined) user.favoriteGame = favoriteGame;
    if (socialLinks !== undefined) user.socialLinks = socialLinks;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profil mis à jour avec succès',
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Changer son mot de passe
// @route   PUT /api/auth/change-password
// @access  Privé
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez renseigner le mot de passe actuel et le nouveau mot de passe'
      });
    }

    const user = await User.findById(req.user.id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Le mot de passe actuel est incorrect'
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Mot de passe modifié avec succès'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Demander un code de sécurité pour mot de passe oublié
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez renseigner votre adresse email'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Pour des raisons de sécurité, réponse neutre ou confirmation
      return res.status(200).json({
        success: true,
        message: 'Si cette adresse email existe, un code de sécurité a été envoyé.'
      });
    }

    // Générer un code à 6 chiffres
    const securityCode = generateSecurityCode(6);
    user.resetPasswordCode = securityCode;
    user.resetPasswordCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await user.save({ validateBeforeSave: false });

    // Envoi par Nodemailer
    const emailResult = await sendPasswordResetCodeEmail(user.email, user.gamertag, securityCode);

    res.status(200).json({
      success: true,
      message: 'Un code de sécurité à 6 chiffres a été envoyé sur votre adresse email.',
      previewUrl: emailResult.previewUrl || null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Vérifier la validité du code de sécurité
// @route   POST /api/auth/verify-code
// @access  Public
const verifyResetCode = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez renseigner l\'email et le code de sécurité'
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
      resetPasswordCode: String(code).trim(),
      resetPasswordCodeExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Code de sécurité invalide ou expiré'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Code vérifié avec succès. Vous pouvez maintenant définir un nouveau mot de passe.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Réinitialiser le mot de passe avec le code de sécurité
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir l\'email, le code de sécurité et le nouveau mot de passe'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Le nouveau mot de passe doit comporter au moins 6 caractères'
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
      resetPasswordCode: String(code).trim(),
      resetPasswordCodeExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Code de sécurité invalide ou expiré. Veuillez refaire une demande.'
      });
    }

    // Réinitialisation du mot de passe
    user.password = newPassword;
    user.resetPasswordCode = undefined;
    user.resetPasswordCodeExpires = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Votre mot de passe a été réinitialisé avec succès ! Vous pouvez maintenant vous connecter.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  verifyResetCode,
  resetPassword
};
