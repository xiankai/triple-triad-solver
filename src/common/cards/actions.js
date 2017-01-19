/* @flow */
import type { Action } from '../types';

export const singlePlayer = (): Action => ({
  type: 'SINGLE_PLAYER',
});

export const multiPlayer = (): Action => ({
  type: 'MULTI_PLAYER',
});

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

export const rematch = (isPlayer: boolean, response: boolean): Action => ({
  type: 'REMATCH',
  payload: {
    isPlayer,
    response,
  },
});

export const toggleRule = (rule): Action => ({
  type: 'TOGGLE_RULE',
  payload: {
    rule,
  },
});

export const undoableActions = ['TAKE_CARD', 'PLACE_CARD', 'POPULATE_DECK'];
export const multiplayerActions = ['TAKE_CARD', 'PLACE_CARD', 'POPULATE_DECK', 'REMATCH'];
