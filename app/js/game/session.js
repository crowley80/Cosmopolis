'use strict';

const Session = {
    startNewAdventure(character, adventure) {
        try {
            const current = Save.load();
            // Una aventura nueva obtiene su propio registro si ya existía una aventura.
            // Si es la primera aventura de una ficha recién creada, completa ese mismo registro.
            let saved = false;
            if (current && current.adventure) {
                saved = Boolean(Save.createSlot(character, adventure, {
                    actions: [],
                    world: { events: [], facts: [], relationships: {} }
                }));
            } else if (current) {
                saved = Save.replace({
                    ...current,
                    character,
                    adventure,
                    actions: [],
                    world: current.world || { events: [], facts: [], relationships: {} }
                });
            } else {
                saved = Boolean(Save.createSlot(character, adventure));
            }
            if (saved) {
                const state = adventure && adventure.state || {};
                this.syncMapKnowledge(state, character);
                this.syncSharedEntities(adventure, character);
            }
            return saved;
        } catch (error) {
            console.error('No se pudo crear la nueva aventura:', error);
            return false;
        }
    },

    addAction(action, response = '', details = {}) {
        const saved = Save.load();
        if (!saved || !saved.character || !saved.adventure) return false;

        saved.actions.push({
            text: action,
            response,
            category: details.category || 'other',
            aiUsed: typeof details.aiUsed === 'boolean' ? details.aiUsed : null,
            createdAt: new Date().toISOString()
        });

        const previousAdventure = saved.adventure;
        const previousState = previousAdventure.state || {};
        const previousLocation = previousState.currentLocation || previousAdventure.location || '';
        saved.adventure = details.adventure || saved.adventure;
        saved.adventure.state = saved.adventure.state || {};
        const state = saved.adventure.state;
        state.inventory = Array.isArray(state.inventory) ? state.inventory : [];
        if (!state.inventory.some(item => String(item).toLocaleLowerCase('es').includes('athun'))) {
            state.inventory.unshift('Athun — grimorio consciente');
        }

        const currentLocation = state.currentLocation || saved.adventure.location;
        const traversedRoute = details.category === 'movement' && previousLocation && currentLocation &&
            previousLocation.toLocaleLowerCase('es') !== currentLocation.toLocaleLowerCase('es')
            ? { from: previousLocation, to: currentLocation }
            : null;
        const locationChanged = previousLocation && currentLocation &&
            previousLocation.toLocaleLowerCase('es') !== currentLocation.toLocaleLowerCase('es');
        const adventureVisibleLocations = details.adventure && details.adventure.state &&
            Array.isArray(details.adventure.state.visibleLocations)
            ? details.adventure.state.visibleLocations
            : null;
        const previousVisibleLocations = Array.isArray(previousState.visibleLocations)
            ? previousState.visibleLocations
            : [];
        const stateVisibilityChanged = Array.isArray(adventureVisibleLocations) &&
            (adventureVisibleLocations.length !== previousVisibleLocations.length ||
                adventureVisibleLocations.some((name, index) => name !== previousVisibleLocations[index]));
        const declaredVisibleLocations = Array.isArray(details.visibleLocations)
            ? details.visibleLocations
            : (stateVisibilityChanged ? adventureVisibleLocations : null);
        if (Array.isArray(declaredVisibleLocations)) {
            // El narrador ya ha filtrado esta lista; también se admite el estado
            // de la aventura para conservar compatibilidad con llamadas anteriores.
            state.visibleLocations = declaredVisibleLocations
                .filter(name => typeof name === 'string' && name.trim())
                .map(name => name.trim().slice(0, 120))
                .slice(0, 12);
        } else if (locationChanged) {
            // Al desplazarse, la visión anterior deja de estar iluminada.
            state.visibleLocations = [];
        }
        state.visitedLocations = Array.isArray(state.visitedLocations) ? state.visitedLocations : [];
        if (currentLocation && !state.visitedLocations.includes(currentLocation)) {
            state.visitedLocations.push(currentLocation);
        }

        // El historial y los hechos personales permanecen en esta partida.
        // Solo el registro explícito de localizaciones se comparte entre protagonistas.
        saved.world = saved.world || {};
        saved.world.events = Array.isArray(saved.world.events) ? saved.world.events : [];
        saved.world.facts = Array.isArray(saved.world.facts) ? saved.world.facts : [];
        saved.world.relationships = saved.world.relationships || {};
        saved.world.events.push({
            description: details.event || action,
            category: details.category || 'other',
            actionNumber: saved.actions.length,
            createdAt: new Date().toISOString()
        });
        if (saved.world.events.length > 100) saved.world.events = saved.world.events.slice(-100);

        const normalized = String(action).toLocaleLowerCase('es');
        const facts = [
            { words: ['ofrezco', 'regalo', 'entrego', 'comparto'], fact: 'El personaje ha mostrado generosidad.' },
            { words: ['ayudo', 'rescato', 'protejo', 'curo'], fact: 'El personaje ha intentado ayudar a alguien.' },
            { words: ['ataco', 'golpeo', 'mato', 'combato'], fact: 'El personaje ha recurrido a la violencia.' },
            { words: ['pregunto', 'investigo', 'examino', 'busco'], fact: 'El personaje busca respuestas e información.' },
            { words: ['escondo', 'oculto', 'acecho'], fact: 'El personaje ha actuado con sigilo.' }
        ];
        facts.forEach(item => {
            if (item.words.some(word => normalized.includes(word)) && !saved.world.facts.includes(item.fact)) {
                saved.world.facts.push(item.fact);
            }
        });
        if (saved.world.facts.length > 50) saved.world.facts = saved.world.facts.slice(-50);

        // Primero se confirma la partida personal. El mundo compartido no debe
        // registrar descubrimientos de una acción cuyo guardado haya fallado.
        if (!Save.save(saved)) return false;

        // Publicar todos los descubrimientos de esta acción con una sola escritura
        // del mundo compartido. Así, un fallo no deja ubicaciones, rutas o entidades a medias.
        if (!this.syncActionWorld(state, saved.adventure, saved.character, traversedRoute)) {
            console.warn('La partida se guardó, pero no se pudieron publicar todos los cambios del mundo compartido.');
        }
        return true;
    },

    syncActionWorld(state, adventure, character, traversedRoute) {
        try {
            const current = Save.getGlobalWorld();
            const world = {
                ...current,
                locations: Array.isArray(current.locations) ? current.locations.slice() : [],
                connections: Array.isArray(current.connections) ? current.connections.slice() : [],
                entities: current.entities && typeof current.entities === 'object' ? { ...current.entities } : {}
            };
            const discoveredBy = character && character.name ? character.name : '';

            const locations = [
                state && state.currentLocation,
                ...(state && Array.isArray(state.visibleLocations) ? state.visibleLocations : [])
            ];
            locations.forEach(value => {
                const name = String(value || '').trim().slice(0, 120);
                if (!name) return;
                const key = name.toLocaleLowerCase('es');
                const exists = world.locations.some(item => {
                    const existingName = typeof item === 'string'
                        ? item
                        : (item && typeof item === 'object' ? item.name : '');
                    return String(existingName || '').trim().toLocaleLowerCase('es') === key;
                });
                if (!exists) {
                    world.locations.push({
                        name,
                        discoveredBy,
                        discoveredAt: new Date().toISOString()
                    });
                }
            });

            if (traversedRoute) {
                const from = String(traversedRoute.from || '').trim().slice(0, 120);
                const to = String(traversedRoute.to || '').trim().slice(0, 120);
                const ensureEndpoint = name => {
                    const key = name.toLocaleLowerCase('es');
                    const exists = world.locations.some(item => {
                        const existingName = typeof item === 'string'
                            ? item
                            : (item && typeof item === 'object' ? item.name : '');
                        return String(existingName || '').trim().toLocaleLowerCase('es') === key;
                    });
                    if (!exists) {
                        world.locations.push({
                            name,
                            discoveredBy,
                            discoveredAt: new Date().toISOString()
                        });
                    }
                };
                // Una conexión global debe publicar también sus dos extremos.
                // De lo contrario, el atlas de otro protagonista la filtra como ruta huérfana.
                if (from && to) {
                    ensureEndpoint(from);
                    ensureEndpoint(to);
                }
                const exists = from && to && world.connections.some(item =>
                    item && String(item.from || '').toLocaleLowerCase('es') === from.toLocaleLowerCase('es') &&
                    String(item.to || '').toLocaleLowerCase('es') === to.toLocaleLowerCase('es')
                );
                if (from && to && !exists) {
                    world.connections.push({ from, to, discoveredBy, discoveredAt: new Date().toISOString() });
                }
            }

            const people = adventure && adventure.state && adventure.state.characters;
            if (people && typeof people === 'object' && !Array.isArray(people)) {
                Object.entries(people).forEach(([fallbackName, person]) => {
                    if (!person || typeof person !== 'object' || Array.isArray(person)) return;
                    const name = String(person.name || fallbackName || '').trim().slice(0, 80);
                    if (!name || name.toLocaleLowerCase('es') === 'athun') return;
                    const key = name.toLocaleLowerCase('es');
                    if (Object.prototype.hasOwnProperty.call(world.entities, key)) return;
                    Object.defineProperty(world.entities, key, {
                        configurable: true,
                        enumerable: true,
                        writable: true,
                        value: {
                            name,
                            role: String(person.role || 'Personaje').trim().slice(0, 100),
                            firstKnownLocation: String(person.location || '').trim().slice(0, 120),
                            discoveredBy,
                            discoveredAt: new Date().toISOString()
                        }
                    });
                });
            }

            return Save.saveGlobalWorld(world);
        } catch (error) {
            console.error('No se pudieron publicar los descubrimientos del mundo compartido:', error);
            return false;
        }
    },

    syncMapKnowledge(state, character) {
        if (!state || typeof state !== 'object') return;
        const discovered = new Set([
            state.currentLocation,
            ...(Array.isArray(state.visibleLocations) ? state.visibleLocations : [])
        ]);
        discovered.forEach(location => {
            if (location) Save.addGlobalLocation(location, character && character.name);
        });
    },

    syncSharedEntities(adventure, character) {
        const people = adventure && adventure.state && adventure.state.characters;
        if (!people || typeof people !== 'object') return;
        Object.entries(people).forEach(([key, person]) => {
            if (!person || typeof person !== 'object') return;
            Save.addGlobalEntity({
                name: person.name || key,
                role: person.role,
                location: person.location
            }, character && character.name);
        });
    },

    getActions() {
        const saved = Save.load();
        return saved && Array.isArray(saved.actions) ? saved.actions : [];
    },

    getWorld() {
        return Save.getGlobalWorld();
    }
};

window.Session = Session;
