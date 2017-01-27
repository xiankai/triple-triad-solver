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

const BoardCard = ({ connectDropTarget, canDrop, item, ...props }) => connectDropTarget(
  <div>
    <Card
      {...props}
      logicalLayout={
        canDrop &&
        item &&
        item.logicalLayout &&
        item.logicalLayout[props.position]
      }
    />
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
      item: monitor.getItem(),
    })
  )(BoardCard)
);
