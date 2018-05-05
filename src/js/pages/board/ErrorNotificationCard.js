import React, { Component } from 'react';
import PropTypes from 'prop-types';


// Grommet components
import Article from 'grommet/components/Article';
import Button from 'grommet/components/Button';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Footer from 'grommet/components/Footer';
import Layer from 'grommet/components/Layer';

class ErrorNotificationCard extends Component {
  render() {
    return (
      <Layer>
        <Article pad='small'>
          <Header justify='center'><Heading tag='h3' >Napaka pri premiku karice</Heading></Header>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <h style={{ color: 'red' }}>
              {this.props.error}
            </h>
          </div>
          <Footer pad={{ vertical: 'medium', between: 'medium' }} justify='center'>
            <Button label='Prekliči'
              primary={false}
              onClick={() => this.props.closer()}
            />
            <Button label='Nadaljuj'
              primary={true}
              onClick={() => this.props.continue('For Real')}
            />
          </Footer>
        </Article>
      </Layer>
    );
  }
}


ErrorNotificationCard.propTypes = {
  closer: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired,
};


ErrorNotificationCard.defaultProps = {
  error: '',
};

export default ErrorNotificationCard;
