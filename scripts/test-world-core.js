'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const World = require('../app/js/game/world-core.js');

test('normaliza partidas antiguas sin descartar campos desconocidos', () => {
    const result = World.normalize({
        legacyFlag: 'preserve',
        events: 'invalid',
        relationships: null
    });
    assert.equal(result.legacyFlag, 'preserve');
    assert.deepEqual(result.events, []);
    assert.deepEqual(result.relationships, {});
    assert.equal(result.clock.tick, 0);
    assert.equal(result.schemaVersion, World.SCHEMA_VERSION);
});

test('la normalización repetida es estable', () => {
    const original = {
        schemaVersion: 1,
        clock: { tick: 7, custom: true },
        events: [{ id: 'e1', tick: 7 }],
        processedOperations: ['a', 'a', 'b'],
        extra: { keep: 1 }
    };
    assert.deepEqual(World.normalize(World.normalize(original)), World.normalize(original));
});

test('una operación nueva avanza exactamente un tick', () => {
    const result = World.applyStep({ clock: { tick: 4 } }, 'op-1', 'llega al pueblo');
    assert.equal(result.applied, true);
    assert.equal(result.tick, 5);
    assert.equal(result.world.events.length, 1);
    assert.equal(result.world.events[0].tick, 5);
});

test('repetir operationId no duplica evento ni tick', () => {
    const first = World.applyStep({}, 'same-op', 'hecho');
    const second = World.applyStep(first.world, 'same-op', 'hecho');
    assert.equal(second.applied, false);
    assert.equal(second.world.clock.tick, 1);
    assert.equal(second.world.events.length, 1);
});

test('rechaza identificadores vacíos', () => {
    assert.throws(() => World.applyStep({}, '  '), /operationId/);
});

test('conserva el estado de mundo no gestionado', () => {
    const result = World.applyStep({
        clock: { tick: 2 },
        facts: ['dato'],
        relationships: { A: { B: { trust: 2 }, C: { trust: 1 } } },
        customSubsystem: { enabled: true }
    }, 'op-2');
    assert.deepEqual(result.world.facts, ['dato']);
    assert.deepEqual(result.world.relationships.A.C, { trust: 1 });
    assert.deepEqual(result.world.customSubsystem, { enabled: true });
});

test('limita el registro de operaciones procesadas', () => {
    const ids = Array.from({ length: World.MAX_PROCESSED_OPERATIONS + 10 }, (_, i) => 'op-' + i);
    const world = World.normalize({ processedOperations: ids });
    assert.equal(world.processedOperations.length, World.MAX_PROCESSED_OPERATIONS);
    assert.equal(world.processedOperations[0], 'op-10');
});
