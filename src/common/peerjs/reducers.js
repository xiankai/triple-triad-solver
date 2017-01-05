/* @flow */
import type { Action, PeerjsState } from '../types';

const initialState = {
  peer: null,
  id: null,
  connection: null,
  error: null,
};

const reducer = (
  state: PeerjsState = initialState,
  action: Action,
): PeerjsState => {
  // Because it's called from the createInitialState.
  if (!action) return state;

  switch (action.type) {
    case 'CONNECTING': {
      return {
        ...state,
        id: action.payload.id,
      };
    }

    case 'CONNECTED':
    case 'SEND':
    case 'RECEIVE':
    case 'ERROR':

    default:
      return state;

  }
};

export default reducer;
