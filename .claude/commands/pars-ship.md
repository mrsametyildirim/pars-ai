---
name: pars-ship
description: Production release hazırlığı. Release agent + Kalkan güvenlik denetimi + test doğrulama + deployment checklist.
---

# PARS Ship

## Kullanım
`/pars-ship [proje/özellik]`

## Çalıştığında

### Aşama 1: Kalkan Denetimi
- Secret taraması
- OWASP kontrolü
- MCP izin doğrulama

### Aşama 2: Test Doğrulama
- Unit test sonuçları
- E2E smoke test
- Responsive kontrol
- Playwright görsel test

### Aşama 3: Kalite Kontrolü
- Kod review durumu
- Tasarım review durumu
- Console.log temizliği
- Dead code temizliği

### Aşama 4: Deployment
- Release notları hazırla
- Deployment planı onayla
- Deploy

## Checklist Çıktısı

```
[PARS SHIP CHECKLIST]
Proje: [proje]
Versiyon: [versiyon]

GÜVENLİK
[✓] Secret taraması: TEMİZ
[✓] OWASP kontrolü: GEÇTİ
[ ] MCP izinleri: ...

TEST
[✓] Unit testler: [sayı] geçti
[✓] E2E smoke: GEÇTİ
[✓] Responsive: Mobil/Tablet/Masaüstü

KALİTE
[✓] Kod review: TAMAMLANDI
[✓] Tasarım review: TAMAMLANDI
[✓] Console.log: YOK

KARAR: DEPLOY / BLOKE
```
