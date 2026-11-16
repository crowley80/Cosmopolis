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
require('../app/js/game/session.js');

const Save = global.Save;
const Session = global.Session;

test.beforeEach(() => {
    global.localStorage = new MemoryStorage();
});

test('migra la partida antigua sin borrar ni modificar su clave original', () => {
    const legacy = {
        character: { name: 'Ariadna' },
        adventure: { title: 'La campana', state: { inventory: ['Antorcha'], currentLocation: 'Valdebruma', visitedLocations: ['Valdebruma'], characters: { Elia: { role: 'Cartógrafa', location: 'Plaza del pozo', trust: 7, memories: ['Secreto de Ariadna'] } } } },
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
