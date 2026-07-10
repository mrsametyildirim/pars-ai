---
name: fintech-tools
description: Fintech araçları — kişisel finans asistanı, coin/token teknik analiz, hacim takip ve alarm, portföy yönetimi, borç paylaşım, PARGT dashboard. CEO-FINTECH'in ana aracı.
---

# Skill: Fintech Tools

## Kişisel Finans Asistanı

### Harcama Kategorileme
```js
const categorize = async (transaction) => {
  const prompt = `
    İşlem: "${transaction.description}" — ${transaction.amount}₺
    Kategorile: Yiyecek / Ulaşım / Fatura / Eğlence / 
                Sağlık / Eğitim / Giyim / Diğer
  `;
  return llm.complete(prompt);
};
```

### Bütçe Analizi
```
Gelir:        ████████████████  10.000₺
Gider:        ████████████      7.500₺
Tasarruf:     ████              2.500₺ (25%)
─────────────────────────────────────────
En büyük harcama: Yiyecek (2.100₺, %28)
Öneri: Dışarıda yemek %30 azalt → 630₺ tasarruf
```

## Coin / Token Teknik Analiz

### Temel İndikatörler
```python
import pandas as pd
import ta  # Technical Analysis library

def analyze_coin(df):
    # RSI
    df['rsi'] = ta.momentum.RSIIndicator(df['close']).rsi()
    
    # MACD
    macd = ta.trend.MACD(df['close'])
    df['macd'] = macd.macd()
    df['signal'] = macd.macd_signal()
    
    # Bollinger Bands
    bb = ta.volatility.BollingerBands(df['close'])
    df['bb_upper'] = bb.bollinger_hband()
    df['bb_lower'] = bb.bollinger_lband()
    
    return df
```

### Sinyal Üretimi
```python
def generate_signal(df):
    last = df.iloc[-1]
    signals = []
    
    if last['rsi'] < 30:
        signals.append("RSI AŞIRI SATIM — Al sinyali")
    if last['macd'] > last['signal'] and df.iloc[-2]['macd'] < df.iloc[-2]['signal']:
        signals.append("MACD kesişim — Al sinyali")
    if last['close'] < last['bb_lower']:
        signals.append("Bollinger alt bandı — Potansiyel dönüş")
    
    return signals
```

## Hacim Takip ve Alarm

### Binance WebSocket
```js
const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@ticker');

ws.onmessage = (event) => {
  const { c: price, v: volume, P: priceChange } = JSON.parse(event.data);
  
  if (Math.abs(priceChange) > 5) {
    sendTelegramAlert(`🚨 BTC %${priceChange} değişim! Fiyat: $${price}`);
  }
  if (volume > VOLUME_THRESHOLD) {
    sendTelegramAlert(`📊 BTC anormal hacim: ${volume}`);
  }
};
```

### Telegram Alarm Formatı
```
🚨 PARS FİNANS ALARMSI
━━━━━━━━━━━━━━━━━━━
Coin:    BTC / USDT
Tetikçi: %5.3 düşüş (15 dakika)
Fiyat:   $68,234
Hacim:   2.3x ortalama
RSI:     28 (Aşırı satım)
Önerim:  Dikkatli izle, %29 bekleniyor
━━━━━━━━━━━━━━━━━━━
PARS Fintech | 14:32 TR
```

## Borç Paylaşım Sistemi (Splitwise Benzeri)

### Veri Modeli
```sql
CREATE TABLE group_expenses (
  id UUID PRIMARY KEY,
  group_id UUID,
  paid_by UUID,        -- ödeyenin kullanıcı ID
  amount DECIMAL(10,2),
  description TEXT,
  split_type TEXT,     -- equal / custom / percentage
  created_at TIMESTAMP
);

CREATE TABLE splits (
  expense_id UUID,
  user_id UUID,
  amount DECIMAL(10,2), -- bu kişinin borcu
  settled BOOLEAN DEFAULT false
);
```

### Bakiye Hesaplama
```js
const calculateBalances = (members, expenses) => {
  const balances = {};
  
  expenses.forEach(exp => {
    const share = exp.amount / exp.splits.length;
    exp.splits.forEach(split => {
      balances[split.user_id] = (balances[split.user_id] || 0) - share;
    });
    balances[exp.paid_by] = (balances[exp.paid_by] || 0) + exp.amount;
  });
  
  return balances;
};
```

## PARGT Dashboard

```
PARGT Portföy Özeti
───────────────────
Bakiye:    1,234 PARGT
USD Değer: $123.40
24s Değiş: +5.2%

Stake Edilen: 500 PARGT → %12 APY
Pending Ödül: 6.7 PARGT

Son İşlemler:
PvP Kazandı     +8 PARGT    12:34
Kart satın aldı -50 PARGT   11:20
Günlük keşif    +2 PARGT    09:00
```

## Güvenlik
- API anahtarları: `.env` — asla kodda
- Kullanıcı bakiyesi: sunucu taraflı doğrulama
- İşlem imzalama: JWT + timestamp
- PCI DSS: kart verisi hiç saklanmaz
- Rate limiting: dakikada 60 istek max
