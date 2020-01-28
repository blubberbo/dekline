// Require the express package and use express.Router()
const express = require('express');
const router = express.Router();
const request = require('request');
const noun = require('../models/noun');
const verb = require('../models/verb');
const adjective = require('../models/adjective');
const other = require('../models/other');
const config = require('../config/config.json');

// GET HTTP method to /lookup
router.get('/lookup', (req, res) => {
  // store the word we are searching for from the request, removing any special characters from it (eg. ",")
  const searchWord = req.query.word.replace(/[^a-zA-Zа-яА-Я]/g, '').toLowerCase();
  // create a return object to store all the returned definitions
  let definitions = {nouns: [], verbs: [], adjectives: [], adverbs: [], others: []};
  // create flags for each of the collections to indicate the api calls have been completed
  let nounsCallComplete = false;
  let verbsCallComplete = false;
  let adjectivesCallComplete = false;
  let othersCallComplete = false;

  // first, look if the word matches any nouns
  noun.getNoun(searchWord, (err, nouns) => {
    if (err) {
      // if there is an error, write the error to the reponse and then end the response
      res.json({success: false, message: `Failed looking in the Nouns dictionary. Error: ${err}`});
      res.end();
    }
    else {
      // else, if there was no error
      // pass the nouns the to definitions object
      definitions.nouns = nouns;
      // set the nouns call flag as complete
      nounsCallComplete = true;
      // if all the api calls are complete
      if (nounsCallComplete && verbsCallComplete && adjectivesCallComplete && othersCallComplete) {
        // if there was a word found in the local db but no definition
        // also check to make sure we are not in offlineDevelopmentMode
        // NOTE: unfortunately, we cannot lookup any word via the yandex api because it only takes the base form
        if (!config.offlineDevelopmentMode && ((definitions.nouns.length === 0 && definitions.verbs.length === 0 && definitions.adjectives.length === 0 &&
          definitions.others.length === 0) || (definitions.nouns.length > 0 && !arrayHasTranslations(nouns)))) {
          // we want to call the yandex dictionary api to try and find a match
          // CALL YANDEX API HERE
          request(`https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=${config.yandexDictionaryKey}&lang=ru-en
              &text=${encodeURIComponent(searchWord)}`, { json: true }, (err, response, body) => {
            if (err) {
              // if there is an error, write the error to the reponse and then end the response
              res.json({success: false, message: `An error occurred calling the Yandex Dictionary Service. Error: ${err}`});
              res.end();
            }
            else {
              // else, there was no error, so process and return the result from yandex
              // extract the definitions from the body
              let responseBody = body.def[0];
              // so long as there was a definition found
              if (responseBody) {
                // store the word (which should be the same as the base word, but to make sure, let's take it from the api return)
                const originalWord = responseBody.text;
                // store the part of speech (which is returned from the api), adding an 's' to normalize it with the definitions properties
                const partOfSpeech = responseBody.pos + 's';
                // capture the definitions
                let yandexDefinitions = [];
                // double check to make sure there is a .tr property on the body.def (if no definition, there won't be)
                if (responseBody.tr) {
                  // iterate over the yandex definitions (which are returned from the api as an array of the tr property)
                  for (const yandexDefinition of responseBody.tr) {
                    yandexDefinitions.push({ 'bare': originalWord, 'translations_en': yandexDefinition.text });
                  }
                }
                // pass the yandexDefinitions object we created to the the partOfSpeech property on the definitions object
                // we added a "s" to the part of speech returned from the api so it should match the properties on the object
                definitions[partOfSpeech] = yandexDefinitions;
                // write and end the response
                res.write(JSON.stringify({success: true, definitions: definitions}, null, 2));
                // end the response
                res.end();
              }
              else {
                // else, there was no definition found from yandex either, so return nothing
                res.write(JSON.stringify({success: true, definitions: definitions}, null, 2));
                // end the response
                res.end();
              }
            }
          });
        }
        else {
          // else, there was at least one definition found, so write and end the response
          res.write(JSON.stringify({success: true, definitions: definitions}, null, 2));
          // end the response
          res.end();
        }
      }
    }
  });

  // second, look if the word matches any verbs
  verb.getVerb(searchWord, (err, verbs) => {
    if (err) {
      // if there is an error, write the error to the reponse and then end the response
      res.json({success: false, message: `Failed looking in the Verbs dictionary. Error: ${err}`});
      res.end();
    }
    else {
      // else, if there was no error
      // for each verb, we need to convert the list of cases to an array for the front end to handle
      for (let verb of verbs) {
        verb.casesArray = verb.cases ? verb.cases.split(',') : [];
        // loop through the newly created array
        for (let caseIndex = verb.casesArray.length - 1; caseIndex >= 0; caseIndex--) {
          // check if the case is empty (i.e. blank)
          if (!verb.casesArray[caseIndex]) {
            // remove the case from the array
            verb.casesArray.splice(caseIndex, 1);
          }
        }
      }
      // pass the verbs the to definitions object
      definitions.verbs = verbs;
      // set the verbs call flag as complete
      verbsCallComplete = true;
      // if all the api calls are complete
      if (nounsCallComplete && verbsCallComplete && adjectivesCallComplete && othersCallComplete) {
        // if there was a word found in the local db but no definition
        // also check to make sure we are not in offlineDevelopmentMode
        // NOTE: unfortunately, we cannot lookup any word via the yandex api because it only takes the base form
        if (!config.offlineDevelopmentMode && ((definitions.nouns.length === 0 && definitions.verbs.length === 0 && definitions.adjectives.length === 0 &&
          definitions.others.length === 0) || (definitions.verbs.length > 0 && !arrayHasTranslations(verbs)))) {
          // we want to call the yandex dictionary api to try and find a match
          // CALL YANDEX API HERE
          request(`https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=${config.yandexDictionaryKey}&lang=ru-en
              &text=${encodeURIComponent(searchWord)}`, { json: true }, (err, response, body) => {
            if (err) {
              // if there is an error, write the error to the reponse and then end the response
              res.json({success: false, message: `An error occurred calling the Yandex Dictionary Service. Error: ${err}`});
              res.end();
            }
            else {
              // else, there was no error, so process and return the result from yandex
              // extract the definitions from the body
              let responseBody = body.def[0];
              // so long as there was a definition found
              if (responseBody) {
                // store the word (which should be the same as the base word, but to make sure, let's take it from the api return)
                const originalWord = responseBody.text;
                // store the part of speech (which is returned from the api), adding an 's' to normalize it with the definitions properties
                const partOfSpeech = responseBody.pos + 's';
                // capture the definitions
                let yandexDefinitions = [];
                // double check to make sure there is a .tr property on the body.def (if no definition, there won't be)
                if (responseBody.tr) {
                  // iterate over the yandex definitions (which are returned from the api as an array of the tr property)
                  for (const yandexDefinition of responseBody.tr) {
                    yandexDefinitions.push({ 'bare': originalWord, 'translations_en': yandexDefinition.text });
                  }
                }
                // pass the yandexDefinitions object we created to the the partOfSpeech property on the definitions object
                // we added a "s" to the part of speech returned from the api so it should match the properties on the object
                definitions[partOfSpeech] = yandexDefinitions;
                // write and end the response
                res.write(JSON.stringify({success: true, definitions: definitions}, null, 2));
                // end the response
                res.end();
              }
              else {
                // else, there was no definition found from yandex either, so return nothing
                res.write(JSON.stringify({success: true, definitions: definitions}, null, 2));
                // end the response
                res.end();
              }
            }
          });
        }
        else {
          // else, there was at least one definition found, so write and end the response
          res.write(JSON.stringify({success: true, definitions: definitions}, null, 2));
          // end the response
          res.end();
        }
      }
    }
  });

  // third, look if the word matches any adjectives
  adjective.getAdjective(searchWord, (err, adjectives) => {
    if (err) {
      // if there is an error, write the error to the reponse and then end the response
      res.json({success: false, message: `Failed looking in the Adjectives dictionary. Error: ${err}`});
      res.end();
    }
    else {
      // else, if there was no error
      // pass the adjectives the to definitions object
      definitions.adjectives = adjectives;
      // set the adjectives call flag as complete
      adjectivesCallComplete = true;
      // if all the api calls are complete
      if (nounsCallComplete && verbsCallComplete && adjectivesCallComplete && othersCallComplete) {
        // if there was a word found in the local db but no definition
        // also check to make sure we are not in offlineDevelopmentMode
        // NOTE: unfortunately, we cannot lookup any word via the yandex api because it only takes the base form
        if (!config.offlineDevelopmentMode && ((definitions.nouns.length === 0 && definitions.verbs.length === 0 && definitions.adjectives.length === 0 &&
          definitions.others.length === 0) || (definitions.adjectives.length > 0 && !arrayHasTranslations(adjectives)))) {
          // we want to call the yandex dictionary api to try and find a match
          // CALL YANDEX API HERE
          request(`https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=${config.yandexDictionaryKey}&lang=ru-en
              &text=${encodeURIComponent(searchWord)}`, { json: true }, (err, response, body) => {
            if (err) {
              // if there is an error, write the error to the reponse and then end the response
              res.json({success: false, message: `An error occurred calling the Yandex Dictionary Service. Error: ${err}`});
              res.end();
            }
            else {
              // else, there was no error, so process and return the result from yandex
              // extract the definitions from the body
              let responseBody = body.def[0];
              // so long as there was a definition found
              if (responseBody) {
                // store the word (which should be the same as the base word, but to make sure, let's take it from the api return)
                const originalWord = responseBody.text;
                // store the part of speech (which is returned from the api), adding an 's' to normalize it with the definitions properties
                const partOfSpeech = responseBody.pos + 's';
                // capture the definitions
                let yandexDefinitions = [];
                // double check to make sure there is a .tr property on the body.def (if no definition, there won't be)
                if (responseBody.tr) {
                  // iterate over the yandex definitions (which are returned from the api as an array of the tr property)
                  for (const yandexDefinition of responseBody.tr) {
                    yandexDefinitions.push({ 'bare': originalWord, 'translations_en': yandexDefinition.text });
                  }
                }
                // pass the yandexDefinitions object we created to the the partOfSpeech property on the definitions object
                // we added a "s" to the part of speech returned from the api so it should match the properties on the object
                definitions[partOfSpeech] = yandexDefinitions;
                // write and end the response
                res.write(JSON.stringify({success: true, definitions: definitions}, null, 2));
                // end the response
                res.end();
              }
              else {
                // else, there was no definition found from yandex either, so return nothing
                res.write(JSON.stringify({success: true, definitions: definitions}, null, 2));
                // end the response
                res.end();
              }
            }
          });
        }
        else {
          // else, there was at least one definition found, so write and end the response
          res.write(JSON.stringify({success: true, definitions: definitions}, null, 2));
          // end the response
          res.end();
        }
      }
    }
  });

  // fourth, look if the word matches any others
  other.getOther(searchWord, (err, others) => {
    if (err) {
      // if there is an error, write the error to the reponse and then end the response
      res.json({success: false, message: `Failed looking in the Others dictionary. Error: ${err}`});
      res.end();
    }
    else {
      // else, if there was no error
      // pass the nouns the to definitions object
      definitions.others = others;
      // set the nouns call flag as complete
      othersCallComplete = true;
      // if all the api calls are complete
      if (nounsCallComplete && verbsCallComplete && adjectivesCallComplete && othersCallComplete) {
        // if there was a word found in the local db but no definition
        // also check to make sure we are not in offlineDevelopmentMode
        // NOTE: unfortunately, we cannot lookup any word via the yandex api because it only takes the base form
        if (!config.offlineDevelopmentMode && ((definitions.nouns.length === 0 && definitions.verbs.length === 0 && definitions.adjectives.length === 0 &&
          definitions.others.length === 0) || (definitions.others.length > 0 && !arrayHasTranslations(others)))) {
          // we want to call the yandex dictionary api to try and find a match
          // CALL YANDEX API HERE
          request(`https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=${config.yandexDictionaryKey}&lang=ru-en
              &text=${encodeURIComponent(searchWord)}`, { json: true }, (err, response, body) => {
            if (err) {
              // if there is an error, write the error to the reponse and then end the response
              res.json({success: false, message: `An error occurred calling the Yandex Dictionary Service. Error: ${err}`});
              res.end();
            }
            else {
              // else, there was no error, so process and return the result from yandex
              // extract the definitions from the body
              let responseBody = body.def[0];
              // so long as there was a definition found
              if (responseBody) {
                // store the word (which should be the same as the base word, but to make sure, let's take it from the api return)
                const originalWord = responseBody.text;
                // store the part of speech (which is returned from the api), adding an 's' to normalize it with the definitions properties
                const partOfSpeech = responseBody.pos + 's';
                // capture the definitions
                let yandexDefinitions = [];
                // double check to make sure there is a .tr property on the body.def (if no definition, there won't be)
                if (responseBody.tr) {
                  // iterate over the yandex definitions (which are returned from the api as an array of the tr property)
                  for (const yandexDefinition of responseBody.tr) {
                    yandexDefinitions.push({ 'bare': originalWord, 'translations_en': yandexDefinition.text });
                  }
                }
                // pass the yandexDefinitions object we created to the the partOfSpeech property on the definitions object
                // we added a "s" to the part of speech returned from the api so it should match the properties on the object
                definitions[partOfSpeech] = yandexDefinitions;
                // write and end the response
                res.write(JSON.stringify({success: true, definitions: definitions}, null, 2));
                // end the response
                res.end();
              }
              else {
                // else, there was no definition found from yandex either, so return nothing
                res.write(JSON.stringify({success: true, definitions: definitions}, null, 2));
                // end the response
                res.end();
              }
            }
          });
        }
        else {
          // else, there was at least one definition found, so write and end the response
          res.write(JSON.stringify({success: true, definitions: definitions}, null, 2));
          // end the response
          res.end();
        }
      }
    }
  });
});

module.exports = router;

// a method to check if an array of words (any part of speech) has definitions
const arrayHasTranslations = (wordsArray) => {
  // ensure the wordsArray passed in is not null
  if (wordsArray) {
    // loop over the words in the wordsArray
    for (let word of wordsArray) {
      // if any of the owrds has a value for the "translations_en" property
      if (word.translations_en) {
        // return true
        return true;
      }
    }
  }
  // if we have gotten this far, it means none of the words have "translations_en" values, so return false
  return false;
};
