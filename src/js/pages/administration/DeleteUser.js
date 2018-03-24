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

class DeleteUser extends Component {
  constructor() {
    super();
    this.onConfirm = this.onConfirm.bind(this);
  }


  onConfirm() {
    this.props.mutate({ variables: { id: this.props.id } })
      .then(this.props.closer())
      .catch(err => console.log(err));
  }

  render() {
    return (
      <Layer>
        <Article pad='small'>
          <Header><Heading>Potrdi brisanje uporabnika</Heading></Header>
          <Footer pad={{ vertical: 'medium', between: 'medium' }} justify='center'>
            <Button label='Prekliči'
              secondary={true}
              onClick={() => this.props.closer()}
            />

            <Button label='Potrdi'
              primary={true}
              onClick={() => this.onConfirm()}
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
