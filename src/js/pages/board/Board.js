import React, { Component } from 'react';
import BoardCustom from './BoardCustom';
import Title from 'grommet/components/Title';

import Anchor from 'grommet/components/Anchor';


class Board extends Component {
  render() {
    return (
      <div>
        <div style={{ backgroundColor: 'red', display: 'flex', justifyContent: 'space-between' }}>
          <Title style={{ marginLeft: 20, marginTop: 10, marginBottom: 15 }}>
            Board
          </Title>
          <div style={{ marginRight: 30, display: 'flex' }}>

          </div>
        </div>
        <BoardCustom />
      </div>
    );
  }
}

Board.defaultProps = {
};

Board.propTypes = {
};

export default Board;
