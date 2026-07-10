# Kalite Standartları — PARS

## 10 Temel Kalite Koşulu

Her ürün tesliminde şu 5 koşul kontrol edilir:

```
✓ Güzel görünüyor mu?     — tasarım kalitesi
✓ Kolay kullanılıyor mu?  — UX kalitesi
✓ Hızlı çalışıyor mu?    — performans
✓ Yönetilebilir mi?       — admin panel
✓ Ölçülebilir mi?         — analitik
```

---

## Kod Kalitesi

### Dosya ve Modüler Yapı
- Bir dosya = bir sorumluluk
- Bileşen 200 satırı geçince → böl
- Ortak kullanılan kod → `shared/` veya `utils/`
- Her yeni proje için zorunlu dosyalar:
  ```
  README.md
  .env.example
  docs/ARCHITECTURE.md
  docs/API.md
  docs/SCHEMA.md
  docs/FEATURES.md
  docs/ROADMAP.md
  ```

### Test Gereksinimleri
- Kritik iş mantığı: birim test zorunlu
- Auth akışı: entegrasyon test zorunlu
- Ödeme akışı: tam test zorunlu
- UI: smoke test (Playwright) önerilir

### Güvenlik Kontrol Listesi
```
[ ] Şifreler bcrypt/argon2 ile hash'lendi mi?
[ ] JWT token süreleri doğru mu? (15dk access / 7gün refresh)
[ ] API anahtarları .env'de mi? (asla kodda değil)
[ ] RBAC uygulandı mı?
[ ] Input validation her endpoint'te var mı?
[ ] Rate limiting uygulandı mı?
[ ] CORS kısıtlı mı? (sadece izin verilen originler)
[ ] Dosya yükleme MIME + boyut kontrolü var mı?
[ ] Audit log kritik işlemlerde aktif mi?
[ ] Yedekleme planı var mı?
```

---

## Performans Kontrol Listesi

```
[ ] Gereksiz API çağrısı var mı? (önbellekleme)
[ ] N+1 sorgu var mı? (eager loading)
[ ] Büyük liste sayfalama kullanıyor mu?
[ ] Görseller optimize mi? (WebP + lazy load)
[ ] Uzun işlemler background'da mı?
[ ] Mobilde kaynak tüketimi ölçüldü mü?
```

---

## Yönetici Paneli Kontrol Listesi

```
[ ] Admin: tüm kullanıcıları görebiliyor mu?
[ ] Admin: içerik ekleyip silebiliyor mu?
[ ] Admin: analitik dashboard var mı?
[ ] Admin: hata loglarını görebiliyor mu?
[ ] Admin: bildirim gönderebiliyor mu?
[ ] Kritik işlemler audit log'a yazılıyor mu?
[ ] Teknik bilgisi az biri paneli kullanabilir mi?
```

---

## Teslim Öncesi Son Kontrol

```
[ ] Tasarım sistemi tutarlı mı? (renk, font, spacing)
[ ] Mobil görünüm test edildi mi?
[ ] Boş durum ekranları mevcut mu?
[ ] Hata ekranları mevcut mu?
[ ] README güncel mi?
[ ] .env.example güncel mi?
[ ] Kritik akışlar elle test edildi mi?
[ ] Güvenlik checklist tamamlandı mı?
```

---

## Öncelik Sıralaması Kararı

Özellik / hata sıralamasında bu matris kullanılır:

```
                   YÜKSEK ETKİ      DÜŞÜK ETKİ
HIZLI YAPILIR  │  ★★★ ÖNCELİK    │  ★★ PLANLA
YAVAŞ YAPILIR  │  ★★ PLANLA       │  ★ ERTELE
```

Hata çözümünde:
- Güvenlik açığı → anında
- Kullanıcıyı bloke eden hata → bugün
- İşlevsellik bozulumu → bu sprint
- Görsel sorun → sıradaki sprint
- İyileştirme → backlog
