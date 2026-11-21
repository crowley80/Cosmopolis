'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function createHarness() {
    const elements = new Map();
    const app = { innerHTML: '' };
    const modes = [];
    const saved = {
        character: { name: 'Ariadna' },
        adventure: { state: { currentLocation: 'Lugar de prueba' } },
        actions: [{ id: 'action-1' }]
    };
    const calls = { load: 0, save: [], saveThrows: false, profile: 0, selection: 0, adventure: [] };

    const document = {
        body: { classList: { toggle(name, enabled) { modes.push([name, enabled]); } } },
        getElementById(id) {
            if (id === 'app') return app;
            if (!elements.has(id)) {
                elements.set(id, {
                    listeners: {},
                    textContent: '',
                    addEventListener(event, handler) { this.listeners[event] = handler; }
                });
            }
            return elements.get(id);
        },
        addEventListener() {}
    };
    const Save = {
        load() { calls.load += 1; return saved; },
        save(value) { calls.save.push(value); if (calls.saveThrows) throw new Error('storage unavailable'); return true; }
    };
    const context = {
        document,
        window: {},
        Save,
        localStorage: { getItem() { return null; }, setItem() {} },
        console,
        Date,
        alert() {}
    };

    let source = fs.readFileSync(require.resolve('../app/js/app.js'), 'utf8');
    source = source.replace(
        "document.addEventListener('DOMContentLoaded', () => Athun.init());",
        'window.__Athun = Athun;'
    );
    vm.runInNewContext(source, context);

    const Athun = context.window.__Athun;
    Athun.showProfile = () => { calls.profile += 1; };
    Athun.showSaveSelection = () => { calls.selection += 1; };
    Athun.showAdventure = (character, adventure) => { calls.adventure.push([character, adventure]); };

    return { Athun, app, calls, elements, modes, saved };
}

test('la pantalla de opciones no guarda ni altera la partida hasta que se solicita', () => {
    const h = createHarness();

    h.Athun.showOptions(h.saved.character, h.saved.adventure);

    assert.match(h.app.innerHTML, /Opciones de la aventura/);
    assert.match(h.app.innerHTML, /Guardar ahora/);
    assert.equal(h.calls.save.length, 0);
    assert.deepEqual(h.modes, [['adventure-mode', false], ['parchment-mode', true]]);

    h.elements.get('saveNow').listeners.click();

    assert.equal(h.calls.save.length, 1);
    assert.equal(h.calls.save[0], h.saved);
    assert.match(h.elements.get('optionsFeedback').textContent, /guardado correctamente/);
});

test('los controles de opciones conectan ficha, selector y regreso a la aventura', () => {
    const h = createHarness();

    h.Athun.showOptions(h.saved.character, h.saved.adventure);
    h.elements.get('profileFromOptions').listeners.click();
    h.elements.get('switchSaveFromOptions').listeners.click();
    h.elements.get('returnAdventure').listeners.click();

    assert.equal(h.calls.profile, 1);
    assert.equal(h.calls.selection, 1);
    assert.equal(h.calls.adventure.length, 1);
    assert.equal(h.calls.adventure[0][0], h.saved.character);
    assert.equal(h.calls.adventure[0][1], h.saved.adventure);
});


test('un fallo del almacenamiento se comunica sin romper la pantalla de opciones', () => {
    const h = createHarness();
    h.Athun.showOptions(h.saved.character, h.saved.adventure);
    h.calls.saveThrows = true;

    assert.doesNotThrow(() => h.elements.get('saveNow').listeners.click());
    assert.match(h.elements.get('optionsFeedback').textContent, /datos anteriores permanecen intactos/);
    assert.equal(h.calls.save.length, 1);
});
