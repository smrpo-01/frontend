import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Template
import PageTemplate from '../../templates/PageTemplate';
import TeamManagement from './team/TeamManagement';
import ProjectManagement from './project/ProjectManagement';

// Grommet components
import Tabs from 'grommet/components/Tabs';
import Tab from 'grommet/components/Tab';
import Title from 'grommet/components/Title';

class Management extends Component {
  // Redirect if necessary
  componentWillMount() {
    // eslint-disable-next-line no-undef
    const user = sessionStorage.getItem('user');
    const userRoles = JSON.parse(user).roles;
    if (userRoles.indexOf('km') === -1) {
      this.props.history.push('/home');
    }
  }

  render() {
    return (
      <PageTemplate
        header={<Title>Vzdrževanje</Title>}
      >
        <Tabs justify='start'>
          <Tab title='Vzdrževanje razvojnih skupin'>
            <TeamManagement />
          </Tab>
          <Tab title='Vzdrževanje projektov'>
            <ProjectManagement />
          </Tab>
        </Tabs>
      </PageTemplate>
    );
  }
}

Management.defaultProps = {
};

Management.propTypes = {
  history: PropTypes.object.isRequired
};

export default Management;
