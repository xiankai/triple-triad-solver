import React from 'react';
import { connect } from 'react-redux';

import { ActionCreators } from 'redux-undo';
import {
  populateDeck,
  resetGame,
} from '../../common/cards/actions';

import {
  Button,

  Grid,
  Flex,
} from '../app/components';

import { generateRandomDeck } from '../../common/cards/logic';

const Singleplayer = ({
  past,
  future,

  populateDeck,
  clearHistory,
  undo,
  redo,
  resetGame,
}) => (
  <Flex>
    <Grid col={4} p={2}>
      <Button onClick={() => populateDeck(true, generateRandomDeck())} backgroundColor="blue">Populate Player Deck</Button>
    </Grid>
    <Grid col={4} p={2}>
      <Grid col={4}>
        {
          (past + future) > 0 &&
          <Button onClick={() => resetGame() && clearHistory()} backgroundColor="info">Reset</Button>
        }
      </Grid>
      <Grid col={4}>
        {
          past > 0 && <Button onClick={undo} backgroundColor="error">Undo</Button>
        }
      </Grid>
      <Grid col={4}>
        {
          future > 0 && <Button onClick={redo} backgroundColor="success">Redo</Button>
        }
      </Grid>
    </Grid>
    <Grid col={4} p={2}>
      <Button onClick={() => populateDeck(false, generateRandomDeck())} backgroundColor="red">Populate Opponent Deck</Button>
    </Grid>
  </Flex>
);

export default connect(
  (state: State) => ({
    past: state.cards.past.length,
    future: state.cards.future.length,
  }),
  {
    populateDeck,
    resetGame,
    clearHistory: ActionCreators.clearHistory,
    undo: ActionCreators.undo,
    redo: ActionCreators.redo,
  }
)(Singleplayer);