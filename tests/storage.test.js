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
