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
  assert.equal(result[0].id, "e5");
});
