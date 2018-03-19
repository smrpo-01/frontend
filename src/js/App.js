import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router';

// Grommet components
import App from 'grommet/components/App';
import Article from 'grommet/components/Article';
import Section from 'grommet/components/Section';
import Split from 'grommet/components/Split';

// Custom components
import AppHeader from './components/AppHeader';
import NavSidebar from './components/NavSidebar';

// App sub pages
import Home from './pages/home/Home';
import Board from './pages/board/Board';
import Management from './pages/management/Management';
import Login from './pages/login/Login';

class MainApp extends Component {
  constructor() {
    super();
    this.authenticateUser = this.authenticateUser.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);

    this.state = {
      sidebarVisible: false,
      userAuthenticated: false,
      user: {
        name: '',
        type: '',
        roles: []
      },
      appState: {}
    };
  }


  /**
   * Toggles sidebar visibility
   */
  toggleSidebar() {
    this.setState({ sidebarVisible: !this.state.sidebarVisible });
  }

  /**
   * Callback to set app state for user authentication
   */
  authenticateUser() {
    this.setState({ userAuthenticated: true });
  }

  render() {
    return (
      <App centered={false}>
        {/* Split view */}
        <Split
          separator={false}
          flex='right'
        >
          {/* Application sidebar */}
          {(this.state.sidebarVisible) ? <NavSidebar toggleSidebar={this.toggleSidebar} /> : null}

          {/* Main application content */}
          <Article>
            {/* Application header */}
            {(this.state.userAuthenticated) ?
              <AppHeader
                toggleSidebar={this.toggleSidebar}
                sidebarVisible={this.state.sidebarVisible}
              /> :
              null
            }

            {/* Main application content */}
            <Section
              pad={{ horizontal: 'medium', vertical: 'none' }}
              full
            >
              <Switch>
                <Route exact path='/' render={props =>
                  (this.state.userAuthenticated ? (
                    <Redirect to='/home' />
                  ) : (
                    <Login authenticateUser={this.authenticateUser} {...props} />
                  )
                  )}
                />
                <Route exact path='/home' render={props => (<Home {...props} />)} />
                <Route exact path='/management' render={props => (<Management {...props} />)} />
                <Route exact path='/board' render={props => (<Board {...props} />)} />
                <Redirect to='/' />
              </Switch>

            </Section>

            {/* Footer */}
            {/* Place app footer here if needed */}
          </Article>
        </Split>
      </App>
    );
  }
}

export default MainApp;
