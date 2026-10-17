const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom est obligatoire'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'L\'email est obligatoire'],
      trim: true,
      lowercase: true
    },
    subject: {
      type: String,
      required: [true, 'Le sujet est obligatoire'],
      trim: true
    },
    message: {
      type: String,
      required: [true, 'Le message est obligatoire']
    },
    status: {
      type: String,
      enum: ['unread', 'read', 'replied'],
      default: 'unread'
    },
    replyNotes: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', contactSchema);
