const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // recipient
    type: {
      type: String,
      enum: ['order_requested', 'order_accepted', 'order_declined', 'order_completed', 'message'],
      required: true,
    },
    text: { type: String, required: true },
    link: { type: String, default: '' }, // where clicking the notification should take you, e.g. /books/:id
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, read: 1 });

module.exports = mongoose.model('Notification', notificationSchema);