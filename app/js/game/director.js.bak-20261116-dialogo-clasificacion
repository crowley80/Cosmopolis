'use strict';

const Director = {
    normalize(value) {
        return String(value || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    },

    has(text, words) {
        return words.some(word => text.includes(word));
    },

    respond(action, character, adventure, previousActions = []) {
        const text = this.normalize(action);
        const name = character.name || 'Viajero';
        const state = JSON.parse(JSON.stringify(adventure.state || {}));

        state.characters = state.characters || {};
        if (state.characters.Elia) {
            state.eliaTrust = Number.isFinite(state.eliaTrust)
                ? state.eliaTrust
                : (Number(state.characters.Elia.trust) || 0);
            state.characters.Elia.trust = state.eliaTrust;
        }

        state.clues = Array.isArray(state.clues) ? state.clues : [];
        state.knownFacts = Array.isArray(state.knownFacts) ? state.knownFacts : [];
        state.events = Array.isArray(state.events) ? state.events : [];

        const number = previousActions.length + 1;

        let reply = '';
        let category = 'other';
        let event = '';
        const clues = state.clues || [];
        const facts = state.knownFacts || [];
        const knownFactsText = facts.join(' ').toLocaleLowerCase('es');
        const eliaKnown = state.eliaMet === true && !!state.characters.Elia;
        const wellKnown = state.wellDiscovered === true || knownFactsText.includes('pozo');
        const bellKnown = state.bellDiscovered === true || knownFactsText.includes('campana');
        const atWell = wellKnown && this.has(text, ['pozo', 'losa', 'cadenas', 'campana']);
        const aboutElia = eliaKnown && this.has(text, ['elia', 'cartografa', 'mapa', 'hablar con ella']);
        const asks = this.has(text, ['pregunto', 'preguntar', 'quien', 'que sabes', 'cuentame', 'explica', 'dime']);
        const investigates = this.has(text, ['examino', 'observo', 'investigo', 'inspecciono', 'miro', 'escucho', 'analizo', 'busco', 'registro']);
        const moves = this.has(text, ['camino', 'voy', 'entro', 'salgo', 'me acerco', 'me alejo', 'exploro', 'subo', 'bajo', 'me dirijo']);
        const magic = this.has(text, ['magia', 'hechizo', 'conjuro', 'invoco', 'runa', 'encanto', 'poder']);
        const combat = this.has(text, ['ataco', 'golpeo', 'lucho', 'disparo', 'apuñalo', 'combato']);
        const stealth = this.has(text, ['escondo', 'oculto', 'sigilosamente', 'me cuelo', 'acecho']);
        const offers = this.has(text, ['ofrezco', 'regalo', 'entrego', 'comparto', 'ayudo', 'protejo']);
        const opens = this.has(text, ['abro', 'rompo', 'levanto', 'quito', 'desato', 'fuerzo']);
        const rests = this.has(text, ['descanso', 'duermo', 'espero', 'me siento']);
        const addressedCharacter = Object.entries(state.characters).find(([key, person]) => {
            const personName = this.normalize(person && person.name || key);
            return person && personName && text.includes(personName) &&
                person.location === state.currentLocation && personName !== 'elia';
        });

        if (state.phase === 'arrival') {
            if (moves || this.has(text, ['entrar', 'pueblo', 'alojamiento', 'habitantes', 'primeras calles'])) {
                state.phase = 'exploration';
                state.currentLocation = 'Primeras calles de Valdebruma';
                category = 'movement';
                reply = 'Sigues el camino principal hasta las primeras calles. Las casas se encuentran más cerca unas de otras y el sonido cotidiano del pueblo va sustituyendo al silencio de las montañas. Puedes recorrer las calles, buscar un lugar donde alojarte o acercarte a alguien que esté disponible para hablar.';
                event = `${name} ha entrado en Valdebruma.`;
            } else if (investigates) {
                category = 'investigation';
                reply = 'Te detienes a observar el valle y el camino. La carreta continúa hacia el pueblo, alguien termina de recoger leña junto a una casa y una conversación llega desde una ventana abierta. No percibes nada que exija tu atención inmediata.';
                event = `${name} ha observado el camino de entrada a Valdebruma.`;
            } else if (asks || this.has(text, ['hablo', 'converso', 'saludo', 'carretero', 'recoge leña', 'persona que recoge', 'vecino'])) {
                category = 'dialogue';
                state.phase = 'exploration';
                if (!state.characters.Vecino) {
                    state.characters.Vecino = {
                        name: 'Vecino',
                        role: 'Habitante de Valdebruma',
                        location: state.currentLocation,
                        attitude: 'Cordial',
                        personalGoal: '',
                        goalStatus: 'active',
                        goalHistory: [],
                        completedGoals: [],
                        trust: 0,
                        memories: ['Ha visto llegar al viajero por el camino de entrada.']
                    };
                }
                reply = 'Te acercas a la persona que está recogiendo leña junto a una de las casas. Al verte, deja el haz de ramas en el suelo y te saluda con naturalidad.\n\n—Buenos días. ¿Acabas de llegar? Si buscas algo en el pueblo, quizá pueda orientarte.';
                event = `${name} ha hablado con un habitante en el camino de entrada a Valdebruma.`;
            } else if (rests) {
                category = 'rest';
                reply = 'Te tomas un momento para contemplar el valle. La mañana avanza con calma y el camino sigue abierto ante ti.';
                event = `${name} ha descansado en el camino de entrada a Valdebruma.`;
            } else {
                category = magic ? 'magic' : (combat ? 'combat' : 'other');
                reply = magic
                    ? 'La magia responde a tu voluntad y se manifiesta brevemente en el aire frío de la montaña. El camino y el pueblo permanecen tranquilos.'
                    : combat
                        ? 'Tu movimiento brusco altera la calma del camino. La carreta se detiene un instante y quien recoge leña vuelve la cabeza, sorprendido.'
                        : 'La mañana sigue su curso. El camino desciende hasta las primeras calles de Valdebruma y nada te obliga a apresurarte.';
                event = `${name} ha actuado en el camino de entrada a Valdebruma.`;
            }
        } else if (combat) {
            category = 'combat';
            reply = 'Tu acción altera la actividad de quienes se encuentran cerca. Algunas personas se apartan con cautela, pendientes de lo que hagas a continuación.';
            event = `${name} ha recurrido a la violencia en ${state.currentLocation}.`;
        } else if (magic) {
            category = 'magic';
            if (atWell) {
                reply = 'Concentras tu poder hacia el viejo pozo. La cadena más cercana vibra durante un instante. Desde el fondo llega una respuesta: una campanada apagada, como si algo hubiera notado tu presencia. La losa no se mueve.';
                state.bellInvestigated = true;
                state.bellDiscovered = true;
                state.bellRings = Math.max(1, Number(state.bellRings) || 0);
                const bellFact = 'El pozo ha respondido a la magia con un sonido parecido a una campanada.';
                if (!facts.includes(bellFact)) facts.push(bellFact);
                event = 'Una manifestación de poder ha provocado una respuesta desde el pozo.';
                if (!clues.includes('El pozo responde a la magia')) clues.push('El pozo responde a la magia');
            } else {
                reply = 'Tu poder se manifiesta en el lugar. El aire se altera durante un instante y quienes se encuentran cerca reparan en el fenómeno.';
                event = `${name} ha utilizado sus poderes en Valdebruma.`;
            }
        } else if (aboutElia && asks) {
            category = 'dialogue';
            const eliaGoal = typeof state.characters.Elia.personalGoal === 'string' ? state.characters.Elia.personalGoal.trim() : '';
            const goalDisclosure = eliaGoal ? `\n\n—Y no pienso dejarlo hasta conseguirlo: ${eliaGoal}` : '';
            reply = 'Elia aprieta el tubo de mapas contra el pecho.\n\n—He medido este pueblo durante años. El pozo no tiene profundidad suficiente para producir un sonido así. Y hay algo más: cada vez que suena la campana, aparece una marca nueva en mis mapas. Una calle que no existe, un edificio que nadie recuerda...\n\nTe mira con atención.\n\n—Si quieres ayudarme, podemos examinar el pozo o revisar mis mapas.' + goalDisclosure;
            state.eliaTrust += 1;
            state.characters.Elia.trust = state.eliaTrust;
            event = `${name} ha hablado con Elia sobre la campana y los mapas.`;
            if (!facts.includes('Elia afirma que los mapas cambian cuando suena la campana.')) {
                facts.push('Elia afirma que los mapas cambian cuando suena la campana.');
            }
        } else if (aboutElia) {
            category = 'dialogue';
            reply = 'Elia está junto al brocal del pozo, sujetando su tubo de mapas. Parece dispuesta a escucharte, aunque no deja de mirar de reojo las cadenas.';
            event = `${name} se ha dirigido a Elia.`;
        } else if (atWell && investigates) {
            category = 'investigation';
            state.wellInspected = true;
            state.wellInspected = true;
            reply = 'Te acercas al pozo y examinas la piedra con detenimiento. La superficie está desgastada por el tiempo y descubres tres símbolos casi borrados: una montaña, una puerta y una línea ondulada que podría representar agua. No encuentras todavía una explicación para ellos.';
            if (!clues.includes('Tres símbolos grabados en el pozo')) clues.push('Tres símbolos grabados en el pozo');
            if (!facts.includes('El pozo presenta tres símbolos casi borrados.')) facts.push('El pozo presenta tres símbolos casi borrados.');
            event = 'Se han descubierto tres símbolos casi borrados en el pozo.';
        } else if (atWell && opens) {
            category = 'object';
            if (state.wellInspected) {
                reply = 'Tiras de las cadenas y pruebas a mover la losa. El metal protesta con un chirrido, pero el cierre resiste. No parece una simple tapa: alguien la aseguró para que no pudiera abrirse fácilmente. Necesitarás encontrar otra manera.';
            } else {
                reply = eliaKnown
                    ? 'Te dispones a mover la losa, pero las cadenas están tensas y el cierre no cede. Elia te observa con evidente inquietud.'
                    : 'Te dispones a mover la losa, pero las cadenas están tensas y el cierre no cede. Quizá convendría examinarlo antes de forzarlo.';
            }
            event = `${name} ha intentado abrir el pozo.`;
        } else if (atWell) {
            category = 'investigation';
            reply = bellKnown
                ? 'El viejo pozo ocupa el centro de la plaza. La losa está sellada y desde el fondo llega aquel sonido apagado que ya has oído.'
                : 'El viejo pozo ocupa el centro de la plaza. La piedra del brocal está desgastada por el uso y la intemperie. No adviertes nada más fuera de lo corriente.';
            event = `${name} ha prestado atención al pozo.`;
        } else if (addressedCharacter) {
            category = 'dialogue';
            const [npcKey, npc] = addressedCharacter;
            const npcGoal = typeof npc.personalGoal === 'string' ? npc.personalGoal.trim() : '';
            const goalStatus = ['active', 'progress', 'blocked', 'completed'].includes(npc.goalStatus) ? npc.goalStatus : 'active';
            const goalLead = {
                active: 'Mi objetivo ahora es este:',
                progress: 'Estoy avanzando hacia este objetivo:',
                blocked: 'Mi objetivo sigue siendo este, aunque ahora tengo un obstáculo:',
                completed: 'He conseguido cumplir este objetivo:'
            }[goalStatus];
            reply = npcGoal
                ? `${npcKey} te escucha con cautela.\n\n—${goalLead} ${npcGoal}.`
                : `${npcKey} te escucha con cautela, aunque parece medir cuidadosamente lo que está dispuesto a contarte.`;
            event = `${name} ha conversado con ${npcKey}.`;
        } else if (asks) {
            category = 'dialogue';
            if (bellKnown) {
                reply = 'Preguntas a quienes se encuentran cerca. Las respuestas son imprecisas y no todos parecen dispuestos a hablar de lo ocurrido; por ahora solo puedes distinguir rumores de hechos comprobados.';
                event = `${name} ha preguntado por los rumores de Valdebruma.`;
            } else {
                reply = 'Preguntas a quienes encuentras por asuntos cotidianos del pueblo. Te responden con naturalidad: algunos hablan del trabajo, otros de las tiendas y de cómo ha cambiado el tiempo. Todavía no surge ningún asunto que parezca preocupar especialmente a la gente.';
                event = `${name} ha conversado con habitantes de Valdebruma.`;
            }
        } else if (moves) {
            category = 'movement';
            if (this.has(text, ['posada', 'taberna', 'meson'])) {
                state.currentLocation = 'La Posada del Tejón';
                reply = 'Dejas atrás la plaza y llegas a la Posada del Tejón, un edificio bajo con ventanas empañadas. Dentro huele a sopa, madera húmeda y conversaciones interrumpidas. La posadera te mira como si estuviera intentando recordar si ya te ha visto.';
            } else if (this.has(text, ['calle', 'mercado', 'tiendas'])) {
                state.currentLocation = 'Calle Mayor';
                reply = 'Te adentras en la Calle Mayor. Los comerciantes atienden sus puestos, los vecinos hacen sus compras y varias conversaciones se mezclan con el ruido habitual de la actividad diaria.';
            } else if (this.has(text, ['elia'])) {
                if (eliaKnown) {
                    state.currentLocation = state.characters.Elia.location || state.currentLocation;
                    reply = 'Te diriges al lugar donde viste a Elia por última vez.';
                } else {
                    reply = 'No conoces a nadie llamado Elia. Si buscas a alguien, tendrás que preguntar por los habitantes que encuentres o recorrer el pueblo.';
                }
            } else if (this.has(text, ['pozo', 'plaza'])) {
                state.currentLocation = 'Plaza del pozo';
                state.wellDiscovered = true;
                if (!facts.includes('Hay un viejo pozo de piedra en la plaza de Valdebruma.')) {
                    facts.push('Hay un viejo pozo de piedra en la plaza de Valdebruma.');
                }
                reply = 'Llegas a la plaza de Valdebruma. Entre las construcciones que la rodean distingues un viejo pozo de piedra. No sabes nada especial sobre él; por ahora es solo un elemento más del pueblo.';
            } else {
                reply = 'Te desplazas por Valdebruma y te alejas de la plaza. Las calles ascienden entre casas de piedra y pequeños comercios. La niebla hace difícil distinguir qué camino conduce a la parte alta del pueblo.';
                state.currentLocation = 'Calles de Valdebruma';
            }
            event = `${name} se ha desplazado a ${state.currentLocation}.`;
        } else if (stealth) {
            category = 'stealth';
            reply = 'Te mueves con cuidado, procurando no llamar la atención. Desde tu posición observas la actividad cercana sin que nadie parezca reparar demasiado en ti.';
            event = `${name} ha actuado con sigilo en ${state.currentLocation}.`;
        } else if (offers) {
            category = 'offer';
            if (eliaKnown) {
                state.eliaTrust = (Number(state.eliaTrust) || 0) + 1;
                state.characters.Elia.trust = state.eliaTrust;
                reply = 'Elia acepta tu gesto con una pequeña sonrisa.\n\n—Gracias. No abundan las personas que se ofrecen a ayudar sin pedir primero una explicación completa.';
            } else {
                reply = 'Tu ofrecimiento es recibido con agradecimiento por quienes se encuentran cerca. La gente del pueblo parece valorar los gestos amables.';
            }
            event = `${name} ha ofrecido ayuda en Valdebruma.`;
        } else if (rests) {
            category = 'rest';
            reply = 'Te tomas un momento para descansar. La actividad cotidiana continúa a tu alrededor.';
            event = `${name} ha descansado en ${state.currentLocation}.`;
        } else if (investigates) {
            category = 'investigation';
            reply = 'Observas con atención lo que te rodea. Reparas en los detalles de las casas, los comercios y las personas que siguen con sus tareas. Aún no tienes motivos para pensar que el pueblo esconda algo fuera de lo común.';
            event = `${name} ha investigado los alrededores.`;
        } else {
            category = 'other';
            reply = 'Llevas a cabo tu acción. El mundo continúa a tu alrededor y las personas cercanas siguen con sus asuntos, aunque algunas reparan en ti con curiosidad.';
            event = `${name} ha realizado una acción en ${state.currentLocation}.`;
        }

        state.clues = clues;
        state.knownFacts = facts;
        state.events = state.events || [];
        state.events.push(event);
        state.lastAction = action;
        state.actionCount = number;

        const updatedAdventure = {
            ...adventure,
            state,
            location: state.currentLocation
        };

        return {
            reply,
            category,
            event,
            adventure: updatedAdventure,
            state,
            createdAt: new Date().toISOString(),
            actionNumber: number
        };
    }
};

window.Director = Director;
