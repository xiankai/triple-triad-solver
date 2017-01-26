const cards = require('./cards.json');

function bitprint(u) {
  var s="";
  for (var n=0; u; ++n, u>>=1)
    if (u&1) s+=n+" ";
  return s;
}
function bitcount(u) {
  for (var n=0; u; ++n, u=u&(u-1));
  return n;
}
function comb(n,c) {
  var s=[];
  for (var u=0; u<1<<n; u++)
    if (bitcount(u)==c)
      s.push(bitprint(u))
  return s.map(str => str.split(' ').slice(0,5));
}

const computeBoardResult = (grid, placedCard, position, isPlayer, rules = []) => {
  const {
    topValue,
    rightValue,
    leftValue,
    bottomValue,
  } = cards[placedCard];

  const matches = [];
  let newGrid = grid.slice();

  // place card
  newGrid[position] = {
    card: placedCard,
    isPlayer,
  };

  if (position < 6) {
    matches.push([bottomValue, position + 3, 'topValue']);
  }

  if (position % 3 < 2) {
    matches.push([rightValue, position + 1, 'leftValue']);
  }

  if (position > 2) {
    matches.push([topValue, position - 3, 'bottomValue']);
  }

  if (position % 3 > 0) {
    matches.push([leftValue, position - 1, 'rightValue']);
  }

  const plusCache = new Array(21).fill(null).map(() => []);
  const sameCache = [];
  matches.forEach(([val, comparedPos, comparedSide]) => {
    if (!grid[comparedPos] || !grid[comparedPos].card) {
      // no card placed
      return;
    }

    const { card, isPlayer: comparedOwner } = grid[comparedPos];
    let ownValue = parseInt(val, 10);
    let otherValue = parseInt(cards[card][comparedSide], 10);

    if (rules.indexOf('Plus')) {
      plusCache[ownValue + otherValue].push(comparedPos);
    }

    if (rules.indexOf('Same') && ownValue === otherValue) {
      sameCache.push(comparedPos);
    }

    // is an opponent
    if (isPlayer !== comparedOwner) {
      let canTake = false;

      if (rules.indexOf('Reverse') > -1) {
        // swap trick
        [ownValue, otherValue] = [otherValue, ownValue];
      }

      if (rules.indexOf('Fallen Ace') > -1 && ownValue === 1 && otherValue === 10) {
        canTake = true;
      }

      if (ownValue > otherValue) {
        canTake = true;
      }

      if (canTake) {
        newGrid[comparedPos] = {
          card,
          isPlayer,
        };
      }
    }
  });

  // combo rules
  const comboRules = [];
  if (rules.indexOf('Fallen Ace') > -1) {
    comboRules.push('Fallen Ace');
  }

  if (rules.indexOf('Reverse') > -1) {
    comboRules.push('Reverse');
  }

  const takeOverFunction = (pos) => {
    const { card } = grid[pos];
    newGrid[pos] = {
      card,
      isPlayer,
    };

    // combo!!! let's see how deep the rabbit hole goes
    newGrid = computeBoardResult(newGrid, card, pos, isPlayer, comboRules);
  };

  plusCache
    .filter(arr => arr.length >= 2)
    .map(arr => arr.forEach(takeOverFunction));

  if (sameCache.length >= 2) {
    sameCache.forEach(takeOverFunction);
  }

  return newGrid;
};

const computeNaiveScore = grid => grid.reduce((score, { isPlayer }) => score + (isPlayer ? 1 : -1), 0);

const computeBoardScore = (grid, playersCards, opponentsCards, isPlayerTurn, rules, depth) => {
  const emptyPositions = grid
    .map(({ card }, index) => card === null ? index : null) // first store index of empty spaces and null the occupied ones
    .filter(index => index !== null); // then filter by null so we only get an array of the empty spaces' indices
  if (emptyPositions.length <= (9 - depth)) {
    // compute board result
    const score = computeNaiveScore(grid);

    // if is player's turn, that means player has spent all his cards,
    // and gets a -1 disadvantage
    return {
      score: score + (isPlayerTurn ? 1 : -1),
    };
  }

  const deckUsed = isPlayerTurn ? playersCards : opponentsCards;
  const totalScoreboard = {};
  let totalScore = 0;
  let possibilities = 0;

  for (const cardIndex in deckUsed) {
    const card = deckUsed[cardIndex];
    for (const position of emptyPositions) {
      // see the result of placing the card there
      const newGrid = computeBoardResult(grid, card, position, isPlayerTurn, rules);

      let newPlayersCards = playersCards.slice();
      let newOpponentsCards = opponentsCards.slice();
      if (isPlayerTurn) {
        newPlayersCards = [].concat(playersCards.slice(0, cardIndex), playersCards.slice(cardIndex + 1));
      } else {
        newOpponentsCards = [].concat(opponentsCards.slice(0, cardIndex), opponentsCards.slice(cardIndex + 1));
      }

      // compute score for the current grid
      const currentScoreboard = computeBoardScore(newGrid, newPlayersCards, newOpponentsCards, !isPlayerTurn, rules, depth);
      totalScoreboard[`placing ${card} at ${position}`] = currentScoreboard;
      totalScore += currentScoreboard.score;
      possibilities++;
    }
  }

  return {
    score: totalScore / possibilities,
    totalScoreboard,
  };
};

const playerDeck = [
  80,
  90,
  90,
  // 90,
  // 90,
];

const opponentDeck = [
  100,
  110,
  110,
  // 110,
  // 110,
];

const firstPos = { card: null, isPlayer: false };
const secondPos = { card: null, isPlayer: false };
const thirdPos = { card: null, isPlayer: false };
const fourthPos = { card: null, isPlayer: false };
const fifthPos = { card: null, isPlayer: false };
const sixthPos = { card: null, isPlayer: false };
const seventhPos = { card: null, isPlayer: false };
const eighthPos = { card: null, isPlayer: false };
const ninthPos = { card: null, isPlayer: false };

const constructedBoard = [
  firstPos, secondPos, thirdPos,
  fourthPos, fifthPos, sixthPos,
  seventhPos, eighthPos, ninthPos,
];

const result = computeBoardScore(constructedBoard, playerDeck, opponentDeck, true, [], 3);
console.log(result);

return;

const playerCombinations = comb(168, 5);
const opponentCombinations = comb(8, 5);
const decisioner = {};
for (const i of playerCombinations) {
  for (const j of opponentCombinations) {
    decisioner[i.join(',')] = computeBoardScore(constructedBoard, i, j, true);
  }
}
// console.log(decisioner);