---
name: 31-agriculture-social
description: PARS Agriculture & Social Impact platform mimarisi. Akıllı tarım (mekanik arı, koloni izleme, IoT sensör, AI bitki hastalık tespiti, hava entegrasyonu), bağış platformu (zekât, adak, şeffaf takip, kanıtlı teslimat, kolektif hedef).
---

# Skill 31 — Agriculture & Social Impact

## Ne Zaman Kullanılır
- CEO-AGRICULTURE tarafından çağrılır
- IoT sensör veri toplama sistemi kurulurken
- AI bitki hastalığı tespiti eklenirken
- Bağış/zekât platformu geliştirilirken

## Akıllı Tarım

### IoT Sensör Veri Şeması

```sql
-- Arazi/tarla tanımları
CREATE TABLE farms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID REFERENCES auth.users(id),
  name VARCHAR(200) NOT NULL,
  location GEOGRAPHY(POINT, 4326),
  area_hectares DECIMAL(10,2),
  crop_type VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- IoT cihazlar
CREATE TABLE iot_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
  device_type VARCHAR(50),     -- 'soil_sensor' | 'bee_tracker' | 'weather' | 'camera'
  device_id VARCHAR(100) UNIQUE,
  location GEOGRAPHY(POINT, 4326),
  is_active BOOLEAN DEFAULT TRUE,
  last_seen TIMESTAMPTZ
);

-- Sensör verileri (time-series)
CREATE TABLE sensor_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID REFERENCES iot_devices(id),
  reading_type VARCHAR(50),    -- 'soil_moisture' | 'temperature' | 'humidity' | 'ph'
  value DECIMAL(10,4) NOT NULL,
  unit VARCHAR(20),
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_sensor_device_time ON sensor_readings(device_id, recorded_at DESC);
```

### MQTT Mesaj Format

```typescript
// IoT cihazdan gelen veri
interface SensorPayload {
  device_id: string;
  readings: Array<{
    type: 'soil_moisture' | 'temperature' | 'humidity' | 'ph' | 'nitrogen';
    value: number;
    unit: string;
  }>;
  battery_level: number;
  timestamp: string;
}

// MQTT subscribe
mqttClient.subscribe('pars/farm/+/sensor', (topic, payload) => {
  const farmId = topic.split('/')[2];
  const data: SensorPayload = JSON.parse(payload.toString());
  saveSensorReading(farmId, data);
});
```

### AI Bitki Hastalık Tespiti

```typescript
// Görselden hastalık analizi
async function detectPlantDisease(imageFile: File): Promise<DiseaseResult> {
  const base64 = await fileToBase64(imageFile);

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{
      role: 'user',
      content: [
        { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64}` } },
        { type: 'text', text: `Bu bitki fotoğrafını analiz et. 
          1. Bitki türü nedir?
          2. Hastalık/zararlı var mı? Varsa ne?
          3. Şiddet: Hafif/Orta/Ciddi
          4. Önerilen tedavi (organik öncelikli)
          JSON formatında yanıt ver.` }
      ]
    }],
  });

  return JSON.parse(response.choices[0].message.content!);
}

interface DiseaseResult {
  plant_type: string;
  has_disease: boolean;
  disease_name?: string;
  severity?: 'low' | 'medium' | 'high';
  treatment?: string[];
  confidence: number;
}
```

### Arı Kolonisi İzleme

```typescript
interface HiveStatus {
  hive_id: string;
  temperature: number;       // İdeal: 34-36°C
  humidity: number;          // İdeal: 50-80%
  weight_kg: number;         // Koloni büyümesi/balın azalması
  sound_level: number;       // Anormal ses = sürü yapabilir
  bee_traffic: number;       // Saatte giriş-çıkış sayısı
  queen_detected: boolean;   // Ses analizi ile kraliçe varlığı
  alert_level: 'normal' | 'warning' | 'critical';
}
```

## Bağış Platformu

### DB Şeması

```sql
-- Bağış kampanyaları
CREATE TABLE donation_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(300) NOT NULL,
  description TEXT,
  category VARCHAR(50),      -- 'zekat' | 'adak' | 'genel' | 'afet' | 'egitim'
  target_amount DECIMAL(12,2),
  collected_amount DECIMAL(12,2) DEFAULT 0,
  beneficiary_count INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active',
  verified_by UUID,          -- Doğrulayan gönüllü
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bağışlar
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES donation_campaigns(id),
  donor_id UUID REFERENCES auth.users(id),
  amount DECIMAL(10,2) NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  payment_method VARCHAR(30),
  transaction_id VARCHAR(100),
  zekat_intent BOOLEAN DEFAULT FALSE,
  adak_description TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teslimat kanıtları
CREATE TABLE delivery_proofs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES donation_campaigns(id),
  uploaded_by UUID REFERENCES auth.users(id),
  photo_urls TEXT[] NOT NULL,
  video_url TEXT,
  location GEOGRAPHY(POINT, 4326),
  beneficiary_count INT,
  description TEXT,
  beneficiary_consent BOOLEAN DEFAULT FALSE,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Kolektif hedefler
CREATE TABLE collective_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES donation_campaigns(id),
  title VARCHAR(200),
  required_amount DECIMAL(10,2),
  required_donors INT,
  current_amount DECIMAL(10,2) DEFAULT 0,
  current_donors INT DEFAULT 0,
  activated_at TIMESTAMPTZ,  -- Hedefe ulaşıldığında
  completed_at TIMESTAMPTZ
);
```

### Zekât Hesaplama

```typescript
const ZEKAT_NISAP_GRAM_ALTIN = 80;  // Güncellenmeli

interface ZekatCalculation {
  gold_value_try: number;
  cash_try: number;
  receivables_try: number;
  goods_try: number;
  debts_try: number;
}

function calculateZekat(assets: ZekatCalculation): {
  total_wealth: number;
  nisap_value: number;
  is_above_nisap: boolean;
  zekat_amount: number;
} {
  const nisapValue = ZEKAT_NISAP_GRAM_ALTIN * getCurrentGoldPrice();
  const totalWealth = assets.gold_value_try + assets.cash_try +
    assets.receivables_try + assets.goods_try - assets.debts_try;

  return {
    total_wealth: totalWealth,
    nisap_value: nisapValue,
    is_above_nisap: totalWealth >= nisapValue,
    zekat_amount: totalWealth >= nisapValue ? totalWealth * 0.025 : 0,
  };
}
```

### Şeffaflık Akışı

```
1. Bağışçı ödeme yapar → pending status
2. Fon emanet hesabında bekler (Iyzico escrow)
3. Gönüllü ekip: kampanya/kişi doğrular (48 saat)
4. Doğrulama tamamsa → "verified" → para aktarılır
5. Teslim eden: fotoğraf + video + GPS yükler (48 saat)
6. beneficiary_consent = true → görseller yayınlanır
7. Bağışçıya Telegram/push: "Yardımın ulaştı" + kanıt linki
8. Raporlar herkese açık: campaign_id → tüm harcamalar
```

## FarmDirect → Marketplace Entegrasyonu

```typescript
// Çiftçi ürün ekler → CEO-MARKETPLACE'e gider
async function publishFarmProduct(product: FarmProduct) {
  const marketplaceListing = {
    seller_id: product.farmer_id,
    category: 'farm_direct',
    title: product.name,
    description: product.description,
    price: product.suggested_price,
    location: product.farm_location,
    organic: product.is_organic,
    harvest_date: product.harvest_date,
  };

  await createMarketplaceListing(marketplaceListing);
}
```
