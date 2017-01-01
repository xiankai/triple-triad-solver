/* @flow */
import type { Action } from '../types';

export const takeCard = (isPlayer: boolean, card: number): Action => ({
  type: 'TAKE_CARD',
  payload: {
    isPlayer,
    card,
  },
});

export const placeCard = (isPlayer: boolean, card: number, position: number): Action => ({
  type: 'PLACE_CARD',
  payload: {
    isPlayer,
    card,
    position,
  },
});

export const populateDeck = (isPlayer: boolean, cards: Array): Action => ({
  type: 'POPULATE_DECK',
  payload: {
    isPlayer,
    cards,
  },
});

export const resetGame = (): Action => ({
  type: 'RESET_GAME',
});

