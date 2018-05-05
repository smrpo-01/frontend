import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Heading from 'grommet/components/Heading';

/**
 * This component should be used in Grommet form where you want to separate
 * some fields with form heading
 * This component renders form legend
 */
class FormLegend extends Component {
  render() {
    return (
      <legend>
        <Heading
          tag={this.props.tag}
          margin={this.props.margin}
          strong={this.props.strong}
        >
          {this.props.label}
        </Heading>
      </legend>
    );
  }
}

FormLegend.defaultProps = {
  tag: 'h4',
  strong: false,
  margin: 'small'
};

FormLegend.propTypes = {
  tag: PropTypes.string,
  strong: PropTypes.bool,
  margin: PropTypes.oneOf(['none', 'small', 'medium', 'large']),
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired
};

export default FormLegend;
