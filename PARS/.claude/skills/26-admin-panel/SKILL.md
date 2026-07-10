---
name: 26-admin-panel
description: Her PARS ürününde bulunması zorunlu admin paneli standartları. 20 zorunlu fonksiyon, audit log, kullanıcı yönetimi, analitik dashboard, sistem sağlığı izleme. RBAC mimarisi.
---

# Skill 26 — Admin Panel

## Ne Zaman Kullanılır
- Yeni PARS ürününe admin panel eklerken
- Mevcut admin paneli eksiklerini tamamlarken
- Admin panel tasarımı ve yetki sistemi kurulurken

## 20 Zorunlu Admin Fonksiyonu

Her PARS ürününün admin panelinde şunlar ZORUNLU:

```
Kullanıcı Yönetimi:
[1]  Kullanıcı listesi (arama, filtreleme, sayfalama)
[2]  Kullanıcı detay + geçmişi görüntüleme
[3]  Kullanıcı banlama / engelleme / askıya alma
[4]  Kullanıcı rol atama (RBAC)
[5]  Kullanıcı silme (soft delete + KVKK uyumlu)

İçerik / Veri Yönetimi:
[6]  İçerik/listeleme listesi (tüm kayıtlar)
[7]  İçerik onaylama / reddetme / düzenleme
[8]  Toplu işlem (çoklu seçim + aksiyon)
[9]  Arama ve gelişmiş filtreleme
[10] İçerik detay + değişiklik geçmişi

Sistem Yönetimi:
[11] Dashboard (KPI kartları, günlük/haftalık özet)
[12] Sistem sağlığı (servis durumu, response time)
[13] Hata log viewer (son 100 hata, filtreli)
[14] Audit log (kim ne yaptı, ne zaman)
[15] Ayarlar paneli (site başlığı, özellik flag)

Analitik:
[16] Kullanıcı kayıt trendi (grafik)
[17] İçerik üretim trendi (grafik)
[18] Gelir / işlem özeti (fintech/marketplace için)
[19] Cohort analizi veya funnel raporu
[20] CSV / Excel export
```

## RBAC Mimarisi

```typescript
type Role = 'super_admin' | 'admin' | 'moderator' | 'support' | 'viewer';

const PERMISSIONS: Record<Role, string[]> = {
  super_admin: ['*'],
  admin: ['users.*', 'content.*', 'analytics.read', 'settings.*'],
  moderator: ['content.approve', 'content.reject', 'users.ban'],
  support: ['users.read', 'tickets.*'],
  viewer: ['analytics.read', 'content.read'],
};
```

## Audit Log Interface

```typescript
interface AuditLog {
  id: string;
  timestamp: string;          // ISO 8601
  admin_id: string;
  admin_email: string;
  action: string;             // 'user.ban' | 'content.delete' | 'settings.update'
  resource_type: string;      // 'user' | 'listing' | 'comment'
  resource_id: string;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  ip_address: string;
  user_agent: string;
}
```

## Admin Panel Komponent Yapısı

```
/admin
  /layout         → AdminSidebar, AdminHeader, AdminBreadcrumb
  /dashboard      → KPI cards, charts, activity feed
  /users          → UserTable, UserDetail, UserActions
  /content        → ContentTable, ContentDetail, BulkActions
  /analytics      → Charts, DateRangePicker, ExportButton
  /audit-log      → AuditTable, AuditFilter, AuditDetail
  /settings       → SettingsForm, FeatureFlags
  /system         → HealthStatus, ErrorLogs, ServiceStatus
```

## Standart Admin Tablo

```tsx
// Her admin tablosu bu pattern'ı kullanır
const AdminTable = ({ data, columns, onAction, loading }) => (
  <div className="admin-table-wrapper">
    <AdminTableHeader totalCount={data.total} onExport={handleExport} />
    <AdminTableFilters filters={activeFilters} onFilter={setFilters} />
    <table className="admin-table">
      {/* thead, tbody */}
    </table>
    <AdminPagination page={page} total={data.total} onChange={setPage} />
  </div>
);
```

## Sistem Sağlığı Dashboard

```typescript
interface SystemHealth {
  services: Array<{
    name: string;
    status: 'ok' | 'degraded' | 'down';
    latency_ms: number;
    last_check: string;
  }>;
  database: {
    pool_size: number;
    active_connections: number;
    query_time_p95_ms: number;
  };
  storage: {
    used_gb: number;
    total_gb: number;
    percentage: number;
  };
}
```

## Güvenlik Kuralları
- Admin paneli `/admin` altında, ayrı auth middleware
- 2FA super_admin için zorunlu
- Session timeout: 8 saat inaktivite
- Rate limit: admin login 5 deneme → 30 dakika blok
- Tüm kritik işlemler audit log'a yazılır (silinmez)
- Admin paneli bağlantısı SSL/TLS zorunlu
