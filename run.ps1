# run.ps1
$ErrorActionPreference = "Stop"

# Use absolute paths to prevent any path duplication issues
$ProjectRoot = $PSScriptRoot

Function Get-FreePort {
    param ($StartPort = 8000, $EndPort = 8010)
    for ($i = $StartPort; $i -le $EndPort; $i++) {
        $connection = Get-NetTCPConnection -LocalPort $i -ErrorAction SilentlyContinue
        if ($null -eq $connection) {
            return $i
        }
    }
    return 8000 # fallback
}

$BackendPort = Get-FreePort -StartPort 8000 -EndPort 8010

Write-Host "--- Backend Setup ---" -ForegroundColor Cyan
Set-Location "$ProjectRoot\backend"
if (-Not (Test-Path "venv")) {
    Write-Host "Creating Virtual Environment..."
    python -m venv venv
}

Write-Host "Checking / Installing Backend Requirements..."
.\venv\Scripts\python.exe -m pip install -r requirements.txt -q

Write-Host "Starting Backend on port $BackendPort..." -ForegroundColor Green
Start-Process powershell -WorkingDirectory "$ProjectRoot\backend" -ArgumentList "-NoExit -Command `".\venv\Scripts\python.exe -m uvicorn main:app --port $BackendPort --reload`""

Write-Host "--- Frontend Setup ---" -ForegroundColor Cyan
Set-Location "$ProjectRoot\frontend"
Write-Host "Starting Frontend..." -ForegroundColor Green
Start-Process powershell -WorkingDirectory "$ProjectRoot\frontend" -ArgumentList "-NoExit -Command `"`$env:NEXT_PUBLIC_API_URL='http://localhost:$BackendPort'; npm run dev`""

Set-Location $ProjectRoot
Write-Host "--------------------------------------------------------"
Write-Host "Both services have been successfully launched!" -ForegroundColor Yellow
Write-Host "Frontend Location: http://localhost:3000"
Write-Host "Backend API Docs:  http://localhost:$BackendPort/docs"
Write-Host "--------------------------------------------------------"
