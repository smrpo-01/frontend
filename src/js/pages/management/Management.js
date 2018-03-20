import React, { Component } from 'react';

// Template
import PageTemplate from '../../templates/PageTemplate';

// Grommet components
import Title from 'grommet/components/Title';

class Management extends Component {
  render() {
    return (
      <PageTemplate
        header={<Title>Management</Title>}
      >
        <span>content</span>
      </PageTemplate>
    );
  }
}

Management.defaultProps = {
};

Management.propTypes = {
};

export default Management;
