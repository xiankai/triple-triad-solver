import React from 'react';
import { connect } from 'react-redux';

import {
  Grid,
  Flex,
} from '../app/components';

import DeckCard from './DeckCard';
import BoardCard from './BoardCard';

const Board = ({
  playersCards,
  opponentsCards,
  placedCards,

  isSinglePlayer,
  isPlayerTurn,
}) => (
  <Flex>
    <Grid col={4} p={2}>
      {
        playersCards.map((card, i) =>
          <Grid
            key={i}
            col={4}
          >
            <DeckCard key={i} card={card} isPlayer canDrag={isPlayerTurn} />
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
            <DeckCard
              card={card}
              isPlayer={false}
              canDrag={isSinglePlayer}
            />
          </Grid>
        )
      }
    </Grid>
  </Flex>
);

export default connect(
  (state: State) => state.cards.present
)(Board);
