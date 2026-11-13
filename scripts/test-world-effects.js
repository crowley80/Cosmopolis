const test = require("node:test");
const assert = require("node:assert/strict");
const Effects = require("../app/js/game/world-effects.js");

const base = {
  clock: { tick: 12 },
  events: [{ id: "event-1", status: "pending", causeId: "cause" }],
  facts: [],
  characters: { npc: { id: "npc", locationId: "market" } },
  locations: { market: { id: "market" }, archive: { id: "archive" } },
  relationships: {}
};

test("añade un hecho vinculado a un evento causal pendiente", () => {
  const result = Effects.applyEffect(base, {
    id: "fx-1", type: "fact.add", causeEventId: "event-1",
    factId: "fact-1", content: "La puerta quedó abierta", visibility: "local"
  });
  assert.equal(result.applied, true);
  assert.equal(result.world.facts[0].sourceEventId, "event-1");
  assert.equal(result.world.facts[0].tick, 12);
  assert.equal(base.facts.length, 0);
});

test("rechaza repetir un efecto sin duplicar el hecho", () => {
  const effect = { id: "fx-2", type: "fact.add", causeEventId: "event-1", factId: "f2", content: "Hecho" };
  const first = Effects.applyEffect(base, effect);
  const second = Effects.applyEffect(first.world, effect);
  assert.equal(second.applied, false);
  assert.equal(second.reason, "duplicate-effect");
  assert.equal(second.world.facts.length, 1);
});

test("rechaza ID de hecho ya utilizado por otro efecto", () => {
  const first = Effects.applyEffect(base, {
    id: "fx-3", type: "fact.add", causeEventId: "event-1", factId: "shared", content: "Uno"
  });
  const second = Effects.applyEffect(first.world, {
    id: "fx-4", type: "fact.add", causeEventId: "event-1", factId: "shared", content: "Dos"
  });
  assert.equal(second.reason, "duplicate-fact");
});

test("ajusta una relación direccional y deja historial causal", () => {
  const result = Effects.applyEffect(base, {
    id: "fx-5", type: "relationship.adjust", causeEventId: "event-1",
    fromActorId: "npc", toActorId: "player", axis: "trust", delta: 3
  });
  const relation = result.world.relationships.npc.player;
  assert.equal(relation.trust, 3);
  assert.equal(relation.history[0].causeEventId, "event-1");
});

test("limita valores de relación al rango -100..100", () => {
  const world = { ...base, relationships: { npc: { player: { trust: 98 } } } };
  const result = Effects.applyEffect(world, {
    id: "fx-6", type: "relationship.adjust", causeEventId: "event-1",
    fromActorId: "npc", toActorId: "player", axis: "trust", delta: 5
  });
  assert.equal(result.world.relationships.npc.player.trust, 100);
});

test("rechaza ejes y variaciones arbitrarios", () => {
  const result = Effects.applyEffect(base, {
    id: "fx-7", type: "relationship.adjust", causeEventId: "event-1",
    fromActorId: "npc", toActorId: "player", axis: "secret", delta: 99
  });
  assert.equal(result.reason, "invalid-relationship-effect");
});

test("mueve un personaje solo a una localización existente", () => {
  const result = Effects.applyEffect(base, {
    id: "fx-8", type: "character.move", causeEventId: "event-1",
    characterId: "npc", fromLocationId: "market", toLocationId: "archive"
  });
  assert.equal(result.applied, true);
  assert.equal(result.world.characters.npc.locationId, "archive");
  assert.equal(base.characters.npc.locationId, "market");
});

test("rechaza movimiento si la ubicación esperada no coincide", () => {
  const result = Effects.applyEffect(base, {
    id: "fx-9", type: "character.move", causeEventId: "event-1",
    characterId: "npc", fromLocationId: "street", toLocationId: "archive"
  });
  assert.equal(result.reason, "character-location-mismatch");
});

test("rechaza localizaciones de destino inexistentes", () => {
  const result = Effects.applyEffect(base, {
    id: "fx-10", type: "character.move", causeEventId: "event-1",
    characterId: "npc", toLocationId: "unknown"
  });
  assert.equal(result.reason, "invalid-character-move");
});

test("solo permite efectos causados por eventos pendientes", () => {
  const resolved = { ...base, events: [{ id: "event-1", status: "applied" }] };
  const result = Effects.applyEffect(resolved, {
    id: "fx-11", type: "fact.add", causeEventId: "event-1", factId: "f", content: "No"
  });
  assert.equal(result.reason, "cause-event-not-pending");
});

test("rechaza entradas inválidas y no muta el mundo original", () => {
  const result = Effects.applyEffect(base, { id: "", type: "fact.add" });
  assert.equal(result.applied, false);
  assert.equal(base.events[0].status, "pending");
  assert.deepEqual(base.facts, []);
});

test("un efecto aplicado queda referenciado en su evento causal", () => {
  const result = Effects.applyEffect(base, {
    id: "fx-12", type: "fact.add", causeEventId: "event-1", factId: "f12", content: "Causa"
  });
  assert.deepEqual(result.world.events[0].appliedEffectIds, ["fx-12"]);
});


test("limita los efectos por evento sin descartar los ya aplicados", () => {
  const appliedEffectIds = Array.from({ length: Effects.limits.maxEffectsPerEvent }, (_, i) => "fx-" + i);
  const full = { ...base, events: [{ id: "event-1", status: "pending", appliedEffectIds }] };
  const result = Effects.applyEffect(full, {
    id: "fx-overflow", type: "fact.add", causeEventId: "event-1", factId: "overflow", content: "No debe añadirse"
  });
  assert.equal(result.applied, false);
  assert.equal(result.reason, "event-effect-capacity");
  assert.equal(result.world.events[0].appliedEffectIds.length, Effects.limits.maxEffectsPerEvent);
  assert.equal(result.world.facts.length, 0);
});


test("trata IDs especiales como claves propias sin tocar prototipos", () => {
  const characters = Object.create(null);
  characters["__proto__"] = { id: "__proto__", locationId: "market" };
  const world = { ...base, characters };
  const moved = Effects.applyEffect(world, {
    id: "fx-special-char", type: "character.move", causeEventId: "event-1",
    characterId: "__proto__", toLocationId: "archive"
  });
  assert.equal(moved.applied, true);
  assert.equal(Object.prototype.hasOwnProperty.call(moved.world.characters, "__proto__"), true);
  assert.equal(moved.world.characters["__proto__"].locationId, "archive");
  const relation = Effects.applyEffect(base, {
    id: "fx-special-rel", type: "relationship.adjust", causeEventId: "event-1",
    fromActorId: "__proto__", toActorId: "constructor", axis: "trust", delta: 1
  });
  assert.equal(relation.applied, true);
  assert.equal(Object.prototype.hasOwnProperty.call(relation.world.relationships, "__proto__"), true);
  assert.equal(Object.prototype.hasOwnProperty.call(relation.world.relationships["__proto__"], "constructor"), true);
});


test("un ID de efecto no puede reutilizarse en otro evento aunque expire el registro global", () => {
  const first = Effects.applyEffect(base, {
    id: "globally-unique-effect", type: "fact.add", causeEventId: "event-1",
    factId: "fact-global", content: "Hecho persistente"
  });
  const world = {
    ...first.world,
    processedEffects: [],
    events: [...first.world.events, { id: "event-2", status: "pending", appliedEffectIds: [] }]
  };
  const second = Effects.applyEffect(world, {
    id: "globally-unique-effect", type: "fact.add", causeEventId: "event-2",
    factId: "fact-second", content: "No debe duplicarse"
  });
  assert.equal(second.applied, false);
  assert.equal(second.reason, "duplicate-effect");
  assert.equal(second.world.facts.length, 1);
  assert.deepEqual(second.world.events[1].appliedEffectIds, []);
});


test("rechaza hechos asociados a una localización inexistente", () => {
  const result = Effects.applyEffect(base, {
    id: "fx-missing-place", type: "fact.add", causeEventId: "event-1",
    factId: "fact-nowhere", content: "No debe registrarse", locationId: "nonexistent"
  });
  assert.equal(result.applied, false);
  assert.equal(result.reason, "fact-location-not-found");
  assert.equal(result.world.facts.length, 0);
});

test("rechaza IDs de efecto y causa excesivos sin truncarlos", () => {
  const oversized = "x".repeat(161);
  const longEffectId = Effects.applyEffect(base, {
    id: oversized, type: "fact.add", causeEventId: "event-1",
    factId: "long-effect", content: "No debe aplicarse"
  });
  assert.equal(longEffectId.applied, false);
  assert.equal(longEffectId.reason, "invalid-effect");
  const longCauseId = Effects.applyEffect(base, {
    id: "valid-effect", type: "fact.add", causeEventId: "event-1" + oversized,
    factId: "long-cause", content: "No debe aplicarse"
  });
  assert.equal(longCauseId.applied, false);
  assert.equal(longCauseId.reason, "invalid-effect");
  assert.equal(base.facts.length, 0);
});


test("rechaza IDs de dominio excesivos sin truncarlos a otra entidad", () => {
  const long = "x".repeat(161);
  const fact = Effects.applyEffect(base, {
    id: "fx-long-fact", type: "fact.add", causeEventId: "event-1",
    factId: long, content: "No debe crearse"
  });
  assert.equal(fact.applied, false);
  assert.equal(fact.reason, "invalid-fact");

  const location = Effects.applyEffect(base, {
    id: "fx-long-location", type: "fact.add", causeEventId: "event-1",
    factId: "fact-location", content: "No debe asociarse",
    locationId: "market" + long
  });
  assert.equal(location.applied, false);
  assert.equal(location.reason, "invalid-fact");

  const relationship = Effects.applyEffect(base, {
    id: "fx-long-actor", type: "relationship.adjust", causeEventId: "event-1",
    fromActorId: "npc" + long, toActorId: "player", axis: "trust", delta: 1
  });
  assert.equal(relationship.applied, false);
  assert.equal(relationship.reason, "invalid-relationship-effect");
  assert.deepEqual(base.relationships, {});
});

test("rechaza IDs excesivos de personaje y localización de origen", () => {
  const long = "x".repeat(161);
  const character = Effects.applyEffect(base, {
    id: "fx-long-character", type: "character.move", causeEventId: "event-1",
    characterId: "npc" + long, toLocationId: "archive"
  });
  assert.equal(character.applied, false);
  assert.equal(character.reason, "invalid-character-move");
  assert.equal(character.world.characters.npc.locationId, "market");

  const origin = Effects.applyEffect(base, {
    id: "fx-long-origin", type: "character.move", causeEventId: "event-1",
    characterId: "npc", fromLocationId: "market" + long, toLocationId: "archive"
  });
  assert.equal(origin.applied, false);
  assert.equal(origin.reason, "invalid-character-move");
  assert.equal(origin.world.characters.npc.locationId, "market");
});
