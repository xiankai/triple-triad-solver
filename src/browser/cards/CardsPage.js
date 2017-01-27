/* @flow */
import type { State } from '../../common/types';
import React from 'react';
import { connect } from 'react-redux';

import { DragDropContext } from 'react-dnd';
import TouchBackend from 'react-dnd-touch-backend';
import HTML5Backend from 'react-dnd-html5-backend';

import {
  generateRandomDeck,
  computeNaiveScore,
} from '../../common/cards/logic';
import { isMobile } from '../../common/utils';
import {
  singlePlayer,
  multiPlayer,
  populateDeck,
  resetGame,
  toggleSolver,
} from '../../common/cards/actions';

import {
  PageHeader,
  Title,
  View,

  Button,
  ButtonOutline,

  Flex,
} from '../app/components';
import Multiplayer from './Multiplayer';
import Singleplayer from './Singleplayer';
import Rules from './Rules';
import Turns from './Turns';
import Winner from './Winner';
import Rematching from './Rematching';
import Board from './Board';


const determineWinner = (placedCards, isPlayerTurn) => {
  if (placedCards.filter(placedCard => placedCard.card === null).length > 0) {
    return '';
  }

  let score = computeNaiveScore(placedCards);

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
    onClick={action}
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
  isPlayerTurn,
  started,
  winner,
  connected,
  isSingleplayer,
  isMultiplayer,
  readyToPlay,
  solverActivated,

  singlePlayer,
  multiPlayer,
  populateDeck,
  resetGame,
  toggleSolver,
}) => (
  <View>
    <Title message="FFXIV Triple Triad Game" />
    <PageHeader
      description="Play solo or with friends, outside of the game!"
      heading="FFXIV Triple Triad"
    />
    <div>
      { Tab('Singleplayer', !isSingleplayer ? singlePlayer : () => {}, isSingleplayer) }
      { Tab('Multiplayer', !isMultiplayer ? multiPlayer : () => {}, isMultiplayer) }
      { Tab('Solver', toggleSolver, solverActivated) }
    </div>
    {
      isMultiplayer &&
      <Multiplayer
        resetGame={resetGame}
      />
    }
    {
      readyToPlay &&
      <Rules started={started} />
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
        started &&
        <Turns isPlayerTurn={isPlayerTurn} />
      }
      {
        winner &&
        isMultiplayer &&
        <Rematching />
      }
    </Flex>
    {
      isMultiplayer &&
      connected &&
      !started &&
      <Button onClick={() => populateDeck(true, generateRandomDeck())} backgroundColor="blue">Populate Your Deck</Button>
    }
    {
      isSingleplayer &&
      <Singleplayer />
    }
    {
      readyToPlay &&
      <Board
        isSinglePlayer={isSingleplayer}
        isPlayerTurn={isPlayerTurn}
        started={started}
        solverActivated={solverActivated}
      />
    }
  </View>
);

export default DragDropContext(isMobile() ? TouchBackend : HTML5Backend)(
  connect(
    (state: State) => {
      const {
        active,
        isPlayerTurn,
        placedCards,
        solverActivated,
      } = state.cards.present;

      const obj = {
        isPlayerTurn,
        started: isPlayerTurn !== null,
        winner: determineWinner(placedCards, isPlayerTurn),
        connected: state.peerjs.connection && state.peerjs.connection.open && state.peerjs.connection.peer,
        isSingleplayer: active === 'single',
        isMultiplayer: active === 'multi',
        solverActivated,
      };

      obj.readyToPlay = (obj.isMultiplayer && obj.connected) || obj.isSingleplayer;
      return obj;
    },
    {
      singlePlayer,
      multiPlayer,
      populateDeck,
      resetGame,
      toggleSolver,
    }
  )(CardsPage)
);
