# Clinic Management System - one-time local setup (Windows PowerShell)
# Requirements: PHP 8.2 and Node.js LTS in PATH
#   winget install -e --id PHP.PHP.8.2
#   winget install -e --id OpenJS.NodeJS.LTS
$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
# PHP can't load extensions/ini from paths with non-ASCII chars (e.g. C:\Users\Іван),
# so tools live in an ASCII folder: C:\Users\Public\clinic-tools
$tools = Join-Path $env:PUBLIC 'clinic-tools'
New-Item -ItemType Directory -Force -Path $tools | Out-Null

function Step($t) { Write-Host "`n==> $t" -ForegroundColor Cyan }

Step 'Checking PHP and Node'
if (-not (Get-Command php -ErrorAction SilentlyContinue)) { throw 'PHP not found. Run: winget install -e --id PHP.PHP.8.2 and reopen the terminal.' }
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) { throw 'Node.js not found. Run: winget install -e --id OpenJS.NodeJS.LTS and reopen the terminal.' }
$phpBin = (& php -n -r "echo PHP_BINARY;")
$phpDir = Split-Path $phpBin
Write-Host "PHP: $phpBin"
Write-Host "Node: $(node -v)"

Step 'Writing project-local php.ini (does not touch your system PHP config)'
$phpLink = Join-Path $tools 'php'
if (-not (Test-Path $phpLink)) { New-Item -ItemType Junction -Path $phpLink -Target $phpDir | Out-Null }
$extDir = Join-Path $phpLink 'ext'
Write-Host "Extensions dir: $extDir"
$ini = Get-Content (Join-Path $phpDir 'php.ini-development')
$ini = $ini | Where-Object { $_ -notmatch '^\s*extension_dir\s*=' }
foreach ($ext in 'openssl','pdo_sqlite','sqlite3','mbstring','fileinfo','curl','zip') {
    $ini = $ini -replace "^;\s*extension=$ext\s*$", "extension=$ext"
}
$ini += ('extension_dir = "' + $extDir + '"')
$ini += 'memory_limit = 1G'
[IO.File]::WriteAllLines((Join-Path $tools 'php.ini'), [string[]]$ini, (New-Object Text.UTF8Encoding $false))
$env:PHPRC = $tools
$mods = (& php -m) -join "`n"
foreach ($m in 'openssl','pdo_sqlite','mbstring') {
    if ($mods -notmatch "(?m)^$m\s*$") { throw "PHP extension '$m' did not load. Check $tools\php.ini (extension_dir = $extDir)" }
    Write-Host "  ext ok: $m"
}

Step 'Downloading Composer'
$composer = Join-Path $tools 'composer.phar'
if (-not (Test-Path $composer)) {
    Invoke-WebRequest -UseBasicParsing -Uri 'https://getcomposer.org/download/latest-stable/composer.phar' -OutFile $composer
}

Step 'Backend: installing PHP dependencies (a few minutes)'
Set-Location (Join-Path $root 'backend')
if (-not (Test-Path '.env')) { Copy-Item '.env.example' '.env' }
php $composer update --no-interaction --with-all-dependencies
if ($LASTEXITCODE -ne 0) { throw 'composer update failed' }

Step 'Backend: database, keys and demo data'
$db = Join-Path (Get-Location) 'database\database.sqlite'
if (-not (Test-Path $db)) { New-Item -ItemType File -Path $db | Out-Null }
php artisan key:generate --force
php artisan jwt:secret --force
php artisan migrate:fresh --seed --force
if ($LASTEXITCODE -ne 0) { throw 'migrations failed' }

Step 'Frontend: installing JS dependencies (a few minutes)'
Set-Location (Join-Path $root 'frontend')
npm install --legacy-peer-deps
if ($LASTEXITCODE -ne 0) { throw 'npm install failed' }

Set-Location $root
Write-Host "`nDone! Now run: .\run.ps1" -ForegroundColor Green
Write-Host 'Login: admin@clinic.test / password'
