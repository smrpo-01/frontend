import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Grommmet Components
import Anchor from 'grommet/components/Anchor';
import Header from 'grommet/components/Header';
import Title from 'grommet/components/Title';
// import Box from 'grommet/components/Box';
import Image from 'grommet/components/Image';
import Section from 'grommet/components/Section';
import Menu from 'grommet/components/Menu';

import Button from 'grommet/components/Button';

// Icons
import LogoutIcon from 'grommet/components/icons/base/Logout';
import UserSettingsIcon from 'grommet/components/icons/base/UserSettings';
import TableIcon from 'grommet/components/icons/base/Table';
import HomeIcon from 'grommet/components/icons/base/Home';
import VmMaintenanceIcon from 'grommet/components/icons/base/VmMaintenance';

class AppHeader extends Component {
  constructor() {
    super();
    this.state = {
      menuItems: [
        { id: 1, itemName: 'Domov', route: '/home', icon: <HomeIcon /> },
        { id: 2, itemName: 'Management', route: '/management', icon: <VmMaintenanceIcon /> },
        { id: 3, itemName: 'Tabla', route: '/board', icon: <TableIcon /> },
        { id: 4, itemName: 'Administracija uporabnikov', route: '/administration', icon: <UserSettingsIcon /> }
      ]
    };
  }

  render() {
    return (
      <Header
        justify='between'
        colorIndex='neutral-1'
      >
        <Section
          direction='row'
          pad={{ horizontal: 'medium', vertical: 'small', between: 'large' }}
          full='horizontal'
        >
          {(this.props.sidebarVisible) ?
            null :
            <Title onClick={this.props.toggleSidebar} >
              <Image
                className='header-logo'
                src='./img/random-logo2.png'
              />
              Emineo
            </Title>
          }
          {/* Render menu items */}
          <Menu
            inline={true}
            direction='row'
            size='medium'>
            {this.state.menuItems.map(item =>
              (<Anchor
                key={item.id}
                path={item.route}
                icon={item.icon}
              >
                {item.itemName}
              </Anchor>)
            )}
          </Menu>
        </Section>

        {/* Logout button */}
        <Button
          plain
          label='Odjava'
          icon={<LogoutIcon />}
          href='../'
          onClick={() => this.props.logoutUser()} />
      </Header>
    );
  }
}

AppHeader.defaultProps = {
  toggleSidebar: () => {},
  sidebarVisible: false,
  logoutUser: null,
};

AppHeader.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
  sidebarVisible: PropTypes.bool.isRequired,
  logoutUser: PropTypes.func,
};

export default AppHeader;
