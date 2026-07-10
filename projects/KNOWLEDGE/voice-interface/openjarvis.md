# OpenJarvis — Ses Orkestrasyon

## Kaynak
Repo: `C:\Users\MSI-NB\.claude\claude-kaynak\repos\OpenJarvis\`

## Rol
faster-whisper STT çıktısını alır → intent parsing → Börü'ye yönlendirir → kokoro TTS ile yanıtlar.

## Kurulum
```bash
cd C:\Users\MSI-NB\.claude\claude-kaynak\repos\OpenJarvis
pip install -r requirements.txt
```

## PARS Uyarlama Notları
- Wake word: "Börü" veya "PARS"
- Default dil: Türkçe
- Backend: Claude Code CLI (stdio pipe)
- STT: faster-whisper (offline)
- TTS: kokoro

## Konfigürasyon
OpenJarvis yapılandırması `voice-interface/` altında tutulacak.
Claude entegrasyonu için `claude --output-format stream-json` pipe'ı kullanılır.

## Durum
Repo mevcut. Aktif implementasyon backlog'da.
