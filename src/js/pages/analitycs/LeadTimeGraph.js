import React, { Component } from 'react';
// import PropTypes from 'prop-types';

import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  VerticalBarSeries,
  DiscreteColorLegend
} from 'react-vis';


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

  render() {
    return (
      <XYPlot
        className='clustered-stacked-bar-chart-example'
        xType='ordinal'
        stackBy='y'
        width={this.state.width}
        height={this.state.height}>
        <DiscreteColorLegend
          style={{ position: 'absolute', left: '40px', top: '0px' }}
          orientation='horizontal' items={[
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
      </XYPlot>
    );
  }
}

export default LeadTimeGraph;
