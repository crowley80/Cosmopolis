'use strict';

const Save = {
    key: 'cosmopolis_save',
    indexKey: 'athun_saves_index_v1',
    activeKey: 'athun_active_save_v1',
    slotPrefix: 'athun_save_v1_',
    worldKey: 'athun_shared_world_v1',

    emptyWorld() {
        return { locations: [], entities: {}, facts: [], events: [], changes: [] };
    },

    readJSON(key) {
        try {
            const raw = localStorage.getItem(key);
            if (!raw) return null;
            const value = JSON.parse(raw);
            return value && typeof value === 'object' && !Array.isArray(value) ? value : null;
        } catch (error) {
            console.error('No se pudo leer el registro ' + key + ':', error);
            return null;
        }
    },

    writeVerified(key, value) {
        const serialized = JSON.stringify(value);
        localStorage.setItem(key, serialized);
        return localStorage.getItem(key) === serialized;
    },

    normalizeSlot(data) {
        const slot = { ...(data || {}) };
        slot.actions = Array.isArray(slot.actions) ? slot.actions : [];
        slot.world = slot.world && typeof slot.world === 'object' ? slot.world : {};
        slot.world.events = Array.isArray(slot.world.events) ? slot.world.events : [];
        slot.world.facts = Array.isArray(slot.world.facts) ? slot.world.facts : [];
        slot.world.relationships = slot.world.relationships && typeof slot.world.relationships === 'object'
            ? slot.world.relationships : {};
        if (slot.adventure && typeof slot.adventure === 'object') {
            slot.adventure.state = slot.adventure.state && typeof slot.adventure.state === 'object'
                ? slot.adventure.state : {};
            const inventory = Array.isArray(slot.adventure.state.inventory)
                ? slot.adventure.state.inventory : [];
            if (!inventory.some(item => String(item).toLocaleLowerCase('es').includes('athun'))) {
                inventory.unshift('Athun — grimorio consciente');
            }
            slot.adventure.state.inventory = inventory;
        }
        return slot;
    },

    ensureReady() {
        let index = this.readJSON(this.indexKey);
        if (index && Array.isArray(index.saves)) {
            if (!localStorage.getItem(this.activeKey) && index.saves.length) {
                this.activate(index.saves[0].id);
            }
            return index;
        }

        const legacy = this.readJSON(this.key);
        if (!legacy) {
            const empty = { version: 1, saves: [] };
            try {
                this.writeVerified(this.indexKey, empty);
            } catch (error) {
                console.error('No se pudo inicializar el índice de partidas:', error);
            }
            return empty;
        }

        // La clave heredada nunca se borra ni se modifica: se conserva como respaldo íntegro.
        const id = 'legacy-' + String(legacy.createdAt || legacy.updatedAt || 'original')
            .replace(/[^a-zA-Z0-9-]/g, '').slice(0, 40);
        const slot = this.normalizeSlot(legacy);
        const entry = {
            id,
            name: String(slot.character && slot.character.name || 'Partida recuperada').slice(0, 80),
            createdAt: slot.createdAt || legacy.updatedAt || new Date().toISOString(),
            updatedAt: slot.updatedAt || legacy.updatedAt || new Date().toISOString()
        };
        const migratedIndex = { version: 1, saves: [entry] };

        try {
            if (!this.writeVerified(this.slotPrefix + id, slot)) return { version: 1, saves: [], migrationFailed: true };
            if (!this.writeVerified(this.indexKey, migratedIndex)) {
                localStorage.removeItem(this.slotPrefix + id);
                return { version: 1, saves: [], migrationFailed: true };
            }
            this.writeVerified(this.activeKey, { id });
            return migratedIndex;
        } catch (error) {
            console.error('La migración de la partida heredada no se completó:', error);
            return { version: 1, saves: [], migrationFailed: true };
        }
    },

    getIndex() {
        return this.ensureReady();
    },

    getActiveId() {
        this.ensureReady();
        const active = this.readJSON(this.activeKey);
        const index = this.readJSON(this.indexKey);
        if (active && index && index.saves.some(entry => entry.id === active.id)) return active.id;
        return index && index.saves.length ? index.saves[0].id : null;
    },

    list() {
        const index = this.ensureReady();
        return index.saves.map(entry => ({ ...entry, active: entry.id === this.getActiveId() }));
    },

    readSlot(id) {
        if (!id) return null;
        const raw = this.readJSON(this.slotPrefix + id);
        return raw ? this.normalizeSlot(raw) : null;
    },

    load() {
        const id = this.getActiveId();
        if (!id) return null;
        const slot = this.readSlot(id);
        if (!slot) return null;
        return { ...slot, id };
    },

    save(data) {
        const id = this.getActiveId();
        if (!id || !data || typeof data !== 'object') return false;
        const current = this.readSlot(id) || {};
        const updated = this.normalizeSlot({
            ...current,
            ...data,
            actions: data.actions !== undefined ? data.actions : (current.actions || []),
            world: {
                ...(current.world || {}),
                ...(data.world || {}),
                events: data.world && data.world.events !== undefined
                    ? data.world.events : ((current.world || {}).events || []),
                facts: data.world && data.world.facts !== undefined
                    ? data.world.facts : ((current.world || {}).facts || []),
                relationships: {
                    ...((current.world || {}).relationships || {}),
                    ...((data.world || {}).relationships || {})
                }
            },
            updatedAt: new Date().toISOString()
        });
        try {
            if (!this.writeVerified(this.slotPrefix + id, updated)) return false;
            this.updateIndexEntry(id, updated);
            return true;
        } catch (error) {
            console.error('Error al guardar la partida:', error);
            return false;
        }
    },

    replace(data) {
        const id = this.getActiveId();
        if (!id) return this.createSlot(data.character, data.adventure, data);
        const current = this.readSlot(id) || {};
        const updated = this.normalizeSlot({
            ...data,
            world: data.world || current.world || {},
            createdAt: current.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        try {
            if (!this.writeVerified(this.slotPrefix + id, updated)) return false;
            this.updateIndexEntry(id, updated);
            return true;
        } catch (error) {
            console.error('No se pudo sustituir la partida:', error);
            return false;
        }
    },

    updateIndexEntry(id, slot) {
        const index = this.readJSON(this.indexKey) || { version: 1, saves: [] };
        const entries = index.saves.filter(entry => entry.id !== id);
        entries.push({
            id,
            name: String(slot.character && slot.character.name || 'Partida sin nombre').slice(0, 80),
            createdAt: slot.createdAt || new Date().toISOString(),
            updatedAt: slot.updatedAt || new Date().toISOString()
        });
        this.writeVerified(this.indexKey, { version: 1, saves: entries });
    },

    createSlot(character, adventure = null, extra = {}) {
        this.ensureReady();
        const now = new Date().toISOString();
        const id = 'save-' + Date.now().toString(36) + '-' + Math.floor(Math.random() * 1000000).toString(36);
        const slot = this.normalizeSlot({
            ...extra,
            character,
            adventure,
            actions: Array.isArray(extra.actions) ? extra.actions : [],
            world: extra.world || { events: [], facts: [], relationships: {} },
            createdAt: now,
            updatedAt: now
        });
        const index = this.readJSON(this.indexKey) || { version: 1, saves: [] };
        try {
            if (!this.writeVerified(this.slotPrefix + id, slot)) return false;
            const next = {
                version: 1,
                saves: [...index.saves, {
                    id,
                    name: String(character && character.name || 'Partida sin nombre').slice(0, 80),
                    createdAt: now,
                    updatedAt: now
                }]
            };
            if (!this.writeVerified(this.indexKey, next)) {
                localStorage.removeItem(this.slotPrefix + id);
                return false;
            }
            if (!this.writeVerified(this.activeKey, { id })) return false;
            return id;
        } catch (error) {
            console.error('No se pudo crear la partida:', error);
            return false;
        }
    },

    activate(id) {
        const index = this.readJSON(this.indexKey);
        if (!index || !Array.isArray(index.saves) || !index.saves.some(entry => entry.id === id)) return false;
        if (!this.readSlot(id)) return false;
        try {
            return this.writeVerified(this.activeKey, { id });
        } catch (error) {
            console.error('No se pudo activar la partida:', error);
            return false;
        }
    },

    deleteSlot(id) {
        const index = this.readJSON(this.indexKey);
        if (!index || !Array.isArray(index.saves) || !index.saves.some(entry => entry.id === id)) return false;
        if (index.saves.length <= 1) return false;
        try {
            const next = { version: 1, saves: index.saves.filter(entry => entry.id !== id) };
            if (!this.writeVerified(this.indexKey, next)) return false;
            localStorage.removeItem(this.slotPrefix + id);
            if (this.getActiveId() === id) this.activate(next.saves[0].id);
            return true;
        } catch (error) {
            console.error('No se pudo eliminar la partida:', error);
            return false;
        }
    },

    updateCharacter(character) {
        const current = this.load();
        if (!current) return false;
        return this.save({ character });
    },

    getGlobalWorld() {
        const world = this.readJSON(this.worldKey) || this.emptyWorld();
        world.locations = Array.isArray(world.locations) ? world.locations : [];
        world.entities = world.entities && typeof world.entities === 'object' ? world.entities : {};
        world.facts = Array.isArray(world.facts) ? world.facts : [];
        world.events = Array.isArray(world.events) ? world.events : [];
        world.changes = Array.isArray(world.changes) ? world.changes : [];
        return world;
    },

    addGlobalLocation(name, discoveredBy) {
        const clean = String(name || '').trim().slice(0, 120);
        if (!clean) return false;
        const world = this.getGlobalWorld();
        const exists = world.locations.some(item =>
            String(typeof item === 'string' ? item : item.name).toLocaleLowerCase('es') === clean.toLocaleLowerCase('es')
        );
        if (!exists) world.locations.push({ name: clean, discoveredBy: String(discoveredBy || '').slice(0, 80), discoveredAt: new Date().toISOString() });
        try {
            return this.writeVerified(this.worldKey, world);
        } catch (error) {
            console.error('No se pudo registrar la localización compartida:', error);
            return false;
        }
    },

    saveGlobalWorld(world) {
        const current = this.getGlobalWorld();
        const updated = {
            ...current,
            ...(world || {}),
            locations: Array.isArray(world && world.locations) ? world.locations : current.locations,
            entities: { ...current.entities, ...((world && world.entities) || {}) },
            facts: Array.isArray(world && world.facts) ? world.facts : current.facts,
            events: Array.isArray(world && world.events) ? world.events : current.events,
            changes: Array.isArray(world && world.changes) ? world.changes : current.changes
        };
        try {
            return this.writeVerified(this.worldKey, updated);
        } catch (error) {
            console.error('No se pudo guardar el mundo compartido:', error);
            return false;
        }
    },

    exists() {
        return Boolean(this.getActiveId());
    }
};

window.Save = Save;
