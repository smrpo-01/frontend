import React, { Component } from 'react';

// Grommet components
import App from 'grommet/components/App';
import Article from 'grommet/components/Article';
import Section from 'grommet/components/Section';
import Split from 'grommet/components/Split';

// Custom components
import AppHeader from './components/AppHeader';
import NavSidebar from './components/NavSidebar';

class MainApp extends Component {
  render() {
    // console.log(this.props);

    return (
      <App centered={false}>
        {/* Split view */}
        <Split
          separator={false}
          flex='right'
        >
          {/* Application sidebar */}
          <NavSidebar />

          {/* Main application content */}
          <Article>
            {/* Application header */}
            <AppHeader />

            {/* Main application content */}
            <Section colorIndex='light-2'
              justify='center'
              align='center'
              pad='medium'
              full
            >
              Main application content
            </Section>

            {/* Footer */}
            {/* Place app footer if needed */}
          </Article>
        </Split>
      </App>
    );
  }
}

export default MainApp;
