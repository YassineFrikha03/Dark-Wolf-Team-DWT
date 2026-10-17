const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getMessagesWithUser,
  getConversations,
  markAsRead
} = require('../controllers/messageController');
const { protect } = require('../middlewares/auth');

router.use(protect); // Toutes les routes de messagerie nécessitent une authentification

router.post('/', sendMessage);
router.get('/conversations', getConversations);
router.get('/conversation/:userId', getMessagesWithUser);
router.put('/read/:userId', markAsRead);

module.exports = router;
