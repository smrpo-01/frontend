import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import Box from 'grommet/components/Box';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import Heading from 'grommet/components/Heading';

import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  VerticalBarSeries,
  DiscreteColorLegend,
} from 'react-vis';

// Custom
import Loading from '../../components/Loading';

const colorPalette = ['9e0142', 'd53e4f', 'f46d43', 'fdae61', 'fee08b', 'ffffbf', 'e6f598', 'abdda4', '66c2a5', '3288bd', '5e4fa2'];
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
   * [Prepare data to visualize]
   * @param  {[Object]} data [description]
   * @return {[Array]}      [description]
   */
  prepareData(data) {
    let tmp = [];
    for (let i = 0; i < data.length; i++) {
      let cardId = data[i].name;
      let cardTime = data[i].cardPerColumnTime;
      // we need to init 2d array

      Object.keys(cardTime).forEach((time, j) => {
        let newEl = { x: cardId, y: cardTime[time] };
        if (i === 0) {
          tmp.push([newEl]);
        } else {
          tmp[j].push(newEl);
        }
      });
    }
    return tmp;
  }


  render() {
    const { queryGraphData: { loading, error, filterCards, avgLeadTime } } = this.props;

    if (loading) {
      return <Loading />;
    } else if (error) {
      return <p style={{ color: 'red' }}>{'Ni podatkov za prikaz grafa. Posodobite iskalni niz. Preverite izbor stolpcev.'}</p>;
    } else if (filterCards.length === 0) {
      return <p><b>{'Ni podatkov za prikaz grafa. Posodobite iskalni niz.'}</b></p>;
    }

    return (
      <Box pad='medium' >
        <Heading margin='medium' style={{ marginTop: '0px' }} tag='h3' strong>
          <span>{'Povprečni čas izdelave'}</span>
        </Heading>
        <List>
          <ListItem justify='start' pad={{ between: 'small', vertical: 'small' }}>
            <b>{'Povprečni čas izdelave:'}</b>
            <b>{avgLeadTime}</b>
            <span>{'h'}</span>
          </ListItem>
          {filterCards.map(card => (
            <ListItem key={card.id} justify='start' pad={{ between: 'small', vertical: 'small' }}>
              <span>{card.name + ':'}</span>
              <b>{card.travelTime}</b>
              <span>{'h'}</span>
            </ListItem>
          ))}
        </List>

        <Box pad='medium' />

        <XYPlot
          className='lead-time-graph'
          xType='ordinal'
          stackBy='y'
          width={this.state.width}
          height={this.state.height}>
          <DiscreteColorLegend
            style={{ position: 'absolute', left: '40px', top: '0px' }}
            orientation='horizontal'
            items={Object.keys(filterCards[0].cardPerColumnTime).map((key, i) => ({ title: key, color: '#' + colorPalette[i % cLen] }))}
          />
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis tickLabelAngle={-10} tickSize={10} tickPadding={0} />
          <YAxis />

          {this.prepareData(filterCards).map((bar, i) =>
            (
              <VerticalBarSeries
                key={Math.random()}
                data={bar}
                color={'#' + colorPalette[i % cLen]}
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
  query getBoardData(
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
  ) {
    filterCards(
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
      name
      cardPerColumnTime(minimal: true)
      travelTime(columnFrom: $columnFrom, columnTo: $columnTo)
    }
    avgLeadTime(projectId: $projectId)
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
      }
    })
  })
)(LeadTimeGraph);

export default LeadTimeGraphWithQuery;
