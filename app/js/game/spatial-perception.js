/* Cosmopolis — geometría local para percepción espacial.
 * Capa pura sobre perception-rules: añade distancia euclídea opcional.
 * No inventa posiciones, rutas ni obstáculos; solo usa coordenadas explícitas.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.CosmopolisSpatialPerception = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const MAX_COORDINATE = 1000000;
  const MAX_RANGE = 1000000;
  const MAX_ACTORS = 500;
  const MAX_STIMULI = 200;

  function validPoint(point) {
    return point !== null && typeof point === "object" &&
      Number.isFinite(point.x) && Number.isFinite(point.y) &&
      Math.abs(point.x) <= MAX_COORDINATE && Math.abs(point.y) <= MAX_COORDINATE;
  }

  function distanceBetween(a, b) {
    if (!validPoint(a) || !validPoint(b)) return null;
    const distance = Math.hypot(a.x - b.x, a.y - b.y);
    return Number.isFinite(distance) ? distance : null;
  }

  function withinRange(actor, stimulus) {
    if (stimulus.range === undefined || stimulus.range === null) return true;
    if (!Number.isFinite(stimulus.range) || stimulus.range < 0 || stimulus.range > MAX_RANGE) return false;
    const distance = distanceBetween(actor.position, stimulus.position);
    return distance !== null && distance <= stimulus.range;
  }

  function canPerceive(actor, stimulus, rules) {
    if (!rules || typeof rules.canPerceive !== "function") return false;
    return rules.canPerceive(actor, stimulus) && withinRange(actor, stimulus);
  }

  function resolveObservers(actors, stimulus, rules) {
    if (!Array.isArray(actors) || !stimulus || typeof stimulus !== "object" ||
        !rules || typeof rules.canPerceive !== "function") return [];
    const seen = new Set();
    const result = [];
    for (const actor of actors.slice(0, MAX_ACTORS)) {
      const id = typeof (actor && actor.id) === "string" ? actor.id.trim() : "";
      if (!id || id.length > 120 || seen.has(id)) continue;
      seen.add(id);
      if (canPerceive(actor, stimulus, rules)) result.push(id);
    }
    return result;
  }

  function resolveAll(actors, stimuli, rules) {
    if (!Array.isArray(stimuli)) return [];
    return stimuli.slice(0, MAX_STIMULI).map(stimulus => ({
      ...stimulus,
      observerIds: resolveObservers(actors, stimulus, rules)
    }));
  }

  return Object.freeze({
    distanceBetween,
    canPerceive,
    resolveObservers,
    resolveAll,
    limits: Object.freeze({ maxCoordinate: MAX_COORDINATE, maxRange: MAX_RANGE, maxActors: MAX_ACTORS, maxStimuli: MAX_STIMULI })
  });
});
