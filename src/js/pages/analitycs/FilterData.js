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
    this.prepareData = this.prepareData.bind(this);
    this.validateForm = this.validateForm.bind(this);

    this.state = {
      project: '',
      projectId: null,
      projectOptions: [],
      projectOptionsAll: [],

      creationStart: '',
      creationEnd: '',

      doneStart: '',
      doneEnd: '',

      devStart: '',
      devEnd: '',

      dateFrom: '',
      dateTo: '',

      columnFrom: null,
      columnFromId: null,
      columnTo: null,
      columnToId: null,
      columnsOptions: [],

      estimateMin: 1,
      estimateMax: 1,
      estimateFrom: 1,
      estimateTo: 1,

      cardType: null,
      cardTypeOptions: [],
      cardTypeOptionsAll: [],

      error: {
        project: '',
        cardType: '',
        columnFrom: '',
        columnTo: '',
        dateFrom: '',
        dateTo: '',
        estimateFrom: '',
        estimateTo: '',
        creationStart: '',
        creationEnd: '',
        doneStart: '',
        doneEnd: '',
        devStart: '',
        devEnd: '',
        generalError: '',
      },
    };
  }


  componentDidMount() {
    if (this.props.queryBoardData.allBoards !== undefined) {
      this.prepareData(this.props.queryBoardData.allBoards[0]);
    }
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.queryBoardData.allBoards !== undefined) {
      this.prepareData(nextProps.queryBoardData.allBoards[0]);
    }
  }


  // prepares data for form population
  prepareData(data) {
    let projectOptions = data.projects.map(project => ({
      value: project,
      label: project.name,
    }));

    let cardTypeOptions = data.cardTypes.map(type => ({
      value: type,
      label: type.name,
    }));

    const estimateMin = data.estimateMin;
    const estimateMax = data.estimateMax;

    let columns = data.columnsNoParents.map(column => ({
      value: column,
      label: column.name,
    }));

    this.setState({
      projectOptions,
      projectOptionsAll: projectOptions,
      cardTypeOptions,
      cardTypeOptionsAll: cardTypeOptions,
      estimateMin,
      estimateMax,
      estimateTo: estimateMax,
      columnsOptions: columns,
    });
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

  // validates form for required fields
  validateForm() {
    let valid = true;
    let error = {
      project: '',
      cardType: '',
      columnFrom: '',
      columnTo: '',
      dateFrom: '',
      dateTo: '',
      estimateFrom: '',
      estimateTo: '',
      creationStart: '',
      creationEnd: '',
      doneStart: '',
      doneEnd: '',
      devStart: '',
      devEnd: '',
      generalError: '',
    };

    if (this.state.projectId === null) { error.project = ' '; valid = false; }
    if (this.state.columnFromId === null) { error.columnFrom = ' '; valid = false; }
    if (this.state.columnToId === null) { error.columnTo = ' '; valid = false; }
    if (this.props.type === 'kumulativeFlow' && this.state.dateFrom === '') {
      error.dateFrom = ' ';
      valid = false;
    }
    if (this.props.type === 'kumulativeFlow' && this.state.dateTo === '') {
      error.dateTo = ' ';
      valid = false;
    }

    if (!valid) error.generalError = 'Izpolnite obvezna polja.';
    this.setState({ error });
    return valid;
  }

  // updates parent with filter data. This is used for graph data query
  updateParent() {
    if (!this.validateForm()) return;
    const filterData = {};
    filterData.projectId = parseInt(this.state.projectId, 10);
    filterData.cardTypeId = this.state.cardType.map(type => type.value.id);
    // estimate
    filterData.estimateFrom = parseFloat(this.state.estimateFrom);
    filterData.estimateTo = parseFloat(this.state.estimateTo);
    // creation
    filterData.creationStart = this.state.creationStart;
    filterData.creationEnd = this.state.creationEnd;
    // done
    filterData.doneStart = this.state.doneStart;
    filterData.doneEnd = this.state.doneEnd;
    // done
    filterData.devStart = this.state.devStart;
    filterData.devEnd = this.state.devEnd;
    // columns
    filterData.columnFrom = this.state.columnFromId;
    filterData.columnTo = this.state.columnToId;
    // time interval
    filterData.dateFrom = this.state.dateFrom;
    filterData.dateTo = this.state.dateTo;

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

        {(this.state.error.generalError !== undefined) ?
          <Section className='color-red' pad='none'>{this.state.error.generalError}</Section>
          : null
        }

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
          <FormField error={this.state.error.cardType}>
            <Select
              id='cardType'
              placeHolder='Nujna zahteva'
              multiple={true}
              value={this.state.cardType}
              options={this.state.cardTypeOptions}
              onChange={event =>
                this.setState({
                  cardType: event.value,
                  cardTypeOptions: this.state.cardTypeOptionsAll
                })
              }
              onSearch={event => this.filterSuggestions(event.target.value, 'cardType')}
            />
          </FormField>

          <FormLegend label={'Mejna stolpca'} />
          <FormField error={this.state.error.columnFrom}>
            <Select
              id='columnFrom'
              placeHolder='Testiranje'
              value={this.state.columnFrom}
              options={this.state.columnsOptions}
              onChange={event =>
                this.setState({
                  columnFrom: event.option.label,
                  columnFromId: event.option.value.id,
                })
              }
            />
          </FormField>

          <FormField error={this.state.error.columnTo}>
            <Select
              id='columnTo'
              placeHolder='Integracija'
              value={this.state.columnTo}
              options={this.state.columnsOptions}
              onChange={event =>
                this.setState({
                  columnTo: event.option.label,
                  columnToId: event.option.value.id,
                })
              }
            />
          </FormField>


          {/* Časovni interval */}
          {(this.props.type === 'kumulativeFlow') &&
          <div>
            <FormLegend label={'Časovni interval'} />
            <FormField label='Od' error={this.state.error.dateFrom}>
              <DateTime
                id='dateFrom'
                format={dateFormat}
                value={this.state.dateFrom}
                onChange={e => this.setState({ dateFrom: e })}
              />
            </FormField>

            <FormField label='Do' error={this.state.error.dateTo}>
              <DateTime
                id='dateTo'
                format={dateFormat}
                value={this.state.dateTo}
                onChange={e => this.setState({ dateTo: e })}
              />
            </FormField>
          </div>
          }

          {/* zahtevnost kartice */}
          <FormLegend label={'Zahtevnost kartice'} />
          <FormField label='Od' error={this.state.error.estimateFrom}>
            <NumberInput
              id='estimateFrom'
              min={this.state.estimateMin}
              max={this.state.estimateMax}
              value={this.state.estimateFrom}
              onChange={e => this.setState({ estimateFrom: e.target.value })}
            />

          </FormField>

          <FormField label='Do' error={this.state.error.estimateTo}>
            <NumberInput
              id='estimateTo'
              min={this.state.estimateMin}
              max={this.state.estimateMax}
              value={this.state.estimateTo}
              onChange={e => this.setState({ estimateTo: e.target.value })}
            />
          </FormField>

          <FormLegend label={'Interval v katerem je bila kartica kreirana'} />
          <FormField label='Od' error={this.state.error.creationStart}>
            <DateTime
              id='creationStart'
              format={dateFormat}
              value={this.state.creationStart}
              onChange={e => this.setState({ creationStart: e })}
            />
          </FormField>

          <FormField label='Do' error={this.state.error.creationEnd}>
            <DateTime
              id='creationEnd'
              format={dateFormat}
              value={this.state.creationEnd}
              onChange={e => this.setState({ creationEnd: e })}
            />
          </FormField>


          {/* Kartica končana */}
          <FormLegend label={'Interval v katerem je bila kartica končana'} />
          <FormField label='Od' error={this.state.error.doneStart}>
            <DateTime
              id='doneStart'
              format={dateFormat}
              value={this.state.doneStart}
              onChange={e => this.setState({ doneStart: e })}
            />
          </FormField>

          <FormField label='Do' error={this.state.error.doneEnd}>
            <DateTime
              id='doneEnd'
              format={dateFormat}
              value={this.state.doneEnd}
              onChange={e => this.setState({ doneEnd: e })}
            />
          </FormField>


          {/* Pričel razvoj */}
          <FormLegend label={'Interval v katerem je pričel razvoj'} />
          <FormField label='Od' error={this.state.error.devStart}>
            <DateTime
              id='devStart'
              format={dateFormat}
              value={this.state.devStart}
              onChange={e => this.setState({ devStart: e })}
            />
          </FormField>

          <FormField label='Do' error={this.state.error.devEnd}>
            <DateTime
              id='devEnd'
              format={dateFormat}
              value={this.state.devEnd}
              onChange={e => this.setState({ devEnd: e })}
            />
          </FormField>


        </FormFields>

        <Footer pad={{ vertical: 'medium', between: 'medium' }} />
      </Form>
    );
  }
}

FilterData.defaultProps = {};
FilterData.propTypes = {
  setGraphFilter: PropTypes.func.isRequired,
  queryBoardData: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
};


export const getBoardDataQuery = gql`
  query getBoardData($boardId: Int!) {
    allBoards(id: $boardId) {
      projects {
        id
        name
      },
      columnsNoParents {
        id
        name
      },
      estimateMin,
      estimateMax,
      cardTypes {
        id,
        name
      }
    }
  }
`;

const FilterDataWithQuery = compose(
  graphql((getBoardDataQuery), {
    name: 'queryBoardData',
    options: props => ({
      variables: {
        boardId: props.boardId,
      }
    })
  })
)(FilterData);

export default FilterDataWithQuery;
