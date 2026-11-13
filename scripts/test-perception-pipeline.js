const test = require("node:test");
const assert = require("node:assert/strict");
const Knowledge = require("../app/js/game/knowledge.js");
globalThis.CosmopolisKnowledge = Knowledge;
const Rules = require("../app/js/game/perception-rules.js");
const Perception = require("../app/js/game/perception.js");

function recordScene(actors, stimuli) {
  const resolved = Rules.resolveAll(actors, stimuli);
  let entries = [];
  for (const actor of actors) {
    const result = Perception.registerPerceptions(entries, actor.id, resolved);
    entries = result.entries;
  }
  return { resolved, entries };
}

test("el flujo completo solo memoriza estímulos para observadores elegibles", () => {
  const actors = [
    { id: "player", locationId: "hall", senses: { sight: true } },
    { id: "npc", locationId: "hall", senses: { sight: false } }
  ];
  const result = recordScene(actors, [
    { id: "seal", content: "Un sello rojo sobre la mesa", locationId: "hall", channel: "sight" }
  ]);
  assert.deepEqual(result.resolved[0].observerIds, ["player"]);
  assert.equal(Knowledge.buildKnowledgeView(result.entries, "player").knowledge.length, 1);
  assert.equal(Knowledge.buildKnowledgeView(result.entries, "npc").knowledge.length, 0);
});

test("una lista de visibilidad puede impedir que un actor presente vea un estímulo", () => {
  const actors = [
    { id: "a", locationId: "room", senses: { sight: true } },
    { id: "b", locationId: "room", senses: { sight: true } }
  ];
  const result = recordScene(actors, [
    { id: "note", content: "Una nota oculta tras un libro", locationId: "room", channel: "sight", visibleTo: ["a"] }
  ]);
  assert.deepEqual(result.resolved[0].observerIds, ["a"]);
  assert.equal(Knowledge.buildKnowledgeView(result.entries, "b").knowledge.length, 0);
});

test("un sonido y un estímulo visual producen memorias independientes por canal", () => {
  const actors = [
    { id: "a", locationId: "street", senses: { sight: true, hearing: false } },
    { id: "b", locationId: "street", senses: { sight: false, hearing: true } }
  ];
  const result = recordScene(actors, [
    { id: "light", content: "Un destello", locationId: "street", channel: "sight" },
    { id: "bell", content: "Una campana", locationId: "street", channel: "hearing" }
  ]);
  assert.deepEqual(result.resolved.map(item => item.observerIds), [["a"], ["b"]]);
  assert.deepEqual(Knowledge.buildKnowledgeView(result.entries, "a").knowledge.map(item => item.channel), ["sight"]);
  assert.deepEqual(Knowledge.buildKnowledgeView(result.entries, "b").knowledge.map(item => item.channel), ["hearing"]);
});
