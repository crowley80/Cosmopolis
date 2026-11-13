'use strict';

/*
 * Núcleo puro y aislado del mundo vivo.
 * No usa reloj real, DOM, almacenamiento ni IA.
 * Aún no está conectado al flujo de turnos de la aplicación.
 */
(function (root) {
    const SCHEMA_VERSION = 1;
    const MAX_PROCESSED_OPERATIONS = 500;
    const MAX_EVENTS = 200;

    function isObject(value) {
        return value !== null && typeof value === 'object' && !Array.isArray(value);
    }

    function uniqueStrings(values, limit) {
        const seen = new Set();
        const result = [];
        (Array.isArray(values) ? values : []).forEach(value => {
            if (typeof value !== 'string') return;
            const item = value.trim();
            if (!item || seen.has(item)) return;
            seen.add(item);
            result.push(item);
        });
        return result.slice(-limit);
    }

    function normalize(world) {
        const source = isObject(world) ? world : {};
        const clockSource = isObject(source.clock) ? source.clock : {};
        const tick = Number.isSafeInteger(clockSource.tick) && clockSource.tick >= 0
            ? clockSource.tick
            : 0;

        return {
            ...source,
            schemaVersion: Math.max(SCHEMA_VERSION,
                Number.isInteger(source.schemaVersion) ? source.schemaVersion : 0),
            clock: { ...clockSource, tick },
            events: Array.isArray(source.events) ? source.events.slice(-MAX_EVENTS) : [],
            facts: Array.isArray(source.facts) ? source.facts : [],
            relationships: isObject(source.relationships) ? source.relationships : {},
            processedOperations: uniqueStrings(source.processedOperations, MAX_PROCESSED_OPERATIONS)
        };
    }

    /*
     * Registra un paso lógico exactamente una vez por operationId.
     * El llamador debe persistir el world devuelto junto con la acción.
     * Los eventos no dependen de Date.now(): su orden se basa en tick e ID.
     */
    function applyStep(world, operationId, event) {
        if (typeof operationId !== 'string' || !operationId.trim()) {
            throw new TypeError('operationId debe ser una cadena no vacía');
        }

        const next = normalize(world);
        const id = operationId.trim();

        if (next.processedOperations.includes(id)) {
            return { world: next, applied: false, tick: next.clock.tick };
        }

        next.clock.tick += 1;
        next.processedOperations.push(id);
        if (next.processedOperations.length > MAX_PROCESSED_OPERATIONS) {
            next.processedOperations = next.processedOperations.slice(-MAX_PROCESSED_OPERATIONS);
        }

        if (event !== undefined && event !== null) {
            const entry = isObject(event)
                ? { ...event, id: typeof event.id === 'string' && event.id ? event.id : id, tick: next.clock.tick }
                : { id, tick: next.clock.tick, description: String(event) };
            next.events.push(entry);
            next.events.sort((a, b) => {
                const tickA = Number.isSafeInteger(a && a.tick) ? a.tick : 0;
                const tickB = Number.isSafeInteger(b && b.tick) ? b.tick : 0;
                if (tickA !== tickB) return tickA - tickB;
                const idA = String(a && a.id || '');
                const idB = String(b && b.id || '');
                return idA < idB ? -1 : (idA > idB ? 1 : 0);
            });
            if (next.events.length > MAX_EVENTS) next.events = next.events.slice(-MAX_EVENTS);
        }

        return { world: next, applied: true, tick: next.clock.tick };
    }

    const api = Object.freeze({
        SCHEMA_VERSION,
        MAX_PROCESSED_OPERATIONS,
        MAX_EVENTS,
        normalize,
        applyStep
    });

    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    if (root) root.CosmopolisWorldCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
