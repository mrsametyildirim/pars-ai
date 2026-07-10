# PARS Ses Arayüzü — Börü Voice System

## Vizyon
Börü'nün gerçek bir Jarvis gibi sesli komut alıp yanıt vermesi. Kullanıcı konuşur, Börü anlar, işler, sesli yanıt verir.

## Bileşenler

### faster-whisper — Konuşmadan Metne (STT)
- **Repo:** `C:\Users\MSI-NB\.claude\claude-kaynak\repos\faster-whisper`
- **Görev:** Mikrofon sesini metne çevirir
- **Model:** Whisper large-v3 (Türkçe desteği mevcut)
- **Özellik:** CTranslate2 tabanlı, standart Whisper'dan 4x hızlı
- **Çıktı:** Metin → Börü orchestrator'a gönderilir

### kokoro — Metinden Sese (TTS)
- **Repo:** `C:\Users\MSI-NB\.claude\claude-kaynak\repos\kokoro`
- **Görev:** Börü yanıtını sese çevirir
- **Özellik:** Düşük gecikme, doğal ses
- **Ses profili:** Profesyonel, nötr, Türkçe

### OpenJarvis — Orkestrasyon
- **Repo:** `C:\Users\MSI-NB\.claude\claude-kaynak\repos\OpenJarvis`
- **Görev:** STT → Börü → TTS akışını koordine eder
- **Özellik:** Wake word algılama, pipeline yönetimi

---

## Akış Diyagramı

```
Kullanıcı konuşur
    ↓
faster-whisper (STT)
    ↓
Metin → OpenJarvis pipeline
    ↓
Börü orchestrator (Claude Code)
    ↓
Yanıt metni → OpenJarvis
    ↓
kokoro (TTS)
    ↓
Ses çıktısı → Kullanıcı duyar
```

---

## Implementasyon Durumu

**Mevcut Durum:** STANDBY — Mimari tasarlandı, kurulum hazır, aktif implementasyon bekliyor.

**Gerekli Adımlar:**
1. faster-whisper Python ortamı kurulumu (`C:\PARS\projects\KNOWLEDGE\voice-interface\`)
2. kokoro model indirme ve yapılandırma
3. OpenJarvis wake word konfigürasyonu (önerilen: "Hey Börü")
4. PARS Claude Code entegrasyonu
5. Türkçe TTS ses kalitesi testi

---

## Komut Örnekleri (Planlanan)

```
"Hey Börü, ARES projesinde bugün ne var?"
"Hey Börü, yeni bir XR task oluştur."
"Hey Börü, güvenlik raporu hazırla."
"Hey Börü, Bilge'de en son kararı bul."
```

---

## Teknik Notlar

- Türkçe ASR için faster-whisper `language="tr"` parametresi
- Düşük gecikme için yerel model kullanımı (bulut API değil)
- Wake word sonrası 5 saniyelik kayıt penceresi
- Sessizlik algılandığında kayıt otomatik sonlandırılır
- Börü yanıtı 200 kelimeyi geçmemeye çalışır (TTS için)

---

## CEO Sorumluluğu
CEO-KNOWLEDGE bu sistemin geliştirilmesinden sorumludur.
Ses sistemi Bilge ile entegre çalışacak — Bilge vault'undan bilgi çekip sesli sunabilecek.
