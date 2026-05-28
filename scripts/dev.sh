#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
APP_URL="http://localhost:3000"
ADMIN_WEB_URL="http://localhost:3000/admin"
ADMIN_CMS_URL="http://localhost:3333/admin"
CMS_URL="http://localhost:3333"
MINIO_CONSOLE_URL="http://localhost:9001"
STOPPED=0
SKIP_DOCKER=0
SKIP_MIGRATE=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --no-docker)
      SKIP_DOCKER=1
      shift
      ;;
    --no-migrate)
      SKIP_MIGRATE=1
      shift
      ;;
    -h | --help)
      cat <<'EOF'
Использование: ./scripts/dev.sh [--no-docker] [--no-migrate]

Локальный dev-стек IVA360 monorepo:
  1. Docker Compose: PostgreSQL + MinIO (+ bucket init)
  2. Payload migrate (apps/cms)
  3. CMS dev server (:3333) + Web dev server (:3000)

  --no-docker   Не поднимать docker compose (сервисы уже запущены)
  --no-migrate  Пропустить pnpm payload migrate
EOF
      exit 0
      ;;
    *)
      echo "Неизвестный аргумент: $1 (см. ./scripts/dev.sh --help)" >&2
      exit 1
      ;;
  esac
done

if [[ -t 1 ]]; then
  C_RESET=$'\033[0m'
  C_BOLD=$'\033[1m'
  C_DIM=$'\033[2m'
  C_BLUE=$'\033[1;34m'
  C_GREEN=$'\033[1;32m'
  C_YELLOW=$'\033[1;33m'
  C_RED=$'\033[1;31m'
  C_CYAN=$'\033[36m'
  C_MAGENTA=$'\033[35m'
  USE_HYPERLINKS=1
else
  C_RESET=""
  C_BOLD=""
  C_DIM=""
  C_BLUE=""
  C_GREEN=""
  C_YELLOW=""
  C_RED=""
  C_CYAN=""
  C_MAGENTA=""
  USE_HYPERLINKS=0
fi

hyperlink() {
  local url="$1"
  local text="${2:-$url}"
  if [[ "$USE_HYPERLINKS" -eq 1 ]]; then
    printf '\033]8;;%s\033\\%s%s%s\033]8;;\033\\' "$url" "$C_CYAN" "$text" "$C_RESET"
  else
    printf '%s' "$text"
  fi
}

print_status() {
  local icon="$1"
  local msg="$2"
  printf "  ${C_GREEN}%s${C_RESET} %s\n" "$icon" "$msg"
}

load_root_env() {
  # shellcheck disable=SC2046
  eval "$(node "$SCRIPT_DIR/load-root-env.mjs")"
}

if ! command -v pnpm >/dev/null 2>&1; then
  echo "${C_RED}Ошибка:${C_RESET} pnpm не найден в PATH."
  exit 1
fi

if [[ ! -f "$ROOT_DIR/package.json" ]]; then
  echo "${C_RED}Ошибка:${C_RESET} не найден package.json в ${ROOT_DIR}."
  exit 1
fi

if [[ ! -f "$ROOT_DIR/.env" ]]; then
  if [[ -f "$ROOT_DIR/.env.example" ]]; then
    echo "${C_YELLOW}Файл .env не найден — копирую из .env.example${C_RESET}"
    cp "$ROOT_DIR/.env.example" "$ROOT_DIR/.env"
    echo "${C_YELLOW}Отредактируйте .env (PAYLOAD_SECRET, POSTGRES_PASSWORD) и перезапустите.${C_RESET}"
  else
    echo "${C_RED}Ошибка:${C_RESET} нет .env и .env.example."
    exit 1
  fi
fi

load_root_env

if [[ -z "${PAYLOAD_SECRET:-}" ]]; then
  echo "${C_RED}Ошибка:${C_RESET} PAYLOAD_SECRET не задан в ${ROOT_DIR}/.env"
  echo "${C_DIM}Скопируйте .env.example → .env и задайте секрет.${C_RESET}"
  exit 1
fi

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "${C_RED}Ошибка:${C_RESET} DATABASE_URL не задан в ${ROOT_DIR}/.env"
  exit 1
fi

wait_for_url() {
  local url="$1"
  local attempts="${2:-30}"
  local i
  for ((i = 1; i <= attempts; i++)); do
    if curl -sf "$url" >/dev/null 2>&1; then
      return 0
    fi
    sleep 1
  done
  return 1
}

kill_port_if_busy() {
  local port="$1"
  local pid
  pid="$(lsof -nP -iTCP:"$port" -sTCP:LISTEN -t 2>/dev/null | head -n 1 || true)"
  if [[ -n "$pid" ]]; then
    echo "${C_YELLOW}Порт ${port} занят (pid ${pid}) — останавливаю процесс...${C_RESET}"
    kill "$pid" 2>/dev/null || true
    sleep 0.2
  fi
}

cleanup() {
  if [[ "$STOPPED" -eq 1 ]]; then
    return
  fi
  STOPPED=1

  echo
  echo "${C_YELLOW}Остановка dev-процессов...${C_RESET}"
  if [[ -n "${CMS_PID:-}" ]]; then
    kill "$CMS_PID" 2>/dev/null || true
  fi
  if [[ -n "${WEB_PID:-}" ]]; then
    kill "$WEB_PID" 2>/dev/null || true
  fi
}

trap cleanup EXIT INT TERM

echo
echo "${C_BLUE}╔══════════════════════════════════════════════════════════════╗${C_RESET}"
echo "${C_BLUE}║${C_RESET}${C_BOLD}${C_GREEN}  IVA360 — локальный dev-стек (monorepo)                     ${C_RESET}${C_BLUE}║${C_RESET}"
echo "${C_BLUE}╚══════════════════════════════════════════════════════════════╝${C_RESET}"
echo "${C_DIM}Путь:${C_RESET} ${ROOT_DIR}"
echo
echo "${C_BOLD}${C_GREEN}Открой в браузере${C_RESET}"
printf "  ${C_DIM}•${C_RESET} Web:         "
hyperlink "$APP_URL" "$APP_URL"
echo
printf "  ${C_DIM}•${C_RESET} Admin (web): "
hyperlink "$ADMIN_WEB_URL" "$ADMIN_WEB_URL"
echo " ${C_DIM}(rewrite → CMS)${C_RESET}"
printf "  ${C_DIM}•${C_RESET} Admin (CMS): "
hyperlink "$ADMIN_CMS_URL" "$ADMIN_CMS_URL"
echo
printf "  ${C_DIM}•${C_RESET} CMS:         "
hyperlink "$CMS_URL" "$CMS_URL"
echo
printf "  ${C_DIM}•${C_RESET} MinIO:       "
hyperlink "$MINIO_CONSOLE_URL" "$MINIO_CONSOLE_URL"
echo
echo "${C_DIM}Остановка:${C_RESET} Ctrl+C ${C_DIM}(Docker-сервисы остаются запущенными)${C_RESET}"
echo "${C_BLUE}──────────────────────────────────────────────────────────────${C_RESET}"
echo

if [[ "$SKIP_DOCKER" -eq 0 ]]; then
  if ! command -v docker >/dev/null 2>&1; then
    echo "${C_RED}Ошибка:${C_RESET} docker не найден. Установите Docker или используйте --no-docker."
    exit 1
  fi

  echo "${C_YELLOW}▸${C_RESET} Запуск PostgreSQL и MinIO (docker compose)..."
  (
    cd "$ROOT_DIR"
    docker compose up -d --wait postgres minio
    docker compose up --no-deps minio-init
  )
  print_status "✓" "Docker-сервисы готовы"
else
  echo "${C_YELLOW}▸${C_RESET} Docker пропущен (--no-docker)"
fi

if [[ "$SKIP_MIGRATE" -eq 0 ]]; then
  echo "${C_YELLOW}▸${C_RESET} Миграции Payload (apps/cms)..."
  # Clears batch -1 dev-push marker, then runs migrations (see pnpm payload:migrate).
  "$SCRIPT_DIR/payload-migrate-yes.sh"
  print_status "✓" "Миграции выполнены"
else
  echo "${C_YELLOW}▸${C_RESET} Миграции пропущены (--no-migrate)"
fi

kill_port_if_busy 3000
kill_port_if_busy 3333

echo "${C_YELLOW}▸${C_RESET} Запуск CMS (:3333) и Web (:3000)..."
print_status "…" "Серверы стартуют — ссылки выше станут активны через несколько секунд"
echo

(
  cd "$ROOT_DIR"
  pnpm --filter @iva360/cms dev 2>&1 | while IFS= read -r line; do
    printf "${C_CYAN}[cms]${C_RESET} %s\n" "$line"
  done
) &
CMS_PID=$!

sleep 2

(
  cd "$ROOT_DIR"
  pnpm --filter @iva360/web dev 2>&1 | while IFS= read -r line; do
    printf "${C_GREEN}[web]${C_RESET} %s\n" "$line"
  done
) &
WEB_PID=$!

if wait_for_url "$APP_URL" 45; then
  echo
  print_status "✓" "Web готов"
  printf "    "
  hyperlink "$APP_URL" "$APP_URL"
  echo
else
  echo "${C_YELLOW}  ! Web (:3000) ещё не отвечает — проверьте лог [web] выше${C_RESET}"
fi

if wait_for_url "$ADMIN_CMS_URL" 15; then
  print_status "✓" "Admin (CMS) готов"
  printf "    "
  hyperlink "$ADMIN_CMS_URL" "$ADMIN_CMS_URL"
  echo
else
  echo "${C_YELLOW}  ! Admin (:3333/admin) ещё не отвечает — проверьте лог [cms] выше${C_RESET}"
fi

if wait_for_url "$ADMIN_WEB_URL" 15; then
  print_status "✓" "Admin (rewrite через Web) готов"
  printf "    "
  hyperlink "$ADMIN_WEB_URL" "$ADMIN_WEB_URL"
  echo
else
  echo "${C_YELLOW}  ! Admin (:3000/admin) ещё не отвечает — проверьте rewrite в apps/web${C_RESET}"
fi

echo
echo "${C_DIM}Логи серверов ниже. Остановка: Ctrl+C${C_RESET}"
echo

wait "$CMS_PID" "$WEB_PID"
