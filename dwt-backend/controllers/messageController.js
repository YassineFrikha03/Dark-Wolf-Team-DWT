const Message = require('../models/Message');
const User = require('../models/User');
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
      .populate('sender', 'gamertag role avatar')
      .populate('receiver', 'gamertag role avatar');

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
      .populate('sender', 'gamertag role avatar')
      .populate('receiver', 'gamertag role avatar');

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

    // Récupérer tous les utilisateurs pertinents
    let candidateUsers = [];
    if (isAdmin) {
      // Pour l'admin : tous les autres utilisateurs (joueurs, membres comme CYRSOO)
      candidateUsers = await User.find({ _id: { $ne: currentUserId } }).select('gamertag email role avatar bio lastLogin');
    } else {
      // Pour le joueur : les admins
      candidateUsers = await User.find({ role: 'admin' }).select('gamertag email role avatar bio lastLogin');
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
          unreadCount
        };
      })
    );

    // Trier les conversations : celles avec messages en premier (plus récentes), puis les autres
    conversations.sort((a, b) => {
      const timeA = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : 0;
      const timeB = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : 0;
      return timeB - timeA;
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
