import React from 'react';

import {
  Text,
} from '../app/components';

const Turns = ({
  isPlayerTurn,
}) => (
  <Text
    bold
    style={{
      color: isPlayerTurn ? '#4AC8E6' : '#E27062',
      transform: 'scale(2,1)',
    }}
  >
    { isPlayerTurn ? 'YOUR TURN' : 'OPPONENT\'S TURN' }
  </Text>
);

export default Turns;
