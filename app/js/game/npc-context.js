/* Cosmopolis — contexto mínimo y aislado para un NPC.
 * Construye una vista por allowlist; nunca serializa el objeto de personaje
 * ni recibe el estado canónico completo del mundo.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.CosmopolisNpcContext = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  function clean(value, max = 1000) {
    return typeof value === "string" ? value.trim().slice(0, max) : "";
  }

  function cleanId(value) {
    if (typeof value !== "string") return "";
    const id = value.trim();
    return id && id.length <= 120 ? id : "";
  }

  function cleanList(values, maxItems = 12) {
    if (!Array.isArray(values)) return [];
    return Array.from(new Set(values.map(value => clean(value, 160)).filter(Boolean))).slice(0, maxItems);
  }

  function buildNpcContext(actor, sceneView, knowledgeEntries) {
    const actorId = actor && typeof actor === "object" ? cleanId(actor.id) : "";
    const actorLocationId = actor && typeof actor === "object" ? cleanId(actor.locationId) : "";
    const sceneLocationId = sceneView && typeof sceneView === "object" ? cleanId(sceneView.locationId) : "";
    if (!actorId || !actorLocationId) {
      return { valid: false, reason: "invalid-actor", context: null };
    }
    if (!sceneView || typeof sceneView !== "object" || !sceneLocationId ||
        sceneLocationId !== actorLocationId) {
      return { valid: false, reason: "scene-mismatch", context: null };
    }
    const knowledgeApi = typeof globalThis !== "undefined" ? globalThis.CosmopolisKnowledge : null;
    if (!knowledgeApi || typeof knowledgeApi.buildSceneKnowledge !== "function") {
      return { valid: false, reason: "knowledge-module-unavailable", context: null };
    }

    const knowledge = knowledgeApi.buildSceneKnowledge(knowledgeEntries, actorId, sceneLocationId);
    return {
      valid: true,
      reason: null,
      context: {
        actor: {
          id: actorId,
          name: clean(actor.name, 120),
          role: clean(actor.role, 120),
          description: clean(actor.description, 1200),
          personality: cleanList(actor.personalityTraits),
          personalGoal: clean(actor.personalGoal, 1000),
          goalStatus: clean(actor.goalStatus, 40),
          currentTask: clean(actor.currentTask, 500),
          locationId: actorLocationId
        },
        scene: {
          locationId: sceneLocationId,
          description: clean(sceneView.description, 1600)
        },
        knowledge: knowledge.knowledge
      }
    };
  }

  return Object.freeze({ buildNpcContext });
});
