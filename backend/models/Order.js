const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // requested -> accepted -> completed  (happy path)
    // requested -> declined               (seller says no)
    // requested/accepted -> cancelled     (either side backs out)
    status: {
      type: String,
      enum: ['requested', 'accepted', 'declined', 'completed', 'cancelled'],
      default: 'requested',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);