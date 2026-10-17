const Notification = require('../models/Notification');

// @desc    Obtenir les notifications de l'utilisateur ou de l'admin
// @route   GET /api/notifications
// @access  Privé
const getNotifications = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'admin' || req.user.role === 'moderator';
    let query = {};

    if (isAdmin) {
      query = {
        $or: [
          { recipientRole: 'admin' },
          { recipientRole: 'all' },
          { recipient: req.user._id }
        ]
      };
    } else {
      query = {
        $or: [
          { recipient: req.user._id },
          { recipientRole: 'user' },
          { recipientRole: 'all' }
        ]
      };
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      ...query,
      isRead: false
    });

    res.status(200).json({
      success: true,
      unreadCount,
      count: notifications.length,
      notifications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Marquer une notification comme lue
// @route   PUT /api/notifications/:id/read
// @access  Privé
const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification introuvable'
      });
    }

    res.status(200).json({
      success: true,
      notification
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Marquer toutes les notifications comme lues
// @route   PUT /api/notifications/read-all
// @access  Privé
const markAllAsRead = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'admin' || req.user.role === 'moderator';
    let query = {};

    if (isAdmin) {
      query = {
        $or: [
          { recipientRole: 'admin' },
          { recipientRole: 'all' },
          { recipient: req.user._id }
        ]
      };
    } else {
      query = {
        $or: [
          { recipient: req.user._id },
          { recipientRole: 'user' },
          { recipientRole: 'all' }
        ]
      };
    }

    await Notification.updateMany(query, { isRead: true });

    res.status(200).json({
      success: true,
      message: 'Toutes les notifications ont été marquées comme lues'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer une notification
// @route   DELETE /api/notifications/:id
// @access  Privé
const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification introuvable'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification supprimée'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
};
