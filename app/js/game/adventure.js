'use strict';

const Adventure = {
    createOpening(character) {
        const name = character.name || 'Viajero';

        return {
            id: 'valdebruma-llegada-001',
            title: 'Llegada a Valdebruma',
            image: null,
            location: 'Camino de entrada a Valdebruma',
            text:
                `El camino lleva un buen rato descendiendo entre las montañas. La niebla se aferra a las laderas y el aire huele a tierra húmeda, leña y hojas caídas.\n\n` +
                `Al doblar una curva aparece Valdebruma. El pueblo se extiende en el fondo del valle, entre tejados oscuros y chimeneas que dejan escapar columnas de humo. Una torre de piedra sobresale por encima de las casas. Más allá, las montañas cierran el horizonte.\n\n` +
                `${name}, estás llegando al pueblo. No hay nadie esperándote en el camino ni una urgencia que te obligue a correr. Por el momento, Valdebruma parece un lugar corriente: una carreta avanza lentamente hacia la entrada, alguien recoge leña junto a una casa y, desde una ventana abierta, llega el sonido de una conversación.\n\n` +
                `El camino principal conduce hasta las primeras calles. Puedes detenerte a observar el valle, entrar en el pueblo, buscar alojamiento o acercarte a sus habitantes.\n\n` +
                `La mañana sigue su curso. Tu historia en Valdebruma comienza aquí.`,
            state: {
                currentLocation: 'Camino de entrada a Valdebruma',
                phase: 'arrival',
                time: 'Mañana',
                day: 1,
                bellRings: 0,
                bellDiscovered: false,
                bellInvestigated: false,
                wellDiscovered: false,
                wellInspected: false,
                wellOpened: false,
                eliaMet: false,
                eliaTrust: 0,
                clues: [],
                inventory: ['Athun'],
                athun: {
                    id: 'athun',
                    name: 'Athun',
                    kind: 'Grimorio consciente',
                    permanent: true,
                    bond: 0,
                    memories: [],
                    revelations: []
                },
                visitedLocations: ['Camino de entrada a Valdebruma'],
                knownFacts: [
                    'El personaje ha llegado a Valdebruma.',
                    'Valdebruma es un pueblo situado en un valle entre montañas.'
                ],
                characters: {},
                events: ['Llegada al camino de entrada a Valdebruma']
            },
            createdAt: new Date().toISOString()
        };
    }
};

window.Adventure = Adventure;
