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
        loading: false,
        error: null,
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
        connection: action.payload.connection,
        loading: false,
        error: null,
      };
    }

    case 'CLOSE': {
      return {
        ...state,
        peer: null,
        connection: null,
        connectee: null,
        loading: false,
        error: `Connection with ${state.connectee} closed.`,
      };
    }

    case 'ERROR': {
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    }

    case 'PING': {
      // eslint-disable-next-line no-console
      console.log(`Pinging for the ${action.payload} time`);
      return state;
    }

    default:
      return state;

  }
};

export default reducer;
