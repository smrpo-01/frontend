import React, { Component } from 'react';
import { Transition } from 'react-transition-group';
import PropTypes from 'prop-types';
import uuid from 'uuid/v4';

import Layer from 'grommet/components/Layer';
import Article from 'grommet/components/Article';


import Form from 'grommet/components/Form';
import Button from 'grommet/components/Button';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Footer from 'grommet/components/Footer';
import FormFields from 'grommet/components/FormFields';
import FormField from 'grommet/components/FormField';
import TextInput from 'grommet/components/TextInput';

import TrashIcon from 'grommet/components/icons/base/Trash';

import CheckBox from 'grommet/components/CheckBox';

import Notification from 'grommet/components/Notification';


const duration = 100;

const transitionStyles = {
  entering: 0,
  entered: 0.9,
  exited: 0,
};

const transitionStylesTransform = {
  entering: 0,
  entered: 30,
  exited: 0,
};


class SidebarColumn extends Component {
  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      in: false,
      id: uuid(),
      name: '',
      columns: [],
      wip: '',
      boundary: false,
      priority: false,
      acceptance: false,
    };
  }


  componentWillMount() {
    if (this.props.modeEdit) {
      this.setState({
        id: this.props.columnData.id,
        name: this.props.columnData.name,
        columns: this.props.columnData.columns,
        wip: String(this.props.columnData.wip),
        boundary: this.props.columnData.boundary,
        priority: this.props.columnData.priority,
        acceptance: this.props.columnData.acceptance,
      });
    }
  }

  onSubmit() {
    this.setState({
      in: false,
    }, () => {
      if (this.state.name === '' || this.state.wip === '' ) {
        this.setState({
          in: true,
        });
      } else {
        this.props.completeAddEditColumn({
          id: this.state.id,
          name: this.state.name,
          columns: this.state.columns,
          wip: this.state.wip,
          boundary: this.state.boundary,
          priority: this.state.priority,
          acceptance: this.state.acceptance,
        });
      }
    });
  }

  render() {
    console.log(this.state)
    return (
      <Layer
        closer
        align='right'
      >
        <Article pad='small' size='medium'>
          <Form>
            <Header pad={{ vertical: 'medium' }}>
              <Heading>
                {(this.props.modeEdit) ? 'Uredi stolpec' : 'Dodaj stolpec'}
              </Heading>
            </Header>

            <FormFields>
              <FormField label='Ime stolpca'>
                <TextInput
                  id='name'
                  value={this.state.name}
                  onDOMChange={event => this.setState({ name: event.target.value })}
                />
              </FormField>
              <FormField label='Omejitev WIP'>
                <TextInput
                  id='wip'
                  value={this.state.wip}
                  onDOMChange={event => this.setState({ wip: event.target.value })}
                />
              </FormField>
              <FormField>
                <CheckBox label='Mejni stolpec'
                  toggle={true}
                  checked={this.state.boundary}
                  onChange={() => this.setState({ boundary: !this.state.boundary })} />
                <CheckBox label='Stolpec kartic z najvišjo prioriteto'
                  toggle={true}
                  checked={this.state.priority}
                  onChange={() => this.setState({ priority: !this.state.priority })} />
                <CheckBox label='Stolpec za sprejemno testiranje'
                  toggle={true}
                  checked={this.state.acceptance}
                  onChange={() => this.setState({ acceptance: !this.state.acceptance })} />
              </FormField>
            </FormFields>
            <Footer pad={{ vertical: 'medium', between: 'medium' }}>
              {this.props.modeEdit && <Button
                icon={<TrashIcon />}
                onClick={() => this.props.completeAddEditColumn(null)}
              />}
              <Button label='Prekliči'
                secondary={true}
                onClick={() => this.props.closer()}
              />
              {this.props.modeEdit && <Button label='Uredi'
                primary={true}
                onClick={() => this.onSubmit()}
              />}
              {!this.props.modeEdit && <Button label='Dodaj'
                primary={true}
                onClick={() => this.onSubmit()}
              />}
            </Footer>
          </Form>
          <Transition in={this.state.in} timeout={duration}>
            {status => (<Notification message='Vsi podatki morajo biti pravilno vnešeni'
              size='large'
              status='critical'
              style={{
                opacity: transitionStyles[status],
                transform: `translate(0, ${transitionStylesTransform[status]}px)`,
                transition: `all ${duration}ms ease-in-out`,
              }} />)
            }
          </Transition>
        </Article>
      </Layer>
    );
  }
}

SidebarColumn.defaultProps = {
};

SidebarColumn.propTypes = {
};


export default SidebarColumn;
