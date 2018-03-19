import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Grommet components
import Box from 'grommet/components/Box';
import Article from 'grommet/components/Article';
import LoginForm from 'grommet/components/LoginForm';

class Login extends Component {
  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(res) {
    // console.log(this.props);
    // get username and password
    // const {username, password} = res;

    // validate input (regex for mail, min requirements for password)

    // authenticate user

    // update application state with auth response
    this.props.authenticateUser(res);

    // navigate to home page
    this.props.history.push('/home');
  }

  render() {
    return (
      <Article
        colorIndex='light-1'
        justify='center'
        align='center'
        basis='full'
        appCentered
        full
      >
        <Box colorIndex='light-2'>
          <LoginForm
            onSubmit={res => this.onSubmit(res)}
            logo={<s />}
            title='Emineo'
            secondaryText='Please log in.'
            rememberMe={false}
          />
        </Box>

      </Article>
    );
  }
}

Login.defaultProps = {
};

Login.propTypes = {
  authenticateUser: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

export default Login;
