// Problem Statement:
// Write a function createPair that takes two arguments of any type and returns a tuple with those values.

export function createPair<Type1, Type2> (element1:Type1, element2:Type2) {
  return [element1, element2];
}