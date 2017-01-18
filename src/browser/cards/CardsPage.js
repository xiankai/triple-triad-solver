/* @flow */
import type { State } from '../../common/types';
import React from 'react';
import { connect } from 'react-redux';

import { DragDropContext } from 'react-dnd';
import TouchBackend from 'react-dnd-touch-backend';
import HTML5Backend from 'react-dnd-html5-backend';

import { ActionCreators } from 'redux-undo';

import cards from '../../common/cards/cards.json';
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

  Text,
  Button,
  ButtonOutline,

  Grid,
  Flex,
} from '../app/components';
import Multiplayer from './Multiplayer';
import Turns from './Turns';
import Winner from './Winner';
import Rematching from './Rematching';
import DeckCard from './DeckCard';
import BoardCard from './BoardCard';

const generateRandomDeck = () => (new Array(5)).fill(null).map(() => Math.floor(Math.random() * cards.length));

const determineWinner = (placedCards) => {
  if (placedCards.filter(placedCard => placedCard.card === null).length > 0) {
    return '';
  }

  const score = placedCards.reduce((score, placedCard) => score + (placedCard.isPlayer ? 1 : -1), 0);

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
  past,
  future,
  winner,
  isPlayerTurn,
  connected,
  active,

  singlePlayer,
  multiPlayer,
  populateDeck,
  resetGame,
  clearHistory,
  undo,
  redo,
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
    <Flex justify="center">
      {
        winner &&
        <Winner winner={winner} isPlayerTurn={isPlayerTurn} />
      }
    </Flex>
    <Flex justify="center">
      {
        !winner &&
        isPlayerTurn !== null &&
        <Turns isPlayerTurn={isPlayerTurn} />
      }
      {
        winner &&
        active === 'multi' &&
        <Rematching />
      }
    </Flex>
    <Flex>
      {
        (active === 'single' || connected) &&
        <Grid col={4} p={2}>
          <Button onClick={() => populateDeck(true, generateRandomDeck())} backgroundColor="blue">Populate Player Deck</Button>
        </Grid>
      }
      {
        active === 'single' &&
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
      }
      {
        active === 'single' &&
        <Grid col={4} p={2}>
          <Button onClick={() => populateDeck(false, generateRandomDeck())} backgroundColor="red">Populate Opponent Deck</Button>
        </Grid>
      }
    </Flex>
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
      past: state.cards.past.length,
      future: state.cards.future.length,
      winner: determineWinner(state.cards.present.placedCards),
      connected: state.peerjs.connection && state.peerjs.connection.open && state.peerjs.connection.peer,
    }),
    {
      singlePlayer,
      multiPlayer,
      populateDeck,
      resetGame,
      clearHistory: ActionCreators.clearHistory,
      undo: ActionCreators.undo,
      redo: ActionCreators.redo,
    }
  )(CardsPage)
);
