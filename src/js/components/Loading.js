import React, { Component } from 'react';

import Box from 'grommet/components/Box';
import Spinning from 'grommet/components/icons/Spinning';

/**
 * This component should be used when Apollo data.loading is true
 * This component renders spinning icon showing that data is being loaded
 */
class Loading extends Component {
  render() {
    return (
      <Box align='center' margin={{ vertical: 'medium' }}>
        <Spinning size='large' />
      </Box>
    );
  }
}

export default Loading;
