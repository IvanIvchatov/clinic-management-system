# Starts the API (http://127.0.0.1:8000) and the Vue app (http://localhost:8080) in two windows
$root = $PSScriptRoot
$tools = Join-Path $env:PUBLIC 'clinic-tools'
Start-Process powershell -ArgumentList '-NoExit', '-Command', "`$env:PHPRC='$tools'; Set-Location '$root\backend'; php artisan serve"
Start-Process powershell -ArgumentList '-NoExit', '-Command', "`$env:NODE_OPTIONS='--openssl-legacy-provider'; Set-Location '$root\frontend'; npm run serve"
Write-Host 'API:  http://127.0.0.1:8000'
Write-Host 'App:  http://localhost:8080  (login: admin@clinic.test / password)'
