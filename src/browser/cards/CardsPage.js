/* @flow */
import type { State } from '../../common/types';
import React from 'react';
import { connect } from 'react-redux';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { populateDeck } from '../../common/cards/actions';

import {
  PageHeader,
  Title,
  View,

  Flex,
  Box
} from '../app/components';
import DeckCard from './DeckCard';
import BoardCard from './BoardCard';

const CardsPage = ({ playersCards, opponentsCards, placedCards, populateDeck }) => (
  <View>
    <Title message="Triple Triad Solver" />
    <PageHeader
      description="Get the latest scoop on your winning odds against Rowena"
      heading="Triple Triad Solver"
    />
    <button onClick={() => populateDeck(true, [0, 1, 5, 10, 15])}>Populate Player Deck</button>
    <button onClick={() => populateDeck(false, [80, 60, 40, 20, 10])}>Populate Opponent Deck</button>
    <Flex>
      <Box
        auto
        p={1}
      >
        {
          playersCards.map((card, i) => <DeckCard key={i} card={card} isPlayer />)
        }
      </Box>
      <Box
        auto
        p={1}
      >
        {
          placedCards.map((placedCard, i) => <BoardCard key={i} {...placedCard} position={i} />)
        }
      </Box>
      <Box
        auto
        p={1}
      >
        {
          opponentsCards.map((card, i) => <DeckCard key={i} card={card} isPlayer={false} />)
        }
      </Box>
    </Flex>
  </View>
);


export default DragDropContext(HTML5Backend)(
  connect(
    (state: State) => state.cards,
    {
      populateDeck,
    }
  )(CardsPage)
);
