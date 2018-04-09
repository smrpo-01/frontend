import React, { Component } from 'react';
import TableAddIcon from 'grommet/components/icons/base/TableAdd';

import Anchor from 'grommet/components/Anchor';


class BoardAdd extends Component {
  changeRoute() {
    this.props.push('/board/new')
  }
  render() {
    return (
      <div style={{ backgroundColor: '#fbfff7', height: 200, width: 300, margin: 10, borderRadius: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', borderColor: '#cbd0c4', borderStyle: 'solid', borderWidth: 1, }}>
        <Anchor icon={<TableAddIcon size='medium'/>}
          label='Dodaj tablo'
          onClick={() => this.changeRoute()} />      
      </div>
    );
  }
}

BoardAdd.defaultProps = {
};

BoardAdd.propTypes = {
};

export default BoardAdd;
