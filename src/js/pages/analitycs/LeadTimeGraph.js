import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

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

  prepareData(data) {
    let tmp = Object.keys(data).map(key => (
      { x: key, y: data[key] }
    ));
    console.log(tmp);
    return tmp;
  }

  render() {
    console.log(this.props);
    const { queryGraphData: { loading, error, filterCards } } = this.props;
    // console.log(loading, error, allUsers);

    if (loading) {
      return <Loading />;
    } else if (error) {
      return <p style={{ color: 'red' }}>Error!</p>;
    }
    console.log('filterCards');
    console.log(filterCards);

    return (
      <XYPlot
        className='clustered-stacked-bar-chart-example'
        xType='ordinal'
        stackBy='y'
        width={this.state.width}
        height={this.state.height}>
        <DiscreteColorLegend
          style={{ position: 'absolute', left: '40px', top: '0px' }}
          orientation='horizontal'
          items={[
            {
              title: 'Apples',
              color: '#12939A'
            },
            {
              title: 'Oranges',
              color: '#79C7E3'
            }
          ]}
        />
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis />
        <YAxis />

        <VerticalBarSeries
          color='#12939A'
          data={[
            { x: 'Q1', y: 3 },
            { x: 'Q2', y: 8 },
            { x: 'Q3', y: 11 },
            { x: 'Q4', y: 19 }
          ]} />
        <VerticalBarSeries
          color='#79C7E3'
          data={[
            { x: 'Q1', y: 22 },
            { x: 'Q2', y: 2 },
            { x: 'Q3', y: 22 },
            { x: 'Q4', y: 18 }
          ]} />

        {filterCards.map(cardObj => (
          <VerticalBarSeries
            key={cardObj.id}
            cluster={cardObj.name}
            data={this.prepareData(cardObj.cardPerColumnTime)}
          />
        ))}

        {filterCards.map((cardObj) => {
          cardObj.cardPerColumnTime.map()
        })}


      </XYPlot>
    );
  }
}


LeadTimeGraph.defaultProps = {};
LeadTimeGraph.propTypes = {
  queryGraphData: PropTypes.object.isRequired,
};


export const getGraphDataQuery = gql`
  query getBoardData($projectId: Int!) {
    filterCards(projectId: $projectId) {
      id
      name
      cardPerColumnTime(minimal: true)
      totalTime(minimal: true)
    }
    avgLeadTime
  }
`;

// TODO popravi projectId -> iz props
const LeadTimeGraphWithQuery = compose(
  graphql((getGraphDataQuery), {
    name: 'queryGraphData',
    options: () => ({
      variables: {
        projectId: 2
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
