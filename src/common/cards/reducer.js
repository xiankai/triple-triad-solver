/* @flow */
import type { Action, CardsState } from '../types';

const initialState = {
  selectedCard: null,
  playersCards: (new Array(5)).fill(null),
  opponentsCards: (new Array(5)).fill(null),
  placedCards: (new Array(9)).fill({
    card: null,
    isPlayer: null,
  }),
};

const reducer = (
  state: CardsState = initialState,
  action: Action,
): CardsState => {
  // Because it's called from the createInitialState.
  if (!action) return state;

  switch (action.type) {
    case 'TAKE_CARD': {
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
            ...opponentsCards.slice(0, index - 1),
            null,
            ...opponentsCards.slice(index),
          ],
        };
      }
    }

    case 'PLACE_CARD': {
      const { isPlayer, card, position } = action.payload;
      const { placedCards } = state;

      placedCards[position] = {
        isPlayer,
        card,
      };

      return {
        ...state,
        placedCards,
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

    default:
      return state;

  }
};

export default reducer;
