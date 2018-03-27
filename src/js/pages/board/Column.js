import React, { Component } from 'react';
import Card from './Card';

class Column extends Component {
  render() {
    return  (
      <div style={{display: 'flex', minWidth: 250, maxWidth: 300, borderColor: '#cbd0c4', borderStyle: 'solid', borderWidth: 1, marginLeft: 5, justifyContent: 'center', backgroundColor: '#fbfff7'}}>
        <div style={{display: 'flex', flexDirection:'column', width: '100%', alignItems: 'center'}}>
          <h style={{fontSize: 20, backgroundColor: '#ececec', width: '90%', display: 'flex', alignItems: 'center', flexDirection:'column', borderBottomLeftRadius: 6, borderBottomRightRadius: 6, borderColor: this.props.color, borderStyle: 'solid', borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderTopWidth: 0, marginBottom: 15}}>
            {this.props.title}
          </h>
          {this.props.cards.map((card, i) => <Card id={card.id} title={card.title} expiration={card.expiration} owner={card.owner} tasks={card.tasks} key={i}/>)}
        </div>
      </div>
    )
  }
}

Column.defaultProps = {
};

Column.propTypes = {
};

export default Column;