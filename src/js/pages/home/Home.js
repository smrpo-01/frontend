import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
// Template
import PageTemplate from '../../templates/PageTemplate';

// Grommet components
import Title from 'grommet/components/Title';
import BoardOverview from './BoardOverview';
import BoardAdd from './BoardAdd';

import Loading from '../../components/Loading';

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
    // eslint-disable-next-line
    const user = sessionStorage.getItem('user');
    const userRoles = JSON.parse(user).roles;
    // this.props.data.refetch()
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

  /*
  componentWillReceiveProps(nextProps) {
    console.log('next props', nextProps);
    let boards = nextProps.data.getUserBoards.map(board => {
      return ({ ...board });
    });
    this.setState({
      boards
    });
  }
  */

  render() {
    const { data: { loading, error, getUserBoards } } = this.props;

    if (loading) {
      return <Loading />;
    } else if (error) {
      return <p style={{ color: 'red' }}>Error!</p>;
    } else if (getUserBoards === undefined) {
      console.log('No data from getUserBoards received.');
      return null;
    }


    return (
      <PageTemplate
        header={<Title>Moje table</Title>}
      >
        <div style={{ display: 'flex', marginTop: 20, flexWrap: 'wrap', alignContent: 'flex-start' }}>
          {getUserBoards.map(board => (
            <BoardOverview
              key={board.id}
              board={board}
              changeBoard={this.changeAndSetBoard}
              editBoard={this.changeAndSetBoardEdit}
              push={this.props.history.push}
              canEdit={this.state.userRoles.includes('km')}
            />)
          )}
          {this.state.userRoles.includes('km') && <BoardAdd push={this.props.history.push} />}
        </div>
      </PageTemplate>
    );
  }
}

Home.defaultProps = {
};

Home.propTypes = {
};

export const getBoardsQuery = gql`query getUserBoards($userId: Int!){
  getUserBoards(userId: $userId) {
    id
    name
    projects {
      id
      name
    }
  }
}`;

export default graphql(getBoardsQuery, {
  options: (props) => {
    const user = sessionStorage.getItem('user');
    return ({variables: { userId: parseInt(JSON.parse(user).id) }});
  }
})(Home);
