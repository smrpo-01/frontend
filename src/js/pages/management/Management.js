import React, { Component } from 'react';

// Template
import PageTemplate from '../../templates/PageTemplate';
import TeamManagement from './team/TeamManagement';
import ProjectManagement from './project/ProjectManagement';

// Grommet components
import Tabs from 'grommet/components/Tabs';
import Tab from 'grommet/components/Tab';
import Title from 'grommet/components/Title';

class Management extends Component {
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
};

export default Management;
