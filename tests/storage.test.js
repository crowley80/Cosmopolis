'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

class MemoryStorage {
    constructor() { this.data = new Map(); }
    get length() { return this.data.size; }
    key(index) { return Array.from(this.data.keys())[index] || null; }
    getItem(key) { return this.data.has(key) ? this.data.get(key) : null; }
    setItem(key, value) { this.data.set(String(key), String(value)); }
    removeItem(key) { this.data.delete(String(key)); }
    clear() { this.data.clear(); }
}

global.window = global;
global.localStorage = new MemoryStorage();
require('../app/js/core/save.js');
require('../app/js/game/map.js');
require('../app/js/game/session.js');

const Save = global.Save;
const Session = global.Session;

test.beforeEach(() => {
    global.localStorage = new MemoryStorage();
});

test('migra la partida antigua sin borrar ni modificar su clave original', () => {
    const legacy = {
        character: { name: 'Ariadna' },
        adventure: { title: 'La campana', state: { inventory: ['Antorcha'], athun: { bond: 4, memories: ['Recuerdo privado'], revelations: ['Primera revelación'] }, currentLocation: 'Valdebruma', visitedLocations: ['Valdebruma'], characters: { Elia: { role: 'Cartógrafa', location: 'Plaza del pozo', trust: 7, memories: ['Secreto de Ariadna'] } } } },
        actions: [{ text: 'Observo el pozo' }],
        world: { facts: ['Dato antiguo'], events: [], relationships: {} },
        createdAt: '2026-01-01T00:00:00.000Z'
    };
    const original = JSON.stringify(legacy);
    localStorage.setItem(Save.key, original);

    const entries = Save.list();
    assert.equal(entries.length, 1);
    assert.equal(Save.load().character.name, 'Ariadna');
    assert.deepEqual(Save.load().actions, legacy.actions);
    assert.ok(Save.load().adventure.state.inventory.some(item => item.includes('Athun')));
    assert.equal(Save.load().adventure.state.athun.permanent, true);
    assert.equal(Save.load().adventure.state.athun.id, 'athun');
    assert.equal(Save.load().adventure.state.athun.bond, 4);
    assert.deepEqual(Save.load().adventure.state.athun.memories, ['Recuerdo privado']);
    assert.deepEqual(Save.load().adventure.state.athun.revelations, ['Primera revelación']);
    assert.equal(localStorage.getItem(Save.key), original);
    assert.ok(localStorage.getItem(Save.slotPrefix + entries[0].id));
    assert.ok(Save.getGlobalWorld().locations.some(item => item.name === 'Valdebruma'));
    assert.equal(Save.getGlobalWorld().entities.elia.role, 'Cartógrafa');
    assert.equal('memories' in Save.getGlobalWorld().entities.elia, false);
});

test('mantiene independientes dos protagonistas y permite alternar entre partidas', () => {
    const first = Save.createSlot({ name: 'Ariadna' }, {
        title: 'Historia A', state: { inventory: ['Llave'] }
    });
    const second = Save.createSlot({ name: 'Darian' }, {
        title: 'Historia B', state: { inventory: ['Mapa'] }
    });

    assert.ok(first);
    assert.ok(second);
    assert.equal(Save.list().length, 2);
    assert.equal(Save.load().character.name, 'Darian');

    assert.equal(Save.activate(first), true);
    assert.equal(Save.load().character.name, 'Ariadna');
    assert.equal(Save.load().adventure.title, 'Historia A');
    assert.ok(Save.load().adventure.state.inventory.includes('Llave'));

    assert.equal(Save.activate(second), true);
    assert.equal(Save.load().character.name, 'Darian');
    assert.equal(Save.load().adventure.title, 'Historia B');
    assert.ok(Save.load().adventure.state.inventory.includes('Mapa'));
});

test('las localizaciones descubiertas se comparten, pero las acciones siguen siendo personales', () => {
    const first = Save.createSlot({ name: 'Ariadna' }, {
        title: 'Historia A', location: 'Valdebruma',
        state: { currentLocation: 'Valdebruma', inventory: [], characters: { Elia: { name: 'Elia', role: 'Cartógrafa', location: 'Valdebruma', trust: 8, memories: ['Recuerdo privado de Ariadna'] } } }
    });
    assert.equal(Session.addAction('Observo la plaza', 'La plaza está vacía.', {
        category: 'investigation',
        adventure: Save.load().adventure
    }), true);

    const second = Save.createSlot({ name: 'Darian' }, {
        title: 'Historia B', state: { currentLocation: 'Bosque', inventory: [] }
    });
    assert.equal(Session.getWorld().locations.some(item => item.name === 'Valdebruma'), true);
    const sharedElia = Session.getWorld().entities.elia;
    assert.equal(sharedElia.name, 'Elia');
    assert.equal(sharedElia.role, 'Cartógrafa');
    assert.equal('trust' in sharedElia, false);
    assert.equal('memories' in sharedElia, false);
    assert.deepEqual(Save.load().actions, []);
    assert.equal(Save.activate(first), true);
    assert.equal(Save.load().actions.length, 1);
});

test('una aventura nueva no elimina la anterior ni reinicia el mundo compartido', () => {
    const first = Save.createSlot({ name: 'Ariadna' }, {
        title: 'Primera aventura', state: { currentLocation: 'Valdebruma', inventory: [] }
    });
    Save.addGlobalLocation('Valdebruma', 'Ariadna');

    assert.equal(Session.startNewAdventure({ name: 'Ariadna' }, {
        title: 'Segunda aventura', state: { currentLocation: 'Puerto', inventory: [], characters: { Elia: { role: 'Cartógrafa', location: 'Valdebruma', trust: 0, memories: ['Recuerdo de Darian'] } } }
    }), true);

    const second = Save.getActiveId();
    assert.notEqual(second, first);
    assert.equal(Save.list().length, 2);
    assert.equal(Save.load().adventure.title, 'Segunda aventura');
    assert.ok(Save.getGlobalWorld().locations.some(item => item.name === 'Valdebruma'));
    assert.ok(Save.getGlobalWorld().locations.some(item => item.name === 'Puerto'));
    assert.ok(Save.getGlobalWorld().entities.elia);
    assert.equal(Save.activate(first), true);
    assert.equal(Save.load().adventure.title, 'Primera aventura');
});

test('reconstruye el índice si desaparece sin perder los registros de partidas', () => {
    Save.createSlot({ name: 'Ariadna' }, { title: 'Historia A', state: { inventory: [] } });
    Save.createSlot({ name: 'Darian' }, { title: 'Historia B', state: { inventory: [] } });
    localStorage.removeItem(Save.indexKey);

    assert.equal(Save.list().length, 2);
    assert.equal(Save.load().character.name, 'Darian');
    assert.ok(localStorage.getItem(Save.indexKey));
});

test('Athun permanece en el inventario al guardar o normalizar una partida', () => {
    const id = Save.createSlot({ name: 'Ariadna' }, {
        title: 'Historia', state: { inventory: ['Moneda'] }
    });
    assert.ok(id);
    const slot = Save.load();
    slot.adventure.state.inventory = ['Moneda'];
    assert.equal(Save.save(slot), true);
    assert.ok(Save.load().adventure.state.inventory.some(item =>
        String(item).toLocaleLowerCase('es').includes('athun')
    ));
});


test('la migración heredada es idempotente y no duplica partidas ni lugares', () => {
    const legacy = {
        character: { name: 'Ariadna' },
        adventure: { title: 'La campana', state: { currentLocation: 'Valdebruma', visitedLocations: ['Valdebruma'] } },
        actions: [{ text: 'Primera acción' }],
        createdAt: '2026-01-01T00:00:00.000Z'
    };
    const original = JSON.stringify(legacy);
    localStorage.setItem(Save.key, original);

    const first = Save.list();
    const firstWorld = Save.getGlobalWorld();
    const firstSlot = Save.load();
    const second = Save.list();

    assert.equal(first.length, 1);
    assert.equal(second.length, 1);
    assert.equal(Save.load().id, first[0].id);
    assert.deepEqual(Save.getGlobalWorld().locations, firstWorld.locations);
    assert.deepEqual(Save.load().actions, firstSlot.actions);
    assert.equal(localStorage.getItem(Save.key), original);
});

test('si falla la activación de una partida nueva, conserva la partida anterior', () => {
    const first = Save.createSlot({ name: 'Ariadna' }, {
        title: 'Historia conservada', state: { inventory: ['Llave'] }
    });
    assert.ok(first);
    const originalActive = localStorage.getItem(Save.activeKey);
    const originalIndex = localStorage.getItem(Save.indexKey);
    const originalSlot = localStorage.getItem(Save.slotPrefix + first);

    const setItem = localStorage.setItem.bind(localStorage);
    localStorage.setItem = (key, value) => {
        if (key === Save.activeKey) throw new Error('Almacenamiento simulado no disponible');
        setItem(key, value);
    };

    assert.equal(Save.createSlot({ name: 'Darian' }, {
        title: 'Historia que no debe activarse', state: { inventory: [] }
    }), false);

    localStorage.setItem = setItem;
    assert.equal(localStorage.getItem(Save.activeKey), originalActive);
    assert.equal(localStorage.getItem(Save.indexKey), originalIndex);
    assert.equal(localStorage.getItem(Save.slotPrefix + first), originalSlot);
    assert.equal(Save.load().character.name, 'Ariadna');
    assert.equal(Save.list().length, 1);
});


test('sincroniza al mundo compartido solo las zonas declaradas visibles', () => {
    const WorldMap = require('../app/js/game/map.js');
    Save.createSlot({ name: 'Ariadna' }, {
        title: 'Historia A',
        state: {
            currentLocation: 'Plaza del pozo',
            visitedLocations: ['Plaza del pozo'],
            visibleLocations: ['Calle del molino'],
            inventory: []
        }
    });
    assert.equal(Session.addAction('Observo el entorno', 'Ves la calle cercana.', {
        adventure: Save.load().adventure
    }), true);

    const shared = Save.getGlobalWorld();
    assert.ok(shared.locations.some(item => item.name === 'Plaza del pozo'));
    assert.ok(shared.locations.some(item => item.name === 'Calle del molino'));

    Save.createSlot({ name: 'Darian' }, {
        title: 'Historia B',
        state: { currentLocation: 'Puerto', visitedLocations: ['Puerto'], inventory: [] }
    });
    const atlas = WorldMap.getAtlas(Save.getGlobalWorld(), Save.load().adventure.state, Save.load().adventure);
    assert.equal(atlas.known.some(item => item.name === 'Calle del molino'), true);
    assert.equal(atlas.visited.some(item => item.name === 'Calle del molino'), false);
});


test('al desplazarse, la visión anterior no permanece iluminada en la nueva zona', () => {
    const WorldMap = require('../app/js/game/map.js');
    Save.createSlot({ name: 'Ariadna' }, {
        title: 'Exploración',
        state: {
            currentLocation: 'Plaza del pozo',
            visitedLocations: ['Plaza del pozo'],
            visibleLocations: ['Calle del molino'],
            inventory: []
        }
    });
    Save.addGlobalLocation('Calle del molino', 'Ariadna');

    const nextAdventure = JSON.parse(JSON.stringify(Save.load().adventure));
    nextAdventure.state.currentLocation = 'Puerto';
    assert.equal(Session.addAction('Me dirijo al puerto', 'Llegas al puerto.', {
        adventure: nextAdventure
    }), true);

    const atlas = WorldMap.getAtlas(Save.getGlobalWorld(), Save.load().adventure.state, Save.load().adventure);
    assert.deepEqual(atlas.currentAndVisible.map(item => item.name), ['Puerto']);
    assert.equal(atlas.known.some(item => item.name === 'Calle del molino'), true);
});


test('conserva la nueva visibilidad cuando el narrador la declara explícitamente al desplazarse', () => {
    const WorldMap = require('../app/js/game/map.js');
    Save.createSlot({ name: 'Ariadna' }, {
        title: 'Exploración',
        state: {
            currentLocation: 'Plaza del pozo',
            visitedLocations: ['Plaza del pozo'],
            visibleLocations: ['Calle del molino'],
            inventory: []
        }
    });
    const nextAdventure = JSON.parse(JSON.stringify(Save.load().adventure));
    nextAdventure.state.currentLocation = 'Calle del molino';

    assert.equal(Session.addAction('Camino hasta el molino', 'Llegas al molino.', {
        adventure: nextAdventure,
        visibleLocations: ['Calle del molino', 'Puente viejo']
    }), true);

    const atlas = WorldMap.getAtlas(Save.getGlobalWorld(), Save.load().adventure.state, Save.load().adventure);
    assert.deepEqual(atlas.currentAndVisible.map(item => item.name), ['Calle del molino', 'Puente viejo']);
});


test('comparte el tramo realmente recorrido sin inventar el camino inverso', () => {
    Save.createSlot({ name: 'Ariadna' }, {
        title: 'Exploración',
        state: { currentLocation: 'Plaza del pozo', visitedLocations: ['Plaza del pozo'], inventory: [] }
    });
    const nextAdventure = JSON.parse(JSON.stringify(Save.load().adventure));
    nextAdventure.state.currentLocation = 'La Posada del Tejón';

    assert.equal(Session.addAction('Camino hasta la posada', 'Llegas a la posada.', {
        category: 'movement',
        adventure: nextAdventure
    }), true);

    const world = Save.getGlobalWorld();
    assert.deepEqual(world.connections.map(item => ({ from: item.from, to: item.to })), [
        { from: 'Plaza del pozo', to: 'La Posada del Tejón' }
    ]);
    assert.equal(Save.addGlobalConnection('La Posada del Tejón', 'La Posada del Tejón', 'Ariadna'), false);
    assert.equal(Save.addGlobalConnection('La Posada del Tejón', 'Plaza del pozo', 'Ariadna'), true);
    assert.equal(Save.getGlobalWorld().connections.length, 2);
});


test('un camino descubierto por un protagonista queda disponible en el atlas de otro', () => {
    Save.createSlot({ name: 'Ariadna' }, {
        title: 'Historia A',
        state: { currentLocation: 'Plaza del pozo', visitedLocations: ['Plaza del pozo'], inventory: [] }
    });
    const nextAdventure = JSON.parse(JSON.stringify(Save.load().adventure));
    nextAdventure.state.currentLocation = 'La Posada del Tejón';
    assert.equal(Session.addAction('Voy a la posada', 'Llegas a la posada.', {
        category: 'movement',
        adventure: nextAdventure
    }), true);

    Save.createSlot({ name: 'Darian' }, {
        title: 'Historia B',
        state: { currentLocation: 'Puerto', visitedLocations: ['Puerto'], inventory: [] }
    });
    const atlas = require('../app/js/game/map.js').getAtlas(
        Save.getGlobalWorld(),
        Save.load().adventure.state,
        Save.load().adventure
    );

    assert.equal(atlas.connections.some(route =>
        route.from === 'Plaza del pozo' && route.to === 'La Posada del Tejón'
    ), true);
    assert.equal(atlas.visited.some(place => place.name === 'La Posada del Tejón'), false);
});


test('normaliza Athun como una única pertenencia canónica aunque lleguen copias narrativas', () => {
    const id = Save.createSlot({ name: 'Ariadna' }, {
        title: 'Protección del grimorio',
        state: { inventory: ['Moneda', 'Athun', 'Athun duplicado', 'Athun — grimorio consciente'] }
    });
    assert.ok(id);
    const slot = Save.load();
    slot.adventure.state.inventory = ['Moneda', 'Athun', 'Athun duplicado', 'Athun — grimorio consciente'];

    assert.equal(Save.save(slot), true);
    const inventory = Save.load().adventure.state.inventory;
    assert.equal(inventory.filter(item => String(item).toLocaleLowerCase('es').includes('athun')).length, 1);
    assert.equal(inventory[0], 'Athun — grimorio consciente');
    assert.ok(inventory.includes('Moneda'));
});

 test('un cambio de ubicación que no es desplazamiento no crea un camino', () => {
    Save.createSlot({ name: 'Ariadna' }, {
        title: 'Exploración',
        state: { currentLocation: 'Plaza del pozo', visitedLocations: ['Plaza del pozo'], inventory: [] }
    });
    const nextAdventure = JSON.parse(JSON.stringify(Save.load().adventure));
    nextAdventure.state.currentLocation = 'La Posada del Tejón';

    assert.equal(Session.addAction('Investigo un suceso', 'La escena cambia de ubicación.', {
        category: 'investigation',
        adventure: nextAdventure
    }), true);

    const world = Save.getGlobalWorld();
    assert.equal(world.connections.length, 0);
    assert.ok(world.locations.some(item => item.name === 'La Posada del Tejón'));
});


test('si falla la activación al eliminar una partida, restaura índice, datos y selección', () => {
    const first = Save.createSlot({ name: 'Ariadna' }, {
        title: 'Partida que se conserva', state: { inventory: ['Llave'] }
    });
    const second = Save.createSlot({ name: 'Darian' }, {
        title: 'Partida alternativa', state: { inventory: ['Mapa'] }
    });
    assert.ok(first);
    assert.ok(second);
    assert.equal(Save.activate(first), true);

    const originalActive = localStorage.getItem(Save.activeKey);
    const originalIndex = localStorage.getItem(Save.indexKey);
    const originalSlot = localStorage.getItem(Save.slotPrefix + first);
    const setItem = localStorage.setItem.bind(localStorage);
    localStorage.setItem = (key, value) => {
        if (key === Save.activeKey && String(value) !== originalActive) {
            throw new Error('Fallo simulado al cambiar la partida activa');
        }
        setItem(key, value);
    };

    assert.equal(Save.deleteSlot(first), false);
    localStorage.setItem = setItem;

    assert.equal(localStorage.getItem(Save.activeKey), originalActive);
    assert.equal(localStorage.getItem(Save.indexKey), originalIndex);
    assert.equal(localStorage.getItem(Save.slotPrefix + first), originalSlot);
    assert.equal(Save.list().length, 2);
    assert.equal(Save.load().character.name, 'Ariadna');

    assert.equal(Save.deleteSlot(first), true);
    assert.equal(Save.list().length, 1);
    assert.equal(Save.load().character.name, 'Darian');
    assert.equal(localStorage.getItem(Save.slotPrefix + first), null);
});


test('restaura una selección inicialmente vacía si la verificación del borrado falla', () => {
    const first = Save.createSlot({ name: 'Ariadna' }, {
        title: 'Partida principal', state: { inventory: ['Llave'] }
    });
    Save.createSlot({ name: 'Darian' }, {
        title: 'Partida secundaria', state: { inventory: ['Mapa'] }
    });
    assert.ok(first);
    localStorage.removeItem(Save.activeKey);

    const originalIndex = localStorage.getItem(Save.indexKey);
    const originalSlot = localStorage.getItem(Save.slotPrefix + first);
    const getItem = localStorage.getItem.bind(localStorage);
    const setItem = localStorage.setItem.bind(localStorage);
    let failActiveReadOnce = false;

    localStorage.setItem = (key, value) => {
        setItem(key, value);
        if (key === Save.activeKey) failActiveReadOnce = true;
    };
    localStorage.getItem = key => {
        if (key === Save.activeKey && failActiveReadOnce) {
            failActiveReadOnce = false;
            return null;
        }
        return getItem(key);
    };

    assert.equal(Save.deleteSlot(first), false);
    localStorage.setItem = setItem;
    localStorage.getItem = getItem;

    assert.equal(localStorage.getItem(Save.activeKey), null);
    assert.equal(localStorage.getItem(Save.indexKey), originalIndex);
    assert.equal(localStorage.getItem(Save.slotPrefix + first), originalSlot);
    assert.equal(Save.list().length, 2);
    assert.equal(Save.load().character.name, 'Ariadna');
});


test('el vínculo, recuerdos y revelaciones de Athun son independientes por protagonista', () => {
    const first = Save.createSlot({ name: 'Ariadna' }, {
        title: 'Historia de Ariadna',
        state: { inventory: [], athun: { bond: 7, memories: ['La primera noche'], revelations: ['La tinta respira'] } }
    });
    const second = Save.createSlot({ name: 'Darian' }, {
        title: 'Historia de Darian',
        state: { inventory: [], athun: { bond: 2, memories: ['El camino del norte'], revelations: ['Una voz lejana'] } }
    });

    assert.ok(first);
    assert.ok(second);
    assert.equal(Save.load().adventure.state.athun.bond, 2);
    assert.deepEqual(Save.load().adventure.state.athun.memories, ['El camino del norte']);

    assert.equal(Save.activate(first), true);
    const updatedAriadna = Save.load();
    const ariathun = updatedAriadna.adventure.state.athun;
    assert.equal(ariathun.bond, 7);
    assert.deepEqual(ariathun.memories, ['La primera noche']);
    ariathun.bond = 9;
    ariathun.memories.push('El secreto del pozo');
    assert.equal(Save.save(updatedAriadna), true);

    assert.equal(Save.activate(second), true);
    assert.equal(Save.load().adventure.state.athun.bond, 2);
    assert.deepEqual(Save.load().adventure.state.athun.memories, ['El camino del norte']);
    assert.deepEqual(Save.load().adventure.state.athun.revelations, ['Una voz lejana']);

    assert.equal(Save.activate(first), true);
    assert.equal(Save.load().adventure.state.athun.bond, 9);
    assert.deepEqual(Save.load().adventure.state.athun.memories, ['La primera noche', 'El secreto del pozo']);
});

test('si falla la actualización del índice, revierte el guardado de la partida', () => {
    const id = Save.createSlot({ name: 'Ariadna' }, {
        title: 'Historia original', state: { inventory: ['Llave'] }
    });
    assert.ok(id);
    const originalSlot = localStorage.getItem(Save.slotPrefix + id);
    const originalIndex = localStorage.getItem(Save.indexKey);
    const setItem = localStorage.setItem.bind(localStorage);
    localStorage.setItem = (key, value) => {
        if (key === Save.indexKey) throw new Error('Fallo simulado al actualizar el índice');
        setItem(key, value);
    };

    const changed = Save.load();
    changed.character.name = 'Ariadna modificada';
    assert.equal(Save.save(changed), false);
    localStorage.setItem = setItem;

    assert.equal(localStorage.getItem(Save.slotPrefix + id), originalSlot);
    assert.equal(localStorage.getItem(Save.indexKey), originalIndex);
    assert.equal(Save.load().character.name, 'Ariadna');
});

test('si falla el índice al sustituir una partida, restaura el registro anterior', () => {
    const id = Save.createSlot({ name: 'Ariadna' }, {
        title: 'Historia original', state: { inventory: ['Llave'] }
    });
    assert.ok(id);
    const originalSlot = localStorage.getItem(Save.slotPrefix + id);
    const originalIndex = localStorage.getItem(Save.indexKey);
    const setItem = localStorage.setItem.bind(localStorage);
    localStorage.setItem = (key, value) => {
        if (key === Save.indexKey) throw new Error('Fallo simulado al actualizar el índice');
        setItem(key, value);
    };

    assert.equal(Save.replace({
        character: { name: 'Darian' },
        adventure: { title: 'Historia distinta', state: { inventory: [] } }
    }), false);
    localStorage.setItem = setItem;

    assert.equal(localStorage.getItem(Save.slotPrefix + id), originalSlot);
    assert.equal(localStorage.getItem(Save.indexKey), originalIndex);
    assert.equal(Save.load().character.name, 'Ariadna');
    assert.equal(Save.load().adventure.title, 'Historia original');
});

test('impide eliminar la última partida y conserva a Athun en ella', () => {
    const id = Save.createSlot({ name: 'Ariadna' }, {
        title: 'La última historia', state: { inventory: ['Antorcha'] }
    });
    assert.ok(id);

    assert.equal(Save.deleteSlot(id), false);
    assert.equal(Save.list().length, 1);
    assert.equal(Save.getActiveId(), id);
    const inventory = Save.load().adventure.state.inventory;
    assert.equal(inventory.filter(item => String(item).toLocaleLowerCase('es').includes('athun')).length, 1);
});


test('comparte posiciones relativas verificadas sin crear caminos ni visitas personales', () => {
    const WorldMap = global.WorldMap;
    Save.createSlot({ name: 'Ariadna' }, {
        title: 'Cartografía explícita',
        state: {
            currentLocation: 'Plaza del pozo',
            visitedLocations: ['Plaza del pozo'],
            inventory: []
        }
    });
    const adventure = JSON.parse(JSON.stringify(Save.load().adventure));
    const reply = 'La Posada del Tejón se encuentra al norte de la Plaza del pozo.';

    assert.equal(Session.addAction('Reviso el mapa de Elia', reply, {
        category: 'investigation',
        adventure,
        spatialRelations: [
            {
                from: 'La Posada del Tejón',
                relation: 'north_of',
                to: 'Plaza del pozo',
                evidence: reply
            },
            {
                from: 'Puerto',
                relation: 'east_of',
                to: 'Plaza del pozo',
                evidence: 'Puerto está al oeste de la Plaza del pozo.'
            },
            {
                from: 'Bosque',
                relation: 'north_of',
                to: 'Plaza del pozo',
                evidence: 'El bosque queda al norte de la Plaza del pozo.'
            }
        ]
    }), true);

    const world = Save.getGlobalWorld();
    assert.equal(world.spatialRelations.length, 1);
    assert.equal(world.connections.length, 0);
    assert.ok(world.locations.some(item => item.name === 'La Posada del Tejón'));

    Save.createSlot({ name: 'Darian' }, {
        title: 'Historia B',
        state: { currentLocation: 'Puerto', visitedLocations: ['Puerto'], inventory: [] }
    });
    const secondSave = Save.load();
    const atlas = WorldMap.getAtlas(world, secondSave.adventure.state, secondSave.adventure);

    assert.equal(atlas.spatialRelations.length, 1);
    assert.equal(atlas.spatialRelations[0].label, 'al norte de');
    assert.equal(atlas.visited.some(item => item.name === 'La Posada del Tejón'), false);
    assert.equal(atlas.known.some(item => item.name === 'La Posada del Tejón'), true);
});
