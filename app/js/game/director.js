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

        state.characters = state.characters && typeof state.characters === 'object' ? state.characters : {};
        state.clues = Array.isArray(state.clues) ? state.clues : [];
        state.knownFacts = Array.isArray(state.knownFacts) ? state.knownFacts : [];
        state.events = Array.isArray(state.events) ? state.events : [];
        const currentLocation = state.currentLocation || adventure.location || '';
        const eliaEntry = Object.entries(state.characters).find(([key, person]) =>
            this.normalize(person && person.name || key) === 'elia'
        );
        const elia = eliaEntry ? eliaEntry[1] : null;
        const eliaKnown = !!elia && (
            state.eliaMet === true ||
            state.knownFacts.some(fact => /\belia\b/i.test(String(fact))) ||
            state.events.some(item => /\belia\b/i.test(String(item)))
        );
        const eliaPresent = !!elia && elia.location === currentLocation;
        if (elia) {
            state.eliaTrust = Number.isFinite(state.eliaTrust) ? state.eliaTrust : (Number(elia.trust) || 0);
            elia.trust = state.eliaTrust;
        }

        const number = previousActions.length + 1;

        let reply = '';
        let category = 'other';
        let event = '';
        const clues = state.clues || [];
        const facts = state.knownFacts || [];
        const atWell = currentLocation === 'Plaza del pozo' &&
            this.has(text, ['pozo', 'losa', 'cadenas', 'campana']);
        const aboutElia = eliaKnown &&
            this.has(text, ['elia', 'cartografa', 'mapa', 'hablar con ella']);
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
                person.location === currentLocation;
        });

        if (combat) {
            category = 'combat';
            reply = 'Tu acción rompe la quietud del lugar. Quienes están cerca retroceden, alarmados. El resultado de tu ataque aún no está claro.';
            event = `${name} ha recurrido a la violencia en ${currentLocation || 'el lugar'}.`;
        } else if (magic) {
            category = 'magic';
            if (atWell) {
                reply = 'Concentras tu poder hacia el viejo pozo. La cadena más cercana vibra durante un instante. Desde el fondo llega una respuesta: una campanada apagada, como si algo hubiera notado tu presencia. La losa no se mueve.';
                state.bellInvestigated = true;
                event = 'Una manifestación de poder ha provocado una respuesta desde el pozo.';
                if (!clues.includes('El pozo responde a la magia')) clues.push('El pozo responde a la magia');
            } else {
                reply = 'Tu poder se manifiesta en el lugar. La niebla se arremolina a tu alrededor y algunas personas se detienen para observar el fenómeno.';
                event = `${name} ha utilizado sus poderes en Valdebruma.`;
            }
        } else if (aboutElia && asks) {
            category = 'dialogue';
            if (!eliaPresent) {
                reply = 'Elia no está aquí. Puedes buscarla en el lugar donde la viste por última vez.';
            } else {
                const eliaGoal = typeof elia.personalGoal === 'string' ? elia.personalGoal.trim() : '';
                const goalDisclosure = eliaGoal ? `\n\n—Y no pienso dejarlo hasta conseguirlo: ${eliaGoal}` : '';
                reply = 'Elia aprieta el tubo de mapas contra el pecho.\n\n—He medido este pueblo durante años. El pozo no tiene profundidad suficiente para producir un sonido así. Y hay algo más: cada vez que suena la campana, aparece una marca nueva en mis mapas. Una calle que no existe, un edificio que nadie recuerda...\n\nTe mira con atención.\n\n—Si quieres ayudarme, podemos examinar el pozo o revisar mis mapas.' + goalDisclosure;
                state.eliaTrust = Math.min(10, state.eliaTrust + 1);
                elia.trust = state.eliaTrust;
                event = `${name} ha hablado con Elia sobre la campana y los mapas.`;
                if (!facts.includes('Elia afirma que los mapas cambian cuando suena la campana.')) {
                    facts.push('Elia afirma que los mapas cambian cuando suena la campana.');
                }
            }
        } else if (aboutElia) {
            category = 'dialogue';
            reply = eliaPresent
                ? 'Elia está junto al brocal del pozo, sujetando su tubo de mapas. Parece dispuesta a escucharte, aunque no deja de mirar de reojo las cadenas.'
                : 'No ves a Elia en este lugar. Su última ubicación registrada es ' + (elia.location || 'desconocida') + '.';
            event = `${name} se ha dirigido a Elia.`;
        } else if (atWell && investigates) {
            category = 'investigation';
            state.wellInspected = true;
            state.bellInvestigated = true;
            reply = 'Te acercas al pozo y examinas la losa. Las cadenas están oxidadas, pero algunos eslabones presentan arañazos recientes. En la piedra descubres tres símbolos casi borrados: una montaña, una puerta y una línea ondulada que podría representar agua... o sonido.' +
                (eliaPresent ? '\n\nElia se agacha a tu lado.\n\n—Eso no estaba ahí ayer —murmura.' : '');
            if (!clues.includes('Tres símbolos grabados en la losa')) clues.push('Tres símbolos grabados en la losa');
            if (!facts.includes('La losa presenta arañazos recientes y tres símbolos.')) facts.push('La losa presenta arañazos recientes y tres símbolos.');
            event = 'Se han descubierto tres símbolos y arañazos recientes en la losa.';
        } else if (atWell && opens) {
            category = 'object';
            if (state.wellInspected) {
                reply = 'Tiras de las cadenas y pruebas a mover la losa. El metal protesta con un chirrido, pero el cierre resiste. No parece una simple tapa: alguien la aseguró para que no pudiera abrirse fácilmente. Necesitarás encontrar otra manera.';
            } else {
                reply = 'Te dispones a mover la losa, pero las cadenas están tensas y el cierre no cede. Antes de forzarlo quizá convendría examinarlo.' +
                    (eliaPresent ? ' Elia te observa con evidente inquietud.' : '');
            }
            event = `${name} ha intentado abrir el pozo.`;
        } else if (atWell) {
            category = 'investigation';
            reply = 'El viejo pozo ocupa el centro de la plaza. La losa está sellada con cadenas y la piedra del brocal está húmeda, aunque no ha llovido. Desde el fondo llega un silencio extraño, como si el pozo estuviera esperando.';
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
            reply = 'Un vecino que barre la entrada de una tienda murmura que la campana empezó a sonar después de una tormenta, hace tres semanas. Cuando intentas preguntarle más, finge no haberte oído.';
            if (!facts.includes('Un vecino relaciona el comienzo de las campanadas con una tormenta de hace tres semanas.')) {
                facts.push('Un vecino relaciona el comienzo de las campanadas con una tormenta de hace tres semanas.');
            }
            event = `${name} ha preguntado por los sucesos de Valdebruma.`;
        } else if (moves) {
            category = 'movement';
            if (this.has(text, ['posada', 'taberna', 'meson'])) {
                state.currentLocation = 'La Posada del Tejón';
                reply = 'Dejas atrás la plaza y llegas a la Posada del Tejón, un edificio bajo con ventanas empañadas. Dentro huele a sopa, madera húmeda y conversaciones interrumpidas. La posadera te mira como si estuviera intentando recordar si ya te ha visto.';
            } else if (this.has(text, ['calle', 'mercado', 'tiendas'])) {
                state.currentLocation = 'Calle Mayor';
                reply = 'Te adentras en la Calle Mayor. Los comerciantes siguen atendiendo sus puestos, aunque todos parecen evitar mencionar el pozo. Una campanilla de tienda suena y tres personas se sobresaltan al mismo tiempo.';
            } else if (this.has(text, ['elia', 'pozo', 'plaza'])) {
                state.currentLocation = 'Plaza del pozo';
                reply = elia && elia.location === 'Plaza del pozo'
                    ? 'Regresas a la plaza. Elia sigue junto al pozo, revisando unas notas en un papel doblado. Al verte, levanta la mirada.'
                    : 'Regresas a la plaza. Los vecinos continúan con sus tareas y el pozo ocupa el centro del lugar.';
            } else {
                reply = 'Te desplazas por Valdebruma y te alejas de la plaza. Las calles ascienden entre casas de piedra y pequeños comercios. La niebla hace difícil distinguir qué camino conduce a la parte alta del pueblo.';
                state.currentLocation = 'Calles de Valdebruma';
            }
            event = `${name} se ha desplazado a ${state.currentLocation}.`;
        } else if (stealth) {
            category = 'stealth';
            reply = 'Te mueves con cuidado, procurando no llamar la atención. Desde tu posición observas el entorno sin que quienes están cerca reparen demasiado en ti.';
            event = `${name} ha actuado con sigilo en ${state.currentLocation}.`;
        } else if (offers) {
            category = 'offer';
            if (addressedCharacter) {
                const [targetKey, target] = addressedCharacter;
                target.trust = Math.max(-5, Math.min(10, (Number(target.trust) || 0) + 1));
                if (this.normalize(targetKey) === 'elia') state.eliaTrust = target.trust;
                reply = `${target.name || targetKey} acepta tu gesto con una pequeña muestra de gratitud.`;
                event = `${name} ha ofrecido ayuda a ${target.name || targetKey}.`;
            } else {
                reply = 'Tu ofrecimiento queda en el aire. Nadie parece tener claro todavía si va dirigido a alguien en particular.';
                event = `${name} ha ofrecido ayuda en ${currentLocation || 'el lugar'}.`;
            }
        } else if (rests) {
            category = 'rest';
            reply = 'Te tomas un momento para descansar. El lugar continúa con su actividad habitual mientras recuperas el aliento.';
            event = `${name} ha descansado en ${state.currentLocation}.`;
        } else if (investigates) {
            category = 'investigation';
            reply = 'Observas con atención lo que te rodea. Reparas en los detalles del lugar, los sonidos cercanos y el comportamiento de quienes comparten esta escena. Todavía no tienes información suficiente para sacar conclusiones sobre lo que ocurre más allá de lo que percibes.';
            event = `${name} ha investigado los alrededores.`;
        } else {
            category = 'other';
            reply = 'Llevas a cabo tu acción. El mundo no se detiene para darte una respuesta automática: quienes están cerca continúan con sus asuntos, aunque algunas miradas se dirigen hacia ti. Tendrás que observar qué efecto tiene tu decisión en esta situación.';
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
