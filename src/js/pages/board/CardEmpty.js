import React, { Component } from 'react';
import PropTypes from 'prop-types';

class CardEmpty extends Component {
  render() {
    return (
      <div style={{ height: this.props.height, width: this.props.width, borderRadius: 10, backgroundColor: 'white', borderStyle: 'solid', borderColor: '#dbd9d9', borderWidth: 1, marginLeft: 10, marginRight: 10 }} />
    );
  }
}

CardEmpty.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
};

export default CardEmpty;
