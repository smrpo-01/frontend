import React, { Component } from 'react';
import Title from 'grommet/components/Title';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import Column from './Column';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Image from 'grommet/components/Image';
import PropTypes from 'prop-types';
import AddChapterIcon from 'grommet/components/icons/base/AddChapter';
import Button from 'grommet/components/Button';
import SidebarCard from './SidebarCard';
import uuid from 'uuid/v4';
import ErrorNotificationCard from './ErrorNotificationCard';
import SideBarCardMore from './SidebarCardMore';
import ErrorNotificationToggle from './ErrorNotificationToggle';
import UserSettingsIcon from 'grommet/components/icons/base/UserSettings';
import ExpandIcon from 'grommet/components/icons/base/Expand';

import BoardSettings from './BoardSettings';

import { getCardLogsQuery, getCardQuery } from './SidebarCardMore';
import { whoCanEditQuery } from './SidebarCard';


const colors = ['#a4b3a2', '#c87d5d', '#008080'];

const imgUri = process.env.NODE_ENV === 'development' ? '/' : '/static/app/';

const width = 250;

class Board extends Component {
  constructor() {
    super();
    this.renderNames = this.renderNames.bind(this);
    this.renderColumns = this.renderColumns.bind(this);
    this.renderProjects = this.renderProjects.bind(this);
    this.moveCard = this.moveCard.bind(this);
    this.showMore = this.showMore.bind(this);
    this.editCard = this.editCard.bind(this);
    this.showError = this.showError.bind(this);
    this.toggleHidden = this.toggleHidden.bind(this);
    this.recursiveHidden = this.recursiveHidden.bind(this);
    this.checkIfHaveCards = this.checkIfHaveCards.bind(this);

    this.state = {
      daysToExpire: 0,
      name: '',
      projects: [],
      columns: [],
      dialogError: false,
      dialogErrorMessage: '',
      toggleSidebard: false,
      showMore: false,
      timeframe: 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.allBoardsQuery.allBoards && nextProps.allCardsQuery.allCards) {
      const board = nextProps.allBoardsQuery.allBoards[0];
      const { name, projects, daysToExpire } = board;
      let { columns } = JSON.parse(board.columns);

      const cards = nextProps.allCardsQuery.allCards;


      if(this.state.columns.length !== 0) {
        columns = this.state.columns;
      }

      this.setState({
        daysToExpire,
        name,
        projects,
        columns,
        cards,
      });
    }
  }

  checkIfHaveCards(column) {
    console.log(column)
    const cards = this.state.cards.filter(card => column.id === card.column.id);
    if(cards.length !== 0) {
      return true;
    }
    let umesni = false;
    for (i in column.columns) {
      umesni = this.checkIfHaveCards(column.columns[i]);
      if(umesni) {
        return true;
      }
    }

    return false;
  }

  recursiveHidden(columns, columnId) {
    return columns.map(column => {
      if(column.id === columnId) {
        if(!this.checkIfHaveCards(column)) {
          column.hidden = column.hidden !== undefined ? !column.hidden : true;
        }
      }
      column.columns = this.recursiveHidden(column.columns, columnId);
      return column;
    })
  }

  toggleHidden(columnId) {
    const columns = this.state.columns;
    const newColumns = this.recursiveHidden(columns, columnId);
    this.setState({
      columns: newColumns,
    })
  }

  componentWillMount() {
    this.props.allBoardsQuery.refetch();
    this.props.allCardsQuery.refetch();
  }

  renderNames(column, color) {

    if(column.hidden) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: '#cbd0c4', width: 50, flexDirection: 'column', alignItems: 'center', height: '100%', borderColor: 'white', borderStyle: 'solid', borderTopWidth: 2, borderRightWidth: 2, borderLeftWidth: 2, borderBottomWidth: 0, cursor: 'pointer' }} key={uuid()} onClick={() => this.toggleHidden(column.id)}>
          <ExpandIcon style={{ height: 20, width: 20 }}/>
        </div>
      )
    }

    return (
      <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: '#cbd0c4', minWidth: width, flexDirection: 'column', alignItems: 'center', height: '100%', borderColor: 'white', borderStyle: 'solid', borderTopWidth: 2, borderRightWidth: 2, borderLeftWidth: 2, borderBottomWidth: 0 }} key={uuid()}>
        <h style={{ fontSize: 16, width: '100%', display: 'flex', justifyContent: 'center', minHeight: 25, position: 'relative', cursor: 'pointer' }} onClick={() => this.toggleHidden(column.id)}>
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

  renderProjects(project, oneProject) {
    return (
      <div style={{ display: 'flex', flexGrow: 1, flexDirection: 'column' }} key={uuid()}>
        <div style={{ display: 'flex', minHeight: oneProject ? 800 : 500 }} >
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

  moveCard(column, card, force = '') {
    const user = sessionStorage.getItem('user');
    const userId = JSON.parse(user).id;

    const cards = this.state.cards.map(c => {
      if (card.id === c.id) {
        c = {
          ...card,
          column: {
            id: column.id,
          }
        };
      }

      return c;
    });

    this.setState({
      cards,
      dialogError: false,
      previousCards: this.state.cards,
    });
    this.props.moveCardMutation({
      variables: {
        cardId: parseInt(card.id, 10),
        toColumnId: column.id,
        force,
        userId,
      },
      refetchQueries: [{
        query: getCardQuery,
        variables: {
          cardId: parseInt(card.id, 10)
        }
      }
      ]
    }).then(res => {

    }).catch(err => {
      if (err.message.split(':')[1] !== ' Ne moreš premikati za več kot ena v levo/desno.') {
        this.setState({
          dialogError: true,
          dialogErrorMessage: err.message.split(':')[1],
          moveCard: card,
          moveColumn: column,
        });
      } else {
        this.setState({
          cards: this.state.previousCards,
          dialogError: true,
          dialogErrorMessage: err.message.split(':')[1],
        });
      }
    });
  }

  showError(err) {
    this.setState({
      dialogErrorToggle: true,
      dialogErrorMessage: err,
    });
  }

  showMore(card) {
    this.setState({
      showMore: true,
      showMoreCard: card.id,
      editCard: card,
    });
  }

  renderColumns(column, project) {
    const cards = this.state.cards.filter(card =>
      card.project.id === project.id && column.id === card.column.id
    );

    if(column.hidden) {
      return (
        <div style={{ width: 50, borderRightWidth: 2, borderLeftWidth: 2, borderTopWidth: 2, borderStyle: 'solid', borderColor: 'white', display: 'flex', alignItems: 'center', flexDirection: 'column', backgroundColor: '#cbd0c4' }}>
        <h style={{ writingMode: 'tb-rl', transform: 'rotate(180deg)', marginTop: 60, marginBottom: 5,}}>
          {column.name}
        </h>
        </div>
        )
    }

    if (column.columns.length === 0) {
      return (<Column timeframe={this.state.timeframe} data={column} project={project} key={`${column.id}${project.id}`} cards={cards} showError={this.showError} moveCard={this.moveCard} showMore={this.showMore} boardId={parseInt(this.props.board, 10)}/>);
    }
    return (
      <div style={{ display: 'flex', borderRightWidth: 2, borderLeftWidth: 2, borderTopWidth: 2, borderBottomWidth: 0, borderStyle: 'solid', borderColor: 'white', }} key={uuid()}>
        {column.columns.map(col => this.renderColumns(col, project))}
      </div>
    );
  }

  editCard(card) {
    this.setState({
      showMore: false,
      toggleSidebard: true,
      modeEdit: true,
      editCard: card,
    });
  }

  render() {
    const user = sessionStorage.getItem('user');
    const userId = JSON.parse(user).id;

    let canCreateCard = false;
    this.state.projects.forEach(pr => {
      if (pr.team.kanbanMaster.idUser === userId) canCreateCard = true;

      if (pr.team.productOwner.idUser === userId) canCreateCard = true;
    });

    return (
      <div>
        <div style={{ display: 'inline-block', minWidth: '100%', }}>
          <div style={{ display: 'flex', minWidth: '100%', marginTop: 10, marginBottom: 15, alignItems: 'center' }}>
            <Title style={{ marginLeft: 20 }}>
              {this.state.name}
            </Title>
            <div style={{ marginLeft: 100, display: 'flex' }}>
              <Title style={{ fontSize: 20 }}>
                Projekti:
              </Title>
              { this.state.projects.map(pr => (
                <h style={{ backgroundColor: '#e1e1e0', borderRadius: 5, marginRight: 10, padding: 5 }} key={pr.id}>
                  {pr.name}
                </h>
              )
              )}
            </div>
            { canCreateCard &&
              <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
                <Button icon={<AddChapterIcon />}
                  style={{ marginRight: 30 }}
                  label='Dodaj kartico'
                  primary={false}
                  onClick={() => this.setState({ toggleSidebard: true, modeEdit: false })} />
              </div>
            }
            <Button
              icon={<UserSettingsIcon />}
              primary={false}
              onClick={() => this.setState({ showSettings: true })}
            />
          </div>
          <div style={{ display: 'flex', minWidth: '98%' }}>
            <div style={{ backgroundColor: 'white', width: 15, maxHeight: '100%' }} />
            <div style={{ display: 'flex' }}>
              {this.state.columns.map((col, i) => this.renderNames(col, colors[i]))}
            </div>
          </div>
          <div style={{ display: 'flex', minWidth: '100%', flexDirection: 'column', minHeight: 700 }}>
            {this.state.projects.length === 0 && this.renderProjects({
              id: uuid(),
            }, true)}
            {this.state.projects.map(proj => this.renderProjects(proj, this.state.projects.length === 1))}
          </div>
        </div>
        { this.state.toggleSidebard &&
          <SidebarCard
            closer={() => this.setState({ toggleSidebard: false })}
            columns={this.state.columns}
            boardId={parseInt(this.props.board, 10)}
            modeEdit={this.state.modeEdit}
            cardId={(this.state.editCard && this.state.editCard.id) || null}
            data={{
              projects: this.state.projects,
            }}/>
        }
        { this.state.showMore &&
          <SideBarCardMore
            closer={() => this.setState({ showMore: false })}
            editCard={this.editCard}
            boardId={parseInt(this.props.board, 10)}
            showError={this.showError}
            cardId={this.state.showMoreCard} />
        }
        { this.state.dialogError &&
          <ErrorNotificationCard error={this.state.dialogErrorMessage} closer={() => this.setState({ dialogError: false, cards: this.state.previousCards })} continue={(force) => this.moveCard(this.state.moveColumn, this.state.moveCard, force)} />
        }
        { this.state.dialogErrorToggle &&
          <ErrorNotificationToggle error={this.state.dialogErrorMessage} closer={() => this.setState({ dialogErrorToggle: false })}  />
        }
        { this.state.showSettings &&
          <BoardSettings
            timeframe={this.state.timeframe}
            daysToExpire={this.state.daysToExpire}
            boardId={parseInt(this.props.board, 10)}
            updateDaysToExpire={val => this.setState({ daysToExpire: parseInt(val, 10) })}
            updateTimeframe={val => this.setState({ timeframe: parseInt(val, 10) })}
            closer={() => this.setState({ showSettings: false })}
          />
        }
      </div>
    );
  }
}

Board.defaultProps = {
};

Board.propTypes = {
};

export const getBoardQuery = gql`query allBoards($id: Int!) {
  allBoards(id: $id) {
    id
    name
    columns
    daysToExpire
    projects {
      id
      name
      team {
        id
        developers {
          idUser
          idUserTeam
          firstName
          lastName
        }
        kanbanMaster {
          idUser
        }
        productOwner {
          idUser
        }
      }
    }
  }
}`;

export const allCardsQuery = gql`query allCards($id: Int!) {
  allCards(boardId: $id) {
    id
    isDone
    cardNumber
    colorRejected
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
      name
      team {
        id
        members {
          id
          firstName
          lastName
        }
        developers {
          idUser
          isActive
        }
        kanbanMaster {
          idUser
          isActive
        }
        productOwner {
          idUser
          isActive
        }
      }
    }
    expiration
    owner {
      id
      member {
        id
        firstName
        lastName
      }
    }
    tasks {
      id
      description
      done
      assignee {
        id
        member {
          id
          firstName
          lastName
        }
      }
    }
  }
}`;


const moveCardMutation = gql`mutation moveCard($cardId: Int!, $toColumnId: String!, $force: String!, $userId: Int!) {
  moveCard(cardId: $cardId, toColumnId: $toColumnId, force: $force, userId: $userId) {
    ok
  }
}`;

const boardGraphql = compose(
  graphql(getBoardQuery, {
    name: 'allBoardsQuery',
    options: props => {
      return ({ variables: { id: parseInt(props.board, 10) } });
    }
  }),
  graphql(allCardsQuery, {
    name: 'allCardsQuery',
    options: props => ({ variables: { id: parseInt(props.board, 10) } })
  }),
  graphql(moveCardMutation, {
    name: 'moveCardMutation'
  })
)(Board);

export default DragDropContext(HTML5Backend)(boardGraphql);
