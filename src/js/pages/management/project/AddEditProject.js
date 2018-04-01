import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

// Grommet components
import Article from 'grommet/components/Article';
import Button from 'grommet/components/Button';
import DateTime from 'grommet/components/DateTime';
import Form from 'grommet/components/Form';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import FormFields from 'grommet/components/FormFields';
import FormField from 'grommet/components/FormField';
import Footer from 'grommet/components/Footer';
import Layer from 'grommet/components/Layer';
import TextInput from 'grommet/components/TextInput';
import Section from 'grommet/components/Section';
import Select from 'grommet/components/Select';

import { allProjectsQuery } from './ProjectTable';

const dateFormat = 'D/M/YYYY';
const projectCodeRegex = /^[a-zA-Z0-9-/.]*$/;
const alphaNumRegex = /^[a-zA-Z0-9šđčćžŠĐČĆŽ ]*$/;
const alphaRegex = /^[a-zA-ZšđčćžŠĐČĆŽ ]*$/;

class AddEditProject extends Component {
  constructor() {
    super();
    this.filterSuggestions = this.filterSuggestions.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.validateForm = this.validateForm.bind(this);

    this.state = {
      allTeams: null,
      options: [],
      projectId: '',
      projectCode: '',
      teamId: '',
      team: '',
      name: '',
      customer: '',
      dateStart: '',
      dateEnd: '',
      error: {
        projectCode: '',
        name: '',
        customer: '',
        team: '',
        dateStart: '',
        dateEnd: '',
        general: ''
      },
      onSubmit: this.onSubmit
    };
  }


  /**
   * [Set inital state with editData. Only if modeEdit is True]
   */
  componentWillMount() {
    if (this.props.modeEdit) {
      let initProps = this.props.editData;
      let teamId = (initProps.team !== null) ? initProps.team.id : '';
      let team = (initProps.team !== null) ? initProps.team.name : '';
      let dateStart = this.formatDate(initProps.dateStart, 'django');
      let dateEnd = this.formatDate(initProps.dateEnd, 'django');

      this.setState({
        projectId: initProps.id,
        projectCode: initProps.projectCode,
        name: initProps.name,
        customer: initProps.customer,
        teamId,
        team,
        dateStart,
        dateEnd
      });
    }
  }


  /**
   * [Only triggered when AllUsersQuery returns result.
   * Set all teams to state for suggestions.]
   * @param  {[Object]} nextProps [Next props]
   */
  componentWillReceiveProps(nextProps) {
    if (this.state.allTeams === null) {
      const { data: { error, allTeams } } = nextProps;
      if (error) console.error(error);

      let teams = allTeams.map(team =>
        ({ value: team,
          label: team.name
        }));
      // console.log('teams', teams);
      this.setState({ allTeams: teams, options: teams });
    }
  }


  /**
   * [Submit button handler.
   * Triggers validation, prepares data and call appropriate mutation.
   * Sets error to state if mutaion is not OK, otherwise close overlay.]
   */
  onSubmit() {
    // Disable submit button
    this.setState({ onSubmit: null });

    // Validate form, if valid trigger mutation
    if (this.validateForm()) {
      let data = {
        projectCode: this.state.projectCode,
        name: this.state.name,
        customer: this.state.customer,
        dateStart: this.formatDate(this.state.dateStart), // 2018-03-30
        dateEnd: this.formatDate(this.state.dateEnd)
      };

      if (this.state.team !== '') {
        // We have assigned team to project, add it to mutation data
        data.teamId = this.state.teamId;
      }
      // console.log('mutation data', data);
      if (this.props.modeEdit) {
        // We're editing existing project
        // Add project id to data
        data.id = this.state.projectId;
        this.props.editProjectMutation({
          variables: { project: data },
          refetchQueries: [{ query: allProjectsQuery }]
        })
          .then(() => this.props.closer())
          .catch((err) => {
            console.error(err);
            this.setState({ onSubmit: this.onSubmit, error: { general: err.message } });
          });
      } else {
        // We're adding new project
        this.props.addProjectMutation({
          variables: { project: data },
          refetchQueries: [{ query: allProjectsQuery }]
        })
          .then(() => this.props.closer())
          .catch((err) => {
            console.error(err);
            this.setState({ onSubmit: this.onSubmit, error: { general: err.message } });
          });
      }
    } else {
      // Reenable submit button
      this.setState({ onSubmit: this.onSubmit });
    }
  }


  /**
   * [Validates form. Displays errors if not valid.]
   * @return {[Boolean]} [True if form is valid]
   */
  validateForm() {
    // eslint-disable-next-line
    let error = {
      projectCode: '',
      name: '',
      customer: '',
      team: '',
      dateStart: '',
      dateEnd: '',
      general: ''
    };
    // reset errors before validating input
    this.setState({ error });
    let formIsValid = true;

    if (!this.state.projectCode.match(projectCodeRegex)) { error.projectCode = 'Nepravilen format'; formIsValid = false; }
    if (!this.state.name.match(alphaNumRegex)) { error.projectnameCode = 'Nepravilen format'; formIsValid = false; }
    if (!this.state.customer.match(alphaRegex)) { error.customer = 'Nepravilen format'; formIsValid = false; }

    let start = new Date(this.formatDate(this.state.dateStart));
    let end = new Date(this.formatDate(this.state.dateEnd));

    if (start >= end) {
      error.dateStart = 'Nepravilna izbira';
      error.dateEnd = 'Nepravilna izbira';
      formIsValid = false;
    }

    if (this.state.projectCode === '') { error.projectCode = 'Obvezno polje'; formIsValid = false; }
    if (this.state.name === '') { error.name = 'Obvezno polje'; formIsValid = false; }
    if (this.state.customer === '') { error.customer = 'Obvezno polje'; formIsValid = false; }
    if (this.state.dateStart === '') { error.dateStart = 'Obvezno polje'; formIsValid = false; }
    if (this.state.dateEnd === '') { error.dateEnd = 'Obvezno polje'; formIsValid = false; }

    this.setState({ error });
    return formIsValid;
  }


  /**
   * [Formates SLO Grommet format to Django ot he other way around]
   * @param  {[String]} dateToFormat       [Date to format. Valid formats: YYYY-MM-DD or DD/MM/YYYY]
   * @param  {String} [format='grommet'] [Which format is passed to funciton.]
   * @return {[String]}                    [Formatted date as string]
   */
  formatDate(dateToFormat, format = 'grommet') {
    if (format === 'django') {
      let d = dateToFormat.split('-'); // YYYY-MM-DD
      console.log(d[2] + '/' + d[1] + '/' + d[0]);
      return (d[2] + '/' + d[1] + '/' + d[0]); // DD/MM/YYYY
    }
    let d = dateToFormat.split('/'); // DD/MM/YYYY
    return (d[2] + '-' + d[1] + '-' + d[0]); // YYYY-MM-DD
  }


  /**
   * [Filters suggestions according to query input]
   * @param  {[type]} query [Search input - what user types into input field]
   */
  filterSuggestions(query) {
    let options = this.state.allTeams.filter(team => (
      team.label.toLowerCase().indexOf(query.toLowerCase()) !== -1
    ));
    this.setState({ options });
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
                {(this.props.modeEdit) ? 'Uredi projekt' : 'Dodaj projekt'}
              </Heading>
            </Header>

            <FormFields>
              <FormField label='Šifra projekta' error={this.state.error.projectCode}>
                <TextInput
                  id='projectCode'
                  value={this.state.projectCode}
                  placeHolder=''
                  onDOMChange={event => this.setState({ projectCode: event.target.value })}
                />
              </FormField>

              <FormField label='Naziv projekta' error={this.state.error.name}>
                <TextInput
                  id='projectName'
                  value={this.state.name}
                  placeHolder=''
                  onDOMChange={event => this.setState({ name: event.target.value })}
                />
              </FormField>

              <FormField label='Naročnik' error={this.state.error.customer}>
                <TextInput
                  id='projectCustomer'
                  value={this.state.customer}
                  placeHolder=''
                  onDOMChange={event => this.setState({ customer: event.target.value })}
                />
              </FormField>

              <FormField label='Datum začetka' error={this.state.error.dateStart}>
                <DateTime
                  id='dateStart'
                  format={dateFormat}
                  value={this.state.dateStart}
                  onChange={e => this.setState({ dateStart: e })}
                />
              </FormField>

              <FormField label='Predvideni datum zaključka' error={this.state.error.dateEnd}>
                <DateTime
                  id='dateEnd'
                  format={dateFormat}
                  value={this.state.dateEnd}
                  onChange={e => this.setState({ dateEnd: e })}
                />
              </FormField>

              <FormField
                label='Razvojna skupina'
                help={'Razvojno skupino se lahko določi nakdandno'}
                error={this.state.error.team}
              >
                <Select
                  id='team'
                  value={this.state.team}
                  placeHolder='Skupina 1'
                  options={this.state.options}
                  onChange={event =>
                    this.setState({ team: event.option.label, teamId: event.option.value.id })
                  }
                  onSearch={event => this.filterSuggestions(event.target.value)}
                />
              </FormField>
            </FormFields>

            {(this.state.error.general !== '') &&
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

AddEditProject.defaultProps = {
  modeEdit: false,
  editData: null
};

AddEditProject.propTypes = {
  closer: PropTypes.func.isRequired,
  modeEdit: PropTypes.bool,
  data: PropTypes.object.isRequired,
  editData: PropTypes.shape(
    PropTypes.string.name
  ),
  addProjectMutation: PropTypes.func.isRequired,
  editProjectMutation: PropTypes.func.isRequired
};

export const allTeamsQuery = gql`
  query allTeamsQuery {
    allTeams {
      id
      name
    }
  }
`;

export const editProjectMutation = gql`
  mutation editProject($project: ProjectInput!) {
    editProject(projectData: $project) {
      ok
    }
  }
`;

export const addProjectMutation = gql`
  mutation addProject($project: ProjectInput!) {
    addProject(projectData: $project) {
      ok
    }
  }
`;

const AddEditProjectWithMutations = compose(
  graphql(addProjectMutation, {
    name: 'addProjectMutation'
  }),
  graphql(editProjectMutation, {
    name: 'editProjectMutation'
  }),
  graphql(allTeamsQuery)
)(AddEditProject);

export default AddEditProjectWithMutations;
