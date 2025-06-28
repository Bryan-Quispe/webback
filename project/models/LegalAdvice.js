const mongoose = require('mongoose');

const legalAdviceSchema = new mongoose.Schema({
  adviceId: Number,
  content: String,
  legalAdviceId: Number
});

module.exports = mongoose.model('LegalAdvice', legalAdviceSchema, 'legalAdvice');