/* eslint no-undef: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Grommmet Components
import Anchor from 'grommet/components/Anchor';
import Box from 'grommet/components/Box';
import Label from 'grommet/components/Label';
import Header from 'grommet/components/Header';
import Title from 'grommet/components/Title';
import Image from 'grommet/components/Image';
import Section from 'grommet/components/Section';
import Menu from 'grommet/components/Menu';
import Button from 'grommet/components/Button';

// Icons
import AnalyticsIcon from 'grommet/components/icons/base/Analytics';
import LogoutIcon from 'grommet/components/icons/base/Logout';
import UserSettingsIcon from 'grommet/components/icons/base/UserSettings';
import TableIcon from 'grommet/components/icons/base/Table';
import HomeIcon from 'grommet/components/icons/base/Home';
import VmMaintenanceIcon from 'grommet/components/icons/base/VmMaintenance';
import UserIcon from 'grommet/components/icons/base/User';
import HelpIcon from 'grommet/components/icons/base/Help';

import HelpOverlay from '../components/HelpOverlay';

const imgUri = process.env.NODE_ENV === 'development' ? '/' : '/static/app/';

class AppHeader extends Component {
  constructor() {
    super();
    this.closeHelp = this.closeHelp.bind(this);

    this.state = {
      menuItems: [
        { id: 1, itemName: 'Domov', route: '/home', icon: <HomeIcon /> },
        { id: 2, itemName: 'Vzdrževanje', route: '/management', icon: <VmMaintenanceIcon /> },
        { id: 3, itemName: 'Tabla', route: '/board', icon: <TableIcon /> },
        { id: 4, itemName: 'Administracija uporabnikov', route: '/administration', icon: <UserSettingsIcon /> },
        { id: 5, itemName: 'Analiza', route: '/analitycs', icon: <AnalyticsIcon /> },
      ],
      userRoles: [],
      email: '',
      showHelp: false
    };
  }


  // Set user roles
  componentWillMount() {
    // eslint-disable-next-line no-undef
    const user = sessionStorage.getItem('user');
    const userRoles = JSON.parse(user).roles;
    const email = JSON.parse(user).email;
    this.setState({ userRoles, email });
  }


  /**
   * [Array intersection]
   * @param  {[array]} arr1 [First array]
   * @param  {[array]} arr2 [Second array]
   * @return {[bool]}      [Returns true if two array have at least one element in intersection]
   */
  arrIntersection(arr1, arr2) {
    // eslint-disable-next-line
    let result = arr1.reduce((r, a) => arr2.includes(a) && r.concat(a) || r, []);
    if (result.length > 0) return true;
    return false;
  }


  // Validates user role for specific route
  checkRoleForPath(route) {
    const roles = this.state.userRoles;
    const rolesForManagement = ['km'];

    switch (route) {
      case '/home':
        return true;
      case '/board':
        return true;
      case '/administration':
        return ((roles.find(el => el === 'admin')) !== undefined);
      case '/management':
        return this.arrIntersection(roles, rolesForManagement);
      case '/analitycs':
        return true;
      default:
        return false;
    }
  }


  closeHelp() {
    this.setState({ showHelp: false });
  }


  render() {
    return (
      <Header
        justify='between'
        colorIndex='neutral-1'
        fixed={true}
      >
        <Section
          direction='row'
          pad={{ horizontal: 'medium', vertical: 'small', between: 'large' }}
          full='horizontal'
        >
          {(this.props.sidebarVisible) ?
            null :
            <Title onClick={null} >
              <Image
                className='header-logo'
                src={imgUri + 'img/random-logo2.png'}
              />
              Emineo
            </Title>
          }
          {/* Render menu items */}
          <Menu
            inline={true}
            direction='row'
            size='medium'>
            {this.state.menuItems.map((item) => {
              if (this.checkRoleForPath(item.route)) {
                return (
                  <Anchor
                    key={item.id}
                    path={item.route}
                    icon={item.icon}
                  >
                    {item.itemName}
                  </Anchor>
                );
              }
              return null;
            })}
          </Menu>
        </Section>
        {/* Show username */}
        <Box direction='row' justify='between' size='small'>
          <UserIcon />
          <Label margin='none'>{this.state.email}</Label>
        </Box>

        {/* Show help */}
        <Box direction='row' justify='between' size='small'>
          <Button
            plain
            label='Pomoč'
            icon={<HelpIcon />}
            onClick={() => this.setState({ showHelp: true })} />
        </Box>

        {/* Logout button */}
        <Button
          plain
          label='Odjava'
          icon={<LogoutIcon />}
          href='../'
          onClick={() => this.props.logoutUser()} />

        {(this.state.showHelp) && <HelpOverlay page={location.pathname} onClose={this.closeHelp} />}
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
  // eslint-disable-next-line
  toggleSidebar: PropTypes.func.isRequired,
  sidebarVisible: PropTypes.bool.isRequired,
  logoutUser: PropTypes.func,
};

export default AppHeader;
