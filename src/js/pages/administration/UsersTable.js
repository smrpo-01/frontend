import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

// Grommet components
import Button from 'grommet/components/Button';
import Table from 'grommet/components/Table';
import TableRow from 'grommet/components/TableRow';
import TableHeader from 'grommet/components/TableHeader';

// Icons
import EditIcon from 'grommet/components/icons/base/Edit';
import TrashIcon from 'grommet/components/icons/base/Trash';

// Custom
import Loading from '../../components/Loading';
import AddEditNewUser from './AddEditNewUser';

class UsersTable extends Component {
  constructor() {
    super();
    this.handleSort = this.handleSort.bind(this);
    this.closeLayer = this.closeLayer.bind(this);

    this.state = {
      columnIndexToSort: 0,
      sortAscending: true,
      showAddNewUser: false,
      showEditOverlay: false
    };
  }

  onEdit(userData) {
    // open edit dialog
    // post new data to server
    // update state with edited data
    // console.log(userData);
    this.setState({ showEditOverlay: true });
    let roles = Object.keys(userData.roles)
      .map((key) => {
        switch (userData.roles[key].name) {
          case 'Administrator':
            return 'admin';
          case 'KanbanMaster':
            return 'kanban';
          case 'Product Owner':
            return 'po';
          case 'Razvijalec':
            return 'dev';
          default:
            return null;
        }
      });

    let editData = Object.assign({}, userData);
    editData.roles = roles;

    console.log('edit data', editData);
    ReactDOM.render(
      <AddEditNewUser
        closer={this.closeLayer}
        modeEdit={true}
        editData={editData}
      />, document.getElementById('overlay'));
  }

  onRemove(userId) {
    // open confirm dialog
    console.log(userId);
  }

  closeLayer() {
    ReactDOM.unmountComponentAtNode(document.getElementById('overlay'));
  }

  handleSort(index, ascending) {
    if (index < 4) this.setState({ columnIndexToSort: index, sortAscending: ascending });
    // TODO create function to sort data
  }

  /**
   * [This function is called when user scroll to the bottom of the Table]
   * @return {[type]}   [Pagination data (new chunck)]
   */
  loadMore() {
    console.log('callback for table onMore prop');
  }

  render() {
    const { data: { loading, error, allUsers } } = this.props;
    // console.log(loading, error, allUsers);

    if (loading) {
      return <Loading />;
    } else if (error) {
      return <p>Error!</p>;
    }

    return (
      <div>
        <Table>
          <TableHeader
            labels={['Ime', 'Priimek', 'e-mail', 'Vloge', 'Akcije']}
            sortIndex={this.state.columnIndexToSort}
            sortAscending={this.state.sortAscending}
            onSort={this.handleSort}
          />
          <tbody>
            {allUsers.map(rowData => (
              <TableRow key={rowData.id} >
                <td>{rowData.firstName}</td>
                <td>{rowData.lastName}</td>
                <td>{rowData.email}</td>
                <td>{rowData.roles.map(role => role.name)}</td>
                <td>
                  <Button plain icon={<EditIcon />} onClick={() => this.onEdit(rowData)} />
                  <Button plain icon={<TrashIcon />} onClick={() => this.onRemove(rowData.id)} />
                </td>
              </TableRow>
            ))}
          </tbody>
        </Table>

      </div>
    );
  }
}

UsersTable.defaultProps = {
};

UsersTable.propTypes = {
  data: PropTypes.object.isRequired
};

const allUsersQuery = gql`
  query AllUsersQuery {
    allUsers {
      id
      firstName
      lastName
      email
      roles {
        name
      }
    }
  }
`;


export default graphql(allUsersQuery)(UsersTable);

// CODE FOR PAGINATION - MISSING SERVER SIDE IMPL FOR CURSOR

/*
const MoreUsersQuery = gql`
  query MoreUsers($cursor: String) {
    allUsers(cursor: $cursor) {
      id
      firstName
      lastName
      email
    }
  }
`;

export default graphql(MoreUsersQuery, {
  // This function re-runs every time `data` changes, including after `updateQuery`,
  // meaning our loadMoreEntries function will always have the right cursor
  props({ data: { loading, cursor, comments, fetchMore } }) {
    return {
      loading,
      comments,
      loadMoreEntries: () => {
        return fetchMore({
          query: MoreCommentsQuery,
          variables: {
            cursor: cursor,
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const previousEntry = previousResult.entry;
            const newComments = fetchMoreResult.moreComments.comments;
            const newCursor = fetchMoreResult.moreComments.cursor;

            return {
              // By returning `cursor` here, we update the `loadMore` function
              // to the new cursor.
              cursor: newCursor,

              entry: {
                // Put the new comments in the front of the list
                comments: [...newComments, ...previousEntry.comments],
              },
            };
          },
        });
      },
    };
  },
})(UsersTable);
*/
