import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
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

const dateFormat = 'M/D/YYYY';

class AddEditProject extends Component {
  constructor() {
    super();
    this.filterSuggestions = this.filterSuggestions.bind(this);

    this.state = {
      allTeams: null,
      options: [],
      id: '',
      name: '',
      customer: '',
      startDate: '',
      endDate: '',
      team: '',
      error: {
        id: '',
        name: '',
        customer: '',
        team: '',
        startDate: '',
        endDate: '',
        general: ''
      },
      onSubmit: null
    };
  }


  /**
   * [Only triggered when AllUsersQuery returns result.
   * Set all teams to state for suggestions.]
   * @param  {[Object]} nextProps [Next props]
   */
  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    if (this.state.allTeams === null) {
      const { data: { error, allTeams } } = nextProps;
      if (error) console.error(error);

      let teams = allTeams.map(team =>
        ({ value: team,
          label: team.name
        }));
      console.log('teams', teams);
      this.setState({ allTeams: teams, options: teams });
    }
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
              <FormField label='Šifra projekta' error={this.state.error.id}>
                <TextInput
                  id='projectId'
                  value={this.state.id}
                  placeHolder=''
                  onDOMChange={event => this.setState({ id: event.target.value })}
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

              <FormField label='Datum začetka' error={this.state.error.startDate}>
                <DateTime
                  id='startDate'
                  format={dateFormat}
                  value={this.state.startDate}
                  onChange={e => this.setState({ startDate: e })}
                />
              </FormField>

              <FormField label='Predvideni datum zaključka' error={this.state.error.endDate}>
                <DateTime
                  id='endDate'
                  format={dateFormat}
                  value={this.state.endDate}
                  onChange={e => this.setState({ endDate: e })}
                />
              </FormField>

              <FormField label='Razvojna skupina' error={this.state.error.team}>
                <Select
                  id='team'
                  value={this.state.team}
                  placeHolder='Skupina 1'
                  options={this.state.options}
                  onChange={event => this.setState({ team: event.option.label })}
                  onSearch={event => this.filterSuggestions(event.target.value)}
                />
              </FormField>
            </FormFields>

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

AddEditProject.defaultProps = {
  modeEdit: false,
  editData: null
};

AddEditProject.propTypes = {
  closer: PropTypes.func.isRequired,
  modeEdit: PropTypes.bool,
  data: PropTypes.object.isRequired
};

export const allTeamsQuery = gql`
  query allTeamsQuery {
    allTeams {
      id
      name
    }
  }
`;

export default graphql(allTeamsQuery)(AddEditProject);
