/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import { DragSource } from 'react-dnd';

import { takeCard } from '../../common/cards/actions';

import Card from './Card';

const boxSource = {
  beginDrag: props => {
    const { isPlayer, card } = props;
    console.log(`selecting ${card} card`);
    return {
      isPlayer,
      card,
    };
  },
  endDrag: (props, monitor) => {
    const { isPlayer, card, takeCard } = props;
    console.log(`using ${card} card`);
    if (monitor.didDrop()) {
      takeCard(isPlayer, card);
    }
  },
};

const DeckCard = ({ connectDragSource, ...props }) => connectDragSource(
  <div>
    <Card {...props} />
  </div>
);

export default connect(
  null,
  {
    takeCard,
  }
)(
  DragSource(
    'card',
    boxSource,
    (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    })
  )(DeckCard)
);
