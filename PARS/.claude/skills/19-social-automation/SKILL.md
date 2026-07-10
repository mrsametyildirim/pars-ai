---
name: social-automation
description: Sosyal medya otomasyon sistemi — içerik üretimi, çoklu platform yayın, bot yönetimi, hashtag araştırma, analitik. Telegram/X/Instagram/YouTube entegrasyonları. CEO-SOCIAL'ın ana aracı.
---

# Skill: Social Automation

## Platform Entegrasyonları

### Telegram
```js
// Bot mesaj gönderme
POST https://api.telegram.org/bot{TOKEN}/sendMessage
{ chat_id: "@channel", text: "mesaj", parse_mode: "Markdown" }

// Medya gönderme
POST /sendPhoto | /sendVideo | /sendDocument
```

### Instagram (MCP Aktif)
```
mcp__instagram__publish_media  → Fotoğraf/Reel post
mcp__instagram__get_insights   → Analitik
mcp__instagram__get_comments   → Yorum takibi
mcp__instagram__send_dm        → DM otomasyon
```

### X (Twitter) API v2
```js
// Thread oluşturma
POST /2/tweets
{ text: "tweet metni", reply: { in_reply_to_tweet_id: "..." } }

// Programlı zamanlama
n8n Schedule → Content LLM → X API → Post
```

### YouTube
```
YouTube Data API v3:
- videos.insert  → upload
- thumbnails.set → kapak yükleme
- playlistItems  → playlist yönetimi
```

## İçerik Üretim Pipeline

### Tam Otomasyon Akışı
```
Konu/trigger → LLM metin üret → 
Görsel üret (DALL-E / Stable Diffusion) →
Platform formatla → 
Optimal saatte yayınla →
Analitik takip
```

### İçerik Tipleri ve Formatlar

| Tip | Platform | Format |
|-----|----------|--------|
| UFC analiz | X, Instagram | Thread + Kart görseli |
| Kitap özeti | Tüm platformlar | Carousel 10 slide |
| Prompt paylaşımı | X, Telegram | Kod bloğu + açıklama |
| Coin analiz | Telegram, X | TradingView screenshot + yorum |
| Komik içerik | Instagram, TikTok | Reel 15-30sn |
| Haber özeti | Telegram | Madde madde özetleme |

## Carousel/Reel Üretimi
```
Remotion ile programatik üretim:
- Mavi nokta: kitap özeti template
- Grafik: coin analiz
- Animasyonlu: UFC öncesi vs sonrası
```

## Hashtag Araştırma
```python
# Trend hashtag tespiti
instagram.search_hashtag(tag="..." )
→ media_count, top_posts analiz
→ Niche hashtag mix önerisi (30 hashtag)
```

## Optimal Yayın Zamanı
- Instagram: Salı-Cuma 09-11 veya 18-20 (TR saati)
- X: Hafta içi 07-09 veya 12-14
- Telegram: Sabah 08 veya akşam 20
- YouTube: Cuma-Cumartesi 14-16

## Analitik Takip
- Reach, impression, engagement rate
- En iyi içerik tiplerini tespit
- Haftalık rapor → Telegram özeti

## Güvenlik
- Platform API anahtarları → `.env` / n8n Credentials
- Rate limit yönetimi — her platform farklı limit
- Spam tespit → içerik kalite filtresi
- Shadowban riski: botik yorum/like kaçın
