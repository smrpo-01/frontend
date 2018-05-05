import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Template
import PageTemplate from '../../templates/PageTemplate';
import FilterData from './FilterData';
import LeadTimeGraph from './LeadTimeGraph';
import KumulativeFlowGraph from './KumulativeFlowGraph';
import WorkPerDevGraph from './WorkPerDevGraph';

// Grommet components
import Section from 'grommet/components/Section';


class FilterGraphTemplate extends Component {
  constructor() {
    super();
    this.setGraphFilter = this.setGraphFilter.bind(this);
    this.selectGraph = this.selectGraph.bind(this);

    this.state = {
      filterData: null,
      error: {
        project: '',
        generalError: '',
      },
    };
  }

  setGraphFilter(filterData) {
    this.setState({ filterData: null }, () => {
      this.setState({ filterData });
    });
  }

  selectGraph(type) {
    if (this.state.filterData === null) { return null; }

    if (type === 'leadTime') {
      return (
        <LeadTimeGraph
          boardId={this.props.boardId}
          filterData={this.state.filterData}
        />
      );
    } else if (type === 'kumulativeFlow') {
      return (
        <KumulativeFlowGraph
          boardId={this.props.boardId}
          filterData={this.state.filterData}
        />
      );
    } else if (type === 'devWork') {
      return (
        <WorkPerDevGraph
          boardId={this.props.boardId}
          filterData={this.state.filterData}
        />
      );
    } else if (type === 'wip') {
      return null;
    }

    return null;
  }

  render() {
    return (
      <PageTemplate>
        <Section direction='row' pad='none' >
          <FilterData
            setGraphFilter={this.setGraphFilter}
            boardId={this.props.boardId}
            type={this.props.type}
          />
          {this.selectGraph(this.props.type)}
        </Section>
      </PageTemplate>
    );
  }
}

FilterGraphTemplate.defaultProps = {};
FilterGraphTemplate.propTypes = {
  boardId: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['leadTime', 'kumulativeFlow', 'devWork', 'wip']).isRequired
};

export default FilterGraphTemplate;
