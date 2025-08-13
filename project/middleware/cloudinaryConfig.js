require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Configuración para imágenes de perfil (solo imágenes)
const profilePicturesStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profilePictures',
    type: 'authenticated',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    resource_type: 'image',
  },
});

// Configuración para evidencias (imágenes, videos y documentos)
const evidenceStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'evidences',
    type: 'authenticated',
    allowed_formats: [
      'jpg',
      'png',
      'jpeg', // imágenes
      'mp4',
      'mov', // videos
      'pdf',
      'doc',
      'docx', // documentos
    ],
    resource_type: 'auto', // Detecta imágenes, videos y documentos
  },
});

// Multer para imágenes de perfil
const uploadProfilePictures = multer({
  storage: profilePicturesStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Multer para evidencias
const uploadEvidence = multer({
  storage: evidenceStorage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB para videos/documentos
});

// Crear URL firmada con vencimiento
function createSignedURL(publicId, durationSeconds) {
  const signedUrl = cloudinary.url(publicId, {
    sign_url: true,
    secure: true,
    type: 'authenticated',
    expires_at: Math.floor(Date.now() / 1000) + durationSeconds,
    resource_type: 'auto',
  });
  return signedUrl;
}

module.exports = {
  cloudinary,
  evidenceStorage: uploadEvidence,
  profilePictures: uploadProfilePictures,
  createSignedURL,
};
