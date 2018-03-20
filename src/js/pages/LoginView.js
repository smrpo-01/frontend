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

const duration = 200;

const transitionStyles = {
  entering: 0,
  entered: 0.9,
  exited: 0,
};

const transitionStylesTransform = {
  entering: 0,
  entered: 30,
};


class LoginView extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      in: false,
      errorDescription: '',
    };
  }

  async handleForm() {
    const emailRegex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/;

    if (this.state.email === '' || this.state.password === '') {
      this.setState({
        in: true,
        errorDescription: 'Izpolnite obe polji.',
      });
      return;
    } else if (!this.state.email.match(emailRegex) || this.state.password.length < 6) {
      console.log(this.state.email.match(emailRegex), this.state.password);
      this.setState({
        in: true,
        errorDescription: 'Nepravilen vnos, poskusite ponovno.',
      });
      return;
    }
    try {
      const res = await fetch('http://127.0.0.1:5000/', { method: 'GET', headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      } });

      console.log(res);

      const token = 'pridobljen od resa';
      this.props.handler(token);
    } catch (err) {
      console.log(err);
      this.setState({
        in: true,
        errorDescription: 'Povezava na strežnik neuspešna.',
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
        <Transition in={this.state.in} timeout={duration}>
          {status => (<Notification className={'notification'}
            state={this.state.errorDescription}
            message='Napaka pri prijavi!'
            status='critical'
            style={{
              opacity: transitionStyles[status],
              transform: `translate(0, ${transitionStylesTransform[status]}px)`,
              transition: `all ${duration}ms ease-in-out`,
            }}
          />)
          }
        </Transition>
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
                type='password'
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
      </Box>
    );
  }
}

LoginView.defaultProps = {
  handler: null,
};

LoginView.propTypes = {
  handler: PropTypes.func,
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
