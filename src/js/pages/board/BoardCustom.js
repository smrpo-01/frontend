import React, { Component } from 'react';
import Column from './Column';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

const columns = [{
  name: 'Product backlog',
  color: '#00A0B0',
  cards: [{
    id: '1234',
    name: '#10 Kreiranje nove table s kopiranjem strukture (Must have)',
    expiration: 2,
    owner: 'nejcsm',
    tasks: [{
      label: 'Pripravi shemo za Projects (2h)',
      done: true,
    }, {
      label: 'Pripravi mutacije za shemo Projects (2h)',
      done: false,
    }, {
      label: 'Code merge & deploy (1h)',
      done: true,
    }, {
      label: 'Osnovna stran za tablo (route, user logic) (2h)',
      done: false,
    }, {
      label: 'Validacija atributov (1h)',
      done: true,
    }]
  }, {
    id: '5555',
    name: '#3 Vzdrževanje projektov (Must have)',
    expiration: 2,
    owner: 'lukap',
    tasks: [{
      label: 'Osnovna stran za tablo (route, user logic) (2h)',
      done: true,
    }, {
      label: 'Dodajanje projektov na tablo (2h)',
      done: false,
    }, {
      label: 'Gumbi za shranjevanje/brisanje (1h)',
      done: true,
    }, {
      label: 'Testiranje & AC (2h)',
      done: false,
    }]
  }]
  }, {
  name: 'Sprint backlog',
  color: '#00A0B0',
  cards: [{
    id: '5556',
    name: '#3 Vzdrževanje projektov (Must have)',
    expiration: 2,
    owner: 'lukap',
    tasks: [{
      label: 'Osnovna stran za tablo (route, user logic) (2h)',
      done: true,
    }, {
      label: 'Dodajanje projektov na tablo (2h)',
      done: false,
    }, {
      label: 'Gumbi za shranjevanje/brisanje (1h)',
      done: true,
    }, {
      label: 'Testiranje & AC (2h)',
      done: false,
    }]
  }]
  }, {
  name: 'Product backlog',
  color: '#AA001E',
  cards: []
  }, {
  name: 'jajajaja backlog',
  color: '#AA001E',
  cards: []
}];

class BoardCustom extends Component {
  render() {
    return (
      <div style={{ backgroundColor: '#f5fbef', display: 'flex', minHeight: 1200 }}>
        {columns.map((column, i) =>
          <Column name={column.name} color={column.color} cards={column.cards} key={i} />
        )}
      </div>
    );
  }
}

BoardCustom.defaultProps = {
};

BoardCustom.propTypes = {
};

export default DragDropContext(HTML5Backend)(BoardCustom);
