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
  // Redirect if necessary
  componentWillMount() {
    // eslint-disable-next-line no-undef
    const user = sessionStorage.getItem('user');
    const userRoles = JSON.parse(user).roles;
    if (userRoles.indexOf('km') === -1) {
      this.props.history.push('/home');
    }
  }

  render() {
    console.log(this.props.boardId);
    return (
      <PageTemplate
        header={<Title>Analiza Tabla 1</Title>}
      >
        <Tabs justify='start'>
          <Tab title='Povprečni čas izdelave'>
            <FilterGraphTemplate boardId={this.props.boardId} type={'leadTime'} />
          </Tab>

          <Tab title='Kumulativni diagram poteka'>
            <FilterGraphTemplate boardId={this.props.boardId} type={'kumulativeFlow'} />
          </Tab>

          <Tab title='Pregled dela'>
            <FilterGraphTemplate boardId={this.props.boardId} type={'devWork'} />
          </Tab>

          <Tab title='Kršitve WIP'>
            <FilterGraphTemplate boardId={this.props.boardId} type={'wip'} />
          </Tab>
        </Tabs>
      </PageTemplate>
    );
  }
}

Analitycs.defaultProps = {
};

Analitycs.propTypes = {
  history: PropTypes.object.isRequired,
  boardId: PropTypes.string.isRequired,
};

export default Analitycs;
