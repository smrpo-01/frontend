import React, { Component } from 'react';

// Template
import PageTemplate from '../../../templates/PageTemplate';

// Grommet components
import Anchor from 'grommet/components/Anchor';

// Icons
import GroupIcon from 'grommet/components/icons/base/Group';

// Custom
import TeamTable from './TeamTable';
import DeleteOverlay from '../DeleteOverlay';
import AddEditOverlay from './AddEditTeamOverlay';

class TeamManagement extends Component {
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

  editTeam(editData) {
    // console.log('editing team', editData);
    this.setState({ showAddEditOverlay: true, modeEdit: true, editData });
  }

  deleteTeam(teamId) {
    console.log('deleting team', teamId);
    this.setState({ showDeleteOverlay: true, teamId });
  }

  render() {
    return (
      <PageTemplate
        header={
          <Anchor
            label='Dodaj razvojno skupino'
            animateIcon={false}
            onClick={this.addNewTeam}
            icon={<GroupIcon />}
            reverse
            primary
          />
        }
      >
        <TeamTable
          limitedView={false}
          onEdit={this.editTeam}
          onRemove={this.deleteTeam}
        />


        {/* Overlays */}
        {(this.state.showDeleteOverlay) &&
          <DeleteOverlay closer={this.closeOverlay} id={this.state.teamId} />
        }
        {(this.state.showAddEditOverlay) &&
          <AddEditOverlay
            closer={this.closeOverlay}
            modeEdit={this.state.modeEdit}
            editData={this.state.editData}
          />
        }
      </PageTemplate>
    );
  }
}

TeamManagement.defaultProps = {
};

TeamManagement.propTypes = {
};

export default TeamManagement;
