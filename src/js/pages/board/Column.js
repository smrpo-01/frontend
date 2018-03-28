import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';

import Card from './Card';
import CardEmpty from './CardEmpty';

const columnSpec = {
  drop(props, monitor, component) {
    console.log(component.props);
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
  render() {
    const { connectDropTarget, isOver, canDrop } = this.props;
    return connectDropTarget(
      <div style={{ display: 'flex', width: 300, borderColor: '#cbd0c4', borderStyle: 'solid', borderWidth: 1, marginLeft: 5, justifyContent: 'center', backgroundColor: '#fbfff7' }}>
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }}>
          <h style={{ fontSize: 20, backgroundColor: '#ececec', width: '90%', display: 'flex', alignItems: 'center', flexDirection: 'column', borderBottomLeftRadius: 6, borderBottomRightRadius: 6, borderColor: this.props.color, borderStyle: 'solid', borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderTopWidth: 0, marginBottom: 15 }}>
            {this.props.title}
          </h>
          {this.props.cards.map((card, i) => <Card id={card.id} title={card.title} expiration={card.expiration} owner={card.owner} tasks={card.tasks} key={i} />)}
          { isOver &&
            <CardEmpty height={this.props.cardHeight} width={this.props.cardWidth} />
          }
        </div>
      </div>
    );
  }
}

Column.defaultProps = {
  title: '',
  cards: [],
  color: '',
};

Column.propTypes = {
  title: PropTypes.string,
  cards: PropTypes.array,
  color: PropTypes.string,
};


export default DropTarget('1', columnSpec, collect)(Column);
