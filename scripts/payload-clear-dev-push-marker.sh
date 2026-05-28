#!/usr/bin/env bash
# Remove Payload dev schema-push marker (payload_migrations.batch = -1).
# Safe to run anytime; idempotent. Prevents "run Payload in dev mode" migrate prompt.
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

if ! command -v docker >/dev/null 2>&1; then
  echo "docker не найден — очистка batch -1 пропущена." >&2
  exit 0
fi

# shellcheck disable=SC2046
eval "$(node "$SCRIPT_DIR/load-root-env.mjs")"

if [[ -z "${POSTGRES_USER:-}" || -z "${POSTGRES_PASSWORD:-}" || -z "${POSTGRES_DB:-}" ]]; then
  echo "POSTGRES_* не заданы в .env — очистка batch -1 пропущена." >&2
  exit 0
fi

cd "$ROOT_DIR"
deleted="$(
  docker compose exec -T postgres \
    psql -q -t -A "postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5432/${POSTGRES_DB}" \
    -c "DELETE FROM payload_migrations WHERE batch = -1 RETURNING id;" 2>/dev/null || true
)"

if [[ -n "$deleted" ]]; then
  echo "Удалена запись dev push (batch -1) из payload_migrations."
else
  echo "Запись batch -1 не найдена — БД уже чистая."
fi
