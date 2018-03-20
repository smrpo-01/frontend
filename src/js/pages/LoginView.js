import React, { Component } from 'react';
import { Transition } from 'react-transition-group';
import PropTypes from 'prop-types';

import Box from 'grommet/components/Box';
import Section from 'grommet/components/Section';
import Image from 'grommet/components/Image';
import TextInput from 'grommet/components/TextInput';
import Button from 'grommet/components/Button';
import Notification from 'grommet/components/Notification';

import CheckmarkIcon from 'grommet/components/icons/base/Checkmark';


import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const duration = 1300;

const transitionStyles = {
  entering: 0,
  entered: 1,
  exited: 0,
};


class LoginView extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      in: false,
    };
  }

  async handleForm() {
    this.setState({
      in: false,
    });
    try {
      const res = await this.props.mutate({
        variables: {
          email: this.state.email,
          password: this.state.password,
        }
      });
      console.log(res);
    } catch (err) {
      console.log(err);
      this.setState({
        in: true,
      });
    }
  }

  render() {
    return (
      <Box
        colorIndex='light-2'
        direction='row'
        justify='center'
        align='center'
        full>
        <Section
          colorIndex='light-1'
          align='center'
          size='large'
          className='container'>
          <Image
            className='logo'
            src='./img/random-logo2.png'
            size='small' />
          <Box className='form' justify='center'>
            <Box direction='row' className='formBox' align='center' justify='center'>
              <Image src='./img/user.png' className='formLogo' />
              <TextInput
                placeHolder='Email naslov'
                value={this.state.email}
                onDOMChange={event => this.setState({ email: event.target.value })}
              />
            </Box>
            <Box direction='row' className='formBox' align='center' justify='center'>
              <Image src='./img/padlock.png' className='formLogo' />
              <TextInput
                placeHolder='Geslo'
                value={this.state.password}
                onDOMChange={event => this.setState({ password: event.target.value })}
              />
            </Box>
          </Box>
          <Button
            primary={true}
            className='loginButton'
            icon={<CheckmarkIcon />}
            label='Prijava'
            onClick={() => this.handleForm()}
          />
        </Section>
        <Transition in={this.state.in} timeout={duration}>
          {(status) => {
            console.log(status);
            return (<Notification className={`notification notification-${status}`}
              state='Sample state'
              message='Napaka pri prijavi'
              status='critical'
              style={{
                opacity: transitionStyles[status],
                transition: `opacity ${duration}ms ease-in-out`
              }}
            />
            );
          }
          }
        </Transition>
      </Box>
    );
  }
}

LoginView.defaultProps = {
  mutate: null,
};

LoginView.propTypes = {
  mutate: PropTypes.func,
};

const submitForm = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      email
      token
    }
  }
`;

export default graphql(submitForm)(LoginView);
