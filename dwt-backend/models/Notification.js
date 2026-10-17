const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    recipientRole: {
      type: String,
      enum: ['admin', 'user', 'all'],
      default: 'admin'
    },
    type: {
      type: String,
      enum: ['order', 'message', 'stock', 'system'],
      default: 'order'
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      default: null
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
