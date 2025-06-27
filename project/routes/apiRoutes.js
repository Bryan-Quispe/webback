const express = require('express');
const router = express.Router();
const Account = require('../models/Account');
const Event = require('../models/Event');
const Process = require('../models/Process');

// GET /accounts → Obtener todas las cuentas
router.get('/account', async (req, res) => {
  try {
    const accounts = await Account.find();
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener las cuentas' });
  }
});

// PUT /events/:id → Actualizar evento por ID
router.put('/event/:id', async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedEvent)
      return res.status(404).json({ error: 'Evento no encontrado' });
    res.json(updatedEvent);
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar el evento' });
  }
});

// DELETE /processes/:id → Eliminar proceso por ID
router.delete('/process/:id', async (req, res) => {
  try {
    const deletedProcess = await Process.findByIdAndDelete(req.params.id);
    if (!deletedProcess)
      return res.status(404).json({ error: 'Proceso no encontrado' });
    res.json({ message: 'Proceso eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar el proceso' });
  }
});

module.exports = router;
