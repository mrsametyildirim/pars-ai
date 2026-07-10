---
name: health-assistant
description: Sağlık ve yaşam asistan sistemleri — beslenme, vitamin, kalori takip, hastalık yatkınlık analizi, kıyafet öneri, günlük rutin asistanı. KVKK/GDPR uyumlu. CEO-HEALTH'in ana aracı.
---

# Skill: Health Assistant

## Temel Mimari

```
Kullanıcı Profili
├── Demografik (yaş, cinsiyet, boy, kilo)
├── Hedefler (kilo verme, kas yapma, sağlıklı yaşam)
├── Kısıtlamalar (alerji, rahatsızlık, ilaç)
└── Aktivite (adım, egzersiz, uyku)
       ↓
AI Analiz Katmanı (LLM + kural motoru)
       ↓
Kişiselleştirilmiş Öneri
```

## Beslenme Asistanı

### Öğün Takibi
```js
// Fotoğraftan yiyecek tespiti
const analyzeFood = async (imageBase64) => {
  const response = await openai.vision({
    image: imageBase64,
    prompt: "Bu yiyecekleri tanımla ve makro besin değerlerini tahmin et (kalori, protein, karbonhidrat, yağ)"
  });
  return parseNutritionFromText(response);
};
```

### Günlük Hedef Hesaplama (Harris-Benedict)
```
Bazal Metabolizma (BMR):
Erkek:  88.36 + (13.4 × kg) + (4.8 × cm) - (5.7 × yaş)
Kadın:  447.6 + (9.2 × kg) + (3.1 × cm) - (4.3 × yaş)

Toplam İhtiyaç = BMR × Aktivite Faktörü
(Sedanter: 1.2, Hafif: 1.375, Orta: 1.55, Aktif: 1.725)
```

## Vitamin Öneri Sistemi

### Eksiklik Profili
```js
const vitaminProfile = {
  D3: { risk: 'high', symptom: 'halsizlik, kemik ağrısı' },
  B12: { risk: 'medium', symptom: 'uyuşukluk' },
  Magnezyum: { risk: 'low' },
  // ...
};

// LLM ile kişisel öneri
const recommend = async (profile, symptoms) => {
  return llm.complete(`
    Kullanıcı profili: ${JSON.stringify(profile)}
    Şikâyetler: ${symptoms}
    Türkiye'de satılan takviyeler arasından öneri yap.
    NOT: Tıbbi tavsiye değildir, doktora danışılmalıdır.
  `);
};
```

## Hastalık Yatkınlık Analizi

### Risk Faktörleri
- Yaşam tarzı: sigara, alkol, hareketsizlik, uyku
- Aile geçmişi (kullanıcı beyanı)
- Beslenme alışkanlıkları
- Stres seviyesi

### Çıktı Formatı
```
[Düşük Risk]  Hipertansiyon: Orta risk
[Orta Risk]   Tip 2 Diyabet: Düşük risk
[Yüksek Risk] D Vitamini eksikliği: Yüksek risk

📌 Bu analiz bilgilendirme amaçlıdır.
   Kesin tanı için doktorunuza başvurun.
```

## KVKK / GDPR Zorunlulukları
- Sağlık verisi özel kategori — açık rıza zorunlu
- Veri minimizasyonu — sadece gerekli veri toplanır
- Silme hakkı — kullanıcı verilerini silebilmeli
- Şifreleme — at-rest AES-256, in-transit TLS 1.3
- Türkiye: KVKK uyumluluk beyanı zorunlu
- AB: GDPR Article 9 sağlık verisi uyumu

## Kıyafet Öneri Sistemi
```
Girdi: Hava durumu + Aktivite planı + Gardırop listesi
       ↓
Çıktı: "Bugün ofis toplantısı var, 18°C ve hafif yağışlı.
        Lacivert takım elbise + trençkot önerisi."
```

## Teknik Stack
- **Backend:** FastAPI (Python) — AI analiz
- **DB:** Supabase — şifreli sağlık verisi
- **Storage:** Supabase Storage — yemek fotoğrafları
- **Mobil:** Flutter — cross-platform
- **AI:** OpenAI GPT-4o Vision — yemek analizi
- **Notification:** Push (Firebase) — hatırlatmalar
