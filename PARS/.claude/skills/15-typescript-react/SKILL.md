# TypeScript / React / Next.js

## Ne Zaman Kullan
- Web uygulaması (SPA veya SSR)
- React bileşen geliştirme
- Next.js full-stack web

## TypeScript Kuralları
- `any` tipi yasak
- Interface > Type alias (genişletilebilirlik)
- Strict mode aktif
- Jenerik türler anlamlı isimle: `<TData>` değil `<T>`
- Enum yerine `as const` object

## React Kuralları
- Functional component, hooks
- Custom hook: `use` prefix, tek sorumluluk
- Props tip tanımı zorunlu
- Side effect: `useEffect` minimal kullanım
- State: local → Zustand → Context sırası
- Render optimizasyon: `memo`, `useCallback`, `useMemo` sadece profil sonrası

## Next.js Kuralları
- App Router (Next.js 13+)
- Server Component varsayılan, Client Component minimize
- API route: `route.ts`
- Loading/error boundary zorunlu
- Image: `next/image` (optimized)
- Env: `.env.local` → `process.env.NEXT_PUBLIC_`

## Dosya Yapısı
```
src/
  app/           → Next.js app router
  components/    → Paylaşımlı UI bileşenleri
  features/      → Özellik bazlı modüller
  lib/           → Yardımcı fonksiyonlar
  types/         → Global tip tanımları
```

## Stil
Tailwind CSS tercih edilir. PARS tema değişkenleri `tailwind.config.ts` içinde.

## ECC Referansı
`react-patterns`, `react-performance`, `react-testing`, `nextjs-turbopack`
