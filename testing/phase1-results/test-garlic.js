/**
 * Calculates the factorial of a given number.
 * @param {number} n - The number to calculate factorial for (must be non-negative integer)
 * @returns {number} The factorial of n
 * @throws {Error} If n is negative or not an integer
 * @example
 * factorial(5); // returns 120
 * factorial(0); // returns 1
 */
function factorial(n) {
  if (n < 0 || !Number.isInteger(n)) {
    throw new Error('Input must be a non-negative integer');
  }
  
  if (n === 0 || n === 1) {
    return 1;
  }
  
  return n * factorial(n - 1);
}

module.exports = { factorial };
