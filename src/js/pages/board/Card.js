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
  canDrag(props) {
    const user = sessionStorage.getItem('user');
    return props.data.project.team.members.map(m => m.id).includes(String(JSON.parse(user).id));
  },

  beginDrag(props, monitor, component) {
    // eslint-disable-next-line no-find-dom-node
    const node = findDOMNode(component).getBoundingClientRect();
    return {
      height: node.height,
      width: node.width,
      cardData: component.props.data,
    };
  },
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
    const { isDragging, connectDragSource } = this.props;
    const data = this.props.data;
    const percent = (data.estimate / 6);
    const w = true ? Math.max(5, 100 * Math.min(percent, 1)) : 0;
    return connectDragSource(
      <div style={{ backgroundColor: 'white', width: '95%', maxWidth: 250, borderStyle: 'solid', borderColor: '#dbd9d9', borderWidth: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 5, opacity: isDragging ? 0.3 : 1, cursor: 'move', borderRadius: 10, marginTop: 5, }}>
        <div style={{ display: 'flex', width: '90%', justifyContent: 'space-between', marginBottom: 8, marginTop: 5 }}>
          <h style={{ opacity: 0.5 }}>
            {data.id}
          </h>
          <svg width="100" height="5" style={{marginTop: 10, borderRadius: 20}}>
            <rect width="100" height="5" fill="#ccc" rx="0" ry="0"></rect>
            <rect width={w} height="5" fill="#426381" rx="0" ry="0"></rect>
          </svg>
          <div style={{height: 20, cursor: 'pointer'}} onClick={() => this.props.showMore(data)}>
            <MoreIcon />
          </div>
        </div>
        <div style={{ borderColor: 'black', borderWidth: 0, borderBottomWidth: 1, width: '100%', borderStyle: 'solid', opacity: 0.2 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', height: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'center', width: '95%', marginBottom: 10, flexDirection: 'column', marginTop: 10, marginLeft: 5 }}>
            <h>
              #{data.cardNumber} {data.name}
            </h>
            <h style={{ display: 'flex', justifyContent: 'flex-end', fontSize: 14, opacity: 0.6, marginRight: 5 }}>
              {data.owner.member.firstName} {data.owner.member.lastName}
            </h>
          </div>
          <div style={{ minHeight: '100%', minWidth: 3, backgroundColor: data.type && data.type.id === 'A_0' ? 'white' : '#0F3641', display: 'inline-block', borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }} />
        </div>
        <div style={{ borderColor: 'black', borderWidth: 0, borderBottomWidth: 1, width: '100%', borderStyle: 'solid', marginBottom: 10, opacity: 0.2 }} />
        <div style={{ display: 'flex', width: '95%', marginBottom: 10, flexDirection: 'column' }}>
          {data.tasks.map(task => (<CheckBox
            label={task.description} defaultChecked={task.done} key={task.id} />))}
        </div>
      </div>
    );
  }
}

Card.defaultProps = {
  data: null,
};

Card.propTypes = {
  data: PropTypes.object,
  // Injected by React DnD:
  isDragging: PropTypes.bool.isRequired,
  connectDragSource: PropTypes.func.isRequired
};

export default DragSource('1', cardSource, collect)(Card);
