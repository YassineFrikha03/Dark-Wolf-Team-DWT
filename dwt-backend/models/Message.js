const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      trim: true,
      default: '',
      validate: {
        validator: function (v) {
          return (v && v.trim().length > 0) || (this.mediaUrl && this.mediaUrl.trim().length > 0);
        },
        message: 'Le message doit contenir du texte ou un média'
      }
    },
    mediaUrl: {
      type: String,
      default: ''
    },
    mediaType: {
      type: String,
      enum: ['text', 'image', 'video', 'audio', 'file'],
      default: 'text'
    },
    mediaDuration: {
      type: Number,
      default: 0
    },
    isRead: {
      type: Boolean,
      default: false
    },
    readAt: {
      type: Date
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);
