import React from 'react';
import { connect } from 'react-redux';

import {
  Grid,
  Flex,
} from '../app/components';

import DeckCard from './DeckCard';
import BoardCard from './BoardCard';

let shownCardCounter = 0;

const Board = ({
  playersCards,
  opponentsCards,
  placedCards,
  rules,

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
            <DeckCard
              key={i}
              card={card}
              isPlayer
              canDrag={isPlayerTurn}
              open
            />
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
            <BoardCard
              key={i}
              {...placedCard}
              position={i}
              open
            />
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
              open={
                isSinglePlayer ||
                rules['All Open'] ||
                (rules['Three Open'] && ++shownCardCounter <= 3)
              }
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
