import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Grommmet Components
import Layer from 'grommet/components/Layer';

// Documentation
import * as documentation from '../documentation/Documentation';

/**
 * Component for help drawer
 */
class HelpOverlay extends Component {
  selectContent(page) {
    switch (page) {
      case '/administration':
        return documentation.userAdmin;
      case '/home':
        return documentation.helpTemplate;
      case '/analitycs':
        return documentation.graphsHelp;
      case '/management':
        return documentation.teamManagement;
      case '/board':
        return documentation.helpTemplate;
      default:
        return null;
    }
  }

  render() {
    return (
      <Layer
        closer={true}
        onClose={this.props.onClose}
        overlayClose
        align='right'
      >
        {this.selectContent(this.props.page)}
      </Layer>
    );
  }
}

HelpOverlay.defaultProps = {
};

HelpOverlay.propTypes = {
  page: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default HelpOverlay;
