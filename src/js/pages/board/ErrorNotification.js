import React, { Component } from 'react';
import PropTypes from 'prop-types';


// Grommet components
import Article from 'grommet/components/Article';
import Button from 'grommet/components/Button';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Footer from 'grommet/components/Footer';
import Layer from 'grommet/components/Layer';
import Section from 'grommet/components/Section';

class ErrorNotification extends Component {
  constructor() {
    super();
    this.onConfirm = this.onConfirm.bind(this);

    this.state = {
      error: 'SLABA'
    };
  }

  onConfirm() {
    console.log('our')
  }

  render() {
    return (
      <Layer>
        <Article pad='small'>
          <Header><Heading tag='h3'>Napaka pri shranjevanju</Heading></Header>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <p2>
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
};

export default ErrorNotification;
