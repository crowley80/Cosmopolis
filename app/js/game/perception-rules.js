/* Cosmopolis — reglas explícitas de elegibilidad perceptiva.
 * Módulo puro: no calcula geometría, distancia, obstáculos ni propagación.
 * Solo aplica datos declarados por el motor de escena.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.CosmopolisPerceptionRules = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const CHANNELS = new Set(["sight", "hearing", "smell", "touch", "other"]);
  const ALLOWLIST = Object.freeze({
    sight: "visibleTo",
    hearing: "audibleTo",
    smell: "smellableTo",
    touch: "reachableBy",
    other: "availableTo"
  });
  const MAX_ACTORS = 500;
  const MAX_STIMULI = 200;

  function cleanId(value) {
    if (typeof value !== "string") return "";
    const id = value.trim();
    return id && id.length <= 120 ? id : "";
  }

  function hasId(list, id) {
    return Array.isArray(list) && list.some(value => cleanId(value) === id);
  }

  function canPerceive(actor, stimulus) {
    const actorId = cleanId(actor && actor.id);
    const locationId = cleanId(actor && actor.locationId);
    const stimulusLocation = cleanId(stimulus && stimulus.locationId);
    const channel = stimulus && stimulus.channel;
    if (!actorId || !locationId || !stimulusLocation || locationId !== stimulusLocation) return false;
    if (!CHANNELS.has(channel)) return false;
    if (!actor.senses || actor.senses[channel] !== true) return false;
    if (hasId(stimulus.concealedFrom, actorId) || hasId(stimulus.blockedFor, actorId)) return false;

    const allowlistField = ALLOWLIST[channel];
    if (Array.isArray(stimulus[allowlistField]) && !hasId(stimulus[allowlistField], actorId)) return false;

    if (stimulus.requiresAttention === true) {
      const attentive = Array.isArray(stimulus.attentiveActorIds)
        ? hasId(stimulus.attentiveActorIds, actorId)
        : actor.attention === true;
      if (!attentive) return false;
    }
    return true;
  }

  function resolveObservers(actors, stimulus) {
    if (!Array.isArray(actors) || !stimulus || typeof stimulus !== "object") return [];
    const seen = new Set();
    const result = [];
    for (const actor of actors.slice(0, MAX_ACTORS)) {
      const id = cleanId(actor && actor.id);
      if (!id || seen.has(id)) continue;
      seen.add(id);
      if (canPerceive(actor, stimulus)) result.push(id);
    }
    return result;
  }

  function resolveAll(actors, stimuli) {
    if (!Array.isArray(stimuli)) return [];
    return stimuli.slice(0, MAX_STIMULI).map(stimulus => ({
      ...stimulus,
      observerIds: resolveObservers(actors, stimulus)
    }));
  }

  return Object.freeze({
    canPerceive,
    resolveObservers,
    resolveAll,
    limits: Object.freeze({ maxActors: MAX_ACTORS, maxStimuli: MAX_STIMULI })
  });
});
