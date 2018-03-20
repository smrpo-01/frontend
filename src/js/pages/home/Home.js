import React, { Component } from 'react';

// Template
import PageTemplate from '../../templates/PageTemplate';

// Grommet components
import Title from 'grommet/components/Title';

class Home extends Component {
  render() {
    return (
      <PageTemplate
        header={<Title>Home</Title>}
      >
        <span>content</span>
      </PageTemplate>
    );
  }
}

Home.defaultProps = {
};

Home.propTypes = {
};

export default Home;
