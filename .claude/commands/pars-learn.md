---
name: pars-learn
description: Öğrenilen dersi Bilge'ye ve Töre'ye kaydet. Kullanıcı düzeltmesi veya önemli ders tespitinde çağrılır.
---

# PARS Learn

## Kullanım
`/pars-learn [ne öğrenildi]`

## Çalıştığında

1. Dersi al
2. Kategori belirle: kod / tasarım / güvenlik / süreç / araç
3. Bilge'ye yaz: `bilge-vault/00-index/04-lessons.md`
4. Töre'ye bildir (kural haline getirilmeli mi?)
5. İlgili `.claude/rules/` dosyasını güncelle (gerekiyorsa)

## Ders Formatı

```markdown
## [Ders Başlığı] — [Tarih]
**Kategori:** [kategori]
**Ne oldu:** [kısaca]
**Öğrenilen:** [somut kural veya davranış]
**Tekrar karşılaşılırsa:** [aksiyon]
```

## Çıktı

```
DERS KAYDEDİLDİ
Kategori: [kategori]
Kural güncellendi: [evet/hayır — hangi dosya]
Bilge'ye yazıldı: ✓
```
