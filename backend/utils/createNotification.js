const Notification = require('../models/Notification');

// Fire-and-forget helper used across controllers (orders, messages, etc.)
// to create a notification without cluttering business logic with try/catch everywhere.
const createNotification = async (userId, type, text, link = '') => {
  try {
    await Notification.create({ user: userId, type, text, link });
  } catch (err) {
    // Notifications are best-effort — never let a failure here break the main request.
    console.error('Failed to create notification:', err.message);
  }
};

module.exports = createNotification;