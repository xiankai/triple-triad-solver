/* @flow */
import React from 'react';

import {
  Box
} from '../app/components';

const Card = ({ topValue, rightValue, bottomValue, leftValue }) => (
  <Box
    col={4}
    style={{
      position: 'relative',
      height: 120,
      border: '1px dotted red',
      display: 'inline-block',
      // flex: 1,
    }}
  >
    <div style={{ position: 'absolute', top: '5%', left: '45%' }}>{topValue}</div>
    <div style={{ position: 'absolute', left: '5%', top: '45%' }}>{leftValue}</div>
    <div style={{ position: 'absolute', bottom: '5%', left: '45%' }}>{bottomValue}</div>
    <div style={{ position: 'absolute', right: '5%', top: '45%' }}>{rightValue}</div>
  </Box>
);

export default Card;