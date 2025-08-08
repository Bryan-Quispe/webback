const express = require('express');
const {
  cloudinary,
  profilePictures,
  createSignedURL,
} = require('../middleware/cloudinaryConfig');
const UserProfile = require('../models/UserProfile');
const { authenticateToken } = require('../middleware/authenticateToken');
const router = express.Router();

// 🔓 Obtener todos los perfiles de usuario
router.get('/profiles', async (req, res) => {
  try {
    const profiles = await UserProfile.find();
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: 'No se pudieron obtener los perfiles' });
  }
});

// 🔓 Obtener perfil de usuario por ID
router.get('/profile/:id', async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ profileId: req.params.id });
    if (!profile) {
      return res.status(404).json({ mensaje: 'Perfil no encontrado' });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
});

// 🔐 Crear nuevo perfil
router.post('/profile', authenticateToken, async (req, res) => {
  const newProfile = new UserProfile({
    profileId: req.body.profileId,
    title: req.body.title,
    bio: req.body.bio,
    address: req.body.address,
    profilePicture: req.body.profilePicture,
    accountId: req.body.accountId,
  });

  try {
    const createdProfile = await newProfile.save();
    res.status(201).json(createdProfile);
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
});

// 🔐 Actualizar perfil existente
router.put('/profile/update/:id', authenticateToken, async (req, res) => {
  const updatedData = {
    title: req.body.title,
    bio: req.body.bio,
    address: req.body.address,
    accountId: req.body.accountId,
  };

  try {
    const updatedProfile = await UserProfile.findOneAndUpdate(
      { profileId: req.params.id },
      updatedData,
      { new: true }
    );
    if (!updatedProfile) {
      return res.status(404).json({ mensaje: 'Perfil no encontrado' });
    }
    res.status(200).json(updatedProfile);
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
});

// 🔐 Eliminar perfil
router.delete('/profile/delete/:id', authenticateToken, async (req, res) => {
  try {
    const deletedProfile = await UserProfile.deleteOne({
      profileId: req.params.id,
    });
    if (deletedProfile.deletedCount === 0) {
      return res.status(404).json({ mensaje: 'Perfil no encontrado' });
    }
    res.status(200).json({ mensaje: 'Perfil eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
});

// 🔐 Subir o Actualizar imagen de perfil
router.post(
  '/profile/uploadImage/:id',
  authenticateToken,
  profilePictures.single('file'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ mensaje: 'No se ha subido ningún archivo' });
      }

      const updated = await UserProfile.findOneAndUpdate(
        { profileId: req.params.id },
        { profilePicture: req.file.path }, // URL segura de Cloudinary
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ mensaje: 'Perfil no encontrado' });
      }

      // Generar URL firmada (válida por 1 hora)
      const publicId = req.file.filename.split('/').pop(); // Extraer public ID
      const signedUrl = createSignedURL(publicId, 3600);

      res.status(200).json({
        imagenPerfil: updated.profilePicture,
        urlFirmada: signedUrl,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        mensaje: 'Error al subir la imagen de perfil a Cloudinary',
        error: err.message,
      });
    }
  }
);

module.exports = router;
