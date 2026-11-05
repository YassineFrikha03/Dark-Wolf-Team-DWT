const jwt = require('jsonwebtoken');
const crypto = require('crypto');
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
    const cleanId = (req.body.identifier || req.body.email || '').trim();

    if (!cleanId) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez renseigner votre adresse email ou votre pseudo'
      });
    }

    const user = await User.findOne({
      $or: [{ email: cleanId.toLowerCase() }, { gamertag: cleanId }]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Aucun compte associé à cette adresse email ou ce pseudo.'
      });
    }

    // Générer un code à 6 chiffres et le lien direct de réinitialisation
    const securityCode = generateSecurityCode(6);
    user.resetPasswordCode = securityCode;
    user.resetPasswordCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await user.save({ validateBeforeSave: false });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${frontendUrl}/forgot-password?mode=reset&code=${securityCode}&identifier=${encodeURIComponent(user.email)}`;

    // Envoi par Nodemailer avec le code ET le lien direct
    const emailResult = await sendPasswordResetCodeEmail(user.email, user.gamertag, securityCode, resetLink);

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: emailResult.error || "Impossible d'envoyer l'email. Veuillez vérifier la configuration SMTP dans .env."
      });
    }

    res.status(200).json({
      success: true,
      message: `Un code de sécurité à 6 chiffres et un lien de modification ont été envoyés par email à ${user.email}.`,
      email: user.email,
      gamertag: user.gamertag
    });
  } catch (error) {
    next(error);
  }
};

// Générateur de gamertag unique pour OAuth
const generateUniqueGamertag = async (baseName) => {
  let cleanName = (baseName || 'WolfMember').replace(/[^a-zA-Z0-9_]/g, '').slice(0, 20);
  if (cleanName.length < 3) cleanName = 'Wolf_' + cleanName;
  let candidate = cleanName;
  let count = 1;
  while (await User.findOne({ gamertag: candidate })) {
    candidate = `${cleanName}_${Math.floor(100 + Math.random() * 900)}`;
    count++;
    if (count > 20) break;
  }
  return candidate;
};

// @desc    Redirection vers Google OAuth
// @route   GET /api/auth/google
// @access  Public
const googleAuth = (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const serverUrl = process.env.SERVER || 'http://localhost:5000';
  const callbackUrl = `${serverUrl}/api/auth/google/callback`;

  if (!clientId || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent("Google OAuth n'est pas encore configuré. Renseignez GOOGLE_CLIENT_ID et GOOGLE_CLIENT_SECRET dans dwt-backend/.env")}`);
  }

  const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(callbackUrl)}&response_type=code&scope=${encodeURIComponent('openid email profile')}&access_type=offline&prompt=select_account`;
  res.redirect(googleUrl);
};

// @desc    Callback Google OAuth
// @route   GET /api/auth/google/callback
// @access  Public
const googleAuthCallback = async (req, res) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const serverUrl = process.env.SERVER || 'http://localhost:5000';
  const callbackUrl = `${serverUrl}/api/auth/google/callback`;
  const { code, error } = req.query;

  if (error || !code) {
    return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent('Connexion Google annulée ou refusée.')}`);
  }

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: callbackUrl,
        grant_type: 'authorization_code'
      })
    });

    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) {
      console.error('Google OAuth token error:', tokenData);
      return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent('Échec de validation du jeton Google.')}`);
    }

    const userinfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });
    const profile = await userinfoResponse.json();

    if (!profile.email) {
      return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent('Impossible de récupérer l\'adresse email Google.')}`);
    }

    let user = await User.findOne({
      $or: [
        { googleId: profile.id },
        { email: profile.email.toLowerCase() }
      ]
    });

    if (user) {
      user.googleId = profile.id;
      if (profile.picture && (!user.avatar || user.avatar.includes('unsplash'))) {
        user.avatar = profile.picture;
      }
      user.lastLogin = new Date();
      await user.save({ validateBeforeSave: false });
    } else {
      const gamertag = await generateUniqueGamertag(profile.name || profile.email.split('@')[0]);
      const randomPassword = crypto.randomBytes(32).toString('hex');
      user = await User.create({
        gamertag,
        email: profile.email.toLowerCase(),
        password: randomPassword,
        googleId: profile.id,
        authProvider: 'google',
        avatar: profile.picture || undefined,
        role: 'user',
        lastLogin: new Date()
      });
    }

    const token = generateToken(user._id);
    return res.redirect(`${frontendUrl}/login?token=${token}&provider=google`);
  } catch (err) {
    console.error('Erreur Google OAuth Callback :', err);
    return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent('Erreur lors de la connexion Google : ' + err.message)}`);
  }
};

// @desc    Redirection vers Discord OAuth
// @route   GET /api/auth/discord
// @access  Public
const discordAuth = (req, res) => {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const serverUrl = process.env.SERVER || 'http://localhost:5000';
  const callbackUrl = `${serverUrl}/api/auth/discord/callback`;

  if (!clientId || !process.env.DISCORD_CLIENT_SECRET) {
    return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent("Discord OAuth n'est pas encore configuré. Ajoutez DISCORD_CLIENT_ID et DISCORD_CLIENT_SECRET dans dwt-backend/.env")}`);
  }

  const discordUrl = `https://discord.com/api/oauth2/authorize?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(callbackUrl)}&response_type=code&scope=${encodeURIComponent('identify email')}&prompt=consent`;
  res.redirect(discordUrl);
};

// @desc    Callback Discord OAuth
// @route   GET /api/auth/discord/callback
// @access  Public
const discordAuthCallback = async (req, res) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const serverUrl = process.env.SERVER || 'http://localhost:5000';
  const callbackUrl = `${serverUrl}/api/auth/discord/callback`;
  const { code, error } = req.query;

  if (error || !code) {
    return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent('Connexion Discord annulée ou refusée.')}`);
  }

  try {
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: callbackUrl
      })
    });

    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) {
      console.error('Discord OAuth token error:', tokenData);
      return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent('Échec de validation du jeton Discord.')}`);
    }

    const userinfoResponse = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });
    const profile = await userinfoResponse.json();

    const discordEmail = profile.email
      ? profile.email.toLowerCase()
      : `${profile.username.toLowerCase()}@discord.dwt.gg`;

    const avatarUrl = profile.avatar
      ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
      : undefined;

    let user = await User.findOne({
      $or: [
        { discordId: profile.id },
        { email: discordEmail }
      ]
    });

    if (user) {
      user.discordId = profile.id;
      if (!user.discordTag) user.discordTag = profile.username;
      if (avatarUrl && (!user.avatar || user.avatar.includes('unsplash'))) {
        user.avatar = avatarUrl;
      }
      user.lastLogin = new Date();
      await user.save({ validateBeforeSave: false });
    } else {
      const gamertag = await generateUniqueGamertag(profile.global_name || profile.username);
      const randomPassword = crypto.randomBytes(32).toString('hex');
      user = await User.create({
        gamertag,
        email: discordEmail,
        password: randomPassword,
        discordId: profile.id,
        discordTag: profile.username,
        authProvider: 'discord',
        avatar: avatarUrl || undefined,
        role: 'user',
        lastLogin: new Date()
      });
    }

    const token = generateToken(user._id);
    return res.redirect(`${frontendUrl}/login?token=${token}&provider=discord`);
  } catch (err) {
    console.error('Erreur Discord OAuth Callback :', err);
    return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent('Erreur lors de la connexion Discord : ' + err.message)}`);
  }
};

// @desc    Connexion démo pour tester les connexions sociales en dev
// @route   GET /api/auth/social-demo
// @access  Public
const socialDemoLogin = async (req, res) => {
  const provider = (req.query.provider || 'google').toLowerCase();
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

  try {
    const demoEmail = provider === 'discord' ? 'gamer_discord@darkwolfteam.gg' : 'gamer_google@darkwolfteam.gg';
    const demoGamertag = provider === 'discord' ? 'Discord_Wolf' : 'Google_Wolf';

    let user = await User.findOne({ email: demoEmail });
    if (!user) {
      const randomPassword = crypto.randomBytes(32).toString('hex');
      user = await User.create({
        gamertag: demoGamertag,
        email: demoEmail,
        password: randomPassword,
        authProvider: provider,
        role: 'user',
        avatar: provider === 'discord'
          ? 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=300&q=80'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        lastLogin: new Date()
      });
    }

    const token = generateToken(user._id);
    return res.redirect(`${frontendUrl}/login?token=${token}&provider=${provider}&demo=true`);
  } catch (err) {
    return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent('Erreur démo : ' + err.message)}`);
  }
};

// @desc    Vérifier la validité du code de sécurité pour réinitialisation
// @route   POST /api/auth/verify-code
// @access  Public
const verifyResetCode = async (req, res, next) => {
  try {
    const { identifier, email, code } = req.body;
    const cleanId = (identifier || email || '').trim();

    if (!cleanId || !code) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez renseigner l\'identifiant et le code de sécurité'
      });
    }

    const user = await User.findOne({
      $or: [{ email: cleanId.toLowerCase() }, { gamertag: cleanId }],
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

// @desc    Réinitialiser le mot de passe avec le code de sécurité et connecter l'utilisateur
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { identifier, email, code, newPassword } = req.body;
    const cleanId = (identifier || email || '').trim();

    if (!cleanId || !code || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir l\'identifiant, le code de sécurité et le nouveau mot de passe'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Le nouveau mot de passe doit comporter au moins 6 caractères'
      });
    }

    const user = await User.findOne({
      $or: [{ email: cleanId.toLowerCase() }, { gamertag: cleanId }],
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
    user.lastLogin = new Date();

    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Votre mot de passe a été réinitialisé avec succès ! Vous êtes maintenant connecté. 🐺🔑',
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

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  verifyResetCode,
  resetPassword,
  googleAuth,
  googleAuthCallback,
  discordAuth,
  discordAuthCallback,
  socialDemoLogin
};
