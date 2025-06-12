const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const crypto = require('crypto');

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, phoneNumber, company, website, skills, experience } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: 'Email already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      phoneNumber,
      company: role === 'employer' ? company : undefined,
      website: role === 'employer' ? website : undefined,
      skills: role === 'candidate' ? skills : undefined,
      experience: role === 'candidate' ? experience : undefined,
      verificationToken,
    });
    await user.save();
    // TODO: Send verification email with token
    res.status(201).json({ message: 'Registration successful. Please verify your email.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const user = await User.findOne({ verificationToken: token });
    if (!user) return res.status(400).json({ error: 'Invalid or expired token' });
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    res.json({ message: 'Email verified successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a job to favorites
exports.addFavoriteJob = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { favoriteJobs: req.params.jobId } },
      { new: true }
    );
    res.json(user.favoriteJobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove a job from favorites
exports.removeFavoriteJob = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { favoriteJobs: req.params.jobId } },
      { new: true }
    );
    res.json(user.favoriteJobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all favorite jobs (populated)
exports.getFavoriteJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favoriteJobs');
    res.json(user.favoriteJobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all users (for stats, admin, etc.)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await require('../models/User').find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllEmployers = async (req, res) => {
  try {
    const employers = await User.find({ role: 'employer' }).select('-password'); // Exclude password
    res.json(employers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};