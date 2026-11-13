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

test("rechaza IDs de conocimiento excesivos y conserva la primera copia duplicada", () => {
  const oversized = "k".repeat(121);
  const normalized = Knowledge.normalizeKnowledge([
    { id: oversized, actorId: "npc", content: "ID inválido", type: "fact", source: "perceived" },
    { id: "same", actorId: "npc", content: "Primera versión", type: "fact", source: "perceived" },
    { id: "same", actorId: "npc", content: "Versión sobrescrita", type: "secret", source: "communicated" }
  ]);
  assert.equal(normalized.length, 1);
  assert.equal(normalized[0].content, "Primera versión");
  assert.equal(normalized[0].type, "fact");
});

test("no trunca IDs compuestos al comunicar conocimiento", () => {
  const sourceId = "k".repeat(110);
  const entries = [{
    id: sourceId, actorId: "speaker", content: "Información", type: "fact", source: "perceived"
  }];
  const result = Knowledge.communicateKnowledge(entries, "speaker", "listener", [sourceId], 2);
  assert.equal(result.applied, false);
  assert.equal(result.reason, "generated-id-too-long");
  assert.equal(result.entries.length, 1);
});

test("IDs de consulta excesivos no pueden acceder a conocimiento por prefijo", () => {
  const entries = [{
    id: "secret-id", actorId: "npc", content: "Secreto del NPC", type: "secret", source: "perceived"
  }];
  const oversizedActor = "npc" + "x".repeat(121);
  assert.deepEqual(Knowledge.buildKnowledgeView(entries, oversizedActor).knowledge, []);
  const transfer = Knowledge.communicateKnowledge(entries, "npc", "listener", ["secret-id" + "x".repeat(121)], 3);
  assert.equal(transfer.applied, false);
  assert.equal(transfer.reason, "invalid-transfer");
  const inference = Knowledge.recordInference(entries, "npc" + "x".repeat(121), {
    id: "guess", content: "No", evidenceIds: ["secret-id"]
  });
  assert.equal(inference.applied, false);
  assert.equal(inference.reason, "missing-owned-evidence");
});

test("rechaza ubicaciones y emisores excesivos para no convertir conocimiento local en global", () => {
  const oversized = "x".repeat(121);
  const normalized = Knowledge.normalizeKnowledge([
    {
      id: "bad-location", actorId: "npc", content: "Dato local", type: "fact", source: "perceived",
      locationId: oversized
    },
    {
      id: "bad-source", actorId: "npc", content: "Dato comunicado", type: "fact", source: "communicated",
      fromActorId: oversized
    },
    {
      id: "valid", actorId: "npc", content: "Dato válido", type: "fact", source: "perceived",
      evidenceIds: [oversized, "valid-evidence"]
    }
  ]);
  assert.deepEqual(normalized.map(item => item.id), ["valid"]);
  assert.deepEqual(normalized[0].evidenceIds, ["valid-evidence"]);
});


test("una inferencia rechaza evidencia inválida en vez de ignorarla", () => {
  const base = [{
    id: "e1", actorId: "player", content: "Huellas", type: "fact", source: "perceived"
  }];
  const result = Knowledge.recordInference(base, "player", {
    id: "i-invalid-evidence", content: "Deducción",
    evidenceIds: ["e1", "invalid-" + "x".repeat(121)]
  });
  assert.equal(result.applied, false);
  assert.equal(result.reason, "missing-owned-evidence");
  assert.equal(result.entries.length, 1);
});


test("no convierte localizaciones o emisores vacíos en conocimiento global", () => {
  const normalized = Knowledge.normalizeKnowledge([
    {
      id: "empty-location", actorId: "npc", content: "Dato local", type: "fact", source: "perceived",
      locationId: ""
    },
    {
      id: "empty-source", actorId: "npc", content: "Dato comunicado", type: "fact", source: "communicated",
      fromActorId: ""
    }
  ]);
  assert.deepEqual(normalized, []);
});
