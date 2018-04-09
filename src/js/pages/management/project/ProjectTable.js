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
  /**
   * [Formates SLO Grommet format to Django ot he other way around]
   * @param  {[String]} dateToFormat       [Date to format. Valid formats: YYYY-MM-DD or DD/MM/YYYY]
   * @param  {String} [format='grommet'] [Which format is passed to funciton.]
   * @return {[String]}                    [Formatted date as string]
   */
  formatDate(dateToFormat, format = 'grommet') {
    if (format === 'django') {
      let d = dateToFormat.split('-'); // YYYY-MM-DD
      return (d[2] + '/' + d[1] + '/' + d[0]); // DD/MM/YYYY
    }
    let d = dateToFormat.split('/'); // DD/MM/YYYY
    return (d[2] + '-' + d[1] + '-' + d[0]); // YYYY-MM-DD
  }


  render() {
    const { data: { loading, error, allProjects }, onEdit, onRemove } = this.props;
    if (loading) {
      return <Loading />;
    } else if (error) {
      return <p style={{ color: 'red' }}>Error!</p>;
    } else if (allProjects === undefined) {
      console.log('No data from allProjectsQuery received.');
      return null;
    }

    return (
      <Table>
        <TableHeader
          labels={['Šifra', 'Naziv', 'Naročnik', 'Datum začetka', 'Datum zaključka', 'Razvojna skupina', 'Akcije']}
        />

        <tbody>
          {allProjects.map(rowData => (
            <TableRow key={rowData.id} className={(rowData.isActive) ? '' : 'table-row-grey'}>
              <td>{rowData.projectCode}</td>
              <td>{rowData.name}</td>
              <td>{rowData.customer}</td>
              <td>{this.formatDate(rowData.dateStart, 'django')}</td>
              <td>{this.formatDate(rowData.dateEnd, 'django')}</td>
              <td>{(rowData.team !== null) ? rowData.team.name : ''}</td>
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
      projectCode
      name
      customer
      dateEnd
      dateStart
      isActive
      team {
        id
        name
      }
    }
  }
`;

export default graphql(allProjectsQuery)(TeamTable);
