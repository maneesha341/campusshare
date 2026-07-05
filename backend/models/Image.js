const mongoose = require('mongoose');

// Images are stored directly in MongoDB as binary data, rather than on the
// backend's local disk. This sidesteps Render's free-tier problem where the
// local filesystem resets on every spin-down (silently deleting uploaded
// files) — MongoDB Atlas is a separate, persistent service unaffected by that.
//
// Tradeoff worth knowing: this counts against your MongoDB Atlas storage quota
// (512MB on the free M0 tier), shared with all your other collections. A
// dedicated image host (e.g. Cloudinary) wouldn't eat into that quota at all.
// For a portfolio project with modest image sizes this is a fine trade —
// just don't expect to store thousands of large photos on the free tier.
const imageSchema = new mongoose.Schema(
  {
    data: { type: Buffer, required: true },
    contentType: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Image', imageSchema);