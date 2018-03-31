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
import Loading from '../../../components/Loading';

class TeamTable extends Component {
  render() {
    const { data: { loading, error, projects }, onEdit, onRemove } = this.props;

    if (loading) {
      return <Loading />;
    } else if (error) {
      return <p style={{ color: 'red' }}>Error!</p>;
    } else if (projects === undefined) {
      console.log('No data from allProjectsQuery received.');
      return null;
    }

    return (
      <Table>
        <TableHeader
          labels={['Šifra', 'Naziv', 'Naročnik', 'Datum začetka', 'Datum zaključka', 'Razvojna skupina', 'Akcije']}
        />

        <tbody>
          {projects.map(rowData => (
            <TableRow key={rowData.id}>
              <td>{rowData.id}</td>
              <td>{rowData.name}</td>
              <td>{rowData.customer}</td>
              <td>{rowData.startDate}</td>
              <td>{rowData.endDate}</td>
              <td>{rowData.team}</td>
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

export const allProjectsQuery = gql`
  query allProjectsQuery {
    allProjects {
      id
      name
    }
  }
`;

export default graphql(allProjectsQuery)(TeamTable);
