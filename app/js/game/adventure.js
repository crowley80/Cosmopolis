'use strict';

const Adventure = {
    createOpening(character) {
        const name = character.name || 'Viajero';

        return {
            id: 'campana-valdebruma-001',
            title: 'La campana bajo la montaña',
            location: 'Camino de entrada a Valdebruma',
            text: `El camino lleva un buen rato descendiendo entre las montañas. La niebla se aferra a las laderas y el aire huele a tierra húmeda, leña y hojas caídas.

Al doblar una curva aparece Valdebruma. El pueblo se extiende en el fondo del valle, entre tejados oscuros y chimeneas que dejan escapar columnas de humo. Una torre de piedra sobresale por encima de las casas. Más allá, las montañas cierran el horizonte.

${name}, estás llegando al pueblo. No hay nadie esperándote en el camino ni una urgencia que te obligue a correr. Por el momento, Valdebruma parece un lugar corriente: una carreta avanza lentamente hacia la entrada, alguien recoge leña junto a una casa y, desde una ventana abierta, llega el sonido de una conversación.

El camino principal conduce hasta las primeras calles. Puedes detenerte a observar el valle, entrar en el pueblo, buscar alojamiento o acercarte a sus habitantes.

La mañana sigue su curso. Tu historia en Valdebruma comienza aquí.`,
            state: {
                phase: 'arrival',
                arrivalActions: 0,
                currentLocation: 'Camino de entrada a Valdebruma',
                time: 'Mañana',
                bellRings: 0,
                bellInvestigated: false,
                wellInspected: false,
                wellOpened: false,
                eliaTrust: 0,
                eliaMet: false,
                clues: [],
                knownFacts: [
                    'El personaje ha llegado a Valdebruma.',
                    'Valdebruma es un pueblo situado en un valle entre montañas.'
                ],
                characters: {},
                events: ['Llegada a Valdebruma']
            },
            createdAt: new Date().toISOString()
        };
    }
};

window.Adventure = Adventure;
