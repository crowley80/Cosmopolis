const test = require("node:test");
const assert = require("node:assert/strict");
const Rules = require("../app/js/game/perception-rules.js");

const actors = [
  { id: "player", locationId: "hall", senses: { sight: true, hearing: true }, attention: false },
  { id: "guard", locationId: "hall", senses: { sight: true, hearing: false }, attention: true },
  { id: "guest", locationId: "room", senses: { sight: true, hearing: true }, attention: true }
];

test("exige coincidencia exacta de localización", () => {
  assert.deepEqual(Rules.resolveObservers(actors, { locationId: "hall", channel: "sight" }), ["player", "guard"]);
});

test("exige que el sentido correspondiente esté habilitado", () => {
  assert.deepEqual(Rules.resolveObservers(actors, { locationId: "hall", channel: "hearing" }), ["player"]);
});

test("respeta listas explícitas de visibilidad y audibilidad", () => {
  assert.deepEqual(Rules.resolveObservers(actors, { locationId: "hall", channel: "sight", visibleTo: ["guard"] }), ["guard"]);
  assert.deepEqual(Rules.resolveObservers(actors, { locationId: "hall", channel: "hearing", audibleTo: ["guard"] }), []);
});

test("respeta ocultación y obstáculos declarados por actor", () => {
  assert.deepEqual(Rules.resolveObservers(actors, {
    locationId: "hall", channel: "sight",
    concealedFrom: ["player"], blockedFor: ["guard"]
  }), []);
});

test("exige atención solo cuando el estímulo la requiere", () => {
  assert.deepEqual(Rules.resolveObservers(actors, {
    locationId: "hall", channel: "sight", requiresAttention: true,
    attentiveActorIds: ["guard"]
  }), ["guard"]);
});

test("usa atención del actor si no hay lista específica", () => {
  assert.deepEqual(Rules.resolveObservers(actors, {
    locationId: "hall", channel: "sight", requiresAttention: true
  }), ["guard"]);
});

test("no calcula percepción entre localizaciones distintas", () => {
  assert.equal(Rules.canPerceive(actors[0], { locationId: "room", channel: "hearing" }), false);
});

test("no habilita sentidos ausentes ni canales desconocidos", () => {
  assert.equal(Rules.canPerceive(actors[1], { locationId: "hall", channel: "smell" }), false);
  assert.equal(Rules.canPerceive(actors[0], { locationId: "hall", channel: "telepathy" }), false);
});

test("la resolución es determinista y elimina IDs duplicados", () => {
  const repeated = [actors[0], actors[0], actors[1]];
  assert.deepEqual(Rules.resolveObservers(repeated, { locationId: "hall", channel: "sight" }), ["player", "guard"]);
});

test("resolveAll conserva el estímulo y añade observadores", () => {
  const [resolved] = Rules.resolveAll(actors, [{ id: "bell", content: "Suena una campana", locationId: "hall", channel: "hearing" }]);
  assert.equal(resolved.id, "bell");
  assert.deepEqual(resolved.observerIds, ["player"]);
});
