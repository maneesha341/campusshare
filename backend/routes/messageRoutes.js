const express = require('express');
const router = express.Router();
const { sendMessage, getThread, getInbox } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/inbox', getInbox);
router.get('/thread/:bookId/:otherUserId', getThread);
router.post('/', sendMessage);

module.exports = router;