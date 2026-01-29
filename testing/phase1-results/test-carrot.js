/**
 * Calculates the factorial of a non-negative integer.
 * @param {number} n - The non-negative integer to compute the factorial of.
 * @returns {number} The factorial of the provided number.
 * @throws {RangeError} If n is negative or not an integer.
 */
function factorial(n) {
  if (!Number.isInteger(n) || n < 0) {
    throw new RangeError('n must be a non-negative integer');
  }

  let result = 1;
  for (let i = 2; i <= n; i += 1) {
    result *= i;
  }

  return result;
}

module.exports = { factorial };
