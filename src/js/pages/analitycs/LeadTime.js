import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Template
import PageTemplate from '../../templates/PageTemplate';
import FilterData from './FilterData';
import LeadTimeGraph from './LeadTimeGraph';

// Grommet components
import Section from 'grommet/components/Section';


class LeadTime extends Component {
  constructor() {
    super();
    this.setGraphFilter = this.setGraphFilter.bind(this);

    this.state = {
      project: '',
      projectId: '',
      firstname: '',
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

  render() {
    return (
      <PageTemplate>
        <Section direction='row' pad='none' >
          <FilterData
            setGraphFilter={this.setGraphFilter}
            boardId={this.props.boardId}
          />
          {(this.state.filterData !== null) &&
            <LeadTimeGraph
              boardId={this.props.boardId}
              filterData={this.state.filterData}
            />
          }
        </Section>

      </PageTemplate>
    );
  }
}

LeadTime.defaultProps = {};
LeadTime.propTypes = {
  boardId: PropTypes.string.isRequired,
};

export default LeadTime;
