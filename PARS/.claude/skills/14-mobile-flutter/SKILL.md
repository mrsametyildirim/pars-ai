# Mobile — Flutter / Dart / React Native

## Ne Zaman Kullan
- Mobil uygulama (iOS + Android) geliştirme
- Cross-platform UI (Flutter Widget sistemi)
- React Native ile JavaScript tabanlı mobil

## Flutter Temel Kuralları
- Widget tree sade tutulur; mantık servis katmanına taşınır
- State: Provider → Riverpod tercih sırası
- Dart dosyası: `snake_case.dart`
- Widget: `PascalCase` class
- Responsive: `MediaQuery` + `LayoutBuilder`
- Platform-specific: `.platform == TargetPlatform.iOS` kontrol

## React Native Temel Kuralları
- Expo managed workflow → hızlı başlangıç
- State: Zustand veya Redux Toolkit
- Navigasyon: React Navigation
- Stil: StyleSheet API veya NativeWind (Tailwind)

## Proje Yapısı (Flutter)
```
lib/
  core/          → teema, sabitler, yardımcılar
  features/      → özellik bazlı modüller
    feature_name/
      data/      → repository, model
      domain/    → entity, use case
      presentation/ → screen, widget, controller
  shared/        → ortak widget'lar
```

## PARS Projeleri için Mobil
- ARES: İstanbul deprem hızlı uyarı notifikasyonu
- XR: Spatial computing entry point
- MEDIA: Video player ve içerik tüketim

## ECC Referansı
`android-clean-architecture`, `dart-flutter-patterns`, `flutter-dart-code-review`
