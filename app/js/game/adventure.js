'use strict';

const Adventure = {
    createOpening(character) {
        const name = character.name || 'Viajero';

        return {
            id: 'campana-valdebruma-001',
            title: 'La campana bajo la montaña',
            image: 'app/assets/scenes/ultima-advertencia.webp',
            location: 'Valdebruma',
            text:
                `El camino desciende entre montañas cubiertas de niebla. Al final aparece Valdebruma, un pueblo de tejados oscuros, chimeneas humeantes y calles empedradas. No figura en muchos mapas. En algunos, ni siquiera figura correctamente.\n\n` +
                `${name}, llevas poco tiempo en el pueblo cuando escuchas una campanada. Es profunda, lenta y parece subir desde debajo de tus pies.\n\n` +
                `La gente se detiene. Nadie mira hacia el campanario de la plaza. Todos miran hacia el viejo pozo de piedra, cerrado con una losa y varias cadenas oxidadas.\n\n` +
                `Una mujer se abre paso entre los vecinos. Lleva un tubo de mapas colgado al hombro y tiene barro hasta las rodillas.\n\n` +
                `—Me llamo Elia. Soy cartógrafa —dice, sin apartar los ojos del pozo—. Esa campana lleva treinta años sin existir. Y, sin embargo, acaba de sonar por tercera vez esta semana.\n\n` +
                `Se vuelve hacia ti.\n\n` +
                `—No te conozco, pero pareces alguien capaz de escuchar antes de salir corriendo. Necesito ayuda. Y antes de que preguntes: no, el alcalde no piensa hacer nada.\n\n` +
                `Elia espera tu respuesta. A vuestro alrededor, el pueblo finge que no está pasando nada.`,
            state: {
                currentLocation: 'Plaza del pozo',
                time: 'Mañana',
                day: 1,
                bellRings: 3,
                bellInvestigated: false,
                wellInspected: false,
                wellOpened: false,
                eliaTrust: 0,
                eliaMet: true,
                clues: [],
                inventory: [],
                visitedLocations: ['Plaza del pozo'],
                knownFacts: [
                    'El personaje ha llegado a Valdebruma.',
                    'Elia es una cartógrafa del pueblo.',
                    'Una campana suena desde debajo del viejo pozo.',
                    'El pozo está cerrado con una losa y cadenas.'
                ],
                characters: {
                    Elia: {
                        role: 'Cartógrafa',
                        location: 'Plaza del pozo',
                        attitude: 'Cautelosa',
                        personalGoal: 'Averiguar por qué la campana suena desde debajo del pozo y qué altera sus mapas.',
                        goalHistory: [],
                        trust: 0,
                        memories: ['Ha conocido al personaje en la plaza del pozo.']
                    }
                },
                events: ['Llegada a Valdebruma', 'Encuentro con Elia', 'La campana vuelve a sonar']
            },
            createdAt: new Date().toISOString()
        };
    }
};

window.Adventure = Adventure;
