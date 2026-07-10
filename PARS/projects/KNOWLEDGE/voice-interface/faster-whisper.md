# faster-whisper — STT Kurulum ve Kullanım

## Kaynak
Repo: `C:\Users\MSI-NB\.claude\claude-kaynak\repos\faster-whisper\`
Orijinal: github.com/SYSTRAN/faster-whisper

## Kurulum
```bash
pip install faster-whisper
# GPU varsa:
pip install faster-whisper[cuda]
```

## Temel Kullanım
```python
from faster_whisper import WhisperModel

model = WhisperModel("base", device="cpu", compute_type="int8")
segments, info = model.transcribe("audio.wav", language="tr")

for segment in segments:
    print(segment.text)
```

## Model Seçimi
| Model | Boyut | Hız | Doğruluk |
|-------|-------|-----|---------|
| tiny | 39M | ++ | + |
| base | 74M | + | ++ |
| small | 244M | ~ | +++ |

PARS için önerilen: `base` (hız/doğruluk dengesi).

## Durum
Repo mevcut. `pip install` bekliyor.
