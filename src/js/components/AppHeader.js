import React, { Component } from 'react';

// Grommmet Components
import Anchor from 'grommet/components/Anchor';
import Header from 'grommet/components/Header';
import Title from 'grommet/components/Title';

class AppHeader extends Component {
  constructor() {
    super();
    this.state = {
      menuItems: [
        { id: 1, itemName: 'Page 1', route: '/page1' },
        { id: 2, itemName: 'Page 2', route: '/page2' },
        { id: 3, itemName: 'Page 3', route: '/page3' },
      ]
    };
  }

  render() {
    return (
      <Header
        pad={{ horizontal: 'small', vertical: 'small', between: 'medium' }}
      >
        <Title>Emineo</Title>

        {/* Render menu items */}
        {this.state.menuItems.map(item =>
          (<Anchor
            key={item.id}
            path={{ path: item.route, index: true }}
          >
            {item.itemName}
          </Anchor>)
        )}
      </Header>
    );
  }
}

export default AppHeader;
