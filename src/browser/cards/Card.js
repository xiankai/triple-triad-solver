/* @flow */
import React from 'react';

import cards from '../../common/cards/cards.json';

const Card = ({ card, isPlayer }) => {
  const { topValue, leftValue, bottomValue, rightValue } = cards[card] || {};

  return (
    <div
      style={{
        position: 'relative',
        height: 120,
        border: '1px dotted red',
        width: '100%',
        background: card !== null ? (isPlayer ? 'blue' : 'red') : 'transparent',
        color: 'white',
        // flex: 1,
      }}
    >
      <div style={{ position: 'absolute', top: '5%', left: '45%' }}>{topValue === "10" ? 'A' : topValue}</div>
      <div style={{ position: 'absolute', left: '5%', top: '45%' }}>{leftValue === "10" ? 'A' : leftValue}</div>
      <div style={{ position: 'absolute', bottom: '5%', left: '45%' }}>{bottomValue === "10" ? 'A' : bottomValue}</div>
      <div style={{ position: 'absolute', right: '5%', top: '45%' }}>{rightValue === "10" ? 'A' : rightValue}</div>
    </div>
  );
};

export default Card;
