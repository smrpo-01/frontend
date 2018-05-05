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
import Label from 'grommet/components/Label';
import Paragraph from 'grommet/components/Paragraph';

import Table from 'grommet/components/Table';
import TableRow from 'grommet/components/TableRow';


import TrashIcon from 'grommet/components/icons/base/Trash';
import AddIcon from 'grommet/components/icons/base/Add';
import EditIcon from 'grommet/components/icons/base/Edit';


import Notification from 'grommet/components/Notification';

import { allCardsQuery } from './Board';

const dateFormat = 'D/M/YYYY';
const duration = 100;

const borderColor = '#dbdbdb'

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

    this.setState({
      km,
      po,
      type: km ? 1 : 0,
    });
  }


  formatDate(dateToFormat) {
    let d = dateToFormat.split('-'); // YYYY-MM-DD
    return (d[2] + '.' + d[1] + '.' + d[0]); // DD/MM/YYYY
  }

  getDate(timestamp) {
    const date = new Date(timestamp)
    return `${date.getDate()}.${date.getMonth()}.${1900 + date.getYear()}`
  }

  render() {
    const { data: { card } } = this.props;
    const { getCardLogsQuery: { allCardLogs } } = this.props;
    return (
      <Layer
        closer
        align='right'
      >
        <Article pad='small' size='large'>
          <Form>
            <Header pad={{ vertical: 'medium' }}>
              <Heading>
                Podrobnosti kartice
              </Heading>
            </Header>

            <Tabs justify='start'>
              <Tab title='Podatki o kartici'>
                <div>
                  <div style={{ borderColor: borderColor, borderStyle: 'solid', borderWidth: 1, padding: 10,}}>
                    <Label style={{width: 150}}>
                      Ime kartice:
                    </Label>
                    <Label size='medium' style={{marginLeft: 30}}>
                      {card.name}
                    </Label>
                  </div>
                  <div style={{ borderColor: borderColor, borderStyle: 'solid', borderWidth: 1, padding: 10,}}>
                  <Label style={{width: 150}}>
                      Opis kartice:
                    </Label>
                    <Paragraph size='medium' style={{marginLeft: 30}}>
                      {card.description}
                    </Paragraph>
                  </div>
                  <div style={{ borderColor: borderColor, borderStyle: 'solid', borderWidth: 1, padding: 10,}}>
                    <Label style={{width: 150}}>
                      Ime projekta:
                    </Label>
                    <Label size='medium' style={{marginLeft: 30}}>
                      {card.project.name}
                    </Label>
                  </div>
                  <div style={{ borderColor: borderColor, borderStyle: 'solid', borderWidth: 1, padding: 10,}}>
                    <Label style={{width: 150}}>
                      Ime uporabnika:
                    </Label>
                    <Label size='medium' style={{marginLeft: 30}}>
                      {card.owner.member.firstName} {card.owner.member.lastName}
                    </Label>
                  </div>
                  <div style={{ borderColor: borderColor, borderStyle: 'solid', borderWidth: 1, padding: 10,}}>
                    <Label style={{width: 150}}>
                      Datum zaključka:
                    </Label>
                    <Label size='medium' style={{marginLeft: 30}}>
                      {this.formatDate(card.expiration)}
                    </Label>
                  </div>
                  <div style={{ borderColor: borderColor, borderStyle: 'solid', borderWidth: 1, padding: 10,}}>
                    <Label>
                      Zahtevnost kartice:
                    </Label>
                    <Label size='medium' style={{marginLeft: 30}}>
                      {card.estimate}
                    </Label>
                  </div>
                  { card.tasks.length > 0 &&
                    <div style={{ display: 'flex', flexDirection: 'column', borderColor: borderColor, borderStyle: 'solid', borderWidth: 1,}}>
                      <Label size='medium' style={{marginLeft: 30}}>
                        Naloge
                      </Label>
                      <div style={{ display: 'flex', flexDirection: 'column', padding: 5, paddingLeft: 20, paddingRight: 20}}>
                      {card.tasks.map(task => (
                        <div style={{height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center',}}>
                          <CheckBox label={task.description} defaultChecked={task.done} key={task.id} disabled={true}/>
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
                  <thead>
                    <tr>
                      <th>
                        Čas
                      </th>
                      <th>
                        Iz stolpca
                      </th>
                      <th>
                        Na stolpec
                      </th>
                      <th>
                        Akcija
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    { allCardLogs && allCardLogs.map(log => (
                      <TableRow key={log.id}>
                        <td style={{ opacity: 0.8 }}>
                          {this.getDate(log.timestamp)}
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
                onClick={() => this.props.editCard(card)}
              />
            </Footer>
          </Form>
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

const getCardLogsQuery = gql`query allCardLogs {
  allCardLogs {
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
  }
}`;

export default graphql(getCardLogsQuery, {
  name: 'getCardLogsQuery',
})(SideBarCardMore);
