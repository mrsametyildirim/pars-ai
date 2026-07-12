"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { TOOLS_BY_CATEGORY, CATEGORY_META, type ToolCategory } from "@/data/tools";

/* ── FJ Logosu ── */
function FJLogo() {
  return (
    <Link href="/" className="flex items-center gap-2 select-none shrink-0">
      {/* FJ monogram SVG — sayfadan kopyalanan asıl logo stili */}
      <svg width="30" height="30" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* F harfi — koyu lacivert, eğimli çizgiler */}
        <g transform="rotate(-8, 50, 50)">
          <rect x="12" y="22" width="36" height="9" rx="4" fill="#0D1B2E"/>
          <rect x="12" y="35" width="26" height="8" rx="4" fill="#0D1B2E"/>
          <rect x="12" y="48" width="16" height="8" rx="4" fill="#0D1B2E"/>
          <rect x="12" y="61" width="36" height="9" rx="4" fill="#0D1B2E"/>
        </g>
        {/* J harfi — parlak mavi, sağ taraf */}
        <path d="M58 20 L58 65 Q58 82 45 82 L40 82" stroke="#2563EB" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M58 20 L78 20" stroke="#2563EB" strokeWidth="10" strokeLinecap="round" fill="none"/>
      </svg>
      <span style={{ fontSize: "17px", fontWeight: 700, letterSpacing: "-0.3px" }}>
        <span style={{ color: "#0D1B2E" }}>Format</span>
        <span style={{ color: "#2563EB" }}>Jet</span>
      </span>
    </Link>
  );
}

/* ── Dil seçici ── */
const LANGUAGES = [
  { code: "TR", label: "Türkçe" },
  { code: "EN", label: "English" },
  { code: "DE", label: "Deutsch" },
  { code: "FR", label: "Français" },
  { code: "ES", label: "Español" },
  { code: "IT", label: "Italiano" },
  { code: "RU", label: "Русский" },
  { code: "AR", label: "العربية" },
  { code: "PT", label: "Português" },
  { code: "ZH", label: "中文" },
];

function LanguageSelector() {
  const [open, setOpen]   = useState(false);
  const [lang, setLang]   = useState("TR");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("fj-lang");
    if (saved) setLang(saved);
  }, []);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  function select(code: string) {
    setLang(code);
    localStorage.setItem("fj-lang", code);
    window.dispatchEvent(new CustomEvent("fj-lang-change", { detail: code }));
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors"
        style={{ borderColor: "var(--color-border)", color: "var(--color-text-2)", background: "var(--color-bg)" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
        {lang}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>

      {open && (
        <div
          className="absolute top-full right-0 mt-1.5 w-40 rounded-xl border shadow-lg z-50 overflow-hidden"
          style={{ background: "var(--color-bg)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-menu)" }}
        >
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              onClick={() => select(l.code)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-[var(--color-surface)]"
              style={{ color: l.code === lang ? "var(--color-accent)" : "var(--color-text)" }}
            >
              {l.label}
              {l.code === lang && (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M20 6 9 17l-5-5"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Kategori dropdown (mega menu) ── */
const CAT_ICONS: Record<ToolCategory, string> = {
  pdf:      "M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z",
  document: "M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  image:    "M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16m-2-2l1.586-1.586a2 2 0 0 1 2.828 0L20 14m-6-6h.01M6 20h12a2 2 0 0 1 2-2V6a2 2 0 0 1-2-2H6a2 2 0 0 1-2 2v12a2 2 0 0 1 2 2z",
  video:    "M15 10l4.553-2.069A1 1 0 0 1 21 8.87v6.26a1 1 0 0 1-1.447.899L15 14M5 18h8a2 2 0 0 0 2-2V8a2 2 0 0-2-2H5a2 2 0 0-2 2v8a2 2 0 0 0 2 2z",
  audio:    "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3",
};

function CategoryDropdown({ category, isOpen, onClose }: { category: ToolCategory; isOpen: boolean; onClose: () => void }) {
  const tools  = TOOLS_BY_CATEGORY[category];
  const meta   = CATEGORY_META[category];
  const groups = [...new Set(tools.map(t => t.group))];

  if (!isOpen) return null;

  return (
    <div
      className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 w-[560px] rounded-2xl border shadow-lg mega-menu-enter z-50"
      style={{ background: "var(--color-bg)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-menu)" }}
      onMouseLeave={onClose}
    >
      {/* Başlık */}
      <div
        className="flex items-center gap-2.5 px-5 py-3.5 border-b"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${meta.color}14` }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={meta.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d={CAT_ICONS[category]} />
          </svg>
        </div>
        <span className="text-sm font-semibold" style={{ color: meta.color }}>{meta.label} Araçları</span>
        <span className="ml-auto text-xs" style={{ color: "var(--color-text-3)" }}>{tools.length} araç</span>
      </div>

      {/* Araç grupları */}
      <div className="p-3 grid grid-cols-2 gap-0.5">
        {groups.map(group => (
          <div key={group}>
            <div className="px-3 py-2 text-[10px] uppercase tracking-widest font-semibold" style={{ color: "var(--color-text-3)" }}>
              {group}
            </div>
            {tools.filter(t => t.group === group).slice(0, 6).map(tool => (
              <Link
                key={tool.id}
                href={`/${tool.slug}`}
                onClick={onClose}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors"
                style={{ color: "var(--color-text-2)" }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--color-surface)")}
                onMouseLeave={e => (e.currentTarget.style.background = "")}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={meta.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d={tool.icon} />
                </svg>
                <span className="truncate" style={{ color: "var(--color-text)" }}>{tool.name}</span>
                {tool.isNew && (
                  <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ color: "var(--color-accent)", background: "var(--color-accent-muted)" }}>
                    YENİ
                  </span>
                )}
              </Link>
            ))}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t px-5 py-3" style={{ borderColor: "var(--color-border)" }}>
        <Link href="/araclar" onClick={onClose} className="text-xs font-medium hover:underline" style={{ color: "var(--color-accent)" }}>
          Tüm {meta.label} araçlarını gör →
        </Link>
      </div>
    </div>
  );
}

/* ── Mobil menü ── */
function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const categories = Object.keys(CATEGORY_META) as ToolCategory[];
  const [expanded, setExpanded] = useState<ToolCategory | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative mt-auto rounded-t-2xl overflow-hidden max-h-[85vh] overflow-y-auto"
        style={{ background: "var(--color-bg)", borderTop: "1px solid var(--color-border)" }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--color-border)" }}>
          <FJLogo />
          <button onClick={onClose} style={{ color: "var(--color-text-2)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <nav className="p-3">
          {categories.map(cat => {
            const meta  = CATEGORY_META[cat];
            const tools = TOOLS_BY_CATEGORY[cat];
            const open  = expanded === cat;
            return (
              <div key={cat}>
                <button
                  onClick={() => setExpanded(open ? null : cat)}
                  className="w-full flex items-center gap-3 px-3 py-3.5 rounded-xl text-sm font-medium transition-colors"
                  style={{ color: "var(--color-text)" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--color-surface)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "")}
                >
                  <span style={{ color: meta.color }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d={CAT_ICONS[cat]} />
                    </svg>
                  </span>
                  <span>{meta.label}</span>
                  <span className="ml-2 text-xs" style={{ color: "var(--color-text-3)" }}>{tools.length}</span>
                  <svg className={`ml-auto transition-transform ${open ? "rotate-180" : ""}`}
                    width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </button>
                {open && (
                  <div className="pl-8 pb-1">
                    {tools.map(tool => (
                      <Link key={tool.id} href={`/${tool.slug}`} onClick={onClose}
                        className="flex items-center gap-2 py-2 text-sm"
                        style={{ color: "var(--color-text-2)" }}>
                        <span style={{ color: meta.color, fontSize: "8px" }}>●</span>
                        {tool.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t flex gap-2" style={{ borderColor: "var(--color-border)" }}>
          <button className="flex-1 py-2.5 text-sm font-medium rounded-xl border transition-colors"
            style={{ color: "var(--color-text-2)", borderColor: "var(--color-border)" }}>
            Giriş Yap
          </button>
          <button className="flex-1 py-2.5 text-sm font-semibold text-white rounded-xl transition-all"
            style={{ background: "var(--color-accent)" }}>
            Pro&apos;ya Geç
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ANA HEADER
   ═══════════════════════════════════════════════════ */
export default function Header() {
  const [openCat,    setOpenCat]    = useState<ToolCategory | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const categories = Object.keys(CATEGORY_META) as ToolCategory[];

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenCat(null);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <>
      <header
        className="sticky top-0 z-40 backdrop-blur-md"
        style={{ borderBottom: "1px solid var(--color-border)", background: "rgba(255,255,255,0.95)" }}
      >
        <div className="container">
          <div className="flex items-center h-14 gap-4">

            {/* Logo */}
            <FJLogo />

            {/* Desktop nav */}
            <nav ref={navRef} className="hidden md:flex items-center gap-0.5 relative ml-2">
              {categories.map(cat => {
                const meta   = CATEGORY_META[cat];
                const isOpen = openCat === cat;
                return (
                  <div key={cat} className="relative">
                    <button
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                      style={{
                        color: isOpen ? "var(--color-accent)" : "var(--color-text)",
                        background: isOpen ? "var(--color-accent-muted)" : "transparent",
                      }}
                      onMouseEnter={() => setOpenCat(cat)}
                      onClick={() => setOpenCat(isOpen ? null : cat)}
                    >
                      {meta.label}
                      <svg
                        className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                        width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                      >
                        <path d="m6 9 6 6 6-6"/>
                      </svg>
                    </button>

                    <CategoryDropdown category={cat} isOpen={isOpen} onClose={() => setOpenCat(null)} />
                  </div>
                );
              })}

              {/* Tüm Araçlar pill */}
              <Link
                href="/araclar"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ml-1"
                style={{ color: "var(--color-text)", borderColor: "var(--color-border)", background: "var(--color-surface)" }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                </svg>
                Tüm Araçlar
              </Link>
            </nav>

            {/* Sağ blok */}
            <div className="ml-auto flex items-center gap-2">
              {/* Dil seçici */}
              <div className="hidden md:block">
                <LanguageSelector />
              </div>

              {/* Giriş Yap */}
              <button
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors"
                style={{ color: "var(--color-text-2)" }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text)";
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--color-surface)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-2)";
                  (e.currentTarget as HTMLButtonElement).style.background = "";
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                Giriş Yap
              </button>

              {/* Destek Ol */}
              <button
                className="hidden md:flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold text-white rounded-lg transition-all"
                style={{ background: "var(--color-accent)" }}
                onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = "var(--color-accent-hover)")}
                onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = "var(--color-accent)")}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                Destek Ol
              </button>

              {/* Hamburger */}
              <button
                className="md:hidden p-2 rounded-lg transition-colors"
                style={{ color: "var(--color-text-2)" }}
                onClick={() => setMobileOpen(true)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
