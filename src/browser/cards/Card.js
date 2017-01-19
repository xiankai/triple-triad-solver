/* @flow */
import React from 'react';

import cards from '../../common/cards/cards.json';

const Card = ({ card, isPlayer, open }) => {
  const { topValue, leftValue, bottomValue, rightValue, number } = cards[card] || {};
  const values = [
    { value: topValue, top: '5%', left: '45%' },
    { value: leftValue, left: '5%', top: '45%' },
    { value: bottomValue, bottom: '5%', left: '45%' },
    { value: rightValue, right: '5%', top: '45%' },
  ];

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
      {
        open
        ? values.map(({ value, top, left, bottom, right }) =>
        <div style={{ position: 'absolute', top, left, bottom, right }}>{ value === '10' ? 'A' : value }</div>)
        : null
      }
    </div>
  );
};

export default Card;
