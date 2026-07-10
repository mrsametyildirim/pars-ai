# BORU Panel Baslatici — Node.js + XTTS v2 GPU
$port    = 3737
$url     = "http://localhost:$port"
$xttsUrl = "http://127.0.0.1:8020"

# ── API KEY ───────────────────────────────────────────
$key = [System.Environment]::GetEnvironmentVariable("ANTHROPIC_API_KEY", "User")
if (-not $key) {
    Write-Host ""
    Write-Host "[BORU] ANTHROPIC_API_KEY bulunamadi." -ForegroundColor Yellow
    Write-Host "[BORU] Anahtarini gir (bir kez kaydedilir):" -ForegroundColor Yellow
    $secKey = Read-Host -AsSecureString "API Key"
    $key = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secKey)
    )
    [System.Environment]::SetEnvironmentVariable("ANTHROPIC_API_KEY", $key, "User")
    Write-Host "[BORU] Kaydedildi." -ForegroundColor Green
}
$env:ANTHROPIC_API_KEY = $key

# ── WHISPER STT ──────────────────────────────────────
$whisperUrl     = "http://127.0.0.1:8021"
$whisperRunning = $false
try {
    Invoke-RestMethod "$whisperUrl/health" -TimeoutSec 2 -ErrorAction Stop | Out-Null
    $whisperRunning = $true
} catch {}

if ($whisperRunning) {
    Write-Host "[WHISPER] Zaten calisiyor." -ForegroundColor Green
} else {
    Write-Host "[WHISPER] GPU ses tanima baslatiliyor (large-v3)..." -ForegroundColor Cyan
    $psiW = [System.Diagnostics.ProcessStartInfo]::new(
        "python", "C:\PARS\scripts\whisper_server.py"
    )
    $psiW.UseShellExecute            = $false
    $psiW.CreateNoWindow             = $true
    $psiW.WindowStyle                = [System.Diagnostics.ProcessWindowStyle]::Hidden
    $psiW.RedirectStandardOutput     = $true
    $psiW.RedirectStandardError      = $true
    $psiW.EnvironmentVariables["PYTHONUNBUFFERED"] = "1"
    [System.Diagnostics.Process]::Start($psiW) | Out-Null
    Write-Host "[WHISPER] Arka planda yukleniyor (~30-60 sn ilk seferde)..." -ForegroundColor DarkGray
}

# ── XTTS v2 ──────────────────────────────────────────
$xttsRunning = $false
try {
    Invoke-RestMethod "$xttsUrl/health" -TimeoutSec 2 -ErrorAction Stop | Out-Null
    $xttsRunning = $true
} catch {}

if ($xttsRunning) {
    Write-Host "[XTTS] Zaten calisiyor." -ForegroundColor Green
} else {
    Write-Host "[XTTS] GPU ses motoru baslatiliyor..." -ForegroundColor Cyan
    $psi = [System.Diagnostics.ProcessStartInfo]::new(
        "python", "C:\PARS\scripts\xtts_server.py"
    )
    $psi.UseShellExecute  = $false
    $psi.CreateNoWindow   = $true
    $psi.WindowStyle      = [System.Diagnostics.ProcessWindowStyle]::Hidden
    [System.Diagnostics.Process]::Start($psi) | Out-Null
    Write-Host "[XTTS] Arka planda yuklenıyor (ilk acilista ~30-60 sn)..." -ForegroundColor DarkGray
}

# ── NODE.JS SERVER ────────────────────────────────────
$nodeRunning = $false
try {
    Invoke-RestMethod "$url/health" -TimeoutSec 1 -ErrorAction Stop | Out-Null
    $nodeRunning = $true
} catch {}

if ($nodeRunning) {
    Write-Host "[BORU] Panel zaten calisiyor: $url" -ForegroundColor Green
} else {
    Write-Host "[BORU] Panel sunucusu baslatiliyor..." -ForegroundColor Cyan
    $psi2 = [System.Diagnostics.ProcessStartInfo]::new(
        "node", "C:\PARS\boru-panel\server\server.js"
    )
    $psi2.UseShellExecute = $false
    $psi2.CreateNoWindow  = $true
    $psi2.EnvironmentVariables["ANTHROPIC_API_KEY"] = $key
    [System.Diagnostics.Process]::Start($psi2) | Out-Null
    Start-Sleep -Seconds 2
    Write-Host "[BORU] Panel hazir." -ForegroundColor Green
}

# ── TARAYICI ─────────────────────────────────────────
Write-Host ""
Write-Host "[BORU] Aciliyor: $url" -ForegroundColor Cyan
Write-Host "       VS Code: Ctrl+Shift+P > Simple Browser: Show > $url" -ForegroundColor DarkGray
Write-Host ""
Start-Process $url
