import React from 'react';

import {
  Text,
} from '../app/components';

const Winner = ({
  winner,
}) => (
  <Text
    bold
    style={{
      color: winner === 'player' ? '#4AC8E6' : '#E27062',
      transform: 'scale(2,1)',
    }}
  >
    {
      (() => {
        switch (winner) {
          case 'player': return 'YOU WIN';
          case 'opponent': return 'YOU LOSE';
          case 'draw': return 'DRAW';
          default: return '';
        }
      })()
    }
  </Text>
);

export default Winner;
