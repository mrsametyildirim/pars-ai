---
name: code-review
description: Çok dilli, kapsamlı kod incelemesi. 4 faz: bağlam → üst seviye → satır satır → özet. Severity: blocking/important/nit/suggestion/learning/praise.
---

# Code Review Skill

## Desteklenen Diller
JavaScript, TypeScript, Python, HTML/CSS, SQL, Bash/PowerShell, JSON/YAML

---

## 4 Fazlı İnceleme

### Faz 1: Bağlam
- Dosyanın amacı nedir?
- Değişiklik kapsamı nedir?
- Proje bağlamıyla uyumlu mu?
- Bağımlılıklar neler?

### Faz 2: Üst Seviye
- Mimari: proje yapısına uyuyor mu?
- Sorumluluk ayrımı: tek sorumluluk ilkesi?
- Modülerlik: yeniden kullanılabilir mi?
- Pattern tutarlılığı: mevcut kodla uyumlu mu?

### Faz 3: Satır Satır
Şunları ara:
- Magic number/string (sabit tanımlanmamış değer)
- Dead code (kullanılmayan)
- Gereksiz abstraction
- İsimlendirme ihlali (camelCase/kebab-case)
- Hata yönetimi eksikliği
- Güvenlik açıkları (SQL injection, XSS, secret)
- Performance sorunları
- Yorum satırları (temizle)

### Faz 4: Özet
- Blocking bulgular önce
- Toplam bulgu sayısı
- Aksiyon listesi

---

## Severity Seviyeleri

| Seviye | Anlamı | Aksiyon |
|--------|--------|---------|
| **blocking** | Merge etme | Hemen düzelt |
| **important** | Önemli sorun | Bu PR'da düzelt |
| **nit** | Küçük iyileştirme | İsteğe bağlı |
| **suggestion** | Öneri | Gelecek sprint |
| **learning** | Bilgi paylaşımı | — |
| **praise** | İyi yapılmış | — |

---

## Çıktı Formatı

```
KOD İNCELEME RAPORU
Dosya: [dosya yolu]
Dil: [dil]
Değişiklik: [ne değişti]

ÖZET
Blocking: [sayı] | Important: [sayı] | Nit: [sayı]

BULGULAR
[blocking] satır 42: SQL sorgusunda string birleştirme var. Parametreli sorgu kullan.
  ✗ query = "SELECT * FROM users WHERE id = " + userId
  ✓ query = "SELECT * FROM users WHERE id = $1", [userId]

[important] satır 67: API key log'a basılıyor.
  ✗ console.log("API Key:", apiKey)
  ✓ console.log("API Key: [REDACTED]")

[nit] satır 15: Değişken adı 'x' anlamsız. 'riskScore' olmalı.

[praise] satır 90-110: Error handling kapsamlı ve tutarlı.

AKSİYON LİSTESİ
1. [ ] SQL injection riskini gider
2. [ ] API key log'dan kaldır
3. [ ] Değişken yeniden adlandır (isteğe bağlı)
```

---

## Güvenlik Özel Kontrol
Her incelemede:
- Secret/credential koda gömülü mü?
- Kullanıcı girdisi doğrulanıyor mu?
- Auth bypass riski var mı?
- XSS koruması var mı?
