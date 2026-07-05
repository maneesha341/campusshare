const express = require('express');
const router = express.Router();
const { getAllBooksAdmin, getAllOrders, getAllReviews } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

router.use(protect, admin);

router.get('/books', getAllBooksAdmin);
router.get('/orders', getAllOrders);
router.get('/reviews', getAllReviews);

module.exports = router;