import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import Box from 'grommet/components/Box';
import Heading from 'grommet/components/Heading';
import Table from 'grommet/components/Table';
import TableRow from 'grommet/components/TableRow';
import TableHeader from 'grommet/components/TableHeader';

// Custom
import Loading from '../../components/Loading';

class WipGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: false,
      points: false,
      width: 0,
      height: 0,
    };
  }

  render() {
    const { queryGraphData: { loading, error, wipLogs } } = this.props;
    // console.log(wipLogs);

    if (loading) {
      return <Loading />;
    } else if (error) {
      // return <p style={{ color: 'red' }}>{'Prišlo je do napake. Posodobite iskalni niz.'}</p>;
      return null;
    } else if (wipLogs.length === 0) {
      return <p><b>{'Ni podatkov za prikaz tabele. Posodobite iskalni niz.'}</b></p>;
    }

    return (
      <Box pad='medium' >
        <Heading margin='medium' style={{ marginTop: '0px' }} tag='h3' strong>
          <span>{'Kršitev omejitve WIP'}</span>
        </Heading>

        <Box pad='small' />
        <Table>
          <TableHeader
            labels={['Številka kartice', 'Ime', 'Datum', 'Stolpec kršitve', 'Uporabnik', 'E-mail', 'Vzrok']}
          />
          <tbody>
            {wipLogs.map(rowData => (
              <TableRow key={rowData.id} >
                <td>{rowData.card.cardNumber}</td>
                <td>{rowData.card.name}</td>
                <td>{rowData.timestamp}</td>
                <td>{rowData.toColumn.name}</td>
                <td>{rowData.userTeam.member.firstName + ' ' + rowData.userTeam.member.lastName}</td>
                <td>{rowData.userTeam.member.email}</td>
                <td>{rowData.action}</td>
              </TableRow>
            ))}
          </tbody>
        </Table>

      </Box>
    );
  }
}

WipGraph.defaultProps = {};
WipGraph.propTypes = {
  queryGraphData: PropTypes.object.isRequired,
};


export const getGraphDataQuery = gql`
  query getGraphData(
    $projectId: Int!,
    $creationStart: String!,
    $creationEnd: String!,
    $doneStart: String!,
    $doneEnd: String!,
    $devStart: String!,
    $devEnd: String!,
    $estimateFrom: Float!,
    $estimateTo: Float!,
    $cardType: [String]!,
  ) {
    wipLogs(
      projectId: $projectId,
      creationStart: $creationStart,
      creationEnd: $creationEnd,
      doneStart: $doneStart,
      doneEnd: $doneEnd,
      devStart: $devStart,
      devEnd: $devEnd,
      estimateFrom: $estimateFrom,
      estimateTo: $estimateTo,
      cardType: $cardType,
    ) {
      id
      card {
        id
        cardNumber
        name
      }
      timestamp
      toColumn {
        id
        name
      }
      userTeam {
        id
        member {
          id
          email
          firstName
          lastName
        }
      }
      action
    }
  }
`;

const WipGraphWithQuery = compose(
  graphql((getGraphDataQuery), {
    name: 'queryGraphData',
    options: props => ({
      variables: {
        projectId: props.filterData.projectId,
        cardType: props.filterData.cardTypeId,
        creationStart: props.filterData.creationStart,
        creationEnd: props.filterData.creationEnd,
        doneStart: props.filterData.doneStart,
        doneEnd: props.filterData.doneEnd,
        devStart: props.filterData.devStart,
        devEnd: props.filterData.devEnd,
        estimateFrom: props.filterData.estimateFrom,
        estimateTo: props.filterData.estimateTo,
        columnFrom: props.filterData.columnFrom,
        columnTo: props.filterData.columnTo,
        dateFrom: props.filterData.dateFrom,
        dateTo: props.filterData.dateTo,
      }
    })
  })
)(WipGraph);

export default WipGraphWithQuery;
