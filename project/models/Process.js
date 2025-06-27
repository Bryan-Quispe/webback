const mongoose = require('mongoose');

const processSchema = new mongoose.Schema({
  title: String,
  offense: String,
  canton: String,
  province: String,
  processId: Number,
  clientGender: String,
  clientAge: Number,
  lastUpdate: Date,
  accountId: Number,
  processStatus: String,
  startDate: Date,
  endDate: Date,
  processNumber: String,
  processType: String,
  processDescription: String,
});

module.exports = mongoose.model('Process', processSchema, 'process');
