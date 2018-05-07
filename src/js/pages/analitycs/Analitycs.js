import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Template
import PageTemplate from '../../templates/PageTemplate';

// Grommet components
import Tabs from 'grommet/components/Tabs';
import Tab from 'grommet/components/Tab';
import Title from 'grommet/components/Title';

// Components
import FilterGraphTemplate from './FilterGraphTemplate';

class Analitycs extends Component {
  constructor() {
    super();
    this.state = { userRoles: [] };
  }
  // Redirect if necessary
  componentWillMount() {
    // eslint-disable-next-line no-undef
    const user = sessionStorage.getItem('user');
    const userRoles = JSON.parse(user).roles;
    this.setState({ userRoles });
  }

  canView() {
    return (this.state.userRoles.indexOf('km') !== -1);
  }

  render() {
    return (
      <PageTemplate
        header={<Title>Analiza Tabla 1</Title>}
      >
        {this.canView() ?
          <Tabs
            justify='start'
          >
            <Tab title='Čas izdelave'>
              <FilterGraphTemplate boardId={this.props.boardId} type={'leadTime'} />
            </Tab>
            <Tab title='Kumulativni diagram poteka'>
              <FilterGraphTemplate boardId={this.props.boardId} type={'kumulativeFlow'} />
            </Tab>
            <Tab title='Pregled dela po posameznih razvijalcih'>
              <FilterGraphTemplate boardId={this.props.boardId} type={'devWork'} />
            </Tab>
            <Tab title='Kršitve omejitev WIP'>
              <FilterGraphTemplate boardId={this.props.boardId} type={'wip'} />
            </Tab>
          </Tabs>
          :
          <Tabs
            justify='start'
          >
            <Tab title='Kršitve omejitev WIP'>
              <FilterGraphTemplate boardId={this.props.boardId} type={'wip'} />
            </Tab>
          </Tabs>
        }

      </PageTemplate>
    );
  }
}

Analitycs.defaultProps = {
};

Analitycs.propTypes = {
  boardId: PropTypes.string.isRequired,
};

export default Analitycs;
