const mongoose = require('mongoose');

const sponsorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom du sponsor ou de la marque est obligatoire'],
      trim: true
    },
    category: {
      type: String,
      default: 'Partenaire Officiel',
      trim: true
    },
    perk: {
      type: String,
      default: 'PARTENAIRE HOMOLOGUÉ',
      trim: true
    },
    desc: {
      type: String,
      default: '',
      trim: true
    },
    promoCode: {
      type: String,
      default: '',
      trim: true
    },
    websiteUrl: {
      type: String,
      default: '',
      trim: true
    },
    logoUrl: {
      type: String,
      default: '',
      trim: true
    },
    iconName: {
      type: String,
      default: 'Zap',
      trim: true
    },
    accentColor: {
      type: String,
      default: '#00e5ff',
      trim: true
    },
    order: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Sponsor', sponsorSchema);
