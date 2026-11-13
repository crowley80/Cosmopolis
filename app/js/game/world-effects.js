'use strict';

/* Cosmopolis — aplicación experimental de efectos de dominio tipados.
 * Solo modifica estructuras canónicas explícitas; nunca acepta rutas arbitrarias.
 * Cada efecto pertenece a un evento causal pendiente y es idempotente por ID.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.CosmopolisWorldEffects = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const MAX_PROCESSED = 500;
  const MAX_RELATION_HISTORY = 100;
  const MAX_EFFECTS_PER_EVENT = 50;
  const AXES = new Set(["trust", "respect", "affection", "fear", "hostility"]);
  const TYPES = new Set(["fact.add", "relationship.adjust", "character.move"]);

  function object(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }
  function clean(value, max = 160) {
    return typeof value === "string" ? value.trim().slice(0, max) : "";
  }
  function setOwn(target, key, value) {
    Object.defineProperty(target, key, { value, enumerable: true, configurable: true, writable: true });
  }

  function unique(values) {
    return Array.isArray(values)
      ? Array.from(new Set(values.map(value => clean(value)).filter(Boolean))).slice(-MAX_PROCESSED)
      : [];
  }

  function applyEffect(world, effect) {
    const source = object(world) ? world : {};
    const events = Array.isArray(source.events) ? source.events.slice() : [];
    const processed = unique(source.processedEffects);
    const rejected = reason => ({
      applied: false,
      reason,
      world: { ...source, events: events.map(item => object(item) ? { ...item } : item), processedEffects: processed }
    });

    if (!object(effect) || !Number.isSafeInteger(source.clock && source.clock.tick) ||
        source.clock.tick < 0) return rejected("invalid-input");

    const id = clean(effect.id);
    const type = clean(effect.type, 80);
    const causeEventId = clean(effect.causeEventId);
    if (!id || !TYPES.has(type) || !causeEventId) return rejected("invalid-effect");
    if (processed.includes(id) || events.some(event =>
      event && Array.isArray(event.appliedEffectIds) && event.appliedEffectIds.some(value => clean(value) === id)
    )) return rejected("duplicate-effect");

    const eventIndex = events.findIndex(event =>
      event && typeof event.id === "string" && event.id.trim() === causeEventId
    );
    if (eventIndex < 0) return rejected("cause-event-not-found");
    const cause = events[eventIndex];
    if (cause.status !== "pending") return rejected("cause-event-not-pending");
    const causeEffects = Array.isArray(cause.appliedEffectIds) ? cause.appliedEffectIds : [];
    if (causeEffects.length >= MAX_EFFECTS_PER_EVENT) return rejected("event-effect-capacity");

    const next = { ...source, clock: { ...source.clock }, events: events.map(item => object(item) ? { ...item } : item) };
    const nextEvents = next.events;
    const tick = next.clock.tick;

    if (type === "fact.add") {
      const factId = clean(effect.factId);
      const content = clean(effect.content, 2000);
      const visibility = clean(effect.visibility, 20) || "local";
      if (!factId || !content || !["public", "local", "private", "secret"].includes(visibility)) {
        return rejected("invalid-fact");
      }
      const facts = Array.isArray(source.facts) ? source.facts.slice() : [];
      if (facts.some(fact => fact && clean(fact.id) === factId)) return rejected("duplicate-fact");
      facts.push({
        id: factId,
        content,
        sourceEventId: causeEventId,
        tick,
        visibility,
        locationId: clean(effect.locationId) || null
      });
      next.facts = facts;
    } else if (type === "relationship.adjust") {
      const fromId = clean(effect.fromActorId);
      const toId = clean(effect.toActorId);
      const axis = clean(effect.axis, 40);
      const delta = effect.delta;
      if (!fromId || !toId || fromId === toId || !AXES.has(axis) ||
          !Number.isInteger(delta) || delta === 0 || Math.abs(delta) > 10) {
        return rejected("invalid-relationship-effect");
      }
      const relationships = object(source.relationships) ? { ...source.relationships } : {};
      const outgoing = Object.prototype.hasOwnProperty.call(relationships, fromId) && object(relationships[fromId]) ? { ...relationships[fromId] } : {};
      const relation = Object.prototype.hasOwnProperty.call(outgoing, toId) && object(outgoing[toId]) ? { ...outgoing[toId] } : {};
      const current = relation[axis] === undefined ? 0 : relation[axis];
      if (!Number.isFinite(current)) return rejected("invalid-relationship-state");
      const value = Math.max(-100, Math.min(100, current + delta));
      const history = Array.isArray(relation.history) ? relation.history.slice() : [];
      history.push({ effectId: id, causeEventId, tick, axis, delta, value });
      relation[axis] = value;
      relation.history = history.slice(-MAX_RELATION_HISTORY);
      setOwn(outgoing, toId, relation);
      setOwn(relationships, fromId, outgoing);
      next.relationships = relationships;
    } else if (type === "character.move") {
      const characterId = clean(effect.characterId);
      const toLocationId = clean(effect.toLocationId);
      const fromLocationId = clean(effect.fromLocationId);
      const characters = object(source.characters) ? { ...source.characters } : null;
      const locations = object(source.locations) ? source.locations : {};
      if (!characterId || !toLocationId || !characters || !Object.prototype.hasOwnProperty.call(characters, characterId) || !object(characters[characterId]) ||
          !Object.prototype.hasOwnProperty.call(locations, toLocationId)) return rejected("invalid-character-move");
      const character = { ...characters[characterId] };
      if (fromLocationId && clean(character.locationId) !== fromLocationId) return rejected("character-location-mismatch");
      character.locationId = toLocationId;
      setOwn(characters, characterId, character);
      next.characters = characters;
    }

    const updatedCause = { ...nextEvents[eventIndex] };
    const appliedIds = Array.isArray(updatedCause.appliedEffectIds) ? updatedCause.appliedEffectIds.slice() : [];
    appliedIds.push(id);
    updatedCause.appliedEffectIds = appliedIds.slice(-MAX_EFFECTS_PER_EVENT);
    nextEvents[eventIndex] = updatedCause;
    next.processedEffects = [...processed, id].slice(-MAX_PROCESSED);

    return { applied: true, reason: null, effectId: id, eventId: causeEventId, world: next };
  }

  return Object.freeze({
    applyEffect,
    limits: Object.freeze({ maxProcessed: MAX_PROCESSED, maxRelationshipHistory: MAX_RELATION_HISTORY, maxEffectsPerEvent: MAX_EFFECTS_PER_EVENT }),
    types: Object.freeze(Array.from(TYPES))
  });
});
