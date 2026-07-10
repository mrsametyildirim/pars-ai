---
name: project-bootstrap
description: Yeni proje kurulum şablonu. PARS yapısı oluşturma, CEO atama, design system tanımlama, ilk sprint planlama. Trigger: yeni proje başlatma kararı (Yuva onaylı).
---

# Project Bootstrap Skill

## Kullanım
Yuva yeni proje kararı aldığında bu skill çalışır.

## Adım 1: Proje Bilgi Toplama

```
Proje Adı: [BÜYÜK HARF]
CEO: CEO-[PROJE]
Alan: [kısaca]
Hedef Kitle: [kimler kullanacak]
Birincil Renk: [hex kodu]
Tasarım Stili: [A/B/C/D]
Öncelik: [1-5]
```

## Adım 2: Dizin Yapısı Oluştur

```
C:\PARS\projects\[PROJE]\
├── PROJECT.md          ← Proje tanımı
├── MEMORY.md           ← Aktif notlar
├── DECISIONS.md        ← Kararlar
├── STANDARDS.md        ← Proje standartları
├── ROADMAP.md          ← Yol haritası
└── teams\
    ├── design-team.md
    ├── frontend-team.md
    ├── backend-team.md
    ├── api-team.md
    ├── testing-team.md
    └── growth-team.md
```

## Adım 3: PROJECT.md Şablonu

```markdown
# [PROJE ADI] — [Kısa Tanım]

## Bağlam
- CEO: CEO-[PROJE]
- Öncelik: [1-5]
- Durum: Aktif / Durduruldu / Tamamlandı
- Başlangıç: [YYYY-MM-DD]

## Amaç
[1-2 cümle: ne sorunu çözüyor]

## Hedef Kitle
[kimler kullanacak]

## Design System
- Birincil renk: [hex]
- Zemin: [hex]
- Vurgu/Kritik: [hex]
- Stil: [A/B/C/D]
- Referans: [estetik referanslar]

## Teknoloji Stack
- Frontend: [...]
- Backend: [...]
- Araçlar: [...]

## Başarı Kriteri
1. [ölçülebilir kriter]
2. [ölçülebilir kriter]
```

## Adım 4: bilge-vault Güncelle

```
bilge-vault/10-projects/[PROJE].md → Proje tanıtımı
bilge-vault/00-index/02-project-map.md → Haritaya ekle
```

## Adım 5: İlk Sprint Planı

```markdown
## Sprint 0 — Kurulum ([tarih])
- [x] Dizin yapısı oluşturuldu
- [x] CEO atandı
- [ ] Design system tanımlandı
- [ ] İlk milestone belirlendi
- [ ] Takım konfigürasyonu tamamlandı
```

## Adım 6: PARS'a Bildir

Börü'ye bildir:
- Yeni proje eklendi: [PROJE]
- CEO atandı: CEO-[PROJE]
- Hazır: [tarih]
