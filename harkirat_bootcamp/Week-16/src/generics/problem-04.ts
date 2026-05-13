// Problem Statement:
// Write a generic function sum that accepts an array of numbers and returns the sum of all the numbers.

export function sum<Type extends number> (arr:Type[]) {
  let sum = arr.reduce((acc, current) => acc+current, 0)
  return sum;
}