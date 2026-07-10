---
name: pars-runtime
description: PARS'ın temel çalışma motoru. Her görevde aktif — talebi sınıflandırır, risk belirler, ekosistem bağlantısını analiz eder, en küçük yeterli ekibi seçer. 14-domain ekosistem, 5-faz yaşam döngüsü, 33 skill routing. Trigger: her yeni görev başlangıcı.
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
| **güvenlik** | audit, OWASP, risk, açık, güvenlik, auth |
| **medya** | video, reel, içerik, sosyal medya, kapak |
| **dokümantasyon** | belgele, yaz, README, spec, döküman |
| **otomasyon** | script, cron, pipeline, otomatik, n8n, workflow |
| **strateji** | yatırımcı, pitch, büyüme, karar, vizyon, roadmap |
| **iş-geliştirme** | pazar, rakip, fırsat, model, monetization |
| **ar-xr** | AR, VR, PARAVERSE, TLOA, spatial, hologram, WebXR |
| **fintech** | coin, token, PARGT, analiz, finans, alarm, borsa |
| **sağlık** | beslenme, vitamin, kalori, sağlık, fitness, kıyafet |
| **marketplace** | ilan, satış, kiralama, müzayede, pazar, FarmDirect |
| **oyun** | oyun, TLOA, kart, turnuva, NFT, ekonomi, lonca |
| **etkinlik** | düğün, mezuniyet, QR fotoğraf, organizasyon |
| **topluluk** | forum, tartışma, değerlendirme, soru-cevap, hikaye |
| **eğitim** | kitap, PDF, çeviri, kurs, soru-cevap sistemi |
| **tarım** | arı, toprak, hastalık, sulama, zekât, bağış |
| **donanım** | gözlük, wearable, haptic, XR cihaz, sensör |
| **altyapı** | auth, admin, analitik, bildirim, ödeme, API gateway |
| **iş çözümü** | restoran, gayrimenkul, site yönetimi, aidat |

## Adım 2: 14-Domain Ekosistem Bağlantısı

```
Sınıflandırmadan sonra hangi domain'e ait?

01 BÖRÜ / AI CORE      → Börü panel, ses, n8n, içerik stüdyosu
02 PARAVERSE           → XR, TLOA, PARGT, AR katmanı
03 GAMING STUDIO       → TLOA oyun sistemi, strateji, AR oyunlar
04 SOCIAL LAB          → Sosyal medya bot, UFC/Kitap/Crypto/Viral
05 HEALTH OS           → Sağlık, fitness, stil asistanı
06 FINTECH LAB         → Finans, coin, yatırım, PARGT dashboard
07 MARKETPLACE         → AR-SAT, FarmDirect, müzayede
08 EVENTS PLATFORM     → QR medya, düğün, mezuniyet
09 BUSINESS SOLUTIONS  → Restoran, gayrimenkul, site yönetimi
10 COMMUNITY           → Tartışma, değerlendirme, hikaye
11 EDUCATION HUB       → PDF, kitap, çeviri, öğrenim
12 SECURITY/INFRA      → Auth, API, admin, ortak altyapı
13 AGRICULTURE/SOCIAL  → Tarım, arı, bağış
14 FUTURE TECH         → Giyilebilir, AR gözlük, donanım
```

Her görev için sor:
- **PARAVERSE'e entegrasyon potansiyeli var mı?** (AR katmanı, PARGT)
- **Bu 5+ yıl içinde ölçeklenebilir mi?**
- **Ortak altyapı kullanılabilir mi?** (Auth, admin, analitik)

## Adım 3: Risk Belirleme

| Risk | Göstergeler |
|------|-------------|
| **Düşük** | Mevcut dosyada küçük değişiklik, statik içerik |
| **Orta** | Birden fazla dosya, yeni bileşen, API değişikliği |
| **Yüksek** | Mimari değişiklik, auth, DB şeması, yetki |
| **Kritik** | Secret sızıntısı, prod veri riski, güvenlik ihlali |

## Adım 4: CEO + Skill Yönlendirme (14 Domain)

```
Börü / ses sistemi / n8n      → CEO-BORU     + 13-voice-boru / 18-n8n-automation
AI içerik stüdyosu            → CEO-AICORE   + 19-social-automation
XR / AR / PARAVERSE           → CEO-PARAVERSE + 23-paraverse-ar
TLOA oyun / ekonomi           → CEO-GAMING   + 24-gaming-economy
Sosyal medya otomasyon        → CEO-SOCIAL   + 19-social-automation
Sağlık / fitness / stil       → CEO-HEALTH   + 20-health-assistant
Fintech / coin / PARGT        → CEO-FINTECH  + 21-fintech-tools
Pazar yeri / FarmDirect       → CEO-MARKETPLACE + 22-marketplace
Etkinlik / QR medya           → CEO-EVENTS   + 25-event-platform
Restoran / gayrimenkul        → CEO-BUSINESS + 30-business-solutions
Tartışma / değerlendirme      → CEO-COMMUNITY + 29-community-platform
PDF / kitap / eğitim          → CEO-EDUCATION + 15-typescript-react
Tarım / bağış                 → CEO-AGRICULTURE + 31-agriculture-social
Giyilebilir / donanım         → CEO-FUTURE   + 32-wearable-hardware
Auth / admin / API gateway    → CEO-INFRASTRUCTURE + 28-common-infrastructure
Admin panel standartları      → CEO-INFRASTRUCTURE + 26-admin-panel
Analitik / raporlama          → CEO-INFRASTRUCTURE + 27-analytics-reporting
```

## Adım 5: 5-Faz Proje Kontrolü

Yeni proje açılıyorsa faz kontrolü:
```
Faz 1 tamamlandı mı? → İhtiyaç & kapsam netleşti mi?
Faz 2 tamamlandı mı? → UX tasarım yapıldı mı?
Faz 3 tamamlandı mı? → Teknik mimari belirlendi mi?
Faz 4 tamamlandı mı? → Çalışan MVP var mı?
Faz 5 aktif mi?      → Kalite, güvenlik, analytics, deploy
```

## Adım 6: Ortak Altyapı Kontrolü

Kod yazmadan önce sor:
```
[ ] PARS Auth kullanıyor mu? (yeniden yazma)
[ ] Admin panel bağlı mı? (26-admin-panel)
[ ] Analitik track() eklendi mi? (27-analytics-reporting)
[ ] Bildirim ortak servis mi? (28-common-infrastructure)
[ ] Design system token'ları mı? (tasarım sistemi)
```

## Adım 7: Ekip Seçimi

```
Tek dosya değişikliği → Direkt yap
Kod geliştirme        → İlgili CEO + skill
UI tasarım            → frontend-design + ui-ux-pro-max
Güvenlik              → Kalkan + ilgili CEO + 05-owasp-security
Araştırma             → Kaşif (gerçekten bilinmiyorsa)
Strateji kararı       → Yuva (yatırım/pivot/mimari)
```

## Adım 8: Çalıştır

- Risk Düşük/Orta → Direkt uygula
- Risk Yüksek → Kısa plan sun, uygula
- Risk Kritik → Yuva aç, kullanıcı onayı al

## Adım 9: Tamamla

- Kalıcı öğrenim → Töre'ye bildir
- Kritik kararlar → Bilge'ye yaz
- Kullanıcıya → Kısa özet (3 cümle max)
- Oturum sonu → Obsidian günlük yaz

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
- Ortak altyapıyı yeniden yazma
- Sadece teknik yanıt verip iş değerini atlama
