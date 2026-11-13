/* Cosmopolis — agenda determinista de eventos del mundo.
 * Usa ticks lógicos; no consulta reloj real ni ejecuta trabajo en segundo plano.
 * El motor llama a collectDueEvents tras un paso válido del mundo.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.CosmopolisWorldScheduler = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const STATUSES = new Set(["pending", "fired", "cancelled"]);
  const MAX_SCHEDULED = 500;
  const MAX_ID_LENGTH = 120;

  function clean(value, max = 120) {
    return typeof value === "string" ? value.trim().slice(0, max) : "";
  }

  function normalizeScheduledEvents(events) {
    if (!Array.isArray(events)) return [];
    const byId = new Map();
    for (const raw of events) {
      if (!raw || typeof raw !== "object") continue;
      const id = typeof raw.id === "string" ? raw.id.trim() : "";
      const dueTick = raw.dueTick;
      if (!id || id.length > MAX_ID_LENGTH || !Number.isSafeInteger(dueTick) || dueTick < 0) continue;
      const status = STATUSES.has(raw.status) ? raw.status : "pending";
      const normalized = {
        ...raw,
        id,
        dueTick,
        status,
        payload: raw.payload && typeof raw.payload === "object" && !Array.isArray(raw.payload)
          ? { ...raw.payload }
          : {}
      };
      const existing = byId.get(id);
      if (!existing) {
        byId.set(id, normalized);
      } else if (existing.status === "pending" && status !== "pending") {
        // Una copia terminal heredada prevalece sobre cualquier duplicado pendiente.
        // Nunca permitir que una agenda duplicada resucite un evento ya cerrado.
        byId.set(id, { ...existing, status, ...(status === "fired" && Number.isSafeInteger(raw.firedAtTick)
          ? { firedAtTick: raw.firedAtTick }
          : {}) });
      }
    }
    return Array.from(byId.values()).sort((a, b) =>
      a.dueTick !== b.dueTick ? a.dueTick - b.dueTick : (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)
    ).slice(0, MAX_SCHEDULED);
  }

  function scheduleEvent(events, event) {
    const current = normalizeScheduledEvents(events);
    if (!event || typeof event !== "object") {
      return { applied: false, reason: "invalid-event", events: current };
    }
    const id = typeof event.id === "string" ? event.id.trim() : "";
    if (!id || id.length > MAX_ID_LENGTH || !Number.isSafeInteger(event.dueTick) || event.dueTick < 0) {
      return { applied: false, reason: "invalid-event", events: current };
    }
    if (current.some(item => item.id === id)) {
      return { applied: false, reason: "duplicate-id", events: current };
    }
    if (current.length >= MAX_SCHEDULED) {
      return { applied: false, reason: "capacity", events: current };
    }
    const entry = {
      ...event,
      id,
      dueTick: event.dueTick,
      status: "pending",
      payload: event.payload && typeof event.payload === "object" && !Array.isArray(event.payload)
        ? { ...event.payload }
        : {}
    };
    const next = [...current, entry].sort((a, b) =>
      a.dueTick !== b.dueTick ? a.dueTick - b.dueTick : (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)
    );
    return { applied: true, reason: null, events: next };
  }

  function cancelEvent(events, eventId) {
    const current = normalizeScheduledEvents(events);
    const id = typeof eventId === "string" ? eventId.trim() : "";
    if (!id || id.length > MAX_ID_LENGTH) {
      return { applied: false, reason: "invalid-id", events: current };
    }
    const index = current.findIndex(item => item.id === id);
    if (index < 0) return { applied: false, reason: "not-found", events: current };
    if (current[index].status !== "pending") {
      return { applied: false, reason: "not-pending", events: current };
    }
    const next = current.slice();
    next[index] = { ...next[index], status: "cancelled" };
    return { applied: true, reason: null, events: next };
  }

  function collectDueEvents(events, currentTick) {
    const current = normalizeScheduledEvents(events);
    if (!Number.isSafeInteger(currentTick) || currentTick < 0) {
      return { events: current, due: [], rejected: true };
    }
    const due = [];
    const next = current.map(item => {
      if (item.status !== "pending" || item.dueTick > currentTick) return item;
      const fired = { ...item, status: "fired", firedAtTick: currentTick };
      due.push({
        id: fired.id,
        type: clean(fired.type, 80) || "world-event",
        dueTick: fired.dueTick,
        firedAtTick: currentTick,
        payload: { ...fired.payload }
      });
      return fired;
    });
    due.sort((a, b) =>
      a.dueTick !== b.dueTick ? a.dueTick - b.dueTick : (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)
    );
    return { events: next, due, rejected: false };
  }

  return Object.freeze({
    normalizeScheduledEvents,
    scheduleEvent,
    cancelEvent,
    collectDueEvents,
    limits: Object.freeze({ maxScheduled: MAX_SCHEDULED, maxIdLength: MAX_ID_LENGTH })
  });
});
