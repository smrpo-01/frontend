import React, { Component } from 'react';
import Title from 'grommet/components/Title';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Column from './Column';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Image from 'grommet/components/Image';
import PropTypes from 'prop-types';

const colors = ['#a4b3a2', '#c87d5d', '#008080'];

const imgUri = process.env.NODE_ENV === 'development' ? '/' : '/static/app/';

const width = 250;

class Board extends Component {
  constructor() {
    super();
    this.renderNames = this.renderNames.bind(this);
    this.renderColumns = this.renderColumns.bind(this);
    this.renderProjects = this.renderProjects.bind(this);

    this.state = {
      name: '',
      projects: [],
      columns: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.allBoards && nextProps.data.allCards) {
      const board = nextProps.data.allBoards[0];
      const { name, projects } = board;
      const { columns } = JSON.parse(board.columns);

      const cards = nextProps.data.allCards;

      this.setState({
        name,
        projects,
        columns,
        cards,
      });
    }
  }

  renderNames(column, color) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: '#cbd0c4', minWidth: width, flexDirection: 'column', alignItems: 'center', height: '100%', borderColor: 'white', borderStyle: 'solid', borderTopWidth: 2, borderRightWidth: 2, borderLeftWidth: 2, borderBottomWidth: 0 }} key={column.id}>
        <h style={{ fontSize: 16, width: '100%', display: 'flex', justifyContent: 'center', minHeight: 25, position: 'relative' }}>
          {column.name}
          <div style={{ right: 5, top: 0, position: 'absolute' }}>
            { column.boundary && <Image
              style={{ height: 18, width: 18, opacity: 0.3, margin: 2 }}
              src={imgUri + 'img/fence.png'}
              size='small' /> }
            { column.priority && <Image
              style={{ height: 18, width: 18, opacity: 0.3, margin: 2 }}
              src={imgUri + 'img/volume-level.png'}
              size='small' /> }
            { column.acceptance && <Image
              style={{ height: 18, width: 18, opacity: 0.3, margin: 2 }}
              src={imgUri + 'img/verification-mark.png'}
              size='small' /> }
          </div>
          { column.columns.length === 0 &&
            <div style={{ left: 5, top: 0, position: 'absolute', opacity: 0.5 }}>
              {column.wip}
            </div>
          }
        </h>


        { column.columns.length > 0 &&
          <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', height: '100%' }}>
            {column.columns.map(col => this.renderNames(col, color))}
          </div>
        }
      </div>
    );
  }

  renderProjects(project) {
    return (
      <div style={{ display: 'flex', flexGrow: 1, flexDirection: 'column' }}>
        <div style={{ display: 'flex', minHeight: 600 }} key={project}>
          <div style={{ width: 15, display: 'flex', justifyContent: 'center', alignItems: 'center', borderBottomWidth: 2, borderRightWidth: 0, borderLeftWidth: 0, borderTopWidth: 0, borderStyle: 'solid', borderColor: 'white', backgroundColor: '#f5fbef' }}>
            <h style={{ writingMode: 'tb-rl', transform: 'rotate(180deg)', }}>
              {project.name}
            </h>
          </div>
          {this.state.columns.map(col => this.renderColumns(col, project))}
        </div>
        <div style={{ width: '100%', height: 1, backgroundColor: 'black', opacity: 0.2 }} />
      </div>
    );
  }

  renderColumns(column, project) {
    const cards = this.state.cards.filter(card =>
      card.project.id === project.id && column.id === card.column.id
    );

    if (column.columns.length === 0) {
      return (<Column data={column} project={project} key={`${column.id}${project.id}`} cards={cards} />);
    }
    return (
      <div style={{ display: 'flex', borderRightWidth: 2, borderLeftWidth: 2, borderTopWidth: 2, borderBottomWidth: 0, borderStyle: 'solid', borderColor: 'white', }}>
        {column.columns.map(col => this.renderColumns(col, project))}
      </div>
    );
  }

  render() {
    return (
      <div>
        <div style={{ display: 'inline-block', minWidth: '100%' }}>
          <div style={{ display: 'flex', minWidth: '100%', marginTop: 10, marginBottom: 15, alignItems: 'center' }}>
            <Title style={{ marginLeft: 20, flexGrow: 1 }}>
              {this.state.name}
            </Title>
            <div style={{ flexGrow: 3, display: 'flex' }}>
              <Title style={{ fontSize: 20 }}>
                Projekti:
              </Title>
              { this.state.projects.map(pr => (
                <h style={{ backgroundColor: '#e1e1e0', borderRadius: 5, marginRight: 10, padding: 5 }}>
                  {pr.name}
                </h>
              )
              )}
            </div>
          </div>
          <div style={{ display: 'flex', minWidth: '98%' }}>
            <div style={{ backgroundColor: 'white', width: 15, maxHeight: '100%' }} />
            <div style={{ display: 'flex' }}>
              {this.state.columns.map((col, i) => this.renderNames(col, colors[i]))}
            </div>
          </div>
          <div style={{ display: 'flex', minWidth: '100%', flexDirection: 'column', minHeight: 600, }}>
            {this.state.projects.length === 0 && this.renderProjects({
              id: '',
            })}
            {this.state.projects.map(proj => this.renderProjects(proj))}
          </div>
        </div>
      </div>
    );
  }
}

Board.defaultProps = {
};

Board.propTypes = {
  data: PropTypes.object.isRequired,
};

const getBoardQuery = gql`query allBoards($id: Int!) {
  allBoards(id: $id) {
    id
    name
    columns
    projects {
      id
      name
    }
  }
  
  allCards(boardId: $id) {
    id
    column {
      id
    }
    type {
      id
    }
    description
    name
    estimate
    project {
      id
    }
    expiration
    owner {
      member {
        firstName
        lastName
      }
    }
    tasks {
      id
      description
      done
    }
  }
}`;


const boardGraphql = graphql(getBoardQuery, {
  options: props => ({ variables: { id: parseInt(props.board, 10) } })
})(Board);

export default DragDropContext(HTML5Backend)(boardGraphql);
