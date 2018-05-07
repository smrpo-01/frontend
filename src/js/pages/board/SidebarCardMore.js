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
import Tabs from 'grommet/components/Tabs';
import Tab from 'grommet/components/Tab';
import TableHeader from 'grommet/components/TableHeader';


import Label from 'grommet/components/Label';
import Paragraph from 'grommet/components/Paragraph';

import Table from 'grommet/components/Table';
import TableRow from 'grommet/components/TableRow';


import EditIcon from 'grommet/components/icons/base/Edit';


import { whoCanEditQuery } from './SidebarCard';

const dateFormat = 'D/M/YYYY';
const duration = 100;

const borderColor = '#dbdbdb';


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


class SideBarCardMore extends Component {
  constructor() {
    super();
    this.formatDate = this.formatDate.bind(this);
    this.getDate = this.getDate.bind(this);
    this.toggleTask = this.toggleTask.bind(this);

    this.state = {
      in: false,
      id: 0,
      km: false,
      po: false,
      name: '',
      tasks: [],
      type: {
        id: ''
      },
      errors: {},
      estimate: 0,
      description: '',
      project: {
        name: '',
      },
      owner: {
        member: {
          firstName: '',
          lastName: ''
        }
      },
      expiration: '',
    };
  }

  toggleTask(taskId, done) {
    let tasks = this.state.tasks.map(task => task.id === taskId && {
      ...task,
      done: !task.done,
    } || task);

    const user = sessionStorage.getItem('user');
    const userId = JSON.parse(user).id;
    const prevTasks = this.state.tasks;

    this.setState({
      tasks
    });

    this.props.setDoneTaskMutation({
      variables: {
        taskId: parseInt(taskId, 10),
        done: !done,
        userId
      },
      refetchQueries: [{
        query: getCardQuery,
        variables: {
          cardId: this.state.id,
        }
      }]
    }).then(res => {})
      .catch(err => {
        if (err.message.split(':')[1] !== ' None') {
          this.props.showError(err.message.split(':')[1]);
        }
        this.setState({
          tasks: prevTasks,
        });
      });
  }

  componentWillMount() {
    this.props.getCardLogsQuery.refetch();
    this.props.whoCanEditQuery.refetch();
    this.props.getCardQuery.refetch();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.getCardQuery.allCards) {
      const card = nextProps.getCardQuery.allCards[0];
      this.setState({
        id: card.id,
        name: card.name,
        tasks: card.tasks,
        type: card.type,
        description: card.description,
        project: card.project,
        owner: card.owner,
        estimate: card.estimate,
        expiration: card.expiration
      });
    }
  }

  formatDate(dateToFormat) {
    let d = dateToFormat.split('-'); // YYYY-MM-DD
    return (d[2] + '.' + d[1] + '.' + d[0]); // DD/MM/YYYY
  }

  getDate(timestamp) {
    const date = new Date(timestamp);
    return `${date.getHours() > 9 ? date.getHours() : '0' + date.getHours()}:${date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()}:${date.getSeconds() > 9 ? date.getSeconds() :'0' + date.getSeconds()} ${date.getDate()}.${date.getMonth() + 1}.${1900 + date.getYear()}`;
  }

  render() {
    const { getCardLogsQuery: { allCardLogs } } = this.props;
    let card = {};
    if (this.props.getCardQuery.allCards && this.props.getCardQuery.allCards.length > 0) {
      card = this.props.getCardQuery.allCards[0];
    }

    return (
      <Layer
        closer
        align='right'
      >
        <Article pad='small' style={{width: 800}}>
          <Header pad={{ vertical: 'medium' }}>
            <Heading>
              Podrobnosti kartice
            </Heading>
          </Header>

          <Tabs justify='start'>
            <Tab title='Podatki o kartici'>
              <div>
                <div style={{ borderColor: borderColor, borderStyle: 'solid', borderWidth: 1, padding: 10 }}>
                  <Label style={{width: 150}}>
                    Tip kartice:
                  </Label>
                  <Label size='medium' style={{marginLeft: 30, fontWeight: 600}}>
                    {this.state.type && this.state.type.id === 'A_0' && 'Navadna kartica'}
                    {this.state.type && this.state.type.id === 'A_1' && 'Silver bullet'}
                  </Label>
                </div>
                <div style={{ borderColor: borderColor, borderStyle: 'solid', borderWidth: 1, padding: 10 }}>
                  <Label style={{width: 150}}>
                    Ime kartice:
                  </Label>
                  <Label size='medium' style={{marginLeft: 30, fontWeight: 600}}>
                    {this.state.name}
                  </Label>
                </div>
                <div style={{ borderColor: borderColor, borderStyle: 'solid', borderWidth: 1, padding: 10,}}>
                <Label style={{width: 150}}>
                    Opis kartice:
                  </Label>
                  <Paragraph size='medium' style={{marginLeft: 30, fontWeight: 600}}>
                    {this.state.description}
                  </Paragraph>
                </div>
                <div style={{ borderColor: borderColor, borderStyle: 'solid', borderWidth: 1, padding: 10,}}>
                  <Label style={{width: 150}}>
                    Ime projekta:
                  </Label>
                  <Label size='medium' style={{marginLeft: 30, fontWeight: 600}}>
                    {this.state.project && this.state.project.name}
                  </Label>
                </div>
                <div style={{ borderColor: borderColor, borderStyle: 'solid', borderWidth: 1, padding: 10,}}>
                  <Label style={{width: 150}}>
                    Ime uporabnika:
                  </Label>
                  <Label size='medium' style={{marginLeft: 30, fontWeight: 600}}>
                    {this.state.owner && this.state.owner.member.firstName} {this.state.owner && this.state.owner.member.lastName}
                  </Label>
                </div>
                <div style={{ borderColor: borderColor, borderStyle: 'solid', borderWidth: 1, padding: 10,}}>
                  <Label style={{width: 150}}>
                    Datum zaključka:
                  </Label>
                  <Label size='medium' style={{marginLeft: 30, fontWeight: 600}}>
                    {this.state.expiration && this.formatDate(this.state.expiration)}
                  </Label>
                </div>
                <div style={{ borderColor: borderColor, borderStyle: 'solid', borderWidth: 1, padding: 10,}}>
                  <Label>
                    Zahtevnost kartice:
                  </Label>
                  <Label size='medium' style={{marginLeft: 30, fontWeight: 600}}>
                    {this.state.estimate}
                  </Label>
                </div>
                { this.state.tasks.length > 0 &&
                  <div style={{ display: 'flex', flexDirection: 'column', borderColor: borderColor, borderStyle: 'solid', borderWidth: 1,}}>
                    <Label size='medium' style={{marginLeft: 30, fontWeight: 600}}>
                      Naloge
                    </Label>
                    <div style={{ display: 'flex', flexDirection: 'column', padding: 5, paddingLeft: 20, paddingRight: 20}}>
                      {this.state.tasks.map(task => (
                        <div style={{height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center',}} key={task.id}>
                          <CheckBox label={task.description} checked={task.done} key={task.id} onClick={() => this.toggleTask(task.id, task.done)} />
                          <p>
                            {task.assignee && task.assignee.member.firstName} {task.assignee && task.assignee.member.lastName}
                            {!task.assignee && '/'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                }
              </div>
            </Tab>
            <Tab title='Akcije kartice'>
              <Table>
                <TableHeader
                  labels={['Čas', 'Uporabnik', 'Iz stolpca', 'Na stolpec', 'Razlog']}
                />
                <tbody>
                  { allCardLogs && allCardLogs.map(log => (
                    <TableRow key={log.id}>
                      <td style={{ opacity: 0.8 }}>
                        {this.getDate(log.timestamp)}
                      </td>
                      <td style={{ opacity: 0.8 }}>
                        {log.userTeam.member.firstName} {log.userTeam.member.lastName}
                      </td>
                      <td style={{ opacity: log.fromColumn ? 1 : 0.3 }}>
                        {log.fromColumn ? log.fromColumn.name : '/'}
                      </td>
                      <td style={{ opacity: log.toColumn ? 1 : 0.3 }}>
                        {log.toColumn ? log.toColumn.name : '/'}
                      </td>
                      <td style={{ opacity: log.action ? 1 : 0.3, color: log.action && 'red' }}>
                        {log.action ? log.action : 'Premik'}
                      </td>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            </Tab>
          </Tabs>
          <Footer pad={{ vertical: 'medium', between: 'medium' }}>
            <Button label='Prekliči'
              secondary={true}
              onClick={() => this.props.closer()}
            />
            <Button label='Uredi'
              primary={true}
              icon={<EditIcon />}
              onClick={this.props.whoCanEditQuery && this.props.whoCanEditQuery.whoCanEdit && this.props.whoCanEditQuery.whoCanEdit.error !== null ? null : (() => this.props.editCard(card))}
            />
            { this.props.whoCanEditQuery && this.props.whoCanEditQuery.whoCanEdit && this.props.whoCanEditQuery.whoCanEdit.error !== null &&
            <h style={{ color: 'red' }}>
              {this.props.whoCanEditQuery.whoCanEdit.error}
            </h>
            }
          </Footer>
        </Article>
      </Layer>
    );
  }
}

SideBarCardMore.propTypes = {
  closer: PropTypes.func.isRequired,
};

SideBarCardMore.defaultProps = {
};

export const getCardLogsQuery = gql`query allCardLogs($cardId: Int!) {
  allCardLogs(cardId: $cardId) {
    id
    card {
      id
    }
    fromColumn {
      id
      name
    }
    toColumn {
      id
      name
    }
    action
    timestamp
    userTeam {
      member {
        id
        firstName
        lastName
      }
    }
  }
}`;

export const getCardQuery = gql`query allCards($cardId: Int!) {
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

const setDoneTaskMutation = gql`mutation setDoneTaskMutation($taskId: Int!, $done: Boolean!, $userId: Int!) {
  setDoneTask(taskId: $taskId, done: $done, userId: $userId) {
    ok
  }
}`;

export default compose(
  graphql(setDoneTaskMutation, {
    name: 'setDoneTaskMutation',
  }),
  graphql(getCardLogsQuery, {
    name: 'getCardLogsQuery',
    options: props => {
      return ({ variables: { cardId: parseInt(props.cardId, 10) } })
    }
  }),
  graphql(getCardQuery, {
    name: 'getCardQuery',
    options: props => ({ variables: { cardId: parseInt(props.cardId, 10) } })
  }),
  graphql(whoCanEditQuery, {
    name: 'whoCanEditQuery',
    options: (props) => {
      const user = sessionStorage.getItem('user');
      const userId = JSON.parse(user).id;
      return ({ variables: {
        userId,
        cardId: props.cardId,
        skip: false,
    }});
  }}))(SideBarCardMore);
