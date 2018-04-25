import React, { Component } from 'react';
import ColumnEmpty from './ColumnEmpty';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

import SidebarColumn from './SidebarColumn';

import Title from 'grommet/components/Title';
import Anchor from 'grommet/components/Anchor';
import TextInput from 'grommet/components/TextInput';
import Button from 'grommet/components/Button';
import Select from 'grommet/components/Select';

import ErrorNotification from './ErrorNotification';

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
    };
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

  closeErr() {
    this.setState({
      showError: false,
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

  closer() {
    this.setState({
      addEditColumn: false,
    });
  }

  save() {
    const board = {
      boardName: this.state.boardName,
      projects: this.state.selectedProjects.map(pr => pr.id),
      columns: this.state.columns,
    };

    const user = sessionStorage.getItem('user');

    this.props.addBoardMutation({
      variables: {
        jsonString: JSON.stringify(board),
      },
      refetchQueries: [{
        query: getBoardsQuery,
        variables: { userId: parseInt(JSON.parse(user).id) }
      }]
    }).then((res) => {
      this.props.history.goBack();
    }).catch((err) => {
      this.setState({
        showError: true,
        error: err.message.split(':')[1],
      });
    });
  }

  cancel() {
    this.props.history.goBack();
  }

  render() {
    let options = [];
    if (this.props.data.allProjects) {
      options = this.props.data.allProjects.map(pr => ({ value: pr.name, id: pr.id }));
    }
    let legal = true;
    if (this.state.selectedProjects.length > 0) {
      const checker = this.state.selectedProjects[0].teamId;
      const teams = this.state.selectedProjects.filter(proj => proj.teamId !== checker);
      if (teams.length > 0) {
        legal = false;
      }
    }
    return (
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', marginLeft: 20, height: 80, justifyContent: 'space-between', alignItems: 'center' }}>
          { !this.state.editBoardName &&
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Title>
                {this.state.boardName}
              </Title>
              <EditIcon style={{ marginLeft: 10, cursor: 'pointer' }} onClick={() => this.setState({ editBoardName: true })} />
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
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: 20 }}>
            <p3 style={{ marginRight: 20, fontSize: 17 }}>
              Izbrani projekti:
            </p3>
            <Select placeHolder='None'
              options={options}
              multiple={true}
              onChange={change => this.setState({ selectedProjects: change.value })}
              value={this.state.selectedProjects}
            />
            <p style={{ opacity: legal ? 0 : 1, color: 'red', marginLeft: 20 }}>
              Pozor izbranih je vec projektov!
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
        <div style={{ display: 'flex', flexDirection: 'row', minHeight: 1200, position: 'relative' }}>
          <div style={{ height: 'inherit', minWidth: 20, justifyContent: 'space-around', display: 'flex', alignItems: 'center', borderWidth: 1, borderColor: '#d6d6d6', borderStyle: 'solid', flexDirection: 'column' }}>
            {this.state.selectedProjects.map(pr =>
              (<h key={pr.id} style={{ writingMode: 'tb-rl', transform: 'rotate(180deg)' }}>
                {pr.value}
              </h>)
            )}
          </div>
          { this.state.selectedProjects.map((pr, i) => (i !== 0 && <div key={pr.id} style={{ position: 'absolute', width: '100%', height: 1, backgroundColor: 'black', opacity: 0.3, top: `${(i / this.state.selectedProjects.length) * 100}%` }} />)) }
          <div style={{ backgroundColor: '#f5fbef', minHeight: 800, minWidth: '99%', width: 'auto', display: 'inline-flex' }}>
            { !this.state.columns.length !== 0 && this.state.columns.map((column, i) =>
              <ColumnEmpty data={column} addEditColumn={this.addEditColumn} key={column.id} />
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

BoardNew.propTypes = {
  data: PropTypes.shape({
    allProjects: PropTypes.array,
    allBoards: PropTypes.array,
    refetch: PropTypes.func.isRequired,
    id: PropTypes.string,
    name: PropTypes.string,
    columns: PropTypes.array,
    wip: PropTypes.string,
    boundary: PropTypes.bool,
    priority: PropTypes.bool,
    acceptance: PropTypes.bool,
  }),
  history: PropTypes.func,
};


BoardNew.defaultProps = {
  data: null,
};

const allProjectsQuery = gql`
  query allProjectsQuery($filtered: Int!, $userId: Int!) {
    allProjects(filtered: $filtered, userId: $userId) {
      id
      name
    }
  }
`;

const addBoardMutation = gql`
  mutation createBoard($jsonString: String!) {
    createBoard(jsonString: $jsonString) {
      board
    }
  }
`;

export default compose(graphql(allProjectsQuery, {
  options: props => {
    const user = sessionStorage.getItem('user');
    return ({ variables: { userId: parseInt(JSON.parse(user).id, 10), filtered: 1, boardId: -1 } });
  }
}), graphql(addBoardMutation, {
  name: 'addBoardMutation'
}))(BoardNew);
