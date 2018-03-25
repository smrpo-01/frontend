import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router';

// Grommet components
import Article from 'grommet/components/Article';
import Section from 'grommet/components/Section';
import Split from 'grommet/components/Split';

import Login from './pages/login/Login';

// Custom components
import AppHeader from './components/AppHeader';
import NavSidebar from './components/NavSidebar';

// App sub pages
import Home from './pages/home/Home';
import Board from './pages/board/Board';
import Management from './pages/management/Management';
import Administration from './pages/administration/Administration';

class MainApp extends Component {
  constructor() {
    super();
    this.authenticateUser = this.authenticateUser.bind(this);
    this.saveUserData = this.saveUserData.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);

    this.state = {
      sidebarVisible: false,
      userAuthenticated: true,
      appState: {
        token: '',
        userData: null
      }
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
  authenticateUser(token) {
    // eslint-disable-next-line no-undef
    localStorage.setItem('token', token);
    this.setState({ appState: { token } });
  }


  /**
   * [Saves user data to local storage. This data is used for routing permissions.
   * Function is called from child Login component.]
   * @param  {[object]} user [description]
   */
  saveUserData(user) {
    let userData = Object.assign({}, user);
    userData.roles = user.roles.map((val) => {
      switch (val) {
        case 1:
          return 'admin';
        case 2:
          return 'po';
        case 3:
          return 'km';
        default:
          return 'dev';
      }
    });
    // eslint-disable-next-line no-undef
    localStorage.setItem('user', JSON.stringify(userData));
    this.setState({ userData });
  }


  // Logout user by clearing localStorage
  logoutUser() {
    // eslint-disable-next-line no-undef
    localStorage.clear();
  }


  render() {
    // eslint-disable-next-line no-undef
    const token = localStorage.getItem('token');

    if (!token) return <Login handler={this.authenticateUser} saveUserData={this.saveUserData} />;

    return (
      <Split
        separator={true}
        flex='right'
      >
        {/* Application sidebar */}
        {(this.state.sidebarVisible) ? <NavSidebar toggleSidebar={this.toggleSidebar} /> : null}

        {/* Main application content */}
        <Article full>
          {/* Application header */}
          <AppHeader
            toggleSidebar={this.toggleSidebar}
            logoutUser={this.logoutUser}
            sidebarVisible={this.state.sidebarVisible}
          />

          {/* Main application content */}
          <Section
            pad={{ horizontal: 'medium', vertical: 'none' }}
          >
            <Switch>
              <Route exact path='/home' render={props => (<Home {...props} />)} />
              <Route exact path='/management' render={props => (<Management {...props} />)} />
              <Route exact path='/board' render={props => (<Board {...props} />)} />
              <Route path='/administration' render={props => (<Administration {...props} />)} />
              <Redirect to='/home' />
            </Switch>

          </Section>

          {/* Footer */}
          {/* Place app footer here if needed */}
        </Article>
      </Split>
    );
  }
}

export default MainApp;
