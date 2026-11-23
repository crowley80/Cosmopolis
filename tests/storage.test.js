// La regresión visual verifica la reconstrucción de la aventura, el cambio de protagonista y una migración heredada estructuralmente válida.
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
require('../app/js/game/narrator.js');

const Save = global.Save;
const Session = global.Session;
const Narrator = global.Narrator;

test('el narrador descarta zonas visibles sin respaldo en la escena o el conocimiento', () => {
    const adventure = {
        title: 'Exploración de Valdebruma',
        location: 'Plaza del pozo',
        text: 'La plaza está rodeada de casas antiguas.',
        state: {
            currentLocation: 'Plaza del pozo',
            visitedLocations: ['Plaza del pozo'],
            visibleLocations: []
        }
    };
    const visible = Narrator.filterVisibleLocations(
        ['Calle del molino', 'Puente viejo', 'Pente viejo', 'Calle 1', 'Calle 12', 'Torre del cuervo', 'Plaza del pozo', 'Calle del molino'],
        'Desde la plaza distingues el Puente viejo y la Calle 1 entre la niebla.',
        adventure,
        { locations: [{ name: 'Calle del molino' }] }
    );

    assert.deepEqual(visible, ['Puente viejo', 'Calle 1', 'Plaza del pozo']);
});


test('el narrador solo cambia de ubicación cuando narra un desplazamiento explícito', () => {
    const adventure = {
        location: 'Camino de entrada a Valdebruma',
        state: { currentLocation: 'Camino de entrada a Valdebruma', phase: 'arrival' }
    };

    assert.equal(Narrator.resolveCurrentLocation({
        category: 'dialogue',
        location: 'Plaza del pozo',
        reply: 'Elia te responde junto al camino.'
    }, adventure), 'Camino de entrada a Valdebruma');

    assert.equal(Narrator.resolveCurrentLocation({
        category: 'movement',
        location: 'Plaza del pozo',
        reply: 'Sigues el sendero y llegas a la Plaza del pozo.'
    }, adventure), 'Plaza del pozo');

    assert.equal(Narrator.resolveCurrentLocation({
        category: 'movement',
        location: 'Torre del cuervo',
        reply: 'Permaneces en el camino y observas las montañas.'
    }, adventure), 'Camino de entrada a Valdebruma');
});

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

test('repara el selector activo si apunta a una partida inexistente o está corrupto', () => {
    const first = Save.createSlot({ name: 'Ariadna' }, {
        title: 'Historia A', state: { inventory: [] }
    });
    Save.createSlot({ name: 'Darian' }, {
        title: 'Historia B', state: { inventory: [] }
    });

    localStorage.setItem(Save.activeKey, JSON.stringify({ id: 'partida-inexistente' }));
    assert.equal(Save.getActiveId(), first);
    assert.deepEqual(JSON.parse(localStorage.getItem(Save.activeKey)), { id: first });

    localStorage.setItem(Save.activeKey, '{selector-corrupto');
    assert.equal(Save.getActiveId(), first);
    assert.deepEqual(JSON.parse(localStorage.getItem(Save.activeKey)), { id: first });
});

test('no sobrescribe el único guardado si su contenido está corrupto', () => {
    const only = Save.createSlot({ name: 'Ariadna' }, {
        title: 'Historia original', state: { inventory: ['Athun'] }
    });
    const key = Save.slotPrefix + only;
    const damagedRaw = '{registro-truncado';
    localStorage.setItem(key, damagedRaw);

    assert.equal(Save.getActiveId(), null);
    assert.equal(Save.save({
        character: { name: 'Personaje nuevo' },
        adventure: { title: 'No debe sustituir el registro dañado' }
    }), false);
    assert.equal(localStorage.getItem(key), damagedRaw);
    assert.equal(Save.load(), null);
});

test('selecciona otra partida legible si el guardado activo está corrupto', () => {
    const first = Save.createSlot({ name: 'Ariadna' }, {
        title: 'Historia dañada', state: { inventory: [] }
    });
    const second = Save.createSlot({ name: 'Darian' }, {
        title: 'Historia recuperable', state: { inventory: [] }
    });
    assert.equal(Save.activate(first), true);

    localStorage.setItem(Save.slotPrefix + first, '{partida-corrupta');
    assert.equal(Save.getActiveId(), second);
    assert.deepEqual(JSON.parse(localStorage.getItem(Save.activeKey)), { id: second });
    assert.equal(Save.load().character.name, 'Darian');
});

test('reconstruye un índice ilegible sin perder partidas ni alterar el mundo compartido', () => {
    const first = Save.createSlot({ name: 'Ariadna' }, {
        title: 'Historia A', state: { inventory: ['Llave'] }
    });
    const second = Save.createSlot({ name: 'Darian' }, {
        title: 'Historia B', state: { inventory: ['Mapa'] }
    });
    Save.addGlobalLocation('Puerto', 'Ariadna');
    const firstRaw = localStorage.getItem(Save.slotPrefix + first);
    const secondRaw = localStorage.getItem(Save.slotPrefix + second);
    const worldRaw = localStorage.getItem(Save.worldKey);
    localStorage.setItem(Save.activeKey, JSON.stringify({ id: 'partida-que-no-existe' }));
    localStorage.setItem(Save.indexKey, '{"version":1,"saves":');

    const recovered = Save.list();
    assert.equal(recovered.length, 2);
    assert.deepEqual(recovered.map(entry => entry.name), ['Ariadna', 'Darian']);
    assert.equal(Save.getActiveId(), first);
    assert.equal(Save.activate(second), true);
    assert.equal(Save.load().character.name, 'Darian');
    assert.equal(localStorage.getItem(Save.slotPrefix + first), firstRaw);
    assert.equal(localStorage.getItem(Save.slotPrefix + second), secondRaw);
    assert.equal(localStorage.getItem(Save.worldKey), worldRaw);
    assert.deepEqual(JSON.parse(localStorage.getItem(Save.indexKey)).saves.map(entry => entry.id), [first, second]);
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


test('normaliza Athun como única pertenencia también en inventarios estructurados', () => {
    const slot = Save.normalizeSlot({
        character: { name: 'Ariadna' },
        adventure: {
            state: {
                inventory: [
                    { id: 'athun', name: 'Grimorio consciente', kind: 'book' },
                    { itemId: 'athun-copy', title: 'Copia del grimorio' },
                    { name: 'Athun — grimorio consciente' },
                    'Athun duplicado',
                    { id: 'potion', name: 'Poción', kind: 'consumible' },
                    'Moneda'
                ]
            }
        }
    });
    const inventory = slot.adventure.state.inventory;

    assert.equal(inventory.filter(item => Save.isAthunInventoryEntry(item)).length, 1);
    assert.equal(inventory[0], 'Athun — grimorio consciente');
    assert.deepEqual(inventory.slice(1), [
        { id: 'potion', name: 'Poción', kind: 'consumible' },
        'Moneda'
    ]);
    assert.equal(slot.adventure.state.athun.permanent, true);

    const normalizedAgain = Save.normalizeSlot(JSON.parse(JSON.stringify(slot)));
    assert.deepEqual(normalizedAgain.adventure.state.inventory, inventory);
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
        state: { inventory: [], athun: { bond: 2, memories: ['El camino del norte'], revelations: ['Una voz lejana'], bondHistory: [{ delta: -1, reason: 'Darian desconfió de una advertencia' }], bondHistory: [{ delta: -1, reason: 'Darian desconfió de una advertencia' }] } }
    });

    assert.ok(first);
    assert.ok(second);
    assert.equal(Save.load().adventure.state.athun.bond, 2);
    assert.deepEqual(Save.load().adventure.state.athun.memories, ['El camino del norte']);

    assert.equal(Save.activate(first), true);
    const ariSlot = Save.load();
    const ariathun = ariSlot.adventure.state.athun;
    assert.equal(ariathun.bond, 7);
    assert.deepEqual(ariathun.memories, ['La primera noche']);
    ariathun.bond = 9;
    ariathun.memories.push('El secreto del pozo');
    assert.equal(Save.save(ariSlot), true);

    assert.equal(Save.activate(second), true);
    assert.equal(Save.load().adventure.state.athun.bond, 2);
    assert.deepEqual(Save.load().adventure.state.athun.memories, ['El camino del norte']);
    assert.deepEqual(Save.load().adventure.state.athun.revelations, ['Una voz lejana']);

    assert.equal(Save.activate(first), true);
    assert.equal(Save.load().adventure.state.athun.bond, 9);
    assert.deepEqual(Save.load().adventure.state.athun.memories, ['La primera noche', 'El secreto del pozo']);
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


test('no publica descubrimientos ni caminos compartidos si falla el guardado de la acción', () => {
    Save.createSlot({ name: 'Ariadna' }, {
        title: 'Exploración',
        state: { currentLocation: 'Plaza inicial', visitedLocations: ['Plaza inicial'], inventory: [] }
    });
    Save.addGlobalLocation('Plaza inicial', 'Ariadna');

    const nextAdventure = JSON.parse(JSON.stringify(Save.load().adventure));
    nextAdventure.state.currentLocation = 'Puerto desconocido';
    nextAdventure.state.characters = {
        Elia: { name: 'Elia', role: 'Cartógrafa', location: 'Puerto desconocido', trust: 5, memories: ['Recuerdo privado'] }
    };

    const originalSave = Save.save;
    Save.save = () => false;
    try {
        assert.equal(Session.addAction('Camino hacia el puerto', 'Llegas al puerto.', {
            category: 'movement',
            adventure: nextAdventure,
            visibleLocations: ['Puerto desconocido', 'Faro']
        }), false);
    } finally {
        Save.save = originalSave;
    }

    const world = Save.getGlobalWorld();
    assert.equal(world.locations.some(item => item.name === 'Puerto desconocido'), false);
    assert.equal(world.locations.some(item => item.name === 'Faro'), false);
    assert.equal(world.connections.length, 0);
    assert.equal(world.entities.elia, undefined);
    assert.equal(Save.load().adventure.state.currentLocation, 'Plaza inicial');
    assert.equal(Save.load().actions.length, 0);
});


test('registra si cada acción usó IA sin inventar el dato cuando falta', () => {
    Save.createSlot({ name: 'Ariadna' }, {
        title: 'Trazabilidad narrativa',
        state: { currentLocation: 'Camino de entrada', visitedLocations: ['Camino de entrada'], inventory: [] }
    });

    assert.equal(Session.addAction('Observo el camino', 'La niebla cubre el valle.', {
        aiUsed: true,
        adventure: Save.load().adventure
    }), true);
    assert.equal(Session.addAction('Saludo al vecino', 'El vecino responde.', {
        aiUsed: false,
        adventure: Save.load().adventure
    }), true);
    assert.equal(Session.addAction('Espero un momento', 'El viento se calma.', {
        adventure: Save.load().adventure
    }), true);

    assert.deepEqual(Session.getActions().map(item => item.aiUsed), [true, false, null]);
});


test('el narrador recibe los recuerdos y revelaciones de Athun solo desde la partida activa', () => {
    const first = Save.createSlot({ name: 'Ariadna' }, {
        title: 'Historia de Ariadna',
        state: { currentLocation: 'Valdebruma', inventory: [], athun: {
            bond: 7, memories: ['La primera noche juntas'], revelations: ['La tinta respira'], bondHistory: [{ delta: 1, reason: 'Ariadna defendió a Athun' }]
        } }
    });
    const second = Save.createSlot({ name: 'Darian' }, {
        title: 'Historia de Darian',
        state: { currentLocation: 'Puerto', inventory: [], athun: {
            bond: 2, memories: ['El camino del norte'], revelations: ['Una voz lejana'], bondHistory: [{ delta: -1, reason: 'Darian desconfió de una advertencia' }]
        } }
    });

    assert.ok(first);
    assert.ok(second);
    const darianMessages = Narrator.buildMessages('Observo el puerto', Save.load().character, Save.load().adventure, []);
    const darianContext = JSON.parse(darianMessages[1].content);
    assert.deepEqual(darianContext.currentAdventure.athun, {
        bond: 2,
        memories: ['El camino del norte'],
        revelations: ['Una voz lejana'],
        bondHistory: [{ delta: -1, reason: 'Darian desconfió de una advertencia' }]
    });

    assert.equal(Save.activate(first), true);
    const ariSlot = Save.load();
    const ariMessages = Narrator.buildMessages('Recuerdo la noche', ariSlot.character, ariSlot.adventure, []);
    const ariContext = JSON.parse(ariMessages[1].content);
    assert.deepEqual(ariContext.currentAdventure.athun, {
        bond: 7,
        memories: ['La primera noche juntas'],
        revelations: ['La tinta respira'],
        bondHistory: [{ delta: 1, reason: 'Ariadna defendió a Athun' }]
    });
    assert.equal(ariMessages[0].content.includes('exclusivos de esta partida'), true);
});


test('la personalidad de Athun evoluciona gradualmente con el vínculo y los recuerdos de cada partida', () => {
    const guarded = Narrator.deriveAthunRelationship({
        bond: -40,
        memories: ['Ariadna rechazó una advertencia', 'Compartieron una noche de tormenta'],
        bondHistory: [
            { delta: -1, reason: 'Ariadna rechazó una advertencia' },
            { delta: -1, reason: 'Ariadna ocultó un hallazgo' }
        ]
    });
    assert.equal(guarded.trustTone, 'distante y a la defensiva');
    assert.equal(guarded.recentMovement, 'se está replegando y necesita cautela');
    assert.deepEqual(guarded.relationshipAnchors, [
        'Ariadna rechazó una advertencia',
        'Ariadna ocultó un hallazgo'
    ]);
    assert.deepEqual(guarded.sharedMemoryAnchors, [
        'Ariadna rechazó una advertencia',
        'Compartieron una noche de tormenta'
    ]);

    const close = Narrator.deriveAthunRelationship({
        bond: 72,
        memories: ['Ariadna protegió el grimorio'],
        bondHistory: [
            { delta: 1, reason: 'Ariadna compartió un secreto' },
            { delta: 1, reason: 'Ariadna protegió el grimorio' }
        ]
    });
    assert.equal(close.trustTone, 'profundamente familiar, sin ser incondicional');
    assert.equal(close.recentMovement, 'se está abriendo poco a poco');

    const messages = Narrator.buildMessages('Sigo caminando', { name: 'Ariadna' }, {
        title: 'Historia',
        state: { currentLocation: 'Valdebruma', inventory: [], athun: {
            bond: 72, memories: ['Ariadna protegió el grimorio'], revelations: [],
            bondHistory: [{ delta: 1, reason: 'Ariadna protegió el grimorio' }]
        } }
    }, []);
    const context = JSON.parse(messages[1].content);
    assert.equal(context.athunRelationship.trustTone, 'profundamente familiar, sin ser incondicional');
    assert.deepEqual(context.currentAdventure.athun.bondHistory, [
        { delta: 1, reason: 'Ariadna protegió el grimorio' }
    ]);
    assert.ok(messages[0].content.includes('La tendencia no es una emoción obligatoria'));
});

test('Athun conserva recuerdos compartidos, revelaciones justificadas y cambios pequeños de vínculo', () => {
    const state = { athun: { id: 'athun', permanent: true, bond: 4, memories: ['La primera noche'], revelations: [] } };
    Narrator.applyAthunUpdates(state, {
        athunMemoriesToAdd: ['La primera noche', 'Ariadna confió en el grimorio', ''],
        athunRevelationsToAdd: ['La tinta respira'],
        athunBondChange: { delta: 1, reason: 'Ariadna confió en Athun' }
    });
    assert.deepEqual(state.athun.memories, ['La primera noche', 'Ariadna confió en el grimorio']);
    assert.deepEqual(state.athun.revelations, ['La tinta respira']);
    assert.equal(state.athun.bond, 5);
    assert.equal(state.athun.permanent, true);
});

test('Athun conserva los motivos de cada cambio de vínculo dentro de la partida', () => {
    const state = { athun: { bond: 4, memories: [], revelations: [], bondHistory: [] } };
    Narrator.applyAthunUpdates(state, {
        athunBondChange: { delta: 1, reason: 'Ariadna confió en el grimorio durante el peligro' }
    });
    Narrator.applyAthunUpdates(state, {
        athunBondChange: { delta: -1, reason: 'Ariadna rechazó una advertencia de Athun' }
    });
    assert.equal(state.athun.bond, 4);
    assert.deepEqual(state.athun.bondHistory, [
        { delta: 1, reason: 'Ariadna confió en el grimorio durante el peligro' },
        { delta: -1, reason: 'Ariadna rechazó una advertencia de Athun' }
    ]);

    const messages = Narrator.buildMessages('Recuerdo lo ocurrido', { name: 'Ariadna' }, {
        title: 'Historia de Ariadna',
        state: { currentLocation: 'Valdebruma', inventory: [], athun: state.athun }
    }, []);
    const context = JSON.parse(messages[1].content);
    assert.deepEqual(context.currentAdventure.athun.bondHistory, state.athun.bondHistory);
});

test('el registro de Athun limita tamaño, cantidad y variación del vínculo', () => {
    const state = { athun: { bond: 100, memories: [], revelations: [] } };
    Narrator.applyAthunUpdates(state, {
        athunMemoriesToAdd: Array.from({ length: 8 }, (_, i) => 'Recuerdo ' + i),
        athunRevelationsToAdd: ['Revelación válida'],
        athunBondChange: { delta: 1, reason: 'No puede superar el límite' }
    });
    assert.equal(state.athun.memories.length, 3);
    assert.equal(state.athun.bond, 100);
    assert.equal(state.athun.revelations.length, 1);
});


test('revela zonas cercanas al explorar sin cambiar de ubicación', () => {
    const WorldMap = require('../app/js/game/map.js');
    Save.createSlot({ name: 'Ariadna' }, {
        title: 'Exploración',
        state: {
            currentLocation: 'Plaza del pozo',
            visitedLocations: ['Plaza del pozo'],
            visibleLocations: [],
            inventory: []
        }
    });
    const sameAdventure = JSON.parse(JSON.stringify(Save.load().adventure));

    assert.equal(Session.addAction('Examino los alrededores', 'Descubres una calle entre la niebla.', {
        category: 'investigation',
        adventure: sameAdventure,
        visibleLocations: ['Calle del molino', 'Puente viejo']
    }), true);

    const saved = Save.load().adventure.state;
    const atlas = WorldMap.getAtlas(Save.getGlobalWorld(), saved, Save.load().adventure);
    assert.equal(saved.currentLocation, 'Plaza del pozo');
    assert.deepEqual(atlas.currentAndVisible.map(item => item.name), [
        'Plaza del pozo', 'Calle del molino', 'Puente viejo'
    ]);
    assert.equal(atlas.known.length, 0);
});

test('no conserva zonas visibles anteriores al desplazarse sin una nueva declaración', () => {
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
    nextAdventure.state.currentLocation = 'Puerto';

    assert.equal(Session.addAction('Me dirijo al puerto', 'Llegas al puerto.', {
        adventure: nextAdventure
    }), true);
    assert.deepEqual(Save.load().adventure.state.visibleLocations, []);
});



test('Athun no puede perderse, venderse, transferirse ni destruirse por una respuesta narrativa', () => {
    const state = { inventory: ['Athun — grimorio consciente', 'Moneda'] };
    Narrator.applyInventoryUpdates(state, {
        reply: 'Entregas la Moneda al mercader, pero Athun permanece contigo. Recoges una Llave.',
        itemsToRemove: ['Athun', 'Moneda'],
        itemsToAdd: ['Athun vendido', 'Athun transferido', 'Athun destruido', 'Llave']
    }, 'Entregas la Moneda al mercader, pero Athun permanece contigo. Recoges una Llave.');

    assert.deepEqual(state.inventory, ['Athun — grimorio consciente', 'Llave']);

    const restored = { inventory: ['Moneda'] };
    Narrator.applyInventoryUpdates(restored, { itemsToRemove: [], itemsToAdd: [] });
    assert.deepEqual(restored.inventory, ['Athun — grimorio consciente', 'Moneda']);

    const messages = Narrator.buildMessages('Intento vender el grimorio', { name: 'Ariadna' }, {
        title: 'Prueba de permanencia',
        state: {
            currentLocation: 'Camino de entrada a Valdebruma',
            inventory: restored.inventory,
            athun: { id: 'athun', permanent: true, memories: [], revelations: [] }
        }
    }, []);
    assert.ok(messages[0].content.includes('Athun es permanente e inseparable'));
    assert.ok(messages[0].content.includes('nunca puede perderse, ser robado, vendido'));
});



test('los cambios de ubicación y actitud de personajes requieren evidencia en la escena', () => {
    const state = {
        currentLocation: 'Plaza del pozo',
        characters: {
            Elia: { name: 'Elia', location: 'Plaza del pozo', attitude: 'Cautelosa' }
        }
    };

    assert.deepEqual(Narrator.filterCharacterUpdates([
        { character: 'Elia', location: 'Castillo', attitude: 'Hostil' }
    ], 'Elia permanece junto al pozo y observa la plaza.', state), []);

    assert.deepEqual(Narrator.filterCharacterUpdates([
        { character: 'Elia', location: 'Molino', attitude: 'Hostil' }
    ], 'Elia se marcha hacia el molino, todavía cautelosa.', state), [
        { character: 'Elia', location: 'Molino', attitude: 'Cautelosa' }
    ]);

    assert.deepEqual(Narrator.filterCharacterUpdates([
        { character: 'Elia', location: 'Plaza del pozo', attitude: 'Tranquila' }
    ], 'Elia se muestra Tranquila mientras habla contigo.', state), [
        { character: 'Elia', location: 'Plaza del pozo', attitude: 'Tranquila' }
    ]);
});

test('el narrador no mueve personajes por permanencia o desplazamientos negados', () => {
    const state = {
        currentLocation: 'Plaza del pozo',
        characters: {
            Elia: { name: 'Elia', location: 'Plaza del pozo', attitude: 'Cautelosa' }
        }
    };

    assert.deepEqual(Narrator.filterCharacterUpdates([
        { character: 'Elia', location: 'Molino', attitude: 'Cautelosa' }
    ], 'Elia permanece en el Molino.', state), []);

    assert.deepEqual(Narrator.filterCharacterUpdates([
        { character: 'Elia', location: 'Molino', attitude: 'Cautelosa' }
    ], 'Elia no se marcha hacia el Molino.', state), []);

    assert.deepEqual(Narrator.filterCharacterUpdates([
        { character: 'Elia', location: 'Puerto', attitude: 'Cautelosa' }
    ], 'Elia no se marcha hacia el Molino, pero después camina hasta el Puerto.', state), [
        { character: 'Elia', location: 'Puerto', attitude: 'Cautelosa' }
    ]);
});

test('el inventario rechaza objetos mencionados solo en JSON y no aplica pérdidas sin acción narrada', () => {
    const state = { inventory: ['Athun — grimorio consciente', 'Moneda', 'Poción'] };
    Narrator.applyInventoryUpdates(state, {
        reply: 'La estancia permanece en silencio. Ves una llave sobre la mesa.',
        itemsToAdd: ['Llave'],
        itemsToRemove: ['Moneda', 'Poción']
    }, 'La estancia permanece en silencio. Ves una llave sobre la mesa.');
    assert.deepEqual(state.inventory, ['Athun — grimorio consciente', 'Moneda', 'Poción']);

    Narrator.applyInventoryUpdates(state, {
        reply: 'Recoges la Llave y la guardas en tu mochila. Entregas la Moneda al posadero.',
        itemsToAdd: ['Llave'],
        itemsToRemove: ['Moneda']
    }, 'Recoges la Llave y la guardas en tu mochila. Entregas la Moneda al posadero.');
    assert.deepEqual(state.inventory, ['Athun — grimorio consciente', 'Poción', 'Llave']);
});

test('el inventario ignora adquisiciones y pérdidas que la narración niega', () => {
    const state = { inventory: ['Athun — grimorio consciente', 'Moneda', 'Poción'] };

    Narrator.applyInventoryUpdates(state, {
        reply: 'No recoges la Llave ni entregas la Moneda. Nunca pierdes la Poción.',
        itemsToAdd: ['Llave'],
        itemsToRemove: ['Moneda', 'Poción']
    }, 'No recoges la Llave ni entregas la Moneda. Nunca pierdes la Poción.');

    assert.deepEqual(state.inventory, ['Athun — grimorio consciente', 'Moneda', 'Poción']);

    Narrator.applyInventoryUpdates(state, {
        reply: 'No recoges la Llave, pero después la guardas en tu mochila. No entregas la Moneda, aunque finalmente la vendes.',
        itemsToAdd: ['Llave'],
        itemsToRemove: ['Moneda']
    }, 'No recoges la Llave, pero después la guardas en tu mochila. No entregas la Moneda, aunque finalmente la vendes.');

    assert.deepEqual(state.inventory, ['Athun — grimorio consciente', 'Poción', 'Llave']);
});

test('no sobrescribe un registro dañado del mundo compartido al intentar actualizarlo', () => {
    const damagedWorld = '{"locations":[{"name":"Valdebruma"}],"connections":';
    localStorage.setItem(Save.worldKey, damagedWorld);

    assert.equal(Save.addGlobalLocation('Puerto', 'Ariadna'), false);
    assert.equal(Save.addGlobalConnection('Valdebruma', 'Puerto', 'Ariadna'), false);
    assert.equal(Save.addGlobalEntity({ name: 'Elia', role: 'Cartógrafa' }, 'Ariadna'), false);
    assert.equal(Save.saveGlobalWorld({ locations: [{ name: 'Puerto' }] }), false);

    // La lectura degradada no debe convertir un registro ilegible en un mundo vacío persistido.
    assert.equal(localStorage.getItem(Save.worldKey), damagedWorld);
});


test('rechaza esquemas globales incoherentes sin normalizarlos sobre el registro original', () => {
    const cases = [
        { field: 'locations', value: 'no-es-un-array', update: () => Save.addGlobalLocation('Puerto', 'Ariadna') },
        { field: 'connections', value: {}, update: () => Save.addGlobalConnection('Plaza', 'Puerto', 'Ariadna') },
        { field: 'entities', value: [], update: () => Save.addGlobalEntity({ name: 'Elia' }, 'Ariadna') },
        { field: 'facts', value: 'dato-inválido', update: () => Save.saveGlobalWorld({ facts: ['Nuevo dato'] }) },
        { field: 'events', value: null, update: () => Save.saveGlobalWorld({ events: ['Nuevo evento'] }) },
        { field: 'changes', value: {}, update: () => Save.saveGlobalWorld({ changes: ['Nuevo cambio'] }) },
        { field: 'relationships', value: [], update: () => Save.saveGlobalWorld({ relationships: { elia: 1 } }) }
    ];

    for (const scenario of cases) {
        const damagedWorld = JSON.stringify({ [scenario.field]: scenario.value, preserved: 'dato-original' });
        localStorage.setItem(Save.worldKey, damagedWorld);

        assert.equal(scenario.update(), false, 'Debe rechazarse el campo ' + scenario.field);
        assert.equal(
            localStorage.getItem(Save.worldKey),
            damagedWorld,
            'Debe conservarse byte por byte el registro con ' + scenario.field
        );
    }
});


test('el contexto narrativo conserva las acciones previas de la partida', () => {
    const id = Save.createSlot({ name: 'Ariadna' }, {
        title: 'Historia de prueba',
        state: { currentLocation: 'Valdebruma', inventory: [] }
    });
    assert.ok(id);
    const saved = Save.load();
    saved.actions = [
        { text: 'Observo la plaza', response: 'La plaza está tranquila.' },
        { text: 'Hablo con la posadera', response: 'La posadera me saluda.' }
    ];
    assert.equal(Save.save(saved), true);

    const messages = Narrator.buildMessages(
        'Pregunto por el camino',
        saved.character,
        saved.adventure,
        Save.load().actions
    );
    const context = JSON.parse(messages[1].content);
    assert.deepEqual(context.recentHistory, [
        { action: 'Observo la plaza', response: 'La plaza está tranquila.' },
        { action: 'Hablo con la posadera', response: 'La posadera me saluda.' }
    ]);
});


test('el narrador no recibe datos de Elia antes de que el protagonista la conozca', () => {
    const id = Save.createSlot({ name: 'Ariadna' }, {
        title: 'Llegada a Valdebruma',
        state: {
            currentLocation: 'Camino de entrada a Valdebruma',
            eliaMet: false,
            inventory: [],
            characters: {
                Elia: {
                    name: 'Elia',
                    role: 'Cartógrafa',
                    location: 'Camino de entrada a Valdebruma',
                    attitude: 'Preocupada',
                    memories: ['Conoce el secreto de la campana']
                }
            }
        }
    });
    assert.ok(id);
    let saved = Save.load();
    let context = JSON.parse(Narrator.buildMessages('Observo el camino', saved.character, saved.adventure, [])[1].content);
    assert.equal(Object.hasOwn(context.currentAdventure.state.characters, 'Elia'), false);
    Save.addGlobalEntity({ name: 'Elia', role: 'Cartógrafa', location: 'Camino de entrada a Valdebruma' }, 'Otro protagonista');
    context = JSON.parse(Narrator.buildMessages('Observo el camino', saved.character, saved.adventure, [])[1].content);
    assert.equal(Object.hasOwn(context.persistentWorld.entities, 'elia'), false);

    saved.adventure.state.eliaMet = true;
    assert.equal(Save.save(saved), true);
    saved = Save.load();
    context = JSON.parse(Narrator.buildMessages('Hablo con Elia', saved.character, saved.adventure, [])[1].content);
    assert.equal(context.currentAdventure.state.characters.Elia.name, 'Elia');
    assert.equal(context.persistentWorld.entities.elia.name, 'Elia');
});

test('Athun sanea recuerdos, revelaciones, vínculo e historial antes de aplicar cambios', () => {
    const state = { athun: {
        bond: 999,
        memories: ['  Recuerdo válido  ', { texto: 'no válido' }, 'x'.repeat(500)],
        revelations: [' Revelación válida ', null, 42],
        bondHistory: [
            { delta: 2, reason: 'Delta imposible' },
            { delta: -1, reason: '  Motivo válido  ' },
            { delta: 1, reason: 42 }
        ]
    } };

    Narrator.applyAthunUpdates(state, {
        athunMemoriesToAdd: ['Nuevo recuerdo'],
        athunRevelationsToAdd: ['Nuevo descubrimiento']
    });

    assert.equal(state.athun.bond, 100);
    assert.deepEqual(state.athun.memories, ['Recuerdo válido', 'x'.repeat(300), 'Nuevo recuerdo']);
    assert.deepEqual(state.athun.revelations, ['Revelación válida', 'Nuevo descubrimiento']);
    assert.deepEqual(state.athun.bondHistory, [{ delta: -1, reason: 'Motivo válido' }]);
    assert.equal(state.athun.permanent, true);
});

test('el contexto del narrador filtra datos relacionales dañados de Athun antes de enviarlos al modelo', () => {
    const adventure = {
        title: 'Memoria dañada',
        state: {
            currentLocation: 'Valdebruma',
            inventory: ['Athun — grimorio consciente'],
            athun: {
                bond: 12,
                memories: [' Recuerdo limpio ', { secreto: 'objeto no válido' }, '', 'x'.repeat(400)],
                revelations: [null, ' Revelación limpia ', 23],
                bondHistory: [
                    { delta: 1, reason: 'Motivo válido' },
                    { delta: 1, reason: { texto: 'no válido' } }
                ]
            }
        }
    };
    const context = JSON.parse(Narrator.buildMessages('Abro el grimorio', { name: 'Ariadna' }, adventure, [])[1].content);

    assert.deepEqual(context.currentAdventure.athun.memories, ['Recuerdo limpio', 'x'.repeat(240)]);
    assert.deepEqual(context.currentAdventure.athun.revelations, ['Revelación limpia']);
    assert.deepEqual(context.currentAdventure.athun.bondHistory, [{ delta: 1, reason: 'Motivo válido' }]);
    assert.deepEqual(context.currentAdventure.state.athun, context.currentAdventure.athun);
    assert.equal(JSON.stringify(context).includes('objeto no válido'), false);
});


test('el contexto de personajes limita objetivos, recuerdos y campos no reconocidos', () => {
    const adventure = {
        title: 'Contexto de personaje',
        state: {
            currentLocation: 'Valdebruma',
            eliaMet: true,
            characters: {
                Elia: {
                    name: 'Elia',
                    role: 'Cartógrafa',
                    location: 'Valdebruma',
                    attitude: 'Cautelosa',
                    personalGoal: '  Encontrar el origen de las marcas  ',
                    goalStatus: 'progress',
                    trust: 99,
                    lastAutonomousAction: '  Revisa sus mapas  ',
                    memories: [' Recuerdo válido ', { secreto: 'no debe filtrarse' }, '', 42],
                    goalHistory: [
                        { goal: 'Investigar las marcas', status: 'progress', reason: 'Ha encontrado una pista' },
                        { goal: { secreto: 'no válido' }, status: 'completed', reason: 'No válido' }
                    ],
                    completedGoals: [
                        { goal: 'Ayudar a su hermano', reason: 'Lo consiguió' },
                        { goal: 42, reason: 'No válido' }
                    ],
                    privatePayload: 'NO DEBE APARECER'
                }
            }
        }
    };
    const context = JSON.parse(Narrator.buildMessages(
        'Hablo con Elia',
        { name: 'Ariadna' },
        adventure,
        []
    )[1].content);
    const elia = context.currentAdventure.state.characters.Elia;
    assert.equal(elia.personalGoal, 'Encontrar el origen de las marcas');
    assert.equal(elia.goalStatus, 'progress');
    assert.equal(elia.trust, 10);
    assert.equal(elia.lastAutonomousAction, 'Revisa sus mapas');
    assert.deepEqual(elia.memories, ['Recuerdo válido']);
    assert.deepEqual(elia.goalHistory, [{
        goal: 'Investigar las marcas',
        status: 'progress',
        reason: 'Ha encontrado una pista'
    }]);
    assert.deepEqual(elia.completedGoals, [{
        goal: 'Ayudar a su hermano',
        reason: 'Lo consiguió'
    }]);
    assert.equal(JSON.stringify(context).includes('NO DEBE APARECER'), false);
    assert.equal(JSON.stringify(context).includes('no debe filtrarse'), false);
});


test('las acciones autónomas solo se registran si están narradas en escena y no se repiten', () => {
    const state = {
        currentLocation: 'Plaza del pozo',
        characters: {
            Elia: {
                name: 'Elia',
                location: 'Plaza del pozo',
                lastAutonomousAction: 'Revisa sus mapas'
            },
            Tomás: {
                name: 'Tomás',
                location: 'Camino del molino'
            }
        }
    };
    const accepted = Narrator.filterAutonomousActions([
        { character: 'Elia', action: 'Revisa sus mapas' },
        { character: 'Elia', action: 'Señala una marca recién dibujada' },
        { character: 'Tomás', action: 'Se acerca desde el camino' },
        { character: 'Desconocido', action: 'Abre una puerta' },
        { character: 'Elia', action: '  ' }
    ], 'Elia levanta la vista y señala una marca recién dibujada en uno de sus mapas.', state);

    assert.deepEqual(accepted, [{
        character: 'Elia',
        action: 'Señala una marca recién dibujada'
    }]);
    assert.deepEqual(Narrator.filterAutonomousActions([
        { character: 'Elia', action: 'Señala una marca recién dibujada' }
    ], 'Elia continúa observando en silencio.', state), []);
    assert.deepEqual(Narrator.filterAutonomousActions('no es una lista', '', state), []);
});


test('los recuerdos de personajes requieren evidencia literal en la misma frase', () => {
    const state = {
        characters: {
            'Personaje A': { name: 'Personaje A' },
            'Personaje B': { name: 'Personaje B' }
        }
    };
    const reply = 'Personaje A guarda la llave en su bolsillo. Personaje B recuerda la promesa hecha ayer.';
    assert.deepEqual(Narrator.filterCharacterMemories([
        { character: 'Personaje A', memory: 'guarda la llave en su bolsillo' },
        { character: 'Personaje B', memory: 'recuerda la promesa hecha ayer' },
        { character: 'Personaje A', memory: 'ha descubierto una salida secreta' },
        { character: 'Desconocido', memory: 'ha encontrado una pista importante' },
        { character: 'Personaje A', memory: 'guarda la llave en su bolsillo' }
    ], state, reply), [
        { character: 'Personaje A', memory: 'guarda la llave en su bolsillo' },
        { character: 'Personaje B', memory: 'recuerda la promesa hecha ayer' }
    ]);
    assert.deepEqual(Narrator.filterCharacterMemories([
        { character: 'Personaje A', memory: 'guarda la llave en su bolsillo' }
    ], state, 'La escena permanece tranquila.'), []);
    assert.deepEqual(Narrator.filterCharacterMemories('no es una lista', state, reply), []);
});


test('las actualizaciones de objetivos exigen evidencia literal en la misma frase del personaje', () => {
    const state = {
        characters: {
            Elia: { name: 'Elia' },
            'Tomás': { name: 'Tomás' }
        }
    };
    const reply = 'Elia ha encontrado una nueva señal en las marcas. Tomás confirma que el acceso está cerrado.';
    assert.deepEqual(Narrator.filterGoalUpdates([
        { character: 'Elia', goal: 'Investigar las marcas', status: 'progress', reason: 'ha encontrado una nueva señal' },
        { character: 'Tomás', goal: 'Proteger el molino', status: 'blocked', reason: 'el acceso está cerrado' },
        { character: 'Desconocido', goal: 'Abrir la puerta', status: 'active', reason: 'Quiere entrar' },
        { character: 'Elia', goal: 'Cambiar de objetivo', status: 'inventado', reason: 'Motivo inválido' },
        { character: 'Tomás', goal: 'Buscar ayuda', status: 'active', reason: '   ' },
        { character: 'Elia', goal: 'Objetivo inventado', status: 'completed', reason: 'El personaje ha resuelto el problema' }
    ], state, reply), [
        { character: 'Elia', goal: 'Investigar las marcas', status: 'progress', reason: 'ha encontrado una nueva señal' },
        { character: 'Tomás', goal: 'Proteger el molino', status: 'blocked', reason: 'el acceso está cerrado' }
    ]);
    assert.deepEqual(Narrator.filterGoalUpdates([
        { character: 'Elia', goal: 'Objetivo no narrado', status: 'completed', reason: 'Ha resuelto el problema' }
    ], state, 'La mañana permanece tranquila.'), []);
    assert.deepEqual(Narrator.filterGoalUpdates('no es una lista', state, reply), []);
});


test('el narrador no confirma hechos, pistas ni encuentros que solo aparecen en el JSON', () => {
    const state = {
        currentLocation: 'Camino de entrada a Valdebruma',
        eliaMet: false,
        knownFacts: [],
        clues: [],
        characters: {}
    };

    Narrator.applyDiscoveryUpdates(state, {
        reply: 'La mañana sigue su curso y el camino permanece tranquilo.',
        factsToAdd: ['Hay un viejo pozo de piedra en la plaza.'],
        cluesToAdd: ['Una campanada llega desde el pozo.'],
        charactersToAdd: [{
            name: 'Elia',
            role: 'Cartógrafa',
            location: 'Camino de entrada a Valdebruma',
            attitude: 'Cautelosa',
            memory: 'Ha conocido al protagonista.',
            evidence: 'Elia se acerca y se presenta.'
        }]
    });

    assert.deepEqual(state.knownFacts, []);
    assert.deepEqual(state.clues, []);
    assert.equal(state.wellDiscovered, undefined);
    assert.equal(state.bellDiscovered, undefined);
    assert.equal(state.eliaMet, false);
    assert.deepEqual(state.characters, {});
});


test('el narrador registra solo afirmaciones literales y encuentros presenciales en la ubicación actual', () => {
    const reply = 'Llegas a la Plaza del pozo y descubres un viejo pozo de piedra. Desde el fondo llega una campanada apagada. Una mujer se acerca y se presenta: «Me llamo Elia; soy cartógrafa». Marta se acerca desde Calle Mayor y te saluda. Oyes hablar de Tomás en la posada.';
    const state = {
        currentLocation: 'Plaza del pozo',
        eliaMet: false,
        knownFacts: [],
        clues: [],
        characters: {}
    };

    Narrator.applyDiscoveryUpdates(state, {
        reply,
        factsToAdd: [
            'Llegas a la Plaza del pozo y descubres un viejo pozo de piedra.',
            'La campana ha abierto una puerta secreta.'
        ],
        cluesToAdd: [
            'Desde el fondo llega una campanada apagada.',
            'Una puerta secreta se abre bajo el pozo.'
        ],
        charactersToAdd: [
            {
                name: 'Elia',
                role: 'Cartógrafa',
                location: 'Plaza del pozo',
                attitude: 'Cautelosa',
                memory: 'Se ha presentado al protagonista.',
                evidence: 'Una mujer se acerca y se presenta: «Me llamo Elia; soy cartógrafa».'
            },
            {
                name: 'Marta',
                role: 'Comerciante',
                location: 'Calle Mayor',
                attitude: 'Amable',
                memory: 'Ha saludado al protagonista.',
                evidence: 'Marta se acerca desde Calle Mayor y te saluda.'
            },
            {
                name: 'Tomás',
                role: 'Vecino',
                location: 'Plaza del pozo',
                attitude: 'Reservado',
                memory: 'El protagonista ha oído hablar de él.',
                evidence: 'Oyes hablar de Tomás en la posada.'
            },
            {
                name: 'Athun',
                role: 'Grimorio',
                location: 'Plaza del pozo',
                attitude: 'Consciente',
                memory: 'Permanece con el protagonista.',
                evidence: 'Athun permanece contigo.'
            }
        ]
    });

    assert.deepEqual(state.knownFacts, [
        'Llegas a la Plaza del pozo y descubres un viejo pozo de piedra.'
    ]);
    assert.deepEqual(state.clues, [
        'Desde el fondo llega una campanada apagada.'
    ]);
    assert.equal(state.wellDiscovered, true);
    assert.equal(state.bellDiscovered, true);
    assert.equal(state.eliaMet, true);
    assert.deepEqual(Object.keys(state.characters), ['Elia']);
    assert.equal(state.characters.Elia.location, 'Plaza del pozo');
});


test('las afirmaciones negativas no marcan el descubrimiento del pozo ni de la campana', () => {
    const state = {
        currentLocation: 'Camino de entrada a Valdebruma',
        knownFacts: [],
        clues: [],
        characters: {}
    };

    Narrator.applyDiscoveryUpdates(state, {
        reply: 'No hay ningún pozo en la plaza y no se oye ninguna campana.',
        factsToAdd: ['No hay ningún pozo en la plaza.'],
        cluesToAdd: ['No se oye ninguna campana.'],
        charactersToAdd: []
    });

    assert.equal(state.knownFacts.length, 1);
    assert.equal(state.clues.length, 1);
    assert.equal(state.wellDiscovered, undefined);
    assert.equal(state.bellDiscovered, undefined);
});


test('reconstruye un índice con entradas estructuralmente inválidas antes de guardar', () => {
    const first = Save.createSlot({ name: 'Ariadna' }, {
        title: 'Historia A', state: { inventory: ['Llave'] }
    });
    const second = Save.createSlot({ name: 'Darian' }, {
        title: 'Historia B', state: { inventory: ['Mapa'] }
    });
    assert.ok(first);
    assert.ok(second);

    localStorage.setItem(Save.indexKey, JSON.stringify({
        version: 1,
        saves: [null, { id: '', name: 'Entrada inválida' }, { id: second, name: 'Darian' }]
    }));

    const entries = Save.list();
    assert.deepEqual(entries.map(entry => entry.name), ['Ariadna', 'Darian']);
    assert.equal(entries.some(entry => !entry.id), false);
    assert.equal(Save.activate(first), true);
    const saved = Save.load();
    saved.character.name = 'Ariadna recuperada';
    assert.equal(Save.save(saved), true);
    assert.equal(Save.load().character.name, 'Ariadna recuperada');
});


test('no activa un registro JSON legible pero sin estructura de protagonista', () => {
    const damaged = Save.createSlot({ name: 'Ariadna' }, {
        title: 'Registro incompleto', state: { inventory: ['Llave'] }
    });
    const healthy = Save.createSlot({ name: 'Darian' }, {
        title: 'Registro íntegro', state: { inventory: ['Mapa'] }
    });
    assert.ok(damaged);
    assert.ok(healthy);
    assert.equal(Save.activate(damaged), true);

    const damagedRaw = JSON.stringify({ broken: true, adventure: { title: 'No es un guardado completo' } });
    localStorage.setItem(Save.slotPrefix + damaged, damagedRaw);

    assert.equal(Save.getActiveId(), healthy);
    assert.deepEqual(JSON.parse(localStorage.getItem(Save.activeKey)), { id: healthy });
    assert.equal(Save.load().character.name, 'Darian');
    assert.equal(localStorage.getItem(Save.slotPrefix + damaged), damagedRaw);
    assert.equal(Save.activate(damaged), false);
});

// La suite visual-preview ejecuta esta batería junto con la prueba de restauración de interfaz.


test('rechaza crear partidas sin un objeto de protagonista y no deja registros huérfanos', () => {
    Save.list();
    const before = new Map(localStorage.data);

    assert.equal(Save.createSlot(null, { title: 'Inválida' }), false);
    assert.equal(Save.createSlot('Ariadna', { title: 'Inválida' }), false);
    assert.equal(Save.createSlot([], { title: 'Inválida' }), false);

    assert.deepEqual(localStorage.data, before);
    assert.equal(Save.list().length, 0);
    assert.equal(Save.getActiveId(), null);
});


test('no reincorpora al índice registros incompletos al reconstruirlo', () => {
    const valid = Save.createSlot({ name: 'Darian' }, { title: 'Historia válida', state: { inventory: [] } });
    assert.ok(valid);
    const validRaw = localStorage.getItem(Save.slotPrefix + valid);
    const invalidId = 'save-incompleta';
    const invalidRaw = JSON.stringify({ broken: true, adventure: { title: 'No es una partida' } });
    localStorage.setItem(Save.slotPrefix + invalidId, invalidRaw);
    localStorage.setItem(Save.indexKey, '{índice dañado');
    localStorage.removeItem(Save.activeKey);

    const entries = Save.list();
    assert.deepEqual(entries.map(entry => entry.id), [valid]);
    assert.equal(Save.getActiveId(), valid);
    assert.equal(Save.load().character.name, 'Darian');
    assert.equal(localStorage.getItem(Save.slotPrefix + valid), validRaw);
    assert.equal(localStorage.getItem(Save.slotPrefix + invalidId), invalidRaw);
});


test('reconstruye índices con referencias a partidas inexistentes o dañadas', () => {
    const valid = Save.createSlot({ name: 'Ariadna' }, { title: 'Partida conservada', state: { inventory: [] } });
    assert.ok(valid);
    const validRaw = localStorage.getItem(Save.slotPrefix + valid);
    const brokenId = 'save-estructura-rota';
    const brokenRaw = JSON.stringify({ broken: true });
    localStorage.setItem(Save.slotPrefix + brokenId, brokenRaw);
    const phantomId = 'save-que-no-existe';
    const index = JSON.parse(localStorage.getItem(Save.indexKey));
    index.saves.push(
        { id: brokenId, name: 'Registro incompleto' },
        { id: phantomId, name: 'Registro ausente' }
    );
    localStorage.setItem(Save.indexKey, JSON.stringify(index));

    const entries = Save.list();
    assert.deepEqual(entries.map(entry => entry.id), [valid]);
    assert.equal(Save.getActiveId(), valid);
    assert.equal(Save.load().character.name, 'Ariadna');
    assert.equal(localStorage.getItem(Save.slotPrefix + valid), validRaw);
    assert.equal(localStorage.getItem(Save.slotPrefix + brokenId), brokenRaw);
    assert.equal(localStorage.getItem(Save.slotPrefix + phantomId), null);
});


test('no migra una clave heredada sin estructura de protagonista y conserva el original', () => {
    const malformed = { broken: true, adventure: { title: 'Registro incompleto' } };
    const original = JSON.stringify(malformed);
    localStorage.setItem(Save.key, original);

    assert.deepEqual(Save.list(), []);
    assert.equal(Save.getActiveId(), null);
    assert.equal(localStorage.getItem(Save.key), original);
    assert.equal(localStorage.getItem(Save.activeKey), null);
    assert.equal(Array.from(localStorage.data.keys()).some(key => key.startsWith(Save.slotPrefix)), false);
});


test('rechaza estructuras inválidas de protagonista o aventura sin alterar guardados', () => {
    const beforeInvalidCreation = Array.from(localStorage.data.entries());
    assert.equal(Save.createSlot({ name: 'Ariadna' }, 'aventura no válida'), false);
    assert.deepEqual(Array.from(localStorage.data.entries()), beforeInvalidCreation);

    const id = Save.createSlot({ name: 'Ariadna' }, { title: 'Historia válida', state: {} });
    assert.ok(id);
    const originalRaw = localStorage.getItem(Save.slotPrefix + id);
    const originalIndex = localStorage.getItem(Save.indexKey);
    const originalActive = localStorage.getItem(Save.activeKey);

    assert.equal(Save.replace({ character: { name: 'Ariadna' }, adventure: ['no válida'] }), false);
    assert.equal(Save.save({ id, character: 'no es un protagonista' }), false);
    assert.equal(localStorage.getItem(Save.slotPrefix + id), originalRaw);
    assert.equal(localStorage.getItem(Save.indexKey), originalIndex);
    assert.equal(localStorage.getItem(Save.activeKey), originalActive);
    assert.equal(Save.load().character.name, 'Ariadna');
});


test('crear una partida no sobrescribe un slot si coincide el identificador generado', () => {
    const originalNow = Date.now;
    const originalRandom = Math.random;
    const fixedTime = 123456789;
    const fixedRandom = 0.25;
    const firstId = 'save-' + fixedTime.toString(36) + '-' + Math.floor(fixedRandom * 1000000).toString(36);
    const occupied = { character: { name: 'Guardado previo' }, adventure: { title: 'No sobrescribir', state: {} } };
    const occupiedRaw = JSON.stringify(occupied);
    localStorage.setItem(Save.slotPrefix + firstId, occupiedRaw);
    try {
        Date.now = () => fixedTime;
        Math.random = () => fixedRandom;
        const created = Save.createSlot({ name: 'Ariadna' }, { title: 'Partida nueva', state: {} });
        assert.ok(created);
        assert.notEqual(created, firstId);
        assert.equal(localStorage.getItem(Save.slotPrefix + firstId), occupiedRaw);
        assert.equal(Save.load().character.name, 'Ariadna');
    } finally {
        Date.now = originalNow;
        Math.random = originalRandom;
    }
});


test('normaliza arrays en campos de objeto sin perder la estructura de la partida', () => {
    const id = Save.createSlot(
        { name: 'Ariadna' },
        { title: 'Historia válida', state: { inventory: ['Mapa'], athun: [] } },
        { world: [], actions: [] }
    );
    assert.ok(id);
    const saved = Save.load();
    assert.ok(saved);
    assert.deepEqual(saved.world, { events: [], facts: [], relationships: {} });
    assert.deepEqual(saved.adventure.state.athun.memories, []);
    assert.deepEqual(saved.adventure.state.athun.revelations, []);
    assert.equal(saved.adventure.state.athun.permanent, true);
    assert.ok(Array.isArray(saved.adventure.state.inventory));
    assert.ok(saved.adventure.state.inventory.some(item => String(item).includes('Athun')));
});


test('rechaza estructuras inválidas del mundo compartido sin modificar el original', () => {
    const validWorld = {
        locations: [{ name: 'Puerto' }],
        connections: [],
        entities: { 'persona': { name: 'Persona' } },
        facts: ['hecho'],
        events: [],
        changes: [],
        relationships: { persona: { known: true } }
    };
    assert.equal(Save.saveGlobalWorld(validWorld), true);
    const original = localStorage.getItem(Save.worldKey);
    assert.equal(Save.saveGlobalWorld([]), false);
    assert.equal(Save.saveGlobalWorld({ entities: [] }), false);
    assert.equal(Save.saveGlobalWorld({ relationships: [] }), false);
    assert.equal(Save.saveGlobalWorld({ locations: {} }), false);
    assert.equal(localStorage.getItem(Save.worldKey), original);
    assert.deepEqual(Save.getGlobalWorld(), validWorld);
});


test('expone un mundo normalizado sin reescribir arrays corruptos del registro global', () => {
    const malformed = {
        locations: [], connections: [], entities: [], facts: [], events: [], changes: [], relationships: []
    };
    const original = JSON.stringify(malformed);
    localStorage.setItem(Save.worldKey, original);
    const world = Save.getGlobalWorld();
    assert.deepEqual(world.entities, {});
    assert.deepEqual(world.relationships, {});
    assert.deepEqual(world.locations, []);
    assert.equal(localStorage.getItem(Save.worldKey), original);
    assert.equal(Save.saveGlobalWorld(world), false);
    assert.equal(localStorage.getItem(Save.worldKey), original);
});
