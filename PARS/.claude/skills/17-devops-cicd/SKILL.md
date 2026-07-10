# DevOps / CI-CD / Docker

## Ne Zaman Kullan
- Docker container oluşturma
- GitHub Actions / CI pipeline
- Deployment otomasyonu
- Ortam yönetimi (dev/staging/prod)

## Docker Kuralları
- Multi-stage build (dev + prod ayrı)
- Base image: resmi ve minimal (`node:20-alpine`)
- `.dockerignore`: `node_modules`, `.env`, `dist`
- Container root çalıştırma yasak

## GitHub Actions
- Workflow: `.github/workflows/`
- Trigger: `push` → test + build; `release` → deploy
- Secrets: GitHub Secrets (koda gömülmez)
- Matrix strategy: Node 18 + 20 paralel test
- Cache: `actions/cache` (npm/pnpm)

## Ortam Yönetimi
- `.env.example` → koda commit edilir (değer olmadan)
- `.env.local` → asla commit edilmez
- Production secret: çalışma zamanı inject
- Feature flag: ortam değişkeni ile

## PARS için DevOps
- Her proje kendi Dockerfile
- Merkezi CI: `.github/workflows/pars-ci.yml`
- Kalkan agent deploy öncesi güvenlik taraması yapar

## ECC Referansı
`canary-watch`, `agentic-os`, `autonomous-agent-harness`
