// checks if a character is uppercase
// returns a boolean
const isUpperCase = (char) => {
  return char === char.toUpperCase();
};

// makes the first character of a string uppercase
// returns a string
const firstCharToUpperCase = (string) => {
  string[0] = string.charAt(0).toUpperCase();
  return string;
};
// checks if a string contains special characters
// returns a boolean
const containsSpecialCharacters = (str) => {
  let regex = /[ !@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g;
  return regex.test(str);
};

// replace a trailing special character with "..."
const replaceTrailingSpecialCharacter = (sentence) => {
  // check if the last letter of the sentence is a special character
  if (containsSpecialCharacters(sentence.charAt(sentence.length - 1))) {
    // if the sentence ends with a special character, replace it with "..."
    sentence = sentence.replace(/.$/, '...');
  };
  // return the sentence
  return sentence;
};

// validate a sentence is valid to use
// returns a boolean
module.exports.validateSentence = (sentence, minimumWordCount) => {
  // create a flag to keep track of the valid state
  let isValid = true;
  // trim any whitespace
  sentence = sentence.trim();
  // // check if the first character (after the initial trim) is a "-" --> i.e. it is dialogue
  // if (sentence.charAt(0) === '-'){
  //     //remove the
  // };
  // make sure the first character is uppercase
  if (!isUpperCase(sentence.charAt(0))) {
    isValid = false;
  };
  // make sure the sentence does not start with a special character AND the first character is not a '-', which would mean dialogue, which is ok
  if (containsSpecialCharacters(sentence.charAt(0)) && sentence.charAt(0) !== '-') {
    isValid = false;
  };
  // check if the sentence has any parentheses
  if (sentence.indexOf('(') > -1 || sentence.indexOf(')' > -1)) {
    // the sentence has either an open or closed parenthesis
    // if the sentence has a '(' but does not have a ')' after a '(', it is not valid (i.e. only a sentence with a closed pair of '()' is valid)
    if (sentence.indexOf('(') > -1 && !(sentence.indexOf(')') > sentence.indexOf('('))) {
      isValid = false;
    };
  };
  // ensure the sentence split by words is not null and check if the sentence has greater than 4 words
  if (!sentence.split(' ')) {
    isValid = false;
  };
  // if a minimum word count was passed in, make sure the sentence qualifies, else skip this step
  if (minimumWordCount != null && minimumWordCount > 0 && sentence.split(' ').length < minimumWordCount) {
    isValid = false;
  };
  // return the flag
  return isValid;
};

// replaces personal pronouns in the sentence with the appropriate masked values - if there are none - returns empty string
module.exports.replacePrersonalPronouns = (sentence) => {
  // create a flag to keep track of whether the sentence contains a personal pronoun or not
  let hasPersonalPronoun = false;

  // create a local array for each group of personal pronouns, separated by person (in all cases except nominative)
  const personalPronounsArrayYa = [
    'меня', // accusative & genative
    'мне', // dative
    'мной', // instrumental
    'мне' // prepositional
  ];

  const personalPronounsArrayTi = [
    'тебя', // accusative & genative
    'тебе', // dative
    'тобой', // instrumental
    'тебе' // prepositional
  ];

  const personalPronounsArrayOn = [
    'его', 'него', // accusative & genative
    'ему', 'нему', // dative
    'им', 'ним', // instrumental
    'нем' // prepositional
  ];

  const personalPronounsArrayOna = [
    'ее', 'нее', 'её', 'неё', // accusative & genative
    'ей', 'ней', // dative
    'ей', 'ней', // instrumental
    'ней' // prepositional
  ];

  const personalPronounsArrayMi = [
    'нас', // accusative & genative
    'нам', // dative
    'нами', // instrumental
    'нас' // prepositional
  ];

  const personalPronounsArrayVi = [
    'вас', // accusative & genative
    'вам', // dative
    'вами', // instrumental
    'вас' // prepositional
  ];

  const personalPronounsArrayOni = [
    'их', 'них', // accusative & genative
    'ним', // dative
    'ними', // instrumental
    'них' // prepositional
  ];

  // break the sentence into words and store in a local variable
  let wordsArray = sentence.split(' ');

  // iterate over the words array
  wordsArray.forEach(function (originalWord, wordIndex) {
    // remove all special characters from the word
    const word = originalWord.replace(/[^a-zа-я]/g, '');
    // create a local flag to indicate whether the first letter was capital (to provide the correct masked character)
    let isFirstLetterCapital = isUpperCase(word.charAt(0));
    // check if the word for any "я" personal pronouns
    if (personalPronounsArrayYa.includes(word.trim().toLowerCase())) {
      // set the local flag to true
      hasPersonalPronoun = true;
      // replace the word in the array with the special value to be processed by the front end - '$$' indicators and the {masked word:original word}
      wordsArray[wordIndex] = `##${isFirstLetterCapital ? 'Я' : 'я'}:${word}##`;
    }
    // else, continue on to check "ты"
    else if (personalPronounsArrayTi.includes(word.trim().toLowerCase())) {
      // set the local flag to true
      hasPersonalPronoun = true;
      // replace the word in the array with the special value to be processed by the front end - '$$' indicators and the {masked word:original word}
      wordsArray[wordIndex] = `##${isFirstLetterCapital ? 'Ты' : 'ты'}:${word}##`;
    }
    // else, continue on to check "он"
    else if (personalPronounsArrayOn.includes(word.trim().toLowerCase())) {
      // set the local flag to true
      hasPersonalPronoun = true;
      // replace the word in the array with the special value to be processed by the front end - '$$' indicators and the {masked word:original word}
      wordsArray[wordIndex] = `##${isFirstLetterCapital ? 'Он' : 'он'}:${word}##`;
    }
    // else, continue on to check "она"
    else if (personalPronounsArrayOna.includes(word.trim().toLowerCase())) {
      // set the local flag to true
      hasPersonalPronoun = true;
      // replace the word in the array with the special value to be processed by the front end - '$$' indicators and the {masked word:original word}
      wordsArray[wordIndex] = `##${isFirstLetterCapital ? 'Она' : 'она'}:${word}##`;
    }
    // else, continue on to check "мы"
    else if (personalPronounsArrayMi.includes(word.trim().toLowerCase())) {
      // set the local flag to true
      hasPersonalPronoun = true;
      // replace the word in the array with the special value to be processed by the front end - '$$' indicators and the {masked word:original word}
      wordsArray[wordIndex] = `##${isFirstLetterCapital ? 'Мы' : 'мы'}:${word}##`;
    }
    // else, continue on to check "вы"
    else if (personalPronounsArrayVi.includes(word.trim().toLowerCase())) {
      // set the local flag to true
      hasPersonalPronoun = true;
      // replace the word in the array with the special value to be processed by the front end - '$$' indicators and the {masked word:original word}
      wordsArray[wordIndex] = `##${isFirstLetterCapital ? 'Вы' : 'вы'}:${word}##`;
    }
    // else, continue on to check "они"
    else if (personalPronounsArrayOni.includes(word.trim().toLowerCase())) {
      // set the local flag to true
      hasPersonalPronoun = true;
      // replace the word in the array with the special value to be processed by the front end - '$$' indicators and the {masked word:original word}
      wordsArray[wordIndex] = `##${isFirstLetterCapital ? 'Они' : 'они'}:${word}##`;
    };
  });
  // if the sentence has a personal pronoun
  if (hasPersonalPronoun) {
    // if the last word in the sentence is a personal pronoun (checked by checking the first and last 2 characters of the last word)
    if (wordsArray[wordsArray.length - 1].substring(0, 2) === '##' && wordsArray[wordsArray.length - 1].substring(wordsArray[wordsArray.length - 1].length - 2, wordsArray[wordsArray.length - 1].length)) {
      // just combine the words and return the sentence
      return wordsArray.join(' ');
    }
    // else, the last word in the sentence was not a personal pronoun
    else {
      // replace any special characters at the end of the sentence, join the words and return it
      return replaceTrailingSpecialCharacter(wordsArray.join(' '));
    }
  }
  // else, there was no personal pronoun, so return an empty string
  else {
    return '';
  }
};

// replaces verbs of motion  in the sentence with the appropriate masked values - if there are none - returns empty string
module.exports.replaceVerbsOfMotion = (sentence) => {
  // create a flag to keep track of whether the sentence contains a verb of motion or not
  let hasVerbOfMotion = false;
  // import the verbs of motion array - which contains all forms of all verbs of motion
  const verbsOfMotionArray = require('./verbs-of-motion-array');
  // break the sentence into words and store in a local variable
  let wordsArray = sentence.split(' ');
  // iterate over the words array
  wordsArray.forEach(function (originalWord, wordIndex) {
    // remove all special characters from the word
    const word = originalWord.replace(/[^a-zа-я]/g, '');
    // create a local flag to indicate whether the first letter was capital (to provide the correct masked character)
    let isFirstLetterCapital = isUpperCase(word.charAt(0));

    // ensure that the word exists (and has length)
    if (word) {
      // create a flag to indicate a match has been found
      let matchFound = false;
      // loop through the verbsOfMotionArray to potentially match the word
      // Note: we have to check the word against each form of each verbOfMotion
      for (let verbOfMotion of verbsOfMotionArray) {
        // compare the word with all forms of the current verbOfMotion
        Object.keys(verbOfMotion).forEach(key => {
          // if the word matches a particular form
          if (verbOfMotion[key] === word.toLowerCase().trim()) {
            // set the local flag to true
            hasVerbOfMotion = true;
            // replace the word in the array with the special value to be processed by the front end - '$$' indicators and the {masked word:original word}
            // Note: if the original word began with a capital letter, conver the masked word to start with a capital letter
            wordsArray[wordIndex] = `##${isFirstLetterCapital ? firstCharToUpperCase(verbOfMotion['bare']) : verbOfMotion['bare']}:${word}##`;
            // indicate a match has been found
            matchFound = true;
          };
        });
        // break out of the forEach if a match was found on this verbOfMotion
        if (matchFound) {
          break;
        }
      }
    }
    // // check if the word for any "я" personal pronouns
    // if (verbsOfMotionArray.includes(word.trim().toLowerCase())) {
    //   // set the local flag to true
    //   hasVerbOfMotion = true;
    //   // replace the word in the array with the special value to be processed by the front end - '$$' indicators and the {masked word:original word}
    //   wordsArray[wordIndex] = `##${isFirstLetterCapital ? 'Я' : 'я'}:${word}##`;
    // }
  });
  // if the sentence has a verb of motion
  if (hasVerbOfMotion) {
    // if the last word in the sentence is a verb of motion (checked by checking the first and last 2 characters of the last word)
    if (wordsArray[wordsArray.length - 1].substring(0, 2) === '##' && wordsArray[wordsArray.length - 1].substring(wordsArray[wordsArray.length - 1].length - 2, wordsArray[wordsArray.length - 1].length)) {
      // just combine the words and return the sentence
      return wordsArray.join(' ');
    }
    // else, the last word in the sentence was not a verb of motion
    else {
      // replace any special characters at the end of the sentence, join the words and return it
      return replaceTrailingSpecialCharacter(wordsArray.join(' '));
    }
  }
  // else, there was no verb of motion, so return an empty string
  else {
    return '';
  }
};
