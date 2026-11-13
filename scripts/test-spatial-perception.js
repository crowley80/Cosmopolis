const test = require("node:test");
const assert = require("node:assert/strict");
const Rules = require("../app/js/game/perception-rules.js");
const Spatial = require("../app/js/game/spatial-perception.js");

const actors = [
  { id: "player", locationId: "hall", position: { x: 0, y: 0 }, senses: { sight: true, hearing: true } },
  { id: "guard", locationId: "hall", position: { x: 3, y: 4 }, senses: { sight: true, hearing: false } },
  { id: "guest", locationId: "hall", position: { x: 6, y: 8 }, senses: { sight: true } },
  { id: "other-room", locationId: "room", position: { x: 1, y: 1 }, senses: { sight: true } }
];

test("calcula distancia euclídea entre coordenadas explícitas", () => {
  assert.equal(Spatial.distanceBetween({ x: 0, y: 0 }, { x: 3, y: 4 }), 5);
});

test("rechaza coordenadas ausentes, no finitas o fuera de límites", () => {
  assert.equal(Spatial.distanceBetween(null, { x: 0, y: 0 }), null);
  assert.equal(Spatial.distanceBetween({ x: Infinity, y: 0 }, { x: 0, y: 0 }), null);
  assert.equal(Spatial.distanceBetween({ x: 1000001, y: 0 }, { x: 0, y: 0 }), null);
});

test("sin rango explícito conserva las reglas perceptivas previas", () => {
  assert.deepEqual(Spatial.resolveObservers(actors, { locationId: "hall", channel: "sight" }, Rules),
    ["player", "guard", "guest"]);
});

test("aplica el alcance inclusivo usando distancia euclídea", () => {
  assert.deepEqual(Spatial.resolveObservers(actors, {
    locationId: "hall", channel: "sight", position: { x: 0, y: 0 }, range: 5
  }, Rules), ["player", "guard"]);
});

test("no percibe si falta una posición cuando el estímulo declara alcance", () => {
  const actor = { id: "a", locationId: "hall", senses: { sight: true } };
  assert.equal(Spatial.canPerceive(actor, {
    locationId: "hall", channel: "sight", position: { x: 0, y: 0 }, range: 10
  }, Rules), false);
});

test("un rango inválido no se interpreta como ilimitado", () => {
  assert.equal(Spatial.canPerceive(actors[0], {
    locationId: "hall", channel: "sight", position: { x: 0, y: 0 }, range: -1
  }, Rules), false);
  assert.equal(Spatial.canPerceive(actors[0], {
    locationId: "hall", channel: "sight", position: { x: 0, y: 0 }, range: 1000001
  }, Rules), false);
});

test("mantiene las restricciones de localización y sentido", () => {
  assert.deepEqual(Spatial.resolveObservers(actors, {
    locationId: "hall", channel: "hearing", position: { x: 0, y: 0 }, range: 20
  }, Rules), ["player"]);
});

test("resolveAll conserva datos y añade observadores espaciales", () => {
  const [item] = Spatial.resolveAll(actors, [{
    id: "bell", locationId: "hall", channel: "hearing",
    position: { x: 0, y: 0 }, range: 6, content: "Campana"
  }], Rules);
  assert.equal(item.id, "bell");
  assert.deepEqual(item.observerIds, ["player"]);
});

test("no requiere ni inventa línea de visión: respeta exclusiones declaradas", () => {
  assert.deepEqual(Spatial.resolveObservers(actors, {
    locationId: "hall", channel: "sight", position: { x: 0, y: 0 }, range: 20,
    blockedFor: ["guard"]
  }, Rules), ["player", "guest"]);
});
