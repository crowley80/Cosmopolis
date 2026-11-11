'use strict';

const Adventure = {
    createOpening(character) {
        const name = character.name || 'Viajero';
        const nature = character.nature || 'un ser desconocido';
        const history = character.history || 'un pasado lleno de incógnitas';
        const abilities = character.abilities || 'capacidades todavía desconocidas';
        const personality = character.personality || 'una personalidad por descubrir';

        const beginnings = [
            {
                title: 'Una visita inesperada',
                image: 'app/assets/scenes/visita-inesperada.webp',
                text: 'Algo ha encontrado tu rastro. No sabes quién lo ha enviado ni qué busca, pero acaba de llegar.'
            },
            {
                title: 'El incidente',
                image: 'app/assets/scenes/el-incidente.webp',
                text: 'Un acontecimiento imposible acaba de alterar tu camino. Y hay alguien que parece muy interesado en que no descubras por qué.'
            },
            {
                title: 'La última advertencia',
                image: 'app/assets/scenes/ultima-advertencia.webp',
                text: 'Alguien ha arriesgado su vida para advertirte de un peligro que todavía no puedes comprender.'
            },
            {
                title: 'Una puerta prohibida',
                image: 'app/assets/scenes/puerta-prohibida.webp',
                text: 'Has descubierto algo que debería permanecer oculto. Ahora, algo al otro lado sabe que estás ahí.'
            }
        ];

        const beginning = beginnings[
            Math.floor(Math.random() * beginnings.length)
        ];

        return {
            title: beginning.title,
            image: beginning.image,
            text: `${name}, ${beginning.text}

Eres ${nature}.

Tu pasado: ${history}

Tus capacidades: ${abilities}

Tu carácter: ${personality}

El peligro acaba de comenzar. Lo que hagas a continuación dependerá de ti.`,
            createdAt: new Date().toISOString()
        };
    }
};

window.Adventure = Adventure;
