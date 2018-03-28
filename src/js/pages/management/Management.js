import React, { Component } from 'react';

// Template
import PageTemplate from '../../templates/PageTemplate';

// Grommet components
import Button from 'grommet/components/Button';
import Title from 'grommet/components/Title';

// Icons
import GroupIcon from 'grommet/components/icons/base/Group';

// Custom
import TeamTable from './TeamTable';
import DeleteOverlay from './DeleteOverlay';

class Management extends Component {
  constructor() {
    super();

    this.state = {
      showDeleteOverlay: false
    };
  }

  closeOverlay() {
    this.setState({});
  }

  addNewTeam() {
    console.log('newTema');
  }

  editTeam() {

  }

  deleteTeam() {

  }

  render() {
    return (
      <PageTemplate
        header={<Title>Management</Title>}
      >
        <Title>
          Vzdrževanje razvojih skupin
          <Button plain icon={<GroupIcon />} onClick={this.addNewTeam} />
        </Title>
        <TeamTable limitedView={false} />


        {/* Overlays */}
        {(this.state.showDeleteOverlay) ? <DeleteOverlay /> : null}
      </PageTemplate>
    );
  }
}

Management.defaultProps = {
};

Management.propTypes = {
};

export default Management;
