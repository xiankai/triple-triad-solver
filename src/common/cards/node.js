const cards = require('./cards.json');
const calculate = require('./logic.js');

const k = calculate(
  (new Array(9)).fill(null),
  (new Array(5)).fill(null).map(() => Math.floor(Math.random() * cards.length)),
  (new Array(5)).fill(null).map(() => Math.floor(Math.random() * cards.length)),
  true,
  2,
);

// const k = calculate(
//   (new Array(9)).fill(null),
//   [0, 0, 0, 0, 0],
//   [1, 1, 1, 1, 1],
//   true,
//   2
// );

console.log(k);
// console.log(k.cards[0].positions[0].cards[0].positions[1].cards[2]);