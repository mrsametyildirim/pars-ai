# PARS Yasak Pattern'lar

## Kod Anti-Pattern'ları

```javascript
// YASAK: Magic number
if (score > 75) { ... }
// DOĞRU:
const HIGH_RISK_THRESHOLD = 75;
if (score > HIGH_RISK_THRESHOLD) { ... }

// YASAK: SQL string birleştirme
query = "SELECT * FROM users WHERE id = " + userId;
// DOĞRU:
query = "SELECT * FROM users WHERE id = $1", [userId]

// YASAK: Secret koda gömülü
const API_KEY = "sk-abc123def456";
// DOĞRU:
const API_KEY = process.env.API_KEY;

// YASAK: any tipi (TypeScript)
function process(data: any) { ... }
// DOĞRU:
function process(data: RiskData) { ... }

// YASAK: Console.log production'da
console.log("debug:", apiKey);
// DOĞRU: kaldır veya proper logging kullan
```

## Tasarım Anti-Pattern'ları
- Mor/mavi gradient hero section (AI görünümü)
- Clipart ve stok ikon karışımı
- Birden fazla font ailesi
- Gölge yığılması (çok katmanlı box-shadow)
- Anlamsız animasyon

## Agent Anti-Pattern'ları
- Basit görev için Yuva açmak
- Bilinen bilgiyi araştırma olarak sunmak
- Gereksiz agent zinciri (3 agent yaparken 1 yeterli)
- Kullanıcıya iç süreçleri raporlamak
- "Devam edeyim mi?" sormak
- Her göreve Bilge yüklemek

## Sunum Anti-Pattern'ları
- Her slaytta birden fazla ana mesaj
- Teknik detay slaytta (konuşmacı notuna gider)
- Metin ağırlıklı slayt (görsel önce)
- Jargon açıklanmadan kullanmak

## Güvenlik Anti-Pattern'ları
- CORS `*` bırakmak
- Secret log'a basmak
- HTTP'de hassas veri göndermek
- Input sanitize etmemek
