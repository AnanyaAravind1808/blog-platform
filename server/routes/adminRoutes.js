const express = require('express');

const {
  getAdminStats,
  getAllUsers,
  getAllPosts,
  deleteAnyPost,
} = require('../controllers/adminController');

const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

const router = express.Router();

// All admin routes require login + admin role
router.use(protect, adminOnly);

// Dashboard statistics
router.get('/stats', getAdminStats);

// All users
router.get('/users', getAllUsers);

// All posts
router.get('/posts', getAllPosts);

// Delete any post
router.delete('/posts/:id', deleteAnyPost);

module.exports = router;