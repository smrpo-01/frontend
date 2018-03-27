import React, { Component } from 'react';
import Column from './Column'

const columns = [{
  title: 'Product backlog',
  color: '#00A0B0',
  cards: [{
    id: '1234',
    title: '#10 Kreiranje nove table s kopiranjem strukture (Must have)',
    expiration: 2,
    owner: 'nejcsm',
    tasks: [{
      label: 'Pripravi shemo za Projects (2h)',
      done: true,
    },{
      label: 'Pripravi mutacije za shemo Projects (2h)',
      done: false,
    },{
      label: 'Code merge & deploy (1h)',
      done: true,
    },{
      label: 'Osnovna stran za tablo (route, user logic) (2h)',
      done: false,
    },{
      label: 'Validacija atributov (1h)',
      done: true,
    }]
  }, {
    id: '5555',
    title: '#3 Vzdrževanje projektov (Must have)',
    expiration: 2,
    owner: 'lukap',
    tasks: [{
      label: 'Osnovna stran za tablo (route, user logic) (2h)',
      done: true,
    },{
      label: 'Dodajanje projektov na tablo (2h)',
      done: false,
    },{
      label: 'Gumbi za shranjevanje/brisanje (1h)',
      done: true,
    },{
      label: 'Testiranje & AC (2h)',
      done: false,
    }]
  }]
},{
  title: 'Sprint backlog',
  color: '#00A0B0',
  cards: [{
    id: '5556',
    title: '#3 Vzdrževanje projektov (Must have)',
    expiration: 2,
    owner: 'lukap',
    tasks: [{
      label: 'Osnovna stran za tablo (route, user logic) (2h)',
      done: true,
    },{
      label: 'Dodajanje projektov na tablo (2h)',
      done: false,
    },{
      label: 'Gumbi za shranjevanje/brisanje (1h)',
      done: true,
    },{
      label: 'Testiranje & AC (2h)',
      done: false,
    }]
  }]
},{
  title: 'Product backlog',
  color: '#AA001E',
  cards: []
},{
  title: 'jajajaja backlog',
  color: '#AA001E',
  cards: []
}];

class BoardCustom extends Component {
  render() {
    return  (
      <div style={{backgroundColor: '#f5fbef', display: 'flex', minHeight: 800}}>
        {columns.map((column, i) => 
          <Column title={column.title} color={column.color} cards={column.cards} key={i}/>
        )}
      </div>
      )
  }
}

BoardCustom.defaultProps = {
};

BoardCustom.propTypes = {
};

export default BoardCustom;