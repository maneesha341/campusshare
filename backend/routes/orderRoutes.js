const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getMyOrderForBook,
  getSellerOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/mine', getMyOrders);
router.get('/mine/:bookId', getMyOrderForBook);
router.get('/seller', getSellerOrders);
router.post('/', createOrder);
router.put('/:id', updateOrderStatus);

module.exports = router;