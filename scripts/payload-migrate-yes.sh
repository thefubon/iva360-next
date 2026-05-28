#!/usr/bin/env bash
# Non-interactive Payload migrate: clears dev-push marker, auto-confirms if needed.
# Use `pnpm payload:migrate` — not bare `pnpm payload migrate` (TTY prompt).
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

"$SCRIPT_DIR/payload-clear-dev-push-marker.sh" >/dev/null 2>&1 || true
printf 'y\n' | CI=true PAYLOAD_MIGRATING=true pnpm payload migrate "$@"
