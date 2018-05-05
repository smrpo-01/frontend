import React, { Component } from 'react';
import PropTypes from 'prop-types';


// Grommet components
import Article from 'grommet/components/Article';
import Button from 'grommet/components/Button';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Footer from 'grommet/components/Footer';
import Layer from 'grommet/components/Layer';
import TextInput from 'grommet/components/TextInput';

class ErrorNotificationCard extends Component {
  constructor() {
    super();

    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      force: '',
      error: '',
    };
  }

  onSubmit() {
    if (this.state.force !== '') {
      this.props.continue(this.state.force);
    } else {
      this.setState({
        error: 'Razlog ne sme biti prazen',
      });
    }
  }

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
          { this.props.error !== ' Ne moreš premikati za več kot ena v levo/desno.' &&
            <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <h style={{ color: 'red' }}>
                  Razlog za nadaljevanje:
                </h>
              </div>
              <TextInput
                value={this.state.force}
                onDOMChange={event => this.setState({ force: event.target.value })}
              />
            </div>
          }
          {
            this.state.error !== '' &&
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <h style={{ color: 'red' }}>
                Razlog ne sme biti prazen
              </h>
            </div>
          }
          <Footer pad={{ vertical: 'medium', between: 'medium' }} justify='center'>
            <Button label='Prekliči'
              primary={false}
              onClick={() => this.props.closer()}
            />
            { this.props.error !== ' Ne moreš premikati za več kot ena v levo/desno.' &&
            <Button label='Nadaljuj'
              primary={true}
              onClick={() => this.onSubmit()}
            />
            }
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
