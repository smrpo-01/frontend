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

import { allUsersQuery } from './UsersTable';

class DeleteUser extends Component {
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
    this.props.mutate({
      variables: { id: this.props.id },
      refetchQueries: [{ query: allUsersQuery }]
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
          <Header><Heading>Potrdi brisanje uporabnika</Heading></Header>

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

const deleteUserMutation = gql`
  mutation deleteUser($id: Int!) {
    deleteUser(userId: $id) {
      user {
        id
      }
    }
  }
`;

DeleteUser.propTypes = {
  closer: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  mutate: PropTypes.func.isRequired
};

const DeleteUserWithMutation = graphql(deleteUserMutation)(DeleteUser);
export default DeleteUserWithMutation;
