/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import { DropTarget } from 'react-dnd';

import { placeCard } from '../../common/cards/actions';

import Card from './Card';

const dropTarget = {
  drop(props) {
    const { isPlayer, card, position } = props;
    console.log(props);
    console.log(`dropping ${card} card on ${position}`);
    placeCard(isPlayer, card, position);
  },
};

const BoardCard = ({ connectDropTarget, ...props }) => connectDropTarget(
  <div>
    <Card {...props} />
  </div>
);

export default connect(
  null,
  {
    placeCard,
  }
)(
  DropTarget(
    'card',
    dropTarget,
    (connect, monitor) => ({
      connectDropTarget: connect.dropTarget(),
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    })
  )(BoardCard)
);
