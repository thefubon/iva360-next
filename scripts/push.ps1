#Requires -Version 5.1
param(
  [switch]$Help
)

$ErrorActionPreference = 'Stop'

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RootDir = Resolve-Path (Join-Path $ScriptDir '..')

function Write-Color([string]$Text, [string]$Color = 'White') {
  Write-Host $Text -ForegroundColor $Color
}

if ($Help) {
  @'
Использование: .\scripts\push.ps1

Отправляет только уже существующие коммиты в origin.
Auto-commit не выполняется.

Репозиторий без origin пропускается.
'@ | Write-Host
  exit 0
}

function Test-GitRepo([string]$Dir) {
  git -C $Dir rev-parse --git-dir 2>$null | Out-Null
  return $?
}

function Test-HasOrigin([string]$Dir) {
  git -C $Dir remote get-url origin 2>$null | Out-Null
  return $?
}

function Get-CurrentBranch([string]$Dir) {
  $branch = git -C $Dir branch --show-current 2>$null
  if ($branch) { return $branch }
  return 'HEAD'
}

function Push-OneRepo([string]$Dir) {
  $label = 'iva360-next'

  if (-not (Test-GitRepo $Dir)) {
    Write-Color "✗ ${label}: не git-репозиторий" Red
    return $false
  }

  if (-not (Test-HasOrigin $Dir)) {
    Write-Color "○ ${label}: origin не настроен — пропуск" Yellow
    return $true
  }

  $branch = Get-CurrentBranch $Dir
  $dirty = git -C $Dir status --porcelain
  if ($dirty) {
    Write-Color "! ${label}: есть незакоммиченные изменения (push только существующих коммитов)" Yellow
  }

  git -C $Dir rev-parse --abbrev-ref '@{upstream}' 2>$null | Out-Null
  if (-not $?) {
    $pushOutput = git -C $Dir push -u origin $branch 2>&1 | Out-String
    if ($LASTEXITCODE -ne 0) {
      Write-Color "✗ ${label}: $pushOutput" Red
      return $false
    }
    Write-Color "✓ ${label}: отправлено в origin/$branch (upstream установлен)" Green
    return $true
  }

  $pushOutput = git -C $Dir push 2>&1 | Out-String
  if ($LASTEXITCODE -eq 0) {
    if ($pushOutput -match 'Everything up-to-date') {
      Write-Color "✓ ${label}: уже синхронизирован с origin/$branch" Green
    } else {
      Write-Color "✓ ${label}: отправлено в origin/$branch" Green
      if ($pushOutput.Trim()) { Write-Host "    $($pushOutput.Trim())" -ForegroundColor DarkGray }
    }
    return $true
  }

  Write-Color "✗ ${label}: ошибка push — $pushOutput" Red
  return $false
}

Write-Color '============================================================' Blue
Write-Color ' Git push — iva360-next' Green
Write-Color '============================================================' Blue
Write-Host 'Только существующие коммиты, auto-commit не выполняется.' -ForegroundColor DarkGray
Write-Host ''

if (Push-OneRepo $RootDir) {
  Write-Host ''
  Write-Color 'Готово: push успешен или пропущен (нет origin).' Green
} else {
  Write-Host ''
  Write-Color 'Ошибка: push завершился неудачей.' Red
  exit 1
}
