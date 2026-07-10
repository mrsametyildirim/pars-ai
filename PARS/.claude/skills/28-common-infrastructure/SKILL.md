---
name: 28-common-infrastructure
description: PARS ortak teknik altyapısı uygulama rehberi. PARS Auth (SSO), API Gateway, bildirim servisi, dosya depolama, AI katmanı, ödeme gateway, tasarım sistemi. Her yeni proje bu servisleri sıfırdan yazmak yerine kullanır.
---

# Skill 28 — Common Infrastructure

## Ne Zaman Kullanılır
- Yeni PARS projesi başlarken (ortak servis entegrasyonu)
- Auth sistemi kurulurken
- Bildirim, depolama, ödeme eklenirken
- Ortak admin paneline bağlanırken

## Entegrasyon Öncelik Sırası

```
Yeni proje başlarken bu sırayla entegre et:
1. PARS Auth (kullanıcı olmadan hiçbir şey çalışmaz)
2. Supabase DB (proje tabloları)
3. Admin Panel (içerik yönetimi)
4. Analitik (kullanıcı davranışı takibi)
5. Bildirim (kullanıcıya erişim)
6. Dosya Depolama (medya)
7. Ödeme (varsa gelir)
8. AI Katmanı (yapay zeka özelliği varsa)
```

## 1. PARS Auth Entegrasyonu

```typescript
// Supabase Auth kurulumu
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// JWT doğrulama middleware
async function authMiddleware(req: Request) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) throw new Error('Unauthorized');

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) throw new Error('Invalid token');

  return user;
}

// Rol kontrolü
async function requireRole(userId: string, requiredRole: Role) {
  const { data } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single();

  if (!hasPermission(data?.role, requiredRole)) {
    throw new Error('Forbidden');
  }
}
```

## 2. API Gateway Standardı

```
Tüm PARS API'ları bu format:
https://api.pars.io/v1/{proje}/{kaynak}

Örnekler:
GET  /v1/marketplace/listings
POST /v1/events/events
GET  /v1/health/profiles/{userId}

Auth header: Authorization: Bearer {jwt}
```

## 3. Ortak Bildirim Servisi

```typescript
// Tek çağrı ile tüm kanallar
async function sendNotification(payload: NotificationPayload) {
  const channels = payload.channels ?? ['push'];

  await Promise.allSettled([
    channels.includes('push') && sendPushNotification(payload),
    channels.includes('email') && sendEmail(payload),
    channels.includes('telegram') && sendTelegramMessage(payload),
    channels.includes('in_app') && createInAppNotification(payload),
  ]);
}

interface NotificationPayload {
  user_id: string;
  title: string;
  body: string;
  channels: ('push' | 'email' | 'telegram' | 'in_app')[];
  data?: Record<string, string>;
  action_url?: string;
}
```

## 4. Dosya Depolama

```typescript
// Supabase Storage — standart path yapısı
async function uploadFile(
  project: string,
  userId: string,
  category: string,
  file: File
): Promise<string> {
  const ext = file.name.split('.').pop();
  const path = `${project}/${userId}/${category}/${Date.now()}.${ext}`;

  const { data, error } = await supabase.storage
    .from('pars-files')
    .upload(path, file, { contentType: file.type });

  if (error) throw error;
  return data.path;
}

// Örnek path'ler:
// marketplace/user_123/listings/photo_1.webp
// events/event_456/photos/guest_photo.jpg
// health/user_789/avatars/profile.jpg
```

## 5. AI Model Router

```typescript
type AIModel = 'claude' | 'gpt' | 'groq' | 'ollama';

interface AIRequest {
  prompt: string;
  model?: AIModel;
  max_tokens?: number;
  temperature?: number;
}

async function aiComplete(req: AIRequest): Promise<string> {
  const model = req.model ?? selectBestModel(req);

  switch (model) {
    case 'claude':
      return callClaude(req);     // Karmaşık, kalite kritik
    case 'gpt':
      return callOpenAI(req);     // Görsel analiz, multimodal
    case 'groq':
      return callGroq(req);       // Hız kritik
    case 'ollama':
      return callOllama(req);     // Çevrimdışı, privacy
  }
}

function selectBestModel(req: AIRequest): AIModel {
  if (req.prompt.length > 10000) return 'claude';
  if (req.max_tokens && req.max_tokens < 200) return 'groq';
  return 'claude';
}
```

## 6. Ödeme Gateway

```typescript
// Türkiye → Iyzico, Uluslararası → Stripe, Ekosistem → PARGT
type PaymentMethod = 'iyzico' | 'stripe' | 'pargt';

interface PaymentRequest {
  amount: number;        // Kuruş/cent cinsinden
  currency: 'TRY' | 'USD' | 'EUR' | 'PARGT';
  user_id: string;
  description: string;
  metadata?: Record<string, string>;
}

async function processPayment(req: PaymentRequest): Promise<PaymentResult> {
  const method = selectPaymentMethod(req.currency);
  const result = await executePayment(method, req);

  // Her ödeme audit log'a yazılır
  await logAudit({
    action: 'payment.processed',
    resource_type: 'payment',
    resource_id: result.transaction_id,
    after: { amount: req.amount, method, status: result.status }
  });

  return result;
}
```

## 7. Design System Token'ları

```css
/* Her PARS projesi bu token'ları kullanır */
:root {
  /* Ana renkler — proje design-system.md'den gelir */
  --color-primary: #1a2744;      /* Lacivert (varsayılan) */
  --color-accent: var(--project-accent);  /* Proje rengi */
  --color-critical: #dc2626;     /* Kırmızı — uyarı */

  /* Typography */
  --font-heading: 'Fraunces', serif;
  --font-body: 'Söhne', system-ui, sans-serif;
  --font-mono: 'Geist Mono', monospace;

  /* Spacing (8px base) */
  --space-xs: 8px;
  --space-sm: 16px;
  --space-md: 24px;
  --space-lg: 32px;
  --space-xl: 48px;
  --space-2xl: 64px;

  /* Border radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
}
```

## Yeni Proje Checklist

```
Yeni PARS projesi başlarken kontrol listesi:

[ ] PARS Auth entegre edildi mi?
[ ] Kullanıcı tablosu PARS Auth'a bağlı mı?
[ ] API /v1/{proje}/ prefix'i kullanıyor mu?
[ ] Admin paneli eklendi mi? (20 fonksiyon)
[ ] Analitik track() çağrıları eklendi mi?
[ ] Ortak bildirim servisi mi kullanıyor?
[ ] Dosya depolama path standardına uyuyor mu?
[ ] Design system token'ları kullanıldı mı?
[ ] Audit log kritik işlemlerde aktif mi?
[ ] Rate limiting uygulandı mı?
[ ] KVKK metni / gizlilik politikası var mı?
[ ] Mobile responsive mu?
```
