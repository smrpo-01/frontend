import React, { Component } from 'react';

// Grommmet Components
import Anchor from 'grommet/components/Anchor';
import Header from 'grommet/components/Header';
import Footer from 'grommet/components/Footer';
import Box from 'grommet/components/Box';
import Menu from 'grommet/components/Menu';
import Sidebar from 'grommet/components/Sidebar';
import Title from 'grommet/components/Title';

class NavSidebar extends Component {
  render() {
    return (
      <Sidebar colorIndex='neutral-1'>
        <Header pad='medium'
          justify='between'>
          <Title>
            Title
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

export default NavSidebar;
