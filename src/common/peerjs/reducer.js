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
    case 'STARTED': {
      return {
        ...state,
        peer: action.payload.peer,
      };
    }

    case 'CONNECTED': {
      return {
        ...state,
        connection: action.payload.connection,
      };
    }

    case 'SEND':
    case 'RECEIVE':
    case 'ERROR':

    default:
      return state;

  }
};

export default reducer;
