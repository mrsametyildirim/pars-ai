---
name: 29-community-platform
description: PARS topluluk ve bilgi ağı platform mimarisi. Ekşi sözlük benzeri tartışma sistemi, soru-cevap, firma değerlendirme, hikaye platformu. Güven skoru, moderasyon, PARGT entegrasyonu, SEO odaklı Next.js yapısı.
---

# Skill 29 — Community Platform

## Ne Zaman Kullanılır
- CEO-COMMUNITY tarafından çağrılır
- Tartışma/forum sistemi kurulurken
- Değerlendirme veya soru-cevap platformu eklenirken
- Kullanıcı içerik moderasyon sistemi kurulurken

## Temel Veri Şeması

```sql
-- Kullanıcı güven profili
CREATE TABLE user_trust (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  trust_score INT DEFAULT 0,
  content_count INT DEFAULT 0,
  upvote_received INT DEFAULT 0,
  verified_badges TEXT[] DEFAULT '{}',
  is_expert BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Başlıklar (Ekşi tarzı)
CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(200) UNIQUE NOT NULL,
  title TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  tags TEXT[] DEFAULT '{}',
  entry_count INT DEFAULT 0,
  view_count INT DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Girişler
CREATE TABLE entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id),
  content TEXT NOT NULL,        -- Max 2000 karakter
  upvotes INT DEFAULT 0,
  downvotes INT DEFAULT 0,
  is_approved BOOLEAN DEFAULT TRUE,
  is_deleted BOOLEAN DEFAULT FALSE,
  moderation_status VARCHAR(20) DEFAULT 'approved',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sorular
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT,
  asker_id UUID REFERENCES auth.users(id),
  category VARCHAR(50),
  answer_count INT DEFAULT 0,
  accepted_answer_id UUID,
  view_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Değerlendirmeler
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID REFERENCES auth.users(id),
  target_type VARCHAR(20),    -- 'company' | 'product' | 'service' | 'person'
  target_id VARCHAR(100),
  rating SMALLINT CHECK (rating BETWEEN 1 AND 5),
  title VARCHAR(200),
  body TEXT,
  is_verified BOOLEAN DEFAULT FALSE,  -- Satın alma doğrulandı
  is_anonymous BOOLEAN DEFAULT FALSE,
  helpful_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Güven Skoru Sistemi

```typescript
const TRUST_POINTS = {
  content_published: 1,
  upvote_received: 2,
  answer_accepted: 10,
  verified_badge_phone: 5,
  verified_badge_identity: 20,
  expert_badge: 50,
  report_valid: -5,        // Şikayeti haklı çıktı
  content_removed: -10,    // İçerik kaldırıldı
};

async function updateTrustScore(userId: string, event: keyof typeof TRUST_POINTS) {
  const delta = TRUST_POINTS[event];
  await supabase.rpc('increment_trust_score', { user_id: userId, delta });
}

// Otomatik yayın eşiği
const AUTO_PUBLISH_THRESHOLD = 10;  // Trust score >= 10 → otomatik yayın
```

## Moderasyon Pipeline

```typescript
async function moderateContent(content: string, authorId: string): Promise<ModerationResult> {
  // 1. Yeni kullanıcıysa beklet
  const trustScore = await getUserTrustScore(authorId);
  if (trustScore < AUTO_PUBLISH_THRESHOLD) {
    return { status: 'pending', reason: 'new_user' };
  }

  // 2. AI ön tarama
  const aiCheck = await checkWithAI(content);
  if (aiCheck.flagged) {
    return { status: 'flagged', reason: aiCheck.reason };
  }

  // 3. Otomatik yayın
  return { status: 'approved' };
}

// Şikayet sistemi
async function handleReport(contentId: string, reporterId: string, reason: string) {
  await createReport({ contentId, reporterId, reason });

  const reportCount = await getReportCount(contentId);
  if (reportCount >= 3) {
    await suspendContent(contentId);
    await notifyModerator(contentId);
  }
}
```

## SEO Yapısı (Next.js)

```typescript
// Dinamik SEO — her başlık/soru için
export async function generateMetadata({ params }): Promise<Metadata> {
  const topic = await getTopic(params.slug);
  return {
    title: `${topic.title} | PARS Community`,
    description: topic.top_entry?.substring(0, 160),
    openGraph: {
      title: topic.title,
      type: 'article',
      publishedTime: topic.created_at,
    },
  };
}

// Yapısal veri (Google için)
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'DiscussionForumPosting',
  headline: topic.title,
  interactionStatistic: {
    '@type': 'InteractionCounter',
    interactionType: 'https://schema.org/CommentAction',
    userInteractionCount: topic.entry_count,
  },
};
```

## PARGT Token Entegrasyonu

```typescript
const PARGT_REWARDS = {
  answer_accepted: 10,      // Cevabın kabul edildi
  review_verified: 5,       // Doğrulanmış yorum
  expert_badge_monthly: 50, // Uzman rozeti aylık pasif
  content_views_milestone: {
    1000: 2, 10000: 20, 100000: 200
  }
};
```

## Trend Hesaplama

```sql
-- Hot score (Reddit benzeri)
-- Yeni + fazla oy = öne çıkar
UPDATE topics SET hot_score =
  (entry_count * 1.0 + upvote_sum * 2.0) /
  POWER(EXTRACT(EPOCH FROM (NOW() - created_at)) / 3600 + 2, 1.5)
WHERE created_at >= NOW() - INTERVAL '7 days';
```
