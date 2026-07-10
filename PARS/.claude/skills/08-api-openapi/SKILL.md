---
name: api-openapi
description: REST API tasarımı ve OpenAPI 3.0 spec üretimi. Endpoint standardı, versiyonlama, hata formatları, authentication ve API dokümantasyonu.
---

# API & OpenAPI Skill

## PARS API Standartları

### URL Yapısı
```
/api/v1/{kaynak}           GET, POST
/api/v1/{kaynak}/{id}      GET, PUT, PATCH, DELETE
/api/v1/{kaynak}/{id}/{alt-kaynak}  nested resource
```

Kaynak adları: çoğul, kebab-case
```
✓ /api/v1/risk-zones
✓ /api/v1/evacuation-routes
✗ /api/v1/getRiskZone
✗ /api/v1/risk_zone
```

### HTTP Metodları
| Metod | Kullanım | Başarı Kodu |
|-------|---------|------------|
| GET | Okuma | 200 |
| POST | Oluşturma | 201 |
| PUT | Tam güncelleme | 200 |
| PATCH | Kısmi güncelleme | 200 |
| DELETE | Silme | 204 |

### Hata Formatı (Her zaman bu)
```json
{
  "error": "Hata açıklaması",
  "code": 400,
  "field": "field_name" 
}
```

---

## OpenAPI 3.0 Şablonu

```yaml
openapi: 3.0.3
info:
  title: PARS API
  version: 1.0.0
  description: PARS AI Holding Operating System API

servers:
  - url: https://api.pars.ai/v1
    description: Production
  - url: http://localhost:3000/api/v1
    description: Development

paths:
  /risks:
    get:
      summary: Risk listesi
      operationId: listRisks
      tags: [Risks]
      parameters:
        - name: severity
          in: query
          schema:
            type: string
            enum: [low, medium, high, critical]
      responses:
        '200':
          description: Başarılı
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Risk'
        '401':
          $ref: '#/components/responses/Unauthorized'

components:
  schemas:
    Risk:
      type: object
      required: [id, title, severity]
      properties:
        id:
          type: string
          format: uuid
        title:
          type: string
        severity:
          type: string
          enum: [low, medium, high, critical]
        createdAt:
          type: string
          format: date-time

  responses:
    Unauthorized:
      description: Authentication gerekli
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
    
    Error:
      description: Hata yanıtı

  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

security:
  - BearerAuth: []
```

---

## Pagination Standardı
```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "hasNext": true
  }
}
```

---

## Demo Modu (PARS Özel)
Demo ortamında aktif API çağrısı yapılmaz. Mock data:
```json
{
  "_mock": true,
  "_generated": "2026-06-28T00:00:00Z",
  "data": [...]
}
```
