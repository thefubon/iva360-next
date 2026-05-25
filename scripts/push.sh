#!/usr/bin/env bash
# Push существующих коммитов в origin (auto-commit не выполняется).
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

if [[ -t 1 ]]; then
  C_RESET=$'\033[0m'
  C_BLUE=$'\033[1;34m'
  C_GREEN=$'\033[1;32m'
  C_YELLOW=$'\033[1;33m'
  C_RED=$'\033[1;31m'
  C_DIM=$'\033[2m'
else
  C_RESET=""
  C_BLUE=""
  C_GREEN=""
  C_YELLOW=""
  C_RED=""
  C_DIM=""
fi

usage() {
  cat <<'EOF'
Использование: ./scripts/push.sh

Отправляет только уже существующие коммиты в origin.
Auto-commit не выполняется.

Репозиторий без origin пропускается.
EOF
}

ensure_git_repo() {
  local dir="$1"
  git -C "$dir" rev-parse --git-dir >/dev/null 2>&1
}

has_origin() {
  local dir="$1"
  git -C "$dir" remote get-url origin >/dev/null 2>&1
}

current_branch() {
  local dir="$1"
  git -C "$dir" branch --show-current 2>/dev/null || echo "HEAD"
}

push_one_repo() {
  local dir="$1"
  local label branch push_output push_status

  label="iva360-next"

  if ! ensure_git_repo "$dir"; then
    echo "${C_RED}✗ ${label}:${C_RESET} не git-репозиторий"
    return 1
  fi

  if ! has_origin "$dir"; then
    echo "${C_YELLOW}○ ${label}:${C_RESET} origin не настроен — пропуск"
    return 0
  fi

  branch="$(current_branch "$dir")"

  if [[ -n "$(git -C "$dir" status --porcelain)" ]]; then
    echo "${C_YELLOW}! ${label}:${C_RESET} есть незакоммиченные изменения (push только существующих коммитов)"
  fi

  if ! git -C "$dir" rev-parse --abbrev-ref "@{upstream}" >/dev/null 2>&1; then
    if ! push_output="$(git -C "$dir" push -u origin "$branch" 2>&1)"; then
      echo "${C_RED}✗ ${label}:${C_RESET} ${push_output}"
      return 1
    fi
    echo "${C_GREEN}✓ ${label}:${C_RESET} отправлено в origin/${branch} (upstream установлен)"
    return 0
  fi

  if push_output="$(git -C "$dir" push 2>&1)"; then
    if [[ "$push_output" == *"Everything up-to-date"* ]]; then
      echo "${C_GREEN}✓ ${label}:${C_RESET} уже синхронизирован с origin/${branch}"
    else
      echo "${C_GREEN}✓ ${label}:${C_RESET} отправлено в origin/${branch}"
      [[ -n "$push_output" ]] && echo "    ${C_DIM}${push_output}${C_RESET}"
    fi
    return 0
  fi

  push_status=$?
  echo "${C_RED}✗ ${label}:${C_RESET} ошибка push — ${push_output}"
  return "$push_status"
}

main() {
  case "${1:-}" in
    -h | --help | help)
      usage
      exit 0
      ;;
    "")
      ;;
    *)
      echo "${C_RED}Неизвестный аргумент:${C_RESET} $1" >&2
      echo
      usage >&2
      exit 1
      ;;
  esac

  echo "${C_BLUE}============================================================${C_RESET}"
  echo "${C_GREEN} Git push — iva360-next${C_RESET}"
  echo "${C_BLUE}============================================================${C_RESET}"
  echo "${C_DIM}Только существующие коммиты, auto-commit не выполняется.${C_RESET}"
  echo

  if push_one_repo "$ROOT_DIR"; then
    echo
    echo "${C_GREEN}Готово:${C_RESET} push успешен или пропущен (нет origin)."
  else
    echo
    echo "${C_RED}Ошибка:${C_RESET} push завершился неудачей."
    exit 1
  fi
}

main "$@"
