const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Le titre de l\'article est obligatoire'],
      trim: true,
      maxlength: 150
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true
    },
    summary: {
      type: String,
      required: [true, 'Le résumé est obligatoire'],
      maxlength: 300
    },
    content: {
      type: String,
      required: [true, 'Le contenu de l\'article est obligatoire']
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80'
    },
    category: {
      type: String,
      enum: ['Esport', 'Tournoi', 'Recrutement', 'Annonce', 'Mise à jour', 'Communauté'],
      default: 'Annonce'
    },
    game: {
      type: String,
      default: 'Général'
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    authorName: {
      type: String,
      default: 'Staff DWT'
    },
    views: {
      type: Number,
      default: 0
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    isFeatured: {
      type: Boolean,
      default: false
    },
    isPublished: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Générer slug avant validation
newsSchema.pre('validate', function () {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-') + '-' + Math.floor(1000 + Math.random() * 9000);
  }
});

module.exports = mongoose.model('News', newsSchema);
