---
name: 27-analytics-reporting
description: PARS ekosistemi analitik altyapısı. Event tracking standardı, DAU/WAU/MAU hesaplama, funnel analizi, kohort raporu, KVKK uyumlu anonim işleme. Her ürün aynı sistemi kullanır.
---

# Skill 27 — Analytics & Reporting

## Ne Zaman Kullanılır
- Yeni PARS ürününe analitik eklerken
- KPI dashboard kurulurken
- Funnel veya cohort analizi yapılırken
- Raporlama sistemi tasarlanırken

## Temel Event Tracking Interface

```typescript
// Tüm PARS projeleri bu fonksiyonu kullanır
function track(
  event: string,
  properties: Record<string, unknown> = {},
  userId?: string
): void {
  const payload = {
    event,
    properties: {
      ...properties,
      project: PROJECT_NAME,
      timestamp: new Date().toISOString(),
      session_id: getSessionId(),
    },
    user_id: userId ?? getAnonymousId(),
  };
  sendToAnalytics(payload);
}
```

## Zorunlu Event Kataloğu

```typescript
// Her PARS ürününde bu event'ler izlenir
const STANDARD_EVENTS = {
  // Oturum
  'session.start': { duration_ms?: number },
  'session.end': { duration_ms: number, pages_viewed: number },

  // Kimlik
  'user.signup': { method: 'email' | 'google' | 'apple' },
  'user.login': { method: string },
  'user.logout': {},

  // İçerik
  'content.view': { content_type: string, content_id: string },
  'content.create': { content_type: string },
  'content.interact': { action: 'like' | 'share' | 'save' | 'comment' },

  // Ödeme (varsa)
  'payment.initiated': { amount: number, currency: string, method: string },
  'payment.completed': { amount: number, transaction_id: string },
  'payment.failed': { reason: string },

  // Hata
  'error.occurred': { error_code: string, page: string },
};
```

## DB Şeması (Supabase)

```sql
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event VARCHAR(100) NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  anonymous_id VARCHAR(36),
  project VARCHAR(50) NOT NULL,
  properties JSONB DEFAULT '{}',
  session_id VARCHAR(36),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index'ler
CREATE INDEX idx_analytics_event ON analytics_events(event);
CREATE INDEX idx_analytics_user ON analytics_events(user_id);
CREATE INDEX idx_analytics_project ON analytics_events(project);
CREATE INDEX idx_analytics_created ON analytics_events(created_at);
```

## KPI Hesaplama Sorguları

```sql
-- DAU (Günlük aktif kullanıcı)
SELECT DATE(created_at) as date, COUNT(DISTINCT user_id) as dau
FROM analytics_events
WHERE project = $1 AND created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date;

-- Retention (7. gün tutma)
WITH first_seen AS (
  SELECT user_id, MIN(DATE(created_at)) as first_date
  FROM analytics_events WHERE project = $1
  GROUP BY user_id
),
returned AS (
  SELECT DISTINCT fs.user_id
  FROM first_seen fs
  JOIN analytics_events ae ON ae.user_id = fs.user_id
  WHERE DATE(ae.created_at) = fs.first_date + INTERVAL '7 days'
)
SELECT
  COUNT(DISTINCT fs.user_id) as total_users,
  COUNT(DISTINCT r.user_id) as retained_users,
  ROUND(COUNT(DISTINCT r.user_id)::numeric / COUNT(DISTINCT fs.user_id) * 100, 1) as retention_rate
FROM first_seen fs
LEFT JOIN returned r ON r.user_id = fs.user_id;
```

## Dashboard Bileşenleri

```
KPI Kartları:
- DAU / WAU / MAU (trend ok ile)
- Yeni kullanıcı sayısı
- Oturum başına ortalama süre
- Dönüşüm oranı (varsa)
- Gelir özeti (varsa)

Grafikler:
- Çizgi grafik: kullanıcı büyümesi (30 gün)
- Bar grafik: en popüler özellikler
- Funnel: signup → activation → retention
- Cohort tablosu: haftalık retention
```

## Funnel Analizi

```typescript
interface FunnelStep {
  name: string;
  event: string;
  count: number;
  conversion_rate: number;  // önceki adıma göre %
  drop_off_rate: number;
}

// Örnek: Kayıt funneli
const signupFunnel: FunnelStep[] = [
  { name: 'Landing sayfası', event: 'page.view', count: 10000, ... },
  { name: 'Kayıt formu açtı', event: 'signup.form_open', count: 2500, ... },
  { name: 'Form doldurdu', event: 'signup.form_submit', count: 1800, ... },
  { name: 'Doğrulama tamamladı', event: 'user.signup', count: 1200, ... },
];
```

## KVKK / GDPR Uyumu
- IP adresi hash'lenerek saklanır (düz metin değil)
- Kullanıcı "analitik reddet" seçebilir → anonim_id ile takip
- 24 ay sonra kişisel bağlantılı veriler silinir
- Export hakkı: kullanıcı kendi event'lerini indirebilir
- Silinme hakkı: kullanıcı silindi → event'lerde user_id NULL

## Raporlama Formatları
- Dashboard: gerçek zamanlı (Supabase Realtime)
- Haftalık özet: otomatik e-posta (n8n ile)
- CSV export: admin panelden filtrelenmiş
- Webhook: kritik eşik aşılırsa Telegram bildirimi
