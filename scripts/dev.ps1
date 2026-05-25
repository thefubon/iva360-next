#Requires -Version 5.1
param(
  [switch]$NoDocker,
  [switch]$NoMigrate,
  [switch]$Help
)

$ErrorActionPreference = 'Stop'

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RootDir = Resolve-Path (Join-Path $ScriptDir '..')

$AppUrl = 'http://localhost:3000'
$AdminWebUrl = 'http://localhost:3000/admin'
$AdminCmsUrl = 'http://localhost:3333/admin'
$CmsUrl = 'http://localhost:3333'
$MinioConsoleUrl = 'http://localhost:9001'

if ($Help) {
  @'
Использование: .\scripts\dev.ps1 [-NoDocker] [-NoMigrate]

Локальный dev-стек IVA360 monorepo:
  1. Docker Compose: PostgreSQL + MinIO (+ bucket init)
  2. Payload migrate (apps/cms)
  3. CMS dev server (:3333) + Web dev server (:3000)

  -NoDocker   Не поднимать docker compose (сервисы уже запущены)
  -NoMigrate  Пропустить pnpm payload migrate
'@ | Write-Host
  exit 0
}

function Write-Color([string]$Text, [string]$Color = 'White') {
  Write-Host $Text -ForegroundColor $Color
}

function Write-Hyperlink([string]$Url, [string]$Text = $Url) {
  if ([Console]::IsOutputRedirected -eq $false) {
    $esc = [char]27
    Write-Host -NoNewline "${esc}]8;;${Url}${esc}\"
    Write-Host -NoNewline $Text -ForegroundColor Cyan
    Write-Host -NoNewline "${esc}]8;;${esc}\"
  } else {
    Write-Host -NoNewline $Text
  }
}

function Write-Status([string]$Icon, [string]$Message) {
  Write-Host "  " -NoNewline
  Write-Color $Icon Green
  Write-Host " $Message"
}

function Import-RootEnv([string]$Path) {
  Get-Content $Path | ForEach-Object {
    $line = $_.Trim()
    if ($line -match '^\s*#' -or $line -eq '') { return }
    if ($line -match '^\s*([^=]+)=(.*)$') {
      $name = $Matches[1].Trim()
      $value = $Matches[2].Trim()
      if ($value -match '^"(.*)"$') { $value = $Matches[1] }
      elseif ($value -match "^'(.*)'$") { $value = $Matches[1] }
      Set-Item -Path "Env:$name" -Value $value
    }
  }
}

if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
  Write-Color 'Ошибка: pnpm не найден в PATH.' Red
  exit 1
}

if (-not (Test-Path (Join-Path $RootDir 'package.json'))) {
  Write-Color "Ошибка: не найден package.json в $RootDir." Red
  exit 1
}

$envFile = Join-Path $RootDir '.env'
$envExample = Join-Path $RootDir '.env.example'
if (-not (Test-Path $envFile)) {
  if (Test-Path $envExample) {
    Write-Color 'Файл .env не найден — копирую из .env.example' Yellow
    Copy-Item $envExample $envFile
    Write-Color 'Отредактируйте .env (PAYLOAD_SECRET, POSTGRES_PASSWORD) и перезапустите.' Yellow
  } else {
    Write-Color 'Ошибка: нет .env и .env.example.' Red
    exit 1
  }
}

Import-RootEnv $envFile

if (-not $env:PAYLOAD_SECRET) {
  Write-Color "Ошибка: PAYLOAD_SECRET не задан в $envFile" Red
  Write-Color 'Скопируйте .env.example → .env и задайте секрет.' DarkGray
  exit 1
}

if (-not $env:DATABASE_URL) {
  Write-Color "Ошибка: DATABASE_URL не задан в $envFile" Red
  exit 1
}

function Wait-ForUrl([string]$Url, [int]$Attempts = 30) {
  for ($i = 1; $i -le $Attempts; $i++) {
    try {
      $null = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
      return $true
    } catch {
      Start-Sleep -Seconds 1
    }
  }
  return $false
}

function Stop-PortIfBusy([int]$Port) {
  $conn = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue |
    Select-Object -First 1
  if ($conn) {
    $procId = $conn.OwningProcess
    Write-Color "Порт $Port занят (pid $procId) — останавливаю процесс..." Yellow
    Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
    Start-Sleep -Milliseconds 200
  }
}

$cmsJob = $null
$webJob = $null

try {
  Write-Host ''
  Write-Color '╔══════════════════════════════════════════════════════════════╗' Blue
  Write-Color '║  IVA360 — локальный dev-стек (monorepo)                     ║' Green
  Write-Color '╚══════════════════════════════════════════════════════════════╝' Blue
  Write-Host "Путь: $RootDir"
  Write-Host ''
  Write-Color 'Открой в браузере:' Green
  Write-Host '  • Web:         ' -NoNewline
  Write-Hyperlink $AppUrl
  Write-Host ''
  Write-Host '  • Admin (web): ' -NoNewline
  Write-Hyperlink $AdminWebUrl
  Write-Host ' (rewrite → CMS)'
  Write-Host '  • Admin (CMS): ' -NoNewline
  Write-Hyperlink $AdminCmsUrl
  Write-Host ''
  Write-Host '  • CMS:         ' -NoNewline
  Write-Hyperlink $CmsUrl
  Write-Host ''
  Write-Host '  • MinIO:       ' -NoNewline
  Write-Hyperlink $MinioConsoleUrl
  Write-Host ''
  Write-Color 'Остановка: Ctrl+C (Docker-сервисы остаются запущенными)' DarkGray
  Write-Color '──────────────────────────────────────────────────────────────' Blue
  Write-Host ''

  if (-not $NoDocker) {
    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
      Write-Color 'Ошибка: docker не найден. Установите Docker или используйте -NoDocker.' Red
      exit 1
    }

    Write-Color '▸ Запуск PostgreSQL и MinIO (docker compose)...' Yellow
    Push-Location $RootDir
    try {
      docker compose up -d --wait postgres minio
      if ($LASTEXITCODE -ne 0) { throw 'docker compose up failed' }
      docker compose up --no-deps minio-init
      if ($LASTEXITCODE -ne 0) { throw 'minio-init failed' }
    } finally {
      Pop-Location
    }
    Write-Status '✓' 'Docker-сервисы готовы'
  } else {
    Write-Color '▸ Docker пропущен (-NoDocker)' Yellow
  }

  if (-not $NoMigrate) {
    Write-Color '▸ Миграции Payload (apps/cms)...' Yellow
    Push-Location $RootDir
    try {
      pnpm payload migrate
      if ($LASTEXITCODE -ne 0) { throw 'migrate failed' }
    } finally {
      Pop-Location
    }
    Write-Status '✓' 'Миграции выполнены'
  } else {
    Write-Color '▸ Миграции пропущены (-NoMigrate)' Yellow
  }

  Stop-PortIfBusy 3000
  Stop-PortIfBusy 3333

  Write-Color '▸ Запуск CMS (:3333) и Web (:3000)...' Yellow
  Write-Status '…' 'Серверы стартуют — ссылки выше станут активны через несколько секунд'
  Write-Host ''

  $cmsJob = Start-Job -ScriptBlock {
    param($Dir)
    Set-Location $Dir
    pnpm --filter @iva360/cms dev 2>&1 | ForEach-Object { "[cms] $_" }
  } -ArgumentList $RootDir

  Start-Sleep -Seconds 2

  $webJob = Start-Job -ScriptBlock {
    param($Dir)
    Set-Location $Dir
    pnpm --filter @iva360/web dev 2>&1 | ForEach-Object { "[web] $_" }
  } -ArgumentList $RootDir

  if (Wait-ForUrl $AppUrl 45) {
    Write-Host ''
    Write-Status '✓' 'Web готов'
    Write-Host '    ' -NoNewline
    Write-Hyperlink $AppUrl
    Write-Host ''
  } else {
    Write-Color '  ! Web (:3000) ещё не отвечает — проверьте лог [web] выше' Yellow
  }

  if (Wait-ForUrl $AdminCmsUrl 15) {
    Write-Status '✓' 'Admin (CMS) готов'
    Write-Host '    ' -NoNewline
    Write-Hyperlink $AdminCmsUrl
    Write-Host ''
  } else {
    Write-Color '  ! Admin (:3333/admin) ещё не отвечает — проверьте лог [cms] выше' Yellow
  }

  if (Wait-ForUrl $AdminWebUrl 15) {
    Write-Status '✓' 'Admin (rewrite через Web) готов'
    Write-Host '    ' -NoNewline
    Write-Hyperlink $AdminWebUrl
    Write-Host ''
  } else {
    Write-Color '  ! Admin (:3000/admin) ещё не отвечает — проверьте rewrite в apps/web' Yellow
  }

  Write-Host ''
  Write-Color 'Логи серверов ниже. Остановка: Ctrl+C' DarkGray
  Write-Host ''

  while ($cmsJob.State -eq 'Running' -or $webJob.State -eq 'Running') {
    Receive-Job -Job $cmsJob, $webJob -ErrorAction SilentlyContinue | ForEach-Object {
      if ($_ -match '^\[cms\] ') {
        Write-Host $_ -ForegroundColor Cyan
      } elseif ($_ -match '^\[web\] ') {
        Write-Host $_ -ForegroundColor Green
      } else {
        Write-Host $_
      }
    }
    Start-Sleep -Milliseconds 200
  }

  Receive-Job -Job $cmsJob, $webJob -ErrorAction SilentlyContinue | ForEach-Object {
    if ($_ -match '^\[cms\] ') {
      Write-Host $_ -ForegroundColor Cyan
    } elseif ($_ -match '^\[web\] ') {
      Write-Host $_ -ForegroundColor Green
    } else {
      Write-Host $_
    }
  }
} finally {
  foreach ($job in @($cmsJob, $webJob)) {
    if ($job -and $job.State -eq 'Running') {
      Write-Host ''
      Write-Color 'Остановка dev-процессов...' Yellow
      Stop-Job -Job $job -Force -ErrorAction SilentlyContinue
      Remove-Job -Job $job -Force -ErrorAction SilentlyContinue
    }
  }
}
