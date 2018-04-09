import React, { Component } from 'react';
import BoardCustom from './BoardCustom';
import Title from 'grommet/components/Title';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Column from './Column';
import ColumnReal from './ColumnReal';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Loading from '../../components/Loading';

const columns = [{
  name: 'Product backlog',
  columns: [
    {
    name: 'Product backlog',
    color: '#AA001E',
    columns: []
    }, {
    name: 'Product backlog',
    color: '#AA001E',
    columns: []
    },
  ]
  }, {
  name: 'Sprint backlog',
  color: '#00A0B0',
  columns: []
  }, {
  name: 'jajajaja backlog',
  color: '#AA001E',
  columns: []
}];

const projects =["1", "2", "3", "4"]


class Board extends Component {
  componentWillReceiveProps(nextProps) {
    console.log(nextProps)
    /*
    this.setState({
      board: JSON.parse(nextProps.data.getBoard),
    });
    */
  }
  render() {
    //if (!this.state) return <Loading />;
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Title style={{ marginLeft: 20, marginTop: 10, marginBottom: 15 }}>
            Ja
          </Title>
          <div style={{ marginRight: 30, display: 'flex' }}>

          </div>
        </div>
        <div style={{ backgroundColor: '#f5fbef', display: 'flex', minHeight: 800, position: 'relative' }}>
          {columns.map((column, i) =>
            <ColumnReal data={column} key={i} />
          )}
          { projects.map((proj, i) => (i !== 0 &&<div style={{ position: 'absolute', width: '100%', height: 1, backgroundColor: 'black', opacity: 0.3, top: `${i/projects.length*100}%` }} />) ) }
        </div>
      </div>
    );
  }
}

Board.defaultProps = {
};

Board.propTypes = {
};

const getBoardQuery = gql`query getBoard($id: Int!) {
  getBoard(id: $id)
}`;

/*
const boardGraphql = graphql(getBoardQuery, {
  options: (props) => ({ variables: { id: parseInt(props.board) }})
})(Board);

export default DragDropContext(HTML5Backend)(boardGraphql);
*/

export default DragDropContext(HTML5Backend)(Board)