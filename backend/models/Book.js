const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    author: { type: String, default: '' },
    subject: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    semester: { type: Number, required: true },
    condition: { type: String, enum: ['New', 'Good', 'Fair'], default: 'Good' },
    originalPrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    description: { type: String, default: '' },
    images: [{ type: String }],
    isSold: { type: Boolean, default: false },
    reservedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // set when a buy request is accepted
    isApproved: { type: Boolean, default: true }, // admin can flip to false to hide listing
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Text index for search by title/subject/author
bookSchema.index({ title: 'text', subject: 'text', author: 'text' });

module.exports = mongoose.model('Book', bookSchema);