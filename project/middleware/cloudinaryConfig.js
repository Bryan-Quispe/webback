require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Configuración para imágenes de perfil (carpeta profilePictures)
const profilePicturesStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profilePictures',
    type: 'authenticated',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    resource_type: 'image',
  },
});

// Configuración para evidencias (carpeta evidences, imágenes y videos)
const evidenceStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'evidences',
    type: 'authenticated',
    allowed_formats: ['jpg', 'png', 'jpeg', 'mp4', 'mov'],
    resource_type: 'auto', // Soporta imágenes y videos
  },
});

// Configurar Multer para imágenes de perfil
const uploadProfilePictures = multer({
  storage: profilePicturesStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5MB
});

// Configurar Multer para evidencias
const uploadEvidence = multer({
  storage: evidenceStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Límite de 10MB para videos
});

function createSignedURL(publicId, durationSeconds) {
  const signedUrl = cloudinary.url(publicId, {
    sign_url: true,
    secure: true,
    type: 'authenticated',
    expires_at: Math.floor(Date.now() / 1000) + durationSeconds,
    resource_type: 'auto', // Soporta imágenes y videos
  });
  return signedUrl;
}

module.exports = {
  cloudinary,
  evidenceStorage: uploadEvidence,
  profilePictures: uploadProfilePictures,
  createSignedURL,
};
