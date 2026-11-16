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
