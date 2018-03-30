import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

// Grommet components
import Article from 'grommet/components/Article';
import Button from 'grommet/components/Button';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Footer from 'grommet/components/Footer';
import Layer from 'grommet/components/Layer';
import Section from 'grommet/components/Section';

import { allTeamsQuery } from './TeamTable';

class DeleteTeam extends Component {
  constructor() {
    super();
    this.onConfirm = this.onConfirm.bind(this);

    this.state = {
      onConfirm: this.onConfirm,
      error: ''
    };
  }


  onConfirm() {
    this.setState({ onConfirm: null });
    // console.log(this.props);
    this.props.mutate({
      variables: { id: this.props.id },
      refetchQueries: [{ query: allTeamsQuery }]
    })
      .then(() => this.props.closer())
      .catch((err) => {
        console.error(err);
        this.setState({ onConfirm: this.onConfirm, error: err.message });
      });
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

// TODO create multiple component with multiple mutations

const DeleteTeamMutation = gql`
  mutation DeleteTeam($id: Int!) {
    deleteTeam(teamId: $id) {
      ok
    }
  }
`;

DeleteTeam.propTypes = {
  closer: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  mutate: PropTypes.func.isRequired
};

const DeleteTeamWithMutation = graphql(DeleteTeamMutation)(DeleteTeam);
export default DeleteTeamWithMutation;
