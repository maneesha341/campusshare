const asyncHandler = require('express-async-handler');
const Wishlist = require('../models/Wishlist');

// @desc    Get logged-in user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  const items = await Wishlist.find({ user: req.user._id }).populate({
    path: 'book',
    populate: { path: 'seller', select: 'name college' },
  });
  res.json(items);
});

// @desc    Add a book to wishlist
// @route   POST /api/wishlist/:bookId
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
  const exists = await Wishlist.findOne({ user: req.user._id, book: req.params.bookId });
  if (exists) {
    res.status(400);
    throw new Error('Book already in wishlist');
  }
  const item = await Wishlist.create({ user: req.user._id, book: req.params.bookId });
  res.status(201).json(item);
});

// @desc    Remove a book from wishlist
// @route   DELETE /api/wishlist/:bookId
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
  await Wishlist.findOneAndDelete({ user: req.user._id, book: req.params.bookId });
  res.json({ message: 'Removed from wishlist' });
});

module.exports = { getWishlist, addToWishlist, removeFromWishlist };