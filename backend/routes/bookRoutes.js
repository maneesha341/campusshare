const express = require('express');
const router = express.Router();
const {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
  getMyBooks,
} = require('../controllers/bookController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// IMPORTANT: /mine/all must be declared before /:id to avoid route collision
router.get('/mine/all', protect, getMyBooks);

router.route('/')
  .get(getBooks)
  .post(protect, upload.array('images', 5), createBook);

router.route('/:id')
  .get(getBookById)
  .put(protect, upload.array('images', 5), updateBook)
  .delete(protect, deleteBook);

module.exports = router;