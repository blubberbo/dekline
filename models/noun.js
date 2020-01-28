// Require mongoose package
const mongoose = require('mongoose');

// Define NounSchema with bare and accented
const NounSchema = mongoose.Schema({
  bare: String,
  translations_en: String,
  sg_nom: String,
  sg_gen: String,
  sg_dat: String,
  sg_acc: String,
  sg_inst: String,
  sg_prep: String,
  pl_nom: String,
  pl_gen: String,
  pl_dat: String,
  pl_acc: String,
  pl_inst: String,
  pl_prep: String,
  bare_normalized: String,
  sg_nom_normalized: String,
  sg_gen_normalized: String,
  sg_dat_normalized: String,
  sg_acc_normalized: String,
  sg_inst_normalized: String,
  sg_prep_normalized: String,
  pl_nom_normalized: String,
  pl_gen_normalized: String,
  pl_dat_normalized: String,
  pl_acc_normalized: String,
  pl_inst_normalized: String,
  pl_prep_normalized: String
});

const Noun = module.exports = mongoose.model('Nouns', NounSchema, 'nouns');

// Noun.find() returns all the nouns
module.exports.getAllNouns = (callback) => {
  Noun.find(callback).limit(10);
};

// Noun.find() returns nouns matching the criteria (in this case, when any case matches the provided word)
module.exports.getNoun = (word, callback) => {
  Noun.find({ translations_en: {$ne: ''}, $text: { $search: word } }, callback).limit(10);
};
