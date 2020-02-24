const R = require('ramda');

/* add */
// const increment = R.add(R.__, 10);
// console.log(increment(increment(20)));

/* subtract */
// const decrement = R.subtract(R.__, 100);
// console.log(decrement(decrement(250)));

/* addIndex */
// const double = R.multiply(2);
// console.log(double(10));

// const indexPlusValue = (v, i) => i + v;
// console.log(indexPlusValue(1, 2));
// const arr = [10, 20, 30, 40];

// console.log(R.addIndex(R.map)(R.add, arr));

/* Adjust */
// console.log(R.adjust(1, R.subtract(R.__, 10), [100, 200, 300]));

/* All */
const equals3 = R.equals(3);
console.log(R.all(equals3)([3, 3, 3, 1]));
console.log(R.all(equals3)([3, 3, 3, 3]));
