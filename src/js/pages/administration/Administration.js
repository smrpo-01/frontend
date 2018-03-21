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

class Administration extends Component {
  constructor() {
    super();
    this.addNewUser = this.addNewUser.bind(this);
    this.closeLayer = this.closeLayer.bind(this);

    this.state = {
      showAddNewUser: false
    };
  }

  addNewUser() {
    this.setState({ showAddNewUser: true });
  }

  closeLayer() {
    this.setState({ showAddNewUser: false });
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
        <UsersTable />
        {(this.state.showAddNewUser) ? <AddEditNewUser closer={this.closeLayer} /> : null}
      </PageTemplate>
    );
  }
}

Administration.defaultProps = {
};

Administration.propTypes = {
};

export default Administration;
