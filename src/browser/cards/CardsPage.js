/* @flow */
import type { State } from '../../common/types';
import React from 'react';
import { connect } from 'react-redux';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { ActionCreators } from 'redux-undo';

import {
  populateDeck,
  resetGame,
} from '../../common/cards/actions';

import {
  PageHeader,
  Title,
  View,

  Button,

  Grid,
  Flex,
} from '../app/components';
import DeckCard from './DeckCard';
import BoardCard from './BoardCard';

const CardsPage = ({
  playersCards,
  opponentsCards,
  placedCards,
  past,
  future,

  populateDeck,
  resetGame,
  undo,
  redo,
}) => (
  <View>
    <Title message="Triple Triad Solver" />
    <PageHeader
      description="Get the latest scoop on your winning odds against Rowena"
      heading="Triple Triad Solver"
    />
    <Flex>
      <Grid col={4} p={2}>
        <Button onClick={() => populateDeck(true, [0, 1, 5, 10, 15])} backgroundColor="blue">Populate Player Deck</Button>
      </Grid>
      <Grid col={4} p={2}>
        <Grid col={4}>
          {
            (past + future) > 0 &&
            <Button onClick={resetGame} backgroundColor="info">Reset</Button>
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
        <Button onClick={() => populateDeck(false, [80, 60, 40, 20, 10])} backgroundColor="red">Populate Opponent Deck</Button>
      </Grid>
    </Flex>
    <Flex>
      <Grid col={4} p={2}>
        {
          playersCards.map((card, i) =>
            <Grid
              key={i}
              col={4}
            >
              <DeckCard key={i} card={card} isPlayer />
            </Grid>
          )
        }
      </Grid>
      <Grid col={4} p={2}>
        {
          placedCards.map((placedCard, i) =>
            <Grid
              key={i}
              col={4}
            >
              <BoardCard key={i} {...placedCard} position={i} />
            </Grid>
          )
        }
      </Grid>
      <Grid col={4} p={2}>
        {
          opponentsCards.map((card, i) =>
            <Grid
              key={i}
              col={4}
            >
              <DeckCard card={card} isPlayer={false} />
            </Grid>
          )
        }
      </Grid>
    </Flex>
  </View>
);


export default DragDropContext(HTML5Backend)(
  connect(
    (state: State) => ({
      ...state.cards.present,
      past: state.cards.past.length,
      future: state.cards.future.length,
    }),
    {
      populateDeck,
      resetGame,
      undo: ActionCreators.undo,
      redo: ActionCreators.redo,
    }
  )(CardsPage)
);
