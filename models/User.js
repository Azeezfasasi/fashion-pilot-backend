const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: {String},
  socialLinks: [String],
  address: {String},
  location: {String},
  country: {String},
  jobRole: {String},
  role: { type: String, enum: ['employer', 'candidate', 'admin'], required: true },
  createdAt: { type: Date, default: Date.now },
  favoriteJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],

  // Candidate profile fields
  resume: { type: String }, // file path or URL
  skills: [String],
  experience: { type: String },
  profileImage: {type: String},
  headline: {type: String},
  personalWebsite: {type: String},
  nationality: {type: String},
  dateOfBirth: {type: String},
  gender: {type: String},
  maritalStatus: {type: String},
  education: {type: String},
  biography: {type: String},

  // Employer profile fields
  company: { type: String },
  website: { type: String },
  logo: {type: String},
  bannerImage: {type: String},
  aboutUs: {type: String},
  organizationType: {type: String},
  industryType: {type: String},
  teamSize: {type: String},
  establishmentYear: {type: String},
  companyWebsite: {type: String},
  companyDetails: {type: String},
  
  // Email verification
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});

module.exports = mongoose.model('User', userSchema);
