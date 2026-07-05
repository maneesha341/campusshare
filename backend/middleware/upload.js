const multer = require('multer');

// Images are held in memory just long enough for the controller to save them
// into MongoDB (see models/Image.js) — nothing is ever written to local disk,
// which is what makes this immune to Render's free-tier filesystem resets.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const ext = file.originalname.split('.').pop().toLowerCase();
  if (allowed.test(ext)) cb(null, true);
  else cb(new Error('Only image files (jpg, jpeg, png, webp) are allowed'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per image
});

module.exports = upload;