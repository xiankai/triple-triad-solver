/* @flow */
import React from 'react';

import cards from '../../common/cards/cards.json';

const Card = ({ card, isPlayer, open, logicalLayout, isDragging }) => {
  const { topValue, leftValue, bottomValue, rightValue } = cards[card] || {};
  const values = [
    { value: topValue, top: '5%', left: '45%' },
    { value: leftValue, left: '5%', top: '45%' },
    { value: bottomValue, bottom: '5%', left: '45%' },
    { value: rightValue, right: '5%', top: '45%' },
    { value: logicalLayout && logicalLayout.score && logicalLayout.score.toFixed(2),
      left: '30%',
      top: '45%',
      color: isPlayer === null ? 'black' : 'lawngreen',
    },
  ];

  let background = 'transparent';
  if (isPlayer === null && isDragging) {
    background = 'lightgreen';
  } else if (card !== null) {
    if (isPlayer) {
      background = '#4A61A8';
    } else {
      background = '#AA2A28';
    }
  }

  return (
    <div
      style={{
        position: 'relative',
        height: '20vh',
        border: '1px dotted #D8C28B',
        width: '100%',
        background,
        // backgroundImage: `url("/assets/cards/${('00' + number).slice(-3)}.png")`,
        color: 'white',
      }}
    >
      {
        open
        ? values.map(({ value, ...style }, key) =>
          <div
            key={key}
            style={{ position: 'absolute', ...style }}
          >
            { value === '10' ? 'A' : value }
          </div>
        )
        : null
      }
    </div>
  );
};

export default Card;
