const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: String,
  description: String,
  dateStart: Date,
  dateEnd: Date,
  eventId: Number,
  orderIndex: Number,
  processId: Number,
});

module.exports = mongoose.model('Event', eventSchema, 'event');
