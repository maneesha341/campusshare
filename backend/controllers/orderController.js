const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Book = require('../models/Book');
const createNotification = require('../utils/createNotification');

// @desc    Request to buy a book (creates a pending order)
// @route   POST /api/orders
// @access  Private
// body: { bookId }
const createOrder = asyncHandler(async (req, res) => {
  const { bookId } = req.body;

  const book = await Book.findById(bookId);
  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }
  if (book.isSold) {
    res.status(400);
    throw new Error('This book has already been sold');
  }
  if (book.seller.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot buy your own listing');
  }
  if (book.reservedBy) {
    res.status(400);
    throw new Error('This book is already reserved for another buyer');
  }

  const existing = await Order.findOne({
    book: bookId,
    buyer: req.user._id,
    status: { $in: ['requested', 'accepted'] },
  });
  if (existing) {
    res.status(400);
    throw new Error('You already have an active request for this book');
  }

  const order = await Order.create({
    book: bookId,
    buyer: req.user._id,
    seller: book.seller,
  });

  await createNotification(
    book.seller,
    'order_requested',
    `${req.user.name} wants to buy "${book.title}"`,
    `/dashboard`
  );

  res.status(201).json(order);
});

// @desc    Get the logged-in user's own purchase requests (buyer side)
// @route   GET /api/orders/mine
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ buyer: req.user._id })
    .sort({ createdAt: -1 })
    .populate('book', 'title images sellingPrice isSold')
    .populate('seller', 'name phone email');
  res.json(orders);
});

// @desc    Check the logged-in user's own order status for one specific book
// @route   GET /api/orders/mine/:bookId
// @access  Private
const getMyOrderForBook = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    book: req.params.bookId,
    buyer: req.user._id,
    status: { $in: ['requested', 'accepted', 'completed'] },
  }).sort({ createdAt: -1 });
  res.json(order);
});

// @desc    Get incoming purchase requests for the logged-in user's listings (seller side)
// @route   GET /api/orders/seller
// @access  Private
const getSellerOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ seller: req.user._id })
    .sort({ createdAt: -1 })
    .populate('book', 'title images sellingPrice isSold')
    .populate('buyer', 'name phone email');
  res.json(orders);
});

// @desc    Update an order's status (accept / decline / complete / cancel)
// @route   PUT /api/orders/:id
// @access  Private
// body: { action: 'accept' | 'decline' | 'complete' | 'cancel' }
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { action } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const isSeller = order.seller.toString() === req.user._id.toString();
  const isBuyer = order.buyer.toString() === req.user._id.toString();
  if (!isSeller && !isBuyer) {
    res.status(403);
    throw new Error('Not authorized for this order');
  }

  const book = await Book.findById(order.book);

  if (action === 'accept') {
    if (!isSeller) { res.status(403); throw new Error('Only the seller can accept a request'); }
    if (order.status !== 'requested') { res.status(400); throw new Error('Only pending requests can be accepted'); }

    order.status = 'accepted';
    await order.save();

    // Reserve the book for this buyer and auto-decline any other pending requests
    if (book) {
      book.reservedBy = order.buyer;
      await book.save();
    }
    await Order.updateMany(
      { book: order.book, _id: { $ne: order._id }, status: 'requested' },
      { $set: { status: 'declined' } }
    );

    await createNotification(
      order.buyer,
      'order_accepted',
      `Your request for "${book?.title || 'a book'}" was accepted 🎉`,
      `/books/${order.book}`
    );
  } else if (action === 'decline') {
    if (!isSeller) { res.status(403); throw new Error('Only the seller can decline a request'); }
    if (order.status !== 'requested') { res.status(400); throw new Error('Only pending requests can be declined'); }
    order.status = 'declined';
    await order.save();

    await createNotification(
      order.buyer,
      'order_declined',
      `Your request for "${book?.title || 'a book'}" was declined`,
      `/books/${order.book}`
    );
  } else if (action === 'complete') {
    if (!isSeller) { res.status(403); throw new Error('Only the seller can mark an order complete'); }
    if (order.status !== 'accepted') { res.status(400); throw new Error('Only accepted orders can be completed'); }
    order.status = 'completed';
    await order.save();
    if (book) {
      book.isSold = true;
      await book.save();
    }

    await createNotification(
      order.buyer,
      'order_completed',
      `Your purchase of "${book?.title || 'a book'}" is complete. Don't forget to leave a review!`,
      `/books/${order.book}`
    );
  } else if (action === 'cancel') {
    if (!['requested', 'accepted'].includes(order.status)) {
      res.status(400);
      throw new Error('This order can no longer be cancelled');
    }
    const wasAccepted = order.status === 'accepted';
    order.status = 'cancelled';
    await order.save();
    if (wasAccepted && book) {
      book.reservedBy = null;
      await book.save();
    }
  } else {
    res.status(400);
    throw new Error('Invalid action');
  }

  res.json(order);
});

module.exports = { createOrder, getMyOrders, getMyOrderForBook, getSellerOrders, updateOrderStatus };