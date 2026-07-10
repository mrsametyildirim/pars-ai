# PARS Skill Kataloğu

## PARS Çekirdek Skill'leri (14 adet)

| No | Klasör | Skill Adı | Tetikleyici |
|----|--------|-----------|-------------|
| 00 | 00-pars-runtime | PARS Runtime | Her görev başında |
| 01 | 01-planning | Sprint Planlama | `/pars-plan` |
| 02 | 02-frontend-design | Frontend Tasarım | UI/frontend görevi |
| 03 | 03-ui-ux-pro-max | UI/UX Premium | Arayüz iyileştirme |
| 04 | 04-code-review | Kod İnceleme | `/pars-review` |
| 05 | 05-owasp-security | OWASP Güvenlik | Güvenlik denetimi |
| 06 | 06-seo | SEO | `/seo` komutları |
| 07 | 07-remotion | Remotion Video | Video üretimi |
| 08 | 08-api-openapi | API Tasarım | REST/OpenAPI spec |
| 09 | 09-testing-quality | Test ve Kalite | Test yazımı |
| 10 | 10-obsidian-bilge | Obsidian Bilge | Hafıza okuma/yazma |
| 11 | 11-research-kasif | Araştırma Kaşif | `/pars-research` |
| 12 | 12-project-bootstrap | Proje Kurulum | Yeni proje başlatma |
| 13 | 13-voice-boru | Ses Sistemi | Ses komutları |

---

## .agents/skills/ Dizinindeki Ek Skill'ler (400+)

Bu skill'ler `C:\Users\MSI-NB\.agents\skills\` altında bulunur ve gerektiğinde çağrılır.

### Öne Çıkan Kategoriler

**Frontend & Tasarım:**
- senior-frontend, frontend-design, ui-styling, design-system
- high-end-visual-design, minimalist-ui, industrial-brutalist-ui
- animated-component-libraries, gsap-scrolltrigger, framer-motion

**Backend & API:**
- senior-backend, senior-fullstack, api-design-reviewer
- database-designer, senior-data-engineer

**Güvenlik:**
- security-audit, cloud-security, ai-security, threat-detection
- senior-secops, senior-security

**Araştırma & Analiz:**
- research, research-deep, competitive-intel, market-research
- autoresearch, statistical-analyst

**İçerik & Medya:**
- content-creator, video, remotion-video, social-media-manager
- copywriting, newsletter-voice

**Ürün & Strateji:**
- senior-pm, product-strategist, roadmap-communicator
- ceo-advisor, cto-advisor, cfo-advisor

**SEO & Büyüme:**
- seo, seo-technical, seo-content, seo-audit, aeo
- analytics, analytics-dashboard

**Test & Kalite:**
- senior-qa, regression-suite, playwright-pro, webapp-testing

---

## Skill Seçim Protokolü

```
Görev sınıflandırıldı
    ↓
PARS çekirdek skill'leri yeterli mi?
    ├── Evet → PARS skill kullan
    └── Hayır → .agents/skills/ kataloğuna bak
               ↓
               Skill var mı?
               ├── Evet → Çağır
               └── Hayır → Kaşif ile araştır veya yeni skill yaz
```

---

## Skill Ekleme Protokolü
Yeni skill eklenmesi için:
1. Kaşif mevcut skill'lerin yeterli olmadığını teyit eder
2. Töre benzer pattern olup olmadığını kontrol eder
3. Yuva ekleme kararını onaylar (büyük skill'ler için)
4. Küçük skill'leri CEO doğrudan ekleyebilir
