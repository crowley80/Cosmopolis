/* Cosmopolis — transiciones seguras del ciclo de vida de eventos.
 * Marca resultados estructurados; no ejecuta efectos sobre el mundo ni genera narración.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.CosmopolisWorldEventResolution = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const MAX_OPERATIONS = 500;
  const TERMINAL = new Set(["applied", "cancelled", "failed"]);

  function clean(value, max = 160) {
    return typeof value === "string" ? value.trim().slice(0, max) : "";
  }
  function object(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }
  function ids(value) {
    return Array.isArray(value)
      ? Array.from(new Set(value.filter(item =>
          typeof item === "string" && item.trim() && item.trim().length <= 160
        ).map(item => item.trim()))).slice(0, 50)
      : [];
  }

  function resolveEvent(world, eventId, operationId, resolution) {
    const source = object(world) ? world : {};
    const clock = object(source.clock) ? source.clock : {};
    const tick = clock.tick;
    const events = Array.isArray(source.events) ? source.events.slice() : [];
    const operations = Array.isArray(source.processedEventResolutions)
      ? Array.from(new Set(source.processedEventResolutions.filter(id =>
          typeof id === "string" && id.trim() && id.trim().length <= 160
        ).map(id => id.trim()))).slice(-MAX_OPERATIONS)
      : [];
    const rejected = reason => ({
      applied: false, reason,
      world: { ...source, clock: { ...clock }, events, processedEventResolutions: operations }
    });

    const rawTargetId = typeof eventId === "string" ? eventId.trim() : "";
    const rawOpId = typeof operationId === "string" ? operationId.trim() : "";
    const targetId = clean(rawTargetId, 160);
    const opId = clean(rawOpId, 160);
    if (!Number.isSafeInteger(tick) || tick < 0 || !targetId || rawTargetId.length > 160 ||
        !opId || rawOpId.length > 160 || !object(resolution)) {
      return rejected("invalid-input");
    }
    if (operations.includes(opId)) return rejected("duplicate-operation");

    const index = events.findIndex(event =>
      event && typeof event.id === "string" && event.id.trim() === targetId
    );
    if (index < 0) return rejected("event-not-found");
    const current = events[index];
    if (current.status !== "pending") return rejected("event-not-pending");

    const outcome = clean(resolution.outcome, 20).toLowerCase();
    if (!TERMINAL.has(outcome)) return rejected("invalid-outcome");
    const summary = clean(resolution.summary, 1200);
    if (!summary) return rejected("missing-summary");
    if (resolution.effectIds !== undefined &&
        (!Array.isArray(resolution.effectIds) || resolution.effectIds.some(id =>
          typeof id !== "string" || !id.trim() || id.trim().length > 160
        ))) return rejected("invalid-effect-reference");
    const effectIds = ids(resolution.effectIds);
    if (outcome === "applied" && !effectIds.length) return rejected("missing-effect-reference");
    if (outcome === "applied") {
      const registered = new Set(ids(current.appliedEffectIds));
      if (effectIds.some(id => !registered.has(id))) return rejected("unregistered-effect-reference");
      if (effectIds.length !== registered.size) return rejected("incomplete-effect-references");
    }

    const updated = {
      ...current,
      id: targetId,
      status: outcome,
      resolution: {
        operationId: opId,
        tick,
        outcome,
        summary,
        effectIds
      }
    };
    const nextEvents = events.slice();
    nextEvents[index] = updated;
    const nextOperations = [...operations, opId].slice(-MAX_OPERATIONS);
    return {
      applied: true,
      reason: null,
      event: updated,
      world: {
        ...source,
        clock: { ...clock },
        events: nextEvents,
        processedEventResolutions: nextOperations
      }
    };
  }

  return Object.freeze({
    resolveEvent,
    limits: Object.freeze({ maxOperations: MAX_OPERATIONS })
  });
});
