import React, { Component } from 'react';
import ColumnEmpty from './ColumnEmpty';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';


import SidebarColumn from './SidebarColumn';
import ErrorNotification from './ErrorNotification';

import Title from 'grommet/components/Title';
import Anchor from 'grommet/components/Anchor';
import TextInput from 'grommet/components/TextInput';
import Button from 'grommet/components/Button';
import Select from 'grommet/components/Select';

import AddIcon from 'grommet/components/icons/base/Add';
import EditIcon from 'grommet/components/icons/base/Edit';
import CheckmarkIcon from 'grommet/components/icons/base/Checkmark';

import CloseIcon from 'grommet/components/icons/base/Close';

import { getBoardsQuery } from './../home/Home';

class BoardNew extends Component {
  constructor() {
    super();
    this.addEditColumn = this.addEditColumn.bind(this);
    this.closer = this.closer.bind(this);
    this.updateBoardName = this.updateBoardName.bind(this);
    this.completeAddEditColumn = this.completeAddEditColumn.bind(this);
    this.save = this.save.bind(this);
    this.cancel = this.cancel.bind(this);
    this.setColumns = this.setColumns.bind(this);
    this.closeErr = this.closeErr.bind(this);
    this.changeProjectsAndCheck = this.changeProjectsAndCheck.bind(this);

    this.state = {
      boardName: 'Tabla',
      disableAddFirstColumn: false,
      addEditColumn: false,
      columns: [],
      modeEdit: true,
      editBoardName: false,
      sourceColumnInfo: null,
      columnData: {},
      selectedProjects: [],
      showError: false,
      legalProjects: true,
    };
  }

  componentWillMount() {
    this.props.data.refetch();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.allBoards && nextProps.data.allBoards.length > 0) {
      const board = nextProps.data.allBoards[0];
      const projects = board.projects;
      const { columns } = JSON.parse(board.columns);
      console.log(projects)
      const selectedProjects = projects.map(pr => ({ value: pr.name, id: pr.id, teamId: pr.team.id }));
      this.setState({
        id: board.id,
        boardName: board.name,
        columns,
        selectedProjects
      });
    }
  }

  setColumns(data, columns) {
    const toReturnColumns = [];
    columns.forEach((col) => {
      let deleteColumn = false;
      if (col.id === this.state.columnData.id) {
        if (this.state.direction === 'down') {
          col.columns = [data];
        } else if (this.state.direction === 'left') {
          toReturnColumns.push(data);
        } else if (this.state.direction === 'right') {
          toReturnColumns.push(col);
          col = data;
        } else if (data === null) {
          deleteColumn = true;
        } else {
          // Edit
          col = data;
        }
      } else if (col.columns.length > 0) {
        col.columns = this.setColumns(data, col.columns);
      }
      if (!deleteColumn) toReturnColumns.push(col);
    });
    return toReturnColumns;
  }

  addEditColumn(data, direction) {
    if (this.state.columns.length === 0) {
      this.setState({
        addEditColumn: true,
        modeEdit: false,
        direction: 'down',
      });
    } else if (direction === 'edit') {
      this.setState({
        addEditColumn: true,
        modeEdit: true,
        columnData: data,
        direction,
      });
    } else {
      this.setState({
        addEditColumn: true,
        modeEdit: false,
        columnData: data,
        direction,
      });
    }
  }

  updateBoardName() {
    this.setState({
      editBoardName: false,
    });
  }


  completeAddEditColumn(data) {
    let columns = this.setColumns(data, this.state.columns);
    if (columns.length === 0 && data) {
      columns = [data];
    }
    this.setState({
      addEditColumn: false,
      columns
    });
  }

  closeErr() {
    this.setState({
      showError: false,
    });
  }

  closer() {
    this.setState({
      addEditColumn: false,
    });
  }

  save() {
    const board = {
      id: this.state.id,
      boardName: this.state.boardName,
      projects: this.state.selectedProjects.map(pr => pr.id),
      columns: this.state.columns,
    };
    this.props.editBoardMutation({
      variables: {
        jsonString: JSON.stringify(board),
      },
      //refetchQueries: [{ query: getBoardsQuery }]
    }).then(res => {
      this.props.history.goBack();
    }).catch(err => {
      this.setState({
        showError: true,
        error: err.message.split(':')[1],
      });
    });
  }

  cancel() {
    this.props.history.goBack();
  }

  changeProjectsAndCheck(event) {
    this.setState({ boardName: event.target.value })
  }

  render() {
    let options = [];
    if (this.props.data.allProjects) {
      options = this.props.data.allProjects.map(pr => ({ value: pr.name, id: pr.id, teamId: pr.team.id}));
    }
    let legal = true;
    if (this.state.selectedProjects.length > 0) { 
      const checker = this.state.selectedProjects[0].teamId
      const teams = this.state.selectedProjects.filter(proj => proj.teamId !== checker);
      if(teams.length > 0) {
        legal = false;
      }
    }
    return (
      <div>
        <div style={{ display: 'flex', marginLeft: 20, height: 80, justifyContent: 'space-between', alignItems: 'center' }}>
          { !this.state.editBoardName &&
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Title>
                {this.state.boardName}
              </Title>
              <EditIcon style={{marginLeft: 10, cursor: 'pointer' }} onClick={() => this.setState({ editBoardName: true })} />
            </div>
          }
          { this.state.editBoardName &&
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <TextInput
                id='boardName'
                value={this.state.boardName}
                placeHolder={this.state.boardName}
                onDOMChange={event => this.setState({ boardName: event.target.value })}
              />
              <CheckmarkIcon size='small' style={{ marginLeft: 20, cursor: 'pointer' }} onClick={() => this.updateBoardName()} />
            </div>
          }
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <p3 style={{ marginRight: 20, fontSize: 17 }}>
              Izbrani projekti:
            </p3>
            <Select placeHolder='None'
              options={options}
              multiple={true}
              onChange={(change) => this.setState({ selectedProjects: change.value})}
              value={this.state.selectedProjects} />
            <p style={{ opacity: legal ? 0 : 1, color: 'red', marginLeft: 20 }}>
              Pozor na projektu so različne ekipe!
            </p>
          </div>
          <div>
            <Button icon={<CheckmarkIcon />}
              style={{ marginRight: 30 }}
              label='Shrani'
              primary={true}
              onClick={() => this.save()} />
            <Button icon={<CloseIcon />}
              style={{ marginRight: 10 }}
              label='Prekliči'
              secondary={true}
              onClick={() => this.cancel()} />
          </div>
        </div>
        <div style={{display: 'flex', flexDirection: 'row', minHeight: 1200, position: 'relative' }}>
          <div style={{ height: 'inherit', minWidth: 20, justifyContent: 'space-around', display: 'flex', alignItems: 'center', borderWidth: 1, borderColor: '#d6d6d6', borderStyle: 'solid', flexDirection: 'column' }}>
            {this.state.selectedProjects.map(pr => <h key={pr.id} style={{ writingMode: 'tb-rl', transform: 'rotate(180deg)' }}>
              {pr.value}
            </h>)}
          </div>
          { this.state.selectedProjects.map((pr, i) => (i !== 0 && <div key={pr.id} style={{ position: 'absolute', width: '100%', height: 1, backgroundColor: 'black', opacity: 0.3, top: `${i/this.state.selectedProjects.length * 100}%` }} /> ))}
          <div style={{ backgroundColor: '#f5fbef', minHeight: 800, minWidth: '100%', width: 'auto', display: 'inline-flex' }}>
            { !this.state.columns.length !== 0 && this.state.columns.map((column, i) =>
              <ColumnEmpty data={column} addEditColumn={this.addEditColumn} key={i} />
            )}
            { this.state.columns.length === 0 &&
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 200 }}>
              <Anchor icon={<AddIcon />}
                label='Dodaj prvi stolpec'
                disabled={this.state.disableAddFirstColumn}
                onClick={() => this.addEditColumn()} />
            </div>
            }
            { this.state.addEditColumn &&
              <SidebarColumn modeEdit={this.state.modeEdit} closer={this.closer} completeAddEditColumn={this.completeAddEditColumn} columnData={this.state.columnData} />
            }
          </div>
        </div>
        { this.state.showError && <ErrorNotification error={this.state.error} closer={this.closeErr} /> }
      </div>
    );
  }
}

BoardNew.defaultProps = {
};

BoardNew.propTypes = {
};

const editBoardMutation = gql`
  mutation editBoard($jsonString: String!) {
    editBoard(jsonString: $jsonString) {
      board
    }
  }
`;

const allBoards = gql`
  query allBoards($id: Int!, $filtered: Int!, $userId: Int!) {
    allBoards(id: $id) {
      id
      name
      columns
      projects {
        id
        name
        team {
          id
        }
      }
    }
    allProjects(filtered: $filtered, userId: $userId, boardId: $id) {
      id
      name
      team {
        id
      }
    }
  }
`;

export default compose(
  graphql(allBoards, {
    options: (props) => {
      const user = sessionStorage.getItem('user');
      return ({ variables: { id: parseInt(props.boardId), userId: parseInt(JSON.parse(user).id), filtered: 1 }});
    }
  }),
  graphql(editBoardMutation, {
    name: 'editBoardMutation'
  })
)(BoardNew);
