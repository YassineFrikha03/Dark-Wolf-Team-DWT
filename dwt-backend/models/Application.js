const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    gamertag: {
      type: String,
      required: [true, 'Le gamertag est obligatoire'],
      trim: true
    },
    email: {
      type: String,
      required: [true, "L'adresse email est obligatoire"],
      trim: true,
      lowercase: true
    },
    discordTag: {
      type: String,
      required: [true, 'Le tag Discord est obligatoire'],
      trim: true
    },
    age: {
      type: Number,
      required: [true, "L'âge est obligatoire"],
      min: [13, "L'âge minimum est de 13 ans"]
    },
    game: {
      type: String,
      required: [true, 'Le jeu visé est obligatoire']
    },
    rank: {
      type: String,
      required: [true, 'Le rang actuel est obligatoire']
    },
    rolePreference: {
      type: String,
      default: 'Flexible'
    },
    experience: {
      type: String,
      required: [true, "L'expérience et la motivation sont obligatoires"]
    },
    trackerUrl: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['pending', 'test_scheduled', 'under_review', 'accepted', 'rejected'],
      default: 'pending'
    },
    testDate: {
      type: Date,
      default: null
    },
    testTime: {
      type: String,
      default: ''
    },
    testLocation: {
      type: String,
      default: 'Serveur Discord Vocal Dark Wolf Team'
    },
    testRoom: {
      type: String,
      default: 'Salle de Test #01 - Alpha (Public)'
    },
    discordUrl: {
      type: String,
      default: 'https://discord.gg/darkwolfteam'
    },
    assignedTester: {
      type: String,
      default: 'Staff Dark Wolf Team'
    },
    assignedTesterEmail: {
      type: String,
      default: ''
    },
    testNotes: {
      type: String,
      default: ''
    },
    generatedPassword: {
      type: String,
      default: ''
    },
    adminNotes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);
