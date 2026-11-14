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
                    'eliaTrustDelta: cambio justificado de confianza de Elia, normalmente -1, 0 o 1.'
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
                eliaTrustDelta: { type: 'integer', minimum: -1, maximum: 1 }
            },
            required: ['reply', 'event', 'category', 'location', 'factsToAdd', 'cluesToAdd', 'eliaTrustDelta']
        };

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 180000);

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
                !Array.isArray(result.factsToAdd) || !Array.isArray(result.cluesToAdd)) {
                throw new Error('La respuesta no cumple el formato narrativo');
            }

            const updated = JSON.parse(JSON.stringify(adventure));
            const state = updated.state || {};
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
