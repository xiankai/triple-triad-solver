/* @flow weak */
import type { Action, State } from './types';
import app from './app/reducer';
import auth from './auth/reducer';
import cards from './cards/reducer';
import config from './config/reducer';
import device from './device/reducer';
import intl from './intl/reducer';
import themes from './themes/reducer';
import todos from './todos/reducer';
import users from './users/reducer';
import { combineReducers } from 'redux';
import { fieldsReducer as fields } from './lib/redux-fields';
import undoable, { includeAction } from 'redux-undo';

// stackoverflow.com/q/35622588/233902
const resetStateOnSignOutReducer = (reducer, initialState) => (
  state: State,
  action: Action,
) => {
  const userWasSignedOut =
    action.type === 'ON_AUTH' &&
    state.users.viewer &&
    !action.payload.firebaseUser;
  if (!userWasSignedOut) {
    return reducer(state, action);
  }
  // Purge sensitive data, preserve only app and safe initial state.
  return reducer({
    app: state.app,
    config: initialState.config,
    device: initialState.device,
    intl: initialState.intl,
  }, action);
};

const configureReducer = (initialState: Object) => {
  let reducer = combineReducers({
    app,
    auth,
    cards: undoable(cards, { filter: includeAction(['TAKE_CARD', 'PLACE_CARD', 'POPULATE_DECK']) }),
    config,
    device,
    fields,
    intl,
    themes,
    todos,
    users,
  });

  // The power of higher-order reducers, http://slides.com/omnidan/hor
  reducer = resetStateOnSignOutReducer(reducer, initialState);

  return reducer;
};

export default configureReducer;
