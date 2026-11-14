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
        state.characters.Elia = state.characters.Elia || { trust: 0 };
        state.eliaTrust = Number.isFinite(state.eliaTrust)
            ? state.eliaTrust
            : (Number(state.characters.Elia.trust) || 0);
        state.characters.Elia.trust = state.eliaTrust;

        state.clues = Array.isArray(state.clues) ? state.clues : [];
        state.knownFacts = Array.isArray(state.knownFacts) ? state.knownFacts : [];
        state.events = Array.isArray(state.events) ? state.events : [];

        const number = previousActions.length + 1;

        let reply = '';
        let category = 'other';
        let event = '';
        const clues = state.clues || [];
        const facts = state.knownFacts || [];
        const atWell = this.has(text, ['pozo', 'losa', 'cadenas', 'campana']);
        const knowsElia = state.eliaMet === true || facts.some(fact => this.normalize(fact).includes('elia'));
        const aboutElia = this.has(text, ['elia', 'cartografa', 'mapa', 'hablar con ella']);
        const asks = this.has(text, ['pregunto', 'preguntar', 'quien', 'que sabes', 'cuentame', 'explica', 'dime']);
        const investigates = this.has(text, ['examino', 'observo', 'investigo', 'inspecciono', 'miro', 'escucho', 'analizo', 'busco', 'registro']);
        const moves = this.has(text, ['camino', 'voy', 'entro', 'salgo', 'me acerco', 'me alejo', 'exploro', 'subo', 'bajo', 'me dirijo']);
        const magic = this.has(text, ['magia', 'hechizo', 'conjuro', 'invoco', 'runa', 'encanto', 'poder']);
        const combat = this.has(text, ['ataco', 'golpeo', 'lucho', 'disparo', 'apuñalo', 'combato']);
        const stealth = this.has(text, ['escondo', 'oculto', 'sigilosamente', 'me cuelo', 'acecho']);
        const offers = this.has(text, ['ofrezco', 'regalo', 'entrego', 'comparto', 'ayudo', 'protejo']);
        const opens = this.has(text, ['abro', 'rompo', 'levanto', 'quito', 'desato', 'fuerzo']);
        const rests = this.has(text, ['descanso', 'duermo', 'espero', 'me siento']);

        if (combat) {
            category = 'combat';
            reply = 'Tu acción rompe la quietud del lugar. Quienes están cerca reaccionan con alarma. Tendrás que observar qué consecuencias tiene tu decisión.';
            event = `${name} ha recurrido a la violencia en ${state.currentLocation}.`;
        } else if (magic) {
            category = 'magic';
            if (atWell) {
                reply = 'Concentras tu poder hacia el viejo pozo. La cadena más cercana vibra durante un instante. Desde el fondo llega una respuesta: una campanada apagada, como si algo hubiera notado tu presencia. La losa no se mueve.';
                state.bellInvestigated = true;
                event = 'Una manifestación de poder ha provocado una respuesta desde el pozo.';
                if (!clues.includes('El pozo responde a la magia')) clues.push('El pozo responde a la magia');
            } else {
                reply = 'Tu poder se manifiesta a tu alrededor. El aire parece agitarse durante un instante, aunque todavía no puedes determinar si ha provocado algún efecto.';
                event = `${name} ha utilizado sus poderes en Valdebruma.`;
            }
        } else if (aboutElia && asks) {
            state.eliaMet = true;
            category = 'dialogue';
            reply = 'Elia aprieta el tubo de mapas contra el pecho.\n\n—He medido este pueblo durante años. El pozo no tiene profundidad suficiente para producir un sonido así. Y hay algo más: cada vez que suena la campana, aparece una marca nueva en mis mapas. Una calle que no existe, un edificio que nadie recuerda...\n\nTe mira con atención.\n\n—Si quieres ayudarme, podemos examinar el pozo o revisar mis mapas.';
            state.eliaTrust += 1;
            state.characters.Elia.trust = state.eliaTrust;
            event = `${name} ha hablado con Elia sobre la campana y los mapas.`;
            if (!facts.includes('Elia afirma que los mapas cambian cuando suena la campana.')) {
                facts.push('Elia afirma que los mapas cambian cuando suena la campana.');
            }
        } else if (aboutElia) {
            state.eliaMet = true;
            category = 'dialogue';
            reply = 'Elia está junto al brocal del pozo, sujetando su tubo de mapas. Parece dispuesta a escucharte, aunque no deja de mirar de reojo las cadenas.';
            event = `${name} se ha dirigido a Elia.`;
        } else if (atWell && investigates) {
            category = 'investigation';
            state.wellInspected = true;
            state.bellInvestigated = true;
            reply = 'Te acercas al pozo y examinas la losa. Las cadenas están oxidadas, pero algunos eslabones presentan arañazos recientes. En la piedra descubres tres símbolos casi borrados: una montaña, una puerta y una línea ondulada que podría representar agua... o sonido.';
            if (!clues.includes('Tres símbolos grabados en la losa')) clues.push('Tres símbolos grabados en la losa');
            if (!facts.includes('La losa presenta arañazos recientes y tres símbolos.')) facts.push('La losa presenta arañazos recientes y tres símbolos.');
            event = 'Se han descubierto tres símbolos y arañazos recientes en la losa.';
        } else if (atWell && opens) {
            category = 'object';
            if (state.wellInspected) {
                reply = 'Tiras de las cadenas y pruebas a mover la losa. El metal protesta con un chirrido, pero el cierre resiste. No parece una simple tapa: alguien la aseguró para que no pudiera abrirse fácilmente. Necesitarás encontrar otra manera.';
            } else {
                reply = 'Te dispones a mover la losa, pero las cadenas están tensas y el cierre no cede. Antes de forzarlo quizá convendría examinarlo. El cierre resiste y no consigues moverlo.';
            }
            event = `${name} ha intentado abrir el pozo.`;
        } else if (atWell) {
            category = 'investigation';
            reply = 'Te encuentras ante el pozo. Puedes examinarlo con más detalle o intentar interactuar con él.';
            event = `${name} ha prestado atención al pozo.`;
        } else if (asks) {
            category = 'dialogue';
            reply = 'Tu pregunta no obtiene una respuesta clara. Los habitantes parecen ocupados con sus asuntos y no todos están dispuestos a conversar con un recién llegado.';

            event = `${name} ha preguntado por los sucesos de Valdebruma.`;
        } else if (moves) {
            category = 'movement';
            if (this.has(text, ['posada', 'taberna', 'meson'])) {
                state.currentLocation = 'La Posada del Tejón';
                reply = 'Dejas atrás la plaza y llegas a la Posada del Tejón, un edificio bajo con ventanas empañadas. Dentro huele a sopa, madera húmeda y conversaciones interrumpidas. La posadera te mira como si estuviera intentando recordar si ya te ha visto.';
            } else if (this.has(text, ['calle', 'mercado', 'tiendas'])) {
                state.currentLocation = 'Calle Mayor';
                reply = 'Te adentras en la Calle Mayor. Los comerciantes siguen atendiendo sus puestos y algunos saludan brevemente al verte pasar.';
            } else if (this.has(text, ['elia', 'pozo', 'plaza'])) {
                state.currentLocation = this.has(text, ['pozo']) ? 'Plaza del pozo' : 'Plaza de Valdebruma';
                reply = knowsElia ? 'Regresas a la plaza. Elia sigue allí, ocupada con sus asuntos. Al verte, levanta la mirada.' : 'Llegas a la plaza de Valdebruma. Algunos vecinos conversan y otros continúan con sus tareas.';
            } else {
                reply = 'Te desplazas por Valdebruma. Las calles ascienden entre casas de piedra y pequeños comercios. La niebla hace difícil distinguir qué camino conduce a la parte alta del pueblo.';
                state.currentLocation = 'Calles de Valdebruma';
            }
            event = `${name} se ha desplazado a ${state.currentLocation}.`;
        } else if (stealth) {
            category = 'stealth';
            reply = 'Te mueves con cuidado, procurando no llamar la atención. Desde tu posición observas los alrededores sin que los habitantes reparen demasiado en ti.';
            event = `${name} ha actuado con sigilo en ${state.currentLocation}.`;
        } else if (offers) {
            category = 'offer';
            if (knowsElia) {
                state.eliaTrust += 1;
                state.characters.Elia.trust = state.eliaTrust;
            }
            reply = knowsElia ? 'Elia acepta tu gesto con una pequeña sonrisa.\n\n—Gracias. No abundan las personas que se ofrecen a ayudar sin pedir primero una explicación completa.' : 'Tu ofrecimiento queda en el aire. Tendrás que acercarte a alguien para saber si necesita ayuda.';
            event = `${name} ha ofrecido ayuda en Valdebruma.`;
        } else if (rests) {
            category = 'rest';
            reply = 'Te tomas un momento para descansar. A tu alrededor, Valdebruma continúa con su actividad cotidiana.';
            event = `${name} ha descansado en ${state.currentLocation}.`;
        } else if (investigates) {
            category = 'investigation';
            reply = 'Observas con atención lo que te rodea. Las casas de piedra, las calles y los habitantes componen la escena de un pueblo que todavía estás empezando a conocer.';
            event = `${name} ha investigado los alrededores.`;
        } else {
            category = 'other';
            reply = 'Llevas a cabo tu acción. El mundo no se detiene para darte una respuesta automática: los habitantes continúan con sus asuntos, aunque algunos te observan con curiosidad. Tendrás que ver qué efecto tiene tu decisión.';
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
