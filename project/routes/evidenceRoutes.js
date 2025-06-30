const express = require("express");
const multer = require("multer");
const Evidence = require("../models/Evidence");
const router = express.Router();

// Configuración de almacenamiento de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Crear evidencia
router.post("/evidence", async (req, res) => {
  try {
    const newEvidence = new Evidence(req.body);
    const saved = await newEvidence.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtener evidencia por evidenceId
router.get("/evidence/:id", async (req, res) => {
  try {
    const ev = await Evidence.findOne({ evidenceId: req.params.id });
    ev ? res.status(200).json(ev) : res.status(404).json({});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Actualizar evidencia
router.put("/evidence/:id", async (req, res) => {
  try {
    const updated = await Evidence.findOneAndUpdate(
      { evidenceId: req.params.id },
      req.body,
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Eliminar evidencia
router.delete("/evidence/:id", async (req, res) => {
  try {
    const deleted = await Evidence.deleteOne({ evidenceId: req.params.id });
    res.status(200).json(deleted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Subir archivo
router.post("/evidence/upload", upload.single("file"), async (req, res) => {
  try {
    res.status(200).json({ filePath: req.file.path });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtener evidencias por eventId
router.get("/evidences/event/:eventId", async (req, res) => {
  try {
    const list = await Evidence.find({ eventId: req.params.eventId });
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
