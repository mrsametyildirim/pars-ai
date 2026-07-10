---
name: pars-start
description: PARS sistem healthcheck ve aktif proje bağlamını yükler. Günlük çalışma başlangıcı.
---

# PARS Start

## Çalıştığında

0. **Obsidian Günlük Kontrol**
   - `börü-öğrenim/günlük/` → dünün notu var mı?
   - Yoksa → ilk iş dünün özetini yaz
   - `kullanim/rankings.md` → en çok kullanılan araçlar

1. **Sistem kontrolü**
   - `.claude/agents/` agent sayısı
   - `.claude/skills/` skill sayısı
   - `.claude/rules/` kural dosyaları

2. **Aktif projeler**
   - `C:\PARS\projects\` → aktif proje listesi
   - Her projede `PROJECT.md` durum kontrolü

3. **Todo kontrolü**
   - `C:\PARS\tasks\todo.md` → bekleyen görevler

4. **Rapor formatı**

```
PARS HAZIR
───────────
Sistemler: Börü · Bilge · Töre · Kaşif · Kalkan
Agents: [sayı] | Skills: [sayı] | Rules: [sayı]

Aktif Projeler:
• ARES — [son durum]
• XR — [son durum]
• MEDIA — [son durum]
• SECURITY — [son durum]
• KNOWLEDGE — [son durum]

Bekleyen Görevler: [sayı]
Kritik: [varsa listele]

Ne yapıyoruz?
```
