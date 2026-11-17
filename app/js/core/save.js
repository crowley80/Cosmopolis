'use strict';

const Save = {
    key: 'cosmopolis_save',
    indexKey: 'athun_saves_index_v1',
    activeKey: 'athun_active_save_v1',
    slotPrefix: 'athun_save_v1_',
    worldKey: 'athun_shared_world_v1',

    emptyWorld() {
        return { locations: [], connections: [], spatialRelations: [], entities: {}, facts: [], events: [], changes: [], relationships: {} };
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
            // Athun tiene una única representación canónica: el narrador no puede retirarlo ni crear copias.
            const withoutAthun = inventory.filter(item =>
                !String(item).toLocaleLowerCase('es').includes('athun')
            );
            slot.adventure.state.inventory = ['Athun — grimorio consciente', ...withoutAthun];

            // La migración de partidas múltiples conserva también el vínculo y los recuerdos del grimorio.
            const previousAthun = slot.adventure.state.athun && typeof slot.adventure.state.athun === 'object'
                ? slot.adventure.state.athun : {};
            slot.adventure.state.athun = {
                ...previousAthun,
                id: 'athun',
                name: 'Athun',
                kind: 'Grimorio consciente',
                bond: Number.isFinite(Number(previousAthun.bond)) ? Number(previousAthun.bond) : 0,
                memories: Array.isArray(previousAthun.memories) ? previousAthun.memories : [],
                revelations: Array.isArray(previousAthun.revelations) ? previousAthun.revelations : [],
                permanent: true
            };
        }
        return slot;
    },

    rebuildIndexFromSlots() {
        const saves = [];
        if (typeof localStorage.length !== 'number' || typeof localStorage.key !== 'function') return saves;
        for (let i = 0; i < localStorage.length; i += 1) {
            const key = localStorage.key(i);
            if (!key || !key.startsWith(this.slotPrefix)) continue;
            const id = key.slice(this.slotPrefix.length);
            const slot = this.readJSON(key);
            if (!slot) continue;
            saves.push({
                id,
                name: String(slot.character && slot.character.name || 'Partida recuperada').slice(0, 80),
                title: String(slot.adventure && slot.adventure.title || 'Ficha sin aventura').slice(0, 120),
                createdAt: slot.createdAt || slot.updatedAt || new Date().toISOString(),
                updatedAt: slot.updatedAt || slot.createdAt || new Date().toISOString()
            });
        }
        return saves;
    },

    ensureReady() {
        let index = this.readJSON(this.indexKey);
        if (index && Array.isArray(index.saves)) {
            if (!localStorage.getItem(this.activeKey) && index.saves.length) {
                this.activate(index.saves[0].id);
            }
            return index;
        }

        // Si el índice se daña o se elimina, reconstruirlo desde los registros existentes.
        const recovered = this.rebuildIndexFromSlots();
        if (recovered.length) {
            const rebuilt = { version: 1, saves: recovered };
            try {
                this.writeVerified(this.indexKey, rebuilt);
                if (!localStorage.getItem(this.activeKey)) this.writeVerified(this.activeKey, { id: recovered[0].id });
                return rebuilt;
            } catch (error) {
                console.error('No se pudo reconstruir el índice de partidas:', error);
                return { version: 1, saves: recovered };
            }
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
            title: String(slot.adventure && slot.adventure.title || 'Ficha sin aventura').slice(0, 120),
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
            const legacyState = slot.adventure && slot.adventure.state || {};
            const discovered = [
                ...(Array.isArray(legacyState.visitedLocations) ? legacyState.visitedLocations : []),
                legacyState.currentLocation || (slot.adventure && slot.adventure.location) || ''
            ];
            discovered.forEach(location => this.addGlobalLocation(location, slot.character && slot.character.name));
            Object.entries(legacyState.characters || {}).forEach(([key, entity]) => {
                if (entity && typeof entity === 'object') {
                    this.addGlobalEntity({ ...entity, name: entity.name || key }, slot.character && slot.character.name);
                }
            });
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

    writeSlotAndIndex(id, slot, operation = 'guardar') {
        const slotKey = this.slotPrefix + id;
        const originalSlot = localStorage.getItem(slotKey);
        const originalIndex = localStorage.getItem(this.indexKey);
        if (originalSlot === null) return false;

        try {
            if (!this.writeVerified(slotKey, slot)) {
                throw new Error('No se pudo verificar el registro de la partida.');
            }
            this.updateIndexEntry(id, slot);
            return true;
        } catch (error) {
            // El registro y su índice forman una única operación lógica.
            // Si falla cualquiera de las escrituras, se restaura el estado anterior.
            try {
                if (localStorage.getItem(slotKey) !== originalSlot) {
                    localStorage.setItem(slotKey, originalSlot);
                }
                const currentIndex = localStorage.getItem(this.indexKey);
                if (originalIndex === null && currentIndex !== null) {
                    localStorage.removeItem(this.indexKey);
                } else if (originalIndex !== null && currentIndex !== originalIndex) {
                    localStorage.setItem(this.indexKey, originalIndex);
                }
            } catch (rollbackError) {
                console.error('No se pudo restaurar completamente la partida tras el fallo:', rollbackError);
            }
            console.error('No se pudo ' + operation + ' la partida:', error);
            return false;
        }
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
        return this.writeSlotAndIndex(id, updated, 'guardar');
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
        return this.writeSlotAndIndex(id, updated, 'sustituir');
    },

    updateIndexEntry(id, slot) {
        const index = this.readJSON(this.indexKey) || { version: 1, saves: [] };
        const entries = index.saves.filter(entry => entry.id !== id);
        entries.push({
            id,
            name: String(slot.character && slot.character.name || 'Partida sin nombre').slice(0, 80),
            title: String(slot.adventure && slot.adventure.title || 'Ficha sin aventura').slice(0, 120),
            createdAt: slot.createdAt || new Date().toISOString(),
            updatedAt: slot.updatedAt || new Date().toISOString()
        });
        if (!this.writeVerified(this.indexKey, { version: 1, saves: entries })) {
            throw new Error('No se pudo verificar el índice actualizado de partidas.');
        }
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
        const previousActive = localStorage.getItem(this.activeKey);
        try {
            if (!this.writeVerified(this.slotPrefix + id, slot)) {
                throw new Error('No se pudo verificar el registro de la partida.');
            }
            const next = {
                version: 1,
                saves: [...index.saves, {
                    id,
                    name: String(character && character.name || 'Partida sin nombre').slice(0, 80),
                    title: String(adventure && adventure.title || 'Ficha sin aventura').slice(0, 120),
                    createdAt: now,
                    updatedAt: now
                }]
            };
            if (!this.writeVerified(this.indexKey, next)) {
                throw new Error('No se pudo verificar el índice de partidas.');
            }
            if (!this.writeVerified(this.activeKey, { id })) {
                throw new Error('No se pudo activar la nueva partida.');
            }
            return id;
        } catch (error) {
            // Una creación fallida debe revertir cualquier escritura parcial.
            try {
                this.writeVerified(this.indexKey, index);
            } catch (rollbackError) {
                console.error('No se pudo restaurar el índice tras el fallo:', rollbackError);
            }
            try {
                localStorage.removeItem(this.slotPrefix + id);
            } catch (rollbackError) {
                console.error('No se pudo retirar la partida incompleta:', rollbackError);
            }
            try {
                if (previousActive === null) localStorage.removeItem(this.activeKey);
                else localStorage.setItem(this.activeKey, previousActive);
            } catch (rollbackError) {
                console.error('No se pudo restaurar la partida activa anterior:', rollbackError);
            }
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

        const slotKey = this.slotPrefix + id;
        const originalIndex = localStorage.getItem(this.indexKey);
        const originalSlot = localStorage.getItem(slotKey);
        const originalActive = localStorage.getItem(this.activeKey);
        if (originalSlot === null) return false;
        const wasActive = this.getActiveId() === id;
        const next = { version: 1, saves: index.saves.filter(entry => entry.id !== id) };

        try {
            if (!this.writeVerified(this.indexKey, next)) {
                throw new Error('No se pudo verificar el nuevo índice de partidas.');
            }
            localStorage.removeItem(slotKey);
            if (localStorage.getItem(slotKey) !== null) {
                throw new Error('No se pudo verificar la eliminación de los datos de la partida.');
            }
            if (wasActive && !this.writeVerified(this.activeKey, { id: next.saves[0].id })) {
                throw new Error('No se pudo activar la partida que sustituye a la eliminada.');
            }
            return true;
        } catch (error) {
            // La eliminación es transaccional: si falla cualquier paso, se restaura el estado anterior.
            try {
                if (originalSlot !== null && localStorage.getItem(slotKey) !== originalSlot) {
                    localStorage.setItem(slotKey, originalSlot);
                }
                if (originalIndex !== null && localStorage.getItem(this.indexKey) !== originalIndex) {
                    localStorage.setItem(this.indexKey, originalIndex);
                }
                const currentActive = localStorage.getItem(this.activeKey);
                if (originalActive === null && currentActive !== null) {
                    localStorage.removeItem(this.activeKey);
                } else if (originalActive !== null && currentActive !== originalActive) {
                    localStorage.setItem(this.activeKey, originalActive);
                }
            } catch (rollbackError) {
                console.error('No se pudo restaurar completamente la partida tras el fallo:', rollbackError);
            }
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
        world.connections = Array.isArray(world.connections) ? world.connections : [];
        world.spatialRelations = Array.isArray(world.spatialRelations) ? world.spatialRelations : [];
        world.entities = world.entities && typeof world.entities === 'object' ? world.entities : {};
        world.facts = Array.isArray(world.facts) ? world.facts : [];
        world.events = Array.isArray(world.events) ? world.events : [];
        world.changes = Array.isArray(world.changes) ? world.changes : [];
        world.relationships = world.relationships && typeof world.relationships === 'object' ? world.relationships : {};
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

    addGlobalConnection(from, to, discoveredBy) {
        const start = String(from || '').trim().slice(0, 120);
        const end = String(to || '').trim().slice(0, 120);
        if (!start || !end || start.toLocaleLowerCase('es') === end.toLocaleLowerCase('es')) return false;
        const world = this.getGlobalWorld();
        const addEndpoint = name => {
            const key = name.toLocaleLowerCase('es');
            if (!world.locations.some(item =>
                String(typeof item === 'string' ? item : item.name || '').trim().toLocaleLowerCase('es') === key
            )) {
                world.locations.push({
                    name,
                    discoveredBy: String(discoveredBy || '').slice(0, 80),
                    discoveredAt: new Date().toISOString()
                });
            }
        };
        addEndpoint(start);
        addEndpoint(end);
        const exists = world.connections.some(item =>
            item && String(item.from || '').toLocaleLowerCase('es') === start.toLocaleLowerCase('es') &&
            String(item.to || '').toLocaleLowerCase('es') === end.toLocaleLowerCase('es')
        );
        if (!exists) world.connections.push({
            from: start,
            to: end,
            discoveredBy: String(discoveredBy || '').slice(0, 80),
            discoveredAt: new Date().toISOString()
        });
        try {
            return this.writeVerified(this.worldKey, world);
        } catch (error) {
            console.error('No se pudo registrar el tramo recorrido:', error);
            return false;
        }
    },


    addGlobalSpatialRelation(relation, discoveredBy) {
        if (!relation || typeof relation !== 'object') return false;
        const from = String(relation.from || '').trim().slice(0, 120);
        const to = String(relation.to || '').trim().slice(0, 120);
        const type = String(relation.relation || '');
        const evidence = String(relation.evidence || '').trim().slice(0, 240);
        const phrases = {
            north_of: ['al norte de', 'norte de'],
            south_of: ['al sur de', 'sur de'],
            east_of: ['al este de', 'este de'],
            west_of: ['al oeste de', 'oeste de'],
            inside: ['dentro de', 'en el interior de', 'forma parte de', 'pertenece a'],
            adjacent_to: ['junto a', 'al lado de', 'contiguo a', 'colinda con']
        }[type];
        const normalize = value => String(value || '').normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es');
        const text = normalize(evidence);
        const fromName = normalize(from);
        const toName = normalize(to);
        const fromAt = text.indexOf(fromName);
        const toAt = fromAt < 0 ? -1 : text.indexOf(toName, fromAt + fromName.length);
        if (!from || !to || !evidence || !phrases || !fromName || fromName === toName ||
            fromAt < 0 || toAt < 0 ||
            !phrases.some(phrase => {
                const at = text.indexOf(normalize(phrase), fromAt + fromName.length);
                return at > fromAt && at < toAt;
            })) return false;

        const world = this.getGlobalWorld();
        const addEndpoint = name => {
            const key = normalize(name);
            if (!world.locations.some(item =>
                normalize(typeof item === 'string' ? item : item && item.name) === key
            )) {
                world.locations.push({
                    name,
                    discoveredBy: String(discoveredBy || '').slice(0, 80),
                    discoveredAt: new Date().toISOString()
                });
            }
        };
        addEndpoint(from);
        addEndpoint(to);
        const exists = world.spatialRelations.some(item =>
            item && normalize(item.from) === fromName &&
            item.relation === type && normalize(item.to) === toName
        );
        if (!exists) world.spatialRelations.push({
            from,
            relation: type,
            to,
            evidence,
            discoveredBy: String(discoveredBy || '').slice(0, 80),
            discoveredAt: new Date().toISOString()
        });
        try {
            return this.writeVerified(this.worldKey, world);
        } catch (error) {
            console.error('No se pudo registrar la posición relativa:', error);
            return false;
        }
    },

    addGlobalEntity(entity, discoveredBy) {
        if (!entity || typeof entity !== 'object') return false;
        const name = String(entity.name || '').trim().slice(0, 80);
        if (!name) return false;
        const world = this.getGlobalWorld();
        const key = name.toLocaleLowerCase('es');
        if (world.entities[key]) return true;
        // Solo se comparte la identidad básica; recuerdos, confianza y objetivos son personales.
        world.entities[key] = {
            name,
            role: String(entity.role || 'Personaje').trim().slice(0, 100),
            firstKnownLocation: String(entity.location || '').trim().slice(0, 120),
            discoveredBy: String(discoveredBy || '').slice(0, 80),
            discoveredAt: new Date().toISOString()
        };
        try {
            return this.writeVerified(this.worldKey, world);
        } catch (error) {
            console.error('No se pudo registrar la entidad compartida:', error);
            return false;
        }
    },

    saveGlobalWorld(world) {
        const current = this.getGlobalWorld();
        const updated = {
            ...current,
            ...(world || {}),
            locations: Array.isArray(world && world.locations) ? world.locations : current.locations,
            connections: Array.isArray(world && world.connections) ? world.connections : current.connections,
            entities: { ...current.entities, ...((world && world.entities) || {}) },
            facts: Array.isArray(world && world.facts) ? world.facts : current.facts,
            events: Array.isArray(world && world.events) ? world.events : current.events,
            changes: Array.isArray(world && world.changes) ? world.changes : current.changes,
            relationships: { ...current.relationships, ...((world && world.relationships) || {}) }
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
