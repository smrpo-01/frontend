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
  DiscreteColorLegend
} from 'react-vis';

// Custom
import Loading from '../../components/Loading';

class LeadTimeGraph extends Component {
  constructor(props) {
    super(props);
    this.state = { width: 0, height: 0 };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: (window.innerWidth * 0.66), height: (window.innerHeight * 0.66) });
  }

  // do not touch
  prepareData(data) {
    let tmp = [];
    for (let i = 0; i < data.length; i++) {
      let cardId = data[i].id;
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
    console.log(filterCards);

    if (loading) {
      return <Loading />;
    } else if (error) {
      return <p style={{ color: 'red' }}>Error!</p>;
    } else if (filterCards.length === 0) return null;

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
          className='clustered-stacked-bar-chart-example'
          xType='ordinal'
          stackBy='y'
          width={this.state.width}
          height={this.state.height}>
          <DiscreteColorLegend
            style={{ position: 'absolute', left: '40px', top: '0px' }}
            orientation='horizontal'
            items={Object.keys(filterCards[0].cardPerColumnTime).map(key => ({ title: key }))}
          />
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis />
          <YAxis />

          {this.prepareData(filterCards).map(bar =>
            (
              <VerticalBarSeries
                key={Math.random()}
                data={bar}
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

// TODO popravi projectId -> iz props
const LeadTimeGraphWithQuery = compose(
  graphql((getGraphDataQuery), {
    name: 'queryGraphData',
    options: props => ({
      variables: {
        projectId: props.filterData.projectId,
        cardType: [props.filterData.cardTypeId],
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

/*
<VerticalBarSeries
  cluster='2016'
  color='#12939A'
  data={[
    { x: 'Q1', y: 3 },
    { x: 'Q2', y: 8 },
    { x: 'Q3', y: 11 },
    { x: 'Q4', y: 19 }
  ]} />
<VerticalBarSeries
  cluster='2016'
  color='#79C7E3'
  data={[
    { x: 'Q1', y: 22 },
    { x: 'Q2', y: 2 },
    { x: 'Q3', y: 22 },
    { x: 'Q4', y: 18 }
  ]} />

Kumulatioven diagram poteka
  {timePerColumn.map(cardObj => (
    <VerticalBarSeries
      key={cardObj.id}
      cluster={cardObj.name}
      data={this.prepareData(cardObj.cardPerColumnTime)}
    />
  ))}

  prepareData(data) {
    let tmp = Object.keys(data).map(key => (
      { x: key, y: data[key] }
    ));
    console.log(tmp);
    return tmp;
  }
 */
