const mongoose = require('mongoose');

const slideSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Le titre de la diapositive est obligatoire'],
      trim: true
    },
    subtitle: {
      type: String,
      default: '',
      trim: true
    },
    label: {
      type: String,
      default: 'Collection Officielle',
      trim: true
    },
    backgroundImage: {
      type: String,
      required: [true, "L'image d'affiche cinématique est obligatoire"]
    },
    btn1Text: {
      type: String,
      default: 'Shop Collection'
    },
    btn1Target: {
      type: String,
      default: '#shop'
    },
    btn2Text: {
      type: String,
      default: 'Meet the Pack'
    },
    btn2Target: {
      type: String,
      default: '#teams'
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

module.exports = mongoose.model('Slide', slideSchema);
