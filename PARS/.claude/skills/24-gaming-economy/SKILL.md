---
name: gaming-economy
description: Oyun ekonomisi tasarımı, token entegrasyonu, NFT mekanikler, loot sistemi, progression sistemi, çok oyunculu backend, turnuva sistemi. TLOA ve tüm PARS oyunları için. CEO-GAMING'in ana aracı.
---

# Skill: Gaming Economy

## Temel Ekonomi İlkeleri

### Sink vs Source Dengesi
```
SOURCE (token kazanma)          SINK (token harcama)
─────────────────────          ─────────────────────
Günlük keşif   +2 PARGT        Kart satın alma   -50
PvP kazanma    +8 PARGT        Turnuva giriş     -10
Turnuva 1.     +1000 PARGT     Kart geliştirme   -20
Achievement    +5 PARGT        NFT listing fee    -5
Arkadaş referans +10           Premium skin       -100
```

Altın kural: **Source < Sink** → enflasyon önlenir

### Deflasyonel Mekanikler
- Kart yakma (burn): güçlü kart için 3 zayıf kart yakılır
- Turnuva giriş ücreti → ödül havuzuna gider
- İşlem ücreti % → hazineye gider (DAO yönetimi)

## TLOA Kart Sistemi

### Nadir Seviyeler
```
Common    → %60 drop rate, 10 PARGT değeri
Rare      → %25 drop rate, 50 PARGT
Epic      → %12 drop rate, 200 PARGT
Legendary → %3 drop rate, 1000+ PARGT değeri
```

### Progression Sistemi
```
Level 1-10: Tutorial kartlar (free)
Level 10+: Rarity unlock
Level 25+: PvP turnuva erişimi
Level 50+: Klan kurabilir
Level 100+: DAO oy hakkı
```

### Kart Birleştirme (Fusion)
```
3x Common → 1x Rare (guaranteed)
3x Rare   → 1x Epic (80% / 20% Common)
3x Epic   → 1x Legendary (50% / 50% Epic)
```

## Çok Oyunculu Backend

### Matchmaking
```js
// Elo benzeri rating sistemi
const matchRating = (player) => {
  return player.wins * 10 - player.losses * 8 + player.level * 2;
};

// Eşleştirme: ±150 rating farkı içinde
const findMatch = async (player) => {
  const range = player.rating;
  return db.players.where('rating BETWEEN ? AND ?', 
    range - 150, range + 150);
};
```

### Turnuva Yapısı
```
Kayıt        → Giriş ücreti öde
Bracket      → Otomatik eşleştirme
Round Robin  → 4 oyuncu, herkes herkesle
Semifinal    → Top 2
Final        → Canlı izleme, chat
Ödül         → Otomatik PARGT transferi
```

## NFT Entegrasyonu

### Kart NFT Standardı (ERC-1155 / Solana SPL)
```json
{
  "name": "Dede Korkut — Legendary",
  "description": "TLOA Legendary kart. 1/100 basıldı.",
  "image": "ipfs://Qm.../dede_korkut.png",
  "animation_url": "ipfs://Qm.../dede_korkut_3d.glb",
  "attributes": [
    { "trait_type": "Rarity", "value": "Legendary" },
    { "trait_type": "Attack", "value": 12 },
    { "trait_type": "Edition", "value": "Genesis" }
  ]
}
```

### Mint Stratejisi
- Genesis collection: 10,000 kart (hype + değer)
- Sınırlı baskı legendary'ler: 100 adet max
- Seasonal kartlar: her mevsim yeni set

## Loot Sistemi
```js
// Weighted random loot
function getLootDrop(dailyStreak) {
  const bonusMultiplier = Math.min(dailyStreak * 0.1, 2.0);
  const roll = Math.random() * 100;
  
  if (roll < 60) return { type: 'common', bonus: bonusMultiplier };
  if (roll < 85) return { type: 'rare', bonus: bonusMultiplier };
  if (roll < 97) return { type: 'epic', bonus: bonusMultiplier };
  return { type: 'legendary', bonus: bonusMultiplier };
}
```

## Anti-Cheat Prensipler
- Sunucu taraflı oyun durumu (istemci asla kaynak değil)
- İşlemler imzalanır ve zincirde doğrulanır
- Rate limiting: dakikada max X kart oynama
- Suspicious activity → geçici ban + manual review

## Analitik KPI'lar
- DAU / MAU oranı (hedef: 0.3+)
- Ortalama oturum süresi (hedef: 20 dakika)
- Ödeme dönüşümü (hedef: %5)
- ARPU (Average Revenue Per User)
- Churn rate (hedef: %10/ay altında)
- Token dolaşım hızı
