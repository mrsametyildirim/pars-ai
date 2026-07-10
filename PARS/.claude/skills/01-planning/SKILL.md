---
name: planning
description: Sprint planlama, task breakdown, todo yönetimi, backlog ve decision-log. Karmaşık görevi yönetilebilir adımlara böler. Trigger: /pars-plan
---

# Planning Skill

## Kullanım
`/pars-plan` veya karmaşık görev planlamasında.

## Sprint Planlama Formatı

```markdown
## Sprint [No] — [Başlangıç] → [Bitiş]
**Proje:** [proje adı]
**Hedef:** [tek cümle]

### Görevler
- [ ] [P1] Yüksek öncelik görevi — [tahmini süre]
- [ ] [P2] Orta öncelik görevi — [tahmini süre]
- [ ] [P3] Düşük öncelik görevi — [tahmini süre]

### Bağımlılıklar
- [Görev A] → [Görev B]'den sonra

### Riskler
- [Risk] → [Azaltma yöntemi]
```

## Task Breakdown

Büyük görevi küçük adımlara böl:
1. Hedefi tek cümleyle tanımla
2. Alt görevleri listele (max 2 saatlik dilimler)
3. Bağımlılıkları işaretle
4. Önceliklendir: P1/P2/P3

## Todo Yönetimi

Aktif todo → `C:\PARS\tasks\todo.md`

```markdown
## Aktif Görevler
- [ ] [PROJE] Görev açıklaması @agent #tarih

## Tamamlananlar
- [x] [PROJE] Görev — [tarih]

## Backlog
- [ ] [PROJE] Gelecek görev
```

## Decision Log

Önemli kararlar → `C:\PARS\projects\<PROJE>\DECISIONS.md`

```markdown
## [Karar Başlığı] — [Tarih]
**Bağlam:** Neden bu karar gerekiyordu?
**Seçenekler:** A, B, C
**Karar:** [seçilen]
**Gerekçe:** Neden bu?
**Sonuç:** [henüz bilinmiyor / [tarih] güncellenir]
```

## Önceliklendirme Şablonu
- **P1 (Kritik):** Bugün yapılması şart
- **P2 (Önemli):** Bu sprint içinde
- **P3 (İstenen):** Zaman olursa
