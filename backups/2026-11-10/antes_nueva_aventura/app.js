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

                <button id="startAdventure">${(Save.load() || {}).adventure ? "Continuar aventura" : "Comenzar aventura"}</button>
                <button id="editCharacter">Editar mi personaje</button>
            </section>

            <footer><p>Cosmópolis · Proyecto original</p></footer>
        `;

        document.getElementById('startAdventure').addEventListener('click', () => {
            this.startAdventure(character);
        });

        document.getElementById('editCharacter').addEventListener('click', () => {
            this.showForm(character);
        });
    },

    startAdventure(character) {
        const saved = Save.load();
        const adventure = saved && saved.adventure
            ? saved.adventure
            : Adventure.createOpening(character);

        Save.save({ character, adventure });
        this.showAdventure(character, adventure);
    },

    showAdventure(character, adventure) {
        const app = document.getElementById('app');

        app.innerHTML = `
            <div class="adventure-screen">

                <header class="adventure-header">
                    <h1>Cosmópolis</h1>
                    <button id="backToProfile" type="button">Mi ficha</button>
                </header>

                <main class="story-panel">

                    <div class="scene-image" id="sceneImage">
                        <img id="sceneArtwork"
                            src="${this.escape(adventure.image || '')}"
                            alt="Escenario de la aventura"
                            onerror="this.style.display='none'"
                            onload="document.getElementById('scenePlaceholder').style.display='none'">

                        <div class="scene-placeholder" id="scenePlaceholder">
                            <span>✦</span>
                            <p>El escenario de tu aventura</p>
                        </div>
                    </div>

                    <section class="narrative-panel">
                        <span class="eyebrow">EL RELATO</span>
                        <h2>${this.escape(adventure.title)}</h2>
                        <div id="storyContent" class="story-content"></div>
                        <div id="storyEnd"></div>
                    </section>

                </main>

                <section class="player-panel">
                    <div class="player-heading">
                        <div>
                            <span class="eyebrow">TU TURNO</span>
                            <h3>¿Qué quieres hacer?</h3>
                        </div>
                    </div>

                    <form id="actionForm">
                        <textarea id="playerAction"
                            required
                            placeholder="Escribe aquí tu siguiente acción..."></textarea>
                        <button type="submit">Continuar la historia</button>
                    </form>
                </section>

            </div>
        `;

        document.getElementById('backToProfile').addEventListener('click', () => {
            this.showProfile(character);
        });

        const story = document.getElementById('storyContent');
        const form = document.getElementById('actionForm');
        const input = document.getElementById('playerAction');

        const showStory = () => {
            const actions = Session.getActions();

            let content = `
                <article class="story-entry opening-entry">
                    ${this.escape(adventure.text).replace(/\n/g, '<br>')}
                </article>
            `;

            actions.forEach(action => {
                if (action.response) {
                    content += `
                        <article class="story-entry">
                            ${this.escape(action.response).replace(/\n/g, '<br>')}
                        </article>
                    `;
                }
            });

            story.innerHTML = content;

            document.getElementById('storyEnd').scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            });
        };

        form.addEventListener('submit', event => {
            event.preventDefault();

            const action = input.value.trim();

            if (!action) return;

            const response = Director.respond(
                action,
                character,
                adventure,
                Session.getActions()
            );

            if (Session.addAction(action, response.reply, response)) {
                form.reset();
                showStory();
            }
        });

        showStory();
    }
};

document.addEventListener('DOMContentLoaded', () => Cosmopolis.init());
