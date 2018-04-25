import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Image from 'grommet/components/Image';

import CaretNextIcon from 'grommet/components/icons/base/CaretNext';
import CaretPreviousIcon from 'grommet/components/icons/base/CaretPrevious';
import CaretDownIcon from 'grommet/components/icons/base/CaretDown';
import EditIcon from 'grommet/components/icons/base/Edit';


class ColumnEmpty extends Component {
  render() {
    const columnData = this.props.data;
    return (
      <div style={{ display: 'flex', minWidth: 200, borderColor: '#cbd0c4', borderStyle: 'solid', borderWidth: 1, marginLeft: 5, marginRight: 5, justifyContent: 'center', backgroundColor: '#fbfff7' }}>
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }}>
          <div style={{ fontSize: 20, backgroundColor: '#ececec', width: '90%', display: 'flex', alignItems: 'center', flexDirection: 'column', borderBottomLeftRadius: 6, borderBottomRightRadius: 6, borderStyle: 'solid', borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderTopWidth: 0, marginBottom: 15, minHeight: 30 }}>
            <h >
              {columnData.name}
            </h>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '80%', marginBottom: 25, marginTop: 10 }}>
            <Image
              style={{ height: 25, width: 25, opacity: columnData.boundary ? 0.5 : 0.05 }}
              src='/img/fence.png'
              size='small' />
            <Image
              style={{ height: 25, width: 25, opacity: columnData.priority ? 0.5 : 0.05 }}
              src='/img/volume-level.png'
              size='small' />
            <Image
              style={{ height: 25, width: 25, opacity: columnData.acceptance ? 0.5 : 0.05 }}
              src='/img/verification-mark.png'
              size='small' />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '70%', marginBottom: 10 }}>
            <CaretPreviousIcon style={{ cursor: 'pointer' }} onClick={() => this.props.addEditColumn(columnData, 'left')} />
            <EditIcon style={{ cursor: 'pointer' }} onClick={() => this.props.addEditColumn(columnData, 'edit')} />
            <CaretNextIcon style={{ cursor: 'pointer' }} onClick={() => this.props.addEditColumn(columnData, 'right')} />
          </div>
          { columnData.columns.length === 0 &&
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
              <CaretDownIcon onClick={() => this.props.addEditColumn(columnData, 'down')} />
            </div>
          }
          { columnData.columns.length !== 0 &&
            <div style={{ display: 'flex', width: '100%', height: '100%', marginTop: 10 }}>
              {
                columnData.columns.map(subcolumn =>
                  (<ColumnEmpty
                    data={subcolumn}
                    key={subcolumn.id}
                    addEditColumn={this.props.addEditColumn} />)
                )
              }
            </div>
          }
        </div>
      </div>
    );
  }
}

ColumnEmpty.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    columns: PropTypes.array,
    wip: PropTypes.string,
    boundary: PropTypes.bool,
    priority: PropTypes.bool,
    acceptance: PropTypes.bool,
  }),
  addEditColumn: PropTypes.func.isRequired,
};

ColumnEmpty.defaultProps = {
  data: null,
};


export default ColumnEmpty;
