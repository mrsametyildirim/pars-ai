"use client";

import { useState } from "react";
import type { Metadata } from "next";
import { ALL_TOOLS, TOOLS_BY_CATEGORY, CATEGORY_META, searchTools, type ToolCategory } from "@/data/tools";
import ToolCard from "@/components/tools/ToolCard";

const categories = Object.keys(CATEGORY_META) as ToolCategory[];

export default function AraclarPage() {
  const [query,     setQuery]     = useState("");
  const [activeTab, setActiveTab] = useState<"all" | ToolCategory>("all");

  const searched = query.trim() ? searchTools(query) : null;

  const displayTools = searched
    ? searched
    : activeTab === "all"
      ? ALL_TOOLS
      : TOOLS_BY_CATEGORY[activeTab];

  return (
    <div className="min-h-screen py-10">
      <div className="container">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-medium text-[var(--color-text)] mb-2">
            Tüm Araçlar
          </h1>
          <p style={{ color: "var(--color-text-2)" }} className="text-sm">
            PDF, belge, görsel, video ve ses için {ALL_TOOLS.length}+ araç — ücretsiz ve tarayıcıda çalışır
          </p>
        </div>

        {/* Arama + filtre */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Arama */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] flex-1 max-w-md">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: "var(--color-text-3)" }}>
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Araç ara..."
              className="bg-transparent text-sm flex-1 outline-none"
              style={{ color: "var(--color-text)" }}
            />
            {query && (
              <button onClick={() => setQuery("")} style={{ color: "var(--color-text-3)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Kategori filtreleri */}
          <div className="flex items-center gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab("all")}
              className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all"
              style={{
                background: activeTab === "all" ? "var(--color-accent)" : "var(--color-surface)",
                color: activeTab === "all" ? "#fff" : "var(--color-text-2)",
                border: `1px solid ${activeTab === "all" ? "var(--color-accent)" : "var(--color-border)"}`,
              }}
            >
              Tümü ({ALL_TOOLS.length})
            </button>
            {categories.map(cat => {
              const meta = CATEGORY_META[cat];
              const count = TOOLS_BY_CATEGORY[cat].length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all"
                  style={{
                    background: activeTab === cat ? `${meta.color}20` : "var(--color-surface)",
                    color: activeTab === cat ? meta.color : "var(--color-text-2)",
                    border: `1px solid ${activeTab === cat ? meta.color : "var(--color-border)"}`,
                  }}
                >
                  {meta.label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Arama sonucu bilgisi */}
        {searched && (
          <p className="mb-4 text-sm" style={{ color: "var(--color-text-2)" }}>
            <span className="font-semibold" style={{ color: "var(--color-text)" }}>{searched.length}</span> araç bulundu
            {" "}&mdash; &ldquo;<span style={{ color: "var(--color-accent)" }}>{query}</span>&rdquo;
          </p>
        )}

        {/* Kategori gruplu görünüm — arama yoksa */}
        {!searched && activeTab === "all" ? (
          <div className="space-y-10">
            {categories.map(cat => {
              const meta  = CATEGORY_META[cat];
              const tools = TOOLS_BY_CATEGORY[cat];
              return (
                <div key={cat}>
                  {/* Kategori başlığı */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-base font-semibold" style={{ color: meta.color }}>
                      {meta.label} Araçları
                    </span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded-full border" style={{ color: "var(--color-text-3)", borderColor: "var(--color-border)" }}>
                      {tools.length} araç
                    </span>
                    <div className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
                    <a href={`/${cat}`} className="text-xs hover:underline" style={{ color: "var(--color-text-3)" }}>
                      Kategori sayfası →
                    </a>
                  </div>

                  {/* Araçlar */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                    {tools.map(tool => (
                      <ToolCard key={tool.id} tool={tool} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Düz grid — kategori filtreli veya arama sonuçları */
          displayTools.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {displayTools.map(tool => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-sm mb-3" style={{ color: "var(--color-text-3)" }}>
                &ldquo;<span style={{ color: "var(--color-text-2)" }}>{query}</span>&rdquo; için sonuç bulunamadı
              </p>
              <button onClick={() => setQuery("")} className="text-sm hover:underline" style={{ color: "var(--color-accent)" }}>
                Aramayı temizle
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}
