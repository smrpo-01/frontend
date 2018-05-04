import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Template
import PageTemplate from '../../templates/PageTemplate';

// Grommet components
import Tabs from 'grommet/components/Tabs';
import Tab from 'grommet/components/Tab';
import Title from 'grommet/components/Title';

// Components
import LeadTime from './LeadTime';

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
            <LeadTime boardId={this.props.boardId} />
          </Tab>

          {/*
            <Tab title='Pregled dela' />
            <Tab title='Kumulativni diagram poteka' />
            <Tab title='Krštitve WIP' />
          */}
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
