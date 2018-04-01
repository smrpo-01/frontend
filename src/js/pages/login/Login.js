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

const duration = 200;

const transitionStyles = {
  entering: 0,
  entered: 0.9,
  exited: 0,
};

const transitionStylesTransform = {
  entering: 0,
  entered: 30,
  exited: 0,
};

const imgUri = process.env.NODE_ENV === 'development' ? './' : "{% static 'app' %}/";

class Login extends Component {
  constructor() {
    super();
    this.handleForm = this.handleForm.bind(this);

    this.state = {
      email: '',
      password: '',
      in: false,
      errorDescription: '',
      onSubmit: this.handleForm
    };
  }


  handleForm() {
    const emailRegex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/;

    this.setState({ in: false, onSubmit: null });

    if (this.state.email === '' || this.state.password === '') {
      this.setState({
        in: true,
        errorDescription: 'Izpolnite obe polji.',
      });
    } else if (!this.state.email.match(emailRegex) || this.state.password.length < 6) {
      this.setState({
        in: true,
        errorDescription: 'Nepravilen vnos, poskusite ponovno.',
      });
    } else {
      fetch('http://127.0.0.1:8000/login/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: this.state.email, password: this.state.password })
      })
        .then(res => res.json())
        .then((json) => {
          // console.log(json);
          const { token, user } = json;
          if (!token) {
            this.setState({
              in: true,
              errorDescription: json.non_field_errors[0],
              onSubmit: this.handleForm
            });
          } else {
            this.props.saveUserData(user);
            this.props.handler(token);
          }
        })
        .catch((err) => {
          console.log(err);
          this.setState({
            in: true,
            errorDescription: 'Povezava na strežnik neuspešna.',
            onSubmit: this.handleForm
          });
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
            src={imgUri + 'img/random-logo2.png'}
            size='small' />
          <Box className='form' justify='center'>
            <Box direction='row' className='formBox' align='center' justify='center'>
              <Image src={imgUri + 'img/user.png'} className='formLogo' />
              <TextInput
                placeHolder='Email naslov'
                value={this.state.email}
                onDOMChange={event => this.setState({ email: event.target.value })}
              />
            </Box>
            <Box direction='row' className='formBox' align='center' justify='center'>
              <Image src={imgUri + 'img/padlock.png'} className='formLogo' />
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
            onClick={this.state.onSubmit}
          />
        </Section>
      </Box>
    );
  }
}

Login.defaultProps = {
  handler: null,
};

Login.propTypes = {
  handler: PropTypes.func.isRequired,
  saveUserData: PropTypes.func.isRequired
};

export default Login;
