# PARS Hafıza Sistemi

## L1 / L2 / L3 Katmanları

### L1 — Anlık Bağlam
- **Ne:** Aktif context window içeriği
- **Süre:** Görev süresi boyunca
- **Kullanım:** Dosya içerikleri, kod, kullanıcı mesajı, araç sonuçları
- **Özellik:** En hızlı, otomatik, sıfır maliyetli
- **Temizlik:** Görev bitince kaybolur — önemli olan L2/L3'e taşınır

### L2 — Çalışma Hafızası
- **Ne:** Aktif proje notları, kararlar, todo listesi
- **Konum:** `C:\PARS\projects\<PROJE>\MEMORY.md` ve `tasks/todo.md`
- **Süre:** Sprint/hafta bazlı
- **Güncellenme:** Görev sonunda sadece kalıcı değer taşıyanlar eklenir
- **Okuma:** Proje değişimlerinde veya "bu projede ne yapmıştık" sorgusunda

### L3 — Uzun Dönem Hafıza (Bilge)
- **Ne:** Kalıcı kararlar, öğrenilen dersler, kullanıcı profili, standartlar
- **Konum:** `C:\PARS\bilge-vault\`
- **Süre:** Kalıcı
- **Güncellenme:** Yalnızca gerçekten kalıcı değer taşıyan bilgi eklenir
- **Okuma:** Read-on-demand — her görevde otomatik okunmaz

---

## Her Görev Sonunda Kaydedilenler

### Kaydedilir (L2/L3):
- Kritik mimari kararlar ve gerekçeleri
- Kullanıcı tercih ve düzeltmeleri (Töre için)
- Proje odak değişiklikleri
- Yeni keşfedilen araçlar veya pattern'lar
- Hata ve çözüm eşleşmeleri (aynı hata tekrarlanmasın)

### Kaydedilmez:
- Rutin kod değişiklikleri
- Tek seferlik araştırma sonuçları
- Geçici debuglama notları
- Başarısız denemeler (önemli bir ders yoksa)
- Her görevin detaylı log'u

---

## Bilge Yazma Formatı

```markdown
## [Başlık] — [Tarih]
**Bağlam:** Ne yapılıyordu?
**Karar:** Ne kararlaştırıldı?
**Gerekçe:** Neden?
**Sonuç:** Beklenen/gerçekleşen
**Ders:** Tekrar karşılaşıldığında ne yapılacak?
```

---

## Töre Öğrenme Protokolü

1. Kullanıcı bir şeyi düzeltirse → L1'de not al
2. Aynı düzeltme 2 kez gelirse → L2'ye yaz
3. Aynı düzeltme 3 kez gelirse → .claude/rules/ dosyasına ekle (Töre)
4. Kural eklendikten sonra → Bilge'de "öğrenilen ders" olarak işaretle

---

## Hafıza Okuma Önceliği

```
1. L1 (context) → varsa direkt kullan
2. L2 (MEMORY.md) → proje bağlamı sorusu varsa
3. L3 (bilge-vault) → tarihsel karar veya derin bağlam gerekiyorsa
```

Yukarıdan aşağıya git. Üst katmanda bulunca dur, daha derine inme.
