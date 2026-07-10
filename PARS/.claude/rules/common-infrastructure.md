# Ortak Altyapı — PARS Ekosistemi

## Temel İlke

Projeler birbirinden bağımsız geliştirilmez.
Ortak altyapı servisleri bir kez kurulur, tüm projeler kullanır.

---

## Ortak Servisler

### 1. Kimlik Doğrulama (PARS Auth)
- Tek kullanıcı hesabı — tüm PARS ürünleri için
- Supabase Auth tabanlı
- OAuth: Google, Apple, GitHub
- E-posta + şifre + OTP
- 2FA zorunlu (admin hesapları)
- RBAC: rol = [super_admin, admin, moderator, user, guest]
- Token: JWT (15dk access, 7gün refresh)

### 2. Ortak Bildirim Sistemi
- Push (FCM / APNs)
- E-posta (Resend / SendGrid)
- SMS (Twilio)
- Telegram (Bot API)
- In-app bildirim
- API: `POST /api/v1/notifications/send`

### 3. Ortak Dosya Depolama
- Supabase Storage (birincil)
- Cloudinary (görsel optimizasyon)
- Bucket yapısı: `{proje}/{user_id}/{kategori}/`
- Dosya limitleri: görsel 10MB, video 500MB, döküman 50MB
- NSFW filtresi: tüm public içerikler için

### 4. Ortak AI Katmanı (AI CORE)
- Model router: GPT-4o / Claude Sonnet / Groq / Ollama (local fallback)
- Prompt yönetimi: merkezi prompt arşivi
- Maliyet takibi: token kullanımı log'lanır
- Rate limiting: kullanıcı bazlı günlük AI kredi sistemi
- Cache: aynı prompt+context → önbellekten yanıt

### 5. Ortak Analitik Sistemi
- Event tracking: `track(eventName, properties, userId)`
- Funnel analizi
- Kohort analizi
- DAU/MAU/WAU hesaplama
- Custom dashboard (yönetici paneli içi)
- KVKK: kişisel veri anonim işlenir

### 6. Ortak Ödeme Altyapısı
- Iyzico (Türkiye kullanıcıları)
- Stripe (uluslararası)
- Kripto: PARGT token (PARS ekosistemine özel)
- Abonelik: recurring billing
- Emanet (escrow): pazar yeri işlemleri
- Webhook: ödeme olayları tüm projelere iletilir

### 7. Ortak API Gateway
- Tüm proje API'leri tek prefix altında: `api.pars.io/v1/{proje}/`
- Rate limiting merkezi
- Auth middleware merkezi
- Log merkezi
- Circuit breaker

### 8. Ortak Admin Paneli
- Tüm projeleri tek panelden yönet
- Kullanıcı = sistemde tek hesap, tüm ürünlere erişim
- Admin = kendi yetkisi dahilindeki projeleri görür

### 9. Ortak Tasarım Sistemi
- PARS Design System (renk, tipografi, spacing, bileşenler)
- Her projenin kendi aksanı var ama temel sistem paylaşılır
- Storybook dokümantasyonu

### 10. Ortak Otomasyon Motoru
- n8n self-hosted
- Tüm projelerin otomasyonları buradan yönetilir
- Trigger: webhook, cron, event
- AI ajan çağrıları buradan koordine edilir

---

## Servis Kullanım Kuralları

### Yeni Proje Başlarken Sor:
```
[ ] Auth → PARS Auth mı, ayrı mı?
[ ] Bildirim → Ortak sistem mi, ayrı mı?
[ ] Dosya → Ortak Supabase storage mı?
[ ] AI → AI CORE router'ı kullanacak mı?
[ ] Analitik → Ortak event sistemi mi?
[ ] Ödeme → Ortak gateway mi?
[ ] Admin → Ortak panelden mi, ayrı panelden mi?
```

### Entegrasyon Öncelik Sırası
1. PARS Auth (kimlik — her projede zorunlu)
2. Ortak Admin Panel (yönetim — her projede zorunlu)
3. Ortak Analitik (ölçüm — her projede önerilir)
4. Ortak Bildirim (iletişim — gerekirse)
5. AI CORE (AI — içeriyorsa)
6. Ortak Ödeme (ticaret — içeriyorsa)
7. Ortak Dosya (medya — içeriyorsa)

---

## PARAVERSE Entegrasyon Noktaları

Her yeni proje için sorulacak soru:
> "Bu proje PARAVERSE ve AI CORE ekosistemine nasıl bağlanacak?"

Olası bağlantılar:
- Ürünler AR'da görüntülenebilir mi? (Marketplace → PARAVERSE)
- PARGT ile ödeme mümkün mü? (Fintech → PARAVERSE)
- AI asistan entegre edilebilir mi? (tüm projeler → AI CORE)
- Kullanıcı aktiviteleri PARGT kazandırabilir mi? (PARAVERSE token ekonomisi)
- Dijital içerik PARAVERSE'de saklanabilir mi? (Anı, eser, kimlik)
