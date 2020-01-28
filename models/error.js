// Require mongoose package
const mongoose = require('mongoose');

// Define ErrorSchema
const ErrorSchema = mongoose.Schema({
  message: String,
  stack: String
});

const Error = mongoose.model('Errors', ErrorSchema, 'errors');
module.exports = Error;
