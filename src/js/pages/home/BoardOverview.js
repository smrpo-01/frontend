import React, { Component } from 'react';
import PropTypes from 'prop-types';

import EditIcon from 'grommet/components/icons/base/Edit';
import AnalyticsIcon from 'grommet/components/icons/base/Analytics';

import CopyIcon from 'grommet/components/icons/base/Copy';



class BoardOverview extends Component {
  constructor() {
    super();
    this.state = {
      opacity: 1,
      opacityAnalisys: 1,
      opacityCopy: 1,
    };
  }
  render() {
    return (
      <div style={{ backgroundColor: '#fbfff7', height: 200, width: 300, margin: 10, borderRadius: 10, borderColor: '#cbd0c4', borderStyle: 'solid', borderWidth: 1, cursor: 'pointer' }} onClick={() => this.props.changeBoard(this.props.board.id)} role='button' tabIndex='-1'>
        <div style={{ display: 'flex', margin: 20, justifyContent: 'space-between', flexDirection: 'row' }} >
          <h4>
            {this.props.board.name}
          </h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}>
            { this.props.canEdit &&
              <div
                style={{ cursor: 'pointer', opacity: this.state.opacityCopy, marginRight: 10 }}
                onClick={(e) => { e.stopPropagation(); }}
                onMouseEnter={() => this.setState({ opacityCopy: 0.5 })}
                onMouseLeave={() => this.setState({ opacityCopy: 1 })}
                role='button'
                tabIndex='0'
              >
                <CopyIcon onClick={() => this.props.copyBoard(this.props.board.id)} />
              </div>
              }
              { this.props.canEdit &&
              <div
                style={{ cursor: 'pointer', opacity: this.state.opacity }}
                onClick={(e) => { e.stopPropagation(); }}
                onMouseEnter={() => this.setState({ opacity: 0.5 })}
                onMouseLeave={() => this.setState({ opacity: 1 })}
                role='button'
                tabIndex='0'
              >
                <EditIcon onClick={() => this.props.editBoard(this.props.board.id)} />
              </div>
              }
              <div
                style={{ cursor: 'pointer', paddingLeft: 10, opacity: this.state.opacityAnalisys }}
                onClick={(e) => { e.stopPropagation(); }}
                onMouseEnter={() => this.setState({ opacityAnalisys: 0.5 })}
                onMouseLeave={() => this.setState({ opacityAnalisys: 1 })}
                role='button' tabIndex='0'
              >
                <AnalyticsIcon onClick={() => this.props.showAnalitycs(this.props.board.id, this.props.board.name)} />
              </div>
            </div>
        </div>
        <div>
          <ul>
            { this.props.board.projects.map(project => (<li key={project.id}>{project.name}</li>))}
          </ul>
        </div>
      </div>
    );
  }
}

BoardOverview.defaultProps = {
  canEdit: false,
};

BoardOverview.propTypes = {
  board: PropTypes.object.isRequired,
  editBoard: PropTypes.func.isRequired,
  canEdit: PropTypes.bool,
  changeBoard: PropTypes.func.isRequired,
};

export default BoardOverview;
