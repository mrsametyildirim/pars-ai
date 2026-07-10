# Backend ve Yönetici Paneli Standartları — PARS

## Temel İlke
Backend yalnızca veri depolama servisi değildir.
Her projede güçlü yönetim, denetim ve analiz altyapısı zorunludur.

## Yönetici Paneli Zorunlulukları

Her projede admin paneli şunları yapabilmelidir:

### Kullanıcı Yönetimi
- Kullanıcıları listele, ara, filtrele
- Kullanıcı detay sayfası
- Rol ve yetki tanımlama (RBAC)
- Hesap askıya alma / silme
- Kullanıcı impersonation (debug amaçlı)

### İçerik Yönetimi
- İçerik CRUD (oluştur/oku/güncelle/sil)
- Toplu işlem (bulk action)
- Moderasyon kuyruğu
- İçerik versiyonlama

### Analitik ve Raporlama
- DAU / WAU / MAU grafikleri
- Yeni kullanıcı sayısı (günlük/haftalık/aylık)
- Özellik kullanım sıklığı
- Oturum süresi ortalaması
- Hata oranları
- İşlem tamamlanma oranları
- Satış / gelir verileri
- AI kullanım maliyeti ve istek sayısı
- API kullanım takibi
- Kullanıcı başına maliyet ve gelir

### Sistem Sağlığı
- Sunucu durumu (CPU, RAM, disk)
- Hata log görüntüleyici
- Yavaş sorgu tespiti
- Aktif bağlantı sayısı
- Queue durumu

### Bildirim ve İletişim
- Kullanıcıya push / e-posta / SMS gönderimi
- Duyuru yönetimi
- Segmented bildirim (rol/davranış bazlı)

### Destek
- Şikayet ve destek talebi yönetimi
- Kullanıcı geri bildirim akışı

### Otomasyon
- Otomasyon açma/kapatma/düzenleme
- Cron job yönetimi

### Veri
- CSV/Excel dışa aktarma
- Rapor oluşturma
- Şüpheli hareket tespiti
- Anonim davranış analizi (KVKK uyumlu)

## Audit Log Zorunluluğu

Her kritik işlemde kayıt alınır:

```typescript
interface AuditLog {
  id: string;
  action: string;           // "USER_DELETED" | "ROLE_CHANGED" | ...
  actor_id: string;         // İşlemi yapanın ID
  actor_role: string;       // admin / moderator / user
  target_id?: string;       // Etkilenen kayıt ID
  target_type?: string;     // "user" | "listing" | "payment"
  before?: object;          // Önceki değer
  after?: object;           // Sonraki değer
  success: boolean;
  error?: string;
  ip_address: string;
  user_agent: string;
  device_type: string;
  created_at: timestamp;
}
```

**Kritik işlemler** (2x doğrulama gerektirir):
- Silme (kullanıcı, içerik, ödeme kaydı)
- Yetki değişikliği
- Toplu işlem
- Ödeme işlemi
- Sistem konfigürasyon değişikliği

## API Standartları

### Endpoint Formatı
```
GET    /api/v1/{resource}          — liste
GET    /api/v1/{resource}/{id}     — tekil
POST   /api/v1/{resource}          — oluştur
PUT    /api/v1/{resource}/{id}     — güncelle (tümü)
PATCH  /api/v1/{resource}/{id}     — güncelle (kısmi)
DELETE /api/v1/{resource}/{id}     — sil
```

### Standart Yanıt Formatı
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 145,
    "total_pages": 8
  },
  "timestamp": "2026-07-10T22:00:00Z"
}
```

### Hata Formatı
```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Kullanıcı bulunamadı.",
    "field": "user_id"
  },
  "timestamp": "2026-07-10T22:00:00Z"
}
```

## Performans Gereksinimleri

- API yanıt süresi p95: < 200ms
- Uzun işlemler (>500ms): background job + webhook
- Sayfalama zorunlu: varsayılan limit = 20, max = 100
- Önbellek: Redis ile sık okunan veriler cache'lenir (TTL tanımlı)
- Rate limiting: IP bazlı + kullanıcı bazlı (konfigüre edilebilir)
- DB index: tüm foreign key ve sık sorgulanan alanlar
- N+1 sorgu yasak → eager loading / join kullan

## Güvenlik
- JWT + refresh token (15dk access / 7gün refresh)
- API anahtarları: `.env` — asla kodda
- CORS: sadece izin verilen originler
- Input validation: her endpoint'te
- SQL injection: ORM kullan, raw query minimuma indir
- File upload: MIME type + boyut + antivirus kontrolü
- Rate limit: auth endpoint'leri 5/dk max
