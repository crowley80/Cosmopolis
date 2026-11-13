/* Cosmopolis — registro de percepciones explícitas.
 * No calcula visión, distancia ni audición: recibe observaciones ya validadas
 * por el motor espacial. Si el actor no figura como observador autorizado,
 * el estímulo no entra en su memoria.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.CosmopolisPerception = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const CHANNELS = new Set(["sight", "hearing", "smell", "touch", "other"]);
  const MAX_OBSERVATIONS = 100;

  function clean(value, max) {
    return typeof value === "string" ? value.trim().slice(0, max) : "";
  }

  function registerPerceptions(entries, observerId, observations) {
    const actorId = clean(observerId, 120);
    const current = Array.isArray(entries) ? entries : [];
    if (!actorId || !Array.isArray(observations)) {
      return { entries: current, recordedIds: [], rejected: observations?.length || 0 };
    }

    const recordedIds = [];
    let next = current;
    let rejected = 0;
    for (const observation of observations.slice(0, MAX_OBSERVATIONS)) {
      const id = clean(observation && observation.id, 120);
      const content = clean(observation && observation.content, 2000);
      const authorized = observation && Array.isArray(observation.observerIds)
        && observation.observerIds.includes(actorId);
      if (!id || !content || !authorized) {
        rejected++;
        continue;
      }
      const channel = CHANNELS.has(observation.channel) ? observation.channel : "other";
      const knowledgeId = "perception:" + id + ":" + actorId;
      const result = globalThis.CosmopolisKnowledge.recordKnowledge(next, {
        id: knowledgeId,
        actorId,
        content,
        type: observation.type === "rumor" ? "rumor" : "fact",
        source: "perceived",
        confidence: 1,
        tick: Number.isInteger(observation.tick) && observation.tick >= 0 ? observation.tick : 0,
        locationId: clean(observation.locationId, 120) || null,
        fromActorId: null,
        evidenceIds: [],
        channel
      });
      next = result.entries;
      if (result.applied) recordedIds.push(knowledgeId);
      else if (result.reason !== "duplicate-id") rejected++;
    }
    return { entries: next, recordedIds, rejected };
  }

  return Object.freeze({
    registerPerceptions,
    limits: Object.freeze({ maxObservations: MAX_OBSERVATIONS })
  });
});
