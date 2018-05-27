import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';


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
  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      onSubmit: this.onSubmit,
      error: '',
    };
  }

  onSubmit() {
    this.setState({ onSubmit: null, error: ''});
    console.log(this.props);
    this.props.mutateDaysToExpire({
      variables: { boardId: this.props.boardId, daysToExpire: this.props.daysToExpire  }
    })
      .then(() => this.props.closer())
      .catch((err) => {
        console.error(err);
        this.setState({ onSubmit: this.onSubmit, error: err.message.split(':')[1] });
      });
  }

  render() {
    // eslint-disable-next-line no-undef
    const user = sessionStorage.getItem('user');
    const userRoles = JSON.parse(user).roles;
    console.log(userRoles);

    return (
      <Layer onClose={this.props.closer} closer>
        <Article pad='small'>
          <Header justify='start'>
            <Heading tag='h3' strong>Uporabniške nastavitve table</Heading>
          </Header>
          <Section pad='none'>
            <Form style={{ maxWidth: 310 }}>
              {(userRoles.indexOf('km') !== -1) &&
                <FormField label='Število dni do zahtevanega roka za dokončanje'>
                  <NumberInput
                    min={0}
                    value={this.props.daysToExpire}
                    onChange={e => this.props.updateDaysToExpire(e.target.value)}
                  />
                </FormField>
              }
              <FormField label='Število dni do poteka roka kartice'>
                <NumberInput
                  min={0}
                  value={this.props.timeframe}
                  onChange={e => this.props.updateTimeframe(e.target.value)}
                />
              </FormField>

            </Form>
          </Section>
          {(this.state.error !== '') &&
            <Section className='color-red padding-bottom-0'>{this.state.error}</Section>
          }
          <Footer pad={{ vertical: 'medium' }} justify='between'>
            <Button secondary label='Prekliči' onClick={this.props.closer} />
            <Button primary label='Potrdi' onClick={this.onSubmit} />
          </Footer>
        </Article>
      </Layer>
    );
  }
}


BoardSettings.propTypes = {
  closer: PropTypes.func.isRequired,
  updateTimeframe: PropTypes.func.isRequired,
  updateDaysToExpire: PropTypes.func.isRequired,
  timeframe: PropTypes.number.isRequired,
  daysToExpire: PropTypes.number.isRequired,
  boardId: PropTypes.number.isRequired,
};


BoardSettings.defaultProps = {};

export const mutateDaysToExpire = gql`
  mutation setBoardExpiration($boardId: Int!, $daysToExpire: Int!) {
      setBoardExpiration(boardId: $boardId, daysToExpire: $daysToExpire) {
        board {
          id
          daysToExpire
        }
      }
  }
`;

const BoardSettingsWithMutations = compose(
  graphql(mutateDaysToExpire, {
    name: 'mutateDaysToExpire'
  })
)(BoardSettings);

export default BoardSettingsWithMutations;
