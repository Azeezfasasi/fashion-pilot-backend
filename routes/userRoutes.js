const User = require('../models/User');
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const parser = require('../config/multer');

// User registration - POST /api/users/register
router.post('/register', userController.register);

// User login - POST /api/users/login
router.post('/login', userController.login);

// Profile image upload - POST /api/users/upload-profile
router.post('/upload-profile', auth, parser.single('image'), async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { profileImage: req.file.path });
  res.json({ imageUrl: req.file.path });
});

// Company logo upload - POST /api/users/upload-logo
router.post('/upload-logo', auth, parser.single('logo'), async (req, res) => {
  // Save logo URL to employer profile
  await User.findByIdAndUpdate(req.user.id, { logo: req.file.path });
  res.json({ logoUrl: req.file.path });
});

// Company banner upload - POST /api/users/upload-banner
router.post('/upload-banner', auth, parser.single('banner'), async (req, res) => {
  // Save banner URL to employer profile
  await User.findByIdAndUpdate(req.user.id, { bannerImage: req.file.path });
  res.json({ bannerUrl: req.file.path });
});

// Verify - GET /api/users/verify
router.get('/verify', userController.verifyEmail);

// Get Profile - Get /api/users/me
router.get('/me', auth, userController.getProfile);

// Update Profile - PUT /api/users/me
router.put('/me', auth, userController.updateProfile);

// POST /api/users/favorites/:jobId
router.post('/favorites/:jobId', auth, userController.addFavoriteJob);

// DELETE /api/users/favorites/:jobId
router.delete('/favorites/:jobId', auth, userController.removeFavoriteJob);

// GET /api/users/favorites
router.get('/favorites', auth, userController.getFavoriteJobs);

// GET /api/users/all 
router.get('/all', userController.getAllUsers);

// GET /api/users/employers
router.get('/employers', userController.getAllEmployers);

module.exports = router;
