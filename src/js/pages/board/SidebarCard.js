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

import DeleteNotification from './DeleteNotification';

import TrashIcon from 'grommet/components/icons/base/Trash';
import AddIcon from 'grommet/components/icons/base/Add';


import Notification from 'grommet/components/Notification';

import { allCardsQuery } from './Board';

const dateFormat = 'D.M.YYYY';
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


class SidebarCard extends Component {
  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);
    this.changeProject = this.changeProject.bind(this);
    this.changeTaskDescription = this.changeTaskDescription.bind(this);
    this.changeTaskOwner = this.changeTaskOwner.bind(this);
    this.formatDate = this.formatDate.bind(this);
    this.findFirstColumn = this.findFirstColumn.bind(this);
    this.findPriorityColumn = this.findPriorityColumn.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.canDeleteBorderCheck = this.canDeleteBorderCheck.bind(this);

    this.state = {
      in: false,
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

      return true;
    });
    if (this.props.modeEdit) {
      const { getCardQuery } = this.props;
      const card = getCardQuery.allCards[0];

      this.setState({
        id: card.id,
        name: card.name,
        description: card.description,
        estimate: card.estimate,
        selectedProject: {
          value: card.project.name,
          id: card.project.id
        },
        columnId: card.column.id,
        type: card.type.id === 'A_1' ? 1 : 0,
        expiration: this.formatDate(card.expiration, 'django'),
        owner: {
          value: `${card.owner.member.firstName} ${card.owner.member.lastName}`,
          id: parseInt(card.owner.id, 10),
        },
        tasks: card.tasks.map(task => ({
          description: task.description,
          id: task.id,
          owner: task.assignee && {
            value: `${task.assignee.member.firstName} ${task.assignee.member.lastName}`,
            id: parseInt(task.assignee.id, 10),
          },
          done: task.done,
        })),
        km,
        po,
        type: km ? 1 : 0,
        projects,
        userId,
      });
    } else {
      this.setState({
        km,
        po,
        type: km ? 1 : 0,
        projects,
        userId,
      });
    }
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
        filteredTasks = filteredTasks.map(task => ({ description: task.description, assigneeUserteamId: task.owner && parseInt(task.owner.id, 10), done: task.done }));
        
        const cardData = {
          id: this.state.id,
          name: this.state.name,
          description: this.state.description,
          typeId: parseInt(this.state.type, 10),
          projectId: parseInt(this.state.selectedProject.id, 10),
          expiration: this.state.expiration,
          estimate: parseFloat(this.state.estimate),
          ownerUserteamId: parseInt(this.state.owner.id, 10),
          tasks: filteredTasks,
          columnId: this.props.modeEdit && this.state.columnId || column.id,
        };

        if (this.props.modeEdit) {
          this.props.editCardMutation({
            variables: {
              cardData,
            },
            refetchQueries: [{
              query: getCardQuery,
              variables: { cardId: this.state.id },
            }]
          }).then(res => this.props.closer())
            .catch(err => {
              this.setState({
                in: true,
                notificationError: err.message.split(':')[1],
              });
            });
        } else {
          const user = sessionStorage.getItem('user');
          const userId = JSON.parse(user).id;

          this.props.addCardMutation({
            variables: {
              cardData,
              boardId: this.props.boardId,
              userId,
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

  canDeleteBorderCheck(columns) {
    for (let c = 0; c < columns.length; c++) {
      if (columns[c].id === this.state.columnId) return true;
      if (columns[c].priority) return false;

      const returnedColumn = this.canDeleteBorderCheck(columns[c].columns);
      if (returnedColumn !== null) {
        return returnedColumn;
      }
    }

    return null;
  }

  onDelete(causeOfDeletion) {
    this.props.deleteCardMutation({
      variables: {
        causeOfDeletion,
        cardId: this.state.id,
      }, refetchQueries: [{
        query: allCardsQuery,
        variables: {
          id: this.props.boardId,
        }
      }]
    }).then(res => {
      this.setState({
        dialogDelete: false,
      });
      this.props.closer();
    }).catch(err => {
      console.log(err);
    });
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
        const members = currentProject[0].team.developers;
        memberOptions = members.map(member => ({ value: `${member.firstName} ${member.lastName}`, id: parseInt(member.idUserTeam, 10) }));
      }
    }

    let canDelete = false;

    if (this.state.selectedProject) {
      let user = sessionStorage.getItem('user');
      user = JSON.parse(user);
      const project = this.props.data.projects.filter(pr => this.state.selectedProject && pr.id === this.state.selectedProject.id)[0];

      const isPo = project && project.team.productOwner.idUser === user.id;
      const isKM = project && project.team.kanbanMaster.idUser === user.id;
      if (isPo && this.canDeleteBorderCheck(this.props.columns)) {
        canDelete = true;
      } else if (isKM) {
        canDelete = true;
      }
    }

    let whoCanEdit = {
      cardDescription: true,
      cardName: true,
      date: true,
      estimate: true,
      owner: true,
      projectName: true,
      tasks: true,
      type: true,
    };
    if (this.props.whoCanEditQuery.whoCanEdit && this.props.modeEdit) {
      whoCanEdit = {
        ...this.props.whoCanEditQuery.whoCanEdit,
        type: false,
      };
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
              <FormField style={{ backgroundColor: whoCanEdit.type ? 'white' : '#f0f0f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-around', margin: 20, }}>
                  <CheckBox label='Navadna kartica'
                    toggle={false}
                    disabled={!whoCanEdit.type || !this.state.po}
                    checked={this.state.type === 0 && this.state.po}
                    onChange={() => this.changeType(0)} />
                  <CheckBox label='Silver bullet'
                    toggle={false}
                    disabled={!whoCanEdit.type || !this.state.km}
                    checked={this.state.type === 1 && this.state.km}
                    onChange={() => this.changeType(1)} />
                </div>
              </FormField>
              <FormField label='Ime kartice' error={this.state.errors.name} style={{ backgroundColor: whoCanEdit.cardName ? 'white' : '#f0f0f0' }}>
                <TextInput
                  id='name'
                  value={this.state.name}
                  onDOMChange={event => this.setState({ name: event.target.value })}
                  disabled={!whoCanEdit.cardName}
                />
              </FormField>
              <FormField label='Opis kartice' error={this.state.errors.description} style={{ backgroundColor: whoCanEdit.cardDescription ? 'white' : '#f0f0f0' }}>
                <TextInput
                  id='description'
                  value={this.state.description}
                  onDOMChange={event => this.setState({ description: event.target.value })}
                  disabled={!whoCanEdit.cardDescription}
                />
              </FormField>
              <FormField label='Ime projekta' error={this.state.errors.selectedProject} style={{ backgroundColor: whoCanEdit.projectName ? 'white' : '#f0f0f0' }}>
                { (!whoCanEdit.projectName &&
                  (<TextInput
                    id='project'
                    value={this.state.selectedProject && this.state.selectedProject.value || ''}
                    disabled={true}
                  />)) ||
                    <Select placeHolder='/'
                      options={projectOptions}
                      multiple={false}
                      onChange={change => this.changeProject(change.value)}
                      value={this.state.selectedProject} />
                }
                
              </FormField>
              <FormField label='Izberite uporabnika' error={this.state.errors.owner} style={{ backgroundColor: whoCanEdit.owner ? 'white' : '#f0f0f0' }}>
                { (!whoCanEdit.owner &&
                    (<TextInput
                      id='owner'
                      value={this.state.owner && this.state.owner.value}
                      disabled={true}
                    />)) ||
                    <Select placeHolder='/'
                      options={memberOptions}
                      multiple={false}
                      onChange={change => this.setState({ owner: change.value })}
                      value={this.state.owner} />
                }
              </FormField>
              <FormField label='Datum zaključka kartice' error={this.state.errors.expiration} style={{ backgroundColor: whoCanEdit.date ? 'white' : '#f0f0f0' }}>
                { (!whoCanEdit.date &&
                  (<TextInput
                    id='date'
                    value={this.state.expiration}
                    disabled={true}
                  />)) ||
                  <DateTime
                    id='expiration'
                    format={dateFormat}
                    value={this.state.expiration}
                    format={dateFormat}
                    onChange={e => this.setState({ expiration: e })}
                  />
                }
              </FormField>
              <FormField label='Zahtevnost kartice' style={{ backgroundColor: whoCanEdit.estimate ? 'white' : '#f0f0f0' }}>
              { (!whoCanEdit.date &&
                (<TextInput
                  id='date'
                  value={this.state.estimate}
                  disabled={true}
                />)) ||
                <NumberInput
                  min={0}
                  value={this.state.estimate}
                  step={0.1}
                  onChange={event => this.setState({ estimate: event.target.value })}
                />
              }
              </FormField>
              <FormField label='Naloge' strong={true} style={{ backgroundColor: '#fdfdfd' }}>
                { this.state.tasks.map((task, i) => (
                  <FormField label={`#${i + 1}`} style={{ backgroundColor: '#fdfdfd' }} key={task.id}>
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
              {this.props.modeEdit && canDelete && <Button
                icon={<TrashIcon />}
                onClick={() => this.setState({dialogDelete: true})}
              />}
              <Button label='Prekliči'
                secondary={true}
                onClick={() => this.props.closer()}
              />
              {this.props.modeEdit && <Button label='Shrani'
                primary={true}
                onClick={() => this.onSubmit()}
              />}
              {!this.props.modeEdit && <Button label='Dodaj'
                primary={true}
                onClick={() => this.onSubmit()}
              />}
            </Footer>
          </Form>
          { this.state.dialogDelete &&
            <DeleteNotification closer={() => this.setState({ dialogDelete: false })} delete={(causeOfDeletion) => this.onDelete(causeOfDeletion)} />
          }
          <Transition in={this.state.in} timeout={duration}>
            {status => (<Notification message={this.state.notificationError || ''}
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

SidebarCard.propTypes = {
  modeEdit: PropTypes.bool,
  closer: PropTypes.func.isRequired,
};

SidebarCard.defaultProps = {
  modeEdit: false,
  columnData: null,
};

const addCardMutation = gql`mutation addCard($cardData: CardInput!, $boardId: Int!, $userId: Int!){
  addCard(cardData: $cardData, boardId: $boardId, userId: $userId) {
    ok
  }
}`;

const editCardMutation = gql`mutation editCard($cardData: CardInput!){
  editCard(cardData: $cardData) {
    ok
  }
}`;

export const whoCanEditQuery = gql`query whoCanEdit($userId: Int!, $cardId: Int, $skip: Boolean!){
  whoCanEdit(userId:$userId, cardId: $cardId) @skip (if: $skip){
    cardName
    cardDescription
    projectName
    owner
    date
    estimate
    tasks
    error
  }
}`;

const deleteCardMutation = gql`mutation deleteCardMutation($causeOfDeletion: String!, $cardId: Int!) {
  deleteCard(causeOfDeletion: $causeOfDeletion, cardId: $cardId) {
    ok
  }
}`;

const getCardQuery = gql`query allCards($cardId: Int!) {
  allCards(cardId: $cardId) {
    id
    cardNumber
    colorRejected
    column {
      id
    }
    type {
      id
    }
    description
    name
    estimate
    project {
      id
      name
      team {
        id
        members {
          id
          firstName
          lastName
        }
        developers {
          idUser
          isActive
        }
        kanbanMaster {
          idUser
          isActive
        }
        productOwner {
          idUser
          isActive
        }
      }
    }
    expiration
    owner {
      id
      member {
        id
        firstName
        lastName
      }
    }
    tasks {
      id
      description
      done
      assignee {
        id
        member {
          id
          firstName
          lastName
        }
      }
    }
  }
}`;


export default compose(
  graphql(addCardMutation, {
    name: 'addCardMutation',
  }),
  graphql(editCardMutation, {
    name: 'editCardMutation',
  }),
  graphql(deleteCardMutation, {
    name: 'deleteCardMutation',
  }),
  graphql(getCardQuery, {
    name: 'getCardQuery',
    options: (props) => {
      return ({
        variables: {
          cardId: parseInt(props.cardId, 10) || -1,
        }
      });
    },
  }),
  graphql(whoCanEditQuery, {
    name: 'whoCanEditQuery',
    options: (props) => {
      const user = sessionStorage.getItem('user');
      const userId = JSON.parse(user).id;
      return ({ variables: {
        userId,
        cardId: (props.data.card && parseInt(props.data.card.id, 10)) || null,
        skip: false,
      }});
    }})
)(SidebarCard);
