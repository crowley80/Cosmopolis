'use strict';

const Session = {
    startNewAdventure(character, adventure) {
        try {
            const previous = localStorage.getItem(Save.key);

            if (previous) {
                const archiveKey = 'cosmopolis_archive_' + new Date().toISOString().replace(/[:.]/g, '-');
                localStorage.setItem(archiveKey, previous);

                if (localStorage.getItem(archiveKey) !== previous) {
                    return false;
                }
            }

            return Save.replace({
                character,
                adventure,
                actions: [],
                world: {
                    events: [],
                    facts: [],
                    relationships: {}
                }
            });
        } catch (error) {
            console.error('No se pudo archivar la partida anterior:', error);
            return false;
        }
    },

    addAction(action, response = '', details = {}) {
        const saved = Save.load();

        if (!saved || !saved.character || !saved.adventure) {
            return false;
        }

        saved.actions.push({
            text: action,
            response,
            category: details.category || 'other',
            createdAt: new Date().toISOString()
        });

        saved.adventure = details.adventure || saved.adventure;
        saved.adventure.state = saved.adventure.state || {};
        const currentLocation = saved.adventure.state.currentLocation || saved.adventure.location;
        saved.adventure.state.visitedLocations = Array.isArray(saved.adventure.state.visitedLocations)
            ? saved.adventure.state.visitedLocations
            : [];
        if (currentLocation && !saved.adventure.state.visitedLocations.includes(currentLocation)) {
            saved.adventure.state.visitedLocations.push(currentLocation);
        }
        saved.adventure.state.inventory = Array.isArray(saved.adventure.state.inventory)
            ? saved.adventure.state.inventory
            : [];
        saved.world = saved.world || {};
        saved.world.events = Array.isArray(saved.world.events) ? saved.world.events : [];
        saved.world.facts = Array.isArray(saved.world.facts) ? saved.world.facts : [];
        saved.world.events.push({
            description: details.event || action,
            category: details.category || 'other',
            actionNumber: saved.actions.length,
            createdAt: new Date().toISOString()
        });

        if (saved.world.events.length > 100) {
            saved.world.events = saved.world.events.slice(-100);
        }

        const normalized = String(action).toLowerCase();
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

        if (saved.world.facts.length > 50) {
            saved.world.facts = saved.world.facts.slice(-50);
        }

        return Save.save(saved);
    },

    getActions() {
        const saved = Save.load();
        return saved && Array.isArray(saved.actions) ? saved.actions : [];
    },

    getWorld() {
        const saved = Save.load();
        return saved && saved.world ? saved.world : {
            events: [],
            facts: [],
            relationships: {}
        };
    }
};

window.Session = Session;
