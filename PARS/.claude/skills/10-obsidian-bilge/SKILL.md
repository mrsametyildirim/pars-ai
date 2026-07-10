---
name: obsidian-bilge
description: Bilge vault okuma/yazma, Obsidian sync, bilgi grafı güncellemesi. Read-on-demand prensiple çalışır. Vault: C:\PARS\bilge-vault\
---

# Obsidian Bilge Skill

## Vault Yolu
`C:\PARS\bilge-vault\`

## Temel Prensip
**Read-on-demand.** Bilge her göreve yüklenmez. Sadece gerektiğinde okunur.

---

## Okuma Protokolü

### Ne Zaman Oku
- Kullanıcı geçmiş karar soruyor → `00-index/03-decisions.md`
- Proje bağlamı gerekiyor → `10-projects/<PROJE>.md`
- Kullanıcı profili gerekiyor → `00-index/01-user-profile.md`
- Öğrenilen ders aranıyor → `00-index/04-lessons.md`
- Araç/repo bilgisi → `00-index/06-tools-and-repos.md`

### Okuma Adımları
1. İlgili dosyayı belirle (yukarıdan)
2. Sadece o dosyayı oku
3. Gerekli bilgiyi çıkar
4. Vault'u kapat (gereksiz dosya okuma)

---

## Yazma Protokolü

### Ne Zaman Yaz
- Kritik mimari karar alındı
- Önemli ders öğrenildi
- Kullanıcı tercihi değişti
- Yeni proje başladı veya kapandı

### Ne Zaman Yazma
- Rutin işlemler
- Geçici notlar
- Her görev logu
- Zaten yazılmış bilgi

---

## Dosya Şablonları

### Karar Yazma (03-decisions.md)
```markdown
## [Karar Başlığı] — [YYYY-MM-DD]
**Bağlam:** [neden bu karar gerekiyordu]
**Seçenekler:** [A vs B vs C]
**Karar:** [seçilen]
**Gerekçe:** [neden]
**Sonuç:** [beklenen / sonradan güncellenecek]
#karar #[proje]
```

### Ders Yazma (04-lessons.md)
```markdown
## [Ders Başlığı] — [YYYY-MM-DD]
**Ne oldu:** [kısa açıklama]
**Sorun:** [ne yanlış gitti]
**Öğrenilen:** [ne yapılmalıydı]
**Tekrar karşılaşılırsa:** [aksiyon]
#ders #[kategori]
```

### Proje Güncelleme (10-projects/<PROJE>.md)
```markdown
## Durum Güncellemesi — [YYYY-MM-DD]
**Durum:** Aktif / Durduruldu / Tamamlandı
**Son:** [ne yapıldı]
**Sonraki:** [ne yapılacak]
**Notlar:** [önemli bağlam]
```

---

## Wikilink Kullanımı
```markdown
[[03-decisions]]           → Kararlar dosyasına link
[[ARES]]                   → ARES proje notuna link
[[01-user-profile]]        → Kullanıcı profiline link
[[04-lessons#ders-adı]]    → Belirli derse link
```

---

## MCP Bağlantısı
Bu skill `obsidian-mcp` üzerinden çalışır:
- **Vault URL:** `https://127.0.0.1:27124/mcp/`
- **Günlük notlar:** `börü-öğrenim/günlük/YYYY-MM-DD.md`
- **Katalog:** `börü-öğrenim/katalog/`
- **Rankings:** `börü-öğrenim/kullanim/rankings.md`

## Obsidian Tags
```
#karar     → Kritik kararlar
#ders      → Öğrenilen dersler
#standart  → Aktif standartlar
#proje     → Proje notu
#risk      → Risk notu
#araç      → Araç/repo notu
```
