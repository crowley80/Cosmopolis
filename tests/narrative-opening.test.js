'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

global.window = global;
require('../app/js/game/adventure.js');
require('../app/js/game/director.js');

const Adventure = global.Adventure;
const Director = global.Director;
const character = { name: 'Ariadna' };

test('la apertura comienza en el camino y no adelanta a Elia, el pozo ni la campana', () => {
    const adventure = Adventure.createOpening(character);
    const state = adventure.state;

    assert.equal(adventure.location, 'Camino de entrada a Valdebruma');
    assert.equal(state.currentLocation, 'Camino de entrada a Valdebruma');
    assert.equal(state.phase, 'arrival');
    assert.equal(state.eliaMet, false);
    assert.equal(state.wellDiscovered, false);
    assert.equal(state.bellDiscovered, false);
    assert.deepEqual(state.characters, {});
    assert.equal(state.knownFacts.some(fact => /elia|pozo|campana/i.test(fact)), false);
    assert.ok(state.inventory.some(item => /athun/i.test(item)));
    assert.equal(state.athun.permanent, true);
});

test('preguntar desde el camino permite hablar con quien recoge leña sin entrar al pueblo', () => {
    const adventure = Adventure.createOpening(character);
    const result = Director.respond('Me acerco y pregunto a la persona que recoge leña', character, adventure, []);

    assert.equal(result.category, 'dialogue');
    assert.equal(result.state.currentLocation, 'Camino de entrada a Valdebruma');
    assert.equal(result.state.phase, 'arrival');
    assert.equal(result.state.characters.Vecino.location, 'Camino de entrada a Valdebruma');
    assert.match(result.reply, /recogiendo leña/i);
    assert.equal(result.state.eliaMet, false);
    assert.equal(result.state.wellDiscovered, false);
    assert.equal(result.state.bellDiscovered, false);
    assert.equal(result.state.knownFacts.some(fact => /elia|pozo|campana/i.test(fact)), false);
});

test('entrar en Valdebruma no revela automáticamente a Elia ni el misterio del pozo', () => {
    const adventure = Adventure.createOpening(character);
    const result = Director.respond('Entro en el pueblo por el camino principal', character, adventure, []);

    assert.equal(result.category, 'movement');
    assert.equal(result.state.currentLocation, 'Primeras calles de Valdebruma');
    assert.equal(result.state.eliaMet, false);
    assert.equal(result.state.wellDiscovered, false);
    assert.equal(result.state.bellDiscovered, false);
    assert.deepEqual(result.state.characters, {});
});

test('el pozo se descubre al llegar a la plaza y su inspección no revela la campana', () => {
    const opening = Adventure.createOpening(character);
    const entered = Director.respond('Entro en el pueblo', character, opening, []);
    const arrived = Director.respond('Camino hacia la plaza del pozo', character, entered.adventure, [entered]);

    assert.equal(arrived.state.currentLocation, 'Plaza del pozo');
    assert.equal(arrived.state.wellDiscovered, true);
    assert.equal(arrived.state.bellDiscovered, false);
    assert.equal(arrived.state.knownFacts.some(fact => /campana/i.test(fact)), false);

    const inspected = Director.respond('Examino detenidamente el pozo', character, arrived.adventure, [entered, arrived]);
    assert.equal(inspected.state.wellInspected, true);
    assert.equal(inspected.state.bellDiscovered, false);
    assert.equal(inspected.state.knownFacts.some(fact => /campana/i.test(fact)), false);
    assert.ok(inspected.state.clues.includes('Tres símbolos grabados en el pozo'));
});

test('la campana solo se revela cuando el jugador provoca una respuesta mágica en el pozo', () => {
    const adventure = Adventure.createOpening(character);
    adventure.state.currentLocation = 'Plaza del pozo';
    adventure.location = 'Plaza del pozo';
    adventure.state.phase = 'exploration';
    adventure.state.wellDiscovered = true;

    const result = Director.respond('Uso magia cerca del pozo', character, adventure, []);

    assert.equal(result.state.bellDiscovered, true);
    assert.equal(result.state.bellRings, 1);
    assert.ok(result.state.knownFacts.some(fact => /campanada/i.test(fact)));
});
