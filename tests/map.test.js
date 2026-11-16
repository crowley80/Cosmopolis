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


test('una zona visitada vuelve a mostrarse como visible cuando está a la vista ahora', () => {
    const atlas = WorldMap.getAtlas(
        { locations: ['Plaza del pozo', 'Calle del molino'] },
        {
            currentLocation: 'Plaza del pozo',
            visitedLocations: ['Plaza del pozo', 'Calle del molino'],
            visibleLocations: ['Calle del molino']
        },
        {}
    );

    assert.equal(atlas.currentAndVisible.some(item =>
        item.name === 'Calle del molino' && item.status === 'visible'
    ), true);
    assert.equal(atlas.visited.some(item => item.name === 'Calle del molino'), false);
});


test('el atlas muestra solo conexiones explícitas entre lugares conocidos', () => {
    const atlas = WorldMap.getAtlas(
        { locations: ['Plaza del pozo', 'La Posada del Tejón', 'Puerto'], connections: [
            { from: 'Plaza del pozo', to: 'La Posada del Tejón' },
            { from: 'Puerto', to: 'Lugar no registrado' }
        ] },
        { currentLocation: 'La Posada del Tejón', visitedLocations: ['Plaza del pozo', 'La Posada del Tejón'] },
        {}
    );

    assert.deepEqual(atlas.connections, [
        { from: 'Plaza del pozo', to: 'La Posada del Tejón' }
    ]);
});


test('el esquema visual solo contiene lugares conocidos y caminos registrados', () => {
    const atlas = WorldMap.getAtlas(
        { locations: ['Plaza', 'Posada', 'Puerto'], connections: [
            { from: 'Plaza', to: 'Posada' },
            { from: 'Posada', to: 'Puerto' },
            { from: 'Puerto', to: 'Bosque oculto' }
        ] },
        { currentLocation: 'Plaza', visitedLocations: ['Plaza', 'Posada'], visibleLocations: ['Posada'] },
        {}
    );
    const layout = WorldMap.getSchematicLayout(atlas);

    assert.equal(layout.nodes.length, 3);
    assert.equal(layout.nodes.find(node => node.status === 'current').x, 300);
    assert.equal(layout.edges.length, 2);
    assert.equal(layout.nodes.some(node => node.name === 'Bosque oculto'), false);
    assert.ok(layout.nodes.every(node =>
        node.x >= 0 && node.x <= layout.width && node.y >= 0 && node.y <= layout.height
    ));
});

test('el esquema admite un atlas vacío sin inventar nodos ni caminos', () => {
    assert.deepEqual(WorldMap.getSchematicLayout({ entries: [], connections: [] }), {
        width: 600, height: 348, nodes: [], edges: []
    });
});
