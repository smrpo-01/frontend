import React, { Component } from 'react';

// Grommet components
import Button from 'grommet/components/Button';
import Table from 'grommet/components/Table';
import TableRow from 'grommet/components/TableRow';
import TableHeader from 'grommet/components/TableHeader';

// Icons
import EditIcon from 'grommet/components/icons/base/Edit';
import TrashIcon from 'grommet/components/icons/base/Trash';

class UsersTable extends Component {
  constructor() {
    super();
    this.handleSort = this.handleSort.bind(this);

    this.state = {
      columnIndexToSort: 0,
      sortAscending: true,
      data: [
        { id: 1, name: 'Luka', lastName: 'Podgorsek', email: 'goregore512@gmail.com', roles: ['Admin, KanbanMaster'] },
        { id: 2, name: 'Luka', lastName: 'Podgorsek', email: 'goregore512@gmail.com', roles: ['Developer'] }
      ]
    };
  }

  handleSort(index, ascending) {
    this.setState({ columnIndexToSort: index, sortAscending: ascending });
    // TODO create function to sort data
  }

  handleEditUser(userData) {
    // open edit dialog
    // post new data to server
    // update state with edited data
    console.log(userData);
  }

  handleRemove(userId) {
    // open confirm dialog
    console.log(userId);
  }

  /**
   * [This function is called when user scroll to the bottom of the Table]
   * @return {[type]}   [Pagination data (new chunck)]
   */
  loadMore() {
    console.log('callback for table onMore prop');
  }

  render() {
    console.log(this.props);
    return (
      <Table>
        <TableHeader
          labels={['Id', 'Ime', 'Priimek', 'e-mail', 'Vloge', 'Akcije']}
          sortIndex={this.state.columnIndexToSort}
          sortAscending={this.state.sortAscending}
          onSort={this.handleSort}
        />
        <tbody>
          {this.state.data.map(rowData => (
            <TableRow key={rowData.id} >
              {Object.keys(rowData).map(key =>
                <td key={key}>{rowData[key]}</td>
              )}
              <td>
                <Button plain icon={<EditIcon />} onClick={() => this.handleRemove(rowData)} />
                <Button plain icon={<TrashIcon />} onClick={() => this.handleRemove(rowData.id)} />
              </td>
            </TableRow>
          ))}
        </tbody>
      </Table>
    );
  }
}

UsersTable.defaultProps = {
};

UsersTable.propTypes = {
};

export default UsersTable;
