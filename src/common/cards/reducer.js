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
  active: 'multi',
  isPlayerTurn: null,
  playerRematch: null,
  opponentRematch: null,
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
    case 'SINGLE_PLAYER': {
      return {
        ...state,
        active: 'single',
      };
    }

    case 'MULTI_PLAYER': {
      return {
        ...state,
        active: 'multi',
      };
    }

    case 'TAKE_CARD': return takeCard(state, action);

    case 'PLACE_CARD': {
      const { isPlayer, card, position } = action.payload;
      // take card as well
      const { placedCards, ...newState } = takeCard(state, action);

      return {
        ...newState,
        isPlayerTurn: !newState.isPlayerTurn,
        placedCards: computeBoardStandardResult(placedCards.slice(), card, position, isPlayer),
      };
    }

    case 'POPULATE_DECK': {
      const { isPlayer, cards } = action.payload;

      const newState = {
        ...state,
        [isPlayer ? 'playersCards' : 'opponentsCards']: cards,
      };

      // if player is the one to finish the deck last
      // then flip a coin to see who goes first
      if (newState.playersCards[0] !== null &&
          newState.opponentsCards[0] !== null
      ) {
        return {
          ...newState,
          isPlayerTurn: isPlayer,
        };
      }

      return newState;
    }

    case 'RESET_GAME': {
      return {
        ...initialState,
        active: state.active,
      };
    }

    case 'REMATCH': {
      const { isPlayer, response } = action.payload;

      const newState = {
        ...state,
        [isPlayer ? 'playerRematch' : 'opponentRematch']: response,
      };

      if (newState.playerRematch && newState.opponentRematch) {
        // rematching, reset the game
        return {
          ...initialState,
        };
      }

      return newState;
    }

    default:
      return state;

  }
};

export default reducer;
