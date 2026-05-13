// Write a function that multiplies the results of two functions. Each function returns a number when called.
// Ensure the functions have proper type annotations.
// Example Input: f1 = () => 2, f2 = () => 3
// Example Output: 6


export function multiplyResults(fn1: () => number, fn2: () => number):number {
  return fn1() * fn2();
}