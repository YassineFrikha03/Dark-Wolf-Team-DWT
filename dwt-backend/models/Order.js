const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        name: { type: String, required: true },
        qty: { type: Number, required: true, min: 1 },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        size: { type: String, default: '' }
      }
    ],
    shippingAddress: {
      fullName: { type: String, required: [true, 'Le nom complet est requis'] },
      email: { type: String, required: [true, "L'email est requis"], lowercase: true, trim: true },
      phone: { type: String, default: '' },
      address: { type: String, required: [true, "L'adresse est requise"] },
      city: { type: String, required: [true, 'La ville est requise'] },
      postalCode: { type: String, required: [true, 'Le code postal est requis'] },
      country: { type: String, required: true, default: 'France' }
    },
    paymentMethod: {
      type: String,
      default: 'Carte Bancaire'
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String }
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0
    },
    isPaid: {
      type: Boolean,
      default: true
    },
    paidAt: {
      type: Date,
      default: Date.now
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'processing'
    },
    trackingNumber: {
      type: String,
      default: ''
    },
    deliveredAt: {
      type: Date
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
