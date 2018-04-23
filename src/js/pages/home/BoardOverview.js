import React, { Component } from 'react';
import EditIcon from 'grommet/components/icons/base/Edit';

class BoardOverview extends Component {
  constructor() {
    super();
    this.state = {
      opacity: 1
    };
  }
  render() {
    return (
      <div style={{ backgroundColor: '#fbfff7', height: 200, width: 300, margin: 10, borderRadius: 10, borderColor: '#cbd0c4', borderStyle: 'solid', borderWidth: 1, cursor: 'pointer' }} onClick={() => this.props.changeBoard(this.props.board.id)} >
        <div style={{ display: 'flex', margin: 20, justifyContent: 'space-between', flexDirection: 'row' }} >
          <h4>
            {this.props.board.name}
          </h4>
          { this.props.canEdit &&
            <div style={{ cursor: 'pointer', opacity: this.state.opacity }} onClick={(e) => { e.stopPropagation(); }} onMouseEnter={() => this.setState({ opacity: 0.5 })} onMouseLeave={() => this.setState({ opacity: 1 })}>
              <EditIcon onClick={() => this.props.editBoard(this.props.board.id)} />
            </div>
          }
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
};

BoardOverview.propTypes = {
};

export default BoardOverview;
