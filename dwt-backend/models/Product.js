const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom du produit est obligatoire'],
      trim: true
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'La description du produit est obligatoire']
    },
    price: {
      type: Number,
      required: [true, 'Le prix est obligatoire'],
      min: [0, 'Le prix ne peut pas être négatif']
    },
    comparePrice: {
      type: Number,
      default: 0
    },
    images: {
      type: [String],
      default: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80']
    },
    category: {
      type: String,
      required: [true, 'La catégorie est obligatoire'],
      trim: true,
      default: 'Maillots'
    },
    sizes: {
      type: [String],
      default: ['S', 'M', 'L', 'XL']
    },
    inStock: {
      type: Boolean,
      default: true
    },
    stockCount: {
      type: Number,
      default: 20,
      min: [0, 'Le stock ne peut pas être inférieur à 0']
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    rating: {
      type: Number,
      default: 5.0
    },
    numReviews: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// Slug auto
productSchema.pre('validate', function () {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-') + '-' + Math.floor(100 + Math.random() * 900);
  }
});

module.exports = mongoose.model('Product', productSchema);
