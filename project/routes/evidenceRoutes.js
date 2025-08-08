const express = require('express');
const {
  evidenceStorage,
  createSignedURL,
} = require('../middleware/cloudinaryConfig');
const Evidence = require('../models/Evidence');
const Event = require('../models/Event');
const { authenticateToken } = require('../middleware/authenticateToken');
const router = express.Router();

// 🔐 Crear evidencia (protegido)
router.post('/evidence', authenticateToken, async (req, res) => {
  try {
    const { eventId, evidenceType, evidenceName, filePath } = req.body;

    // Validar que eventId existe
    const eventExists = await Event.findOne({ eventId: Number(eventId) });
    if (!eventExists) {
      return res.status(400).json({ mensaje: 'Evento no existe' });
    }

    // Crear nueva evidencia
    const newEvidence = new Evidence({
      eventId: Number(eventId),
      evidenceType,
      evidenceName,
      filePath, // Debe ser la URL de Cloudinary obtenida de /evidence/upload
    });

    const saved = await newEvidence.save();
    res.status(201).json(saved);
  } catch (err) {
    res
      .status(500)
      .json({ mensaje: 'Error al crear evidencia', error: err.message });
  }
});

// 🔓 Obtener evidencia por evidenceId (consulta libre)
router.get('/evidence/:id', async (req, res) => {
  try {
    const ev = await Evidence.findOne({ evidenceId: req.params.id });
    if (!ev) {
      return res.status(404).json({ mensaje: 'Evidencia no encontrada' });
    }
    res.status(200).json(ev);
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
});

// 🔓 Obtener evidencias por eventId (consulta libre)
router.get('/evidences/event/:eventId', async (req, res) => {
  try {
    const evidences = await Evidence.find({
      eventId: Number(req.params.eventId),
    });
    res.status(200).json(evidences);
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
});

// 🔓 Obtener evidencias por processId (consulta libre)
router.get('/evidences/process/:processId', async (req, res) => {
  try {
    const processId = Number(req.params.processId);
    if (isNaN(processId)) {
      return res.status(400).json({ mensaje: 'processId debe ser un número' });
    }

    const events = await Event.find({ processId });
    const eventIds = events.map((e) => e.eventId);

    const evidences = await Evidence.find({ eventId: { $in: eventIds } });

    res.status(200).json(evidences);
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
});

// 🔐 Actualizar evidencia por evidenceId (protegido)
router.put('/evidence/:id', authenticateToken, async (req, res) => {
  try {
    const updated = await Evidence.findOneAndUpdate(
      { evidenceId: req.params.id },
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ mensaje: 'Evidencia no encontrada' });
    }
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
});

// 🔐 Eliminar evidencia por evidenceId (protegido)
router.delete('/evidence/:id', authenticateToken, async (req, res) => {
  try {
    const deleted = await Evidence.deleteOne({ evidenceId: req.params.id });
    if (deleted.deletedCount === 0) {
      return res.status(404).json({ mensaje: 'Evidencia no encontrada' });
    }
    res.status(200).json({ mensaje: 'Evidencia eliminada' });
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
});

// 🔐 Subir archivo (protegido)
router.post(
  '/evidence/upload',
  authenticateToken,
  evidenceStorage.single('file'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ mensaje: 'No se ha subido ningún archivo' });
      }

      const fileUrl = req.file.path; // URL segura de Cloudinary
      const publicId = req.file.filename.split('/').pop(); // Extraer public ID
      const signedUrl = createSignedURL(publicId, 3600); // URL firmada válida por 1 hora

      res.status(200).json({
        urlArchivo: fileUrl,
        urlFirmada: signedUrl,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        mensaje: 'Error al subir el archivo a Cloudinary',
        error: err.message,
      });
    }
  }
);

module.exports = router;
