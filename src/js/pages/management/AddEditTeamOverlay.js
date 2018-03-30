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
import Title from 'grommet/components/Title';
import Section from 'grommet/components/Section';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import Select from 'grommet/components/Select';


// Icons
// import EditIcon from 'grommet/components/icons/base/Edit';
import TrashIcon from 'grommet/components/icons/base/Trash';

// const emailRegex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/;
// const alphaNumRegex = /^[a-zA-Z0-9šđčćžŠĐČĆŽ]*$/;
// import { allUsersQuery } from './UsersTable';

const addTeamMutation = gql`
  mutation createTeam($user: CreateUserInput!) {
    createUser(userData: $user) {
      user {
        id
      }
    }
  }
`;

const editTeamMutation = gql`
  mutation editTeam($user: EditUserInput!) {
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

export const allUsersQuery = gql`
  query AllUsersQuery {
    allUsers {
      id
      firstName
      lastName
      email
      isActive
      roles {
        name
      }
    }
  }
`;


class AddEditTeam extends Component {
  constructor() {
    super();
    this.filterSuggestions = this.filterSuggestions.bind(this);

    this.state = {
      allUsers: [],
      options: [],
      teamName: '',
      po: '',
      poId: '',
      km: '',
      kmId: '',
      dev: '',
      developers: [],
      error: {
        teamName: '',
        po: '',
        km: '',
        dev: ''
      },
      onSubmit: null
    };
  }

  componentWillReceiveProps(nextProps) {
    const { data: { error, allUsers } } = nextProps;

    if (error) console.error(error);

    if (this.state.allUsers.length === 0) {
      let users = allUsers.map(user => ({ value: user, label: user.firstName + ' ' + user.lastName }));
      console.log(users);
      this.setState({ allUsers: users, options: users });
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


  filterSuggestions(query) {
    let options = this.state.allUsers.filter(obj =>
      obj.label.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    // console.log(options);
    this.setState({ options });
  }

  addDeveloper(dev) {
    let developers = this.state.developers.slice();
    developers.push(dev);
    this.setState({ developers });
  }

  removeDev(id) {
    if (!this.props.modeEdit) {
      let developers = this.state.developers.slice();
      developers = developers.filter(dev => dev.id !== id);
      this.setState({ developers });
    } else {
      console.log('call mutation');
    }
  }

  render() {
    // console.log(this.props);
    // const { data: { loading, error, allUsers } } = this.props;

    return (
      <Layer
        closer
        align='right'
      >
        <Article pad='small'>
          <Form>

            <Header pad={{ vertical: 'medium' }}>
              <Heading>
                {(this.props.modeEdit) ? 'Uredi razvojno skupino' : 'Dodaj razvojno skupina'}
              </Heading>
            </Header>

            <FormFields>
              <FormField label='Ime skupine' error={this.state.error.teamName}>
                <TextInput
                  id='teamName'
                  value={this.state.teamName}
                  placeHolder='Ekipa 1'
                  onDOMChange={event => this.setState({ teamName: event.target.value })}
                />
              </FormField>

              <FormField label='Product owner' error={this.state.error.po}>
                <Select
                  id='po'
                  value={this.state.po}
                  placeHolder='Janez Novak'
                  options={this.state.options}
                  onChange={event =>
                    this.setState({
                      po: event.option.label,
                      poId: event.option.value.id,
                      options: this.state.allUsers
                    })}
                  onSearch={event => this.filterSuggestions(event.target.value)}
                />
              </FormField>

              <FormField label='Kanban master' error={this.state.error.km}>
                <Select
                  id='km'
                  value={this.state.km}
                  placeHolder='Janez Novak'
                  options={this.state.options}
                  onChange={event =>
                    this.setState({
                      km: event.option.label,
                      kmId: event.option.value.id,
                      options: this.state.allUsers
                    })}
                  onSearch={event => this.filterSuggestions(event.target.value)}
                />
              </FormField>
            </FormFields>

            <Section>
              <Header><Title>Ostali člani</Title></Header>
              <Section pad={{ vertical: 'small' }}>
                <Select
                  id='dev'
                  value={this.state.dev}
                  placeHolder='Janez Novak'
                  options={this.state.options}
                  onChange={event => this.addDeveloper(event.option.value)}
                  onSearch={event => this.filterSuggestions(event.target.value)}
                />
              </Section>

              <List>
                {this.state.developers.map(dev => (
                  <ListItem key={dev.id} justify='between' pad={{ horizontal: 'small' }}>
                    {dev.firstName + ' ' + dev.lastName}
                    <Button plain icon={<TrashIcon />} onClick={() => this.removeDev(dev.id)} />
                  </ListItem>
                ))}
              </List>
            </Section>

            {(this.state.error.generalError !== undefined) ?
              <Section className='color-red padding-bottom-0'>{this.state.error.generalError}</Section>
              : null
            }

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

AddEditTeam.defaultProps = {
  modeEdit: false,
  editData: null
};

AddEditTeam.propTypes = {
  closer: PropTypes.func.isRequired,
  modeEdit: PropTypes.bool,
  data: PropTypes.object.isRequired
  // addTeamMutation: PropTypes.func.isRequired,
  // editTeamMutation: PropTypes.func.isRequired
};


const AddEditTeamWithMutations = compose(
  graphql(addTeamMutation, {
    name: 'addTeamMutation'
  }),
  graphql(editTeamMutation, {
    name: 'editTeamMutation'
  }),
  graphql(allUsersQuery)
)(AddEditTeam);

export default AddEditTeamWithMutations;
