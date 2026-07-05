const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const User = require('../models/User');

// Recalculate and persist a seller's average rating + review count.
// Called after any review is created, updated, or deleted.
const recalculateSellerRating = async (sellerId) => {
  const stats = await Review.aggregate([
    { $match: { seller: sellerId } },
    { $group: { _id: '$seller', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);

  const rating = stats.length > 0 ? Math.round(stats[0].avgRating * 10) / 10 : 0;
  const numReviews = stats.length > 0 ? stats[0].count : 0;

  await User.findByIdAndUpdate(sellerId, { rating, numReviews });
};

// @desc    Create a review for a seller, tied to a specific book listing
// @route   POST /api/reviews
// @access  Private
// body: { sellerId, bookId, rating, comment }
const createReview = asyncHandler(async (req, res) => {
  const { sellerId, bookId, rating, comment } = req.body;

  if (!sellerId || !bookId || !rating) {
    res.status(400);
    throw new Error('sellerId, bookId and rating are required');
  }

  if (sellerId === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot review yourself');
  }

  const alreadyReviewed = await Review.findOne({ reviewer: req.user._id, book: bookId });
  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You have already reviewed this listing');
  }

  const review = await Review.create({
    seller: sellerId,
    reviewer: req.user._id,
    book: bookId,
    rating,
    comment,
  });

  await recalculateSellerRating(sellerId);

  const populated = await review.populate('reviewer', 'name');
  res.status(201).json(populated);
});

// @desc    Get all reviews for a seller, newest first
// @route   GET /api/reviews/seller/:sellerId
// @access  Public
const getSellerReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ seller: req.params.sellerId })
    .sort({ createdAt: -1 })
    .populate('reviewer', 'name')
    .populate('book', 'title');
  res.json(reviews);
});

// @desc    Check whether the logged-in user has already reviewed a given book's seller
// @route   GET /api/reviews/mine/:bookId
// @access  Private
const getMyReviewForBook = asyncHandler(async (req, res) => {
  const review = await Review.findOne({ reviewer: req.user._id, book: req.params.bookId });
  res.json(review);
});

// @desc    Delete a review (author or admin only) — also recalculates seller rating
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  if (review.reviewer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this review');
  }
  const sellerId = review.seller;
  await review.deleteOne();
  await recalculateSellerRating(sellerId);
  res.json({ message: 'Review removed' });
});

module.exports = { createReview, getSellerReviews, getMyReviewForBook, deleteReview };