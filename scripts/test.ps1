#Requires -Version 5.1
param(
  [switch]$Quick,
  [switch]$Help
)

$ErrorActionPreference = 'Stop'

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RootDir = Resolve-Path (Join-Path $ScriptDir '..')
$StartedAt = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
$StateDir = New-TemporaryFile | ForEach-Object { Remove-Item $_; New-Item -ItemType Directory -Path ($_.FullName + '-iva360-gate') }

$CriticalFailed = $false
$Warnings = 0
$PnpmOk = $true
$Interactive = [Console]::IsOutputRedirected -eq $false

$JobDefs = @(
  @{ Id = 'deps-pnpm'; Label = 'pnpm в PATH'; Critical = $true }
  @{ Id = 'lint'; Label = 'Lint (eslint)'; Critical = $true }
  @{ Id = 'typecheck'; Label = 'Typecheck (tsc --noEmit)'; Critical = $true }
  @{ Id = 'test-int'; Label = 'Tests (vitest)'; Critical = $true }
  @{ Id = 'test-e2e'; Label = 'Tests e2e (playwright)'; Critical = $false }
  @{ Id = 'build'; Label = 'Build (next build)'; Critical = $true }
  @{ Id = 'sec-env'; Label = 'Нет .env в git'; Critical = $true }
  @{ Id = 'sec-patterns'; Label = 'Паттерны секретов в git'; Critical = $true }
  @{ Id = 'sec-audit'; Label = 'pnpm audit — high+'; Critical = $false }
  @{ Id = 'text-todo'; Label = 'TODO/FIXME в изменённых файлах'; Critical = $false }
  @{ Id = 'git-hygiene'; Label = 'Git hygiene'; Critical = $false }
)

function Show-Help {
  @'
Использование: .\scripts\test.ps1 [-Quick]

Pre-push gate для iva360-next: lint, typecheck, test, build, security, git hygiene.

  -Quick   Пропустить build и e2e — быстрая проверка

Код выхода: 0 — можно пушить, 1 — пуш заблокирован.
'@ | Write-Host
}

function Initialize-JobState {
  foreach ($job in $JobDefs) {
    Set-Content (Join-Path $StateDir "$($job.Id).status") 'pending'
    Set-Content (Join-Path $StateDir "$($job.Id).detail") ''
    Set-Content (Join-Path $StateDir "$($job.Id).log") ''
  }
}

function Set-JobState([string]$Id, [string]$Status, [string]$Detail = '') {
  Set-Content (Join-Path $StateDir "$Id.status") $Status
  if ($Detail) { Set-Content (Join-Path $StateDir "$Id.detail") $Detail }
}

function Get-JobState([string]$Id, [string]$Field) {
  $path = Join-Path $StateDir "$Id.$Field"
  if (Test-Path $path) { return (Get-Content $path -Raw).Trim() }
  return ''
}

function Test-GitRepo([string]$Dir) {
  git -C $Dir rev-parse --git-dir 2>$null | Out-Null
  return $?
}

function Invoke-Pnpm([string[]]$Args) {
  Push-Location $RootDir
  try {
    & pnpm @Args
    return $LASTEXITCODE
  } finally {
    Pop-Location
  }
}

function Remove-PlaywrightArtifacts {
  foreach ($name in @('playwright-report', 'test-results', 'blob-report')) {
    $path = Join-Path $RootDir $name
    if (Test-Path $path) { Remove-Item $path -Recurse -Force }
  }
}

function Invoke-GateJob([string]$Id) {
  $log = Join-Path $StateDir "$Id.log"
  Set-JobState $Id 'running'

  switch ($Id) {
    'deps-pnpm' {
      if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
        Set-JobState $Id 'fail' 'pnpm не найден'
        return 1
      }
      $ver = (pnpm --version 2>$null)
      Set-JobState $Id 'pass' ($ver ?? '?')
      return 0
    }
    'lint' {
      Invoke-Pnpm @('lint') *> $log
      if ($LASTEXITCODE -eq 0) { Set-JobState $Id 'pass'; return 0 }
      Set-JobState $Id 'fail' 'см. вывод ниже'
      return 1
    }
    'typecheck' {
      Invoke-Pnpm @('typecheck') *> $log
      if ($LASTEXITCODE -eq 0) { Set-JobState $Id 'pass'; return 0 }
      Set-JobState $Id 'fail'
      return 1
    }
    'test-int' {
      Invoke-Pnpm @('test:int') *> $log
      if ($LASTEXITCODE -eq 0) { Set-JobState $Id 'pass'; return 0 }
      Set-JobState $Id 'fail'
      return 1
    }
    'test-e2e' {
      if ($Quick) {
        Set-JobState $Id 'skip' 'флаг -Quick'
        return 0
      }
      Invoke-Pnpm @('test:e2e') *> $log
      if ($LASTEXITCODE -eq 0) {
        Set-JobState $Id 'pass' 'опционально'
        return 0
      }
      Set-JobState $Id 'warn' 'e2e не прошли (не блокирует push)'
      return 0
    }
    'build' {
      if ($Quick) {
        Set-JobState $Id 'skip' 'флаг -Quick'
        return 0
      }
      Invoke-Pnpm @('build') *> $log
      if ($LASTEXITCODE -eq 0) { Set-JobState $Id 'pass'; return 0 }
      Set-JobState $Id 'fail'
      return 1
    }
    'sec-env' {
      if (-not (Test-GitRepo $RootDir)) { Set-JobState $Id 'pass'; return 0 }
      $tracked = git -C $RootDir ls-files 2>$null |
        Where-Object { $_ -match '(^|/)\.env$|(^|/)\.env\.local$|(^|/)\.env\.production$' }
      if ($tracked) {
        Set-JobState $Id 'fail' (($tracked -join ', '))
        return 1
      }
      Set-JobState $Id 'pass'
      return 0
    }
    'sec-patterns' {
      if (-not (Test-GitRepo $RootDir)) { Set-JobState $Id 'pass'; return 0 }
      $pattern = 'AKIA[0-9A-Z]{16}|sk_live_[a-zA-Z0-9]{20,}|ghp_[a-zA-Z0-9]{36,}|gho_[a-zA-Z0-9]{36,}|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----'
      $hits = git -C $RootDir grep -n -E $pattern -- ':!*.lock' ':!pnpm-lock.yaml' ':!package-lock.json' 2>$null
      if ($hits) {
        $count = @($hits).Count
        ($hits | Select-Object -First 5) | Set-Content $log
        Set-JobState $Id 'fail' "найдено совпадений: $count"
        return 1
      }
      Set-JobState $Id 'pass'
      return 0
    }
    'sec-audit' {
      Invoke-Pnpm @('audit', '--audit-level=high') *> $log
      if ($LASTEXITCODE -eq 0) {
        Set-JobState $Id 'pass' 'уязвимостей high/critical нет'
        return 0
      }
      if ($LASTEXITCODE -eq 1) {
        Set-JobState $Id 'warn' 'есть уязвимости high/critical'
        return 0
      }
      Set-JobState $Id 'skip' "pnpm audit недоступен или ошибка ($LASTEXITCODE)"
      return 0
    }
    'text-todo' {
      if (-not (Test-GitRepo $RootDir)) {
        Set-JobState $Id 'skip' 'нет git'
        return 0
      }
      $changed = @(
        (git -C $RootDir diff --name-only HEAD 2>$null)
        (git -C $RootDir diff --cached --name-only 2>$null)
      ) | Where-Object { $_ } | Sort-Object -Unique
      if (-not $changed) {
        Set-JobState $Id 'pass' 'нет локальных изменений'
        return 0
      }
      $todoFiles = @()
      foreach ($file in $changed) {
        $full = Join-Path $RootDir $file
        if (-not (Test-Path $full)) { continue }
        if (Select-String -Path $full -Pattern 'TODO|FIXME' -Quiet) {
          $todoFiles += $full
        }
      }
      if ($todoFiles.Count -gt 0) {
        ($todoFiles | Select-Object -First 5) | Set-Content $log
        Set-JobState $Id 'warn' "файлов с маркерами: $($todoFiles.Count)"
        return 0
      }
      Set-JobState $Id 'pass'
      return 0
    }
    'git-hygiene' {
      if (-not (Test-GitRepo $RootDir)) {
        Set-JobState $Id 'skip' 'нет репо'
        return 0
      }
      $dirty = git -C $RootDir status --porcelain 2>$null
      if ($dirty) {
        $count = @($dirty).Count
        Set-JobState $Id 'skip' "незакоммиченные изменения ($count) — push.ps1 напомнит"
        return 0
      }
      Set-JobState $Id 'pass' 'чисто'
      return 0
    }
    default {
      Set-JobState $Id 'fail' "неизвестная проверка: $Id"
      return 1
    }
  }
}

function Test-NeedsPnpm([string]$Id) {
  $Id -in @('lint', 'typecheck', 'test-int', 'test-e2e', 'build', 'sec-audit')
}

function Get-Symbol([string]$Status) {
  switch ($Status) {
    'pass' { return '✓' }
    'fail' { return '✗' }
    'skip' { return '○' }
    'warn' { return '!' }
    'running' { return '⟳' }
    default { return '○' }
  }
}

function Show-Summary {
  $pass = 0; $fail = 0; $skip = 0; $warn = 0
  foreach ($job in $JobDefs) {
    $status = Get-JobState $job.Id 'status'
    switch ($status) {
      'pass' { $pass++ }
      'fail' { $fail++ }
      'skip' { $skip++ }
      'warn' { $warn++ }
    }
    if ($status -eq 'fail' -and $job.Critical) { $script:CriticalFailed = $true }
    if ($status -eq 'warn') { $script:Warnings++ }
  }

  Write-Host ''
  Write-Host '============================================================' -ForegroundColor Blue
  Write-Host " Сводка pre-push gate  ($StartedAt)" -ForegroundColor White
  Write-Host '============================================================' -ForegroundColor Blue
  Write-Host "  Прогресс: 100% ($($JobDefs.Count)/$($JobDefs.Count))"
  Write-Host ''
  Write-Host ('  {0,-42} {1}' -f 'Проверка', 'Результат')
  Write-Host ('  ' + ('─' * 54)) -ForegroundColor DarkGray

  foreach ($job in $JobDefs) {
    $status = Get-JobState $job.Id 'status'
    $detail = Get-JobState $job.Id 'detail'
    $sym = Get-Symbol $status
    $line = ('  {0,-42} {1}' -f $job.Label, $sym)
    if ($detail -and $status -ne 'pass') { $line += "  $detail" }
    Write-Host $line
  }

  Write-Host ('  ' + ('─' * 54)) -ForegroundColor DarkGray
  Write-Host "  ✓ $pass  ✗ $fail  ○ $skip  ! $warn" -ForegroundColor DarkGray
  Write-Host ''

  if (-not $CriticalFailed) {
    Write-Host '✅ МОЖНО ПУШИТЬ' -ForegroundColor Green
    if ($Warnings -gt 0) {
      Write-Host "   Предупреждений: $Warnings (не блокируют push)" -ForegroundColor Yellow
    }
  } else {
    Write-Host '❌ ПУШ ЗАБЛОКИРОВАН' -ForegroundColor Red
  }
  Write-Host ''
}

if ($Help) { Show-Help; exit 0 }

try {
  Write-Host '============================================================' -ForegroundColor Blue
  Write-Host ' IVA360 — pre-push quality gate' -ForegroundColor Green
  Write-Host '============================================================' -ForegroundColor Blue
  if ($Quick) { Write-Host 'Режим -Quick: build и e2e пропущены' -ForegroundColor Yellow }

  Initialize-JobState
  Write-Host "Запуск $($JobDefs.Count) проверок параллельно…" -ForegroundColor DarkGray

  Invoke-GateJob 'deps-pnpm' | Out-Null
  if ((Get-JobState 'deps-pnpm' 'status') -eq 'fail') { $PnpmOk = $false }

  $jobs = @()
  foreach ($def in $JobDefs) {
    if ($def.Id -eq 'deps-pnpm') { continue }
    if ((Test-NeedsPnpm $def.Id) -and -not $PnpmOk) {
      Set-JobState $def.Id 'skip' 'pnpm недоступен'
      continue
    }
    $id = $def.Id
    $jobs += Start-Job -ScriptBlock {
      param($Root, $State, $JobId, $QuickFlag)
      . {
        function Set-JobState([string]$Id, [string]$Status, [string]$Detail = '') {
          Set-Content (Join-Path $State "$Id.status") $Status
          if ($Detail) { Set-Content (Join-Path $State "$Id.detail") $Detail }
        }
        function Get-JobState([string]$Id, [string]$Field) {
          $path = Join-Path $State "$Id.$Field"
          if (Test-Path $path) { return (Get-Content $path -Raw).Trim() }
          return ''
        }
        function Invoke-Pnpm([string[]]$Args) {
          Push-Location $Root
          try { & pnpm @Args; return $LASTEXITCODE } finally { Pop-Location }
        }
        function Test-GitRepo([string]$Dir) {
          git -C $Dir rev-parse --git-dir 2>$null | Out-Null; return $?
        }
        function Remove-PlaywrightArtifacts {
          foreach ($name in @('playwright-report', 'test-results', 'blob-report')) {
            $path = Join-Path $Root $name
            if (Test-Path $path) { Remove-Item $path -Recurse -Force }
          }
        }
      }
      $log = Join-Path $State "$JobId.log"
      Set-JobState $JobId 'running'
      # Inline minimal job runner for background jobs
      switch ($JobId) {
        'lint' {
          Invoke-Pnpm @('lint') *> $log
          if ($LASTEXITCODE -eq 0) { Set-JobState $JobId 'pass' } else { Set-JobState $JobId 'fail' 'см. вывод ниже' }
        }
        'typecheck' {
          Invoke-Pnpm @('typecheck') *> $log
          if ($LASTEXITCODE -eq 0) { Set-JobState $JobId 'pass' } else { Set-JobState $JobId 'fail' }
        }
        'test-int' {
          Invoke-Pnpm @('test:int') *> $log
          if ($LASTEXITCODE -eq 0) { Set-JobState $JobId 'pass' } else { Set-JobState $JobId 'fail' }
        }
        'test-e2e' {
          if ($QuickFlag) { Set-JobState $JobId 'skip' 'флаг -Quick' }
          else {
            Invoke-Pnpm @('test:e2e') *> $log
            if ($LASTEXITCODE -eq 0) { Set-JobState $JobId 'pass' 'опционально' }
            else { Set-JobState $JobId 'warn' 'e2e не прошли (не блокирует push)' }
          }
        }
        'build' {
          if ($QuickFlag) { Set-JobState $JobId 'skip' 'флаг -Quick' }
          else {
            Invoke-Pnpm @('build') *> $log
            if ($LASTEXITCODE -eq 0) { Set-JobState $JobId 'pass' } else { Set-JobState $JobId 'fail' }
          }
        }
        'sec-env' {
          if (-not (Test-GitRepo $Root)) { Set-JobState $JobId 'pass' }
          else {
            $tracked = git -C $Root ls-files 2>$null | Where-Object { $_ -match '(^|/)\.env$|(^|/)\.env\.local$|(^|/)\.env\.production$' }
            if ($tracked) { Set-JobState $JobId 'fail' ($tracked -join ', ') }
            else { Set-JobState $JobId 'pass' }
          }
        }
        'sec-patterns' {
          if (-not (Test-GitRepo $Root)) { Set-JobState $JobId 'pass' }
          else {
            $pattern = 'AKIA[0-9A-Z]{16}|sk_live_[a-zA-Z0-9]{20,}|ghp_[a-zA-Z0-9]{36,}|gho_[a-zA-Z0-9]{36,}|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----'
            $hits = git -C $Root grep -n -E $pattern -- ':!*.lock' ':!pnpm-lock.yaml' ':!package-lock.json' 2>$null
            if ($hits) {
              ($hits | Select-Object -First 5) | Set-Content $log
              Set-JobState $JobId 'fail' "найдено совпадений: $(@($hits).Count)"
            } else { Set-JobState $JobId 'pass' }
          }
        }
        'sec-audit' {
          Invoke-Pnpm @('audit', '--audit-level=high') *> $log
          if ($LASTEXITCODE -eq 0) { Set-JobState $JobId 'pass' 'уязвимостей high/critical нет' }
          elseif ($LASTEXITCODE -eq 1) { Set-JobState $JobId 'warn' 'есть уязвимости high/critical' }
          else { Set-JobState $JobId 'skip' "pnpm audit недоступен или ошибка ($LASTEXITCODE)" }
        }
        'text-todo' {
          if (-not (Test-GitRepo $Root)) { Set-JobState $JobId 'skip' 'нет git' }
          else {
            $changed = @((git -C $Root diff --name-only HEAD 2>$null), (git -C $Root diff --cached --name-only 2>$null)) |
              Where-Object { $_ } | Sort-Object -Unique
            if (-not $changed) { Set-JobState $JobId 'pass' 'нет локальных изменений' }
            else {
              $todoFiles = foreach ($file in $changed) {
                $full = Join-Path $Root $file
                if ((Test-Path $full) -and (Select-String -Path $full -Pattern 'TODO|FIXME' -Quiet)) { $full }
              }
              if (@($todoFiles).Count -gt 0) {
                ($todoFiles | Select-Object -First 5) | Set-Content $log
                Set-JobState $JobId 'warn' "файлов с маркерами: $(@($todoFiles).Count)"
              } else { Set-JobState $JobId 'pass' }
            }
          }
        }
        'git-hygiene' {
          if (-not (Test-GitRepo $Root)) { Set-JobState $JobId 'skip' 'нет репо' }
          else {
            $dirty = git -C $Root status --porcelain 2>$null
            if ($dirty) {
              Set-JobState $JobId 'skip' "незакоммиченные изменения ($( @($dirty).Count )) — push.ps1 напомнит"
            } else { Set-JobState $JobId 'pass' 'чисто' }
          }
        }
      }
    } -ArgumentList $RootDir, $StateDir, $id, $Quick.IsPresent
  }

  $jobs | Wait-Job | Out-Null
  $jobs | Remove-Job -Force

  $e2eStatus = Get-JobState 'test-e2e' 'status'
  if ($e2eStatus -in @('pass', 'fail', 'warn')) {
    Remove-PlaywrightArtifacts
  }

  foreach ($def in $JobDefs) {
    if ($def.Id -eq 'deps-pnpm') { continue }
    $log = Join-Path $StateDir "$($def.Id).log"
    $status = Get-JobState $def.Id 'status'
    if (($status -eq 'fail' -or $status -eq 'warn') -and (Test-Path $log) -and (Get-Item $log).Length -gt 0) {
      Write-Host ''
      Write-Host "── $($def.Label) ──" -ForegroundColor Blue
      Get-Content $log -Tail 15 | ForEach-Object { Write-Host "    $_" }
    }
  }

  Show-Summary
  if ($CriticalFailed) { exit 1 }
  exit 0
} finally {
  if (Test-Path $StateDir) { Remove-Item $StateDir -Recurse -Force }
}
