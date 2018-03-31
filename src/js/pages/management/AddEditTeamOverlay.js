import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

// Grommet components
import Article from 'grommet/components/Article';
import Button from 'grommet/components/Button';
import Box from 'grommet/components/Box';
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
const alphaNumRegex = /^[a-zA-Z0-9šđčćžŠĐČĆŽ]*$/;
import { allTeamsQuery } from './TeamTable';

const addTeamMutation = gql`
  mutation createTeam($team: CreateTeamInput!) {
    createTeam(teamData: $team) {
      ok
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
    this.validateForm = this.validateForm.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      allUsers: [],
      options: [],
      teamName: '',
      po: '',
      poId: '',
      poObj: null,
      km: '',
      kmId: '',
      kmObj: null,
      dev: '',
      developers: [],
      error: {
        teamName: '',
        po: '',
        km: '',
        dev: '',
        general: ''
      },
      onSubmit: this.onSubmit
    };
  }

  componentWillMount() {
    if (this.props.modeEdit) {
      console.log(this.props.editData);

      this.setState({
        teamName: this.props.editData.name,
        po: this.props.editData.productOwner.firstName + ' ' + this.props.editData.productOwner.lastName,
        poId: this.props.editData.productOwner.id,
        poObj: this.props.editData.productOwner,
        km: this.props.editData.kanbanMaster.firstName + ' ' + this.props.editData.kanbanMaster.lastName,
        kmId: this.props.editData.kanbanMaster.id,
        kmObj: this.props.editData.kanbanMaster
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { data: { error, allUsers } } = nextProps;

    if (error) console.error(error);

    if (this.state.allUsers.length === 0) {
      let users = allUsers.map(user =>
        ({ value: user,
          label: <Box justify='between' pad={{ horizontal: 'medium' }} direction='row'>
            <span>{user.firstName + ' ' + user.lastName}</span>
            <span>{user.email}</span>
          </Box>
        }));
      // console.log('users', users);
      this.setState({ allUsers: users, options: users });
    }
  }


  onSubmit() {
    console.log('before submit');
    this.setState({ onSubmit: null });
    if (this.validateForm()) {
      let teamData = {
        team: {
          name: this.state.teamName,
          kmId: this.state.kmId,
          poId: this.state.poId,
          members: this.state.developers.map(
            dev => ({
              id: dev.id,
              roles: dev.roles.map(role => this.mapRoles(role))
            })
          )
        }
      };

      teamData.team.members.push(this.state.poObj);
      teamData.team.members.push(this.state.kmObj);

      console.log(JSON.stringify(teamData));

      if (this.props.modeEdit) {
        // add team id to mutation variable
        teamData.team.teamId = this.state.teamId;

        this.props.editTeamMutation({
          variables: teamData,
          refetchQueries: [{ query: allTeamsQuery }]
        })
          .then(() => this.props.closer())
          .catch(err => this.handleError(err.message));
      } else {
        this.props.addTeamMutation({
          variables: teamData,
          refetchQueries: [{ query: allTeamsQuery }]
        })
          .then(() => this.props.closer())
          .catch(err => this.handleError(err.message));
        this.setState({ onSubmit: this.onSubmit });
      }
    } else {
      // reenable button for input validation
      this.setState({ onSubmit: this.onSubmit });
    }
  }


  /**
   * [Updates state with response error.]
   * @param  {[String]} err [Error message]
   */
  handleError(err) {
    console.error('handleError:', err);
    let error = {
      teamName: '',
      po: '',
      km: '',
      dev: '',
      general: ''
    };
    error.general = err.toString();
    this.setState({ error });
  }


  /**
   * Map CheckBox selection to userRoles
   * ADMIN = 1
   * PRODUCT_OWNER = 2
   * KANBAN_MASTER = 3
   * DEV = 4
   * @param  {[object]} roles [Roles object to map]
   * @return {[Integer]}       [Role id]
   */
  mapRoles(role) {
    switch (role.name) {
      case 'Administrator':
        return 1;
      case 'KanbanMaster':
        return 3;
      case 'Razvijalec':
        return 4;
      case 'Product Owner':
        return 2;
      default:
        return -1;
    }
  }


  /**
   * [Filters suggestions according to query input]
   * @param  {[type]} query [Search input - what user types into input field]
   */
  filterSuggestions(query) {
    let options = this.state.allUsers.filter(obj =>
      obj.label.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    this.setState({ options });
  }


  /**
   * [Adds developer to state array]
   * @param {[type]} dev [description]
   */
  addDeveloper(dev) {
    let developers = this.state.developers.slice();
    developers.push(dev);
    this.setState({ developers });
  }


  /**
   * [Remove developer from developer array.]
   * @param  {[String]} id [user id]
   */
  removeDev(id) {
    let developers = this.state.developers.slice();
    developers = developers.filter(dev => dev.id !== id);
    this.setState({ developers });
  }


  /**
   * [Validates form]
   * @return {[Boolean]} [Return true if form is valid]
   */
  validateForm() {
    // eslint-disable-next-line
    let error = {
      teamName: '',
      po: '',
      km: '',
      dev: '',
      general: ''
    };
    // reset errors before validating input
    this.setState({ error });
    let formIsValid = true;

    if (!this.state.teamName.match(alphaNumRegex)) { error.teamName = 'Nepravilen format'; formIsValid = false; }

    if (this.state.teamName === '') { error.teamName = 'Obvezno polje'; formIsValid = false; }
    if (this.state.po === '') { error.po = 'Obvezno polje'; formIsValid = false; }
    if (this.state.km === '') { error.km = 'Obvezno polje'; formIsValid = false; }
    if (this.state.developers.length === 0) { error.dev = 'Obvezno polje'; formIsValid = false; }

    this.setState({ error });
    return formIsValid;
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
                      po: event.option.value.firstName + ' ' + event.option.value.lastName,
                      poId: event.option.value.id,
                      poObj: {
                        id: event.option.value.id,
                        roles: event.option.value.roles.map(role => this.mapRoles(role))
                      },
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
                      km: event.option.value.firstName + ' ' + event.option.value.lastName,
                      kmId: event.option.value.id,
                      kmObj: {
                        id: event.option.value.id,
                        roles: event.option.value.roles.map(role => this.mapRoles(role))
                      },
                      options: this.state.allUsers
                    })}
                  onSearch={event => this.filterSuggestions(event.target.value)}
                />
              </FormField>
            </FormFields>

            <Section>
              <Header><Title>Ostali člani</Title></Header>
              <Section pad={{ vertical: 'small' }}>
                <FormField label='Razvijalec' error={this.state.error.dev}>
                  <Select
                    id='dev'
                    value={this.state.dev}
                    placeHolder='Janez Novak'
                    options={this.state.options}
                    onChange={event => this.addDeveloper(event.option.value)}
                    onSearch={event => this.filterSuggestions(event.target.value)}
                  />
                </FormField>
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

            {(this.state.error.general !== undefined) &&
              <Section className='color-red padding-bottom-0'>{this.state.error.general}</Section>
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
  editData: PropTypes.shape({
    name: PropTypes.string,
    kanbanMaster: PropTypes.object,
    productOwner: PropTypes.object
  }),
  data: PropTypes.object.isRequired,
  addTeamMutation: PropTypes.func.isRequired,
  editTeamMutation: PropTypes.func.isRequired
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
