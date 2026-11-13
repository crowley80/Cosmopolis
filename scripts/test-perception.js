const test = require("node:test");
const assert = require("node:assert/strict");
const Knowledge = require("../app/js/game/knowledge.js");
globalThis.CosmopolisKnowledge = Knowledge;
const Perception = require("../app/js/game/perception.js");

test("solo registra estímulos cuya percepción autorizó el motor", () => {
  const result = Perception.registerPerceptions([], "player", [
    { id: "s1", content: "Una lámpara encendida", observerIds: ["player"], channel: "sight", locationId: "hall", tick: 2 },
    { id: "s2", content: "Una conversación privada", observerIds: ["npc"], channel: "hearing", locationId: "hall", tick: 2 }
  ]);
  assert.equal(result.recordedIds.length, 1);
  assert.equal(result.rejected, 1);
  const view = Knowledge.buildKnowledgeView(result.entries, "player").knowledge;
  assert.equal(view[0].content, "Una lámpara encendida");
  assert.equal(view[0].source, "perceived");
});

test("no registra estímulos sin lista explícita de observadores", () => {
  const result = Perception.registerPerceptions([], "player", [
    { id: "s1", content: "Un secreto", observerIds: [] }
  ]);
  assert.equal(result.entries.length, 0);
  assert.equal(result.rejected, 1);
});

test("un mismo estímulo no se registra dos veces para el mismo actor", () => {
  const observation = { id: "s1", content: "Pasos", observerIds: ["player"] };
  const first = Perception.registerPerceptions([], "player", [observation]);
  const second = Perception.registerPerceptions(first.entries, "player", [observation]);
  assert.equal(first.recordedIds.length, 1);
  assert.equal(second.recordedIds.length, 0);
  assert.equal(second.entries.length, 1);
});

test("dos actores autorizados reciben registros separados", () => {
  const observation = { id: "s1", content: "Un portazo", observerIds: ["a", "b"], channel: "hearing" };
  const a = Perception.registerPerceptions([], "a", [observation]);
  const b = Perception.registerPerceptions(a.entries, "b", [observation]);
  assert.equal(Knowledge.buildKnowledgeView(b.entries, "a").knowledge.length, 1);
  assert.equal(Knowledge.buildKnowledgeView(b.entries, "b").knowledge.length, 1);
  assert.notEqual(a.recordedIds[0], b.recordedIds[0]);
});

test("el módulo no inventa percepción espacial", () => {
  const result = Perception.registerPerceptions([], "player", [
    { id: "s1", content: "Algo ocurrió", observerIds: ["player"], locationId: "distant-room" }
  ]);
  assert.equal(result.entries[0].locationId, "distant-room");
  assert.equal(result.entries[0].source, "perceived");
});
