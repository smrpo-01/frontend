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

class DeleteNotification extends Component {
  constructor() {
    super();

    this.state = {
      causeOfDeletion: ''
    };
  }

  render() {
    return (
      <Layer>
        <Article pad='small'>
          <Header justify='center'><Heading tag='h3'>Brisanje kartice</Heading></Header>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <p2>
              Napišite razlog za brisanje kartice
            </p2>
          </div>
          <TextInput
            value={this.state.causeOfDeletion}
            onDOMChange={event => this.setState({ causeOfDeletion: event.target.value })}
          />
          <Footer pad={{ vertical: 'medium', between: 'medium' }} justify='center'>
            <Button label='Prekliči'
              primary={false}
              onClick={() => this.props.closer()}
            />
            <Button label='Potrdi'
              primary={true}
              onClick={() => this.props.delete(this.state.causeOfDeletion)}
            />
          </Footer>
        </Article>
      </Layer>
    );
  }
}


DeleteNotification.propTypes = {
  closer: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired,
};


DeleteNotification.defaultProps = {
  error: '',
};

export default DeleteNotification;
