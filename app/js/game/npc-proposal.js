/* Cosmopolis — validación y registro de propuestas de iniciativa NPC.
 * No genera texto ni ejecuta IA. Solo registra propuestas estructuradas y causales.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.CosmopolisNpcProposal = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const MAX_PROCESSED = 500;
  const MAX_EVENTS = 200;
  const TERMINAL_GOALS = new Set(["completed", "abandoned", "failed", "paused"]);

  const MAX_PAYLOAD_DEPTH = 3;
  const MAX_PAYLOAD_ITEMS = 20;
  const MAX_PAYLOAD_NODES = 100;
  const FORBIDDEN_KEYS = new Set(["__proto__", "prototype", "constructor"]);

  function copyPayload(value, depth = 0, seen = new WeakSet(), budget = { nodes: 0 }) {
    if (value === null || typeof value === "boolean") return { valid: true, value };
    if (typeof value === "string") return value.length <= 500 ? { valid: true, value } : { valid: false, value: null };
    if (typeof value === "number") return Number.isFinite(value) ? { valid: true, value } : { valid: false, value: null };
    if (typeof value !== "object" || depth >= MAX_PAYLOAD_DEPTH || seen.has(value)) return { valid: false, value: null };
    budget.nodes += 1;
    if (budget.nodes > MAX_PAYLOAD_NODES) return { valid: false, value: null };
    seen.add(value);
    if (Array.isArray(value)) {
      if (value.length > MAX_PAYLOAD_ITEMS) return { valid: false, value: null };
      const result = [];
      for (const item of value) {
        const copied = copyPayload(item, depth + 1, seen, budget);
        if (!copied.valid) return copied;
        result.push(copied.value);
      }
      return { valid: true, value: result };
    }
    const proto = Object.getPrototypeOf(value);
    if (proto !== Object.prototype && proto !== null) return { valid: false, value: null };
    const keys = Object.keys(value);
    if (keys.length > MAX_PAYLOAD_ITEMS) return { valid: false, value: null };
    const result = {};
    for (const key of keys) {
      if (!key || key.length > 64 || FORBIDDEN_KEYS.has(key)) return { valid: false, value: null };
      const copied = copyPayload(value[key], depth + 1, seen, budget);
      if (!copied.valid) return copied;
      Object.defineProperty(result, key, { value: copied.value, enumerable: true, configurable: true, writable: true });
    }
    return { valid: true, value: result };
  }


  function clean(value, max = 160) {
    return typeof value === "string" ? value.trim().slice(0, max) : "";
  }

  function isObject(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }

  function registerNpcProposal(world, proposal, options = {}) {
    const source = isObject(world) ? world : {};
    const clock = isObject(source.clock) ? source.clock : {};
    const tick = clock.tick;
    const events = Array.isArray(source.events) ? source.events.slice() : [];
    const processed = Array.isArray(source.processedNpcProposals)
      ? source.processedNpcProposals.filter(id => typeof id === "string" && id.trim()).slice(-MAX_PROCESSED)
      : [];
    const rejected = (reason) => ({
      applied: false, reason,
      world: { ...source, clock: { ...clock }, events, processedNpcProposals: processed }
    });

    if (!Number.isSafeInteger(tick) || tick < 0 || !isObject(proposal)) return rejected("invalid-world-or-proposal");
    const id = clean(proposal.id, 160);
    const actorId = clean(proposal.actorId, 120);
    const causeId = clean(proposal.causeId, 160);
    const type = clean(proposal.type, 80);
    const description = clean(proposal.description, 1200);
    if (!id || !actorId || !causeId || !type || !description ||
        !Number.isSafeInteger(proposal.tick) || proposal.tick !== tick) return rejected("invalid-proposal");

    const safePayload = proposal.payload === undefined ? { valid: true, value: {} } : copyPayload(proposal.payload);
    if (!safePayload.valid || !isObject(safePayload.value)) return rejected("invalid-payload");

    const proposalEventId = "npc-proposal:" + id;
    if (processed.includes(id) || events.some(event =>
      event && typeof event.id === "string" && event.id.trim() === proposalEventId
    )) {
      return rejected("duplicate-proposal");
    }
    if (events.length >= MAX_EVENTS) return rejected("event-capacity");

    const eligibleIds = new Set(
      Array.isArray(options.eligibleActorIds)
        ? options.eligibleActorIds.map(value => clean(value, 120)).filter(Boolean)
        : []
    );
    const actors = Array.isArray(options.actors) ? options.actors : [];
    const actor = actors.find(item => item && clean(item.id, 120) === actorId);
    if (!actor || !eligibleIds.has(actorId)) return rejected("actor-not-eligible");
    if (actor.isPlayer === true || actor.autonomous === false || actor.alive === false) {
      return rejected("actor-not-eligible");
    }
    const goalStatus = clean(actor.goalStatus, 40).toLowerCase();
    if (!clean(actor.personalGoal, 1000) || TERMINAL_GOALS.has(goalStatus)) {
      return rejected("actor-goal-inactive");
    }
    const knownByActor = options.knownCauseIdsByActor;
    const knownCauses = isObject(knownByActor) && Object.prototype.hasOwnProperty.call(knownByActor, actorId)
      && Array.isArray(knownByActor[actorId]) ? knownByActor[actorId].map(value => clean(value, 160)) : [];
    if (!knownCauses.includes(causeId)) return rejected("cause-not-known-by-actor");
    if (actor.locationId && proposal.locationId &&
        clean(actor.locationId, 120) !== clean(proposal.locationId, 120)) {
      return rejected("actor-location-mismatch");
    }

    const event = {
      id: proposalEventId,
      tick,
      type,
      description,
      actorId,
      causeId,
      locationId: clean(proposal.locationId, 120) || clean(actor.locationId, 120) || null,
      status: "pending",
      source: "npc-initiative",
      proposalId: id,
      payload: safePayload.value
    };
    const nextEvents = [...events, event].sort((a, b) => {
      const at = Number.isSafeInteger(a && a.tick) ? a.tick : 0;
      const bt = Number.isSafeInteger(b && b.tick) ? b.tick : 0;
      if (at !== bt) return at - bt;
      const ai = String(a && a.id || ""), bi = String(b && b.id || "");
      return ai < bi ? -1 : ai > bi ? 1 : 0;
    }).slice(-MAX_EVENTS);
    const nextProcessed = [...processed, id].slice(-MAX_PROCESSED);
    return {
      applied: true,
      reason: null,
      event,
      world: {
        ...source,
        clock: { ...clock },
        events: nextEvents,
        processedNpcProposals: nextProcessed
      }
    };
  }

  return Object.freeze({ registerNpcProposal, limits: Object.freeze({ maxProcessed: MAX_PROCESSED, maxEvents: MAX_EVENTS, maxPayloadDepth: MAX_PAYLOAD_DEPTH, maxPayloadItems: MAX_PAYLOAD_ITEMS, maxPayloadNodes: MAX_PAYLOAD_NODES }) });
});
