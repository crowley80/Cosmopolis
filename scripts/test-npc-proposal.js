const test = require("node:test");
const assert = require("node:assert/strict");
const Proposal = require("../app/js/game/npc-proposal.js");

const actor = {
  id: "elia", personalGoal: "Encontrar a su hermano",
  goalStatus: "active", locationId: "market", autonomous: true, alive: true
};
const world = { clock: { tick: 4 }, events: [], facts: ["keep"] };
const proposal = {
  id: "p-1", actorId: "elia", tick: 4, causeId: "rumour-7",
  type: "investigation-started", description: "Elia comienza a investigar el rumor",
  locationId: "market", payload: { target: "old-docks" }
};
const options = { actors: [actor], eligibleActorIds: ["elia"] };

test("registra una propuesta válida como evento pendiente y conserva estado ajeno", () => {
  const result = Proposal.registerNpcProposal(world, proposal, options);
  assert.equal(result.applied, true);
  assert.equal(result.event.status, "pending");
  assert.equal(result.event.causeId, "rumour-7");
  assert.deepEqual(result.world.facts, ["keep"]);
  assert.equal(world.events.length, 0);
});

test("rechaza una propuesta repetida sin duplicar el evento", () => {
  const first = Proposal.registerNpcProposal(world, proposal, options);
  const second = Proposal.registerNpcProposal(first.world, proposal, options);
  assert.equal(second.applied, false);
  assert.equal(second.reason, "duplicate-proposal");
  assert.equal(second.world.events.length, 1);
});

test("exige actor incluido explícitamente en los elegibles", () => {
  const result = Proposal.registerNpcProposal(world, proposal, { actors: [actor], eligibleActorIds: [] });
  assert.equal(result.reason, "actor-not-eligible");
});

test("rechaza al jugador, personajes no autónomos y fallecidos", () => {
  for (const changes of [{ isPlayer: true }, { autonomous: false }, { alive: false }]) {
    const result = Proposal.registerNpcProposal(world, proposal, {
      actors: [{ ...actor, ...changes }], eligibleActorIds: ["elia"]
    });
    assert.equal(result.reason, "actor-not-eligible");
  }
});

test("rechaza objetivos terminados o inexistentes", () => {
  for (const changes of [{ personalGoal: "" }, { goalStatus: "completed" }, { goalStatus: "paused" }]) {
    const result = Proposal.registerNpcProposal(world, proposal, {
      actors: [{ ...actor, ...changes }], eligibleActorIds: ["elia"]
    });
    assert.equal(result.reason, "actor-goal-inactive");
  }
});

test("exige tick actual y causa explícita", () => {
  assert.equal(Proposal.registerNpcProposal(world, { ...proposal, tick: 3 }, options).reason, "invalid-proposal");
  assert.equal(Proposal.registerNpcProposal(world, { ...proposal, causeId: "" }, options).reason, "invalid-proposal");
});

test("rechaza discrepancia de localización", () => {
  const result = Proposal.registerNpcProposal(world, { ...proposal, locationId: "archive" }, options);
  assert.equal(result.reason, "actor-location-mismatch");
});

test("rechaza capacidad completa sin perder eventos previos", () => {
  const full = { ...world, events: Array.from({ length: Proposal.limits.maxEvents }, (_, i) => ({ id: "e" + i })) };
  const result = Proposal.registerNpcProposal(full, proposal, options);
  assert.equal(result.reason, "event-capacity");
  assert.equal(result.world.events.length, Proposal.limits.maxEvents);
  assert.equal(result.world.events[0].id, "e0");
});


test("rechaza duplicado aunque el ID del evento heredado tenga espacios exteriores", () => {
  const legacyWorld = {
    ...world,
    events: [{ id: "  npc-proposal:p-1  ", status: "pending" }]
  };
  const result = Proposal.registerNpcProposal(legacyWorld, proposal, options);
  assert.equal(result.applied, false);
  assert.equal(result.reason, "duplicate-proposal");
  assert.equal(result.world.events.length, 1);
});
