# PARS Öncelik Yığını

En kritikten en aza doğru sıralı kaynak ve sistem öncelikleri.

---

## Tier 1 — Kritik Çekirdek (Her zaman aktif)

### 1. Börü Runtime (00-pars-runtime skill)
- PARS'ın kalbi. Bu olmadan hiçbir şey çalışmaz.
- Her görevde aktif: sınıflandırma, yönlendirme, değerlendirme.
- Dosya: `.claude/skills/00-pars-runtime/SKILL.md`

### 2. Bilge / Obsidian Hafıza
- Kurumsal bellek. Geçmişi tutar, geleceği besler.
- Read-on-demand ama kritik kararlar buraya yazılır.
- Vault: `C:\PARS\bilge-vault\`

---

## Tier 2 — Ses Sistemi (Yüksek öncelik, implementasyon bekliyor)

### 3. faster-whisper + kokoro + OpenJarvis
- Börü'yü gerçek bir AI asistana dönüştürecek sistem.
- STT + TTS + Orchestration üçlüsü birlikte çalışır.
- Repos: `C:\Users\MSI-NB\.claude\claude-kaynak\repos\`
- Durum: Mimari hazır, implementasyon sırası bekliyor.

---

## Tier 3 — Best Practices (Öğrenme kaynakları)

### 4. gstack + ECC
- Claude Code kullanım standartları.
- Töre bu repolardan kurallar türetir.
- Periyodik okunur; değişim olduğunda Töre güncellenir.

### 5. anthropics/skills
- 400+ hazır skill kataloğu.
- Yeni PARS skill'leri buradan ilham alır.
- Aktif kullanım: `.claude/skills/` dizini.

---

## Tier 4 — Geliştirici Araçları

### 6. claude-code-toolkit
- Günlük geliştirme araç seti.
- Börü ve tüm CEO'lar kullanır.
- Düşük öncelik: araçlar gerektiğinde çağrılır.

---

## Tier 5 — Referans (Gerektiğinde)

- claude-code-best-practice → Töre kural güncellemesi
- claude-code-subagents → Agent tasarımı
- claude-code-security-review → Kalkan derin analiz
- awesome-* serisi → Kaşif araştırması

---

## Öncelik Güncelleme Kuralı
Bu sıralama Yuva tarafından değiştirilebilir.
Yeni bir sistem Tier 1'e çıkabilmesi için:
- PARS'ın günlük işleyişine doğrudan katkısı olmalı
- Alternatifsiz veya en iyi alternatif olmalı
- Kalkan tarafından güvenli bulunmalı
