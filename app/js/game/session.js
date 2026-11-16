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
        if (previousLocation && currentLocation && currentLocation !== previousLocation) {
            // Solo una respuesta narrativa explícita puede definir la nueva visibilidad.
            state.visibleLocations = Array.isArray(details.visibleLocations)
                ? details.visibleLocations.filter(name => typeof name === 'string' && name.trim()).slice(0, 12)
                : [];
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

        if (traversedRoute) {
            // Solo una respuesta clasificada como desplazamiento confirma un tramo recorrido.
            Save.addGlobalConnection(traversedRoute.from, traversedRoute.to, saved.character.name);
        }
        this.syncMapKnowledge(state, saved.character);
        this.syncSharedEntities(saved.adventure, saved.character);
        return true;
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
