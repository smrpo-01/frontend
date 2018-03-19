import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Grommmet Components
import Anchor from 'grommet/components/Anchor';
import Header from 'grommet/components/Header';
import Title from 'grommet/components/Title';

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
        pad={{ horizontal: 'small', vertical: 'small', between: 'medium' }}
      >
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
      </Header>
    );
  }
}

AppHeader.defaultProps = {
  toggleSidebar: () => {},
  sidebarVisible: false
};

AppHeader.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
  sidebarVisible: PropTypes.bool.isRequired
};

export default AppHeader;
