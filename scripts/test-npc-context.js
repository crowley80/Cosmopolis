const test = require("node:test");
const assert = require("node:assert/strict");
const Knowledge = require("../app/js/game/knowledge.js");
globalThis.CosmopolisKnowledge = Knowledge;
const NpcContext = require("../app/js/game/npc-context.js");

const actor = {
  id: "npc-1", name: "Mara", role: "Archivist",
  description: "Custodia los documentos del puerto",
  personalityTraits: ["cauta", "observadora"],
  personalGoal: "Encontrar el libro perdido",
  goalStatus: "active", currentTask: "Revisar el inventario",
  locationId: "archive",
  secret: "Su hermano falsificó el registro",
  privateThoughts: ["No confía en el capitán"],
  worldState: { allSecrets: true }
};

test("construye contexto solo con campos permitidos del propio NPC", () => {
  const result = NpcContext.buildNpcContext(actor, {
    locationId: "archive", description: "La sala está en silencio"
  }, []);
  assert.equal(result.valid, true);
  assert.equal(result.context.actor.name, "Mara");
  assert.equal(result.context.actor.personalGoal, "Encontrar el libro perdido");
  assert.equal("secret" in result.context.actor, false);
  assert.equal("privateThoughts" in result.context.actor, false);
  assert.equal("worldState" in result.context.actor, false);
});

test("rechaza escena de otra localización", () => {
  const result = NpcContext.buildNpcContext(actor, {
    locationId: "dungeon", description: "Una celda"
  }, []);
  assert.equal(result.valid, false);
  assert.equal(result.reason, "scene-mismatch");
});

test("solo incluye conocimiento propio y filtrado por localización", () => {
  const entries = [
    { id: "k1", actorId: "npc-1", content: "La puerta está cerrada", type: "fact", source: "perceived", locationId: "archive" },
    { id: "k2", actorId: "npc-1", content: "Hay una llave en el patio", type: "rumor", source: "communicated", locationId: "yard" },
    { id: "k3", actorId: "other", content: "El capitán está herido", type: "fact", source: "perceived", locationId: "archive" }
  ];
  const result = NpcContext.buildNpcContext(actor, { locationId: "archive", description: "Archivo" }, entries);
  assert.deepEqual(result.context.knowledge.map(item => item.id), ["k1"]);
});

test("no incorpora personajes cercanos ni datos arbitrarios de escena", () => {
  const scene = {
    locationId: "archive",
    description: "Una mesa y varios libros",
    nearbyCharacters: [{ id: "other", secret: "hidden" }],
    fullWorld: { secret: "omniscient" }
  };
  const result = NpcContext.buildNpcContext(actor, scene, []);
  assert.equal("nearbyCharacters" in result.context.scene, false);
  assert.equal("fullWorld" in result.context.scene, false);
});

test("normaliza listas de personalidad y elimina duplicados", () => {
  const result = NpcContext.buildNpcContext({
    ...actor, personalityTraits: ["cauta", "cauta", "", "observadora"]
  }, { locationId: "archive", description: "" }, []);
  assert.deepEqual(result.context.actor.personality, ["cauta", "observadora"]);
});

test("rechaza actores sin identidad", () => {
  const result = NpcContext.buildNpcContext({ name: "Sin ID" }, { locationId: "archive" }, []);
  assert.equal(result.valid, false);
  assert.equal(result.reason, "invalid-actor");
});

test("no comparte conocimiento de otra localización", () => {
  const entries = [
    { id: "k1", actorId: "npc-1", content: "Un rumor lejano", type: "rumor", source: "communicated", locationId: "harbor" }
  ];
  const result = NpcContext.buildNpcContext(actor, { locationId: "archive", description: "Archivo" }, entries);
  assert.equal(result.context.knowledge.length, 0);
});

test("no muta los datos originales del NPC", () => {
  const before = JSON.stringify(actor);
  NpcContext.buildNpcContext(actor, { locationId: "archive", description: "Archivo" }, []);
  assert.equal(JSON.stringify(actor), before);
});

test("requiere el módulo de conocimiento en el entorno", () => {
  const previous = globalThis.CosmopolisKnowledge;
  try {
    delete globalThis.CosmopolisKnowledge;
    const result = NpcContext.buildNpcContext(actor, { locationId: "archive" }, []);
    assert.equal(result.valid, false);
    assert.equal(result.reason, "knowledge-module-unavailable");
  } finally {
    globalThis.CosmopolisKnowledge = previous;
  }
});

test("recorta campos de texto largos", () => {
  const result = NpcContext.buildNpcContext({
    ...actor, description: "x".repeat(5000), personalGoal: "y".repeat(2000)
  }, { locationId: "archive", description: "z".repeat(5000) }, []);
  assert.equal(result.context.actor.description.length, 1200);
  assert.equal(result.context.actor.personalGoal.length, 1000);
  assert.equal(result.context.scene.description.length, 1600);
});
