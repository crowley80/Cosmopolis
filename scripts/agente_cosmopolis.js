'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const API = 'http://127.0.0.1:8081/v1/chat/completions';
const STATE_FILE = path.join(__dirname, 'agente_estado.json');

function loadTaskFromArgs() {
  const args = process.argv.slice(2);
  const files = [];
  const description = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--file') {
      if (!args[i + 1]) throw new Error('Falta la ruta después de --file.');
      files.push(args[++i]);
    } else if (args[i] === '--help' || args[i] === '-h') {
      console.log('Uso: node scripts/agente_cosmopolis.js --file ruta/archivo "tarea"');
      process.exit(0);
    } else description.push(args[i]);
  }
  const objective = description.join(' ').trim();
  if (!objective) throw new Error('Indica la tarea entre comillas.');
  if (!files.length) throw new Error('Indica al menos un archivo con --file.');
  if (objective.length > 1800) throw new Error('La tarea supera 1800 caracteres.');
  if (new Set(files).size !== files.length) throw new Error('Hay rutas repetidas.');
  return files.map(file => ({
    id: crypto.createHash('sha1').update(file + objective).digest('hex').slice(0, 12),
    file, support: [], objective
  }));
}

const TASKS = loadTaskFromArgs();;

function read(relative) {
  const file = path.join(ROOT, relative);
  if (!fs.existsSync(file)) throw new Error(`Falta el archivo ${relative}`);
  const content = fs.readFileSync(file, 'utf8');
  if (content.length > 6500) {
    throw new Error(`${relative} supera 6500 caracteres; acota la tarea a un fragmento para respetar los 4096 tokens.`);
  }
  return content;
}

function run(command, args, input) {
  return execFileSync(command, args, {
    cwd: ROOT,
    encoding: 'utf8',
    input,
    stdio: ['pipe', 'pipe', 'pipe']
  });
}

function loadState() {
  if (!fs.existsSync(STATE_FILE)) return { completed: [] };
  return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function extractPatch(answer, target) {
  let patch = answer.match(/```(?:diff|patch)?\s*([\s\S]*?)```/i)?.[1];

  if (!patch) {
    const index = answer.indexOf('diff --git ');
    if (index >= 0) patch = answer.slice(index);
  }

  if (!patch) throw new Error('Qwen no devolvió un parche reconocible.');

  patch = patch.trim() + '\n';

  const headers = patch.split('\n').filter(line =>
    line.startsWith('diff --git ') ||
    line.startsWith('--- ') ||
    line.startsWith('+++ ')
  );

  if (!headers.length) throw new Error('El parche no contiene cabeceras válidas.');

  for (const line of headers) {
    const paths = line.match(/(?:a|b)\/[^\s]+/g) || [];
    for (const p of paths) {
      if (p !== `a/${target}` && p !== `b/${target}`) {
        throw new Error(`Parche rechazado: intenta tocar ${p}`);
      }
    }
  }

  if (!patch.includes(`a/${target}`) || !patch.includes(`b/${target}`)) {
    throw new Error('El parche no identifica correctamente el archivo autorizado.');
  }

  if (patch.split('\n').length > 650) {
    throw new Error('Parche demasiado grande. Se rechaza por seguridad.');
  }

  return patch;
}

async function askQwen(task) {
  const target = read(task.file);
  const supportContext = task.id === 'director'
    ? [
        '===== CONTEXTO AUXILIAR: Adventure.createOpening =====',
        '- La aventura comienza en phase arrival, en Camino de entrada a Valdebruma.',
        '- Estado inicial: arrivalActions 0, bellRings 0, eliaTrust 0.',
        '- currentLocation: Camino de entrada a Valdebruma.',
        '- bellInvestigated, wellInspected y wellOpened comienzan en false.',
        '- eliaMet comienza en false; clues y characters comienzan vacios.',
        '- knownFacts inicial contiene solamente la llegada a Valdebruma y su ubicacion en un valle entre montanas.',
        '- events inicial contiene Llegada a Valdebruma.',
        '===== CONTRATOS DE SESSION =====',
        '- startNewAdventure(character, adventure) archiva la partida anterior y guarda character, adventure, actions vacias y world con events, facts y relationships.',
        '- addAction(action, response, details) guarda la accion, actualiza adventure si details.adventure existe y registra eventos y hechos del mundo.',
        '- getActions() devuelve las acciones guardadas.',
        '- getWorld() devuelve events, facts y relationships.',
        '- No inventes propiedades ni APIs adicionales.'
      ].join('\n')
    : task.support.map(relative =>
        '===== ARCHIVO AUXILIAR (SOLO REFERENCIA): ' + relative + ' =====\n' + read(relative)
      ).join('\n\n');


  const prompt = `
Eres el agente programador local de Cosmópolis.

TAREA AUTORIZADA:
${task.objective}

ARCHIVO QUE PUEDES MODIFICAR:
${task.file}

REGLAS OBLIGATORIAS:
- Estudia el archivo completo y todo el contexto auxiliar que se te proporciona. No presupongas información de archivos cuyo contenido no esté incluido en el contexto.
- No inventes funciones, variables, módulos ni APIs.
- Conserva el comportamiento que no esté relacionado con la tarea.
- No modifiques ningún otro archivo.
- No elimines funcionalidades por simplificar.
- No supongas que el jugador conoce a Elia ni el pozo al comenzar.
- Si no puedes resolverlo con seguridad, devuelve exactamente: NO_SEGURO
- No devuelvas explicaciones ni código completo.
- Devuelve únicamente un parche unified diff aplicable con git apply.
- Usa las rutas exactas indicadas.
- El parche debe ser pequeño y coherente.

${supportContext}\n\n===== ARCHIVO COMPLETO MODIFICABLE: ${task.file} =====
${target}
`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 900000);

  try {
    const response = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'local',
        messages: [
          {
            role: 'system',
            content: 'Eres un programador prudente. La integridad del proyecto es prioritaria.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
        max_tokens: 1400,
        chat_template_kwargs: { enable_thinking: false }
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Servidor IA HTTP ${response.status}: ${detail.slice(0, 1800)}`);
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || '';

    if (answer.trim() === 'NO_SEGURO') {
      throw new Error('Qwen no considera seguro realizar esta tarea.');
    }

    return extractPatch(answer, task.file);
  } finally {
    clearTimeout(timeout);
  }
}

function applyTask(task, patch) {
  const target = path.join(ROOT, task.file);
  const original = fs.readFileSync(target);
  const masterPath = path.join(ROOT, 'docs/MAESTRO_COSMOPOLIS.md');
  const masterOriginal = fs.readFileSync(masterPath);

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backup = `${target}.bak-agente-${stamp}`;
  const masterBackup = `${masterPath}.bak-agente-${stamp}`;

  fs.copyFileSync(target, backup);

  let applied = false;

  try {
    run('git', ['apply', '--check', '--whitespace=nowarn'], patch);
    run('git', ['apply', '--whitespace=nowarn'], patch);
    applied = true;

    if (['.js', '.cjs', '.mjs'].includes(path.extname(task.file))) run('node', ['--check', task.file]);
    run('git', ['diff', '--check', '--', task.file]);

    const updated = fs.readFileSync(target, 'utf8');

    if (!updated.trim()) throw new Error('El archivo ha quedado vacío.');

    fs.copyFileSync(masterPath, masterBackup);

    const log = `

## Trabajo del agente local — ${new Date().toISOString()}

- Tarea: ${task.id}
- Archivo modificado: \`${task.file}\`
- Copia de seguridad: \`${path.basename(backup)}\`
- Validación: \`node --check\` superada.
- Integridad del diff: \`git diff --check\` superada.
- Aplicación: parche comprobado previamente con \`git apply --check\`.
- Alcance: solo se autorizó modificar el archivo indicado.
- Revisión narrativa en navegador: pendiente.

`;

    fs.appendFileSync(masterPath, log);
    return backup;
  } catch (error) {
    if (applied) fs.writeFileSync(target, original);
    fs.writeFileSync(masterPath, masterOriginal);
    throw error;
  }
}

async function main() {
  console.log('\n================================');
  console.log('   AGENTE COSMOPOLIS AUTÓNOMO');
  console.log('Razonamiento interno desactivado para reservar tokens al parche.');
  console.log('================================\n');

  const state = loadState();

  for (const task of TASKS) {
    if (state.completed.includes(task.id)) {
      console.log(`Ya completada: ${task.id}`);
      continue;
    }

    console.log(`\nTAREA: ${task.id}`);
    console.log(`Archivo: ${task.file}`);
    console.log('Leyendo archivo dentro del límite de contexto y consultando Qwen...');

    let success = false;

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`Intento ${attempt}/2`);
        const patch = await askQwen(task);
        const backup = applyTask(task, patch);

        state.completed.push(task.id);
        saveState(state);

        console.log('TAREA VALIDADA.');
        console.log(`Copia: ${backup}`);
        success = true;
        break;
      } catch (error) {
        console.error(`No se pudo completar: ${error.message}`);
      }
    }

    if (!success) {
      console.log('\nAgente detenido por seguridad.');
      console.log('No continuará con la siguiente tarea.');
      return;
    }
  }

  console.log('\n================================');
  console.log('   TRABAJO PROGRAMADO TERMINADO');
  console.log('================================');
  console.log('Tareas completadas:', state.completed.join(', ') || 'ninguna');
  console.log('No se ha realizado ningún commit ni push.');
}

main().catch(error => {
  console.error('\nERROR DEL AGENTE:', error.message);
  process.exitCode = 1;
});
