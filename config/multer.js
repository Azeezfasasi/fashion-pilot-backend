const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'fashion-pilot', // Change as needed
    allowed_formats: ['jpg', 'png', 'jpeg', 'pdf', 'docx'],
  },
});

const parser = multer({ storage: storage });

module.exports = parser;