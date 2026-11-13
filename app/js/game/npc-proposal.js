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

    const proposalEventId = "npc-proposal:" + id;
    if (processed.includes(id) || events.some(event => event && event.id === proposalEventId)) {
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
      payload: isObject(proposal.payload) ? { ...proposal.payload } : {}
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

  return Object.freeze({ registerNpcProposal, limits: Object.freeze({ maxProcessed: MAX_PROCESSED, maxEvents: MAX_EVENTS }) });
});
