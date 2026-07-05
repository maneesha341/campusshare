// One-off script to promote an existing user to admin.
// Usage (from the backend folder):
//   node scripts/makeAdmin.js someone@example.com
//
// This is intentionally NOT an API route — promoting someone to admin should
// never be reachable over HTTP without extremely tight access control, so it's
// a script you run yourself, directly against the database, when you need it.

const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const User = require('../models/User');

const run = async () => {
  const email = process.argv[2];

  if (!email) {
    console.error('Usage: node scripts/makeAdmin.js <email>');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    console.error(`No user found with email: ${email}`);
    await mongoose.disconnect();
    process.exit(1);
  }

  if (user.role === 'admin') {
    console.log(`${user.name} (${user.email}) is already an admin.`);
  } else {
    user.role = 'admin';
    await user.save();
    console.log(`✓ ${user.name} (${user.email}) is now an admin.`);
  }

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});