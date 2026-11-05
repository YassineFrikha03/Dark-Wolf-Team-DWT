const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Coupon = require('../models/Coupon');
const User = require('../models/User');
const Player = require('../models/Player');
const Notification = require('../models/Notification');
const { protect, authorize } = require('../middlewares/auth');

// @desc    Obtenir la liste des joueurs et utilisateurs pour attribution de code promo
// @route   GET /api/coupons/recipients
// @access  Private (Admin, Moderator)
router.get('/recipients', protect, authorize('admin', 'moderator'), async (req, res) => {
  try {
    const [players, users] = await Promise.all([
      Player.find({ isActive: true }).select('gamertag realName game role avatar isStarter').sort({ game: 1, gamertag: 1 }),
      User.find().select('gamertag email role avatar favoriteGame').sort({ gamertag: 1 })
    ]);

    res.status(200).json({
      success: true,
      players,
      users
    });
  } catch (error) {
    console.error('Erreur récupération destinataires codes promo:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement des joueurs'
    });
  }
});

// @desc    Valider un code promo (Public / Checkout)
// @route   POST /api/coupons/validate
// @access  Public
router.post('/validate', async (req, res) => {
  try {
    const { code, orderAmount } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez saisir un code promo'
      });
    }

    const cleanCode = code.trim().toUpperCase();
    const coupon = await Coupon.findOne({ code: cleanCode })
      .populate('assignedPlayers', 'gamertag realName game')
      .populate('assignedUsers', 'gamertag email');

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Code promo introuvable ou invalide'
      });
    }

    // Vérification de l'autorisation Administrateur
    if (!coupon.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Ce code promo est inactif ou n\'a pas été autorisé par l\'administration'
      });
    }

    // Vérification des dates de validité
    const now = new Date();
    if (coupon.startDate && new Date(coupon.startDate) > now) {
      return res.status(400).json({
        success: false,
        message: 'Ce code promo n\'est pas encore actif'
      });
    }

    if (coupon.endDate && new Date(coupon.endDate) < now) {
      return res.status(400).json({
        success: false,
        message: 'Ce code promo a expiré'
      });
    }

    // Vérification de la limite d'utilisation
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({
        success: false,
        message: 'La limite maximale d\'utilisations de ce code promo a été atteinte'
      });
    }

    // Vérification de la restriction aux joueurs assignés
    const hasAssignedPlayers = coupon.assignedPlayers && coupon.assignedPlayers.length > 0;
    const hasAssignedUsers = coupon.assignedUsers && coupon.assignedUsers.length > 0;

    if (coupon.isRestricted && (hasAssignedPlayers || hasAssignedUsers)) {
      let currentUser = null;

      // 1. Tenter d'authentifier par le Header Bearer
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
          const token = req.headers.authorization.split(' ')[1];
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          currentUser = await User.findById(decoded.id).select('-password');
        } catch (e) {
          // Token invalide ou expiré
        }
      }

      // 2. Tenter de trouver par userId dans le body
      if (!currentUser && req.body.userId) {
        currentUser = await User.findById(req.body.userId).select('-password');
      }

      // 3. Tenter de trouver par email dans le body
      if (!currentUser && req.body.email) {
        currentUser = await User.findOne({ email: req.body.email.toLowerCase().trim() }).select('-password');
      }

      // 4. Tenter de trouver par gamertag dans le body
      if (!currentUser && req.body.gamertag) {
        currentUser = await User.findOne({ gamertag: { $regex: new RegExp(`^${req.body.gamertag.trim()}$`, 'i') } }).select('-password');
      }

      if (!currentUser) {
        return res.status(403).json({
          success: false,
          isRestricted: true,
          message: 'Ce code promo est exclusif et réservé à des joueurs spécifiques. Connectez-vous à votre compte joueur pour en bénéficier.'
        });
      }

      // Vérifier si currentUser est dans les utilisateurs assignés
      const isAssignedUser = hasAssignedUsers && coupon.assignedUsers.some((u) => {
        const uId = u._id ? u._id.toString() : u.toString();
        const userEmail = u.email ? u.email.toLowerCase() : null;
        return uId === currentUser._id.toString() || (userEmail && userEmail === currentUser.email.toLowerCase());
      });

      // Vérifier si currentUser correspond à l'un des joueurs du roster assignés
      const isAssignedPlayer = hasAssignedPlayers && coupon.assignedPlayers.some((p) => {
        const pGamertag = p.gamertag ? p.gamertag.toLowerCase().trim() : '';
        const userGamertag = currentUser.gamertag ? currentUser.gamertag.toLowerCase().trim() : '';
        return pGamertag && userGamertag && pGamertag === userGamertag;
      });

      if (!isAssignedUser && !isAssignedPlayer) {
        return res.status(403).json({
          success: false,
          isRestricted: true,
          message: `Ce code promo est exclusif et n'a pas été attribué à votre compte (${currentUser.gamertag || 'Joueur'}).`
        });
      }
    }

    // Vérification du montant minimum d'achat
    const numericAmount = Number(orderAmount) || 0;
    if (coupon.minOrderAmount > 0 && numericAmount < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Montant d'achat insuffisant. Le minimum pour ce code est de ${coupon.minOrderAmount.toFixed(2)} DT`
      });
    }

    // Calcul du montant de la réduction
    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (numericAmount * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      // Montant fixe (DT)
      discount = Math.min(coupon.discountValue, numericAmount);
    }

    const discountAmount = Number(discount.toFixed(2));
    const finalAmount = Number(Math.max(0, numericAmount - discountAmount).toFixed(2));

    return res.status(200).json({
      success: true,
      valid: true,
      message: `Code promo ${coupon.code} validé avec succès (-${coupon.discountType === 'percentage' ? coupon.discountValue + '%' : coupon.discountValue + ' DT'})`,
      coupon: {
        _id: coupon._id,
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderAmount: coupon.minOrderAmount,
        isRestricted: Boolean(coupon.isRestricted)
      },
      discountAmount,
      finalAmount
    });
  } catch (error) {
    console.error('Erreur validation code promo:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la validation du code promo'
    });
  }
});

// @desc    Obtenir tous les codes promo (Admin)
// @route   GET /api/coupons
// @access  Private (Admin, Moderator)
router.get('/', protect, authorize('admin', 'moderator'), async (req, res) => {
  try {
    const coupons = await Coupon.find()
      .populate('createdBy', 'gamertag email')
      .populate('assignedPlayers', 'gamertag realName game role avatar isActive')
      .populate('assignedUsers', 'gamertag email role avatar favoriteGame')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: coupons.length,
      coupons
    });
  } catch (error) {
    console.error('Erreur récupération codes promo:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement des codes promo'
    });
  }
});

// @desc    Créer un nouveau code promo (Admin)
// @route   POST /api/coupons
// @access  Private (Admin, Moderator)
router.post('/', protect, authorize('admin', 'moderator'), async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscount,
      startDate,
      endDate,
      usageLimit,
      isActive,
      isRestricted,
      assignedPlayers,
      assignedUsers
    } = req.body;

    if (!code || !discountValue) {
      return res.status(400).json({
        success: false,
        message: 'Le code et la valeur de réduction sont obligatoires'
      });
    }

    const cleanCode = code.trim().toUpperCase();

    // Vérifier l'unicité
    const existingCoupon = await Coupon.findOne({ code: cleanCode });
    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: `Le code promo "${cleanCode}" existe déjà`
      });
    }

    const cleanAssignedPlayers = Array.isArray(assignedPlayers) ? assignedPlayers : [];
    const cleanAssignedUsers = Array.isArray(assignedUsers) ? assignedUsers : [];
    const shouldRestrict = Boolean(isRestricted) && (cleanAssignedPlayers.length > 0 || cleanAssignedUsers.length > 0);

    const coupon = await Coupon.create({
      code: cleanCode,
      description: description?.trim() || '',
      discountType: discountType || 'percentage',
      discountValue: Number(discountValue),
      minOrderAmount: minOrderAmount ? Number(minOrderAmount) : 0,
      maxDiscount: maxDiscount ? Number(maxDiscount) : null,
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : null,
      usageLimit: usageLimit ? Number(usageLimit) : null,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      isRestricted: shouldRestrict,
      assignedPlayers: shouldRestrict ? cleanAssignedPlayers : [],
      assignedUsers: shouldRestrict ? cleanAssignedUsers : [],
      createdBy: req.user._id
    });

    // Envoi de notifications aux joueurs assignés
    if (shouldRestrict) {
      const discountText = coupon.discountType === 'percentage' ? `-${coupon.discountValue}%` : `-${coupon.discountValue} DT`;

      // 1. Notifier les utilisateurs directs
      for (const uId of cleanAssignedUsers) {
        await Notification.create({
          recipient: uId,
          recipientRole: 'user',
          type: 'system',
          title: '🎁 Code Promo Exclusif Attribué !',
          message: `L'administration DWT vous a offert le code promo exclusif "${coupon.code}" (${discountText}) valable dans le shop officiel !`,
          metadata: { couponCode: coupon.code, couponId: coupon._id }
        }).catch((err) => console.error('Notification coupon user error:', err.message));
      }

      // 2. Notifier les joueurs du roster
      if (cleanAssignedPlayers.length > 0) {
        const rosterDocs = await Player.find({ _id: { $in: cleanAssignedPlayers } });
        for (const rp of rosterDocs) {
          if (!rp.gamertag) continue;
          const u = await User.findOne({
            gamertag: { $regex: new RegExp(`^${rp.gamertag.trim()}$`, 'i') }
          });
          if (u && !cleanAssignedUsers.some((uid) => uid.toString() === u._id.toString())) {
            await Notification.create({
              recipient: u._id,
              recipientRole: 'user',
              type: 'system',
              title: '🎁 Code Promo Joueur Attribué !',
              message: `Code promo VIP "${coupon.code}" (${discountText}) attribué à votre profil joueur DWT sur ${rp.game} !`,
              metadata: { couponCode: coupon.code, couponId: coupon._id }
            }).catch((err) => console.error('Notification coupon roster error:', err.message));
          }
        }
      }
    }

    const populatedCoupon = await Coupon.findById(coupon._id)
      .populate('createdBy', 'gamertag email')
      .populate('assignedPlayers', 'gamertag realName game role avatar isActive')
      .populate('assignedUsers', 'gamertag email role avatar favoriteGame');

    res.status(201).json({
      success: true,
      message: `Code promo "${coupon.code}" créé et autorisé avec succès`,
      coupon: populatedCoupon
    });
  } catch (error) {
    console.error('Erreur création code promo:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la création du code promo'
    });
  }
});

// @desc    Modifier un code promo (Admin)
// @route   PUT /api/coupons/:id
// @access  Private (Admin, Moderator)
router.put('/:id', protect, authorize('admin', 'moderator'), async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Code promo introuvable'
      });
    }

    if (req.body.code && req.body.code.trim().toUpperCase() !== coupon.code) {
      const cleanCode = req.body.code.trim().toUpperCase();
      const duplicate = await Coupon.findOne({ code: cleanCode, _id: { $ne: coupon._id } });
      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: `Le code "${cleanCode}" est déjà utilisé par un autre coupon`
        });
      }
      coupon.code = cleanCode;
    }

    if (req.body.description !== undefined) coupon.description = req.body.description.trim();
    if (req.body.discountType) coupon.discountType = req.body.discountType;
    if (req.body.discountValue !== undefined) coupon.discountValue = Number(req.body.discountValue);
    if (req.body.minOrderAmount !== undefined) coupon.minOrderAmount = Number(req.body.minOrderAmount);
    if (req.body.maxDiscount !== undefined) coupon.maxDiscount = req.body.maxDiscount ? Number(req.body.maxDiscount) : null;
    if (req.body.startDate !== undefined) coupon.startDate = req.body.startDate ? new Date(req.body.startDate) : coupon.startDate;
    if (req.body.endDate !== undefined) coupon.endDate = req.body.endDate ? new Date(req.body.endDate) : null;
    if (req.body.usageLimit !== undefined) coupon.usageLimit = req.body.usageLimit ? Number(req.body.usageLimit) : null;
    if (req.body.isActive !== undefined) coupon.isActive = Boolean(req.body.isActive);

    if (req.body.isRestricted !== undefined) {
      coupon.isRestricted = Boolean(req.body.isRestricted);
    }
    if (req.body.assignedPlayers !== undefined) {
      coupon.assignedPlayers = Array.isArray(req.body.assignedPlayers) ? req.body.assignedPlayers : [];
    }
    if (req.body.assignedUsers !== undefined) {
      coupon.assignedUsers = Array.isArray(req.body.assignedUsers) ? req.body.assignedUsers : [];
    }

    if (!coupon.isRestricted) {
      coupon.assignedPlayers = [];
      coupon.assignedUsers = [];
    }

    await coupon.save();

    const populatedCoupon = await Coupon.findById(coupon._id)
      .populate('createdBy', 'gamertag email')
      .populate('assignedPlayers', 'gamertag realName game role avatar isActive')
      .populate('assignedUsers', 'gamertag email role avatar favoriteGame');

    res.status(200).json({
      success: true,
      message: `Code promo "${coupon.code}" mis à jour avec succès`,
      coupon: populatedCoupon
    });
  } catch (error) {
    console.error('Erreur modification code promo:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la modification du code promo'
    });
  }
});

// @desc    Basculer l'autorisation / statut d'un code promo (Admin toggle)
// @route   PATCH /api/coupons/:id/toggle
// @access  Private (Admin, Moderator)
router.patch('/:id/toggle', protect, authorize('admin', 'moderator'), async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Code promo introuvable'
      });
    }

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    const populatedCoupon = await Coupon.findById(coupon._id)
      .populate('createdBy', 'gamertag email')
      .populate('assignedPlayers', 'gamertag realName game role avatar isActive')
      .populate('assignedUsers', 'gamertag email role avatar favoriteGame');

    res.status(200).json({
      success: true,
      message: coupon.isActive
        ? `Code "${coupon.code}" AUTORISÉ et activé par l'administration 🐺✅`
        : `Code "${coupon.code}" DÉSACTIVÉ / Non autorisé par l'administration ⛔`,
      isActive: coupon.isActive,
      coupon: populatedCoupon
    });
  } catch (error) {
    console.error('Erreur toggle code promo:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du changement de statut du code promo'
    });
  }
});

// @desc    Supprimer un code promo (Admin)
// @route   DELETE /api/coupons/:id
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Code promo introuvable'
      });
    }

    await coupon.deleteOne();

    res.status(200).json({
      success: true,
      message: `Code promo "${coupon.code}" supprimé avec succès`
    });
  } catch (error) {
    console.error('Erreur suppression code promo:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du code promo'
    });
  }
});

module.exports = router;
