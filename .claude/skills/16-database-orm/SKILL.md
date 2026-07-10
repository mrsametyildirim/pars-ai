# Veritabanı / ORM / Migration

## Ne Zaman Kullan
- PostgreSQL / SQLite şema tasarımı
- Prisma ORM ile veri modelleme
- Migration yönetimi
- Query optimizasyonu

## Prisma Kuralları
- Schema: `prisma/schema.prisma`
- Model adları: `PascalCase` tekil
- İlişkiler açık tanımlanır (`@relation`)
- Nullable alan: `?` sadece gerçekten null olabiliyorsa
- Migration: `prisma migrate dev` (dev), `prisma migrate deploy` (prod)

## SQL Kuralları
- String birleştirme ile sorgu yasak (SQL injection)
- Parametre: `$1, $2` veya ORM placeholder
- Index: sık sorgulanan alanlar
- N+1 sorgu: `include` / `select` ile önle

## Demo Ortamı
PARS demo modunda PostgreSQL yerine statik JSON mock kullanılır.
Gerçek üretim: connection string `.env` dosyasında.

## Veri Güvenliği
- Hassas alan: şifrelenmiş (bcrypt, argon2)
- PII: ayrı tablo, erişim kısıtlı
- Backup: migration öncesi zorunlu

## PARS Projeleri
- ARES: risk kaydı, tahliye planı, altyapı durumu
- KNOWLEDGE: Bilge veritabanı (knowledge graph)
