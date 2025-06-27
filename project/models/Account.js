const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  name: String,
  lastname: String,
  password: String,
  email: String,
  accountId: Number,
  phoneNumber: String,
});

module.exports = mongoose.model('Account', accountSchema, 'account');
