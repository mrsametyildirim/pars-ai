# PARS Hafıza Kuralları

## Temel Prensip
Read-on-demand. Her göreve Bilge yüklenmez.

## Ne Zaman Bilge Okunur
- Kullanıcı geçmiş kararı soruyor
- Proje bağlamı belirsiz ve kritik
- "Hatırlıyor musun" sorusu
- Yeni proje başlamadan önce

## Ne Zaman Bilge Yazılır
- Kritik mimari karar
- Kullanıcı tercihi değişimi
- Önemli ders (tekrar karşılaşılabilir)
- Proje durum değişikliği

## Ne Yazılmaz
- Rutin görevler
- Geçici debug notları
- Her görev logu
- Bilinen bilgiler

## Hafıza Sırası
1. Context (L1) → önce bura bak
2. projects/<PROJE>/MEMORY.md (L2) → proje bağlamı
3. bilge-vault/ (L3) → tarihsel, kalıcı

## Araçlar

| Araç | Amaç |
|------|------|
| `obsidian-mcp` | L3 hafıza — kalıcı Obsidian vault |
| `pars-learn` skill | Öğrenim ve kural kaydetme |
| `filesystem` MCP | L2 hafıza — MEMORY.md, proje dosyaları |
| `bilge-memory-agent` | Tüm L3 hafıza operasyonları |

## Töre Öğrenme Protokolü
- 1. düzeltme → not al
- 2. düzeltme → MEMORY.md'ye yaz
- 3. düzeltme → .claude/rules/ dosyasına ekle
