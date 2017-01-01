/* @flow */
import type { Action, CardsState } from '../types';

const initialState = {
  playersCards: [1, 5, 10, 15, 20], //(new Array(5)).fill(null),
  opponentsCards: [100, 80, 60, 40, 20], //(new Array(5)).fill(null),
  placedCards: (new Array(9)).fill(null),
};

const reducer = (
  state: CardsState = initialState,
  action: Action,
): CardsState => {
  switch (action.type) {
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

    case 'PLACE_CARD': {
      const { isPlayer, card, position } = action.payload;
      let { playersCards, opponentsCards, placedCards } = state;

      placedCards[position] = card;

      if (isPlayer) {
        const index = playersCards.indexOf(card);
        playersCards = {
          ...playersCards.slice(0, index),
          ...playersCards.slice(index),
        };

        return {
          playersCards,
          opponentsCards,
          placedCards,
        };
      } else {
        const index = opponentsCards.indexOf(card);
        opponentsCards = {
          ...opponentsCards.slice(0, index),
          ...opponentsCards.slice(index),
        };

        return {
          playersCards,
          opponentsCards,
          placedCards,
        };
      }
    }

    default:
      return state;

  }
};

export default reducer;
