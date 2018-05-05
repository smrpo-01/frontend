import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import Box from 'grommet/components/Box';
import Heading from 'grommet/components/Heading';
import Table from 'grommet/components/Table';
import TableRow from 'grommet/components/TableRow';
import TableHeader from 'grommet/components/TableHeader';
import Title from 'grommet/components/Title';

import { RadialChart } from 'react-vis';

// Custom
import Loading from '../../components/Loading';

const colorPalette = ['#9e0142', '#d53e4f', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#e6f598', '#abdda4', '#66c2a5', '#3288bd', '#5e4fa2'];
const cLen = colorPalette.length;

class WorkPerDevGraph extends Component {
  constructor(props) {
    super(props);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

    this.state = {
      cards: false,
      points: false,
      width: 0,
      height: 0,
    };
  }


  // add event listener
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }


  // remove event listener
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }


  // handle resize
  updateWindowDimensions() {
    this.setState({ width: (window.innerWidth * 0.66), height: (window.innerHeight * 0.66) });
  }


  prepareData(data) {
    return data.map((dev, i) => (
      { id: i, angle: dev.value, label: dev.name, color: colorPalette[i % cLen] }
    ));
  }


  render() {
    const { queryGraphData: { loading, error, cardsPerDev, estimatePerDev } } = this.props;
    // const { cards, points } = this.state;
    // console.log(cardsPerDev, estimatePerDev);

    if (loading) {
      return <Loading />;
    } else if (error) {
      console.error(error);
      return null;
    }

    return (
      <Box pad='medium' >
        <Heading margin='medium' style={{ marginTop: '0px' }} tag='h3' strong>
          <span>{'Pregled dela po posameznih razvijalcih'}</span>
        </Heading>

        <Box pad='small' />

        {/* table */}
        <Table>
          <TableHeader
            labels={['Ime', 'E-mail', 'Št. kartic', 'Št. točk']}
          />
          <tbody>
            {cardsPerDev.map((rowData, i) => (
              <TableRow key={rowData.email} >
                <td>{rowData.name}</td>
                <td>{rowData.email}</td>
                <td>{rowData.value}</td>
                <td>{estimatePerDev[i].value}</td>
              </TableRow>
            ))}
          </tbody>
        </Table>

        <Box direction='row' pad={{ vertical: 'medium' }}>
          <Box>
            <Title>{'Število zgodb'}</Title>
            <RadialChart
              showLabels
              labelsRadiusMultiplier={0.9}
              labelsStyle={{ fontSize: 16, fill: '#ffffff' }}
              data={this.prepareData(cardsPerDev)}
              colorType='category'
              colorRange={colorPalette}
              // onValueMouseOver={v => this.setState({ cards: v })}
              // onSeriesMouseOut={() => this.setState({ cards: false })}
              width={this.state.width / 2}
              height={this.state.height / 2}
            >
              {/* cards && <Hint value={cards} /> */}
            </RadialChart>
          </Box>

          <Box>
            <Title>{'Število točk'}</Title>
            <RadialChart
              showLabels
              labelsRadiusMultiplier={0.9}
              labelsStyle={{ fontSize: 16, fill: '#ffffff' }}
              data={this.prepareData(estimatePerDev)}
              colorType='category'
              colorRange={colorPalette}
              // onValueMouseOver={v => this.setState({ points: v })}
              // onSeriesMouseOut={() => this.setState({ points: false })}
              width={this.state.width / 2}
              height={this.state.height / 2}
            >
              {/* points && <Hint value={points} /> */}
            </RadialChart>
          </Box>
        </Box>
      </Box>
    );
  }
}

// format={() => Object.keys(points).filter(key => key === 'label')}
WorkPerDevGraph.defaultProps = {};
WorkPerDevGraph.propTypes = {
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
    cardsPerDev(
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
    ),
    estimatePerDev(
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
    )
  }
`;

const WorkPerDevGraphWithQuery = compose(
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
)(WorkPerDevGraph);

export default WorkPerDevGraphWithQuery;
