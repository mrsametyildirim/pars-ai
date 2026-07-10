# kokoro — TTS Kurulum ve Kullanım

## Kaynak
Repo: `C:\Users\MSI-NB\.claude\claude-kaynak\repos\kokoro\`

## Kurulum
```bash
pip install kokoro
# veya repo'dan:
cd C:\Users\MSI-NB\.claude\claude-kaynak\repos\kokoro
pip install -r requirements.txt
```

## Temel Kullanım
```python
from kokoro import KPipeline

pipeline = KPipeline(lang_code='tr')
audio, phonemes = pipeline("ARES sistemi hazır.", voice='af_bella')
audio.save('output.wav')
```

## Dil Desteği
- Türkçe: `lang_code='tr'`
- İngilizce: `lang_code='en-us'`

## PARS Entegrasyonu
Börü yanıtı → kokoro → ses çıkışı.
Demo modunda sabit ses klipleri kullanılabilir.

## Durum
Repo mevcut. `pip install` bekliyor.
