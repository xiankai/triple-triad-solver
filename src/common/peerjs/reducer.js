/* @flow */
import type { Action, PeerjsState } from '../types';

const initialState = {
  peer: null,
  connection: null,
  connectee: null,
  error: null,
  loading: false,
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

    case 'CONNECTING': {
      return {
        ...state,
        connection: null,
        connectee: action.payload.id,
        loading: true,
        error: null,
      };
    }

    case 'CONNECTED': {
      return {
        ...state,
        error: null,
        loading: false,
        connection: action.payload.connection,
      };
    }

    case 'CLOSE': {
      return {
        ...state,
        error: `Connection with ${state.connectee} closed.`,
        loading: false,
        connection: null,
        connectee: null,
      };
    }

    case 'SEND':
    case 'RECEIVE':
    case 'ERROR': {
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    }

    default:
      return state;

  }
};

export default reducer;