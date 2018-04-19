import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';


// Templates
import FormLegend from '../../components/FormLegend';

// Grommet components
import Anchor from 'grommet/components/Anchor';
import DateTime from 'grommet/components/DateTime';
import Form from 'grommet/components/Form';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import FormFields from 'grommet/components/FormFields';
import FormField from 'grommet/components/FormField';
import Footer from 'grommet/components/Footer';
import NumberInput from 'grommet/components/NumberInput';
import Section from 'grommet/components/Section';
import Select from 'grommet/components/Select';

import FormNextLinkIcon from 'grommet/components/icons/base/FormNextLink';

const dateFormat = 'D.M.YYYY';
// const projectCodeRegex = /^[a-zA-Z0-9-/. ]*$/;
// const alphaNumRegex = /^[a-zA-Z0-9šđčćžŠĐČĆŽ ()/]*$/;
// const alphaRegex = /^[a-zA-ZšđčćžŠĐČĆŽ ()/]*$/;

class FilterData extends Component {
  constructor() {
    super();
    this.filterSuggestions = this.filterSuggestions.bind(this);
    this.updateParent = this.updateParent.bind(this);

    this.state = {
      project: '',
      projectId: null,
      projectOptions: [],
      projectOptionsAll: [],

      cardCreatedStart: '',
      cardCreatedEnd: '',

      estimateMin: 1,
      estimateMax: 1,
      estimateFrom: 1,
      estimateTo: 1,

      cardType: '',
      cardTypeId: null,
      cardTypeOptions: [],
      cardTypeOptionsAll: [],

      error: {
        project: '',
        generalError: '',
        cardCreatedFrom: '',
        cardCreatedTo: '',
      },
    };
  }


  componentDidMount() {
    const projectData = '{"allProjects":[{"id":"1","name":"Projekt 1 (s karticami)"},{"id":"2","name":"Projekt 2 (s karticami)"},{"id":"3","name":"Projekt 3"},{"id":"4","name":"Projekt 4"}]}';
    const cardTypeTmp = '{"allCardTypes":[{"id":"A_0","name":"Navadna kartica"},{"id":"A_1","name":"Nujna zahteva"}]}';
    let data = JSON.parse(projectData);
    let cardTypeData = JSON.parse(cardTypeTmp);


    let projectOptions = data.allProjects.map(project => ({
      value: project,
      label: project.name,
    }));

    let cardTypeOptions = cardTypeData.allCardTypes.map(type => ({
      value: type,
      label: type.name,
    }));

    // eslint-disable-next-line
    this.setState({ projectOptions, projectOptionsAll: projectOptions,  cardTypeOptions, cardTypeOptionsAll: cardTypeOptions });
  }


  /**
   * [Filters suggestions according to query input]
   * @param  {[String]} query [Search input - what user types into input field]
   * @param  {[String]} type  [Filter type]
   */
  filterSuggestions(query, type) {
    if (type === 'project') {
      let projectOptions = this.state.projectOptionsAll.filter(obj =>
        obj.label.toLowerCase().indexOf(query.toLowerCase()) !== -1
      );
      this.setState({ projectOptions });
    } else if (type === 'cardType') {
      let cardTypeOptions = this.state.cardTypeOptionsAll.filter(obj =>
        obj.label.toLowerCase().indexOf(query.toLowerCase()) !== -1
      );
      this.setState({ cardTypeOptions });
    } else {
      console.error('please specify filter type');
    }
  }

  updateParent() {
    const filterData = {};
    filterData.projectId = this.state.projectId;
    filterData.cardTypeId = this.state.cardTypeId;

    this.props.setGraphFilter(filterData);
  }

  render() {
    return (
      <Form compact>
        <Header pad='none'>
          <Heading margin='none' tag='h3' strong>
            {/* 'Filter podatkov' */}
            <Anchor label='Filter podatkov' icon={<FormNextLinkIcon />} reverse primary onClick={this.updateParent} />
          </Heading>
        </Header>

        <FormFields>
          <FormLegend label={'Projekt'} />
          <FormField error={this.state.error.project}>
            <Select
              id='team'
              value={this.state.project}
              placeHolder='Projekt 1'
              options={this.state.projectOptions}
              onChange={event =>
                this.setState({
                  project: event.option.label,
                  projectId: event.option.value.id,
                  projectOptions: this.state.projectOptionsAll
                })
              }
              onSearch={event => this.filterSuggestions(event.target.value, 'project')}
            />
          </FormField>

          <FormLegend label={'Tip kartice'} />
          <FormField error={this.state.error.project}>
            <Select
              id='cardType'
              value={this.state.cardType}
              placeHolder='Nujna zahteva'
              options={this.state.cardTypeOptions}
              onChange={event =>
                this.setState({
                  cardType: event.option.label,
                  cardTypeId: event.option.value.id,
                  cardTypeOptions: this.state.cardTypeOptionsAll
                })
              }
              onSearch={event => this.filterSuggestions(event.target.value, 'cardType')}
            />
          </FormField>

          {/* zahtevnost kartice */}
          <FormLegend label={'Zahtevnost kartice'} />
          <FormField label='Od' error={this.state.error.cardCreatedFrom}>
            <NumberInput
              id='estimateFrom'
              min={this.state.estimateMin}
              max={this.state.estimateMax}
              value={this.state.estimateFrom}
              onChange={e => this.setState({ estimateFrom: e.target.value })}
            />

          </FormField>

          <FormField label='Do' error={this.state.error.cardCreatedFrom}>
            <NumberInput
              id='estimateTo'
              min={this.state.estimateMin}
              max={this.state.estimateMax}
              value={this.state.estimateTo}
              onChange={e => this.setState({ estimateTo: e.target.value })}
            />
          </FormField>

          <FormLegend label={'Interval v katerem je bila kartica kreirana'} />
          <FormField label='Od' error={this.state.error.cardCreatedFrom}>
            <DateTime
              id='cardDateStart'
              format={dateFormat}
              value={this.state.cardCreatedStart}
              onChange={e => this.setState({ cardCreatedStart: e })}
            />
          </FormField>

          <FormField label='Do' error={this.state.error.cardCreatedEnd}>
            <DateTime
              id='cardDateStart'
              format={dateFormat}
              value={this.state.cardCreatedEnd}
              onChange={e => this.setState({ cardCreatedEnd: e })}
            />
          </FormField>


          {/* Kartica končana */}
          <FormLegend label={'Interval v katerem je bila kartica končana'} />
          <FormField label='Od' error={this.state.error.cardCreatedFrom}>
            <DateTime
              id='cardDateStart'
              format={dateFormat}
              value={this.state.cardCreatedStart}
              onChange={e => this.setState({ cardCreatedStart: e })}
            />
          </FormField>

          <FormField label='Do' error={this.state.error.cardCreatedEnd}>
            <DateTime
              id='cardDateStart'
              format={dateFormat}
              value={this.state.cardCreatedEnd}
              onChange={e => this.setState({ cardCreatedEnd: e })}
            />
          </FormField>


          {/* Pričel razvoj */}
          <FormLegend label={'Interval v katerem je pričel razvoj'} />
          <FormField label='Od' error={this.state.error.cardCreatedFrom}>
            <DateTime
              id='cardDateStart'
              format={dateFormat}
              value={this.state.cardCreatedStart}
              onChange={e => this.setState({ cardCreatedStart: e })}
            />
          </FormField>

          <FormField label='Do' error={this.state.error.cardCreatedEnd}>
            <DateTime
              id='cardDateStart'
              format={dateFormat}
              value={this.state.cardCreatedEnd}
              onChange={e => this.setState({ cardCreatedEnd: e })}
            />
          </FormField>


        </FormFields>

        {(this.state.error.generalError !== undefined) ?
          <Section className='color-red padding-bottom-0'>{this.state.error.generalError}</Section>
          : null
        }

        <Footer pad={{ vertical: 'medium', between: 'medium' }} />
      </Form>
    );
  }
}

FilterData.defaultProps = {};
FilterData.propTypes = {
  setGraphFilter: PropTypes.func.isRequired,
};


export const getBoardDataQuery = gql`
  query getBoardData($boardId: Int!) {
    allUsers(boardId: $boardId) {
      projects {
        id
        name
      },
      estimateMin,
      estimatemax,
      projectStartDate,
      projectEndDate,
      cardType {
        id,
        name
      }
    }
  }
`;

const FilterDataWithQuery = compose(
  graphql((getBoardDataQuery), {
    name: 'queryBoardData',
    options: () => ({
      variables: {
        boardId: 2
      }
    })
  })
)(FilterData);

/*

Query za pridobitev podatkov o tabli.
Te podatke uporabiva za izgradnjo filtra za graf

getBoardData(boardId: $boardId)
{
projects: [{id: 1, name: "Projekt 1"}],
estimateMin: 1,
estimateMax: 15,
projectStartDate: Date // format DD.MM.YYYY,
projectEndDate: Date // format DD.MM.YYYY,
cardType: [{id, typeName}]
}

*/

export default FilterDataWithQuery;
