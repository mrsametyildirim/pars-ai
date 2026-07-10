# PARS Sistem Healthcheck
# Kullanim: .\scripts\pars_healthcheck.ps1

function Check-Exists($path, $label) {
    if (Test-Path $path) {
        Write-Host "  [OK] $label" -ForegroundColor Green
        return 1
    } else {
        Write-Host "  [EKSIK] $label" -ForegroundColor Red
        return 0
    }
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  PARS AI HOLDING - SISTEM KONTROLU" -ForegroundColor Cyan
Write-Host "  $(Get-Date -Format 'yyyy-MM-dd HH:mm')" -ForegroundColor White
Write-Host "==========================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "[1] ANA DIZIN YAPISI" -ForegroundColor Yellow
$s = 0
$s += Check-Exists "C:\PARS\CLAUDE.md"             "CLAUDE.md"
$s += Check-Exists "C:\PARS\AGENTS.md"             "AGENTS.md"
$s += Check-Exists "C:\PARS\PARS_START.md"         "PARS_START.md"
$s += Check-Exists "C:\PARS\docs"                  "docs/"
$s += Check-Exists "C:\PARS\bilge-vault"           "bilge-vault/"
$s += Check-Exists "C:\PARS\projects"              "projects/"
$s += Check-Exists "C:\PARS\tasks"                 "tasks/"
$s += Check-Exists "C:\PARS\.claude\agents"        ".claude/agents/"
$s += Check-Exists "C:\PARS\.claude\skills"        ".claude/skills/"
$s += Check-Exists "C:\PARS\.claude\commands"      ".claude/commands/"
$s += Check-Exists "C:\PARS\.claude\rules"         ".claude/rules/"
Write-Host "  Skor: $s/11" -ForegroundColor White

Write-Host ""
Write-Host "[2] CEKIRDEK AGENTLAR" -ForegroundColor Yellow
$as = 0
$agents = @("boru-orchestrator","bilge-memory-agent","tore-standards-agent","kasif-research-agent","kalkan-security-agent","yuva-council-agent")
foreach ($a in $agents) { $as += Check-Exists "C:\PARS\.claude\agents\$a.md" $a }
Write-Host "  Cekirdek: $as/6" -ForegroundColor White

$cs = 0
$ceos = @("ceo-ares","ceo-xr","ceo-media","ceo-security","ceo-knowledge")
foreach ($c in $ceos) { $cs += Check-Exists "C:\PARS\.claude\agents\$c.md" $c }
Write-Host "  CEO katmani: $cs/5" -ForegroundColor White

Write-Host ""
Write-Host "[3] PARS SKILLS" -ForegroundColor Yellow
$skills = @(Get-ChildItem "C:\PARS\.claude\skills" -Directory -ErrorAction SilentlyContinue)
Write-Host "  Skill dizini sayisi: $($skills.Count)" -ForegroundColor White

Write-Host ""
Write-Host "[4] KAYNAK KUTUPHANESI" -ForegroundColor Yellow
$repoRoot = "C:\Users\MSI-NB\.claude\claude-kaynak\repos"
if (Test-Path $repoRoot) {
    $repos = @(Get-ChildItem $repoRoot -Directory)
    Write-Host "  Toplam repo: $($repos.Count)" -ForegroundColor White
    $priority = @("faster-whisper","kokoro","OpenJarvis","gstack","ECC")
    foreach ($p in $priority) {
        $found = $repos | Where-Object { $_.Name -like "*$p*" }
        if ($found) {
            Write-Host "  [OK] $p" -ForegroundColor Green
        } else {
            Write-Host "  [EKSIK] $p" -ForegroundColor Red
        }
    }
} else {
    Write-Host "  [UYARI] Kaynak dizini bulunamadi" -ForegroundColor Red
}

Write-Host ""
Write-Host "[5] BILGE VAULT" -ForegroundColor Yellow
$vault = @(Get-ChildItem "C:\PARS\bilge-vault" -Recurse -Filter "*.md" -ErrorAction SilentlyContinue)
Write-Host "  Vault dosya sayisi: $($vault.Count)" -ForegroundColor White

Write-Host ""
Write-Host "[6] GOREV TAKIBI" -ForegroundColor Yellow
Check-Exists "C:\PARS\tasks\todo.md" "tasks/todo.md" | Out-Null
Check-Exists "C:\PARS\tasks\backlog.md" "tasks/backlog.md" | Out-Null
Check-Exists "C:\PARS\tasks\decision-log.md" "tasks/decision-log.md" | Out-Null

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  KONTROL TAMAMLANDI" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
