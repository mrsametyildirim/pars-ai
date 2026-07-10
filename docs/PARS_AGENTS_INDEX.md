# PARS Agent Kataloğu

## Çekirdek Sistem Agentları

| Agent | Dosya | Rol |
|-------|-------|-----|
| Börü Orchestrator | boru-orchestrator.md | Ana orkestratör, router, planner, evaluator |
| Bilge Memory | bilge-memory-agent.md | Obsidian tabanlı kurumsal hafıza |
| Töre Standards | tore-standards-agent.md | Öğrenme ve standartlar sistemi |
| Kaşif Research | kasif-research-agent.md | Araştırma, benchmark, keşif |
| Kalkan Security | kalkan-security-agent.md | Güvenlik, risk, OWASP denetimi |
| Yuva Council | yuva-council-agent.md | Stratejik savaş odası |

---

## CEO Agentları

| Agent | Dosya | Proje | Alan |
|-------|-------|-------|------|
| CEO-ARES | ceo-ares.md | ARES | Afet risk, deprem, tahliye, CBS |
| CEO-XR | ceo-xr.md | XR | AR/VR/XR, spatial computing |
| CEO-MEDIA | ceo-media.md | MEDIA | Sosyal medya, video, içerik |
| CEO-SECURITY | ceo-security.md | SECURITY | Güvenlik mimarisi, audit |
| CEO-KNOWLEDGE | ceo-knowledge.md | KNOWLEDGE | Obsidian, dokümantasyon, ses sistemi |

---

## Teknik Agentlar

| Agent | Dosya | Uzmanlık |
|-------|-------|----------|
| Frontend Agent | frontend-agent.md | React/Tailwind/Zustand, UI bileşenleri |
| Backend Agent | backend-agent.md | Node/Prisma/PostgreSQL, API endpoint'leri |
| API Agent | api-agent.md | REST/OpenAPI spec, endpoint standardı |
| Testing Agent | testing-agent.md | Vitest/Playwright, kalite kapıları |
| Documentation Agent | documentation-agent.md | Teknik dokümantasyon, sürekli güncelleme |
| Planning Agent | planning-agent.md | Sprint, task breakdown, todo |
| Product Agent | product-agent.md | Ürün kararları, roadmap, feature |
| Design Reviewer | design-reviewer-agent.md | Tasarım kalitesi, renk tutarlılığı |
| Code Reviewer | code-reviewer-agent.md | Kod kalitesi, güvenlik, OWASP |
| Release Agent | release-agent.md | Deployment checklist, final kalite |
| Börü Voice | boru-voice-agent.md | STT/TTS ses arayüzü |

---

## Agent Seçim Matrisi

| Görev | Agent |
|-------|-------|
| Kullanıcı talebi geliyor | Börü Orchestrator |
| Proje hafızası sorgusu | Bilge Memory |
| Kullanıcı düzeltme yaptı | Töre Standards |
| Yeni araç/repo araştırma | Kaşif Research |
| Güvenlik denetimi | Kalkan Security |
| Kritik mimari karar | Yuva Council |
| ARES proje işi | CEO-ARES |
| Video/içerik işi | CEO-MEDIA |
| Yeni özellik | Product Agent |
| UI geliştirme | Frontend Agent + Design Reviewer |
| API endpoint | API Agent + Backend Agent |
| Test yazma | Testing Agent |
| Deployment | Release Agent + Kalkan |

---

## Agent Çağırma Protokolü

```
Direkt context'te çözülebiliyor mu?
    ├── Evet → Agent çağırma, direkt yap
    └── Hayır → En küçük yeterli agent seç
               ├── 1 agent yeterli → 1 agent çağır
               └── Birden fazla gerekli → Paralel çalıştır (bağımsız görevlerse)
```

**Asla:** Basit görev için Yuva açma. Yuva sadece kritik stratejik kararlar için.
