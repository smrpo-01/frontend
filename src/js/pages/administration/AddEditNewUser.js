import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Grommet components
import Article from 'grommet/components/Article';
import Button from 'grommet/components/Button';
import Form from 'grommet/components/Form';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import FormFields from 'grommet/components/FormFields';
import FormField from 'grommet/components/FormField';
import Footer from 'grommet/components/Footer';
import Layer from 'grommet/components/Layer';
import TextInput from 'grommet/components/TextInput';
import PasswordInput from 'grommet/components/PasswordInput';
import CheckBox from 'grommet/components/CheckBox';

const emailRegex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/;

class AddEditNewUser extends Component {
  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);
    this.validateInput = this.validateInput.bind(this);

    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      roles: {
        admin: false,
        kanban: false,
        dev: false,
        po: false,
        user: false
      },
      error: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: ''
      },
      onSubmit: this.onSubmit
    };
  }

  // TODO update roles on edit
  componentWillMount() {
    if (this.props.modeEdit) {
      console.log('on mount data');
      console.log(this.props.editData);
      this.setState({
        firstName: this.props.editData.firstName,
        lastName: this.props.editData.lastName,
        email: this.props.editData.email,
        password: ''
      });
    }
  }

  onCheckBoxChange(id) {
    // eslint-disable-next-line
    let tmpRoles = this.state.roles;
    tmpRoles[id] = !tmpRoles[id];
    this.setState({ roles: tmpRoles });
  }


  onSubmit() {
    console.log('on submit');
    this.setState({ onSubmit: null });
    if (this.validateInput()) {
      console.log('send mutation - TODO');
    }
  }


  validateInput() {
    // eslint-disable-next-line
    let error = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: ''
    };
    // reset errors before validating input
    this.setState({ error });
    let formIsValid = true;

    if (!this.state.email.match(emailRegex)) { error.email = 'Nepravilen format'; formIsValid = false; }
    if (this.state.firstName === '') { error.firstName = 'Obvezno polje'; formIsValid = false; }
    if (this.state.lastName === '') { error.lastName = 'Obvezno polje'; formIsValid = false; }
    if (this.state.email === '') { error.email = 'Obvezno polje'; formIsValid = false; }
    if (this.state.password === '') { error.password = 'Obvezno polje'; formIsValid = false; }
    if (Object.values(this.state.roles).find(el => el === true) === undefined) { error.role = 'Dolocite vsaj eno vlogo'; formIsValid = false; }

    this.setState({ error, onSubmit: this.onSubmit });
    return formIsValid;
  }


  render() {
    console.log(this.props);
    return (
      <Layer
        closer
        align='right'
      >
        <Article pad='small'>
          <Form>

            <Header pad={{ vertical: 'medium' }}>
              <Heading>
                Dodaj novega uporabnika
              </Heading>
            </Header>

            <FormFields>
              <FormField label='Ime' error={this.state.error.firstName}>
                <TextInput
                  id='firstName'
                  value={this.state.firstName}
                  placeHolder='Janez'
                  onDOMChange={event => this.setState({ firstName: event.target.value })}
                />
              </FormField>

              <FormField label='Priimek' error={this.state.error.lastName}>
                <TextInput
                  id='lastName'
                  value={this.state.lastName}
                  placeHolder='Novak'
                  onDOMChange={event => this.setState({ lastName: event.target.value })}
                />
              </FormField>

              <FormField label='Email' error={this.state.error.email}>
                <TextInput
                  id='email'
                  value={this.state.email}
                  placeHolder='Janez'
                  onDOMChange={event => this.setState({ email: event.target.value })}
                />
              </FormField>

              <FormField label='Geslo' error={this.state.error.password}>
                <PasswordInput
                  id='password'
                  value={this.state.password}
                  onChange={event => this.setState({ password: event.target.value })}
                />
              </FormField>

              <FormField label='Uporabniške vloge' error={this.state.error.role}>
                <CheckBox id='admin' label='Administrator' checked={this.state.roles.admin} onChange={event => this.onCheckBoxChange(event.target.id)} />
                <CheckBox id='kanban' label='KanbanMaster' checked={this.state.roles.kanban} onChange={event => this.onCheckBoxChange(event.target.id)} />
                <CheckBox id='po' label='Product Owner' checked={this.state.roles.po} onChange={event => this.onCheckBoxChange(event.target.id)} />
                <CheckBox id='dev' label='Razvijalec' checked={this.state.roles.dev} onChange={event => this.onCheckBoxChange(event.target.id)} />
                <CheckBox id='user' label='Uporabnik' checked={this.state.roles.user} onChange={event => this.onCheckBoxChange(event.target.id)} />
              </FormField>

            </FormFields>

            <Footer pad={{ vertical: 'medium', between: 'medium' }}>
              <Button label='Prekliči'
                secondary={true}
                onClick={() => this.props.closer()}
              />
              <Button label='Dodaj'
                primary={true}
                onClick={this.state.onSubmit}
              />
            </Footer>
          </Form>
        </Article>
      </Layer>
    );
  }
}

AddEditNewUser.defaultProps = {
  modeEdit: false,
  editData: null
};

AddEditNewUser.propTypes = {
  closer: PropTypes.func.isRequired,
  modeEdit: PropTypes.bool,
  editData: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string
  })
};

export default AddEditNewUser;
