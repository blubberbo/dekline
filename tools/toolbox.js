// returns a random integer between the two given numbers
module.exports.randomIntInclusive = (min, max, digits) => {
  // ceiling and floor the input
  min = Math.ceil(min);
  max = Math.floor(max);
  // create an int to hold the new integer - 0 is the default case
  let newInt = 0;
  // if a number of digits was passed in
  if (digits) {
    // we only want to return a number that has that many digits
    do {
      newInt = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (newInt.toString().length !== digits);
  }
  else {
    // else, it doesn't matter how many digits in the new number, so just create a single random number
    newInt = Math.floor(Math.random() * (max - min + 1)) + min;
  };
  return newInt;
};
