const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// User registration - POST /api/users/register
router.post('/register', userController.register);

// User login - POST /api/users/login
router.post('/login', userController.login);

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
