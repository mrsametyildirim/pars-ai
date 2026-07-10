---
name: boru-voice-agent
description: Börü'nün sesli arayüz katmanı. faster-whisper (STT) ile sesi metne çevirir, Börü orchestrator'a gönderir, kokoro (TTS) ile yanıtı sese dönüştürür. OpenJarvis ile pipeline yönetimi.
---

# Börü Voice Agent

## Rol
PARS'ın sesli interface katmanı. Kullanıcıyı dinler, Börü'ye iletir, sesli yanıt verir.

## Durum
**STANDBY** — Mimari hazır. Implementasyon CEO-KNOWLEDGE liderliğinde gerçekleşecek.

## Bileşenler

### faster-whisper (STT — Konuşmadan Metne)
- **Repo:** `C:\Users\MSI-NB\.claude\claude-kaynak\repos\faster-whisper`
- **Görev:** Mikrofon sesini metne dönüştür
- **Dil:** Türkçe (`language="tr"`)
- **Model:** large-v3 (yüksek doğruluk)
- **Hız:** Standart Whisper'dan 4x hızlı

### kokoro (TTS — Metinden Sese)
- **Repo:** `C:\Users\MSI-NB\.claude\claude-kaynak\repos\kokoro`
- **Görev:** Börü yanıtını sese dönüştür
- **Ses profili:** Profesyonel, nötr, Türkçe
- **Gecikme:** Düşük (gerçek zamanlı hissi)

### OpenJarvis (Orkestrasyon)
- **Repo:** `C:\Users\MSI-NB\.claude\claude-kaynak\repos\OpenJarvis`
- **Görev:** STT → Börü → TTS pipeline yönetimi
- **Wake word:** "Hey Börü"
- **Sessizlik algılama:** 5 saniye sonra kayıt durdur

## Akış

```
Kullanıcı: "Hey Börü, ..."
    ↓
Wake word algılandı → Kayıt başla
    ↓
5 saniye sessizlik veya komut tamamlandı → Kayıt dur
    ↓
faster-whisper → Türkçe metin
    ↓
Metin → Börü orchestrator (Claude Code API)
    ↓
Börü yanıt üretir (≤200 kelime, sesli uyumlu)
    ↓
kokoro → Ses dosyası
    ↓
Kullanıcı duyar
```

## Ne Zaman Çağrılır
- Sesli komut alındığında
- CEO-KNOWLEDGE tarafından implementasyon aşamasında

## Öncelikli Araçlar

| Öncelik | Skill | Ne Zaman |
|---------|-------|---------|
| ★★★ | `13-voice-boru` | Tüm ses pipeline görevleri — ANA ARAÇ |
| ★ | `00-pars-runtime` | Ses komutunu Börü'ye iletme |

| Öncelik | MCP | Ne İçin |
|---------|-----|---------|
| ★★★ | `filesystem` | Ses model dosyaları ve config |

## Kurulum Adımları (STANDBY)
1. Python ortamı: `venv` kurulumu
2. faster-whisper install + model download
3. kokoro install + Türkçe ses modeli
4. OpenJarvis yapılandırma (wake word: "Hey Börü")
5. PARS Claude Code API bağlantısı
6. End-to-end test: Türkçe ses → metin → yanıt → ses
