# Proje Geliştirme Yaşam Döngüsü — PARS

## Kural: Kod Yazmadan Önce Analiz

Yeni proje fikrinde veya büyük özellik talebinde DOĞRUDAN KOD YAZMA.
Her zaman bu 5 aşama sırasıyla ilerle.

---

## Aşama 1 — İhtiyaç ve Kapsam

Yanıtlanacak sorular:

1. **Sorun:** Ürün hangi sorunu çözüyor? (1 cümle)
2. **Kullanıcı:** Hedef kullanıcı kim? (kitle, segment)
3. **Öncelik:** Kullanıcının en kritik ihtiyacı ne?
4. **MVP Sınırı:** İlk sürümde MUTLAKA olması gerekenler?
5. **Ertelenenler:** Hangi özellikler v2'ye kalabilir?
6. **Gelir Modeli:** Nasıl para kazanacak?
7. **Ekosistem Bağlantısı:** PARAVERSE / AI CORE ile nasıl birleşecek?
8. **Riskler:** Bağımlılıklar, yasal riskler, teknik engeller?

Çıktı: Kısa problem-çözüm özeti (yarım sayfa max)

---

## Aşama 2 — Kullanıcı Deneyimi

Kod yazmadan önce tasarla:

- [ ] Kullanıcı akışı (flowchart)
- [ ] Ekran listesi (her sayfa, her modal)
- [ ] Sayfa yapısı (header, nav, content, footer)
- [ ] Navigasyon sistemi
- [ ] Kullanıcı rolleri (misafir / kullanıcı / admin / süper admin)
- [ ] Yönetici paneli ana ekranları
- [ ] Ana kullanım senaryoları (happy path)
- [ ] Hata durumları (ne gösterilir?)
- [ ] Boş durum ekranları (veri yokken ne gösterilir?)
- [ ] Onboarding akışı (yeni kullanıcı deneyimi)

---

## Aşama 3 — Teknik Mimari

Belirlenecek kararlar:

| Alan | Karar |
|------|-------|
| Frontend | Next.js / React / Vue / Flutter |
| Backend | Node.js / FastAPI / NestJS |
| Veritabanı | Supabase / PostgreSQL / MongoDB |
| API | REST / GraphQL / tRPC |
| Auth | Supabase Auth / JWT / NextAuth |
| Yetkilendirme | RBAC modeli |
| Dosya Depolama | Supabase Storage / Cloudinary / S3 |
| Bildirim | Push / E-posta / SMS / Telegram |
| Analitik | Custom Supabase / PostHog / Mixpanel |
| Log | Structured JSON → Supabase / Loki |
| AI Entegrasyon | Hangi model? Hangi işlev? |
| Güvenlik Modeli | Tehdit modeli, RBAC, rate limit |
| Ortak Altyapı | Hangi PARS shared servisleri kullanılacak? |

---

## Aşama 4 — Çalışan MVP

İlk sürüm kriterleri:
- [ ] Kurulabilir (tek komutla çalışır)
- [ ] Test edilebilir (manual smoke test geçiyor)
- [ ] Demo olarak gösterilebilir
- [ ] Temel kullanıcı akışı çalışıyor
- [ ] Admin temel kontrolü yapabiliyor
- [ ] GitHub'da anlaşılır (README + kurulum adımları)

MVP'de olmayan şeyler kabul edilir — TODO listesine alınır, kod içine gömülmez.

---

## Aşama 5 — Geliştirme ve Ölçekleme

MVP sonrası incelenecekler:
- Kullanıcı geri bildirimleri (hangisi en çok istiyor?)
- Performans metrikleri (nerede yavaş?)
- Hata logları (en sık nerede hata?)
- Özellik kullanım oranları (ne kullanılıyor, ne kullanılmıyor?)
- Maliyetler (AI, sunucu, depolama)
- Güvenlik bulguları

Her iterasyon bu verilere göre önceliklendirilir.

---

## Hızlı Kontrol Listesi (Her Projede)

```
[ ] Kullanıcı bu ürünü NEDEN kullanır?
[ ] Yönetici bu sistemi NASIL kontrol eder?
[ ] Sistem HIZLI ve ölçeklenebilir biçimde NASIL çalışır?
[ ] PARAVERSE / AI CORE ekosistemine NASIL bağlanacak?
[ ] İLK çalışan versiyon 1 sprint içinde hazır mı?
```

---

## Proje Büyüklüğüne Göre Süre Hedefi

| Büyüklük | Tanım | MVP Hedefi |
|----------|-------|-----------|
| Micro | Tek özellik, tek ekran | 1 gün |
| Small | 3-5 ekran, basit backend | 1 hafta |
| Medium | 10-20 ekran, admin paneli | 2-4 hafta |
| Large | 20+ ekran, karmaşık iş mantığı | 2-3 ay |
| Platform | Ekosistem ürünü | Sürekli iterasyon |
