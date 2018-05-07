import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import Box from 'grommet/components/Box';
import Heading from 'grommet/components/Heading';

import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  AreaSeries,
  DiscreteColorLegend
} from 'react-vis';

// Custom
import Loading from '../../components/Loading';

// const colorPalette = ['9e0142', 'd53e4f', 'f46d43', 'fdae61', 'fee08b', 'e6f598', 'abdda4', '66c2a5', '3288bd', '5e4fa2'];
const colorPalette = ['#9e0142', '#d53e4f', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#e6f598', '#abdda4', '#66c2a5', '#3288bd', '#5e4fa2'];
const cLen = colorPalette.length;

class LeadTimeGraph extends Component {
  constructor(props) {
    super(props);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

    this.state = { width: 0, height: 0 };
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


  /**
   * [Map data so react vis can visalize it]
   * @param  {[Object]} data [input data]
   * @return {[Array]}      [data to show in graph]
   */
  prepareData(data) {
    let tmp = [];
    Object.keys(data).forEach((key, i) => {
      let day = data[key];
      Object.keys(day).forEach((column, j) => {
        let newEl = { x: key, y: day[column] };
        if (i === 0) {
          tmp.push([newEl]);
        } else {
          tmp[j].push(newEl);
        }
      });
    });
    return tmp;
  }


  render() {
    const { queryGraphData: { loading, error, cardsPerDay } } = this.props;

    if (loading) {
      return <Loading />;
    } else if (error) {
      console.error(error);
      return <p><b>{'Prišlo je do napake. Posodobite iskalni niz.'}</b></p>;
    } else if (cardsPerDay.length === 0) {
      return <p><b>{'Ni podatkov za prikaz grafa. Posodobite iskalni niz.'}</b></p>;
    }

    return (
      <Box pad='medium' >
        <Heading margin='medium' style={{ marginTop: '0px' }} tag='h3' strong>
          <span>{'Kumulativni diagram poteka'}</span>
        </Heading>

        <Box pad='medium' />

        <XYPlot
          className='kumulative-flow'
          colorType='category'
          colorRange={colorPalette}
          xType='ordinal'
          stackBy='y'
          width={this.state.width}
          height={this.state.height}>
          <DiscreteColorLegend
            style={{ position: 'absolute', left: '40px', top: '0px' }}
            orientation='horizontal'
            colorType='category'
            colorRange={colorPalette}
            items={Object.keys(cardsPerDay[Object.keys(cardsPerDay)[0]]).map((key, i) => ({ title: key, color: '#' + colorPalette[i % cLen] }))}
          />
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis tickLabelAngle={-15} tickSizeOuter={10} tickPadding={2} />
          <YAxis />

          {this.prepareData(cardsPerDay).map((val, i) =>
            (
              <AreaSeries
                key={Math.random()}
                data={val}
                color={colorPalette[i % cLen]}
              />
            )
          )}
        </XYPlot>
      </Box>
    );
  }
}


LeadTimeGraph.defaultProps = {};
LeadTimeGraph.propTypes = {
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
    $columnFrom: String!,
    $columnTo: String!,
    $cardType: [String]!,
    $dateFrom: String!,
    $dateTo: String!,
  ) {
    cardsPerDay(
      projectId: $projectId,
      creationStart: $creationStart,
      creationEnd: $creationEnd,
      columnTo: $columnTo,
      columnFrom: $columnFrom,
      doneStart: $doneStart,
      doneEnd: $doneEnd,
      devStart: $devStart,
      devEnd: $devEnd,
      estimateFrom: $estimateFrom,
      estimateTo: $estimateTo,
      cardType: $cardType,
      dateFrom: $dateFrom,
      dateTo: $dateTo,
    )
  }
`;

const LeadTimeGraphWithQuery = compose(
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
)(LeadTimeGraph);

export default LeadTimeGraphWithQuery;
