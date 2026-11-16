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
                knownNames.has(item.from.toLocaleLowerCase('es')) &&
                knownNames.has(item.to.toLocaleLowerCase('es')));
        const order = { current: 0, visible: 1, visited: 2, known: 3 };
        entries.sort((a, b) => order[a.status] - order[b.status] || a.name.localeCompare(b.name, 'es'));
        return {
            current,
            entries,
            connections,
            currentAndVisible: entries.filter(item => item.status === 'current' || item.status === 'visible'),
            visited: entries.filter(item => item.status === 'visited'),
            known: entries.filter(item => item.status === 'known')
        };
    }
    ,

    // Distribución esquemática: organiza solo lugares conocidos y enlaces registrados.
    // Las posiciones son visuales, no coordenadas geográficas ni distancias reales.
    getSchematicLayout(atlas = {}) {
        const entries = Array.isArray(atlas.entries) ? atlas.entries : [];
        const groups = {
            visible: entries.filter(item => item.status === 'visible'),
            visited: entries.filter(item => item.status === 'visited'),
            known: entries.filter(item => item.status === 'known')
        };
        const center = { x: 300, y: 174 };
        const nodes = [];
        const current = entries.find(item => item.status === 'current');
        if (current) nodes.push({ ...current, x: center.x, y: center.y });

        const ringStarts = { visible: 82, visited: 132, known: 184 };
        const maxRadiusX = 245;
        const maxRadiusY = 132;
        Object.entries(groups).forEach(([status, items]) => {
            const ringStart = ringStarts[status];
            const ringCount = Math.ceil(items.length / 8);
            const ringStep = ringCount > 1
                ? Math.max(8, (maxRadiusX - ringStart) / (ringCount - 1))
                : 0;
            items.forEach((item, index) => {
                const ringIndex = Math.floor(index / 8);
                const positionInRing = index % 8;
                const angle = (-Math.PI / 2) + (Math.PI * 2 * positionInRing / 8);
                const radiusX = Math.min(maxRadiusX, ringStart + ringStep * ringIndex);
                const radiusY = Math.min(maxRadiusY, radiusX * 0.72);
                nodes.push({
                    ...item,
                    x: Math.round(center.x + Math.cos(angle) * radiusX),
                    y: Math.round(center.y + Math.sin(angle) * radiusY)
                });
            });
        });

        const byName = new Map(nodes.map(node => [node.name.toLocaleLowerCase('es'), node]));
        const edges = (Array.isArray(atlas.connections) ? atlas.connections : [])
            .map(route => ({
                from: byName.get(String(route.from).toLocaleLowerCase('es')),
                to: byName.get(String(route.to).toLocaleLowerCase('es'))
            }))
            .filter(edge => edge.from && edge.to);
        return { width: 600, height: 348, nodes, edges };
    }
};

if (typeof window !== 'undefined') window.WorldMap = WorldMap;
if (typeof module !== 'undefined' && module.exports) module.exports = WorldMap;
