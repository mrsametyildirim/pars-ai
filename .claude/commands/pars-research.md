---
name: pars-research
description: Gerçek araştırma görevi. Kaşif'i aktive eder. Sadece gerçekten bilinmeyen konular için — bilinen bilgiyi araştırma olarak sunmaz.
---

# PARS Research

## Kullanım
`/pars-research [konu]`

## Önce Kontrol

Araştırmadan önce:
1. Claude zaten biliyor mu? → Direkt yanıtla
2. Bilge'de var mı? → Oradan al
3. PARS docs'ta var mı? → Oradan al
4. Gerçekten bilinmiyor → Kaşif çalıştır

## Araştırma Kaynakları (Sırayla)

1. `bilge-vault/` → önceden öğrenilmiş mi?
2. `docs/PARS_RESOURCE_LIBRARY.md` → repo var mı?
3. İlgili repo klasörü → C:\Users\MSI-NB\.claude\claude-kaynak\repos\
4. context7 → kütüphane dokümantasyonu
5. WebSearch → dış kaynak (son çare)

## Çıktı Formatı

```
ARAŞTIRMA SONUCU: [konu]
Kaynak: [nereden bulundu]

Bulgular:
• [önemli nokta 1]
• [önemli nokta 2]
• [önemli nokta 3]

PARS İçin Öneri: [aksiyon]
```

Maksimum 1 sayfa. Kısa. Aksiyon odaklı.
