const express = require('express');
const router = express.Router();
const { getUsers, deleteUser, getStats } = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

router.use(protect, admin);
router.get('/', getUsers);
router.get('/stats/overview', getStats);
router.delete('/:id', deleteUser);

module.exports = router;