import React, { Component } from 'react';
import BoardContent from './BoardContent';

// Template
import PageTemplate from '../../templates/PageTemplate';

import Title from 'grommet/components/Title';

class Board extends Component {
  render() {
    return (
        <BoardContent />
    );
  }
}

Board.defaultProps = {
};

Board.propTypes = {
};

export default Board;
