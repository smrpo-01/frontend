import React, { Component } from 'react';
import PropTypes from 'prop-types';


// Grommet components
import Article from 'grommet/components/Article';
import Button from 'grommet/components/Button';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Footer from 'grommet/components/Footer';
import Layer from 'grommet/components/Layer';

class ErrorNotification extends Component {
  render() {
    return (
      <Layer>
        <Article pad='small'>
          <Header justify='center'><Heading tag='h3'>Napaka pri urejanju kartice</Heading></Header>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <p2 style={{ color: 'red' }}>
              {this.props.error}
            </p2>
          </div>
          <Footer pad={{ vertical: 'medium', between: 'medium' }} justify='center'>
            <Button label='Vredu'
              primary={true}
              onClick={() => this.props.closer()}
            />
          </Footer>
        </Article>
      </Layer>
    );
  }
}


ErrorNotification.propTypes = {
  closer: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired,
};


ErrorNotification.defaultProps = {
  error: '',
};

export default ErrorNotification;
