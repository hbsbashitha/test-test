function generateRandomNumber(min, max) {
    // Generate a random number between min (inclusive) and max (inclusive)
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  // Example usage
  var min = 1;
  var max = 10;
  var randomNumber = generateRandomNumber(min, max);
  console.log("Random number between " + min + " and " + max + ": " + randomNumber);
  