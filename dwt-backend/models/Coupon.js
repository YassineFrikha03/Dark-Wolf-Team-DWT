const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Le code promo est requis'],
      unique: true,
      uppercase: true,
      trim: true,
      minlength: [3, 'Le code doit contenir au moins 3 caractères'],
      maxlength: [20, 'Le code ne doit pas dépasser 20 caractères']
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage',
      required: true
    },
    discountValue: {
      type: Number,
      required: [true, 'La valeur de la réduction est requise'],
      min: [0.01, 'La valeur de réduction doit être positive']
    },
    minOrderAmount: {
      type: Number,
      default: 0,
      min: [0, 'Le montant minimum ne peut pas être négatif']
    },
    maxDiscount: {
      type: Number,
      default: null,
      min: [0, 'La remise maximale ne peut pas être négative']
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date,
      default: null
    },
    usageLimit: {
      type: Number,
      default: null, // null = illimité
      min: [1, 'La limite doit être d\'au moins 1']
    },
    usedCount: {
      type: Number,
      default: 0,
      min: 0
    },
    // Autorisation de l'administrateur dans le Dashboard
    isActive: {
      type: Boolean,
      default: true
    },
    // Restriction à des joueurs spécifiés
    isRestricted: {
      type: Boolean,
      default: false
    },
    assignedPlayers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
      }
    ],
    assignedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Coupon', couponSchema);
