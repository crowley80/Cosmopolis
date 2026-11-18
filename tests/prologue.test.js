'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function createHarness(options = {}) {
    const values = new Map();
    if (options.introSeen) values.set('athun_intro_seen_v1', '1');
    const localStorage = {
        getItem(key) { return values.has(key) ? values.get(key) : null; },
        setItem(key, value) { values.set(String(key), String(value)); }
    };
    const app = { innerHTML: '' };
    let continueHandler = null;
    const continueButton = {
        addEventListener(event, handler) {
            if (event === 'click') continueHandler = handler;
        }
    };
    const document = {
        getElementById(id) {
            if (id === 'app') return app;
            if (id === 'continueFromPrologue') return continueButton;
            return null;
        },
        addEventListener() {}
    };
    const context = {
        document,
        window: {},
        localStorage,
        Save: {
            list: () => options.saves || [],
            getIndex: () => ({ saves: options.saves || [] })
        },
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
    return {
        Athun: context.window.__Athun,
        app,
        localStorage,
        continue: () => continueHandler && continueHandler()
    };
}

test('presenta el prólogo aprobado y registra que ya se mostró al continuar', () => {
    const harness = createHarness();
    let formShown = 0;
    harness.Athun.showForm = () => { formShown += 1; };

    harness.Athun.showPrologue();

    assert.match(harness.app.innerHTML, /Athun no fue hallado en una torre de alta hechicería/);
    assert.match(harness.app.innerHTML, /sardina rancia/);
    assert.match(harness.app.innerHTML, /cuántas veces mueras en el intento/);

    harness.continue();
    assert.equal(harness.localStorage.getItem('athun_intro_seen_v1'), '1');
    assert.equal(formShown, 1);
});

test('solo muestra el prólogo en una instalación nueva y lo omite si ya hay partidas', () => {
    const fresh = createHarness();
    let freshPrologue = 0;
    fresh.Athun.showPrologue = () => { freshPrologue += 1; };
    fresh.Athun.showForm = () => {};
    fresh.Athun.init();
    assert.equal(freshPrologue, 1);

    const returning = createHarness({ introSeen: true });
    let returningForm = 0;
    returning.Athun.showForm = () => { returningForm += 1; };
    returning.Athun.showPrologue = () => { throw new Error('No debe repetirse el prólogo'); };
    returning.Athun.init();
    assert.equal(returningForm, 1);

    const existing = createHarness({ saves: [{ id: 'legacy-save' }] });
    let selectionShown = 0;
    existing.Athun.showSaveSelection = () => { selectionShown += 1; };
    existing.Athun.showPrologue = () => { throw new Error('No debe mostrarse a una instalación existente'); };
    existing.Athun.init();
    assert.equal(selectionShown, 1);
});
