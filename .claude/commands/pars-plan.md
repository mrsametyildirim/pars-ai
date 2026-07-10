---
name: pars-plan
description: Yeni görev veya sprint için plan oluştur. 01-planning skill'ini aktive eder, todo.md günceller.
---

# PARS Plan

## Kullanım
`/pars-plan [kısa görev açıklaması]`

## Çalıştığında

1. Talebi al ve sınıflandır
2. Görev büyüklüğü değerlendir:
   - Küçük (< 2 saat) → doğrudan todo'ya ekle
   - Orta (2-8 saat) → task breakdown yap
   - Büyük (> 8 saat) → sprint planı oluştur

3. 01-planning skill ile plan oluştur

4. `C:\PARS\tasks\todo.md` güncelle

5. Çıktı:
```
PLAN OLUŞTURULDU
Proje: [proje]
Görevler: [sayı]
Tahmini: [süre]
Öncelik: P[1/2/3]

Adımlar:
1. [ ] [görev]
2. [ ] [görev]

Başlayalım mı?
```
