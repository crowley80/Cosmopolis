'use strict';

const Save = {
    key: 'cosmopolis_save',

    load() {
        try {
            const raw = localStorage.getItem(this.key);
            if (!raw) return null;

            const data = JSON.parse(raw);
            if (!data || typeof data !== 'object' || Array.isArray(data)) {
                return null;
            }

            data.actions = Array.isArray(data.actions) ? data.actions : [];
            data.world = data.world || {};
            data.world.events = Array.isArray(data.world.events) ? data.world.events : [];
            data.world.facts = Array.isArray(data.world.facts) ? data.world.facts : [];
            data.world.relationships = data.world.relationships || {};

            // Migración compatible: toda partida con aventura conserva a Athun como pertenencia permanente.
            if (data.adventure && data.adventure.state && typeof data.adventure.state === 'object') {
                const state = data.adventure.state;
                let athunMigrationNeeded = false;
                if (!Array.isArray(state.inventory)) {
                    state.inventory = [];
                    athunMigrationNeeded = true;
                }
                if (!state.inventory.some(item => String(item).toLocaleLowerCase('es').includes('athun'))) {
                    state.inventory.unshift('Athun');
                    athunMigrationNeeded = true;
                }
                const previousAthun = state.athun && typeof state.athun === 'object' ? state.athun : {};
                if (previousAthun.permanent !== true || previousAthun.id !== 'athun' ||
                    !Array.isArray(previousAthun.memories) || !Array.isArray(previousAthun.revelations) ||
                    !Number.isFinite(Number(previousAthun.bond))) {
                    athunMigrationNeeded = true;
                }
                state.athun = {
                    id: 'athun',
                    name: 'Athun',
                    kind: 'Grimorio consciente',
                    bond: Number.isFinite(Number(previousAthun.bond)) ? Number(previousAthun.bond) : 0,
                    memories: Array.isArray(previousAthun.memories) ? previousAthun.memories : [],
                    revelations: Array.isArray(previousAthun.revelations) ? previousAthun.revelations : [],
                    ...previousAthun,
                    permanent: true
                };
                if (athunMigrationNeeded) {
                    try {
                        localStorage.setItem(this.key, JSON.stringify(data));
                    } catch (migrationError) {
                        console.warn('Athun se ha incorporado a la sesión actual, pero no se pudo persistir la migración:', migrationError);
                    }
                }
            }

            return data;
        } catch (error) {
            console.error('Error al recuperar la partida:', error);
            return null;
        }
    },

    save(data) {
        const current = this.load() || {};

        const updated = {
            ...current,
            ...data,
            actions: data.actions !== undefined ? data.actions : (current.actions || []),
            world: {
                ...(current.world || {}),
                ...(data.world || {}),
                events: data.world && data.world.events !== undefined
                    ? data.world.events
                    : ((current.world || {}).events || []),
                facts: data.world && data.world.facts !== undefined
                    ? data.world.facts
                    : ((current.world || {}).facts || []),
                relationships: {
                    ...((current.world || {}).relationships || {}),
                    ...((data.world || {}).relationships || {})
                }
            },
            updatedAt: new Date().toISOString()
        };

        try {
            localStorage.setItem(this.key, JSON.stringify(updated));
            return true;
        } catch (error) {
            console.error('Error al guardar la partida:', error);
            return false;
        }
    },

    replace(data) {
        try {
            const updated = {
                ...data,
                actions: Array.isArray(data.actions) ? data.actions : [],
                world: {
                    events: [],
                    facts: [],
                    relationships: {},
                    ...(data.world || {})
                },
                updatedAt: new Date().toISOString()
            };

            localStorage.setItem(this.key, JSON.stringify(updated));
            return true;
        } catch (error) {
            console.error('Error al sustituir la partida:', error);
            return false;
        }
    },

    exists() {
        return localStorage.getItem(this.key) !== null;
    }
};

window.Save = Save;
