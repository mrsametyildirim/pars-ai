"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

/* ── FJ Logosu (footer versiyonu — beyaz üzerine) ── */
function FooterLogo() {
  return (
    <div className="flex items-center gap-2 select-none mb-4">
      <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="rotate(-8, 50, 50)">
          <rect x="12" y="22" width="36" height="9" rx="4" fill="#FFFFFF" opacity="0.9"/>
          <rect x="12" y="35" width="26" height="8" rx="4" fill="#FFFFFF" opacity="0.9"/>
          <rect x="12" y="48" width="16" height="8" rx="4" fill="#FFFFFF" opacity="0.9"/>
          <rect x="12" y="61" width="36" height="9" rx="4" fill="#FFFFFF" opacity="0.9"/>
        </g>
        <path d="M58 20 L58 65 Q58 82 45 82 L40 82" stroke="#3B82F6" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M58 20 L78 20" stroke="#3B82F6" strokeWidth="10" strokeLinecap="round" fill="none"/>
      </svg>
      <span style={{ fontSize: "17px", fontWeight: 700, letterSpacing: "-0.3px" }}>
        <span style={{ color: "#FFFFFF" }}>Format</span>
        <span style={{ color: "#3B82F6" }}>Jet</span>
      </span>
    </div>
  );
}

const LINKS = {
  Araçlar: [
    { label: "PDF",    href: "/araclar#pdf" },
    { label: "Belge",  href: "/araclar#belge" },
    { label: "Görsel", href: "/araclar#gorsel" },
    { label: "Video",  href: "/araclar#video" },
    { label: "Ses",    href: "/araclar#ses" },
    { label: "Tüm Araçlar", href: "/araclar", accent: true },
  ],
  FormatJet: [
    { label: "Hakkımızda",       href: "/hakkimizda" },
    { label: "İletişim",         href: "/iletisim" },
    { label: "Destek Ol",        href: "/destek" },
    { label: "Şeffaflık Raporu", href: "/seffaflik" },
  ],
  Yardım: [
    { label: "Yardım Merkezi",  href: "/yardim" },
    { label: "Sık Sorulan Sorular", href: "/sss" },
    { label: "Araç Talep Et",   href: "/talep", accent: true },
    { label: "Hata Bildir",     href: "/hata" },
  ],
  Yasal: [
    { label: "Gizlilik Politikası", href: "/gizlilik" },
    { label: "Kullanım Koşulları",  href: "/kosullar" },
    { label: "Çerez Politikası",    href: "/cerez" },
    { label: "KVKK Aydınlatma",     href: "/kvkk" },
    { label: "Lisanslar",           href: "/lisanslar" },
  ],
} as const;

const LANGUAGES = [
  { code: "TR", label: "Türkçe" },
  { code: "EN", label: "English" },
  { code: "DE", label: "Deutsch" },
  { code: "FR", label: "Français" },
  { code: "ES", label: "Español" },
];

export default function Footer() {
  const [langOpen, setLangOpen] = useState(false);
  const [lang,     setLang]     = useState("TR");

  useEffect(() => {
    const saved = localStorage.getItem("fj-lang");
    if (saved) setLang(saved);
    function onLang(e: Event) { setLang((e as CustomEvent<string>).detail); }
    window.addEventListener("fj-lang-change", onLang);
    return () => window.removeEventListener("fj-lang-change", onLang);
  }, []);

  function selectLang(code: string) {
    setLang(code);
    localStorage.setItem("fj-lang", code);
    window.dispatchEvent(new CustomEvent("fj-lang-change", { detail: code }));
    setLangOpen(false);
  }

  return (
    <footer style={{ background: "var(--color-navy)" }}>

      {/* ── CTA Kartları ── */}
      <div className="container pt-12 pb-8">
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          {/* Araç Talep Et */}
          <div
            className="flex items-center gap-4 px-6 py-5 rounded-2xl border"
            style={{ borderColor: "var(--color-navy-border)", background: "var(--color-navy-surface)" }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(59,130,246,0.15)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.8" strokeLinecap="round">
                <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold mb-0.5" style={{ color: "#FFFFFF" }}>İhtiyacın olan araç burada yok mu?</div>
              <div className="text-xs" style={{ color: "var(--color-navy-text)" }}>Önerini gönder, geliştirme listemize ekleyelim.</div>
            </div>
            <button className="px-4 py-2 text-sm font-medium rounded-xl border transition-colors shrink-0" style={{ borderColor: "#3B82F6", color: "#3B82F6" }}>
              Araç Talep Et
            </button>
          </div>

          {/* Destek Ol */}
          <div
            className="flex items-center gap-4 px-6 py-5 rounded-2xl"
            style={{ background: "#2563EB" }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.15)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold mb-0.5 text-white">Ücretsiz araçları birlikte büyütelim</div>
              <div className="text-xs text-blue-100">Desteğin, ücretsiz limitleri herkes için yükseltir.</div>
            </div>
            <button className="px-4 py-2 text-sm font-semibold rounded-xl shrink-0" style={{ background: "rgba(255,255,255,0.2)", color: "white" }}>
              Destek Ol
            </button>
          </div>
        </div>

        {/* ── Ana link kolonları ── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Logo + tagline */}
          <div className="col-span-2 md:col-span-1">
            <FooterLogo />
            <p className="text-sm mb-4" style={{ color: "var(--color-navy-text)", lineHeight: 1.6 }}>
              Dosyaları hızlı, güvenli ve kolayca dönüştür.
            </p>
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.8" strokeLinecap="round">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
              <span className="text-xs" style={{ color: "var(--color-navy-text)" }}>Dosyalar işlemden sonra otomatik silinir.</span>
            </div>
          </div>

          {/* Link kolonları */}
          {(Object.entries(LINKS) as [string, readonly { label: string; href: string; accent?: boolean }[]][]).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: "#FFFFFF" }}>{section}</h3>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors hover:text-white"
                      style={{ color: link.accent ? "#3B82F6" : "var(--color-navy-text)" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Alt çizgi ── */}
      <div style={{ borderTop: "1px solid var(--color-navy-border)" }}>
        <div className="container py-5 flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Dil seçici */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(v => !v)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm transition-colors"
              style={{ borderColor: "var(--color-navy-border)", color: "var(--color-navy-text)", background: "var(--color-navy-surface)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              {LANGUAGES.find(l => l.code === lang)?.label ?? "Türkçe"}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>
            {langOpen && (
              <div
                className="absolute bottom-full left-0 mb-2 w-36 rounded-xl border overflow-hidden z-50"
                style={{ background: "var(--color-navy-surface)", borderColor: "var(--color-navy-border)", boxShadow: "0 -8px 32px rgba(0,0,0,0.3)" }}
              >
                {LANGUAGES.map(l => (
                  <button
                    key={l.code}
                    onClick={() => selectLang(l.code)}
                    className="w-full text-left px-4 py-2.5 text-sm transition-colors"
                    style={{ color: l.code === lang ? "#3B82F6" : "var(--color-navy-text)" }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)")}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "")}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sistem durumu */}
          <div className="flex items-center gap-2 text-xs" style={{ color: "var(--color-navy-text)" }}>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
            Tüm sistemler çalışıyor
          </div>

          {/* Copyright */}
          <p className="text-xs" style={{ color: "var(--color-navy-text-2)" }}>
            © {new Date().getFullYear()} FormatJet. Tüm hakları saklıdır.
          </p>

          {/* Tema toggle (şimdilik dekoratif) */}
          <div className="flex items-center gap-1 px-1 py-1 rounded-xl border" style={{ borderColor: "var(--color-navy-border)", background: "var(--color-navy-surface)" }}>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white" style={{ background: "#2563EB" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
              Görünüm
            </button>
            <button className="p-1.5 rounded-lg transition-colors" style={{ color: "var(--color-navy-text)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
