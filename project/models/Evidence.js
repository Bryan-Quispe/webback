const mongoose = require('mongoose');

const evidenceSchema = new mongoose.Schema({
  evidenceId: Number,
  evidenceType: String,
  evidenceName: String,
  filePath: String,
  eventId: Number,
});

module.exports = mongoose.model('Evidence', evidenceSchema, 'evidence');
