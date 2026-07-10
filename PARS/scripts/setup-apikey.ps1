Write-Host ""
Write-Host "  BORU API KEY KURULUMU" -ForegroundColor Cyan
Write-Host "  ──────────────────────────────────────" -ForegroundColor DarkGray
Write-Host "  Anthropic API anahtarin: https://console.anthropic.com/settings/keys" -ForegroundColor DarkGray
Write-Host ""

$secKey = Read-Host -AsSecureString "  API Key (ekranda gorunmez)"
$key = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secKey)
)

if (-not $key -or $key.Length -lt 20) {
    Write-Host "  Gecersiz key. Cikiliyor." -ForegroundColor Red
    exit 1
}

[System.Environment]::SetEnvironmentVariable("ANTHROPIC_API_KEY", $key, "User")
Write-Host ""
Write-Host "  Kaydedildi. Artik boru_panel.ps1 calisiyor." -ForegroundColor Green
Write-Host ""

# Sunucuyu yeniden baslat
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -Confirm:$false
Start-Sleep 1

$psi = [System.Diagnostics.ProcessStartInfo]::new("node","C:\PARS\boru-panel\server\server.js")
$psi.UseShellExecute = $false
$psi.CreateNoWindow  = $true
$psi.EnvironmentVariables["ANTHROPIC_API_KEY"] = $key
[System.Diagnostics.Process]::Start($psi) | Out-Null
Start-Sleep 2

$r = Invoke-RestMethod "http://localhost:3737/health" -TimeoutSec 3 -ErrorAction SilentlyContinue
if ($r.apiReady) {
    Write-Host "  Panel hazir: http://localhost:3737" -ForegroundColor Green
    Start-Process "http://localhost:3737"
} else {
    Write-Host "  Sunucu baslamadi, kontrol et." -ForegroundColor Red
}
