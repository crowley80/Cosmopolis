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

  function cleanText(value, max) {
    return typeof value === "string" ? value.trim().slice(0, max) : "";
  }
  function cleanId(value) {
    if (typeof value !== "string") return "";
    const id = value.trim();
    return id && id.length <= 120 ? id : "";
  }

  function registerPerceptions(entries, observerId, observations) {
    const actorId = cleanId(observerId);
    const current = Array.isArray(entries) ? entries : [];
    if (!actorId || !Array.isArray(observations)) {
      return { entries: current, recordedIds: [], rejected: observations?.length || 0 };
    }

    const recordedIds = [];
    let next = current;
    let rejected = 0;
    for (const observation of observations.slice(0, MAX_OBSERVATIONS)) {
      const id = cleanId(observation && observation.id);
      const content = cleanText(observation && observation.content, 2000);
      const authorized = observation && Array.isArray(observation.observerIds)
        && observation.observerIds.includes(actorId);
      const locationId = observation && observation.locationId == null
        ? "" : cleanId(observation && observation.locationId);
      const knowledgeId = "perception:" + id + ":" + actorId;
      if (!id || !content || !authorized ||
          (observation && observation.locationId != null && !locationId) ||
          knowledgeId.length > 120) {
        rejected++;
        continue;
      }
      const channel = CHANNELS.has(observation.channel) ? observation.channel : "other";
      const result = globalThis.CosmopolisKnowledge.recordKnowledge(next, {
        id: knowledgeId,
        actorId,
        content,
        type: ["fact", "rumor", "belief", "secret"].includes(observation.type) ? observation.type : "fact",
        source: "perceived",
        confidence: 1,
        tick: Number.isInteger(observation.tick) && observation.tick >= 0 ? observation.tick : 0,
        locationId: locationId || null,
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
