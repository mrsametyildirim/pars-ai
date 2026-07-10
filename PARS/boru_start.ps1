# Boru Baslat - PARS AI Holding Ana Giris Noktasi
# Kullanim: .\boru_start.ps1

Write-Host ""
Write-Host "========================================" -ForegroundColor DarkBlue
Write-Host "  PARS AI HOLDING OPERATING SYSTEM" -ForegroundColor Cyan
Write-Host "  Boru Orkestrator - v1.0" -ForegroundColor Cyan
Write-Host "  $(Get-Date -Format 'yyyy-MM-dd HH:mm')" -ForegroundColor White
Write-Host "========================================" -ForegroundColor DarkBlue

# Obsidian vault ac
$obsidianPaths = @(
    "$env:LOCALAPPDATA\Obsidian\Obsidian.exe",
    "$env:LOCALAPPDATA\Programs\Obsidian\Obsidian.exe",
    "$env:PROGRAMFILES\Obsidian\Obsidian.exe"
)
$vaultPath = "C:\PARS\bilge-vault"
$obsidianFound = $false
foreach ($p in $obsidianPaths) {
    if (Test-Path $p) {
        Write-Host "[Bilge] Obsidian vault aciliyor..." -ForegroundColor Yellow
        Start-Process $p "--vault `"$vaultPath`""
        $obsidianFound = $true
        Start-Sleep -Milliseconds 1500
        break
    }
}
if (-not $obsidianFound) {
    Write-Host "[Bilge] Obsidian kurulu degil. Vault: $vaultPath" -ForegroundColor DarkYellow
    Write-Host "        Kurmak icin: https://obsidian.md/download" -ForegroundColor DarkYellow
}

# Healthcheck hizli
Write-Host ""
Write-Host "[Kontrol] Sistem durumu..." -ForegroundColor White
$checks = @{
    "PARS CLAUDE.md" = "C:\PARS\CLAUDE.md"
    "Agentlar" = "C:\PARS\.claude\agents"
    "Skilllar" = "C:\PARS\.claude\skills"
    "Bilge Vault" = "C:\PARS\bilge-vault"
}
$allOk = $true
foreach ($k in $checks.Keys) {
    if (Test-Path $checks[$k]) {
        Write-Host "  [OK] $k" -ForegroundColor Green
    } else {
        Write-Host "  [EKSIK] $k" -ForegroundColor Red
        $allOk = $false
    }
}

# Python paketleri kontrol
$pkgs = @("faster_whisper","kokoro","openjarvis")
foreach ($pkg in $pkgs) {
    $result = python -c "import $pkg; print('ok')" 2>$null
    if ($result -eq "ok") {
        Write-Host "  [OK] $pkg" -ForegroundColor Green
    } else {
        Write-Host "  [EKSIK] $pkg (pip install $pkg)" -ForegroundColor Red
    }
}

Write-Host ""
if ($allOk) {
    Write-Host "  Sistem: HAZIR" -ForegroundColor Green
} else {
    Write-Host "  Sistem: EKSIK BILESANLER VAR" -ForegroundColor Yellow
}

# Sesli veya yazili mod sec
Write-Host ""
Write-Host "[Mod Secimi]" -ForegroundColor Cyan
Write-Host "  1 - Yazili (Claude Code ile devam)" -ForegroundColor White
Write-Host "  2 - Sesli (faster-whisper + kokoro) [deneysel]" -ForegroundColor White
Write-Host ""
$mod = Read-Host "Mod"

if ($mod -eq "2") {
    Write-Host "[Ses] Ses arayuzu baslatiliyor..." -ForegroundColor Yellow
    python "C:\PARS\scripts\boru_voice.py"
} else {
    # Yazili mod - Claude Code ac
    Write-Host ""
    Write-Host "========================================" -ForegroundColor DarkBlue
    Write-Host "  Ben Boru. Sistem hazir." -ForegroundColor Cyan
    Write-Host "  Senin icin ne yapabilirim?" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor DarkBlue
    Write-Host ""
    Set-Location "C:\PARS"
    claude
}
