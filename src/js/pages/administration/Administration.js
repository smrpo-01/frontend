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

class Administration extends Component {
  constructor() {
    super();

    this.state = {};
  }

  addNewUser() {
    console.log('add new user');
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
      </PageTemplate>
    );
  }
}

Administration.defaultProps = {
};

Administration.propTypes = {
};

export default Administration;
