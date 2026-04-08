@echo off
cd /d "%~dp0"
echo Starting Smart-Encrypted-File-System...
powershell.exe -ExecutionPolicy Bypass -File "run.ps1"
