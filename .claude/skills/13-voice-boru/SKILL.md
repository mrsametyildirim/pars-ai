---
name: voice-boru
description: Börü ses sistemi. faster-whisper (STT) → Börü → kokoro (TTS). Türkçe sesli komut arayüzü. Durum: STANDBY — mimari hazır, implementasyon bekliyor.
---

# Voice Börü Skill

## Durum
**STANDBY** — Mimari tasarlandı. CEO-KNOWLEDGE liderliğinde hayata geçirilecek.

---

## Sistem Bileşenleri

### faster-whisper (STT)
```
Repo: C:\Users\MSI-NB\.claude\claude-kaynak\repos\faster-whisper
Görev: Ses → Metin
Dil: Türkçe (language="tr")
Model: large-v3
Hız: Standart Whisper'dan 4x hızlı
```

### kokoro (TTS)
```
Repo: C:\Users\MSI-NB\.claude\claude-kaynak\repos\kokoro
Görev: Metin → Ses
Ses: Profesyonel Türkçe
Gecikme: Düşük (gerçek zamanlı)
```

### OpenJarvis (Pipeline)
```
Repo: C:\Users\MSI-NB\.claude\claude-kaynak\repos\OpenJarvis
Görev: Pipeline orkestrasyonu
Wake word: "Hey Börü"
```

---

## Pipeline Akışı

```
"Hey Börü" → Wake word algılandı
    ↓
Kayıt başla (max 30 saniye)
    ↓
Sessizlik algılandı (2 saniye) veya komut tamamlandı
    ↓
faster-whisper → Türkçe metin
    ↓
Metin → Börü orchestrator
    ↓
Börü yanıt oluştur (≤150 kelime, sesli uyumlu)
    ↓
kokoro → Ses dosyası (WAV)
    ↓
Ses çal → Kullanıcı duyar
    ↓
Yeni komut bekleniyor
```

---

## Yanıt Yazma Kuralları (Sesli Mod)

Sesli yanıtlar için özel kurallar:
- Maksimum 150 kelime
- Madde işareti, tablo, kod kullanma
- Sayılar harf olarak: "yüz" değil "100"
- Net ve doğal akış
- Teknik jargon minimize

---

## Komut Örnekleri

```
"Hey Börü, ARES projesinde bugün ne var?"
"Hey Börü, yeni bir XR task oluştur."
"Hey Börü, güvenlik raporu hazırla."
"Hey Börü, Bilge'de en son kararı bul."
"Hey Börü, kod review başlat."
```

---

## Kurulum Adımları (STANDBY)

```bash
# 1. Python ortamı
python -m venv venv-voice
venv-voice\Scripts\activate

# 2. faster-whisper
pip install faster-whisper
# Model indir (ilk çalıştırmada otomatik)

# 3. kokoro
pip install kokoro
# Türkçe ses modeli indir

# 4. OpenJarvis
cd C:\Users\MSI-NB\.claude\claude-kaynak\repos\OpenJarvis
pip install -r requirements.txt

# 5. PARS entegrasyonu
# Wake word: "Hey Börü"
# Claude Code API bağlantısı
```

---

## Ses Kalitesi Hedefleri
- STT doğruluk: %95+ Türkçe için
- TTS gecikme: <500ms
- End-to-end gecikme: <2 saniye
