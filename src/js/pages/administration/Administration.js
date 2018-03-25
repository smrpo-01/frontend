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
    this.editUser = this.editUser.bind(this);

    this.state = {
      showAddEditUser: false,
      showDelete: false,
      editData: {},
      modeEdit: false,
      id: null // userId to delete
    };
  }

  addNewUser() {
    this.setState({ showAddEditUser: true });
  }

  editUser(modeEdit, editData) {
    this.setState({ showAddEditUser: true, modeEdit, editData });
  }


  /**
   * [Closes overlay and resets state]
   */
  closeLayer() {
    this.setState({
      showAddEditUser: false,
      showDelete: false,
      editData: {},
      modeEdit: false,
      id: null
    });
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
        <UsersTable deleteUser={this.deleteUser} editUser={this.editUser} />

        {/* Overlays */}
        {(this.state.showAddEditUser) ?
          <AddEditNewUser
            closer={this.closeLayer}
            editData={this.state.editData}
            modeEdit={this.state.modeEdit}
          />
          : null
        }

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
