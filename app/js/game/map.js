'use strict';

// Cartografía conservadora: solo revela lugares registrados o declarados visibles
// explícitamente por el estado de la aventura. Nunca inventa rutas ni coordenadas.
const WorldMap = {
    cleanName(value) {
        return String(value || '').trim().slice(0, 120);
    },

    getAtlas(sharedWorld = {}, state = {}, adventure = {}) {
        const discovered = new Map();
        const add = (value, source = 'world') => {
            const name = this.cleanName(typeof value === 'string' ? value : value && value.name);
            if (!name) return;
            const key = name.toLocaleLowerCase('es');
            if (!discovered.has(key)) discovered.set(key, name);
        };

        (Array.isArray(sharedWorld.locations) ? sharedWorld.locations : []).forEach(item => add(item));
        const visited = new Set(
            (Array.isArray(state.visitedLocations) ? state.visitedLocations : [])
                .map(value => this.cleanName(value).toLocaleLowerCase('es'))
                .filter(Boolean)
        );
        visited.forEach(name => add(name, 'personal'));

        const current = this.cleanName(state.currentLocation || adventure.location);
        if (current) add(current, 'current');

        const visible = new Set([...(Array.isArray(state.visibleLocations) ? state.visibleLocations : []), current]
            .map(value => this.cleanName(value).toLocaleLowerCase('es'))
            .filter(Boolean));
        visible.forEach(name => add(name, 'visible'));

        const entries = Array.from(discovered.entries()).map(([key, name]) => {
            let status = 'known';
            if (key === current.toLocaleLowerCase('es') && current) status = 'current';
            else if (visited.has(key)) status = 'visited';
            else if (visible.has(key)) status = 'visible';
            return { name, status };
        });

        const order = { current: 0, visible: 1, visited: 2, known: 3 };
        entries.sort((a, b) => order[a.status] - order[b.status] || a.name.localeCompare(b.name, 'es'));
        return {
            current,
            entries,
            currentAndVisible: entries.filter(item => item.status === 'current' || item.status === 'visible'),
            visited: entries.filter(item => item.status === 'visited'),
            known: entries.filter(item => item.status === 'known')
        };
    }
};

if (typeof window !== 'undefined') window.WorldMap = WorldMap;
if (typeof module !== 'undefined' && module.exports) module.exports = WorldMap;
