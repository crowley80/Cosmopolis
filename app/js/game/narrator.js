'use strict';

/*
 * Cliente local para llama-server. Si el servidor no está disponible o la
 * respuesta no cumple el contrato, conserva Director como alternativa.
 */
const Narrator = {
    endpoint: 'http://127.0.0.1:8081',
    healthCheckedAt: 0,
    healthAvailable: false,

    async isAvailable() {
        const now = Date.now();
        if (now - this.healthCheckedAt < 3000) return this.healthAvailable;

        this.healthCheckedAt = now;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 1800);

        try {
            const response = await fetch(this.endpoint + '/health', {
                method: 'GET',
                signal: controller.signal,
                cache: 'no-store'
            });
            this.healthAvailable = response.ok;
        } catch (error) {
            this.healthAvailable = false;
        } finally {
            clearTimeout(timeout);
        }

        return this.healthAvailable;
    },

    buildMessages(action, character, adventure, previousActions) {
        const state = adventure.state || {};
        const world = Session.getWorld();
        const history = previousActions.slice(-6).map(item => ({
            action: item.text || '',
            response: item.response || ''
        }));

        const context = {
            player: character,
            currentAdventure: {
                title: adventure.title || '',
                location: state.currentLocation || adventure.location || '',
                time: state.time || '',
                state,
                knownFacts: state.knownFacts || [],
                clues: state.clues || [],
                inventory: state.inventory || [],
                visitedLocations: state.visitedLocations || [],
                characters: state.characters || {}
            },
            persistentWorld: {
                facts: (world.facts || []).slice(-50),
                events: (world.events || []).slice(-20),
                relationships: world.relationships || {}
            },
            recentHistory: history,
            currentAction: action
        };

        return [
            {
                role: 'system',
                content: [
                    'Eres el director narrativo de Cosmópolis, una aventura de fantasía textual en español.',
                    'Responde como narrador literario: inmersivo, concreto, coherente y sin repetir fórmulas.',
                    'Respeta estrictamente los hechos, lugares, personajes, capacidades y consecuencias ya establecidos.',
                    'No decidas las intenciones del jugador ni fuerces una misión. Resuelve la acción que ha escrito.',
                    'No inventes que una acción ha tenido éxito si el contexto no lo justifica. Si algo es imposible o arriesgado, narra el intento y sus límites.',
                    'Los personajes conservan su personalidad, recuerdos y relaciones. No hagas aparecer personajes en lugares incompatibles.',
                    'No contradigas hechos conocidos ni alteres datos del personaje.',
                    'Devuelve únicamente el objeto JSON exigido por el esquema. Todo el texto narrativo debe estar en español.',
                    'reply: respuesta narrativa de 2 a 4 párrafos breves, con diálogos cuando proceda.',
                    'event: una frase factual que registre lo ocurrido.',
                    'location: ubicación actual; conserva la existente si no hay desplazamiento.',
                    'factsToAdd y cluesToAdd: solo datos nuevos realmente descubiertos, sin duplicados.',
                    'eliaTrustDelta: cambio justificado de confianza de Elia, normalmente -1, 0 o 1.',
                    'itemsToAdd: objetos que el personaje obtiene realmente y puede llevar consigo; no incluyas objetos solo vistos o examinados.',
                    'itemsToRemove: objetos que pierde, entrega, consume o deja atrás realmente; usa el nombre exacto del inventario.',
                    'charactersToAdd: personajes nuevos que realmente entran en escena; incluye nombre, función, ubicación, actitud y un primer recuerdo significativo. No añadas figurantes irrelevantes.',
                    'characterUpdates: cambios de ubicación o actitud de personajes ya registrados; conserva sus valores si no han cambiado y no muevas personajes sin motivo narrativo.',
                    'characterMemoriesToAdd: recuerdos concretos y duraderos de personajes que ya existen en el estado; no inventes personajes ni guardes detalles triviales.',
                    'time: momento del día dentro del mundo; no uses la hora real del teléfono y no avances el tiempo sin motivo narrativo.',
                    'day: número del día dentro de la aventura; solo aumenta cuando la historia cruza realmente al día siguiente. Nunca reduzcas el día ya alcanzado.'
                ].join(' ')
            },
            {
                role: 'user',
                content: JSON.stringify(context)
            }
        ];
    },

    async respond(action, character, adventure, previousActions = []) {
        const fallback = () => ({
            ...Director.respond(action, character, adventure, previousActions),
            aiUsed: false
        });

        if (!(await this.isAvailable())) return fallback();

        const schema = {
            type: 'object',
            additionalProperties: false,
            properties: {
                reply: { type: 'string' },
                event: { type: 'string' },
                category: {
                    type: 'string',
                    enum: ['dialogue', 'investigation', 'movement', 'combat', 'magic', 'stealth', 'offer', 'rest', 'object', 'other']
                },
                location: { type: 'string' },
                factsToAdd: { type: 'array', items: { type: 'string' } },
                cluesToAdd: { type: 'array', items: { type: 'string' } },
                eliaTrustDelta: { type: 'integer', minimum: -1, maximum: 1 },
                itemsToAdd: { type: 'array', items: { type: 'string' } },
                itemsToRemove: { type: 'array', items: { type: 'string' } },
                time: { type: 'string' },
                day: { type: 'integer', minimum: 1, maximum: 9999 },
                charactersToAdd: {
                    type: 'array',
                    items: {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                            name: { type: 'string' },
                            role: { type: 'string' },
                            location: { type: 'string' },
                            attitude: { type: 'string' },
                            memory: { type: 'string' }
                        },
                        required: ['name', 'role', 'location', 'attitude', 'memory']
                    }
                },
                characterUpdates: {
                    type: 'array',
                    items: {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                            character: { type: 'string' },
                            location: { type: 'string' },
                            attitude: { type: 'string' }
                        },
                        required: ['character', 'location', 'attitude']
                    }
                },
                characterMemoriesToAdd: {
                    type: 'array',
                    items: {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                            character: { type: 'string' },
                            memory: { type: 'string' }
                        },
                        required: ['character', 'memory']
                    }
                }
            },
            required: ['reply', 'event', 'category', 'location', 'factsToAdd', 'cluesToAdd', 'eliaTrustDelta', 'itemsToAdd', 'itemsToRemove', 'characterMemoriesToAdd', 'charactersToAdd', 'characterUpdates', 'time', 'day']
        };

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 90000);

        try {
            const response = await fetch(this.endpoint + '/v1/chat/completions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal,
                body: JSON.stringify({
                    model: 'local-model',
                    messages: this.buildMessages(action, character, adventure, previousActions),
                    response_format: { type: 'json_schema', schema },
                    temperature: 0.7,
                    top_p: 0.9,
                    max_tokens: 480,
                    stream: false
                })
            });

            if (!response.ok) throw new Error('llama-server respondió HTTP ' + response.status);

            const payload = await response.json();
            const content = payload && payload.choices &&
                payload.choices[0] && payload.choices[0].message &&
                payload.choices[0].message.content;

            if (typeof content !== 'string') throw new Error('Respuesta narrativa vacía');

            const result = JSON.parse(content);
            if (!result || typeof result.reply !== 'string' || !result.reply.trim() ||
                typeof result.event !== 'string' || typeof result.location !== 'string' ||
                !Array.isArray(result.factsToAdd) || !Array.isArray(result.cluesToAdd) ||
                !Array.isArray(result.itemsToAdd) || !Array.isArray(result.itemsToRemove) ||
                !Array.isArray(result.characterMemoriesToAdd) ||
                !Array.isArray(result.charactersToAdd) ||
                !Array.isArray(result.characterUpdates) ||
                typeof result.time !== 'string' || !Number.isInteger(result.day)) {
                throw new Error('La respuesta no cumple el formato narrativo');
            }

            const updated = JSON.parse(JSON.stringify(adventure));
            const state = updated.state || {};
            state.time = result.time.trim().slice(0, 60) || state.time || 'Mañana';
            const previousDay = Number.isInteger(Number(state.day))
                ? Math.max(1, Math.min(9999, Number(state.day)))
                : 1;
            state.day = Math.max(previousDay, Math.max(1, Math.min(9999, result.day)));
            state.currentLocation = result.location.trim().slice(0, 120) ||
                state.currentLocation || updated.location || 'Lugar desconocido';
            state.knownFacts = Array.isArray(state.knownFacts) ? state.knownFacts : [];
            state.clues = Array.isArray(state.clues) ? state.clues : [];
            state.events = Array.isArray(state.events) ? state.events : [];

            result.factsToAdd.slice(0, 5).forEach(fact => {
                if (typeof fact === 'string' && fact.trim() && !state.knownFacts.includes(fact.trim())) {
                    state.knownFacts.push(fact.trim().slice(0, 300));
                }
            });
            result.cluesToAdd.slice(0, 5).forEach(clue => {
                if (typeof clue === 'string' && clue.trim() && !state.clues.includes(clue.trim())) {
                    state.clues.push(clue.trim().slice(0, 300));
                }
            });

            state.inventory = Array.isArray(state.inventory) ? state.inventory : [];
            result.itemsToRemove.slice(0, 10).forEach(item => {
                if (typeof item !== 'string' || !item.trim()) return;
                const index = state.inventory.findIndex(existing =>
                    String(existing).toLocaleLowerCase('es') === item.trim().toLocaleLowerCase('es'));
                if (index !== -1) state.inventory.splice(index, 1);
            });
            result.itemsToAdd.slice(0, 10).forEach(item => {
                if (typeof item !== 'string' || !item.trim()) return;
                const clean = item.trim().slice(0, 120);
                if (!state.inventory.some(existing => String(existing).toLocaleLowerCase('es') === clean.toLocaleLowerCase('es')) && state.inventory.length < 50) {
                    state.inventory.push(clean);
                }
            });

            state.characters = state.characters && typeof state.characters === 'object' ? state.characters : {};
            result.charactersToAdd.slice(0, 5).forEach(entry => {
                if (!entry || typeof entry.name !== 'string' || !entry.name.trim()) return;
                const name = entry.name.trim().slice(0, 80);
                const exists = Object.keys(state.characters).some(key =>
                    key.toLocaleLowerCase('es') === name.toLocaleLowerCase('es') ||
                    String(state.characters[key] && state.characters[key].name || '').toLocaleLowerCase('es') === name.toLocaleLowerCase('es')
                );
                if (exists || Object.keys(state.characters).length >= 50) return;
                const memory = typeof entry.memory === 'string' ? entry.memory.trim().slice(0, 300) : '';
                state.characters[name] = {
                    name,
                    role: typeof entry.role === 'string' ? entry.role.trim().slice(0, 100) : 'Personaje',
                    location: typeof entry.location === 'string' ? entry.location.trim().slice(0, 120) : state.currentLocation,
                    attitude: typeof entry.attitude === 'string' ? entry.attitude.trim().slice(0, 100) : 'Desconocida',
                    trust: 0,
                    memories: memory ? [memory] : []
                };
            });
            result.characterUpdates.slice(0, 10).forEach(entry => {
                if (!entry || typeof entry.character !== 'string') return;
                const requestedName = entry.character.trim().toLocaleLowerCase('es');
                const key = Object.keys(state.characters).find(name =>
                    name.toLocaleLowerCase('es') === requestedName ||
                    String(state.characters[name] && state.characters[name].name || '').toLocaleLowerCase('es') === requestedName
                );
                if (!key) return;
                const person = state.characters[key];
                if (typeof entry.location === 'string' && entry.location.trim()) person.location = entry.location.trim().slice(0, 120);
                if (typeof entry.attitude === 'string' && entry.attitude.trim()) person.attitude = entry.attitude.trim().slice(0, 100);
            });

            result.characterMemoriesToAdd.slice(0, 5).forEach(entry => {
                if (!entry || typeof entry.character !== 'string' || typeof entry.memory !== 'string') return;
                const requestedName = entry.character.trim().toLocaleLowerCase('es');
                const key = Object.keys(state.characters).find(name =>
                    name.toLocaleLowerCase('es') === requestedName ||
                    String(state.characters[name] && state.characters[name].name || '').toLocaleLowerCase('es') === requestedName
                );
                const memory = entry.memory.trim().slice(0, 300);
                if (!key || !memory) return;
                const person = state.characters[key];
                person.memories = Array.isArray(person.memories) ? person.memories : [];
                if (!person.memories.some(item => String(item).toLocaleLowerCase('es') === memory.toLocaleLowerCase('es'))) {
                    person.memories.push(memory);
                    if (person.memories.length > 30) person.memories = person.memories.slice(-30);
                }
            });

            state.events.push(result.event.trim().slice(0, 300));
            if (state.events.length > 100) state.events = state.events.slice(-100);

            const delta = Math.max(-1, Math.min(1, Number(result.eliaTrustDelta) || 0));
            if (delta !== 0) {
                state.characters = state.characters || {};
                state.characters.Elia = state.characters.Elia || { trust: 0 };
                const trust = Number(state.characters.Elia.trust) || 0;
                state.characters.Elia.trust = Math.max(-5, Math.min(10, trust + delta));
                state.eliaTrust = state.characters.Elia.trust;
            }

            state.lastAction = action;
            state.actionCount = previousActions.length + 1;
            updated.state = state;
            updated.location = state.currentLocation;

            return {
                reply: result.reply.trim().slice(0, 5000),
                category: result.category || 'other',
                event: result.event.trim().slice(0, 300),
                adventure: updated,
                state,
                createdAt: new Date().toISOString(),
                actionNumber: previousActions.length + 1,
                aiUsed: true
            };
        } catch (error) {
            console.warn('Narrador local no disponible; se usa el director provisional:', error);
            this.healthAvailable = false;
            this.healthCheckedAt = Date.now();
            return fallback();
        } finally {
            clearTimeout(timeout);
        }
    }
};

window.Narrator = Narrator;
