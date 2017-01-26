import cards from './cards.json';

export const computeNaiveScore = grid => grid.reduce((score, { isPlayer }) => score + (isPlayer ? 1 : -1), 0);

export const computeBoardResult = (grid, placedCard, position, isPlayer, rules = []) => {
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
    totalScoreboard[card] = {
      score: 0,
      positions: {},
    };

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
      totalScoreboard[card][position] = currentScoreboard;
      totalScoreboard[card].score = currentScoreboard.score;
    }

    totalScoreboard[card].score = totalScoreboard[card].score / emptyPositions.length;
    totalScore += totalScoreboard[card].score;
    possibilities++;
  }

  return {
    score: totalScore / possibilities,
    totalScoreboard,
  };
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
        const newGrid = computeBoardResult(grid.slice(), heldCard, j, playersTurn ? 'player' : 'opponent');

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
