Write-Host "[XTTS] Sunucu baslatiliyor..." -ForegroundColor Cyan
$env:PYTHONUNBUFFERED = "1"
python "C:\PARS\scripts\xtts_server.py"
