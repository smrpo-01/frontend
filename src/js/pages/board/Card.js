import React, { Component } from 'react';
import MoreIcon from 'grommet/components/icons/base/More';
import CheckBox from 'grommet/components/CheckBox';

import Meter from 'grommet/components/Meter';

class Card extends Component {
  render() {
    return  (
      <div style={{backgroundColor: 'white', width: '90%', borderStyle: 'solid', 'borderColor': '#dbd9d9', borderWidth: 1, display:'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 15}}>
        <div style={{display: 'flex', width: '90%',justifyContent: 'space-between', marginBottom: 8, marginTop: 5}}>
            <h style={{opacity: 0.5}}>
              {this.props.id}
            </h>
            <Meter vertical={false}
              style={{marginTop: 6}}
              size='xsmall'
              colorIndex='graph-1'
              value={90} />
            <MoreIcon/>
        </div>
        <div style={{borderColor: 'black', borderWidth: 0, borderBottomWidth: 1, width: '100%', borderStyle: 'solid', marginBottom: 10, opacity: 0.2}}/ >
        <div style={{display: 'flex', justifyContent: 'center', width: '95%', marginBottom: 10, flexDirection: 'column'}}>
          <h>
            {this.props.title}
          </h>
          <h style={{display: 'flex', justifyContent: 'flex-end', fontSize: 14, opacity: 0.6, marginRight: 5}}>
            {this.props.owner}
          </h>
        </div>
        <div style={{borderColor: 'black', borderWidth: 0, borderBottomWidth: 1, width: '100%', borderStyle: 'solid', marginBottom: 10, opacity: 0.2}}/ >
        <div style={{display: 'flex', width: '95%', marginBottom: 10, flexDirection: 'column'}}>
          {this.props.tasks.map((task, i) => (<CheckBox
          label={task.label} defaultChecked={task.done} key={i}/>))}
        </div>
      </div>
    )
  }
}

Card.defaultProps = {
};

Card.propTypes = {
};

export default Card;