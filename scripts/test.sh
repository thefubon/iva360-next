#!/usr/bin/env bash
# Pre-push quality gate: lint, typecheck, test, build, security, git hygiene.
# Независимые проверки запускаются параллельно; live-прогресс в терминале.
set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

QUICK=0
INTERACTIVE=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --quick)
      QUICK=1
      shift
      ;;
    -h | --help)
      cat <<'EOF'
Использование: ./scripts/test.sh [--quick]

Pre-push gate для iva360-next: lint, typecheck, test, build, security, git hygiene.
Независимые проверки выполняются параллельно с live-прогрессом.

  --quick   Пропустить build и e2e — быстрая проверка

Код выхода: 0 — можно пушить, 1 — пуш заблокирован.
EOF
      exit 0
      ;;
    *)
      echo "Неизвестный аргумент: $1 (см. ./scripts/test.sh --help)" >&2
      exit 1
      ;;
  esac
done

if [[ -t 1 ]]; then
  INTERACTIVE=1
  C_RESET=$'\033[0m'
  C_BLUE=$'\033[1;34m'
  C_GREEN=$'\033[1;32m'
  C_YELLOW=$'\033[1;33m'
  C_RED=$'\033[1;31m'
  C_DIM=$'\033[2m'
  C_BOLD=$'\033[1m'
  C_CYAN=$'\033[36m'
else
  C_RESET=""
  C_BLUE=""
  C_GREEN=""
  C_YELLOW=""
  C_RED=""
  C_DIM=""
  C_BOLD=""
  C_CYAN=""
fi

STARTED_AT="$(date '+%Y-%m-%d %H:%M:%S')"
STATE_DIR="$(mktemp -d "${TMPDIR:-/tmp}/iva360-gate.XXXXXX")"
trap 'rm -rf "$STATE_DIR"' EXIT

JOB_DEFS=()
CRITICAL_FAILED=0
WARNINGS=0
PNPM_OK=1
PROGRESS_LINES=0

ensure_git_repo() {
  local dir="$1"
  git -C "$dir" rev-parse --git-dir >/dev/null 2>&1
}

run_pnpm_in() {
  local dir="$1"
  shift
  (cd "$dir" && pnpm "$@")
}

register_job() {
  JOB_DEFS+=("$1|$2|$3")
  echo "pending" >"$STATE_DIR/$1.status"
  : >"$STATE_DIR/$1.detail"
  : >"$STATE_DIR/$1.log"
}

job_set() {
  local id="$1" status="$2" detail="${3:-}"
  echo "$status" >"$STATE_DIR/$id.status"
  if [[ -n "$detail" ]]; then
    echo "$detail" >"$STATE_DIR/$id.detail"
  fi
}

job_get_status() {
  cat "$STATE_DIR/$1.status" 2>/dev/null || echo "pending"
}

job_get_detail() {
  cat "$STATE_DIR/$1.detail" 2>/dev/null || true
}

cleanup_playwright_artifacts() {
  rm -rf "$ROOT_DIR/playwright-report" "$ROOT_DIR/test-results" "$ROOT_DIR/blob-report"
}

symbol_for() {
  case "$1" in
    pass) echo "✓" ;;
    fail) echo "✗" ;;
    skip) echo "○" ;;
    warn) echo "!" ;;
    running) echo "⟳" ;;
    pending) echo "○" ;;
    *) echo "?" ;;
  esac
}

color_for() {
  case "$1" in
    pass) echo "$C_GREEN" ;;
    fail) echo "$C_RED" ;;
    skip) echo "$C_YELLOW" ;;
    warn) echo "$C_YELLOW" ;;
    running) echo "$C_CYAN" ;;
    pending) echo "$C_DIM" ;;
    *) echo "$C_RESET" ;;
  esac
}

is_terminal_status() {
  case "$1" in
    pass | fail | skip | warn) return 0 ;;
    *) return 1 ;;
  esac
}

count_progress() {
  local completed=0 total="${#JOB_DEFS[@]}"
  local row id status
  for row in "${JOB_DEFS[@]}"; do
    IFS='|' read -r id _ _ <<<"$row"
    status="$(job_get_status "$id")"
    if is_terminal_status "$status"; then
      completed=$((completed + 1))
    fi
  done
  echo "$completed $total"
}

exec_job() {
  local id="$1"
  local log="$STATE_DIR/$id.log"

  job_set "$id" running

  case "$id" in
    deps-pnpm)
      if ! command -v pnpm >/dev/null 2>&1; then
        job_set "$id" fail "pnpm не найден"
        return 1
      fi
      job_set "$id" pass "$(pnpm --version 2>/dev/null || echo '?')"
      return 0
      ;;

    lint)
      if run_pnpm_in "$ROOT_DIR" lint >"$log" 2>&1; then
        job_set "$id" pass
        return 0
      fi
      job_set "$id" fail "см. вывод ниже"
      return 1
      ;;

    typecheck)
      if run_pnpm_in "$ROOT_DIR" typecheck >"$log" 2>&1; then
        job_set "$id" pass
        return 0
      fi
      job_set "$id" fail
      return 1
      ;;

    test-int)
      if run_pnpm_in "$ROOT_DIR" test:int >"$log" 2>&1; then
        job_set "$id" pass
        return 0
      fi
      job_set "$id" fail
      return 1
      ;;

    test-e2e)
      if [[ "$QUICK" -eq 1 ]]; then
        job_set "$id" skip "флаг --quick"
        return 0
      fi
      if run_pnpm_in "$ROOT_DIR" test:e2e >"$log" 2>&1; then
        job_set "$id" pass "опционально"
        return 0
      fi
      job_set "$id" warn "e2e не прошли (не блокирует push)"
      return 0
      ;;

    build)
      if [[ "$QUICK" -eq 1 ]]; then
        job_set "$id" skip "флаг --quick"
        return 0
      fi
      if run_pnpm_in "$ROOT_DIR" build >"$log" 2>&1; then
        job_set "$id" pass
        return 0
      fi
      job_set "$id" fail
      return 1
      ;;

    sec-env)
      if ! ensure_git_repo "$ROOT_DIR"; then
        job_set "$id" pass
        return 0
      fi
      local tracked
      tracked="$(git -C "$ROOT_DIR" ls-files 2>/dev/null | grep -E '(^|/)\.env$|(^|/)\.env\.local$|(^|/)\.env\.production$' || true)"
      if [[ -n "$tracked" ]]; then
        job_set "$id" fail "$(echo "$tracked" | tr '\n' ', ' | sed 's/,$//')"
        return 1
      fi
      job_set "$id" pass
      return 0
      ;;

    sec-patterns)
      if ! ensure_git_repo "$ROOT_DIR"; then
        job_set "$id" pass
        return 0
      fi
      local hits count
      hits="$(git -C "$ROOT_DIR" grep -n -E \
        'AKIA[0-9A-Z]{16}|sk_live_[a-zA-Z0-9]{20,}|ghp_[a-zA-Z0-9]{36,}|gho_[a-zA-Z0-9]{36,}|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----' \
        -- ':!*.lock' ':!pnpm-lock.yaml' ':!package-lock.json' 2>/dev/null || true)"
      if [[ -n "$hits" ]]; then
        count="$(echo "$hits" | wc -l | tr -d ' ')"
        {
          echo "$hits" | head -n 5
          [[ "$count" -gt 5 ]] && echo "… и ещё $((count - 5))"
        } >"$log"
        job_set "$id" fail "найдено совпадений: $count"
        return 1
      fi
      job_set "$id" pass
      return 0
      ;;

    sec-audit)
      local audit_status=0
      if run_pnpm_in "$ROOT_DIR" audit --audit-level=high >"$log" 2>&1; then
        job_set "$id" pass "уязвимостей high/critical нет"
        return 0
      fi
      audit_status=$?
      if [[ "$audit_status" -eq 1 ]]; then
        job_set "$id" warn "есть уязвимости high/critical"
        return 0
      fi
      job_set "$id" skip "pnpm audit недоступен или ошибка ($audit_status)"
      return 0
      ;;

    text-todo)
      local changed_files todo_hits count file full
      if ! ensure_git_repo "$ROOT_DIR"; then
        job_set "$id" skip "нет git"
        return 0
      fi
      changed_files="$(git -C "$ROOT_DIR" diff --name-only HEAD 2>/dev/null || true)"$'\n'
      changed_files+="$(git -C "$ROOT_DIR" diff --cached --name-only 2>/dev/null || true)"
      changed_files="$(echo "$changed_files" | sed '/^$/d' | sort -u)"
      if [[ -z "$changed_files" ]]; then
        job_set "$id" pass "нет локальных изменений"
        return 0
      fi
      todo_hits=""
      while IFS= read -r file; do
        [[ -z "$file" ]] && continue
        if [[ -f "$ROOT_DIR/$file" ]]; then
          full="$ROOT_DIR/$file"
        elif [[ -f "$file" ]]; then
          full="$file"
        else
          continue
        fi
        if grep -nE 'TODO|FIXME' "$full" >/dev/null 2>&1; then
          todo_hits+="${full}"$'\n'
        fi
      done <<<"$changed_files"
      if [[ -n "$todo_hits" ]]; then
        count="$(echo "$todo_hits" | sed '/^$/d' | wc -l | tr -d ' ')"
        echo "$todo_hits" | sed '/^$/d' | head -n 5 >"$log"
        job_set "$id" warn "файлов с маркерами: $count"
        return 0
      fi
      job_set "$id" pass
      return 0
      ;;

    git-hygiene)
      local dirty changed_count
      if ! ensure_git_repo "$ROOT_DIR"; then
        job_set "$id" skip "нет репо"
        return 0
      fi
      dirty="$(git -C "$ROOT_DIR" status --porcelain 2>/dev/null || true)"
      if [[ -n "$dirty" ]]; then
        changed_count="$(echo "$dirty" | wc -l | tr -d ' ')"
        job_set "$id" skip "незакоммиченные изменения ($changed_count) — push.sh напомнит"
        return 0
      fi
      job_set "$id" pass "чисто"
      return 0
      ;;

    *)
      job_set "$id" fail "неизвестная проверка: $id"
      return 1
      ;;
  esac
}

build_job_list() {
  register_job "deps-pnpm" "pnpm в PATH" 1
  register_job "lint" "Lint (eslint)" 1
  register_job "typecheck" "Typecheck (tsc --noEmit)" 1
  register_job "test-int" "Tests (vitest)" 1
  register_job "test-e2e" "Tests e2e (playwright)" 0
  register_job "build" "Build (next build)" 1
  register_job "sec-env" "Нет .env в git" 1
  register_job "sec-patterns" "Паттерны секретов в git" 1
  register_job "sec-audit" "pnpm audit — high+" 0
  register_job "text-todo" "TODO/FIXME в изменённых файлах" 0
  register_job "git-hygiene" "Git hygiene" 0
}

needs_pnpm() {
  case "$1" in
    lint | typecheck | test-int | test-e2e | build | sec-audit)
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

launch_jobs() {
  local row id label critical
  for row in "${JOB_DEFS[@]}"; do
    IFS='|' read -r id label critical <<<"$row"
    if [[ "$id" == "deps-pnpm" ]]; then
      continue
    fi
    if needs_pnpm "$id" && [[ "$PNPM_OK" -eq 0 ]]; then
      job_set "$id" skip "pnpm недоступен"
      continue
    fi
    (
      exec_job "$id"
      echo $? >"$STATE_DIR/$id.exit"
    ) &
    echo $! >"$STATE_DIR/$id.pid"
  done
}

wait_for_jobs() {
  local row id pid
  for row in "${JOB_DEFS[@]}"; do
    IFS='|' read -r id _ _ <<<"$row"
    [[ "$id" == "deps-pnpm" ]] && continue
    pid="$(cat "$STATE_DIR/$id.pid" 2>/dev/null || true)"
    if [[ -n "$pid" ]]; then
      wait "$pid" 2>/dev/null || true
    fi
  done
}

render_progress_block() {
  local completed total pct
  read -r completed total <<<"$(count_progress)"
  if [[ "$total" -eq 0 ]]; then
    pct=0
  else
    pct=$((completed * 100 / total))
  fi

  local row id label critical status detail sym color line
  local -a lines=()

  lines+=("${C_BOLD}Прогресс: ${pct}% (${completed}/${total})${C_RESET}")
  lines+=("${C_DIM}○ pending  ⟳ running  ✓ pass  ✗ fail  ! warn${C_RESET}")
  lines+=("")

  for row in "${JOB_DEFS[@]}"; do
    IFS='|' read -r id label critical <<<"$row"
    status="$(job_get_status "$id")"
    detail="$(job_get_detail "$id")"
    sym="$(symbol_for "$status")"
    color="$(color_for "$status")"
    line="  ${color}${sym}${C_RESET} ${label}"
    if [[ -n "$detail" ]]; then
      if [[ "$status" == "pass" && "$detail" != "чисто" && "$detail" != "опционально" ]]; then
        line+="  ${C_DIM}— ${detail}${C_RESET}"
      elif [[ "$status" != "pass" ]]; then
        line+="  ${C_DIM}— ${detail}${C_RESET}"
      fi
    fi
    lines+=("$line")
  done

  if [[ "$INTERACTIVE" -eq 1 ]]; then
    if [[ "$PROGRESS_LINES" -gt 0 ]]; then
      printf '\033[%sA' "$PROGRESS_LINES"
    fi
    local i
    for i in "${!lines[@]}"; do
      printf '\033[2K%s\n' "${lines[$i]}"
    done
    PROGRESS_LINES="${#lines[@]}"
  fi
}

poll_until_done() {
  local running=1
  while [[ "$running" -eq 1 ]]; do
    running=0
    local row id status
    for row in "${JOB_DEFS[@]}"; do
      IFS='|' read -r id _ _ <<<"$row"
      status="$(job_get_status "$id")"
      if [[ "$status" == "pending" || "$status" == "running" ]]; then
        running=1
        break
      fi
    done
    if [[ "$INTERACTIVE" -eq 1 ]]; then
      render_progress_block
    fi
    [[ "$running" -eq 1 ]] && sleep 0.2
  done
  if [[ "$INTERACTIVE" -eq 1 ]]; then
    render_progress_block
  fi
}

collect_results() {
  local row id label critical status
  CRITICAL_FAILED=0
  WARNINGS=0

  for row in "${JOB_DEFS[@]}"; do
    IFS='|' read -r id label critical <<<"$row"
    status="$(job_get_status "$id")"
    if [[ "$status" == "fail" && "$critical" == "1" ]]; then
      CRITICAL_FAILED=1
    elif [[ "$status" == "warn" ]]; then
      WARNINGS=$((WARNINGS + 1))
    fi
  done
}

print_failure_logs() {
  local row id label status log
  local had_logs=0

  for row in "${JOB_DEFS[@]}"; do
    IFS='|' read -r id label _ <<<"$row"
    status="$(job_get_status "$id")"
    log="$STATE_DIR/$id.log"
    if [[ "$status" == "fail" || "$status" == "warn" ]] && [[ -s "$log" ]]; then
      if [[ "$had_logs" -eq 0 ]]; then
        echo
        echo "${C_BLUE}── Детали ошибок и предупреждений ──${C_RESET}"
        had_logs=1
      fi
      echo
      echo "${C_BOLD}${label}${C_RESET}"
      if [[ "$status" == "fail" ]]; then
        tail -n 15 "$log" | sed 's/^/    /'
      else
        tail -n 8 "$log" | sed 's/^/    /'
      fi
    fi
  done
}

print_non_tty_progress() {
  local row id label status detail sym color
  echo
  echo "${C_BLUE}── Результаты проверок ──${C_RESET}"
  for row in "${JOB_DEFS[@]}"; do
    IFS='|' read -r id label _ <<<"$row"
    status="$(job_get_status "$id")"
    detail="$(job_get_detail "$id")"
    sym="$(symbol_for "$status")"
    color="$(color_for "$status")"
    if [[ -n "$detail" ]]; then
      echo "  ${color}${sym}${C_RESET} ${label}  ${C_DIM}— ${detail}${C_RESET}"
    else
      echo "  ${color}${sym}${C_RESET} ${label}"
    fi
  done
}

print_summary() {
  local row id label critical status detail sym color
  local pass_count=0 fail_count=0 skip_count=0 warn_count=0
  local completed total pct
  read -r completed total <<<"$(count_progress)"
  pct=$((completed * 100 / total))

  echo
  echo "${C_BLUE}============================================================${C_RESET}"
  echo "${C_BOLD} Сводка pre-push gate${C_RESET}  ${C_DIM}($STARTED_AT)${C_RESET}"
  echo "${C_BLUE}============================================================${C_RESET}"
  printf "  ${C_BOLD}Прогресс: %s%% (%s/%s)${C_RESET}\n" "$pct" "$completed" "$total"
  echo
  printf "  %-42s %s\n" "Проверка" "Результат"
  echo "  ${C_DIM}$(printf '%.0s─' {1..54})${C_RESET}"

  for row in "${JOB_DEFS[@]}"; do
    IFS='|' read -r id label critical _ <<<"$row"
    status="$(job_get_status "$id")"
    detail="$(job_get_detail "$id")"
    sym="$(symbol_for "$status")"
    color="$(color_for "$status")"
    printf "  %-42s ${color}%s${C_RESET}" "$label" "$sym"
    [[ -n "$detail" && "$status" != "pass" ]] && printf "  ${C_DIM}%s${C_RESET}" "$detail"
    echo

    case "$status" in
      pass) pass_count=$((pass_count + 1)) ;;
      fail) fail_count=$((fail_count + 1)) ;;
      skip) skip_count=$((skip_count + 1)) ;;
      warn) warn_count=$((warn_count + 1)) ;;
    esac
  done

  echo "  ${C_DIM}$(printf '%.0s─' {1..54})${C_RESET}"
  echo "  ${C_DIM}✓ $pass_count  ✗ $fail_count  ○ $skip_count  ! $warn_count${C_RESET}"
  echo

  if [[ "$CRITICAL_FAILED" -eq 0 ]]; then
    echo "${C_GREEN}${C_BOLD}✅ МОЖНО ПУШИТЬ${C_RESET}"
    if [[ "$WARNINGS" -gt 0 ]]; then
      echo "${C_YELLOW}   Предупреждений: $WARNINGS (не блокируют push)${C_RESET}"
    fi
  else
    echo "${C_RED}${C_BOLD}❌ ПУШ ЗАБЛОКИРОВАН${C_RESET}"
    echo "${C_RED}   Критические проверки с ошибкой:${C_RESET}"
    for row in "${JOB_DEFS[@]}"; do
      IFS='|' read -r id label critical _ <<<"$row"
      status="$(job_get_status "$id")"
      detail="$(job_get_detail "$id")"
      if [[ "$status" == "fail" && "$critical" == "1" ]]; then
        echo "   ${C_RED}✗${C_RESET} $label${detail:+ — $detail}"
      fi
    done
  fi
  echo
}

main() {
  echo "${C_BLUE}============================================================${C_RESET}"
  echo "${C_GREEN} IVA360 — pre-push quality gate${C_RESET}"
  echo "${C_BLUE}============================================================${C_RESET}"
  if [[ "$QUICK" -eq 1 ]]; then
    echo "${C_YELLOW}Режим --quick: build и e2e пропущены${C_RESET}"
  fi

  build_job_list
  echo "${C_DIM}Запуск ${#JOB_DEFS[@]} проверок параллельно…${C_RESET}"

  if [[ "$INTERACTIVE" -eq 1 ]]; then
    printf '\033[?25l'
  fi

  exec_job "deps-pnpm"
  echo $? >"$STATE_DIR/deps-pnpm.exit"
  if [[ "$(job_get_status deps-pnpm)" == "fail" ]]; then
    PNPM_OK=0
  fi

  launch_jobs

  if [[ "$INTERACTIVE" -eq 1 ]]; then
    echo
    poll_until_done
    printf '\033[?25h'
  else
    wait_for_jobs
    print_non_tty_progress
  fi

  collect_results
  case "$(job_get_status test-e2e)" in
    pass | fail | warn)
      cleanup_playwright_artifacts
      ;;
  esac
  print_failure_logs
  print_summary

  if [[ "$CRITICAL_FAILED" -eq 0 ]]; then
    exit 0
  fi
  exit 1
}

main
