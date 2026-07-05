const asyncHandler = require('express-async-handler');
const Book = require('../models/Book');
const Image = require('../models/Image');

// Saves uploaded files into MongoDB as Image documents and returns their
// public URLs (/api/images/:id) to store on the Book document.
const saveImages = async (files = []) => {
  const urls = [];
  for (const file of files) {
    const image = await Image.create({ data: file.buffer, contentType: file.mimetype });
    urls.push(`/api/images/${image._id}`);
  }
  return urls;
};

// Extracts the Image document _id from a stored "/api/images/:id" path.
const imageIdFromUrl = (url) => url.split('/').pop();

// @desc    Create a new book listing
// @route   POST /api/books
// @access  Private
const createBook = asyncHandler(async (req, res) => {
  const { title, author, subject, department, semester, condition, originalPrice, sellingPrice, description } = req.body;

  if (!title || !subject || !department || !semester || !sellingPrice) {
    res.status(400);
    throw new Error('Please fill all required fields');
  }

  const images = await saveImages(req.files);

  const book = await Book.create({
    seller: req.user._id,
    title,
    author,
    subject,
    department,
    semester,
    condition,
    originalPrice,
    sellingPrice,
    description,
    images,
  });

  res.status(201).json(book);
});

// @desc    Get all books with search/filter/pagination
// @route   GET /api/books
// @access  Public
// Query params: keyword, department, semester, subject, condition, minPrice, maxPrice, sort, page, limit
const getBooks = asyncHandler(async (req, res) => {
  const {
    keyword,
    department,
    semester,
    subject,
    condition,
    minPrice,
    maxPrice,
    sort,
    page = 1,
    limit = 12,
    includeSold,
  } = req.query;

  const query = {};

  if (keyword) {
    query.$text = { $search: keyword };
  }
  if (department) query.department = department;
  if (semester) query.semester = Number(semester);
  if (subject) query.subject = { $regex: subject, $options: 'i' };
  if (condition) query.condition = condition;
  if (minPrice || maxPrice) {
    query.sellingPrice = {};
    if (minPrice) query.sellingPrice.$gte = Number(minPrice);
    if (maxPrice) query.sellingPrice.$lte = Number(maxPrice);
  }
  if (!includeSold) query.isSold = false;
  query.isApproved = true;

  let sortOption = { createdAt: -1 }; // newest first (default)
  if (sort === 'priceAsc') sortOption = { sellingPrice: 1 };
  if (sort === 'priceDesc') sortOption = { sellingPrice: -1 };
  if (sort === 'popular') sortOption = { views: -1 };

  const pageNum = Number(page);
  const limitNum = Number(limit);

  const total = await Book.countDocuments(query);
  const books = await Book.find(query)
    .populate('seller', 'name email phone college rating')
    .populate('reservedBy', 'name')
    .sort(sortOption)
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum);

  res.json({
    books,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    total,
  });
});

// @desc    Get single book by id
// @route   GET /api/books/:id
// @access  Public
const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id)
    .populate('seller', 'name email phone college rating numReviews')
    .populate('reservedBy', 'name');
  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }
  book.views += 1;
  await book.save();
  res.json(book);
});

// @desc    Update a book listing (owner only)
// @route   PUT /api/books/:id
// @access  Private
const updateBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }
  if (book.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this listing');
  }

  const fields = ['title', 'author', 'subject', 'department', 'semester', 'condition', 'originalPrice', 'sellingPrice', 'description', 'isSold'];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) book[f] = req.body[f];
  });

  if (req.files && req.files.length > 0) {
    const newImages = await saveImages(req.files);
    book.images = [...book.images, ...newImages];
  }

  const updated = await book.save();
  res.json(updated);
});

// @desc    Delete a book listing (owner only)
// @route   DELETE /api/books/:id
// @access  Private
const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }
  if (book.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this listing');
  }
  // Clean up this book's images from MongoDB too — otherwise every deleted
  // listing leaves orphaned Image documents quietly eating your Atlas quota.
  const imageIds = (book.images || []).map(imageIdFromUrl);
  if (imageIds.length > 0) {
    await Image.deleteMany({ _id: { $in: imageIds } });
  }
  await book.deleteOne();
  res.json({ message: 'Listing removed' });
});

// @desc    Get logged-in user's own listings (seller dashboard)
// @route   GET /api/books/mine/all
// @access  Private
const getMyBooks = asyncHandler(async (req, res) => {
  const books = await Book.find({ seller: req.user._id }).sort({ createdAt: -1 });
  res.json(books);
});

module.exports = { createBook, getBooks, getBookById, updateBook, deleteBook, getMyBooks };