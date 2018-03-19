import React, { Component } from 'react';

// Template
import PageTemplate from '../../templates/PageTemplate';

// Grommet components
import Title from 'grommet/components/Title';

class Board extends Component {
  render() {
    return (
      <PageTemplate
        header={<Title>Board</Title>}
      >
        <span>content</span>
      </PageTemplate>
    );
  }
}

Board.defaultProps = {
};

Board.propTypes = {
};

export default Board;
