# PARS MCP Haritası

## Aktif MCPler (Bağlı ve Hazır)

| MCP | Durum | Yetki Kapsamı | PARS Kullanımı |
|-----|-------|--------------|----------------|
| playwright | Bağlı | Tam erişim | UI test, browser otomasyon, Kalkan görsel kontrol |
| context7 | Bağlı | Okuma | Kütüphane dokümantasyonu, API referansı |
| filesystem | Bağlı | Kısıtlı | Dosya okuma/yazma, PARS dizin yönetimi |
| instagram | Bağlı | Yayın | CEO-MEDIA sosyal medya yönetimi |
| excel-mcp-server | Bağlı | Okuma/yazma | Veri analizi, raporlama |
| ruflo | Bağlı | Aktif | Ruflo platform entegrasyonu |
| git/uvx | Bağlı | Commit/push | Versiyon kontrol, deployment |

---

## Credential Bekleyenler (Geçici Devre Dışı)

| MCP | Beklenen | Notlar |
|-----|---------|--------|
| stitch | API credential | Hazır olduğunda CEO-MEDIA aktive eder |
| nanobanana | Yapılandırma | CEO-KNOWLEDGE değerlendirecek |
| gdrive | OAuth token | CEO-KNOWLEDGE ve Bilge için |

---

## MCP Güvenlik Kuralları (Kalkan)

1. Her MCP açıkça yetkilendirilmiş olmalı
2. Kapsam minimum prensip: sadece gereken izinler
3. Credential'lar .env veya secret manager'da, koda gömülmez
4. Yeni MCP eklenmesi için Yuva onayı gerekir
5. Kullanılmayan MCPler devre dışı bırakılır

---

## MCP Kullanım Protokolü

```
Görev geldi
    ↓
Hangi MCP gerekiyor?
    ├── filesystem → dosya işlemleri (önce izin kontrol)
    ├── playwright → UI test/kontrol
    ├── context7 → kütüphane dokümantasyonu
    ├── git → versiyon kontrol işlemleri
    └── Diğer → Kalkan onayı
```

---

## Notlar
- filesystem MCP'si PARS dizinleri dışına erişemez (C:\PARS\ ve C:\ARES\ izinli)
- playwright MCP production sistemlere karşı çalıştırılmaz
- git MCP force push'u reddeder (main/master branch korumalı)
