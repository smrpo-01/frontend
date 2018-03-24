import React, { Component } from 'react';

// Template
import PageTemplate from '../../templates/PageTemplate';

// Grommet components
import Button from 'grommet/components/Button';
import Title from 'grommet/components/Title';

// Icons
import UserAddIcon from 'grommet/components/icons/base/UserAdd';

// Custom components
import UsersTable from './UsersTable';
import AddEditNewUser from './AddEditNewUser';
import DeleteUser from './DeleteUser';

class Administration extends Component {
  constructor() {
    super();
    this.addNewUser = this.addNewUser.bind(this);
    this.closeLayer = this.closeLayer.bind(this);
    this.deleteUser = this.deleteUser.bind(this);

    this.state = {
      showAddNewUser: false,
      showDelete: false,
      id: null // userId to delete
    };
  }

  addNewUser() {
    this.setState({ showAddNewUser: true });
  }


  /**
   * [Closes overlay and resets state]
   */
  closeLayer() {
    this.setState({ showAddNewUser: false, showDelete: false, id: null });
  }


  /**
   * [Shows delete user overlay and sets userId to delete]
   * @param  {[string]} id [User id]
   */
  deleteUser(id) {
    this.setState({ id, showDelete: true });
  }

  render() {
    return (
      <PageTemplate
        header={
          <Title>
            Administracija uporabnikov
            <Button plain icon={<UserAddIcon />} onClick={this.addNewUser} />
          </Title>
        }
      >
        <UsersTable deleteUser={this.deleteUser} />
        {(this.state.showAddNewUser) ? <AddEditNewUser closer={this.closeLayer} /> : null}
        {(this.state.showDelete) ?
          <DeleteUser closer={this.closeLayer} id={this.state.id} /> : null}
      </PageTemplate>
    );
  }
}

Administration.defaultProps = {
};

Administration.propTypes = {
};

export default Administration;
