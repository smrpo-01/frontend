/* eslint arrow-body-style: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// graphql
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

class TeamTable extends Component {
  render() {
    const { data: { loading, error, allTeams }, onEdit, onRemove } = this.props;

    if (loading) {
      return <Loading />;
    } else if (error) {
      return <p style={{ color: 'red' }}>Error!</p>;
    }

    return (
      <Table>
        <TableHeader
          labels={['Ime', 'Kanban Master', 'Product owner', 'Projekti', 'Akcije']}
        />

        <tbody>
          {allTeams.map(rowData => (
            <TableRow key={rowData.id}>
              <td>{rowData.name}</td>
              <td>{rowData.kanbanMaster.firstName + ' ' + rowData.kanbanMaster.lastName}</td>
              <td>{rowData.productOwner.firstName + ' ' + rowData.productOwner.lastName}</td>
              <td>
                {rowData.projectSet.map(project => <div key={project.id}>{project.name}</div>)}
              </td>
              <td>
                <Button plain icon={<EditIcon />} onClick={() => onEdit(rowData)} />
                <Button plain icon={<TrashIcon />} onClick={() => onRemove(rowData.id)} />
              </td>
            </TableRow>
          ))}
        </tbody>
      </Table>
    );
  }
}

TeamTable.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

export const allTeamsQuery = gql`
  query allTeamsQuery {
    allTeams {
      id
      kanbanMaster {
        id
        firstName
        lastName
      }
      productOwner {
        id
        firstName
        lastName
      }
      name
      projectSet {
        id
        name
      }
    }
  }
`;

export default graphql(allTeamsQuery)(TeamTable);
