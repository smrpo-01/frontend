import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Grommmet Components
import Anchor from 'grommet/components/Anchor';
import Header from 'grommet/components/Header';
import Footer from 'grommet/components/Footer';
import Box from 'grommet/components/Box';
import Menu from 'grommet/components/Menu';
import Sidebar from 'grommet/components/Sidebar';
import Title from 'grommet/components/Title';

/**
 * Component for sidebar
 * For now it does not perform any specific role.
 * It's prepared if we'll need additional way to handle menu, etc.
 */
class NavSidebar extends Component {
  render() {
    return (
      <Sidebar colorIndex='neutral-1-a'>
        <Header pad='medium'
          justify='between'>
          <Title onClick={this.props.toggleSidebar}>
            Emineo
          </Title>
        </Header>
        <Box flex='grow'
          justify='start'>
          <Menu primary={true}>
            <Anchor path={{ path: '/page1', index: true }}>
              First
            </Anchor>
            <Anchor path={{ path: '/page2', index: true }}>
              Second
            </Anchor>
            <Anchor path={{ path: '/page3', index: true }}>
              Third
            </Anchor>
          </Menu>
        </Box>
        <Footer pad='medium'>
          <span>footer</span>
        </Footer>
      </Sidebar>
    );
  }
}

NavSidebar.defaultProps = {
  toggleSidebar: () => {},
};

NavSidebar.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
};

export default NavSidebar;
