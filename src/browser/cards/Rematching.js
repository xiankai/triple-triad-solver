import React from 'react';
import { connect } from 'react-redux';

import {
  Text,
  Button,
} from '../app/components';

import {
  rematch,
} from '../../common/cards/actions';

const Rematching = ({
  playerRematch,
  opponentRematch,

  rematch,
}) => {
  if (!playerRematch && !opponentRematch) {
    return (
      <Button onClick={rematch(true, true)}>Rematch with your opponent again?</Button>
    );
  }

  if (playerRematch && opponentRematch === null) {
    return (
      <Text>Waiting for opponent's response...</Text>
    );
  }

  if (playerRematch && !opponentRematch) {
    return (
      <Text>Opponent has rejected your rematch.</Text>
    );
  }

  if (playerRematch === null && opponentRematch) {
    return (
      <div>
        <Text>Your opponent wants a rematch!</Text>
        <Button onClick={rematch(true, true)}>Accept</Button>
        <Button onClick={rematch(true, false)}>Reject</Button>
      </div>
    );
  }

  return null;
};

export default connect(
  (state: State) => ({
    ...state.cards.present,
  }),
  dispatch => ({
    rematch: (isPlayer, response) => () => dispatch(rematch(isPlayer, response)),
  })
)(Rematching);
