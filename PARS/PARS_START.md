# PARS — Başlangıç Kılavuzu

## PARS Nedir?
PARS AI Holding Operating System — çoklu proje AI yönetim mimarisi.
Claude Code üzerine inşa edilmiş, kurumsal düzeyde agent + skill + MCP sistemi.

## Projeler
| Proje | Dizin | Durum |
|-------|-------|-------|
| ARES | C:\ARES\ | Aktif — afet risk platformu |
| XR | C:\PARS\projects\XR\ | Planlama |
| MEDIA | C:\PARS\projects\MEDIA\ | Planlama |
| SECURITY | C:\PARS\projects\SECURITY\ | Planlama |
| KNOWLEDGE | C:\PARS\projects\KNOWLEDGE\ | Aktif — Bilge/Obsidian |

## Çekirdek Sistem
| Bileşen | Rol |
|---------|-----|
| Börü | Ana orkestratör |
| Bilge | Kurumsal hafıza (bilge-vault/) |
| Töre | Standartlar ve öğrenme |
| Kaşif | Araştırma ve keşif |
| Kalkan | Güvenlik ve denetim |
| Yuva | Stratejik konsey |

## Hızlı Başlangıç

### PARS'ı Aç
```
cd C:\PARS
claude
```

### Healthcheck Çalıştır
```powershell
.\scripts\pars_healthcheck.ps1
```

### ARES Projesini Aç
```
cd C:\ARES
claude
```

## Aktif MCP'ler (ARES oturumunda)
- excel-mcp-server — Excel okuma
- git — Versiyon kontrol
- ruflo — Workflow
- instagram — Sosyal medya

## Sesli Arayüz
`projects/KNOWLEDGE/voice-interface/README.md` — Kurulum ve kullanım.
Durum: Repolar hazır, pip kurulumu bekliyor.

## Bilge Vault
Obsidian uyumlu markdown vault: `C:\PARS\bilge-vault\`
Obsidian'da vault olarak aç → kurumsal hafıza görselleştirmesi hazır.

## Kaynaklar
Tüm repolar: `C:\Users\MSI-NB\.claude\claude-kaynak\repos\`
Öncelikli 5: faster-whisper · kokoro · OpenJarvis · gstack · ECC

## Agent Dizini
`C:\PARS\AGENTS.md`

## Görev Takibi
- Aktif: `tasks/todo.md`
- Backlog: `tasks/backlog.md`
- Kararlar: `tasks/decision-log.md`
