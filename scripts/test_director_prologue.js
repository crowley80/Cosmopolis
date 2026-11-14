'use strict';

const assert = require('node:assert/strict');
global.window = {};
require('../app/js/game/director.js');
const Director = global.window.Director;

const player = { name: 'Ariadna' };
const opening = (state) => ({
    title: 'Prueba de conocimiento',
    location: state.currentLocation || 'Camino de entrada a Valdebruma',
    text: 'El personaje acaba de llegar al pueblo.',
    state: {
        currentLocation: 'Camino de entrada a Valdebruma',
        knownFacts: ['El personaje ha llegado a Valdebruma.'],
        clues: [],
        events: [],
        characters: {},
        ...state
    }
});

const unintroduced = opening({});
const observation = Director.respond('Observo alrededor.', player, unintroduced, []);
assert.deepEqual(Object.keys(observation.state.characters), [],
    'El director no debe crear a Elia ni a otros personajes por su cuenta.');
assert.doesNotMatch(observation.reply, /Elia|pozo|campana/i,
    'La observación inicial no debe presuponer que el jugador conoce a Elia, el pozo o la campana.');

const genericOffer = Director.respond('Ofrezco ayuda.', player, unintroduced, []);
assert.deepEqual(Object.keys(genericOffer.state.characters), [],
    'Un ofrecimiento genérico no debe crear personajes ni relaciones.');

const unknownElia = Director.respond('Pregunto quién es Elia.', player, unintroduced, []);
assert.match(unknownElia.reply, /Todavía no conoces a nadie llamado Elia/i,
    'El director debe reconocer que el jugador aún no conoce a Elia, sin inventar un encuentro.');

const eliaPresent = opening({
    currentLocation: 'Plaza del pozo',
    eliaMet: true,
    characters: {
        Elia: { name: 'Elia', role: 'Cartógrafa', location: 'Plaza del pozo', trust: 0 }
    },
    knownFacts: ['El personaje ha conocido a Elia en la plaza.']
});
const dialogue = Director.respond('Pregunto a Elia por sus mapas.', player, eliaPresent, []);
assert.equal(dialogue.state.characters.Elia.trust, 1,
    'Una conversación real con Elia presente puede modificar su confianza.');
assert.match(dialogue.reply, /Elia/i);

const eliaAway = opening({
    currentLocation: 'Plaza del pozo',
    eliaMet: true,
    characters: {
        Elia: { name: 'Elia', role: 'Cartógrafa', location: 'La Posada del Tejón', trust: 2 }
    },
    knownFacts: ['El personaje ha conocido a Elia.']
});
const absentDialogue = Director.respond('Pregunto a Elia por sus mapas.', player, eliaAway, []);
assert.match(absentDialogue.reply, /no está aquí|No ves a Elia/i);
assert.equal(absentDialogue.state.characters.Elia.trust, 2,
    'No debe cambiar la relación si Elia no está presente.');

const unseenElia = opening({
    currentLocation: 'Plaza del pozo',
    characters: {
        Elia: { name: 'Elia', role: 'Cartógrafa', location: 'Plaza del pozo', trust: 0 }
    }
});
const firstWellVisit = Director.respond('Examino el pozo.', player, unseenElia, []);
assert.doesNotMatch(firstWellVisit.reply, /Elia/i,
    'Ver a una persona registrada no autoriza a conocer su nombre antes de ser presentada.');

const distantWell = opening({ currentLocation: 'Calle Mayor' });
const distantInspection = Director.respond('Examino el pozo.', player, distantWell, []);
assert.equal(distantInspection.state.wellInspected, undefined,
    'No se puede inspeccionar el pozo desde otra ubicación.');
assert.doesNotMatch(distantInspection.reply, /Elia/i);


global.Session = {
    getWorld: () => ({ facts: [], events: [], relationships: {} })
};
require('../app/js/game/narrator.js');
const openingText = 'Llegas a un camino desconocido. Todavía no has conocido a nadie.';
const narratorAdventure = {
    title: 'Prueba',
    text: openingText,
    location: 'Camino de entrada',
    state: { currentLocation: 'Camino de entrada', characters: {}, knownFacts: [], clues: [], events: [] }
};
const messages = global.window.Narrator.buildMessages(
    'Observo alrededor.', player, narratorAdventure, []
);
assert.match(messages[0].content, /El registro characters describe el mundo/);
assert.match(messages[0].content, /No presupongas que el jugador conoce a Elia/);
assert.equal(JSON.parse(messages[1].content).currentAdventure.opening, openingText,
    'El narrador debe recibir el prólogo para saber qué se ha presentado al jugador.');

console.log('Pruebas de director y narrador: correctas.');
