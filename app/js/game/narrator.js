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

    filterVisibleLocations(candidates, reply, adventure, world = Session.getWorld()) {
        const state = adventure && adventure.state && typeof adventure.state === 'object'
            ? adventure.state
            : {};
        const knownNames = [
            adventure && adventure.title,
            adventure && adventure.location,
            state.currentLocation,
            ...(Array.isArray(state.visitedLocations) ? state.visitedLocations : []),
            ...(Array.isArray(state.visibleLocations) ? state.visibleLocations : []),
            ...(Array.isArray(world && world.locations) ? world.locations.map(item =>
                typeof item === 'string' ? item : item && item.name
            ) : [])
        ];
        const normalize = value => String(value || '')
            .toLocaleLowerCase('es')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, ' ')
            .trim();
        const groundedText = ' ' + normalize([
            reply,
            adventure && adventure.text,
            ...knownNames
        ].filter(Boolean).join(' ')) + ' ';
        const accepted = [];
        const seen = new Set();

        (Array.isArray(candidates) ? candidates : []).slice(0, 24).forEach(candidate => {
            if (typeof candidate !== 'string') return;
            const name = candidate.trim().slice(0, 120);
            const key = normalize(name);
            if (!key || seen.has(key) || !groundedText.includes(' ' + key + ' ')) return;
            seen.add(key);
            accepted.push(name);
        });

        return accepted.slice(0, 12);
    },

    resolveCurrentLocation(result, adventure) {
        const state = adventure && adventure.state && typeof adventure.state === 'object'
            ? adventure.state
            : {};
        const current = String(state.currentLocation || adventure && adventure.location || 'Lugar desconocido')
            .trim().slice(0, 120);
        const requested = typeof result.location === 'string' ? result.location.trim().slice(0, 120) : '';
        if (!requested) return current;

        const normalize = value => String(value || '')
            .toLocaleLowerCase('es')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, ' ')
            .trim();
        if (normalize(requested) === normalize(current)) return current;

        // El modelo no puede teletransportar al protagonista al cambiar un campo JSON:
        // el desplazamiento debe estar clasificado como tal y narrado explícitamente.
        if (result.category !== 'movement') return current;
        const reply = ' ' + normalize(result.reply) + ' ';
        if (!reply.includes(' ' + normalize(requested) + ' ')) return current;
        return requested;
    },

    filterAutonomousActions(entries, reply, state) {
        const characters = state && state.characters && typeof state.characters === 'object'
            ? state.characters
            : {};
        const currentLocation = String(state && state.currentLocation || '').trim();
        const normalize = value => String(value || '')
            .toLocaleLowerCase('es')
            .normalize('NFD')
            .replace(/[\\u0300-\\u036f]/g, '')
            .replace(/\\s+/g, ' ')
            .trim();
        const narrated = normalize(reply);
        const accepted = [];

        (Array.isArray(entries) ? entries : []).slice(0, 2).forEach(entry => {
            if (!entry || typeof entry.character !== 'string' || typeof entry.action !== 'string') return;
            const requestedName = normalize(entry.character);
            const key = Object.keys(characters).find(name =>
                normalize(name) === requestedName ||
                normalize(characters[name] && characters[name].name) === requestedName
            );
            if (!key) return;
            const person = characters[key];
            if (person.location && currentLocation && normalize(person.location) !== normalize(currentLocation)) return;
            const action = entry.action.trim().slice(0, 220);
            const normalizedAction = normalize(action);
            if (!normalizedAction || !narrated.includes(normalizedAction)) return;
            if (normalize(person.lastAutonomousAction) === normalizedAction) return;
            accepted.push({ character: key, action });
        });

        return accepted;
    },

    filterGoalUpdates(entries, state) {
        const characters = state && state.characters && typeof state.characters === 'object'
            ? state.characters
            : {};
        const statuses = new Set(['active', 'progress', 'blocked', 'completed']);
        const accepted = [];
        const normalize = value => String(value || '')
            .toLocaleLowerCase('es')
            .normalize('NFD')
            .replace(/[\\u0300-\\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, ' ')
            .trim();

        (Array.isArray(entries) ? entries : []).slice(0, 2).forEach(entry => {
            if (!entry || typeof entry.character !== 'string' ||
                typeof entry.goal !== 'string' || typeof entry.reason !== 'string' ||
                !statuses.has(entry.status)) return;
            const requestedName = normalize(entry.character);
            const key = Object.keys(characters).find(name =>
                normalize(name) === requestedName ||
                normalize(characters[name] && characters[name].name) === requestedName
            );
            const goal = entry.goal.trim().slice(0, 240);
            const reason = entry.reason.trim().slice(0, 200);
            if (!key || !goal || !reason) return;
            accepted.push({ character: key, goal, status: entry.status, reason });
        });

        return accepted;
    },

    deriveAthunRelationship(athun) {
        const bond = Number.isFinite(Number(athun && athun.bond))
            ? Math.max(-100, Math.min(100, Number(athun.bond))) : 0;
        let trustTone = 'cauteloso';
        if (bond <= -25) trustTone = 'distante y a la defensiva';
        else if (bond >= 60) trustTone = 'profundamente familiar, sin ser incondicional';
        else if (bond >= 25) trustTone = 'familiar y dispuesto a confiar con prudencia';

        const history = (Array.isArray(athun && athun.bondHistory) ? athun.bondHistory : [])
            .filter(entry => entry && Number.isInteger(entry.delta) && entry.delta >= -1 &&
                entry.delta <= 1 && typeof entry.reason === 'string' && entry.reason.trim())
            .slice(-6);
        const movement = history.reduce((sum, entry) => sum + entry.delta, 0);
        let recentMovement = 'estable';
        if (movement >= 2) recentMovement = 'se está abriendo poco a poco';
        else if (movement <= -2) recentMovement = 'se está replegando y necesita cautela';

        return {
            trustTone,
            recentMovement,
            relationshipAnchors: history.slice(-3).map(entry => entry.reason.trim().slice(0, 180)),
            sharedMemoryAnchors: (Array.isArray(athun && athun.memories) ? athun.memories : [])
                .filter(item => typeof item === 'string' && item.trim())
                .slice(-3).map(item => item.trim().slice(0, 180))
        };
    },

    buildMessages(action, character, adventure, previousActions) {
        const state = adventure.state || {};
        const world = Session.getWorld();
        const activeSave = Save.load() || {};
        const personalWorld = activeSave.world || {};
        const history = previousActions.slice(-6).map(item => ({
            action: item.text || '',
            response: item.response || ''
        }));

        const shortList = (value, count, maxLength = 240) =>
            (Array.isArray(value) ? value : [])
                .slice(-count)
                .map(item => typeof item === 'string' ? item.slice(0, maxLength) : item);

        const athunState = state.athun && typeof state.athun === 'object' ? state.athun : {};
        const athunContext = {
            bond: Number.isFinite(Number(athunState.bond)) ? Math.max(-100, Math.min(100, Number(athunState.bond))) : 0,
            memories: (Array.isArray(athunState.memories) ? athunState.memories : [])
                .filter(item => typeof item === 'string' && item.trim()).slice(-12).map(item => item.trim().slice(0, 240)),
            revelations: (Array.isArray(athunState.revelations) ? athunState.revelations : [])
                .filter(item => typeof item === 'string' && item.trim()).slice(-12).map(item => item.trim().slice(0, 240)),
            bondHistory: (Array.isArray(athunState.bondHistory) ? athunState.bondHistory : [])
                .slice(-12)
                .map(entry => ({
                    delta: Number.isInteger(entry && entry.delta) ? Math.max(-1, Math.min(1, entry.delta)) : 0,
                    reason: typeof (entry && entry.reason) === 'string' ? entry.reason.trim().slice(0, 240) : ''
                }))
                .filter(entry => entry.reason)
        };
        const athunRelationship = this.deriveAthunRelationship(athunContext);
        const currentLocation = state.currentLocation || adventure.location || '';
        const allCharacters = Object.entries(state.characters || {});
        // Elia puede existir en los datos de la aventura antes de que el protagonista la conozca.
        // No debe filtrarse al contexto del modelo hasta que el encuentro quede registrado.
        const playerKnowsElia = state.eliaMet === true;
        const isAvailableToNarrator = ([key]) =>
            key.toLocaleLowerCase('es') !== 'elia' || playerKnowsElia;
        const nearby = allCharacters.filter(entry =>
            isAvailableToNarrator(entry) &&
            entry[1] && entry[1].location && entry[1].location === currentLocation
        );
        const elia = allCharacters.filter(([key]) =>
            playerKnowsElia && key.toLocaleLowerCase('es') === 'elia'
        );
        const recent = allCharacters.filter(isAvailableToNarrator).slice(-20).reverse();
        const selectedCharacters = [];
        [...nearby, ...elia, ...recent].forEach(entry => {
            if (!selectedCharacters.some(([key]) => key === entry[0]) && selectedCharacters.length < 20) {
                selectedCharacters.push(entry);
            }
        });
        const cleanText = (value, maxLength) =>
            typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
        const cleanTextList = (value, count, maxLength) =>
            (Array.isArray(value) ? value : [])
                .filter(item => typeof item === 'string' && item.trim())
                .slice(-count)
                .map(item => item.trim().slice(0, maxLength));
        const compactCharacters = Object.fromEntries(selectedCharacters.map(([key, person]) => [
            key,
            {
                name: cleanText(person.name, 80) || key.slice(0, 80),
                role: cleanText(person.role, 100),
                location: cleanText(person.location, 120),
                attitude: cleanText(person.attitude, 120),
                personalGoal: cleanText(person.personalGoal, 240),
                goalStatus: ['active', 'progress', 'blocked', 'completed'].includes(person.goalStatus)
                    ? person.goalStatus
                    : 'active',
                trust: Number.isFinite(Number(person.trust))
                    ? Math.max(-5, Math.min(10, Number(person.trust)))
                    : 0,
                lastAutonomousAction: cleanText(person.lastAutonomousAction, 220),
                memories: cleanTextList(person.memories, 8, 180),
                goalHistory: (Array.isArray(person.goalHistory) ? person.goalHistory : [])
                    .slice(-5)
                    .filter(entry => entry && typeof entry.goal === 'string' && entry.goal.trim())
                    .map(entry => ({
                        goal: entry.goal.trim().slice(0, 240),
                        status: ['active', 'progress', 'blocked', 'completed'].includes(entry.status) ? entry.status : 'active',
                        reason: cleanText(entry.reason, 240)
                    })),
                completedGoals: (Array.isArray(person.completedGoals) ? person.completedGoals : [])
                    .slice(-8)
                    .filter(entry => entry && typeof entry.goal === 'string' && entry.goal.trim())
                    .map(entry => ({
                        goal: entry.goal.trim().slice(0, 240),
                        reason: cleanText(entry.reason, 240)
                    }))
            }
        ]));

        const knownCharacterNames = new Set(selectedCharacters.map(([key]) => key.toLocaleLowerCase('es')));
        const sharedEntities = Object.fromEntries(Object.entries(world.entities || {})
            .filter(([key, entity]) => {
                const name = String(entity && entity.name || key).toLocaleLowerCase('es');
                return knownCharacterNames.has(name);
            })
            .slice(-30)
            .map(([key, entity]) => [
                key,
                {
                    name: String(entity.name || key).slice(0, 80),
                    role: String(entity.role || '').slice(0, 100),
                    firstKnownLocation: String(entity.firstKnownLocation || '').slice(0, 120)
                }
            ]));

        const compactState = {
            ...state,
            athun: athunContext,
            events: shortList(state.events, 20),
            knownFacts: shortList(state.knownFacts, 25),
            clues: shortList(state.clues, 25),
            inventory: shortList(state.inventory, 30, 120),
            visitedLocations: shortList(state.visitedLocations, 25, 120),
            visibleLocations: shortList(state.visibleLocations, 12, 120),
            characters: compactCharacters
        };

        const compactPlayer = {
            name: String(character.name || 'Viajero').slice(0, 100),
            nature: String(character.nature || '').slice(0, 400),
            appearance: String(character.appearance || '').slice(0, 400),
            history: String(character.history || '').slice(0, 600),
            abilities: String(character.abilities || '').slice(0, 400),
            personality: String(character.personality || '').slice(0, 400)
        };

        const context = {
            player: compactPlayer,
            athunRelationship,
            currentAdventure: {
                title: String(adventure.title || '').slice(0, 160),
                location: currentLocation,
                time: String(state.time || '').slice(0, 60),
                athun: athunContext,
                state: compactState
            },
            persistentWorld: {
                locations: shortList(world.locations, 30),
                entities: sharedEntities,
                facts: shortList(world.facts, 25),
                events: shortList(world.events, 12),
                relationships: Object.fromEntries(Object.entries(world.relationships || {}).slice(-20))
            },
            personalWorld: {
                facts: shortList(personalWorld.facts, 25),
                events: shortList(personalWorld.events, 12),
                relationships: Object.fromEntries(Object.entries(personalWorld.relationships || {}).slice(-20))
            },
            recentHistory: history.slice(-6).map(item => ({
                action: String(item.action || '').slice(0, 500),
                response: String(item.response || '').slice(0, 900)
            })),
            currentAction: String(action || '').slice(0, 1200)
        };

        return [
            {
                role: 'system',
                content: [
                    'Eres el director narrativo de Athun: el grimorio oscuro, una aventura de fantasía textual en español.',
                    'Responde como narrador literario: inmersivo, concreto, coherente y sin repetir fórmulas.',
                    'Athun es un grimorio consciente que acompaña al protagonista desde el comienzo y figura siempre en su inventario. Puede tener voluntad, personalidad y reaccionar de forma sutil cuando sea narrativamente apropiado, pero no debe hablar ni intervenir en cada acción.',
                    'Athun es permanente e inseparable: nunca puede perderse, ser robado, vendido, intercambiado, transferido, regalado, abandonado, destruido, consumido ni retirado de la partida. Si el jugador intenta hacerlo, no narres que la acción tiene éxito ni alteres su pertenencia; explica con naturalidad por qué Athun permanece con él y continúa la escena.',
                    'Athun contiene un conocimiento extraordinario, pero su historia, sus motivos, sus recuerdos y la naturaleza de su vínculo con este protagonista se descubren gradualmente. No reveles esos secretos por iniciativa propia ni confundas el conocimiento del grimorio con lo que sabe el personaje.',
                    'La apertura de Valdebruma comienza en el Camino de entrada a Valdebruma, durante una mañana tranquila. Al principio el personaje solo sabe que ha llegado a un pueblo situado en un valle entre montañas. No conoce todavía a Elia, no sabe nada de una campana ni de un pozo y no debe recibir pistas sobre ellos hasta descubrirlos mediante sus acciones.',
                    'Respeta el estado phase y los descubrimientos registrados. No adelantes acontecimientos, personajes, lugares ni misterios que no hayan aparecido en escena o sido descubiertos.',
                    'Respeta los límites de conocimiento del personaje jugador: separa lo que percibe directamente de lo que deduce o sospecha, y no presentes como conocido lo que aún ignora.',
                    'No reveles pensamientos privados, identidades ocultas, causas secretas ni sucesos ocurridos fuera de su percepción salvo que una fuente fiable ya se los haya comunicado o descubierto.',
                    'Cuando una información sea incierta, exprésala como indicio, hipótesis, rumor o sospecha; nunca conviertas una conjetura en un hecho confirmado.',
                    'Si el jugador examina algo, describe primero señales observables y permite que las conclusiones dependan de las pistas disponibles y de sus capacidades.',
                    'El mundo persistente es compartido entre protagonistas: usa sus localizaciones y entidades como referencias comunes. No traslades recuerdos, confianza, objetivos ni relaciones personales de un protagonista a otro; esos datos pertenecen a cada partida.',
                    'personalWorld contiene hechos, acontecimientos y relaciones exclusivos de la partida activa: consúltalos para mantener su continuidad, pero nunca los trates como hechos universales ni los transfieras a otro protagonista.',
                    'athun contiene el vínculo, recuerdos, revelaciones e historial de cambios del grimorio exclusivos de esta partida. athunRelationship resume de forma orientativa el tono de confianza, la tendencia reciente y algunos motivos/recuerdos compartidos: deja que matice sutilmente la elección de palabras, la iniciativa y la vulnerabilidad de Athun cuando tenga sentido. La tendencia no es una emoción obligatoria ni una personalidad fija; una sola acción no debe producir un giro brusco. Prioriza siempre los hechos concretos y los recuerdos de esta partida, permite contradicciones humanas y cambios graduales, y no repitas mecánicamente sus motivos. No inventes recuerdos, no los atribuyas a otro protagonista ni reveles secretos antes de tiempo. Su conocimiento extraordinario no significa que deba intervenir en cada acción.',
                    'Si una entidad ya figura en el registro compartido, conserva su identidad y función; no crees un duplicado con otro nombre salvo que la historia establezca claramente que se trata de otra persona.',
                    'Respeta estrictamente los hechos, lugares, personajes, capacidades y consecuencias ya establecidos.',
                    'No decidas las intenciones del jugador ni fuerces una misión. Resuelve la acción que ha escrito.',
                    'No inventes que una acción ha tenido éxito si el contexto no lo justifica. Si algo es imposible o arriesgado, narra el intento y sus límites.',
                    'Los personajes conservan su personalidad, recuerdos y relaciones. No hagas aparecer personajes en lugares incompatibles.',
                    'No contradigas hechos conocidos ni alteres datos del personaje.',
                    'Devuelve únicamente el objeto JSON exigido por el esquema. Todo el texto narrativo debe estar en español.',
                    'reply: respuesta narrativa de 2 a 4 párrafos breves, con diálogos cuando proceda.',
                    'event: una frase factual que registre lo ocurrido.',
                    'location: ubicación actual; conserva la existente si no hay desplazamiento.',
                    'visibleLocations: lugares que el personaje puede ver claramente desde su posición actual. Recalcula la lista en cada respuesta; incluye solo nombres explícitos del contexto o de la escena, nunca inventes lugares, rutas ni coordenadas. No incluyas destinos lejanos ni sitios solo conocidos por rumores. Usa una lista vacía si no hay otros lugares visibles.',
                    'factsToAdd y cluesToAdd: solo datos nuevos realmente descubiertos, sin duplicados.',
                    'relationshipChanges: cambios justificados de confianza hacia personajes registrados, con character, delta entre -1 y 1 y reason breve. Usa cambios pequeños y no alteres relaciones sin una interacción significativa.',
                    'itemsToAdd: objetos que el personaje obtiene realmente y puede llevar consigo; no incluyas objetos solo vistos o examinados.',
                    'itemsToRemove: objetos que pierde, entrega, consume o deja atrás realmente; usa el nombre exacto del inventario.',
                    'charactersToAdd: personajes nuevos que realmente entran en escena; incluye nombre, función, ubicación, actitud y un primer recuerdo significativo. No añadas figurantes irrelevantes.',
                    'characterUpdates: cambios de ubicación o actitud de personajes ya registrados; conserva sus valores si no han cambiado y no muevas personajes sin motivo narrativo.',
                    'characterActions: pequeñas iniciativas autónomas de personajes que ya están presentes en la ubicación actual. Sus objetivos personales deben influir de forma visible y natural en lo que hacen: pueden investigar algo relacionado, pedir ayuda, proteger un interés o reaccionar ante un obstáculo. Narra esas iniciativas dentro de reply como parte continua de la escena, con gestos y transiciones naturales; nunca como una lista, ficha o nota separada. El campo characterActions es solo el registro estructurado de esas acciones ya narradas. No repitas la misma iniciativa ni fuerces avances; máximo dos acciones visibles, coherentes con personalidad, recuerdos y objetivo. No cambies su ubicación con este campo, no inventes sucesos fuera de escena y usa una acción vacía si nadie actúa.',
                    'personalGoal: cada personaje puede tener un objetivo propio, breve y concreto, que refleje deseos, problemas o motivaciones. Ten en cuenta su objetivo actual al decidir cómo habla y actúa.',
                    'goalUpdates: actualiza como máximo dos objetivos de personajes registrados solo cuando los hechos justifiquen un cambio, avance, bloqueo o resolución. Incluye character, goal, status y reason. status debe ser active, progress, blocked o completed; conserva el objetivo si solo cambia su estado. Consulta también completedGoals: no propongas como nuevo un objetivo ya archivado ni repitas una meta cumplida, salvo que un hecho nuevo aporte una motivación o consecuencia concreta que cambie su sentido. Un objetivo completed queda cerrado: no lo reactives ni lo sustituyas salvo que exista una nueva motivación o consecuencia concreta en los hechos, eventos o recuerdos. Solo entonces propone un objetivo distinto con status active, explica en reason qué hecho demuestra que el anterior se cumplió y por qué nace el nuevo. Nunca sustituyas un objetivo todavía activo, en progreso o bloqueado por otro; primero debe resolverse. No inventes avances ni cambies objetivos sin causa; usa una lista vacía si no hay cambios.',
                    'characterMemoriesToAdd: recuerdos concretos y duraderos de personajes que ya existen en el estado; no inventes personajes ni guardes detalles triviales.',
                    'athunMemoriesToAdd: hasta tres recuerdos duraderos y concretos que el protagonista y Athun hayan vivido juntos en esta partida; no conviertas acciones triviales en recuerdos ni inventes experiencias.',
                    'athunRevelationsToAdd: hasta tres descubrimientos nuevos y demostrados sobre la historia, naturaleza o motivos de Athun; no inventes secretos ni adelantes revelaciones que no hayan ocurrido en la escena. Usa una lista vacía si no procede.',
                    'athunBondChange: delta entero entre -1 y 1 y motivo breve; solo cambia el vínculo si la acción del protagonista afecta de forma significativa a la confianza o relación con Athun. Usa delta 0 si no hay cambio.',
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

    applyAthunUpdates(state, result) {
        if (!state || typeof state !== 'object' || !result || typeof result !== 'object') return;
        if (!state.athun || typeof state.athun !== 'object') {
            state.athun = { id: 'athun', name: 'Athun', kind: 'Grimorio consciente', permanent: true, bond: 0, memories: [], revelations: [], bondHistory: [] };
        }
        const athun = state.athun;
        athun.permanent = true;
        const numericBond = Number(athun.bond);
        athun.bond = Number.isFinite(numericBond) ? Math.max(-100, Math.min(100, numericBond)) : 0;
        const cleanEntries = entries => (Array.isArray(entries) ? entries : [])
            .filter(entry => typeof entry === 'string' && entry.trim())
            .map(entry => entry.trim().slice(0, 300))
            .slice(-40);
        athun.memories = cleanEntries(athun.memories);
        athun.revelations = cleanEntries(athun.revelations);
        athun.bondHistory = (Array.isArray(athun.bondHistory) ? athun.bondHistory : [])
            .filter(entry => entry && Number.isInteger(entry.delta) && entry.delta >= -1 && entry.delta <= 1 &&
                typeof entry.reason === 'string' && entry.reason.trim())
            .slice(-30)
            .map(entry => ({ delta: entry.delta, reason: entry.reason.trim().slice(0, 240) }));
        const appendUnique = (target, entries) => {
            (Array.isArray(entries) ? entries : []).slice(0, 3).forEach(entry => {
                if (typeof entry !== 'string') return;
                const clean = entry.trim().slice(0, 300);
                if (!clean || target.some(item => String(item).toLocaleLowerCase('es') === clean.toLocaleLowerCase('es'))) return;
                target.push(clean);
            });
            if (target.length > 40) target.splice(0, target.length - 40);
        };
        appendUnique(athun.memories, result.athunMemoriesToAdd);
        appendUnique(athun.revelations, result.athunRevelationsToAdd);
        const change = result.athunBondChange;
        if (change && Number.isInteger(change.delta) && change.delta >= -1 && change.delta <= 1) {
            const current = Number.isFinite(Number(athun.bond)) ? Number(athun.bond) : 0;
            const next = Math.max(-100, Math.min(100, current + change.delta));
            const appliedDelta = next - current;
            athun.bond = next;
            const reason = typeof change.reason === 'string' ? change.reason.trim().slice(0, 240) : '';
            if (appliedDelta !== 0 && reason) {
                const last = athun.bondHistory[athun.bondHistory.length - 1];
                if (!last || last.delta !== appliedDelta || last.reason.toLocaleLowerCase('es') !== reason.toLocaleLowerCase('es')) {
                    athun.bondHistory.push({ delta: appliedDelta, reason });
                    if (athun.bondHistory.length > 30) athun.bondHistory.splice(0, athun.bondHistory.length - 30);
                }
            }
        }
    },

    applyInventoryUpdates(state, result) {
        if (!state || typeof state !== 'object' || !result || typeof result !== 'object') return;
        state.inventory = Array.isArray(state.inventory) ? state.inventory : [];

        (Array.isArray(result.itemsToRemove) ? result.itemsToRemove : []).slice(0, 10).forEach(item => {
            if (typeof item !== 'string' || !item.trim()) return;
            // Athun nunca puede perderse, venderse, transferirse ni destruirse.
            if (item.trim().toLocaleLowerCase('es').includes('athun')) return;
            const index = state.inventory.findIndex(existing =>
                String(existing).toLocaleLowerCase('es') === item.trim().toLocaleLowerCase('es'));
            if (index !== -1 && !String(state.inventory[index]).toLocaleLowerCase('es').includes('athun')) {
                state.inventory.splice(index, 1);
            }
        });

        (Array.isArray(result.itemsToAdd) ? result.itemsToAdd : []).slice(0, 10).forEach(item => {
            if (typeof item !== 'string' || !item.trim()) return;
            const clean = item.trim().slice(0, 120);
            // El narrador no puede crear copias de Athun.
            if (clean.toLocaleLowerCase('es').includes('athun')) return;
            if (!state.inventory.some(existing => String(existing).toLocaleLowerCase('es') === clean.toLocaleLowerCase('es')) && state.inventory.length < 50) {
                state.inventory.push(clean);
            }
        });

        if (!state.inventory.some(item => String(item).toLocaleLowerCase('es').includes('athun'))) {
            state.inventory.unshift('Athun — grimorio consciente');
        }
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
                visibleLocations: { type: 'array', items: { type: 'string' } },
                factsToAdd: { type: 'array', items: { type: 'string' } },
                cluesToAdd: { type: 'array', items: { type: 'string' } },
                relationshipChanges: {
                    type: 'array',
                    items: {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                            character: { type: 'string' },
                            delta: { type: 'integer', minimum: -1, maximum: 1 },
                            reason: { type: 'string' }
                        },
                        required: ['character', 'delta', 'reason']
                    }
                },
                itemsToAdd: { type: 'array', items: { type: 'string' } },
                itemsToRemove: { type: 'array', items: { type: 'string' } },
                athunMemoriesToAdd: { type: 'array', items: { type: 'string' } },
                athunRevelationsToAdd: { type: 'array', items: { type: 'string' } },
                athunBondChange: {
                    type: 'object', additionalProperties: false,
                    properties: { delta: { type: 'integer', minimum: -1, maximum: 1 }, reason: { type: 'string' } },
                    required: ['delta', 'reason']
                },
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
                            memory: { type: 'string' },
                            goal: { type: 'string' }
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
                goalUpdates: {
                    type: 'array',
                    items: {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                            character: { type: 'string' },
                            goal: { type: 'string' },
                            status: { type: 'string', enum: ['active', 'progress', 'blocked', 'completed'] },
                            reason: { type: 'string' }
                        },
                        required: ['character', 'goal', 'status', 'reason']
                    }
                },
                characterActions: {
                    type: 'array',
                    items: {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                            character: { type: 'string' },
                            action: { type: 'string' }
                        },
                        required: ['character', 'action']
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
            required: ['reply', 'event', 'category', 'location', 'visibleLocations', 'factsToAdd', 'cluesToAdd', 'relationshipChanges', 'itemsToAdd', 'itemsToRemove', 'athunMemoriesToAdd', 'athunRevelationsToAdd', 'athunBondChange', 'characterMemoriesToAdd', 'charactersToAdd', 'characterUpdates', 'characterActions', 'goalUpdates', 'time', 'day']
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
                !Array.isArray(result.visibleLocations) ||
                !Array.isArray(result.factsToAdd) || !Array.isArray(result.cluesToAdd) ||
                !Array.isArray(result.itemsToAdd) || !Array.isArray(result.itemsToRemove) ||
                !Array.isArray(result.athunMemoriesToAdd) || !Array.isArray(result.athunRevelationsToAdd) ||
                !result.athunBondChange || typeof result.athunBondChange !== 'object' ||
                !Number.isInteger(result.athunBondChange.delta) || result.athunBondChange.delta < -1 || result.athunBondChange.delta > 1 ||
                !Array.isArray(result.characterMemoriesToAdd) ||
                !Array.isArray(result.charactersToAdd) ||
                !Array.isArray(result.characterUpdates) || !Array.isArray(result.characterActions) ||
                !Array.isArray(result.goalUpdates) ||
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
            state.currentLocation = this.resolveCurrentLocation(result, updated);
            if (state.phase === 'arrival' && state.currentLocation !== 'Camino de entrada a Valdebruma') {
                state.phase = 'exploration';
            }
            // No se acepta una zona visible que no esté nombrada en la escena
            // o respaldada por el conocimiento real de esta partida/mundo.
            state.visibleLocations = this.filterVisibleLocations(
                result.visibleLocations,
                result.reply,
                updated,
                Session.getWorld()
            );
            state.knownFacts = Array.isArray(state.knownFacts) ? state.knownFacts : [];
            state.clues = Array.isArray(state.clues) ? state.clues : [];
            state.events = Array.isArray(state.events) ? state.events : [];

            result.factsToAdd.slice(0, 5).forEach(fact => {
                if (typeof fact === 'string' && fact.trim() && !state.knownFacts.includes(fact.trim())) {
                    const cleanFact = fact.trim().slice(0, 300);
                    state.knownFacts.push(cleanFact);
                    const normalizedFact = cleanFact.toLocaleLowerCase('es');
                    if (normalizedFact.includes('pozo')) state.wellDiscovered = true;
                    if (normalizedFact.includes('campana')) state.bellDiscovered = true;
                }
            });
            result.cluesToAdd.slice(0, 5).forEach(clue => {
                if (typeof clue === 'string' && clue.trim() && !state.clues.includes(clue.trim())) {
                    state.clues.push(clue.trim().slice(0, 300));
                }
            });

            this.applyInventoryUpdates(state, result);
            if (!state.athun || typeof state.athun !== 'object') {
                state.athun = { id: 'athun', name: 'Athun', kind: 'Grimorio consciente', permanent: true, bond: 0, memories: [], revelations: [], bondHistory: [] };
            }
            state.athun.permanent = true;
            this.applyAthunUpdates(state, result);

            state.characters = state.characters && typeof state.characters === 'object' ? state.characters : {};
            result.charactersToAdd.slice(0, 5).forEach(entry => {
                if (!entry || typeof entry.name !== 'string' || !entry.name.trim()) return;
                const name = entry.name.trim().slice(0, 80);
                if (name.toLocaleLowerCase('es') === 'elia') {
                    state.eliaMet = true;
                    state.eliaTrust = Number(state.eliaTrust) || 0;
                }
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
                    personalGoal: typeof entry.goal === 'string' ? entry.goal.trim().slice(0, 240) : '',
                    goalStatus: 'active',
                    goalHistory: [],
                    completedGoals: [],
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

            this.filterGoalUpdates(result.goalUpdates, state).forEach(entry => {
                if (!entry || typeof entry.character !== 'string' ||
                    typeof entry.goal !== 'string' || typeof entry.reason !== 'string') return;
                const requestedName = entry.character.trim().toLocaleLowerCase('es');
                const key = Object.keys(state.characters).find(name =>
                    name.toLocaleLowerCase('es') === requestedName ||
                    String(state.characters[name] && state.characters[name].name || '').toLocaleLowerCase('es') === requestedName
                );
                const goal = entry.goal.trim().slice(0, 240);
                const status = entry.status;
                const reason = entry.reason;
                if (!key || !goal) return;
                const person = state.characters[key];
                const previousGoal = typeof person.personalGoal === 'string' ? person.personalGoal.trim() : '';
                const previousStatus = ['active', 'progress', 'blocked', 'completed'].includes(person.goalStatus) ? person.goalStatus : 'active';
                const sameGoal = previousGoal.toLocaleLowerCase('es') === goal.toLocaleLowerCase('es');
                const actionNumber = previousActions.length + 1;
                person.goalHistory = Array.isArray(person.goalHistory) ? person.goalHistory : [];
                person.completedGoals = Array.isArray(person.completedGoals) ? person.completedGoals : [];

                // Un objetivo cumplido es inmutable; solo puede abrirse otro distinto como nueva etapa.
                if (previousStatus === 'completed') {
                    if (sameGoal || status !== 'active') return;
                    const alreadyArchived = person.completedGoals.some(item =>
                        item && typeof item.goal === 'string' &&
                        item.goal.toLocaleLowerCase('es') === previousGoal.toLocaleLowerCase('es')
                    );
                    if (previousGoal && !alreadyArchived) {
                        const completion = [...person.goalHistory].reverse().find(item =>
                            item && item.status === 'completed' &&
                            String(item.goal || '').toLocaleLowerCase('es') === previousGoal.toLocaleLowerCase('es')
                        );
                        person.completedGoals.push({
                            goal: previousGoal,
                            reason: completion && completion.reason || reason,
                            completedAtAction: completion && completion.changedAtAction || actionNumber
                        });
                    }
                } else if (previousGoal && !sameGoal) {
                    // No se abandona una meta pendiente por otra propuesta por el modelo.
                    return;
                } else if (previousStatus !== 'active' && status === 'active') {
                    // Evita retrocesos de estado; un bloqueo se retoma como progreso.
                    return;
                }

                if (sameGoal && previousStatus === status) return;
                if (status === 'completed' && previousGoal && !person.completedGoals.some(item =>
                    item && typeof item.goal === 'string' &&
                    item.goal.toLocaleLowerCase('es') === previousGoal.toLocaleLowerCase('es')
                )) {
                    person.completedGoals.push({ goal: previousGoal, reason, completedAtAction: actionNumber });
                }
                if (person.completedGoals.length > 20) person.completedGoals = person.completedGoals.slice(-20);

                person.personalGoal = goal;
                person.goalStatus = status;
                person.goalHistory.push({ goal, status, reason, changedAtAction: actionNumber });
                if (person.goalHistory.length > 10) person.goalHistory = person.goalHistory.slice(-10);
                if (reason) {
                    person.memories = Array.isArray(person.memories) ? person.memories : [];
                    const note = `Su objetivo (${status}) es: ${goal}. Motivo: ${reason}`;
                    if (!person.memories.some(memory => String(memory).toLocaleLowerCase('es') === note.toLocaleLowerCase('es'))) {
                        person.memories.push(note);
                        if (person.memories.length > 30) person.memories = person.memories.slice(-30);
                    }
                }
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

            const autonomousActions = this.filterAutonomousActions(
                result.characterActions,
                result.reply,
                state
            );
            autonomousActions.forEach(({ character: key, action: actionText }) => {
                const person = state.characters[key];
                person.lastAutonomousAction = actionText;
                person.memories = Array.isArray(person.memories) ? person.memories : [];
                if (!person.memories.some(memory =>
                    typeof memory === 'string' && memory.toLocaleLowerCase('es') === actionText.toLocaleLowerCase('es')
                )) {
                    person.memories.push(actionText);
                    if (person.memories.length > 30) person.memories = person.memories.slice(-30);
                }
            });

            state.events.push(result.event.trim().slice(0, 300));
            if (state.events.length > 100) state.events = state.events.slice(-100);

            result.relationshipChanges.slice(0, 10).forEach(change => {
                if (!change || typeof change.character !== 'string' ||
                    !Number.isInteger(change.delta) || change.delta < -1 || change.delta > 1) return;

                const requestedName = change.character.trim().toLocaleLowerCase('es');
                const key = Object.keys(state.characters).find(name =>
                    name.toLocaleLowerCase('es') === requestedName ||
                    String(state.characters[name] && state.characters[name].name || '').toLocaleLowerCase('es') === requestedName
                );
                if (!key || change.delta === 0) return;

                const person = state.characters[key];
                const currentTrust = Number.isFinite(Number(person.trust))
                    ? Number(person.trust)
                    : 0;
                person.trust = Math.max(-5, Math.min(10, currentTrust + change.delta));

                const reason = typeof change.reason === 'string' ? change.reason.trim().slice(0, 240) : '';
                if (reason) {
                    person.memories = Array.isArray(person.memories) ? person.memories : [];
                    if (!person.memories.some(memory => String(memory).toLocaleLowerCase('es') === reason.toLocaleLowerCase('es'))) {
                        person.memories.push(reason);
                        if (person.memories.length > 30) person.memories = person.memories.slice(-30);
                    }
                }

                if (key.toLocaleLowerCase('es') === 'elia') {
                    state.eliaTrust = person.trust;
                }
            });

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
                visibleLocations: state.visibleLocations,
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
