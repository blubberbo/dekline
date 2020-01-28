// Require mongoose package
const mongoose = require('mongoose');

// Define OtherSchema with bare and accented
const OtherSchema = mongoose.Schema({
  bare: String,
  bare_normalized: String,
  translations_en: String
});

const Other = module.exports = mongoose.model('Others', OtherSchema, 'others');

// Other.find() returns others matching the criteria (in this case, when any case matches the provided word)
module.exports.getOther = (word, callback) => {
  Other.find({ translations_en: {$ne: ''}, $text: { $search: word } }, callback).limit(10);
};
