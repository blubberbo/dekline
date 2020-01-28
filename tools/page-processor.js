// process a page of text
// returns an array of sentences
module.exports.parseIntoSentences = (page) => {
  // separate the page into an array of sentences and return it
  return page ? page.match(/[^.!?:]+[.!?:]+/g) : [];
};

// process the title of a page from litmir.me to remove the first "Читать" and the name of the site
module.exports.formatLitMirPageTitle = (title) => {
  // return the formatted page title
  return title.replace('Читать ', '').replace(' - ЛитМир', '').replace('Страница', 'Стр');
};
