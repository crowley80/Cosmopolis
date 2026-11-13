const test = require("node:test");
const assert = require("node:assert/strict");
const Knowledge = require("../app/js/game/knowledge.js");

test("rechaza entradas incompletas y fuentes no autorizadas", () => {
  assert.deepEqual(Knowledge.normalizeKnowledge([
    { id: "x", actorId: "p", content: "secreto", type: "secret", source: "omniscient" }
  ]), []);
});

test("registra conocimiento solo para el actor indicado", () => {
  const result = Knowledge.recordKnowledge([], {
    id: "k1", actorId: "npc-a", content: "Vi entrar a Mara",
    type: "fact", source: "perceived", confidence: 1, tick: 2
  });
  assert.equal(result.applied, true);
  assert.equal(Knowledge.buildKnowledgeView(result.entries, "player").knowledge.length, 0);
  assert.equal(Knowledge.buildKnowledgeView(result.entries, "npc-a").knowledge.length, 1);
});

test("un secreto no aparece en la vista de otro actor", () => {
  const entries = [{
    id: "s1", actorId: "npc-a", content: "Oculta una llave",
    type: "secret", source: "perceived", confidence: 1
  }];
  assert.deepEqual(Knowledge.buildKnowledgeView(entries, "player").knowledge, []);
  assert.equal(Knowledge.buildKnowledgeView(entries, "npc-a").knowledge[0].status, "secret");
});

test("un rumor conserva su condición y confianza", () => {
  const entries = [{
    id: "r1", actorId: "player", content: "Dicen que el puente está cerrado",
    type: "rumor", source: "communicated", confidence: 0.35, fromActorId: "guard"
  }];
  const item = Knowledge.buildKnowledgeView(entries, "player").knowledge[0];
  assert.equal(item.status, "rumor");
  assert.equal(item.confidence, 0.35);
  assert.equal(item.source, "communicated");
});

test("las inferencias quedan etiquetadas como inferencias", () => {
  const entries = [{
    id: "b1", actorId: "player", content: "Quizá alguien pasó por aquí",
    type: "belief", source: "inferred", confidence: 0.4
  }];
  assert.equal(Knowledge.buildKnowledgeView(entries, "player").knowledge[0].source, "inferred");
});

test("los reintentos con el mismo ID no duplican conocimiento", () => {
  const entry = {
    id: "same", actorId: "player", content: "Escuchó un golpe",
    type: "fact", source: "perceived"
  };
  const first = Knowledge.recordKnowledge([], entry);
  const second = Knowledge.recordKnowledge(first.entries, entry);
  assert.equal(first.applied, true);
  assert.equal(second.applied, false);
  assert.equal(second.reason, "duplicate-id");
  assert.equal(second.entries.length, 1);
});

test("la vista de escena filtra por localización sin añadir datos canónicos", () => {
  const entries = [
    { id: "a", actorId: "player", content: "Una puerta abierta", type: "fact", source: "perceived", locationId: "hall" },
    { id: "b", actorId: "player", content: "Un ruido lejano", type: "fact", source: "perceived", locationId: "cellar" }
  ];
  const view = Knowledge.buildSceneKnowledge(entries, "player", "hall");
  assert.equal(view.knowledge.length, 1);
  assert.equal(view.knowledge[0].id, "a");
  assert.equal(Object.hasOwn(view, "world"), false);
});

test("normalización limita confianza y conserva el tick válido", () => {
  const [item] = Knowledge.normalizeKnowledge([{
    id: "c", actorId: "player", content: "Dato", type: "fact",
    source: "perceived", confidence: 5, tick: 7
  }]);
  assert.equal(item.confidence, 1);
  assert.equal(item.tick, 7);
});
