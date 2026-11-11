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
        const number = previousActions.length + 1;

        const groups = [
            {
                category: 'dialogue',
                words: ['pregunto', 'hablo', 'digo', 'converso', 'respondo', 'grito', 'susurro', 'negocio', 'explico']
            },
            {
                category: 'offer',
                words: ['ofrezco', 'regalo', 'entrego', 'comparto', 'invito', 'doy', 'alimento', 'ayudo']
            },
            {
                category: 'combat',
                words: ['ataco', 'golpeo', 'disparo', 'combato', 'lucho', 'apuñalo', 'lanzo contra', 'me defiendo']
            },
            {
                category: 'magic',
                words: ['hechizo', 'magia', 'invoco', 'conjuro', 'encanto', 'maldicion', 'runa', 'poder', 'transformo']
            },
            {
                category: 'investigation',
                words: ['examino', 'observo', 'miro', 'investigo', 'inspecciono', 'escucho', 'analizo', 'busco', 'registro']
            },
            {
                category: 'movement',
                words: ['camino', 'avanzo', 'entro', 'salgo', 'exploro', 'viajo', 'corro', 'me acerco', 'me alejo', 'subo', 'bajo']
            },
            {
                category: 'stealth',
                words: ['escondo', 'oculto', 'esconderme', 'disimulo', 'me agacho', 'me cuelo', 'acecho']
            },
            {
                category: 'object',
                words: ['uso', 'utilizo', 'activo', 'abro', 'cierro', 'rompo', 'recojo', 'cojo', 'tomo', 'pruebo']
            },
            {
                category: 'rest',
                words: ['descanso', 'duermo', 'espero', 'me siento', 'como', 'bebo']
            }
        ];

        const matched = groups.filter(group =>
            this.has(text, group.words)
        );

        const categories = matched.map(group => group.category);
        const category = categories[0] || 'other';

        const last = previousActions[previousActions.length - 1];
        const scene = adventure.title || 'este lugar';
        const isScared = this.has(text, [
            'asustado', 'asustada', 'miedo', 'temblando', 'aterrorizado',
            'aterrorizada', 'nervioso', 'nerviosa'
        ]);

        const asksWhy = this.has(text, [
            'por que', 'que ocurre', 'que pasa', 'que sucede',
            'que te ocurre', 'que ha pasado'
        ]);

        const offersFood = this.has(text, [
            'comida', 'comer', 'alimento', 'pan', 'fruta',
            'agua', 'bebida', 'racion'
        ]);

        const approaches = this.has(text, [
            'me acerco', 'acercarme', 'me aproximo', 'me dirijo'
        ]);

        const questions = this.has(text, [
            'pregunto', 'preguntarle', 'preguntando', 'por que',
            'quien eres', 'que buscas', 'que quieres'
        ]);

        let reply = '';

        if (offersFood && (questions || approaches || isScared)) {
            reply = 'La figura observa lo que le ofreces. Durante unos segundos parece debatirse entre salir corriendo y aceptar tu gesto. Finalmente se acerca con cautela y toma la comida. «No esperaba encontrar a alguien dispuesto a ayudar», murmura. Su respiración comienza a tranquilizarse.';

            if (asksWhy || isScared) {
                reply += ' «Hay algo ahí fuera», añade, mirando por encima de tu hombro. «Algo que no debería haber despertado. Me ha seguido desde las colinas».';
            }
        } else if (offersFood) {
            reply = 'Tu ofrecimiento rompe parte de la desconfianza. La figura mira el alimento y después te mira a ti. «¿Es para mí?», pregunta, sin atreverse todavía a aceptarlo.';
        } else if (questions && (asksWhy || isScared)) {
            reply = 'La figura baja la mirada y tarda en contestar. «No es miedo a ti», dice finalmente. «He visto algo que no puedo explicar. Y creo que todavía nos está buscando».';
        } else if (category === 'dialogue') {
            reply = 'Tus palabras reciben una respuesta cautelosa. La figura te observa antes de contestar: «No sé si debería confiar en ti. Pero quizá hablar sea mejor que seguir huyendo».';
        } else if (category === 'offer') {
            reply = 'Tu gesto modifica el ambiente. La otra parte no parece saber cómo reaccionar, pero su actitud se vuelve algo menos hostil. La situación queda abierta a lo que decidas hacer después.';
        } else if (category === 'combat') {
            reply = 'Tu movimiento provoca una reacción inmediata. El peligro deja de ser una posibilidad y se convierte en algo presente. Tu adversario intenta responder, y la situación se vuelve mucho más delicada.';
        } else if (category === 'magic') {
            reply = 'La energía de tu poder altera el entorno. Durante un instante, el aire parece vibrar y algo cercano responde a la manifestación. El efecto exacto depende de la naturaleza de tu habilidad y de aquello que intentas conseguir.';
        } else if (category === 'investigation') {
            reply = 'Examinas la situación con atención. Entre los detalles descubres señales que no encajan: marcas recientes, rastros de movimiento y un indicio que parece relacionado con lo ocurrido en «' + scene + '».';
        } else if (category === 'movement') {
            reply = 'Te desplazas y el entorno cambia a tu alrededor. Desde esta nueva posición distingues detalles que antes no podías apreciar. El lugar parece guardar más de un secreto.';
        } else if (category === 'stealth') {
            reply = 'Te mueves procurando no llamar la atención. Encuentras cierta cobertura y consigues observar sin exponerte demasiado. Por ahora, nadie parece haberte descubierto.';
        } else if (category === 'object') {
            reply = 'Manipulas aquello que has elegido. El objeto o mecanismo responde a tu intervención, aunque todavía no está claro si has conseguido el resultado que buscabas.';
        } else if (category === 'rest') {
            reply = 'Te tomas un momento para descansar. El mundo no se detiene por completo, pero recuperas algo de calma y puedes pensar con más claridad sobre lo sucedido.';
        } else {
            reply = 'Llevas a cabo tu acción. El entorno responde de una manera que todavía no esperabas. Algo cambia en la situación y tendrás que decidir cómo aprovecharlo.';
        }

        if (number > 1 && last && last.text) {
            reply += '\n\nLo que acabas de hacer se suma a lo ocurrido anteriormente. Tus decisiones empiezan a formar una historia propia.';
        }

        if (character.abilities && this.has(text, ['poder', 'magia', 'hechizo', 'habilidad', 'vuelo', 'volar'])) {
            reply += '\n\nTus capacidades personales pueden influir en cómo evoluciona esta situación.';
        }

        return {
            text: `${name}: ${action}\n\n${reply}`,
            reply,
            category,
            event: `${name} realizó una acción de tipo ${category} en ${scene}.`,
            createdAt: new Date().toISOString(),
            actionNumber: number
        };
    }
};

window.Director = Director;
