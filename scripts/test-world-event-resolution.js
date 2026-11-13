const test = require("node:test");
const assert = require("node:assert/strict");
const Resolution = require("../app/js/game/world-event-resolution.js");

const base = {
  clock: { tick: 9 },
  facts: ["untouched"],
  events: [{ id: "ev-1", tick: 8, status: "pending", causeId: "cause-1", actorId: "npc-1" }]
};

test("resuelve un evento pendiente y conserva su causalidad", () => {
  const result = Resolution.resolveEvent(base, "ev-1", "resolve-1", {
    outcome: "applied", summary: "La investigación llega al archivo", effectIds: ["fact-2"]
  });
  assert.equal(result.applied, true);
  assert.equal(result.event.status, "applied");
  assert.equal(result.event.causeId, "cause-1");
  assert.equal(result.event.resolution.tick, 9);
  assert.deepEqual(result.world.facts, ["untouched"]);
  assert.equal(base.events[0].status, "pending");
});

test("exige referencias de efectos cuando el resultado es aplicado", () => {
  const result = Resolution.resolveEvent(base, "ev-1", "resolve-2", {
    outcome: "applied", summary: "Se completa"
  });
  assert.equal(result.reason, "missing-effect-reference");
});

test("permite cancelar o marcar fallo sin inventar efectos", () => {
  for (const outcome of ["cancelled", "failed"]) {
    const result = Resolution.resolveEvent(base, "ev-1", "op-" + outcome, {
      outcome, summary: "La condición causal ya no se cumple"
    });
    assert.equal(result.applied, true);
    assert.equal(result.event.status, outcome);
    assert.deepEqual(result.event.resolution.effectIds, []);
  }
});

test("rechaza reintentos de la misma operación", () => {
  const first = Resolution.resolveEvent(base, "ev-1", "resolve-3", {
    outcome: "cancelled", summary: "Cancelado"
  });
  const second = Resolution.resolveEvent(first.world, "ev-1", "resolve-3", {
    outcome: "cancelled", summary: "Cancelado"
  });
  assert.equal(second.reason, "duplicate-operation");
});

test("rechaza una segunda transición terminal con otra operación", () => {
  const first = Resolution.resolveEvent(base, "ev-1", "resolve-4", {
    outcome: "failed", summary: "Falló"
  });
  const second = Resolution.resolveEvent(first.world, "ev-1", "resolve-5", {
    outcome: "applied", summary: "No debe reabrirse", effectIds: ["fact-3"]
  });
  assert.equal(second.reason, "event-not-pending");
});

test("rechaza evento inexistente, outcome inválido y resumen vacío", () => {
  assert.equal(Resolution.resolveEvent(base, "missing", "op-1", {
    outcome: "failed", summary: "x"
  }).reason, "event-not-found");
  assert.equal(Resolution.resolveEvent(base, "ev-1", "op-2", {
    outcome: "pending", summary: "x"
  }).reason, "invalid-outcome");
  assert.equal(Resolution.resolveEvent(base, "ev-1", "op-3", {
    outcome: "failed", summary: ""
  }).reason, "missing-summary");
});

test("requiere tick válido y entradas identificadas", () => {
  assert.equal(Resolution.resolveEvent({ ...base, clock: { tick: -1 } }, "ev-1", "op", {
    outcome: "failed", summary: "x"
  }).reason, "invalid-input");
  assert.equal(Resolution.resolveEvent(base, "", "op", {
    outcome: "failed", summary: "x"
  }).reason, "invalid-input");
});

test("elimina IDs de efectos duplicados y limita su tamaño", () => {
  const result = Resolution.resolveEvent(base, "ev-1", "resolve-6", {
    outcome: "applied", summary: "Efectos registrados", effectIds: ["f1", "f1", "", "f2"]
  });
  assert.deepEqual(result.event.resolution.effectIds, ["f1", "f2"]);
});

test("rechaza operación sin resumen o sin outcome terminal", () => {
  assert.equal(Resolution.resolveEvent(base, "ev-1", "", {
    outcome: "cancelled", summary: "x"
  }).reason, "invalid-input");
});


test("resuelve IDs heredados con espacios y los normaliza al actualizar", () => {
  const legacy = { ...base, events: [{ ...base.events[0], id: "  ev-1  " }] };
  const result = Resolution.resolveEvent(legacy, " ev-1 ", "resolve-legacy", {
    outcome: "failed", summary: "La pista no conduce a nada"
  });
  assert.equal(result.applied, true);
  assert.equal(result.event.id, "ev-1");
  assert.equal(result.world.events[0].id, "ev-1");
});
