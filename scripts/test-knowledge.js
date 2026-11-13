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

test("comunicar transmite solo los conocimientos seleccionados", () => {
  const initial = [
    { id: "public", actorId: "speaker", content: "La puerta está abierta", type: "fact", source: "perceived" },
    { id: "private", actorId: "speaker", content: "Tiene una llave", type: "secret", source: "perceived" }
  ];
  const result = Knowledge.communicateKnowledge(initial, "speaker", "listener", ["public"], 9);
  const received = Knowledge.buildKnowledgeView(result.entries, "listener").knowledge;
  assert.equal(received.length, 1);
  assert.equal(received[0].content, "La puerta está abierta");
  assert.equal(received[0].source, "communicated");
  assert.equal(received[0].fromActorId, "speaker");
  assert.equal(Knowledge.buildKnowledgeView(result.entries, "speaker").knowledge.length, 2);
});

test("un rumor comunicado sigue siendo rumor", () => {
  const initial = [{
    id: "rum", actorId: "speaker", content: "El duque ha huido",
    type: "rumor", source: "communicated", confidence: 0.2
  }];
  const result = Knowledge.communicateKnowledge(initial, "speaker", "listener", ["rum"], 4);
  const received = Knowledge.buildKnowledgeView(result.entries, "listener").knowledge[0];
  assert.equal(received.status, "rumor");
  assert.equal(received.confidence, 0.2);
});

test("no se puede comunicar información que el emisor no conoce", () => {
  const result = Knowledge.communicateKnowledge([], "speaker", "listener", ["unknown"], 1);
  assert.equal(result.applied, false);
  assert.equal(result.reason, "no-authorized-knowledge");
});

test("una inferencia exige evidencia que el actor ya conoce", () => {
  const base = [{
    id: "e1", actorId: "player", content: "Huellas en el barro",
    type: "fact", source: "perceived"
  }];
  const rejected = Knowledge.recordInference(base, "player", {
    id: "i1", content: "Alguien salió por el patio", evidenceIds: ["missing"]
  });
  assert.equal(rejected.applied, false);
  const accepted = Knowledge.recordInference(base, "player", {
    id: "i2", content: "Quizá alguien salió por el patio",
    evidenceIds: ["e1"], confidence: 0.45, tick: 3
  });
  assert.equal(accepted.applied, true);
  const inference = Knowledge.buildKnowledgeView(accepted.entries, "player").knowledge
    .find(item => item.id === "i2");
  assert.equal(inference.source, "inferred");
  assert.deepEqual(inference.evidenceIds, ["e1"]);
});
