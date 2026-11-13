/* Cosmopolis — selección acotada y determinista de iniciativas NPC.
 * No redacta acciones ni invoca IA: decide qué actores pueden proponer iniciativa.
 * El motor debe proporcionar explícitamente el conjunto de actores habilitados.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.CosmopolisNpcInitiative = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const MAX_ACTORS = 500;
  const MAX_PER_TICK = 5;

  function clean(value, max = 120) {
    return typeof value === "string" ? value.trim().slice(0, max) : "";
  }

  function isEligible(actor, tick, allowedIds) {
    const id = clean(actor && actor.id);
    if (!id || !allowedIds.has(id)) return false;
    if (actor.isPlayer === true || actor.autonomous === false || actor.alive === false) return false;
    if (!clean(actor.personalGoal, 1000)) return false;
    const goalStatus = clean(actor.goalStatus, 40).toLowerCase();
    if (["completed", "abandoned", "failed", "paused"].includes(goalStatus)) return false;
    const nextTick = Number.isSafeInteger(actor.nextInitiativeTick) ? actor.nextInitiativeTick : 0;
    if (nextTick > tick) return false;
    return true;
  }

  function selectInitiatives(actors, tick, options = {}) {
    if (!Array.isArray(actors) || !Number.isSafeInteger(tick) || tick < 0) {
      return { selected: [], nextCursorId: null, rejected: true };
    }
    const eligibleIds = new Set(
      Array.isArray(options.eligibleActorIds)
        ? options.eligibleActorIds.map(id => clean(id)).filter(Boolean)
        : []
    );
    const unique = new Map();
    for (const actor of actors.slice(0, MAX_ACTORS)) {
      const id = clean(actor && actor.id);
      if (id && !unique.has(id)) unique.set(id, actor);
    }
    const candidates = Array.from(unique.values())
      .filter(actor => isEligible(actor, tick, eligibleIds))
      .sort((a, b) => {
        const aTick = Number.isSafeInteger(a.nextInitiativeTick) ? a.nextInitiativeTick : 0;
        const bTick = Number.isSafeInteger(b.nextInitiativeTick) ? b.nextInitiativeTick : 0;
        if (aTick !== bTick) return aTick - bTick;
        const aId = clean(a.id), bId = clean(b.id);
        return aId < bId ? -1 : aId > bId ? 1 : 0;
      });

    const requested = Number.isInteger(options.maxPerTick) ? options.maxPerTick : 1;
    const limit = Math.max(1, Math.min(MAX_PER_TICK, requested));
    const cursor = clean(options.cursorActorId);
    let start = 0;
    if (cursor && candidates.length) {
      const index = candidates.findIndex(actor => clean(actor.id) === cursor);
      start = index < 0 ? 0 : (index + 1) % candidates.length;
    }
    const rotated = candidates.slice(start).concat(candidates.slice(0, start));
    const selected = rotated.slice(0, limit).map(actor => ({
      actorId: clean(actor.id),
      goal: clean(actor.personalGoal, 1000),
      goalStatus: clean(actor.goalStatus, 40) || "active",
      locationId: clean(actor.locationId) || null,
      lastInitiativeTick: Number.isSafeInteger(actor.lastInitiativeTick) ? actor.lastInitiativeTick : null
    }));
    return {
      selected,
      nextCursorId: selected.length ? selected[selected.length - 1].actorId : cursor || null,
      rejected: false
    };
  }

  function markInitiative(actor, tick, cooldownTicks = 1) {
    if (!actor || typeof actor !== "object" || !clean(actor.id) ||
        !Number.isSafeInteger(tick) || tick < 0 ||
        !Number.isSafeInteger(cooldownTicks) || cooldownTicks < 1 ||
        !Number.isSafeInteger(tick + cooldownTicks)) {
      return { applied: false, reason: "invalid-input", actor };
    }
    if (Number.isSafeInteger(actor.lastInitiativeTick) && actor.lastInitiativeTick >= tick) {
      return { applied: false, reason: "already-processed", actor };
    }
    return {
      applied: true,
      reason: null,
      actor: {
        ...actor,
        lastInitiativeTick: tick,
        nextInitiativeTick: tick + cooldownTicks
      }
    };
  }

  return Object.freeze({
    selectInitiatives,
    markInitiative,
    limits: Object.freeze({ maxActors: MAX_ACTORS, maxPerTick: MAX_PER_TICK })
  });
});
