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
      locationId: cleanText(entry.locationId, 120) || null
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
    normalizeKnowledge, recordKnowledge, buildKnowledgeView, buildSceneKnowledge,
    limits: Object.freeze({ maxEntries: MAX_ENTRIES })
  });
});
