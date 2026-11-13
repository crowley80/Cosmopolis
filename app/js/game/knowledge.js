/* Cosmopolis — vistas de conocimiento (módulo puro y aislado).
 * No consulta el estado canónico completo ni decide qué es verdad.
 * El motor debe entregar explícitamente los conocimientos autorizados de cada actor.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.CosmopolisKnowledge = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const TYPES = new Set(["fact", "rumor", "belief", "secret"]);
  const SOURCES = new Set(["perceived", "communicated", "inferred"]);
  const MAX_ENTRIES = 500;

  function cleanText(value, max) {
    return typeof value === "string" ? value.trim().slice(0, max) : "";
  }

  function normalizeEntry(entry) {
    if (!entry || typeof entry !== "object") return null;
    const id = cleanText(entry.id, 120);
    const content = cleanText(entry.content, 2000);
    const source = SOURCES.has(entry.source) ? entry.source : "";
    const type = TYPES.has(entry.type) ? entry.type : "";
    const actorId = cleanText(entry.actorId, 120);
    if (!id || !content || !source || !type || !actorId) return null;
    const confidence = Number.isFinite(entry.confidence)
      ? Math.max(0, Math.min(1, entry.confidence))
      : (source === "perceived" ? 1 : 0.5);
    return {
      id, actorId, content, type, source, confidence,
      tick: Number.isInteger(entry.tick) && entry.tick >= 0 ? entry.tick : 0,
      fromActorId: cleanText(entry.fromActorId, 120) || null,
      locationId: cleanText(entry.locationId, 120) || null,
      evidenceIds: Array.isArray(entry.evidenceIds)
        ? Array.from(new Set(entry.evidenceIds.map(id => cleanText(id, 120)).filter(Boolean))).slice(0, 20)
        : []
    };
  }

  function normalizeKnowledge(entries) {
    if (!Array.isArray(entries)) return [];
    const byId = new Map();
    for (const raw of entries) {
      const entry = normalizeEntry(raw);
      if (entry) byId.set(entry.id, entry);
    }
    return Array.from(byId.values()).slice(-MAX_ENTRIES);
  }

  function recordKnowledge(entries, rawEntry) {
    const current = normalizeKnowledge(entries);
    const next = normalizeEntry(rawEntry);
    if (!next) return { applied: false, reason: "invalid-entry", entries: current };
    if (current.some(item => item.id === next.id)) {
      return { applied: false, reason: "duplicate-id", entries: current };
    }
    return { applied: true, reason: null, entries: [...current, next].slice(-MAX_ENTRIES) };
  }

  // Construye una vista mínima para UN actor. No acepta ni serializa el estado del mundo.
  function buildKnowledgeView(entries, actorId) {
    const id = cleanText(actorId, 120);
    if (!id) return { actorId: "", knowledge: [] };
    const knowledge = normalizeKnowledge(entries)
      .filter(entry => entry.actorId === id)
      .map(entry => ({
        id: entry.id, content: entry.content, status: entry.type,
        source: entry.source, confidence: entry.confidence, tick: entry.tick,
        fromActorId: entry.fromActorId, locationId: entry.locationId
      }));
    return { actorId: id, knowledge };
  }

  // Comunicación explícita: solo transmite IDs elegidos que el emisor conoce.
  // No copia el resto de su memoria ni convierte rumores en hechos.
  function communicateKnowledge(entries, fromActorId, toActorId, knowledgeIds, tick) {
    const from = cleanText(fromActorId, 120);
    const to = cleanText(toActorId, 120);
    const ids = Array.isArray(knowledgeIds)
      ? Array.from(new Set(knowledgeIds.map(id => cleanText(id, 120)).filter(Boolean)))
      : [];
    const current = normalizeKnowledge(entries);
    if (!from || !to || from === to || !ids.length) {
      return { applied: false, reason: "invalid-transfer", entries: current, transferredIds: [] };
    }
    const owned = new Map(current.filter(item => item.actorId === from).map(item => [item.id, item]));
    const selected = ids.map(id => owned.get(id)).filter(Boolean);
    if (!selected.length) {
      return { applied: false, reason: "no-authorized-knowledge", entries: current, transferredIds: [] };
    }
    let nextEntries = current;
    const transferredIds = [];
    for (const item of selected) {
      const newId = "comm:" + item.id + ":" + to + ":" +
        (Number.isInteger(tick) && tick >= 0 ? tick : 0);
      const result = recordKnowledge(nextEntries, {
        ...item,
        id: newId,
        actorId: to,
        source: "communicated",
        fromActorId: from,
        tick: Number.isInteger(tick) && tick >= 0 ? tick : 0,
        evidenceIds: item.evidenceIds
      });
      nextEntries = result.entries;
      if (result.applied) transferredIds.push(newId);
    }
    return {
      applied: transferredIds.length > 0,
      reason: transferredIds.length ? null : "already-transferred",
      entries: nextEntries,
      transferredIds
    };
  }

  // Una inferencia requiere evidencia que ya pertenezca al actor.
  // La función etiqueta la deducción, pero no pretende demostrar que sea cierta.
  function recordInference(entries, actorId, inference) {
    const actor = cleanText(actorId, 120);
    const current = normalizeKnowledge(entries);
    const evidenceIds = inference && Array.isArray(inference.evidenceIds)
      ? Array.from(new Set(inference.evidenceIds.map(id => cleanText(id, 120)).filter(Boolean)))
      : [];
    const ownedIds = new Set(current.filter(item => item.actorId === actor).map(item => item.id));
    if (!actor || !evidenceIds.length || evidenceIds.some(id => !ownedIds.has(id))) {
      return { applied: false, reason: "missing-owned-evidence", entries: current };
    }
    return recordKnowledge(current, {
      ...inference,
      actorId: actor,
      type: "belief",
      source: "inferred",
      evidenceIds
    });
  }

  // Solo conocimiento del actor y de la localización actual; los datos canónicos
  // nunca se pasan a esta función ni se incorporan implícitamente.
  function buildSceneKnowledge(entries, actorId, locationId) {
    const view = buildKnowledgeView(entries, actorId);
    const location = cleanText(locationId, 120);
    return {
      actorId: view.actorId,
      locationId: location || null,
      knowledge: view.knowledge.filter(item =>
        item.locationId === null || item.locationId === location
      )
    };
  }

  return Object.freeze({
    normalizeKnowledge, recordKnowledge, communicateKnowledge, recordInference, buildKnowledgeView, buildSceneKnowledge,
    limits: Object.freeze({ maxEntries: MAX_ENTRIES })
  });
});
