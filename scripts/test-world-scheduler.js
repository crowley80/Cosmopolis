const test = require("node:test");
const assert = require("node:assert/strict");
const Scheduler = require("../app/js/game/world-scheduler.js");

test("programa eventos con tick lógico y los ordena de forma determinista", () => {
  const a = Scheduler.scheduleEvent([], { id: "later", dueTick: 8, type: "meeting" });
  const b = Scheduler.scheduleEvent(a.events, { id: "sooner", dueTick: 3, type: "arrival" });
  assert.deepEqual(b.events.map(item => item.id), ["sooner", "later"]);
});

test("rechaza eventos inválidos y IDs duplicados", () => {
  assert.equal(Scheduler.scheduleEvent([], { id: "", dueTick: 2 }).applied, false);
  assert.equal(Scheduler.scheduleEvent([], { id: "bad", dueTick: -1 }).applied, false);
  const first = Scheduler.scheduleEvent([], { id: "same", dueTick: 2 });
  assert.equal(Scheduler.scheduleEvent(first.events, { id: "same", dueTick: 5 }).reason, "duplicate-id");
});

test("solo entrega eventos cuyo tick ya ha llegado", () => {
  const scheduled = Scheduler.scheduleEvent([], { id: "e1", dueTick: 4, type: "arrival", payload: { actorId: "npc" } });
  const early = Scheduler.collectDueEvents(scheduled.events, 3);
  assert.equal(early.due.length, 0);
  const due = Scheduler.collectDueEvents(early.events, 4);
  assert.equal(due.due.length, 1);
  assert.equal(due.due[0].payload.actorId, "npc");
  assert.equal(due.events[0].status, "fired");
});

test("un evento entregado no vuelve a dispararse", () => {
  const scheduled = Scheduler.scheduleEvent([], { id: "once", dueTick: 1 });
  const first = Scheduler.collectDueEvents(scheduled.events, 1);
  const second = Scheduler.collectDueEvents(first.events, 10);
  assert.equal(first.due.length, 1);
  assert.equal(second.due.length, 0);
});

test("puede cancelar eventos pendientes pero no eventos ya disparados", () => {
  const scheduled = Scheduler.scheduleEvent([], { id: "cancel", dueTick: 9 });
  const cancelled = Scheduler.cancelEvent(scheduled.events, "cancel");
  assert.equal(cancelled.applied, true);
  assert.equal(Scheduler.collectDueEvents(cancelled.events, 20).due.length, 0);
  assert.equal(Scheduler.cancelEvent(cancelled.events, "cancel").reason, "not-pending");
});

test("rechaza ticks de consulta inválidos sin alterar agenda", () => {
  const scheduled = Scheduler.scheduleEvent([], { id: "valid", dueTick: 1 });
  const result = Scheduler.collectDueEvents(scheduled.events, -1);
  assert.equal(result.rejected, true);
  assert.deepEqual(result.events, scheduled.events);
});

test("normaliza estados y conserva campos de extensiones", () => {
  const result = Scheduler.normalizeScheduledEvents([
    { id: "x", dueTick: 2, status: "unknown", custom: "keep" },
    { id: "bad", dueTick: "tomorrow" }
  ]);
  assert.equal(result.length, 1);
  assert.equal(result[0].status, "pending");
  assert.equal(result[0].custom, "keep");
});

test("limita la agenda y no usa el reloj de pared", () => {
  const events = Array.from({ length: Scheduler.limits.maxScheduled + 5 }, (_, i) => ({
    id: "e" + i, dueTick: i
  }));
  const result = Scheduler.normalizeScheduledEvents(events);
  assert.equal(result.length, Scheduler.limits.maxScheduled);
  assert.equal(result[0].id, "e0");
});

test("al alcanzar capacidad rechaza nuevas entradas sin descartar eventos existentes", () => {
  const events = Array.from({ length: Scheduler.limits.maxScheduled }, (_, i) => ({
    id: "event-" + i, dueTick: i
  }));
  const result = Scheduler.scheduleEvent(events, { id: "extra", dueTick: 9999 });
  assert.equal(result.applied, false);
  assert.equal(result.reason, "capacity");
  assert.equal(result.events.length, Scheduler.limits.maxScheduled);
  assert.equal(result.events[0].id, "event-0");
});

test("la normalización conserva primero los eventos más próximos", () => {
  const events = Array.from({ length: Scheduler.limits.maxScheduled + 2 }, (_, i) => ({
    id: "event-" + i, dueTick: i
  }));
  const result = Scheduler.normalizeScheduledEvents(events);
  assert.equal(result.length, Scheduler.limits.maxScheduled);
  assert.equal(result[0].id, "event-0");
  assert.equal(result[result.length - 1].id, "event-499");
});


test("un duplicado pendiente no resucita un evento ya disparado", () => {
  const legacy = [
    { id: "same", dueTick: 2, status: "fired", firedAtTick: 2 },
    { id: " same ", dueTick: 9, status: "pending", payload: { changed: true } }
  ];
  const normalized = Scheduler.normalizeScheduledEvents(legacy);
  assert.equal(normalized.length, 1);
  assert.equal(normalized[0].status, "fired");
  assert.equal(normalized[0].dueTick, 2);
  assert.equal(normalized[0].firedAtTick, 2);
  assert.equal(Scheduler.collectDueEvents(normalized, 20).due.length, 0);
});

test("una copia terminal posterior prevalece sobre una copia pendiente anterior", () => {
  const legacy = [
    { id: "same", dueTick: 2, status: "pending" },
    { id: "same", dueTick: 9, status: "cancelled" }
  ];
  const normalized = Scheduler.normalizeScheduledEvents(legacy);
  assert.equal(normalized.length, 1);
  assert.equal(normalized[0].status, "cancelled");
  assert.equal(Scheduler.collectDueEvents(normalized, 20).due.length, 0);
});

test("rechaza IDs de agenda excesivos en lugar de truncarlos", () => {
  const oversized = "x".repeat(Scheduler.limits.maxIdLength + 1);
  const scheduled = Scheduler.scheduleEvent([], { id: oversized, dueTick: 1 });
  assert.equal(scheduled.applied, false);
  assert.equal(scheduled.reason, "invalid-event");
  assert.deepEqual(Scheduler.normalizeScheduledEvents([
    { id: oversized, dueTick: 1, status: "pending" },
    { id: "valid", dueTick: 2, status: "pending" }
  ]).map(item => item.id), ["valid"]);
});

test("un ID excesivo no puede cancelar otro evento por truncamiento", () => {
  const id = "x".repeat(Scheduler.limits.maxIdLength);
  const events = Scheduler.scheduleEvent([], { id, dueTick: 4 }).events;
  const result = Scheduler.cancelEvent(events, id + "extra");
  assert.equal(result.applied, false);
  assert.equal(result.reason, "invalid-id");
  assert.equal(result.events[0].status, "pending");
});
