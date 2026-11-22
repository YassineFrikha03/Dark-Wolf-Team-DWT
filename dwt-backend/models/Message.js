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
      default: ''
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

// S'assurer qu'au moins un contenu textuel ou un média est fourni
messageSchema.pre('validate', function (next) {
  if ((!this.content || !this.content.trim()) && !this.mediaUrl) {
    this.invalidate('content', 'Le message doit contenir du texte ou un média');
  }
  next();
});

module.exports = mongoose.model('Message', messageSchema);
