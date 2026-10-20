const mongoose = require('mongoose');

const museumItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom de la pièce est obligatoire'],
      trim: true
    },
    cat: {
      type: String,
      default: 'Archive',
      trim: true
    },
    year: {
      type: String,
      default: '2023',
      trim: true
    },
    price: {
      type: String,
      default: 'TND 99',
      trim: true
    },
    image: {
      type: String,
      required: [true, "L'image de la pièce est obligatoire"],
      trim: true
    },
    desc: {
      type: String,
      default: '',
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
  {
    timestamps: true
  }
);

module.exports = mongoose.model('MuseumItem', museumItemSchema);
