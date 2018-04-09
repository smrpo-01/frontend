import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Image from 'grommet/components/Image';

import CaretNextIcon from 'grommet/components/icons/base/CaretNext';
import CaretPreviousIcon from 'grommet/components/icons/base/CaretPrevious';
import CaretDownIcon from 'grommet/components/icons/base/CaretDown';
import EditIcon from 'grommet/components/icons/base/Edit';
import Card from './Card';


import CheckBox from 'grommet/components/CheckBox';

class ColumnReal extends Component {
  render() {
    const columnData = this.props.data;
    return (
      <div style={{ display: 'flex', minWidth: 200, borderColor: '#cbd0c4', borderStyle: 'solid', borderWidth: 1, marginLeft: 5, marginRight: 5, justifyContent: 'center', backgroundColor: '#fbfff7' }}>
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }}>
          <div style={{ fontSize: 20, backgroundColor: '#ececec', width: '90%', display: 'flex', alignItems: 'center', flexDirection: 'column', borderBottomLeftRadius: 6, borderBottomRightRadius: 6, borderStyle: 'solid', borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderTopWidth: 0, minHeight: 30}}>
            <h >
              {columnData.name}
            </h>
          </div>
          { columnData.columns.length !== 0 &&
            <div style={{ display: 'flex', width: '100%', height: '100%'}}>
              {columnData.columns.map((subcolumn, i) => <ColumnReal data={subcolumn} key={i} addEditColumn={this.props.addEditColumn} />)
              }
            </div>
          }
          { columnData.cards && columnData.cards.length !== 0 && 
            columnData.cards.map((card, i) => <Card id={card.id} name={card.name} expiration={card.expiration} owner={card.owner} tasks={card.tasks} key={i} />)
          }
        </div>
      </div>
    );
  }
}

ColumnReal.defaultProps = {
  name: '',
};

ColumnReal.propTypes = {
  name: PropTypes.string,
};


export default ColumnReal;
