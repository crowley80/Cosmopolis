'use strict';

const Cosmopolis = {
    fields: {
        nature: 'Naturaleza y especie',
        appearance: 'Apariencia',
        history: 'Historia personal',
        abilities: 'Capacidades y poderes',
        personality: 'Personalidad'
    },

    escape(value) {
        return String(value || '').replace(/[&<>"']/g, char => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        })[char]);
    },

    init() {
        const saved = Save.load();

        if (saved && saved.character) {
            if (saved.adventure) {
                this.showAdventure(saved.character, saved.adventure);
            } else {
                this.showProfile(saved.character);
            }
        } else {
            this.showForm();
        }
    },

    showForm(character = {}) {
        const app = document.getElementById('app');

        app.innerHTML = `
            <header class="main-header">
                <p class="eyebrow">UNIVERSO DE AVENTURAS</p>
                <h1>Cosmópolis</h1>
                <p>Un universo. Infinitas posibilidades.</p>
            </header>
            <section class="welcome">
                <h2>El universo te espera</h2>
                <p>Antes de comenzar tu aventura, necesitamos conocerte.</p>
            </section>
            <section class="character-creation">
                <div class="section-heading">
                    <span class="eyebrow">TU HISTORIA COMIENZA AQUÍ</span>
                    <h2>Creación del personaje</h2>
                    <p>Describe libremente quién eres. No existen razas, clases ni destinos predeterminados.</p>
                </div>
                <form id="characterForm">
                    <fieldset>
                        <legend>01 · Identidad</legend>
                        <label>Nombre del personaje</label>
                        <input name="name" required placeholder="¿Cómo te llamas?">
                        <label>Naturaleza o especie</label>
                        <textarea name="nature" placeholder="¿Qué clase de ser eres?"></textarea>
                    </fieldset>
                    <fieldset>
                        <legend>02 · Apariencia</legend>
                        <label>Aspecto y características</label>
                        <textarea name="appearance" placeholder="Describe tu aspecto y tus rasgos especiales."></textarea>
                    </fieldset>
                    <fieldset>
                        <legend>03 · Orígenes</legend>
                        <label>Historia personal</label>
                        <textarea name="history" placeholder="Cuéntanos tu pasado y cómo has llegado hasta aquí."></textarea>
                    </fieldset>
                    <fieldset>
                        <legend>04 · Capacidades</legend>
                        <label>Poderes, habilidades y talentos</label>
                        <textarea name="abilities" placeholder="¿Qué sabes hacer? ¿Qué poderes tienes?"></textarea>
                    </fieldset>
                    <fieldset>
                        <legend>05 · Personalidad</legend>
                        <label>Carácter y motivaciones</label>
                        <textarea name="personality" placeholder="¿Cómo eres? ¿Qué deseas? ¿Qué te importa?"></textarea>
                    </fieldset>
                    <button type="submit">Dar vida a mi personaje</button>
                </form>
            </section>
            <footer><p>Cosmópolis · Proyecto original</p></footer>
        `;

        const form = document.getElementById('characterForm');

        Object.entries(character).forEach(([key, value]) => {
            if (form.elements[key]) form.elements[key].value = value;
        });

        form.addEventListener('submit', event => {
            event.preventDefault();
            const data = Object.fromEntries(new FormData(form));
            const created = Character.create(data);
            this.showProfile(created);
        });
    },

    showProfile(character) {
        const app = document.getElementById('app');
        const saved = Save.load();

        const sections = Object.entries(this.fields).map(([key, title]) => `
            <section class="profile-section">
                <h3>${title}</h3>
                <p>${this.escape(character[key] || 'Todavía sin definir.')}</p>
            </section>
        `).join('');

        app.innerHTML = `
            <header class="main-header">
                <p class="eyebrow">EXPEDIENTE DE EXISTENCIA</p>
                <h1>Cosmópolis</h1>
                <p>El universo ya sabe que existes.</p>
            </header>
            <section class="character-creation">
                <div class="section-heading">
                    <span class="eyebrow">FICHA PERSONAL</span>
                    <h2>${this.escape(character.name)}</h2>
                    <p>Este es el comienzo de tu historia.</p>
                </div>
                ${sections}
                <button id="startAdventure">${saved && saved.adventure ? 'Continuar aventura guardada' : 'Comenzar aventura'}</button>
                <button id="newAdventure">Comenzar una aventura nueva</button>
                <button id="editCharacter">Editar mi personaje</button>
            </section>
            <footer><p>Cosmópolis · Proyecto original</p></footer>
        `;

        document.getElementById('startAdventure').addEventListener('click', () => {
            this.startAdventure(character);
        });

        document.getElementById('newAdventure').addEventListener('click', () => {
            this.startNewAdventure(character);
        });

        document.getElementById('editCharacter').addEventListener('click', () => {
            this.showForm(character);
        });
    },

    startAdventure(character) {
        const saved = Save.load();

        if (saved && saved.adventure) {
            this.showAdventure(saved.character, saved.adventure);
        } else {
            this.startNewAdventure(character);
        }
    },

    startNewAdventure(character) {
        const adventure = Adventure.createOpening(character);

        if (!Session.startNewAdventure(character, adventure)) {
            alert('No se ha podido guardar la nueva aventura. La partida anterior no se ha eliminado.');
            return;
        }

        this.showAdventure(character, adventure);
    },

    showAdventure(character, adventure) {
        const app = document.getElementById('app');

        const now = new Date();
        const clock = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        const dateLabel = now.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

        app.innerHTML =
            '<div class="adventure-screen">' +
                '<span class="paper-fold paper-fold--tl" aria-hidden="true"></span><span class="paper-fold paper-fold--tr" aria-hidden="true"></span><span class="paper-fold paper-fold--br" aria-hidden="true"></span><span class="paper-fold paper-fold--bl" aria-hidden="true"></span>' +
                '<header class="manuscript-header">' +
                    '<div class="compass compass-left" aria-hidden="true"><svg viewBox="0 0 120 120" aria-hidden="true"><defs><linearGradient id="roseGold" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f2d18a"/><stop offset=".48" stop-color="#9b6128"/><stop offset="1" stop-color="#321506"/></linearGradient></defs><circle cx="60" cy="60" r="56" fill="none" stroke="#3a1a07" stroke-width="2.4"/><circle cx="60" cy="60" r="51" fill="none" stroke="#d4a45e" stroke-width="1.4"/><circle cx="60" cy="60" r="43" fill="none" stroke="#6b3b14" stroke-width="1.2" stroke-dasharray="1.8 3.1"/><g stroke="#542909" stroke-width="1.3"><path d="M60 5V18 M60 102V115 M5 60H18 M102 60H115 M21 21L30 30 M90 90L99 99 M99 21L90 30 M30 90L21 99"/></g><path d="M60 8 L69 48 L110 60 L69 72 L60 112 L51 72 L10 60 L51 48Z" fill="url(#roseGold)" stroke="#351604" stroke-width="2"/><path d="M60 19 L64 55 L101 60 L64 65 L60 101 L56 65 L19 60 L56 55Z" fill="#e8c47d" stroke="#4a2309" stroke-width="1.5"/><path d="M60 8L60 112 M10 60H110 M21 21L99 99 M99 21L21 99" stroke="#4b240b" stroke-width="1.4"/><path d="M60 28 L66 55 L92 60 L66 65 L60 92 L54 65 L28 60 L54 55Z" fill="#713c13" stroke="#e4bd77" stroke-width="1.5"/><circle cx="60" cy="60" r="8" fill="#321506" stroke="#e7c27a" stroke-width="2"/><circle cx="60" cy="60" r="2.5" fill="#f4d99e"/><path d="M60 2L63 12L60 9L57 12Z M118 60L108 63L111 60L108 57Z M60 118L57 108L60 111L63 108Z M2 60L12 57L9 60L12 63Z" fill="#321506" stroke="#d9ad69" stroke-width=".8"/></svg><span class="north">N</span><span class="east">E</span><span class="south">S</span><span class="west">O</span></div>' +
                    '<div class="wordmark"><h1>Cosmópolis</h1><p>Una aventura sin límites</p></div>' +
                    '<div class="manuscript-meta"><span>Ubicación: ' + this.escape(adventure.location || 'Tierras desconocidas') + '</span><span>Hora: ' + clock + '</span><span>Día: ' + dateLabel + '</span></div>' +
                    '<div class="compass compass-right" aria-hidden="true"><svg viewBox="0 0 120 120" aria-hidden="true"><defs><linearGradient id="roseGold" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f2d18a"/><stop offset=".48" stop-color="#9b6128"/><stop offset="1" stop-color="#321506"/></linearGradient></defs><circle cx="60" cy="60" r="56" fill="none" stroke="#3a1a07" stroke-width="2.4"/><circle cx="60" cy="60" r="51" fill="none" stroke="#d4a45e" stroke-width="1.4"/><circle cx="60" cy="60" r="43" fill="none" stroke="#6b3b14" stroke-width="1.2" stroke-dasharray="1.8 3.1"/><g stroke="#542909" stroke-width="1.3"><path d="M60 5V18 M60 102V115 M5 60H18 M102 60H115 M21 21L30 30 M90 90L99 99 M99 21L90 30 M30 90L21 99"/></g><path d="M60 8 L69 48 L110 60 L69 72 L60 112 L51 72 L10 60 L51 48Z" fill="url(#roseGold)" stroke="#351604" stroke-width="2"/><path d="M60 19 L64 55 L101 60 L64 65 L60 101 L56 65 L19 60 L56 55Z" fill="#e8c47d" stroke="#4a2309" stroke-width="1.5"/><path d="M60 8L60 112 M10 60H110 M21 21L99 99 M99 21L21 99" stroke="#4b240b" stroke-width="1.4"/><path d="M60 28 L66 55 L92 60 L66 65 L60 92 L54 65 L28 60 L54 55Z" fill="#713c13" stroke="#e4bd77" stroke-width="1.5"/><circle cx="60" cy="60" r="8" fill="#321506" stroke="#e7c27a" stroke-width="2"/><circle cx="60" cy="60" r="2.5" fill="#f4d99e"/><path d="M60 2L63 12L60 9L57 12Z M118 60L108 63L111 60L108 57Z M60 118L57 108L60 111L63 108Z M2 60L12 57L9 60L12 63Z" fill="#321506" stroke="#d9ad69" stroke-width=".8"/></svg><span class="north">N</span><span class="east">E</span><span class="south">S</span><span class="west">O</span></div>' +
                    
                '</header>' +
                '<main class="story-panel" id="storyPanel">' +
                    '<section class="narrative-panel">' +
                        '<div class="story-ornament" aria-hidden="true">— ❧ —</div>' +
                        '<span class="eyebrow">LA HISTORIA · ' + this.escape(adventure.location || '') + '</span>' +
                        '<h2>' + this.escape(adventure.title || 'Tu aventura') + '</h2>' +
                        '<div id="storyContent" class="story-content"></div>' +
                    '</section>' +
                '</main>' +
                '<section class="player-panel">' +
                    '<div class="player-heading"><span>Tu turno · Escribe tu acción</span><button id="backToProfile" type="button">Mi ficha</button></div>' +
                    '<form id="actionForm">' +
                        '<div class="quill-inkwell" aria-hidden="true">' +
                            '<svg viewBox="0 0 120 140" role="presentation"><defs><linearGradient id="featherTone" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f0d18e"/><stop offset=".38" stop-color="#9b672e"/><stop offset="1" stop-color="#3b1d09"/></linearGradient><linearGradient id="inkGlass" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#170b05"/><stop offset=".28" stop-color="#71431e"/><stop offset=".52" stop-color="#241006"/><stop offset=".8" stop-color="#8b5b2b"/><stop offset="1" stop-color="#1a0b04"/></linearGradient></defs><path d="M48 12 C25 17 10 42 14 72 C17 91 31 101 39 108 C39 83 46 48 48 12Z" fill="url(#featherTone)" stroke="#321705" stroke-width="2"/><path d="M47 14 C53 36 48 68 39 108" fill="none" stroke="#f0d39a" stroke-width="2.4"/><g fill="none" stroke="#4b260d" stroke-width="1.4"><path d="M43 28L23 35 M43 38L18 49 M42 49L17 62 M41 60L20 75 M40 72L26 87 M49 29L61 35 M48 40L59 48 M46 52L56 62 M44 65L51 76 M42 78L47 88"/></g><path d="M39 108L79 24" fill="none" stroke="#2c1508" stroke-width="2.5"/><path d="M76 22L83 10L82 28L78 34Z" fill="#d8b574" stroke="#4a250c" stroke-width="1.5"/><path d="M23 100 Q15 108 19 124 Q40 137 66 125 Q73 112 61 100Z" fill="url(#inkGlass)" stroke="#1c0b03" stroke-width="3"/><path d="M29 100L29 91Q40 86 53 91L54 101" fill="#4b2810" stroke="#1d0b03" stroke-width="2"/><path d="M25 109Q42 117 64 109 M23 120Q42 130 66 120" fill="none" stroke="#c18a48" stroke-width="2"/><path d="M32 105Q27 114 32 122" fill="none" stroke="#e5c17e" stroke-width="2" opacity=".75"/><ellipse cx="41" cy="91" rx="15" ry="4" fill="#a9783d" stroke="#321705" stroke-width="2"/><path d="M31 89L31 83Q41 79 51 83L51 89" fill="#5a3215" stroke="#321705" stroke-width="2"/></svg>' +
                        '</div>' +
                        '<textarea id="playerAction" required placeholder="Escribe aquí tu acción..."></textarea>' +
                        '<button type="submit">Enviar</button>' +
                    '</form>' +
                '</section>' +
            '</div>';

        document.getElementById('backToProfile').addEventListener('click', () => {
            this.showProfile(character);
        });

        const story = document.getElementById('storyContent');
        const storyPanel = document.getElementById('storyPanel');
        const form = document.getElementById('actionForm');
        const input = document.getElementById('playerAction');

        const showStory = () => {
            const actions = Session.getActions();

            if (actions.length > 0) {
                const latest = actions[actions.length - 1];

                story.innerHTML =
                    '<article class="story-entry current-page">' +
                        '<p class="current-action">' +
                            'Has decidido: ' + this.escape(latest.text || '') +
                        '</p>' +
                        '<div class="world-response">' +
                            this.escape(latest.response || '').replace(/\n/g, '<br>') +
                        '</div>' +
                    '</article>';
            } else {
                story.innerHTML =
                    '<article class="story-entry opening-entry">' +
                        this.escape(adventure.text || '').replace(/\n/g, '<br>') +
                    '</article>';
            }

            storyPanel.scrollTop = 0;
        };

        form.addEventListener('submit', event => {
            event.preventDefault();
            const action = input.value.trim();
            if (!action) return;

            const saved = Save.load();
            const currentAdventure = saved && saved.adventure
                ? saved.adventure
                : adventure;

            try {
                const response = Director.respond(
                    action,
                    character,
                    currentAdventure,
                    Session.getActions()
                );

                if (Session.addAction(action, response.reply, response)) {
                    form.reset();
                    showStory();
                } else {
                    alert('No se ha podido guardar la acción. Inténtalo de nuevo.');
                    input.focus();
                }
            } catch (error) {
                console.error('Error al procesar la acción:', error);
                alert('Ha ocurrido un error al procesar tu acción. La partida se conserva. Puedes volver a intentarlo.');
                input.focus();
            }
        });

        showStory();
    }
};

document.addEventListener('DOMContentLoaded', () => Cosmopolis.init());
