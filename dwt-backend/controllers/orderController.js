const Order = require('../models/Order');
const Product = require('../models/Product');
const Notification = require('../models/Notification');
const {
  sendOrderConfirmationEmail,
  sendAdminNewOrderAlert,
  sendOrderShippedEmail
} = require('../config/mailer');

// @desc    Passer une nouvelle commande (Boutique)
// @route   POST /api/orders
// @access  Public (ou connecté)
const createOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Le panier de commande est vide'
      });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.email || !shippingAddress.address) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez renseigner toutes les informations de livraison et de contact'
      });
    }

    // Calcul automatique sécurisé des totaux si non fournis
    let calculatedItemsPrice = 0;
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Produit introuvable : ${item.name}`
        });
      }
      if (product.stockCount < item.qty) {
        return res.status(400).json({
          success: false,
          message: `Stock insuffisant pour le produit : ${product.name}`
        });
      }
      calculatedItemsPrice += product.price * item.qty;

      // Déduire du stock
      product.stockCount -= item.qty;
      if (product.stockCount <= 0) {
        product.inStock = false;
      }
      await product.save({ validateBeforeSave: false });
    }

    const finalShippingPrice = shippingPrice !== undefined ? Number(shippingPrice) : (calculatedItemsPrice > 50 ? 0 : 4.99);
    const finalTotalPrice = totalPrice !== undefined ? Number(totalPrice) : (calculatedItemsPrice + finalShippingPrice);

    const orderData = {
      orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'Carte Bancaire',
      itemsPrice: itemsPrice !== undefined ? Number(itemsPrice) : calculatedItemsPrice,
      shippingPrice: finalShippingPrice,
      totalPrice: finalTotalPrice,
      isPaid: true,
      paidAt: new Date(),
      orderStatus: 'processing'
    };

    if (req.user) {
      orderData.user = req.user._id;
    }

    const order = await Order.create(orderData);

    // Notification système pour l'administrateur (visiteur ou joueur)
    const clientType = req.user ? `Joueur (${req.user.gamertag || 'Inscrit'})` : 'Visiteur';
    Notification.create({
      recipientRole: 'admin',
      type: 'order',
      title: '🛍️ Nouvelle Commande Boutique !',
      message: `${order.shippingAddress.fullName} (${order.shippingAddress.email} - ${clientType}) a validé une commande de ${order.totalPrice} DT (${order.orderItems.length} article(s)).`,
      orderId: order._id,
      metadata: {
        customerName: order.shippingAddress.fullName,
        email: order.shippingAddress.email,
        phone: order.shippingAddress.phone,
        totalPrice: order.totalPrice,
        itemsCount: order.orderItems.length,
        isPlayer: Boolean(req.user),
        gamertag: req.user?.gamertag || null
      }
    }).catch((err) => console.error('Erreur création notification commande admin :', err.message));

    // Envoi des emails asynchrones via Nodemailer
    sendOrderConfirmationEmail(order).catch((err) =>
      console.error('Erreur email confirmation commande client :', err.message)
    );
    sendAdminNewOrderAlert(order).catch((err) =>
      console.error('Erreur email alerte admin commande :', err.message)
    );

    res.status(201).json({
      success: true,
      message: 'Commande validée avec succès ! Un récapitulatif t\'a été envoyé par email. 🐺🛍️',
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir les commandes de l'utilisateur connecté
// @route   GET /api/orders/my-orders
// @access  Privé
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir les détails d'une commande
// @route   GET /api/orders/:id
// @access  Public / Privé (Propriétaire ou Admin)
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande introuvable'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir toutes les commandes de la boutique
// @route   GET /api/orders
// @access  Privé (Admin)
const getAllOrders = async (req, res, next) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;
    let query = {};
    if (status) query.orderStatus = status;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'gamertag email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour le statut d'une commande (expédiée, livrée, etc.)
// @route   PUT /api/orders/:id/status
// @access  Privé (Admin)
const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, trackingNumber } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande introuvable'
      });
    }

    const previousStatus = order.orderStatus;
    if (orderStatus) order.orderStatus = orderStatus;
    if (trackingNumber) order.trackingNumber = trackingNumber;

    if (orderStatus === 'delivered' && !order.deliveredAt) {
      order.deliveredAt = new Date();
    }

    await order.save();

    // Si la commande passe en statut "expédiée", envoyer automatiquement un email de suivi
    if (orderStatus === 'shipped' && previousStatus !== 'shipped') {
      sendOrderShippedEmail(order).catch((err) =>
        console.error('Erreur email expédition commande :', err.message)
      );
    }

    res.status(200).json({
      success: true,
      message: `Statut de la commande mis à jour (${orderStatus})`,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer une commande
// @route   DELETE /api/orders/:id
// @access  Privé (Admin)
const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande introuvable'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Commande supprimée'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir les statistiques de Chiffre d'Affaires et de Ventes de la Boutique
// @route   GET /api/orders/revenue-stats
// @access  Privé (Admin)
const getRevenueStats = async (req, res, next) => {
  try {
    const orders = await Order.find();

    // 1. Chiffre d'affaires total (toutes commandes non annulées)
    const validOrders = orders.filter((o) => o.orderStatus !== 'cancelled');
    const totalRevenue = validOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

    // 2. Chiffre d'affaires du mois en cours
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyOrders = validOrders.filter((o) => new Date(o.createdAt) >= startOfMonth);
    const monthlyRevenue = monthlyOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

    // 3. Panier moyen
    const averageOrderValue = validOrders.length > 0 ? (totalRevenue / validOrders.length).toFixed(2) : '0.00';

    // 4. Répartition par statut de commande
    const ordersByStatus = {
      pending: orders.filter((o) => o.orderStatus === 'pending').length,
      processing: orders.filter((o) => o.orderStatus === 'processing').length,
      shipped: orders.filter((o) => o.orderStatus === 'shipped').length,
      delivered: orders.filter((o) => o.orderStatus === 'delivered').length,
      cancelled: orders.filter((o) => o.orderStatus === 'cancelled').length
    };

    // 5. Alertes stocks sur les produits
    const products = await Product.find();
    const lowStockCount = products.filter((p) => p.stockCount <= 5).length;
    const outOfStockCount = products.filter((p) => p.stockCount === 0 || !p.inStock).length;
    const totalStockUnits = products.reduce((sum, p) => sum + (p.stockCount || 0), 0);

    // 6. Historique des 7 derniers jours (CA et nombre de commandes)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = d.toISOString().slice(0, 10);
      const dayName = d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });

      const dayOrders = validOrders.filter(
        (o) => new Date(o.createdAt).toISOString().slice(0, 10) === dayStr
      );
      const dayRev = dayOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

      last7Days.push({
        date: dayStr,
        label: dayName,
        revenue: Math.round(dayRev * 100) / 100,
        ordersCount: dayOrders.length
      });
    }

    res.status(200).json({
      success: true,
      stats: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        monthlyRevenue: Math.round(monthlyRevenue * 100) / 100,
        totalOrders: orders.length,
        validOrdersCount: validOrders.length,
        averageOrderValue: Number(averageOrderValue),
        ordersByStatus,
        stockSummary: {
          totalProducts: products.length,
          totalStockUnits,
          lowStockCount,
          outOfStockCount
        },
        last7Days
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  getRevenueStats
};
