import React, { Component } from 'react';
import { Transition } from 'react-transition-group';
import PropTypes from 'prop-types';
import uuid from 'uuid/v4';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import Layer from 'grommet/components/Layer';
import Article from 'grommet/components/Article';
import Select from 'grommet/components/Select';
import DateTime from 'grommet/components/DateTime';

import Form from 'grommet/components/Form';
import Button from 'grommet/components/Button';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Footer from 'grommet/components/Footer';
import FormFields from 'grommet/components/FormFields';
import FormField from 'grommet/components/FormField';
import TextInput from 'grommet/components/TextInput';
import NumberInput from 'grommet/components/NumberInput';
import CheckBox from 'grommet/components/CheckBox';

import TrashIcon from 'grommet/components/icons/base/Trash';
import AddIcon from 'grommet/components/icons/base/Add';


import Notification from 'grommet/components/Notification';

import { allCardsQuery } from './Board';

const dateFormat = 'D/M/YYYY';
const duration = 100;

const transitionStyles = {
  entering: 0,
  entered: 0.9,
  exited: 0,
};

const transitionStylesTransform = {
  entering: 0,
  entered: 30,
  exited: 0,
};


class SidebarColumn extends Component {
  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);
    this.changeProject = this.changeProject.bind(this);
    this.changeTaskDescription = this.changeTaskDescription.bind(this);
    this.changeTaskOwner = this.changeTaskOwner.bind(this);
    this.formatDate = this.formatDate.bind(this);
    this.findFirstColumn = this.findFirstColumn.bind(this);
    this.findPriorityColumn = this.findPriorityColumn.bind(this);

    this.state = {
      in: false,
      id: uuid(),
      name: '',
      tasks: [],
      type: 0,
      errors: {},
      estimate: 0,
    };
  }

  componentWillMount() {
    const user = sessionStorage.getItem('user');
    const userId = JSON.parse(user).id;
    let km = false;
    let po = false;
    const projects = this.props.data.projects.filter(project => {
      const { kanbanMaster } = project.team;
      const { productOwner } = project.team;
      if (kanbanMaster.idUser === userId) km = true;

      if (productOwner.idUser === userId) po = true;

      if (km || po) return true;

      return false;
    });

    this.setState({
      km,
      po,
      type: km ? 1 : 0,
      projects,
      userId,
    });
  }

  onSubmit() {
    this.setState({
      in: false,
    }, () => {
      let errors = {};

      if (!this.state.name) errors = { ...errors, name: 'Obvezno polje' };
      if (!this.state.description) errors = { ...errors, description: 'Obvezno polje' };
      if (!this.state.selectedProject) errors = { ...errors, selectedProject: 'Obvezno polje' };
      if (!this.state.owner) errors = { ...errors, owner: 'Obvezno polje' };
      if (!this.state.expiration) errors = { ...errors, expiration: 'Neveljaven datum' };
      if (this.state.expiration) {
        let expiration = new Date(this.formatDate(this.state.expiration));
        let now = new Date();
        if (expiration < now) errors = { ...errors, expiration: 'Končni datum mora biti večji kot trenutni' };
      }

      this.setState({
        errors
      });
      if (this.state.name && this.state.description && this.state.selectedProject && this.state.owner && !errors.expiration) {
        let column = null;
        if (this.state.type === 0) {
          column = this.findFirstColumn(this.props.columns[0]);
        } else {
          column = this.findPriorityColumn(this.props.columns);
        }

        let filteredTasks = this.state.tasks.filter(task => task.description !== '');
        filteredTasks = filteredTasks.map(task => ({ description: task.description, assigneeUserteamId: task.owner && parseInt(task.owner.id, 10) }));

        const cardData = {
          name: this.state.name,
          description: this.state.description,
          typeId: parseInt(this.state.type, 10),
          projectId: parseInt(this.state.selectedProject.id, 10),
          expiration: this.formatDate(this.state.expiration),
          estimate: parseFloat(this.state.estimate),
          ownerUserteamId: parseInt(this.state.owner.id, 10),
          tasks: filteredTasks,
          columnId: column.id,
        };

        this.props.addCardMutation({
          variables: {
            cardData,
            boardId: this.props.boardId,
          },
          refetchQueries: [{
            query: allCardsQuery,
            variables: { id: this.props.boardId }
          }],
        }).then(res => this.props.closer())
          .catch(err => {
            this.setState({
              in: true,
              notificationError: err.message.split(':')[1],
            });
          });
      }
    });
  }

  findPriorityColumn(columns) {
    for (let c = 0; c < columns.length; c++) {
      if (columns[c].priority) return columns[c];

      const returnedColumn = this.findPriorityColumn(columns[c].columns);
      if (returnedColumn) return returnedColumn;
    }

    return null;
  }

  findFirstColumn(column) {
    if (!column.columns || column.columns.length === 0) {
      return column;
    }

    return this.findFirstColumn(column.columns[0]);
  }

  formatDate(dateToFormat, format = 'grommet') {
    if (format === 'django') {
      let d = dateToFormat.split('-'); // YYYY-MM-DD
      return (d[2] + '/' + d[1] + '/' + d[0]); // DD/MM/YYYY
    }
    let d = dateToFormat.split('/'); // DD/MM/YYYY
    return (d[2] + '-' + d[1] + '-' + d[0]); // YYYY-MM-DD
  }

  changeProject(value) {
    if (this.state.selectedProject && this.state.selectedProject.id !== value.id) {
      const tasks = this.state.tasks.map(task => ({
        ...task,
        owner: null,
      }));
      this.setState({ selectedProject: value, owner: null, tasks });
    } else {
      this.setState({ selectedProject: value });
    }
  }

  changeTaskDescription(value, taskId) {
    const tasks = this.state.tasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          description: value
        };
      }
      return task;
    });

    this.setState({
      tasks,
    });
  }

  changeTaskOwner(value, taskId) {
    const tasks = this.state.tasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          owner: value
        };
      }
      return task;
    });

    this.setState({
      tasks,
    });
  }

  changeType(value) {
    if (this.state.type !== value) {
      this.changeProject({ id: null, value: null });
      this.setState({ type: value });
    }
  }

  render() {
    let projectOptions = [];
    let memberOptions = [];
    if (this.state.projects) {
      if (this.state.type === 1) {
        projectOptions = this.state.projects.filter(pr => pr.team.kanbanMaster.idUser === this.state.userId);
      } else {
        projectOptions = this.state.projects.filter(pr => pr.team.productOwner.idUser === this.state.userId);
      }

      projectOptions = projectOptions.map(pr => ({ value: pr.name, id: pr.id }));

      const currentProject = this.state.projects.filter(pr => this.state.selectedProject && pr.id === this.state.selectedProject.id);
      if (currentProject.length > 0) {
        const members = currentProject[0].team.members.filter((obj, pos, arr) =>
          arr.map(mapObj => mapObj.id).indexOf(obj.id) === pos
        );
        memberOptions = members.map(member => ({ value: `${member.firstName} ${member.lastName}`, id: member.id }));
      }
    }

    return (
      <Layer
        closer
        align='right'
      >
        <Article pad='small' size='large'>
          <Form>
            <Header pad={{ vertical: 'medium' }}>
              <Heading>
                {(this.props.modeEdit) ? 'Uredi kartico' : 'Dodaj kartico'}
              </Heading>
            </Header>

            <FormFields>
              <FormField>
                <div style={{ display: 'flex', justifyContent: 'space-around', margin: 20 }}>
                  <CheckBox label='Navadna kartica'
                    toggle={false}
                    disabled={!this.state.po}
                    checked={this.state.type === 0 && this.state.po}
                    onChange={() => this.changeType(0)} />
                  <CheckBox label='Silver bullet'
                    toggle={false}
                    disabled={!this.state.km}
                    checked={this.state.type === 1 && this.state.km}
                    onChange={() => this.changeType(1)} />
                </div>
              </FormField>
              <FormField label='Ime kartice' error={this.state.errors.name}>
                <TextInput
                  id='name'
                  value={this.state.name}
                  onDOMChange={event => this.setState({ name: event.target.value })}
                />
              </FormField>
              <FormField label='Opis kartice' error={this.state.errors.description}>
                <TextInput
                  id='description'
                  value={this.state.description}
                  onDOMChange={event => this.setState({ description: event.target.value })}
                />
              </FormField>
              <FormField label='Ime projekta' error={this.state.errors.selectedProject}>
                <Select placeHolder='/'
                  options={projectOptions}
                  multiple={false}
                  onChange={change => this.changeProject(change.value)}
                  value={this.state.selectedProject} />
              </FormField>
              <FormField label='Izberite uporabnika' error={this.state.errors.owner}>
                <Select placeHolder='/'
                  options={memberOptions}
                  multiple={false}
                  onChange={change => this.setState({ owner: change.value })}
                  value={this.state.owner} />
              </FormField>
              <FormField label='Datum zaključka kartice' error={this.state.errors.expiration}>
                <DateTime
                  id='expiration'
                  format={dateFormat}
                  value={this.state.expiration}
                  onChange={e => this.setState({ expiration: e })}
                />
              </FormField>
              <FormField label='Zahtevnost kartice'>
                <NumberInput
                  min={0}
                  defaultValue={0}
                  value={this.state.estimate}
                  step={0.1}
                  onChange={event => this.setState({ estimate: event.target.value })}
                />
              </FormField>
              <FormField label='Naloge' strong={true} style={{ backgroundColor: '#fdfdfd' }}>
                { this.state.tasks.map((task, i) => (
                  <FormField label={`#${i + 1}`} style={{ backgroundColor: '#fdfdfd' }}>
                    <TextInput
                      value={task.description}
                      onDOMChange={event => this.changeTaskDescription(event.target.value, task.id)}
                    />
                    <Select placeHolder='/'
                      options={memberOptions}
                      multiple={false}
                      onChange={change => this.changeTaskOwner(change.value, task.id)}
                      value={task.owner} />
                  </FormField>
                )
                )}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button icon={<AddIcon />} onClick={() => this.setState({ tasks: [...this.state.tasks, { id: String(this.state.tasks.length + 1), description: '', owner: null }] })} />
                </div>
              </FormField>

            </FormFields>
            <Footer pad={{ vertical: 'medium', between: 'medium' }}>
              {this.props.modeEdit && <Button
                icon={<TrashIcon />}
                onClick={() => this.props.completeAddEditColumn(null)}
              />}
              <Button label='Prekliči'
                secondary={true}
                onClick={() => this.props.closer()}
              />
              {this.props.modeEdit && <Button label='Uredi'
                primary={true}
                onClick={() => this.onSubmit()}
              />}
              {!this.props.modeEdit && <Button label='Dodaj'
                primary={true}
                onClick={() => this.onSubmit()}
              />}
            </Footer>
          </Form>
          <Transition in={this.state.in} timeout={duration}>
            {status => (<Notification message={this.state.notificationError}
              size='small'
              status='critical'
              style={{
                opacity: transitionStyles[status],
                transform: `translate(0, ${transitionStylesTransform[status]}px)`,
                transition: `all ${duration}ms ease-in-out`,
              }} />)
            }
          </Transition>
        </Article>
      </Layer>
    );
  }
}

SidebarColumn.propTypes = {
  modeEdit: PropTypes.bool,
  closer: PropTypes.func.isRequired,
};

SidebarColumn.defaultProps = {
  modeEdit: false,
  columnData: null,
};

const addCardMutation = gql`mutation addCard($cardData: CardInput!, $boardId: Int!){
  addCard(cardData: $cardData, boardId: $boardId) {
    ok
  }
}`;

export default graphql(addCardMutation, {
  name: 'addCardMutation',
})(SidebarColumn);
