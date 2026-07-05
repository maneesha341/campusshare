const asyncHandler = require('express-async-handler');
const Message = require('../models/Message');
const Book = require('../models/Book');
const createNotification = require('../utils/createNotification');

// @desc    Send a message about a book
// @route   POST /api/messages
// @access  Private
// body: { bookId, receiverId, text }
const sendMessage = asyncHandler(async (req, res) => {
  const { bookId, receiverId, text } = req.body;

  if (!bookId || !receiverId || !text?.trim()) {
    res.status(400);
    throw new Error('bookId, receiverId and text are required');
  }

  if (receiverId === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot message yourself');
  }

  const book = await Book.findById(bookId);
  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }

  const message = await Message.create({
    book: bookId,
    sender: req.user._id,
    receiver: receiverId,
    text: text.trim(),
  });

  const populated = await message.populate([
    { path: 'sender', select: 'name' },
    { path: 'receiver', select: 'name' },
  ]);

  await createNotification(
    receiverId,
    'message',
    `${req.user.name} sent you a message about "${book.title}"`,
    `/chat/${bookId}/${req.user._id}`
  );

  res.status(201).json(populated);
});

// @desc    Get full message thread for a book between the logged-in user and another user
// @route   GET /api/messages/thread/:bookId/:otherUserId
// @access  Private
const getThread = asyncHandler(async (req, res) => {
  const { bookId, otherUserId } = req.params;
  const me = req.user._id;

  const messages = await Message.find({
    book: bookId,
    $or: [
      { sender: me, receiver: otherUserId },
      { sender: otherUserId, receiver: me },
    ],
  })
    .sort({ createdAt: 1 })
    .populate('sender', 'name')
    .populate('receiver', 'name');

  // Mark messages sent TO me in this thread as read
  await Message.updateMany(
    { book: bookId, sender: otherUserId, receiver: me, read: false },
    { $set: { read: true } }
  );

  const book = await Book.findById(bookId).select('title images sellingPrice seller');

  res.json({ messages, book });
});

// @desc    Get inbox — one row per (book, other user) conversation, most recent first
// @route   GET /api/messages/inbox
// @access  Private
const getInbox = asyncHandler(async (req, res) => {
  const me = req.user._id;

  const messages = await Message.find({ $or: [{ sender: me }, { receiver: me }] })
    .sort({ createdAt: -1 })
    .populate('sender', 'name')
    .populate('receiver', 'name')
    .populate('book', 'title images sellingPrice isSold');

  // Group into conversations client-side-style, keyed by book + other participant
  const conversations = new Map();

  for (const msg of messages) {
    if (!msg.book) continue; // book may have been deleted
    const otherUser = msg.sender._id.toString() === me.toString() ? msg.receiver : msg.sender;
    const key = `${msg.book._id}_${otherUser._id}`;

    if (!conversations.has(key)) {
      conversations.set(key, {
        book: msg.book,
        otherUser,
        lastMessage: msg.text,
        lastAt: msg.createdAt,
        unreadCount: 0,
      });
    }
    const convo = conversations.get(key);
    if (msg.receiver._id.toString() === me.toString() && !msg.read) {
      convo.unreadCount += 1;
    }
  }

  res.json(Array.from(conversations.values()));
});

module.exports = { sendMessage, getThread, getInbox };