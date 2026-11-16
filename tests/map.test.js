'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const WorldMap = require('../app/js/game/map.js');

test('el atlas solo muestra el entorno actual cuando no existen rutas visibles declaradas', () => {
    const atlas = WorldMap.getAtlas(
        { locations: [{ name: 'Plaza del pozo' }] },
        { currentLocation: 'Plaza del pozo', visitedLocations: ['Plaza del pozo'] },
        { location: 'Valdebruma' }
    );

    assert.equal(atlas.currentAndVisible.length, 1);
    assert.equal(atlas.currentAndVisible[0].name, 'Plaza del pozo');
    assert.equal(atlas.currentAndVisible[0].status, 'current');
    assert.equal(atlas.known.length, 0);
});

test('separa lugares visitados de lugares conocidos por el mundo compartido', () => {
    const atlas = WorldMap.getAtlas(
        { locations: ['Plaza del pozo', 'Puerto', 'Bosque'] },
        { currentLocation: 'Plaza del pozo', visitedLocations: ['Plaza del pozo', 'Bosque'] },
        {}
    );

    assert.deepEqual(atlas.visited.map(item => item.name), ['Bosque']);
    assert.deepEqual(atlas.known.map(item => item.name), ['Puerto']);
});

test('revela ubicaciones adicionales solo cuando la aventura las declara visibles', () => {
    const atlas = WorldMap.getAtlas(
        { locations: ['Plaza del pozo', 'Calle del molino', 'Puerto'] },
        {
            currentLocation: 'Plaza del pozo',
            visitedLocations: ['Plaza del pozo'],
            visibleLocations: ['Calle del molino']
        },
        {}
    );

    assert.deepEqual(atlas.currentAndVisible.map(item => item.status), ['current', 'visible']);
    assert.equal(atlas.currentAndVisible[1].name, 'Calle del molino');
    assert.deepEqual(atlas.known.map(item => item.name), ['Puerto']);
});

test('el descubrimiento compartido no convierte lugares en visitas personales', () => {
    const atlas = WorldMap.getAtlas(
        { locations: [{ name: 'Valdebruma', discoveredBy: 'Ariadna' }] },
        { currentLocation: 'Bosque', visitedLocations: ['Bosque'] },
        {}
    );

    assert.equal(atlas.known.some(item => item.name === 'Valdebruma'), true);
    assert.equal(atlas.visited.some(item => item.name === 'Valdebruma'), false);
});
