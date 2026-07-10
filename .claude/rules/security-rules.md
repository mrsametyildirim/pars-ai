# PARS Güvenlik Kuralları

## Mutlak Yasaklar
- Secret/API key/token koda gömülemez. Asla. İstisna yok.
- SQL string birleştirme ile oluşturulamaz. Parametreli sorgu.
- Kullanıcı girdisi doğrulanmadan kullanılamaz.
- CORS politikası `*` bırakılamaz.
- HTTP → HTTPS yönlendirme zorunlu (production).

## Secret Yönetimi
- `.env` dosyası (.gitignore'da olmalı)
- Environment variable
- Üretim için secret manager
- Secret log'a, response'a, context'e giremez

## Her Production Değişikliğinde
- Kalkan kontrolü zorunlu
- Secret taraması zorunlu
- OWASP kontrol listesi

## Agentic AI Güvenliği
- Prompt injection riski değerlendirilmeli
- Tool sınırları korunmalı
- Agent kendi yetkisini genişletemez
- Harici içerik sandbox'ta işlenmeli

## Güvenlik Araçları

| Görev | Araç |
|-------|------|
| OWASP denetimi | `05-owasp-security` skill |
| Kod güvenlik taraması | `security-audit` skill |
| PARS geneli tarama | `pars-security-audit` skill |
| AI/prompt güvenliği | `ai-security` skill |
| Cloud güvenliği | `cloud-security` skill |
| Commit geçmişi tarama | `git` MCP |
| Derin analiz | `kalkan-security-agent` veya `ceo-security` |

## Risk Eşiği
- Yüksek risk → insan onayı şart
- Kritik risk → her şeyi durdur, Yuva'ya sor
