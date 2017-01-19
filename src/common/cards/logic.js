import cards from './cards.json';



// const cards = (new Array(10))
//   .fill(null)
//   .map(() =>
//     (new Array(4))
//       .fill(null)
//       .map(() => Math.ceil(Math.random() * 9))
//   );

// const cards = [
//   {
//     topValue: 9,
//     rightValue: 9,
//     leftValue: 9,
//     bottomValue: 9,
//   },
//   {
//     topValue: 1,
//     rightValue: 1,
//     leftValue: 1,
//     bottomValue: 1,
//   },
// ];

// inputs required
//
// 1) entire player's deck (or x)
// 2) entire opponent's deck (or y)
// ruleset

// then
// xC5 where 5 <= x <= 168
// 1 million possibilities (but actually limited by the only 1 4/5* card rule)
// yC5 where 5 <= y <= 8
// 56 possibilities
//
// 1) 5 cards from player
// 2) 5 cards from opponent

// rulesets
// All Open
// y = 5
// 1 possibility
//
// Three Open
// yC2 where 2 <= y <= 5
// 10 possibilities
//
// Sudden Death
// Recursion nightmare
//
// Random, Swap
// calculate on fly
//
// Order
// take away 5!
// resulting in 43 million possibilities
//
// Chaos
// as normal (we cannot tell in advance what will be selected for Chaos)
//
// Reverse, Fallen Ace, Same, Plus, Ascension, Descension
// only grid the outcome

// then
// 9 rounds
// 5x9 possibilities
// 5x8 possibilities
// 4x7 possibilities
// 4x6 possibilities
// 3x5 possibilities
// 3x4 possibilities
// 2x3 possibilities
// 2x2 possibilities
// 1x1 possibilities
// 5!*5!*9!
// 5.2 billion possibilities XD
//
// A1 a2 B3 b4 C5 c6 D7 d8 E9 = ??? win/draw/loss

export const computeBoardStandardResult = (grid, placedCard, position, isPlayer) => {
  const {
    topValue,
    rightValue,
    leftValue,
    bottomValue,
  } = cards[placedCard];

  const matches = [];
  const newGrid = grid.slice();

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

  matches.forEach(([val, comparedPos, comparedSide]) => {
    if (!grid[comparedPos] || !grid[comparedPos].card) {
      // no card placed
      return;
    }

    const { card, isPlayer: comparedOwner } = grid[comparedPos];

    // is an opponent and we can overpower them
    if (isPlayer !== comparedOwner && parseInt(val, 10) > cards[card][comparedSide]) {
      newGrid[comparedPos] = {
        card,
        isPlayer,
      };
    }
  });

  return newGrid;
};

export const getFinalResult = (grid, playersTurn) => {
  const playersPlacedCards = grid.filter(({ owner }) => owner === 'player');

  if (playersTurn) {
    // opponent started first
    if (playersPlacedCards > 4) {
      return 'win';
    } else if (playersPlacedCards === 4) {
      return 'draw';
    }
  } else {
    // player started first
    if (playersPlacedCards > 5) {
      return 'win';
    } else if (playersPlacedCards === 5) {
      return 'draw';
    }
  }

  return 'loss';
};

export const computeCurrentBoardScore = (grid) => {
  // naive implementation of calculating board score
  // the numerical advantage in terms of cards, instead of board positioning
  const currentScore = grid.reduce((score, card) => {
    if (card) {
      return score + (card.owner === 'player' ? 1 : -1);
    }

    return score;
  }, 0);

  return currentScore;
};

// grid is a length 8 array with holes where no card has been placed yet
export const calculate = (grid, playerDeck, opponentDeck, playersTurn, depth = 1) => {
  const calculations = {
    cards: {},
    score: {},
  };

  if (depth < 1) {
    return {
      score: computeCurrentBoardScore(grid),
    };
  }
  // if (grid.filter(k => !k).length < 1) {
  //   return getFinalResult(grid, playersTurn);
  // }

  const deckUsed = playersTurn ? playerDeck : opponentDeck;

  calculations.cards = deckUsed.map((heldCard, i) => {
    const currentCard = {
      card: heldCard,
      positions: {},
      owner: playersTurn ? 'player' : 'opponent',
    };

    for (let j = 0; j < 9; j++) {
      const card = grid[j];

      if (!card) {
        // lets put the card into that slot and make calculations based from there
        const newGrid = computeBoardStandardResult(grid.slice(), heldCard, j, playersTurn ? 'player' : 'opponent');

        // remove the card that was just placed
        const newDeck = [...deckUsed.slice(0, i), ...deckUsed.slice(i)];

        if (playersTurn) {
          playerDeck = newDeck;
        } else {
          opponentDeck = newDeck;
        }

        currentCard.positions[j] = calculate(
          newGrid,
          playerDeck,
          opponentDeck,
          !playersTurn, // now opponent's turn
          playersTurn ? depth - 1 : depth // player has made a move - consider this as traversing 1 depth layer already
        );
      }
    }

    let size = 0;
    let totalScore = 0;
    for (const j in currentCard.positions) {
      size++;
      totalScore += currentCard.positions[j].score;
    }

    currentCard.score = totalScore / size;

    return currentCard;
  });

  calculations.score = calculations.cards.reduce((score, card) => score + card.score, 0) / calculations.cards.length;

  return calculations;
};

export const generateRandomDeck = () => (new Array(5)).fill(null).map(() => Math.floor(Math.random() * cards.length));
