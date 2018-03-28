import React, { Component } from 'react';

class CardEmpty extends Component {
  render() {
    return (
      <div style={{backgroundColor: 'red', height: this.props.height, width: this.props.width, borderRadius: 10, backgroundColor: 'white', borderStyle: 'solid', borderColor: '#dbd9d9', borderWidth: 1, marginLeft: 10, marginRight: 10}} />
    );
  }
}

export default CardEmpty;
