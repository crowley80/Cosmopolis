'use strict';

const Director = {
    respond(action, character, adventure, previousActions = []) {
        const text = action.toLowerCase();
        const name = character.name || 'Viajero';

        const responses = [
            {
                words: ['examino', 'observo', 'miro', 'investigo', 'inspecciono', 'examinar'],
                reply: 'Te detienes a observar con atención. Hay detalles que antes habían pasado inadvertidos. Algo en el entorno merece una investigación más cuidadosa.'
            },
            {
                words: ['hablo', 'pregunto', 'digo', 'converso', 'negocio', 'respondo'],
                reply: 'Tus palabras rompen el silencio. La situación cambia: ahora hay alguien que debe decidir cómo responderte. No parece dispuesto a revelar todo lo que sabe.'
            },
            {
                words: ['escondo', 'oculto', 'esconderme', 'agacho', 'disimulo'],
                reply: 'Buscas un lugar donde pasar inadvertido. El entorno ofrece cierta protección, aunque no puedes estar seguro de que nadie haya advertido tu movimiento.'
            },
            {
                words: ['ataco', 'golpeo', 'disparo', 'combato', 'lucho', 'defiendo'],
                reply: 'Tu movimiento rompe la tensión. La situación se vuelve peligrosa y cada gesto puede tener consecuencias. Tu adversario reacciona.'
            },
            {
                words: ['camino', 'avanzo', 'entro', 'salgo', 'me acerco', 'me alejo', 'exploro'],
                reply: 'Te desplazas con cautela. El lugar revela nuevos detalles a medida que avanzas. Algo más adelante llama tu atención.'
            },
            {
                words: ['uso', 'utilizo', 'activo', 'invoco', 'pruebo'],
                reply: 'Pones en práctica tu intención. El resultado depende de lo que intentas hacer y de las circunstancias que te rodean.'
            }
        ];

        const match = responses.find(group =>
            group.words.some(word => text.includes(word))
        );

        const reply = match
            ? match.reply
            : 'Llevas a cabo tu acción. El entorno reacciona a tu presencia, y las consecuencias de tu decisión empiezan a tomar forma.';

        return {
            text: `${name}: ${action}\n\n${reply}`,
            createdAt: new Date().toISOString(),
            actionNumber: previousActions.length + 1
        };
    }
};

window.Director = Director;
