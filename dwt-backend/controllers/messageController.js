const Message = require('../models/Message');
const User = require('../models/User');
const Player = require('../models/Player');
const Application = require('../models/Application');
const Notification = require('../models/Notification');
const { sendEmail } = require('../config/mailer');

// @desc    Envoyer un message
// @route   POST /api/messages
// @access  Privé
const sendMessage = async (req, res, next) => {
  try {
    const senderId = req.user._id;
    let { receiverId, content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Le message ne peut pas être vide'
      });
    }

    // Si le joueur n'a pas spécifié de destinataire, cibler automatiquement un admin
    if (!receiverId) {
      const admin = await User.findOne({ role: 'admin' });
      if (!admin) {
        return res.status(404).json({
          success: false,
          message: 'Aucun administrateur disponible pour recevoir le message'
        });
      }
      receiverId = admin._id;
    }

    let receiver = await User.findById(receiverId);
    if (!receiver) {
      // Vérifier si le receiverId correspond à une Candidature
      const app = await Application.findById(receiverId);
      if (app) {
        receiver = await User.findOne({ email: app.email.toLowerCase() });
        if (!receiver) {
          const tempPassword = 'DWT-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '!';
          receiver = await User.create({
            gamertag: app.gamertag,
            email: app.email.toLowerCase(),
            password: tempPassword,
            role: 'user'
          });
        }
        receiverId = receiver._id;
      }
    }

    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'Destinataire introuvable'
      });
    }

    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      content: content.trim()
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'gamertag role avatar favoriteGame')
      .populate('receiver', 'gamertag role avatar favoriteGame');

    // Créer une notification pour le destinataire
    const isSenderAdmin = req.user.role === 'admin' || req.user.role === 'moderator';
    await Notification.create({
      recipient: receiverId,
      recipientRole: isSenderAdmin ? 'user' : 'admin',
      type: 'message',
      title: `💬 Message de ${req.user.gamertag || 'Joueur DWT'}`,
      message: content.trim().length > 60 ? content.trim().slice(0, 57) + '...' : content.trim(),
      metadata: {
        senderId: req.user._id,
        senderGamertag: req.user.gamertag,
        messageId: message._id
      }
    }).catch((err) => console.error('Erreur notification message :', err.message));

    // Si un admin envoie un message à un joueur/candidat, envoyer également une copie par email
    if (isSenderAdmin && receiver && receiver.email) {
      sendEmail({
        to: receiver.email,
        subject: `💬 Nouveau message du Staff Dark Wolf Team (${req.user.gamertag || 'Admin'})`,
        html: `<div style="font-family: Arial, sans-serif; background: #0b0d14; color: #fff; padding: 24px; border-radius: 8px;">
          <h2 style="color: #e60000; margin-top: 0;">🐺 Dark Wolf Team - Staff Message</h2>
          <p>Bonjour <strong>${receiver.gamertag}</strong>,</p>
          <p>Le staff Dark Wolf Team vous a envoyé un message :</p>
          <blockquote style="background: #161b28; border-left: 4px solid #e60000; padding: 12px 16px; margin: 16px 0; color: #cbd5e1; font-style: italic;">
            ${content.trim()}
          </blockquote>
          <p style="color: #94a3b8; font-size: 13px;">Vous pouvez continuer la discussion sur la plateforme Dark Wolf Team.</p>
        </div>`
      }).catch((err) => console.error('Erreur email message staff :', err.message));
    }

    res.status(201).json({
      success: true,
      message: populatedMessage
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir les messages échangés avec un utilisateur
// @route   GET /api/messages/conversation/:userId
// @access  Privé
const getMessagesWithUser = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;
    let otherUserId = req.params.userId;

    // Vérifier si otherUserId est un ID d'application
    let otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      const app = await Application.findById(otherUserId);
      if (app) {
        otherUser = await User.findOne({ email: app.email.toLowerCase() });
        if (otherUser) {
          otherUserId = otherUser._id;
        }
      }
    }

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId }
      ]
    })
      .sort({ createdAt: 1 })
      .populate('sender', 'gamertag role avatar favoriteGame')
      .populate('receiver', 'gamertag role avatar favoriteGame');

    // Marquer les messages reçus comme lus
    await Message.updateMany(
      { sender: otherUserId, receiver: currentUserId, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.status(200).json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir la liste des conversations récentes
// @route   GET /api/messages/conversations
// @access  Privé
const getConversations = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;
    const isAdmin = req.user.role === 'admin' || req.user.role === 'moderator';

    let candidateUsers = [];
    if (isAdmin) {
      // Pour l'admin : synchroniser tous les joueurs recrutés de la collection Player
      try {
        const allActivePlayers = await Player.find({ isActive: true });
        for (const p of allActivePlayers) {
          if (!p.gamertag) continue;
          let uAcc = await User.findOne({
            gamertag: { $regex: new RegExp(`^${p.gamertag.trim()}$`, 'i') }
          });

          if (!uAcc) {
            const fakeEmail = `${p.gamertag.toLowerCase().replace(/[^a-z0-9]/g, '')}@darkwolfteam.com`;
            uAcc = await User.create({
              gamertag: p.gamertag.trim(),
              email: fakeEmail,
              password: 'DWT2026!player',
              role: 'player',
              avatar: p.avatar,
              favoriteGame: p.game,
              bio: p.bio || `Joueur officiel Dark Wolf Team sur ${p.game}.`
            });
          } else if (uAcc.role !== 'player' && uAcc.role !== 'admin') {
            uAcc.role = 'player';
            if (p.game) uAcc.favoriteGame = p.game;
            await uAcc.save();
          }

          // Vérifier si un message de bienvenue a déjà été envoyé
          const hasMessage = await Message.findOne({
            $or: [
              { sender: currentUserId, receiver: uAcc._id },
              { sender: uAcc._id, receiver: currentUserId }
            ]
          });

          if (!hasMessage) {
            await Message.create({
              sender: currentUserId,
              receiver: uAcc._id,
              content: `🐺 Bienvenue dans la meute Dark Wolf Team, ${p.gamertag} ! Ton espace de messagerie privé avec le staff est prêt pour échanger sur tes entraînements, tournois et scrims.`
            }).catch(() => {});
          }
        }
      } catch (syncErr) {
        console.error('Erreur synchronisation joueurs dans la messagerie :', syncErr.message);
      }

      // Tous les utilisateurs (joueurs recrutés et membres)
      candidateUsers = await User.find({ _id: { $ne: currentUserId } })
        .select('gamertag email role avatar bio lastLogin favoriteGame');
    } else {
      // Pour le joueur : cibler les administrateurs et modérateurs
      candidateUsers = await User.find({ 
        role: { $in: ['admin', 'moderator'] } 
      }).select('gamertag email role avatar bio lastLogin favoriteGame');

      if (candidateUsers.length === 0) {
        const fallbackAdmin = await User.findOne({ role: 'admin' }).select('gamertag email role avatar bio lastLogin favoriteGame');
        if (fallbackAdmin) candidateUsers.push(fallbackAdmin);
      }
    }

    const conversations = await Promise.all(
      candidateUsers.map(async (u) => {
        const lastMsg = await Message.findOne({
          $or: [
            { sender: currentUserId, receiver: u._id },
            { sender: u._id, receiver: currentUserId }
          ]
        }).sort({ createdAt: -1 });

        const unreadCount = await Message.countDocuments({
          sender: u._id,
          receiver: currentUserId,
          isRead: false
        });

        return {
          user: u,
          lastMessage: lastMsg,
          unreadCount,
          isPlayer: u.role === 'player'
        };
      })
    );

    // Trier les conversations intelligemment :
    // 1. Celles avec messages non lus d'abord
    // 2. Celles avec messages récents ensuite
    // 3. Les joueurs officiels recrutés ensuite
    // 4. Les autres membres
    conversations.sort((a, b) => {
      if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
      if (b.unreadCount > 0 && a.unreadCount === 0) return 1;

      const timeA = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : 0;
      const timeB = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : 0;
      if (timeA !== timeB) return timeB - timeA;

      if (a.isPlayer && !b.isPlayer) return -1;
      if (!a.isPlayer && b.isPlayer) return 1;

      return (a.user.gamertag || '').localeCompare(b.user.gamertag || '');
    });

    res.status(200).json({
      success: true,
      conversations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Marquer une conversation comme lue
// @route   PUT /api/messages/read/:userId
// @access  Privé
const markAsRead = async (req, res, next) => {
  try {
    const otherUserId = req.params.userId;
    await Message.updateMany(
      { sender: otherUserId, receiver: req.user._id, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.status(200).json({
      success: true,
      message: 'Conversation marquée comme lue'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendMessage,
  getMessagesWithUser,
  getConversations,
  markAsRead
};
