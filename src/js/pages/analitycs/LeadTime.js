import React, { Component } from 'react';
// import PropTypes from 'prop-types';

// Template
import PageTemplate from '../../templates/PageTemplate';
import FilterData from './FilterData';
import LeadTimeGraph from './LeadTimeGraph';

// Grommet components
import Box from 'grommet/components/Box';
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
    this.setState({ filterData });
  }

  render() {
    return (
      <PageTemplate>
        <Section direction='row' pad='none' >
          <FilterData setGraphFilter={this.setGraphFilter} />
          <Box pad='medium' full>
            <LeadTimeGraph />
          </Box>
        </Section>

      </PageTemplate>
    );
  }
}

LeadTime.defaultProps = {};
LeadTime.propTypes = {};

export default LeadTime;
