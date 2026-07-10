---
name: n8n-automation
description: n8n benzeri otomasyon platformu, workflow tasarımı, AI ajan pipeline'ları, trigger sistemleri, cron job yönetimi ve çok-model LLM orchestration. CEO-AUTOMATION'ın ana aracı.
---

# Skill: n8n Automation

## Amaç
PARS Automation Hub için iş akışı ve otomasyon pipeline tasarımı.

## Kapsam

### n8n Temel Konseptler
- **Workflow:** Adımların bağlı olduğu otomasyon akışı
- **Node:** Tek bir aksiyon (HTTP call, DB query, LLM call, vb.)
- **Trigger:** Akışı başlatan olay (cron, webhook, form, event)
- **Credential:** API anahtar yönetimi (n8n encrypted vault)
- **Expression:** `{{ $json.data }}` — node çıktısına erişim

### Önemli Node Türleri

| Node | Kullanım |
|------|----------|
| HTTP Request | Herhangi bir API çağrısı |
| Code | Özel JS/Python kodu |
| AI Agent | LLM ile akıllı karar |
| OpenAI / Anthropic | LLM entegrasyonu |
| Telegram | Bot mesaj gönderme/alma |
| Instagram | Post, story, DM |
| Supabase | DB okuma/yazma |
| Schedule Trigger | Cron benzeri zamanlama |
| Webhook | Dış sistem tetiklemesi |
| If / Switch | Koşullu akış |
| Loop | Tekrarlayan işlem |
| Set | Veri dönüşümü |
| Merge | Paralel akış birleştirme |

### AI Agent Pattern
```
Trigger → Input Format → AI Agent (LLM) → Tool Calls → Output → Action
```

### Hata Yönetimi
- Her kritik node'a `Error Trigger` bağla
- Telegram'a hata bildirimi gönder
- Retry logic: 3 deneme, 1 dakika arayla
- Dead Letter Queue: başarısız işlemler ayrı kaydedilir

## PARS Automation Projeleri

### Sosyal Medya Pipeline
```
Cron (09:00) → İçerik üret (LLM) → Görsel üret → 
Platform formatla → Instagram/X/Telegram gönder → Analiz kaydet
```

### Coin Alarm Pipeline
```
Binance WebSocket → Fiyat kontrolü → Threshold geçildi? →
Telegram alarm → Supabase log
```

### Bilge Güncelleme Pipeline
```
Claude Code bitiş hook → Özet LLM → Obsidian yaz → 
Supabase güncelle → Telegram bildir
```

## Self-hosted Kurulum
```bash
# Docker ile n8n
docker run -d \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

## Güvenlik
- Tüm API anahtarları n8n Credential Manager'da
- Webhook URL'leri rastgele, gizli tutulur
- Self-hosted → veriler yerel kalır
- Production n8n → HTTPS zorunlu
