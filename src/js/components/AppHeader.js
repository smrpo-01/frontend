import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Grommmet Components
import Anchor from 'grommet/components/Anchor';
import Header from 'grommet/components/Header';
import Title from 'grommet/components/Title';
import Box from 'grommet/components/Box';
import Section from 'grommet/components/Section';

import Button from 'grommet/components/Button';
import LogoutIcon from 'grommet/components/icons/base/Logout';

class AppHeader extends Component {
  constructor() {
    super();
    this.state = {
      menuItems: [
        { id: 1, itemName: 'Home', route: '/home' },
        { id: 2, itemName: 'Management', route: '/management' },
        { id: 3, itemName: 'Board', route: '/board' },
      ]
    };
  }

  render() {
    return (
      <Header
        flex={true}
        justify='between'
        style={{ backgroundColor: '#f2efeb' }}
      >
        <Section direction='row' pad={{ horizontal: 'small', vertical: 'small', between: 'large' }}>
          {(this.props.sidebarVisible) ?
            null :
            <Title onClick={this.props.toggleSidebar} >Emineo</Title>
          }
          {/* Render menu items */}
          {this.state.menuItems.map(item =>
            (<Anchor
              key={item.id}
              path={{ path: item.route, index: true }}
            >
              {item.itemName}
            </Anchor>)
          )}
        </Section>
        <Box
          justify='end'
          direction='row'
          responsive={false}>
          <Button icon={<LogoutIcon />} href='../' onClick={() => this.props.logoutUser()} />
        </Box>
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
