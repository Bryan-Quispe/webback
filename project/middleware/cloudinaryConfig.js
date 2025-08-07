require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const profilePicturesStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profilePictures',
    type: 'authenticated',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const evidenceStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'evidences',
    type: 'authenticated',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});


function createSignedURL(imageId, durationSeconds)
{
    const signedUrl = cloudinary.url(imageId, {
      sign_url: true, 
      secure: true,
      type: 'authenticated',
      expires_at: Math.floor(Date.now() / 1000) + durationSeconds, 
    });
    return signedUrl;
}


module.exports = { cloudinary, evidenceStorage, profilePicturesStorage, createSignedURL };