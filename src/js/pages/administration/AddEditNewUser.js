import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

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

const addUserMutation = gql`
  mutation createUser($user: CreateUserInput!) {
    createUser(userData: $user) {
      user {
        id
      }
    }
  }
`;

const editUserMutation = gql`
  mutation editUser($user: EditUserInput!) {
    editUser(userData: $user) {
      user {
        email
        roles {
          id
        }
      }
    }
  }
`;


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
        po: false
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


  /**
   * [Set component state when displaying edit data]
   * @return {[type]} [description]
   */
  componentWillMount() {
    if (this.props.modeEdit) {
      let tmpRoles = this.state.roles;
      // vem da ni lepo ampak dela
      for (let i = 0; i < this.props.editData.roles.length; i++) {
        let role = this.props.editData.roles[i];
        if (role === 'admin') tmpRoles.admin = true;
        if (role === 'kanban') tmpRoles.kanban = true;
        if (role === 'po') tmpRoles.po = true;
        if (role === 'dev') tmpRoles.dev = true;
      }

      this.setState({
        firstName: this.props.editData.firstName,
        lastName: this.props.editData.lastName,
        email: this.props.editData.email,
        password: '',
        roles: tmpRoles
      });
    }
  }


  // CheckBox handler
  onCheckBoxChange(id) {
    // eslint-disable-next-line
    let tmpRoles = this.state.roles;
    tmpRoles[id] = !tmpRoles[id];
    this.setState({ roles: tmpRoles });
  }


  /**
   * [onSubmit button handler. Call approprite mutation]
   */
  onSubmit() {
    this.setState({ onSubmit: null });
    if (this.validateInput()) {
      const tmpRoles = this.mapRoles(this.state.roles);
      let userData = {
        user: {
          email: this.state.email,
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          roles: tmpRoles
        }
      };


      if (this.props.modeEdit) {
        if (this.state.password !== '') userData.user.password = this.state.password;
        this.props.editUserMutation({ variables: userData })
          .then(this.props.closer())
          .catch(err => console.log(err));
      } else {
        userData.user.password = this.state.password;
        this.props.addUserMutation({ variables: userData })
          .then(this.props.closer())
          .catch(err => console.log(err));
      }
    }
  }


  /**
   * Map CheckBox selection to userRoles
   * ADMIN = 1
   * PRODUCT_OWNER = 2
   * KANBAN_MASTER = 3
   * DEV = 4
   * @param  {[object]} roles [Roles object to map]
   * @return {[array]}       [Array of selected user roles]
   */
  mapRoles(roles) {
    // eslint-disable-next-line
    let tmpRoles = [];
    Object.keys(roles).map((role) => {
      switch (role) {
        case 'admin':
          if (roles[role]) tmpRoles.push(1);
          return null;
        case 'kanban':
          if (roles[role]) tmpRoles.push(3);
          return null;
        case 'dev':
          if (roles[role]) tmpRoles.push(4);
          return null;
        case 'po':
          if (roles[role]) tmpRoles.push(2);
          return null;
        default:
          return null;
      }
    });
    return tmpRoles;
  }


  /**
   * [validates form]
   * @return {[bool]} [returns true if form is valid]
   */
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
    // password can be blank in edit mode (we do not update it)
    if (this.state.password === '' && !this.props.modeEdit) { error.password = 'Obvezno polje'; formIsValid = false; }
    if (Object.values(this.state.roles).find(el => el === true) === undefined) { error.role = 'Dolocite vsaj eno vlogo'; formIsValid = false; }

    this.setState({ error, onSubmit: this.onSubmit });
    return formIsValid;
  }


  render() {
    return (
      <Layer
        closer
        align='right'
      >
        <Article pad='small'>
          <Form>

            <Header pad={{ vertical: 'medium' }}>
              <Heading>
                {(this.props.modeEdit) ? 'Uredi uporabnika' : 'Dodaj uporabnika'}
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
    email: PropTypes.string,
    roles: PropTypes.array
  }),
  addUserMutation: PropTypes.func.isRequired,
  editUserMutation: PropTypes.func.isRequired
};


const AddEditNewUserWithMutations = compose(
  graphql(addUserMutation, {
    name: 'addUserMutation'
  }),
  graphql(editUserMutation, {
    name: 'editUserMutation'
  })
)(AddEditNewUser);

export default AddEditNewUserWithMutations;
