"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  ALL_TOOLS, TOOLS_BY_CATEGORY, CATEGORY_META,
  searchTools, type ToolCategory, type Tool,
} from "@/data/tools";

/* ─────────────────────────────────────
   Usage Tracking (localStorage)
   Key: fj-usage  → { [toolId]: { total: number, byLang: { [lang]: number } } }
────────────────────────────────────── */
function getUsage(): Record<string, { total: number; byLang: Record<string, number> }> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem("fj-usage") || "{}"); } catch { return {}; }
}

function rankTools(tools: Tool[], lang: string): Tool[] {
  const usage = getUsage();
  return [...tools].sort((a, b) => {
    const ua = usage[a.id];
    const ub = usage[b.id];
    const scoreA = ua ? (ua.byLang[lang] ?? 0) * 2 + ua.total : 0;
    const scoreB = ub ? (ub.byLang[lang] ?? 0) * 2 + ub.total : 0;
    if (scoreB !== scoreA) return scoreB - scoreA;
    return (b.monthlySearches ?? 0) - (a.monthlySearches ?? 0);
  });
}

/* ─────────────────────────────────────
   Sabit araç ikonları (popüler kartlar)
────────────────────────────────────── */
function ToolIconSvg({ path, color, size = 26 }: { path: string; color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  );
}

/* ─────────────────────────────────────
   Popüler Araç Kartı (büyük, 3×2 grid)
────────────────────────────────────── */
function PopularCard({ tool }: { tool: Tool }) {
  const meta = CATEGORY_META[tool.category];
  return (
    <Link href={`/${tool.slug}`} className="popular-tool-card group">
      <div className="tool-icon" style={{ background: `${meta.color}14` }}>
        <ToolIconSvg path={tool.icon} color={meta.color} size={26} />
      </div>
      <div className="tool-info">
        <div className="tool-name">{tool.name}</div>
        <div className="tool-desc">{tool.description}</div>
      </div>
      <div className="arrow">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="m9 18 6-6-6-6"/>
        </svg>
      </div>
    </Link>
  );
}

/* ─────────────────────────────────────
   Mini araç kartı (kategori satırı)
────────────────────────────────────── */
function MiniCard({ tool }: { tool: Tool }) {
  const meta = CATEGORY_META[tool.category];
  return (
    <Link href={`/${tool.slug}`} className="tool-mini-card">
      <div className="icon-wrap" style={{ background: `${meta.color}14` }}>
        <ToolIconSvg path={tool.icon} color={meta.color} size={20} />
      </div>
      <span>{tool.name}</span>
    </Link>
  );
}

/* ─────────────────────────────────────
   Arama sonuç satırı
────────────────────────────────────── */
function SearchResultItem({ tool }: { tool: Tool }) {
  const meta = CATEGORY_META[tool.category];
  return (
    <Link href={`/${tool.slug}`} className="search-result-item group">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${meta.color}12` }}>
        <ToolIconSvg path={tool.icon} color={meta.color} size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>{tool.name}</div>
        <div className="text-xs truncate" style={{ color: "var(--color-text-2)" }}>{tool.description}</div>
      </div>
      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ color: meta.color, background: `${meta.color}12` }}>
        {meta.label}
      </span>
    </Link>
  );
}

/* ─────────────────────────────────────
   Kategori satırı
────────────────────────────────────── */
function CategoryRow({ category, lang }: { category: ToolCategory; lang: string }) {
  const meta  = CATEGORY_META[category];
  const tools = rankTools(TOOLS_BY_CATEGORY[category], lang);

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${meta.color}12` }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={meta.color} strokeWidth="2" strokeLinecap="round">
              <path d={CAT_ICONS[category]} />
            </svg>
          </div>
          <h2 className="text-base font-bold" style={{ color: "var(--color-text)" }}>
            {meta.label} Araçları
          </h2>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ color: "var(--color-text-3)", background: "var(--color-surface-2)" }}>
            {tools.length}
          </span>
        </div>
        <Link href="/araclar" className="text-sm font-medium hover:underline" style={{ color: "var(--color-accent)" }}>
          Tümünü Gör →
        </Link>
      </div>
      <div className="scroll-row">
        {tools.map(t => <MiniCard key={t.id} tool={t} />)}
      </div>
    </section>
  );
}

const CAT_ICONS: Record<ToolCategory, string> = {
  pdf:      "M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z",
  document: "M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  image:    "M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16m-2-2l1.586-1.586a2 2 0 0 1 2.828 0L20 14m-6-6h.01M6 20h12a2 2 0 0 1 2-2V6a2 2 0 0 1-2-2H6a2 2 0 0 1-2 2v12a2 2 0 0 1 2 2z",
  video:    "M15 10l4.553-2.069A1 1 0 0 1 21 8.87v6.26a1 1 0 0 1-1.447.899L15 14M5 18h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z",
  audio:    "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3",
};

const PLACEHOLDERS = [
  "Ne yapmak istiyorsun?",
  "PDF birleştir, sıkıştır, dönüştür...",
  "Arka plan kaldır, görsel sıkıştır...",
  "Video → MP3, MOV → MP4, WebM → MP4...",
  "Word → PDF, Excel → PDF, CSV → PDF...",
];

/* ─────────────────────────────────────
   ANA SAYFA
────────────────────────────────────── */
export default function HomePage() {
  const [query,      setQuery]      = useState("");
  const [searchMode, setSearchMode] = useState(false);
  const [phIdx,      setPhIdx]      = useState(0);
  const [lang,       setLang]       = useState("TR");
  const inputRef = useRef<HTMLInputElement>(null);

  /* Dil değişikliği dinle */
  useEffect(() => {
    const saved = localStorage.getItem("fj-lang");
    if (saved) setLang(saved);

    function onLang(e: Event) {
      setLang((e as CustomEvent<string>).detail);
    }
    window.addEventListener("fj-lang-change", onLang);
    return () => window.removeEventListener("fj-lang-change", onLang);
  }, []);

  /* Placeholder döngüsü */
  useEffect(() => {
    const t = setInterval(() => {
      if (!query) setPhIdx(i => (i + 1) % PLACEHOLDERS.length);
    }, 3500);
    return () => clearInterval(t);
  }, [query]);

  /* ESC tuşu */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && searchMode) {
        setQuery("");
        setSearchMode(false);
        inputRef.current?.blur();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [searchMode]);

  const searched = query.trim() ? searchTools(query) : null;

  function handleInput(v: string) {
    setQuery(v);
    setSearchMode(v.trim().length > 0);
  }

  function clearSearch() {
    setQuery("");
    setSearchMode(false);
    inputRef.current?.focus();
  }

  /* Popüler araçlar — dile ve usage'a göre sıralanmış top 6 */
  const popularTools = rankTools(
    ALL_TOOLS.filter(t => t.popular),
    lang,
  ).slice(0, 6);

  const categories = Object.keys(CATEGORY_META) as ToolCategory[];

  return (
    <div className="min-h-screen">

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="pt-16 pb-14">
        <div className="container">
          <div style={{ maxWidth: "720px", margin: "0 auto" }}>

            {/* Başlık bloğu */}
            {!searchMode && (
              <div className="hero-title-block mb-10" style={{ textAlign: "center" }}>
                <h1 style={{
                  fontSize: "clamp(2rem,4.5vw,2.8rem)",
                  fontWeight: 800,
                  color: "var(--color-text)",
                  lineHeight: 1.15,
                  letterSpacing: "-0.5px",
                  marginBottom: "12px",
                  textAlign: "center",
                }}>
                  Dosyan hazır. <span style={{ color: "var(--color-accent)" }}>Formatını değiştirelim.</span>
                </h1>
                <p style={{ fontSize: "16px", color: "var(--color-text-2)", maxWidth: "520px", margin: "0 auto", textAlign: "center", lineHeight: 1.6 }}>
                  PDF, belge, görsel, video ve ses dosyalarını hızlıca dönüştür.
                </p>
              </div>
            )}

            {/* Arama kutusu */}
            <div
              className="flex items-center gap-3 px-5 py-3.5 rounded-2xl border transition-all"
              style={{
                borderColor: searchMode ? "var(--color-accent)" : "var(--color-border)",
                background: "var(--color-bg)",
                boxShadow: searchMode ? "0 0 0 3px rgba(37,99,235,0.15), var(--shadow-card)" : "var(--shadow-card)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: searchMode ? "var(--color-accent)" : "var(--color-text-3)", flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => handleInput(e.target.value)}
                onFocus={() => query && setSearchMode(true)}
                placeholder={PLACEHOLDERS[phIdx]}
                style={{
                  flex: 1, background: "transparent",
                  fontSize: "15px", color: "var(--color-text)",
                  outline: "none", border: "none",
                }}
                className="placeholder:text-[var(--color-text-3)]"
              />
              {query && (
                <button onClick={clearSearch} style={{ color: "var(--color-text-3)", flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M18 6 6 18M6 6l12 12"/>
                  </svg>
                </button>
              )}
            </div>

            {/* Arama istatistikleri */}
            {searchMode && (
              <div className="flex items-center justify-between mt-3 px-1">
                <p className="text-sm" style={{ color: "var(--color-text-2)" }}>
                  <span className="font-semibold" style={{ color: "var(--color-text)" }}>{searched?.length ?? 0}</span>
                  {" "}araç bulundu — &ldquo;<span style={{ color: "var(--color-accent)" }}>{query}</span>&rdquo;
                </p>
                <button onClick={clearSearch} className="text-xs hover:underline" style={{ color: "var(--color-text-3)" }}>
                  Temizle ×
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════ ARAMA SONUÇLARI ═══════════════ */}
      {searchMode && (
        <section className="pb-20">
          <div className="container max-w-3xl mx-auto">
            {searched && searched.length > 0 ? (
              <div className="flex flex-col gap-2">
                {searched.map(tool => <SearchResultItem key={tool.id} tool={tool} />)}
              </div>
            ) : (
              <div className="text-center py-20">
                <p style={{ color: "var(--color-text-3)", fontSize: "15px" }}>
                  &ldquo;<span style={{ color: "var(--color-text-2)" }}>{query}</span>&rdquo; için araç bulunamadı
                </p>
                <button onClick={clearSearch} className="mt-4 text-sm hover:underline" style={{ color: "var(--color-accent)" }}>
                  Aramayı temizle
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ═══════════════ POPÜLER ARAÇLAR ═══════════════ */}
      {!searchMode && (
        <section className="popular-section pb-12">
          <div className="container">
            <h2 className="text-base font-bold mb-5" style={{ color: "var(--color-text)" }}>
              Popüler Araçlar
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {popularTools.map(tool => <PopularCard key={tool.id} tool={tool} />)}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════ KATEGORİ SATIRLARI ═══════════════ */}
      {!searchMode && (
        <section className="category-sections pb-8">
          <div className="container">
            {categories.map(cat => (
              <CategoryRow key={cat} category={cat} lang={lang} />
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════ ÖZELLİKLER ═══════════════ */}
      {!searchMode && (
        <section className="features-section border-t py-14" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                {
                  icon: "M13 10V3L4 14h7v7l9-11h-7z",
                  title: "Hızlı Dönüşüm",
                  desc: "Dosyaların en hızlı şekilde dönüştürülürüz.",
                },
                {
                  icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
                  title: "Güvenli ve Gizli",
                  desc: "Dosyalar güvende. Kimse erişemez, sadece sen görürsün.",
                },
                {
                  icon: "M3 15a4 4 0 0 0 4 4h9a5 5 0 1 0-.1-9.999 5.002 5.002 0 0 0-9.78 2.096A4.001 4.001 0 0 0 3 15z",
                  title: "Bulut Tabanlı",
                  desc: "Yükleme yap, dönüştür ve hemen indir.",
                },
                {
                  icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 0 0 1.946-.806 3.42 3.42 0 0 1 4.438 0 3.42 3.42 0 0 0 1.946.806 3.42 3.42 0 0 1 3.138 3.138 3.42 3.42 0 0 0 .806 1.946 3.42 3.42 0 0 1 0 4.438 3.42 3.42 0 0 0-.806 1.946 3.42 3.42 0 0 1-3.138 3.138 3.42 3.42 0 0 0-1.946.806 3.42 3.42 0 0 1-4.438 0 3.42 3.42 0 0 0-1.946-.806 3.42 3.42 0 0 1-3.138-3.138 3.42 3.42 0 0 0-.806-1.946 3.42 3.42 0 0 1 0-4.438 3.42 3.42 0 0 0 .806-1.946 3.42 3.42 0 0 1 3.138-3.138z",
                  title: "Tüm Cihazlarda",
                  desc: "İstediğin cihazdan, istediğin zaman kullan.",
                },
              ].map(f => (
                <div key={f.title} className="flex flex-col items-center text-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--color-accent-muted)" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d={f.icon} />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--color-text)" }}>{f.title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-2)" }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
