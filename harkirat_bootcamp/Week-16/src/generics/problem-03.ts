// Problem Statement:
// Write a function mergeObjects that merges two objects and returns a new object with all properties.

export function mergeObjects<Type1, Type2>(obj1:Type1, obj2:Type2) {
  let obj:Type1 & Type2 = Object.assign({}, obj1, obj2);
  return obj;
}