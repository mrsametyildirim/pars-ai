# PARS Routing Kılavuzu — Börü Karar Matrisi

## Görev Sınıflandırma

Börü her talebi şu kategorilerden birine atar:

| Kategori | Anahtar Kelimeler | Varsayılan Ekip |
|----------|------------------|----------------|
| Kod | yaz, düzelt, refactor, bug, API, endpoint | İlgili CEO + backend/frontend-agent |
| Tasarım | UI, dashboard, görünüm, renk, layout | CEO + frontend-agent + design-reviewer |
| Ürün | roadmap, özellik, kullanıcı, karar | İlgili CEO + product-agent |
| Araştırma | karşılaştır, bul, analiz, benchmark | Kaşif |
| Güvenlik | güvenlik, risk, audit, OWASP, açık | Kalkan + ilgili CEO |
| Medya | video, reel, içerik, sosyal medya, kapak | CEO-MEDIA |
| Dokümantasyon | yaz, belgele, README, spec | documentation-agent |
| Otomasyon | script, cron, pipeline, CI/CD | İlgili CEO + backend-agent |

---

## Risk Seviyesi ve Aksiyon

| Risk | Kriter | Aksiyon |
|------|--------|---------|
| Düşük | Mevcut dosyada küçük değişiklik | Direkt uygula |
| Orta | Birden fazla dosya etkisi, yeni bileşen | Kısa plan sun, uygula |
| Yüksek | Mimari değişiklik, DB şeması, auth | Kalkan kontrolü + CEO onayı |
| Kritik | Yeni proje, güvenlik ihlali, pivot | Yuva toplantısı |

---

## CEO Yönlendirme

```
Talep geldi
    ↓
Proje bağlamı var mı?
    ├── ARES → CEO-ARES
    ├── XR → CEO-XR
    ├── MEDIA → CEO-MEDIA
    ├── SECURITY → CEO-SECURITY
    ├── KNOWLEDGE → CEO-KNOWLEDGE
    └── Belirsiz → Börü sınıflandırır, en uygun CEO seçer
```

---

## Yuva'nın Açılma Koşulları

Yuva SADECE şu durumlarda açılır:
1. Tamamen yeni bir proje başlatma kararı
2. Mevcut projenin mimarisini kökten değiştirme
3. Yüksek veya Kritik güvenlik riski tespiti
4. İki CEO arasında çatışan karar
5. Kullanıcı açıkça "stratejik değerlendirme" ister

Yuva açılmaz:
- Basit kod değişiklikleri
- Tek dosyalık güncellemeler
- Rutin araştırmalar
- Standart UI güncellemeleri

---

## Bilge'nin Okunma Koşulları

Bilge okunur:
- Proje geçmişine dair spesifik soru geldiğinde
- Önceki bir kararın bağlamı gerektiğinde
- Kullanıcı "hatırlıyor musun" veya benzer bir ifade kullandığında

Bilge okunmaz:
- Her görev başında otomatik olarak
- İçeriği zaten context'te olan konularda
- Rutin kod/tasarım görevlerinde

---

## Kaşif'in Çağrılma Koşulları

Çağrılır:
- Gerçekten bilinmeyen bir repo/araç/teknoloji araştırılacaksa
- Benchmark veya karşılaştırma gerekiyorsa
- Yeni bir MCP veya skill değerlendirmesi yapılacaksa

Çağrılmaz:
- Bilinen bir konuda "araştırma" görünümü vermek için
- Claude'un zaten bildiği bilgileri toplamak için
- Her yeni görevde otomatik olarak
