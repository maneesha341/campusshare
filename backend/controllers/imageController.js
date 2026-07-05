const asyncHandler = require('express-async-handler');
const Image = require('../models/Image');

// @desc    Serve a single image's raw bytes by its MongoDB _id
// @route   GET /api/images/:id
// @access  Public — anyone viewing a book listing needs to see its photos
const getImage = asyncHandler(async (req, res) => {
  const image = await Image.findById(req.params.id);
  if (!image) {
    res.status(404);
    throw new Error('Image not found');
  }
  res.set('Content-Type', image.contentType);
  // Images never change once uploaded (re-uploading creates a new _id), so
  // browsers/CDNs can cache them indefinitely rather than re-fetching.
  res.set('Cache-Control', 'public, max-age=31536000, immutable');
  res.send(image.data);
});

module.exports = { getImage };