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
import AddEditOverlay from './AddEditTeamOverlay';

class Management extends Component {
  constructor() {
    super();
    this.closeOverlay = this.closeOverlay.bind(this);
    this.addNewTeam = this.addNewTeam.bind(this);
    this.deleteTeam = this.deleteTeam.bind(this);
    this.editTeam = this.editTeam.bind(this);

    this.state = {
      showAddEditOverlay: false,
      showDeleteOverlay: false,
      editData: {},
      modeEdit: false,
      id: null // userId to delete
    };
  }


  /**
   * [Closes overlay and resets state]
   */
  closeOverlay() {
    this.setState({
      showAddEditOverlay: false,
      showDeleteOverlay: false,
      editData: {},
      modeEdit: false,
      id: null
    });
  }

  addNewTeam() {
    console.log('newTema');
    this.setState({ showAddEditOverlay: true });
  }

  editTeam(data) {
    console.log('editing team', data);
    this.setState({ showAddEditOverlay: true, modeEdit: true });
  }

  deleteTeam(teamId) {
    console.log('deleting team', teamId);
    this.setState({ showDeleteOverlay: true, teamId });
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
        <TeamTable
          limitedView={false}
          onEdit={this.editTeam}
          onRemove={this.deleteTeam}
        />


        {/* Overlays */}
        {(this.state.showDeleteOverlay) ?
          <DeleteOverlay closer={this.closeOverlay} id={this.state.teamId} />
          : null}
        {(this.state.showAddEditOverlay) ?
          <AddEditOverlay closer={this.closeOverlay} modeEdit={this.state.modeEdit} />
          : null}
      </PageTemplate>
    );
  }
}

Management.defaultProps = {
};

Management.propTypes = {
};

export default Management;
