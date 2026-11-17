'use strict';

// Cartografía conservadora: solo revela lugares y relaciones respaldados por el mundo.
const WorldMap = {
    spatialRelationRules: {
        north_of: { label: 'al norte de', phrases: ['al norte de', 'norte de'] },
        south_of: { label: 'al sur de', phrases: ['al sur de', 'sur de'] },
        east_of: { label: 'al este de', phrases: ['al este de', 'este de'] },
        west_of: { label: 'al oeste de', phrases: ['al oeste de', 'oeste de'] },
        inside: { label: 'dentro de', phrases: ['dentro de', 'en el interior de', 'forma parte de', 'pertenece a'] },
        adjacent_to: { label: 'junto a', phrases: ['junto a', 'al lado de', 'contiguo a', 'colinda con'] }
    },

    cleanName(value) {
        return String(value || '').trim().slice(0, 120);
    },

    normalizeText(value) {
        return String(value || '')
            .normalize('NFD')
            .replace(/[\\u0300-\\u036f]/g, '')
            .toLocaleLowerCase('es');
    },

    normalizeSpatialRelations(values, narrative = '') {
        const narrativeText = this.normalizeText(narrative);
        const accepted = new Map();
        (Array.isArray(values) ? values : []).slice(0, 24).forEach(item => {
            if (!item || typeof item !== 'object') return;
            const from = this.cleanName(item.from);
            const to = this.cleanName(item.to);
            const relation = String(item.relation || '');
            const evidence = String(item.evidence || '').trim().slice(0, 240);
            const rule = this.spatialRelationRules[relation];
            if (!from || !to || !evidence || !rule ||
                this.normalizeText(from) === this.normalizeText(to)) return;

            const normalizedEvidence = this.normalizeText(evidence);
            if (!narrativeText.includes(normalizedEvidence)) return;

            const fromName = this.normalizeText(from);
            const toName = this.normalizeText(to);
            const fromAt = normalizedEvidence.indexOf(fromName);
            const toAt = fromAt < 0
                ? -1
                : normalizedEvidence.indexOf(toName, fromAt + fromName.length);
            if (fromAt < 0 || toAt < 0) return;

            const phraseIsBetween = rule.phrases.some(phrase => {
                const phraseAt = normalizedEvidence.indexOf(this.normalizeText(phrase), fromAt + fromName.length);
                return phraseAt > fromAt && phraseAt < toAt;
            });
            if (!phraseIsBetween) return;

            const key = [fromName, relation, toName].join('|');
            accepted.set(key, { from, relation, label: rule.label, to, evidence });
        });
        return Array.from(accepted.values()).slice(0, 12);
    },

    getAtlas(sharedWorld = {}, state = {}, adventure = {}) {
        const discovered = new Map();
        const add = value => {
            const name = this.cleanName(typeof value === 'string' ? value : value && value.name);
            if (!name) return;
            const key = this.normalizeText(name);
            if (!discovered.has(key)) discovered.set(key, name);
        };

        (Array.isArray(sharedWorld.locations) ? sharedWorld.locations : []).forEach(add);
        const visited = new Set(
            (Array.isArray(state.visitedLocations) ? state.visitedLocations : [])
                .map(value => this.normalizeText(this.cleanName(value)))
                .filter(Boolean)
        );
        visited.forEach(name => add(name));

        const current = this.cleanName(state.currentLocation || adventure.location);
        if (current) add(current);

        const visible = new Set([...(Array.isArray(state.visibleLocations) ? state.visibleLocations : []), current]
            .map(value => this.normalizeText(this.cleanName(value)))
            .filter(Boolean));
        visible.forEach(name => add(name));

        const entries = Array.from(discovered.entries()).map(([key, name]) => {
            let status = 'known';
            if (key === this.normalizeText(current) && current) status = 'current';
            else if (visible.has(key)) status = 'visible';
            else if (visited.has(key)) status = 'visited';
            return { name, status };
        });

        const knownNames = new Set(discovered.keys());
        const connections = (Array.isArray(sharedWorld.connections) ? sharedWorld.connections : [])
            .filter(item => item && typeof item.from === 'string' && typeof item.to === 'string')
            .map(item => ({
                from: this.cleanName(item.from),
                to: this.cleanName(item.to)
            }))
            .filter(item => item.from && item.to &&
                knownNames.has(this.normalizeText(item.from)) &&
                knownNames.has(this.normalizeText(item.to)));

        // Una posición relativa solo se muestra si conserva su frase probatoria y ambos extremos son conocidos.
        const spatialRelations = (Array.isArray(sharedWorld.spatialRelations) ? sharedWorld.spatialRelations : [])
            .flatMap(item => this.normalizeSpatialRelations([item], item && item.evidence))
            .filter(item => knownNames.has(this.normalizeText(item.from)) &&
                knownNames.has(this.normalizeText(item.to)));

        const order = { current: 0, visible: 1, visited: 2, known: 3 };
        entries.sort((a, b) => order[a.status] - order[b.status] || a.name.localeCompare(b.name, 'es'));
        return {
            current,
            entries,
            connections,
            spatialRelations,
            currentAndVisible: entries.filter(item => item.status === 'current' || item.status === 'visible'),
            visited: entries.filter(item => item.status === 'visited'),
            known: entries.filter(item => item.status === 'known')
        };
    }
};

if (typeof window !== 'undefined') window.WorldMap = WorldMap;
if (typeof module !== 'undefined' && module.exports) module.exports = WorldMap;
