#!/data/data/com.termux/files/usr/bin/bash
set -eu

BIN="$HOME/llama.cpp/build/bin/llama-server"
MODEL="$HOME/models/cosmopolis/Qwen3.5-4B-Q4_K_M.gguf"
LOG="$HOME/cosmopolis-llama-server.log"
HEALTH="http://127.0.0.1:8081/health"

if [ ! -x "$BIN" ]; then
  echo "No se encuentra llama-server compilado: $BIN"
  exit 1
fi

if [ ! -f "$MODEL" ]; then
  echo "No se encuentra el modelo Qwen3.5-4B: $MODEL"
  exit 1
fi

if command -v curl >/dev/null 2>&1 && curl -fsS "$HEALTH" >/dev/null 2>&1; then
  echo "El narrador local ya está activo en 127.0.0.1:8081"
  exit 0
fi

nohup "$BIN" \
  --model "$MODEL" \
  --reasoning off \
  --host 127.0.0.1 \
  --port 8081 \
  --ctx-size 4096 \
  --threads 4 \
  --parallel 1 \
  --no-webui \
  --cors-origins http://127.0.0.1:8080 \
  > "$LOG" 2>&1 < /dev/null &

PID=$!
echo "Servidor narrativo iniciado en segundo plano. PID: $PID"
echo "Registro: $LOG"
echo "Comprueba la carga con: tail -n 30 \"$LOG\""
echo "Cuando indique que está listo, /health responderá en 127.0.0.1:8081/health"
