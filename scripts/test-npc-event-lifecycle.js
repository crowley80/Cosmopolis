const test = require("node:test");
const assert = require("node:assert/strict");
const Proposal = require("../app/js/game/npc-proposal.js");
const Resolution = require("../app/js/game/world-event-resolution.js");
const Effects = require("../app/js/game/world-effects.js");

const actor = {
  id: "mara", personalGoal: "Recuperar el mapa", goalStatus: "active",
  locationId: "port", autonomous: true, alive: true
};
const initial = { clock: { tick: 12 }, events: [], facts: [] };
const proposal = {
  id: "mara-initiative-12", actorId: "mara", tick: 12,
  causeId: "heard-rumour-3", type: "search-started",
  description: "Mara comienza a buscar el mapa", locationId: "port"
};
const options = { actors: [actor], eligibleActorIds: ["mara"] };

test("flujo causal completo conserva actor, causa y localización", () => {
  const created = Proposal.registerNpcProposal(initial, proposal, options);
  assert.equal(created.applied, true);
  const effect = Effects.applyEffect(created.world, {
    id: "effect-clue-map", type: "fact.add", causeEventId: created.event.id,
    factId: "clue-map-fragment", content: "Un fragmento del mapa aparece en el puerto"
  });
  assert.equal(effect.applied, true);
  const resolved = Resolution.resolveEvent(effect.world, created.event.id, "effect-op-1", {
    outcome: "applied", summary: "La búsqueda produce una pista verificable",
    effectIds: ["effect-clue-map"]
  });
  assert.equal(resolved.applied, true);
  assert.equal(resolved.event.actorId, "mara");
  assert.equal(resolved.event.causeId, "heard-rumour-3");
  assert.equal(resolved.event.locationId, "port");
  assert.deepEqual(resolved.event.resolution.effectIds, ["clue-map-fragment"]);
});

test("reintentar la propuesta y la resolución no duplica eventos", () => {
  const created = Proposal.registerNpcProposal(initial, proposal, options);
  const duplicate = Proposal.registerNpcProposal(created.world, proposal, options);
  assert.equal(duplicate.reason, "duplicate-proposal");
  const resolved = Resolution.resolveEvent(created.world, created.event.id, "effect-op-2", {
    outcome: "cancelled", summary: "La búsqueda se interrumpe"
  });
  const retry = Resolution.resolveEvent(resolved.world, created.event.id, "effect-op-2", {
    outcome: "cancelled", summary: "La búsqueda se interrumpe"
  });
  assert.equal(retry.reason, "duplicate-operation");
  assert.equal(retry.world.events.length, 1);
});

test("un evento cancelado no puede presentarse después como aplicado", () => {
  const created = Proposal.registerNpcProposal(initial, proposal, options);
  const cancelled = Resolution.resolveEvent(created.world, created.event.id, "cancel-1", {
    outcome: "cancelled", summary: "Mara recibe una advertencia y se detiene"
  });
  const applied = Resolution.resolveEvent(cancelled.world, created.event.id, "apply-1", {
    outcome: "applied", summary: "No debe aplicarse", effectIds: ["clue-1"]
  });
  assert.equal(applied.reason, "event-not-pending");
});

test("no altera el estado inicial ni aplica efectos implícitamente", () => {
  const created = Proposal.registerNpcProposal(initial, proposal, options);
  const effected = Effects.applyEffect(created.world, {
    id: "fact-9", type: "fact.add", causeEventId: created.event.id,
    factId: "fact-9", content: "La pista queda registrada"
  });
  const resolved = Resolution.resolveEvent(effected.world, created.event.id, "apply-2", {
    outcome: "applied", summary: "Referencia a efecto validado", effectIds: ["fact-9"]
  });
  assert.deepEqual(initial.events, []);
  assert.equal(resolved.world.facts.length, 1);
  assert.deepEqual(resolved.event.resolution.effectIds, ["fact-9"]);
});
