# PARS Repo Entegrasyon Planı

Her repo için amaç, PARS rolü, kullanan ekip ve durum.

---

## faster-whisper
- **Amaç:** OpenAI Whisper modelini CTranslate2 ile hızlandıran STT kütüphanesi
- **PARS Rolü:** Börü Voice'ın konuşma girdi katmanı
- **Kullanan:** CEO-KNOWLEDGE, boru-voice-agent
- **Durum:** ACTIVE — implementasyon STANDBY
- **Aksiyon:** `projects/KNOWLEDGE/voice-interface/faster-whisper.md` ile dokümante edildi

## kokoro
- **Amaç:** Hızlı, doğal sesli TTS motoru
- **PARS Rolü:** Börü Voice'ın ses çıktı katmanı
- **Kullanan:** CEO-KNOWLEDGE, boru-voice-agent
- **Durum:** ACTIVE — implementasyon STANDBY
- **Aksiyon:** `projects/KNOWLEDGE/voice-interface/kokoro.md` ile dokümante edildi

## OpenJarvis
- **Amaç:** Jarvis benzeri AI asistan orkestrasyonu
- **PARS Rolü:** STT → Börü → TTS pipeline yöneticisi
- **Kullanan:** boru-voice-agent
- **Durum:** ACTIVE — implementasyon STANDBY
- **Aksiyon:** Wake word "Hey Börü" olarak yapılandırılacak

## gstack
- **Amaç:** Claude Code workflow best practices koleksiyonu
- **PARS Rolü:** Börü çalışma protokolü, Töre standart güncelleme referansı
- **Kullanan:** Börü, Töre
- **Durum:** ACTIVE — okundu, kurallar Töre'ye entegre edildi

## ECC (Elite Claude Code)
- **Amaç:** İleri seviye Claude Code kullanım pattern'ları
- **PARS Rolü:** Töre öğrenme kaynağı, Kaşif benchmark referansı
- **Kullanan:** Töre, Kaşif
- **Durum:** ACTIVE — periyodik okunur

## skills (anthropics)
- **Amaç:** 400+ hazır Claude Code skill kataloğu
- **PARS Rolü:** PARS skill'lerinin kaynak kütüphanesi
- **Kullanan:** Tüm PARS
- **Durum:** ACTIVE — 13 PARS skill'i bu kaynaktan türetildi

## claude-code-toolkit
- **Amaç:** Claude Code için geliştirici araç seti
- **PARS Rolü:** Genel PARS altyapısı desteği
- **Kullanan:** Börü, tüm CEO'lar
- **Durum:** ACTIVE

## awesome-claude-code
- **Amaç:** Topluluk curated Claude Code kaynakları
- **PARS Rolü:** Börü + Töre best practice referansı
- **Kullanan:** Börü, Töre
- **Durum:** ACTIVE

## claude-code-best-practice
- **Amaç:** Claude Code kullanım standartları
- **PARS Rolü:** Töre kural güncelleme kaynağı
- **Kullanan:** Töre
- **Durum:** ACTIVE

## claude-code-subagents
- **Amaç:** Claude Code subagent pattern'ları
- **PARS Rolü:** PARS agent tasarım şablonları
- **Kullanan:** Börü (agent seçimi), yeni agent tasarımında
- **Durum:** ACTIVE

## awesome-claude-code-subagents
- **Amaç:** Community subagent koleksiyonu
- **PARS Rolü:** Yeni agent tasarımında referans
- **Kullanan:** Yuva (yeni agent kararında)
- **Durum:** STANDBY

## claude-mem
- **Amaç:** Claude memory pattern'ları
- **PARS Rolü:** Bilge mimarisi referansı
- **Kullanan:** Bilge
- **Durum:** STANDBY

## knowledge-work-plugins
- **Amaç:** 200+ domain specific skill
- **PARS Rolü:** Özel domain skill gerektiğinde kaynak
- **Kullanan:** Kaşif (keşif), Yuva (skill kararı)
- **Durum:** STANDBY

## claude-plugins-official
- **Amaç:** Anthropic resmi plugin kataloğu
- **PARS Rolü:** Yeni plugin entegrasyonu değerlendirmesi
- **Kullanan:** Kaşif
- **Durum:** STANDBY

## awesome-agent-skills
- **Amaç:** Agent skill pattern koleksiyonu
- **PARS Rolü:** Skill geliştirme referansı
- **Kullanan:** Kaşif, Töre
- **Durum:** STANDBY

## claude-code-security-review
- **Amaç:** Claude Code güvenlik review pattern'ları
- **PARS Rolü:** Kalkan derin güvenlik analizi referansı
- **Kullanan:** Kalkan
- **Durum:** STANDBY

## editor
- **Amaç:** Claude Code editor entegrasyon pattern'ları
- **PARS Rolü:** IDE entegrasyon çalışmalarında referans
- **Kullanan:** Kaşif
- **Durum:** STANDBY

## claude-skills
- **Amaç:** Ek skill referans koleksiyonu
- **PARS Rolü:** Skill boşluğu tespitinde
- **Kullanan:** Kaşif
- **Durum:** STANDBY
