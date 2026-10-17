const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    gamertag: {
      type: String,
      required: [true, 'Le gamertag (pseudo) est obligatoire'],
      unique: true,
      trim: true,
      minlength: [3, 'Le gamertag doit contenir au moins 3 caractères'],
      maxlength: [30, 'Le gamertag ne peut pas dépasser 30 caractères']
    },
    email: {
      type: String,
      required: [true, "L'adresse email est obligatoire"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Veuillez fournir un email valide']
    },
    password: {
      type: String,
      required: [true, 'Le mot de passe est obligatoire'],
      minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
      select: false
    },
    role: {
      type: String,
      enum: ['user', 'player', 'moderator', 'admin'],
      default: 'user'
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=300&q=80'
    },
    bio: {
      type: String,
      default: 'Membre officiel de la Dark Wolf Team.'
    },
    discordTag: {
      type: String,
      default: ''
    },
    favoriteGame: {
      type: String,
      default: 'Valorant'
    },
    socialLinks: {
      twitch: { type: String, default: '' },
      youtube: { type: String, default: '' },
      twitter: { type: String, default: '' },
      discord: { type: String, default: '' }
    },
    resetPasswordCode: {
      type: String,
      default: undefined
    },
    resetPasswordCodeExpires: {
      type: Date,
      default: undefined
    },
    lastLogin: {
      type: Date
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Hash du mot de passe avant sauvegarde
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Méthode pour comparer les mots de passe
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
