'use strict';

const Character = {
    create(data, options = {}) {
        const character = {
            name: data.name || 'Sin nombre',
            nature: data.nature || '',
            appearance: data.appearance || '',
            history: data.history || '',
            abilities: data.abilities || '',
            personality: data.personality || '',
            createdAt: options.update && options.previousCreatedAt
                ? options.previousCreatedAt
                : new Date().toISOString()
        };

        let saved;
        if (options.update) {
            saved = Save.updateCharacter(character);
        } else {
            saved = Save.createSlot(character, null);
        }
        if (!saved) throw new Error('No se pudo guardar la ficha del personaje.');
        return character;
    }
};

window.Character = Character;
