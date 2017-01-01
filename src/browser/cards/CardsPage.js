/* @flow */
import type { State } from '../../common/types';
import React from 'react';
import { connect } from 'react-redux';

import { populateDeck } from '../../common/cards/actions';

import cards from '../../common/cards/cards.json';

import {
  PageHeader,
  Title,
  View,

  Flex,
  Box
} from '../app/components';
import Card from './Card';

const CardsPage = ({ cards: { playersCards, opponentsCards, placedCards } }) => (
  <View>
    <Title message="Triple Triad Solver" />
    <PageHeader
      description="Get the latest scoop on your winning odds against Rowena"
      heading="Triple Triad Solver"
    />
    <Flex>
      <Box
        auto
        p={1}
      >
        {
          playersCards.map((card, i) => <Card key={i} {...cards[card]} />)
        }
      </Box>
      <Box
        auto
        p={1}
      >
        {
          placedCards.map((card, i) => <Card key={i} {...cards[card]} />)
        }
      </Box>
      <Box
        auto
        p={1}
      >
        {
          opponentsCards.map((card, i) => <Card key={i} {...cards[card]} />)
        }
      </Box>
    </Flex>
  </View>
);


export default connect(
  (state: State) => ({
    cards: state.cards,
  }),
  {
    populateDeck,
  }
)(CardsPage);
