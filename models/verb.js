// Require mongoose package
const mongoose = require('mongoose');

// Define VerbSchema with bare and accented
const VerbSchema = mongoose.Schema({
  bare: String,
  translations_en: String,
  imperative_sg: String,
  imperative_pl: String,
  past_m: String,
  past_f: String,
  past_n: String,
  past_pl: String,
  presfut_sg1: String,
  presfut_sg2: String,
  presfut_sg3: String,
  presfut_pl1: String,
  presfut_pl2: String,
  presfut_pl3: String,
  bare_normalized: String,
  imperative_sg_normalized: String,
  imperative_pl_normalized: String,
  past_m_normalized: String,
  past_f_normalized: String,
  past_n_normalized: String,
  past_pl_normalized: String,
  presfut_sg1_normalized: String,
  presfut_sg2_normalized: String,
  presfut_sg3_normalized: String,
  presfut_pl1_normalized: String,
  presfut_pl2_normalized: String,
  presfut_pl3_normalized: String,
  cases: String,
  casesArray: Array
});

const Verb = module.exports = mongoose.model('Verbs', VerbSchema, 'verbs');

// Verb.find() returns all the verbs
module.exports.getAllVerbs = (callback) => {
  Verb.find(callback).limit(10);
};

// Verb.find() returns verbs matching the criteria (in this case, when any conjugation matches the provided word)
module.exports.getVerb = (word, callback) => {
  Verb.find({ translations_en: {$ne: ''}, $text: { $search: word } }, callback).limit(10);
};
