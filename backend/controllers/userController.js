const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Book = require('../models/Book');

// @desc    Get all users (admin)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// @desc    Delete a user (admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  await user.deleteOne();
  res.json({ message: 'User removed' });
});

// @desc    Platform statistics (admin dashboard)
// @route   GET /api/users/stats/overview
// @access  Private/Admin
const getStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalBooks = await Book.countDocuments();
  const soldBooks = await Book.countDocuments({ isSold: true });
  const activeBooks = await Book.countDocuments({ isSold: false, isApproved: true });

  res.json({ totalUsers, totalBooks, soldBooks, activeBooks });
});

module.exports = { getUsers, deleteUser, getStats };