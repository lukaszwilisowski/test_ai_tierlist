/**
 * Calculates the factorial of a non-negative integer.
 *
 * @param {number} n - The non-negative integer to calculate the factorial of.
 * @returns {number} The factorial of n.
 * @throws {Error} If n is a negative number.
 */
function factorial(n) {
  if (n < 0) {
    throw new Error("Factorial is not defined for negative numbers.");
  }
  if (n === 0 || n === 1) {
    return 1;
  }
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

module.exports = factorial;
