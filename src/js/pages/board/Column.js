import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';

import Card from './Card';
// import CardEmpty from './CardEmpty';

const columnSpec = {
  drop(props, monitor, component) {
    console.log(props, monitor, component);
  },
};

const collect = (connect, monitor) => {
  const cardProps = monitor.getItem();
  const height = cardProps && cardProps.height;
  const width = cardProps && cardProps.width;

  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
    cardHeight: height,
    cardWidth: width,
  };
};


class Column extends Component {
  constructor() {
    super();
    this.renderCards = this.renderCards.bind(this);
  }

  renderCards(cards) {
    if (cards) {
      return cards.map(card => <Card data={card} key={card.id} />);
    }

    return null;
  }

  render() {
    // const { connectDropTarget, isOver, canDrop } = this.props;
    const cards = this.props.cards;
    return (
      <div style={{ width: 250, borderRightWidth: 2, borderLeftWidth: 2, borderTopWidth: 2, borderStyle: 'solid', borderColor: 'white', display: 'flex', alignItems: 'center', flexDirection: 'column', backgroundColor: '#f5fbef' }}>
        {this.renderCards(cards)}
        {/* isOver &&
          <CardEmpty height={this.props.cardHeight} width={this.props.cardWidth} />
        */}
      </div>
    );
  }
}

Column.defaultProps = {
  cards: []
};

Column.propTypes = {
  cards: PropTypes.array,
};


export default DropTarget('1', columnSpec, collect)(Column);
