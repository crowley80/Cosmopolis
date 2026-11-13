const test = require("node:test");
const assert = require("node:assert/strict");
const Initiative = require("../app/js/game/npc-initiative.js");

const actors = [
  { id: "a", personalGoal: "Encontrar a su hermana", goalStatus: "active", locationId: "market" },
  { id: "b", personalGoal: "Proteger el archivo", goalStatus: "active", locationId: "archive" },
  { id: "c", personalGoal: "Abrir una tienda", goalStatus: "active", locationId: "square" }
];

test("solo considera actores incluidos en la lista explícita de elegibles", () => {
  const result = Initiative.selectInitiatives(actors, 3, { eligibleActorIds: ["b"] });
  assert.deepEqual(result.selected.map(item => item.actorId), ["b"]);
});

test("excluye al jugador y a actores no autónomos o fallecidos", () => {
  const result = Initiative.selectInitiatives([
    { ...actors[0], isPlayer: true },
    { ...actors[1], autonomous: false },
    { ...actors[2], alive: false }
  ], 3, { eligibleActorIds: ["a", "b", "c"] });
  assert.equal(result.selected.length, 0);
});

test("requiere objetivo personal activo", () => {
  const result = Initiative.selectInitiatives([
    { id: "a", personalGoal: "", goalStatus: "active" },
    { id: "b", personalGoal: "Objetivo", goalStatus: "completed" },
    { id: "c", personalGoal: "Objetivo", goalStatus: "paused" }
  ], 1, { eligibleActorIds: ["a", "b", "c"] });
  assert.equal(result.selected.length, 0);
});

test("respeta el próximo tick permitido", () => {
  const result = Initiative.selectInitiatives([
    { ...actors[0], nextInitiativeTick: 5 },
    { ...actors[1], nextInitiativeTick: 2 }
  ], 3, { eligibleActorIds: ["a", "b"], maxPerTick: 2 });
  assert.deepEqual(result.selected.map(item => item.actorId), ["b"]);
});

test("aplica un límite por tick y rota el cursor de forma determinista", () => {
  const first = Initiative.selectInitiatives(actors, 1, {
    eligibleActorIds: ["a", "b", "c"], maxPerTick: 1
  });
  const second = Initiative.selectInitiatives(actors, 1, {
    eligibleActorIds: ["a", "b", "c"], maxPerTick: 1, cursorActorId: first.nextCursorId
  });
  assert.equal(first.selected[0].actorId, "a");
  assert.equal(second.selected[0].actorId, "b");
});

test("limita el máximo solicitado a cinco iniciativas", () => {
  const result = Initiative.selectInitiatives(actors, 1, {
    eligibleActorIds: ["a", "b", "c"], maxPerTick: 99
  });
  assert.equal(result.selected.length, 3);
  assert.equal(Initiative.limits.maxPerTick, 5);
});

test("no repite IDs de actor y ordena empates por ID", () => {
  const result = Initiative.selectInitiatives([actors[1], actors[0], actors[0]], 1, {
    eligibleActorIds: ["a", "b"], maxPerTick: 5
  });
  assert.deepEqual(result.selected.map(item => item.actorId), ["a", "b"]);
});

test("marca una iniciativa y aplica un periodo de espera lógico", () => {
  const result = Initiative.markInitiative(actors[0], 4, 3);
  assert.equal(result.applied, true);
  assert.equal(result.actor.lastInitiativeTick, 4);
  assert.equal(result.actor.nextInitiativeTick, 7);
});

test("rechaza marcar dos veces una iniciativa en el mismo tick", () => {
  const first = Initiative.markInitiative(actors[0], 4, 2);
  const second = Initiative.markInitiative(first.actor, 4, 2);
  assert.equal(second.applied, false);
  assert.equal(second.reason, "already-processed");
});

test("rechaza ticks inválidos y entradas incompletas", () => {
  assert.equal(Initiative.selectInitiatives(actors, -1).rejected, true);
  assert.equal(Initiative.markInitiative({}, 2).applied, false);
});


test("el cursor avanza desde el actor exacto aunque el orden por cooldown no sea alfabético", () => {
  const actors = [
    { id: "zeta", personalGoal: "A", goalStatus: "active", nextInitiativeTick: 1 },
    { id: "alfa", personalGoal: "B", goalStatus: "active", nextInitiativeTick: 2 },
    { id: "beta", personalGoal: "C", goalStatus: "active", nextInitiativeTick: 2 }
  ];
  const result = Initiative.selectInitiatives(actors, 3, {
    eligibleActorIds: ["zeta", "alfa", "beta"],
    cursorActorId: "zeta",
    maxPerTick: 1
  });
  assert.equal(result.selected[0].actorId, "alfa");
});
