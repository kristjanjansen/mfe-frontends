#!/usr/bin/env bash
set -euo pipefail

APPS=(mfe-layout mfe-billing mfe-dashboard mfe-cookiebot)
BASE_PORT=4000

PIDS=()
cleanup() { kill "${PIDS[@]:-}" 2>/dev/null || true; }
trap cleanup EXIT

for i in "${!APPS[@]}"; do
  PORT=$((BASE_PORT + i))
  APP="${APPS[$i]}" npx vite --port "$PORT" &
  PIDS+=("$!")
done

wait
