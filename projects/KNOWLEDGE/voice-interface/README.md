# PARS Sesli Arayüz (Börü Voice)

## Genel Bakış
Börü'ya doğal dil sesli komut iletimi. STT → Börü → TTS pipeline'ı.

## Bileşenler
| Katman | Araç | Durum |
|--------|------|-------|
| STT (konuşma → metin) | faster-whisper | Repo klonlandı / pip kurulumu bekliyor |
| Orkestrasyon | OpenJarvis | Repo klonlandı |
| TTS (metin → ses) | kokoro | Repo klonlandı / pip kurulumu bekliyor |
| Router | Börü (Claude) | Aktif |

## Dosya Yapısı
```
voice-interface/
├── README.md            ← bu dosya
├── architecture.md      ← pipeline mimari detay
├── faster-whisper.md    ← STT kurulum ve kullanım
├── kokoro.md            ← TTS kurulum ve kullanım
├── openjarvis.md        ← orkestrasyon kurulum
├── command-routing.md   ← sesli komut → Börü yönlendirme
└── experiments.md       ← deney notları
```

## Hızlı Başlangıç (Kurulum Sonrası)
```bash
# STT
pip install faster-whisper

# TTS
pip install kokoro

# OpenJarvis
cd C:\Users\MSI-NB\.claude\claude-kaynak\repos\OpenJarvis
pip install -r requirements.txt
```

## Mevcut Durum
Kaynak repolar hazır. Aktif implementasyon backlog'da.
