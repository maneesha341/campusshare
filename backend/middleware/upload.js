const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the uploads directory exists before multer tries to write into it.
// This matters on platforms with an ephemeral filesystem (like Render's free
// tier), where the folder can be missing after a fresh deploy or a spin-down —
// git doesn't track empty directories either, so relying on the folder simply
// "being there" from the repo checkout isn't reliable. Creating it defensively
// here means uploads work regardless of how the instance got into its current state.
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Store images locally in /uploads with a unique filename.
// For production, swap this storage engine for Cloudinary/S3 (see README) —
// this local approach doesn't persist across Render free-tier spin-downs.
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const ok = allowed.test(path.extname(file.originalname).toLowerCase());
  if (ok) cb(null, true);
  else cb(new Error('Only image files (jpg, jpeg, png, webp) are allowed'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per image
});

module.exports = upload;