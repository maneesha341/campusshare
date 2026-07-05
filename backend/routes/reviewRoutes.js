const express = require('express');
const router = express.Router();
const { createReview, getSellerReviews, getMyReviewForBook, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.get('/seller/:sellerId', getSellerReviews); // public — anyone can see a seller's reviews
router.get('/mine/:bookId', protect, getMyReviewForBook);
router.post('/', protect, createReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;