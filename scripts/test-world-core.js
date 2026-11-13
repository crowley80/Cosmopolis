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


test("rechaza un ID de evento ya utilizado por otra operación sin avanzar el tick", () => {
  const first = World.applyStep({}, "operation-1", { id: "shared-event", description: "Primero" });
  const second = World.applyStep(first.world, "operation-2", { id: "shared-event", description: "Duplicado" });
  assert.equal(second.applied, false);
  assert.equal(second.reason, "duplicate-event-id");
  assert.equal(second.tick, 1);
  assert.equal(second.world.events.length, 1);
  assert.equal(second.world.processedOperations.includes("operation-2"), false);
});


test('normaliza espacios en IDs de eventos para impedir duplicados equivalentes', () => {
  const first = World.applyStep({}, 'op-a', { id: '  event-x  ', description: 'Primero' });
  assert.equal(first.world.events[0].id, 'event-x');
  const second = World.applyStep(first.world, 'op-b', { id: 'event-x', description: 'Duplicado' });
  assert.equal(second.applied, false);
  assert.equal(second.reason, 'duplicate-event-id');
  assert.equal(second.world.clock.tick, 1);
  assert.equal(second.world.processedOperations.includes('op-b'), false);
});

test('un ID de evento compuesto solo por espacios usa operationId normalizado', () => {
  const result = World.applyStep({}, '  op-space  ', { id: '   ', description: 'Evento' });
  assert.equal(result.applied, true);
  assert.equal(result.world.events[0].id, 'op-space');
});

test('rechaza operationId y event.id mayores de 160 caracteres', () => {
    const oversized = 'x'.repeat(World.MAX_ID_LENGTH + 1);
    assert.throws(() => World.applyStep({}, oversized), /operationId/);
    assert.throws(() => World.applyStep({}, 'valid-op', { id: oversized }), /event.id/);
});

test('normaliza IDs procesados heredados descartando los que superan el límite', () => {
    const oversized = 'x'.repeat(World.MAX_ID_LENGTH + 1);
    const result = World.normalize({ processedOperations: ['valid', oversized] });
    assert.deepEqual(result.processedOperations, ['valid']);
});

test('rechaza avanzar más allá del máximo entero seguro sin mutar el mundo', () => {
    const original = {
        clock: { tick: Number.MAX_SAFE_INTEGER },
        events: [{ id: 'last', tick: Number.MAX_SAFE_INTEGER }]
    };
    const result = World.applyStep(original, 'next-operation', 'no debe avanzar');
    assert.equal(result.applied, false);
    assert.equal(result.reason, 'tick-overflow');
    assert.equal(result.tick, Number.MAX_SAFE_INTEGER);
    assert.equal(result.world.clock.tick, Number.MAX_SAFE_INTEGER);
    assert.equal(result.world.events.length, 1);
    assert.equal(result.world.processedOperations.includes('next-operation'), false);
});
