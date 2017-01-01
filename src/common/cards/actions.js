/* @flow */
import type { Action } from '../types';

export const placeCard = (isPlayer: boolean, position: number, card: number): Action => ({
  type: 'PLACE_CARD',
  payload: {
    isPlayer,
    position,
    card,
  },
});

export const populateDeck = (cards: Array): Action => ({
  type: 'PLACE_CARD',
  payload: {
    cards,
  },
});
