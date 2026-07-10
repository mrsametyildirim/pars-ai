---
name: pars-runtime
description: PARS'ın temel çalışma motoru. Her görevde aktif — talebi sınıflandırır, risk belirler, ekosistem bağlantısını analiz eder, en küçük yeterli ekibi seçer. Trigger: her yeni görev başlangıcı.
---

# PARS Runtime Skill

## Amaç
Her görev başında otomatik çalışan PARS karar motoru.

## Adım 1: Talep Sınıflandırma

| Kategori | Anahtar Sinyaller |
|----------|------------------|
| **kod** | yaz, düzelt, refactor, bug, implement, endpoint |
| **tasarım** | UI, dashboard, görünüm, renk, layout, bileşen |
| **ürün** | özellik, roadmap, kullanıcı, ne yapmalı, karar |
| **araştırma** | karşılaştır, bul, analiz, en iyi, benchmark |
| **güvenlik** | audit, OWASP, risk, açık, güvenlik |
| **medya** | video, reel, içerik, sosyal medya, kapak |
| **dokümantasyon** | belgele, yaz, README, spec, dokümantasyon |
| **otomasyon** | script, cron, pipeline, otomatik, n8n, workflow |
| **strateji** | yatırımcı, pitch, büyüme, karar, vizyon, roadmap |
| **iş-geliştirme** | pazar, rakip, fırsat, model, monetization |
| **ar-xr** | AR, VR, PARAVERSE, TLOA, spatial, hologram |
| **fintech** | coin, token, PARGT, analiz, finans, alarm |
| **sağlık** | beslenme, vitamin, kalori, sağlık asistanı |
| **marketplace** | ilan, satış, kiralama, müzayede, pazar |
| **oyun** | oyun, TLOA, kart, turnuva, NFT, ekonomi |

## Adım 2: Ekosistem Bağlantısı

Her görev için sor:
- **Hangi PARS ürününe bağlı?** (Börü / PARAVERSE / Automation / Social / Health / Fintech / Marketplace / Education / Gaming / Events)
- **PARAVERSE'e entegrasyon potansiyeli var mı?**
- **PARGT token'ı etkiler mi?**
- **Bu 5 yıl içinde ölçeklenebilir mi?**

## Adım 3: Risk Belirleme

| Risk | Göstergeler |
|------|-------------|
| **Düşük** | Mevcut dosyada küçük değişiklik, statik içerik |
| **Orta** | Birden fazla dosya, yeni bileşen, API değişikliği |
| **Yüksek** | Mimari değişiklik, auth, DB şeması, yetki |
| **Kritik** | Secret sızıntısı, prod veri riski, güvenlik ihlali |

## Adım 4: CEO Yönlendirme

```
AI OS / Börü geliştirme  → CEO-BORU
XR / AR / PARAVERSE      → CEO-PARAVERSE + CEO-XR
Otomasyon / n8n          → CEO-AUTOMATION
Sosyal medya bot         → CEO-SOCIAL
Sağlık asistanı          → CEO-HEALTH
Fintech / coin           → CEO-FINTECH
Pazar yeri               → CEO-MARKETPLACE
Eğitim sistemi           → CEO-EDUCATION
Oyun / TLOA              → CEO-GAMING
Etkinlik / org           → CEO-EVENTS
Afet / ARES              → CEO-ARES
Video üretimi            → CEO-MEDIA
Güvenlik audit           → CEO-SECURITY
Bilgi yönetimi           → CEO-KNOWLEDGE
```

## Adım 5: Ekip Seçimi

```
Tek dosya değişikliği → Direkt yap
Kod geliştirme        → İlgili CEO + skill
UI tasarım            → CEO + frontend-design + ui-ux-pro-max
Güvenlik              → Kalkan + ilgili CEO
Araştırma             → Kaşif (gerçekten bilinmiyorsa)
Strateji kararı       → Yuva
```

## Adım 6: Çalıştır

- Risk Düşük/Orta → Direkt uygula
- Risk Yüksek → Kullanıcıya kısa plan sun, uygula
- Risk Kritik → Yuva aç, kullanıcı onayı al

## Adım 7: Tamamla

- Kalıcı değeri olan öğrenimler → Töre'ye bildir
- Kritik kararlar → Bilge'ye yaz
- Kullanıcıya → Kısa özet (3 cümle max)

## Kaya'ya Yanıt Verirken

Kaya YL + MBA seviyesinde, uzun vadeli düşünür. Yanıtlarda:
- Teknik detay + **iş değeri** birlikte ver
- Öneri verirken **PARAVERSE ekosistemi** bağlantısını göster
- Mimari kararlarda **5-10 yıllık ölçeklenebilirliği** hesaba kat
- Araştırma yapmak yerine **aksiyon odaklı** öner
- Seçenek sunarken **ekosistem uyumunu** önce değerlendir

## Oturum Başı Kontrol (Önce Yap)
1. `obsidian-mcp` ile `börü-öğrenim/günlük/` kontrol et
2. Dünün notu eksikse → yaz
3. Bekleyen görev var mı kontrol et

## Asla Yapma
- "Devam edeyim mi?" sorma
- Basit görev için Yuva açma
- Her şeyi araştırmaya çevirme
- Gereksiz agent zinciri kurma
- Ekosistem bağlantısını göz ardı etme
- Sadece teknik yanıt verip iş değerini atlama
