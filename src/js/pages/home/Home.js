import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
// Template
import PageTemplate from '../../templates/PageTemplate';

// Grommet components
import Title from 'grommet/components/Title';
import BoardOverview from './BoardOverview';
import BoardAdd from './BoardAdd';

class Home extends Component {
  constructor() {
    super();
    this.changeAndSetBoard = this.changeAndSetBoard.bind(this);
    this.changeAndSetBoardEdit = this.changeAndSetBoardEdit.bind(this);
    this.state = {
      boards: [],
      userRoles: [],
    };
  }

  componentWillMount() {
    const user = sessionStorage.getItem('user');
    const userRoles = JSON.parse(user).roles;
    this.setState({ userRoles });
  }

  changeAndSetBoard(boardId) {
    this.props.changeBoard(boardId);
    this.props.history.push('./../board')
  }

  changeAndSetBoardEdit(boardId) {
    this.props.changeBoard(boardId);
    this.props.history.push('./../board/edit');
  }

  componentWillReceiveProps(nextProps) {
    let boards = nextProps.data.allBoards.map(board => {
      return ({ ...board });
    });
    this.setState({
      boards
    });
  }

  render() {
    console.log(this.state.boards)
    return (
      <PageTemplate
        header={<Title>Domov</Title>}
      >
        <div>
          <Title>
            Moje table
          </Title>
        </div>
        <div style={{ display: 'flex', marginTop: 20, flexWrap: 'wrap', alignContent: 'flex-start' }}>
          {
            this.state.boards.map(board => <BoardOverview board={board} key={board.id} changeBoard={this.changeAndSetBoard} editBoard={this.changeAndSetBoardEdit} push={this.props.history.push} canEdit={this.state.userRoles.includes('km')} />)
          }
          { this.state.userRoles.includes('km') &&
            <BoardAdd push={this.props.history.push} />
          }
        </div>
      </PageTemplate>
    );
  }
}

Home.defaultProps = {
};

Home.propTypes = {
};

export const getBoardsQuery = gql`query {
  allBoards {
    id
    name
    projectSet {
      id
      name
    }
  }
}`;

export default graphql(getBoardsQuery)(Home);
