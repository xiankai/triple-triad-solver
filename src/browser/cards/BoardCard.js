/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import { DropTarget } from 'react-dnd';

import { placeCard } from '../../common/cards/actions';

import Card from './Card';

const dropTarget = {
  drop: (props, monitor) => {
    const { position, placeCard } = props;
    const { isPlayer, card } = monitor.getItem();
    placeCard(isPlayer, card, position);
  },
  canDrop: props => !props.card,
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
