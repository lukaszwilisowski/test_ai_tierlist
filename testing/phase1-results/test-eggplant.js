/**
 * Calculates the factorial of a non-negative integer.
 *
 * @param {number} n - The non-negative integer to calculate the factorial for.
 * @returns {number} The factorial of n (n!).
 * @throws {Error} If n is negative or not an integer.
 * @example
 * factorial(5); // returns 120
 * factorial(0); // returns 1
 */
function factorial(n) {
  if (!Number.isInteger(n) || n < 0) {
    throw new Error("Input must be a non-negative integer");
  }

  if (n === 0 || n === 1) {
    return 1;
  }

  return n * factorial(n - 1);
}

module.exports = { factorial };
