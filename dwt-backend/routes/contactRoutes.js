const express = require('express');
const router = express.Router();
const {
  submitMessage,
  getMessages,
  updateMessageStatus,
  deleteMessage
} = require('../controllers/contactController');
const { protect, authorize } = require('../middlewares/auth');

router.post('/', submitMessage);

// Administration des messages
router.get('/', protect, authorize('admin', 'moderator'), getMessages);
router.put('/:id', protect, authorize('admin', 'moderator'), updateMessageStatus);
router.delete('/:id', protect, authorize('admin'), deleteMessage);

module.exports = router;
