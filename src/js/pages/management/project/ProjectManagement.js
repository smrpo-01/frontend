import React, { Component } from 'react';

// Template
import PageTemplate from '../../../templates/PageTemplate';

// Grommet components
import Anchor from 'grommet/components/Anchor';

// Icons
import ScorecardIcon from 'grommet/components/icons/base/Scorecard';

// Custom
import AddEditProject from './AddEditProject';
import DeleteOverlay from '../DeleteOverlay';
import ProjectTable from './ProjectTable';

class ProjectManagement extends Component {
  constructor() {
    super();
    this.closeOverlay = this.closeOverlay.bind(this);
    this.addNewProject = this.addNewProject.bind(this);
    this.deleteProject = this.deleteProject.bind(this);
    this.editProject = this.editProject.bind(this);

    this.state = {
      showAddEditOverlay: false,
      showDeleteOverlay: false,
      editData: {},
      modeEdit: false,
      projectId: null
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
      projectId: null
    });
  }

  addNewProject() {
    this.setState({ showAddEditOverlay: true });
  }

  editProject(editData) {
    this.setState({ showAddEditOverlay: true, modeEdit: true, editData });
  }

  deleteProject(projectId) {
    this.setState({ showDeleteOverlay: true, projectId });
  }

  render() {
    return (
      <PageTemplate
        header={
          <Anchor
            label='Dodaj projekt'
            animateIcon={false}
            onClick={this.addNewProject}
            icon={<ScorecardIcon />}
            reverse
            primary
          />
        }
      >
        <ProjectTable
          onEdit={this.editProject}
          onRemove={this.deleteProject}
        />

        {/* Overlays */}
        {(this.state.showDeleteOverlay) &&
          <DeleteOverlay
            closer={this.closeOverlay}
            id={this.state.projectId}
            type={'project'}
          />
        }
        {(this.state.showAddEditOverlay) &&
          <AddEditProject closer={this.closeOverlay} />
        }
      </PageTemplate>
    );
  }
}

ProjectManagement.defaultProps = {
};

ProjectManagement.propTypes = {
};

export default ProjectManagement;
