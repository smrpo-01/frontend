import React, { Component } from 'react';
import MoreIcon from 'grommet/components/icons/base/More';
import CheckBox from 'grommet/components/CheckBox';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';

import { findDOMNode } from 'react-dom';

import Meter from 'grommet/components/Meter';

/**
 * Implements the drag source contract.
 */
const cardSource = {
  beginDrag(props, monitor, component) {
    const node = findDOMNode(component).getBoundingClientRect();

    return {
      height: node.height,
      width: node.width,
    };
  },
  endDrag(props, monitor, component) {
    //console.log(monitor, component);
  }
};

/**
 * Specifies the props to inject into your component.
 */
const collect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
});


class Card extends Component {
  render() {
    const { isDragging, connectDragSource, text } = this.props;
    return connectDragSource(
      <div style={{ backgroundColor: 'white', width: '95%', maxWidth: 250, borderStyle: 'solid', borderColor: '#dbd9d9', borderWidth: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 15, opacity: isDragging ? 0.3 : 1, cursor: 'move', borderRadius: 10, marginTop: 10 }}>
        <div style={{ display: 'flex', width: '90%', justifyContent: 'space-between', marginBottom: 8, marginTop: 5 }}>
          <h style={{ opacity: 0.5 }}>
            {this.props.id}
          </h>
          <Meter vertical={false}
            style={{ marginTop: 6 }}
            size='xsmall'
            colorIndex='graph-1'
            value={90} />
          <MoreIcon />
        </div>
        <div style={{ borderColor: 'black', borderWidth: 0, borderBottomWidth: 1, width: '100%', borderStyle: 'solid', marginBottom: 10, opacity: 0.2 }} />
        <div style={{ display: 'flex', justifyContent: 'center', width: '95%', marginBottom: 10, flexDirection: 'column' }}>
          <h>
            {this.props.name}
          </h>
          <h style={{ display: 'flex', justifyContent: 'flex-end', fontSize: 14, opacity: 0.6, marginRight: 5 }}>
            {this.props.owner}
          </h>
        </div>
        <div style={{ borderColor: 'black', borderWidth: 0, borderBottomWidth: 1, width: '100%', borderStyle: 'solid', marginBottom: 10, opacity: 0.2 }} />
        <div style={{ display: 'flex', width: '95%', marginBottom: 10, flexDirection: 'column' }}>
          {this.props.tasks.map((task, i) => <CheckBox
            label={task.label} defaultChecked={task.done} key={i} />)}
        </div>
      </div>
    );
  }
}

Card.defaultProps = {
  id: '',
  name: '',
  owner: '',
  tasks: [],
};

Card.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  owner: PropTypes.string,
  tasks: PropTypes.array,
  // Injected by React DnD:
  isDragging: PropTypes.bool.isRequired,
  connectDragSource: PropTypes.func.isRequired
};

export default DragSource('1', cardSource, collect)(Card);
