# Sesli Arayüz Mimarisi

## Pipeline

```
Mikrofon
   │
   ▼
faster-whisper (STT)
   │  "ARES risk haritasını göster"
   ▼
OpenJarvis (orkestrasyon)
   │  intent parsing + routing
   ▼
Börü (Claude Code CLI)
   │  görev yürütme
   ▼
Claude yanıtı (metin)
   │
   ▼
kokoro (TTS)
   │  ses sentezi
   ▼
Hoparlör
```

## Gecikme Hedefi
- STT: < 500ms (Whisper tiny/base model)
- Börü işlem: değişken (görev karmaşıklığına bağlı)
- TTS: < 300ms

## Mod
- **Demo mod:** Ses komutu → sabit demo yanıtı
- **Production mod:** Ses komutu → gerçek Claude yürütme

## Kısıtlar
- Offline STT tercih edilir (gizlilik)
- TTS dil: Türkçe öncelikli
- Gürültü filtresi gerekli (açık ofis ortamı)
