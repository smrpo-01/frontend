import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

// Grommet components
import Article from 'grommet/components/Article';
import Button from 'grommet/components/Button';
import Box from 'grommet/components/Box';
import CheckBox from 'grommet/components/CheckBox';
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
    this.saveAllUsersData = this.saveAllUsersData.bind(this);
    this.saveUserDataFromProps = this.saveUserDataFromProps.bind(this);

    this.state = {
      allDev: [],
      allDevOptions: [],
      allPo: [],
      allPoOptions: [],
      allKm: [],
      allKmOptions: [],
      teamName: '',
      teamId: '',
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
        dev: '',
        general: ''
      },
      onSubmit: this.onSubmit
    };
  }


  /**
   * [When component mounts check if we're in edit mode.
   * Set appropriate state values to render data in form fields.
   * Check if allUsers need to be set to state.]
   */
  componentWillMount() {
    this.saveUserDataFromProps(this.props);

    if (this.props.modeEdit) {
      let data = this.props.editData;

      // Prepare array of devs with valid object structure
      let devs = data.developers.map(obj => ({
        isActive: obj.isActive,
        email: obj.email,
        firstName: obj.firstName,
        lastName: obj.lastName,
        id: obj.idUser,
        userTeamId: obj.idUserTeam
      }));

      this.setState({
        teamName: data.name,
        teamId: data.id,
        po: data.productOwner.firstName + ' ' + data.productOwner.lastName,
        poId: data.productOwner.idUser,
        km: data.kanbanMaster.firstName + ' ' + data.kanbanMaster.lastName,
        kmId: data.kanbanMaster.idUser,
        developers: devs
      });
    }
  }


  /**
   * [Only triggered when AllUsersQuery returns result.
   * Set all users to state for suggestions.]
   * @param  {[Object]} nextProps [Next props]
   */
  componentWillReceiveProps(nextProps) {
    this.saveUserDataFromProps(nextProps);
  }


  /**
   * [onSubmit button handler. Prepares mutation data and executes mutation.]
   */
  onSubmit() {
    this.setState({ onSubmit: null });
    if (this.validateForm()) {
      let teamData = {
        team: {
          name: this.state.teamName,
          kmId: this.state.kmId,
          poId: this.state.poId,
          members: this.state.developers.map(dev => (this.filterUserObject(dev)))
        }
      };
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
    const allowedkeys = ['id', 'email', 'isActive'];
    let tmp = Object.keys(user)
      .filter(key => allowedkeys.includes(key))
      .reduce((acc, key) => {
        acc[key] = user[key];
        return acc;
      }, {});
    return tmp;
  }


  /**
   * [Updates state with response error.]
   * @param  {[String]} err [Error message]
   */
  handleError(err) {
    console.error('handleError:', err);
    let errMsg = err.split(':');
    let error = {
      teamName: '',
      po: '',
      km: '',
      dev: '',
      general: ''
    };
    error.general = errMsg[1].toString();
    this.setState({ error, onSubmit: this.onSubmit });
  }


  /**
   * [Save data from queries]
   * @param  {[Object]} nextProps [Next props]
   */
  saveUserDataFromProps(nextProps) {
    if (nextProps.queryAllDevs !== undefined) {
      if (nextProps.queryAllDevs.loading) return;
      this.saveAllUsersData(nextProps.queryAllDevs.allUsers, 'dev');
    }

    if (nextProps.queryAllKm !== undefined) {
      if (nextProps.queryAllKm.loading) return;
      this.saveAllUsersData(nextProps.queryAllKm.allUsers, 'km');
    }

    if (nextProps.queryAllPo !== undefined) {
      if (nextProps.queryAllPo.loading) return;
      this.saveAllUsersData(nextProps.queryAllPo.allUsers, 'po');
    }
  }


  /**
   * [Saves all users for specific role.
   * Select component will display only valid roles for specific field.]
   * @param  {[Array]} allUsers [Array of user objects]
   * @param  {[String]} type     [User role (dev, km, po)]
   */
  saveAllUsersData(allUsers, type) {
    if (allUsers === undefined) {
      console.error('Failed to load users for role ' + type);
      return;
    }

    let users = allUsers.map((user) => {
      let tmpUser = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      };
      return ({ value: tmpUser,
        label: <Box justify='between' pad={{ horizontal: 'medium' }} direction='row'>
          <span>{user.firstName + ' ' + user.lastName}</span>
          <span>{user.email}</span>
        </Box>
      });
    });

    if (type === 'dev') { // save Devs
      this.setState({ allDev: users, allDevOptions: users });
    } else if (type === 'km') { // save KM's
      this.setState({ allKm: users, allKmOptions: users });
    } else { // save PO's
      this.setState({ allPo: users, allPoOptions: users });
    }
  }


  /**
   * [Filters suggestions according to query input]
   * @param  {[type]} query [Search input - what user types into input field]
   */
  filterSuggestions(query, type) {
    if (type === 'dev') {
      let options = this.state.allDev.filter((obj) => {
        let name = obj.value.firstName + ' ' + obj.value.lastName;
        return name.toLowerCase().indexOf(query.toLowerCase()) !== -1;
      });
      this.setState({ allDevOptions: options });
    } else if (type === 'po') {
      let options = this.state.allPo.filter((obj) => {
        let name = obj.value.firstName + ' ' + obj.value.lastName;
        return name.toLowerCase().indexOf(query.toLowerCase()) !== -1;
      });
      this.setState({ allPoOptions: options });
    } else {
      let options = this.state.allKm.filter((obj) => {
        let name = obj.value.firstName + ' ' + obj.value.lastName;
        return name.toLowerCase().indexOf(query.toLowerCase()) !== -1;
      });
      this.setState({ allKmOptions: options });
    }
  }


  /**
   * [Adds developer to state array. Reset dev options after selection]
   * @param {[type]} dev [description]
   */
  addDeveloper(dev) {
    let developers = this.state.developers.slice();
    // check if developer already exists in developers array
    if (developers.findIndex(arrEl => arrEl.id === dev.id) === -1) {
      let tmpDev = dev;
      tmpDev.isActive = true;
      developers.push(tmpDev);
      this.setState({ developers, allDevOptions: this.state.allDev });
    }
  }


  /**
   * [Remove developer from developer array.
   * If mode is edit we have to call mutation to remove user.]
   * @param  {[String]} id [user id]
   */
  removeDev(userId, index = 0, isActive) {
    if (!this.props.modeEdit) {
      let developers = this.state.developers.slice();
      developers = developers.filter(dev => dev.id !== userId);
      this.setState({ developers });
    } else {
      this.setState({ onSubmit: null });
      this.props.deleteUserFromTeamMutation({
        variables: { id: userId, isActive: !isActive },
        refetchQueries: [{ query: allTeamsQuery }]
      })
        .then((res) => {
          let resData = res.data.editTeamMemberStatus;
          if (resData.ok) {
            let developers = this.state.developers.slice();
            developers[index].isActive = resData.userTeam.isActive;
            this.setState({ developers, onSubmit: this.onSubmit });
          }
        })
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
                {(this.props.modeEdit) ? 'Uredi razvojno skupino' : 'Dodaj razvojno skupino'}
              </Heading>
            </Header>

            <FormFields>
              <FormField label='Ime skupine' error={this.state.error.teamName}>
                <TextInput
                  id='teamName'
                  value={this.state.teamName}
                  placeHolder='Skupina 1'
                  onDOMChange={event => this.setState({ teamName: event.target.value })}
                />
              </FormField>

              <FormField label='Product owner' error={this.state.error.po}>
                <Select
                  id='po'
                  value={this.state.po}
                  placeHolder='Janez Novak'
                  options={this.state.allPoOptions}
                  onChange={event =>
                    this.setState({
                      po: event.option.value.firstName + ' ' + event.option.value.lastName,
                      poId: event.option.value.id,
                      allPoOptions: this.state.allPo
                    })}
                  onSearch={event => this.filterSuggestions(event.target.value, 'po')}
                />
              </FormField>

              <FormField label='Kanban master' error={this.state.error.km}>
                <Select
                  id='km'
                  value={this.state.km}
                  placeHolder='Janez Novak'
                  options={this.state.allKmOptions}
                  onChange={event =>
                    this.setState({
                      km: event.option.value.firstName + ' ' + event.option.value.lastName,
                      kmId: event.option.value.id,
                      allKmOptions: this.state.allKm
                    })}
                  onSearch={event => this.filterSuggestions(event.target.value, 'km')}
                />
              </FormField>
            </FormFields>

            <Section>
              <Header><Title>Razvijalci</Title></Header>
              <Section pad={{ vertical: 'small' }}>
                <FormField label='Razvijalec' error={this.state.error.dev}>
                  <Select
                    id='dev'
                    value={this.state.dev}
                    placeHolder='Janez Novak'
                    options={this.state.allDevOptions}
                    onChange={event => this.addDeveloper(event.option.value)}
                    onSearch={event => this.filterSuggestions(event.target.value, 'dev')}
                  />
                </FormField>
              </Section>

              <List>
                {this.state.developers.map((dev, index) => (
                  <ListItem
                    key={'dev-id-' + dev.id}
                    justify='between'
                    pad={(this.props.modeEdit) ? { horizontal: 'small', vertical: 'small' } : { horizontal: 'small' }}>
                    {dev.firstName + ' ' + dev.lastName}
                    {(this.props.modeEdit) ?
                      <CheckBox
                        toggle={true}
                        checked={dev.isActive}
                        onChange={() => this.removeDev(dev.userTeamId, index, dev.isActive)}
                      />
                      :
                      <Button plain icon={<TrashIcon />} onClick={() => this.removeDev(dev.id)} />
                    }
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
              <Button label={(this.props.modeEdit) ? 'Shrani' : 'Dodaj'}
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
  addTeamMutation: PropTypes.func.isRequired,
  editTeamMutation: PropTypes.func.isRequired,
  deleteUserFromTeamMutation: PropTypes.func.isRequired,
  // eslint-disable-next-line
  queryAllKm: PropTypes.object.isRequired,
  // eslint-disable-next-line
  queryAllPo: PropTypes.object.isRequired,
  // eslint-disable-next-line
  queryAllDevs: PropTypes.object.isRequired
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
  mutation editTeamMemberStatus($id: Int!, $isActive: Boolean!) {
    editTeamMemberStatus(userTeamId: $id, isActive: $isActive) {
      ok
      userTeam {
        id
        isActive
      }
    }
  }
`;


export const allUsersQuery = gql`
  query AllUsersQuery($userRole: Int!) {
    allUsers(userRole: $userRole) {
      id
      firstName
      lastName
      email
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
  graphql((allUsersQuery), {
    name: 'queryAllDevs',
    options: () => ({
      variables: {
        userRole: 4
      }
    })
  }),
  graphql((allUsersQuery), {
    name: 'queryAllKm',
    options: () => ({
      variables: {
        userRole: 3
      }
    })
  }),
  graphql((allUsersQuery), {
    name: 'queryAllPo',
    options: () => ({
      variables: {
        userRole: 2
      }
    })
  })
)(AddEditTeam);

export default AddEditTeamWithMutations;
