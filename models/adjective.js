// Require mongoose package
const mongoose = require('mongoose');

// Define AdjectiveSchema with bare and accented
const AdjectiveSchema = mongoose.Schema({
  bare: String,
  translations_en: String,
  decl_m_nom: String,
  decl_m_gen: String,
  decl_m_dat: String,
  decl_m_acc: String,
  decl_m_inst: String,
  decl_m_prep: String,
  decl_f_nom: String,
  decl_f_gen: String,
  decl_f_dat: String,
  decl_f_acc: String,
  decl_f_inst: String,
  decl_f_prep: String,
  decl_n_nom: String,
  decl_n_gen: String,
  decl_n_dat: String,
  decl_n_acc: String,
  decl_n_inst: String,
  decl_n_prep: String,
  decl_pl_nom: String,
  decl_pl_gen: String,
  decl_pl_dat: String,
  decl_pl_acc: String,
  decl_pl_inst: String,
  decl_pl_prep: String,
  bare_normalized: String,
  decl_m_nom_normalized: String,
  decl_m_gen_normalized: String,
  decl_m_dat_normalized: String,
  decl_m_acc_normalized: String,
  decl_m_inst_normalized: String,
  decl_m_prep_normalized: String,
  decl_f_nom_normalized: String,
  decl_f_gen_normalized: String,
  decl_f_dat_normalized: String,
  decl_f_acc_normalized: String,
  decl_f_inst_normalized: String,
  decl_f_prep_normalized: String,
  decl_n_nom_normalized: String,
  decl_n_gen_normalized: String,
  decl_n_dat_normalized: String,
  decl_n_acc_normalized: String,
  decl_n_inst_normalized: String,
  decl_n_prep_normalized: String,
  decl_pl_nom_normalized: String,
  decl_pl_gen_normalized: String,
  decl_pl_dat_normalized: String,
  decl_pl_acc_normalized: String,
  decl_pl_inst_normalized: String,
  decl_pl_prep_normalized: String
});

const Adjective = module.exports = mongoose.model('Adjectives', AdjectiveSchema, 'adjectives');

// Adjective.find() returns adjectives matching the criteria (in this case, when any case matches the provided word)
module.exports.getAdjective = (word, callback) => {
  Adjective.find({ translations_en: {$ne: ''}, $text: { $search: word } }, callback).limit(10);
};
