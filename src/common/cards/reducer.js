/* @flow */
import type { Action, CardsState } from '../types';

import { computeBoardStandardResult } from './logic';

const initialState = {
  playersCards: (new Array(5)).fill(null),
  opponentsCards: (new Array(5)).fill(null),
  placedCards: (new Array(9)).fill({
    card: null,
    isPlayer: null,
  }),
};

const takeCard = (state, action) => {
  const { playersCards, opponentsCards } = state;
  const { isPlayer, card } = action.payload;

  if (isPlayer) {
    const index = playersCards.indexOf(card);

    return {
      ...state,
      playersCards: [
        ...playersCards.slice(0, index),
        null,
        ...playersCards.slice(index + 1),
      ],
    };
  } else {
    const index = opponentsCards.indexOf(card);

    return {
      ...state,
      opponentsCards: [
        ...opponentsCards.slice(0, index),
        null,
        ...opponentsCards.slice(index + 1),
      ],
    };
  }
};

const reducer = (
  state: CardsState = initialState,
  action: Action,
): CardsState => {
  // Because it's called from the createInitialState.
  if (!action) return state;

  switch (action.type) {
    case 'TAKE_CARD': return takeCard(state, action);

    case 'PLACE_CARD': {
      const { isPlayer, card, position } = action.payload;
      // take card as well
      const { placedCards, ...newState } = takeCard(state, action);

      return {
        ...newState,
        placedCards: computeBoardStandardResult(placedCards.slice(), card, position, isPlayer),
      };
    }

    case 'POPULATE_DECK': {
      const { isPlayer, cards } = action.payload;

      if (isPlayer) {
        return {
          ...state,
          playersCards: cards,
        };
      } else {
        return {
          ...state,
          opponentsCards: cards,
        };
      }
    }

    case 'RESET_GAME': return initialState;

    default:
      return state;

  }
};

export default reducer;
