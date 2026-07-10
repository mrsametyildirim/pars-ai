---
name: pars-runtime
description: PARS'ın temel çalışma motoru. Her görevde aktif — talebi sınıflandırır, risk belirler, en küçük yeterli ekibi seçer. Trigger: her yeni görev başlangıcı.
---

# PARS Runtime Skill

## Amaç
Her görev başında otomatik çalışan PARS karar motoru.

## Adım 1: Talep Sınıflandırma

Aşağıdaki kategorilerden en uygununu seç:

| Kategori | Anahtar Sinyaller |
|----------|------------------|
| **kod** | yaz, düzelt, refactor, bug, implement, endpoint |
| **tasarım** | UI, dashboard, görünüm, renk, layout, bileşen |
| **ürün** | özellik, roadmap, kullanıcı, ne yapmalı, karar |
| **araştırma** | karşılaştır, bul, analiz, en iyi, benchmark |
| **güvenlik** | audit, OWASP, risk, açık, güvenlik |
| **medya** | video, reel, içerik, sosyal medya, kapak |
| **dokümantasyon** | belgele, yaz, README, spec, dokümantasyon |
| **otomasyon** | script, cron, pipeline, otomatik, CI/CD |

## Adım 2: Risk Belirleme

| Risk | Göstergeler |
|------|-------------|
| **Düşük** | Mevcut dosyada küçük değişiklik, statik içerik |
| **Orta** | Birden fazla dosya, yeni bileşen, API değişikliği |
| **Yüksek** | Mimari değişiklik, auth, DB şeması, yetki |
| **Kritik** | Secret sızıntısı, prod veri riski, güvenlik ihlali |

## Adım 3: Ekip Seçimi

Minimum yeterli ekip seç:

```
Tek dosya değişikliği → Direkt yap, agent çağırma
Kod geliştirme → İlgili CEO + geliştirici agent
UI tasarım → CEO + frontend-agent + design-reviewer
Güvenlik → Kalkan (+ CEO yüksek risk varsa)
Araştırma → Kaşif (gerçekten bilinmiyorsa)
Kritik karar → Yuva
```

## Adım 4: Çalıştır

- Risk Düşük/Orta → Direkt uygula
- Risk Yüksek → Kullanıcıya kısa plan sun, uygula
- Risk Kritik → Yuva aç, kullanıcı onayı al

## Adım 5: Tamamla

- Kalıcı değeri olan öğrenimler → Töre'ye bildir
- Kritik kararlar → Bilge'ye yaz
- Kullanıcıya → Kısa özet (3 cümle max)

## Oturum Başı Kontrol (Önce Yap)
1. `obsidian-mcp` ile `börü-öğrenim/günlük/` kontrol et
2. Dünün notu eksikse → yaz
3. `kullanim/rankings.md` → hangi araçlar öncelikli?

## Asla Yapma
- "Devam edeyim mi?" sorma
- Basit görev için Yuva açma
- Her şeyi araştırmaya çevirme
- Gereksiz agent zinciri kurma
