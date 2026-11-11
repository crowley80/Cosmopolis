'use strict';

const Session = {
    addAction(action, response = '') {
        const saved = Save.load();

        if (!saved || !saved.character || !saved.adventure) {
            return false;
        }

        saved.actions = saved.actions || [];

        saved.actions.push({
            text: action,
            response: response,
            createdAt: new Date().toISOString()
        });

        Save.save(saved);
        return true;
    },

    getActions() {
        const saved = Save.load();
        return saved && saved.actions ? saved.actions : [];
    }
};

window.Session = Session;
