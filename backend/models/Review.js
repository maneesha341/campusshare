const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // who is being reviewed
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // who wrote it
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true }, // which transaction/listing this is about
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '', trim: true },
  },
  { timestamps: true }
);

// One review per (reviewer, book) — you can review a seller once per listing you contacted them about
reviewSchema.index({ reviewer: 1, book: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);