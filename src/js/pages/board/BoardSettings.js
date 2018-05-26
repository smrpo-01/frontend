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
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import NumberInput from 'grommet/components/NumberInput';


class BoardSettings extends Component {
  render() {
    return (
      <Layer onClose={this.props.closer} closer>
        <Article pad='small'>
          <Header justify='center'>
            <Heading tag='h3' strong>Uporabniške nastavitve table</Heading>
          </Header>
          <Section pad='none'>
            <Form style={{ maxWidth: 300 }}>
              <FormField label='Število dni do poteka roka kartice'>
                <NumberInput
                  min={0}
                  value={this.props.timeframe}
                  onChange={e => this.props.updateParent(e.target.value)}
                />
              </FormField>
            </Form>
          </Section>
          <Footer pad={{ vertical: 'medium' }} justify='between'>
            <Button secondary label='Prekliči' onClick={this.props.closer} />
            <Button primary label='Potrdi' onClick={this.props.closer} />
          </Footer>
        </Article>
      </Layer>
    );
  }
}


BoardSettings.propTypes = {
  closer: PropTypes.func.isRequired,
  updateParent: PropTypes.func.isRequired,
  timeframe: PropTypes.number.isRequired,
};


BoardSettings.defaultProps = {};

export default BoardSettings;
