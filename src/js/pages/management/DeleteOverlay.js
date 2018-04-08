import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

// Grommet components
import Article from 'grommet/components/Article';
import Button from 'grommet/components/Button';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Footer from 'grommet/components/Footer';
import Layer from 'grommet/components/Layer';
import Section from 'grommet/components/Section';

import { allTeamsQuery } from './team/TeamTable';
import { allProjectsQuery } from './project/ProjectTable';

class DeleteTeam extends Component {
  constructor() {
    super();
    this.onConfirm = this.onConfirm.bind(this);

    this.state = {
      onConfirm: this.onConfirm,
      error: ''
    };
  }


  /**
   * [Confirm button handler.
   * Triggers delete mutation for project or team]
   */
  onConfirm() {
    this.setState({ onConfirm: null });
    if (this.props.type === 'team') {
      // console.log('deleting team');
      this.props.deleteTeamMutation({
        variables: { id: this.props.id },
        refetchQueries: [{ query: allTeamsQuery }]
      })
        .then(() => this.props.closer())
        .catch((err) => {
          console.error(err);
          this.setState({ onConfirm: this.onConfirm, error: err.message.split(':')[1] });
        });
    } else {
      // console.log('deleting project');
      this.props.deleteProjectMutation({
        variables: { id: this.props.id },
        refetchQueries: [{ query: allProjectsQuery }]
      })
        .then(() => this.props.closer())
        .catch((err) => {
          console.error(err);
          this.setState({ onConfirm: this.onConfirm, error: err.message.split(':')[1] });
        });
    }
  }


  render() {
    return (
      <Layer>
        <Article pad='small'>
          <Header><Heading>Potrdi brisanje</Heading></Header>

          {(this.state.error !== undefined) ?
            <Section className='color-red padding-bottom-0'>{this.state.error}</Section>
            : null
          }

          <Footer pad={{ vertical: 'medium', between: 'medium' }} justify='center'>
            <Button label='Prekliči'
              secondary={true}
              onClick={() => this.props.closer()}
            />

            <Button label='Potrdi'
              primary={true}
              onClick={this.state.onConfirm}
            />
          </Footer>
        </Article>
      </Layer>
    );
  }
}


DeleteTeam.propTypes = {
  closer: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  deleteTeamMutation: PropTypes.func.isRequired,
  deleteProjectMutation: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['team', 'project']).isRequired
};


const deleteProjectMutation = gql`
  mutation DeleteProject($id: Int!) {
    deleteProject(projectId: $id) {
      ok
    }
  }
`;


const deleteTeamMutation = gql`
  mutation DeleteTeam($id: Int!) {
    deleteTeam(teamId: $id) {
      ok
    }
  }
`;


const DeleteTeamWithMutation = compose(
  graphql(deleteTeamMutation, {
    name: 'deleteTeamMutation'
  }),
  graphql(deleteProjectMutation, {
    name: 'deleteProjectMutation'
  })
)(DeleteTeam);

export default DeleteTeamWithMutation;
