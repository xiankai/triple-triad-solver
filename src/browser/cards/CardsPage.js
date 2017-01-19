/* @flow */
import type { State } from '../../common/types';
import React from 'react';
import { connect } from 'react-redux';

import { DragDropContext } from 'react-dnd';
import TouchBackend from 'react-dnd-touch-backend';
import HTML5Backend from 'react-dnd-html5-backend';

import { generateRandomDeck } from '../../common/cards/logic';
import { isMobile } from '../../common/utils';
import {
  singlePlayer,
  multiPlayer,
  populateDeck,
  resetGame,
} from '../../common/cards/actions';

import {
  PageHeader,
  Title,
  View,

  Button,
  ButtonOutline,

  Grid,
  Flex,
} from '../app/components';
import Multiplayer from './Multiplayer';
import Singleplayer from './Singleplayer';
import Rules from './Rules';
import Turns from './Turns';
import Winner from './Winner';
import Rematching from './Rematching';
import DeckCard from './DeckCard';
import BoardCard from './BoardCard';


const determineWinner = (placedCards, isPlayerTurn) => {
  if (placedCards.filter(placedCard => placedCard.card === null).length > 0) {
    return '';
  }

  let score = placedCards.reduce((score, placedCard) => score + (placedCard.isPlayer ? 1 : -1), 0);

  // if is player's turn, that means player has spent all his cards,
  // and gets a -1 disadvantage
  score += isPlayerTurn ? 1 : -1;

  if (score > 0) {
    return 'player';
  }

  if (score < 0) {
    return 'opponent';
  }

  if (score === 0) {
    return 'draw';
  }

  return '';
};

const Tab = (text, action, current = false) => current ? (
  <Button
    backgroundColor="primary"
    color="white"
    big
  >
    {text}
  </Button>
) : (
  <ButtonOutline
    color="primary"
    big
    onClick={action}
  >
    {text}
  </ButtonOutline>
);

const CardsPage = ({
  playersCards,
  opponentsCards,
  placedCards,
  isPlayerTurn,
  active,
  started,
  winner,
  connected,

  singlePlayer,
  multiPlayer,
  populateDeck,
  resetGame,
}) => (
  <View>
    <Title message="Triple Triad Solver" />
    <PageHeader
      description="Get the latest scoop on your winning odds against Rowena"
      heading="Triple Triad Solver"
    />
    <div>
      { Tab('Singleplayer', singlePlayer, active === 'single') }
      { Tab('Multiplayer', multiPlayer, active === 'multi') }
    </div>
    {
      active === 'multi' &&
      <Multiplayer
        resetGame={resetGame}
      />
    }
    <Rules started={started} />
    <Flex justify="center">
      {
        winner &&
        <Winner winner={winner} isPlayerTurn={isPlayerTurn} />
      }
    </Flex>
    <Flex justify="center">
      {
        !winner &&
        started &&
        <Turns isPlayerTurn={isPlayerTurn} />
      }
      {
        winner &&
        active === 'multi' &&
        <Rematching />
      }
    </Flex>
    {
      active === 'multi' &&
      connected &&
      !started &&
      <Button onClick={() => populateDeck(true, generateRandomDeck())} backgroundColor="blue">Populate Your Deck</Button>
    }
    {
      active === 'single' &&
      <Singleplayer />
    }
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
                canDrag={active === 'single'}
              />
            </Grid>
          )
        }
      </Grid>
    </Flex>
  </View>
);

export default DragDropContext(isMobile() ? TouchBackend : HTML5Backend)(
  connect(
    (state: State) => ({
      ...state.cards.present,
      started: state.cards.present.isPlayerTurn !== null,
      winner: determineWinner(state.cards.present.placedCards, state.cards.present.isPlayerTurn),
      connected: state.peerjs.connection && state.peerjs.connection.open && state.peerjs.connection.peer,
    }),
    {
      singlePlayer,
      multiPlayer,
      populateDeck,
      resetGame,
    }
  )(CardsPage)
);
