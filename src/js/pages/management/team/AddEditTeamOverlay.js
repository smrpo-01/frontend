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
const alphaNumRegex = /^[a-zA-Z0-9šđčćžŠĐČĆŽ ]*$/;
import { allTeamsQuery } from './TeamTable';

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
      teamId: '',
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


  /**
   * [When component mounts check if we're in edit mode.
   * Set appropriate state values to render data in form fields.]
   */
  componentWillMount() {
    if (this.props.modeEdit) {
      let data = this.props.editData;
      console.log(data);
      let kmId = data.kanbanMaster.id;
      let poId = data.productOwner.id;
      // odstrani vse tiste ki niso developerji
      let tmpDevs = data.members.filter(dev => (dev.id !== poId && dev.id !== kmId));
      console.log(data);

      this.setState({
        teamName: data.name,
        teamId: data.id,
        po: data.productOwner.firstName + ' ' + data.productOwner.lastName,
        poId,
        poObj: this.filterUserObject(data.productOwner),
        km: data.kanbanMaster.firstName + ' ' + data.kanbanMaster.lastName,
        kmId,
        kmObj: this.filterUserObject(data.kanbanMaster),
        developers: tmpDevs
      });
    }
  }


  /**
   * [Only triggered when AllUsersQuery returns result.
   * Set all users to state for suggestions.]
   * @param  {[Object]} nextProps [Next props]
   */
  componentWillReceiveProps(nextProps) {
    const { data: { error, allUsers } } = nextProps;
    console.log(allUsers);
    if (error) console.error(error);

    if (this.state.allUsers.length === 0) {
      // let data = allUsers.slice();
      // data.roles = data.map(user => user.roles = user.roles.map(role => this.mapRoles(role)));
      /*
      let dataWithRoles = data.reduce((acc, user) => {
        console.log(user);
        let mappedRoles = user.roles.map(role => this.mapRoles(role));
        let tmpUser = Object.assign(user, {});
        tmpUser.roles = mappedRoles;
        return tmpUser;
      }, []);

      console.log(dataWithRoles);
      */
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


  /**
   * [onSubmit button handler. Prepares mutation data and executes mutation.]
   */
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
      }
      console.log('query end');
    } else {
      // reenable button for input validation
      this.setState({ onSubmit: this.onSubmit });
    }
  }


  /**
   * [Remove fields that are not allowed in GraphQl mutation]
   * @param  {[Object]} user [User object to filter]
   * @return {[Object]}      [Filtered user object]
   */
  filterUserObject(user) {
    const allowedkeys = ['id', 'roles'];
    let tmp = Object.keys(user)
      .filter(key => allowedkeys.includes(key))
      .reduce((acc, key) => {
        acc[key] = user[key];
        return acc;
      }, {});
    tmp.roles = tmp.roles.map(role => this.mapRoles(role));
    return tmp;
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
   * Map roles to numbers
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
      case 'Product Owner':
        return 2;
      case 'KanbanMaster':
        return 3;
      case 'Razvijalec':
        return 4;
      default:
        return -1;
    }
  }


  /**
   * [Filters suggestions according to query input]
   * @param  {[type]} query [Search input - what user types into input field]
   */
  filterSuggestions(query) {
    let options = this.state.allUsers.filter((obj) => {
      let name = obj.value.firstName + ' ' + obj.value.lastName;
      return name.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    });
    this.setState({ options });
  }


  /**
   * [Adds developer to state array]
   * @param {[type]} dev [description]
   */
  addDeveloper(dev) {
    console.log(dev);
    let developers = this.state.developers.slice();
    // let tmpDev = Object.assign({}, dev);
    // TODO find PO || KM with dev.id and append role to existing role
    // tmpDev.roles = [];
    developers.push(dev);
    this.setState({ developers });
  }


  /**
   * [Remove developer from developer array.
   * If mode is edit we have to call mutation to remove user.]
   * @param  {[String]} id [user id]
   */
  removeDev(userId) {
    if (!this.props.modeEdit) {
      let developers = this.state.developers.slice();
      developers = developers.filter(dev => dev.id !== userId);
      this.setState({ developers });
    } else {
      this.props.deleteUserFromTeamMutation({
        variables: { id: userId },
        refetchQueries: [{ query: allTeamsQuery }]
      })
        .then(res => console.log(res))
        .catch(err => this.handleError(err.message));
    }
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
                        roles: [2]
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
                        roles: [3]
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
    id: PropTypes.string,
    name: PropTypes.string,
    kanbanMaster: PropTypes.object,
    productOwner: PropTypes.object,
    members: PropTypes.array
  }),
  data: PropTypes.object.isRequired,
  addTeamMutation: PropTypes.func.isRequired,
  editTeamMutation: PropTypes.func.isRequired,
  deleteUserFromTeamMutation: PropTypes.func.isRequired
};

const addTeamMutation = gql`
  mutation createTeam($team: CreateTeamInput!) {
    createTeam(teamData: $team) {
      ok
    }
  }
`;

const editTeamMutation = gql`
  mutation editTeam($team: EditTeamInput!) {
    editTeam(teamData: $team) {
      ok
    }
  }
`;

export const deleteUserFromTeamMutation = gql`
  mutation deleteUserTeam($id: Int!) {
    deleteUserTeam(userTeamId: $id) {
      ok
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
      roles {
        name
      }
    }
  }
`;

const AddEditTeamWithMutations = compose(
  graphql(addTeamMutation, {
    name: 'addTeamMutation'
  }),
  graphql(editTeamMutation, {
    name: 'editTeamMutation'
  }),
  graphql(deleteUserFromTeamMutation, {
    name: 'deleteUserFromTeamMutation'
  }),
  graphql(allUsersQuery)
)(AddEditTeam);

export default AddEditTeamWithMutations;
