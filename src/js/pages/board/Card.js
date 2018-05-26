import React, { Component } from 'react';
import MoreIcon from 'grommet/components/icons/base/More';
import CheckBox from 'grommet/components/CheckBox';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import { findDOMNode } from 'react-dom';

import Meter from 'grommet/components/Meter';

import { getCardQuery } from './SidebarCardMore';

/**
 * Implements the drag source contract.
 */
const cardSource = {
  canDrag(props) {
    const user = sessionStorage.getItem('user');
    const userId = (JSON.parse(user).id);

    const filteredDevelopers = props.data.project.team.developers.filter(dev => dev.isActive);
    if (filteredDevelopers.map(m => m.idUser).includes(userId)) return true;
    if (props.data.project.team.kanbanMaster.idUser === userId && props.data.project.team.kanbanMaster.isActive) return true;
    if (props.data.project.team.productOwner.idUser === userId && props.data.project.team.productOwner.isActive) return true;
    console.log(props.data.project.team);
    return false;
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
  constructor() {
    super();

    this.toggleTask = this.toggleTask.bind(this);
    this.state = {
      tasks: [],
    };
  }

  toggleTask(taskId, done) {
    let tasks = this.state.tasks.map(task => task.id ==taskId && {
      ...task,
      done: !task.done,
    } || task);

    const user = sessionStorage.getItem('user');
    const userId = JSON.parse(user).id;


    this.setState({
      tasks
    });

    this.props.setDoneTaskMutation({
      variables: {
        taskId: parseInt(taskId, 10),
        done: !done,
        userId
      },
      refetchQueries: [{
        query: getCardQuery,
        variables: {
          cardId: parseInt(this.props.data.id, 10)
        }
      }
      ]
    }).then(res => {})
      .catch(err => {
        if (err.message.split(':')[1] !== ' None') {
          this.props.showError(err.message.split(':')[1]);
        }
      });
  }

  componentWillMount() {
    if (this.props.data && this.props.data.tasks) {
      this.setState({
        tasks: this.props.data.tasks,
      });
    }
  }

  render() {
    const { isDragging, connectDragSource, timeframe } = this.props;
    const data = this.props.data;
    const expirationDate = new Date(data.expiration);
    let today = new Date();
    today.setDate(today.getDate() + timeframe);
    const shouldBlink = (expirationDate <= today);
    const percent = (data.estimate / 6);
    const w = true ? Math.max(5, 100 * Math.min(percent, 1)) : 0;
    return connectDragSource(
      <div className={(shouldBlink) ? 'blink' : ''} style={{ backgroundColor: data.colorRejected ? '#ff84841A' : 'white', width: '95%', maxWidth: 250, borderStyle: 'solid', borderColor: '#dbd9d9', borderWidth: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 5, opacity: isDragging ? 0.3 : 1, cursor: 'move', borderRadius: 10, marginTop: 5, borderColor: data.colorRejected ? '#d62a2a' : 'white' }}>
        <div style={{ display: 'flex', width: '90%', justifyContent: 'space-between', marginBottom: 8, marginTop: 5 }}>
          <h style={{ opacity: 0.5 }}>
            {data.id}
          </h>
          <svg width='100' height='5' style={{ marginTop: 10, borderRadius: 20 }}>
            <rect width='100' height='5' fill='#ccc' rx='0' ry='0'></rect>
            <rect width={w} height='5' fill='#426381' rx='0' ry='0'></rect>
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
          {this.state.tasks.map(task => (
            <div style={{ marginBottom: 5 }}>
              <CheckBox
                label={task.description} key={task.id} checked={task.done} onClick={() => this.toggleTask(task.id, task.done)}/>
            </div>))}
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
  connectDragSource: PropTypes.func.isRequired,
  timeframe: PropTypes.number.isRequired,
};

const setDoneTaskMutation = gql`mutation setDoneTaskMutation($taskId: Int!, $done: Boolean!, $userId: Int!) {
  setDoneTask(taskId: $taskId, done: $done, userId: $userId) {
    ok
  }
}`;


const cardGraphql = graphql(setDoneTaskMutation, {
  name: 'setDoneTaskMutation',
})(Card);

export default DragSource('1', cardSource, collect)(cardGraphql);
