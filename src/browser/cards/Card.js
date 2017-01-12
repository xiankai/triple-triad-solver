/* @flow */
import React from 'react';

import cards from '../../common/cards/cards.json';

const Card = ({ card, isPlayer }) => {
  const { topValue, leftValue, bottomValue, rightValue, number } = cards[card] || {};

  return (
    <div
      style={{
        position: 'relative',
        height: '20vh',
        border: '1px dotted #D8C28B',
        width: '100%',
        background: card !== null ? (isPlayer ? '#4A61A8' : '#AA2A28') : 'transparent',
        // backgroundImage: `url("/assets/cards/${('00' + number).slice(-3)}.png")`,
        color: 'white',
        // flex: 1,
      }}
    >
      <div style={{ position: 'absolute', top: '5%', left: '45%' }}>{topValue === '10' ? 'A' : topValue}</div>
      <div style={{ position: 'absolute', left: '5%', top: '45%' }}>{leftValue === '10' ? 'A' : leftValue}</div>
      <div style={{ position: 'absolute', bottom: '5%', left: '45%' }}>{bottomValue === '10' ? 'A' : bottomValue}</div>
      <div style={{ position: 'absolute', right: '5%', top: '45%' }}>{rightValue === '10' ? 'A' : rightValue}</div>
    </div>
  );
};

export default Card;
