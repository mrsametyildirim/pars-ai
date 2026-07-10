# PARS Obsidian Haritası — Bilge Vault

## Vault Bilgileri
- **Yol:** `C:\PARS\bilge-vault\`
- **Format:** Obsidian uyumlu Markdown
- **Link Stili:** Wikilink `[[Dosya Adı]]`
- **Sync:** Manuel (otomatik sync yok, sadece değişiklik olduğunda)

---

## Dizin Yapısı

```
bilge-vault/
├── 00-index/              ← Ana indeks ve meta dosyalar
│   ├── 00-index.md        → Vault ana indeksi
│   ├── 01-user-profile.md → Kullanıcı profili ve tercihleri
│   ├── 02-project-map.md  → Tüm projelerin haritası
│   ├── 03-decisions.md    → Kritik kararlar günlüğü
│   ├── 04-lessons.md      → Öğrenilen dersler
│   ├── 05-standards.md    → Aktif standartlar
│   ├── 06-tools-and-repos.md → Araçlar ve repolar
│   ├── 07-skill-map.md    → Skill haritası
│   ├── 08-agent-map.md    → Agent haritası
│   ├── 09-mcp-map.md      → MCP haritası
│   └── Kaynak-Kutuphanesi.md → Repo envanteri
│
├── 10-projects/           ← Proje bazlı notlar
│   ├── ARES.md
│   ├── XR.md
│   ├── MEDIA.md
│   ├── SECURITY.md
│   └── KNOWLEDGE.md
│
├── 20-resources/          ← Kaynak ve referanslar
│   └── repos/             → Repo özetleri
│
└── 30-systems/            ← Sistem mimarisi notları
    └── Boru-Voice-Interface.md
```

---

## Bilge Okuma Kuralları

**Ne zaman okunur:**
- Kullanıcı geçmiş proje kararı soruyor
- Proje değişikliği yapılmadan önce bağlam gerekiyor
- "Hatırlıyor musun / daha önce ne yapmıştık" sorusu

**Ne zaman okunmaz:**
- Her görev başında otomatik olarak
- İçerik zaten context'te varsa
- Rutin kod/tasarım görevlerinde

---

## Bilge Yazma Kuralları

**Ne yazılır:**
- Kritik kararlar ve gerekçeleri
- Mimari değişiklikler
- Kullanıcı tercih güncellemeleri
- Öğrenilen dersler (tekrar karşılaşılabilecek)
- Proje durum değişiklikleri

**Ne yazılmaz:**
- Rutin işlemler
- Geçici notlar
- Her görev logu

---

## Wikilink Kullanım Örnekleri

```markdown
[[02-project-map]] → Proje haritasına link
[[ARES]] → ARES proje notuna link
[[03-decisions#Mimari-Karar-2026]] → Belirli karara link
[[01-user-profile]] → Kullanıcı profiline link
```

---

## Obsidian Özellik Kullanımı
- Tags: `#karar`, `#ders`, `#standart`, `#proje`, `#risk`
- Properties (frontmatter): tarih, proje, seviye, durum
- Backlinks: Otomatik bağlantı grafiği
- Graph view: Proje ilişkilerini görselleştirir
