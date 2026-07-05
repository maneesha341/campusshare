const asyncHandler = require('express-async-handler');
const Book = require('../models/Book');
const Order = require('../models/Order');
const Review = require('../models/Review');

// @desc    Get every book listing on the platform, regardless of status/approval
// @route   GET /api/admin/books
// @access  Private/Admin
const getAllBooksAdmin = asyncHandler(async (req, res) => {
  const books = await Book.find({})
    .sort({ createdAt: -1 })
    .populate('seller', 'name email')
    .populate('reservedBy', 'name');
  res.json(books);
});

// @desc    Get every order on the platform (who bought what, from whom, for how much)
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .sort({ createdAt: -1 })
    .populate('book', 'title sellingPrice images')
    .populate('buyer', 'name email')
    .populate('seller', 'name email');
  res.json(orders);
});

// @desc    Get every review on the platform
// @route   GET /api/admin/reviews
// @access  Private/Admin
const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({})
    .sort({ createdAt: -1 })
    .populate('book', 'title')
    .populate('seller', 'name')
    .populate('reviewer', 'name');
  res.json(reviews);
});

module.exports = { getAllBooksAdmin, getAllOrders, getAllReviews };