import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import uuid from 'uuid/v4';

import Card from './Card';
import CardEmpty from './CardEmpty';

const columnSpec = {
  drop(props, monitor, component) {
    component.props.moveCard(props.data,monitor.getItem().cardData)
  },
};

const collect = (connect, monitor) => {
  const cardProps = monitor.getItem();
  const height = cardProps && cardProps.height;
  const width = cardProps && cardProps.width;
  const cardId = cardProps && cardProps.cardData.id;
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
    cardHeight: height,
    cardWidth: width,
    cardId
  };
};


class Column extends Component {
  constructor() {
    super();
    this.renderCards = this.renderCards.bind(this);

  }

  renderCards(cards) {
    cards = cards.filter((obj, pos, arr) =>
      arr.map(mapObj => mapObj.id).indexOf(obj.id) === pos
    );

    if (cards) {
      return cards.map(card => <Card timeframe={this.props.timeframe} data={card} key={card.id} showError={this.props.showError} showMore={this.props.showMore} boardId={this.props.boardId} />);
    }

    return null;
  }

  render() {
    const { connectDropTarget, isOver, canDrop, drop } = this.props;
    const cards = this.props.cards;
    const cardIds = cards.map(card => card.id)
    return connectDropTarget(
      <div style={{ width: 250, borderRightWidth: 2, borderLeftWidth: 2, borderTopWidth: 2, borderStyle: 'solid', borderColor: 'white', display: 'flex', alignItems: 'center', flexDirection: 'column', backgroundColor: '#f5fbef' }}>
        {this.renderCards(cards)}
        { isOver && !cardIds.includes(this.props.cardId) &&
          <CardEmpty height={this.props.cardHeight} width={this.props.cardWidth} />
        }
      </div>
    );
  }
}

Column.defaultProps = {
  cards: []
};

Column.propTypes = {
  cards: PropTypes.array,
  timeframe: PropTypes.number.isRequired,
};


export default DropTarget('1', columnSpec, collect)(Column);
